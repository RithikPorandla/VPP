"use client";

import { useState } from "react";
import Link from "next/link";
import { t, Lang } from "@/lib/translations";

function LangPicker({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="flex gap-1 bg-white/20 rounded-full p-1">
      {(["en", "pt", "es"] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
            lang === l ? "bg-white text-indigo-700 shadow-sm" : "text-white/80 hover:text-white"
          }`}
        >
          {l === "en" ? "English" : l === "pt" ? "Português" : "Español"}
        </button>
      ))}
    </div>
  );
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");

  const stats = [
    { value: "$8.2M", labelEn: "In unclaimed benefits annually", labelPt: "Em benefícios não reclamados anualmente", labelEs: "En beneficios no reclamados anualmente" },
    { value: "17,000+", labelEn: "Eligible residents not enrolled in SNAP", labelPt: "Residentes elegíveis não inscritos no SNAP", labelEs: "Residentes elegibles no inscritos en SNAP" },
    { value: "38%", labelEn: "Speak a non-English language at home", labelPt: "Falam uma língua não-inglesa em casa", labelEs: "Hablan un idioma no-inglés en casa" },
    { value: "8+", labelEn: "Benefit programs most families don't know about", labelPt: "Programas de benefícios que a maioria das famílias desconhece", labelEs: "Programas de beneficios que la mayoría de las familias no conoce" },
  ];

  const howItWorks = [
    {
      step: "01",
      titleEn: "Answer 4 simple questions",
      titlePt: "Responda a 4 perguntas simples",
      titleEs: "Responda 4 preguntas simples",
      descEn: "Household size, income, children, and housing status. Takes 2 minutes. Available in English, Portuguese, and Spanish.",
      descPt: "Tamanho do agregado, rendimento, filhos e situação habitacional. Demora 2 minutos. Disponível em inglês, português e espanhol.",
      descEs: "Tamaño del hogar, ingresos, hijos y situación de vivienda. Toma 2 minutos. Disponible en inglés, portugués y español.",
    },
    {
      step: "02",
      titleEn: "See everything you qualify for",
      titlePt: "Veja tudo a que tem direito",
      titleEs: "Vea todo para lo que califica",
      descEn: "We check your eligibility across SNAP, MassHealth, LIHEAP, WIC, housing, workforce training, and more — all at once.",
      descPt: "Verificamos a sua elegibilidade em SNAP, MassHealth, LIHEAP, WIC, habitação, formação profissional e mais — tudo de uma vez.",
      descEs: "Verificamos su elegibilidad en SNAP, MassHealth, LIHEAP, WIC, vivienda, capacitación laboral y más — todo a la vez.",
    },
    {
      step: "03",
      titleEn: "A navigator helps you apply",
      titlePt: "Um navegador ajuda-o a candidatar-se",
      titleEs: "Un navegador le ayuda a solicitar",
      descEn: "A bilingual community navigator contacts you by your preferred channel — SMS, WhatsApp, phone, or in person — and walks you through every application.",
      descPt: "Um navegador comunitário bilingue contacta-o pelo seu canal preferido — SMS, WhatsApp, telefone ou presencialmente — e guia-o em cada candidatura.",
      descEs: "Un navegador comunitario bilingüe lo contacta por su canal preferido — SMS, WhatsApp, teléfono o en persona — y lo guía en cada solicitud.",
    },
  ];

  const channels = [
    { icon: "💬", nameEn: "SMS / Text", namePt: "SMS / Texto", nameEs: "SMS / Texto", descEn: "Works on any phone, no internet needed", descPt: "Funciona em qualquer telefone, sem internet", descEs: "Funciona en cualquier teléfono, sin internet" },
    { icon: "📱", nameEn: "WhatsApp", namePt: "WhatsApp", nameEs: "WhatsApp", descEn: "Popular with Portuguese & Cape Verdean communities", descPt: "Popular nas comunidades portuguesa e cabo-verdiana", descEs: "Popular en comunidades portuguesas y caboverdianas" },
    { icon: "📞", nameEn: "Phone Call", namePt: "Chamada", nameEs: "Llamada", descEn: "AI voice assistant in your language, human backup", descPt: "Assistente de voz IA na sua língua, apoio humano", descEs: "Asistente de voz IA en su idioma, respaldo humano" },
    { icon: "🏛️", nameEn: "Community Kiosks", namePt: "Quiosques Comunitários", nameEs: "Quioscos Comunitarios", descEn: "Walk-up tablets at libraries, health centers, churches", descPt: "Tablets em bibliotecas, centros de saúde, igrejas", descEs: "Tabletas en bibliotecas, centros de salud, iglesias" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl font-bold">NB</div>
              <span className="text-lg font-semibold tracking-tight">{t("appName", lang)}</span>
            </div>
            <LangPicker lang={lang} setLang={setLang} />
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 pt-12 pb-24">
          <div className="max-w-3xl">
            <div className="inline-block bg-amber-400/20 text-amber-200 text-sm font-medium px-3 py-1 rounded-full mb-6">
              {lang === "en" ? "New Bedford, Massachusetts" : lang === "pt" ? "New Bedford, Massachusetts" : "New Bedford, Massachusetts"}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              {t("heroTitle", lang)}
            </h1>
            <p className="text-lg md:text-xl text-indigo-100 mb-10 max-w-2xl leading-relaxed">
              {t("heroSubtitle", lang)}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={`/screener?lang=${lang}`}
                className="inline-flex items-center gap-2 bg-white text-indigo-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-indigo-50 transition-colors shadow-lg shadow-indigo-900/30"
              >
                {t("checkEligibility", lang)}
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-white/10 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-colors border border-white/20"
              >
                {t("cityDashboard", lang)}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-6 -mt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100">
              <div className="text-3xl font-bold text-indigo-700 mb-1">{s.value}</div>
              <div className="text-sm text-slate-500">{lang === "en" ? s.labelEn : lang === "pt" ? s.labelPt : s.labelEs}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-center mb-4">
          {lang === "en" ? "How It Works" : lang === "pt" ? "Como Funciona" : "Cómo Funciona"}
        </h2>
        <p className="text-center text-slate-500 mb-16 max-w-xl mx-auto">
          {lang === "en" ? "Not a chatbot. A system that proactively finds what you're missing." : lang === "pt" ? "Não é um chatbot. Um sistema que encontra proativamente o que lhe falta." : "No es un chatbot. Un sistema que encuentra proactivamente lo que le falta."}
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {howItWorks.map((item) => (
            <div key={item.step} className="relative">
              <div className="text-6xl font-black text-indigo-100 mb-4">{item.step}</div>
              <h3 className="text-xl font-semibold mb-3">
                {lang === "en" ? item.titleEn : lang === "pt" ? item.titlePt : item.titleEs}
              </h3>
              <p className="text-slate-500 leading-relaxed">
                {lang === "en" ? item.descEn : lang === "pt" ? item.descPt : item.descEs}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Channels */}
      <div className="bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <h2 className="text-3xl font-bold text-center mb-4">
            {lang === "en" ? "We Meet You Where You Are" : lang === "pt" ? "Encontramo-lo Onde Está" : "Lo Encontramos Donde Está"}
          </h2>
          <p className="text-center text-slate-500 mb-16 max-w-xl mx-auto">
            {lang === "en" ? "No app download required. No internet required. No English required." : lang === "pt" ? "Sem necessidade de descarregar app. Sem necessidade de internet. Sem necessidade de inglês." : "No se requiere descargar app. No se requiere internet. No se requiere inglés."}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {channels.map((ch, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-4xl mb-4">{ch.icon}</div>
                <div className="font-semibold mb-2">
                  {lang === "en" ? ch.nameEn : lang === "pt" ? ch.namePt : ch.nameEs}
                </div>
                <div className="text-sm text-slate-500">
                  {lang === "en" ? ch.descEn : lang === "pt" ? ch.descPt : ch.descEs}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* For City Hall */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-10 md:p-16 text-white">
          <div className="max-w-3xl">
            <div className="inline-block bg-amber-400/20 text-amber-300 text-sm font-medium px-3 py-1 rounded-full mb-6">
              {lang === "en" ? "For City Leadership" : lang === "pt" ? "Para a Liderança Municipal" : "Para el Liderazgo de la Ciudad"}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {lang === "en" ? "Every dollar we enroll is a dollar that flows into New Bedford's economy." : lang === "pt" ? "Cada dólar que inscrevemos é um dólar que flui para a economia de New Bedford." : "Cada dólar que inscribimos es un dólar que fluye a la economía de New Bedford."}
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mt-10 mb-10">
              <div>
                <div className="text-3xl font-bold text-amber-400">$10M+</div>
                <div className="text-slate-300 text-sm mt-1">{lang === "en" ? "Estimated unclaimed federal benefits in New Bedford annually" : lang === "pt" ? "Benefícios federais não reclamados estimados em New Bedford anualmente" : "Beneficios federales no reclamados estimados anualmente"}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-amber-400">100:1</div>
                <div className="text-slate-300 text-sm mt-1">{lang === "en" ? "ROI — every $1 the city invests brings $100 in federal dollars" : lang === "pt" ? "ROI — cada $1 que a cidade investe traz $100 em dólares federais" : "ROI — cada $1 que invierte la ciudad trae $100 en dólares federales"}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-amber-400">26</div>
                <div className="text-slate-300 text-sm mt-1">{lang === "en" ? "MA Gateway Cities with the same opportunity" : lang === "pt" ? "Cidades Gateway de MA com a mesma oportunidade" : "Ciudades Gateway de MA con la misma oportunidad"}</div>
              </div>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-amber-400 text-slate-900 px-8 py-4 rounded-xl font-semibold hover:bg-amber-300 transition-colors"
            >
              {lang === "en" ? "View City Intelligence Dashboard" : lang === "pt" ? "Ver Painel de Inteligência da Cidade" : "Ver Panel de Inteligencia de la Ciudad"}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 flex gap-4 items-start">
          <div className="text-2xl mt-0.5">🔒</div>
          <div>
            <div className="font-semibold text-emerald-800 mb-1">
              {lang === "en" ? "Your Privacy Is Sacred" : lang === "pt" ? "A Sua Privacidade é Sagrada" : "Su Privacidad Es Sagrada"}
            </div>
            <div className="text-emerald-700 text-sm leading-relaxed">{t("privacyNote", lang)}</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-12">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <div>NB Connect — {lang === "en" ? "A civic intelligence platform for New Bedford" : lang === "pt" ? "Uma plataforma de inteligência cívica para New Bedford" : "Una plataforma de inteligencia cívica para New Bedford"}</div>
          <div>{lang === "en" ? "MVP Demo — Not yet connected to live systems" : lang === "pt" ? "Demo MVP — Ainda não conectado a sistemas ao vivo" : "Demo MVP — Aún no conectado a sistemas en vivo"}</div>
        </div>
      </footer>
    </div>
  );
}
