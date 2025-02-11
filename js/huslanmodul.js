import { updateState, getState } from "./state.js";
import { formatNumber } from "./main.js"; // ✅ Importera `formatNumber`

function beraknaHuslan() {
    let huslan = getState("huslan") || 0;  // ✅ Sätt standardvärde
    let originalExitVarde = getState("exitVarde") || 0;  // ✅ Hämta originalvärdet

    let betalaHuslan = document.getElementById("betalaHuslan").checked;
    let nyttExitVarde = betalaHuslan ? originalExitVarde - huslan : originalExitVarde; // ✅ Beräkna lokalt

    // ✅ Uppdatera endast HTML, ej state
    document.getElementById("resultFörsäljning").innerHTML = `
        <div class="box">
            <p class="result-title">${betalaHuslan ? "Exitbelopp efter huslånsbetalning" : "Exitbelopp"}</p>
            <p><strong>${formatNumber(nyttExitVarde)}</strong></p>
        </div>
    `;
}

// ✅ Lägg till event listener när DOM är laddad
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("betalaHuslan").addEventListener("change", beraknaHuslan);
});

export { beraknaHuslan };
