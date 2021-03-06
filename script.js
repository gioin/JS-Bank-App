"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// Bank APP

// Data
const account1 = {
  owner: "Giorgi Injgia",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Levan Mikeladze",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// Creating DOM Elements - movements
const displayMovements = function (movements) {
  containerMovements.innerHTML = "";

  movements.forEach(function (mov, index) {
    const type = mov > 0 ? `deposit` : `withdrawal`;
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
    <div class="movements__value">${mov} €</div>
  </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// calculate and display balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((start, cur) => start + cur, 0);
  labelBalance.textContent = ` ${acc.balance} €`;
};

// calculate abd display summary
const calcDisplaySummary = function (accs) {
  const income = accs.movements
    .filter((mov) => mov > 0)
    .reduce((start, mov) => start + mov, 0);

  const outcome = accs.movements
    .filter((mov) => mov < 0)
    .reduce((start, mov) => start + mov, 0);

  const interest = accs.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * accs.interestRate) / 100)
    .filter((intrest) => intrest >= 1)
    .reduce((start, mov) => start + mov, 0);

  labelSumIn.textContent = `${income} €`;
  labelSumOut.textContent = `${Math.abs(outcome)} €`;
  labelSumInterest.textContent = `${interest} €`;
};

// Computing usernames
const createUsernames = function (accs) {
  accs.forEach(function (ac) {
    ac.username = ac.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};

createUsernames(accounts);

// Update UI
const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);
  // Calculate and display summary
  calcDisplaySummary(acc);
  //  Calculate and display balance
  calcDisplayBalance(acc);
};

// Log in Event handler
let currentAccount;
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) =>
      acc.username === inputLoginUsername.value &&
      acc.pin === Number(inputLoginPin.value)
  );

  if (currentAccount) {
    // clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    inputLoginUsername.blur();
    // display UI and Welcome message
    labelWelcome.textContent = `Welcome ${currentAccount.owner.split(" ")[0]}`;
    containerApp.style.opacity = 100;

    // Update UI
    updateUI(currentAccount);
  }
});

// Transfer money Event handler
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";
  inputTransferTo.blur();
  inputTransferAmount.blur();

  if (
    currentAccount.balance >= amount &&
    receiverAcc &&
    amount > 0 &&
    receiverAcc.username !== currentAccount.username
  ) {
    // add negative movement to current user
    currentAccount.movements.push(-amount);
    // add positive movement to recipient
    receiverAcc.movements.push(amount);
    // Update UI
    updateUI(currentAccount);
    console.log("transfer is valid");
  }
});

// Close Account Event handler
btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  const currentIndex = accounts.findIndex((cur) => cur == currentAccount);

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) == currentAccount.pin
  ) {
    // Delete account
    accounts.splice(currentIndex, 1);
    // Update UI
    containerApp.style.opacity = 0;
  }
});

// Request Iaon Event handler
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    // add positive movement to recipient
    currentAccount.movements.push(amount);
    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = "";
  inputLoanAmount.blur();
});
