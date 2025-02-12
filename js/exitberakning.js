import { updateState } from "./state.js";
import { formatNumber } from "./main.js";

document.addEventListener("DOMContentLoaded", () => {
    // 🎯 Direkt definierade värden
    const START_VARDE = 6855837;
    const START_VARDE_DALIGT = 3000000;
    let huslan = 2020500; // Standard huslån

    const resultContainer = document.getElementById("resultFörsäljning");
    if (!resultContainer) return;

    // ✅ Skapa UI direkt i DOM
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
                <input type="checkbox" id="betalaHuslan" checked>
                <label for="betalaHuslan">🏡 Betala av huslånet direkt vid exit</label>
            </div>
            <p class="result-title"><strong id="exitTitle">Exitbelopp</strong></p>
            <p id="exitBelopp" style="color:green; font-weight:bold;"></p>
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
        // 🔹 Kolla om "Dåligt nuvärde" är ikryssat
        const ärDåligt = daligtNuvardeEl.checked;
        const startVarde = ärDåligt ? START_VARDE_DALIGT : START_VARDE;

        // 🔹 Uppdatera startvärde
        nuvardeEl.textContent = formatNumber(startVarde);

        // 🔹 Hämta multipel
        const multipel = parseFloat(multipelEl.value) || 1;
        multipelValueEl.textContent = multipel.toFixed(1);

        // 🔹 Beräkna exitKapital
        let försäljningspris = startVarde * multipel;
        let exitKapital = försäljningspris;

        // 🔹 Låneberäkning
        const belopp312 = 684166;
        const skattLåg = 0.20;
        const skattHög = 0.50;

        let nettoLåg = belopp312 * (1 - skattLåg);
        let lanEfterLågSkatt = huslan - nettoLåg;
        let bruttoHögBehov = lanEfterLågSkatt > 0 ? lanEfterLågSkatt / (1 - skattHög) : 0;
        let totaltBruttoFörLån = belopp312 + bruttoHögBehov;
        let totaltNettoLån = nettoLåg + lanEfterLågSkatt;

        if (betalaHuslanEl.checked) {
            exitKapital -= totaltBruttoFörLån;
        }

        // 🔹 Uppdatera state
        updateState("exitVarde", exitKapital);
        updateState("betalaHuslan", betalaHuslanEl.checked);

        // 🔹 Visa exitbelopp
        exitTitleEl.textContent = betalaHuslanEl.checked
            ? "Exitbelopp efter huslånsbetalning 🏡"
            : "Exitbelopp";
        exitBeloppEl.textContent = formatNumber(exitKapital);

        // 🔹 Visa huslånedetaljer
        huslanDetaljerEl.innerHTML = betalaHuslanEl.checked
            ? `
            <p>Huslån: <span id="huslanValue" style="cursor:pointer; text-decoration:underline;">${formatNumber(huslan)}</span> ✏️</p>
            <p>Bruttobelopp för lån: ${formatNumber(totaltBruttoFörLån)}</p>
            <p>- ${formatNumber(belopp312)} (20% skatt) → Netto: ${formatNumber(nettoLåg)}</p>
            <p>- Resterande (50% skatt): ${formatNumber(bruttoHögBehov)} → Netto: ${formatNumber(lanEfterLågSkatt)}</p>
            <hr>
            <p><strong>${formatNumber(nettoLåg)} + ${formatNumber(lanEfterLågSkatt)} = ${formatNumber(totaltNettoLån)}</strong></p>
            `
            : "";

        // 🏡 Lägg till klickfunktion för att ändra huslånet
        const huslanValueEl = document.getElementById("huslanValue");
        if (huslanValueEl) {
            huslanValueEl.addEventListener("click", öppnaPopupHuslan);
        }
    }

    function öppnaPopupHuslan() {
        let nyttHuslan = prompt("Ange nytt huslånebelopp:", huslan);
        if (nyttHuslan !== null) {
            huslan = parseInt(nyttHuslan, 10) || huslan;
            uppdateraBeräkningar();
        }
    }

    multipelEl.addEventListener("input", uppdateraBeräkningar);
    betalaHuslanEl.addEventListener("change", uppdateraBeräkningar);
    daligtNuvardeEl.addEventListener("change", uppdateraBeräkningar);

    betalaHuslanEl.checked = true;
    uppdateraBeräkningar();
});

export function uppdateraBeräkningar() {}
