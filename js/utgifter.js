import { formatNumber } from "./main.js";
import { getState, updateState, onStateChange } from "./state.js";

let UTGIFTER = [
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

    // 🔹 Beräkna total utgift och täckning
    const totalUtgifter = aktivaUtgifter.reduce((sum, u) => sum + u.belopp, 0);
    const skillnad = inkomst - totalUtgifter;
    const täckning = totalUtgifter > 0 ? (inkomst / totalUtgifter) * 100 : 0;

    // 🔹 Skapa UI
    container.innerHTML = `
        <h3>Ekonomisk sammanfattning</h3>
        <div class="summary">
            <p><strong>Totalt netto:</strong> <span id="inkomstBelopp">${formatNumber(inkomst)}</span></p>
            <p><strong>Totala utgifter:</strong> <span id="totalUtgifter">${formatNumber(totalUtgifter)}</span></p>
            <p><strong>Täckning:</strong> <span id="inkomstTäckning">${Math.round(täckning)}%</span></p>
            <p><strong>Skillnad:</strong> <span id="skillnad">${formatNumber(skillnad)}</span></p>
        </div>

        <h3>Utgifter</h3>
        <div id="utgifterForm" class="expenses-list"></div>

        <h3>Lägg till egen årskostnad</h3>
        <div class="add-expense">
            <input type="text" id="nyUtgiftNamn" placeholder="Namn på utgift">
            <input type="number" id="nyUtgiftBelopp" placeholder="Årskostnad (kr)">
            <button id="läggTillUtgift">Lägg till</button>
        </div>
    `;

    skapaUtgiftsposter();
    document.getElementById("läggTillUtgift").addEventListener("click", läggTillEgenUtgift);
}

/**
 * Skapar individuella utgiftsposter i UI.
 */
function skapaUtgiftsposter() {
    const utgifterForm = document.getElementById("utgifterForm");
    if (!utgifterForm) return;

    utgifterForm.innerHTML = "";
    const aktivaUtgifter = UTGIFTER.filter(utgift => !utgift.villkor || utgift.villkor());

    aktivaUtgifter.forEach((utgift, index) => {
        const perMånad = utgift.belopp / 12;
        const inputGroup = document.createElement("div");
        inputGroup.className = "expense-item";
        inputGroup.innerHTML = `
            <span class="expense-name">${utgift.namn}</span>
            <input type="number" id="kostnad${index}" class="expense-input" value="${utgift.belopp}">
            <span class="expense-monthly">(${formatNumber(perMånad)}/mån)</span>
        `;
        utgifterForm.appendChild(inputGroup);

        document.getElementById(`kostnad${index}`).addEventListener("input", () => {
            UTGIFTER[index].belopp = parseInt(document.getElementById(`kostnad${index}`).value, 10) || 0;
            uppdateraUtgifter(getState("totaltNetto"));
        });
    });
}

/**
 * Uppdaterar endast summeringarna utan att bygga om UI.
 */
function uppdateraUtgifter(nyInkomst) {
    const aktivaUtgifter = UTGIFTER.filter(utgift => !utgift.villkor || utgift.villkor());
    const totalUtgifter = aktivaUtgifter.reduce((sum, u) => sum + u.belopp, 0);
    const skillnad = nyInkomst - totalUtgifter;
    const täckning = totalUtgifter > 0 ? (nyInkomst / totalUtgifter) * 100 : 0;

    document.getElementById("inkomstBelopp").textContent = formatNumber(nyInkomst);
    document.getElementById("totalUtgifter").textContent = formatNumber(totalUtgifter);
    document.getElementById("inkomstTäckning").textContent = Math.round(täckning) + "%";
    document.getElementById("skillnad").textContent = formatNumber(skillnad);
}

/**
 * Lägger till en egen utgiftspost.
 */
function läggTillEgenUtgift() {
    const namn = document.getElementById("nyUtgiftNamn").value.trim();
    const belopp = parseInt(document.getElementById("nyUtgiftBelopp").value, 10);

    if (!namn || isNaN(belopp) || belopp <= 0) return;

    UTGIFTER.push({ namn, belopp });
    skapaUtgiftsposter();
    uppdateraUtgifter(getState("totaltNetto"));
}

// 🔹 Lyssna på förändringar i både `totaltNetto` och `betalaHuslan`
onStateChange("totaltNetto", uppdateraUtgifter);
onStateChange("betalaHuslan", skapaUtgifterUI);

// 🔹 Skapa UI vid sidladdning
document.addEventListener("DOMContentLoaded", skapaUtgifterUI);

// ✅ Exportera funktionerna
export { skapaUtgifterUI, uppdateraUtgifter };
