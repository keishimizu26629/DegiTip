import { UserProfile, ExtraProfile } from '../interfaces/Profile';
import { UserSettings } from '../interfaces/User';
import { PaymentMethod } from '../interfaces/Payment';
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

export async function updateUserSettings(
  token: string,
  userSettings: Partial<UserSettings>,
): Promise<UserSettings> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userSettings),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update user settings');
  }

  return response.json();
}

export async function getUserSettingsAndPaymentMethods(token: string): Promise<UserSettings> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/settings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.error('Error response:', response);
    const errorData = await response.json();
    console.error('Error data:', errorData);
    throw new Error(errorData.message || 'Failed to fetch user settings');
  }

  const data = await response.json();

  // Decrypt payment method information
  if (data.paymentMethods) {
    data.paymentMethods = data.paymentMethods.map((method: PaymentMethod) => {
      try {
        return {
          ...method,
          key: method.key ? decrypt(method.key) : null,
          secret: method.secret ? decrypt(method.secret) : null,
          merchantId: method.merchantId ? decrypt(method.merchantId) : null,
        };
      } catch (error) {
        console.error('Decryption error:', error);
        return method; // または適切なエラー処理
      }
    });
  }

  return data;
}

/// PyamentのKey,Secret,MerchantIdを修正する関数
/// PayPayのみの実装。その他の支払い方法を実装する場合は userSettings['paymentMethods']の配列をループさせる。
export async function updatePaymentMethod(
  token: string,
  paymentMethods: Partial<PaymentMethod>,
): Promise<PaymentMethod> {
  const paymentMethod = paymentMethods;
  if (!paymentMethod) {
    throw new Error('Payment method not found');
  }
  const { key, secret, merchantId } = paymentMethod;
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/payment-methods`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      key: key,
      secret: secret,
      merchantId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update payment method');
  }

  return response.json();
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

export async function addPaymentMethod(token: string, paymentMethod: PaymentMethod): Promise<PaymentMethod> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/payment-methods`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      key: paymentMethod.key,
      secret: paymentMethod.secret,
      merchantId: paymentMethod.merchantId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to add payment method');
  }

  return await response.json();
}
