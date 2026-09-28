// SITE_ENV=demo (por defecto): noindex y Disallow en robots.txt.
// SITE_ENV=produccion: sitio indexable y analítica activada.
const env = process.env.SITE_ENV === "produccion" ? "produccion" : "demo";

export default {
  env,
  esDemo: env === "demo",
  esProduccion: env === "produccion",
};
