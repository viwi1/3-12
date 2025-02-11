/* state.js */

// Ett gemensamt objekt som lagrar våra variabler
const State = {
    startVarde: 6855837,
    huslan: 2020500,
    exitVarde: 0,
    totaltBruttoFörLån: 0,
    exitVardeEfterSkatt: 0,
    nettoAvkastning: 0,
    bruttoAvkastning: 0,
    nettoUtdelning: 0,
    ibb: 80600,

    // Byt t.ex. till "belopp312" istället för "312belopp"
    get belopp312() {
        return this.ibb * 2.75;
    },

    // Byt ev. "312sparatbelopp" → "sparatbelopp312"
    sparatbelopp312: 684166,

    skattUtdelningLåg: 0.20,
    skattUtdelningHög: 0.50,
    avkastningProcent: 10
};

function updateState(key, value) {
    if (State.hasOwnProperty(key)) {
        State[key] = value;
    } else {
        console.warn(`⚠️  State-nyckeln '${key}' finns inte i State-objektet.`);
    }
}

function getState(key) {
    return State.hasOwnProperty(key) ? State[key] : null;
}

export { State, updateState, getState };
