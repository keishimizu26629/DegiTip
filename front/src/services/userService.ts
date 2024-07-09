import { UserProfile, ExtraProfile } from '../interfaces/Profile';

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
    avatarURL?: string;
    headerImageURL?: string;
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
