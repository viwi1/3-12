import { getState } from "./state.js";
import { formatNumber } from "./main.js"; // ✅ Importera formateringsfunktionen

function beräknaInvestering() {
    let avkastningProcent = parseInt(document.getElementById("avkastning").value, 10);
    document.getElementById("avkastningValue").textContent = avkastningProcent + "%";

    let avkastning = avkastningProcent / 100;
    let justeratExitKapital = getState("exitVarde") || 0;  // ✅ Hämta justerat exitkapital
    let betalaHuslan = document.getElementById("betalaHuslan").checked;
    let huslan = getState("huslan") || 0;
    let multipel = parseFloat(document.getElementById("multipel").value) || 1;

    // ✅ Beräkna investerat belopp baserat på justerat exitkapital
    let investeratBelopp = justeratExitKapital * multipel;
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

    // ✅ Uppdatera **endast siffrorna** istället för att skriva om hela boxen
    document.getElementById("investeratBelopp").textContent = formatNumber(investeratBelopp);
    document.getElementById("brutto").textContent = formatNumber(totalAvkastning);
    document.getElementById("inomGransvardeBrutto").textContent = formatNumber(bruttoLåg);
    document.getElementById("inomGransvardeNetto").textContent = formatNumber(nettoLåg);
    document.getElementById("overGransvardeBrutto").textContent = formatNumber(bruttoHög);
    document.getElementById("overGransvardeNetto").textContent = formatNumber(nettoHög);
    document.getElementById("totaltNetto").textContent = formatNumber(totaltNetto);
}

// ✅ Kör funktionen direkt vid sidladdning
document.addEventListener("DOMContentLoaded", function () {
    // ✅ Säkerställ att alla element finns innan event listeners läggs till
    if (document.getElementById("avkastning")) {
        beräknaInvestering(); // 🔥 Kör direkt
        document.getElementById("avkastning").addEventListener("input", beräknaInvestering);
        document.getElementById("betalaHuslan").addEventListener("change", beräknaInvestering);
        document.getElementById("multipel").addEventListener("input", beräknaInvestering);
    }
});

export { beräknaInvestering };
