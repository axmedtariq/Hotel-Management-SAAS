import express from 'express';
// Import the controllers you already have
import { registerUser, loginUser, logoutUser } from '../controller/authcontroller.ts'; 

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Registers a new user (Admin, Receptionist, or Guest)
 */
router.post('/register', registerUser);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticates a user and returns a JWT token
 */
router.post('/login', loginUser);

/**
 * @route   POST /api/auth/logout
 * @desc    Handled mostly on frontend, but kept for API completeness
 */
router.post('/logout', logoutUser);

export default router;