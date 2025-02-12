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

// 🎯 Hämta årligt 3:12-belopp från state
const BELÖPP_312 = getState("belopp312") || 221650;

// 🎯 Hämta initial inkomst från investeringsmodulen
let inkomst = getState("totaltNetto");
if (!inkomst || inkomst === 0) {
    inkomst = 100000; // 🔥 Standardvärde om inget finns i state
}

// ✅ **Se till att funktionen finns innan export**
function uppdateraUtgifter(inkomst) {
    if (!document.getElementById("inkomstBelopp")) return; // 🔥 Stoppar felet om element saknas

    document.getElementById("inkomstBelopp").textContent = formatNumber(inkomst);
    document.getElementById("totalInkomst").textContent = formatNumber(inkomst);

    let totalUtgifter = UTGIFTER.reduce((sum, u) => sum + u.belopp, 0);
    document.getElementById("totalUtgifter").textContent = formatNumber(totalUtgifter);
    
    let täckning = totalUtgifter > 0 ? (inkomst / totalUtgifter) * 100 : 0;
    document.getElementById("inkomstTäckning").textContent = Math.round(täckning) + "%";

    // 🔄 Uppdatera state
    updateState("totaltNetto", inkomst);
}

// 🎯 Skapa UI
function skapaUtgifterUI() {
    let container = document.getElementById("expenses"); // 🛠 FIX: Använd rätt ID
    if (!container) return;

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

    document.getElementById("inkomstSlider").addEventListener("input", (e) => {
        uppdateraUtgifter(parseInt(e.target.value, 10));
    });

    uppdateraUtgifter(inkomst);
}

// 🎯 Initiera vid sidladdning
document.addEventListener("DOMContentLoaded", skapaUtgifterUI);

// ✅ **Exportera endast om funktionen är definierad**
export { skapaUtgifterUI, uppdateraUtgifter };
