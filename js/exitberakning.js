import { updateState, getState } from "./state.js";
import { formatNumber } from "./main.js"; // ✅ Formatering

// 🏗️ Dynamiskt skapa och infoga HTML vid sidladdning
document.addEventListener("DOMContentLoaded", function () {
    const resultContainer = document.getElementById("resultFörsäljning"); // 🔹 Här injiceras koden

    if (!resultContainer) {
        console.error("🚨 Fel: resultFörsäljning saknas i index.html!");
        return;
    }

    resultContainer.innerHTML = `
        <div class="box">
            <!-- Nuvarande värde -->
            <p><strong>Startvärde på bolaget:</strong> <span id="nuvarde"></span></p>
            <div class="checkbox-container">
                <input type="checkbox" id="daligtNuvarde">
                <label for="daligtNuvarde">3 000 000 kr</label>
            </div>

            <!-- Multipel -->
            <div class="slider-container">
                <label for="multipel">Multipel:</label>
                <input type="range" id="multipel" min="1.1" max="4" step="0.1" value="2.8">
                <span class="slider-value" id="multipelValue">2.8</span>
            </div>

            <!-- Checkbox huslån -->
            <div class="checkbox-container">
                <input type="checkbox" id="betalaHuslan" checked>
                <label for="betalaHuslan">🏡 Betala av huslånet direkt vid exit</label>
            </div>
        </div>
    `;

    // 🔄 Hämta värden och lägga till event listeners
    let multipelElement = document.getElementById("multipel");
    let multipelValueElement = document.getElementById("multipelValue");
    let daligtNuvardeCheckbox = document.getElementById("daligtNuvarde");
    let nuvardeElement = document.getElementById("nuvarde");

    // 🔄 Visa startvärdet för multipeln från HTML
    multipelValueElement.textContent = multipelElement.value;

    // 🔄 Uppdatera multipelvärdet i realtid när slidern ändras
    multipelElement.addEventListener("input", function () {
        let multipel = parseFloat(this.value);

        // ✅ Uppdatera HTML-texten bredvid slidern
        multipelValueElement.textContent = multipel.toFixed(1);

        // ✅ Kör om exitberäkningen så att allt uppdateras korrekt
        uppdateraBeräkningar();
    });

    // 🔄 Event listener för "Dåligt värde"
    daligtNuvardeCheckbox.addEventListener("change", function () {
        let nyttVarde = daligtNuvardeCheckbox.checked ? 3000000 : getState("startVarde");
        updateState("startVarde", nyttVarde);
        nuvardeElement.textContent = formatNumber(nyttVarde);
        uppdateraBeräkningar();
    });

    // 🔄 Lägg till event listener för huslåne-checkboxen
    document.getElementById("betalaHuslan").addEventListener("change", function () {
        console.log("⚡ Huslånecheckbox ändrad, uppdaterar beräkning...");
        uppdateraBeräkningar();
    });

    // 🔄 Sätt initialt startvärde
    nuvardeElement.textContent = formatNumber(getState("startVarde"));

    // 🔄 Starta första beräkningen
    uppdateraBeräkningar();
});
