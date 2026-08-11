import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config'; 

export const someToken = uuidv4();

export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET || process.env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );
};

export const generateRefreshToken = (user, rid) => {
  return jwt.sign(
    { id: user.id, rid },
    process.env.REFRESH_TOKEN_SECRET || process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

export const assignRefreshId = (user) => {
  const rid = uuidv4();
  user.refreshTokenId = rid;
  return rid;
};
