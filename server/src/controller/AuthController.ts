import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.ts'; 
import { AuthRequest } from '../middleware/auth.ts';

// --- REGISTER USER ---
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) return res.status(400).json({ message: "User already registered" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: role || 'guest'
        });

        const secret = process.env.JWT_ACCESS_SECRET || 'your_fallback_secret_key';
        const token = jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn: '1d' });

        res.status(201).json({
            message: "Registration successful",
            token,
            user: { id: user._id, name: user.name, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error during registration", error });
    }
};

// --- LOGIN USER ---
export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // 1. Find user and include password for comparison
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // 2. Compare entered password with hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // 3. Generate Token
        const secret = process.env.JWT_ACCESS_SECRET || 'your_fallback_secret_key';
        const token = jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn: '1d' });

        res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user._id, name: user.name, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: "Login failed", error });
    }
};

// --- LOGOUT USER ---
export const logoutUser = async (req: AuthRequest, res: Response) => {
    try {
        // In JWT, logout is mostly handled by the frontend deleting the token.
        // On the backend, we return success to confirm the session end.
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Logout failed", error });
    }
};