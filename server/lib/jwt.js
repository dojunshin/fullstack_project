import jwt from 'jsonwebtoken';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const JWT_REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY;

export const generateAccessToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET_KEY, { expiresIn: '15m' });
};

export const generateRefreshToken = (id) => {
  return jwt.sign({ id }, JWT_REFRESH_SECRET_KEY, { expiresIn: '7d' });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, JWT_SECRET_KEY);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, JWT_REFRESH_SECRET_KEY);
};
