function toggleModule(modulId) {
    const stangd = document.getElementById(modulId + '-stangd');
    const oppnad = document.getElementById(modulId + '-oppnad');
    const isOpen = oppnad.style.display === 'block';

    if (!isOpen) {
        stangd.style.display = 'none';
        oppnad.style.display = 'block';
    } else {
        oppnad.style.display = 'none';
        stangd.style.display = 'block';
    }
}

// 🛠️ Se till att alla moduler får rätt rubrik vid sidladdning
function initKollapsbaraModuler() {
    document.querySelectorAll(".kollapsbar-modul").forEach(modul => {
        const rubrikOpen = modul.querySelector(".oppnad-rubrik").textContent;
        modul.querySelector(".stangd-rubrik").textContent = rubrikOpen;
        modul.querySelector(".oppnad-lage").style.display = "none";
        modul.querySelector(".stangd-lage").style.display = "flex";
    });
}

// 🚀 Kör vid sidladdning
document.addEventListener("DOMContentLoaded", initKollapsbaraModuler);

// ✅ Exportera funktionen så att HTML-filen kan anropa den
window.toggleModule = toggleModule;
