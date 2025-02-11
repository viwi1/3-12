import { updateState, getState } from "./state.js";
import { formatNumber } from "./main.js";

document.addEventListener("DOMContentLoaded", () => {
  const resultContainer = document.getElementById("resultFörsäljning");
  if (!resultContainer) return;

  // 1) Infoga två sektioner – en för kontroller och en för resultat
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
        <input type="checkbox" id="betalaHuslan">
        <label for="betalaHuslan">🏡 Betala av huslånet direkt vid exit</label>
      </div>
    </div>

    <div id="exitResult" class="box"></div>
  `;

  // 2) Hämta element
  const nuvardeEl        = document.getElementById("nuvarde");
  const daligtNuvardeEl  = document.getElementById("daligtNuvarde");
  const multipelEl       = document.getElementById("multipel");
  const multipelValueEl  = document.getElementById("multipelValue");
  const betalaHuslanEl   = document.getElementById("betalaHuslan");
  const exitResultEl     = document.getElementById("exitResult");

  // 3) Koppla event-lyssnare

  // "Dåligt värde" (3 000 000 kr)
  daligtNuvardeEl.addEventListener("change", () => {
    const nyttVarde = daligtNuvardeEl.checked ? 3000000 : getState("startVarde");
    updateState("startVarde", nyttVarde);
    nuvardeEl.textContent = formatNumber(nyttVarde);
    uppdateraBeräkningar();
  });

  // Multipel
  multipelEl.addEventListener("input", () => {
    multipelValueEl.textContent = parseFloat(multipelEl.value).toFixed(1);
    uppdateraBeräkningar();
  });

  // Huslånecheckbox
  betalaHuslanEl.addEventListener("change", () => {
    updateState("betalaHuslan", betalaHuslanEl.checked);
    uppdateraBeräkningar();
  });

  // 4) Initiera kontroller (värden från state)
  nuvardeEl.textContent       = formatNumber(getState("startVarde") || 0);
  multipelValueEl.textContent = multipelEl.value;
  betalaHuslanEl.checked      = getState("betalaHuslan"); // Ladda tidigare checkbox-status

  // 5) Första beräkningen
  uppdateraBeräkningar();
});

// 6) Exportera funktionen för att andra skript ska kunna anropa
export function uppdateraBeräkningar() {
  // Hämtar nödvändiga data
  const multipelEl      = document.getElementById("multipel");
  const betalaHuslanEl  = document.getElementById("betalaHuslan");
  const exitResultEl    = document.getElementById("exitResult");

  if (!multipelEl || !exitResultEl) return;

  const multipel     = parseFloat(multipelEl.value) || 1;
  const startVarde   = getState("startVarde") || 0;
  const huslan       = getState("huslan") || 0;
  const betalaHuslan = getState("betalaHuslan");
  const skattLåg     = getState("skattUtdelningLåg") || 0.20;
  const skattHög     = getState("skattUtdelningHög") || 0.50;
  const gransvarde   = getState("belopp312") || 684166;

  const forsaljningspris = startVarde * multipel;
  let exitKapital = forsaljningspris;

  // Huslånsberäkning (enkel variant)
  const nettoLag = gransvarde * (1 - skattLåg);
  const restLan  = huslan - nettoLag;
  const bruttoHogBehov = restLan > 0 ? restLan / (1 - skattHög) : 0;
  const totaltBruttoForLan = gransvarde + bruttoHogBehov;

  if (betalaHuslan) {
    exitKapital -= totaltBruttoForLan;
    if (exitKapital < 0) exitKapital = 0;
  }

  updateState("exitVarde", exitKapital);

  exitResultEl.innerHTML = `
    <p><strong>${betalaHuslan
      ? "Exitbelopp efter huslånsbetalning 🏡"
      : "Exitbelopp"
    }</strong></p>
    <p>${formatNumber(exitKapital)}</p>
    ${
      betalaHuslan
        ? `
      <p>Huslån: ${formatNumber(huslan)}</p>
      <p><strong>Bruttobelopp för lån:</strong> ${formatNumber(totaltBruttoForLan)}</p>
      <p>- ${formatNumber(gransvarde)} (20%): → Netto: ${formatNumber(nettoLag)}</p>
      <p>- Resterande (50%): ${formatNumber(bruttoHogBehov)} → Netto: ${formatNumber(restLan > 0 ? restLan : 0)}</p>
    `
        : ""
    }
  `;
}
