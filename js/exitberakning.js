import { updateState, getState } from "./state.js";
import { formatNumber } from "./main.js"; // ✅ Importera formateringsfunktionen

function uppdateraBeräkningar() {
    let multipel = parseFloat(document.getElementById("multipel").value) || 1;
    let startVarde = getState("startVarde") || 0; // ✅ Hämta originalvärdet från state
    let huslan = getState("huslan") || 0;
    let betalaHuslan = document.getElementById("betalaHuslan").checked; // ✅ Kolla om checkboxen är markerad

    console.log("🔎 Startvärde:", startVarde);
    console.log("🔎 Multipel:", multipel);
    console.log("🔎 Huslån:", huslan);
    console.log("🔎 Checkbox Huslån:", betalaHuslan);

    // ✅ Beräkna exitkapital korrekt (baserat på startvärde och multipel)
    let försäljningspris = startVarde * multipel;
    let exitKapital = försäljningspris;

    console.log("🔎 Försäljningspris (multipel använt):", försäljningspris);

    let skattLåg = 0.20;
    let skattHög = 0.50;
    let gränsvärde312 = 684166;

    let nettoLåg = gränsvärde312 * (1 - skattLåg); 
    let lånebehovEfterLågSkatt = huslan - nettoLåg;
    let bruttoHögBehov = lånebehovEfterLågSkatt > 0 ? lånebehovEfterLågSkatt / (1 - skattHög) : 0;
    let totaltBruttoFörLån = gränsvärde312 + bruttoHögBehov;
    let nettoTotalt = nettoLåg + (lånebehovEfterLågSkatt > 0 ? lånebehovEfterLågSkatt : 0);

    console.log("🔎 Bruttobelopp för lån:", totaltBruttoFörLån);

    // ✅ Om checkboxen är markerad, justera exitbeloppet
    if (betalaHuslan) {
        exitKapital -= totaltBruttoFörLån;
        console.log("✅ Huslån betalat, nytt exitKapital:", exitKapital);
    }

    // 🚨 **Säkerhetskontroll: Se till att exitKapital inte blir negativt!**
    if (exitKapital < 0) {
        console.warn("🚨 Varning! Exitbelopp är negativt. Justerar till 0.");
        exitKapital = 0;
    }

    // ✅ 🔥 SKICKA EXITVÄRDET TILL STATE
    updateState("exitVarde", exitKapital);
    console.log("🚀 Uppdaterat exitVarde i state:", exitKapital);

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
