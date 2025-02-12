document.addEventListener("DOMContentLoaded", () => {
    // 🎯 Direkt definierade värden i `exitberakning.js`
    let startVarde = 6855837;
    const START_VARDE_DALIGT = 3000000;
    const HUSLAN = 2020500;

    // 🎯 Hämta element
    const nuvardeEl = document.getElementById("nuvarde");
    const daligtNuvardeEl = document.getElementById("daligtNuvarde");
    const multipelEl = document.getElementById("multipel");
    const multipelValueEl = document.getElementById("multipelValue");
    const betalaHuslanEl = document.getElementById("betalaHuslan");
    const exitTitleEl = document.getElementById("exitTitle");
    const exitBeloppEl = document.getElementById("exitBelopp");
    const huslanDetaljerEl = document.getElementById("huslanDetaljer");

    // ✅ Sätt startvärde direkt vid sidladdning
    nuvardeEl.textContent = formatNumber(startVarde);

    function uppdateraBeräkningar() {
        const multipel = parseFloat(multipelEl.value) || 1;
        const skattLåg = 0.20;
        const skattHög = 0.50;
        const belopp312 = 684166;

        // 🔹 Kontrollera om användaren valt "Dåligt startvärde"
        startVarde = daligtNuvardeEl.checked ? START_VARDE_DALIGT : 6855837;
        nuvardeEl.textContent = formatNumber(startVarde);

        // 🔹 Beräkna försäljningspris baserat på startvärde och multipel
        let forsPris = startVarde * multipel;
        let exitKapital = forsPris;

        // 🔹 Räkna ut skatt & lån
        let nettoLåg = belopp312 * (1 - skattLåg);
        let lanEfterLågSkatt = HUSLAN - nettoLåg;
        let bruttoHögBehov = lanEfterLågSkatt > 0 ? lanEfterLågSkatt / (1 - skattHög) : 0;
        let totaltBruttoForLan = belopp312 + bruttoHögBehov;

        if (betalaHuslanEl.checked) {
            exitKapital -= totaltBruttoForLan;
        }

        // ✅ Uppdatera UI
        exitTitleEl.textContent = betalaHuslanEl.checked
            ? "Exitbelopp efter huslånsbetalning 🏡"
            : "Exitbelopp";
        exitBeloppEl.textContent = formatNumber(exitKapital);

        huslanDetaljerEl.innerHTML = betalaHuslanEl.checked
            ? `
            <p>Huslån: ${formatNumber(HUSLAN)}</p>
            <p><strong>Bruttobelopp för lån:</strong> ${formatNumber(totaltBruttoForLan)}</p>
            <p>- ${formatNumber(belopp312)} (20% skatt) → Netto: ${formatNumber(nettoLåg)}</p>
            <p>- Resterande (50% skatt): ${formatNumber(bruttoHögBehov)} → Netto: ${formatNumber(lanEfterLågSkatt > 0 ? lanEfterLågSkatt : 0)}</p>
            `
            : "";
    }

    // ✅ Lägg till event listeners
    multipelEl.addEventListener("input", () => {
        multipelValueEl.textContent = parseFloat(multipelEl.value).toFixed(1);
        uppdateraBeräkningar();
    });

    betalaHuslanEl.addEventListener("change", uppdateraBeräkningar);
    
    daligtNuvardeEl.addEventListener("change", () => {
        startVarde = daligtNuvardeEl.checked ? START_VARDE_DALIGT : 6855837;
        nuvardeEl.textContent = formatNumber(startVarde);
        uppdateraBeräkningar();
    });

    // ✅ Initiera beräkningar vid sidladdning
    multipelValueEl.textContent = multipelEl.value;
    betalaHuslanEl.checked = true; // ✅ Huslån är CHECKED som default
    uppdateraBeräkningar();
});
