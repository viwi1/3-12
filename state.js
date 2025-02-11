// State.js - Hanterar gemensamma variabler och uppdateringar

const State = {
    exitVarde: 0,  // Exitkapital från exitberakning.js
    huslan: 0,  // Huslånsaldo från huslanmodul.js
    utgifter: 0  // Totala årliga utgifter från utgiftsmodul.js
};

// Funktion för att uppdatera state-variabler
function updateState(key, value) {
    if (State.hasOwnProperty(key)) {
        State[key] = value;
    } else {
        console.warn(`State-nyckeln '${key}' finns inte.`);
    }
}

// Funktion för att hämta en state-variabel
function getState(key) {
    return State.hasOwnProperty(key) ? State[key] : null;
}

// Exportera state-objektet och funktionerna
export { State, updateState, getState };
