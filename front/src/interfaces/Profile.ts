export interface ExtraProfile {
  id: number;
  title: string;
  content: string;
  contentTypeId: number;
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
}
