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

// 🔹 Kör UI direkt vid sidladdning
document.addEventListener("DOMContentLoaded", () => {
    skapaUtgifterUI();
    uppdateraUtgifter(inkomst);
});

// 🔹 Lyssna på förändringar i `totaltNetto`, men undvik loopar
onStateChange("totaltNetto", (nyInkomst) => {
    if (Math.round(nyInkomst) !== Math.round(inkomst)) {
        uppdateraUtgifter(nyInkomst);
    }
});

/**
 * Skapar UI för utgifter (körs en gång vid sidladdning)
 */
function skapaUtgifterUI() {
    const container = document.getElementById("expenses");
    if (!container) return;

    container.innerHTML = `
        <h3>Summeringar</h3>
        <p>Total inkomst: <span id="totalInkomst"></span></p>
        <p>Totala utgifter: <span id="totalUtgifter"></span></p>
        <p>Inkomst täckning: <span id="inkomstTäckning"></span></p>
        <div id="utgifterForm"></div>
    `;

    const utgifterForm = document.getElementById("utgifterForm");

    // 🔹 Skapa utgiftsposter
    UTGIFTER.forEach((utgift, index) => {
        const inputGroup = document.createElement("div");
        inputGroup.className = "input-group";
        inputGroup.innerHTML = `
            <label>${utgift.namn}:</label>
            <input type="number" id="kostnad${index}" value="${utgift.belopp}">
        `;
        utgifterForm.appendChild(inputGroup);

        // 🔹 Eventlyssnare för att uppdatera totalbelopp när utgifter ändras
        document.getElementById(`kostnad${index}`).addEventListener("input", () => {
            UTGIFTER[index].belopp = parseInt(document.getElementById(`kostnad${index}`).value, 10) || 0;
            uppdateraUtgifter(getState("totaltNetto"), true);
        });
    });
}

/**
 * Uppdaterar endast totalbelopp & procent, ingen onödig state-uppdatering
 * @param {number} nyInkomst - Värdet på "totaltNetto"
 * @param {boolean} frånUI - Om uppdateringen sker från UI (ändring av utgifter)
 */
function uppdateraUtgifter(nyInkomst, frånUI = false) {
    if (!document.getElementById("totalInkomst")) return;

    const totalUtgifter = UTGIFTER.reduce((sum, u) => sum + u.belopp, 0);
    const täckning = totalUtgifter > 0 ? (nyInkomst / totalUtgifter) * 100 : 0;

    document.getElementById("totalInkomst").textContent = formatNumber(nyInkomst);
    document.getElementById("totalUtgifter").textContent = formatNumber(totalUtgifter);
    document.getElementById("inkomstTäckning").textContent = Math.round(täckning) + "%";

    // 🔹 Undvik att uppdatera state om värdet redan är detsamma
    if (!frånUI && Math.round(getState("totaltNetto")) !== Math.round(nyInkomst)) {
        updateState("totaltNetto", nyInkomst);
    }
}

// ✅ Exportera funktioner
export { skapaUtgifterUI, uppdateraUtgifter };
