import { updateState, getState } from "./state.js";
import { formatNumber } from "./main.js"; 

function uppdateraNuvarde() {
    let nuvarde = document.getElementById("daligtNuvarde").checked ? 3000000 : 6855837;
    updateState("exitVarde", nuvarde); // ✅ Spara originalvärdet en gång
    document.getElementById("nuvarde").textContent = formatNumber(nuvarde);
    uppdateraBeräkningar();
}

document.getElementById("daligtNuvarde").addEventListener("change", uppdateraNuvarde);

function uppdateraBeräkningar() {
    let multipel = parseFloat(document.getElementById("multipel").value);
    document.getElementById("multipelValue").textContent = multipel.toFixed(1);

    // ✅ Hämta originalvärdet från state, inte det modifierade!
    let originalExitVarde = document.getElementById("daligtNuvarde").checked ? 3000000 : 6855837;
    let exitKapital = originalExitVarde * multipel;

    // 🔥 Spara INTE detta i state för att undvika ackumulering!
    // updateState("exitVarde", exitKapital); ❌ Ta bort denna rad!

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

export { uppdateraBeräkningar };
