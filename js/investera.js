import { getState, updateState, onStateChange } from "./state.js";
import { formatNumber } from "./main.js";

// 🔹 Hämta lagrat 3:12-belopp från state
let belopp312 = getState("belopp312") || 221650;

/**
 * Beräknar investeringsutdelning och uppdaterar UI + state
 */
function beräknaInvestering() {
    const investeratBeloppEl = document.getElementById("investeratBelopp");
    const avkastningEl = document.getElementById("avkastning");
    const avkastningValueEl = document.getElementById("avkastningValue");
    const totaltNettoEl = document.getElementById("totaltNetto");
    const bruttoEl = document.getElementById("brutto");
    const inomGransvardeBruttoEl = document.getElementById("belopp312Value");
    const inomGransvardeNettoEl = document.getElementById("inomGransvardeNetto");
    const overGransvardeBruttoEl = document.getElementById("overGransvardeBrutto");
    const overGransvardeNettoEl = document.getElementById("overGransvardeNetto");

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
    bruttoEl.textContent = formatNumber(totalAvkastning);
    inomGransvardeBruttoEl.textContent = formatNumber(belopp312);
    inomGransvardeNettoEl.textContent = formatNumber(nettoLåg);
    overGransvardeBruttoEl.textContent = formatNumber(bruttoHög);
    overGransvardeNettoEl.textContent = formatNumber(nettoHög);
    totaltNettoEl.textContent = formatNumber(totaltNetto);

    // 🔥 Uppdatera state (så att utgifter.js får rätt inkomstvärde)
    updateState("totaltNetto", totaltNetto);
}

/**
 * Öppnar popup för att ändra belopp312
 */
function öppnaPopupBelopp312() {
    let nyttBelopp312 = prompt("Ange nytt 3:12-belopp:", belopp312);
    if (nyttBelopp312 !== null) {
        belopp312 = parseInt(nyttBelopp312, 10) || belopp312;
        updateState("belopp312", belopp312);
        beräknaInvestering();
    }
}

// 🔹 Lyssna på förändringar i exitVarde och uppdatera UI
onStateChange("exitVarde", (nyttExitVarde) => {
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
        <div class="container">
            <p class="result-title">Investera</p>
            <p><strong>Investerat belopp:</strong> <span id="investeratBelopp"></span></p>
            <div class="slider-container">
                <label for="avkastning">Avkastning (% per år):</label>
                <input type="range" id="avkastning" min="1" max="30" step="1" value="10">
                <span class="slider-value" id="avkastningValue">10%</span>
            </div>
            <p><strong>Totalt netto utdelning:</strong> <span id="totaltNetto" style="color: green; font-weight: bold;"></span></p>
            <hr>
            <p>Brutto: <span id="brutto"></span></p>
            <p>
                <span id="belopp312Value" style="cursor:pointer; text-decoration:underline;">${formatNumber(belopp312)}</span> (20% skatt) → 
                Netto: <span id="inomGransvardeNetto"></span>
            </p>
            <p>
                Över gränsvärde (50% skatt): 
                <span id="overGransvardeBrutto"></span>
                → Netto: <span id="overGransvardeNetto"></span>
            </p>
        </div>
    `;

    // 🔹 Koppla event-lyssnare
    document.getElementById("avkastning").addEventListener("input", beräknaInvestering);
    document.getElementById("belopp312Value").addEventListener("click", öppnaPopupBelopp312);

    // 🔹 Gör en första beräkning
    beräknaInvestering();
});

// ✅ Exportera funktionen
export { beräknaInvestering };
