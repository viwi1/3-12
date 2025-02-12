import { updateState, getState } from "./state.js";
import { formatNumber } from "./main.js";

document.addEventListener("DOMContentLoaded", () => {
    const resultContainer = document.getElementById("resultFörsäljning");
    if (!resultContainer) return;

    // 🎯 Direkt definierade värden (ej i state.js)
    const START_VARDE = 6855837;
    const START_VARDE_DALIGT = 3000000;
    const HUSLAN = 2020500;

    // 🎯 Generera UI
    resultContainer.innerHTML = `
        <div class="box">
            <p><strong>Startvärde på bolaget:</strong> <span id="nuvarde">${formatNumber(START_VARDE)}</span></p>
            <div class="checkbox-container">
                <input type="checkbox" id="daligtNuvarde">
                <label for="daligtNuvarde">3 000 000 kr</label>
            </div>
            <div class="slider-container">
                <label for="multipel">Multipel:</label>
                <input type="range" id="multipel" min="1.1" max="4" step="0.1" value="1.5">
                <span class="slider-value" id="multipelValue">1.5</span>
            </div>
            <div class="checkbox-container">
                <input type="checkbox" id="betalaHuslan">
                <label for="betalaHuslan">🏡 Betala av huslånet direkt vid exit</label>
            </div>
            <p class="result-title"><strong id="exitTitle">Exitbelopp</strong></p>
            <p id="exitBelopp" style="color: green; font-weight: bold;"></p>
            <hr>
            <div id="huslanDetaljer"></div>
        </div>
    `;

    // 🔹 Hämta element
    const nuvardeEl = document.getElementById("nuvarde");
    const daligtNuvardeEl = document.getElementById("daligtNuvarde");
    const multipelEl = document.getElementById("multipel");
    const multipelValueEl = document.getElementById("multipelValue");
    const betalaHuslanEl = document.getElementById("betalaHuslan");
    const exitTitleEl = document.getElementById("exitTitle");
    const exitBeloppEl = document.getElementById("exitBelopp");
    const huslanDetaljerEl = document.getElementById("huslanDetaljer");

    function uppdateraBeräkningar() {
        const multipel = parseFloat(multipelEl.value) || 1;
        const spara312 = getState("belopp312");
        const skattLåg = getState("skattUtdelningLåg");
        const skattHög = getState("skattUtdelningHög");
        const betalaHuslan = betalaHuslanEl.checked;

        let startVarde = daligtNuvardeEl.checked ? START_VARDE_DALIGT : START_VARDE;
        let forsPris = startVarde * multipel;
        let exitKapital = forsPris;

        let nettoLåg = spara312 * (1 - skattLåg);
        let lanEfterLågSkatt = HUSLAN - nettoLåg;
        let bruttoHögBehov = lanEfterLågSkatt > 0 ? lanEfterLågSkatt / (1 - skattHög) : 0;
        let totaltBruttoForLan = spara312 + bruttoHögBehov;

        if (betalaHuslan) {
            exitKapital -= totaltBruttoForLan;
        }

        updateState("exitVarde", exitKapital);
        updateState("betalaHuslan", betalaHuslan);

        exitTitleEl.textContent = betalaHuslan
            ? "Exitbelopp efter huslånsbetalning 🏡"
            : "Exitbelopp";
        exitBeloppEl.textContent = formatNumber(exitKapital);

        huslanDetaljerEl.innerHTML = betalaHuslan
            ? `
            <p>Huslån: ${formatNumber(HUSLAN)}</p>
            <p><strong>Bruttobelopp för lån:</strong> ${formatNumber(totaltBruttoForLan)}</p>
            <p>- ${formatNumber(spara312)} (20% skatt) → Netto: ${formatNumber(nettoLåg)}</p>
            <p>- Resterande (50% skatt): ${formatNumber(bruttoHögBehov)} → Netto: ${formatNumber(lanEfterLågSkatt > 0 ? lanEfterLågSkatt : 0)}</p>
            `
            : "";
    }

    multipelEl.addEventListener("input", () => {
        multipelValueEl.textContent = parseFloat(multipelEl.value).toFixed(1);
        uppdateraBeräkningar();
    });

    betalaHuslanEl.addEventListener("change", uppdateraBeräkningar);
    
    daligtNuvardeEl.addEventListener("change", () => {
        let startVarde = daligtNuvardeEl.checked ? START_VARDE_DALIGT : START_VARDE;
        nuvardeEl.textContent = formatNumber(startVarde);
        uppdateraBeräkningar();
    });

    multipelValueEl.textContent = multipelEl.value;
    betalaHuslanEl.checked = getState("betalaHuslan") || false;
    uppdateraBeräkningar();
});

export function uppdateraBeräkningar() {}
