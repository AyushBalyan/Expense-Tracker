import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import IncomeManager from './components/IncomeManager';
import ExpenseManager from './components/ExpenseManager';
import CategoryManager from './components/CategoryManager';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <span className="text-xl font-bol">Expense Tracker</span>
                  </div>
                </div>
              </div>
            </div>
          </nav>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/login" element={<Auth />} />
              <Route path="/" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/income" element={
                <PrivateRoute>
                  <IncomeManager />
                </PrivateRoute>
              } />
              <Route path="/expenses" element={
                <PrivateRoute>
                  <ExpenseManager />
                </PrivateRoute>
              } />
              <Route path="/categories" element={
                <PrivateRoute>
                  <CategoryManager />
                </PrivateRoute>
              } />
            </Routes>
          </div>
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;