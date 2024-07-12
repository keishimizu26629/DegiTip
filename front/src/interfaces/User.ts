import { UserProfile } from './Profile';

export interface PaymentMethod {
  id: number;
  userId: number;
  paymentTypeId: number;
  key: string;
  secret: string;
  merchantId: string | null;
}

export interface UserSettings {
  id: number;
  email: string;
  password: string;
  name: string;
  memberNumber: string;
  emailVerified: boolean;
  emailVerifyToken: string | null;
  createdAt: string;
  updatedAt: string;
  profile: UserProfile;
  paymentMethods: PaymentMethod[];
}
