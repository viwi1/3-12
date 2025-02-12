import { updateState, getState } from "./state.js";
import { formatNumber } from "./main.js";

document.addEventListener("DOMContentLoaded", () => {
    const resultContainer = document.getElementById("resultFörsäljning");
    if (!resultContainer) return;

    // 🎯 Startvärde vid sidladdning (kan påverkas av "Dåligt nuvärde"-checkboxen)
    let startVarde = getState("daligtNuvarde") ? getState("startVardeDåligt") : getState("startVarde");

    // ✅ Generera UI direkt i DOM
    resultContainer.innerHTML = `
        <div class="box">
            <p><strong>Startvärde på bolaget:</strong> <span id="nuvarde">${formatNumber(startVarde)}</span></p>

            <div class="checkbox-container">
                <input type="checkbox" id="daligtNuvarde">
                <label for="daligtNuvarde">3 000 000 kr</label>
            </div>

            <div class="slider-container">
                <label for="multipel">Multipel:</label>
                <input type="range" id="multipel" min="1.1" max="4" step="0.1" value="${getState("multipel")}">
                <span class="slider-value" id="multipelValue">${getState("multipel").toFixed(1)}</span>
            </div>

            <div class="checkbox-container">
                <input type="checkbox" id="betalaHuslan">
                <label for="betalaHuslan">🏡 Betala av huslånet direkt vid exit</label>
            </div>

            <p class="result-title"><strong id="exitTitle">Exitbelopp</strong></p>
            <p id="exitBelopp"></p>
            <div id="huslanDetaljer"></div>
        </div>
    `;

    // 🔹 Hämta element
    const nuvardeEl       = document.getElementById("nuvarde");
    const daligtNuvardeEl = document.getElementById("daligtNuvarde");
    const multipelEl      = document.getElementById("multipel");
    const multipelValueEl = document.getElementById("multipelValue");
    const betalaHuslanEl  = document.getElementById("betalaHuslan");
    const exitTitleEl     = document.getElementById("exitTitle");
    const exitBeloppEl    = document.getElementById("exitBelopp");
    const huslanDetaljerEl = document.getElementById("huslanDetaljer");

    // 🔄 Huvudfunktionen för beräkning
    function uppdateraBeräkningar() {
        const multipel = parseFloat(multipelEl.value) || 1;
        const huslan = getState("huslan") || 2020500;
        const belopp312 = getState("belopp312");
        const skattLåg = getState("skattUtdelningLåg");
        const skattHög = getState("skattUtdelningHög");

        let forsPris = startVarde * multipel;
        let exitKapital = forsPris;

        let nettoLåg = belopp312 * (1 - skattLåg);
        let lanEfterLågSkatt = huslan - nettoLåg;
        let bruttoHögBehov = lanEfterLågSkatt > 0 ? lanEfterLågSkatt / (1 - skattHög) : 0;
        let totaltBruttoForLan = belopp312 + bruttoHögBehov;

        if (betalaHuslanEl.checked) {
            exitKapital -= totaltBruttoForLan;
        }

        // ✅ Uppdatera state
        updateState("multipel", multipel);
        updateState("betalaHuslan", betalaHuslanEl.checked);
        updateState("exitVarde", exitKapital);

        // ✅ Uppdatera UI
        exitTitleEl.textContent = betalaHuslanEl.checked
            ? "Exitbelopp efter huslånsbetalning 🏡"
            : "Exitbelopp";
        exitBeloppEl.textContent = formatNumber(exitKapital);

        huslanDetaljerEl.innerHTML = betalaHuslanEl.checked
            ? `
            <p>Huslån: ${formatNumber(huslan)}</p>
            <p><strong>Bruttobelopp för lån:</strong> ${formatNumber(totaltBruttoForLan)}</p>
            <p>- ${formatNumber(belopp312)} (20% skatt) → Netto: ${formatNumber(nettoLåg)}</p>
            <p>- Resterande (50% skatt): ${formatNumber(bruttoHögBehov)} → Netto: ${formatNumber(lanEfterLågSkatt > 0 ? lanEfterLågSkatt : 0)}</p>
            `
            : "";
    }

    // 🔄 Event-lyssnare
    multipelEl.addEventListener("input", () => {
        multipelValueEl.textContent = parseFloat(multipelEl.value).toFixed(1);
        uppdateraBeräkningar();
    });

    betalaHuslanEl.addEventListener("change", () => {
        updateState("betalaHuslan", betalaHuslanEl.checked);
        uppdateraBeräkningar();
    });

    daligtNuvardeEl.addEventListener("change", () => {
        startVarde = daligtNuvardeEl.checked ? getState("startVardeDåligt") : getState("startVarde");
        nuvardeEl.textContent = formatNumber(startVarde);
        uppdateraBeräkningar();
    });

    // 🏗 Initiera beräkningar vid sidladdning
    multipelValueEl.textContent = multipelEl.value;
    betalaHuslanEl.checked = getState("betalaHuslan") || false;
    uppdateraBeräkningar();
});

// 🛠 Exportera funktionen
export function uppdateraBeräkningar() {}
