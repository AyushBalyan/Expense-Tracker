import React, { createContext, useReducer, useEffect } from 'react';
import api from '../services/api';

export const AppContext = createContext();


const initialState = {
  user: null,
  categories: [],
  expenses: [],
  incomeHistory: [],
  totalIncome: 0,
  totalExpenses: 0,
  monthlyData: [],
  categoryData: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'SET_EXPENSES':
      return { ...state, expenses: action.payload };
    case 'SET_INCOME_HISTORY':
      return { ...state, incomeHistory: action.payload };
    case 'SET_DASHBOARD_DATA':
      return {
        ...state,
        totalIncome: action.payload.totalIncome,
        totalExpenses: action.payload.totalExpenses,
        monthlyData: action.payload.monthlyData,
        categoryData: action.payload.categoryData,
      };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'ADD_EXPENSE':
      return { ...state, expenses: [...state.expenses, action.payload] };
    case 'EDIT_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map(expense =>
          expense.id === action.payload.id ? action.payload : expense
        ),
      };
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload),
      };
    case 'ADD_INCOME':
      return {
        ...state,
        incomeHistory: [...state.incomeHistory, action.payload],
      };
    case 'LOCK_INCOME':
      return {
        ...state,
        incomeHistory: state.incomeHistory.map(income =>
          income.id === action.payload ? { ...income, is_locked: true } : income
        ),
      };
    
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token);
      fetchAllData();
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await api.get('/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      dispatch({ type: 'SET_USER', payload: response.data.user });
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('token');
    }
  };

  const fetchAllData = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const [categoriesResponse, expensesResponse, incomeResponse, dashboardResponse] = await Promise.all([
        api.get('/categories'),
        api.get('/expenses'),
        api.get('/income'),
        api.get('/dashboard'),
      ]);

      dispatch({ type: 'SET_CATEGORIES', payload: categoriesResponse.data });
      dispatch({ type: 'SET_EXPENSES', payload: expensesResponse.data });
      dispatch({ type: 'SET_INCOME_HISTORY', payload: incomeResponse.data });
      dispatch({ type: 'SET_DASHBOARD_DATA', payload: dashboardResponse.data });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };


  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      dispatch({ type: 'SET_USER', payload: response.data.user });
      await fetchAllData();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email, password) => {
    try {
      const response = await api.post('/auth/register', { email, password });
      dispatch({ type: 'SET_USER', payload: response.data.user });
      localStorage.setItem('token', response.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      await fetchAllData();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    api.defaults.headers.common['Authorization'] = null;
    dispatch({ type: 'LOGOUT' });
  }

  const addCategory = async (name) => {
    try {
      const response = await api.post('/categories', { name });
      dispatch({ type: 'ADD_CATEGORY', payload: response.data });
    } catch (error) {
      console.error('Add category error:', error);
    }
  };

  const addExpense = async (expense) => {
    try {
      const response = await api.post('/expenses', expense);
      dispatch({ type: 'ADD_EXPENSE', payload: response.data });
      await fetchAllData(); // Refresh dashboard data
    } catch (error) {
      console.error('Add expense error:', error);
    }
  };

  const editExpense = async (id, updatedExpense) => {
    try {
      const response = await api.put(`/expenses/${id}`, updatedExpense);
      dispatch({ type: 'EDIT_EXPENSE', payload: response.data });
      await fetchAllData(); // Refresh dashboard data
    } catch (error) {
      console.error('Edit expense error:', error);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      dispatch({ type: 'DELETE_EXPENSE', payload: id });
      await fetchAllData(); // Refresh dashboard data
    } catch (error) {
      console.error('Delete expense error:', error);
    }
  };

  const addIncome = async (amount, month, year) => {
    try {
      const response = await api.post('/income', { amount, month, year });
      dispatch({ type: 'ADD_INCOME', payload: response.data });
      await fetchAllData(); // Refresh dashboard data
    } catch (error) {
      console.error('Add income error:', error);
    }
  };

  const lockIncome = async (id) => {
    try {
      await api.put(`/income/${id}/lock`);
      dispatch({ type: 'LOCK_INCOME', payload: id });
    } catch (error) {
      console.error('Lock income error:', error);
    }
  };

  return (
    <AppContext.Provider value={{
      state,
      login,
      register,
      logout,
      addCategory,
      addExpense,
      editExpense,
      deleteExpense,
      addIncome,
      lockIncome,
      fetchAllData,
    }}>
      {children}
    </AppContext.Provider>
  );
};