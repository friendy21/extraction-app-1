// Database Types - Generated from Proposed Database Schema v1.0.0
// This file contains TypeScript interfaces for all database tables

import { ReactNode } from 'react';

// ============================================================================
// CORE ORGANIZATION TYPES
// ============================================================================

export interface Organisation {
  id: string; // UUID Primary Key
  name: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  logo_url: string;
  industry: string;
  country: string;
  state: string;
  size: number;
  owner_id: string; // UUID Foreign Key
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  is_active: boolean;
}

export interface ExtractedDepartment {
  id: string; // UUID Primary Key
  organisation_id: string; // UUID Foreign Key
  name: string;
  description: string;
  parent_department_id?: string; // UUID Foreign Key, nullable
  head_id: string; // UUID Foreign Key
  office_location: string;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  data_source: string;
  isVerified: boolean;
}

export interface ExtractedEmployee {
  id: string; // UUID Primary Key
  organisation_id: string; // UUID Foreign Key
  full_name: string;
  work_email: string;
  email: string;
  phone: string;
  job_title: string;
  department_id: string; // UUID Foreign Key
  manager_id?: string; // UUID Foreign Key, nullable
  employee_code: string;
  employment_type: string;
  hired_at: string; // ISO timestamp
  terminated_at?: string; // ISO timestamp, nullable
  salary: number;
  is_active: boolean;
  office_location: string;
  work_schedule: Record<string, any>; // JSONB
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  data_source: string;
  isVerified: boolean;
}

// ============================================================================
// ROLE MANAGEMENT TYPES
// ============================================================================

export interface Role {
  id: string; // UUID Primary Key
  name: string;
  description: string;
  is_system_role: boolean;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface Privilege {
  id: string; // UUID Primary Key
  code: string;
  name: string;
  description: string;
  category: string;
  created_at: string; // ISO timestamp
}

export interface RolePrivilege {
  id: string; // UUID Primary Key
  role_id: string; // UUID Foreign Key
  privilege_id: string; // UUID Foreign Key
  created_at: string; // ISO timestamp
}

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

export interface DataSourceConfig {
  id: number; // Serial Primary Key
  service_name: string;
  connection_id: string;
  description: string;
  api_endpoint: string;
  auth_type: string;
  client_id: string;
  client_secret: string;
  api_key: string;
  scopes: string;
  status: string;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  organisation_id: string; // UUID Foreign Key
}

export interface ConnectionState {
  id: number; // Serial Primary Key
  connection_id: string;
  event_type: string;
  status: string;
  message: string;
  initiated_by: string;
  timestamp: string; // ISO timestamp
}

// ============================================================================
// EXTRACTED DATA TYPES
// ============================================================================

export interface ExtractedEmail {
  id: string; // UUID Primary Key
  organisation_id: string; // UUID Foreign Key
  connection_id: string;
  data_source: string;
  email_id: string;
  thread_id: string;
  subject: string;
  body_plain: string;
  body_html: string;
  snippet: string;
  sender_id: string; // UUID Foreign Key
  sender_email: string;
  recipients_count: number;
  recipients: Record<string, any>[]; // JSONB array
  date_sent: string; // ISO timestamp
  date_received: string; // ISO timestamp
  attachments_count: number;
  attachments: Record<string, any>[]; // JSONB array
  thread_snippet: string;
  is_read: boolean;
  is_starred: boolean;
  folder: string;
  labels: string[];
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface ExtractedTeamChat {
  id: string; // UUID Primary Key
  organisation_id: string; // UUID Foreign Key
  connection_id: string;
  chat_id: string;
  message_content: string;
  sender_id: string; // UUID Foreign Key
  sender_email: string;
  recipient_id: string; // UUID Foreign Key
  recipient_email: string;
  timestamp: string; // ISO timestamp
  is_important: boolean;
  is_urgent: boolean;
  is_read: boolean;
  has_attachments: boolean;
  attachments_count: number;
  attachments: Record<string, any>[]; // JSONB array
  is_reply: boolean;
  reply_to_id?: string;
  has_reactions: boolean;
  reactions: Record<string, any>[]; // JSONB array
  date_extracted: string; // ISO timestamp
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface ExtractedTeamGroupChat {
  id: string; // UUID Primary Key
  organisation_id: string; // UUID Foreign Key
  connection_id: string;
  chat_id: string;
  group_id: string;
  group_name: string;
  message_content: string;
  sender_id: string; // UUID Foreign Key
  sender_email: string;
  recipients_count: number;
  recipients: Record<string, any>[]; // JSONB array
  timestamp: string; // ISO timestamp
  thread_id: string;
  is_important: boolean;
  is_urgent: boolean;
  has_attachments: boolean;
  attachments_count: number;
  attachments: Record<string, any>[]; // JSONB array
  mentions_count: number;
  mentioned_users: Record<string, any>[]; // JSONB array
  is_reply: boolean;
  reply_to_id?: string;
  has_reactions: boolean;
  reactions: Record<string, any>[]; // JSONB array
  date_extracted: string; // ISO timestamp
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface ExtractedTeamChannelChat {
  id: string; // UUID Primary Key
  organisation_id: string; // UUID Foreign Key
  connection_id: string;
  chat_id: string;
  team_id: string;
  team_name: string;
  channel_id: string;
  channel_name: string;
  message_content: string;
  subject: string;
  sender_id: string; // UUID Foreign Key
  sender_email: string;
  timestamp: string; // ISO timestamp
  thread_id: string;
  is_root_message: boolean;
  is_announcement: boolean;
  is_pinned: boolean;
  has_attachments: boolean;
  attachments_count: number;
  attachments: Record<string, any>[]; // JSONB array
  mentions_count: number;
  mentioned_users: Record<string, any>[]; // JSONB array
  is_reply: boolean;
  reply_to_id?: string;
  has_reactions: boolean;
  reactions: Record<string, any>[]; // JSONB array
  date_extracted: string; // ISO timestamp
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface ExtractedCalendarActivity {
  id: string; // UUID Primary Key
  organisation_id: string; // UUID Foreign Key
  connection_id: string;
  document_id: string;
  document_type: string;
  title: string;
  description: string;
  author_id: string; // UUID Foreign Key
  author_email: string;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  last_accessed_at: string; // ISO timestamp
  permissions: Record<string, any>; // JSONB
  created_by: string; // UUID Foreign Key
}

export interface ExtractedMeeting {
  id: string; // UUID Primary Key
  event_id: string;
  organisation_id: string; // UUID Foreign Key
  connection_id: string;
  tenant_id: string; // UUID
  title: string;
  description: string;
  location: string;
  attendees: Record<string, any>[]; // JSONB array
  virtual: boolean;
  start: string; // ISO timestamp
  end: string; // ISO timestamp
  date_extracted: string; // ISO timestamp
}

export interface ExtractedDropboxFile {
  id: string; // UUID Primary Key
  organisation_id: string; // UUID Foreign Key
  connection_id: string;
  dropbox_file_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_format: string;
  parent_folder_id?: string;
  shared_with_count: number;
  shared_with: Record<string, any>[]; // JSONB array
  permissions: Record<string, any>[]; // JSONB array
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  last_accessed_at: string; // ISO timestamp
  created_by: string; // UUID Foreign Key
  file_description: string;
  upn: string;
}

export interface ExtractedDropboxActivity {
  event_id: string; // Primary Key
  timestamp: string; // ISO timestamp
  event_type: string;
  asset_type: string;
  name: string;
  path: string;
  actor_name: string;
  actor_email: string;
}

export interface ExtractedOneDriveFile {
  id: string; // UUID Primary Key
  user_principal_name: string;
  file_name: string;
  item_id: string;
  is_folder: boolean;
  file_type: string;
  file_size_bytes?: number;
  last_modified: string; // ISO timestamp
  last_modified_by: string;
  extracted_at: string; // ISO timestamp
  activity_count: number;
  upn: string;
}

export interface ExtractedOneDriveActivity {
  id: string; // UUID Primary Key
  file_item_id: string; // Foreign Key
  activity_type: string;
  timestamp: string; // ISO timestamp
  actor_email: string;
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  department?: string;
  dataSource?: string;
}

// ============================================================================
// LEGACY COMPATIBILITY TYPES (for gradual migration)
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
// UTILITY TYPES
// ============================================================================

export type DatabaseTable = 
  | 'organisations'
  | 'extracted_departments'
  | 'extracted_employees'
  | 'roles'
  | 'privileges'
  | 'role_privileges'
  | 'data_source_config'
  | 'connection_state'
  | 'extracted_emails'
  | 'extracted_team_chats'
  | 'extracted_team_group_chats'
  | 'extracted_team_channel_chats'
  | 'extracted_calendar_activity'
  | 'extracted_meetings'
  | 'extracted_dropbox_files'
  | 'extracted_dropbox_activity'
  | 'extracted_one_drive_files'
  | 'extracted_one_drive_activities';

export type DataSourceType = 
  | 'microsoft365'
  | 'googleworkspace'
  | 'dropbox'
  | 'slack'
  | 'zoom'
  | 'jira'
  | 'customapi';

export type ConnectionStatus = 
  | 'pending'
  | 'connected'
  | 'disconnected'
  | 'error';

export type EmploymentType = 
  | 'full-time'
  | 'part-time'
  | 'contract'
  | 'intern'
  | 'consultant';

export type AuthType = 
  | 'oauth2'
  | 'api_key'
  | 'basic_auth'
  | 'bearer_token';

