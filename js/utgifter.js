import { formatNumber } from "./main.js";
import { getState, updateState, onStateChange } from "./state.js";

// 🎯 Lista med standardutgifter (Lån och amortering exkluderas om `betalaHuslan = true`)
const STANDARD_UTGIFTER = [
    { namn: "BRF Avgift", belopp: 95580 },
    { namn: "Hemförsäkring Dina försäkringar", belopp: 3420 },
    { namn: "Fritids och förskola", belopp: 28524 },
    { namn: "El vattenfall Elnät", belopp: 12726 },
    { namn: "El Tibber", belopp: 6252 },
    { namn: "Flexen", belopp: 196442 },
    { namn: "Klarna - presenter och skoj", belopp: 60000 },
    { namn: "Resa", belopp: 100000 },
    { namn: "Lån och amortering CSN", belopp: 8748 }
];

// 🎯 Hämta initial inkomst från state
let inkomst = getState("totaltNetto") || 0;

// 🔹 Kör UI direkt vid sidladdning
document.addEventListener("DOMContentLoaded", () => {
    skapaUtgifterUI();
    uppdateraUtgifter(inkomst);
});

// 🔹 Vänta på att `totaltNetto` eller `betalaHuslan` uppdateras innan vi ritar om UI
onStateChange("totaltNetto", (nyInkomst) => {
    if (nyInkomst > 0) {
        uppdateraUtgifter(nyInkomst);
    }
});

onStateChange("betalaHuslan", () => {
    skapaUtgifterUI();
    uppdateraUtgifter(getState("totaltNetto"));
});

/**
 * Skapar UI för utgifter
 */
function skapaUtgifterUI() {
    const container = document.getElementById("expenses");
    if (!container) return;

    // Kontrollera om huslånet ska exkluderas
    let utgifter = [...STANDARD_UTGIFTER];
    if (!getState("betalaHuslan")) {
        utgifter.push({ namn: "Lån och amortering", belopp: 115245 });
    }

    container.innerHTML = `
        <h3>Summeringar</h3>
        <div class="summary">
            <p><strong>Total inkomst:</strong> <span id="totalInkomst">${formatNumber(inkomst)} kr</span></p>
            <p><strong>Totala utgifter:</strong> <span id="totalUtgifter">0 kr</span></p>
            <p><strong>Inkomst täckning:</strong> <span id="inkomstTäckning">0%</span></p>
        </div>
        <div id="utgifterList"></div>
    `;

    const utgifterList = document.getElementById("utgifterList");

    // 🔹 Skapa utgiftsposter snyggt
    utgifter.forEach((utgift, index) => {
        const item = document.createElement("div");
        item.className = "utgift-item";
        item.innerHTML = `
            <label>${utgift.namn}</label>
            <input type="number" id="kostnad${index}" value="${utgift.belopp}">
            <span class="utgift-belopp">${formatNumber(utgift.belopp)} kr</span>
        `;
        utgifterList.appendChild(item);

        // 🔹 Eventlyssnare för att uppdatera totalbelopp när utgifter ändras
        document.getElementById(`kostnad${index}`).addEventListener("input", () => {
            utgifter[index].belopp = parseInt(document.getElementById(`kostnad${index}`).value, 10) || 0;
            uppdateraUtgifter(getState("totaltNetto"), true);
        });
    });
}

/**
 * Uppdaterar totalbelopp och procent
 * @param {number} nyInkomst - Värdet på "totaltNetto"
 * @param {boolean} frånUI - Om uppdateringen sker från UI
 */
function uppdateraUtgifter(nyInkomst, frånUI = false) {
    if (!document.getElementById("totalInkomst")) return;

    let utgifter = [...STANDARD_UTGIFTER];
    if (!getState("betalaHuslan")) {
        utgifter.push({ namn: "Lån och amortering", belopp: 115245 });
    }

    const totalUtgifter = utgifter.reduce((sum, u) => sum + u.belopp, 0);
    const täckning = totalUtgifter > 0 ? (nyInkomst / totalUtgifter) * 100 : 0;

    document.getElementById("totalInkomst").textContent = `${formatNumber(nyInkomst)} kr`;
    document.getElementById("totalUtgifter").textContent = `${formatNumber(totalUtgifter)} kr`;
    document.getElementById("inkomstTäckning").textContent = `${Math.round(täckning)}%`;

    // 🔹 Uppdatera varje utgiftsposts visade belopp
    utgifter.forEach((utgift, index) => {
        const inputElement = document.getElementById(`kostnad${index}`);
        if (inputElement) {
            inputElement.nextElementSibling.textContent = `${formatNumber(utgift.belopp)} kr`;
        }
    });

    // 🔹 Undvik att uppdatera state om värdet redan är detsamma
    if (!frånUI && Math.round(getState("totaltNetto")) !== Math.round(nyInkomst)) {
        updateState("totaltNetto", nyInkomst);
    }
}

// ✅ Exportera funktioner
export { skapaUtgifterUI, uppdateraUtgifter };
