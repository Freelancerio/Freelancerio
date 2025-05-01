const express = require('express');
const router = express.Router();

const { isUser, addUser, retrieveUsers, updateUserDetails, getUserDetails } = require('../controllers/userController');

// Auth routes
router.get('/check-auth',isUser);
router.post('/add-user',addUser);
router.get('/get-users',retrieveUsers);
router.put('/updateUser/:userId',updateUserDetails);
router.get('/get-user/:userId',getUserDetails);

module.exports = router;

