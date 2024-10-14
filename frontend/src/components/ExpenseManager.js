import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import {
  PlusCircle,
  Edit2,
  Trash2,
  Menu,
  X,
  Home,
  PlusSquare,
  MinusSquare,
  Tag,
  LogOut,
} from "lucide-react";

const ExpenseManager = () => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const { addExpense, editExpense, deleteExpense, state, logout } =
    useContext(AppContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && amount && category && date) {
      const newExpense = {
        title,
        amount: parseFloat(amount),
        category,
        date: new Date(date),
      };
      addExpense(newExpense);
      setTitle("");
      setAmount("");
      setCategory("");
      setDate("");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navigateTo = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  // Helper function to format amount
  const formatAmount = (amount) => {
    const num = parseFloat(amount);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between h-16 px-4 bg-blue-500 text-white">
          <span className="text-xl font-bold">Menu</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-full hover:bg-blue-600"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="mt-8">
          <button
            onClick={() => navigateTo("/")}
            className="flex items-center w-full px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            <Home className="mr-2" size={20} />
            Dashboard
          </button>
          <button
            onClick={() => navigateTo("/income")}
            className="flex items-center w-full px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            <PlusSquare className="mr-2" size={20} />
            Manage Income
          </button>
          <button
            onClick={() => navigateTo("/expenses")}
            className="flex items-center w-full px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            <MinusSquare className="mr-2" size={20} />
            Manage Expenses
          </button>
          <button
            onClick={() => navigateTo("/categories")}
            className="flex items-center w-full px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            <Tag className="mr-2" size={20} />
            Manage Categories
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center w-50 px-4 mx-4 ml-14 rounded py-2 mt-4 text-white bg-red-500 hover:bg-red-600 transition-colors duration-200"
          >
            <LogOut className="mr-2" size={20} />
            Logout
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              Expense Manager
            </h2>
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
            >
              <Menu size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="mb-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Expense Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                {state.categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              <PlusCircle className="mr-2" size={20} />
              Add Expense
            </button>
          </form>
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Expense History
            </h3>
            <div className="space-y-4">
              {state.expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-white rounded-lg shadow-md"
                >
                  <div className="mb-2 sm:mb-0">
                    <span className="font-semibold">{expense.title}</span>
                    <span className="ml-2 text-gray-600">
                      ${formatAmount(expense.amount)}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      {new Date(expense.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => editExpense(expense.id)}
                      className="p-2 text-yellow-500 hover:text-yellow-600 transition-colors"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => deleteExpense(expense.id)}
                      className="p-2 text-red-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseManager;
