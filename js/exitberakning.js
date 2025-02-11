import { updateState, getState } from "./state.js";
import { formatNumber } from "./main.js";

// Skapar HTML i #resultFörsäljning och sätter upp event-lyssnare
document.addEventListener("DOMContentLoaded", () => {
  const resultContainer = document.getElementById("resultFörsäljning");
  if (!resultContainer) return;

  // Infoga minimal HTML
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

  // Hämta element
  const nuvardeEl       = document.getElementById("nuvarde");
  const daligtNuvardeEl = document.getElementById("daligtNuvarde");
  const multipelEl      = document.getElementById("multipel");
  const multipelValueEl = document.getElementById("multipelValue");
  const betalaHuslanEl  = document.getElementById("betalaHuslan");
  const exitResultEl    = document.getElementById("exitResult");

  // Event: Växla dåligt värde
  daligtNuvardeEl.addEventListener("change", () => {
    const nyttVarde = daligtNuvardeEl.checked ? 3000000 : getState("startVarde");
    updateState("startVarde", nyttVarde);
    nuvardeEl.textContent = formatNumber(nyttVarde);
    uppdateraBeräkningar();
  });

  // Event: Multipelslider
  multipelEl.addEventListener("input", () => {
    multipelValueEl.textContent = parseFloat(multipelEl.value).toFixed(1);
    uppdateraBeräkningar();
  });

  // Event: Huslånecheckbox
  betalaHuslanEl.addEventListener("change", uppdateraBeräkningar);

  // Initiera sidladdning
  nuvardeEl.textContent = formatNumber(getState("startVarde") || 0);
  multipelValueEl.textContent = multipelEl.value;
  uppdateraBeräkningar();
});

// Exporterad funktion så att andra filer kan anropa den
export function uppdateraBeräkningar() {
  const multipel = parseFloat(document.getElementById("multipel").value) || 1;
  const startVarde = getState("startVarde") || 0;
  const huslan = getState("huslan") || 0;

  // Hämta skattesatser/gränsvärde från state eller hårdkoda (justera som du vill)
  const skattLåg   = getState("skattUtdelningLåg") || 0.20;
  const skattHög   = getState("skattUtdelningHög") || 0.50;
  const gransvarde = getState("belopp312") || 684166;

  const forsaljningspris = startVarde * multipel;
  let exitKapital = forsaljningspris;

  const nettoLåg = gransvarde * (1 - skattLåg);
  const lanEfterLåg = huslan - nettoLåg;
  const bruttoHögBehov = lanEfterLåg > 0 ? lanEfterLåg / (1 - skattHög) : 0;
  const totaltBruttoFörLån = gransvarde + bruttoHögBehov;

  const betalaHuslan = document.getElementById("betalaHuslan").checked;
  if (betalaHuslan) {
    exitKapital = forsaljningspris - totaltBruttoFörLån;
    if (exitKapital < 0) exitKapital = 0;
  }

  updateState("exitVarde", exitKapital);

  // Skriv ut
  const exitResultEl = document.getElementById("exitResult");
  if (exitResultEl) {
    exitResultEl.innerHTML = `
      <p><strong>${betalaHuslan ? "Exitbelopp efter huslånsbetalning 🏡" : "Exitbelopp"}</strong></p>
      <p>${formatNumber(exitKapital)}</p>
      ${betalaHuslan ? `
        <p>Huslån: ${formatNumber(huslan)}</p>
        <p><strong>Bruttobelopp för lån:</strong> ${formatNumber(totaltBruttoFörLån)}</p>
        <p>- ${formatNumber(gransvarde)} (20%): → Netto: ${formatNumber(nettoLåg)}</p>
        <p>- Resterande (50%): ${formatNumber(bruttoHögBehov)} → Netto: ${formatNumber(lanEfterLåg > 0 ? lanEfterLåg : 0)}</p>
      ` : ""}
    `;
  }
}
