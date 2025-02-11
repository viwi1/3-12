import { updateState, getState } from "./state.js";
import { formatNumber } from "./main.js";

document.addEventListener("DOMContentLoaded", () => {
  const resultContainer = document.getElementById("resultFörsäljning");
  if (!resultContainer) return;

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
        <input type="checkbox" id="betalaHuslan">
        <label for="betalaHuslan">🏡 Betala av huslånet direkt vid exit</label>
      </div>

      <p class="result-title"><strong id="exitTitle">Exitbelopp</strong></p>
      <p id="exitBelopp"></p>
      <div id="huslanDetaljer"></div>
    </div>
  `;

  const nuvardeEl       = document.getElementById("nuvarde");
  const daligtNuvardeEl = document.getElementById("daligtNuvarde");
  const multipelEl      = document.getElementById("multipel");
  const multipelValueEl = document.getElementById("multipelValue");
  const betalaHuslanEl  = document.getElementById("betalaHuslan");
  const exitTitleEl     = document.getElementById("exitTitle");
  const exitBeloppEl    = document.getElementById("exitBelopp");
  const huslanDetaljerEl = document.getElementById("huslanDetaljer");

  function uppdateraBeräkningar() {
    const multipel = parseFloat(multipelEl.value) || 1;
    const startVarde = getState("startVarde") || 0;
    const huslan = getState("huslan") || 0;
    const gransvarde = getState("belopp312") || 684166;
    const skattLåg = getState("skattUtdelningLåg") || 0.20;
    const skattHög = getState("skattUtdelningHög") || 0.50;

    let forsPris = startVarde * multipel;
    let exitKapital = forsPris;

    let nettoLåg = gransvarde * (1 - skattLåg);
    let bruttoHögBehov = (huslan - nettoLåg) / (1 - skattHög);
    let totaltBruttoForLan = gransvarde + bruttoHögBehov;

    if (betalaHuslanEl.checked) {
      exitKapital -= totaltBruttoForLan;
    }

    updateState("exitVarde", exitKapital);
    exitBeloppEl.textContent = formatNumber(exitKapital);
    huslanDetaljerEl.innerHTML = betalaHuslanEl.checked
      ? `<p>Huslån: ${formatNumber(huslan)}</p>`
      : "";
  }

  multipelEl.addEventListener("input", uppdateraBeräkningar);
  betalaHuslanEl.addEventListener("change", uppdateraBeräkningar);
  uppdateraBeräkningar();
});

export function uppdateraBeräkningar() {}
