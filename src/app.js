import { router } from "./router.js";

function initApp() {

  router();

  document.addEventListener("click", (e) => {

    const link = e.target.closest("[data-link]");
    if (!link) return;

    e.preventDefault();

    history.pushState({}, "", link.getAttribute("href"));

    router();

  });

}

window.addEventListener("load", initApp);
window.addEventListener("popstate", router);