import { formatNumber } from "./main.js";
import { getState, updateState } from "./state.js";

// 🎯 Standardutgifter
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

// 🎯 Hämta initial inkomst från investeringsmodulen
let inkomst = getState("totaltNetto");
console.log("🔍 [Debug] Hämtar 'totaltNetto' från state.js:", inkomst);


// 🎯 Skapa UI
function skapaUtgifterUI() {
    let container = document.getElementById("expenses");
    
    if (!container) {
        console.error("❌ [Error] 'expenses' container saknas i DOM!");
        return;
    }

    console.log("✅ [Debug] 'expenses' container hittad, bygger UI...");

    // Rensa tidigare innehåll om det finns
    container.innerHTML = "";

    let inkomstSektion = document.createElement("div");
    inkomstSektion.className = "input-group";
    inkomstSektion.innerHTML = `
        <label for="inkomstSlider">Ange inkomst per år:</label>
        <input type="range" id="inkomstSlider" min="0" max="2000000" step="10000" value="${inkomst}">
        <span id="inkomstBelopp">${formatNumber(inkomst)}</span>
    `;
    container.appendChild(inkomstSektion);

    let summering = document.createElement("div");
    summering.innerHTML = `
        <h3>Summeringar</h3>
        <p>Total inkomst: <span id="totalInkomst">${formatNumber(inkomst)}</span></p>
        <p>Totala utgifter: <span id="totalUtgifter">0 kr</span></p>
        <p>Inkomst täckning: <span id="inkomstTäckning">0%</span></p>
    `;
    container.appendChild(summering);

    UTGIFTER.forEach((utgift, index) => {
        let inputGroup = document.createElement("div");
        inputGroup.className = "input-group";
        inputGroup.innerHTML = `
            <label>${utgift.namn}:</label>
            <input type="number" id="kostnad${index}" value="${utgift.belopp}">
        `;
        container.appendChild(inputGroup);

        let barContainer = document.createElement("div");
        barContainer.className = "bar-container";
        barContainer.innerHTML = `<div class="bar" id="bar${index}"></div>`;
        container.appendChild(barContainer);

        let barInfo = document.createElement("div");
        barInfo.className = "bar-info";
        barInfo.id = `bar${index}-info`;
        barInfo.textContent = `0% | 0 kr (0 kr/mån) av ${formatNumber(utgift.belopp)} (${formatNumber(utgift.belopp / 12)}/ mån)`;
        container.appendChild(barInfo);
    });

    document.getElementById("inkomstSlider").addEventListener("input", (e) => {
        uppdateraUtgifter(parseInt(e.target.value, 10));
    });

    uppdateraUtgifter(inkomst);
}

// 🎯 Uppdatera utgifter
function uppdateraUtgifter(inkomst) {
    console.log("🔄 [Debug] Uppdaterar utgifter med inkomst:", inkomst);

    if (!document.getElementById("inkomstBelopp")) {
        console.error("❌ [Error] Element 'inkomstBelopp' hittades inte!");
        return;
    }

    document.getElementById("inkomstBelopp").textContent = formatNumber(inkomst);
    document.getElementById("totalInkomst").textContent = formatNumber(inkomst);

    let totalUtgifter = UTGIFTER.reduce((sum, u) => sum + u.belopp, 0);
    document.getElementById("totalUtgifter").textContent = formatNumber(totalUtgifter);
    
    let täckning = totalUtgifter > 0 ? (inkomst / totalUtgifter) * 100 : 0;
    document.getElementById("inkomstTäckning").textContent = Math.round(täckning) + "%";

    // 🔄 Uppdatera state
    updateState("totaltNetto", inkomst);
}

// 🎯 Initiera vid sidladdning
document.addEventListener("DOMContentLoaded", skapaUtgifterUI);

// ✅ **Exportera korrekt**
export { skapaUtgifterUI, uppdateraUtgifter };
