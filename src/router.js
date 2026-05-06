import {renderHome} from "./views/home.js";

import {renderChat, initChat} from "./views/chat.js";

import {renderAbout} from "./views/about.js";

import {renderNotFound} from "./views/notFound.js";

export function router(){

const app = document.getElementById("app");

const hash = window.location.hash
|| "#/home";

if(hash === "#/home"){

app.innerHTML = renderHome();

}

else if(hash === "#/chat"){

app.innerHTML = renderChat();

initChat();

}

else if(hash === "#/about"){

app.innerHTML = renderAbout();

}

else{

app.innerHTML = renderNotFound();

}

updateActiveLinks();

}

function updateActiveLinks(){

const links = document.querySelectorAll(".nav-link");

links.forEach(link => { link.classList.remove(
"active-link"
);

if(
link.getAttribute("href") 
=== window.location.hash
){

link.classList.add(
"active-link"
);

}

});

}