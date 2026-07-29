import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config'; 

export const someToken = uuidv4();

export const generateAccessToken = (user) => {
  return jwt.sign(
    { role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES, subject: String(user.id || user._id) }
  );
};

export const generateRefreshToken = (user, refreshId) => {
  return jwt.sign(
    { rid: refreshId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES, subject: String(user.id || user._id) }
  );
};

export const assignRefreshId = (user) => {
  const rid = uuidv4();
  user.refreshTokenId = rid;
  return rid;
};
