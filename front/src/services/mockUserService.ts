import { UserProfile, ExtraProfile } from '../interfaces/Profile';
import { UserSettings, PaymentMethod } from '../interfaces/User';

const mockExtraProfiles: ExtraProfile[] = [
  {
    id: 36,
    profileId: 3,
    title: '出身',
    content: 'Osaka',
    contentTypeId: 2,
    createdAt: '2024-07-04T21:50:35.346Z',
    updatedAt: '2024-07-04T21:50:35.346Z',
  },
  {
    id: 37,
    profileId: 3,
    title: 'ポートフォリオ',
    content: 'http://testtest.com',
    contentTypeId: 1,
    createdAt: '2024-07-04T21:50:35.346Z',
    updatedAt: '2024-07-04T21:50:35.346Z',
  },
];

const mockProfile: UserProfile = {
  id: 3,
  email: 'testtest@example.com',
  name: 'Test-5 User',
  displayName: 'Test',
  isPublic: true,
  memberNumber: '96615017',
  occupation: 'WEB Developer',
  avatarUrl: null,
  headerImageUrl: null,
  extraProfiles: mockExtraProfiles,
};

const mockUser: UserSettings = {
  id: 1,
  email: 'testtest@example.com',
  password: '$2a$10$w.7TzZA3RhT5vp2TqBh0XudAVAB8F71BdYvG7RDpFD3hTyzQrBBfq',
  name: 'Test-5 User',
  memberNumber: '96615017',
  emailVerified: true,
  emailVerifyToken: null,
  createdAt: '2024-07-01T09:39:54.086Z',
  updatedAt: '2024-07-01T09:50:12.355Z',
  profile: mockProfile,
  paymentMethods: [],
};

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 1,
    userId: 1,
    paymentTypeId: 1,
    key: 'sleufsefneheoiho44798492y6592r4e8ru8r83495tyf',
    secret: 'jf348ru4o48ut30u',
    merchantId: '3837493743743801'
  }
];

const mockPaymentTypes = [
  { id: 1, name: 'PayPay', enabled: true },
  { id: 2, name: 'Credit Card', enabled: false },
  { id: 3, name: 'Metamask', enabled: false },
];

export async function fetchProfileUser(memberNumber: string): Promise<UserProfile> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockUser.profile;
}

export async function fetchCurrentUser(token: string): Promise<UserSettings> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  // Token is not checked in this mock implementation
  mockUser.paymentMethods = mockPaymentMethods.filter(method => method.userId === mockUser.id);
  return mockUser;
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
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log('Profile updated:', updatedProfileUser);
}

export async function deleteExtraProfile(token: string, extraProfileId: number): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log('Extra profile deleted:', extraProfileId);
}

export async function updateUserSettings(token: string, settings: UserSettings): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log('Settings updated:', settings);
}

export async function fetchPaymentTypes(token: string): Promise<{ id: number; name: string }[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockPaymentTypes;
}

export async function updatePassword(
  token: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log('Password updated');
}
