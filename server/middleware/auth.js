import { verifyAccessToken } from '../lib/jwt.js';

export function getUserIdFromRequest(req) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) throw new Error('No token');

  const token = authHeader.replace('Bearer ', '');
  const payload = verifyAccessToken(token);
  return payload.id;
}
