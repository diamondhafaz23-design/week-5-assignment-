// =========================================================================
// REQUIREMENT 2 & 3: STORE APPLICATION DATA & COLLECT USER INPUT
// =========================================================================

// Prompt the user for their monthly budget limit when the page first loads
let userInput = prompt("💰 Welcome to SpendWise! Please enter your Monthly Budget amount (KSh):", "20000");

let monthlyBudget = parseFloat(userInput);
if (isNaN(monthlyBudget) || monthlyBudget <= 0) {
    monthlyBudget = 20000.00; 
}

// Global baseline variables tracking application status mechanics
let currentTotalSpent = 1208.70;       
let totalTransactionsCount = 5;       
let primaryCurrencySymbol = "KSh ";
let isBudgetExceeded = false;

// =========================================================================
// REQUIREMENT 4 & 5: CREATE REUSABLE FUNCTIONS & FORMULAS
// =========================================================================

function calculateRemainingBalance(budget, spent) {
    return budget - spent;
}

function logDashboardMetrics() {
    let remaining = calculateRemainingBalance(monthlyBudget, currentTotalSpent);
    
    console.log("=== 📈 SPENDWISE FINANCIAL REPORT ===");
    console.log(`• Assigned Monthly Budget : ${primaryCurrencySymbol}${monthlyBudget.toFixed(2)}`);
    console.log(`• Accumulated Expenses    : ${primaryCurrencySymbol}${currentTotalSpent.toFixed(2)}`);
    console.log(`• Calculated Net Balance  : ${primaryCurrencySymbol}${remaining.toFixed(2)}`);
    console.log(`• Total Transactions Logged: ${totalTransactionsCount} items`);
    console.log(`• Budget Limit Exceeded?  : ${isBudgetExceeded ? "⚠️ YES" : "✅ NO"}`);
    console.log("=====================================");
}

// =========================================================================
// INTERACTIVE DASHBOARD VIEW INTERFACES
// =========================================================================

const submitButton = document.querySelector('.btn-primary');
const transactionTableBody = document.querySelector('.transaction-table tbody');
const totalSpentDisplay = document.querySelector('.value-total');
const countDisplay = document.querySelector('.value-count');

// Updates visual stats tiles and performs condition evaluations
function updateMetricsDisplay() {
    isBudgetExceeded = currentTotalSpent > monthlyBudget;

    // Refresh UI text indicators safely
    if (totalSpentDisplay) {
        totalSpentDisplay.textContent = `${primaryCurrencySymbol}${currentTotalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (countDisplay) {
        countDisplay.textContent = `${totalTransactionsCount} Items`;
    }

    logDashboardMetrics();
}

// Core form entry processing mechanism
function handleAddExpense() {
    const nameInput = document.getElementById('expense-name');
    const amountInput = document.getElementById('expense-amount');
    const categoryInput = document.getElementById('expense-category');
    const dateInput = document.getElementById('expense-date');

    const nameValue = nameInput.value.trim();
    const amountValue = parseFloat(amountInput.value);
    const categoryValue = categoryInput.value;
    const dateValue = dateInput.value;

    if (nameValue === "" || isNaN(amountValue) || dateValue === "") {
        alert("⚠️ Please fill out all input fields before adding an expense.");
        return;
    }

    currentTotalSpent += amountValue;
    totalTransactionsCount += 1;
    
    updateMetricsDisplay();

    // Create table row UI element dynamically
    const newRow = document.createElement('tr');
    const lowerCategory = categoryValue.toLowerCase();

    newRow.innerHTML = `
        <td>${nameValue}</td>
        <td>${primaryCurrencySymbol}${amountValue.toFixed(2)}</td>
        <td><span class="tag tag-${lowerCategory}">${categoryValue}</span></td>
        <td>${dateValue}</td>
        <td><button type="button" class="btn-delete" data-amount="${amountValue}">Delete</button></td>
    `;

    transactionTableBody.appendChild(newRow);

    nameInput.value = "";
    amountInput.value = "";
}

// Global Event Triggers
if (submitButton) {
    submitButton.addEventListener('click', handleAddExpense);
}

// Row clear interaction listener using Event Delegation
if (transactionTableBody) {
    transactionTableBody.addEventListener('click', function(event) {
        if (!event.target.classList.contains('btn-delete')) return;

        const targetButton = event.target;
        const amountAttr = targetButton.getAttribute('data-amount');
        
        let expenseAmount = parseFloat(amountAttr);
        if (isNaN(expenseAmount)) {
            const structuralRow = targetButton.closest('tr');
            const fallbackText = structuralRow.cells.textContent.replace(/[^0-9.]/g, '');
            expenseAmount = parseFloat(fallbackText) || 0;
        }

        currentTotalSpent = Math.max(0, currentTotalSpent - expenseAmount);
        totalTransactionsCount = Math.max(0, totalTransactionsCount - 1);
        
        updateMetricsDisplay();
        targetButton.closest('tr').remove();
    });
}

// Run initial layout setup on file load
updateMetricsDisplay();
