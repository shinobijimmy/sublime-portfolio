# Deploy en Vercel

Estado al 18/09/2026. Documento operativo: qué está hecho, qué falta y los pasos exactos.

## Resumen

El proyecto está **listo para publicar**. Lo único pendiente es conectar el repositorio a Vercel,
que es una acción de cuenta que solo puede hacer el fundador.

| Requisito | Estado |
| --- | --- |
| `npm run build` | Pasa. `/` se prerenderiza estática |
| `npm run lint` | Pasa (ESLint 9 + eslint-config-next) |
| Mobile-first responsive | Verificado con capturas reales a 320, 390 y 1280 px |
| Navegación móvil | Menú funcional con `aria-expanded`, cierre por ESC y por resize |
| Metadata y SEO | `title`, description, Open Graph, Twitter, canonical, robots, viewport |
| Accesibilidad | `lang` sincronizado con el toggle, skip link, `prefers-reduced-motion`, foco visible |
| Repositorio | `main` pusheado, árbol limpio |
| Proyecto en Vercel | **Pendiente** |

## Por qué no puede hacerlo un agente

- No hay Vercel CLI instalado en la máquina y el login requiere abrir el navegador.
- No hay `VERCEL_TOKEN` en el entorno ni proyecto vinculado (`.vercel/` no existe).
- El sandbox bloquea el remote debugging de Chrome, así que un agente no puede verificar
  el renderizado de la URL publicada.

## Pasos

1. Entrar a <https://vercel.com/new>.
2. Elegir **Import Git Repository** y autorizar GitHub si lo pide.
3. Seleccionar `shinobijimmy/sublime-portfolio`.
4. En **Root Directory**, elegir **`landing jimmy`**.
   El repositorio tiene la app dentro de esa subcarpeta; si se deja la raíz,
   Vercel no encuentra el `package.json` de Next.js.
5. Framework preset: **Next.js** (lo detecta solo). No hace falta tocar build ni output.
6. Deploy. Vercel instala, buildea y devuelve la URL.

## Después del primer deploy

- Cada `git push` a `main` despliega producción automáticamente; los otros branches generan preview.
- **Dominio:** hoy queda en un subdominio `*.vercel.app`. Cuando se conecte el dominio propio,
  actualizar `NEXT_PUBLIC_SITE_URL` en las variables de entorno del proyecto en Vercel;
  `layout.tsx` la usa para `metadataBase`, canonical y Open Graph.
- **Contacto:** el CTA usa `mailto:hello@sublimedesign.co`. Verificar que ese buzón exista
  antes de anunciar el sitio.

## Variables de entorno

Ninguna es obligatoria para publicar. `next start` arranca sin ellas.

| Variable | Uso | Obligatoria |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `metadataBase`, canonical y Open Graph | Recomendada |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase web (Stage 2) | No |
| `FIREBASE_*` | Credenciales de servidor (Stage 3) | No |
| `CONTACT_*` | Endpoint de contacto (Stage 3) | No |

## Pendientes que no bloquean el deploy

- **Formulario de contacto real.** Bloqueado hasta definir destinatario, campos y plazo de
  respuesta (`docs/discovery/05-mvp-blueprint.md`). Hoy el CTA abre el cliente de correo.
- **Casos de estudio internos.** Los tres trabajos enlazan a sitios externos.
- **Verificación en navegador real.** El layout se verificó con capturas automatizadas;
  falta una pasada manual en un teléfono.
