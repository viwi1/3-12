import { updateState, getState } from "./state.js";
import { uppdateraBeräkningar } from "./exitberakning.js";

/**
 * Formatterar ett nummer till svensk valutaformatering
 * @param {number} num - Nummer som ska formatteras
 * @returns {string} - Formaterat nummer (ex: 1 234 567 kr)
 */
function formatNumber(num) {
    return Math.round(num).toLocaleString("sv-SE") + " kr";
}

/**
 * Hanterar öppning och stängning av kollapsbara moduler
 * @param {string} modulId - ID för modulen som ska togglas
 */
function toggleModule(modulId) {
    const modul = document.getElementById(modulId);
    if (!modul) return;

    const stangd = modul.querySelector(".stangd-lage");
    const oppnad = modul.querySelector(".oppnad-lage");
    const isOpen = oppnad.style.display === "block";

    if (!isOpen) {
        stangd.style.display = "none";
        oppnad.style.display = "block";
    } else {
        oppnad.style.display = "none";
        stangd.style.display = "flex";
    }
}

/**
 * Initierar kollapsbara moduler vid sidladdning
 * - Kopierar rubrik från öppen del till stängd del
 * - Säkerställer att alla moduler startar i stängt läge
 */
function initKollapsbaraModuler() {
    document.querySelectorAll(".kollapsbar-modul").forEach(modul => {
        const rubrikOpen = modul.querySelector(".oppnad-rubrik").textContent;
        modul.querySelector(".stangd-rubrik").textContent = rubrikOpen;
        modul.querySelector(".oppnad-lage").style.display = "none";
        modul.querySelector(".stangd-lage").style.display = "flex";
    });
}

// 🚀 Kör vid sidladdning
document.addEventListener("DOMContentLoaded", () => {
    initKollapsbaraModuler();
    
    if (typeof uppdateraBeräkningar === "function") {
        uppdateraBeräkningar();
    }
});

// ✅ Exportera funktioner
export { formatNumber };
window.toggleModule = toggleModule; // Gör globalt tillgänglig för HTML
