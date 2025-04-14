import express from "express"
const router = express.Router();
import {userRegister} from "../controllers/userController.js";
import {userlogin} from "../controllers/userController.js"

//user routes
router.post('/google-auth',userRegister);
router.post('/github-auth',userlogin);
router.post('/microsoft-auth',userlogin);

export default router;
// module.exports = router;

// // src/routes/userRoutes.js
// import { Router } from 'express';
// import { userRegister, userLogin } from '../controllers/userController.js';


// router.post('/register', userRegister);
// router.post('/login', userLogin);