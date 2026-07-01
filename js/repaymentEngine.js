/*
=========================================
Debt Manager Repayment Engine v0.4
=========================================
*/

function sortDebts(strategy, debts) {

    const sorted = debts.map(debt => ({ ...debt }));

    if (strategy === "avalanche") {

        sorted.sort((a, b) => b.apr - a.apr);

    } else {

        sorted.sort((a, b) => a.balance - b.balance);

    }

    return sorted;

}

function calculateMonthlyPayments(debts, budget) {

    const payments = [];

    let totalMinimums = 0;

    debts.forEach(debt => {

        totalMinimums += debt.minimum;

    });

    if (budget < totalMinimums) {

        return {

            success: false,

            message:
                `Your budget (£${budget.toFixed(2)}) is less than your minimum payments (£${totalMinimums.toFixed(2)}).`

        };

    }

    // Create payment objects

    debts.forEach(debt => {

        payments.push({

            lender: debt.lender,

            balance: debt.balance,

            minimum: debt.minimum,

            extra: 0,

            total: debt.minimum

        });

    });

    // Remaining money after minimums

    let remaining = budget - totalMinimums;

    // Roll remaining money through debts

    for (let i = 0; i < payments.length; i++) {

        if (remaining <= 0)
            break;

        const payment = payments[i];

        const debt = debts[i];

        const amountNeeded =
            debt.balance - payment.minimum;

        if (amountNeeded <= 0)
            continue;

        const extraToGive =
            Math.min(amountNeeded, remaining);

        payment.extra += extraToGive;

        payment.total += extraToGive;

        remaining -= extraToGive;

    }

    return {

        success: true,

        payments,

        leftover: remaining

    };

}

/*
One month's interest
*/

function applyInterest(debts) {

    return debts.map(debt => {

        const interest =
            debt.balance *
            (debt.apr / 100) /
            12;

        return {

            ...debt,

            balance: debt.balance + interest,

            interest

        };

    });

}

/*
Apply payments
*/

function applyPayments(debts, payments) {

    return debts.map(debt => {

        const payment =
            payments.find(
                p => p.lender === debt.lender
            );

        if (!payment)
            return debt;

        return {

            ...debt,

            balance: Math.max(
                0,
                debt.balance - payment.total
            )

        };

    });

}