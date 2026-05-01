import { renderHome }
from "./views/home.js";

import {
  renderChat,
  initChat
}
from "./views/chat.js";

import { renderAbout }
from "./views/about.js";





export function router() {

  const app =
    document.getElementById("app");





  const hash =
    window.location.hash
    || "#/home";





  if (hash === "#/home") {

    app.innerHTML =
      renderHome();

  }





  else if (hash === "#/chat") {

    app.innerHTML =
      renderChat();





    initChat();

  }





  else if (hash === "#/about") {

    app.innerHTML =
      renderAbout();

  }





  else {

    app.innerHTML =
      renderHome();

  }

}