import { updateState, getState } from "./state.js";

// 🏁 Se till att beräkningen körs vid sidladdning
document.addEventListener("DOMContentLoaded", function () {
    uppdateraBeräkningar();
});


// Formateringsfunktion för siffror
function formatNumber(num) {
    return Math.round(num).toLocaleString("sv-SE") + " kr";
}

// Sätter initiala värden vid sidladdning
window.onload = function () {
    document.getElementById("nuvarde").textContent = formatNumber(getState("exitVarde"));
    uppdateraBeräkningar();
};
