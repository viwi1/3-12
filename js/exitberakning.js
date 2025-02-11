import { updateState, getState } from "./state.js";
import { formatNumber } from "./main.js"; // ✅ För att kunna formatera siffror

function uppdateraBeräkningar() {
    // 1️⃣ Hämta multipel och startvärde från state.js
    let multipel = parseFloat(document.getElementById("multipel").value) || 1;
    let startVarde = getState("startVarde") || 0; // ❗ Kolla att detta inte är 0 eller null

    // 2️⃣ Hämta huslån och kolla om checkboxen är markerad
    let huslan = getState("huslan") || 0;
    let betalaHuslan = document.getElementById("betalaHuslan").checked;

    // 3️⃣ Beräkna försäljningspris baserat på multipel
    let forsaljningspris = startVarde * multipel;
    console.log("🔎 Försäljningspris (startVarde * multipel):", forsaljningspris);

    // ✅ Initialt är exitKapital = försäljningspris (utan huslåneavdrag)
    let exitKapital = forsaljningspris;

    // 4️⃣ Skattesatser och 3:12-gränsvärde
    let skattLåg = 0.20;
    let skattHög = 0.50;
    let gransvarde312 = 684166; // 🎯 Användbart gränsvärde för lågbeskattad utdelning

    // 5️⃣ Räkna ut hur mycket som behövs för att betala huslån med 3:12-optimering
    let nettoLåg = gransvarde312 * (1 - skattLåg);  
    let lanEfterLagSkatt = huslan - nettoLåg; // 🔹 Kvarvarande belopp efter låg skatt

    // 🔹 Om huslånet är högre än vad som kan beskattas lågt:
    let bruttoHögBehov = lanEfterLagSkatt > 0 ? lanEfterLagSkatt / (1 - skattHög) : 0;
    let totaltBruttoFörLån = gransvarde312 + bruttoHögBehov;  

    // 6️⃣ Endast om checkboxen är ibockad, dra av från exitKapital
    if (betalaHuslan) {
        exitKapital -= totaltBruttoFörLån;
        console.log("✅ Huslån betalas; nytt exitKapital:", exitKapital);
    }

    // 7️⃣ Säkerhetskontroll: Om exitKapital blir negativt, sätt det till 0
    if (exitKapital < 0) {
        console.warn("🚨 Varning: exitKapital blev negativt. Justeras till 0.");
        exitKapital = 0;
    }

    // 8️⃣ Uppdatera state med nya exitKapitalet
    updateState("exitVarde", exitKapital);
    console.log("🚀 exitVarde uppdaterat i state:", exitKapital);

    // 9️⃣ Uppdatera HTML med resultaten
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

// 🏁 ⏰ Kör funktionen vid sidladdning och när multipeln/huslånecheckboxen ändras
document.addEventListener("DOMContentLoaded", function () {
    uppdateraBeräkningar();

    // 🔄 Event: multipel-slider ändras
    document.getElementById("multipel").addEventListener("input", () => {
        console.log("⚡ Multipel ändrad, uppdaterar exitberäkning...");
        uppdateraBeräkningar();
    });

    // 🔄 Event: huslånecheckbox ändras
    document.getElementById("betalaHuslan").addEventListener("change", () => {
        console.log("⚡ Huslån-checkbox ändrad, uppdaterar exitberäkning...");
        uppdateraBeräkningar();
    });
});

export { uppdateraBeräkningar };
