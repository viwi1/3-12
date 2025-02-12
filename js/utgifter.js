import { formatNumber } from "./main.js";
import { getState, onStateChange } from "./state.js";

const UTGIFTER = [
    { namn: "BRF Avgift", belopp: 95580 },
    { namn: "Hemförsäkring Dina försäkringar", belopp: 3420 },
    { namn: "Fritids och förskola", belopp: 28524 },
    { namn: "El vattenfall Elnät", belopp: 12726 },
    { namn: "El Tibber", belopp: 6252 },
    { namn: "Flexen", belopp: 196442 },
    { namn: "Klarna - presenter och skoj", belopp: 60000 },
    { namn: "Resa", belopp: 100000 },
    { namn: "Lån och amortering", belopp: 115245, villkor: () => !getState("betalaHuslan") },
    { namn: "Lån och amortering CSN", belopp: 8748 }
];

/**
 * Skapar UI för utgifter och sammanfattning.
 */
function skapaUtgifterUI() {
    const container = document.getElementById("expenses");
    if (!container) return;

    // 🔹 Hämta inkomst direkt från state.js
    let inkomst = getState("totaltNetto");

    // 🔹 Filtrera bort villkorade utgifter (t.ex. lån om huslånet är betalt)
    const aktivaUtgifter = UTGIFTER.filter(utgift => !utgift.villkor || utgift.villkor());

    // 🔹 Räkna ut total utgift
    const totalUtgifter = aktivaUtgifter.reduce((sum, u) => sum + u.belopp, 0);
    const skillnad = inkomst - totalUtgifter;
    const täckning = totalUtgifter > 0 ? (inkomst / totalUtgifter) * 100 : 0;

    // 🔹 Bygg HTML
    container.innerHTML = `
        <h3>Ekonomisk sammanfattning</h3>
        <div class="summary">
            <p><strong>Totalt netto:</strong> <span id="inkomstBelopp">${formatNumber(inkomst)}</span></p>
            <p><strong>Totala utgifter:</strong> <span id="totalUtgifter">${formatNumber(totalUtgifter)}</span></p>
            <p><strong>Täckning:</strong> <span id="inkomstTäckning">${Math.round(täckning)}%</span></p>
            <p><strong>Skillnad:</strong> <span id="skillnad">${formatNumber(skillnad)}</span></p>
        </div>

        <h3>Utgifter</h3>
        <div class="expenses-list">
            ${aktivaUtgifter.map((utgift, index) => `
                <div class="expense-item">
                    <span class="expense-name">${utgift.namn}</span>
                    <span class="expense-amount">${formatNumber(utgift.belopp)}</span>
                </div>
            `).join("")}
        </div>
    `;
}

/**
 * Uppdaterar endast summeringarna utan att bygga om UI.
 */
function uppdateraUtgifter(nyInkomst) {
    const totalUtgifter = UTGIFTER.filter(u => !u.villkor || u.villkor()).reduce((sum, u) => sum + u.belopp, 0);
    const skillnad = nyInkomst - totalUtgifter;
    const täckning = totalUtgifter > 0 ? (nyInkomst / totalUtgifter) * 100 : 0;

    document.getElementById("inkomstBelopp").textContent = formatNumber(nyInkomst);
    document.getElementById("totalUtgifter").textContent = formatNumber(totalUtgifter);
    document.getElementById("inkomstTäckning").textContent = Math.round(täckning) + "%";
    document.getElementById("skillnad").textContent = formatNumber(skillnad);
}

// 🔹 Skapa UI vid sidladdning
document.addEventListener("DOMContentLoaded", skapaUtgifterUI);

// 🔹 Lyssna på förändringar av `totaltNetto` och uppdatera summeringen
onStateChange("totaltNetto", uppdateraUtgifter);

// ✅ Exportera funktionerna
export { skapaUtgifterUI, uppdateraUtgifter };
