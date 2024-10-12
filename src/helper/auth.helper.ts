import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

// Hash a password
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Compare a password with a hash
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

// Generate a JWT
export const generateToken = (payload: any): string => {
  const secretKey = process.env.TOKEN_SECRET;
  const options: jwt.SignOptions = {
    expiresIn: '1h'
  };
  return jwt.sign(payload, secretKey, options);
};
// verify token
export const verifyToken = (token: string): any => {
  const secretKey = process.env.TOKEN_SECRET;
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    return null;
  }
};
