"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

type Locale = "es" | "en";
type StepKind = "multi" | "single" | "text" | "long" | "email";

type Option = { id: string; label: string; desc?: string };

type StepId =
  | "needs"
  | "identityStage"
  | "identityScope"
  | "webType"
  | "webFeatures"
  | "productType"
  | "productUsers"
  | "contentTypes"
  | "contentVolume"
  | "context"
  | "goal"
  | "success"
  | "references"
  | "deadline"
  | "decision"
  | "extras"
  | "name"
  | "email"
  | "org";

type Step = {
  id: StepId;
  kind: StepKind;
  /** Etiqueta para el resumen y para el correo interno. */
  label: string;
  /** Lo que dice blim. */
  q: string;
  hint?: string;
  ph?: string;
  optional?: boolean;
  options?: Option[];
  maxLen?: number;
};

type Msg = { from: "blim" | "you"; text: string };
type Phase = "asking" | "review" | "sending" | "done" | "error";
type SavedDraft = {
  needs?: string[];
  answers?: Partial<Record<StepId, string>>;
  idx?: number;
};

const FACES = ["(o_o)", "(o_o)?", "(-_-)", "(^_^)", "(o_O)", "(*_*)", "(^o^)"];
const DRAFT_KEY = "sublimelab.brief.v1";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_LEN = 1200;

/** Sin estas respuestas no se puede enviar (el resto es opcional). */
const CORE: StepId[] = ["context", "goal", "name", "email"];

/** El borrador vive en localStorage: no hay suscripción, se relee en cada render. */
const subscribeDraft = () => () => {};

const COPY = {
  es: {
    title: "Hablemos",
    intro: "Contanos dónde estás, qué querés construir y qué necesitás resolver.",
    start: "Armar el brief con blim",
    resume: "Retomar el brief donde lo dejé",
    restart: "Empezar de nuevo",
    next: "Continuar",
    skip: "Saltar",
    back: "Volver",
    edit: "Editar",
    toReview: "Ya está, revisar",
    confirm: "Confirmar y enviar",
    sending: "Enviando…",
    okTitle: "Brief enviado.",
    okBody: "Te va a llegar una copia al correo que dejaste.",
    errGeneric: "No pudimos enviarlo. Probá de nuevo en un momento.",
    errRate: "Demasiados intentos seguidos. Esperá un rato y probá de nuevo.",
    errEmail: "Ese correo no parece válido.",
    errRequired: "Falta este dato.",
    briefReady: "Listo. Así queda el brief:",
    empty: "—",
    copy: "Copiar el brief",
    copied: "Brief copiado ✓",
    dataNote:
      "Tus respuestas llegan a Sublime Lab y se usan solo para responderte. No se comparten con terceros ni se usan para otra cosa.",
    consent:
      "Entiendo y acepto que Sublime Lab guarde estas respuestas para responder mi consulta.",
    step: "Paso",
    of: "de",
    answered: "respondidas",
    chars: "caracteres",
  },
  en: {
    title: "Let's talk",
    intro: "Tell us where you are, what you want to build and what you need to solve.",
    start: "Build the brief with blim",
    resume: "Resume the brief where I left it",
    restart: "Start over",
    next: "Continue",
    skip: "Skip",
    back: "Back",
    edit: "Edit",
    toReview: "That's enough, review",
    confirm: "Confirm and send",
    sending: "Sending…",
    okTitle: "Brief sent.",
    okBody:
      "A copy will reach the email you left.",
    errGeneric: "We couldn't send it. Try again in a moment.",
    errRate: "Too many attempts in a row. Wait a while and try again.",
    errEmail: "That email doesn't look valid.",
    errRequired: "This field is missing.",
    briefReady: "Done. Here's the brief:",
    empty: "—",
    copy: "Copy the brief",
    copied: "Brief copied ✓",
    dataNote:
      "Your answers go to Sublime Lab and are used only to reply to you. They are not shared with third parties.",
    consent:
      "I understand and agree that Sublime Lab stores these answers to reply to my enquiry.",
    step: "Step",
    of: "of",
    answered: "answered",
    chars: "characters",
  },
} as const;

const STEPS: Record<Locale, Record<StepId, Step>> = {
  es: {
    needs: {
      id: "needs",
      kind: "multi",
      label: "Necesita",
      q: "¿Qué necesitás? Podés elegir más de una.",
      hint: "Si todavía no lo tenés claro, elegí «Todavía no sé» y lo definimos juntos.",
      options: [
        { id: "identidad", label: "Identidad y marca", desc: "Naming, logotipo, sistema visual, manual" },
        { id: "web", label: "Sitio o e-commerce", desc: "Landing, institucional, tienda online" },
        { id: "producto", label: "Producto digital", desc: "App, panel interno, prototipo navegable" },
        { id: "contenido", label: "Contenido y dirección de arte", desc: "Foto, video, piezas, redes" },
        { id: "nose", label: "Todavía no sé", desc: "Lo vemos en la charla y lo defino con vos" },
      ],
    },
    identityStage: {
      id: "identityStage",
      kind: "single",
      label: "Punto de partida",
      q: "¿La marca arranca de cero o ya existe?",
      options: [
        { id: "cero", label: "Desde cero", desc: "Nombre, identidad y sistema nuevos" },
        { id: "rediseno", label: "Rediseño", desc: "Hay algo que ya no representa lo que somos" },
        { id: "evolucion", label: "Evolución", desc: "La base sirve; hay que ordenarla y ampliarla" },
        { id: "nose", label: "No estoy seguro", desc: "Me ayudás a ubicarlo" },
      ],
    },
    identityScope: {
      id: "identityScope",
      kind: "multi",
      label: "Alcance de la marca",
      q: "¿Qué piezas de la identidad te importan más?",
      hint: "Elegí las que hoy te duelen o te faltan.",
      options: [
        { id: "naming", label: "Nombre" },
        { id: "logotipo", label: "Logotipo" },
        { id: "sistema", label: "Sistema visual (color, tipo, grilla)" },
        { id: "manual", label: "Manual de uso" },
        { id: "packaging", label: "Packaging" },
        { id: "redes", label: "Plantillas para redes" },
        { id: "otro", label: "Otra cosa" },
      ],
    },
    webType: {
      id: "webType",
      kind: "single",
      label: "Tipo de sitio",
      q: "¿Qué tipo de sitio necesitás?",
      options: [
        { id: "landing", label: "Landing de una sola página", desc: "Presentar y captar consultas" },
        { id: "institucional", label: "Sitio institucional", desc: "Varias secciones y contenido propio" },
        { id: "ecommerce", label: "E-commerce", desc: "Catálogo con carrito y pagos" },
        { id: "plataforma", label: "Plataforma con usuarios", desc: "Cuentas, panel, datos" },
        { id: "nose", label: "No estoy seguro", desc: "Lo definimos según el objetivo" },
      ],
    },
    webFeatures: {
      id: "webFeatures",
      kind: "multi",
      label: "Funciones del sitio",
      q: "¿Hay algo de esto que tenga que estar sí o sí?",
      hint: "Marcá lo que ya sabés que necesitás. El resto lo proponemos nosotros.",
      optional: true,
      options: [
        { id: "pagos", label: "Cobros online" },
        { id: "cms", label: "Editar contenido sin depender de un dev" },
        { id: "turnos", label: "Turnos o reservas" },
        { id: "catalogo", label: "Catálogo grande o filtros" },
        { id: "idiomas", label: "Más de un idioma" },
        { id: "integraciones", label: "Integraciones (CRM, mail, stock)" },
        { id: "nada", label: "Nada en particular" },
      ],
    },
    productType: {
      id: "productType",
      kind: "single",
      label: "Tipo de producto",
      q: "¿Qué tipo de producto digital es?",
      options: [
        { id: "mvp", label: "MVP para validar", desc: "Lo mínimo que pruebe la hipótesis con gente real" },
        { id: "panel", label: "Panel interno", desc: "Operación, datos o gestión de un equipo" },
        { id: "prototipo", label: "Prototipo navegable", desc: "Para mostrar, medir y conseguir apoyo" },
        { id: "nose", label: "No estoy seguro", desc: "Lo pensamos en la charla" },
      ],
    },
    productUsers: {
      id: "productUsers",
      kind: "text",
      label: "Usuarios del producto",
      q: "¿Quiénes lo van a usar y cuántos son?",
      ph: "Ej: 8 personas del equipo comercial y unos 40 clientes por mes",
      maxLen: 300,
    },
    contentTypes: {
      id: "contentTypes",
      kind: "multi",
      label: "Tipo de contenido",
      q: "¿Qué tipo de contenido necesitás?",
      options: [
        { id: "foto", label: "Fotografía de producto" },
        { id: "video", label: "Video / motion" },
        { id: "redes", label: "Piezas para redes" },
        { id: "editorial", label: "Editorial / catálogo impreso" },
        { id: "direccion", label: "Dirección de arte" },
      ],
    },
    contentVolume: {
      id: "contentVolume",
      kind: "text",
      label: "Volumen y frecuencia",
      q: "¿Cuánto material y con qué frecuencia?",
      ph: "Ej: 12 piezas por mes, campaña puntual de lanzamiento",
      maxLen: 300,
    },
    context: {
      id: "context",
      kind: "long",
      label: "Contexto",
      q: "Contame dónde estás hoy. ¿Qué existe y qué te falta?",
      hint: "Una o dos frases alcanzan para empezar.",
      ph: "Ej: una marca de muebles con taller propio que vende por Instagram y quiere su propia tienda",
      maxLen: MAX_LEN,
    },
    goal: {
      id: "goal",
      kind: "long",
      label: "Objetivo",
      q: "¿Qué tiene que pasar para que este proyecto valga la pena?",
      ph: "Ej: recibir consultas de clientes reales y dejar de depender del mensaje privado",
      maxLen: MAX_LEN,
    },
    success: {
      id: "success",
      kind: "text",
      label: "Señal de éxito",
      q: "¿Cómo vamos a saber que funcionó? Si podés, dame un número.",
      hint: "Un número, aunque sea estimado, cambia por completo cómo diseñamos.",
      ph: "Ej: 20 consultas por mes, o 30 ventas online en el primer trimestre",
      optional: true,
      maxLen: 400,
    },
    references: {
      id: "references",
      kind: "text",
      label: "Referencias",
      q: "¿Tenés referencias? Pegá links o nombres de lo que te gusta (y de lo que no).",
      ph: "Ej: https://sitio-que-me-gusta.com — y odio los degradados",
      optional: true,
      maxLen: 800,
    },
    deadline: {
      id: "deadline",
      kind: "single",
      label: "Plazo",
      q: "¿Para cuándo lo necesitás?",
      options: [
        { id: "ya", label: "Lo antes posible" },
        { id: "1-2", label: "En uno o dos meses" },
        { id: "3-6", label: "En tres a seis meses" },
        { id: "sinfecha", label: "Todavía no hay fecha" },
      ],
    },
    decision: {
      id: "decision",
      kind: "single",
      label: "Quién decide",
      q: "¿Quién toma la decisión final?",
      options: [
        { id: "solo", label: "Decido yo" },
        { id: "par", label: "Decido con otra persona" },
        { id: "equipo", label: "Hay que presentarlo a un equipo o dirección" },
      ],
    },
    extras: {
      id: "extras",
      kind: "long",
      label: "Algo más",
      q: "¿Hay algo que no te pregunté y debería saber?",
      ph: "Opcional: antecedentes, restricciones, gente involucrada, lo que te preocupa",
      optional: true,
      maxLen: MAX_LEN,
    },
    org: {
      id: "org",
      kind: "text",
      label: "Marca o empresa",
      q: "¿Para qué marca o empresa es?",
      ph: "Opcional",
      optional: true,
      maxLen: 160,
    },
    name: {
      id: "name",
      kind: "text",
      label: "Nombre",
      q: "¿Cómo te llamás?",
      ph: "Tu nombre",
      maxLen: 120,
    },
    email: {
      id: "email",
      kind: "email",
      label: "Email",
      q: "¿A qué correo te escribo? Ahí te llega la copia del brief.",
      ph: "nombre@dominio.com",
      maxLen: 200,
    },
  },
  en: {
    needs: {
      id: "needs",
      kind: "multi",
      label: "Needs",
      q: "What do you need? You can pick more than one.",
      hint: "If it's still unclear, pick “Not sure yet” and we'll define it together.",
      options: [
        { id: "identidad", label: "Brand & identity", desc: "Naming, logo, visual system, guidelines" },
        { id: "web", label: "Website or e-commerce", desc: "Landing, corporate site, online store" },
        { id: "producto", label: "Digital product", desc: "App, internal dashboard, clickable prototype" },
        { id: "contenido", label: "Content & art direction", desc: "Photo, video, pieces, social" },
        { id: "nose", label: "Not sure yet", desc: "We'll figure it out in the call" },
      ],
    },
    identityStage: {
      id: "identityStage",
      kind: "single",
      label: "Starting point",
      q: "Is the brand starting from scratch or does it already exist?",
      options: [
        { id: "cero", label: "From scratch", desc: "New name, identity and system" },
        { id: "rediseno", label: "Redesign", desc: "What exists no longer represents us" },
        { id: "evolucion", label: "Evolution", desc: "The base works; it needs order and range" },
        { id: "nose", label: "Not sure", desc: "Help me place it" },
      ],
    },
    identityScope: {
      id: "identityScope",
      kind: "multi",
      label: "Brand scope",
      q: "Which identity pieces matter most to you?",
      hint: "Pick the ones that hurt or are missing today.",
      options: [
        { id: "naming", label: "Name" },
        { id: "logotipo", label: "Logo" },
        { id: "sistema", label: "Visual system (colour, type, grid)" },
        { id: "manual", label: "Usage guidelines" },
        { id: "packaging", label: "Packaging" },
        { id: "redes", label: "Social templates" },
        { id: "otro", label: "Something else" },
      ],
    },
    webType: {
      id: "webType",
      kind: "single",
      label: "Site type",
      q: "What kind of site do you need?",
      options: [
        { id: "landing", label: "One-page landing", desc: "Present and capture enquiries" },
        { id: "institucional", label: "Corporate site", desc: "Several sections with own content" },
        { id: "ecommerce", label: "E-commerce", desc: "Catalogue with cart and payments" },
        { id: "plataforma", label: "Platform with users", desc: "Accounts, dashboard, data" },
        { id: "nose", label: "Not sure", desc: "We'll define it from the goal" },
      ],
    },
    webFeatures: {
      id: "webFeatures",
      kind: "multi",
      label: "Site features",
      q: "Does any of this have to be there no matter what?",
      hint: "Mark what you already know you need. We'll propose the rest.",
      optional: true,
      options: [
        { id: "pagos", label: "Online payments" },
        { id: "cms", label: "Edit content without a developer" },
        { id: "turnos", label: "Bookings or appointments" },
        { id: "catalogo", label: "Large catalogue or filters" },
        { id: "idiomas", label: "More than one language" },
        { id: "integraciones", label: "Integrations (CRM, mail, stock)" },
        { id: "nada", label: "Nothing in particular" },
      ],
    },
    productType: {
      id: "productType",
      kind: "single",
      label: "Product type",
      q: "What kind of digital product is it?",
      options: [
        { id: "mvp", label: "MVP to validate", desc: "The minimum that tests the hypothesis with real people" },
        { id: "panel", label: "Internal dashboard", desc: "Operations, data or team management" },
        { id: "prototipo", label: "Clickable prototype", desc: "To show, measure and get support" },
        { id: "nose", label: "Not sure", desc: "Let's think it through" },
      ],
    },
    productUsers: {
      id: "productUsers",
      kind: "text",
      label: "Product users",
      q: "Who will use it and how many are they?",
      ph: "E.g. 8 people in the sales team and around 40 clients a month",
      maxLen: 300,
    },
    contentTypes: {
      id: "contentTypes",
      kind: "multi",
      label: "Content type",
      q: "What kind of content do you need?",
      options: [
        { id: "foto", label: "Product photography" },
        { id: "video", label: "Video / motion" },
        { id: "redes", label: "Social pieces" },
        { id: "editorial", label: "Editorial / printed catalogue" },
        { id: "direccion", label: "Art direction" },
      ],
    },
    contentVolume: {
      id: "contentVolume",
      kind: "text",
      label: "Volume and cadence",
      q: "How much material and how often?",
      ph: "E.g. 12 pieces a month, one-off launch campaign",
      maxLen: 300,
    },
    context: {
      id: "context",
      kind: "long",
      label: "Context",
      q: "Tell me where you are today. What exists and what's missing?",
      hint: "One or two sentences are enough to start.",
      ph: "E.g. a furniture brand with its own workshop selling through Instagram that wants its own store",
      maxLen: MAX_LEN,
    },
    goal: {
      id: "goal",
      kind: "long",
      label: "Goal",
      q: "What has to happen for this project to be worth it?",
      ph: "E.g. get enquiries from real clients and stop depending on DMs",
      maxLen: MAX_LEN,
    },
    success: {
      id: "success",
      kind: "text",
      label: "Success signal",
      q: "How will we know it worked? A number if you can.",
      hint: "A number, even an estimate, changes how we design this.",
      ph: "E.g. 20 enquiries a month, or 30 online sales in the first quarter",
      optional: true,
      maxLen: 400,
    },
    references: {
      id: "references",
      kind: "text",
      label: "References",
      q: "Any references? Paste links or names of what you like (and what you don't).",
      ph: "E.g. https://a-site-i-like.com — and I hate gradients",
      optional: true,
      maxLen: 800,
    },
    deadline: {
      id: "deadline",
      kind: "single",
      label: "Timeline",
      q: "When do you need it?",
      options: [
        { id: "ya", label: "As soon as possible" },
        { id: "1-2", label: "In one or two months" },
        { id: "3-6", label: "In three to six months" },
        { id: "sinfecha", label: "No date yet" },
      ],
    },
    decision: {
      id: "decision",
      kind: "single",
      label: "Who decides",
      q: "Who makes the final call?",
      options: [
        { id: "solo", label: "I decide" },
        { id: "par", label: "I decide with someone else" },
        { id: "equipo", label: "It has to be presented to a team or board" },
      ],
    },
    extras: {
      id: "extras",
      kind: "long",
      label: "Anything else",
      q: "Is there something I didn't ask and should know?",
      ph: "Optional: background, constraints, other people involved, what worries you",
      optional: true,
      maxLen: MAX_LEN,
    },
    org: {
      id: "org",
      kind: "text",
      label: "Brand or company",
      q: "Which brand or company is this for?",
      ph: "Optional",
      optional: true,
      maxLen: 160,
    },
    name: {
      id: "name",
      kind: "text",
      label: "Name",
      q: "What's your name?",
      ph: "Your name",
      maxLen: 120,
    },
    email: {
      id: "email",
      kind: "email",
      label: "Email",
      q: "Which email should I reply to? The brief copy goes there too.",
      ph: "name@domain.com",
      maxLen: 200,
    },
  },
};

/** Preguntas extra que se activan según lo que se haya elegido en `needs`. */
const BRANCH: Record<string, StepId[]> = {
  identidad: ["identityStage", "identityScope"],
  web: ["webType", "webFeatures"],
  producto: ["productType", "productUsers"],
  contenido: ["contentTypes", "contentVolume"],
  nose: [],
};

/** Bloque común, siempre presente. */
const TAIL: StepId[] = [
  "context",
  "goal",
  "success",
  "references",
  "deadline",
  "decision",
  "extras",
  "name",
  "email",
  "org",
];

function sequenceFor(locale: Locale, needs: string[]): Step[] {
  const order: StepId[] = ["needs"];
  for (const need of needs) order.push(...(BRANCH[need] ?? []));
  order.push(...TAIL);
  return order.map((id) => STEPS[locale][id]);
}

/** Vuelve a marcar las opciones ya elegidas cuando se edita una respuesta múltiple. */
function preselect(def: Step, value: string | undefined): string[] {
  if (!value) return [];
  const parts = value.split(",").map((s) => s.trim());
  return (def.options ?? []).filter((o) => parts.includes(o.label)).map((o) => o.label);
}

export default function BlimContact({ locale }: { locale: Locale }) {
  const t = COPY[locale];

  const [open, setOpen] = useState(false);
  const [needs, setNeeds] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Partial<Record<StepId, string>>>({});
  const [texts, setTexts] = useState<Partial<Record<StepId, string>>>({});
  const [selected, setSelected] = useState<Partial<Record<StepId, string[]>>>({});
  const [trap, setTrap] = useState("");
  const [idx, setIdx] = useState(0);
  const [editing, setEditing] = useState(false);
  const [phase, setPhase] = useState<Phase>("asking");
  const [error, setError] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [copied, setCopied] = useState(false);
  const startedAt = useRef<number>(0);
  const fieldRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  // El borrador se lee del navegador sin romper la hidratación.
  const hasDraft = useSyncExternalStore(
    subscribeDraft,
    () => window.localStorage.getItem(DRAFT_KEY) !== null,
    () => false
  );

  const steps = useMemo(() => sequenceFor(locale, needs), [locale, needs]);
  const safeIdx = Math.min(idx, steps.length - 1);
  const step = steps[safeIdx];
  const face = FACES[Math.min(safeIdx, FACES.length - 1)];
  const draft = texts[step.id] ?? "";
  const picked = selected[step.id] ?? [];
  const answered = steps.filter((s) => (answers[s.id] ?? "").trim().length > 0).length;
  const progress =
    phase === "asking" ? Math.round((safeIdx / steps.length) * 100) : 100;
  const canFinish = CORE.every((id) => (answers[id] ?? "").trim().length > 0);

  // --- Conversación derivada del estado (nunca se desincroniza al editar) ---
  const transcript: Msg[] = useMemo(() => {
    if (editing && phase === "asking") return [{ from: "blim", text: step.q }];
    const out: Msg[] = [];
    const upTo = phase === "asking" ? safeIdx : steps.length;
    for (let i = 0; i < upTo; i++) {
      out.push({ from: "blim", text: steps[i].q });
      out.push({ from: "you", text: answers[steps[i].id] ?? t.empty });
    }
    out.push({ from: "blim", text: phase === "asking" ? step.q : t.briefReady });
    return out;
  }, [answers, editing, phase, safeIdx, step, steps, t.empty, t.briefReady]);

  const summaryText = useMemo(
    () => steps.map((s) => `${s.label}: ${answers[s.id] || t.empty}`).join("\n"),
    [answers, steps, t.empty]
  );

  // Borrador persistente: sobrevive a un refresh o a cerrar la pestaña.
  useEffect(() => {
    try {
      if (phase === "done") {
        window.localStorage.removeItem(DRAFT_KEY);
        return;
      }
      if (needs.length === 0 && Object.keys(answers).length === 0) return;
      window.localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ needs, answers, idx: safeIdx })
      );
    } catch {
      /* modo privado o cuota llena: el brief sigue funcionando sin borrador */
    }
  }, [answers, needs, phase, safeIdx]);

  // El cursor va directo al campo cuando la pregunta necesita escribir.
  useEffect(() => {
    if (phase === "asking" && (step.kind === "text" || step.kind === "long" || step.kind === "email")) {
      fieldRef.current?.focus();
    }
  }, [phase, step]);

  function reset() {
    setNeeds([]);
    setAnswers({});
    setTexts({});
    setSelected({});
    setTrap("");
    setIdx(0);
    setEditing(false);
    setPhase("asking");
    setError(null);
    setConsent(false);
    startedAt.current = Date.now();
  }

  function loadDraft(): boolean {
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (!raw) return false;
      const saved = JSON.parse(raw) as SavedDraft;
      setNeeds(saved.needs ?? []);
      setAnswers(saved.answers ?? {});
      setTexts({});
      setSelected({});
      setIdx(typeof saved.idx === "number" ? saved.idx : 0);
      setEditing(false);
      setPhase("asking");
      setError(null);
      startedAt.current = Date.now();
      return true;
    } catch {
      return false;
    }
  }

  function openBrief() {
    if (!startedAt.current) startedAt.current = Date.now();
    if (hasDraft) loadDraft();
    setOpen(true);
  }

  function startFresh() {
    reset();
    try {
      window.localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* nada que borrar */
    }
    setOpen(true);
  }

  function goTo(at: number) {
    const clamped = Math.max(0, Math.min(at, steps.length - 1));
    const target = steps[clamped];
    setTexts((prev) => ({
      ...prev,
      [target.id]: prev[target.id] ?? answers[target.id] ?? "",
    }));
    setSelected((prev) => ({
      ...prev,
      [target.id]: prev[target.id] ?? preselect(target, answers[target.id]),
    }));
    setIdx(clamped);
    setError(null);
  }

  function advance(id: StepId) {
    if (editing) {
      setEditing(false);
      setPhase("review");
      return;
    }
    if (id === "needs") {
      goTo(1);
      return;
    }
    if (safeIdx >= steps.length - 1) {
      setPhase("review");
      return;
    }
    goTo(safeIdx + 1);
  }

  function commit(value: string, id: StepId = step.id) {
    const v = value.trim();
    const def = STEPS[locale][id];
    if (!v && !def.optional) {
      setError(t.errRequired);
      return;
    }
    if (def.kind === "email" && v && !EMAIL_RE.test(v)) {
      setError(t.errEmail);
      return;
    }
    setError(null);
    setAnswers((a) => ({ ...a, [id]: v }));
    advance(id);
  }

  function toggleNeed(id: string) {
    setNeeds((n) => (n.includes(id) ? n.filter((x) => x !== id) : [...n, id]));
  }

  function commitNeeds() {
    if (needs.length === 0) {
      setError(t.errRequired);
      return;
    }
    const labels = (STEPS[locale].needs.options ?? [])
      .filter((o) => needs.includes(o.id))
      .map((o) => o.label)
      .join(", ");
    setError(null);
    setAnswers((a) => ({ ...a, needs: labels }));
    advance("needs");
  }

  function togglePicked(label: string) {
    setSelected((prev) => {
      const current = prev[step.id] ?? [];
      return {
        ...prev,
        [step.id]: current.includes(label)
          ? current.filter((x) => x !== label)
          : [...current, label],
      };
    });
  }

  function commitMulti() {
    if (picked.length === 0 && !step.optional) {
      setError(t.errRequired);
      return;
    }
    commit(picked.join(", "));
  }

  function beginEdit(id: StepId) {
    const at = steps.findIndex((s) => s.id === id);
    if (at < 0) return;
    goTo(at);
    setEditing(true);
    setPhase("asking");
  }

  function goBack() {
    setEditing(false);
    if (safeIdx === 0) return;
    goTo(safeIdx - 1);
  }

  async function copyBrief() {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  async function submit() {
    if (!consent) return;
    setPhase("sending");
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          answers,
          name: answers.name ?? "",
          email: answers.email ?? "",
          need: answers.needs ?? "",
          consent: true,
          locale,
          elapsed: Date.now() - startedAt.current,
          trap,
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
        <button type="button" className="button contact-button" onClick={openBrief}>
          {hasDraft ? t.resume : t.start} <span aria-hidden>↗</span>
        </button>
        {hasDraft && (
          <button type="button" className="blim-link mono" onClick={startFresh}>
            {t.restart}
          </button>
        )}
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

      <div
        className="blim-progress"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        aria-label={`${t.step} ${safeIdx + 1} ${t.of} ${steps.length}`}
      >
        <span style={{ width: `${progress}%` }} />
      </div>
      <p className="blim-step mono">
        {`${t.step} ${safeIdx + 1} ${t.of} ${steps.length} · ${answered} ${t.answered}`}
      </p>

      <div className="blim-log mono" aria-live="polite">
        {transcript.map((m, i) => (
          <p key={i} className={`blim-msg blim-${m.from}`}>
            {m.from === "blim" ? <span aria-hidden>{face} </span> : null}
            {m.text}
          </p>
        ))}
      </div>

      {phase === "asking" && (
        <div className="blim-controls">
          {step.hint && <p className="blim-hint">{step.hint}</p>}

          {step.id === "needs" ? (
            <>
              <div className="blim-multi">
                {(step.options ?? []).map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    className={`blim-chip mono ${needs.includes(o.id) ? "on" : ""}`}
                    aria-pressed={needs.includes(o.id)}
                    onClick={() => toggleNeed(o.id)}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
              <div className="blim-nav mono">
                <button type="button" className="blim-confirm" onClick={commitNeeds}>
                  {t.next} →
                </button>
              </div>
            </>
          ) : step.kind === "multi" ? (
            <>
              <div className="blim-multi">
                {(step.options ?? []).map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    className={`blim-chip mono ${picked.includes(o.label) ? "on" : ""}`}
                    aria-pressed={picked.includes(o.label)}
                    onClick={() => togglePicked(o.label)}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
              <div className="blim-nav mono">
                <button type="button" className="blim-confirm" onClick={commitMulti}>
                  {t.next} →
                </button>
              </div>
            </>
          ) : step.kind === "single" ? (
            <div className="blim-choices-col">
              {(step.options ?? []).map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className="blim-choice-wide mono"
                  onClick={() => commit(o.label)}
                >
                  <strong>{o.label}</strong>
                  {o.desc ? <em>{o.desc}</em> : null}
                </button>
              ))}
            </div>
          ) : (
            <form
              className={step.kind === "long" ? "blim-input blim-input-long" : "blim-input"}
              onSubmit={(e) => {
                e.preventDefault();
                commit(draft);
              }}
            >
              <label className="sr-only" htmlFor="blim-field">
                {step.q}
              </label>
              {step.kind === "long" ? (
                <textarea
                  id="blim-field"
                  ref={(el) => {
                    fieldRef.current = el;
                  }}
                  className="blim-area"
                  value={draft}
                  maxLength={step.maxLen ?? MAX_LEN}
                  onChange={(e) =>
                    setTexts((prev) => ({ ...prev, [step.id]: e.target.value }))
                  }
                  placeholder={draft ? "" : step.ph}
                />
              ) : (
                <input
                  id="blim-field"
                  ref={(el) => {
                    fieldRef.current = el;
                  }}
                  value={draft}
                  maxLength={step.maxLen ?? MAX_LEN}
                  onChange={(e) =>
                    setTexts((prev) => ({ ...prev, [step.id]: e.target.value }))
                  }
                  placeholder={draft ? "" : step.ph}
                  autoComplete={step.kind === "email" ? "email" : step.id === "name" ? "name" : "off"}
                  inputMode={step.kind === "email" ? "email" : "text"}
                  type={step.kind === "email" ? "email" : "text"}
                />
              )}
              <button type="submit" className="blim-send mono">
                {t.next}
              </button>
              {step.kind === "long" && (
                <span className="blim-count mono">
                  {draft.length}/{step.maxLen ?? MAX_LEN} {t.chars}
                </span>
              )}
            </form>
          )}

          <div className="blim-nav mono">
            {(safeIdx > 0 || editing) && (
              <button type="button" className="blim-link" onClick={goBack}>
                ← {t.back}
              </button>
            )}
            {step.optional && (
              <button type="button" className="blim-link" onClick={() => commit("", step.id)}>
                {t.skip} →
              </button>
            )}
            {canFinish && !editing && safeIdx < steps.length - 1 && (
              <button
                type="button"
                className="blim-link"
                onClick={() => {
                  setEditing(false);
                  setPhase("review");
                }}
              >
                {t.toReview} →
              </button>
            )}
          </div>
        </div>
      )}

      {phase === "review" && (
        <div className="blim-review">
          <dl className="blim-summary mono">
            {steps.map((s) => (
              <div className="blim-review-row" key={s.id}>
                <dt>{s.label}</dt>
                <button type="button" className="blim-edit mono" onClick={() => beginEdit(s.id)}>
                  {t.edit}
                </button>
                <dd>{answers[s.id] || t.empty}</dd>
              </div>
            ))}
          </dl>

          <p className="blim-note">{t.dataNote}</p>
          <label className="blim-consent">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            <span>{t.consent}</span>
          </label>

          <div className="blim-nav mono">
            <button type="button" className="blim-link" onClick={copyBrief}>
              {copied ? <span className="blim-copied">{t.copied}</span> : t.copy}
            </button>
            <button
              type="button"
              className="blim-confirm mono"
              disabled={!consent}
              onClick={submit}
            >
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
            <button type="button" className="blim-link" onClick={startFresh}>
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
            <button type="button" className="blim-link" onClick={startFresh}>
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

      {/* Trampa anti-spam: invisible para personas, tentadora para bots.
          Debe viajar en el body: el endpoint descarta en silencio si viene cargada. */}
      <input
        type="text"
        name="trap"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="blim-trap"
        value={trap}
        onChange={(e) => setTrap(e.target.value)}
      />
    </div>
  );
}
