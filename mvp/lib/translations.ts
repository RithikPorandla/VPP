export type Lang = "en" | "pt" | "es";

export const T: Record<string, Record<Lang, string>> = {
  appName: {
    en: "NB Connect",
    pt: "NB Connect",
    es: "NB Connect",
  },
  tagline: {
    en: "New Bedford's Civic Intelligence Platform",
    pt: "Plataforma de Inteligência Cívica de New Bedford",
    es: "Plataforma de Inteligencia Cívica de New Bedford",
  },
  heroTitle: {
    en: "Every New Bedford family deserves to know what they qualify for.",
    pt: "Todas as famílias de New Bedford merecem saber a que têm direito.",
    es: "Cada familia de New Bedford merece saber para qué califica.",
  },
  heroSubtitle: {
    en: "Millions in federal and state benefits go unclaimed every year. We find what you're eligible for — in your language, on your terms.",
    pt: "Milhões em benefícios federais e estaduais ficam por reclamar todos os anos. Encontramos aquilo a que tem direito — na sua língua, nas suas condições.",
    es: "Millones en beneficios federales y estatales quedan sin reclamar cada año. Encontramos para qué es elegible — en su idioma, en sus términos.",
  },
  checkEligibility: {
    en: "Check My Eligibility",
    pt: "Verificar Elegibilidade",
    es: "Verificar Elegibilidad",
  },
  cityDashboard: {
    en: "City Dashboard",
    pt: "Painel da Cidade",
    es: "Panel de la Ciudad",
  },
  step1Title: {
    en: "How many people live in your household?",
    pt: "Quantas pessoas vivem no seu agregado familiar?",
    es: "¿Cuántas personas viven en su hogar?",
  },
  step2Title: {
    en: "What is your household's total monthly income (before taxes)?",
    pt: "Qual é o rendimento mensal total do seu agregado familiar (antes de impostos)?",
    es: "¿Cuál es el ingreso mensual total de su hogar (antes de impuestos)?",
  },
  step3Title: {
    en: "Do you have children? If so, what are their ages?",
    pt: "Tem filhos? Se sim, quais são as suas idades?",
    es: "¿Tiene hijos? Si es así, ¿cuáles son sus edades?",
  },
  step4Title: {
    en: "Tell us about your household",
    pt: "Fale-nos sobre o seu agregado familiar",
    es: "Cuéntenos sobre su hogar",
  },
  iRent: {
    en: "I rent my home",
    pt: "Alugo a minha casa",
    es: "Alquilo mi hogar",
  },
  needHealthcare: {
    en: "I need health insurance",
    pt: "Preciso de seguro de saúde",
    es: "Necesito seguro de salud",
  },
  isEmployed: {
    en: "I am currently employed",
    pt: "Estou atualmente empregado",
    es: "Estoy actualmente empleado",
  },
  hasElders: {
    en: "Someone in my household is 65 or older",
    pt: "Alguém no meu agregado familiar tem 65 anos ou mais",
    es: "Alguien en mi hogar tiene 65 años o más",
  },
  noChildren: {
    en: "No children",
    pt: "Sem filhos",
    es: "Sin hijos",
  },
  addChild: {
    en: "Add a child",
    pt: "Adicionar um filho",
    es: "Agregar un hijo",
  },
  childAge: {
    en: "Child's age",
    pt: "Idade da criança",
    es: "Edad del niño",
  },
  next: {
    en: "Next",
    pt: "Próximo",
    es: "Siguiente",
  },
  back: {
    en: "Back",
    pt: "Voltar",
    es: "Atrás",
  },
  seeResults: {
    en: "See My Results",
    pt: "Ver Resultados",
    es: "Ver Resultados",
  },
  resultsTitle: {
    en: "Here's what your household may qualify for",
    pt: "Eis aquilo a que o seu agregado familiar pode ter direito",
    es: "Esto es para lo que su hogar puede calificar",
  },
  estimatedAnnual: {
    en: "Estimated annual value",
    pt: "Valor anual estimado",
    es: "Valor anual estimado",
  },
  totalEstimated: {
    en: "Total estimated annual benefits",
    pt: "Total de benefícios anuais estimados",
    es: "Total de beneficios anuales estimados",
  },
  getHelp: {
    en: "Get Help Applying",
    pt: "Obter Ajuda para Candidatar",
    es: "Obtener Ayuda para Solicitar",
  },
  howContact: {
    en: "How would you like us to reach you?",
    pt: "Como gostaria que o contactássemos?",
    es: "¿Cómo le gustaría que lo contactemos?",
  },
  sms: { en: "Text message (SMS)", pt: "Mensagem de texto (SMS)", es: "Mensaje de texto (SMS)" },
  whatsapp: { en: "WhatsApp", pt: "WhatsApp", es: "WhatsApp" },
  phone: { en: "Phone call", pt: "Chamada telefónica", es: "Llamada telefónica" },
  inPerson: { en: "In-person at a community center", pt: "Presencialmente num centro comunitário", es: "En persona en un centro comunitario" },
  submitted: {
    en: "We'll reach out within 48 hours to help you apply. A community navigator who speaks your language will guide you through every step.",
    pt: "Entraremos em contacto dentro de 48 horas para o ajudar a candidatar-se. Um navegador comunitário que fala a sua língua irá guiá-lo em cada passo.",
    es: "Nos comunicaremos dentro de 48 horas para ayudarlo a solicitar. Un navegador comunitario que habla su idioma lo guiará en cada paso.",
  },
  perYear: { en: "/year", pt: "/ano", es: "/año" },
  people: { en: "people", pt: "pessoas", es: "personas" },
  person: { en: "person", pt: "pessoa", es: "persona" },
  monthlyIncome: { en: "Monthly income", pt: "Rendimento mensal", es: "Ingreso mensual" },
  privacyNote: {
    en: "Your information is private and secure. We never share individual data with immigration authorities or any third party.",
    pt: "As suas informações são privadas e seguras. Nunca partilhamos dados individuais com autoridades de imigração ou terceiros.",
    es: "Su información es privada y segura. Nunca compartimos datos individuales con autoridades de inmigración ni con terceros.",
  },
  startOver: { en: "Start Over", pt: "Recomeçar", es: "Empezar de Nuevo" },
  youQualifyFor: {
    en: "programs found",
    pt: "programas encontrados",
    es: "programas encontrados",
  },
  noProgramsFound: {
    en: "Based on the information provided, we didn't find matching programs. But there may be other resources — contact us for a personal review.",
    pt: "Com base nas informações fornecidas, não encontrámos programas correspondentes. Mas podem existir outros recursos — contacte-nos para uma revisão pessoal.",
    es: "Según la información proporcionada, no encontramos programas coincidentes. Pero puede haber otros recursos — contáctenos para una revisión personal.",
  },
  learnMore: { en: "Learn more", pt: "Saber mais", es: "Más información" },
  remove: { en: "Remove", pt: "Remover", es: "Eliminar" },
  years: { en: "years old", pt: "anos", es: "años" },
};

export function t(key: string, lang: Lang): string {
  return T[key]?.[lang] ?? T[key]?.["en"] ?? key;
}
