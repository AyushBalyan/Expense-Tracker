const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/database');

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id',
      [email, hashedPassword]
    );
    const token = jwt.sign({ userId: result.rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
};

exports.addIncome = async (req, res) => {
  try {
    const { amount, month, year } = req.body;
    const result = await db.query(
      'INSERT INTO income (user_id, amount, month, year) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, amount, month, year]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error adding income' });
  }
};

exports.getIncome = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM income WHERE user_id = $1', [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching income' });
  }
};

exports.lockIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'UPDATE income SET is_locked = true WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Income not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error locking income' });
  }
};

exports.addExpense = async (req, res) => {
  try {
    const { title, amount, category_id, date } = req.body;
    const result = await db.query(
      'INSERT INTO expenses (user_id, title, amount, category_id, date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, title, amount, category_id, date]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error adding expense' });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM expenses WHERE user_id = $1', [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching expenses' });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, category_id, date } = req.body;
    const result = await db.query(
      'UPDATE expenses SET title = $1, amount = $2, category_id = $3, date = $4 WHERE id = $5 AND user_id = $6 RETURNING *',
      [title, amount, category_id, date, id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error updating expense' });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting expense' });
  }
};

exports.addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const result = await db.query(
      'INSERT INTO categories (name, user_id) VALUES ($1, $2) RETURNING *',
      [name, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error adding category' });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM categories WHERE user_id = $1', [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching categories' });
  }
};

exports.getDashboardData = async (req, res) => {
  try {
    const incomeResult = await db.query(
      'SELECT SUM(amount) as total, month FROM income WHERE user_id = $1 GROUP BY month;',
      [req.user.id]
    );
    console.log('Income query result:', incomeResult.rows);

    const expenseResult = await db.query(
      'SELECT SUM(amount) as total, EXTRACT(MONTH FROM date)::integer as month FROM expenses WHERE user_id = $1 GROUP BY month',
      [req.user.id]
    );
    console.log('Expense query result:', expenseResult.rows);

    const categoryResult = await db.query(
      'SELECT c.name, SUM(e.amount) as total FROM expenses e JOIN categories c ON e.category_id = c.id WHERE e.user_id = $1 GROUP BY c.name',
      [req.user.id]
    );
    console.log('Category query result:', categoryResult.rows);

    const monthlyDataMap = new Map();
    
    incomeResult.rows.forEach((income) => {
      monthlyDataMap.set(parseInt(income.month), {
        month: parseInt(income.month),
        income: parseFloat(income.total),
        expenses: 0
      });
    });

    expenseResult.rows.forEach((expense) => {
      const month = parseInt(expense.month);
      if (monthlyDataMap.has(month)) {
        monthlyDataMap.get(month).expenses = parseFloat(expense.total);
      } else {
        monthlyDataMap.set(month, {
          month: month,
          income: 0,
          expenses: parseFloat(expense.total)
        });
      }
    });

    const monthlyData = Array.from(monthlyDataMap.values()).sort((a, b) => a.month - b.month);

    console.log('Monthly data:', monthlyData);

    const categoryData = categoryResult.rows.map((category) => ({
      name: category.name,
      value: parseFloat(category.total),
    }));

    const totalIncome = monthlyData.reduce((sum, month) => {
      console.log(`Month ${month.month}: Income = ${month.income}`);
      return sum + month.income;
    }, 0);

    const totalExpenses = monthlyData.reduce((sum, month) => {
      console.log(`Month ${month.month}: Expenses = ${month.expenses}`);
      return sum + month.expenses;
    }, 0);

    console.log('Total Income:', totalIncome);
    console.log('Total Expenses:', totalExpenses);

    res.json({
      monthlyData,
      categoryData,
      totalIncome,
      totalExpenses,
    });
  } catch (error) {
    console.error('Error in getDashboardData:', error);
    res.status(500).json({ error: 'Error fetching dashboard data' });
  }
};