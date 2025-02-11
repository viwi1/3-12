import { updateState, getState } from "./state.js";

function beraknaHuslan() {
    let huslan = getState("huslan");
    let exitVarde = getState("exitVarde");

    let betalaHuslan = document.getElementById("betalaHuslan").checked;
    if (betalaHuslan) {
        exitVarde -= huslan;
    }

    document.getElementById("resultFörsäljning").innerHTML = `
        <div class="box">
            <p class="result-title">Exitbelopp efter huslånsbetalning</p>
            <p><strong>${formatNumber(exitVarde)}</strong></p>
        </div>
    `;
    updateState("exitVarde", exitVarde);
}

document.getElementById("betalaHuslan").addEventListener("change", beraknaHuslan);
