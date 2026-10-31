import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Precios de referencia",
  description:
    "Valores de referencia de Sublime Lab para diagnóstico, sitios, producto, IA y programas de fidelización. No constituyen una cotización.",
  alternates: { canonical: "/precios" },
  robots: { index: false, follow: false },
};

type Item = { name: string; detail: string; price: string };

const blocks: Array<{ id: string; kicker: string; title: string; intro: string; items: Item[] }> = [
  {
    id: "diagnostico",
    kicker: "01 / Diagnóstico",
    title: "Primero, saber qué pasa",
    intro:
      "Antes de proponer un rediseño, medimos. Estos dos servicios existen para decidir con datos y no con intuición.",
    items: [
      {
        name: "Diagnóstico web",
        detail:
          "Auditoría de rendimiento, SEO, conversión, accesibilidad y seguridad. Informe con evidencia, prioridades y llamada de 45 minutos.",
        price: "USD 190",
      },
      {
        name: "Sprint de corrección",
        detail:
          "Hasta cinco correcciones priorizadas sobre un sitio existente, con medición antes y después.",
        price: "USD 690",
      },
    ],
  },
  {
    id: "presencia",
    kicker: "02 / Presencia digital",
    title: "Un sitio que trabaja",
    intro:
      "El rango depende de cuánto hay que diseñar, escribir, integrar y medir. No es lo mismo una landing de una semana que un sitio institucional completo.",
    items: [
      {
        name: "Landing simple",
        detail: "Hasta 6 secciones, copy revisado, formulario y publicación.",
        price: "USD 350 – 700",
      },
      {
        name: "Landing personalizada",
        detail: "Dirección de arte propia, contenido a medida, animación e integraciones.",
        price: "USD 900 – 1.900",
      },
      {
        name: "Sitio institucional",
        detail: "8 a 12 páginas, casos, CMS, SEO técnico y capacitación de una hora.",
        price: "USD 1.500 – 3.400",
      },
      {
        name: "Catálogo digital",
        detail:
          "Productos o piezas con búsqueda, filtros y ficha. Sin pagos online salvo que se pidan.",
        price: "USD 500 – 1.200",
      },
    ],
  },
  {
    id: "marca",
    kicker: "03 / Marca",
    title: "Identidad para una etapa nueva",
    intro: "Cuando el problema no es la web sino cómo se ve y cómo se explica lo que hacés.",
    items: [
      {
        name: "Identidad visual",
        detail: "Sistema de marca: tipografía, color, composición y aplicaciones clave.",
        price: "USD 300 – 900",
      },
      {
        name: "Dirección de arte",
        detail: "Criterio visual y piezas para campañas, editorial o producto.",
        price: "A cotizar",
      },
    ],
  },
  {
    id: "producto",
    kicker: "04 / Producto y tecnología",
    title: "Cuando hace falta construir",
    intro:
      "Aplicaciones, automatizaciones y experiencias. Acá el alcance manda: se cotiza después de una definición funcional.",
    items: [
      {
        name: "Aplicación web",
        detail:
          "Flujos, autenticación, panel, base de datos e integraciones. Desde un MVP hasta un sistema en producción.",
        price: "USD 1.500 – 5.000",
      },
      {
        name: "Automatización con IA",
        detail:
          "Asistentes, clasificación, procesamiento documental o flujos internos con revisión humana.",
        price: "USD 500 – 2.000",
      },
      {
        name: "Experiencia AR",
        detail: "WebAR, filtros o experiencias interactivas para eventos y campañas.",
        price: "USD 500 – 2.500",
      },
      {
        name: "Mapping audiovisual",
        detail: "Contenido y puesta para instalaciones o eventos.",
        price: "USD 1.000 – 4.000",
      },
    ],
  },
];

const packs = [
  {
    name: "START",
    price: "USD 450",
    for: "Negocio chico que necesita existir bien",
    includes: [
      "Landing de una página",
      "Diseño responsive",
      "Formulario de contacto",
      "Integración con mensajería",
      "SEO técnico básico",
      "Publicación",
    ],
  },
  {
    name: "BUSINESS",
    price: "USD 1.200",
    for: "Empresa que necesita presencia y proceso comercial",
    includes: [
      "Sitio institucional",
      "Diseño personalizado",
      "Catálogo o servicios",
      "Formularios",
      "Integraciones básicas",
      "Analítica",
      "Automatización inicial",
    ],
  },
  {
    name: "CUSTOM",
    price: "Desde USD 2.500",
    for: "Producto, plataforma o experiencia",
    includes: [
      "Aplicaciones",
      "Integraciones",
      "IA",
      "Plataformas",
      "Experiencias AR",
      "Sistemas comerciales",
    ],
  },
];

const cafes: Item[] = [
  {
    name: "Sellos",
    detail: "Tarjeta digital, QR, una recompensa, panel de altas y canjes. Sin app store.",
    price: "USD 390 + 90/mes",
  },
  {
    name: "Gamificación",
    detail: "Sellos, misiones, niveles, rachas, ranking y tres recompensas con campañas.",
    price: "USD 890 + 180/mes",
  },
  {
    name: "Local adicional",
    detail: "Segunda sucursal sobre el mismo programa.",
    price: "+USD 150 + 45/mes",
  },
  {
    name: "App propia",
    detail:
      "Apps iOS y Android con la marca del comercio, notificaciones y geofencing. Solo multi-local.",
    price: "Desde USD 4.900 + 350/mes",
  },
  {
    name: "Piloto · 3 cupos",
    detail: "Programa de sellos por tres meses, con caso de estudio y datos compartidos.",
    price: "USD 290 + 75/mes",
  },
];

function PriceRow({ item }: { item: Item }) {
  return (
    <li className="pr-row">
      <div className="pr-row-main">
        <h3>{item.name}</h3>
        <p>{item.detail}</p>
      </div>
      <div className="pr-price mono">{item.price}</div>
    </li>
  );
}

export default function PreciosPage() {
  return (
    <div className="pr-page">
      <style>{`
        .pr-page{background:var(--ink);color:var(--paper);min-height:100vh}
        .pr-top{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:22px clamp(20px,4.4vw,68px);border-bottom:1px solid var(--line)}
        .pr-brand{font:900 clamp(24px,4vw,34px)/.8 var(--font-inter-tight),sans-serif;letter-spacing:-.075em;text-transform:uppercase}
        .pr-brand span{color:var(--coral)}
        .pr-back{font:500 10px/1 var(--font-mono),monospace;text-transform:uppercase;letter-spacing:.06em;border-bottom:1px solid currentColor;padding-bottom:4px}
        .pr-back:hover{color:var(--coral)}
        .pr-hero{padding:clamp(56px,10vw,130px) clamp(20px,4.4vw,68px) clamp(40px,7vw,80px);border-bottom:1px solid var(--line)}
        .pr-kicker{font:500 11px/1.2 var(--font-mono),monospace;letter-spacing:.08em;text-transform:uppercase;color:var(--steel)}
        .pr-hero h1{margin:18px 0 0;font:900 clamp(44px,10vw,120px)/.86 var(--font-inter-tight),sans-serif;letter-spacing:-.075em;text-transform:uppercase}
        .pr-lede{max-width:58ch;margin-top:22px;font-size:18px;line-height:1.45;color:var(--steel)}
        .pr-lede b{color:var(--paper);font-weight:500}
        .pr-note{display:flex;flex-wrap:wrap;gap:8px 18px;margin-top:26px;padding:14px 16px;border:1px solid var(--line);font:500 10px/1.5 var(--font-mono),monospace;text-transform:uppercase;letter-spacing:.04em;color:var(--steel)}
        .pr-note b{color:var(--coral);font-weight:500}
        .pr-section{padding:clamp(44px,7vw,80px) clamp(20px,4.4vw,68px);border-bottom:1px solid var(--line)}
        .pr-section-head{display:grid;gap:12px;margin-bottom:28px}
        .pr-section h2{font:900 clamp(30px,5vw,60px)/.94 var(--font-inter-tight),sans-serif;letter-spacing:-.06em;text-transform:uppercase}
        .pr-section-intro{max-width:62ch;color:var(--steel);font-size:16px;line-height:1.5}
        .pr-list{list-style:none;margin:0;padding:0;border-top:1px solid var(--line)}
        .pr-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px 28px;align-items:start;padding:18px 0;border-bottom:1px solid var(--line)}
        .pr-row h3{font:800 clamp(20px,2.4vw,28px)/1 var(--font-inter-tight),sans-serif;letter-spacing:-.04em;text-transform:uppercase}
        .pr-row p{margin-top:7px;max-width:58ch;color:var(--steel);font-size:14px;line-height:1.45}
        .pr-price{font:500 13px/1.4 var(--font-mono),monospace;color:var(--coral);text-align:right;white-space:nowrap;padding-top:4px}
        .pr-packs{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;padding:clamp(44px,7vw,80px) clamp(20px,4.4vw,68px);background:var(--coral);color:var(--ink)}
        .pr-packs .pr-kicker{color:var(--ink)}
        .pr-packs h2{margin:12px 0 0;font:900 clamp(30px,5vw,60px)/.94 var(--font-inter-tight),sans-serif;letter-spacing:-.06em;text-transform:uppercase}
        .pr-pack{border:2px solid var(--ink);padding:18px;display:flex;flex-direction:column;gap:10px;min-height:100%}
        .pr-pack h3{font:900 26px/1 var(--font-inter-tight),sans-serif;letter-spacing:-.05em;text-transform:uppercase}
        .pr-pack .pr-pack-price{font:500 14px/1 var(--font-mono),monospace}
        .pr-pack .pr-pack-for{font-size:13px;line-height:1.4;opacity:.8}
        .pr-pack ul{list-style:none;margin:6px 0 0;padding:0;display:grid;gap:6px;font-size:12px;line-height:1.35}
        .pr-pack li{padding-left:12px;position:relative}
        .pr-pack li::before{content:"+";position:absolute;left:0;font-weight:700}
        .pr-cafes{padding:clamp(44px,7vw,80px) clamp(20px,4.4vw,68px);border-bottom:1px solid var(--line)}
        .pr-cafes .pr-note{margin-top:18px}
        .pr-how{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px;margin-top:24px}
        .pr-how div{border:1px solid var(--line);padding:16px}
        .pr-how b{display:block;font:500 10px/1.4 var(--font-mono),monospace;text-transform:uppercase;letter-spacing:.06em;color:var(--coral);margin-bottom:6px}
        .pr-how p{font-size:13px;line-height:1.45;color:var(--steel)}
        .pr-cta{padding:clamp(44px,7vw,90px) clamp(20px,4.4vw,68px);display:flex;flex-wrap:wrap;gap:18px;align-items:center;justify-content:space-between}
        .pr-cta h2{font:900 clamp(30px,5vw,58px)/.94 var(--font-inter-tight),sans-serif;letter-spacing:-.06em;text-transform:uppercase;max-width:16ch}
        .pr-cta .button{background:var(--coral);color:var(--ink);border-color:var(--coral)}
        .pr-foot{display:flex;flex-wrap:wrap;gap:8px 20px;justify-content:space-between;padding:20px clamp(20px,4.4vw,68px);border-top:1px solid var(--line);font:500 10px/1.5 var(--font-mono),monospace;text-transform:uppercase;letter-spacing:.04em;color:var(--steel)}
        @media (max-width:640px){
          .pr-row{grid-template-columns:1fr;gap:8px}
          .pr-price{text-align:left;padding-top:0}
          .pr-hero h1{font-size:clamp(38px,12vw,64px)}
        }
        @media print{
          .pr-page{background:#fff;color:#000}
          .pr-top,.pr-back{display:none}
          .pr-packs{background:#fff;color:#000;border-block:2px solid #000}
          .pr-price{color:#000}
          .pr-row{break-inside:avoid}
        }
      `}</style>

      <header className="pr-top">
        <a className="pr-brand" href="/">
          Sublime<span>Lab</span>
        </a>
        <a className="pr-back" href="/">
          ← Volver al sitio
        </a>
      </header>

      <main>
        <section className="pr-hero">
          <p className="pr-kicker">Precios de referencia · v0.1 · 31/10/2026</p>
          <h1>
            Precios claros,
            <br />
            alcance claro.
          </h1>
          <p className="pr-lede">
            No vendemos “una página”. Vendemos un problema resuelto y un sistema que se puede
            mantener. Por eso hay <b>rangos</b>: el número final depende del alcance, las
            integraciones y el plazo. Todo lo que sigue es una referencia para conversar, no una
            cotización.
          </p>
          <div className="pr-note">
            <span>
              <b>Moneda:</b> USD de referencia
            </span>
            <span>
              <b>Pesos:</b> al tipo de cambio del día
            </span>
            <span>
              <b>Impuestos:</b> no incluidos
            </span>
            <span>
              <b>Validez:</b> 15 días
            </span>
          </div>
        </section>

        {blocks.map((block) => (
          <section className="pr-section" key={block.id} aria-labelledby={`pr-${block.id}`}>
            <div className="pr-section-head">
              <p className="pr-kicker">{block.kicker}</p>
              <h2 id={`pr-${block.id}`}>{block.title}</h2>
              <p className="pr-section-intro">{block.intro}</p>
            </div>
            <ul className="pr-list">
              {block.items.map((item) => (
                <PriceRow key={item.name} item={item} />
              ))}
            </ul>
          </section>
        ))}

        <section className="pr-packs" aria-labelledby="pr-packs">
          <div>
            <p className="pr-kicker">05 / Paquetes</p>
            <h2 id="pr-packs">Tres puntos de partida</h2>
          </div>
          {packs.map((pack) => (
            <article className="pr-pack" key={pack.name}>
              <h3>{pack.name}</h3>
              <div className="pr-pack-price">{pack.price}</div>
              <p className="pr-pack-for">{pack.for}</p>
              <ul>
                {pack.includes.map((inc) => (
                  <li key={inc}>{inc}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="pr-cafes" aria-labelledby="pr-cafes">
          <div className="pr-section-head">
            <p className="pr-kicker">06 / Cafés y comercios</p>
            <h2 id="pr-cafes">Volver, sin tarjeta de papel</h2>
            <p className="pr-section-intro">
              Programas de fidelización y gamificación para cafeterías, panaderías y comercios con
              recurrencia. Incluye implementación, panel, hosting y soporte.
            </p>
          </div>
          <ul className="pr-list">
            {cafes.map((item) => (
              <PriceRow key={item.name} item={item} />
            ))}
          </ul>
          <div className="pr-note">
            <span>
              <b>Piloto:</b> 3 cupos, 3 meses, con caso de estudio
            </span>
            <span>
              <b>No incluye:</b> hardware, contenido, integración con POS
            </span>
          </div>
        </section>

        <section className="pr-section" aria-labelledby="pr-how">
          <div className="pr-section-head">
            <p className="pr-kicker">07 / Cómo se define</p>
            <h2 id="pr-how">El precio sale del alcance</h2>
          </div>
          <div className="pr-how">
            <div>
              <b>Alcance</b>
              <p>Cantidad de páginas, flujos, integraciones y contenidos a producir.</p>
            </div>
            <div>
              <b>Horas</b>
              <p>Trabajo real estimado, con margen para revisiones incluidas.</p>
            </div>
            <div>
              <b>Riesgo</b>
              <p>Dependencias externas, datos, legales o técnicas que pueden cambiar el plan.</p>
            </div>
            <div>
              <b>Plazo</b>
              <p>La urgencia se paga: comprime el calendario y suma costo.</p>
            </div>
          </div>
        </section>

        <section className="pr-cta">
          <h2>¿Lo bajamos a tu caso?</h2>
          <a className="button" href="/#contact">
            Pedir una cotización
          </a>
        </section>
      </main>

      <footer className="pr-foot">
        <span>Sublime Lab · Precios de referencia v0.1</span>
        <span>No constituyen oferta ni cotización</span>
        <span>Actualizado 31/10/2026</span>
      </footer>
    </div>
  );
}
