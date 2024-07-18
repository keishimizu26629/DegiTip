export interface PaymentMethod {
  id: number;
  userId: number;
  paymentTypeId: number;
  key: string | null;
  secret: string | null;
  merchantId: string | null;
  paymentType: PaymentType;
}

export interface PaymentType {
  id?: number;
  name: string;
  enabled: boolean;
}
