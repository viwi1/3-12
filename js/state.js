/* state.js */

// Ett gemensamt objekt som lagrar våra variabler
const State = {
    // 🔹 Ursprungligt bolagsvärde (utan multipel)
    startVarde: 6855837,

    // 🔹 Huslån
    huslan: 2020500,

    // 🔹 Exitvärde uppdateras efter multipel & huslåneavdrag
    exitVarde: 0,

    // 🔹 Bruttobelopp för lån (räknas fram i exitberäkning.js)
    totaltBruttoFörLån: 0,

    // 🔹 Exitvärde efter försäljning och beskattning
    exitVardeEfterSkatt: 0,

    // 🔹 Nettoavkastning från utdelningsberäkning
    nettoAvkastning: 0,

    // 🔹 Bruttoavkastning innan skatt
    bruttoAvkastning: 0,

    // 🔹 Totalt utdelningsbelopp efter skatt
    nettoUtdelning: 0,

    // 🔹 Inkomstbasbelopp (används för 3:12-beräkning)
    ibb: 80600,

    // 🔹 3:12-gränsbelopp (beräknas som IBB * 2.75)
    get 312belopp() {
        return this.ibb * 2.75;
    },

    // 🔹 3:12-sparat belopp (default: 684166)
    312sparatbelopp: 684166,

    // 🔹 Skattesatser för utdelning (låg/hög beskattning)
    skattUtdelningLåg: 0.20,
    skattUtdelningHög: 0.50,

    // 🔹 Aktuell procentsats för avkastning (kopplad till slider)
    avkastningProcent: 10
};

// Uppdaterar en enskild variabel i state
function updateState(key, value) {
    if (State.hasOwnProperty(key)) {
        State[key] = value;
    } else {
        console.warn(`⚠️  State-nyckeln '${key}' finns inte i State-objektet.`);
    }
}

// Hämtar en enskild variabel ur state
function getState(key) {
    return State.hasOwnProperty(key) ? State[key] : null;
}

// Exporterar för att kunna användas i andra moduler
export { State, updateState, getState };
