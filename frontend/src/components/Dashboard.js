import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Menu,
  X,
  Home,
  PlusSquare,
  MinusSquare,
  Tag,
  LogOut,
} from "lucide-react";

const Dashboard = () => {
  const { state, logout } = useContext(AppContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

  const navigateTo = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const safeNumber = (value) => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  console.log(state.categoryData);

  const calculateNetSavings = () => {
    return state.totalIncome - state.totalExpenses;
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
              Financial Dashboard
            </h2>
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
            >
              <Menu size={24} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-md transition-all hover:shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-600">
                  Total Income
                </h3>
                <ArrowUpRight className="text-green-500" size={24} />
              </div>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                ${safeNumber(state.totalIncome).toFixed(2)}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md transition-all hover:shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-600">
                  Total Expenses
                </h3>
                <ArrowDownRight className="text-red-500" size={24} />
              </div>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                ${safeNumber(state.totalExpenses).toFixed(2)}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md transition-all hover:shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-600">
                  Net Savings
                </h3>
                <DollarSign className="text-blue-500" size={24} />
              </div>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                ${calculateNetSavings().toFixed(2)}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">
                Income vs Expenses
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Income", value: state.totalIncome },
                      { name: "Expenses", value: state.totalExpenses },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[...Array(2)].map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">
                Expenses by Category
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={state.categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
