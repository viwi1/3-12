import { updateState } from "./state.js";
import { formatNumber } from "./main.js"; // ✅ Importera korrekt

document.addEventListener("DOMContentLoaded", () => {
    let startVarde = 6855837;
    const START_VARDE_DALIGT = 3000000;
    const HUSLAN = 2020500;

    const resultContainer = document.getElementById("resultFörsäljning");
    if (!resultContainer) return;

    // ✅ Generera UI i DOM
    resultContainer.innerHTML = `
        <div class="box">
            <p><strong>Startvärde på bolaget:</strong> <span id="nuvarde">${formatNumber(startVarde)}</span></p>
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
                <input type="checkbox" id="betalaHuslan" checked>
                <label for="betalaHuslan">🏡 Betala av huslånet direkt vid exit</label>
            </div>
            <p class="result-title"><strong id="exitTitle">Exitbelopp</strong></p>
            <p id="exitBelopp"></p>
            <div id="huslanDetaljer"></div>
        </div>
    `;

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
        const skattLåg = 0.20;
        const skattHög = 0.50;
        const belopp312 = 684166;

        startVarde = daligtNuvardeEl.checked ? START_VARDE_DALIGT : 6855837;
        nuvardeEl.textContent = formatNumber(startVarde);

        let forsPris = startVarde * multipel;
        let exitKapital = forsPris;

        let nettoLåg = belopp312 * (1 - skattLåg);
        let lanEfterLågSkatt = HUSLAN - nettoLåg;
        let bruttoHögBehov = lanEfterLågSkatt > 0 ? lanEfterLågSkatt / (1 - skattHög) : 0;
        let totaltBruttoForLan = belopp312 + bruttoHögBehov;

        if (betalaHuslanEl.checked) {
            exitKapital -= totaltBruttoForLan;
        }

        updateState("exitVarde", exitKapital);
        updateState("betalaHuslan", betalaHuslanEl.checked);

        exitTitleEl.textContent = betalaHuslanEl.checked
            ? "Exitbelopp efter huslånsbetalning 🏡"
            : "Exitbelopp";
        exitBeloppEl.textContent = formatNumber(exitKapital);

        huslanDetaljerEl.innerHTML = betalaHuslanEl.checked
            ? `
            <p>Huslån: ${formatNumber(HUSLAN)}</p>
            <p><strong>Bruttobelopp för lån:</strong> ${formatNumber(totaltBruttoForLan)}</p>
            <p>- ${formatNumber(belopp312)} (20% skatt) → Netto: ${formatNumber(nettoLåg)}</p>
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
        startVarde = daligtNuvardeEl.checked ? START_VARDE_DALIGT : 6855837;
        nuvardeEl.textContent = formatNumber(startVarde);
        uppdateraBeräkningar();
    });

    multipelValueEl.textContent = multipelEl.value;
    betalaHuslanEl.checked = true; 
    uppdateraBeräkningar();
});

// ✅ Exporterar funktionen korrekt
export { uppdateraBeräkningar };
