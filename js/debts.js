let debts = [];

let editingIndex = null;

function addDebt() {

const lender = document.getElementById("lender").value;
const balance = Number(document.getElementById("balance").value);
const apr = Number(document.getElementById("apr").value);
const limit = Number(document.getElementById("limit").value);
const minimum = Number(document.getElementById("minimum").value);

    if (!lender || balance <= 0 || apr < 0 || limit <= 0 || minimum <= 0) {

        alert("Please complete every field.");

        return;

    }

    const debt = {

    lender,

    balance,

    apr,

    limit,

    minimum

};

if (editingIndex === null) {

    debts.push(debt);

} else {

    debts[editingIndex] = debt;

    editingIndex = null;

    document.getElementById("addDebtButton").textContent = "Add Debt";

}

saveDebts();

renderDebts();

updateSummary();

clearForm();
}

function deleteDebt(index) {

    debts.splice(index, 1);

    renderDebts();

    updateSummary();

    saveDebts();

}

function editDebt(index) {

    const debt = debts[index];

    document.getElementById("lender").value = debt.lender;
    document.getElementById("balance").value = debt.balance;
    document.getElementById("apr").value = debt.apr;
    document.getElementById("limit").value = debt.limit;
    document.getElementById("minimum").value = debt.minimum;

    editingIndex = index;
    document.getElementById("addDebtButton").textContent = "Save Changes";

}