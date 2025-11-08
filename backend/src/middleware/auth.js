
import jwt from 'jsonwebtoken';
export const auth = (roles = []) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      if (roles.length && !roles.includes(user.role))
        return res.status(403).json({ error: 'Access denied' });
      req.user = user;
      next();
    } catch {
      res.status(401).json({ error: 'Invalid token' });
    }
  };
};
