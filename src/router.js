import { renderHome } from "./views/home.js";
import { renderChat, initChat } from "./views/chat.js";
import { renderAbout } from "./views/about.js";
import { renderNotFound } from "./views/notFound.js";

export function router() {

  const app = document.getElementById("app");
  const path = window.location.pathname;

  if (!app) return;

  if (path === "/home" || path === "/") {
    app.innerHTML = renderHome();
  }

  else if (path === "/chat") {
    app.innerHTML = renderChat();

    setTimeout(() => {
      initChat();
    }, 0);
  }

  else if (path === "/about") {
    app.innerHTML = renderAbout();
  }

  else {
    app.innerHTML = renderNotFound();
  }
}