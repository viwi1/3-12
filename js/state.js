const State = {
    betalaHuslan: false,
    exitVarde: 0,
    spara312: 684166, 
    belopp312: 221650,
    skattUtdelningLåg: 0.20,
    skattUtdelningHög: 0.50,
    totaltNetto: 0,  // 🔹 Observerad variabel
    observers: {} // 🔥 Nytt objekt för att lagra eventlyssnare
};

// 🎯 Uppdatera en variabel i state och meddela observers
function updateState(key, value) {
    if (State.hasOwnProperty(key)) {
        State[key] = value;
        console.log(`🔄 [State] Uppdaterar ${key}:`, value);

        // 🔥 Notifiera eventlyssnare
        if (State.observers[key]) {
            State.observers[key].forEach(callback => callback(value));
        }
    }
}

// 🎯 Lägg till en eventlyssnare på en state-variabel
function onStateChange(key, callback) {
    if (!State.observers[key]) {
        State.observers[key] = [];
    }
    State.observers[key].push(callback);
}

// 🎯 Hämta en variabel från state
function getState(key) {
    return State.hasOwnProperty(key) ? State[key] : null;
}

export { State, updateState, getState, onStateChange };
