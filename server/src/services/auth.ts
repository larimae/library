import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import dotenv from 'dotenv';
dotenv.config();

interface JwtPayload {
  _id: unknown;
  username: string;
  email: string,
}

export const authenticateToken = async (authHeader: string | undefined): Promise<JwtPayload | null> => {
  if (!authHeader) {
    return null;
  }

    const token = authHeader.split(' ')[1];
    const secretKey = process.env.JWT_SECRET_KEY || '';

    try {
      const decode = jwt.verify(token, secretKey) as JwtPayload;
      return decode;
    } catch (err) {
      console.error('Invalid token', err);
      return null;
    }
  }

export const signToken = (username: string, email: string, _id: string) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
}
