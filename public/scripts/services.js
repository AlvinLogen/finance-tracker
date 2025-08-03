const apiService = {
    baseURL: 'http://localhost:3000/api',

    async testConnection() {
        try {
            const response = await fetch(`${this.baseURL}/test`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API Connection Error Details:', {
                message: error.message,
                stack: error.stack,
                url: `${this.baseURL}/test`
            });
            return { status: 'error', message: error.message };
        }
    }
};