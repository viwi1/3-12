import { updateState, getState } from "./state.js";
import { formatNumber } from "./main.js";


function uppdateraNuvarde() {
    let nuvarde = document.getElementById("daligtNuvarde").checked ? 3000000 : 6855837;
    updateState("exitVarde", nuvarde);
    document.getElementById("nuvarde").textContent = formatNumber(nuvarde);
    uppdateraBeräkningar();
}

document.getElementById("daligtNuvarde").addEventListener("change", uppdateraNuvarde);


function uppdateraBeräkningar() {
    let multipel = parseFloat(document.getElementById("multipel").value);
    document.getElementById("multipelValue").textContent = multipel.toFixed(1);

    let exitKapital = getState("exitVarde") * multipel;
    updateState("exitVarde", exitKapital);

    // 🔥 Skriver ut exitvärdet i `resultFörsäljning`
    document.getElementById("resultFörsäljning").innerHTML = `
        <div class="box">
            <p class="result-title">Exitbelopp</p>
            <p><strong>${formatNumber(exitKapital)}</strong></p>
        </div>
    `;
}

// ✅ Lägg till event listeners på sliders och checkbox
document.getElementById("multipel").addEventListener("input", uppdateraBeräkningar);
document.getElementById("betalaHuslan").addEventListener("change", uppdateraBeräkningar);


export function uppdateraBeräkningar() {
    let multipel = parseFloat(document.getElementById("multipel").value);
    document.getElementById("multipelValue").textContent = multipel.toFixed(1);

    let exitVarde = getState("exitVarde") || 0;
    let exitKapital = exitVarde * multipel;
    updateState("exitVarde", exitKapital);

    document.getElementById("resultFörsäljning").innerHTML = `
        <div class="box">
            <p class="result-title">Exitbelopp</p>
            <p><strong>${formatNumber(exitKapital)}</strong></p>
        </div>
    `;
}

