import jwt from 'jsonwebtoken';

const protect = async (req, res, next) => {
  try {
    let token = null;
    
    // Get token from cookie
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    
    // If not in cookie, check Authorization header
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.replace('Bearer ', '');
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
    
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.'
    });
  }
};

export default auth;