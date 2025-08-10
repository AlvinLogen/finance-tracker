const FinanceUtils = {
    data: {
        income: 5850.00,
        expenses: 3420.75,
        budget: 4000.00,
        savings: 2429.25
    },

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },

    getRemainingBudget() {
        return this.data.budget - this.data.expenses;
    },

    getSavingsProgress(goal = 3000){
        return Math.round((this.data.savings / goal) * 100);
    },

    getDashboardData(){
        return {
            income: {
                amount: this.formatCurrency(this.data.income),
                raw: this.data.income
            },
            expenses: {
                amount: this.formatCurrency(this.data.expenses),
                raw: this.data.expenses
            },
            budget: {
                amount: this.formatCurrency(this.getRemainingBudget()),
                raw: this.getRemainingBudget()
            },
            savings: {
                amount: this.formatCurrency(this.data.savings),
                progress: this.getSavingsProgress(),
                raw: this.data.savings
            }
        };
    }
};