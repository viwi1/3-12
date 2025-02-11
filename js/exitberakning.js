import { updateState, getState } from "./state.js";
import { formatNumber } from "./main.js"; // ✅ Formatering

function uppdateraBeräkningar() {
    // 1️⃣ Hämta multipel och startvärde från state.js
    let multipel = parseFloat(document.getElementById("multipel").value) || 1;
    let startVarde = getState("startVarde") || 0;

    // 2️⃣ Hämta huslån och kolla om checkboxen är markerad
    let huslan = getState("huslan") || 0;
    let betalaHuslan = document.getElementById("betalaHuslan").checked;

    // 3️⃣ Hämta skattesatser och 3:12-belopp från state.js
    let skattLåg = getState("skattUtdelningLåg") || 0.20;
    let skattHög = getState("skattUtdelningHög") || 0.50;
    let gransvarde312 = getState("312sparatbelopp") || 684166;

    // 4️⃣ Beräkna försäljningspris baserat på multipel (🔴 OBS: startvärde används korrekt här!)
    let forsaljningspris = startVarde * multipel;
    console.log("🔎 Försäljningspris (startVarde * multipel):", forsaljningspris);

    // 5️⃣ Sätt alltid `exitKapital` till `forsaljningspris` först (❗ undviker ackumulativa avdrag)
    let exitKapital = forsaljningspris;

    // 6️⃣ Räkna ut hur mycket som behövs för att betala huslån
    let nettoLåg = gransvarde312 * (1 - skattLåg);
    let lanEfterLagSkatt = huslan - nettoLåg;
    let bruttoHögBehov = lanEfterLagSkatt > 0 ? lanEfterLagSkatt / (1 - skattHög) : 0;
    let totaltBruttoFörLån = gransvarde312 + bruttoHögBehov;

    // 7️⃣ Endast om checkboxen är ibockad, dra av från exitKapital
    if (betalaHuslan) {
        exitKapital = forsaljningspris - totaltBruttoFörLån;
        console.log("✅ Huslån betalat, nytt exitKapital:", exitKapital);
    } else {
        exitKapital = forsaljningspris; // ❗ Återställ till original om checkboxen bockas ur
    }

    // 8️⃣ Säkerhetskontroll: Om `exitKapital` blir negativt, sätt det till 0
    if (exitKapital < 0) {
        console.warn("🚨 Varning! exitKapital blev negativt. Justeras till 0.");
        exitKapital = 0;
    }

    // 9️⃣ Uppdatera state med nya exitKapitalet (❗ bara en gång, för att undvika flera avdrag)
    updateState("exitVarde", exitKapital);
    console.log("🚀 Uppdaterat exitVarde i state:", exitKapital);

    // 🔄 10️⃣ Uppdatera HTML med resultaten
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

// ⏰ Event listeners vid sidladdning och multipeländringar
document.addEventListener("DOMContentLoaded", function () {
    let multipelElement = document.getElementById("multipel");
    let multipelValueElement = document.getElementById("multipelValue");

    // 🔄 Visa startvärdet för multipeln från HTML
    multipelValueElement.textContent = multipelElement.value;

    // 🔄 Uppdatera multipelvärdet i realtid när slidern ändras
    multipelElement.addEventListener("input", function () {
        let multipel = parseFloat(this.value);

        // ✅ Uppdatera HTML-texten bredvid slidern
        multipelValueElement.textContent = multipel.toFixed(1);

        // ✅ Kör om exitberäkningen så att allt uppdateras korrekt
        uppdateraBeräkningar();
    });

    // 🔄 Lägg till event listener för huslåne-checkboxen
    document.getElementById("betalaHuslan").addEventListener("change", function () {
        console.log("⚡ Huslånecheckbox ändrad, uppdaterar beräkning...");
        uppdateraBeräkningar();
    });

    // 🔄 Starta första beräkningen
    uppdateraBeräkningar();
});

export { uppdateraBeräkningar };
