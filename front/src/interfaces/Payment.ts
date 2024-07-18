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
  name: string;
}
