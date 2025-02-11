import { updateState, getState } from "./state.js";
import { uppdateraBeräkningar } from "./exitberakning.js"; // 🔥 IMPORTERA FUNKTIONEN

// ✅ Formateringsfunktion (exporteras korrekt)
function formatNumber(num) {
    return Math.round(num).toLocaleString("sv-SE") + " kr";
}
export { formatNumber };

// 🏁 Säkerställ att startvärde syns vid sidladdning
document.addEventListener("DOMContentLoaded", function () {
    let nuvarde = getState("exitVarde") || 0;
    document.getElementById("nuvarde").textContent = formatNumber(nuvarde);

    // ✅ Kör uppdateraBeräkningar() efter att sidan laddats
    uppdateraBeräkningar();
});
