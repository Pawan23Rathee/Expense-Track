const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

const localStorageTransations = JSON.parse(localStorage.getItem("transations"));

let transations =
  localStorage.getItem("transations") !== null ? localStorageTransations : [];

// Generate random ID
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
  transations = transations.filter(transation => transation.id !== id);
  updateLocalStorage();
  init();
}

// Update local storage
function updateLocalStorage() {
  localStorage.setItem("transations", JSON.stringify(transations));
}

// Initialize the app
function init() {
  list.innerHTML = "";
  transations.forEach(addTransationDOM);
  updateValues();
}

init();

// Add transaction event listener
form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (text.value.trim() === "" || amount.value.trim() === "") {
    text.placeholder = "Please add a text";
    text.style.backgroundColor = "#ccc";
    amount.placeholder = "Please add amount";
    amount.style.backgroundColor = "#ccc";
  } else {
    const transation = {
      id: generateID(),
      text: text.value,
      amount: +amount.value
    };

    transations.push(transation);
    addTransationDOM(transation);
    updateValues();
    updateLocalStorage();

    text.value = "";
    amount.value = "";
    text.style.backgroundColor = "";
    amount.style.backgroundColor = "";
  }
});
