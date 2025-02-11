const State = {
    exitVarde: 0,  // Exitkapital från exitberakning.js
    huslan: 2020500,  // Standard huslån
    nettoAvkastning: 0 // Nettoavkastning från utdelningsberäkning
};

// Uppdaterar en state-variabel
function updateState(key, value) {
    if (State.hasOwnProperty(key)) {
        State[key] = value;
    } else {
        console.warn(`State-nyckeln '${key}' finns inte.`);
    }
}

// Hämtar en state-variabel
function getState(key) {
    return State.hasOwnProperty(key) ? State[key] : null;
}

export { State, updateState, getState };
