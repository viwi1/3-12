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

// 🎯 Event listeners för state-ändringar
const observers = {};

/**
 * Uppdaterar en variabel i `State` och meddelar eventuella lyssnare
 * @param {string} key - Nyckeln i State som ska uppdateras
 * @param {any} value - Värdet som ska sättas
 */
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

/**
 * Lägger till en eventlyssnare för en specifik state-variabel
 * @param {string} key - State-nyckeln man vill lyssna på
 * @param {function} callback - Funktionen som körs när `key` uppdateras
 */
function onStateChange(key, callback) {
    if (!observers[key]) {
        observers[key] = [];
    }
    observers[key].push(callback);
}

/**
 * Hämtar en variabel ur `State`
 * @param {string} key - Nyckeln du vill hämta
 * @returns {any} Värdet från `State` eller `null` om nyckeln saknas
 */
function getState(key) {
    return State.hasOwnProperty(key) ? State[key] : null;
}

// ✅ Exportera funktionerna
export { State, updateState, getState, onStateChange };
