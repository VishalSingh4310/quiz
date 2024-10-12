import { verifyToken } from '@helper/auth.helper';

const authMiddleware = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token)
    return res.status(401).json({ error: 'Access Denied / Unauthorized request' });

  try {
    token = token.split(' ')[1];
    if (token === 'null' || !token)
      return res.status(401).json({ error: 'Unauthorized request' });
    let verifiedUser = verifyToken(token);
    if (!verifiedUser) return res.status(401).json({ error: 'Unauthorized request' });

    req.user = verifiedUser;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid Token' });
  }
};

export default authMiddleware;
