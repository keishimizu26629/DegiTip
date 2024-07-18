import { UserProfile } from './Profile';
import { PaymentMethod } from './Payment';

export interface UserSettings {
  id: number;
  email: string;
  name: string;
  memberNumber: string;
  emailVerified?: boolean;
  emailVerifyToken?: string | null;
  createdAt?: string;
  updatedAt?: string;
  profile?: UserProfile;
  paymentMethods?: PaymentMethod[];
}
