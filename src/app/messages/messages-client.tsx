"use client";

import { PageHeader } from "@/components/page-header";
import { Modal } from "@/components/modal";
import { getInitials, timeAgo } from "@/lib/utils";
import {
  Mail,
  MessageSquare,
  ArrowDownLeft,
  ArrowUpRight,
  Smile,
  Meh,
  Frown,
  ListChecks,
  Hash,
} from "lucide-react";
import { useState, useCallback, useEffect } from "react";

interface Props {
  messages: any[];
}

export function MessagesClient({ messages: initial }: Props) {
  const [messages, setMessages] = useState(initial);
  const [filter, setFilter] = useState("all");
  const [selectedClient, setSelectedClient] = useState("all");
  const [showCompose, setShowCompose] = useState(false);
  const [saving, setSaving] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [composeForm, setComposeForm] = useState({
    clientId: "",
    channel: "email",
    subject: "",
    body: "",
  });

  const messageClients = Array.from(
    new Map(messages.map((m) => [m.clientId, m.client])).values()
  );

  useEffect(() => {
    fetch("/api/clients")
      .then((r) => r.json())
      .then(setClients);
  }, []);

  const refreshMessages = useCallback(async () => {
    const res = await fetch("/api/messages");
    setMessages(await res.json());
  }, []);

  const filtered = messages
    .filter((m) => filter === "all" || m.direction === filter)
    .filter((m) => selectedClient === "all" || m.clientId === selectedClient);

  const inboundCount = messages.filter((m) => m.direction === "inbound").length;
  const outboundCount = messages.filter((m) => m.direction === "outbound").length;

  const getSentimentIcon = (sentiment: number | null) => {
    if (sentiment === null) return null;
    if (sentiment >= 0.7) return <Smile className="h-4 w-4 text-emerald-500" />;
    if (sentiment >= 0.4) return <Meh className="h-4 w-4 text-amber-500" />;
    return <Frown className="h-4 w-4 text-red-500" />;
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "email":
        return <Mail className="h-3.5 w-3.5" />;
      case "slack":
        return <Hash className="h-3.5 w-3.5" />;
      default:
        return <MessageSquare className="h-3.5 w-3.5" />;
    }
  };

  const handleSend = async () => {
    setSaving(true);
    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(composeForm),
      });
      await refreshMessages();
      setShowCompose(false);
      setComposeForm({ clientId: "", channel: "email", subject: "", body: "" });
    } finally {
      setSaving(false);
    }
  };

  const sentimentMessages = messages.filter((m) => m.sentiment !== null);
  const avgSentiment =
    sentimentMessages.length > 0
      ? sentimentMessages.reduce((s, m) => s + m.sentiment, 0) / sentimentMessages.length
      : 0;

  return (
    <div className="p-8 space-y-8">
      <PageHeader
        title="Client Communication"
        description="AI-assisted messaging with sentiment analysis and action item extraction"
        actions={
          <button
            onClick={() => setShowCompose(true)}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700"
          >
            Compose
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm font-medium text-gray-500">Inbound</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{inboundCount}</p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-blue-600">
            <ArrowDownLeft className="h-3.5 w-3.5" />
            From clients
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm font-medium text-gray-500">Outbound</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{outboundCount}</p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600">
            <ArrowUpRight className="h-3.5 w-3.5" />
            Sent by you / AI
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm font-medium text-gray-500">Avg Sentiment</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {avgSentiment.toFixed(2)}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
            <Smile className="h-3.5 w-3.5 text-emerald-500" />
            Across all messages
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          {["all", "inbound", "outbound"].map((dir) => (
            <button
              key={dir}
              onClick={() => setFilter(dir)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                filter === dir
                  ? "bg-primary-100 text-primary-700"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {dir.charAt(0).toUpperCase() + dir.slice(1)}
            </button>
          ))}
        </div>
        <select
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
        >
          <option value="all">All Clients</option>
          {messageClients.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {filtered.map((msg) => {
          const actionItems = (() => {
            try {
              return JSON.parse(msg.actionItems || "[]");
            } catch {
              return [];
            }
          })();

          return (
            <div
              key={msg.id}
              className={`rounded-xl border bg-white p-5 transition-all hover:shadow-sm ${
                msg.direction === "inbound"
                  ? "border-gray-200"
                  : "border-primary-100"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                      msg.direction === "inbound"
                        ? "bg-gray-100 text-gray-600"
                        : "bg-primary-100 text-primary-700"
                    }`}
                  >
                    {msg.direction === "inbound"
                      ? getInitials(msg.client.contactName)
                      : "JD"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        {msg.direction === "inbound"
                          ? msg.client.contactName
                          : "You"}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                          msg.direction === "inbound"
                            ? "bg-blue-50 text-blue-600"
                            : "bg-emerald-50 text-emerald-600"
                        }`}
                      >
                        {msg.direction === "inbound" ? (
                          <ArrowDownLeft className="h-3 w-3" />
                        ) : (
                          <ArrowUpRight className="h-3 w-3" />
                        )}
                        {msg.direction}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                        {getChannelIcon(msg.channel)}
                        {msg.channel}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{msg.client.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {msg.sentiment !== null && (
                    <div className="flex items-center gap-1.5">
                      {getSentimentIcon(msg.sentiment)}
                      <span className="text-xs font-medium text-gray-500">
                        {(msg.sentiment * 100).toFixed(0)}%
                      </span>
                    </div>
                  )}
                  <span className="text-xs text-gray-400">
                    {timeAgo(msg.createdAt)}
                  </span>
                </div>
              </div>

              {msg.subject && (
                <h4 className="mt-3 text-sm font-semibold text-gray-800">
                  {msg.subject}
                </h4>
              )}

              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                {msg.body}
              </p>

              {actionItems.length > 0 && (
                <div className="mt-4 rounded-lg bg-primary-50 p-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-primary-700 mb-2">
                    <ListChecks className="h-3.5 w-3.5" />
                    Extracted Action Items
                  </div>
                  <ul className="space-y-1">
                    {actionItems.map((item: string, i: number) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-primary-600"
                      >
                        <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-primary-200 text-[10px] font-bold text-primary-700">
                          {i + 1}
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Modal
        open={showCompose}
        onClose={() => setShowCompose(false)}
        title="Compose Message"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Client</label>
              <select
                value={composeForm.clientId}
                onChange={(e) =>
                  setComposeForm((prev) => ({ ...prev, clientId: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">Select client...</option>
                {clients.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Channel</label>
              <select
                value={composeForm.channel}
                onChange={(e) =>
                  setComposeForm((prev) => ({ ...prev, channel: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="email">Email</option>
                <option value="slack">Slack</option>
                <option value="portal">Portal</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              value={composeForm.subject}
              onChange={(e) =>
                setComposeForm((prev) => ({ ...prev, subject: e.target.value }))
              }
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="Message subject..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              value={composeForm.body}
              onChange={(e) =>
                setComposeForm((prev) => ({ ...prev, body: e.target.value }))
              }
              rows={5}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="Type your message..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => setShowCompose(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={saving || !composeForm.clientId || !composeForm.body}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 disabled:opacity-50"
            >
              {saving ? "Sending..." : "Send Message"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
