export const requireSelf = (req, res, next) => {
  try {
    // ---------------------------------------
    // 1. User must be authenticated
    // ---------------------------------------
    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorized'
      });
    }

    // ---------------------------------------
    // 2. Only normal users use this middleware
    // ---------------------------------------
    if (req.user.role !== 'user') {
      return res.status(403).json({
        message: 'Forbidden: User access required'
      });
    }

    // ---------------------------------------
    // 3. Get target user ID from route
    // ---------------------------------------
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        message: 'User ID is required'
      });
    }

    // ---------------------------------------
    // 4. User can access only their own ID
    // ---------------------------------------
    if (req.user.id !== userId) {
      return res.status(403).json({
        message: 'Forbidden: You can only access your own data'
      });
    }

    next();

  } catch (err) {
    console.error('User authorization error:', err);
    next(err);
  }
};