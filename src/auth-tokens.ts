import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from './entity/User';

export interface JwtData {
  userId: string;
  username: string;
  email: string;
  role: 'user' | 'admin' | string;
}

export interface JwtRefreshData {
  userId: string;
  version: number;
}

export const signToken = (user: User) =>
  jwt.sign(
    {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role.name,
    },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );

export const signRefreshToken = (user: User) =>
  jwt.sign(
    {
      userId: user.id,
      version: user.tokenVersion,
    },
    process.env.JWT_REFRESH_SECRET!,
    {
      expiresIn: '90d',
    }
  );

export const verifyToken = (token: string): JwtData =>
  jwt.verify(token, process.env.JWT_SECRET!) as any;

export const verifyRefreshToken = (token: string): JwtRefreshData =>
  jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as any;

export const setCookieRefreshToken = (res: Response, token: string) => {
  res.cookie('john', token);
};
