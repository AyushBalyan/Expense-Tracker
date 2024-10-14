import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import {
  PlusCircle,
  X,
  Menu,
  Home,
  PlusSquare,
  MinusSquare,
  Tag,
  LogOut,
} from "lucide-react";

const CategoryManager = () => {
  const [categoryName, setCategoryName] = useState("");
  const { addCategory, deleteCategory, state, logout } = useContext(AppContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (categoryName.trim()) {
      addCategory(categoryName);
      setCategoryName("");
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
              Category Manager
            </h2>
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
            >
              <Menu size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <input
                type="text"
                placeholder="New Category Name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                <PlusCircle className="mr-2" size={20} />
                Add Category
              </button>
            </div>
          </form>
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Categories
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {state.categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md"
                >
                  <span className="text-gray-800">{category.name}</span>
                  <button
                    onClick={() => deleteCategory(category.id)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;
