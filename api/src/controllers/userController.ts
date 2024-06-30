import { Request, Response } from 'express';
import * as userService from '../services/userService';

export async function getAllUsers(req: Request, res: Response) {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}

export async function getUser(req: Request, res: Response) {
  const { memberNumber } = req.params;
  try {
    const user = await userService.getUserByMemberNumber(memberNumber);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getProfile(req: Request, res: Response) {
  const userId = req.user?.userId;

  if (userId === undefined) {
    return res.status(400).json({ error: 'User ID is missing' });
  }

  try {
    const user = await userService.getUserById(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateProfile(req: Request, res: Response) {
  const userId = req.user?.userId; // authenticateToken ミドルウェアによって設定される
  const updateData = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const updatedUser = await userService.updateUser(userId, updateData);
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
}
