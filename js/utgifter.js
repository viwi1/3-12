import { formatNumber } from "./main.js";
import { getState, updateState } from "./state.js";

// 🎯 Kontrollera att rätt värden hämtas från state
console.log("📌 [Debug] Hämtar värden från state.js...");
const BELÖPP_312 = getState("belopp312") || 221650;
const betalaHuslan = getState("betalaHuslan") || false;
let inkomst = getState("totaltNetto") || 0;

// 🎯 Logga ut värden för felsökning
console.log("✅ [Debug] 3:12-belopp:", BELÖPP_312);
console.log("✅ [Debug] Betala huslån:", betalaHuslan);
console.log("✅ [Debug] Hämtad inkomst:", inkomst);

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
    { namn: "Lån och amortering", belopp: betalaHuslan ? 0 : 115245 }, // 🛠 Sätt till 0 om huslånet är betalat
    { namn: "Lån och amortering CSN", belopp: 8748 }
];

// 🎯 Skapa UI
function skapaUtgifterUI() {
    let container = document.getElementById("expensesContainer");

    if (!container) {
        console.error("❌ [Error] #expensesContainer hittades inte i DOM!");
        return;
    }

    console.log("✅ [Debug] #expensesContainer hittades! Skapar UI...");

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

    UTGIFTER.forEach((_, index) => {
        document.getElementById(`kostnad${index}`).addEventListener("input", () => {
            UTGIFTER[index].belopp = parseInt(document.getElementById(`kostnad${index}`).value, 10) || 0;
            uppdateraUtgifter(document.getElementById("inkomstSlider").value);
        });
    });

    uppdateraUtgifter(inkomst);
}

// 🎯 Initiera vid sidladdning
document.addEventListener("DOMContentLoaded", skapaUtgifterUI);

// 🎯 Exportera funktioner
export { skapaUtgifterUI, uppdateraUtgifter };
