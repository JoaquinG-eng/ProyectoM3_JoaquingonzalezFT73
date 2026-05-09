import { renderHome }     from "./views/home.js";
import { renderChat }     from "./views/chat.js";
import { renderAbout }    from "./views/about.js";
import { renderNotFound } from "./views/notFound.js";
import { Navbar }         from "./components/navbar.js";

const routes = {
  "/":      renderHome,
  "/home":  renderHome,
  "/chat":  renderChat,
  "/about": renderAbout,
};

export function router() {
  const root = document.getElementById("app");
  const path = window.location.pathname;

  
  if (!routes[path]) {
    window.history.replaceState({}, "", "/home");
    router();
    return;
  }

  if (path !== "/chat") {
    document.body.className = "";
  }

  const renderView = routes[path] || renderNotFound;

root.innerHTML = Navbar() + renderView();

document.querySelectorAll("[data-link]").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      window.history.pushState({}, "", link.getAttribute("href"));
      router();
    });

if (link.getAttribute("href") === path) {
      link.classList.add("active-link");
    }
  });
}