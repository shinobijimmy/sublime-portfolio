# Prototype Specification — v0.1

**Fase:** preparación de prototipo  
**Estado:** en curso  
**Objetivo:** definir pantallas, contenido, estados y comportamiento antes de implementar.

## Rutas del MVP

- `/es` y `/en` — Home
- `/es/work` y `/en/work` — Work en documentación
- `/es/capabilities` y `/en/capabilities`
- `/es/method` y `/en/method`
- `/es/about` y `/en/about`
- `/es/contact` y `/en/contact`

## Navegación

Desktop: marca, enlaces principales, selector ES/EN y CTA de proyecto.  
Mobile: marca, selector ES/EN y botón de menú; el menú ocupa la pantalla y conserva foco de teclado.

## Home — wireframe de contenido

1. **Hero**
   - ES: `Convertimos ideas en identidad, experiencias digitales y sistemas que funcionan.`
   - EN: `We turn ideas into identities, digital experiences and systems that work.`
   - CTA: `Iniciar un proyecto / Start a project`.
   - CTA secundaria: `Ver capacidades / Explore capabilities`.

2. **Pipeline**
   - `Brand → Identity → Interface → Product → Technology`.
   - Cada término recibe una definición breve; en móvil se presenta en lista vertical.

3. **Selected Work**
   - Estado: `00 — En documentación / Being documented`.
   - Explica que los casos se publicarán con contexto, materiales y permisos correctos.
   - CTA a Capabilities y Contact.

4. **Capabilities**
   - Cuatro filas: Identity, Digital, Product y Technology.
   - Desktop: expansión en hover y foco. Mobile: acordeón accesible o contenido visible.

5. **Method**
   - `01 Context → 02 Direction → 03 System → 04 Build → 05 Evolve`.

6. **About**
   - Práctica independiente que une cultura visual, producto y tecnología.

7. **Contact**
   - Titular: `¿Tenés algo que necesita tomar forma?`
   - El formulario se diseña visualmente, pero su destino y promesa de respuesta siguen pendientes.

## Requisitos de diseño

- Paleta: negro cálido, coral/rosa salmón y blanco/gris claro.
- Sans display de gran peso, sans de lectura y monoespaciada para datos.
- 12 columnas desktop; 4 columnas mobile.
- Bordes rectos, bloques planos, sin sombras ni gradientes.
- Texto y controles con contraste AA mínimo.
- Movimiento breve y opcional; reduced motion elimina desplazamiento decorativo.

## Pendientes para completar el prototipo

1. Selección y prueba de tipografía display ES/EN.
2. Copy final ES/EN por pantalla.
3. Destinatario y plazo de respuesta del formulario.
4. Material y permisos para las fichas reales de Work.
