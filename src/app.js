import { router } from "./router.js";

function startApp() {
if (!window.location.hash) {
window.location.hash = "#/home";
}

document.body.classList.add(
"theme-mario"
);

router();
}
window.addEventListener(
"load",
startApp
);
window.addEventListener(
"hashchange",
router
);