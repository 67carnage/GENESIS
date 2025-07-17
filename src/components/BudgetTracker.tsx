"use client";

import React, { useState } from "react";

type Expense = {
  id: number;
  title: string;
  amount: number;
};

export default function BudgetTracker() {
  const [budget, setBudget] = useState<number>(0);
  const [budgetInput, setBudgetInput] = useState<string>("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseTitle, setExpenseTitle] = useState<string>("");
  const [expenseAmount, setExpenseAmount] = useState<string>("");
  const [budgetError, setBudgetError] = useState<string>("");
  const [expenseError, setExpenseError] = useState<string>("");
  const [editExpenseId, setEditExpenseId] = useState<number | null>(null);

  const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0);
  const balance = budget - totalExpenses;

  const handleBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedBudget = parseFloat(budgetInput);
    if (isNaN(parsedBudget) || parsedBudget <= 0) {
      setBudgetError("Please enter a valid positive budget amount.");
      return;
    }
    setBudget(parsedBudget);
    setBudgetInput("");
    setBudgetError("");
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(expenseAmount);
    if (!expenseTitle.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      setExpenseError("Please provide a valid expense title and a positive amount.");
      return;
    }
    setExpenseError("");

    if (editExpenseId !== null) {
      // Edit existing expense
      setExpenses(expenses.map(exp => 
        exp.id === editExpenseId 
          ? { ...exp, title: expenseTitle.trim(), amount: parsedAmount } 
          : exp
      ));
      setEditExpenseId(null);
    } else {
      // Add new expense
      const newExpense: Expense = {
        id: Date.now(),
        title: expenseTitle.trim(),
        amount: parsedAmount,
      };
      setExpenses([...expenses, newExpense]);
    }
    setExpenseTitle("");
    setExpenseAmount("");
  };

  const handleDeleteExpense = (id: number) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
    // If we're editing this expense, cancel the edit
    if (editExpenseId === id) {
      setEditExpenseId(null);
      setExpenseTitle("");
      setExpenseAmount("");
    }
  };

  const handleEditExpense = (id: number) => {
    const expToEdit = expenses.find(exp => exp.id === id);
    if (expToEdit) {
      setExpenseTitle(expToEdit.title);
      setExpenseAmount(expToEdit.amount.toString());
      setEditExpenseId(id);
      setExpenseError("");
    }
  };

  const cancelEdit = () => {
    setEditExpenseId(null);
    setExpenseTitle("");
    setExpenseAmount("");
    setExpenseError("");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        {/* Budget Form */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Set Your Budget</h2>
          <form onSubmit={handleBudgetSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="number"
              step="0.01"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              placeholder="Please Enter Your Budget"
              className="border-2 border-gray-300 p-3 flex-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors font-semibold text-lg"
            >
              Calculate
            </button>
          </form>
          {budgetError && <p className="text-red-600 mt-2 font-medium">{budgetError}</p>}
        </div>

        {/* Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-6 border-2 border-gray-200 rounded-lg">
            <div className="text-lg font-medium text-gray-600 mb-2">BUDGET</div>
            <div className="text-3xl font-bold text-green-600">${budget.toFixed(2)}</div>
          </div>
          <div className="text-center p-6 border-2 border-gray-200 rounded-lg">
            <div className="text-lg font-medium text-gray-600 mb-2">EXPENSES</div>
            <div className="text-3xl font-bold text-red-600">${totalExpenses.toFixed(2)}</div>
          </div>
          <div className="text-center p-6 border-2 border-gray-200 rounded-lg">
            <div className="text-lg font-medium text-gray-600 mb-2">BALANCE</div>
            <div className={`text-3xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${balance.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Expense Form */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            {editExpenseId !== null ? "Edit Expense" : "Add Expense"}
          </h2>
          <form onSubmit={handleExpenseSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={expenseTitle}
                onChange={(e) => setExpenseTitle(e.target.value)}
                placeholder="Please Enter Your Expense"
                className="border-2 border-gray-300 p-3 flex-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
              <input
                type="number"
                step="0.01"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                placeholder="Please Enter Expense Amount"
                className="border-2 border-gray-300 p-3 sm:w-64 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors font-semibold text-lg"
              >
                {editExpenseId !== null ? "Update Expense" : "Add Expense"}
              </button>
              {editExpenseId !== null && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition-colors font-semibold text-lg"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
          {expenseError && <p className="text-red-600 mt-2 font-medium">{expenseError}</p>}
        </div>

        {/* Expense List */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Expense List</h2>
            {expenses.length > 0 && (
              <span className="text-gray-600 font-medium">
                {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          {expenses.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-xl">No expenses added yet.</p>
              <p className="text-sm mt-2">Add your first expense above to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 p-4 bg-gray-100 rounded-lg font-semibold text-gray-700">
                <div className="col-span-5">Expense Title</div>
                <div className="col-span-3">Expense Value</div>
                <div className="col-span-4 text-center">Actions</div>
              </div>
              
              {/* Expense Items */}
              {expenses.map((exp) => (
                <div 
                  key={exp.id} 
                  className={`grid grid-cols-12 gap-4 p-4 border-2 rounded-lg transition-colors ${
                    editExpenseId === exp.id ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="col-span-5 font-medium text-gray-800 flex items-center">
                    {exp.title.toUpperCase()}
                  </div>
                  <div className="col-span-3 font-bold text-red-600 flex items-center">
                    ${exp.amount.toFixed(2)}
                  </div>
                  <div className="col-span-4 flex justify-center gap-3">
                    <button
                      onClick={() => handleEditExpense(exp.id)}
                      className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
                      disabled={editExpenseId !== null && editExpenseId !== exp.id}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteExpense(exp.id)}
                      className="text-red-600 hover:text-red-800 font-medium hover:underline transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
