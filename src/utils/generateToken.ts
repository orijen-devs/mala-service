import { Response } from 'express';
import jwt from 'jsonwebtoken';

export const generateToken = (res: Response, user: string) => {

  // for some reason, jwt cannot read token value from .env file
  const token = jwt.sign({ user }, 'secret-key', {
    expiresIn: '30d',
  });

  res.cookie('acc_tk', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
    sameSite: 'strict', // Prevent CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  }); 
};
 