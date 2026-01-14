import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// This extends the Express Request type to include the user data from the token
export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    // 1. Get the token from the Header (Bearer <token>)
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access Denied: No Token Provided" });
    }

    try {
      // 2. Verify Token
      const secret = process.env.JWT_ACCESS_SECRET || 'your_fallback_secret_key';
      const decoded = jwt.verify(token, secret) as { id: string, role: string };

      // 3. Check Role Clearance
      if (!roles.includes(decoded.role)) {
        return res.status(403).json({ 
          message: `Forbidden: This action requires one of these roles: ${roles.join(", ")}` 
        });
      }

      // 4. Attach user info to request and move to the controller
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(403).json({ message: "Token is invalid or expired" });
    }
  };
};