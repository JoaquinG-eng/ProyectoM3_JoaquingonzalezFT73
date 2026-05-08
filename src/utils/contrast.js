export function initContrastButton() {
  const button = document.getElementById("contrast-btn");
  if (!button) return;

  if (localStorage.getItem("highContrast") === "true") {
    document.body.classList.add("high-contrast");
  }

  button.addEventListener("click", () => {
    document.body.classList.toggle("high-contrast");
    const enabled = document.body.classList.contains("high-contrast");
    localStorage.setItem("highContrast", enabled);
  });
}