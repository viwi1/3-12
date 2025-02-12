import { formatNumber } from "./main.js";
import { getState, updateState, onStateChange } from "./state.js";

/**
 * Lista med utgifter (ej ändrad)
 */
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

/**
 * Init: Hämta startvärde. Om 0 → invänta uppdatering från investera.js
 */
let inkomst = getState("totaltNetto");
console.log("🔍 [Debug] Hämtar 'totaltNetto' från state.js:", inkomst);

if (!inkomst || inkomst === 0) {
    console.warn("⚠️ [Warning] Väntar på att 'totaltNetto' ska uppdateras...");
} else {
    // 🟢 Skapa UI direkt om vi redan har ett värde
    skapaUtgifterUI(inkomst);
}

// 🎯 När `totaltNetto` uppdateras i state.js → uppdatera UI
onStateChange("totaltNetto", (nyInkomst) => {
    console.log("🔄 [Debug] onStateChange: 'totaltNetto' uppdaterat =", nyInkomst);
    uppdateraUtgifter(nyInkomst);
});

/**
 * Bygger huvudsakliga UI:t för utgiftskollen EN gång
 * @param {number} inkomst - Värdet på "totaltNetto"
 */
function skapaUtgifterUI(inkomst) {
    const container = document.getElementById("expenses");
    if (!container) {
        console.error("❌ [Error] 'expenses' container saknas i DOM!");
        return;
    }

    console.log("✅ [Debug] Skapar utgifter-UI med inkomst:", inkomst);
    container.innerHTML = ""; // Rensa tidigare innehåll om nåt finns

    // 🔹 Inkomstsektionen (slider)
    const inkomstSektion = document.createElement("div");
    inkomstSektion.className = "input-group";
    inkomstSektion.innerHTML = `
        <label for="inkomstSlider">Ange inkomst per år:</label>
        <input type="range" id="inkomstSlider" min="0" max="2000000" step="10000" value="${inkomst}">
        <span id="inkomstBelopp">${formatNumber(inkomst)}</span>
    `;
    container.appendChild(inkomstSektion);

    // 🔹 Summeringsruta
    const summering = document.createElement("div");
    summering.innerHTML = `
        <h3>Summeringar</h3>
        <p>Total inkomst: <span id="totalInkomst">${formatNumber(inkomst)}</span></p>
        <p>Totala utgifter: <span id="totalUtgifter">0 kr</span></p>
        <p>Inkomst täckning: <span id="inkomstTäckning">0%</span></p>
    `;
    container.appendChild(summering);

    // 🔹 Lyssnare på slider
    document.getElementById("inkomstSlider").addEventListener("input", (e) => {
        const nyttVärde = parseInt(e.target.value, 10);
        uppdateraUtgifter(nyttVärde);
    });

    // 🔹 Första uppdateringen av UI
    uppdateraUtgifter(inkomst);
}

/**
 * Uppdaterar siffrorna i UI. Skriver till state om inkomst har ändrats.
 * @param {number} inkomst - Värdet på "totaltNetto" (inkomst)
 */
function uppdateraUtgifter(inkomst) {
    console.log("🔄 [Debug] uppdateraUtgifter(", inkomst, ")");

    const inkomstBeloppEl = document.getElementById("inkomstBelopp");
    const totalInkomstEl  = document.getElementById("totalInkomst");
    const totalUtgifterEl = document.getElementById("totalUtgifter");
    const inkomstTäckningEl = document.getElementById("inkomstTäckning");

    if (!inkomstBeloppEl || !totalInkomstEl || !totalUtgifterEl || !inkomstTäckningEl) {
        console.warn("⚠️ [Warning] UI-element saknas, kan ej uppdatera utgifter!");
        return;
    }

    // ✅ Visa valt inkomst-värde
    inkomstBeloppEl.textContent = formatNumber(inkomst);
    totalInkomstEl.textContent = formatNumber(inkomst);

    // ✅ Räkna ut total utgifter
    const totalUtgifter = UTGIFTER.reduce((sum, u) => sum + u.belopp, 0);
    totalUtgifterEl.textContent = formatNumber(totalUtgifter);

    // ✅ Räkna ut täckning
    let täckning = totalUtgifter > 0 ? (inkomst / totalUtgifter) * 100 : 0;
    inkomstTäckningEl.textContent = Math.round(täckning) + "%";

    // 🔥 Uppdatera "totaltNetto" i state om värdet faktiskt ändrats
    const gammaltVärde = getState("totaltNetto");
    if (gammaltVärde !== inkomst) {
        console.log("🚀 [Debug] updateState('totaltNetto', ", inkomst, ")");
        updateState("totaltNetto", inkomst);
    } else {
        console.log("⚠️ [Info] 'totaltNetto' är redan ", inkomst, ", ingen uppdatering.");
    }
}

export { skapaUtgifterUI, uppdateraUtgifter };
