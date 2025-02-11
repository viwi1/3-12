import { getState } from "./state.js";
import { formatNumber } from "./main.js";

function beräknaUtdelning() {
    let avkastningProcent = parseInt(document.getElementById("avkastning").value, 10);
    document.getElementById("avkastningValue").textContent = avkastningProcent + "%";
    
    let avkastning = avkastningProcent / 100;
    let exitKapital = getState("exitVarde") || 0;
    let totalAvkastning = exitKapital * avkastning; // ✅ Bruttobelopp för aktieutdelning

    let skattLåg = 0.20;
    let skattHög = 0.50;
    let gransvarde312 = 684166; // ✅ Gränsvärde för 20% skatt

    // ✅ Beräkna belopp som beskattas med 20% och 50%
    let bruttoLåg = Math.min(totalAvkastning, gransvarde312);
    let bruttoHög = totalAvkastning > gransvarde312 ? totalAvkastning - gransvarde312 : 0;
    let nettoLåg = bruttoLåg * (1 - skattLåg);
    let nettoHög = bruttoHög * (1 - skattHög);
    let totaltNetto = nettoLåg + nettoHög;

    // ✅ Uträkning av skillnad vid huslånsbetalning
    let betalaHuslan = document.getElementById("betalaHuslan").checked;
    let totalAvkastningUtanLån = (exitKapital + (betalaHuslan ? getState("huslan") : 0)) * avkastning;
    let bruttoLågUtanLån = Math.min(totalAvkastningUtanLån, gransvarde312);
    let bruttoHögUtanLån = totalAvkastningUtanLån > gransvarde312 ? totalAvkastningUtanLån - gransvarde312 : 0;
    let nettoLågUtanLån = bruttoLågUtanLån * (1 - skattLåg);
    let nettoHögUtanLån = bruttoHögUtanLån * (1 - skattHög);
    let totaltNettoUtanLån = nettoLågUtanLån + nettoHögUtanLån;
    let skillnad = totaltNettoUtanLån - totaltNetto;

    // ✅ Uppdatera HTML
    document.getElementById("resultAktieutdelning").innerHTML = `
        <div class="box">
            <p class="result-title">Aktieutdelning</p>
            <p>Brutto: ${formatNumber(totalAvkastning)}</p>
            <p>Inom gränsvärde (20% skatt): ${formatNumber(bruttoLåg)} → Netto: ${formatNumber(nettoLåg)}</p>
            <p>Över gränsvärde (50% skatt): ${formatNumber(bruttoHög)} → Netto: ${formatNumber(nettoHög)}</p>
            <p><strong>Totalt netto utdelning:</strong> ${formatNumber(totaltNetto)}</p>
            ${betalaHuslan ? `
            <p><strong>Utan att betala huslån:</strong> ${formatNumber(totaltNettoUtanLån)}</p>
            <p><strong>Skillnad:</strong> ${formatNumber(skillnad)}</p>
            ` : ""}
        </div>
    `;
}

// ✅ Lägg till event listener när DOM laddats
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("avkastning").addEventListener("input", beräknaUtdelning);
});

export { beräknaUtdelning };
