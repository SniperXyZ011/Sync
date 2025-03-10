import express from 'express';
import { register, login, logout, getOtherUsers, getAuthStatus } from '../controllers/userController.js';
import isAuthenticated from '../middleware/isAuthenticated.js';

const router = express.Router();

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/logout").get(logout);

router.route("/").get(isAuthenticated, getOtherUsers);

router.route("/auth-status").get(isAuthenticated, getAuthStatus);

export default router;