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
    const nuvardeEl = document.getElementById("startVarde");
    const multipelEl = document.getElementById("multipel");
    const multipelValueEl = document.getElementById("multipelValue");
    const betalaHuslanEl = document.getElementById("betalaHuslan");
    const exitTitleEl = document.getElementById("exitTitle");
    const exitBeloppEl = document.getElementById("exitBelopp");
    const huslanDetaljerEl = document.getElementById("huslanDetaljer");

    // ✅ Uppdatera startvärdet i UI
    nuvardeEl.textContent = formatNumber ? formatNumber(svartVarde) : svartVarde;

    function uppdateraBeräkningar() {
        console.log("🔎 [Debug] Kör uppdateraBeräkningar");

        // 🔹 Hämta multipel
        const multipel = parseFloat(multipelEl.value) || 1;
        multipelValueEl.textContent = multipel.toFixed(1);

        // 🔹 Beräkna exitKapital
        let försäljningspris = svartVarde * multipel;
        let exitKapital = försäljningspris;

        // 🔹 Låneberäkning
        const belopp312 = 684166;
        const skattLåg  = 0.20;
        const skattHög  = 0.50;

        let nettoLåg = belopp312 * (1 - skattLåg);
        let lanEfterLågSkatt = huslan - nettoLåg;
        let bruttoHögBehov = lanEfterLågSkatt > 0 ? lanEfterLågSkatt / (1 - skattHög) : 0;
        let totaltBruttoFörLån = belopp312 + bruttoHögBehov;

        if (betalaHuslanEl.checked) {
            exitKapital -= totaltBruttoFörLån;
        }

        exitBeloppEl.textContent = formatNumber ? formatNumber(exitKapital) : exitKapital;
    }

    multipelEl.addEventListener("input", uppdateraBeräkningar);
    betalaHuslanEl.addEventListener("change", uppdateraBeräkningar);

    uppdateraBeräkningar();
});

// ✅ Exportera den riktiga funktionen
export { uppdateraBeräkningar };

