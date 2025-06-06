// Updated Types - Maintains backward compatibility while adding new database types
// This file bridges the gap between legacy types and new database schema

import { ReactNode } from 'react';

// Re-export all new database types
export * from './database-types';

// ============================================================================
// LEGACY TYPES (maintained for backward compatibility)
// ============================================================================

export interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  position: string;
  status: 'Included' | 'Excluded';
  profilePicture?: string;
  location?: string;
  workModel?: string;
  age?: number;
  gender?: string;
  ethnicity?: string;
  timeZone?: string;
  language?: string;
  phone?: string;
}

export interface DepartmentDistribution {
  name: string;
  count: number;
}

export interface ExtractedField {
  name: string;
  source: string;
  dataType: string;
  coverage: number;
  status: string;
}

export interface DataSource {
  name: string;
  type: string;
  fieldsExtracted: number;
  lastSync: string;
  status: string;
  color: string;
  icon: ReactNode;
}

// ============================================================================
// ENHANCED DISPLAY TYPES
// ============================================================================

// Enhanced employee type for display purposes
export interface EmployeeDisplay {
  id: string;
  full_name: string;
  work_email: string;
  personal_email: string;
  phone?: string;
  job_title: string;
  department_id: string;
  department_name?: string;
  manager_id?: string;
  manager_name?: string;
  employee_code: string;
  employment_type: string;
  hired_at: string;
  terminated_at?: string;
  salary: number;
  is_active: boolean;
  office_location: string;
  work_schedule: Record<string, any>;
  data_source: string;
  isVerified: boolean;
  created_at: string;
  updated_at: string;
  
  // Computed display fields
  tenure_display?: string;
  status_display?: string;
  avatar_url?: string;
  initials?: string;
}

// Enhanced department type for display purposes
export interface DepartmentDisplay {
  id: string;
  organisation_id: string;
  name: string;
  description: string;
  parent_department_id?: string;
  parent_department_name?: string;
  head_id: string;
  head_name?: string;
  office_location: string;
  data_source: string;
  isVerified: boolean;
  created_at: string;
  updated_at: string;
  
  // Computed display fields
  employee_count?: number;
  active_employee_count?: number;
  roles?: Array<{ title: string; count: number }>;
  work_models?: Array<{ type: string; count: number }>;
  children?: DepartmentDisplay[];
  team_members?: EmployeeDisplay[];
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface EmployeeFormData {
  full_name: string;
  work_email: string;
  email: string;
  phone: string;
  job_title: string;
  department_id: string;
  manager_id?: string;
  employee_code: string;
  employment_type: string;
  hired_at: string;
  salary: number;
  office_location: string;
  work_schedule: Record<string, any>;
  data_source: string;
}

export interface DepartmentFormData {
  name: string;
  description: string;
  head_id: string;
  parent_department_id?: string;
  office_location: string;
  data_source: string;
}

export interface OrganizationFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  logo_url?: string;
  industry: string;
  country: string;
  state: string;
  size: number;
}

export interface ConnectionFormData {
  service_name: string;
  description: string;
  api_endpoint: string;
  auth_type: string;
  client_id: string;
  client_secret: string;
  api_key?: string;
  scopes: string;
}

// ============================================================================
// FILTER AND SEARCH TYPES
// ============================================================================

export interface EmployeeFilters {
  search?: string;
  departmentId?: string;
  isActive?: boolean;
  isVerified?: boolean;
  employmentType?: string;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  managerId?: string;
  salaryMin?: number;
  salaryMax?: number;
}

export interface DepartmentFilters {
  search?: string;
  isVerified?: boolean;
  location?: string;
  dataSource?: string;
  dateFrom?: string;
  dateTo?: string;
  parentDepartmentId?: string;
  headId?: string;
}

export interface EmailFilters {
  search?: string;
  sender?: string;
  recipient?: string;
  hasAttachments?: boolean;
  isRead?: boolean;
  isStarred?: boolean;
  folder?: string;
  threadId?: string;
  dateFrom?: string;
  dateTo?: string;
  dataSource?: string;
}

export interface ChatFilters {
  search?: string;
  senderId?: string;
  recipientId?: string;
  isImportant?: boolean;
  isUrgent?: boolean;
  hasAttachments?: boolean;
  hasReactions?: boolean;
  dateFrom?: string;
  dateTo?: string;
  chatType?: 'direct' | 'group' | 'channel';
}

export interface MeetingFilters {
  search?: string;
  organizerId?: string;
  attendeeId?: string;
  isVirtual?: boolean;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  duration?: 'short' | 'medium' | 'long';
}

export interface FileFilters {
  search?: string;
  fileType?: string;
  createdBy?: string;
  sharedWith?: string;
  minSize?: number;
  maxSize?: number;
  dateFrom?: string;
  dateTo?: string;
  dataSource?: string;
}

// ============================================================================
// STATISTICS AND ANALYTICS TYPES
// ============================================================================

export interface OrganizationStatistics {
  totalEmployees: number;
  totalDepartments: number;
  activeEmployees: number;
  inactiveEmployees: number;
  verifiedEmployees: number;
  unverifiedEmployees: number;
  departmentDistribution: Array<{
    department: string;
    count: number;
    percentage: number;
  }>;
  employmentTypeDistribution: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  locationDistribution: Array<{
    location: string;
    count: number;
    percentage: number;
  }>;
  tenureDistribution: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
  salaryDistribution: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
}

export interface CommunicationStatistics {
  totalEmails: number;
  totalChats: number;
  totalMeetings: number;
  totalFiles: number;
  dataSourceBreakdown: Array<{
    source: string;
    emails: number;
    chats: number;
    meetings: number;
    files: number;
  }>;
  timeSeriesData: Array<{
    date: string;
    emails: number;
    chats: number;
    meetings: number;
    files: number;
  }>;
  topCommunicators: Array<{
    employee_id: string;
    employee_name: string;
    email_count: number;
    chat_count: number;
    meeting_count: number;
  }>;
  communicationPatterns: {
    peakHours: Array<{ hour: number; activity: number }>;
    peakDays: Array<{ day: string; activity: number }>;
    averageResponseTime: number;
  };
}

export interface ExtractionProgress {
  totalRecords: number;
  processedRecords: number;
  failedRecords: number;
  progressPercentage: number;
  estimatedTimeRemaining: number;
  currentDataSource: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  errors: Array<{
    message: string;
    timestamp: string;
    dataSource: string;
  }>;
}

// ============================================================================
// UI COMPONENT TYPES
// ============================================================================

export interface TableColumn<T = any> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T) => ReactNode;
}

export interface TableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  error?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (column: string) => void;
  onRowClick?: (row: T) => void;
  selectedRows?: string[];
  onRowSelect?: (rowId: string, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
  };
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  footer?: ReactNode;
  closable?: boolean;
}

export interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  help?: string;
  options?: Array<{ value: string; label: string }>;
  value?: any;
  onChange?: (value: any) => void;
}

export interface FilterPanelProps {
  filters: Record<string, any>;
  onFilterChange: (filters: Record<string, any>) => void;
  onReset: () => void;
  children: ReactNode;
}

// ============================================================================
// NAVIGATION AND ROUTING TYPES
// ============================================================================

export interface NavigationItem {
  id: string;
  label: string;
  icon?: ReactNode;
  path?: string;
  children?: NavigationItem[];
  badge?: string | number;
  disabled?: boolean;
  external?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
  active?: boolean;
}

// ============================================================================
// NOTIFICATION AND ALERT TYPES
// ============================================================================

export interface NotificationItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actions?: Array<{
    label: string;
    action: () => void;
    style?: 'primary' | 'secondary' | 'danger';
  }>;
}

export interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  actions?: Array<{
    label: string;
    action: () => void;
    style?: 'primary' | 'secondary' | 'danger';
  }>;
}

// ============================================================================
// THEME AND STYLING TYPES
// ============================================================================

export interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontSize: 'sm' | 'md' | 'lg';
  borderRadius: 'none' | 'sm' | 'md' | 'lg';
  animations: boolean;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  gray: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
}

// ============================================================================
// EXPORT UTILITY TYPES
// ============================================================================

export type SortDirection = 'asc' | 'desc';
export type ViewMode = 'grid' | 'list' | 'table' | 'chart';
export type ExportFormat = 'csv' | 'json' | 'xlsx' | 'pdf';
export type ImportFormat = 'csv' | 'json' | 'xlsx';

export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'intern' | 'consultant';
export type DataSourceType = 'microsoft365' | 'googleworkspace' | 'dropbox' | 'slack' | 'zoom' | 'jira' | 'customapi' | 'manual' | 'legacy_import';
export type ConnectionStatus = 'pending' | 'connected' | 'disconnected' | 'error';
export type AuthType = 'oauth2' | 'api_key' | 'basic_auth' | 'bearer_token';

// ============================================================================
// UTILITY TYPE HELPERS
// ============================================================================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Required<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type Nullable<T> = T | null;
export type Maybe<T> = T | undefined;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

export type NonEmptyArray<T> = [T, ...T[]];

// ============================================================================
// API RESPONSE WRAPPER TYPES
// ============================================================================

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: any;
  code?: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ============================================================================
// CONTEXT TYPES
// ============================================================================

export interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export interface OrganizationContextType {
  currentOrganization: any | null;
  organizations: any[];
  isLoading: boolean;
  switchOrganization: (orgId: string) => void;
  refreshOrganizations: () => Promise<void>;
}

export interface ThemeContextType {
  theme: ThemeConfig;
  updateTheme: (updates: Partial<ThemeConfig>) => void;
  resetTheme: () => void;
}

// ============================================================================
// HOOK TYPES
// ============================================================================

export interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  retries?: number;
  retryDelay?: number;
}

export interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
}

export interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
  total?: number;
}

export interface UsePaginationReturn {
  page: number;
  limit: number;
  offset: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  reset: () => void;
}

