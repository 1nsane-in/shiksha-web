import {
  IsString,
  IsNumber,
  IsUUID,
  IsOptional,
  IsEmail,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InitiatePayUPaymentDto {
  @ApiProperty({ description: 'Application UUID' })
  @IsUUID()
  applicationId: string;

  @ApiProperty({
    description: 'Stage number (2 for admission fee, 3 for exam fee)',
    example: 2,
  })
  @IsNumber()
  stage: number;

  @ApiProperty({ description: 'Student first name' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Student email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Phone number', required: false })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class PayUHashResponseDto {
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

export class VerifyPayUPaymentDto {
  @ApiProperty()
  @IsString()
  status: string;

  @ApiProperty()
  @IsString()
  txnid: string;

  @ApiProperty()
  @IsString()
  mihpayid: string;

  @ApiProperty()
  @IsString()
  amount: string;

  @ApiProperty()
  @IsString()
  productinfo: string;

  @ApiProperty()
  @IsString()
  firstname: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  hash: string;

  @ApiProperty({ required: false })
  @IsOptional()
  udf1?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  udf2?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  udf3?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  udf4?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  udf5?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  error?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  error_Message?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  bank_ref_num?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  payumoney_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  card_type?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  mode?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  additionalCharges?: string;
}

export class ManualPaymentApprovalDto {
  @IsUUID()
  paymentId: string;

  @IsOptional()
  @IsString()
  note?: string;
}

export const STAGE_PAYMENT_CONFIG: Record<
  number,
  { label: string; amount: number; description: string }
> = {
  2: {
    label: 'Admission Fee',
    amount: 5000,
    description: 'Admission letter processing fee',
  },
  3: {
    label: 'Exam Fee',
    amount: 10000,
    description: 'Entrance examination fee',
  },
};

export function generatePayUHash(data: {
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  salt: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
}): string {
  const crypto = require('crypto');
  const hashString = [
    data.key,
    data.txnid,
    data.amount,
    data.productinfo,
    data.firstname,
    data.email,
    data.udf1 || '',
    data.udf2 || '',
    data.udf3 || '',
    data.udf4 || '',
    data.udf5 || '',
    '',
    '',
    '',
    '',
    '',
    data.salt,
  ].join('|');
  return crypto
    .createHash('sha512')
    .update(hashString)
    .digest('hex')
    .toLowerCase();
}

export function verifyPayUResponse(params: {
  status: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  salt: string;
  key: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
  additionalCharges?: string;
}): string {
  const crypto = require('crypto');
  // PayU reverse hash: salt|status|||||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
  let hashString: string;
  if (params.additionalCharges) {
    hashString = [
      params.additionalCharges,
      params.salt,
      params.status,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      params.udf5 || '',
      params.udf4 || '',
      params.udf3 || '',
      params.udf2 || '',
      params.udf1 || '',
      params.email,
      params.firstname,
      params.productinfo,
      params.amount,
      params.txnid,
      params.key,
    ].join('|');
  } else {
    hashString = [
      params.salt,
      params.status,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      params.udf5 || '',
      params.udf4 || '',
      params.udf3 || '',
      params.udf2 || '',
      params.udf1 || '',
      params.email,
      params.firstname,
      params.productinfo,
      params.amount,
      params.txnid,
      params.key,
    ].join('|');
  }
  return crypto
    .createHash('sha512')
    .update(hashString)
    .digest('hex')
    .toLowerCase();
}
