// Menú móvil. Sin JavaScript el menú se muestra abierto (ver estilos.css).
const boton = document.querySelector(".menu-boton");
const menu = document.getElementById("menu-principal");

if (boton && menu) {
  const alternar = (abrir) => {
    boton.setAttribute("aria-expanded", String(abrir));
    boton.setAttribute("aria-label", abrir ? "Cerrar menú" : "Abrir menú");
    menu.classList.toggle("menu--abierto", abrir);
  };

  boton.addEventListener("click", () => {
    alternar(boton.getAttribute("aria-expanded") !== "true");
  });

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && boton.getAttribute("aria-expanded") === "true") {
      alternar(false);
      boton.focus();
    }
  });
}
