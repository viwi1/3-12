import { formatNumber } from "./main.js";
import { getState, onStateChange } from "./state.js";

function skapaUtgifterUI() {
    const container = document.getElementById("expenses");
    if (!container) return;

    container.innerHTML = `<h3>Årlig utdelning</h3><p><strong>Totalt netto:</strong> <span id="inkomstBelopp"></span></p>`;
    uppdateraUtgifter(getState("totaltNetto")); // Startvärde
}

function uppdateraUtgifter(inkomst) {
    const beloppEl = document.getElementById("inkomstBelopp");
    if (beloppEl) beloppEl.textContent = formatNumber(inkomst);
}

onStateChange("totaltNetto", uppdateraUtgifter);
document.addEventListener("DOMContentLoaded", skapaUtgifterUI);

export { skapaUtgifterUI, uppdateraUtgifter };
