// 🎯 Ett gemensamt objekt som lagrar våra variabler
const State = {
    // 🔹 Ursprungligt bolagsvärde (utan multipel)
    startVarde: 6855837,

    // 🔹 Huslån
    huslan: 2020500,

    // 🔹 Exitvärde uppdateras efter multipel & huslåneavdrag
    exitVarde: 0,

    // 🔹 Bruttobelopp för lån (räknas fram i exitberakning.js)
    totaltBruttoForLan: 0,

    // 🔹 Nettoavkastning från utdelningsberäkning
    nettoAvkastning: 0,

    // 🔹 Bruttoavkastning innan skatt
    bruttoAvkastning: 0,

    // 🔹 Totalt utdelningsbelopp efter skatt
    nettoUtdelning: 0,

    // 🔹 Inkomstbasbelopp (används för 3:12-beräkning)
    ibb: 80600,

    // 🔹 3:12-gränsbelopp (beräknas som IBB * 2.75)
    get belopp312() {
        return this.ibb * 2.75;
    },

    // 🔹 3:12-sparat belopp (default: 684166)
    sparat312: 684166,

    // 🔹 Skattesatser för utdelning (låg/hög beskattning)
    skattUtdelningLåg: 0.20,
    skattUtdelningHög: 0.50,

    // 🔹 Multipel (uppdateras av slider)
    multipel: 2.8,

    // 🔹 Huslåne-checkbox status (false = unchecked vid sidladdning)
    betalaHuslan: false
};

// ✅ Uppdaterar en enskild variabel i state
function updateState(key, value) {
    if (State.hasOwnProperty(key)) {
        State[key] = value;
    } else {
        console.warn(`⚠️  State-nyckeln '${key}' finns inte i State-objektet.`);
    }
}

// ✅ Hämtar en enskild variabel ur state
function getState(key) {
    return State.hasOwnProperty(key) ? State[key] : null;
}

// ✅ Exporterar för att kunna användas i andra moduler
export { State, updateState, getState };
