// Data Extraction API Client - Handles all extracted data operations
// Manages emails, chats, meetings, files, and other extracted content

import { BaseApiClient, ApiResponse, PaginationParams, FilterParams } from './base-client';
import {
  ExtractedEmail,
  ExtractedTeamChat,
  ExtractedTeamGroupChat,
  ExtractedTeamChannelChat,
  ExtractedCalendarActivity,
  ExtractedMeeting,
  ExtractedDropboxFile,
  ExtractedDropboxActivity,
  ExtractedOneDriveFile,
  ExtractedOneDriveActivity,
} from '../database-types';

export interface EmailFilters extends FilterParams {
  sender?: string;
  recipient?: string;
  hasAttachments?: boolean;
  isRead?: boolean;
  isStarred?: boolean;
  folder?: string;
  threadId?: string;
}

export interface ChatFilters extends FilterParams {
  senderId?: string;
  recipientId?: string;
  isImportant?: boolean;
  isUrgent?: boolean;
  hasAttachments?: boolean;
  hasReactions?: boolean;
}

export interface MeetingFilters extends FilterParams {
  organizerId?: string;
  attendeeId?: string;
  isVirtual?: boolean;
  location?: string;
}

export interface FileFilters extends FilterParams {
  fileType?: string;
  createdBy?: string;
  sharedWith?: string;
  minSize?: number;
  maxSize?: number;
}

export interface ExtractionStats {
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
  extractionProgress: Array<{
    date: string;
    emails: number;
    chats: number;
    meetings: number;
    files: number;
  }>;
}

/**
 * API Client for data extraction operations
 */
export class DataExtractionApiClient extends BaseApiClient {
  
  // ============================================================================
  // EMAIL OPERATIONS
  // ============================================================================

  /**
   * Get all extracted emails for an organization
   */
  async getEmails(
    organizationId: string,
    pagination?: PaginationParams,
    filters?: EmailFilters
  ): Promise<ApiResponse<ExtractedEmail[]>> {
    this.validateRequired({ organizationId }, ['organizationId'], 'getEmails');
    const params = this.buildQueryParams(pagination, filters);
    return this.get<ExtractedEmail[]>(`/organizations/${organizationId}/emails`, params);
  }

  /**
   * Get email by ID
   */
  async getEmail(id: string): Promise<ApiResponse<ExtractedEmail>> {
    this.validateRequired({ id }, ['id'], 'getEmail');
    return this.get<ExtractedEmail>(`/emails/${id}`);
  }

  /**
   * Get emails by thread
   */
  async getEmailThread(threadId: string): Promise<ApiResponse<ExtractedEmail[]>> {
    this.validateRequired({ threadId }, ['threadId'], 'getEmailThread');
    return this.get<ExtractedEmail[]>(`/emails/thread/${threadId}`);
  }

  /**
   * Search emails
   */
  async searchEmails(
    organizationId: string,
    query: string,
    pagination?: PaginationParams,
    filters?: EmailFilters
  ): Promise<ApiResponse<ExtractedEmail[]>> {
    this.validateRequired({ organizationId, query }, ['organizationId', 'query'], 'searchEmails');
    const params = this.buildQueryParams(pagination, { ...filters, search: query });
    return this.get<ExtractedEmail[]>(`/organizations/${organizationId}/emails/search`, params);
  }

  /**
   * Get email attachments
   */
  async getEmailAttachments(emailId: string): Promise<ApiResponse<any[]>> {
    this.validateRequired({ emailId }, ['emailId'], 'getEmailAttachments');
    return this.get<any[]>(`/emails/${emailId}/attachments`);
  }

  /**
   * Mark email as read/unread
   */
  async updateEmailReadStatus(emailId: string, isRead: boolean): Promise<ApiResponse<ExtractedEmail>> {
    this.validateRequired({ emailId }, ['emailId'], 'updateEmailReadStatus');
    return this.patch<ExtractedEmail>(`/emails/${emailId}/read-status`, { is_read: isRead });
  }

  /**
   * Star/unstar email
   */
  async updateEmailStarStatus(emailId: string, isStarred: boolean): Promise<ApiResponse<ExtractedEmail>> {
    this.validateRequired({ emailId }, ['emailId'], 'updateEmailStarStatus');
    return this.patch<ExtractedEmail>(`/emails/${emailId}/star-status`, { is_starred: isStarred });
  }

  // ============================================================================
  // TEAM CHAT OPERATIONS
  // ============================================================================

  /**
   * Get all team chats for an organization
   */
  async getTeamChats(
    organizationId: string,
    pagination?: PaginationParams,
    filters?: ChatFilters
  ): Promise<ApiResponse<ExtractedTeamChat[]>> {
    this.validateRequired({ organizationId }, ['organizationId'], 'getTeamChats');
    const params = this.buildQueryParams(pagination, filters);
    return this.get<ExtractedTeamChat[]>(`/organizations/${organizationId}/team-chats`, params);
  }

  /**
   * Get team chat by ID
   */
  async getTeamChat(id: string): Promise<ApiResponse<ExtractedTeamChat>> {
    this.validateRequired({ id }, ['id'], 'getTeamChat');
    return this.get<ExtractedTeamChat>(`/team-chats/${id}`);
  }

  /**
   * Get team group chats
   */
  async getTeamGroupChats(
    organizationId: string,
    pagination?: PaginationParams,
    filters?: ChatFilters
  ): Promise<ApiResponse<ExtractedTeamGroupChat[]>> {
    this.validateRequired({ organizationId }, ['organizationId'], 'getTeamGroupChats');
    const params = this.buildQueryParams(pagination, filters);
    return this.get<ExtractedTeamGroupChat[]>(`/organizations/${organizationId}/team-group-chats`, params);
  }

  /**
   * Get team channel chats
   */
  async getTeamChannelChats(
    organizationId: string,
    pagination?: PaginationParams,
    filters?: ChatFilters
  ): Promise<ApiResponse<ExtractedTeamChannelChat[]>> {
    this.validateRequired({ organizationId }, ['organizationId'], 'getTeamChannelChats');
    const params = this.buildQueryParams(pagination, filters);
    return this.get<ExtractedTeamChannelChat[]>(`/organizations/${organizationId}/team-channel-chats`, params);
  }

  /**
   * Get chats by team/channel
   */
  async getChatsByTeamChannel(
    teamId: string,
    channelId: string,
    pagination?: PaginationParams
  ): Promise<ApiResponse<ExtractedTeamChannelChat[]>> {
    this.validateRequired({ teamId, channelId }, ['teamId', 'channelId'], 'getChatsByTeamChannel');
    const params = this.buildQueryParams(pagination);
    return this.get<ExtractedTeamChannelChat[]>(`/teams/${teamId}/channels/${channelId}/chats`, params);
  }

  /**
   * Search chats
   */
  async searchChats(
    organizationId: string,
    query: string,
    chatType: 'direct' | 'group' | 'channel',
    pagination?: PaginationParams
  ): Promise<ApiResponse<ExtractedTeamChat[] | ExtractedTeamGroupChat[] | ExtractedTeamChannelChat[]>> {
    this.validateRequired({ organizationId, query, chatType }, ['organizationId', 'query', 'chatType'], 'searchChats');
    const params = this.buildQueryParams(pagination, { search: query });
    return this.get(`/organizations/${organizationId}/chats/${chatType}/search`, params);
  }

  // ============================================================================
  // MEETING OPERATIONS
  // ============================================================================

  /**
   * Get all meetings for an organization
   */
  async getMeetings(
    organizationId: string,
    pagination?: PaginationParams,
    filters?: MeetingFilters
  ): Promise<ApiResponse<ExtractedMeeting[]>> {
    this.validateRequired({ organizationId }, ['organizationId'], 'getMeetings');
    const params = this.buildQueryParams(pagination, filters);
    return this.get<ExtractedMeeting[]>(`/organizations/${organizationId}/meetings`, params);
  }

  /**
   * Get meeting by ID
   */
  async getMeeting(id: string): Promise<ApiResponse<ExtractedMeeting>> {
    this.validateRequired({ id }, ['id'], 'getMeeting');
    return this.get<ExtractedMeeting>(`/meetings/${id}`);
  }

  /**
   * Get meetings by employee
   */
  async getMeetingsByEmployee(
    employeeId: string,
    pagination?: PaginationParams,
    filters?: MeetingFilters
  ): Promise<ApiResponse<ExtractedMeeting[]>> {
    this.validateRequired({ employeeId }, ['employeeId'], 'getMeetingsByEmployee');
    const params = this.buildQueryParams(pagination, filters);
    return this.get<ExtractedMeeting[]>(`/employees/${employeeId}/meetings`, params);
  }

  /**
   * Get meetings by date range
   */
  async getMeetingsByDateRange(
    organizationId: string,
    startDate: string,
    endDate: string,
    pagination?: PaginationParams
  ): Promise<ApiResponse<ExtractedMeeting[]>> {
    this.validateRequired({ organizationId, startDate, endDate }, ['organizationId', 'startDate', 'endDate'], 'getMeetingsByDateRange');
    const params = this.buildQueryParams(pagination, { dateFrom: startDate, dateTo: endDate });
    return this.get<ExtractedMeeting[]>(`/organizations/${organizationId}/meetings/date-range`, params);
  }

  // ============================================================================
  // FILE OPERATIONS
  // ============================================================================

  /**
   * Get Dropbox files
   */
  async getDropboxFiles(
    organizationId: string,
    pagination?: PaginationParams,
    filters?: FileFilters
  ): Promise<ApiResponse<ExtractedDropboxFile[]>> {
    this.validateRequired({ organizationId }, ['organizationId'], 'getDropboxFiles');
    const params = this.buildQueryParams(pagination, filters);
    return this.get<ExtractedDropboxFile[]>(`/organizations/${organizationId}/dropbox-files`, params);
  }

  /**
   * Get Dropbox file by ID
   */
  async getDropboxFile(id: string): Promise<ApiResponse<ExtractedDropboxFile>> {
    this.validateRequired({ id }, ['id'], 'getDropboxFile');
    return this.get<ExtractedDropboxFile>(`/dropbox-files/${id}`);
  }

  /**
   * Get Dropbox activities
   */
  async getDropboxActivities(
    organizationId: string,
    pagination?: PaginationParams,
    filters?: FilterParams
  ): Promise<ApiResponse<ExtractedDropboxActivity[]>> {
    this.validateRequired({ organizationId }, ['organizationId'], 'getDropboxActivities');
    const params = this.buildQueryParams(pagination, filters);
    return this.get<ExtractedDropboxActivity[]>(`/organizations/${organizationId}/dropbox-activities`, params);
  }

  /**
   * Get OneDrive files
   */
  async getOneDriveFiles(
    organizationId: string,
    pagination?: PaginationParams,
    filters?: FileFilters
  ): Promise<ApiResponse<ExtractedOneDriveFile[]>> {
    this.validateRequired({ organizationId }, ['organizationId'], 'getOneDriveFiles');
    const params = this.buildQueryParams(pagination, filters);
    return this.get<ExtractedOneDriveFile[]>(`/organizations/${organizationId}/onedrive-files`, params);
  }

  /**
   * Get OneDrive file by ID
   */
  async getOneDriveFile(id: string): Promise<ApiResponse<ExtractedOneDriveFile>> {
    this.validateRequired({ id }, ['id'], 'getOneDriveFile');
    return this.get<ExtractedOneDriveFile>(`/onedrive-files/${id}`);
  }

  /**
   * Get OneDrive activities
   */
  async getOneDriveActivities(
    organizationId: string,
    pagination?: PaginationParams,
    filters?: FilterParams
  ): Promise<ApiResponse<ExtractedOneDriveActivity[]>> {
    this.validateRequired({ organizationId }, ['organizationId'], 'getOneDriveActivities');
    const params = this.buildQueryParams(pagination, filters);
    return this.get<ExtractedOneDriveActivity[]>(`/organizations/${organizationId}/onedrive-activities`, params);
  }

  // ============================================================================
  // CALENDAR OPERATIONS
  // ============================================================================

  /**
   * Get calendar activities
   */
  async getCalendarActivities(
    organizationId: string,
    pagination?: PaginationParams,
    filters?: FilterParams
  ): Promise<ApiResponse<ExtractedCalendarActivity[]>> {
    this.validateRequired({ organizationId }, ['organizationId'], 'getCalendarActivities');
    const params = this.buildQueryParams(pagination, filters);
    return this.get<ExtractedCalendarActivity[]>(`/organizations/${organizationId}/calendar-activities`, params);
  }

  /**
   * Get calendar activity by ID
   */
  async getCalendarActivity(id: string): Promise<ApiResponse<ExtractedCalendarActivity>> {
    this.validateRequired({ id }, ['id'], 'getCalendarActivity');
    return this.get<ExtractedCalendarActivity>(`/calendar-activities/${id}`);
  }

  // ============================================================================
  // ANALYTICS AND STATISTICS
  // ============================================================================

  /**
   * Get extraction statistics
   */
  async getExtractionStats(organizationId: string): Promise<ApiResponse<ExtractionStats>> {
    this.validateRequired({ organizationId }, ['organizationId'], 'getExtractionStats');
    return this.get<ExtractionStats>(`/organizations/${organizationId}/extraction-stats`);
  }

  /**
   * Get communication patterns
   */
  async getCommunicationPatterns(
    organizationId: string,
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<any>> {
    this.validateRequired({ organizationId, startDate, endDate }, ['organizationId', 'startDate', 'endDate'], 'getCommunicationPatterns');
    const params = { dateFrom: startDate, dateTo: endDate };
    return this.get(`/organizations/${organizationId}/communication-patterns`, params);
  }

  /**
   * Get collaboration insights
   */
  async getCollaborationInsights(
    organizationId: string,
    timeframe: 'week' | 'month' | 'quarter' | 'year'
  ): Promise<ApiResponse<any>> {
    this.validateRequired({ organizationId, timeframe }, ['organizationId', 'timeframe'], 'getCollaborationInsights');
    return this.get(`/organizations/${organizationId}/collaboration-insights`, { timeframe });
  }

  /**
   * Get data source health
   */
  async getDataSourceHealth(organizationId: string): Promise<ApiResponse<any>> {
    this.validateRequired({ organizationId }, ['organizationId'], 'getDataSourceHealth');
    return this.get(`/organizations/${organizationId}/data-source-health`);
  }

  // ============================================================================
  // BULK OPERATIONS
  // ============================================================================

  /**
   * Bulk delete extracted data
   */
  async bulkDeleteData(
    organizationId: string,
    dataType: 'emails' | 'chats' | 'meetings' | 'files',
    ids: string[]
  ): Promise<ApiResponse<{ deleted: number; failed: string[] }>> {
    this.validateRequired({ organizationId, dataType, ids }, ['organizationId', 'dataType', 'ids'], 'bulkDeleteData');
    return this.post(`/organizations/${organizationId}/${dataType}/bulk-delete`, { ids });
  }

  /**
   * Export extracted data
   */
  async exportData(
    organizationId: string,
    dataType: 'emails' | 'chats' | 'meetings' | 'files',
    format: 'csv' | 'json' | 'xlsx',
    filters?: FilterParams
  ): Promise<ApiResponse<{ downloadUrl: string; expiresAt: string }>> {
    this.validateRequired({ organizationId, dataType, format }, ['organizationId', 'dataType', 'format'], 'exportData');
    const params = { format, ...filters };
    return this.post(`/organizations/${organizationId}/${dataType}/export`, params);
  }
}

// Create and export a default instance
export const dataExtractionApi = new DataExtractionApiClient();
export default dataExtractionApi;

