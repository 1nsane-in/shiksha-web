// Bank field config registry — country-driven dynamic bank details
// Each MBBS destination country defines its required/optional bank fields.
// Config shared between frontend (form rendering) and backend (validation).

export interface BankFieldConfig {
  name: string;
  label: string;
  placeholder: string;
  required: boolean;
  type: 'text' | 'number' | 'textarea';
  hint?: string;
  pattern?: string; // regex pattern for validation
}

export interface CountryBankConfig {
  countryCode: string;
  countryName: string;
  fields: BankFieldConfig[];
}

// All countries use `bankDetails` JSON object keyed by `field.name`.
// Example for RU: { recipientName: "ФГБОУ ВО ПГМУ", recipientBank: "...", ... }
export const BANK_CONFIGS: Record<string, CountryBankConfig> = {
  RU: {
    countryCode: 'RU',
    countryName: 'Russia',
    fields: [
      { name: 'recipientName',    label: 'Recipient Name',          placeholder: 'Получатель — full legal name',                      required: true, type: 'text' },
      { name: 'recipientBank',    label: 'Recipient Bank',          placeholder: 'Банк получателя — full bank name',                  required: true, type: 'text' },
      { name: 'bankIdCode',       label: 'Bank ID Code (БИК)',      placeholder: '9-digit БИК (starts with 04)',                      required: true, type: 'text', pattern: '^04\\d{7}$' },
      { name: 'recipientInn',     label: 'Recipient INN (ИНН)',     placeholder: '10 or 12 digits',                                   required: true, type: 'text', pattern: '^\\d{10}(\\d{2})?$' },
      { name: 'recipientKpp',     label: 'Recipient KPP (КПП)',     placeholder: '9-digit КПП',                                       required: true, type: 'text', pattern: '^\\d{9}$' },
      { name: 'singleTreasuryAccount', label: 'Single Treasury Account (ЕКС)', placeholder: 'ЕКС — 20 digits starting with 30101', required: true, type: 'text', pattern: '^30101\\d{15}$' },
    ],
  },
  KZ: {
    countryCode: 'KZ',
    countryName: 'Kazakhstan',
    fields: [
      { name: 'beneficiaryName',    label: 'Beneficiary Name',       placeholder: 'Full legal name of beneficiary',                    required: true, type: 'text' },
      { name: 'beneficiaryAddress', label: 'Beneficiary Address',    placeholder: 'Full address',                                      required: true, type: 'text' },
      { name: 'iban',               label: 'IBAN',                   placeholder: 'KZ + 20 characters',                               required: true, type: 'text', pattern: '^KZ[A-Z0-9]{20}$' },
      { name: 'bicSwift',           label: 'BIC / SWIFT',            placeholder: '8 or 11 characters',                                required: true, type: 'text' },
      { name: 'bin',                label: 'BIN (БИН)',              placeholder: '12-digit business ID',                              required: true, type: 'text', pattern: '^\\d{12}$' },
      { name: 'iin',                label: 'IIN (ИИН)',              placeholder: '12-digit individual ID (optional)',                 required: false, type: 'text', pattern: '^\\d{12}$' },
      { name: 'eknp',               label: 'EKNP Code',              placeholder: 'KOD/KBE/Currency/KNP combined code',               required: false, type: 'text' },
      { name: 'bankName',           label: 'Bank Name',              placeholder: 'Full bank name',                                  required: true, type: 'text' },
      { name: 'bankAddress',        label: 'Bank Address',           placeholder: 'Bank branch address',                               required: true, type: 'text' },
    ],
  },
  KG: {
    countryCode: 'KG',
    countryName: 'Kyrgyzstan',
    fields: [
      { name: 'beneficiaryName',    label: 'Beneficiary Name',       placeholder: 'Full legal name of beneficiary',                    required: true, type: 'text' },
      { name: 'inn',                label: 'INN',                    placeholder: '14-digit tax ID',                                  required: true, type: 'text', pattern: '^\\d{14}$' },
      { name: 'bic',                label: 'BIC Code',               placeholder: '6-9 digit bank ID code',                            required: true, type: 'text' },
      { name: 'okpo',               label: 'OKPO Code',              placeholder: 'Enterprise code (if applicable)',                   required: false, type: 'text' },
      { name: 'correspondentAccount', label: 'Correspondent Account', placeholder: 'Correspondent account with National Bank',         required: true, type: 'text' },
      { name: 'bankName',           label: 'Bank Name',              placeholder: 'Full bank name',                                  required: true, type: 'text' },
      { name: 'swiftCode',          label: 'SWIFT Code',             placeholder: 'For foreign currency (8/11 chars)',                 required: false, type: 'text' },
      { name: 'accountNumber',      label: 'Account Number',         placeholder: 'Bank account number',                             required: true, type: 'text' },
    ],
  },
  UZ: {
    countryCode: 'UZ',
    countryName: 'Uzbekistan',
    fields: [
      { name: 'beneficiaryName',    label: 'Beneficiary Name',       placeholder: 'Full legal name of beneficiary',                    required: true, type: 'text' },
      { name: 'inn',                label: 'INN (ИНН)',              placeholder: 'Tax identification number',                         required: true, type: 'text' },
      { name: 'bik',                label: 'BIK (БИК)',              placeholder: 'Bank ID code',                                     required: true, type: 'text' },
      { name: 'mfo',                label: 'MFO',                    placeholder: 'Bank branch code',                                 required: true, type: 'text' },
      { name: 'okonx',              label: 'OKONX',                  placeholder: 'Industry classification code',                     required: false, type: 'text' },
      { name: 'accountNumber',      label: 'Account Number',         placeholder: 'Bank account number',                             required: true, type: 'text' },
      { name: 'bankName',           label: 'Bank Name',              placeholder: 'Full bank name',                                  required: true, type: 'text' },
      { name: 'swiftCode',          label: 'SWIFT Code',             placeholder: '8 or 11 characters',                                required: false, type: 'text' },
    ],
  },
  BD: {
    countryCode: 'BD',
    countryName: 'Bangladesh',
    fields: [
      { name: 'beneficiaryName',    label: 'Beneficiary Name',       placeholder: 'Full legal name of beneficiary',                    required: true, type: 'text' },
      { name: 'accountNumber',      label: 'Account Number',         placeholder: 'Bank account number',                             required: true, type: 'text' },
      { name: 'bankName',           label: 'Bank Name',              placeholder: 'Full bank name',                                  required: true, type: 'text' },
      { name: 'branchName',         label: 'Branch Name',            placeholder: 'Branch name',                                     required: true, type: 'text' },
      { name: 'swiftCode',          label: 'SWIFT / BIC Code',       placeholder: '8 or 11 characters (optional for domestic)',        required: false, type: 'text' },
      { name: 'routingNumber',      label: 'Routing Number',         placeholder: '9-digit bank routing number',                      required: true, type: 'text', pattern: '^\\d{9}$' },
    ],
  },
  GE: {
    countryCode: 'GE',
    countryName: 'Georgia',
    fields: [
      { name: 'beneficiaryName',    label: 'Beneficiary Name',       placeholder: 'Full legal name of beneficiary',                    required: true, type: 'text' },
      { name: 'iban',               label: 'IBAN',                   placeholder: 'GE + 18 digits',                                   required: true, type: 'text', pattern: '^GE\\d{18}$' },
      { name: 'bicSwift',           label: 'SWIFT / BIC',            placeholder: '8 or 11 characters',                                required: true, type: 'text' },
      { name: 'identificationCode', label: 'Personal / Tax ID',      placeholder: '11-digit personal number',                         required: true, type: 'text', pattern: '^\\d{11}$' },
      { name: 'bankName',           label: 'Bank Name',              placeholder: 'e.g. TBC Bank, Bank of Georgia',                    required: true, type: 'text' },
      { name: 'accountNumber',      label: 'Account Number',         placeholder: 'Account number (if different from IBAN)',           required: false, type: 'text' },
    ],
  },
  PH: {
    countryCode: 'PH',
    countryName: 'Philippines',
    fields: [
      { name: 'beneficiaryName',    label: 'Beneficiary Name',       placeholder: 'Full legal name of beneficiary',                    required: true, type: 'text' },
      { name: 'accountNumber',      label: 'Account Number',         placeholder: 'Bank account number',                             required: true, type: 'text' },
      { name: 'bankName',           label: 'Bank Name',              placeholder: 'Full bank name',                                  required: true, type: 'text' },
      { name: 'swiftCode',          label: 'SWIFT / BIC Code',       placeholder: '8 or 11 characters',                                required: true, type: 'text' },
      { name: 'routingNumber',      label: 'Routing Number',         placeholder: '9-digit bank routing number (BRSTN)',               required: true, type: 'text', pattern: '^\\d{9}$' },
    ],
  },
  NP: {
    countryCode: 'NP',
    countryName: 'Nepal',
    fields: [
      { name: 'beneficiaryName',    label: 'Beneficiary Name',       placeholder: 'Full legal name of beneficiary',                    required: true, type: 'text' },
      { name: 'accountNumber',      label: 'Account Number',         placeholder: 'Bank account number',                             required: true, type: 'text' },
      { name: 'bankName',           label: 'Bank Name',              placeholder: 'Full bank name',                                  required: true, type: 'text' },
      { name: 'branchName',         label: 'Branch Name',            placeholder: 'Bank branch name (if applicable)',                  required: false, type: 'text' },
      { name: 'swiftCode',          label: 'SWIFT / BIC Code',       placeholder: '8 or 11 characters',                                required: true, type: 'text' },
    ],
  },
  CN: {
    countryCode: 'CN',
    countryName: 'China',
    fields: [
      { name: 'beneficiaryName',    label: 'Beneficiary Name',       placeholder: 'Full legal name of beneficiary',                    required: true, type: 'text' },
      { name: 'accountNumber',      label: 'Account Number',         placeholder: 'Bank account number',                             required: true, type: 'text' },
      { name: 'bankName',           label: 'Bank Name',              placeholder: 'Full bank name',                                  required: true, type: 'text' },
      { name: 'branchName',         label: 'Branch Name',            placeholder: 'Bank branch name',                                 required: true, type: 'text' },
      { name: 'swiftCode',          label: 'SWIFT / BIC Code',       placeholder: 'Required for international transfers',               required: true, type: 'text' },
      { name: 'cnapsCode',          label: 'CNAPS Code',             placeholder: '12-digit payment system code',                     required: false, type: 'text', pattern: '^\\d{12}$' },
    ],
  },
};

// Countries with typed Indian bank columns (existing)
// These stay on UniversityAdmin as explicit columns: accountName, accountNumber, bankName, bankBranch, ifscCode
export const INDIAN_BANK_COUNTRY = 'IN';

// Get config for a given country code. Returns undefined for India (uses typed columns).
export function getBankConfig(countryCode: string): CountryBankConfig | undefined {
  if (countryCode === INDIAN_BANK_COUNTRY) return undefined;
  return BANK_CONFIGS[countryCode];
}

// List of supported foreign bank detail countries
export const SUPPORTED_FOREIGN_BANK_COUNTRIES = Object.values(BANK_CONFIGS).map(c => ({
  code: c.countryCode,
  name: c.countryName,
}));
