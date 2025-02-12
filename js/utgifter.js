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

    let inkomst = getState("totaltNetto");
    let betalaHuslan = getState("betalaHuslan");

    // 🔹 Filtrera bort villkorade utgifter
    const aktivaUtgifter = UTGIFTER.filter(utgift => !utgift.villkor || utgift.villkor());

    // 🔹 Beräkna total utgift, täckning och skillnad
    const totalUtgifter = aktivaUtgifter.reduce((sum, u) => sum + u.belopp, 0);
    const skillnad = inkomst - totalUtgifter;
    const roligPengar = skillnad > 0 ? skillnad * 0.5 : 0;
    const sparasNästaÅr = skillnad > 0 ? skillnad * 0.5 : 0;
    const täckning = totalUtgifter > 0 ? (inkomst / totalUtgifter) * 100 : 0;

    // 🔹 Skapa UI
    container.innerHTML = `
        <h2>Ekonomiskt oberoende</h2>
        <div class="summary">
            <p><strong>Totalt netto:</strong> <span id="inkomstBelopp">${formatNumber(inkomst)}</span></p>
            <p><strong>Totala utgifter:</strong> <span id="totalUtgifter">${formatNumber(totalUtgifter)}</span></p>
            <p><strong>Täckning:</strong> <span id="inkomstTäckning">${Math.round(täckning)}%</span></p>
            <p><strong>Roliga pengar:</strong> <span id="roligaPengar">${formatNumber(roligPengar)}</span></p>
            <p><strong>Sparas till nästa år:</strong> <span id="sparasNästaÅr">${formatNumber(sparasNästaÅr)}</span></p>
        </div>

        <h3>Utgifter</h3>
        <div id="utgifterList" class="expenses-list"></div>
    `;

    skapaUtgiftsposter();
}

/**
 * Skapar individuella utgiftsposter i UI.
 */
function skapaUtgiftsposter() {
    const utgifterList = document.getElementById("utgifterList");
    if (!utgifterList) return;

    utgifterList.innerHTML = "";
    const aktivaUtgifter = UTGIFTER.filter(utgift => !utgift.villkor || utgift.villkor());

    aktivaUtgifter.forEach((utgift) => {
        const perMånad = utgift.belopp / 12;
        const utgiftRow = document.createElement("div");
        utgiftRow.className = "expense-item";
        utgiftRow.innerHTML = `
            <span class="expense-name">${utgift.namn}</span>
            <span class="expense-amount">${formatNumber(utgift.belopp)} (${formatNumber(perMånad)}/mån)</span>
        `;
        utgifterList.appendChild(utgiftRow);
    });
}

/**
 * Uppdaterar summeringarna utan att bygga om UI.
 */
function uppdateraUtgifter(nyInkomst) {
    const aktivaUtgifter = UTGIFTER.filter(utgift => !utgift.villkor || utgift.villkor());
    const totalUtgifter = aktivaUtgifter.reduce((sum, u) => sum + u.belopp, 0);
    const skillnad = nyInkomst - totalUtgifter;
    const roligPengar = skillnad > 0 ? skillnad * 0.5 : 0;
    const sparasNästaÅr = skillnad > 0 ? skillnad * 0.5 : 0;
    const täckning = totalUtgifter > 0 ? (nyInkomst / totalUtgifter) * 100 : 0;

    document.getElementById("inkomstBelopp").textContent = formatNumber(nyInkomst);
    document.getElementById("totalUtgifter").textContent = formatNumber(totalUtgifter);
    document.getElementById("inkomstTäckning").textContent = Math.round(täckning) + "%";
    document.getElementById("roligaPengar").textContent = formatNumber(roligPengar);
    document.getElementById("sparasNästaÅr").textContent = formatNumber(sparasNästaÅr);
}

// 🔹 Lyssna på förändringar i både `totaltNetto` och `betalaHuslan`
onStateChange("totaltNetto", uppdateraUtgifter);
onStateChange("betalaHuslan", skapaUtgifterUI);

// 🔹 Skapa UI vid sidladdning
document.addEventListener("DOMContentLoaded", skapaUtgifterUI);

// ✅ Exportera funktionerna
export { skapaUtgifterUI, uppdateraUtgifter };
