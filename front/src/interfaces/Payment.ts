export interface PaymentMethod {
  id: number | string;  // 新規作成時は空文字列、既存のものは数値
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

export interface PaymentMethodsFormProps {
  paymentMethods: PaymentMethod[];
  editingPaymentMethod: number | null;
  onPaymentMethodChange: (index: number, field: keyof PaymentMethod, value: string) => void;
  onSavePaymentMethod: (index: number, updatedMethod: PaymentMethod) => void;
  setEditingPaymentMethod: (index: number | null) => void;
}
