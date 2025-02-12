import { getState, updateState, onStateChange } from "./state.js";
import { formatNumber } from "./main.js";

// 🔹 Hämta lagrat 3:12-belopp
let belopp312 = getState("belopp312") || 221650;

/**
 * Beräknar investeringsutdelning och uppdaterar UI + state
 */
function beräknaInvestering() {
    const investeratBeloppEl = document.getElementById("investeratBelopp");
    const avkastningEl = document.getElementById("avkastning");
    const avkastningValueEl = document.getElementById("avkastningValue");
    const totaltNettoEl = document.getElementById("totaltNetto");

    if (!investeratBeloppEl || !avkastningEl) return;

    // 🔹 Hämta exitVärde i realtid från state
    const investeratBelopp = getState("exitVarde") || 0;

    // 🔹 Hämta och visa avkastningens procentvärde
    const avkastningProcent = parseInt(avkastningEl.value, 10);
    avkastningValueEl.textContent = avkastningProcent + "%";

    // 🔹 Beräkna avkastningen
    const avkastning = avkastningProcent / 100;
    const totalAvkastning = investeratBelopp * avkastning;

    // 🔹 Hämta skattesatser och räkna ut fördelning låg/hög beskattning
    const skattLåg = getState("skattUtdelningLåg");
    const skattHög = getState("skattUtdelningHög");

    const bruttoLåg = Math.min(totalAvkastning, belopp312);
    const bruttoHög = totalAvkastning > belopp312 ? totalAvkastning - belopp312 : 0;
    const nettoLåg = bruttoLåg * (1 - skattLåg);
    const nettoHög = bruttoHög * (1 - skattHög);

    // 🔹 Totalt netto (efter skatt)
    const totaltNetto = nettoLåg + nettoHög;

    // 🔹 Uppdatera UI
    investeratBeloppEl.textContent = formatNumber(investeratBelopp);
    totaltNettoEl.textContent = formatNumber(totaltNetto);

    // 🔥 Uppdatera state (så att utgifter.js får rätt inkomstvärde)
    console.log("🚀 [Debug] Uppdaterar state med nytt totaltNetto:", totaltNetto);
    updateState("totaltNetto", totaltNetto);
}

// 🔹 Lyssna på förändringar i exitVarde och uppdatera UI
onStateChange("exitVarde", (nyttExitVarde) => {
    console.log("🔄 [Debug] `exitVarde` har uppdaterats:", nyttExitVarde);
    beräknaInvestering(); // 🔥 Kör om beräkningen när värdet ändras
});

/**
 * Vid sidladdning, bygg investerings-ui och koppla event-lyssnare
 */
document.addEventListener("DOMContentLoaded", () => {
    const resultContainer = document.getElementById("resultInvestera");
    if (!resultContainer) return;

    // 🔹 Dynamiskt skapa HTML
    resultContainer.innerHTML = `
        <div class="box">
            <p class="result-title">Investera</p>
            <p><strong>Investerat belopp:</strong> <span id="investeratBelopp"></span></p>
            <div class="slider-container">
                <label for="avkastning">Avkastning (% per år):</label>
                <input type="range" id="avkastning" min="1" max="30" step="1" value="10">
                <span class="slider-value" id="avkastningValue">10%</span>
            </div>
            <p><strong>Totalt netto utdelning:</strong> <span id="totaltNetto" style="color: green; font-weight: bold;"></span></p>
        </div>
    `;

    // 🔹 Koppla event-lyssnare
    document.getElementById("avkastning").addEventListener("input", beräknaInvestering);

    // 🔹 Gör en första beräkning
    beräknaInvestering();
});

// ✅ Exportera funktionen
export { beräknaInvestering };
