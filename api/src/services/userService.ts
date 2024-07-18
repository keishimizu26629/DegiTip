import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { encrypt, decrypt } from '../utils/cryptApiKey';

const prisma = new PrismaClient();

export async function getAllUsers() {
  return prisma.user.findMany();
}

export async function getUserByMemberNumber(memberNumber: string) {
  const user = await prisma.user.findUnique({
    where: { memberNumber },
    include: {
      profile: {
        include: {
          extraProfiles: true,
        },
      },
    },
  });

  if (!user || !user.profile) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    displayName: user.profile.displayName,
    isPublic: user.profile.isPublic,
    memberNumber: user.memberNumber,
    occupation: user.profile.occupation,
    avatarUrl: user.profile.avatarUrl,
    headerImageUrl: user.profile.headerImageUrl,
    extraProfiles: user.profile.extraProfiles.map((ep) => ({
      id: ep.id,
      title: ep.title,
      content: ep.content,
      contentTypeId: ep.contentTypeId,
    })),
  };
}

export async function getUserById(userId: number) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: {
        include: {
          extraProfiles: true,
        },
      },
    },
  });
}

export async function getUserSettings(userId: number) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      memberNumber: true,
      paymentMethods: {
        select: {
          id: true,
          paymentTypeId: true,
          key: true,
          secret: true,
          merchantId: true,
          paymentType: {
            select: {
              id: true,
              name: true,
              enabled: true,
            },
          },
        },
      },
    },
  });
}

export async function updateUserById(userId: number, updateData: any) {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      emailVerified: updateData.emailVerified,
      emailVerifyToken: updateData.emailVerifyToken
    },
  });

  return updatedUser;
}

export async function updateProfile(
  userId: number,
  profileData: {
    avatarUrl?: string;
    headerImageUrl?: string;
    displayName?: string;
    occupation?: string;
    isPublic: boolean;
    ExtraProfile?: Array<{
      id?: number;
      title: string;
      content: string;
      contentTypeId: number;
    }>;
  },
) {
  try {
    // ExtraProfilesを更新と新規作成に分類
    const existingExtraProfiles = profileData.ExtraProfile?.filter((ep) => ep.id) || [];
    const newExtraProfiles = profileData.ExtraProfile?.filter((ep) => !ep.id) || [];

    return await prisma.user.update({
      where: { id: userId },
      data: {
        profile: {
          upsert: {
            create: {
              avatarUrl: profileData.avatarUrl,
              headerImageUrl: profileData.headerImageUrl,
              displayName: profileData.displayName,
              occupation: profileData.occupation,
              isPublic: profileData.isPublic,
              extraProfiles: {
                create: newExtraProfiles.map((ep) => ({
                  title: ep.title,
                  content: ep.content,
                  contentTypeId: ep.contentTypeId,
                })),
              },
            },
            update: {
              avatarUrl: profileData.avatarUrl,
              headerImageUrl: profileData.headerImageUrl,
              displayName: profileData.displayName,
              occupation: profileData.occupation,
              isPublic: profileData.isPublic,
              extraProfiles: {
                updateMany: existingExtraProfiles.map((ep) => ({
                  where: { id: ep.id },
                  data: {
                    title: ep.title,
                    content: ep.content,
                    contentTypeId: ep.contentTypeId,
                  },
                })),
                create: newExtraProfiles.map((ep) => ({
                  title: ep.title,
                  content: ep.content,
                  contentTypeId: ep.contentTypeId,
                })),
              },
            },
          },
        },
      },
      include: {
        profile: {
          include: {
            extraProfiles: true,
          },
        },
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors
      throw new Error(`Prisma error: ${error.message}`);
    } else if (error instanceof Error) {
      // Handle other errors
      throw new Error(`Unknown error: ${error.message}`);
    } else {
      // Handle unexpected errors
      throw new Error('Unexpected error');
    }
  }
}

export const deleteExtraProfile = async (userId: number, extraProfileId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });

  if (!user || !user.profile) {
    throw new Error('User or profile not found');
  }

  await prisma.extraProfile.deleteMany({
    where: {
      id: extraProfileId,
      profile: {
        userId: userId,
      },
    },
  });
};

export const updateUserSettings = async (userId: number, data: { name?: string; email?: string; memberNumber?: string }) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
        memberNumber: data.memberNumber,
      },
      include: {
        profile: true,
        paymentMethods: true,
      },
    });
    return updatedUser;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new Error('Member number already exists');
      }
    }
    throw error;
  }
};

export const updatePaymentMethods = async (userId: number, data: { key: string; secret: string; merchantId: string }) => {
  try {
    // 既存のPaymentMethodを取得
    const existingPaymentMethod = await prisma.paymentMethod.findFirst({
      where: { userId: userId },
    });

    if (!existingPaymentMethod) {
      throw new Error('Payment method not found');
    }

    // データを暗号化
    const encryptedKey = encrypt(data.key);
    const encryptedSecret = encrypt(data.secret);
    const encryptedMerchantId = encrypt(data.merchantId);

    // 暗号化されたデータで更新
    const updatedPayment = await prisma.paymentMethod.update({
      where: { id: existingPaymentMethod.id },
      data: {
        key: encryptedKey,
        secret: encryptedSecret,
        merchantId: encryptedMerchantId,
      },
      include: { paymentType: true } // PaymentTypeも含めて取得
    });

    // 更新されたデータを復号化して返す
    return {
      ...updatedPayment,
      key: decrypt(updatedPayment.key),
      secret: decrypt(updatedPayment.secret),
      merchantId: decrypt(updatedPayment.merchantId!),
      paymentType: updatedPayment.paymentType
    };
  } catch (error) {
    throw error;
  }
};

export async function changePassword(userId: number, currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    return { success: false, message: 'User not found' };
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordValid) {
    return { success: false, message: 'Current password is incorrect' };
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedNewPassword },
  });

  return { success: true, message: 'Password changed successfully' };
}
