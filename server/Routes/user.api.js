import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { findByEmail, findById } from '../models/user.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../lib/jwt.js';
import { getUserIdFromRequest } from '../middleware/auth.js';

const router = Router();

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7일 (ms)
  path: '/',
};

// POST /api/users/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findByEmail(email);
    if (!user) {
      return res.status(400).json({ status: 'Login fail', message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ status: 'Login fail', message: 'Invalid email or password' });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    const { password: _, ...userWithoutPassword } = user;

    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
    return res.json({ status: 'success', user: userWithoutPassword, accessToken });
  } catch (err) {
    return res.status(400).json({ status: 'Login fail', message: err.message });
  }
});

// POST /api/users/refresh
router.post('/refresh', (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ status: 'fail', message: 'No refresh token' });
    }

    const payload = verifyRefreshToken(token);
    const newAccessToken = generateAccessToken(payload.id);

    return res.json({ status: 'success', accessToken: newAccessToken });
  } catch {
    return res.status(401).json({ status: 'fail', message: 'Invalid refresh token' });
  }
});

// POST /api/users/logout
router.post('/logout', (_req, res) => {
  res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'lax', path: '/' });
  return res.json({ status: 'success', message: 'Logged out' });
});

// GET /api/users/me
router.get('/me', async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);
    const user = await findById(userId);
    if (!user) {
      return res.status(400).json({ status: 'fail', message: 'User not found' });
    }

    const { password: _, ...userWithoutPassword } = user;
    return res.json({ status: 'success', user: userWithoutPassword });
  } catch (err) {
    return res.status(401).json({ status: 'fail', message: err.message });
  }
});

export default router;
