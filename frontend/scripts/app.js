document.addEventListener('DOMContentLoaded', async () => {
    try{
        const result = await apiService.testConnection();
        console.log('Connection test result: ', result);

        const connectionStatus = document.createElement('div');
        connectionStatus.className = 'connection-status';
        connectionStatus.innerHTML = `
            <h3>API Connection: ${result.status}</h3>
            <p>${result.message}</p>
            ${result.serverTime ? `<p>Server Time: ${result.serverTime}</p>` : ''}
        `;

        const dashboard = document.getElementById('dashboard');
        dashboard.appendChild(connectionStatus);

        updateDashboardCards();

    } catch (error){
        console.error('Connection test failed: ', error);

        const errorStatus = document.createElement('div');
        errorStatus.className = 'connection-status-error';
        errorStatus.innerHTML = `
            <h3>API Connection: Error</h3>
            <p>${error.message}</p>
        `;

        const dashboard = document.getElementById('dashboard');
        dashboard.appendChild(errorStatus);
    }
});

function updateDashboardCards(){
    const dashboardData = FinanceUtils.getDashboardData();

    updateCard('income', dashboardData.income);
    updateCard('expense', dashboardData.expenses);
    updateCard('budget', dashboardData.budget);
    updateCard('savings', dashboardData.savings);

    console.log('Cards updated with: ', dashboardData);
}

function updateCard(type, data){
    const card = document.querySelector(`.finance-card--${type}`);

    if (!card) return;

    const amountElement = card.querySelector('.card-amount');
    if (amountElement) {
        amountElement.textContent = data.amount;
    }

    if (type === 'savings' && data.progress) {
        const subtitle = card.querySelector('.card-subtitle');
        if (subtitle) {
            subtitle.textContent = `${data.progress}% of goal`;
        }
    }

}

