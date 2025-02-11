import { updateState, getState } from "./state.js";
import { formatNumber } from "./main.js"; // För att kunna formatera siffror

function uppdateraBeräkningar() {
    // 1️⃣ Hämta multipel och ursprungligt bolagsvärde
    let multipel = parseFloat(document.getElementById("multipel").value) || 1;
    let startVarde = getState("startVarde") || 0; // I state.js bör du ha: State.startVarde = 6855837 etc.

    // 2️⃣ Hämta huslån och kolla om checkboxen är ibockad
    let huslan = getState("huslan") || 0;
    let betalaHuslan = document.getElementById("betalaHuslan").checked;

    // 3️⃣ Beräkna försäljningspris baserat på multipel
    let forsaljningspris = startVarde * multipel;
    console.log("🔎 Försäljningspris (startVarde * multipel):", forsaljningspris);

    let exitKapital = forsaljningspris;

    // Skattesatser och 3:12-gränsvärde
    let skattLåg = 0.20;
    let skattHög = 0.50;
    let gransvarde312 = 684166;

    // 4️⃣ Räkna ut hur mycket som behövs för att betala huslån med 3:12-optimering
    let nettoLåg = gransvarde312 * (1 - skattLåg);  
    // Resterande huslån efter att vi använt "lågskattebeloppet"
    let lanEfterLagSkatt = huslan - nettoLåg;

    // Om det fortfarande finns lånebelopp kvar efter lågskatt
    let bruttoHögBehov = lanEfterLagSkatt > 0 ? lanEfterLagSkatt / (1 - skattHög) : 0;
    let totaltBruttoFörLån = gransvarde312 + bruttoHögBehov;  

    // Endast om checkboxen är ibockad, dra av från exitKapital
    if (betalaHuslan) {
        exitKapital -= totaltBruttoFörLån;
        console.log("✅ Huslån betalas; exitKapital:", exitKapital);
    }

    // 5️⃣ Säkerhetskontroll: Om exitKapital blir negativt, sätt den till 0
    if (exitKapital < 0) {
        console.warn("🚨 Varning: exitKapital är negativt. Sätter exitKapital till 0.");
        exitKapital = 0;
    }

    // 6️⃣ Uppdatera state med nya exitKapitalet
    updateState("exitVarde", exitKapital);
    console.log("🚀 exitVarde uppdaterat i state:", exitKapital);

    // 7️⃣ Skriv ut resultat i HTML
    document.getElementById("resultFörsäljning").innerHTML = `
        <div class="box">
            <p class="result-title">${betalaHuslan ? "Exitbelopp efter huslånsbetalning 🏡" : "Exitbelopp"}</p>
            <p><strong>${formatNumber(exitKapital)}</strong></p>
            ${betalaHuslan ? `
            <p><strong>Huslån:</strong> ${formatNumber(huslan)}</p>
            <p><strong>Bruttobelopp för lån:</strong> ${formatNumber(totaltBruttoFörLån)}</p>
            <p>- ${formatNumber(gransvarde312)} (20% skatt) → Netto: ${formatNumber(nettoLåg)}</p>
            <p>- Resterande (50% skatt): ${formatNumber(bruttoHögBehov)} → Netto: ${formatNumber(lanEfterLagSkatt > 0 ? lanEfterLagSkatt : 0)}</p>
            <p><strong>Totalt netto använt för lån:</strong> ${formatNumber(huslan)}</p>
            ` : ""}
        </div>
    `;
}

// ⏰ Körs när sidan laddas och när multipeln/huslånecheckboxen ändras
document.addEventListener("DOMContentLoaded", function () {
    uppdateraBeräkningar();

    // Event: multipel-slider
    document.getElementById("multipel").addEventListener("input", () => {
        console.log("Multipel ändrad; uppdaterar exitberäkning ...");
        uppdateraBeräkningar();
    });

    // Event: huslånecheckbox
    document.getElementById("betalaHuslan").addEventListener("change", () => {
        console.log("Huslån-checkbox ändrad; uppdaterar exitberäkning ...");
        uppdateraBeräkningar();
    });
});

export { uppdateraBeräkningar };
