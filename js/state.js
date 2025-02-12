// 🎯 State-objektet
const State = {
    // 🔹 Om huslånet ska betalas vid exit
    betalaHuslan: false,

    // 🔹 Exitvärde efter multipel och ev. huslånsavdrag
    exitVarde: 0,

    // 🔹 Sparat 3:12-belopp för huslånebetalning
    spara312: 684166, 
    
    // 🔹 Årligt 3:12-belopp för utdelning
    belopp312: 221650, 

    // 🔹 Skattesatser för utdelning
    skattUtdelningLåg: 0.20,
    skattUtdelningHög: 0.50,

    // 🔹 Totalt netto utdelning från investeringsmodulen
    totaltNetto: 0
};

// 🎯 Uppdaterar en variabel i state
function updateState(key, value) {
    if (State.hasOwnProperty(key)) {
        State[key] = value;
    }
}

// 🎯 Hämtar en variabel från state
function getState(key) {
    return State.hasOwnProperty(key) ? State[key] : null;
}

// 🎯 Exporterar funktionerna
export { State, updateState, getState };
