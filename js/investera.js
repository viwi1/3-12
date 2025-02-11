import { getState } from "./state.js";
import { formatNumber } from "./main.js"; // ✅ Importera formateringsfunktionen

function beräknaInvestering() {
    let avkastningProcent = parseInt(document.getElementById("avkastning").value, 10);
    document.getElementById("avkastningValue").textContent = avkastningProcent + "%";

    let avkastning = avkastningProcent / 100;
    let exitKapital = getState("exitVarde") || 0;
    let betalaHuslan = document.getElementById("betalaHuslan").checked;
    let huslan = getState("huslan") || 0;
    let multipel = parseFloat(document.getElementById("multipel").value) || 1;

    // ✅ Beräkna justerat investerat belopp (Exitkapital efter multipel och ev. huslån)
    let investeratBelopp = exitKapital * multipel;
    if (betalaHuslan) {
        investeratBelopp -= huslan; // Justera om huslån betalas av
    }

    // ✅ Bruttoavkastning på det investerade beloppet
    let totalAvkastning = investeratBelopp * avkastning;

    let skattLåg = 0.20;
    let skattHög = 0.50;
    let gränsvärde312 = 684166; // ✅ Gränsvärde för 20% skatt

    // ✅ Beräkna belopp som beskattas med 20% och 50%
    let bruttoLåg = Math.min(totalAvkastning, gränsvärde312);
    let bruttoHög = totalAvkastning > gränsvärde312 ? totalAvkastning - gränsvärde312 : 0;
    let nettoLåg = bruttoLåg * (1 - skattLåg);
    let nettoHög = bruttoHög * (1 - skattHög);
    let totaltNetto = nettoLåg + nettoHög;

    // ✅ Uppdatera HTML med investeringsvärden
    document.getElementById("resultInvestera").innerHTML = `
        <div class="box">
            <p class="result-title">Investera</p>
            <p><strong>Investerat belopp:</strong> ${formatNumber(investeratBelopp)}</p>
            <p>Brutto: ${formatNumber(totalAvkastning)}</p>
            <p>Inom gränsvärde (20% skatt): ${formatNumber(bruttoLåg)} → Netto: ${formatNumber(nettoLåg)}</p>
            <p>Över gränsvärde (50% skatt): ${formatNumber(bruttoHög)} → Netto: ${formatNumber(nettoHög)}</p>
            <p><strong>Totalt netto utdelning:</strong> ${formatNumber(totaltNetto)}</p>
        </div>
    `;
}

// ✅ Kör funktionen direkt vid sidladdning
document.addEventListener("DOMContentLoaded", function () {
    beräknaInvestering(); // 🔥 Kör direkt
    document.getElementById("avkastning").addEventListener("input", beräknaInvestering);
    document.getElementById("betalaHuslan").addEventListener("change", beräknaInvestering);
    document.getElementById("multipel").addEventListener("input", beräknaInvestering);
});

export { beräknaInvestering };
