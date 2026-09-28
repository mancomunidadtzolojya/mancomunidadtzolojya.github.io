// Genera las versiones optimizadas de fotos y logos a partir de los originales.
//
// Uso: npm run imagenes
//
// Los originales NO están en el repositorio (ver CLAUDE.md). Se leen de
// FOTOS_ORIGEN (por defecto ~/Documents/fotos-sitio). El resultado se guarda en
// src/assets/img/ y en src/_data/imagenes.json, y eso sí se versiona: GitHub
// Actions no tiene acceso a los originales.

import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import Image from "@11ty/eleventy-img";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const raiz = path.resolve(import.meta.dirname, "..");
const origen = process.env.FOTOS_ORIGEN || path.join(os.homedir(), "Documents", "fotos-sitio");
const config = JSON.parse(await fs.readFile(path.join(raiz, "imagenes.config.json"), "utf8"));

const grupos = {
  fotos: {
    salida: "src/assets/img/fotos",
    url: "/assets/img/fotos/",
    formatos: ["avif", "webp"],
    // Corrige la orientación EXIF antes de redimensionar.
    preparar: (img) => img.rotate(),
  },
  logos: {
    salida: "src/assets/img/logos",
    url: "/assets/img/logos/",
    formatos: ["webp", "png"],
    // Quita márgenes transparentes o blancos (el logo de Nim Kat ocupa una
    // parte mínima de un lienzo enorme).
    preparar: (img) => img.trim({ threshold: 10 }),
  },
};

async function procesar(grupo, id, entrada) {
  const { salida, url, formatos, preparar } = grupos[grupo];
  const archivo = path.join(origen, entrada.archivo);
  const buffer = await preparar(sharp(archivo)).toBuffer();

  const metadata = await Image(buffer, {
    widths: entrada.anchos,
    formats: formatos,
    outputDir: path.join(raiz, salida),
    urlPath: url,
    filenameFormat: (_hash, _src, ancho, formato) => `${id}-${ancho}.${formato}`,
    sharpAvifOptions: { quality: 55 },
    sharpWebpOptions: { quality: 76 },
    sharpPngOptions: { compressionLevel: 9, palette: true },
  });

  // `outputPath` es una ruta absoluta local: no se guarda en el repositorio.
  return Object.fromEntries(
    Object.entries(metadata).map(([formato, versiones]) => [
      formato,
      versiones.map(({ outputPath, ...resto }) => resto),
    ]),
  );
}

async function imagenOpenGraph() {
  // Imagen para compartir en redes: 1200 × 630, recortada de la foto principal.
  const entrada = config.fotos["portada-principal"];
  const destino = path.join(raiz, "src/assets/img/og-portada.jpg");
  await sharp(path.join(origen, entrada.archivo))
    .rotate()
    .resize(1200, 630, { fit: "cover" })
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(destino);
}

try {
  await fs.access(origen);
} catch {
  console.error(`No se encontró la carpeta de originales: ${origen}\nDefine FOTOS_ORIGEN con la ruta correcta.`);
  process.exit(1);
}

const manifiesto = {};
for (const grupo of Object.keys(grupos)) {
  // Se regenera la carpeta completa para no dejar archivos huérfanos.
  await fs.rm(path.join(raiz, grupos[grupo].salida), { recursive: true, force: true });
  for (const [id, entrada] of Object.entries(config[grupo])) {
    manifiesto[id] = await procesar(grupo, id, entrada);
    console.log(`✓ ${id}  ←  ${entrada.archivo}`);
  }
}
await imagenOpenGraph();
console.log("✓ og-portada.jpg");

await fs.writeFile(
  path.join(raiz, "src/_data/imagenes.json"),
  JSON.stringify(manifiesto, null, 2) + "\n",
);
console.log(`\nManifiesto escrito en src/_data/imagenes.json (${Object.keys(manifiesto).length} imágenes).`);
