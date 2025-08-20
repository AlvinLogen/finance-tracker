async function loadTransactions(userId = 1) {
    try {
        const response = await fetch(`http://localhost:3001/api/transactions/${userId}`);

        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        displayTransactions(data.transactions);

    } catch (error) {
        document.getElementById('transactions-list').innerHTML = 
        '<p class="error">Failed to load transactions. Please try again.</p>'
    }
}

function displayTransactions(transactions){
    const container = document.getElementById('transactions-list');

    if (!transactions || transactions.length === 0){
        container.innerHTML = '<p class="no-data">No transactions found.</p>';
        return;
    }

    const transactionsHTML = transactions.map(transaction => `
         <div class="transaction-item ${transaction.TransactionType.toLowerCase()}">
            <div class="transaction-details">
                <h4>${transaction.Description}</h4>
                <p class="transaction-category">${transaction.CategoryName}</p>
                <p class="transaction-date">${new Date(transaction.TransactionDate).toLocaleDateString()}</p>
            </div>
            <div class="transaction-amount ${transaction.TransactionType.toLowerCase()}">
                ${transaction.TransactionType === 'Income' ? '+' : '-'}${formatCurrency(transaction.Amount)}
            </div>
        </div>
    `).join('');

    container.innerHTML = transactionsHTML;
}

async function loadCategories(userId = 1, transactionType = null) {
    try {
        let url = `http://localhost:3001/api/categories/${userId}`;
        if (transactionType) {
            url += `?categoryType=${transactionType}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        const categorySelect = document.getElementById('category');
        categorySelect.innerHTML = '<option value="">Select Category</option>';
        
        data.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.CategoryID;
            option.textContent = category.CategoryName;
            categorySelect.appendChild(option);
        });
        
    } catch (error) {
        console.error('Failed to load categories:', error);
    }
}

async function addTransaction(transactionData) {
    try {
       
        const response = await fetch('http://localhost:3001/api/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transactionData)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Failed to add transaction');
        }
        
        await loadTransactions();
        await loadDashboardData(); 
        document.getElementById('add-transaction-form').reset();
        
        showNotification('Transaction added successfully!', 'success');
        
    } catch (error) {
        console.error('Failed to add transaction:', error);
        showNotification('Failed to add transaction: ' + error.message, 'error');
    }
}

function showNotification(message, type) {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        background-color: ${type === 'success' ? '#4CAF50' : '#f44336'};
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

document.addEventListener('DOMContentLoaded', function() {
    loadTransactions();
    loadCategories();
    
    document.getElementById('transaction-type').addEventListener('change', function() {
        const selectedType = this.value;
        if (selectedType) {
            loadCategories(1, selectedType);
        } else {
            loadCategories(1);
        }
    });
    
    document.getElementById('add-transaction-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const transactionData = {
            userId: 1, // Hardcoded for now
            amount: formData.get('amount'),
            description: formData.get('description'),
            transactionDate: formData.get('transactionDate'),
            categoryId: formData.get('categoryId'),
            transactionType: formData.get('transactionType')
        };
        
        addTransaction(transactionData);
    });
    
    document.getElementById('transaction-date').valueAsDate = new Date();
});