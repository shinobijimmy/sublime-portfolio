# Sublime Design Language 2026 — análisis de referencia Stitch v0.1

**Fuentes analizadas:** `../version dos/stitch_sublime_bilingual_digital_portfolio` y `../bb2cf402261e2c7dfe7173d52e0d54f1.webp`  
**Material:** pantallas de referencia, `DESIGN.md`, `code.html`  
**Estado:** dirección inicial aprobada el 2026-08-15

## Lectura general

La referencia propone un estudio digital de alto contraste: una mezcla de **editorial contemporáneo, Swiss punk e industria tecnológica**. El sitio construye presencia mediante bloques planos de color, tipografía sans muy pesada, detalles monoespaciados y una composición asimétrica con aire.

Es una dirección apropiada para Sublime porque evita tanto el portfolio freelance convencional como el lenguaje SaaS. Su riesgo es parecer una agencia genérica de "growth / AI / innovation" si el copy, los proyectos y las imágenes no incorporan la trayectoria real del estudio.

## Principios que se adoptan

### Tipografía

- Titulares desproporcionados, condensados o compactos, con peso alto y tracking negativo.
- Sans neutral y legible para cuerpos de texto.
- Monoespaciada para sistema, metadatos, tags, numeración, idioma y coordenadas de proyecto.
- Bilingüismo entendido como estructura editorial: la traducción acompaña, no duplica todos los bloques.

**Dirección propuesta:** una familia display todavía por decidir entre `Archivo Narrow`, `Inter Tight` u otra alternativa con carácter propio; `Hanken Grotesk` o equivalente para lectura; `JetBrains Mono` para la capa técnica.

La segunda referencia confirma que la fuerza no proviene solo del tamaño: los titulares usan cortes controlados, bloques de tres a cinco líneas y un peso negro compacto. En Sublime se deberá comprobar cada corte en ES y EN para conservar esa tensión sin sacrificar comprensión.

### Color y materialidad

- Base negra cálida, no gris corporativo.
- Acento coral/rosa salmón luminoso como color de tensión y de CTA.
- Blanco o gris muy claro para contraste y lectura.
- Sin gradientes, glassmorphism ni sombras difusas.
- Superficies planas, bordes finos y esquinas rectas.

**Ajuste propuesto:** el rosa debe permanecer como acento distintivo y no funcionar solo como "rojo de alerta". Antes del sistema final se probarán variantes de coral, rojo tinta y crema para evitar una identidad demasiado derivativa.

La segunda referencia aporta una variante útil: un rojo cálido y saturado combinado con negro absoluto. Se mantiene como referencia de contraste y energía, pero **Sublime conservará coral/rosa como base inicial** para separarse de esa marca y no parecer una reproducción cromática.

### Grid y composición

- Grid editorial de 12 columnas en desktop; cuatro columnas en móvil.
- Fondos a sangre y contenido con márgenes consistentes.
- Composición escalonada: titulares, texto e imagen no comparten necesariamente el mismo eje.
- Mucho vacío deliberado entre bloques; ritmo vertical amplio.
- El contenido puede atravesar cambios de color, pero nunca romper la legibilidad.

### Jerarquía y navegación

- Home como manifiesto y selector de trabajo, no como lista de servicios tradicional.
- Menú lateral o navegación de alto contraste para sostener la actitud editorial.
- Secciones largas con hitos claros: manifiesto, capacidades, trabajo, método y contacto.
- CTA tratados como bloques compactos y funcionales; no como botones redondeados de producto SaaS.

### Imagen y movimiento

- Fotografía y mockups con encuadres físicos, editoriales o industriales.
- Blanco y negro / escala de grises por defecto; color pleno al interactuar cuando aporte significado.
- Motion rápido, tipográfico y de contraste: reveal, desplazamiento, cambio de bloque, hover de listas.
- Respetar `prefers-reduced-motion` y evitar animación permanente que opaque el caso de estudio.

La imagen demuestra que la fotografía puede actuar como interrupción de escala: retratos verticales o detalles de objeto colocados dentro de grandes campos de color. Para Sublime, solo se usarán imágenes propias, de proyectos o estudios visuales claramente atribuidos; nunca se copiará la imaginería de moda de la referencia.

## Qué no se adopta literalmente

- Las frases genéricas como “innovative brands worldwide”, métricas inventadas o promesas sin evidencia.
- Servicios de la referencia que no sean una oferta real de Sublime (por ejemplo Framer o growth como categoría principal).
- La fotografía stock como sustituto de los proyectos.
- El bloque de color rosa/negro como única fórmula de todas las páginas.
- Un menú o efecto visual que vuelva difícil encontrar Work, Capabilities y Contact.
- Los grandes logotipos repetidos como decoración; en Sublime el nombre aparece como firma o ancla, no como relleno visual de cada sección.

## Traducción a Sublime

| Sistema de referencia | Aplicación propia de Sublime |
| --- | --- |
| Titulares agresivos | Ideas que se convierten en sistemas: identidad, interfaz, producto y tecnología. |
| Metadata monoespaciada | Tipo de proyecto, año, disciplinas, stack y estado Real / Concept / Experiment. |
| Listas de servicios | Capacidades organizadas por Identity, Digital, Product y Technology. |
| Bloques alternados de color | Ritmo narrativo de Home y transición entre casos, no decoración repetitiva. |
| Bilingüismo | ES como idioma principal, EN como espejo editorial y opción de alcance internacional. |
| Estética industrial | Precisión, sistema y ejecución técnica; no agresividad vacía. |

## Propuesta de Home basada en la dirección

1. **Hero / manifiesto:** una frase breve y verificable sobre convertir ideas en identidad, interfaz y producto.
2. **Statement de práctica:** el pipeline `Brand → Identity → Interface → Product → Technology`.
3. **Selected Work:** tres casos con etiquetas transparentes.
4. **Capabilities:** lista interactiva y concisa, sin vender tecnologías por sí mismas.
5. **Method:** cinco pasos legibles, desde discovery hasta launch.
6. **Lab preview:** uno a tres experimentos cuando estén disponibles.
7. **Contact:** CTA “Start a Project” con un formulario breve.

## Guardrails de implementación

- Contraste AA como mínimo para texto y controles.
- Límites responsivos para evitar que los titulares se rompan en móvil.
- Carga progresiva de imágenes y vídeo; la web debe permanecer veloz.
- Elementos interactivos utilizables por teclado y con foco visible.
- El HTML de Stitch es una referencia de exploración; no se adopta como arquitectura de producción.

## Decisiones pendientes

1. Seleccionar una tipografía display final después de comparar opciones y licencias.
2. Confirmar los primeros tres casos que ocuparán el módulo Selected Work.

## Decisiones aprobadas

- La paleta inicial será negro cálido, coral/rosa salmón y blanco/gris claro.
- El sitio será bilingüe completo ES/EN. Ambos idiomas tendrán la misma calidad de copy y jerarquía; no se mostrará una traducción secundaria o incompleta.
