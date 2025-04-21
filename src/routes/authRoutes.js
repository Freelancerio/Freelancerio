const express = require('express');
const router = express.Router();

const { isUser, addUser } = require('../controllers/userController');

// Auth routes
router.get('/check-auth',isUser);
router.post('/add-user',addUser);

module.exports = router;

