import { updateState } from "./state.js";
import { formatNumber } from "./main.js";

document.addEventListener("DOMContentLoaded", () => {
    // 🎯 Direkt definierade värden
    const START_VARDE = 6855837;
    const START_VARDE_DALIGT = 3000000;
    let huslan = 2500000; // Standard huslån
    let belopp312 = 684166; // Standard 3:12-belopp

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
                <input type="range" id="multipel" min="1.0" max="4" step="0.1" value="3.0">
                <span class="slider-value" id="multipelValue">3.0</span>
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
        const startVarde = daligtNuvardeEl.checked ? START_VARDE_DALIGT : START_VARDE;
        nuvardeEl.textContent = formatNumber(startVarde);

        // 🔹 Hämta multipel
        const multipel = parseFloat(multipelEl.value) || 1;
        multipelValueEl.textContent = multipel.toFixed(1);

        // 🔹 Beräkna exitKapital
        let försäljningspris = startVarde * multipel;
        let exitKapital = försäljningspris;

        // 🔹 Låneberäkning
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
            <hr>
            <p>Huslån: <span id="huslanValue" style="cursor:pointer; text-decoration:underline;">${formatNumber(huslan)}</span></p>
            <p>Bruttobelopp för lån: ${formatNumber(totaltBruttoFörLån)}</p>
            <p>- <span id="belopp312Value" style="cursor:pointer; text-decoration:underline;">${formatNumber(belopp312)}</span> (20% skatt) → Netto: ${formatNumber(nettoLåg)}</p>
            <p>- Resterande (50% skatt): ${formatNumber(bruttoHögBehov)} → Netto: ${formatNumber(lanEfterLågSkatt)}</p>
            <p>- Beräkning nettoutdelning: ${formatNumber(nettoLåg)} + ${formatNumber(lanEfterLågSkatt)} = ${formatNumber(totaltNettoLån)}</p>
            `
            : "";

        // 🏡 Lägg till klickfunktioner för att ändra huslånet och 3:12-beloppet
        document.getElementById("huslanValue").addEventListener("click", öppnaPopupHuslan);
        document.getElementById("belopp312Value").addEventListener("click", öppnaPopupBelopp312);
    }

    function öppnaPopupHuslan() {
        let nyttHuslan = prompt("Ange nytt huslånebelopp:", huslan);
        if (nyttHuslan !== null) {
            huslan = parseInt(nyttHuslan, 10) || huslan;
            uppdateraBeräkningar();
        }
    }

    function öppnaPopupBelopp312() {
        let nyttBelopp312 = prompt("Ange nytt 3:12-belopp:", belopp312);
        if (nyttBelopp312 !== null) {
            belopp312 = parseInt(nyttBelopp312, 10) || belopp312;
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
