class UI {
  constructor() {
    this.budgetFeedback = document.querySelector(".budget-feedback");
    this.expenseFeedback = document.querySelector(".expense-feedback");
    this.budgetForm = document.getElementById("budget-form");
    this.budgetInput = document.getElementById("budget-input");
    this.budgetAmount = document.getElementById("budget-amount");
    this.expenseAmount = document.getElementById("expense-amount");
    this.balance = document.getElementById("balance");
    this.balanceAmount = document.getElementById("balance-amount");
    this.expenseForm = document.getElementById("expense-form");
    this.expenseInput = document.getElementById("expense-input");
    this.amountInput = document.getElementById("amount-input");
    this.expenseList = document.getElementById("expense-list");
    this.itemList = [];
    this.itemID = 0;
  }

  // Submit Budget
  submitbudgetform() {
    const value = this.budgetInput.value.trim();

    if (value === "" || isNaN(value) || parseInt(value) < 0) {
      this.budgetFeedback.classList.add('showItem');
      this.budgetFeedback.innerHTML = '<p>Value cannot be empty or negative</p>';
      const self = this;
      setTimeout(() => {
        self.budgetFeedback.classList.remove('showItem');
      }, 5000);
    } else {
      this.budgetAmount.textContent = value;
      this.budgetInput.value = '';
      this.showBalance();
    }
  }

  // Show Balance
  showBalance() {
    const expense = this.totalExpense();
    const total = parseInt(this.budgetAmount.textContent) - expense;

    this.expenseAmount.textContent = expense;
    this.balanceAmount.textContent = total;

    this.balance.classList.remove('showRed', 'showGreen', 'showBlack');
    if (total < 0) {
      this.balance.classList.add('showRed');
    } else if (total > 0) {
      this.balance.classList.add('showGreen');
    } else {
      this.balance.classList.add('showBlack');
    }
  }

  // Submit Expense
  submitexpenseForm() {
    const expenseValue = this.expenseInput.value.trim();
    const amountValue = this.amountInput.value.trim();

    if (expenseValue === '' || amountValue === '' || isNaN(amountValue) || parseInt(amountValue) < 0) {
      this.expenseFeedback.classList.add('showItem');
      this.expenseFeedback.innerHTML = '<p>Value cannot be empty or negative</p>';
      const self = this;
      setTimeout(() => {
        self.expenseFeedback.classList.remove('showItem');
      }, 5000);
    } else {
      const amount = parseInt(amountValue);
      this.expenseInput.value = '';
      this.amountInput.value = '';

      const expense = {
        id: this.itemID,
        title: expenseValue,
        amount: amount
      };

      this.itemID++;
      this.itemList.push(expense);
      this.addExpense(expense);
      this.showBalance();
    }
  }

  // Add Expense to DOM
  addExpense(expense) {
    const div = document.createElement('div');
    div.classList.add('expense');
    div.innerHTML = `
      <div class="expense-item d-flex justify-content-between align-items-baseline">
        <h6 class="expense-title mb-0 text-uppercase list-item">- ${expense.title}</h6>
        <h5 class="expense-amount mb-0 list-item">$${expense.amount}</h5>
        <div class="expense-icons list-item">
          <a href="#" class="edit-icon mx-2" data-id="${expense.id}">
            <i class="fas fa-edit"></i>
          </a>
          <a href="#" class="delete-icon" data-id="${expense.id}">
            <i class="fas fa-trash"></i>
          </a>
        </div>
      </div>
    `;
    this.expenseList.appendChild(div);
  }

  // Calculate Total Expense
  totalExpense() {
    return this.itemList.reduce((acc, curr) => acc + curr.amount, 0);
  }

  // Edit Expense
  editExpense(element) {
    const id = parseInt(element.dataset.id);
    const parent = element.closest('.expense');
    this.expenseList.removeChild(parent);

    const expense = this.itemList.find(item => item.id === id);
    this.expenseInput.value = expense.title;
    this.amountInput.value = expense.amount;

    this.itemList = this.itemList.filter(item => item.id !== id);
    this.showBalance();
  }

  // Delete Expense
  deleteExpense(element) {
    const id = parseInt(element.dataset.id);
    const parent = element.closest('.expense');
    this.expenseList.removeChild(parent);

    this.itemList = this.itemList.filter(item => item.id !== id);
    this.showBalance();
  }
}
function EventListeners() {
  const budgetForm = document.getElementById('budget-form');
  const expenseForm = document.getElementById('expense-form');
  const expenseList = document.getElementById('expense-list');

  const ui = new UI();

  // Budget form submit
  budgetForm.addEventListener('submit', function (event) {
    event.preventDefault();
    ui.submitbudgetform();
  });

  // Expense form submit
  expenseForm.addEventListener('submit', function (event) {
    event.preventDefault();
    ui.submitexpenseForm();
  });

  // Expense list click handler
  expenseList.addEventListener('click', function (event) {
    event.preventDefault();
    const target = event.target;
    if (target.parentElement.classList.contains('edit-icon')) {
      ui.editExpense(target.parentElement);
    } else if (target.parentElement.classList.contains('delete-icon')) {
      ui.deleteExpense(target.parentElement);
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  EventListeners();
});
