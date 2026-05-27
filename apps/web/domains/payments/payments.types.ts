export interface InitiatePaymentDto {
  applicationId: string;
  stage: number;
  firstName: string;
  email: string;
  phone?: string;
}

export interface PayUHashResponse {
  paymentId: string;
  hash: string;
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  surl: string;
  furl: string;
  service_provider: string;
  udf1: string;
  udf2: string;
  udf3: string;
  udf4: string;
  udf5: string;
}

export interface VerifyPaymentDto {
  status: string;
  txnid: string;
  mihpayid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  hash: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
  error?: string;
  error_Message?: string;
  bank_ref_num?: string;
  payumoney_id?: string;
  card_type?: string;
  mode?: string;
}

export interface PaymentHistoryItem {
  id: string;
  studentId: string;
  applicationId: string;
  stage: number;
  amount: number;
  currency: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED' | 'MANUALLY_APPROVED';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  paymentMethod?: string;
  bankReference?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentConfig {
  stage: number;
  label: string;
  amount: number;
  description: string;
}
