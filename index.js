const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

const localStorageTransations = JSON.parse(localStorage.getItem("transations")) || [];

let transations = localStorageTransations;  // Start with the existing transactions or empty array

// Generate random ID for transactions
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Add a transaction to the DOM
function addTransationDOM(transation) {
  const sign = transation.amount < 0 ? "-" : "+";
  const item = document.createElement("li");

  item.classList.add(transation.amount < 0 ? "minus" : "plus");

  item.innerHTML = `
    ${transation.text}
    <span>${sign}${Math.abs(transation.amount)}</span>
    <button class="delete-btn" onclick="removeTransation(${transation.id})">X</button>
  `;

  list.appendChild(item);
}

// Update the balance, income, and expense
function updateValues() {
  const amounts = transations.map(transation => transation.amount);

  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => acc + item, 0)
    .toFixed(2);
  const expense = (
    amounts.filter(item => item < 0)
    .reduce((acc, item) => acc + item, 0) * -1
  ).toFixed(2);

  balance.innerText = `₱${total}`;
  money_plus.innerText = `₱${income}`;
  money_minus.innerText = `₱${expense}`;
}

// Remove a transaction by ID
function removeTransation(id) {
  // Filter out the transaction by ID
  transations = transations.filter(transation => transation.id !== id);
  
  // Update localStorage with the new transactions array
  updateLocalStorage();
  
  // Re-render the transaction list
  init();
}

// Update local storage with the latest transactions
function updateLocalStorage() {
  localStorage.setItem("transations", JSON.stringify(transations));
}

// Initialize the app
function init() {
  list.innerHTML = "";  // Clear current list before re-rendering
  transations.forEach(addTransationDOM);  // Re-render each transaction
  updateValues();  // Update the values of balance, income, and expenses
}

init();  // Call init to load transactions on page load

// Add transaction event listener for form submission
form.addEventListener("submit", function (e) {
  e.preventDefault();  // Prevent default form submission

  // Validate inputs
  if (text.value.trim() === "" || amount.value.trim() === "") {
    text.placeholder = "Please add a text";
    text.style.backgroundColor = "#ccc";
    amount.placeholder = "Please add amount";
    amount.style.backgroundColor = "#ccc";
  } else {
    const transation = {
      id: generateID(),  // Generate unique ID
      text: text.value,
      amount: +amount.value  // Convert amount to number
    };

    // Add transaction to array
    transations.push(transation);

    // Add transaction to the DOM
    addTransationDOM(transation);

    // Update values (balance, income, expense)
    updateValues();

    // Update localStorage
    updateLocalStorage();

    // Clear form fields
    text.value = "";
    amount.value = "";
    text.style.backgroundColor = "";
    amount.style.backgroundColor = "";
  }
});
