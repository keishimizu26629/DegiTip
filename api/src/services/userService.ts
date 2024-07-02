import { PrismaClient, Prisma } from '@prisma/client';

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
    avatarUrl: user.profile.avatarURL,
    headerImageUrl: user.profile.headerImageURL,
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

export async function updateUserById(userId: number, updateData: any) {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      emailVerified: updateData.emailVerified,
    },
  });

  return updatedUser;
}

export async function updateProfile(
  userId: number,
  profileData: {
    avatarURL?: string;
    headerImageURL?: string;
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
              avatarURL: profileData.avatarURL,
              headerImageURL: profileData.headerImageURL,
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
              avatarURL: profileData.avatarURL,
              headerImageURL: profileData.headerImageURL,
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
