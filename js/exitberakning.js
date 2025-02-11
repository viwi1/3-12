import { updateState, getState } from "./state.js";
import { formatNumber } from "./main.js"; // Din formateringsfunktion

document.addEventListener("DOMContentLoaded", () => {
  // Hämta behållaren för exit-rutan
  const resultContainer = document.getElementById("resultFörsäljning");
  if (!resultContainer) return;

  // Sätt in minimal HTML
  resultContainer.innerHTML = `
    <div class="box">
      <p><strong>Startvärde på bolaget:</strong> <span id="nuvarde"></span></p>
      <div class="checkbox-container">
        <input type="checkbox" id="daligtNuvarde">
        <label for="daligtNuvarde">3 000 000 kr</label>
      </div>
      <div class="slider-container">
        <label for="multipel">Multipel:</label>
        <input type="range" id="multipel" min="1.1" max="4" step="0.1" value="2.8">
        <span class="slider-value" id="multipelValue">2.8</span>
      </div>
      <div class="checkbox-container">
        <input type="checkbox" id="betalaHuslan" checked>
        <label for="betalaHuslan">🏡 Betala av huslånet direkt vid exit</label>
      </div>
      <div id="exitResult"></div>
    </div>
  `;

  // Referenser till nyskapade element
  const nuvardeEl         = document.getElementById("nuvarde");
  const daligtNuvardeEl   = document.getElementById("daligtNuvarde");
  const multipelEl        = document.getElementById("multipel");
  const multipelValueEl   = document.getElementById("multipelValue");
  const betalaHuslanEl    = document.getElementById("betalaHuslan");
  const exitResultEl      = document.getElementById("exitResult");

  // Funktion för att uppdatera alla beräkningar
  function uppdateraBeräkningar() {
    // Hämta värden från state
    let startVarde   = getState("startVarde") || 0;
    let huslan       = getState("huslan") || 0;
    let skattLåg     = getState("skattUtdelningLåg") || 0.20;
    let skattHög     = getState("skattUtdelningHög") || 0.50;
    let gransvarde   = getState("belopp312") || 684166; // t.ex. 3:12-belopp
    let multipel     = parseFloat(multipelEl.value) || 1;

    // Räkna fram försäljningspris
    let forsaljningspris = startVarde * multipel;
    let exitKapital      = forsaljningspris;

    // Huslåneavdrag
    let nettoLag  = gransvarde * (1 - skattLåg);
    let restLan   = huslan - nettoLag;
    let bruttoHog = restLan > 0 ? restLan / (1 - skattHög) : 0;
    let totaltForLan = gransvarde + bruttoHog;

    if (betalaHuslanEl.checked) {
      exitKapital = forsaljningspris - totaltForLan;
      if (exitKapital < 0) exitKapital = 0;
    }

    // Spara exitvärdet i state
    updateState("exitVarde", exitKapital);

    // Skriv ut resultat
    exitResultEl.innerHTML = `
      <p><strong>${betalaHuslanEl.checked ? "Exitbelopp efter huslånsbetalning 🏡" : "Exitbelopp"}</strong></p>
      <p>${formatNumber(exitKapital)}</p>
      ${betalaHuslanEl.checked ? `
        <p>Huslån: ${formatNumber(huslan)}</p>
        <p><strong>Bruttobelopp för lån:</strong> ${formatNumber(totaltForLan)}</p>
        <p>- ${formatNumber(gransvarde)} (20%): → Netto: ${formatNumber(nettoLag)}</p>
        <p>- Resterande (50%): ${formatNumber(bruttoHog)} → Netto: ${formatNumber(restLan > 0 ? restLan : 0)}</p>
      ` : ""}
    `;
  }

  // Event: dåligt värde
  daligtNuvardeEl.addEventListener("change", () => {
    let nyttVarde = daligtNuvardeEl.checked ? 3000000 : getState("startVarde");
    updateState("startVarde", nyttVarde);
    nuvardeEl.textContent = formatNumber(nyttVarde);
    uppdateraBeräkningar();
  });

  // Event: multipel
  multipelEl.addEventListener("input", () => {
    multipelValueEl.textContent = parseFloat(multipelEl.value).toFixed(1);
    uppdateraBeräkningar();
  });

  // Event: huslånekryss
  betalaHuslanEl.addEventListener("change", uppdateraBeräkningar);

  // Sätt initialt startvärde & multipel
  nuvardeEl.textContent = formatNumber(getState("startVarde") || 0);
  multipelValueEl.textContent = multipelEl.value;

  // Kör första beräkningen
  uppdateraBeräkningar();
});
