import { Request, Response } from 'express';
import * as authService from '../services/authService';

export async function registerUser(req: Request, res: Response) {
  try {
    const { email, password, name } = req.body;
    const result = await authService.registerUser(email, password, name);
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'A user with this email already exists') {
        res.status(409).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
}
