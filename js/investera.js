import { getState } from "./state.js";
import { formatNumber } from "./main.js";

function beräknaInvestering() {
    const investeratBeloppEl = document.getElementById("investeratBelopp");
    const avkastningEl = document.getElementById("avkastning");
    const avkastningValueEl = document.getElementById("avkastningValue");
    const bruttoEl = document.getElementById("brutto");
    const inomGransvardeBruttoEl = document.getElementById("inomGransvardeBrutto");
    const inomGransvardeNettoEl = document.getElementById("inomGransvardeNetto");
    const overGransvardeBruttoEl = document.getElementById("overGransvardeBrutto");
    const overGransvardeNettoEl = document.getElementById("overGransvardeNetto");
    const totaltNettoEl = document.getElementById("totaltNetto");

    if (!investeratBeloppEl) return; // 🔥 Stoppar felet om elementen saknas

    const avkastningProcent = parseInt(avkastningEl.value, 10);
    avkastningValueEl.textContent = avkastningProcent + "%";

    const avkastning = avkastningProcent / 100;
    const investeratBelopp = getState("exitVarde") || 0;

    const totalAvkastning = investeratBelopp * avkastning;

    const skattLåg = getState("skattUtdelningLåg");
    const skattHög = getState("skattUtdelningHög");
    const gränsvärde312 = getState("belopp312");

    const bruttoLåg = Math.min(totalAvkastning, gränsvärde312);
    const bruttoHög = totalAvkastning > gränsvärde312 ? totalAvkastning - gränsvärde312 : 0;
    const nettoLåg = bruttoLåg * (1 - skattLåg);
    const nettoHög = bruttoHög * (1 - skattHög);
    const totaltNetto = nettoLåg + nettoHög;

    investeratBeloppEl.textContent = formatNumber(investeratBelopp);
    bruttoEl.textContent = formatNumber(totalAvkastning);
    inomGransvardeBruttoEl.textContent = formatNumber(bruttoLåg);
    inomGransvardeNettoEl.textContent = formatNumber(nettoLåg);
    overGransvardeBruttoEl.textContent = formatNumber(bruttoHög);
    overGransvardeNettoEl.textContent = formatNumber(nettoHög);
    totaltNettoEl.textContent = formatNumber(totaltNetto);
}

// ✅ Flytta DOMContentLoaded utanför funktionen
document.addEventListener("DOMContentLoaded", () => {
    const resultContainer = document.getElementById("resultInvestera");
    if (!resultContainer) return;

    // 🎯 Generera UI direkt i DOM
    resultContainer.innerHTML = `
        <div class="box">
            <p class="result-title">Investera</p>
            <p><strong>Investerat belopp:</strong> <span id="investeratBelopp"></span></p>
            <div class="slider-container">
                <label for="avkastning">Avkastning (% per år):</label>
                <input type="range" id="avkastning" min="1" max="30" step="1" value="10">
                <span class="slider-value" id="avkastningValue">10%</span>
            </div>
            <p><strong>Totalt netto utdelning:</strong> <span id="totaltNetto" style="color: blue; font-weight: bold;"></span></p>
            <hr>
            <p>Brutto: <span id="brutto"></span></p>
            <p>
                Inom gränsvärde (20% skatt): 
                <span id="inomGransvardeBrutto"></span>
                → Netto: <span id="inomGransvardeNetto"></span>
            </p>
            <p>
                Över gränsvärde (50% skatt): 
                <span id="overGransvardeBrutto"></span>
                → Netto: <span id="overGransvardeNetto"></span>
            </p>
        </div>
    `;

    // ✅ Lägg till event listeners
    document.getElementById("avkastning").addEventListener("input", beräknaInvestering);
    document.getElementById("betalaHuslan").addEventListener("change", beräknaInvestering);
    document.getElementById("multipel").addEventListener("input", beräknaInvestering);

    // 🏗 Initiera beräkningar vid sidladdning
    beräknaInvestering();
});

export { beräknaInvestering };
