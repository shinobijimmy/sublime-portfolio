# Sublime Lab

Presencia digital de **Sublime Lab**: estudio de diseño, producto y tecnología.

Next.js 16 (App Router) + TypeScript. Una sola página con navegación por secciones,
bilingüe ES/EN y drawer de caso de estudio.

## Estado actual

**Fase 1 · implementación y release.** El frontend existe, el build de producción pasa
y la navegación funciona en móvil y desktop.

Actualizado el 18/09/2026.

## Correr en local

```bash
npm install
npm run dev     # http://localhost:3000
```

Otros comandos:

```bash
npm run lint    # ESLint 9 con eslint-config-next
npm run build   # build de producción
npm start       # sirve el build
```

## Estructura

- `src/app/layout.tsx`: metadata, viewport, skip link y `lang` del documento.
- `src/app/page.tsx`: la Home completa (secciones, filtros, modal de caso, contenido ES/EN).
- `src/app/globals.css`: sistema visual, mobile-first, con mejoras progresivas.
- `eslint.config.mjs`: configuración de ESLint 9.
- `docs/`: Master Spec, Discovery y el sistema visual.
- `docs/archive/firebase.json.retired`: configuración de Firebase Hosting retirada.

## Decisiones vigentes

- **Nombre:** Sublime Lab. El centro estratégico del estudio conserva *Sublime Labs*.
- **Deploy:** Vercel, conectado al repositorio de GitHub.
- **Contacto:** `mailto:hello@sublimedesign.co` en el CTA.
- **Mobile-first:** los estilos base son de una columna; la retícula de 12 columnas
  entra desde 761px.

## Pendientes conocidos

- **Formulario de contacto real:** bloqueado hasta definir destinatario, campos y plazo
  de respuesta (`docs/discovery/05-mvp-blueprint.md`). Hoy el CTA abre el cliente de correo.
- **Dominio propio:** hoy se publica en un subdominio de Vercel.
- **Casos de estudio internos:** los tres trabajos enlazan a sitios externos.
- **Verificación de browser:** pendiente de correr en un navegador real.

## Principio de trabajo

Primero claridad estratégica y dirección creativa; después prototipo, sistema visual y desarrollo.
