// Form Validation Schemas using Zod
// Provides comprehensive validation for all form inputs

import { z } from 'zod';

// ============================================================================
// EMPLOYEE VALIDATION SCHEMAS
// ============================================================================

export const employeeSchema = z.object({
  full_name: z.string()
    .min(1, 'Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(255, 'Full name must be less than 255 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Full name can only contain letters, spaces, hyphens, and apostrophes'),

  work_email: z.string()
    .min(1, 'Work email is required')
    .email('Invalid work email format')
    .max(255, 'Work email must be less than 255 characters'),

  email: z.string()
    .min(1, 'Personal email is required')
    .email('Invalid personal email format')
    .max(255, 'Personal email must be less than 255 characters'),

  phone: z.string()
    .optional()
    .refine((val) => !val || /^[\+]?[1-9][\d]{0,15}$/.test(val), {
      message: 'Invalid phone number format'
    }),

  job_title: z.string()
    .min(1, 'Job title is required')
    .min(2, 'Job title must be at least 2 characters')
    .max(255, 'Job title must be less than 255 characters'),

  department_id: z.string()
    .min(1, 'Department is required')
    .uuid('Invalid department ID format'),

  manager_id: z.string()
    .uuid('Invalid manager ID format')
    .optional()
    .or(z.literal('')),

  employee_code: z.string()
    .min(1, 'Employee code is required')
    .max(100, 'Employee code must be less than 100 characters')
    .regex(/^[A-Z0-9-_]+$/i, 'Employee code can only contain letters, numbers, hyphens, and underscores'),

  employment_type: z.enum(['full-time', 'part-time', 'contract', 'intern', 'consultant'], {
    errorMap: () => ({ message: 'Please select a valid employment type' })
  }),

  hired_at: z.string()
    .min(1, 'Hire date is required')
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime()) && date <= new Date();
    }, {
      message: 'Hire date must be a valid date and cannot be in the future'
    }),

  terminated_at: z.string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, {
      message: 'Termination date must be a valid date'
    }),

  salary: z.number()
    .min(0, 'Salary must be a positive number')
    .max(10000000, 'Salary seems unreasonably high')
    .optional(),

  office_location: z.string()
    .max(100, 'Office location must be less than 100 characters')
    .optional(),

  work_schedule: z.record(z.any()).optional(),

  data_source: z.string()
    .min(1, 'Data source is required')
    .max(50, 'Data source must be less than 50 characters'),

  organisation_id: z.string()
    .min(1, 'Organization ID is required')
    .uuid('Invalid organization ID format'),
});

export const createEmployeeSchema = employeeSchema;

export const updateEmployeeSchema = employeeSchema.partial().extend({
  id: z.string().uuid('Invalid employee ID format'),
});

// ============================================================================
// DEPARTMENT VALIDATION SCHEMAS
// ============================================================================

export const departmentSchema = z.object({
  name: z.string()
    .min(1, 'Department name is required')
    .min(2, 'Department name must be at least 2 characters')
    .max(255, 'Department name must be less than 255 characters'),

  description: z.string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),

  head_id: z.string()
    .min(1, 'Department head is required')
    .uuid('Invalid department head ID format'),

  parent_department_id: z.string()
    .uuid('Invalid parent department ID format')
    .optional()
    .or(z.literal('')),

  office_location: z.string()
    .min(1, 'Office location is required')
    .max(255, 'Office location must be less than 255 characters'),

  data_source: z.string()
    .min(1, 'Data source is required')
    .max(50, 'Data source must be less than 50 characters'),

  organisation_id: z.string()
    .min(1, 'Organization ID is required')
    .uuid('Invalid organization ID format'),
});

export const createDepartmentSchema = departmentSchema;

export const updateDepartmentSchema = departmentSchema.partial().extend({
  id: z.string().uuid('Invalid department ID format'),
});

// ============================================================================
// ORGANIZATION VALIDATION SCHEMAS
// ============================================================================

export const organizationSchema = z.object({
  name: z.string()
    .min(1, 'Organization name is required')
    .min(2, 'Organization name must be at least 2 characters')
    .max(255, 'Organization name must be less than 255 characters'),

  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .max(255, 'Email must be less than 255 characters'),

  phone: z.string()
    .min(1, 'Phone number is required')
    .refine((val) => /^[\+]?[1-9][\d]{0,15}$/.test(val), {
      message: 'Invalid phone number format'
    }),

  address: z.string()
    .min(1, 'Address is required')
    .max(500, 'Address must be less than 500 characters'),

  website: z.string()
    .min(1, 'Website is required')
    .url('Invalid website URL format')
    .max(255, 'Website URL must be less than 255 characters'),

  logo_url: z.string()
    .url('Invalid logo URL format')
    .max(255, 'Logo URL must be less than 255 characters')
    .optional(),

  industry: z.string()
    .min(1, 'Industry is required')
    .max(255, 'Industry must be less than 255 characters'),

  country: z.string()
    .min(1, 'Country is required')
    .max(100, 'Country must be less than 100 characters'),

  state: z.string()
    .min(1, 'State is required')
    .max(100, 'State must be less than 100 characters'),

  size: z.number()
    .min(1, 'Organization size must be at least 1')
    .max(1000000, 'Organization size seems unreasonably large'),

  owner_id: z.string()
    .min(1, 'Owner ID is required')
    .uuid('Invalid owner ID format'),
});

export const createOrganizationSchema = organizationSchema;

export const updateOrganizationSchema = organizationSchema.partial().extend({
  id: z.string().uuid('Invalid organization ID format'),
});

// ============================================================================
// CONNECTION VALIDATION SCHEMAS
// ============================================================================

export const connectionSchema = z.object({
  service_name: z.enum(['microsoft365', 'googleworkspace', 'dropbox', 'slack', 'zoom', 'jira', 'customapi'], {
    errorMap: () => ({ message: 'Please select a valid service type' })
  }),

  description: z.string()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters'),

  api_endpoint: z.string()
    .min(1, 'API endpoint is required')
    .url('Invalid API endpoint URL format')
    .max(255, 'API endpoint must be less than 255 characters'),

  auth_type: z.enum(['oauth2', 'api_key', 'basic_auth', 'bearer_token'], {
    errorMap: () => ({ message: 'Please select a valid authentication type' })
  }),

  client_id: z.string()
    .min(1, 'Client ID is required')
    .max(255, 'Client ID must be less than 255 characters'),

  client_secret: z.string()
    .min(1, 'Client secret is required')
    .max(255, 'Client secret must be less than 255 characters'),

  api_key: z.string()
    .max(255, 'API key must be less than 255 characters')
    .optional(),

  scopes: z.string()
    .min(1, 'Scopes are required')
    .max(500, 'Scopes must be less than 500 characters'),

  organisation_id: z.string()
    .min(1, 'Organization ID is required')
    .uuid('Invalid organization ID format'),
});

export const createConnectionSchema = connectionSchema;

export const updateConnectionSchema = connectionSchema.partial().extend({
  id: z.number().positive('Invalid connection ID'),
});

// ============================================================================
// ROLE MANAGEMENT VALIDATION SCHEMAS
// ============================================================================

export const roleSchema = z.object({
  name: z.string()
    .min(1, 'Role name is required')
    .min(2, 'Role name must be at least 2 characters')
    .max(50, 'Role name must be less than 50 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Role name can only contain letters, numbers, underscores, and hyphens'),

  description: z.string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),

  is_system_role: z.boolean().optional().default(false),
});

export const createRoleSchema = roleSchema;

export const updateRoleSchema = roleSchema.partial().extend({
  id: z.string().uuid('Invalid role ID format'),
});

export const privilegeSchema = z.object({
  code: z.string()
    .min(1, 'Privilege code is required')
    .max(50, 'Privilege code must be less than 50 characters')
    .regex(/^[A-Z0-9_]+$/, 'Privilege code must be uppercase letters, numbers, and underscores only'),

  name: z.string()
    .min(1, 'Privilege name is required')
    .max(100, 'Privilege name must be less than 100 characters'),

  description: z.string()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters'),

  category: z.string()
    .min(1, 'Category is required')
    .max(50, 'Category must be less than 50 characters'),
});

export const createPrivilegeSchema = privilegeSchema;

export const updatePrivilegeSchema = privilegeSchema.partial().extend({
  id: z.string().uuid('Invalid privilege ID format'),
});

export const assignPrivilegeSchema = z.object({
  role_id: z.string()
    .min(1, 'Role ID is required')
    .uuid('Invalid role ID format'),

  privilege_id: z.string()
    .min(1, 'Privilege ID is required')
    .uuid('Invalid privilege ID format'),
});

// ============================================================================
// SEARCH AND FILTER VALIDATION SCHEMAS
// ============================================================================

export const paginationSchema = z.object({
  page: z.number().min(1, 'Page must be at least 1').optional(),
  limit: z.number().min(1, 'Limit must be at least 1').max(100, 'Limit cannot exceed 100').optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const employeeFilterSchema = z.object({
  search: z.string().optional(),
  departmentId: z.string().uuid().optional(),
  isActive: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  employmentType: z.enum(['full-time', 'part-time', 'contract', 'intern', 'consultant']).optional(),
  location: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

export const departmentFilterSchema = z.object({
  search: z.string().optional(),
  isVerified: z.boolean().optional(),
  location: z.string().optional(),
  dataSource: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

export const emailFilterSchema = z.object({
  search: z.string().optional(),
  sender: z.string().optional(),
  recipient: z.string().optional(),
  hasAttachments: z.boolean().optional(),
  isRead: z.boolean().optional(),
  isStarred: z.boolean().optional(),
  folder: z.string().optional(),
  threadId: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

export const chatFilterSchema = z.object({
  search: z.string().optional(),
  senderId: z.string().uuid().optional(),
  recipientId: z.string().uuid().optional(),
  isImportant: z.boolean().optional(),
  isUrgent: z.boolean().optional(),
  hasAttachments: z.boolean().optional(),
  hasReactions: z.boolean().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

export const meetingFilterSchema = z.object({
  search: z.string().optional(),
  organizerId: z.string().uuid().optional(),
  attendeeId: z.string().uuid().optional(),
  isVirtual: z.boolean().optional(),
  location: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

export const fileFilterSchema = z.object({
  search: z.string().optional(),
  fileType: z.string().optional(),
  createdBy: z.string().uuid().optional(),
  sharedWith: z.string().optional(),
  minSize: z.number().min(0).optional(),
  maxSize: z.number().min(0).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

// ============================================================================
// BULK OPERATION VALIDATION SCHEMAS
// ============================================================================

export const bulkDeleteSchema = z.object({
  ids: z.array(z.string().uuid())
    .min(1, 'At least one ID is required')
    .max(100, 'Cannot delete more than 100 items at once'),
});

export const bulkAssignPrivilegesSchema = z.object({
  role_id: z.string().uuid('Invalid role ID format'),
  privilege_ids: z.array(z.string().uuid())
    .min(1, 'At least one privilege ID is required')
    .max(50, 'Cannot assign more than 50 privileges at once'),
});

export const exportDataSchema = z.object({
  format: z.enum(['csv', 'json', 'xlsx'], {
    errorMap: () => ({ message: 'Please select a valid export format' })
  }),
  filters: z.record(z.any()).optional(),
});

// ============================================================================
// UTILITY FUNCTIONS FOR VALIDATION
// ============================================================================

/**
 * Validate data against a schema and return formatted errors
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: { general: 'Validation failed' } };
  }
}

/**
 * Validate partial data (for updates)
 */
export function validatePartialData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: Partial<T> } | { success: false; errors: Record<string, string> } {
  try {
    const validatedData = schema.partial().parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: { general: 'Validation failed' } };
  }
}

/**
 * Validate array of data
 */
export function validateArrayData<T>(
  schema: z.ZodSchema<T>,
  dataArray: unknown[]
): { success: true; data: T[] } | { success: false; errors: Array<Record<string, string>> } {
  const results: T[] = [];
  const errors: Array<Record<string, string>> = [];
  let hasErrors = false;

  dataArray.forEach((data, index) => {
    try {
      const validatedData = schema.parse(data);
      results.push(validatedData);
      errors.push({});
    } catch (error) {
      hasErrors = true;
      if (error instanceof z.ZodError) {
        const itemErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          itemErrors[path] = err.message;
        });
        errors.push(itemErrors);
      } else {
        errors.push({ general: `Validation failed for item ${index + 1}` });
      }
      results.push({} as T); // Placeholder for failed validation
    }
  });

  if (hasErrors) {
    return { success: false, errors };
  }

  return { success: true, data: results };
}

/**
 * Create a safe validator function
 */
export function createValidator<T>(schema: z.ZodSchema<T>) {
  return (data: unknown) => validateData(schema, data);
}

// ============================================================================
// EXPORT VALIDATORS
// ============================================================================

export const validateEmployee = createValidator(employeeSchema);
export const validateCreateEmployee = createValidator(createEmployeeSchema);
export const validateUpdateEmployee = createValidator(updateEmployeeSchema);

export const validateDepartment = createValidator(departmentSchema);
export const validateCreateDepartment = createValidator(createDepartmentSchema);
export const validateUpdateDepartment = createValidator(updateDepartmentSchema);

export const validateOrganization = createValidator(organizationSchema);
export const validateCreateOrganization = createValidator(createOrganizationSchema);
export const validateUpdateOrganization = createValidator(updateOrganizationSchema);

export const validateConnection = createValidator(connectionSchema);
export const validateCreateConnection = createValidator(createConnectionSchema);
export const validateUpdateConnection = createValidator(updateConnectionSchema);

export const validateRole = createValidator(roleSchema);
export const validateCreateRole = createValidator(createRoleSchema);
export const validateUpdateRole = createValidator(updateRoleSchema);

export const validatePrivilege = createValidator(privilegeSchema);
export const validateCreatePrivilege = createValidator(createPrivilegeSchema);
export const validateUpdatePrivilege = createValidator(updatePrivilegeSchema);

export const validateAssignPrivilege = createValidator(assignPrivilegeSchema);

export const validatePagination = createValidator(paginationSchema);
export const validateEmployeeFilter = createValidator(employeeFilterSchema);
export const validateDepartmentFilter = createValidator(departmentFilterSchema);
export const validateEmailFilter = createValidator(emailFilterSchema);
export const validateChatFilter = createValidator(chatFilterSchema);
export const validateMeetingFilter = createValidator(meetingFilterSchema);
export const validateFileFilter = createValidator(fileFilterSchema);

export const validateBulkDelete = createValidator(bulkDeleteSchema);
export const validateBulkAssignPrivileges = createValidator(bulkAssignPrivilegesSchema);
export const validateExportData = createValidator(exportDataSchema);

