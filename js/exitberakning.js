import { updateState, getState } from "./state.js";
import { formatNumber } from "./main.js";

document.addEventListener("DOMContentLoaded", () => {
  const resultContainer = document.getElementById("resultFörsäljning");
  if (!resultContainer) return;

  // Steg 1: Infoga två sektioner – en för kontroller (exitControls) och en för resultat (exitResult)
  resultContainer.innerHTML = `
    <div id="exitControls" class="box">
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
    </div>

    <div id="exitResult" class="box"></div>
  `;

  // Hämta element för kontroller
  const nuvardeEl       = document.getElementById("nuvarde");
  const daligtNuvardeEl = document.getElementById("daligtNuvarde");
  const multipelEl      = document.getElementById("multipel");
  const multipelValueEl = document.getElementById("multipelValue");
  const betalaHuslanEl  = document.getElementById("betalaHuslan");
  const exitResultEl    = document.getElementById("exitResult");

  // Steg 2: En funktion som bara uppdaterar resultatsektionen (exitResult)
  function uppdateraBeräkningar() {
    let startVarde   = getState("startVarde") || 0;
    let huslan       = getState("huslan") || 0;
    let skattLåg     = getState("skattUtdelningLåg") || 0.20;
    let skattHög     = getState("skattUtdelningHög") || 0.50;
    let gransvarde   = getState("belopp312") || 684166;
    let multipel     = parseFloat(multipelEl.value) || 1;

    let forsaljningspris = startVarde * multipel;
    let exitKapital      = forsaljningspris;

    let nettoLåg = gransvarde * (1 - skattLåg);
    let lanEfterLågSkatt = huslan - nettoLåg;
    let bruttoHögBehov   = lanEfterLågSkatt > 0 ? lanEfterLågSkatt / (1 - skattHög) : 0;
    let totaltBruttoFörLån = gransvarde + bruttoHögBehov;

    if (betalaHuslanEl.checked) {
      exitKapital = forsaljningspris - totaltBruttoFörLån;
      if (exitKapital < 0) exitKapital = 0;
    }

    updateState("exitVarde", exitKapital);

    // Bygg minimal HTML för resultat
    exitResultEl.innerHTML = `
      <p><strong>${betalaHuslanEl.checked
        ? "Exitbelopp efter huslånsbetalning 🏡"
        : "Exitbelopp"
      }</strong></p>
      <p>${formatNumber(exitKapital)}</p>
      ${
        betalaHuslanEl.checked
          ? `
        <p>Huslån: ${formatNumber(huslan)}</p>
        <p><strong>Bruttobelopp för lån:</strong> ${formatNumber(totaltBruttoFörLån)}</p>
        <p>- ${formatNumber(gransvarde)} (20%): → Netto: ${formatNumber(nettoLåg)}</p>
        <p>- Resterande (50%): ${formatNumber(bruttoHögBehov)} → Netto: ${formatNumber(lanEfterLågSkatt > 0 ? lanEfterLågSkatt : 0)}</p>
      `
          : ""
      }
    `;
  }

  // Steg 3: Event-lyssnare för kontroller
  daligtNuvardeEl.addEventListener("change", () => {
    let nytt = daligtNuvardeEl.checked ? 3000000 : getState("startVarde");
    updateState("startVarde", nytt);
    nuvardeEl.textContent = formatNumber(nytt);
    uppdateraBeräkningar();
  });

  multipelEl.addEventListener("input", () => {
    multipelValueEl.textContent = parseFloat(multipelEl.value).toFixed(1);
    uppdateraBeräkningar();
  });

  betalaHuslanEl.addEventListener("change", uppdateraBeräkningar);

  // Steg 4: Initiera med startvärde och multipel
  nuvardeEl.textContent = formatNumber(getState("startVarde") || 0);
  multipelValueEl.textContent = multipelEl.value;
  uppdateraBeräkningar();
});

// Export så att andra filer kan trigga om de vill
export function uppdateraBeräkningar() {}
