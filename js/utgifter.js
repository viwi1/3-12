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
    { namn: "Lån och amortering", belopp: 115245, kräverHuslan: true },
    { namn: "Lån och amortering CSN", belopp: 8748 }
];

function skapaUtgifterUI() {
    const container = document.getElementById("expenses");
    if (!container) return;

    const betalaHuslan = getState("betalaHuslan"); // Kolla om huslånet ska betalas

    container.innerHTML = `
        <h3>Årlig utdelning</h3>
        <p><strong>Totalt netto:</strong> <span id="inkomstBelopp">${formatNumber(getState("totaltNetto"))}</span></p>
        <h3>Utgifter</h3>
        <div id="utgifterContainer"></div>
    `;

    const utgifterContainer = document.getElementById("utgifterContainer");

    UTGIFTER.forEach((utgift, index) => {
        if (utgift.kräverHuslan && betalaHuslan) return; // Döljer "Lån och amortering" om huslånet är betalt

        const inputGroup = document.createElement("div");
        inputGroup.className = "input-group";
        inputGroup.innerHTML = `
            <label>${utgift.namn}:</label>
            <input type="number" id="kostnad${index}" value="${utgift.belopp}">
        `;
        utgifterContainer.appendChild(inputGroup);
    });
}

function uppdateraUtgifter(inkomst) {
    const beloppEl = document.getElementById("inkomstBelopp");
    if (beloppEl) beloppEl.textContent = formatNumber(inkomst);
}

onStateChange("totaltNetto", uppdateraUtgifter);
document.addEventListener("DOMContentLoaded", skapaUtgifterUI);

export { skapaUtgifterUI, uppdateraUtgifter };
