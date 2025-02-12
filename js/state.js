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

console.log(getState("totaltNetto"));


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

utgifter.js:20 🔍 [Debug] Hämtar 'totaltNetto' från state.js: 0
utgifter.js:24  ⚠️ [Warning] Inkomst saknas i state, sätter till standardvärde: 100000
(anonymous) @ utgifter.js:24
investera.js:46 🚀 [Debug] Uppdaterar state: totaltNetto = 913345.5300000001
utgifter.js:36 ✅ [Debug] 'expenses' container hittad, bygger UI...
utgifter.js:89 🔄 [Debug] Uppdaterar utgifter med inkomst: 100000
favicon.ico:1 
            
            
            GET http://viktorwilson.se/favicon.ico 404 (Not Found)
// 🎯 Exporterar funktionerna
export { State, updateState, getState };
