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
    { namn: "🏡 Lån och amortering", belopp: 115245, villkor: () => !getState("betalaHuslan") },
    { namn: "Lån och amortering CSN", belopp: 8748 }
];

function skapaUtgifterUI() {
    const container = document.getElementById("expenses");
    if (!container) return;

    let inkomst = getState("totaltNetto");

    const aktivaUtgifter = UTGIFTER.filter(utgift => !utgift.villkor || utgift.villkor());
    const totalUtgifter = aktivaUtgifter.reduce((sum, u) => sum + u.belopp, 0);
    const skillnad = inkomst - totalUtgifter;
    const täckning = totalUtgifter > 0 ? (inkomst / totalUtgifter) * 100 : 0; //Beror på checkboxen
    
    container.innerHTML = `
        <h2>Ekonomiskt oberoende</h2>
        <div class="summary">
            <p><strong>Total avkastning:</strong> <span id="inkomstBelopp" class="green">${formatNumber(inkomst)}</span></p>
            <p><strong>Totala utgifter:</strong> <span id="totalUtgifter" class="red">${formatNumber(totalUtgifter)}</span></p>
            <p><strong>Resultat:</strong> <span id="skillnad" class="black">${formatNumber(skillnad)}</span></p>
            
            <label>
                <input type="checkbox" id="tackaUtgifter" checked> Täck två års utgifter med ett års investeringstillväxt //Dubbelkolla att du räknar rätt
            </label>
            <p><strong>Täckning:</strong> <span id="inkomstTäckning">${Math.round(täckning)}%</span></p> //Grön om täckningen räcker beroende på checkboxens status
            <p id="sparasNästaÅrContainer"><strong>Sparas till nästa år:</strong> <span id="sparasNästaÅr">${formatNumber(totalUtgifter)}</span></p> //Denna måste dubbelkolla checkboxen innan den laddas vid sidladdning.
        </div> 

        <h3>Utgifter</h3>
        <div id="utgifterList" class="expenses-list"></div>
    `;

    skapaUtgiftsposter();
    document.getElementById("tackaUtgifter").addEventListener("change", uppdateraUtgifter);
}

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

function uppdateraUtgifter() {
    let nyInkomst = getState("totaltNetto");
    const aktivaUtgifter = UTGIFTER.filter(utgift => !utgift.villkor || utgift.villkor());
    const totalUtgifter = aktivaUtgifter.reduce((sum, u) => sum + u.belopp, 0);
    const skillnad = nyInkomst - totalUtgifter;
    const täckning = totalUtgifter > 0 ? (nyInkomst / totalUtgifter) * 100 : 0;

    const tackaUtgifterChecked = document.getElementById("tackaUtgifter").checked;
    const sparasContainer = document.getElementById("sparasNästaÅrContainer");

    document.getElementById("inkomstBelopp").textContent = formatNumber(nyInkomst);
    document.getElementById("totalUtgifter").textContent = formatNumber(totalUtgifter);
    document.getElementById("skillnad").textContent = formatNumber(skillnad);
    document.getElementById("inkomstTäckning").textContent = Math.round(täckning) + "%";
    
    if (tackaUtgifterChecked) {
        document.getElementById("inkomstTäckning").classList.add("green");
        document.getElementById("inkomstTäckning").textContent = Math.round(täckning * 2) + "%";
        sparasContainer.style.display = "none";
    } else {
        document.getElementById("inkomstTäckning").classList.remove("green");
        document.getElementById("sparasNästaÅr").textContent = formatNumber(totalUtgifter);
        sparasContainer.style.display = "block";
    }
}

onStateChange("totaltNetto", uppdateraUtgifter);
onStateChange("betalaHuslan", skapaUtgifterUI);

document.addEventListener("DOMContentLoaded", skapaUtgifterUI);

export { skapaUtgifterUI, uppdateraUtgifter };
