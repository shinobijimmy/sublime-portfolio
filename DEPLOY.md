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

## Rollback

Requisito de la puerta de Fase 11. Hay que saber cómo volver antes de necesitarlo.

**Opción A · Promover un deployment anterior (la más rápida, sin tocar Git)**

1. En Vercel, entrar al proyecto → pestaña **Deployments**.
2. Ubicar la última versión que funcionaba.
3. Menú **⋯ → Promote to Production**.
4. Verificar la URL. El cambio es inmediato.

Esto no cambia el repositorio: `main` sigue con el código nuevo, así que el próximo push
volverá a desplegar el estado actual. Útil para cortar un problema en caliente.

**Opción B · Revertir el commit (deja el repositorio consistente)**

```bash
cd "C:/Users/iseaa/Documents/jimmy/dISEÑO/Portfolio_Jimmy/landing jimmy"
git revert <sha-del-commit-malo>
git push origin main
```

Vercel despliega el revert automáticamente. Es la opción correcta cuando el problema está
en el código y no solo en el build.

**Verificación después de cualquier rollback**

1. La URL responde 200 y carga el contenido.
2. El CTA de contacto abre el correo correcto.
3. El menú móvil funciona en un ancho menor a 761 px.

**Qué NO hacer:** borrar el proyecto en Vercel. Se pierde el historial de deployments y con
él la opción A.

## Variables de entorno

Solo las del contacto son necesarias para que el formulario funcione.

| Variable | Uso | Obligatoria |
| --- | --- | --- |
| `RESEND_API_KEY` | Envío del formulario (`/api/contact`) | **Sí, para el formulario** |
| `CONTACT_TO` | Destino del brief | **Sí, para el formulario** |
| `CONTACT_FROM` | Remitente. Si falta, usa `onboarding@resend.dev` | No |
| `NEXT_PUBLIC_SITE_URL` | `metadataBase`, canonical y Open Graph | Recomendada |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase web (Stage 2) | No |
| `FIREBASE_*` | Credenciales de servidor (Stage 3) | No |

`RESEND_API_KEY` y `CONTACT_TO` viven en Vercel y **no se versionan**. Sin ellas, `/api/contact`
responde `503` y el formulario muestra un error en lugar de fallar en silencio.

### Límite de Resend sin dominio verificado

Con `onboarding@resend.dev` como remitente, Resend **solo deja enviar al correo dueño de la
cuenta**. Para recibir briefs en otra dirección hace falta verificar un dominio propio y definir
`CONTACT_FROM` con una dirección de ese dominio.

## Formulario de contacto (blim)

La sección de contacto usa un formulario guiado por pasos en lugar de un `mailto`. La mascota
`blim` arma el brief conversando:

1. qué necesita (identidad / web / producto / otro)
2. contexto del proyecto
3. objetivo
4. referencias (opcional)
5. plazo (opcional)
6. nombre
7. email

Al final muestra el brief armado y pide confirmación antes de enviar. Es bilingüe y sigue el
toggle ES/EN del sitio.

**Protecciones:** validación de campos y de email, límite de 5 envíos por hora por IP, campo
trampa oculto y descarte de envíos completados en menos de 2 segundos.

**Código:** `src/app/BlimContact.tsx` (interfaz) y `src/app/api/contact/route.ts` (endpoint).

## Pendientes que no bloquean el deploy

- **Casos de estudio internos.** Los trabajos enlazan a sitios externos.
- **Verificación en navegador real.** El layout se verificó con capturas automatizadas;
  falta una pasada manual en un teléfono.
- **Dominio verificado en Resend** para poder enviar a cualquier destinatario.
