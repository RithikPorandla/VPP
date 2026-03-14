"use client";

import { useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { screenEligibility, estimateAnnualValue, Household, BenefitProgram } from "@/lib/benefits";
import { t, Lang } from "@/lib/translations";

function ScreenerInner() {
  const params = useSearchParams();
  const initialLang = (params.get("lang") as Lang) || "en";
  const [lang, setLang] = useState<Lang>(initialLang);
  const [step, setStep] = useState(0);
  const [householdSize, setHouseholdSize] = useState(3);
  const [monthlyIncome, setMonthlyIncome] = useState(2800);
  const [childrenAges, setChildrenAges] = useState<number[]>([]);
  const [isRenter, setIsRenter] = useState(true);
  const [needsHealthcare, setNeedsHealthcare] = useState(false);
  const [isEmployed, setIsEmployed] = useState(true);
  const [hasElders, setHasElders] = useState(false);
  const [results, setResults] = useState<BenefitProgram[] | null>(null);
  const [contactMethod, setContactMethod] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const household: Household = {
    size: householdSize,
    monthlyIncome,
    hasChildren: childrenAges.length > 0,
    childrenAges,
    hasElders,
    isRenter,
    isEmployed,
    needsHealthcare,
    language: lang,
  };

  const runScreener = useCallback(() => {
    const eligible = screenEligibility(household);
    setResults(eligible);
    setStep(5);
  }, [household]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  const getName = (p: BenefitProgram) => lang === "pt" ? p.namePt : lang === "es" ? p.nameEs : p.name;
  const getDesc = (p: BenefitProgram) => lang === "pt" ? p.descriptionPt : lang === "es" ? p.descriptionEs : p.description;
  const getDetails = (p: BenefitProgram) => lang === "pt" ? p.detailsPt : lang === "es" ? p.detailsEs : p.details;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-700 rounded-lg flex items-center justify-center text-white text-sm font-bold">NB</div>
            <span className="font-semibold text-slate-800">NB Connect</span>
          </Link>
          <div className="flex gap-1 bg-slate-100 rounded-full p-1">
            {(["en", "pt", "es"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                  lang === l ? "bg-indigo-700 text-white" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {l === "en" ? "EN" : l === "pt" ? "PT" : "ES"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Progress */}
        {step < 5 && (
          <div className="mb-10">
            <div className="flex gap-2 mb-2">
              {[0, 1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 flex-1 rounded-full transition-all ${
                    s <= step ? "bg-indigo-600" : "bg-slate-200"
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-slate-400">
              {lang === "en" ? `Step ${step + 1} of 4` : lang === "pt" ? `Passo ${step + 1} de 4` : `Paso ${step + 1} de 4`}
            </div>
          </div>
        )}

        {/* Step 0: Household Size */}
        {step === 0 && (
          <div className="animate-in">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">{t("step1Title", lang)}</h2>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 mb-8">
              <div className="flex items-center justify-center gap-8">
                <button
                  onClick={() => setHouseholdSize(Math.max(1, householdSize - 1))}
                  className="w-14 h-14 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-2xl font-bold text-slate-600 transition-colors"
                >
                  -
                </button>
                <div className="text-center">
                  <div className="text-6xl font-bold text-indigo-700">{householdSize}</div>
                  <div className="text-slate-400 mt-1">{householdSize === 1 ? t("person", lang) : t("people", lang)}</div>
                </div>
                <button
                  onClick={() => setHouseholdSize(Math.min(12, householdSize + 1))}
                  className="w-14 h-14 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-2xl font-bold text-slate-600 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={() => setStep(1)}
              className="w-full bg-indigo-700 text-white py-4 rounded-xl font-semibold text-lg hover:bg-indigo-800 transition-colors"
            >
              {t("next", lang)}
            </button>
          </div>
        )}

        {/* Step 1: Monthly Income */}
        {step === 1 && (
          <div className="animate-in">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">{t("step2Title", lang)}</h2>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 mb-8">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-indigo-700">{formatCurrency(monthlyIncome)}</div>
                <div className="text-slate-400 mt-1">{t("monthlyIncome", lang)}</div>
              </div>
              <input
                type="range"
                min={0}
                max={10000}
                step={100}
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-indigo-700"
              />
              <div className="flex justify-between text-sm text-slate-400 mt-2">
                <span>$0</span>
                <span>$10,000+</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(0)} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-xl font-semibold hover:bg-slate-200 transition-colors">
                {t("back", lang)}
              </button>
              <button onClick={() => setStep(2)} className="flex-[2] bg-indigo-700 text-white py-4 rounded-xl font-semibold text-lg hover:bg-indigo-800 transition-colors">
                {t("next", lang)}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Children */}
        {step === 2 && (
          <div className="animate-in">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">{t("step3Title", lang)}</h2>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 mb-8">
              {childrenAges.length === 0 && (
                <div className="text-center text-slate-400 mb-4">{t("noChildren", lang)}</div>
              )}
              {childrenAges.map((age, i) => (
                <div key={i} className="flex items-center gap-4 mb-4">
                  <div className="text-2xl">👧</div>
                  <div className="flex-1">
                    <label className="text-sm text-slate-500 mb-1 block">{t("childAge", lang)}</label>
                    <input
                      type="number"
                      min={0}
                      max={18}
                      value={age}
                      onChange={(e) => {
                        const newAges = [...childrenAges];
                        newAges[i] = Number(e.target.value);
                        setChildrenAges(newAges);
                      }}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
                    />
                  </div>
                  <button
                    onClick={() => setChildrenAges(childrenAges.filter((_, j) => j !== i))}
                    className="text-sm text-red-500 hover:text-red-700 font-medium"
                  >
                    {t("remove", lang)}
                  </button>
                </div>
              ))}
              <button
                onClick={() => setChildrenAges([...childrenAges, 5])}
                className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:border-indigo-300 hover:text-indigo-600 transition-colors font-medium"
              >
                + {t("addChild", lang)}
              </button>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-xl font-semibold hover:bg-slate-200 transition-colors">
                {t("back", lang)}
              </button>
              <button onClick={() => setStep(3)} className="flex-[2] bg-indigo-700 text-white py-4 rounded-xl font-semibold text-lg hover:bg-indigo-800 transition-colors">
                {t("next", lang)}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Household Details */}
        {step === 3 && (
          <div className="animate-in">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">{t("step4Title", lang)}</h2>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 mb-8 space-y-4">
              {[
                { label: t("iRent", lang), value: isRenter, set: setIsRenter },
                { label: t("needHealthcare", lang), value: needsHealthcare, set: setNeedsHealthcare },
                { label: t("isEmployed", lang), value: isEmployed, set: setIsEmployed },
                { label: t("hasElders", lang), value: hasElders, set: setHasElders },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => item.set(!item.value)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                    item.value
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                    item.value ? "bg-indigo-600 border-indigo-600" : "border-slate-300"
                  }`}>
                    {item.value && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    )}
                  </div>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-xl font-semibold hover:bg-slate-200 transition-colors">
                {t("back", lang)}
              </button>
              <button onClick={runScreener} className="flex-[2] bg-indigo-700 text-white py-4 rounded-xl font-semibold text-lg hover:bg-indigo-800 transition-colors">
                {t("seeResults", lang)}
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Results */}
        {step === 5 && results && !showConfirmation && (
          <div className="animate-in">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{t("resultsTitle", lang)}</h2>
              {results.length > 0 && (
                <p className="text-slate-500">
                  {results.length} {t("youQualifyFor", lang)}
                </p>
              )}
            </div>

            {results.length > 0 ? (
              <>
                {/* Total Value Card */}
                <div className="bg-gradient-to-r from-indigo-700 to-indigo-800 rounded-2xl p-8 text-white text-center mb-8 shadow-lg">
                  <div className="text-sm text-indigo-200 mb-2">{t("totalEstimated", lang)}</div>
                  <div className="text-5xl font-bold mb-1">
                    {formatCurrency(estimateAnnualValue(results))}
                  </div>
                  <div className="text-indigo-200">{t("perYear", lang)}</div>
                </div>

                {/* Program Cards */}
                <div className="space-y-4 mb-10">
                  {results.map((p) => (
                    <ProgramCard key={p.id} program={p} lang={lang} getName={getName} getDesc={getDesc} getDetails={getDetails} formatCurrency={formatCurrency} />
                  ))}
                </div>

                {/* Get Help CTA */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 mb-8">
                  <h3 className="text-xl font-bold mb-4">{t("getHelp", lang)}</h3>
                  <p className="text-slate-500 mb-6">{t("howContact", lang)}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: "sms", icon: "💬" },
                      { key: "whatsapp", icon: "📱" },
                      { key: "phone", icon: "📞" },
                      { key: "inPerson", icon: "🏛️" },
                    ].map((ch) => (
                      <button
                        key={ch.key}
                        onClick={() => setContactMethod(ch.key)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          contactMethod === ch.key
                            ? "border-indigo-600 bg-indigo-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="text-2xl mb-2">{ch.icon}</div>
                        <div className="text-sm font-medium">{t(ch.key, lang)}</div>
                      </button>
                    ))}
                  </div>
                  {contactMethod && (
                    <button
                      onClick={() => setShowConfirmation(true)}
                      className="w-full mt-6 bg-emerald-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-emerald-700 transition-colors"
                    >
                      {lang === "en" ? "Connect Me With a Navigator" : lang === "pt" ? "Conecte-me Com um Navegador" : "Conécteme Con un Navegador"}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center">
                <p className="text-slate-500">{t("noProgramsFound", lang)}</p>
              </div>
            )}

            {/* Privacy */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex gap-3 items-start mb-8">
              <div className="text-lg mt-0.5">🔒</div>
              <div className="text-sm text-emerald-700">{t("privacyNote", lang)}</div>
            </div>

            <button
              onClick={() => { setStep(0); setResults(null); setContactMethod(null); }}
              className="w-full bg-slate-100 text-slate-600 py-3 rounded-xl font-medium hover:bg-slate-200 transition-colors"
            >
              {t("startOver", lang)}
            </button>
          </div>
        )}

        {/* Confirmation */}
        {showConfirmation && (
          <div className="animate-in text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6">
              <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">
              {lang === "en" ? "You're all set!" : lang === "pt" ? "Está tudo pronto!" : "!Todo listo!"}
            </h2>
            <p className="text-slate-500 max-w-md mx-auto mb-10 leading-relaxed">{t("submitted", lang)}</p>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm max-w-sm mx-auto mb-10">
              <div className="text-sm text-slate-400 mb-2">{t("totalEstimated", lang)}</div>
              <div className="text-3xl font-bold text-indigo-700">
                {results ? formatCurrency(estimateAnnualValue(results)) : "$0"}{" "}
                <span className="text-base font-normal text-slate-400">{t("perYear", lang)}</span>
              </div>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-indigo-700 text-white px-8 py-4 rounded-xl font-semibold hover:bg-indigo-800 transition-colors"
            >
              {t("startOver", lang)}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function ProgramCard({
  program: p,
  lang,
  getName,
  getDesc,
  getDetails,
  formatCurrency,
}: {
  program: BenefitProgram;
  lang: Lang;
  getName: (p: BenefitProgram) => string;
  getDesc: (p: BenefitProgram) => string;
  getDetails: (p: BenefitProgram) => string;
  formatCurrency: (n: number) => string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full p-6 text-left">
        <div className="flex items-start gap-4">
          <div className="text-3xl">{p.icon}</div>
          <div className="flex-1">
            <div className="font-semibold text-lg mb-1">{getName(p)}</div>
            <div className="text-sm text-slate-500 line-clamp-2">{getDesc(p)}</div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-lg font-bold text-indigo-700">
              {formatCurrency(p.annualValue.min)}-{formatCurrency(p.annualValue.max)}
            </div>
            <div className="text-xs text-slate-400">{t("perYear", lang)}</div>
          </div>
        </div>
      </button>
      {expanded && (
        <div className="px-6 pb-6 border-t border-slate-100 pt-4">
          <div className="text-sm text-slate-600 mb-4">{getDetails(p)}</div>
          <a
            href={p.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            {t("learnMore", lang)}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}

export default function ScreenerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white" />}>
      <ScreenerInner />
    </Suspense>
  );
}
