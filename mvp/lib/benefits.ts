export interface BenefitProgram {
  id: string;
  name: string;
  nameEs: string;
  namePt: string;
  description: string;
  descriptionEs: string;
  descriptionPt: string;
  category: "food" | "health" | "housing" | "energy" | "workforce" | "family";
  annualValue: { min: number; max: number };
  icon: string;
  eligibility: (h: Household) => boolean;
  details: string;
  detailsEs: string;
  detailsPt: string;
  applyUrl: string;
}

export interface Household {
  size: number;
  monthlyIncome: number;
  hasChildren: boolean;
  childrenAges: number[];
  hasElders: boolean;
  isRenter: boolean;
  isEmployed: boolean;
  needsHealthcare: boolean;
  language: string;
}

const FPL_2025: Record<number, number> = {
  1: 15650, 2: 21150, 3: 26650, 4: 32150,
  5: 37650, 6: 43150, 7: 48650, 8: 54150,
};

function getFPL(size: number): number {
  if (size <= 8) return FPL_2025[size];
  return FPL_2025[8] + (size - 8) * 5500;
}

export const BENEFIT_PROGRAMS: BenefitProgram[] = [
  {
    id: "snap",
    name: "SNAP (Food Assistance)",
    nameEs: "SNAP (Asistencia Alimentaria)",
    namePt: "SNAP (Assistência Alimentar)",
    description: "Monthly funds loaded onto an EBT card for groceries. New Bedford families can use SNAP at Market Basket, Stop & Shop, and local stores.",
    descriptionEs: "Fondos mensuales cargados en una tarjeta EBT para compras de alimentos. Las familias de New Bedford pueden usar SNAP en Market Basket, Stop & Shop y tiendas locales.",
    descriptionPt: "Fundos mensais carregados num cartão EBT para compras de alimentos. As famílias de New Bedford podem usar o SNAP no Market Basket, Stop & Shop e lojas locais.",
    category: "food",
    annualValue: { min: 2400, max: 9600 },
    icon: "🛒",
    eligibility: (h) => h.monthlyIncome * 12 <= getFPL(h.size) * 2,
    details: "Gross income must be at or below 200% of the Federal Poverty Level. Net income must be at or below 100% FPL. Most assets are not counted.",
    detailsEs: "El ingreso bruto debe estar en o por debajo del 200% del nivel federal de pobreza. El ingreso neto debe estar en o por debajo del 100% FPL.",
    detailsPt: "O rendimento bruto deve estar no ou abaixo de 200% do nível federal de pobreza. O rendimento líquido deve estar no ou abaixo de 100% FPL.",
    applyUrl: "https://dtaconnect.eohhs.mass.gov/",
  },
  {
    id: "hip",
    name: "HIP (Healthy Incentives Program)",
    nameEs: "HIP (Programa de Incentivos Saludables)",
    namePt: "HIP (Programa de Incentivos Saudáveis)",
    description: "Doubles your SNAP dollars when you buy fruits and vegetables from local farms. Use at New Bedford Farmers Market and Brooklawn Farm Stand.",
    descriptionEs: "Duplica sus dólares SNAP cuando compra frutas y verduras en granjas locales. Úselo en el Mercado de Agricultores de New Bedford.",
    descriptionPt: "Duplica os seus dólares SNAP quando compra frutas e legumes em quintas locais. Use no Mercado de Agricultores de New Bedford.",
    category: "food",
    annualValue: { min: 240, max: 240 },
    icon: "🥬",
    eligibility: (h) => h.monthlyIncome * 12 <= getFPL(h.size) * 2,
    details: "Automatic for SNAP recipients. $20/month loaded when you buy produce at participating HIP vendors.",
    detailsEs: "Automático para beneficiarios de SNAP. $20/mes cargados cuando compra productos en vendedores HIP participantes.",
    detailsPt: "Automático para beneficiários do SNAP. $20/mês carregados quando compra produtos em vendedores HIP participantes.",
    applyUrl: "https://www.mass.gov/hip",
  },
  {
    id: "masshealth",
    name: "MassHealth (Healthcare Coverage)",
    nameEs: "MassHealth (Cobertura de Salud)",
    namePt: "MassHealth (Cobertura de Saúde)",
    description: "Free or low-cost health insurance. Covers doctor visits, prescriptions, mental health, dental, and more. Available at Greater New Bedford Community Health Center.",
    descriptionEs: "Seguro de salud gratuito o de bajo costo. Cubre visitas médicas, recetas, salud mental, dental y más.",
    descriptionPt: "Seguro de saúde gratuito ou de baixo custo. Cobre consultas médicas, receitas, saúde mental, dentária e mais.",
    category: "health",
    annualValue: { min: 4000, max: 12000 },
    icon: "🏥",
    eligibility: (h) => h.monthlyIncome * 12 <= getFPL(h.size) * 3 && h.needsHealthcare,
    details: "Income up to 300% FPL for most categories. Children qualify up to 300% FPL. Pregnant women qualify up to 200% FPL.",
    detailsEs: "Ingresos hasta 300% FPL para la mayoría de las categorías. Los niños califican hasta 300% FPL.",
    detailsPt: "Rendimento até 300% FPL para a maioria das categorias. As crianças qualificam até 300% FPL.",
    applyUrl: "https://www.mahealthconnector.org/",
  },
  {
    id: "liheap",
    name: "LIHEAP (Heating Assistance)",
    nameEs: "LIHEAP (Asistencia para Calefacción)",
    namePt: "LIHEAP (Assistência de Aquecimento)",
    description: "Helps pay heating bills during winter. Applications open November 1. Administered by PACE/CEDC in New Bedford.",
    descriptionEs: "Ayuda a pagar las facturas de calefacción durante el invierno. Las solicitudes abren el 1 de noviembre.",
    descriptionPt: "Ajuda a pagar as contas de aquecimento durante o inverno. As candidaturas abrem a 1 de novembro.",
    category: "energy",
    annualValue: { min: 800, max: 1800 },
    icon: "🔥",
    eligibility: (h) => h.monthlyIncome * 12 <= getFPL(h.size) * 1.5,
    details: "Income at or below 150% FPL. Benefit amount based on income, household size, heating type, and energy costs.",
    detailsEs: "Ingresos en o por debajo del 150% FPL. Monto del beneficio basado en ingresos, tamaño del hogar, tipo de calefacción.",
    detailsPt: "Rendimento no ou abaixo de 150% FPL. Montante do benefício baseado no rendimento, tamanho do agregado familiar, tipo de aquecimento.",
    applyUrl: "https://www.mass.gov/liheap",
  },
  {
    id: "wic",
    name: "WIC (Women, Infants & Children)",
    nameEs: "WIC (Mujeres, Infantes y Niños)",
    namePt: "WIC (Mulheres, Bebés e Crianças)",
    description: "Nutrition support for pregnant/postpartum women and children under 5. Provides food vouchers, nutrition education, and breastfeeding support.",
    descriptionEs: "Apoyo nutricional para mujeres embarazadas/posparto y niños menores de 5 años. Proporciona vales de alimentos y educación nutricional.",
    descriptionPt: "Apoio nutricional para mulheres grávidas/pós-parto e crianças com menos de 5 anos. Fornece vales de alimentos e educação nutricional.",
    category: "family",
    annualValue: { min: 600, max: 1200 },
    icon: "👶",
    eligibility: (h) => h.hasChildren && h.childrenAges.some(a => a < 5) && h.monthlyIncome * 12 <= getFPL(h.size) * 1.85,
    details: "Income at or below 185% FPL. For pregnant/postpartum women and children under age 5.",
    detailsEs: "Ingresos en o por debajo del 185% FPL. Para mujeres embarazadas/posparto y niños menores de 5 años.",
    detailsPt: "Rendimento no ou abaixo de 185% FPL. Para mulheres grávidas/pós-parto e crianças com menos de 5 anos.",
    applyUrl: "https://www.mass.gov/wic",
  },
  {
    id: "school_meals",
    name: "Free School Meals",
    nameEs: "Comidas Escolares Gratuitas",
    namePt: "Refeições Escolares Gratuitas",
    description: "Free breakfast and lunch for all students in New Bedford Public Schools. No application needed — all NBPS students qualify.",
    descriptionEs: "Desayuno y almuerzo gratuitos para todos los estudiantes de las Escuelas Públicas de New Bedford. No se necesita solicitud.",
    descriptionPt: "Pequeno-almoço e almoço gratuitos para todos os alunos das Escolas Públicas de New Bedford. Não é necessária candidatura.",
    category: "food",
    annualValue: { min: 2000, max: 3000 },
    icon: "🍎",
    eligibility: (h) => h.hasChildren && h.childrenAges.some(a => a >= 5 && a <= 18),
    details: "Massachusetts provides free school meals to all public school students regardless of income (universal free meals program).",
    detailsEs: "Massachusetts proporciona comidas escolares gratuitas a todos los estudiantes de escuelas públicas independientemente de los ingresos.",
    detailsPt: "Massachusetts fornece refeições escolares gratuitas a todos os alunos das escolas públicas, independentemente do rendimento.",
    applyUrl: "https://www.newbedfordschools.org/",
  },
  {
    id: "housing",
    name: "Affordable Housing Waitlists",
    nameEs: "Listas de Espera de Vivienda Asequible",
    namePt: "Listas de Espera de Habitação Acessível",
    description: "Multiple affordable housing developments in New Bedford are accepting applications. Rents are based on 30% of your income.",
    descriptionEs: "Múltiples desarrollos de vivienda asequible en New Bedford están aceptando solicitudes. Los alquileres se basan en el 30% de sus ingresos.",
    descriptionPt: "Vários empreendimentos de habitação acessível em New Bedford estão a aceitar candidaturas. As rendas baseiam-se em 30% do seu rendimento.",
    category: "housing",
    annualValue: { min: 3000, max: 8000 },
    icon: "🏠",
    eligibility: (h) => h.isRenter && h.monthlyIncome * 12 <= getFPL(h.size) * 2.5,
    details: "Income limits vary by development but generally up to 60-80% of Area Median Income. New Bedford AMI for a family of 4: ~$98,500.",
    detailsEs: "Los límites de ingresos varían por desarrollo pero generalmente hasta 60-80% del Ingreso Medio del Área.",
    detailsPt: "Os limites de rendimento variam por empreendimento, mas geralmente até 60-80% do Rendimento Mediano da Área.",
    applyUrl: "https://www.newbedford-ma.gov/community-development/",
  },
  {
    id: "workforce",
    name: "Free Job Training Programs",
    nameEs: "Programas de Capacitación Laboral Gratuitos",
    namePt: "Programas de Formação Profissional Gratuitos",
    description: "Free training in advanced manufacturing, marine technology, offshore wind, and more through MassHire Greater New Bedford and Bristol Community College.",
    descriptionEs: "Capacitación gratuita en manufactura avanzada, tecnología marina, energía eólica marina y más a través de MassHire.",
    descriptionPt: "Formação gratuita em fabrico avançado, tecnologia marítima, energia eólica offshore e mais através do MassHire.",
    category: "workforce",
    annualValue: { min: 5000, max: 15000 },
    icon: "🔧",
    eligibility: (h) => !h.isEmployed || h.monthlyIncome * 12 <= getFPL(h.size) * 2,
    details: "Available to unemployed, underemployed, and low-income residents. Programs include Advanced Manufacturing (104 hrs), Boat/Marine Tech, Industrial Robotics, and Offshore Wind certifications.",
    detailsEs: "Disponible para residentes desempleados, subempleados y de bajos ingresos. Los programas incluyen Manufactura Avanzada, Tecnología Marina, Robótica Industrial.",
    detailsPt: "Disponível para residentes desempregados, subempregados e de baixo rendimento. Os programas incluem Fabrico Avançado, Tecnologia Marítima, Robótica Industrial.",
    applyUrl: "https://masshiregreaternewbedford.com/",
  },
];

export function screenEligibility(household: Household): BenefitProgram[] {
  return BENEFIT_PROGRAMS.filter((p) => p.eligibility(household));
}

export function estimateAnnualValue(programs: BenefitProgram[]): number {
  return programs.reduce((sum, p) => sum + (p.annualValue.min + p.annualValue.max) / 2, 0);
}

export const NB_NEIGHBORHOODS = [
  "North End", "South End", "West End", "Near North", "Far North",
  "Acushnet Heights", "Brooklawn", "Bullard Street", "Buttonwood",
  "Clark's Point", "Cove Street", "Downtown", "Fairhaven Bridge",
  "Fort Taber", "Howland Green", "Nashawena", "Sassaquin",
] as const;
