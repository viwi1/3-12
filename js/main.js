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
});
