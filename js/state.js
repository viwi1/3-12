/* state.js */

// Ett gemensamt objekt som lagrar våra variabler
const State = {
    // Ursprungligt bolagsvärde (utan multipel)
    startVarde: 6855837,

    // Huslån
    huslan: 2020500,

    // Exitvärde efter multipel & huslåneavdrag
    exitVarde: 0,

    // Visar om huslån ska betalas av (checkbox)
    betalaHuslan: true,

    // Skattesatser för utdelning
    skattUtdelningLåg: 0.20,
    skattUtdelningHög: 0.50,

    // 3:12-belopp för låg skatt
    belopp312: 684166,

    // Exempel på sparat belopp för framtida utdelning
    sparatbelopp312: 684166
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

export { State, updateState, getState };
