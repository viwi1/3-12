import { updateState } from "./state.js";
import { formatNumber } from "./main.js";

document.addEventListener("DOMContentLoaded", () => {
    const START_VARDE = 6855837;
    const START_VARDE_DALIGT = 3000000;
    let huslan = 2020500; // Standardvärde, kan ändras via popup

    const resultContainer = document.getElementById("resultFörsäljning");
    if (!resultContainer) return;

    // ✅ Skapa UI
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
            <p id="exitBelopp"></p>
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

    // 🔹 Funktion för beräkningar
    function uppdateraBeräkningar() {
        const multipel = parseFloat(multipelEl.value) || 1;
        const skattLåg = 0.20;
        const skattHög = 0.50;
        const belopp312 = 684166;
        const betalaHuslan = betalaHuslanEl.checked;

        let startVarde = daligtNuvardeEl.checked ? START_VARDE_DALIGT : START_VARDE;
        nuvardeEl.textContent = formatNumber(startVarde);

        let forsPris = startVarde * multipel;
        let exitKapital = forsPris;

        let nettoLåg = belopp312 * (1 - skattLåg);
        let lanEfterLågSkatt = huslan - nettoLåg;
        let bruttoHögBehov = lanEfterLågSkatt > 0 ? lanEfterLågSkatt / (1 - skattHög) : 0;
        let totaltBruttoForLan = belopp312 + bruttoHögBehov;

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
            <p>Huslån: <span id="huslanValue" style="cursor:pointer; text-decoration:underline;">${formatNumber(huslan)}</span></p>
            <p><strong>Bruttobelopp för lån:</strong> ${formatNumber(totaltBruttoForLan)}</p>
            <p>- ${formatNumber(belopp312)} (20% skatt) → Netto: ${formatNumber(nettoLåg)}</p>
            <p>- Resterande (50% skatt): ${formatNumber(bruttoHögBehov)} → Netto: ${formatNumber(lanEfterLågSkatt > 0 ? lanEfterLågSkatt : 0)}</p>
            `
            : "";

        // 🏡 Lägg till klickbar funktion för att ändra huslån
        const huslanValueEl = document.getElementById("huslanValue");
        if (huslanValueEl) {
            huslanValueEl.addEventListener("click", öppnaPopupHuslan);
        }
    }

    // 🔹 Funktion för popup och ändring av huslån
    function öppnaPopupHuslan() {
        let nyttHuslan = prompt("Ange nytt huslånebelopp:", huslan);
        if (nyttHuslan !== null) {
            huslan = parseInt(nyttHuslan, 10) || huslan;
            uppdateraBeräkningar();
        }
    }

    // 🔄 Event-lyssnare
    multipelEl.addEventListener("input", () => {
        multipelValueEl.textContent = parseFloat(multipelEl.value).toFixed(1);
        uppdateraBeräkningar();
    });

    betalaHuslanEl.addEventListener("change", uppdateraBeräkningar);
    
    daligtNuvardeEl.addEventListener("change", () => {
        uppdateraBeräkningar();
    });

    // 🏗 Initiera beräkningar vid sidladdning
    multipelValueEl.textContent = multipelEl.value;
    betalaHuslanEl.checked = true;
    uppdateraBeräkningar();
});

// ✅ Korrekt export
export { uppdateraBeräkningar };
