export interface PaymentResponse {
  id: string;
  applicationId: string;
  studentId: string;
  stage: number;
  amount: number;
  status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'REFUNDED' | 'MANUALLY_APPROVED';
  txnid?: string;
  mihpayid?: string;
  mode?: string;
  bankRefNum?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
  student?: {
    id: string;
    user: { name: string; email: string };
  };
  application?: {
    id: string;
    university?: { name: string; shortName: string };
  };
}

export interface ManualApprovePayload {
  paymentId: string;
  note?: string;
}

