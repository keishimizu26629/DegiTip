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

export const getUserByMemberNumber = async (req: Request, res: Response) => {
  const { memberNumber } = req.params;

  try {
    const userProfile = await userService.getUserByMemberNumber(memberNumber);
    if (!userProfile) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(userProfile);
  } catch (error) {
    console.error('Error fetching user by member number:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error', error: 'Unknown error' });
    }
  }
};


export async function getProfile(req: Request, res: Response) {
  const userId = req.user?.userId;

  if (typeof userId !== 'number') {
    return res.status(400).json({ error: 'User ID is missing or invalid' });
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

export async function updateProfilePost(req: Request, res: Response) {
  const { id, ...updateData } = req.body; // リクエストボディからIDと更新データを取得

  if (typeof id !== 'number') {
    return res.status(400).json({ error: 'User ID is required and must be a number' });
  }

  try {
    const updatedUser = await userService.updateUserById(id, updateData);
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

export const updateProfile = async (req: Request, res: Response) => {
  const userId = req.user?.userId; // authenticateToken ミドルウェアで設定されたユーザーID

  if (typeof userId !== 'number') {
    return res.status(400).json({ error: 'User ID is missing or invalid' });
  }

  try {
    const profileData = req.body;
    const updatedProfile = await userService.updateProfile(userId, profileData);
    res.json(updatedProfile);
  } catch (error: unknown) {
    console.error('Error updating profile:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error', error: 'Unknown error' });
    }
  }
};
