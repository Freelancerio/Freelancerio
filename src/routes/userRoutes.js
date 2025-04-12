const express = require("express");
const router = express.Router();

//import all the functions from the userController
const {userRegister, userlogin} = require("../controllers/userController");

//user routes
router.post('/google-auth',userRegister);
router.post('/github-auth',userlogin);
router.post('/microsoft-auth',userlogin);


module.exports = router;