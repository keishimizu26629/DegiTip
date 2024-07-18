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
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getUserSettings(req: Request, res: Response) {
  const userId = req.user?.userId;

  if (typeof userId !== 'number') {
    return res.status(400).json({ error: 'User ID is missing or invalid' });
  }

  try {
    const user = await userService.getUserSettings(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateProfilePost(req: Request, res: Response) {
  const { id, ...updateData } = req.body;
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

/// プロフィールの情報を更新するメソッド
export const updateProfile = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
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

export const deleteExtraProfile = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (typeof userId !== 'number') {
    return res.status(400).json({ error: 'User ID is missing or invalid' });
  }

  const { extraProfileId } = req.body;

  try {
    await userService.deleteExtraProfile(userId, parseInt(extraProfileId));
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting extra profile:', error);
    res.status(500).json({ error: 'Failed to delete extra profile' });
  }
};

/// ユーザー基本情報を変更する関数
export const updateUserSettings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { name, email, memberNumber } = req.body;
    const updatedUser = await userService.updateUserSettings(userId, { name, email, memberNumber });
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user settings:', error);
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

/// PaymentMethodsを変更する関数
export async function updatePaymentMethods(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { key, secret, merchantId } = req.body;
    const updatedPayment = await userService.updatePaymentMethods(userId, {
      key,
      secret,
      merchantId,
    });

    // 機密情報を除外してクライアントに返す
    const safePaymentInfo = {
      id: updatedPayment.id,
      userId: updatedPayment.userId,
      paymentTypeId: updatedPayment.paymentTypeId,
      paymentType: updatedPayment.paymentType,
      key: updatedPayment.key,
      secret: updatedPayment.secret,
      merchantId: updatedPayment.merchantId,
    };

    res.json(safePaymentInfo);
  } catch (error) {
    console.error('Error updating payment methods:', error);
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

/// パスワード変更する関数
export async function changePassword(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ success: false, message: 'New passwords do not match' });
    }

    const result = await userService.changePassword(userId!, currentPassword, newPassword);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ success: false, message: error.message });
    } else {
      res.status(500).json({ success: false, message: 'An unexpected error occurred' });
    }
  }
}
