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

// 🔍 Hämta befintligt totaltNetto från `state.js`
let inkomst = getState("totaltNetto");
console.log("🔍 [Debug] Hämtar 'totaltNetto' från state.js:", inkomst);

// 🛑 Om `inkomst` är 0 → Vänta på uppdatering
if (!inkomst || inkomst === 0) {
    console.warn("⚠️ [Warning] Väntar på att 'totaltNetto' ska uppdateras...");
} else {
    // ✅ Om vi redan har ett värde > 0, skapar vi UI direkt
    skapaUtgifterUI(inkomst);
}

// 🏁 När `totaltNetto` uppdateras i `state.js`, skapa/uppdatera UI
onStateChange("totaltNetto", (nyInkomst) => {
    console.log("✅ [Debug] 'totaltNetto' uppdaterat, startar UI:", nyInkomst);
    skapaUtgifterUI(nyInkomst);
});

/**
 * Bygger huvudsakliga UI:t för utgiftskollen
 * @param {number} inkomst - Det värde på "totaltNetto" vi vill använda
 */
function skapaUtgifterUI(inkomst) {
    const container = document.getElementById("expenses");
    
    if (!container) {
        console.error("❌ [Error] 'expenses' container saknas i DOM!");
        return;
    }

    console.log("✅ [Debug] Skapar utgifter-UI med inkomst:", inkomst);

    // Rensa tidigare innehåll (om vi redan byggt UI en gång)
    container.innerHTML = "";

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

    // 🔹 Eventlyssnare på slider (ändra inkomst)
    document.getElementById("inkomstSlider").addEventListener("input", (e) => {
        uppdateraUtgifter(parseInt(e.target.value, 10));
    });

    // 🔹 Sista steget: Uppdatera UI med de nuvarande värdena
    uppdateraUtgifter(inkomst);
}

/**
 * Uppdaterar alla delar av UI baserat på inkomst
 * @param {number} inkomst - Värdet på "totaltNetto" vi visar
 */
function uppdateraUtgifter(inkomst) {
    console.log("🔄 [Debug] Uppdaterar utgifter med inkomst:", inkomst);

    const inkomstBeloppEl = document.getElementById("inkomstBelopp");
    const totalInkomstEl  = document.getElementById("totalInkomst");
    const totalUtgifterEl = document.getElementById("totalUtgifter");
    const inkomstTäckningEl = document.getElementById("inkomstTäckning");

    if (!inkomstBeloppEl || !totalInkomstEl || !totalUtgifterEl || !inkomstTäckningEl) {
        console.warn("⚠️ [Warning] Något UI-element saknas, kan ej uppdatera utgifter!");
        return;
    }

    // 🔹 Visa valt inkomst-värde
    inkomstBeloppEl.textContent = formatNumber(inkomst);
    totalInkomstEl.textContent = formatNumber(inkomst);

    // 🔹 Räkna ut total utgifter
    const totalUtgifter = UTGIFTER.reduce((sum, u) => sum + u.belopp, 0);
    totalUtgifterEl.textContent = formatNumber(totalUtgifter);

    // 🔹 Räkna ut täckning
    let täckning = totalUtgifter > 0 ? (inkomst / totalUtgifter) * 100 : 0;
    inkomstTäckningEl.textContent = Math.round(täckning) + "%";

    // 🔥 Uppdatera "totaltNetto" i state så att andra moduler ser det nya värdet
    console.log("🚀 [Debug] updateState('totaltNetto',", inkomst, ")");
    updateState("totaltNetto", inkomst);
}

// ✅ Exportera våra två funktioner
export { skapaUtgifterUI, uppdateraUtgifter };
