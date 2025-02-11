import { updateState, getState } from "./state.js";
import { uppdateraBeräkningar } from "./exitberakning.js"; // 🔥 IMPORTERA FUNKTIONEN

function formatNumber(num) {
    return Math.round(num).toLocaleString("sv-SE") + " kr";
}

// 🏁 Säkerställ att startvärde syns vid sidladdning
document.addEventListener("DOMContentLoaded", function () {
    let nuvarde = getState("exitVarde");
    document.getElementById("nuvarde").textContent = formatNumber(nuvarde);

    // ✅ Kör uppdateraBeräkningar() efter att sidan laddats
    uppdateraBeräkningar();
});

export function formatNumber(num) {
    return Math.round(num).toLocaleString("sv-SE") + " kr";
}
