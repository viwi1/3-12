import { formatNumber } from "./main.js";

// 🎯 Standardutgifter (med lån och amortering kombinerade)
let expenses = [
    { name: "BRF Avgift", value: 95580 },
    { name: "Hemförsäkring Dina försäkringar", value: 3420 },
    { name: "Fritids och förskola", value: 28524 },
    { name: "El vattenfall Elnät", value: 12726 },
    { name: "El Tibber", value: 6252 },
    { name: "Flexen", value: 196442 },
    { name: "Klarna - presenter och skoj", value: 60000 },
    { name: "Resa", value: 100000 },
    { name: "Lån och amortering", value: 115245 },
    { name: "Lån och amortering CSN", value: 8748 }
];

// 🎯 Exponent för boost-modellen
const alpha = 1;

// 🎯 Allokeringsfunktion
function allocateIncome(income) {
    let n = expenses.length;
    let totalCost = expenses.reduce((sum, item) => sum + item.value, 0);

    if (income <= 0) return Array(n).fill(0);
    if (income >= totalCost) return expenses.map(item => item.value);

    let r = income / totalCost;
    let E_max = Math.max(...expenses.map(e => e.value));
    let boosts = expenses.map(e => Math.pow(E_max / e.value, alpha));
    let U = expenses.map((e, i) => e.value * r * boosts[i]);
    let S = U.reduce((sum, u) => sum + u, 0);
    
    if (S === 0) return Array(n).fill(0);
    
    return U.map(u => u * (income / S));
}

// 🎯 Uppdatera utgifter i UI
function updateExpenses(income) {
    document.getElementById('income-display').textContent = formatNumber(income);
    document.getElementById('totalIncome').textContent = formatNumber(income);

    let totalCost = expenses.reduce((sum, item) => sum + item.value, 0);
    document.getElementById('totalCost').textContent = formatNumber(totalCost);
    
    let coverage = totalCost > 0 ? (income / totalCost) * 100 : 0;
    document.getElementById('coverage').textContent = Math.round(coverage) + '%';

    let allocated = allocateIncome(income);
    
    expenses.forEach((entry, index) => {
        let fillPercentage = (allocated[index] / entry.value) * 100;
        fillPercentage = isNaN(fillPercentage) ? 0 : Math.min(fillPercentage, 100);

        let allocatedMonthly = allocated[index] / 12;
        let expenseMonthly = entry.value / 12;
        
        document.getElementById(`bar${index}`).style.width = fillPercentage + "%";
        document.getElementById(`bar${index}-info`).textContent =
            Math.round(fillPercentage) + "% | " +
            formatNumber(allocated[index]) + " (" + formatNumber(allocatedMonthly) +
            " / mån) av " + formatNumber(entry.value) + " (" + formatNumber(expenseMonthly) + " / mån)";
    });
}

// 🎯 Skapa UI för utgifter
function createExpensesUI() {
    let expensesContainer = document.getElementById("expenses");
    
    expenses.forEach((expense, index) => {
        let inputGroup = document.createElement("div");
        inputGroup.className = "input-group";
        inputGroup.innerHTML = `
            <label>${expense.name}:</label>
            <input type="number" id="cost${index}" value="${expense.value}" oninput="updateBars()">
        `;
        expensesContainer.appendChild(inputGroup);

        let barContainer = document.createElement("div");
        barContainer.className = "bar-container";
        barContainer.innerHTML = `<div class="bar" id="bar${index}"></div>`;
        expensesContainer.appendChild(barContainer);

        let barInfo = document.createElement("div");
        barInfo.className = "bar-info";
        barInfo.id = `bar${index}-info`;
        barInfo.textContent = `0% | 0 kr (0 kr/mån) av ${formatNumber(expense.value)} (${formatNumber(expense.value/12)}/ mån)`;
        expensesContainer.appendChild(barInfo);
    });

    // 🔄 Initiera första uppdateringen
    updateExpenses(0);
}

// 🎯 Exportera funktioner
export { createExpensesUI, updateExpenses };
