const State = {
    exitVarde: 6855837,  // Standardvärde på bolaget
    huslan: 2020500,  // Standard huslån
    nettoAvkastning: 0 // Nettoavkastning från utdelningsberäkning
};

function updateState(key, value) {
    if (State.hasOwnProperty(key)) {
        State[key] = value;
    } else {
        console.warn(`State-nyckeln '${key}' finns inte.`);
    }
}

function getState(key) {
    return State.hasOwnProperty(key) ? State[key] : null;
}

export { State, updateState, getState };
