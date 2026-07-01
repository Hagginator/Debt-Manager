/*
=========================================
Debt Manager
planner.js

Version: 0.4.0
=========================================
*/

function calculatePlan() {

    const budget = Number(
        document.getElementById("monthlyBudget").value
    );

    const strategy =
        document.getElementById("strategy").value;

    if (budget <= 0) {

        alert("Please enter a monthly budget.");

        return;

    }

    if (debts.length === 0) {

        alert("Please add at least one debt.");

        return;

    }

    // Sort debts according to the chosen strategy
    const sortedDebts = sortDebts(strategy, debts);

    // Ask the repayment engine to calculate payments
    const result = calculateMonthlyPayments(
        sortedDebts,
        budget
    );

    if (!result.success) {

        alert(result.message);

        return;

    }

    displayPlan(result);

}

function displayPlan(result) {

    let html = `

        <div class="plan-card">

            <h3>💳 Payments This Month</h3>

    `;

    result.payments.forEach(payment => {

        const remaining = Math.max(
            0,
            payment.balance - payment.total
        );

        const paidOff = remaining === 0;

        html += `

            <div class="plan-row">

                <div>

                    <strong style="font-size:1.1rem;">
                        ${payment.lender}
                    </strong>

                    <br><br>

                    Balance:
                    £${payment.balance.toFixed(2)}

                    <br>

                    Minimum:
                    £${payment.minimum.toFixed(2)}

                    <br>

                    Extra:
                    £${payment.extra.toFixed(2)}

                    <br>

                    <strong>

                        Total Payment:
                        £${payment.total.toFixed(2)}

                    </strong>

                </div>

                <div style="text-align:right;">

                    <div
                        style="
                            font-size:.9rem;
                            color:#94A3B8;
                            margin-bottom:6px;
                        ">

                        Remaining

                    </div>

                    <div
                        style="
                            font-size:1.4rem;
                            font-weight:bold;
                        ">

                        £${remaining.toFixed(2)}

                    </div>

                    ${paidOff
                        ? `
                        <div
                            style="
                                color:#22C55E;
                                margin-top:10px;
                                font-weight:bold;
                            ">

                            ✅ Paid Off

                        </div>
                        `
                        : ""}

                </div>

            </div>

        `;

    });

    if (result.leftover > 0) {

        html += `

            <div class="plan-row">

                <span>

                    💰 Unused Budget

                </span>

                <strong>

                    £${result.leftover.toFixed(2)}

                </strong>

            </div>

        `;

    }

    html += `

        </div>

    `;

    document.getElementById(
        "repaymentPlan"
    ).innerHTML = html;

}