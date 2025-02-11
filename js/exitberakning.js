import { updateState, getState } from "./state.js";

function uppdateraNuvarde() {
    let nuvarde = document.getElementById("daligtNuvarde").checked ? 3000000 : 6855837;
    document.getElementById("nuvarde").textContent = formatNumber(nuvarde);
    updateState("exitVarde", nuvarde);
    uppdateraBeräkningar();
}

function uppdateraBeräkningar() {
    let multipel = parseFloat(document.getElementById("multipel").value);
    document.getElementById("multipelValue").textContent = multipel.toFixed(1);

    let exitKapital = getState("exitVarde") * multipel;
    updateState("exitVarde", exitKapital);

    document.getElementById("resultFörsäljning").innerHTML = `
        <div class="box">
            <p class="result-title">Exitbelopp</p>
            <p><strong>${formatNumber(exitKapital)}</strong></p>
        </div>
    `;
}

document.getElementById("multipel").addEventListener("input", uppdateraBeräkningar);
document.getElementById("daligtNuvarde").addEventListener("change", uppdateraNuvarde);
