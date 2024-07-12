export interface ExtraProfile {
  id?: number;
  profileId?: number;
  title: string;
  content: string;
  contentTypeId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile {
  id: number;
  email: string;
  name: string;
  displayName: string;
  isPublic: Boolean;
  memberNumber: string;
  occupation: string | null;
  avatarUrl: string | null;
  headerImageUrl: string | null;
  extraProfiles: ExtraProfile[];
  error?: string;
  details?: string;
}
