import { updateState, getState } from "./state.js";
import { formatNumber } from "./main.js";

document.addEventListener("DOMContentLoaded", () => {
  const resultContainer = document.getElementById("resultFörsäljning");
  if (!resultContainer) return;

  // 1. Infoga kontroller och en separat sektion för resultat
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

  // 2. Hämta våra nya element
  const nuvardeEl       = document.getElementById("nuvarde");
  const daligtNuvardeEl = document.getElementById("daligtNuvarde");
  const multipelEl      = document.getElementById("multipel");
  const multipelValueEl = document.getElementById("multipelValue");
  const betalaHuslanEl  = document.getElementById("betalaHuslan");
  const exitResultEl    = document.getElementById("exitResult");

  // 3. Huvudfunktionen för beräkning
  function uppdateraBeräkningar() {
    const multipel   = parseFloat(multipelEl.value) || 1;
    const startVarde = getState("startVarde") || 0;
    const huslan     = getState("huslan") || 0;

    const skattLåg   = getState("skattUtdelningLåg") || 0.20;
    const skattHög   = getState("skattUtdelningHög") || 0.50;
    const gransvarde = getState("belopp312") || 684166;

    // Bas: startVarde × multipel
    let forsaljningspris = startVarde * multipel;
    let exitKapital      = forsaljningspris;

    // Huslånsberäkning
    let nettoLåg   = gransvarde * (1 - skattLåg);
    let lanEfterLågSkatt  = huslan - nettoLåg;
    let bruttoHögBehov    = lanEfterLågSkatt > 0 ? lanEfterLågSkatt / (1 - skattHög) : 0;
    let totaltBruttoForLan = gransvarde + bruttoHögBehov;

    // Om checkbox huslån är ibockad → minska exitKapital
    if (betalaHuslanEl.checked) {
      exitKapital -= totaltBruttoForLan;
      if (exitKapital < 0) exitKapital = 0;
      updateState("betalaHuslan", true);
    } else {
      updateState("betalaHuslan", false);
    }

    // Spara nya exitVarde i state
    updateState("exitVarde", exitKapital);

    // Uppdatera resultatsektionen
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
        <p><strong>Bruttobelopp för lån:</strong> ${formatNumber(totaltBruttoForLan)}</p>
        <p>- ${formatNumber(gransvarde)} (20%): → Netto: ${formatNumber(nettoLåg)}</p>
        <p>- Resterande (50%): ${formatNumber(bruttoHögBehov)} → Netto: ${formatNumber(lanEfterLågSkatt > 0 ? lanEfterLågSkatt : 0)}</p>
      `
          : ""
      }
    `;
  }

  // 4. Event-lyssnare

  // Dåligt värde
  daligtNuvardeEl.addEventListener("change", () => {
    const nyttVarde = daligtNuvardeEl.checked ? 3000000 : getState("startVarde");
    updateState("startVarde", nyttVarde);
    nuvardeEl.textContent = formatNumber(nyttVarde);
    uppdateraBeräkningar();
  });

  // Multipelslider
  multipelEl.addEventListener("input", () => {
    multipelValueEl.textContent = parseFloat(multipelEl.value).toFixed(1);
    uppdateraBeräkningar();
  });

  // Huslånecheckbox
  betalaHuslanEl.addEventListener("change", uppdateraBeräkningar);

  // 5. Initiera UI och kör första beräkning
  nuvardeEl.textContent       = formatNumber(getState("startVarde") || 0);
  multipelValueEl.textContent = multipelEl.value;
  betalaHuslanEl.checked      = getState("betalaHuslan") || false;

  uppdateraBeräkningar();
});

// 6. Exportera så andra filer kan anropa funktionen direkt om så önskas
export function uppdateraBeräkningar() {}
