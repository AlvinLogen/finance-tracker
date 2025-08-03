document.addEventListener('DOMContentLoaded', async () => {
    try{
        const result = await apiService.testConnection();
        console.log('Connection test result: ', result);

        const dashboard = document.getElementById('dashboard');
        dashboard.innerHTML = `
            <div class="connection-status">
                <h2>Connection Status: ${result.status}</h2>
                <p>${result.message}</p>
                ${result.serverTime ? `<p>Server Time:L ${result.serverTime}</p>` : ''}
            </div>
        `;

    } catch (error){
        console.error('Connection test failed: ', error)
    }
});

