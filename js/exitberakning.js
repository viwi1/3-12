import { updateState, getState } from "./state.js";
import { formatNumber } from "./main.js"; // ✅ Importera formateringsfunktionen

function uppdateraBeräkningar() {
    let multipel = parseFloat(document.getElementById("multipel").value) || 1;
    let startVarde = getState("startVarde") || 0;  // ✅ Hämta originalvärdet, inte redan justerat exitVarde
    let huslan = getState("huslan") || 0;
    let betalaHuslan = document.getElementById("betalaHuslan").checked; // ✅ Kolla om checkboxen är markerad

    // ✅ Använd `startVarde` istället för `exitVarde` för att undvika multipla multiplikationer
    let försäljningspris = startVarde * multipel; // ✅ Exitkapital utan justering
    let exitKapital = försäljningspris;

    let skattLåg = 0.20;
    let skattHög = 0.50;
    let gränsvärde312 = 684166;

    let nettoLåg = gränsvärde312 * (1 - skattLåg); 
    let lånebehovEfterLågSkatt = huslan - nettoLåg;
    let bruttoHögBehov = lånebehovEfterLågSkatt / (1 - skattHög);
    let totaltBruttoFörLån = gränsvärde312 + bruttoHögBehov;
    let nettoTotalt = nettoLåg + lånebehovEfterLågSkatt;

    // ✅ Om checkboxen är markerad, justera exitbeloppet
    if (betalaHuslan) {
        exitKapital -= totaltBruttoFörLån;
    }

    // ✅ 🔥 SKICKA EXITVÄRDET TILL STATE EN GÅNG, UTAN LOOPNING
    updateState("exitVarde", exitKapital);
    console.log("🚀 Uppdaterat exitVarde i state:", exitKapital); // ✅ Debugging

    // ✅ Uppdatera HTML
    document.getElementById("resultFörsäljning").innerHTML = `
        <div class="box">
            <p class="result-title">${betalaHuslan ? "Exitbelopp efter huslånsbetalning 🏡" : "Exitbelopp"}</p>
            <p><strong>${formatNumber(exitKapital)}</strong></p>
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

// ✅ Kör funktionen direkt vid sidladdning och säkerställ att den körs **endast en gång per ändring**
document.addEventListener("DOMContentLoaded", function () {
    uppdateraBeräkningar(); // 🔥 Beräkna exitvärde vid sidladdning
    document.getElementById("multipel").addEventListener("input", () => {
        console.log("Multipel ändrad, uppdaterar exitberäkning...");
        uppdateraBeräkningar();
    });
    document.getElementById("betalaHuslan").addEventListener("change", () => {
        console.log("Checkbox för huslån ändrad, uppdaterar exitberäkning...");
        uppdateraBeräkningar();
    });
});

export { uppdateraBeräkningar };
