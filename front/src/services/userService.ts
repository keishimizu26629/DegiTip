import { UserProfile, ExtraProfile } from '../interfaces/Profile';
import { decrypt } from '../utils/cryptApiKey';

export async function fetchProfileUser(memberNumber: string): Promise<UserProfile> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${memberNumber}`);
  if (!response.ok) {
    throw new Error('Failed to fetch profile data');
  }
  return await response.json();
}

export async function fetchCurrentUser(token: string): Promise<UserProfile> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
}

export async function updateProfileUser(
  token: string,
  updatedProfileUser: {
    avatarUrl?: string;
    headerImageUrl?: string;
    displayName?: string;
    occupation?: string;
    isPublic?: boolean;
    ExtraProfile?: ExtraProfile[];
  },
): Promise<void> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedProfileUser),
  });

  if (!response.ok) {
    throw new Error('Failed to update profile');
  }
}

export async function deleteExtraProfile(token: string, extraProfileId: number): Promise<void> {
  console.log(token);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/me/extra-profiles/delete`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ extraProfileId }),
    },
  );

  if (!response.ok) {
    throw new Error('Failed to delete extra profile');
  }
}
export async function getUserSettings(token: string): Promise<UserSettings> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/settings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch user settings');
  }

  const data = await response.json();

  // Decrypt payment method information
  if (data.paymentMethods) {
    data.paymentMethods = data.paymentMethods.map((method: PaymentMethod) => ({
      ...method,
      key: method.key ? decrypt(method.key) : null,
      secret: method.secret ? decrypt(method.secret) : null,
      merchantId: method.merchantId ? decrypt(method.merchantId) : null,
    }));
  }

  return data;
}

export async function changePassword(
  token: string,
  currentPassword: string,
  newPassword: string,
  confirmNewPassword: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
        confirmNewPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to change password');
    }

    return {
      success: true,
      message: data.message || 'Password changed successfully',
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    } else {
      return {
        success: false,
        message: 'An unexpected error occurred',
      };
    }
  }
}
