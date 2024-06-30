export interface User {
  id: number;
  name: string | null;
  email: string;
  memberNumber: string;
  profiles?: Profile[];
}

export interface Profile {
  id: number;
  title: string;
  content: string;
  contentType: ContentType;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContentType {
  id: number;
  name: string;
}
