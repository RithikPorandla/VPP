import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function GET() {
  const invoices = await prisma.invoice.findMany({
    include: { client: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(invoices);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const invoice = await prisma.invoice.create({
    data: {
      clientId: body.clientId,
      amount: parseFloat(body.amount),
      status: "draft",
      dueDate: new Date(body.dueDate),
      lineItems: JSON.stringify(body.lineItems || []),
    },
  });

  const stripe = getStripe();
  if (stripe) {
    const client = await prisma.client.findUnique({ where: { id: body.clientId } });
    if (client) {
      try {
        const customer = await stripe.customers.create({
          email: client.contactEmail,
          name: client.name,
          metadata: { agentOsClientId: client.id },
        });

        const stripeInvoice = await stripe.invoices.create({
          customer: customer.id,
          collection_method: "send_invoice",
          days_until_due: Math.max(
            1,
            Math.ceil((new Date(body.dueDate).getTime() - Date.now()) / 86400000)
          ),
          metadata: { agentOsInvoiceId: invoice.id, clientId: client.id },
        });

        for (const item of body.lineItems || []) {
          await stripe.invoiceItems.create({
            customer: customer.id,
            invoice: stripeInvoice.id,
            amount: Math.round(item.amount * 100),
            currency: "usd",
            description: item.description,
          });
        }

        return NextResponse.json(
          { ...invoice, stripeInvoiceId: stripeInvoice.id },
          { status: 201 }
        );
      } catch (err: any) {
        return NextResponse.json(
          { ...invoice, stripeError: err.message },
          { status: 201 }
        );
      }
    }
  }

  return NextResponse.json(invoice, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const invoice = await prisma.invoice.update({
    where: { id: body.id },
    data: {
      status: body.status,
      paidAt: body.status === "paid" ? new Date() : undefined,
    },
  });
  return NextResponse.json(invoice);
}
