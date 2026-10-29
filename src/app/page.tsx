"use client";

import { useState, useEffect, useRef } from "react";
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
  label?: string;
  href?: string;
  viewCaseLabel: string;
  /** Piezas del trabajo. La primera se usa como preview en el listado. */
  previews?: Preview[];
}

interface Preview {
  src: string;
  alt: string;
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
    metaRole: "Rol",
    metaYear: "Año",
    metaCategory: "Categoría",
    noLinkReal: "Trabajo real · sin enlace público",
    noLinkLab: "Proyecto en Lab / investigación interna",
    prevSlide: "Anterior",
    nextSlide: "Siguiente",
    slideshowLabel: "Piezas del trabajo",
    piece: "Pieza",
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
        shortDesc: "Dirección digital integral para una marca de ventiladores: diseño del sitio, experiencia de catálogo y presencia de contenido para Instagram.",
        tags: "WEB · CONTENT · SOCIAL\nHOSTINGER AI / ART DIRECTION",
        role: "Dirección de Arte & Web Design",
        year: "2025 - 2026",
        problem: "Oliver Sur necesitaba consolidar su catálogo digital y presencia visual con una imagen moderna, sofisticada y funcional que proyecte la alta calidad de sus productos.",
        solution: "Diseño y desarrollo de una plataforma web minimalista orientada al producto, jerarquía tipográfica fuerte y un sistema de piezas visuales adaptables a redes sociales.",
        techSystem: "Web Architecture / Hostinger AI / Instagram Visual Grid",
        viewCaseLabel: "Ver Caso ↗",
      },
      {
        status: "02 / Real",
        category: "Real",
        title: "Estudio Brontes",
        shortDesc: "Diseño integral del portfolio digital para un estudio de diseño industrial, pensado para mostrar servicios, proyectos y capacidades. Se construyó con Hostinger Website Builder, la herramienta del propio hosting: el medio, no la limitación.",
        tags: "PORTFOLIO · WEB DESIGN\nINDUSTRIAL DESIGN STUDIO",
        role: "Dirección Visual & UX/UI",
        year: "2025 - 2026",
        problem: "Requerían una plataforma digital que comunique la rigurosidad técnica y la elegancia formal de su práctica de diseño industrial sin saturar la navegación.",
        solution: "Sistema de portfolio sobrio con grilla estricta, fichas de proyectos detalladas e integración visual del proceso de desarrollo de producto. Se resolvió con Hostinger Website Builder: la decisión está en la estructura, la jerarquía y el contenido, no en el código a medida.",
        techSystem: "Hostinger Website Builder (la herramienta del propio hosting) / Dirección de arte, contenido y arquitectura",
        label: "Ver sitio ↗",
        href: "https://estudiobrontes.com/",
        viewCaseLabel: "Ver Caso ↗",
      },
      {
        status: "03 / Publicado",
        category: "Real",
        title: "Club de Lectores",
        shortDesc: "Rediseño de un blog desde cero: nueva arquitectura de navegación y una plataforma editorial en evolución, preparada para escalar hacia futuras funciones.",
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
        status: "04 / Publicado",
        category: "Real",
        title: "ROVÍN",
        shortDesc: "Catálogo digital de la biblioteca de libros usados ROVÍN (Pergamino): una sola superficie para buscar y descubrir piezas elegidas, con ficha propia, estado de disponibilidad y consulta por Instagram.",
        tags: "CATALOG · UX/UI\nEDITORIAL · PRODUCT",
        role: "Producto, UX/UI & Desarrollo",
        year: "2026",
        problem: "ROVÍN tiene un espacio físico con más libros de los que puede mostrar y un único canal de consulta: el mensaje directo. El catálogo no reemplaza al local: tiene que hacer visible lo que existe sin inventar disponibilidad, precios ni historias.",
        solution: "Una sola superficie de catálogo: búsqueda y filtros por estado, idioma y tipo con el estado guardado en la URL, ficha por pieza con dirección propia y copiable, y tres estados explícitos —Disponible, Reservado, Vendido— donde una pieza vendida conserva su lugar en el archivo sin parecer disponible. El recorrido es descubrimiento → interés → consulta por Instagram (@rovin_romantico_vintage) o visita al local. Sin carrito, sin pago y sin canales que el espacio no tenga.",
        techSystem: "HTML, CSS y JavaScript estáticos / Firestore con build público separado / Frontera de datos propia / Vercel",
        previews: [
          {
            src: "/trabajos/rovin/rovin-01-inicio.jpg",
            alt: "Inicio del catálogo de ROVÍN: buscador, el nombre de la biblioteca y las últimas piezas ingresadas con precio y estado.",
          },
          {
            src: "/trabajos/rovin/rovin-02-catalogo.jpg",
            alt: "Catálogo: grilla de tapas con filtros por estado, idioma y tipo.",
          },
          {
            src: "/trabajos/rovin/rovin-03-pieza.jpg",
            alt: "Ficha de una pieza: tapa, precio, disponibilidad y la consulta por Instagram.",
          },
          {
            src: "/trabajos/rovin/rovin-04-local.jpg",
            alt: "Cómo conseguir una pieza: la venta es en el local y el único canal digital es Instagram.",
          },
        ],
        label: "Ver catálogo ↗",
        href: "https://publico-pearl.vercel.app/",
        viewCaseLabel: "Ver Caso ↗",
      },
      {
        status: "05 / Concept · Lab",
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
    metaRole: "Role",
    metaYear: "Year",
    metaCategory: "Category",
    noLinkReal: "Client work · no public link",
    noLinkLab: "Lab project / internal research",
    prevSlide: "Previous",
    nextSlide: "Next",
    slideshowLabel: "Work pieces",
    piece: "Piece",
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
        shortDesc: "End-to-end digital direction for a fan brand: site design, catalogue experience and visual content presence for Instagram.",
        tags: "WEB · CONTENT · SOCIAL\nHOSTINGER AI / ART DIRECTION",
        role: "Art Direction & Web Design",
        year: "2025 - 2026",
        problem: "Oliver Sur needed to consolidate its digital catalogue and visual identity with a modern, sophisticated image reflecting product quality.",
        solution: "Design and development of a minimalist product-focused web platform, crisp typographic hierarchy, and flexible social media assets.",
        techSystem: "Web Architecture / Hostinger AI / Instagram Visual Grid",
        viewCaseLabel: "View Case ↗",
      },
      {
        status: "02 / Real",
        category: "Real",
        title: "Estudio Brontes",
        shortDesc: "Full digital portfolio design for an industrial design studio, built to show services, projects and capabilities. It was built with Hostinger Website Builder, the hosting's own tool: the medium, not the limitation.",
        tags: "PORTFOLIO · WEB DESIGN\nINDUSTRIAL DESIGN STUDIO",
        role: "Visual Direction & UX/UI",
        year: "2025 - 2026",
        problem: "They required a digital platform to showcase the technical precision and formal elegance of their industrial design practice.",
        solution: "Understated portfolio system featuring a strict grid, detailed project files, and visual integration of the product development lifecycle. Built with Hostinger Website Builder: the decision lives in structure, hierarchy and content, not in custom code.",
        techSystem: "Hostinger Website Builder (the hosting's own tool) / Art direction, content and architecture",
        label: "View site ↗",
        href: "https://estudiobrontes.com/",
        viewCaseLabel: "View Case ↗",
      },
      {
        status: "03 / Published",
        category: "Real",
        title: "Club de Lectores",
        shortDesc: "A blog redesign from the ground up: new navigation architecture and an editorial platform in evolution, ready to scale into future features.",
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
        status: "04 / Published",
        category: "Real",
        title: "ROVÍN",
        shortDesc: "Digital catalogue for ROVÍN, a second-hand book library in Pergamino: a single surface to search and discover hand-picked pieces, with its own detail page, availability state and enquiries through Instagram.",
        tags: "CATALOG · UX/UI\nEDITORIAL · PRODUCT",
        role: "Product, UX/UI & Development",
        year: "2026",
        problem: "ROVÍN has a physical space with more books than it can display and a single channel for enquiries: direct messages. The catalogue does not replace the shop: it has to make visible what exists without inventing availability, prices or stories.",
        solution: "A single catalogue surface: search and filters by state, language and type with the state kept in the URL, a detail page per piece with its own copyable address, and three explicit states —Available, Reserved, Sold— where a sold piece keeps its place in the archive without looking available. The path is discovery → interest → enquiry via Instagram (@rovin_romantico_vintage) or a visit. No cart, no payment, no channels the space does not have.",
        techSystem: "Static HTML, CSS and JavaScript / Firestore with a separate public build / Own data boundary / Vercel",
        previews: [
          {
            src: "/trabajos/rovin/rovin-01-inicio.jpg",
            alt: "ROVÍN catalogue home: search field, the library name and the latest pieces with price and state.",
          },
          {
            src: "/trabajos/rovin/rovin-02-catalogo.jpg",
            alt: "Catalogue: a grid of covers with filters by state, language and type.",
          },
          {
            src: "/trabajos/rovin/rovin-03-pieza.jpg",
            alt: "A piece detail page: cover, price, availability and the enquiry through Instagram.",
          },
          {
            src: "/trabajos/rovin/rovin-04-local.jpg",
            alt: "How to get a piece: sales happen in the shop and Instagram is the only digital channel.",
          },
        ],
        label: "View catalogue ↗",
        href: "https://publico-pearl.vercel.app/",
        viewCaseLabel: "View Case ↗",
      },
      {
        status: "05 / Concept · Lab",
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
  const [slide, setSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  // Guarda el disparador para devolverle el foco al cerrar.
  const lastFocused = useRef<HTMLElement | null>(null);
  const t = content[locale];

  function openCase(item: CaseStudy) {
    lastFocused.current = document.activeElement as HTMLElement | null;
    setSlide(0);
    setSelectedCase(item);
  }

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

  // Accesibilidad del modal: el foco entra al abrirse, la tabulación queda
  // atrapada adentro y vuelve al disparador al cerrar. El fondo queda inerte.
  useEffect(() => {
    if (!selectedCase) {
      lastFocused.current?.focus();
      lastFocused.current = null;
      return;
    }
    const node = modalRef.current;
    if (!node) return;

    const focusables = () =>
      Array.from(
        node.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
    focusables()[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    node.addEventListener("keydown", onKeyDown);
    return () => node.removeEventListener("keydown", onKeyDown);
  }, [selectedCase]);

  // El carrusel también responde a las flechas del teclado.
  useEffect(() => {
    if (!selectedCase || !selectedCase.previews || selectedCase.previews.length < 2) return;
    const total = selectedCase.previews.length;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setSlide((i) => (i - 1 + total) % total);
      } else if (e.key === "ArrowRight") {
        setSlide((i) => (i + 1) % total);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedCase]);

  // Mientras el modal está abierto, el resto de la página no recibe foco.
  useEffect(() => {
    const main = document.getElementById("main");
    if (!main) return;
    const backdrop = modalRef.current?.parentElement ?? null;
    Array.from(main.children).forEach((child) => {
      if (child === backdrop) return;
      if (selectedCase) child.setAttribute("inert", "");
      else child.removeAttribute("inert");
    });
  }, [selectedCase]);

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
                        onClick={() => openCase(item)}
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
                  {item.previews && item.previews.length > 0 && (
                    <figure className="work-preview">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.previews[0].src}
                        alt={item.previews[0].alt}
                        loading="lazy"
                        decoding="async"
                      />
                    </figure>
                  )}
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
        <BlimContact key={locale} locale={locale} />
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
            ref={modalRef}
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
                <span>{t.metaRole}: {selectedCase.role}</span>
                <span>{t.metaYear}: {selectedCase.year}</span>
                <span>{t.metaCategory}: {selectedCase.category}</span>
              </div>

              {selectedCase.previews && selectedCase.previews.length > 0 && (
                <div
                  className="modal-slideshow"
                  role="group"
                  aria-roledescription="carousel"
                  aria-label={t.slideshowLabel}
                >
                  <figure className="modal-slide">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        selectedCase.previews[
                          Math.min(slide, selectedCase.previews.length - 1)
                        ].src
                      }
                      alt={
                        selectedCase.previews[
                          Math.min(slide, selectedCase.previews.length - 1)
                        ].alt
                      }
                      loading="lazy"
                      decoding="async"
                    />
                  </figure>

                  <div className="slideshow-nav mono">
                    <button
                      type="button"
                      className="slide-btn"
                      aria-label={t.prevSlide}
                      disabled={selectedCase.previews.length < 2}
                      onClick={() =>
                        setSlide(
                          (i) =>
                            (i - 1 + selectedCase.previews!.length) %
                            selectedCase.previews!.length
                        )
                      }
                    >
                      ←
                    </button>

                    <span aria-live="polite">
                      {String(
                        Math.min(slide, selectedCase.previews.length - 1) + 1
                      ).padStart(2, "0")}{" "}
                      / {String(selectedCase.previews.length).padStart(2, "0")}
                    </span>

                    <button
                      type="button"
                      className="slide-btn"
                      aria-label={t.nextSlide}
                      disabled={selectedCase.previews.length < 2}
                      onClick={() =>
                        setSlide(
                          (i) => (i + 1) % selectedCase.previews!.length
                        )
                      }
                    >
                      →
                    </button>
                  </div>

                  {selectedCase.previews.length > 1 && (
                    <div className="slide-dots">
                      {selectedCase.previews.map((pieza, i) => (
                        <button
                          key={pieza.src}
                          type="button"
                          className={`slide-dot ${i === slide ? "on" : ""}`}
                          aria-label={`${t.piece} ${i + 1}`}
                          aria-current={i === slide}
                          onClick={() => setSlide(i)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

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
                  <span className="mono">
                    {selectedCase.category === "Real" ? t.noLinkReal : t.noLinkLab}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

