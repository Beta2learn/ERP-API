import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "../models/users"; // Ensure UserRole is correctly imported

// Augment for the Request interface to include user information
declare global {
  namespace Express {
    interface Request {
      user?: { 
        userId: string; 
        email: string; 
        role: UserRole; 
        verified: boolean;
      };
    }
  }
}

// Middleware function with role-based authorization
const authMiddleware = (req: Request, res:Response, next: NextFunction) => {
  
    try {
      // Extract token from Authorization header or cookies
      const token = req.cookies.Authorization?.split(" ")[1] || req.headers.authorization?.split(" ")[1];

      if (!token) {
        res.status(401).json({ success: false, message: "Access denied. No token provided." });
        return;
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string);
      req.user = decoded as { 
        userId: string; 
        email: string; 
        role: UserRole; 
        verified: boolean 
      };


      next();
    } catch (error) {
      res.status(403).json({ success: false, message: "Invalid or expired token." });
    }
  };


// Admin middleware
const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Ensure the user is available in the request and has the right role
    if (!req.user) {
      res.status(401).json({ success: false, message: "Access denied. No user information." });
      return;
    }

    // Check if the user has an admin role
    if (req.user.role !== UserRole.ADMIN) {
      res.status(403).json({ success: false, message: "Access forbidden: You don't have admin rights." });
      return;
    }

    // If the role is correct, allow access
    next();
  } catch (error) {
    res.status(403).json({ success: false, message: "An error occurred while verifying the admin role." });
  }
};

export { authMiddleware, adminMiddleware };
