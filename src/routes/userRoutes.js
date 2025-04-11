const express = require("express");
const router = express.Router();

//import all the functions from the userController
const {userRegister, userlogin} = require("../controllers/userController");

//user routes
router.get('/signup',userRegister);
router.post('/login',userlogin);


module.exports = router;