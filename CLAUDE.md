# Sitio web de la Mancomunidad Tzolojya

Instrucciones permanentes para Claude Code. Léelas completas antes de trabajar.
Los textos de cada página están en `docs/contenido.md`.

## Contexto

- Sitio institucional de la Mancomunidad de Municipios Tzolojya (MANCTZOLOJYA), Sololá, Guatemala.
- Municipios socios actuales: **Santa Lucía Utatlán y San José Chacayá**. Nahualá **no** forma parte: no aparece en ningún texto, logo ni imagen.
- Reemplaza un WordPress en GoDaddy. Lanzamiento: **1 de octubre de 2026**.
- Objetivo central: credibilidad e impacto ante cooperantes (sobre todo del País Vasco). Secundario: visibilidad de actividades e información a la población.
- Administrador técnico y único punto de aprobación: Jorge. Nada se publica en producción sin su aprobación.
- Idioma: solo español (`lang="es"`). Tono institucional, claro y cercano.

## Reglas de trabajo

- Commits pequeños y descriptivos, en español. Un cambio lógico por commit.
- Antes de modificar algo existente, explica qué archivos cambian y por qué.
- Nunca incluir contraseñas, tokens ni claves en el código.
- **No tocar DNS, dominio ni correo.** El correo institucional está en IONOS y depende de registros MX en GoDaddy; cualquier cambio de DNS lo hace Jorge con una guía aparte.
- No agregar dependencias sin justificarlas. Nada de plugins o servicios de pago.
- No inventar datos, cifras ni descripciones. Si falta información, deja un marcador visible `[PENDIENTE: …]` y avísalo.

## Stack

- **Eleventy 3** con plantillas Nunjucks (`.njk`) y contenido en Markdown cuando convenga.
- CSS propio con variables CSS. Sin frameworks (ni Tailwind ni Bootstrap).
- JavaScript mínimo: solo el botón del menú móvil. El sitio debe funcionar sin JS.
- Imágenes con `@11ty/eleventy-img`: WebP (y AVIF si no complica), varios anchos, `srcset`, `width`/`height` explícitos y `loading="lazy"` salvo en la foto principal.
- Tipografía **Poppins** (400, 500, 600) alojada en el propio sitio en `woff2` (licencia OFL), con `font-display: swap`. No cargar Google Fonts desde su servidor.
- Hosting: **GitHub Pages**, cuenta `mancomunidadtzolojya`, repositorio `mancomunidadtzolojya.github.io`.
- Publicación con **GitHub Actions** (flujo oficial de Pages: build de Eleventy y deploy de `_site`). En el repositorio, Settings → Pages → Source debe estar en "GitHub Actions".

## Estructura propuesta

```
.
├── CLAUDE.md
├── docs/
│   ├── contenido.md        # textos de todas las páginas
│   └── mantenimiento.md    # guía para quien administre (crear al final)
├── src/
│   ├── _data/site.json     # nombre, contacto, redes, entorno
│   ├── _includes/
│   │   ├── base.njk        # <head>, franja de colores, header, footer
│   │   ├── header.njk
│   │   └── footer.njk
│   ├── assets/
│   │   ├── css/estilos.css
│   │   ├── js/menu.js
│   │   ├── fonts/
│   │   └── img/            # logos y fotos ya seleccionadas
│   ├── index.njk
│   ├── sobre-nosotros.njk
│   ├── proyectos.njk
│   ├── cooperantes.njk
│   ├── contacto.njk
│   ├── 404.njk
│   └── robots.txt.njk
├── .github/workflows/pages.yml
├── eleventy.config.js
└── package.json
```

Las fotos originales (entre 1 y 14 MB cada una) **no se suben al repositorio**. Viven en `~/Documents/fotos-sitio` (los logos, en su subcarpeta `LOGOS MANCO Y COOPERACIÓN`). Solo se versionan las versiones optimizadas que genera `npm run imagenes`, porque GitHub Actions no tiene acceso a los originales.

## URLs

| Página | URL |
|---|---|
| Portada | `/` |
| Sobre nosotros | `/sobre-nosotros/` |
| Nuestros proyectos | `/proyectos/` |
| Cooperantes | `/cooperantes/` |
| Contáctanos | `/contacto/` |

## Sistema visual (aprobado en la portada)

**Colores**

| Uso | Valor |
|---|---|
| Títulos, pie de página | `#1B2A4E` (azul marino) |
| Texto de cuerpo | `#3B4663` |
| Enlaces / hover | `#0B6FA4` / `#084E75` |
| Fondo de sección alterna | `#EEF3F1` |
| Separadores del menú | `#C5CCD8` |
| Texto secundario sobre azul marino | `#D5DBE8` |
| Franja superior (4 partes iguales) | `#0288D1`, `#627A2B`, `#A2C84A`, `#F2E14A` |
| Íconos en el pie | `#A2C84A` |

**Tipografía:** Poppins. Títulos de sección 600, ~52 px escritorio / ~34 px celular. Cuerpo 400, 20 px / 17 px, interlineado 1.65. Título de la portada 500, mayúsculas, `letter-spacing: 0.3em` (0.2em en celular); es el único texto con ese tratamiento.

**Componentes**

- **Franja superior** de 4 px con los 4 colores del logo, en todas las páginas.
- **Header:** logo a la izquierda (72 px de alto en escritorio, 52 px en celular). Menú a la derecha: Sobre nosotros | Nuestros proyectos | Cooperantes | Contáctanos, con separadores verticales finos. Marcar la página actual con `aria-current="page"` y un subrayado.
- **Menú móvil:** botón de 48 × 48 px con `aria-label="Abrir menú"` y `aria-expanded`; despliega los mismos 4 enlaces.
- **Foto principal (portada):** foto a todo el ancho con capa `rgba(16,26,52,0.58)`, título, lema y botón con borde blanco "Conoce más" (lleva a `/sobre-nosotros/`). En las páginas internas, usar una versión baja (~280 px) con solo el título de la página.
- **Bloques foto + texto** alternados (foto izquierda / texto derecha y al revés), a dos columnas en escritorio y apilados en celular.
- **Logos de cooperantes** sobre el fondo de la sección, sin casilla blanca, en cuadrícula de 4 columnas (2 en celular), con `alt` descriptivo.
- **Pie de página** azul marino: logo en recuadro blanco con esquinas redondeadas y una frase breve; columna "Nuestro sitio"; columna "Contáctanos" con teléfono (`tel:`), correo (`mailto:`), ubicación, redes (botones circulares de 44 px con `aria-label`) y enlace "Acceso al correo institucional"; línea inferior "© 2026 Mancomunidad Tzolojya. Todos los derechos reservados."
- Íconos: SVG de trazo en línea, nunca emojis.

Si Jorge comparte el HTML del diseño aprobado, úsalo como referencia visual exacta.

## Requisitos de calidad

- **Accesibilidad WCAG 2.2 AA:** un solo `h1` por página y jerarquía correcta, contraste mínimo 4.5:1, foco visible, navegación por teclado, enlace "Saltar al contenido", `alt` en todas las imágenes, objetivos táctiles ≥ 44 px, respetar `prefers-reduced-motion`.
- **Responsive mobile-first**, probado en 360, 390, 768, 1024 y 1440 px.
- **SEO:** `<title>` y meta description únicos por página, canonical, Open Graph, `sitemap.xml`, `robots.txt`, datos estructurados `Organization` en la portada.
- **Rendimiento:** objetivo Lighthouse ≥ 90 en todas las categorías en móvil. Precargar solo la foto principal y la fuente 500.
- **Demo sin indexar:** mientras el sitio viva en `mancomunidadtzolojya.github.io`, añadir `<meta name="robots" content="noindex, nofollow">` y `Disallow: /` en `robots.txt`, controlado por una variable de entorno (por ejemplo `SITE_ENV=demo`). Al lanzar se cambia a producción y se retira.
- **Analítica:** Cloudflare Web Analytics, solo en producción. Jorge proporcionará el fragmento en el momento del lanzamiento.

## Pendientes conocidos

- Fotos: los originales están en `~/Documents/fotos-sitio`, fuera del repositorio. Los nombres indican la sección (por ejemplo "Fortalecimiento 3"); los textos alternativos se redactan describiendo lo que se ve en cada foto, sin nombrar lugares que no estén confirmados, y Jorge los revisa.
- Logo de Nim Kat: el disponible es un dibujo de línea fina; usarlo por ahora.
- Página de Actividades y sección de Transparencia: fuera del lanzamiento; dejar la estructura preparada para agregarlas.

## Antes de pedir aprobación de cada página

1. Build sin errores ni advertencias.
2. Revisión en celular y escritorio.
3. Enlaces internos y externos funcionando.
4. Consola del navegador sin errores.
5. Lighthouse en móvil.
6. Lista de lo que quedó con `[PENDIENTE]`.
