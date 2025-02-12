// 🎯 State-objektet
const State = {
    // 🔹 Om huslånet ska betalas vid exit
    betalaHuslan: false,

    // 🔹 Exitvärde efter multipel och ev. huslånsavdrag
    exitVarde: 0,

    // 🔹 3:12-gränsbelopp (beräknas som IBB * 2.75)
    belopp312: 80600 * 2.75, 

    // 🔹 3:12-gränsbelopp (beräknas som IBB * 2.75)
    spara312: 684166, 
    
    // 🔹 Skattesatser för utdelning
    skattUtdelningLåg: 0.20,
    skattUtdelningHög: 0.50
};

// 🎯 Uppdaterar en variabel i state
function updateState(key, value) {
    if (State.hasOwnProperty(key)) {
        State[key] = value;
    } else {
        console.warn(`⚠️  State-nyckeln '${key}' finns inte.`);
    }
}

// 🎯 Hämtar en variabel från state
function getState(key) {
    return State.hasOwnProperty(key) ? State[key] : null;
}

// 🎯 Exporterar funktionerna
export { State, updateState, getState };
