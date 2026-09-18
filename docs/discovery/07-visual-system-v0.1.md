# Sublime Visual System — v0.1

**Fase:** Art Direction  
**Estado:** propuesta de trabajo para prototipo  
**Basado en:** dirección Stitch aprobada, con adaptación propia para Sublime.

## Idea visual

**Editorial industrial, preciso y humano.**

Sublime se expresa como una superficie de alto contraste donde la tipografía y la composición hacen el trabajo principal. El sistema no busca parecer tecnológico por efecto: demuestra precisión mediante jerarquía, escala, grilla y contenido real.

## Tipografía de prototipo

| Rol | Familia propuesta | Uso |
| --- | --- | --- |
| Display | Inter Tight, 800–900 | Hero, títulos de sección, números y statements. |
| Texto | Hanken Grotesk, 400–600 | Cuerpo, formularios, explicaciones y navegación secundaria. |
| Metadata | JetBrains Mono, 400–500 | Etiquetas, idioma, año, disciplina, estado y coordenadas. |

**Criterio:** Inter Tight conserva la contundencia de la referencia y responde mejor al contenido bilingüe que una condensada extrema. La licencia y la lectura final se validarán antes de producción.

## Escala tipográfica

- Display desktop: `clamp(5rem, 12vw, 10rem)`; interlineado 0.84–0.92; tracking -0.05em.
- Display mobile: `clamp(3.75rem, 17vw, 5.5rem)`; evitar cortes accidentales.
- H1/H2: 48–80 px desktop; 36–52 px mobile.
- Cuerpo destacado: 20 px / 30 px desktop; 18 px / 28 px mobile.
- Cuerpo: 16 px / 24 px.
- Metadata: 11–12 px / 16 px; nunca usar para párrafos.

## Color

| Token | Valor provisional | Rol |
| --- | --- | --- |
| Ink | `#121212` | Fondo principal y texto sobre coral. |
| Coral | `#FFAAA0` | Campo expresivo, CTA y énfasis de sección. |
| Paper | `#F4F1ED` | Texto de alto contraste y superficies claras puntuales. |
| Steel | `#A59F9A` | Metadatos secundarios y divisores suaves. |
| Line dark | `#2A2928` | Divisores sobre Ink. |

La combinación exacta de texto coral sobre negro se comprobará antes de usarla en tamaños pequeños. Para controles críticos, Paper sobre Ink o Ink sobre Coral es la combinación por defecto.

**Nota de referencia:** se observó una variante rojo intenso + negro de alto impacto. No se adopta como paleta principal de Sublime; queda disponible para momentos editoriales puntuales o futuros proyectos, una vez validada la identidad base coral/rosa.

## Grid y espacio

- Desktop: doce columnas, margen exterior 32–64 px, gutter 16–24 px, máximo de 1440 px.
- Mobile: cuatro columnas, padding 16–20 px, gutter 12–16 px.
- Secciones mayores: 128–160 px desktop y 72–96 px mobile.
- Ritmo interno: 8 / 16 / 24 / 32 / 48 / 64 px.
- Los fondos siempre pueden ocupar el viewport; texto e interacciones respetan el grid.

## Componentes de prototipo

### Header

Marca tipográfica, selector ES/EN, navegación y CTA compacto. Debe permanecer legible encima de cualquier bloque de color.

### CTA

Rectángulo sin radio, texto mono o sans compacta y flecha diagonal. Cambia de Ink a Coral —o a la inversa— al recibir hover/foco. El foco es visible.

### Capability row

Número mono, nombre display, resumen y detalle. En desktop responde a hover y foco; en móvil funciona como acordeón o contenido expandido.

### Work status

Bloque de archivo: índice, estado `En documentación / Being documented`, explicación y CTA. Nunca imita una tarjeta de proyecto inexistente.

### Form field

Label visible en mono y borde inferior de 1 px. Errores explicados con texto; el color no es el único indicador.

## Movimiento

- Reveal breve de entrada: opacidad + 12–20 px, una única vez.
- Cambio instantáneo o muy corto de contraste en botones y filas.
- Transiciones de ruta de 150–250 ms como máximo.
- Sin scroll hijacking, parallax, cursores custom, loaders ni animaciones constantes.
- `prefers-reduced-motion`: contenido inmediato, sin desplazamiento decorativo.

## Imagen

- El sistema se sostiene inicialmente con tipografía, metadata, grilla y color.
- Cuando entren proyectos: capturas reales, artefactos del proceso, aplicaciones de identidad y fotografía con función narrativa.
- Sin stock de equipos, laptops o “IA abstracta”.
- Cada caso usa su propio universo visual; Sublime solo provee el marco editorial.
- Cuando haya fotografía, preferir un recorte vertical o de detalle que introduzca escala y contraste dentro de la grilla, no galerías decorativas.

## Brief para Stitch

> Diseñar una Home bilingüe ES/EN para Sublime Design, un estudio independiente de identidad, producto y tecnología. Estética editorial industrial y high-contrast: fondo negro cálido, bloques coral/rosa, tipografía Inter Tight Black muy grande, Hanken Grotesk para lectura y JetBrains Mono para metadatos. Grilla asimétrica de 12 columnas, bordes rectos, sin gradientes ni sombras. La Home contiene Hero, pipeline Brand→Identity→Interface→Product→Technology, Selected Work en estado “En documentación”, cuatro capabilities, método de cinco pasos, About y Contact. El resultado debe sentirse preciso, cultural y técnico; no SaaS ni agencia corporativa. Priorizar accesibilidad y una versión móvil clara.

## Validación antes de frontend

1. Probar el sistema con titulares ES y EN reales.
2. Verificar contraste de todos los estados de CTA, navegación y formularios.
3. Validar Home y navegación móvil en Stitch.
4. Ajustar escala, cortes y ritmo antes de construir componentes.
