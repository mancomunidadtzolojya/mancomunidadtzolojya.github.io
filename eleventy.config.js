import fs from "node:fs";
import { generateHTML } from "@11ty/eleventy-img";

const leerJSON = (ruta) => JSON.parse(fs.readFileSync(ruta, "utf8"));

// Busca una imagen ya optimizada por `npm run imagenes`. El texto alternativo
// se lee de imagenes.config.json en cada build, así que cambiarlo no requiere
// regenerar las imágenes.
function buscarImagen(id) {
  const manifiesto = leerJSON("src/_data/imagenes.json");
  const config = leerJSON("imagenes.config.json");
  const metadata = manifiesto[id];
  const entrada = config.fotos[id] ?? config.logos[id];
  if (!metadata || !entrada) {
    throw new Error(`Imagen desconocida: "${id}". Agrégala en imagenes.config.json y ejecuta npm run imagenes.`);
  }
  return { metadata, entrada };
}

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addWatchTarget("imagenes.config.json");

  // {% imagen "id", { sizes: "…", carga: "eager", prioridad: true, clase: "…", alt: "…" } %}
  eleventyConfig.addShortcode("imagen", function (id, opciones = {}) {
    const { metadata, entrada } = buscarImagen(id);
    const carga = opciones.carga ?? "lazy";
    const atributos = {
      alt: opciones.alt ?? entrada.alt,
      sizes: opciones.sizes ?? "100vw",
      loading: carga,
      decoding: carga === "lazy" ? "async" : undefined,
      fetchpriority: opciones.prioridad ? "high" : undefined,
      class: opciones.clase,
    };
    return generateHTML(
      metadata,
      Object.fromEntries(Object.entries(atributos).filter(([, valor]) => valor !== undefined)),
    );
  });

  // Precarga de la foto principal (solo AVIF; los navegadores sin AVIF la ignoran).
  eleventyConfig.addShortcode("precargaImagen", function (id, sizes = "100vw") {
    const { metadata } = buscarImagen(id);
    const srcset = metadata.avif.map((v) => v.srcset).join(", ");
    return `<link rel="preload" as="image" type="image/avif" imagesrcset="${srcset}" imagesizes="${sizes}" fetchpriority="high">`;
  });

  eleventyConfig.addFilter("urlAbsoluta", (ruta, base) => new URL(ruta, base).href);
  eleventyConfig.addFilter("extraer", (lista, clave) => lista.map((item) => item[clave]));
}

export const config = {
  dir: {
    input: "src",
    output: "_site",
    includes: "_includes",
    data: "_data",
  },
  templateFormats: ["njk", "md"],
  htmlTemplateEngine: "njk",
  markdownTemplateEngine: "njk",
};
