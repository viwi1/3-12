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

// 🔹 Hämta initial inkomst från state
let inkomst = getState("totaltNetto") || 0;
if (!inkomst || inkomst === 0) {
    onStateChange("totaltNetto", (nyInkomst) => skapaUtgifterUI(nyInkomst));
} else {
    skapaUtgifterUI(inkomst);
}

/**
 * Bygger UI för utgifter med manuella inmatningar
 * @param {number} inkomst - Det värde på "totaltNetto" vi vill använda
 */
function skapaUtgifterUI(inkomst) {
    const container = document.getElementById("expenses");
    if (!container) return;

    container.innerHTML = `
        <div>
            <h3>Summeringar</h3>
            <p>Total inkomst: <span id="totalInkomst">${formatNumber(inkomst)}</span></p>
            <p>Totala utgifter: <span id="totalUtgifter">0 kr</span></p>
            <p>Inkomst täckning: <span id="inkomstTäckning">0%</span></p>
        </div>
        <div id="utgifterForm"></div>
    `;

    const utgifterForm = document.getElementById("utgifterForm");

    UTGIFTER.forEach((utgift, index) => {
        const inputGroup = document.createElement("div");
        inputGroup.className = "input-group";
        inputGroup.innerHTML = `
            <label>${utgift.namn}:</label>
            <input type="number" id="kostnad${index}" value="${utgift.belopp}">
        `;
        utgifterForm.appendChild(inputGroup);

        document.getElementById(`kostnad${index}`).addEventListener("input", () => {
            UTGIFTER[index].belopp = parseInt(document.getElementById(`kostnad${index}`).value, 10) || 0;
            uppdateraUtgifter(inkomst);
        });
    });

    uppdateraUtgifter(inkomst);
}

/**
 * Uppdaterar alla delar av UI baserat på inkomst och utgifter
 * @param {number} inkomst - Värdet på "totaltNetto" vi visar
 */
function uppdateraUtgifter(inkomst) {
    const totalUtgifter = UTGIFTER.reduce((sum, u) => sum + u.belopp, 0);

    document.getElementById("totalInkomst").textContent = formatNumber(inkomst);
    document.getElementById("totalUtgifter").textContent = formatNumber(totalUtgifter);
    document.getElementById("inkomstTäckning").textContent = Math.round((inkomst / totalUtgifter) * 100) + "%";

    updateState("totaltNetto", inkomst);
}

// ✅ Exportera funktioner
export { skapaUtgifterUI, uppdateraUtgifter };
