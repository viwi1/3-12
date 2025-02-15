import { updateState, getState } from "./state.js";
import { uppdateraBeräkningar } from "./exitberakning.js";

function formatNumber(num) {
    return Math.round(num).toLocaleString("sv-SE") + " kr";
}
export { formatNumber };

document.addEventListener("DOMContentLoaded", function () {
    if (typeof uppdateraBeräkningar === "function") {
        uppdateraBeräkningar();
    }

    // 🔹 Initiera alla kollapsbara moduler
    initKollapsbaraModuler();
});

/**
 * 🔹 Hanterar kollapsbara moduler
 */
function toggleModule(modulId) {
    const stangd = document.getElementById(modulId + '-stangd');
    const oppnad = document.getElementById(modulId + '-oppnad');
    const isOpen = oppnad.style.display === 'block';

    if (!isOpen) {
        // Öppna modulen
        stangd.style.display = 'none';
        oppnad.style.display = 'block';
    } else {
        // Stäng modulen
        oppnad.style.display = 'none';
        stangd.style.display = 'block';
    }
}

/**
 * 🔹 Initierar kollapsbara moduler vid sidladdning
 */
function initKollapsbaraModuler() {
    const moduler = document.querySelectorAll(".kollapsbar-modul");
    moduler.forEach(modul => {
        const modulId = modul.id;
        const rubrikOpen = modul.querySelector(".oppnad-rubrik").textContent;
        modul.querySelector(".stangd-rubrik").textContent = rubrikOpen;

        // Se till att modulerna är stängda vid sidladdning
        document.getElementById(modulId + '-oppnad').style.display = 'none';
        document.getElementById(modulId + '-stangd').style.display = 'block';
    });
}

// Exportera toggleModule om den ska användas externt
export { toggleModule, initKollapsbaraModuler };
