// 🎯 State-objektet
const State = {
    betalaHuslan: false,
    exitVarde: 0,
    spara312: 684166, 
    belopp312: 221650,
    skattUtdelningLåg: 0.20,
    skattUtdelningHög: 0.50,
    totaltNetto: 0, // 🔹 Observerad variabel
};

// 🔍 **Event listeners för state-ändringar**
const observers = {};

// 🎯 Uppdatera en variabel i state och meddela observers
function updateState(key, value) {
    if (State.hasOwnProperty(key)) {
        State[key] = value;
        console.log(`🔄 [State] Uppdaterar ${key}:`, value);

        // 🔥 Notifiera eventlyssnare om värdet ändras
        if (observers[key]) {
            observers[key].forEach(callback => callback(value));
        }
    } else {
        console.warn(`⚠️ [Warning] Försökte uppdatera okänd state-nyckel: '${key}'`);
    }
}

// 🎯 Lägg till en eventlyssnare på en state-variabel
function onStateChange(key, callback) {
    if (!observers[key]) {
        observers[key] = [];
    }
    observers[key].push(callback);
}

// 🎯 Hämta en variabel från state
function getState(key) {
    return State.hasOwnProperty(key) ? State[key] : null;
}

// ✅ Exportera funktionerna
export { State, updateState, getState, onStateChange };
