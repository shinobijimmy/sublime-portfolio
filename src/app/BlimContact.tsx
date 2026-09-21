"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Locale = "es" | "en";

type StepId = "need" | "context" | "goal" | "references" | "deadline" | "name" | "email";

const STEP_ORDER: StepId[] = [
  "need",
  "context",
  "goal",
  "references",
  "deadline",
  "name",
  "email",
];

const NEEDS: Record<Locale, { id: string; label: string }[]> = {
  es: [
    { id: "identidad", label: "Identidad" },
    { id: "web", label: "Web" },
    { id: "producto", label: "Producto" },
    { id: "otro", label: "Otro" },
  ],
  en: [
    { id: "identity", label: "Identity" },
    { id: "web", label: "Web" },
    { id: "product", label: "Product" },
    { id: "other", label: "Other" },
  ],
};

const COPY = {
  es: {
    title: "Hablemos",
    intro: "Contanos dónde estás, qué querés construir y qué necesitás resolver.",
    start: "Armar el brief con blim",
    placeholder: "Escribí acá…",
    placeholderShort: "Tu respuesta…",
    send: "Enviar",
    next: "Continuar",
    skip: "Saltar",
    back: "Volver",
    edit: "Editar respuestas",
    restart: "Empezar de nuevo",
    confirm: "Confirmar y enviar",
    sending: "Enviando…",
    okTitle: "Brief enviado.",
    okBody: "Te va a llegar una copia al correo que dejaste. Gracias.",
    errGeneric: "No pudimos enviarlo. Probá de nuevo en un momento.",
    errRate: "Demasiados intentos seguidos. Esperá un rato y probá de nuevo.",
    errEmail: "Ese correo no parece válido.",
    errRequired: "Falta este dato.",
    briefReady: "Listo. Así queda el brief:",
  },
  en: {
    title: "Let's talk",
    intro: "Tell us where you are, what you want to build and what you need to solve.",
    start: "Build the brief with blim",
    placeholder: "Type here…",
    placeholderShort: "Your answer…",
    send: "Send",
    next: "Continue",
    skip: "Skip",
    back: "Back",
    edit: "Edit answers",
    restart: "Start over",
    confirm: "Confirm and send",
    sending: "Sending…",
    okTitle: "Brief sent.",
    okBody: "A copy will reach the email you left. Thank you.",
    errGeneric: "We couldn't send it. Try again in a moment.",
    errRate: "Too many attempts in a row. Wait a while and try again.",
    errEmail: "That email doesn't look valid.",
    errRequired: "This field is missing.",
    briefReady: "Done. Here's the brief:",
  },
} as const;

const QUESTIONS: Record<Locale, Record<StepId, { q: string; ph: string; optional?: boolean }>> = {
  es: {
    need: { q: "¿Qué necesitás?", ph: "Elegí una opción" },
    context: { q: "Contame el contexto: una frase alcanza.", ph: "Ej: una marca de muebles que quiere vender online" },
    goal: { q: "¿Cuál es el objetivo? ¿Qué tiene que pasar para que esto sea un éxito?", ph: "Ej: recibir consultas de clientes reales" },
    references: { q: "¿Tenés referencias? Pegá links o nombres.", ph: "Opcional", optional: true },
    deadline: { q: "¿Para cuándo lo necesitás?", ph: "Opcional", optional: true },
    name: { q: "¿Cómo te llamás?", ph: "Tu nombre" },
    email: { q: "¿A qué correo te escribo?", ph: "nombre@dominio.com" },
  },
  en: {
    need: { q: "What do you need?", ph: "Pick one" },
    context: { q: "Give me the context: one sentence is enough.", ph: "E.g. a furniture brand that wants to sell online" },
    goal: { q: "What's the goal? What has to happen for this to be a success?", ph: "E.g. get real client enquiries" },
    references: { q: "Any references? Paste links or names.", ph: "Optional", optional: true },
    deadline: { q: "When do you need it?", ph: "Optional", optional: true },
    name: { q: "What's your name?", ph: "Your name" },
    email: { q: "Which email should I reply to?", ph: "name@domain.com" },
  },
};

const LABELS: Record<Locale, Record<StepId, string>> = {
  es: { need: "Necesita", context: "Contexto", goal: "Objetivo", references: "Referencias", deadline: "Plazo", name: "Nombre", email: "Email" },
  en: { need: "Needs", context: "Context", goal: "Goal", references: "References", deadline: "Deadline", name: "Name", email: "Email" },
};

// Expresiones de blim. Son caracteres seguros en JetBrains Mono.
const FACES = ["(o_o)", "(o_o)?", "(-_-)", "(^_^)", "(o_O)", "(*_*)", "(^o^)"];

type Msg = { from: "blim" | "you"; text: string };

export default function BlimContact({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  const steps = QUESTIONS[locale];
  const needs = NEEDS[locale];

  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Partial<Record<StepId, string>>>({});
  const [draft, setDraft] = useState("");
  const [log, setLog] = useState<Msg[]>([]);
  const [phase, setPhase] = useState<"asking" | "review" | "sending" | "done" | "error">("asking");
  const [error, setError] = useState<string | null>(null);
  const startedAt = useRef<number>(0);
  const logRef = useRef<HTMLDivElement>(null);

  const step = STEP_ORDER[idx];
  const face = useMemo(() => FACES[Math.min(idx, FACES.length - 1)], [idx]);

  // Al cambiar de idioma se reinicia el flujo: las preguntas ya no coinciden.
  useEffect(() => {
    if (open) reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log, phase]);

  function reset() {
    setIdx(0);
    setAnswers({});
    setDraft("");
    setLog([{ from: "blim", text: steps[STEP_ORDER[0]].q }]);
    setPhase("asking");
    setError(null);
    startedAt.current = Date.now();
  }

  function start() {
    reset();
    setOpen(true);
  }

  function commit(value: string, id: StepId = step) {
    const v = value.trim();
    if (!v && !steps[id].optional) {
      setError(t.errRequired);
      return;
    }
    if (id === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
      setError(t.errEmail);
      return;
    }
    setError(null);
    const nextAnswers = { ...answers, [id]: v };
    setAnswers(nextAnswers);
    setDraft("");

    const nextIdx = idx + 1;
    if (nextIdx >= STEP_ORDER.length) {
      setLog((l) => [...l, { from: "you", text: v || "—" }, { from: "blim", text: t.briefReady }]);
      setPhase("review");
      return;
    }
    setLog((l) => [
      ...l,
      { from: "you", text: v || "—" },
      { from: "blim", text: steps[STEP_ORDER[nextIdx]].q },
    ]);
    setIdx(nextIdx);
  }

  function back() {
    if (phase === "review") {
      setPhase("asking");
      setIdx(STEP_ORDER.length - 1);
      return;
    }
    if (idx === 0) return;
    const prev = idx - 1;
    setIdx(prev);
    setLog((l) => l.slice(0, Math.max(0, l.length - 2)));
    setError(null);
  }

  async function submit() {
    setPhase("sending");
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...answers,
          locale,
          elapsed: Date.now() - startedAt.current,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        setPhase("done");
        return;
      }
      setError(data.error === "rate_limited" ? t.errRate : t.errGeneric);
      setPhase("error");
    } catch {
      setError(t.errGeneric);
      setPhase("error");
    }
  }

  if (!open) {
    return (
      <div className="blim-launcher">
        <p className="blim-face mono" aria-hidden>
          {FACES[0]}
        </p>
        <button type="button" className="button contact-button" onClick={start}>
          {t.start} <span aria-hidden>↗</span>
        </button>
      </div>
    );
  }

  return (
    <div className="blim" role="region" aria-label={t.title}>
      <div className="blim-head">
        <span className="blim-face mono" aria-hidden>
          {face}
        </span>
        <strong className="mono">blim</strong>
        <button
          type="button"
          className="blim-close mono"
          onClick={() => setOpen(false)}
          aria-label={locale === "es" ? "Cerrar" : "Close"}
        >
          ✕
        </button>
      </div>

      <div className="blim-log mono" ref={logRef} aria-live="polite">
        {log.map((m, i) => (
          <p key={i} className={`blim-msg blim-${m.from}`}>
            {m.from === "blim" ? <span aria-hidden>{face} </span> : null}
            {m.text}
          </p>
        ))}
      </div>

      {phase === "asking" && (
        <div className="blim-controls">
          {step === "need" ? (
            <div className="blim-choices">
              {needs.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  className="blim-choice mono"
                  onClick={() => commit(n.label, "need")}
                >
                  {n.label}
                </button>
              ))}
            </div>
          ) : (
            <form
              className="blim-input"
              onSubmit={(e) => {
                e.preventDefault();
                commit(draft);
              }}
            >
              <label className="sr-only" htmlFor="blim-field">
                {steps[step].q}
              </label>
              <input
                id="blim-field"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={draft ? "" : steps[step].ph}
                autoComplete={step === "email" ? "email" : step === "name" ? "name" : "off"}
                inputMode={step === "email" ? "email" : "text"}
                type={step === "email" ? "email" : "text"}
              />
              <button type="submit" className="blim-send mono">
                {t.next}
              </button>
            </form>
          )}

          <div className="blim-nav mono">
            {idx > 0 && (
              <button type="button" className="blim-link" onClick={back}>
                ← {t.back}
              </button>
            )}
            {steps[step].optional && (
              <button type="button" className="blim-link" onClick={() => commit("")}>
                {t.skip} →
              </button>
            )}
          </div>
        </div>
      )}

      {phase === "review" && (
        <div className="blim-review">
          <dl className="blim-summary mono">
            {STEP_ORDER.map((s) => (
              <div key={s}>
                <dt>{LABELS[locale][s]}</dt>
                <dd>{answers[s] || "—"}</dd>
              </div>
            ))}
          </dl>
          <div className="blim-nav mono">
            <button type="button" className="blim-link" onClick={back}>
              ← {t.edit}
            </button>
            <button type="button" className="blim-confirm mono" onClick={submit}>
              {t.confirm} →
            </button>
          </div>
        </div>
      )}

      {phase === "sending" && <p className="blim-status mono">{t.sending}</p>}

      {phase === "done" && (
        <div className="blim-done">
          <p className="blim-msg blim-blim mono">
            <span aria-hidden>{FACES[5]} </span>
            <strong>{t.okTitle}</strong> {t.okBody}
          </p>
          <div className="blim-nav mono">
            <button type="button" className="blim-link" onClick={start}>
              {t.restart}
            </button>
          </div>
        </div>
      )}

      {phase === "error" && (
        <div className="blim-done">
          <p className="blim-msg blim-err mono" role="alert">
            <span aria-hidden>{FACES[2]} </span>
            {error}
          </p>
          <div className="blim-nav mono">
            <button type="button" className="blim-confirm mono" onClick={submit}>
              {t.confirm} →
            </button>
            <button type="button" className="blim-link" onClick={start}>
              {t.restart}
            </button>
          </div>
        </div>
      )}

      {error && phase === "asking" && (
        <p className="blim-err mono" role="alert">
          {error}
        </p>
      )}

      {/* Trampa anti-spam: invisible para personas, tentadora para bots. */}
      <input
        type="text"
        name="trap"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="blim-trap"
        onChange={() => {}}
      />
    </div>
  );
}
