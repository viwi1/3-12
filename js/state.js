/* state.js */

// Ett gemensamt objekt som lagrar våra variabler
const State = {
    // Ursprungligt bolagsvärde (utan multipel)
    startVarde: 6855837,

    // Huslån
    huslan: 2020500,

    // Uppdateras av exitberakning.js efter multipel och ev. huslåneavdrag
    exitVarde: 0,

    // För framtida bruk, t.ex. om du vill lagra utdelningsberäkning
    nettoAvkastning: 0
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

// Exporterar för att kunna användas i andra moduler
export { State, updateState, getState };
