import { formatNumber } from "./main.js";
import { getState, updateState } from "./state.js";

// 🎯 Kontrollera att rätt värden hämtas från state
console.log("📌 [Debug] Hämtar värden från state.js...");
const BELÖPP_312 = getState("belopp312") || 221650;
const betalaHuslan = getState("betalaHuslan") || false;
let inkomst = getState("totaltNetto") || 0;

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

// 🎯 Fördelningsfunktion
function fördelaInkomst(inkomst) {
    let totalUtgifter = UTGIFTER.reduce((sum, u) => sum + u.belopp, 0);
    if (inkomst <= 0) return Array(UTGIFTER.length).fill(0);
    if (inkomst >= totalUtgifter) return UTGIFTER.map(u => u.belopp);

    let r = inkomst / totalUtgifter;
    let störstaUtgift = Math.max(...UTGIFTER.map(u => u.belopp));
    let boosts = UTGIFTER.map(u => Math.pow(störstaUtgift / u.belopp, 1));
    let justeradeUtgifter = UTGIFTER.map((u, i) => u.belopp * r * boosts[i]);
    let summaJustering = justeradeUtgifter.reduce((sum, ju) => sum + ju, 0);

    return justeradeUtgifter.map(ju => ju * (inkomst / summaJustering));
}

// 🎯 Uppdatera UI
function uppdateraUtgifter(inkomst) {
    document.getElementById("inkomstBelopp").textContent = formatNumber(inkomst);
    document.getElementById("totalInkomst").textContent = formatNumber(inkomst);

    let totalUtgifter = UTGIFTER.reduce((sum, u) => sum + u.belopp, 0);
    document.getElementById("totalUtgifter").textContent = formatNumber(totalUtgifter);
    
    let täckning = totalUtgifter > 0 ? (inkomst / totalUtgifter) * 100 : 0;
    document.getElementById("inkomstTäckning").textContent = Math.round(täckning) + "%";

    let fördeladInkomst = fördelaInkomst(inkomst);
    
    UTGIFTER.forEach((utgift, index) => {
        let procent = (fördeladInkomst[index] / utgift.belopp) * 100;
        procent = isNaN(procent) ? 0 : Math.min(procent, 100);

        let fördeladPerMånad = fördeladInkomst[index] / 12;
        let utgiftPerMånad = utgift.belopp / 12;
        
        document.getElementById(`bar${index}`).style.width = procent + "%";
        document.getElementById(`bar${index}-info`).textContent =
            `${Math.round(procent)}% | ${formatNumber(fördeladInkomst[index])} (${formatNumber(fördeladPerMånad)} / mån) av ${formatNumber(utgift.belopp)} (${formatNumber(utgiftPerMånad)} / mån)`;
    });

    // 🔄 Uppdatera state
    updateState("totaltNetto", inkomst);
}

// 🎯 Skapa UI
function skapaUtgifterUI() {
    let container = document.getElementById("expenses");
    if (!container) return console.error("❌ [Error] #expenses hittades inte!");

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
