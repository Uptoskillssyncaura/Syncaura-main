import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

export const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.query.token) {
      token = req.query.token;
    }

    if (!token) return res.status(401).json({ message: 'Unauthorized' });

//    console.log("Authorization Header:", req.headers.authorization);
// console.log("Extracted Token:", token); 

    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Fetch full active user from DB
    const result = await pool.query("SELECT * FROM users WHERE id = $1 AND is_active = true", [payload.sub || payload.id]);
    if (result.rowCount === 0) return res.status(401).json({ message: 'User not found or account deactivated' });



    const user = result.rows[0];
    delete user.password_hash;
    req.user = user;
    
    // Map Google tokens if needed
    req.googleTokens = {
      access_token: user.google_access_token,
      refresh_token: user.google_refresh_token,
      scope: user.google_scope,
      token_type: user.google_token_type,
      expiry_date: user.google_expiry_date
    };
    
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      console.warn(`[Auth] Access token expired for ${req.method} ${req.originalUrl}`);
    } else {
      console.error('Auth error:', err.message);
    }
    return res.status(401).json({
      message: "Invalid or expired token",
      error: err.message
    });
  }
}

export const requireRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  return next();
};

export const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden: Admin access required.' });
};
