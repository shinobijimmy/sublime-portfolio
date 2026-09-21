"use client";

import { useState, useEffect } from "react";
import BlimContact from "./BlimContact";

type Locale = "es" | "en";
type ProjectCategory = "all" | "Real" | "Concept" | "Lab";

interface CaseStudy {
  status: string;
  category: "Real" | "Concept" | "Lab";
  title: string;
  shortDesc: string;
  tags: string;
  role: string;
  year: string;
  problem: string;
  solution: string;
  techSystem: string;
  label: string;
  href?: string;
  viewCaseLabel: string;
}

const content = {
  es: {
    switchLabel: "EN",
    project: "Iniciar un proyecto",
    based: "Basado en Argentina\nTrabajando remoto\n2026",
    hero: "Las ideas se vuelven identidad, interfaz y producto.",
    intro: "Una práctica independiente que une dirección de arte, diseño de producto y código.",
    practice: "Una idea no termina en un logo.",
    practiceText: "Diseñamos el sistema que conecta intención, uso y ejecución. Cada disciplina aparece cuando aporta claridad y una mejor experiencia.",
    work: "Trabajo seleccionado.",
    filterAll: "Todos",
    filterReal: "Real",
    filterConcept: "Concept",
    filterLab: "Lab",
    viewCase: "Ver Caso ↗",
    closeModal: "Cerrar ESC ✕",
    caseModalHead: "Ficha de Caso",
    caseProblemTitle: "01 / El Desafío",
    caseSolutionTitle: "02 / La Solución de Diseño",
    caseTechTitle: "03 / Arquitectura & Sistema",
    labTitle: "Laboratorio de Experimentación (I+D)",
    labSubtitle: "Un espacio de investigación aplicada donde cruzamos Diseño Gráfico (UX/UI), Inteligencia Artificial y Sistemas Operativos de Producto.",
    labDiscourse: [
      {
        title: "Diseño Gráfico & UX/UI",
        desc: "Sistemas tipográficos, grillas estrictas y jerarquía visual orientada a la claridad funcional y la expresividad de marca.",
      },
      {
        title: "Inteligencia Artificial",
        desc: "Automatización de ingesta de datos, síntesis curatorial y agentes especializados integrados directamente al flujo de desarrollo.",
      },
      {
        title: "Sistemas & Producto",
        desc: "Arquitecturas escalables, diseño de tokens de producto y metodologías operativas (Sublime OS) para iterar sin fricción.",
      },
    ],
    workItems: [
      {
        status: "01 / Real",
        category: "Real",
        title: "Oliver Sur",
        shortDesc: "Dirección digital integral para marca de ventiladores de techo premium: diseño del sitio, experiencia de catálogo y presencia de contenido visual.",
        tags: "WEB · CONTENT · SOCIAL\nART DIRECTION",
        role: "Dirección de Arte & Web Design",
        year: "2025 - 2026",
        problem: "Oliver Sur necesitaba consolidar su catálogo digital y presencia visual con una imagen moderna, sofisticada y funcional que proyecte la alta calidad de sus productos.",
        solution: "Diseño y desarrollo de una plataforma web minimalista orientada al producto, jerarquía tipográfica fuerte y un sistema de piezas visuales adaptables a redes sociales.",
        techSystem: "Web Architecture / Hostinger AI / Instagram Visual Grid",
        label: "Ver sitio ↗",
        href: "https://www.oliversurventiladores.com/",
        viewCaseLabel: "Ver Caso ↗",
      },
      {
        status: "02 / Real",
        category: "Real",
        title: "Estudio Brontes",
        shortDesc: "Diseño integral de portfolio digital para estudio de diseño industrial, estructurado para comunicar servicios, procesos y capacidades técnicas.",
        tags: "PORTFOLIO · WEB DESIGN\nINDUSTRIAL DESIGN STUDIO",
        role: "Dirección Visual & UX/UI",
        year: "2025 - 2026",
        problem: "Requerían una plataforma digital que comunique la rigurosidad técnica y la elegancia formal de su práctica de diseño industrial sin saturar la navegación.",
        solution: "Sistema de portfolio sobrio con grilla estricta, fichas de proyectos detalladas e integración visual del proceso de desarrollo de producto.",
        techSystem: "Next.js / Responsive Grid / Design System",
        label: "Ver sitio ↗",
        href: "https://estudiobrontes.com/",
        viewCaseLabel: "Ver Caso ↗",
      },
      {
        status: "03 / Publicado",
        category: "Real",
        title: "Club de Lectores",
        shortDesc: "Rediseño de plataforma editorial desde cero: nueva arquitectura de navegación y sistema de lectura continua en constante evolución.",
        tags: "UX · INFORMATION ARCHITECTURE\nEDITORIAL PLATFORM / VERCEL",
        role: "UX/UI & Fullstack Development",
        year: "2026",
        problem: "La plataforma previa presentaba fragmentación en la lectura, baja legibilidad mobile y limitaciones para estructurar hemerotecas, reseñas y ensayos.",
        solution: "Reorganización completa de la arquitectura de información, tipografía optimizada para lectura extensa y plataforma preparada para escalar a funciones comunitarias.",
        techSystem: "Vite / React / TypeScript / Node Express / Vercel",
        label: "Ver sitio ↗",
        href: "https://club-de-lectores-anonimos.vercel.app/",
        viewCaseLabel: "Ver Caso ↗",
      },
      {
        status: "04 / Concept · Lab",
        category: "Lab",
        title: "SND* (No Data)",
        shortDesc: "Plataforma experimental de descubrimiento musical e ingesta curada: transforma publicaciones editoriales en un catálogo visual continuo con cola de escucha.",
        tags: "AUDIO · UX/UI · IA · EXPERIMENTAL",
        role: "Product Concept, UX & AI Architecture",
        year: "2026",
        problem: "Los blogs de música experimental obligan a abrir plataformas por separado, perdiendo continuidad entre las portadas, los sellos y la sesión de escucha.",
        solution: "Prototipo publicado y navegable: catálogo visual de lanzamientos, búsqueda y filtros por año, cola de escucha persistente, dossier por release y Studio Mixer de doble deck. Reproducción por reproductor oficial de Bandcamp/YouTube o archivos locales que no se suben.",
        techSystem: "YouTube Data API con ranking / Reproductor oficial Bandcamp / Cola persistente / Studio Mixer de doble deck",
        label: "Ver prototipo ↗",
        href: "https://snd-steel.vercel.app/",
        viewCaseLabel: "Ver Caso ↗",
      },
    ] as CaseStudy[],
    capabilities: "Un sistema. Varias escalas.",
    method: "De intención a sistema.",
    contact: "¿Tenés algo que necesita tomar forma?",
    contactText: "Contanos dónde estás, qué querés construir y qué necesitás resolver.",
    capabilityItems: [
      ["Identity", "Estrategia visual, identidad, dirección de arte y sistemas de marca."],
      ["Digital", "Sitios, ecommerce, campañas y experiencias web."],
      ["Product", "UX/UI, flujos, interfaces y sistemas de diseño."],
      ["Technology", "Frontend, integraciones, automatización e IA aplicada cuando aporta valor."],
    ],
  },
  en: {
    switchLabel: "ES",
    project: "Start a project",
    based: "Based in Argentina\nWorking remotely\n2026",
    hero: "Ideas become identity, interface and product.",
    intro: "An independent practice combining art direction, product design and code.",
    practice: "An idea does not end with a logo.",
    practiceText: "We design the system connecting intent, use and execution. Each discipline appears when it brings clarity and a better experience.",
    work: "Selected work.",
    filterAll: "All",
    filterReal: "Real",
    filterConcept: "Concept",
    filterLab: "Lab",
    viewCase: "View Case ↗",
    closeModal: "Close ESC ✕",
    caseModalHead: "Case Study Detail",
    caseProblemTitle: "01 / The Challenge",
    caseSolutionTitle: "02 / The Design Solution",
    caseTechTitle: "03 / Architecture & System",
    labTitle: "Experimental Lab (R&D)",
    labSubtitle: "An applied research space crossing Graphic Design (UX/UI), Artificial Intelligence and Product Operating Systems.",
    labDiscourse: [
      {
        title: "Graphic & UX/UI Design",
        desc: "Typographic systems, strict grids and visual hierarchy focused on functional clarity and brand expression.",
      },
      {
        title: "Artificial Intelligence",
        desc: "Data ingestion automation, curatorial synthesis and specialized agents integrated directly into the workflow.",
      },
      {
        title: "Systems & Product",
        desc: "Scalable architectures, product token design and operational frameworks (Sublime OS) for frictionless iteration.",
      },
    ],
    workItems: [
      {
        status: "01 / Real",
        category: "Real",
        title: "Oliver Sur",
        shortDesc: "End-to-end digital direction for a premium ceiling-fan brand: website design, catalogue experience and visual content presence.",
        tags: "WEB · CONTENT · SOCIAL\nART DIRECTION",
        role: "Art Direction & Web Design",
        year: "2025 - 2026",
        problem: "Oliver Sur needed to consolidate its digital catalogue and visual identity with a modern, sophisticated image reflecting product quality.",
        solution: "Design and development of a minimalist product-focused web platform, crisp typographic hierarchy, and flexible social media assets.",
        techSystem: "Web Architecture / Hostinger AI / Instagram Visual Grid",
        label: "View site ↗",
        href: "https://www.oliversurventiladores.com/",
        viewCaseLabel: "View Case ↗",
      },
      {
        status: "02 / Real",
        category: "Real",
        title: "Estudio Brontes",
        shortDesc: "Full portfolio design for an industrial design studio, built to present projects, technical capabilities and design vision.",
        tags: "PORTFOLIO · WEB DESIGN\nINDUSTRIAL DESIGN STUDIO",
        role: "Visual Direction & UX/UI",
        year: "2025 - 2026",
        problem: "They required a digital platform to showcase the technical precision and formal elegance of their industrial design practice.",
        solution: "Understated portfolio system featuring a strict grid, detailed project files, and visual integration of the product development lifecycle.",
        techSystem: "Next.js / Responsive Grid / Design System",
        label: "View site ↗",
        href: "https://estudiobrontes.com/",
        viewCaseLabel: "View Case ↗",
      },
      {
        status: "03 / Live",
        category: "Real",
        title: "Club de Lectores",
        shortDesc: "An editorial blog redesign from the ground up: renewed navigation architecture and a continuous reading platform built to scale.",
        tags: "UX · INFORMATION ARCHITECTURE\nEDITORIAL PLATFORM / VERCEL",
        role: "UX/UI & Fullstack Development",
        year: "2026",
        problem: "The previous blog suffered from fragmented reading flows, poor mobile readability, and constraints when managing long-form essays.",
        solution: "Complete overhaul of information architecture, long-read optimized typography, and a backend ready to scale into community features.",
        techSystem: "Vite / React / TypeScript / Node Express / Vercel",
        label: "View site ↗",
        href: "https://club-de-lectores-anonimos.vercel.app/",
        viewCaseLabel: "View Case ↗",
      },
      {
        status: "04 / Concept · Lab",
        category: "Lab",
        title: "SND* (No Data)",
        shortDesc: "Experimental music discovery & curated ingestion platform: turns editorial selections into a continuous visual catalogue with integrated audio player.",
        tags: "AUDIO · UX/UI · AI · EXPERIMENTAL",
        role: "Product Concept, UX & AI Architecture",
        year: "2026",
        problem: "Experimental music blogs force listeners across disconnected services, breaking continuity between cover art, record labels, and audio sessions.",
        solution: "Deployed, navigable prototype: visual release catalogue with search and year filters, persistent listening queue, per-release dossier and a dual-deck Studio Mixer. Playback via official Bandcamp/YouTube players or local files that are never uploaded.",
        techSystem: "Ranked YouTube Data API / Official Bandcamp player / Persistent queue / Dual-deck Studio Mixer",
        label: "View prototype ↗",
        href: "https://snd-steel.vercel.app/",
        viewCaseLabel: "View Case ↗",
      },
    ] as CaseStudy[],
    capabilities: "One system. Multiple scales.",
    method: "From intention to system.",
    contact: "Have something that needs to take shape?",
    contactText: "Tell us where you are, what you want to build and what you need to solve.",
    capabilityItems: [
      ["Identity", "Visual strategy, identity, art direction and brand systems."],
      ["Digital", "Websites, ecommerce, campaigns and web experiences."],
      ["Product", "UX/UI, flows, interfaces and design systems."],
      ["Technology", "Frontend, integrations, automation and AI when it adds value."],
    ],
  },
} as const;

const steps = ["Context", "Direction", "System", "Build", "Evolve"];

export default function Home() {
  const [locale, setLocale] = useState<Locale>("es");
  const [categoryFilter, setCategoryFilter] = useState<ProjectCategory>("all");
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const t = content[locale];

  // Filter projects according to category tab
  const filteredWork = t.workItems.filter((item) => {
    if (categoryFilter === "all") return true;
    return item.category === categoryFilter;
  });

  // Sincroniza el idioma del documento con el toggle ES/EN.
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  // Cierra el panel móvil al pasar a un ancho donde vuelve la navegación completa.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 761px)");
    const onChange = () => {
      if (mq.matches) setMenuOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Handle ESC key to close modal and mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedCase(null);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <main id="main">
      <section className="hero shell" id="top">
        <header className="topbar">
          <a className="brand" href="#top">
            SUBLIME
          </a>
          <nav className="nav" aria-label="Primary navigation">
            <div className="nav-links mono">
              <a href="#top">Home</a>
              <a href="#work">Work</a>
              <a href="#capabilities">Capabilities</a>
              <a href="#method">Method</a>
              <a href="#lab">Lab</a>
            </div>
            <button
              className="language mono"
              type="button"
              aria-label={`Cambiar idioma a ${t.switchLabel}`}
              onClick={() => setLocale(locale === "es" ? "en" : "es")}
            >
              {locale.toUpperCase()} / {t.switchLabel}
            </button>
            <a className="button" href="#contact">
              {t.project} <span aria-hidden>↗</span>
            </a>
            <button
              className="menu-toggle mono"
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="bars" aria-hidden>
                <span />
                <span />
                <span />
              </span>
              {menuOpen ? "Cerrar" : "Menú"}
            </button>
          </nav>
          {menuOpen && (
            <nav
              id="mobile-nav"
              className="nav-panel mono"
              aria-label="Navegación móvil"
              onClick={() => setMenuOpen(false)}
            >
              <a href="#top">Home</a>
              <a href="#work">Work</a>
              <a href="#capabilities">Capabilities</a>
              <a href="#method">Method</a>
              <a href="#lab">Lab</a>
              <a href="#contact">{t.project}</a>
            </nav>
          )}
        </header>
        <div className="hero-grid">
          <p className="meta mono">{t.based}</p>
          <div className="hero-copy">
            <h1>{t.hero}</h1>
            <p className="lede">{t.intro}</p>
            <a className="button" href="#contact">
              {t.project} <span aria-hidden>↗</span>
            </a>
          </div>
          <div className="wordmark" aria-hidden>
            SUBLIME
          </div>
        </div>
      </section>

      {/* Practice Section */}
      <section className="black shell">
        <div className="layout">
          <p className="eyebrow mono">01 / Practice</p>
          <div className="statement">
            <h2>{t.practice}</h2>
            <p className="body-copy">{t.practiceText}</p>
            <p className="pipeline">
              Brand <span>→</span> Identity <span>→</span> Interface <span>→</span> Product <span>→</span> Technology
            </p>
          </div>
        </div>
      </section>

      {/* Work Section */}
      <section className="black shell" id="work">
        <div className="layout">
          <p className="eyebrow mono">02 / Selected work</p>
          <div className="statement">
            <h2>{t.work}</h2>

            {/* Filter Tabs */}
            <div className="filter-bar mono">
              <button
                type="button"
                className={`filter-btn ${categoryFilter === "all" ? "active" : ""}`}
                onClick={() => setCategoryFilter("all")}
              >
                [ {t.filterAll} ]
              </button>
              <button
                type="button"
                className={`filter-btn ${categoryFilter === "Real" ? "active" : ""}`}
                onClick={() => setCategoryFilter("Real")}
              >
                [ {t.filterReal} ]
              </button>
              <button
                type="button"
                className={`filter-btn ${categoryFilter === "Concept" ? "active" : ""}`}
                onClick={() => setCategoryFilter("Concept")}
              >
                [ {t.filterConcept} ]
              </button>
              <button
                type="button"
                className={`filter-btn ${categoryFilter === "Lab" ? "active" : ""}`}
                onClick={() => setCategoryFilter("Lab")}
              >
                [ {t.filterLab} ]
              </button>
            </div>

            {/* Work Items List */}
            <div className="work-list">
              {filteredWork.map((item) => (
                <article className="work-card" key={item.title}>
                  <span className="mono">{item.status}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.shortDesc}</p>
                  </div>
                  <div className="work-meta">
                    <p className="mono">{item.tags}</p>
                    <div className="work-actions">
                      <button
                        type="button"
                        className="work-link case-btn"
                        onClick={() => setSelectedCase(item)}
                      >
                        {item.viewCaseLabel}
                      </button>
                      {item.href && (
                        <a
                          className="work-link"
                          href={item.href}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {item.label}
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="coral shell" id="capabilities">
        <div className="layout">
          <p className="eyebrow mono">03 / Capabilities</p>
          <div className="statement">
            <h2>{t.capabilities}</h2>
            <div className="capabilities">
              {t.capabilityItems.map(([title, description], index) => (
                <article className="capability" key={title}>
                  <span className="mono">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Method Section */}
      <section className="coral shell" id="method">
        <div className="layout">
          <p className="eyebrow mono">04 / Method</p>
          <div className="statement">
            <h2>{t.method}</h2>
            <div className="method">
              {steps.map((step, index) => (
                <article className="step" key={step}>
                  <span className="mono">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{step}</h3>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LAB Section (I+D) */}
      <section className="black shell" id="lab">
        <div className="layout">
          <p className="eyebrow mono">05 / Lab (I+D)</p>
          <div className="statement">
            <h2>{t.labTitle}</h2>
            <p className="body-copy">{t.labSubtitle}</p>

            <div className="lab-grid">
              {t.labDiscourse.map((pillar, idx) => (
                <article className="lab-card" key={pillar.title}>
                  <span className="mono">PILLAR 0{idx + 1}</span>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact black shell" id="contact">
        <p className="mono">06 / Contact</p>
        <h2>{t.contact}</h2>
        <p className="body-copy">{t.contactText}</p>
        <BlimContact locale={locale} />
      </section>

      {/* Footer */}
      <footer className="footer shell mono">
        <span>© 2026 Sublime Lab</span>
        <span>Design / Product / Code</span>
      </footer>

      {/* Case Study Detail Modal Overlay */}
      {selectedCase && (
        <div className="modal-backdrop" onClick={() => setSelectedCase(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="modal-header">
              <span className="mono">{t.caseModalHead} — {selectedCase.status}</span>
              <button
                type="button"
                className="modal-close mono"
                onClick={() => setSelectedCase(null)}
              >
                {t.closeModal}
              </button>
            </div>

            <div className="modal-body">
              <h2 id="modal-title">{selectedCase.title}</h2>
              <div className="modal-meta-row mono">
                <span>ROL: {selectedCase.role}</span>
                <span>AÑO: {selectedCase.year}</span>
                <span>CATEGORÍA: {selectedCase.category}</span>
              </div>

              <div className="modal-grid">
                <div className="modal-section">
                  <h4 className="mono">{t.caseProblemTitle}</h4>
                  <p>{selectedCase.problem}</p>
                </div>

                <div className="modal-section">
                  <h4 className="mono">{t.caseSolutionTitle}</h4>
                  <p>{selectedCase.solution}</p>
                </div>

                <div className="modal-section">
                  <h4 className="mono">{t.caseTechTitle}</h4>
                  <p className="mono highlight">{selectedCase.techSystem}</p>
                </div>
              </div>

              <div className="modal-footer">
                {selectedCase.href ? (
                  <a
                    className="button"
                    href={selectedCase.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {selectedCase.label}
                  </a>
                ) : (
                  <span className="mono">PROYECTO EN LAB / INVESTIGACIÓN INTERNA</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

