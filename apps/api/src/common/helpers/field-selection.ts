/**
 * Field selection utility for Prisma queries
 * Converts field string like "id,name,location.country" to Prisma select object
 */

export interface FieldSelection {
  [key: string]: boolean | FieldSelection;
}

/**
 * Parse field selection string into Prisma select object
 * @param fields - Comma-separated field names, supports nesting with dots
 * @param allowedFields - Optional whitelist of allowed fields
 * @returns Prisma select object
 * 
 * Examples:
 * parseFields("id,name,logo") => { id: true, name: true, logo: true }
 * parseFields("id,name,location.country") => { id: true, name: true, location: { select: { country: true } } }
 */
export function parseFields(
  fields: string | undefined,
  allowedFields?: string[],
): FieldSelection | undefined {
  if (!fields) return undefined;

  const fieldList = fields.split(',').map((f) => f.trim()).filter(Boolean);
  
  if (fieldList.length === 0) return undefined;

  const select: FieldSelection = {};

  for (const field of fieldList) {
    // Check if field is allowed
    if (allowedFields && !isFieldAllowed(field, allowedFields)) {
      continue;
    }

    // Handle nested fields (e.g., "location.country")
    if (field.includes('.')) {
      const parts = field.split('.');
      let current: FieldSelection = select;
      
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i]!;
        
        if (i === parts.length - 1) {
          // Last part - set to true
          current[part] = true;
        } else {
          // Intermediate part - create nested select
          if (!current[part] || typeof current[part] === 'boolean') {
            current[part] = {};
          }
          current = current[part] as FieldSelection;
        }
      }
    } else {
      select[field] = true;
    }
  }

  return Object.keys(select).length > 0 ? select : undefined;
}

/**
 * Check if a field is in the allowed list
 * Supports wildcards (e.g., "location.*")
 */
function isFieldAllowed(field: string, allowedFields: string[]): boolean {
  const parts = field.split('.');
  
  for (const allowed of allowedFields) {
    const allowedParts = allowed.split('.');
    
    // Check for exact match or wildcard
    let matches = true;
    for (let i = 0; i < Math.max(parts.length, allowedParts.length); i++) {
      if (allowedParts[i] === '*') return true;
      if (parts[i] !== allowedParts[i]) {
        matches = false;
        break;
      }
    }
    if (matches) return true;
  }
  
  return false;
}

/**
 * Build Prisma select object with field selection
 * @param fields - Field selection string
 * @param defaultSelect - Default fields to always include
 * @param allowedFields - Whitelist of allowed fields
 */
export function buildSelect(
  fields: string | undefined,
  defaultSelect?: FieldSelection,
  allowedFields?: string[],
): FieldSelection | undefined {
  const parsed = parseFields(fields, allowedFields);
  
  if (!parsed) return defaultSelect;
  if (!defaultSelect) return parsed;
  
  // Merge with defaults
  return { ...defaultSelect, ...parsed };
}

/**
 * Common allowed fields for different entities
 */
export const ALLOWED_UNIVERSITY_FIELDS = [
  'id',
  'name',
  'shortName',
  'slug',
  'logo',
  'bannerImage',
  'brochureUrl',
  'website',
  'establishedYear',
  'type',
  'status',
  'location.*',
  'contact.*',
  'academic.*',
  'content.*',
  'createdAt',
  'updatedAt',
];

export const ALLOWED_STUDENT_FIELDS = [
  'id',
  'userId',
  'currentStage',
  'applicationStatus',
  'neetScore',
  'neetRank',
  'twelfthPercentage',
  'tenthPercentage',
  'user.id',
  'user.name',
  'user.email',
  'user.phone',
  'user.avatarUrl',
  'createdAt',
  'updatedAt',
];

export const ALLOWED_APPLICATION_FIELDS = [
  'id',
  'studentId',
  'universityId',
  'courseId',
  'status',
  'firstName',
  'lastName',
  'email',
  'selectedProgram',
  'submittedAt',
  'createdAt',
  'updatedAt',
  'university.id',
  'university.name',
  'university.shortName',
  'university.slug',
  'student.id',
  'student.currentStage',
  'student.applicationStatus',
  'student.user.id',
  'student.user.name',
  'student.user.email',
];
