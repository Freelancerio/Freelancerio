const express = require('express');
const router = express.Router();

const { isUser, addUser, retrieveUsers } = require('../controllers/userController');

// Auth routes
router.get('/check-auth',isUser);
router.post('/add-user',addUser);
router.get('/get-users',retrieveUsers);

module.exports = router;

