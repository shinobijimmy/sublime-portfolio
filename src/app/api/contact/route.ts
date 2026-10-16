import { NextResponse } from "next/server";
import { Resend } from "resend";

// La ruta necesita Node para el SDK de Resend y para el limitador en memoria.
export const runtime = "nodejs";

/**
 * Destino y credencial se leen SOLO de entorno. Nunca se hardcodean.
 * - RESEND_API_KEY (obligatoria)
 * - CONTACT_TO (obligatoria)
 * - CONTACT_FROM (opcional; por defecto el remitente de pruebas de Resend)
 */
const CONTACT_TO = process.env.CONTACT_TO;
const CONTACT_FROM =
  process.env.CONTACT_FROM ?? "Sublime Lab <onboarding@resend.dev>";

const MAX_FIELD = 1200;
const MAX_TOTAL = 6000;
const WINDOW_MS = 60 * 60 * 1000; // 1 hora
const MAX_PER_WINDOW = 5;

/**
 * Etiquetas del correo interno, en el orden en que se arma el brief.
 * Es una lista blanca: cualquier clave desconocida del body se ignora.
 */
const LABELS: Record<string, string> = {
  needs: "Necesita",
  identityStage: "Punto de partida de la marca",
  identityScope: "Alcance de la identidad",
  webType: "Tipo de sitio",
  webFeatures: "Funciones del sitio",
  productType: "Tipo de producto",
  productUsers: "Usuarios del producto",
  contentTypes: "Tipo de contenido",
  contentVolume: "Volumen de contenido",
  context: "Contexto",
  goal: "Objetivo",
  success: "Señal de éxito",
  references: "Referencias",
  deadline: "Plazo",
  decision: "Quién decide",
  extras: "Algo más",
  org: "Marca o empresa",
};

const ANSWER_KEYS = Object.keys(LABELS);

// Limitador simple en memoria. Suficiente para una landing de una sola instancia.
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const prev = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (prev.length >= MAX_PER_WINDOW) {
    hits.set(ip, prev);
    return true;
  }
  prev.push(now);
  hits.set(ip, prev);
  return false;
}

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "desconocida";
}

const clean = (v: unknown, max = MAX_FIELD): string =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

const escapeHtml = (s: string): string =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string)
  );

export async function POST(req: Request) {
  if (!CONTACT_TO) {
    return NextResponse.json(
      { ok: false, error: "contact_not_configured" },
      { status: 503 }
    );
  }
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { ok: false, error: "mail_not_configured" },
      { status: 503 }
    );
  }

  const ip = clientIp(req);
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  // Trampa anti-spam: campo oculto que solo completan los bots.
  if (clean(body.trap)) {
    return NextResponse.json({ ok: true }); // se descarta en silencio
  }

  // El brief llega como { answers: {...}, name, email, need, consent, locale, elapsed }.
  const rawAnswers =
    body.answers && typeof body.answers === "object"
      ? (body.answers as Record<string, unknown>)
      : {};
  const src: Record<string, unknown> = { ...rawAnswers };
  for (const key of ["name", "email", "need", "org"]) {
    if (body[key] !== undefined) src[key] = body[key];
  }

  const answers: Record<string, string> = {};
  let total = 0;
  for (const key of ANSWER_KEYS) {
    const value = clean(src[key]);
    if (!value) continue;
    answers[key] = value;
    total += value.length;
  }

  const name = clean(src.name, 120);
  const email = clean(src.email, 200);
  const need = clean(answers.needs ?? src.need, 120);
  const locale = clean(body.locale, 5) === "en" ? "en" : "es";
  const consent = body.consent === true;
  // Tiempo mínimo de completado: los bots envían en milisegundos.
  const elapsed = Number(body.elapsed ?? 0);

  // Núcleo obligatorio: sin esto el brief no es accionable.
  if (!name || !email || !need || !answers.context || !answers.goal) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }
  if (!consent) {
    return NextResponse.json({ ok: false, error: "missing_consent" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }
  if (total + name.length + email.length > MAX_TOTAL) {
    return NextResponse.json({ ok: false, error: "too_long" }, { status: 413 });
  }
  if (elapsed > 0 && elapsed < 2000) {
    return NextResponse.json({ ok: false, error: "too_fast" }, { status: 400 });
  }

  const rows: Array<[string, string]> = ANSWER_KEYS.filter((key) => answers[key]).map(
    (key) => [LABELS[key], answers[key]]
  );
  rows.push(["Nombre", name], ["Email", email], ["Idioma", locale]);

  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html = `<h2>Nuevo brief desde sublimelab</h2><table cellpadding="6">${rows
    .map(
      ([k, v]) =>
        `<tr><td><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v).replace(
          /\n/g,
          "<br>"
        )}</td></tr>`
    )
    .join("")}</table>`;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const message = {
      from: CONTACT_FROM,
      to: [CONTACT_TO],
      replyTo: email,
      subject: `Brief · ${need.slice(0, 60)} · ${name}`,
      text,
      html,
    };

    // La UI promete una copia al visitante: viaja como bcc del mismo mensaje.
    let resultado = await resend.emails.send({ ...message, bcc: [email] });

    // Si la copia hace fallar el envio, el brief no se pierde: se reintenta sin copia.
    if (resultado.error) {
      console.error(
        "[api/contact] fallo con copia al visitante, reintento sin copia:",
        resultado.error
      );
      resultado = await resend.emails.send(message);
    }

    if (resultado.error) {
      console.error("[api/contact] Resend devolvio error:", resultado.error);
      return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/contact] fallo inesperado:", err);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 500 });
  }
}
