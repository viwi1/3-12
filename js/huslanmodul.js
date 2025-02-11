import { updateState, getState } from "./state.js";
import { formatNumber } from "./main.js"; // ✅ Importera `formatNumber`

function beraknaHuslan() {
    let huslan = getState("huslan") || 2020500; // ✅ Standard huslån om det saknas
    let originalExitVarde = getState("exitVarde") || 0;  // ✅ Hämta original exitvärde
    let betalaHuslan = document.getElementById("betalaHuslan").checked;
    
    let multipel = parseFloat(document.getElementById("multipel").value) || 1; // ✅ Hämta multipeln
    let försäljningspris = originalExitVarde * multipel; // ✅ Multiplicerat exitvärde

    let skattLåg = 0.20; // 20% skatt
    let skattHög = 0.50; // 50% skatt

    let gränsvärde312 = 684166; // ✅ Gränsvärde för lågbeskattad utdelning
    let nettoLåg = gränsvärde312 * (1 - skattLåg); // ✅ Netto efter 20% skatt

    let lånebehovEfterLågSkatt = huslan - nettoLåg;
    let bruttoHögBehov = lånebehovEfterLågSkatt / (1 - skattHög);
    let totaltBruttoFörLån = gränsvärde312 + bruttoHögBehov;
    let nettoTotalt = nettoLåg + lånebehovEfterLågSkatt;

    let nyttExitVarde = betalaHuslan ? försäljningspris - totaltBruttoFörLån : försäljningspris; // ✅ Exitvärde efter lån

    // ✅ Uppdatera HTML med beräkningar
    document.getElementById("resultFörsäljning").innerHTML = `
        <div class="box">
            <p class="result-title">${betalaHuslan ? "Exitbelopp efter huslånsbetalning 🏡" : "Exitbelopp"}</p>
            <p><strong>${formatNumber(nyttExitVarde)}</strong></p>
            ${betalaHuslan ? `
            <p><strong>Huslån:</strong> ${formatNumber(huslan)}</p>
            <p><strong>Bruttobelopp för lån:</strong> ${formatNumber(totaltBruttoFörLån)}</p>
            <p>- ${formatNumber(gränsvärde312)} (20% skatt) → Netto: ${formatNumber(nettoLåg)}</p>
            <p>- Resterande (50% skatt): ${formatNumber(bruttoHögBehov)} → Netto: ${formatNumber(lånebehovEfterLågSkatt)}</p>
            <p><strong>Totalt netto använt för lån:</strong> ${formatNumber(nettoTotalt)}</p>
            ` : ""}
        </div>
    `;
}

// ✅ Lägg till event listener när DOM är laddad
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("betalaHuslan").addEventListener("change", beraknaHuslan);
});

export { beraknaHuslan };
