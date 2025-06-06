// Data Transformation Utilities
// Provides functions to transform data between different formats and schemas

import { 
  ExtractedEmployee, 
  ExtractedDepartment, 
  Organisation,
  ExtractedEmail,
  ExtractedTeamChat,
  ExtractedMeeting,
  Employee,
  Department
} from './database-types';

// ============================================================================
// LEGACY TO NEW SCHEMA TRANSFORMATIONS
// ============================================================================

/**
 * Transform legacy Employee to ExtractedEmployee
 */
export function transformLegacyEmployee(
  legacyEmployee: Employee,
  organizationId: string,
  departmentId: string
): Partial<ExtractedEmployee> {
  return {
    organisation_id: organizationId,
    full_name: legacyEmployee.name,
    work_email: legacyEmployee.email,
    email: legacyEmployee.email,
    phone: legacyEmployee.phone || '',
    job_title: legacyEmployee.position,
    department_id: departmentId,
    employee_code: legacyEmployee.id.toString(),
    employment_type: 'full-time',
    hired_at: new Date().toISOString(),
    salary: 0,
    is_active: legacyEmployee.status === 'Included',
    office_location: legacyEmployee.location || '',
    work_schedule: {},
    data_source: 'legacy_import',
    isVerified: false,
  };
}

/**
 * Transform legacy Department to ExtractedDepartment
 */
export function transformLegacyDepartment(
  legacyDepartment: any,
  organizationId: string
): Partial<ExtractedDepartment> {
  return {
    organisation_id: organizationId,
    name: legacyDepartment.name,
    description: legacyDepartment.description || '',
    head_id: legacyDepartment.headId,
    office_location: legacyDepartment.location || '',
    data_source: 'legacy_import',
    isVerified: false,
  };
}

// ============================================================================
// NEW SCHEMA TO DISPLAY FORMAT TRANSFORMATIONS
// ============================================================================

/**
 * Transform ExtractedEmployee to display format with additional computed fields
 */
export function transformEmployeeForDisplay(
  employee: ExtractedEmployee,
  department?: ExtractedDepartment,
  manager?: ExtractedEmployee
): ExtractedEmployee & {
  department_name?: string;
  manager_name?: string;
  tenure_years?: number;
  age_group?: string;
  status_display?: string;
} {
  const hiredDate = new Date(employee.hired_at);
  const now = new Date();
  const tenureYears = Math.floor((now.getTime() - hiredDate.getTime()) / (1000 * 60 * 60 * 24 * 365));

  return {
    ...employee,
    department_name: department?.name,
    manager_name: manager?.full_name,
    tenure_years: tenureYears,
    age_group: tenureYears < 1 ? 'New' : tenureYears < 3 ? 'Junior' : tenureYears < 7 ? 'Mid-level' : 'Senior',
    status_display: employee.is_active ? 'Active' : 'Inactive',
  };
}

/**
 * Transform ExtractedDepartment to display format with additional computed fields
 */
export function transformDepartmentForDisplay(
  department: ExtractedDepartment,
  employees: ExtractedEmployee[] = [],
  head?: ExtractedEmployee
): ExtractedDepartment & {
  head_name?: string;
  employee_count?: number;
  active_employee_count?: number;
  roles?: Array<{ title: string; count: number }>;
  work_models?: Array<{ type: string; count: number }>;
} {
  const deptEmployees = employees.filter(emp => emp.department_id === department.id);
  const activeEmployees = deptEmployees.filter(emp => emp.is_active);

  // Calculate role distribution
  const roleMap = new Map<string, number>();
  deptEmployees.forEach(emp => {
    const count = roleMap.get(emp.job_title) || 0;
    roleMap.set(emp.job_title, count + 1);
  });

  const roles = Array.from(roleMap.entries()).map(([title, count]) => ({
    title,
    count
  }));

  // Calculate work model distribution (simplified)
  const workModels = [
    { type: 'On-site', count: Math.floor(deptEmployees.length * 0.6) },
    { type: 'Hybrid', count: Math.floor(deptEmployees.length * 0.3) },
    { type: 'Remote', count: Math.floor(deptEmployees.length * 0.1) },
  ];

  return {
    ...department,
    head_name: head?.full_name,
    employee_count: deptEmployees.length,
    active_employee_count: activeEmployees.length,
    roles,
    work_models: workModels,
  };
}

// ============================================================================
// DATA AGGREGATION UTILITIES
// ============================================================================

/**
 * Calculate organization statistics
 */
export function calculateOrganizationStats(
  employees: ExtractedEmployee[],
  departments: ExtractedDepartment[]
) {
  const activeEmployees = employees.filter(emp => emp.is_active);
  const inactiveEmployees = employees.filter(emp => !emp.is_active);

  // Department distribution
  const departmentMap = new Map<string, string>();
  departments.forEach(dept => {
    departmentMap.set(dept.id, dept.name);
  });

  const departmentDistribution = new Map<string, number>();
  employees.forEach(emp => {
    const deptName = departmentMap.get(emp.department_id) || 'Unknown';
    const count = departmentDistribution.get(deptName) || 0;
    departmentDistribution.set(deptName, count + 1);
  });

  // Employment type distribution
  const employmentTypeDistribution = new Map<string, number>();
  employees.forEach(emp => {
    const count = employmentTypeDistribution.get(emp.employment_type) || 0;
    employmentTypeDistribution.set(emp.employment_type, count + 1);
  });

  // Location distribution
  const locationDistribution = new Map<string, number>();
  employees.forEach(emp => {
    if (emp.office_location) {
      const count = locationDistribution.get(emp.office_location) || 0;
      locationDistribution.set(emp.office_location, count + 1);
    }
  });

  return {
    totalEmployees: employees.length,
    totalDepartments: departments.length,
    activeEmployees: activeEmployees.length,
    inactiveEmployees: inactiveEmployees.length,
    departmentDistribution: Array.from(departmentDistribution.entries()).map(([department, count]) => ({
      department,
      count
    })),
    employmentTypeDistribution: Array.from(employmentTypeDistribution.entries()).map(([type, count]) => ({
      type,
      count
    })),
    locationDistribution: Array.from(locationDistribution.entries()).map(([location, count]) => ({
      location,
      count
    })),
  };
}

/**
 * Calculate communication statistics
 */
export function calculateCommunicationStats(
  emails: ExtractedEmail[],
  chats: ExtractedTeamChat[],
  meetings: ExtractedMeeting[]
) {
  const now = new Date();
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Filter by time periods
  const emailsLastWeek = emails.filter(email => new Date(email.date_received) >= lastWeek);
  const emailsLastMonth = emails.filter(email => new Date(email.date_received) >= lastMonth);
  
  const chatsLastWeek = chats.filter(chat => new Date(chat.timestamp) >= lastWeek);
  const chatsLastMonth = chats.filter(chat => new Date(chat.timestamp) >= lastMonth);
  
  const meetingsLastWeek = meetings.filter(meeting => new Date(meeting.start) >= lastWeek);
  const meetingsLastMonth = meetings.filter(meeting => new Date(meeting.start) >= lastMonth);

  return {
    total: {
      emails: emails.length,
      chats: chats.length,
      meetings: meetings.length,
    },
    lastWeek: {
      emails: emailsLastWeek.length,
      chats: chatsLastWeek.length,
      meetings: meetingsLastWeek.length,
    },
    lastMonth: {
      emails: emailsLastMonth.length,
      chats: chatsLastMonth.length,
      meetings: meetingsLastMonth.length,
    },
    trends: {
      emailTrend: emailsLastWeek.length > 0 ? (emailsLastWeek.length / emailsLastMonth.length) * 100 : 0,
      chatTrend: chatsLastWeek.length > 0 ? (chatsLastWeek.length / chatsLastMonth.length) * 100 : 0,
      meetingTrend: meetingsLastWeek.length > 0 ? (meetingsLastWeek.length / meetingsLastMonth.length) * 100 : 0,
    }
  };
}

// ============================================================================
// DATA VALIDATION UTILITIES
// ============================================================================

/**
 * Validate employee data
 */
export function validateEmployeeData(data: Partial<ExtractedEmployee>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.full_name?.trim()) {
    errors.push('Full name is required');
  }

  if (!data.work_email?.trim()) {
    errors.push('Work email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.work_email)) {
    errors.push('Invalid work email format');
  }

  if (!data.email?.trim()) {
    errors.push('Personal email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid personal email format');
  }

  if (!data.job_title?.trim()) {
    errors.push('Job title is required');
  }

  if (!data.department_id?.trim()) {
    errors.push('Department is required');
  }

  if (!data.employee_code?.trim()) {
    errors.push('Employee code is required');
  }

  if (!data.employment_type?.trim()) {
    errors.push('Employment type is required');
  }

  if (!data.hired_at) {
    errors.push('Hire date is required');
  } else {
    const hireDate = new Date(data.hired_at);
    if (hireDate > new Date()) {
      errors.push('Hire date cannot be in the future');
    }
  }

  if (data.salary !== undefined && data.salary < 0) {
    errors.push('Salary must be a positive number');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate department data
 */
export function validateDepartmentData(data: Partial<ExtractedDepartment>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.name?.trim()) {
    errors.push('Department name is required');
  }

  if (!data.description?.trim()) {
    errors.push('Description is required');
  }

  if (!data.head_id?.trim()) {
    errors.push('Department head is required');
  }

  if (!data.office_location?.trim()) {
    errors.push('Office location is required');
  }

  if (!data.organisation_id?.trim()) {
    errors.push('Organization ID is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate organization data
 */
export function validateOrganizationData(data: Partial<Organisation>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.name?.trim()) {
    errors.push('Organization name is required');
  }

  if (!data.email?.trim()) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email format');
  }

  if (!data.industry?.trim()) {
    errors.push('Industry is required');
  }

  if (!data.country?.trim()) {
    errors.push('Country is required');
  }

  if (!data.state?.trim()) {
    errors.push('State is required');
  }

  if (data.size !== undefined && data.size <= 0) {
    errors.push('Organization size must be a positive number');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// ============================================================================
// SEARCH AND FILTER UTILITIES
// ============================================================================

/**
 * Search employees by multiple criteria
 */
export function searchEmployees(
  employees: ExtractedEmployee[],
  searchTerm: string,
  filters: {
    departmentId?: string;
    isActive?: boolean;
    isVerified?: boolean;
    employmentType?: string;
    location?: string;
  } = {}
): ExtractedEmployee[] {
  const normalizedSearch = searchTerm.toLowerCase().trim();

  return employees.filter(employee => {
    // Text search
    const matchesSearch = !normalizedSearch || 
      employee.full_name.toLowerCase().includes(normalizedSearch) ||
      employee.work_email.toLowerCase().includes(normalizedSearch) ||
      employee.email.toLowerCase().includes(normalizedSearch) ||
      employee.job_title.toLowerCase().includes(normalizedSearch) ||
      employee.employee_code.toLowerCase().includes(normalizedSearch);

    // Filters
    const matchesDepartment = !filters.departmentId || employee.department_id === filters.departmentId;
    const matchesActive = filters.isActive === undefined || employee.is_active === filters.isActive;
    const matchesVerified = filters.isVerified === undefined || employee.isVerified === filters.isVerified;
    const matchesEmploymentType = !filters.employmentType || employee.employment_type === filters.employmentType;
    const matchesLocation = !filters.location || employee.office_location.toLowerCase().includes(filters.location.toLowerCase());

    return matchesSearch && matchesDepartment && matchesActive && matchesVerified && matchesEmploymentType && matchesLocation;
  });
}

/**
 * Search departments by multiple criteria
 */
export function searchDepartments(
  departments: ExtractedDepartment[],
  searchTerm: string,
  filters: {
    isVerified?: boolean;
    location?: string;
    dataSource?: string;
  } = {}
): ExtractedDepartment[] {
  const normalizedSearch = searchTerm.toLowerCase().trim();

  return departments.filter(department => {
    // Text search
    const matchesSearch = !normalizedSearch || 
      department.name.toLowerCase().includes(normalizedSearch) ||
      department.description.toLowerCase().includes(normalizedSearch) ||
      department.office_location.toLowerCase().includes(normalizedSearch);

    // Filters
    const matchesVerified = filters.isVerified === undefined || department.isVerified === filters.isVerified;
    const matchesLocation = !filters.location || department.office_location.toLowerCase().includes(filters.location.toLowerCase());
    const matchesDataSource = !filters.dataSource || department.data_source === filters.dataSource;

    return matchesSearch && matchesVerified && matchesLocation && matchesDataSource;
  });
}

// ============================================================================
// SORTING UTILITIES
// ============================================================================

/**
 * Sort employees by specified criteria
 */
export function sortEmployees(
  employees: ExtractedEmployee[],
  sortBy: 'full_name' | 'job_title' | 'hired_at' | 'salary',
  sortOrder: 'asc' | 'desc' = 'asc'
): ExtractedEmployee[] {
  return [...employees].sort((a, b) => {
    let aValue: any, bValue: any;

    switch (sortBy) {
      case 'full_name':
        aValue = a.full_name.toLowerCase();
        bValue = b.full_name.toLowerCase();
        break;
      case 'job_title':
        aValue = a.job_title.toLowerCase();
        bValue = b.job_title.toLowerCase();
        break;
      case 'hired_at':
        aValue = new Date(a.hired_at).getTime();
        bValue = new Date(b.hired_at).getTime();
        break;
      case 'salary':
        aValue = a.salary;
        bValue = b.salary;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Sort departments by specified criteria
 */
export function sortDepartments(
  departments: ExtractedDepartment[],
  sortBy: 'name' | 'office_location' | 'created_at',
  sortOrder: 'asc' | 'desc' = 'asc'
): ExtractedDepartment[] {
  return [...departments].sort((a, b) => {
    let aValue: any, bValue: any;

    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'office_location':
        aValue = a.office_location.toLowerCase();
        bValue = b.office_location.toLowerCase();
        break;
      case 'created_at':
        aValue = new Date(a.created_at).getTime();
        bValue = new Date(b.created_at).getTime();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
}

// ============================================================================
// EXPORT UTILITIES
// ============================================================================

/**
 * Convert employees to CSV format
 */
export function employeesToCSV(employees: ExtractedEmployee[]): string {
  const headers = [
    'Full Name',
    'Work Email',
    'Personal Email',
    'Phone',
    'Job Title',
    'Employee Code',
    'Employment Type',
    'Hire Date',
    'Salary',
    'Office Location',
    'Is Active',
    'Is Verified',
    'Data Source',
    'Created At',
    'Updated At'
  ];

  const rows = employees.map(emp => [
    emp.full_name,
    emp.work_email,
    emp.email,
    emp.phone,
    emp.job_title,
    emp.employee_code,
    emp.employment_type,
    emp.hired_at,
    emp.salary.toString(),
    emp.office_location,
    emp.is_active.toString(),
    emp.isVerified.toString(),
    emp.data_source,
    emp.created_at,
    emp.updated_at
  ]);

  return [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
}

/**
 * Convert departments to CSV format
 */
export function departmentsToCSV(departments: ExtractedDepartment[]): string {
  const headers = [
    'Name',
    'Description',
    'Office Location',
    'Is Verified',
    'Data Source',
    'Created At',
    'Updated At'
  ];

  const rows = departments.map(dept => [
    dept.name,
    dept.description,
    dept.office_location,
    dept.isVerified.toString(),
    dept.data_source,
    dept.created_at,
    dept.updated_at
  ]);

  return [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
}

// ============================================================================
// DATE AND TIME UTILITIES
// ============================================================================

/**
 * Format date for display
 */
export function formatDate(dateString: string, format: 'short' | 'long' | 'relative' = 'short'): string {
  const date = new Date(dateString);
  
  switch (format) {
    case 'short':
      return date.toLocaleDateString();
    case 'long':
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    case 'relative':
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
      return `${Math.floor(diffDays / 365)} years ago`;
    default:
      return date.toLocaleDateString();
  }
}

/**
 * Calculate tenure in human-readable format
 */
export function calculateTenure(hireDate: string): string {
  const hire = new Date(hireDate);
  const now = new Date();
  const diffMs = now.getTime() - hire.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays < 30) return `${diffDays} days`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
  
  const years = Math.floor(diffDays / 365);
  const remainingMonths = Math.floor((diffDays % 365) / 30);
  
  if (remainingMonths === 0) return `${years} year${years > 1 ? 's' : ''}`;
  return `${years} year${years > 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
}

