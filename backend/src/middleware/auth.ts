import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { JWTPayload } from '../types';
import { loadEnvironment } from '../utils/constants';

const env = loadEnvironment();

// Lazy initialization to avoid database access during module loading
let userService: UserService;
function getUserService(): UserService {
  if (!userService) {
    userService = new UserService();
  }
  return userService;
}

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({ success: false, error: 'Access token required' });
    return;
  }

  jwt.verify(token, env.JWT_SECRET, async (err: any, decoded: any) => {
    if (err) {
      res.status(403).json({ success: false, error: 'Invalid or expired token' });
      return;
    }

    const payload = decoded as JWTPayload;
    
    try {
      const user = await getUserService().getUserById(payload.userId);
      if (!user) {
        res.status(403).json({ success: false, error: 'User not found' });
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(500).json({ success: false, error: 'Authentication failed' });
    }
  });
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Authentication required' });
    return;
  }

  if (!req.user.is_admin) {
    res.status(403).json({ success: false, error: 'Admin privileges required' });
    return;
  }

  next();
}

export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    next();
    return;
  }

  jwt.verify(token, env.JWT_SECRET, async (err: any, decoded: any) => {
    if (!err && decoded) {
      const payload = decoded as JWTPayload;
      
      try {
        const user = await getUserService().getUserById(payload.userId);
        if (user) {
          req.user = user;
        }
      } catch (error) {
        // Ignore errors for optional auth
      }
    }
    
    next();
  });
}
