import { updateState, getState } from "./state.js";
import { formatNumber } from "./main.js";

document.addEventListener("DOMContentLoaded", () => {
    const resultContainer = document.getElementById("resultFörsäljning");
    if (!resultContainer) return;

    // 🎯 Direkt definierade värden (ej i state.js)
    const START_VARDE = 6855837;
    const START_VARDE_DALIGT = 3000000;
    let huslan = getState("huslan") || 2020500; // ✅ Hämtas från state, default 2 020 500 kr

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
                <input type="checkbox" id="betalaHuslan" checked>
                <label for="betalaHuslan">🏡 Betala av huslånet direkt vid exit</label>
                <span class="link-like" id="openHuslanPopup">✏️ Ändra</span>
            </div>
            <p class="result-title"><strong id="exitTitle">Exitbelopp</strong></p>
            <p id="exitBelopp" style="color: green; font-weight: bold;"></p>
            <hr>
            <div id="huslanDetaljer"></div>
        </div>

        <!-- Popup för att ändra huslån -->
        <div class="overlay" id="huslanPopup">
            <div class="popup">
                <span class="closePopup" onclick="closeHuslanPopup()">×</span>
                <h4>Ändra huslån</h4>
                <input type="number" id="huslanInput" value="${huslan}" style="width:120px;">
                <button onclick="updateHuslan()">Spara</button>
            </div>
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
    const openHuslanPopupEl = document.getElementById("openHuslanPopup");

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
        let lanEfterLågSkatt = huslan - nettoLåg;
        let bruttoHögBehov = lanEfterLågSkatt > 0 ? lanEfterLågSkatt / (1 - skattHög) : 0;
        let totaltBruttoForLan = spara312 + bruttoHögBehov;

        if (betalaHuslan) {
            exitKapital -= totaltBruttoForLan;
        }

        updateState("exitVarde", exitKapital);
        updateState("betalaHuslan", betalaHuslan);
        updateState("huslan", huslan); // ✅ Uppdaterar huslånet i state

        exitTitleEl.textContent = betalaHuslan
            ? "Exitbelopp efter huslånsbetalning 🏡"
            : "Exitbelopp";
        exitBeloppEl.textContent = formatNumber(exitKapital);

        huslanDetaljerEl.innerHTML = betalaHuslan
            ? `
            <p>Huslån: ${formatNumber(huslan)}</p>
            <p><strong>Bruttobelopp för lån:</strong> ${formatNumber(totaltBruttoForLan)}</p>
            <p>- ${formatNumber(spara312)} (20% skatt) → Netto: ${formatNumber(nettoLåg)}</p>
            <p>- Resterande (50% skatt): ${formatNumber(bruttoHögBehov)} → Netto: ${formatNumber(lanEfterLågSkatt)}</p>
            <p><strong>Totalt betalat för lån:</strong> ${formatNumber(nettoLåg + lanEfterLågSkatt)}</p>
            `
            : "";
    }

    function updateHuslan() {
        let nyttHuslan = parseInt(document.getElementById("huslanInput").value, 10);
        if (!isNaN(nyttHuslan) && nyttHuslan > 0) {
            huslan = nyttHuslan;
            updateState("huslan", huslan);
            uppdateraBeräkningar();
            closeHuslanPopup();
        }
    }

    function openHuslanPopup() {
        document.getElementById("huslanPopup").style.display = "block";
    }

    function closeHuslanPopup() {
        document.getElementById("huslanPopup").style.display = "none";
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

    openHuslanPopupEl.addEventListener("click", openHuslanPopup);

    multipelValueEl.textContent = multipelEl.value;
    betalaHuslanEl.checked = true; // ✅ Huslånet är ibockat som standard
    uppdateraBeräkningar();
});

export function uppdateraBeräkningar() {}
