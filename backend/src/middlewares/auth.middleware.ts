import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth.utils';

// Extend Request interface to add user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
      };
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    const token = authHeader.substring(7); 
    
    const decoded = verifyToken(token);
    
    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };
    
    next();
  } catch (error: any) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Middleware to check permissions by role
export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ 
        message: 'You do not have permission to perform this action' 
      });
      return;
    }

    next();
  };
};
