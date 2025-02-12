import { updateState } from "./state.js";
import { formatNumber } from "./main.js";

document.addEventListener("DOMContentLoaded", () => {

    let huslan = 2020500;
    let svartVarde = 6855837;

    const resultContainer = document.getElementById("resultFörsäljning");
    if (!resultContainer) return;

    resultContainer.innerHTML = `
        <div class="box">
            <p><strong>Startvärde på bolaget:</strong> <span id="startVarde"></span></p>
            <div class="slider-container">
                <label for="multipel">Multipel:</label>
                <input type="range" id="multipel" min="1.1" max="4" step="0.1" value="1.5">
                <span class="slider-value" id="multipelValue">1.5</span>
            </div>
            <div class="checkbox-container">
                <input type="checkbox" id="betalaHuslan" checked>
                <label for="betalaHuslan">🏡 Betala av huslånet direkt vid exit</label>
            </div>
            <p class="result-title"><strong id="exitTitle">Exitbelopp</strong></p>
            <p id="exitBelopp" style="color:green; font-weight:bold;"></p>
            <div id="huslanDetaljer"></div>
        </div>
    `;

    // 🔹 Hämta element
    const nuvardeEl        = document.getElementById("nuvarde");
    const daligtNuvardeEl  = document.getElementById("daligtNuvarde");
    const multipelEl       = document.getElementById("multipel");
    const multipelValueEl  = document.getElementById("multipelValue");
    const betalaHuslanEl   = document.getElementById("betalaHuslan");
    const exitTitleEl      = document.getElementById("exitTitle");
    const exitBeloppEl     = document.getElementById("exitBelopp");
    const huslanDetaljerEl = document.getElementById("huslanDetaljer");


        nuvardeEl.textContent = formatNumber ? formatNumber(startVarde) : startVarde;

    function uppdateraBeräkningar() {
        console.log("🔎 [Debug] Kör uppdateraBeräkningar");

        // 🔹 Utskrift av startvärde i UI
        nuvardeEl.textContent = formatNumber ? formatNumber(startVarde) : startVarde;

        // 🔹 Hämta multipel
        const multipel = parseFloat(multipelEl.value) || 1;
        console.log("🔎 [Debug] multipel =", multipel);
        multipelValueEl.textContent = multipel.toFixed(1);

        // 🔹 Beräkna exitKapital
        let försäljningspris = faktiskStartvarde * multipel;
        let exitKapital = försäljningspris;
        console.log("🔎 [Debug] försäljningspris =", försäljningspris);

        // 🔹 Låneberäkning
        const belopp312 = 684166;
        const skattLåg  = 0.20;
        const skattHög  = 0.50;

        let nettoLåg          = belopp312 * (1 - skattLåg);
        let lanEfterLågSkatt  = huslan - nettoLåg;
        let bruttoHögBehov    = lanEfterLågSkatt > 0 ? lanEfterLågSkatt / (1 - skattHög) : 0;
        let totaltBruttoFörLån = belopp312 + bruttoHögBehov;

        console.log("🔎 [Debug] lanEfterLågSkatt =", lanEfterLågSkatt);
        console.log("🔎 [Debug] totaltBruttoFörLån =", totaltBruttoFörLån);

        if (betalaHuslanEl.checked) {
            exitKapital -= totaltBruttoFörLån;
            console.log("🔎 [Debug] Huslån draget => exitKapital =", exitKapital);
        }

        console.log("🔎 [Debug] Slutligt exitKapital =", exitKapital);

        // 🔹 Sätt i state
        if (updateState) {
            updateState("exitVarde", exitKapital);
            updateState("betalaHuslan", betalaHuslanEl.checked);
        } else {
            console.warn("⚠️ [Varning] updateState är inte tillgänglig!");
        }

        // 🔹 Visa exit
        exitTitleEl.textContent = betalaHuslanEl.checked
            ? "Exitbelopp efter huslånsbetalning 🏡"
            : "Exitbelopp";
        exitBeloppEl.textContent = formatNumber ? formatNumber(exitKapital) : exitKapital;

        huslanDetaljerEl.innerHTML = betalaHuslanEl.checked
            ? `
            <p>Huslån: <span id="huslanValue" style="cursor:pointer; text-decoration:underline;">${formatNumber ? formatNumber(huslan) : huslan}</span></p>
            <p><strong>Bruttobelopp för lån:</strong> ${formatNumber ? formatNumber(totaltBruttoFörLån) : totaltBruttoFörLån}</p>
            <p>- ${formatNumber ? formatNumber(belopp312) : belopp312} (20% skatt) → Netto: ${formatNumber ? formatNumber(nettoLåg) : nettoLåg}</p>
            <p>- Resterande (50% skatt): ${formatNumber ? formatNumber(bruttoHögBehov) : bruttoHögBehov} → Netto: ${formatNumber ? formatNumber(lanEfterLågSkatt > 0 ? lanEfterLågSkatt : 0) : lanEfterLågSkatt}</p>
            `
            : "";

        console.log("🔎 [Debug] Utskrift klar!");
    }

    multipelEl.addEventListener("input", () => {
        uppdateraBeräkningar();
    });

    betalaHuslanEl.addEventListener("change", uppdateraBeräkningar);
    daligtNuvardeEl.addEventListener("change", uppdateraBeräkningar);

    console.log("🔎 [Debug] Initierar => betalaHuslanEl.checked =", betalaHuslanEl.checked);
    betalaHuslanEl.checked = true;
    uppdateraBeräkningar();
});

// ✅ Export
export function uppdateraBeräkningar() {}
