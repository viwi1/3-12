import { formatNumber } from "./main.js";
import { getState, updateState, onStateChange } from "./state.js";

// 🎯 Lista med utgifter
const UTGIFTER = [
    { namn: "BRF Avgift", belopp: 95580 },
    { namn: "Hemförsäkring Dina försäkringar", belopp: 3420 },
    { namn: "Fritids och förskola", belopp: 28524 },
    { namn: "El vattenfall Elnät", belopp: 12726 },
    { namn: "El Tibber", belopp: 6252 },
    { namn: "Flexen", belopp: 196442 },
    { namn: "Klarna - presenter och skoj", belopp: 60000 },
    { namn: "Resa", belopp: 100000 },
    { namn: "Lån och amortering", belopp: 115245 },
    { namn: "Lån och amortering CSN", belopp: 8748 }
];

// 🔹 Hämta initial inkomst
let inkomst = getState("totaltNetto");
if (!inkomst || inkomst === 0) {
    onStateChange("totaltNetto", (nyInkomst) => skapaUtgifterUI(nyInkomst));
} else {
    skapaUtgifterUI(inkomst);
}

/**
 * Bygger huvudsakliga UI:t för utgiftskollen
 * @param {number} inkomst - Det värde på "totaltNetto" vi vill använda
 */
function skapaUtgifterUI(inkomst) {
    const container = document.getElementById("expenses");
    if (!container) return;

    container.innerHTML = `
        <div class="input-group">
            <label for="inkomstSlider">Ange inkomst per år:</label>
            <input type="range" id="inkomstSlider" min="0" max="2000000" step="10000" value="${inkomst}">
            <span id="inkomstBelopp">${formatNumber(inkomst)}</span>
        </div>
        <div>
            <h3>Summeringar</h3>
            <p>Total inkomst: <span id="totalInkomst">${formatNumber(inkomst)}</span></p>
            <p>Totala utgifter: <span id="totalUtgifter">0 kr</span></p>
            <p>Inkomst täckning: <span id="inkomstTäckning">0%</span></p>
        </div>
    `;

    document.getElementById("inkomstSlider").addEventListener("input", (e) => {
        uppdateraUtgifter(parseInt(e.target.value, 10));
    });

    uppdateraUtgifter(inkomst);
}

/**
 * Uppdaterar alla delar av UI baserat på inkomst
 * @param {number} inkomst - Värdet på "totaltNetto" vi visar
 */
function uppdateraUtgifter(inkomst) {
    const totalUtgifter = UTGIFTER.reduce((sum, u) => sum + u.belopp, 0);

    document.getElementById("inkomstBelopp").textContent = formatNumber(inkomst);
    document.getElementById("totalInkomst").textContent = formatNumber(inkomst);
    document.getElementById("totalUtgifter").textContent = formatNumber(totalUtgifter);
    document.getElementById("inkomstTäckning").textContent = Math.round((inkomst / totalUtgifter) * 100) + "%";

    updateState("totaltNetto", inkomst);
}

// ✅ Exportera funktioner
export { skapaUtgifterUI, uppdateraUtgifter };
