import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { UserService } from '../services/userService';
import { authenticateToken } from '../middleware/auth';
import { LoginInput, RegisterInput, ApiResponse } from '../types';
import { loadEnvironment } from '../utils/constants';

const router = Router();
const userService = new UserService();
const env = loadEnvironment();

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ 
        success: false, 
        error: 'Validation failed',
        details: errors.array()
      });
      return;
    }

    const { email, password }: LoginInput = req.body;
    
    const user = await userService.validatePassword(email, password);
    if (!user) {
      res.status(401).json({ 
        success: false, 
        error: 'Invalid email or password' 
      });
      return;
    }

    const payload = {
      userId: user.id,
      email: user.email,
      isAdmin: user.is_admin
    };
    
    const token = jwt.sign(payload, env.JWT_SECRET as string, {
      expiresIn: env.JWT_EXPIRES_IN
    } as jwt.SignOptions);

    const response: ApiResponse = {
      success: true,
      data: { user, token }
    };

    res.json(response);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').optional().trim().isLength({ min: 1 })
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ 
        success: false, 
        error: 'Validation failed',
        details: errors.array()
      });
      return;
    }

    const { email, password, name }: RegisterInput = req.body;
    
    // Check if user already exists
    const existingUser = await userService.emailExists(email);
    if (existingUser) {
      res.status(409).json({ 
        success: false, 
        error: 'User with this email already exists' 
      });
      return;
    }

    const createUserInput: any = {
      email,
      password,
      is_admin: false
    };

    if (name) {
      createUserInput.name = name;
    }

    const user = await userService.createUser(createUserInput);

    const payload = {
      userId: user.id,
      email: user.email,
      isAdmin: user.is_admin
    };
    
    const token = jwt.sign(payload, env.JWT_SECRET as string, {
      expiresIn: env.JWT_EXPIRES_IN
    } as jwt.SignOptions);

    const response: ApiResponse = {
      success: true,
      data: { user, token }
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    const response: ApiResponse = {
      success: true,
      data: req.user
    };

    res.json(response);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Update profile
router.put('/profile', [
  authenticateToken,
  body('name').optional().trim().isLength({ min: 1 }),
  body('theme_preference').optional().isIn(['light', 'dark', 'system'])
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ 
        success: false, 
        error: 'Validation failed',
        details: errors.array()
      });
      return;
    }

    const updates = req.body;
    const user = await userService.updateUserProfile(req.user!.id, updates);

    const response: ApiResponse = {
      success: true,
      data: user
    };

    res.json(response);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Logout (client-side token invalidation)
router.post('/logout', (req: Request, res: Response) => {
  res.json({ 
    success: true, 
    message: 'Logged out successfully' 
  });
});

export default router;
