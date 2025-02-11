import { getState } from "./state.js";
import { formatNumber } from "./main.js"; // ✅ Importera formateringsfunktionen

function beräknaInvestering() {
    let avkastningProcent = parseInt(document.getElementById("avkastning").value, 10);
    document.getElementById("avkastningValue").textContent = avkastningProcent + "%";
    
    let avkastning = avkastningProcent / 100;
    let exitKapital = getState("exitVarde") || 0;
    let totalAvkastning = exitKapital * avkastning; // ✅ Bruttobelopp för investering

    let skattLåg = 0.20;
    let skattHög = 0.50;
    let gränsvärde312 = 684166; // ✅ Gränsvärde för 20% skatt

    // ✅ Beräkna belopp som beskattas med 20% och 50%
    let bruttoLåg = Math.min(totalAvkastning, gränsvärde312);
    let bruttoHög = totalAvkastning > gränsvärde312 ? totalAvkastning - gränsvärde312 : 0;
    let nettoLåg = bruttoLåg * (1 - skattLåg);
    let nettoHög = bruttoHög * (1 - skattHög);
    let totaltNetto = nettoLåg + nettoHög;

    // ✅ Uträkning av skillnad vid huslånsbetalning
    let betalaHuslan = document.getElementById("betalaHuslan").checked;
    let totalAvkastningUtanLån = (exitKapital + (betalaHuslan ? getState("huslan") : 0)) * avkastning;
    let bruttoLågUtanLån = Math.min(totalAvkastningUtanLån, gränsvärde312);
    let bruttoHögUtanLån = totalAvkastningUtanLån > gränsvärde312 ? totalAvkastningUtanLån - gränsvärde312 : 0;
    let nettoLågUtanLån = bruttoLågUtanLån * (1 - skattLåg);
    let nettoHögUtanLån = bruttoHögUtanLån * (1 - skattHög);
    let totaltNettoUtanLån = nettoLågUtanLån + nettoHögUtanLån;
    let skillnad = totaltNettoUtanLån - totaltNetto;

    // ✅ Uppdatera HTML med investeringsvärden
    document.getElementById("brutto").textContent = formatNumber(totalAvkastning);
    document.getElementById("inomGransvardeBrutto").textContent = formatNumber(bruttoLåg);
    document.getElementById("inomGransvardeNetto").textContent = formatNumber(nettoLåg);
    document.getElementById("overGransvardeBrutto").textContent = formatNumber(bruttoHög);
    document.getElementById("overGransvardeNetto").textContent = formatNumber(nettoHög);
    document.getElementById("totaltNetto").textContent = formatNumber(totaltNetto);

    // ✅ Visa skillnad om huslånet betalas
    if (betalaHuslan) {
        document.getElementById("resultInvestera").innerHTML += `
            <p><strong>Utan att betala huslån:</strong> ${formatNumber(totaltNettoUtanLån)}</p>
            <p><strong>Skillnad:</strong> ${formatNumber(skillnad)}</p>
        `;
    }
}

// ✅ Lägg till event listener när DOM laddats
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("avkastning").addEventListener("input", beräknaInvestering);
});

export { beräknaInvestering };
