import { updateState, getState } from "./state.js";

function formatNumber(num) {
    return Math.round(num).toLocaleString("sv-SE") + " kr";
}

document.addEventListener("DOMContentLoaded", function () {
    // ✅ Hämta rätt värde på bolaget
    let nuvarde = getState("exitVarde");
    document.getElementById("nuvarde").textContent = formatNumber(nuvarde);
    
    // ✅ Starta beräkningar
    uppdateraBeräkningar();
});
