import { updateState, getState } from "./state.js";
import { formatNumber } from "./main.js";

////////////////////////////////////////////////////////////////////////////////
// 1) Start: Kolla att filen verkligen laddas (ersätter console.log med alert)
////////////////////////////////////////////////////////////////////////////////
alert("exitberakning.js laddad! (Steg 1)");

////////////////////////////////////////////////////////////////////////////////
// 2) När sidan laddat klart, injicera HTML i #resultFörsäljning
////////////////////////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", function () {
  alert("DOMContentLoaded i exitberakning.js! (Steg 2)");

  // Hitta div#resultFörsäljning
  const resultContainer = document.getElementById("resultFörsäljning");
  if (!resultContainer) {
    alert("Fel: #resultFörsäljning saknas i HTML. Avbryter…");
    return;
  }

  // Ersätt innehållet i #resultFörsäljning
  resultContainer.innerHTML = `
    <div class="box">
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

  alert("HTML injicerad i #resultFörsäljning (Steg 3)");

  // 3) Hämta referenser till elementen
  let multipelElement = document.getElementById("multipel");
  let multipelValueElement = document.getElementById("multipelValue");
  let daligtNuvardeCheckbox = document.getElementById("daligtNuvarde");
  let nuvardeElement = document.getElementById("nuvarde");
  let betalaHuslanCheckbox = document.getElementById("betalaHuslan");

  // 4) Sätt upp event-listeners
  multipelElement.addEventListener("input", function () {
    let multipel = parseFloat(this.value);
    multipelValueElement.textContent = multipel.toFixed(1);
    uppdateraBeräkningar();
  });

  daligtNuvardeCheckbox.addEventListener("change", function () {
    let nyttVarde = daligtNuvardeCheckbox.checked ? 3000000 : getState("startVarde");
    updateState("startVarde", nyttVarde);
    nuvardeElement.textContent = formatNumber(nyttVarde);
    uppdateraBeräkningar();
  });

  betalaHuslanCheckbox.addEventListener("change", function () {
    alert("Huslån-checkbox ändrad!");
    uppdateraBeräkningar();
  });

  // 5) Visa aktuellt startvärde från state.js
  nuvardeElement.textContent = formatNumber(getState("startVarde") || 0);

  // 6) Gör en första beräkning
  uppdateraBeräkningar();
});

////////////////////////////////////////////////////////////////////////////////
// 7) Funktion för att göra själva exitberäkningen
////////////////////////////////////////////////////////////////////////////////
function uppdateraBeräkningar() {
  alert("Nu körs uppdateraBeräkningar! (Steg 4)");

  // Exempel: uppdatera exitVarde i state baserat på multipeln
  let multipel = parseFloat(document.getElementById("multipel").value) || 1;
  let startVarde = getState("startVarde") || 0;
  let forsaljningspris = startVarde * multipel;

  // Kolla om huslån ska dras
  let betalaHuslan = document.getElementById("betalaHuslan").checked;
  let huslan = getState("huslan") || 0;
  let exitKapital = forsaljningspris;
  if (betalaHuslan) {
    exitKapital -= huslan; // Förenklad logik för test
  }

  // Se till att inte bli negativt
  if (exitKapital < 0) exitKapital = 0;

  // Spara i state
  updateState("exitVarde", exitKapital);

  alert(`Nytt exitVarde: ${exitKapital} (Steg 5)`);
}

////////////////////////////////////////////////////////////////////////////////
// 8) Exportera funktionen om andra skript behöver anropa den
////////////////////////////////////////////////////////////////////////////////
export { uppdateraBeräkningar };
