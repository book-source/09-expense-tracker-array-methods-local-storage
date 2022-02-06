const balance = document.getElementById("balance");
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const form = document.getElementById('form');
const list = document.getElementById('list');
const text = document.getElementById('text');
const amount = document.getElementById('amount');


let transactions = [];

function init() {
	fetchTransactionsFromLocalStorage()
	list.innerHTML = '';
	updateAllDom();
	updateBalance();
}

// Generate random ID
function generateID() {
	return Math.floor(Math.random() * 100000000);
}

function saveTransactionsToLocalStorage() {
	localStorage.setItem('transactions', JSON.stringify(transactions));
}

function fetchTransactionsFromLocalStorage() {
	let localStorageTransactions = localStorage.getItem('transactions');
	transactions = localStorageTransactions !== null ? JSON.parse(localStorageTransactions) : [];
}

function updateAllDom() {
	list.innerHTML = '';
	fetchTransactionsFromLocalStorage();
	transactions.forEach(
		transaction => {
			addOneTransactionToDom(transaction);
		}
	)
}

function addOneTransactionToDom(transaction) {
	let item = document.createElement('li');
	const sign = transaction.amount > 0 ? '+' : '-';

	item.classList.add(transaction.amount > 0 ? 'plus' : 'minus');
	item.innerHTML = `${transaction.text} <span>${sign}$ ${transaction.amount}</span> 
	<button class = "delete-btn"
	onclick = "removeOneTransaction(${transaction.id})"> X </button>`;

	list.appendChild(item);
}


function addOneTransaction(transaction) {
	transactions.push(transaction);
	// save to transactions to localStorage
	addOneTransactionToDom(transaction);
	saveTransactionsToLocalStorage();
	updateBalance();

}

function removeOneTransaction(id) {
	transactions = transactions.filter(transaction => transaction.id !== id);
	saveTransactionsToLocalStorage();
	updateAllDom();
	updateBalance();
}


form.addEventListener("submit", event => {

	event.preventDefault();

	if (text.value === '' || +amount.value === 0) {
		return
	}

	const transaction = {
		id: generateID(),
		text: text.value,
		amount: +amount.value,
	};

	// console.log(transaction);

	addOneTransaction(transaction);
	text.value = '';
	amount.value = '';

})

function updateBalance() {

	let amounts = transactions.map(transaction => transaction.amount);
	let income = amounts.filter(amt => amt > 0).reduce((acc, amt) => (acc += amt), 0).toFixed(2);
	// console.log(income);
	money_plus.innerText = "+$" + income;


	let expense = amounts.filter(amt => amt < 0).reduce((acc, amt) => (acc += amt), 0);
	money_minus.innerText = "-$" + Math.abs(expense).toFixed(2);

	const total = (Number(income) + Number(expense)).toFixed(2);

	balance.innerText = "$" + total;
}


init();