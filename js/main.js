import { updateState, getState } from "./state.js";
import { uppdateraBeräkningar } from "./exitberakning.js"; // 🔥 IMPORTERA FUNKTIONEN

// ✅ Formateringsfunktion (exporteras korrekt)
function formatNumber(num) {
    return Math.round(num).toLocaleString("sv-SE") + " kr";
}
export { formatNumber };

// 🏁 Säkerställ att startvärde syns vid sidladdning
document.addEventListener("DOMContentLoaded", function () {
    console.log("🔎 [Debug] Main.js – DOMContentLoaded triggered");

    let nuvarde = getState("startVarde") || 6855837; // 🔥 Sätter standardvärdet om inget finns i state

    const startVardeEl = document.getElementById("startVarde");
    if (startVardeEl) {
        startVardeEl.textContent = formatNumber(nuvarde);
        console.log("✅ [Debug] Startvärde uppdaterat:", formatNumber(nuvarde));
    } else {
        console.warn("⚠️ [Varning] startVarde elementet hittades inte i DOM!");
    }

    // ✅ Säkerställ att uppdateraBeräkningar() bara körs om funktionen finns
    if (typeof uppdateraBeräkningar === "function") {
        uppdateraBeräkningar();
        console.log("✅ [Debug] uppdateraBeräkningar() kördes.");
    } else {
        console.error("❌ [Fel] uppdateraBeräkningar() kunde inte köras – kontrollera importen!");
    }
});
