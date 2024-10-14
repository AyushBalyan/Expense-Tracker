const express = require('express');
const router = express.Router();
const appController = require('../controllers/appController');
const authMiddleware = require('../middleware/auth');

router.get('/auth/verify', authMiddleware, (req, res) => {
    res.json({ user: { id: req.user.id, email: req.user.email } });
  });

router.post('/auth/register', appController.register);
router.post('/auth/login', appController.login);

router.use(authMiddleware);

router.post('/income', appController.addIncome);
router.get('/income', appController.getIncome);
router.put('/income/:id/lock', appController.lockIncome);

router.post('/expenses', appController.addExpense);
router.get('/expenses', appController.getExpenses);
router.put('/expenses/:id', appController.updateExpense);
router.delete('/expenses/:id', appController.deleteExpense);

router.post('/categories', appController.addCategory);
router.get('/categories', appController.getCategories);

router.get('/dashboard', appController.getDashboardData);

module.exports = router;
