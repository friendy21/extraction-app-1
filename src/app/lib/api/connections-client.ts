// Connections API Client - Manages data source connections and configurations
// Refactored to work with the new database schema

import { BaseApiClient, ApiResponse, PaginationParams, FilterParams } from './base-client';
import {
  DataSourceConfig,
  ConnectionState,
  DataSourceType,
  ConnectionStatus,
  AuthType,
} from '../database-types';

export interface CreateConnectionRequest {
  service_name: DataSourceType;
  description: string;
  api_endpoint: string;
  auth_type: AuthType;
  client_id: string;
  client_secret: string;
  api_key?: string;
  scopes: string;
  organisation_id: string;
}

export interface UpdateConnectionRequest extends Partial<CreateConnectionRequest> {
  id: number;
}

export interface ConnectionTestResult {
  success: boolean;
  status: ConnectionStatus;
  message: string;
  details?: any;
  latency?: number;
}

export interface ConnectionStats {
  connection_id: string;
  status: ConnectionStatus;
  last_connected_at: string;
  created_at: string;
  total_extractions: number;
  last_extraction_at?: string;
  error_count: number;
  success_rate: number;
}

export interface ConnectionHealth {
  connection_id: string;
  service_name: string;
  status: ConnectionStatus;
  health_score: number;
  issues: Array<{
    type: 'warning' | 'error';
    message: string;
    timestamp: string;
  }>;
  recommendations: string[];
}

// Service-specific configuration interfaces
export interface Microsoft365Config {
  tenant_id: string;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  scopes: string[];
}

export interface GoogleWorkspaceConfig {
  account_id: string;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  scopes: string[];
}

export interface DropboxConfig {
  app_key: string;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
}

export interface SlackConfig {
  workspace_id: string;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  scopes: string[];
}

export interface ZoomConfig {
  account_id: string;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
}

export interface JiraConfig {
  instance_url: string;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
}

export interface CustomApiConfig {
  api_url: string;
  api_key: string;
  auth_type: AuthType;
  headers?: Record<string, string>;
}

/**
 * API Client for connection management operations
 */
export class ConnectionsApiClient extends BaseApiClient {
  
  // ============================================================================
  // CONNECTION CONFIGURATION OPERATIONS
  // ============================================================================

  /**
   * Get all connections for an organization
   */
  async getConnections(
    organizationId: string,
    pagination?: PaginationParams,
    filters?: FilterParams
  ): Promise<ApiResponse<DataSourceConfig[]>> {
    this.validateRequired({ organizationId }, ['organizationId'], 'getConnections');
    const params = this.buildQueryParams(pagination, filters);
    return this.get<DataSourceConfig[]>(`/organizations/${organizationId}/connections`, params);
  }

  /**
   * Get connection by ID
   */
  async getConnection(id: number): Promise<ApiResponse<DataSourceConfig>> {
    this.validateRequired({ id }, ['id'], 'getConnection');
    return this.get<DataSourceConfig>(`/connections/${id}`);
  }

  /**
   * Get connection by connection ID
   */
  async getConnectionByConnectionId(connectionId: string): Promise<ApiResponse<DataSourceConfig>> {
    this.validateRequired({ connectionId }, ['connectionId'], 'getConnectionByConnectionId');
    return this.get<DataSourceConfig>(`/connections/by-connection-id/${connectionId}`);
  }

  /**
   * Create a new connection
   */
  async createConnection(data: CreateConnectionRequest): Promise<ApiResponse<DataSourceConfig>> {
    this.validateRequired(data, [
      'service_name', 'description', 'api_endpoint', 'auth_type',
      'client_id', 'client_secret', 'scopes', 'organisation_id'
    ], 'createConnection');
    
    // Generate unique connection ID
    const connectionId = `${data.service_name}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const requestData = {
      ...data,
      connection_id: connectionId,
      status: 'pending' as ConnectionStatus,
    };
    
    console.info(`Creating ${data.service_name} connection`, this.sanitizeForLogging(requestData));
    
    return this.post<DataSourceConfig>('/connections', requestData);
  }

  /**
   * Update a connection
   */
  async updateConnection(data: UpdateConnectionRequest): Promise<ApiResponse<DataSourceConfig>> {
    this.validateRequired(data, ['id'], 'updateConnection');
    const { id, ...updateData } = data;
    
    console.info(`Updating connection ${id}`, this.sanitizeForLogging(updateData));
    
    return this.put<DataSourceConfig>(`/connections/${id}`, updateData);
  }

  /**
   * Delete a connection
   */
  async deleteConnection(id: number): Promise<ApiResponse<void>> {
    this.validateRequired({ id }, ['id'], 'deleteConnection');
    return this.delete<void>(`/connections/${id}`);
  }

  // ============================================================================
  // CONNECTION STATE OPERATIONS
  // ============================================================================

  /**
   * Get connection states/history
   */
  async getConnectionStates(
    connectionId: string,
    pagination?: PaginationParams
  ): Promise<ApiResponse<ConnectionState[]>> {
    this.validateRequired({ connectionId }, ['connectionId'], 'getConnectionStates');
    const params = this.buildQueryParams(pagination);
    return this.get<ConnectionState[]>(`/connections/${connectionId}/states`, params);
  }

  /**
   * Log a connection state event
   */
  async logConnectionState(
    connectionId: string,
    eventType: string,
    status: ConnectionStatus,
    message: string,
    initiatedBy: string
  ): Promise<ApiResponse<ConnectionState>> {
    this.validateRequired({ connectionId, eventType, status, message, initiatedBy }, 
      ['connectionId', 'eventType', 'status', 'message', 'initiatedBy'], 'logConnectionState');
    
    const data = {
      connection_id: connectionId,
      event_type: eventType,
      status,
      message,
      initiated_by: initiatedBy,
      timestamp: new Date().toISOString(),
    };
    
    return this.post<ConnectionState>('/connection-states', data);
  }

  // ============================================================================
  // CONNECTION TESTING AND VALIDATION
  // ============================================================================

  /**
   * Test a connection
   */
  async testConnection(connectionId: string): Promise<ApiResponse<ConnectionTestResult>> {
    this.validateRequired({ connectionId }, ['connectionId'], 'testConnection');
    return this.post<ConnectionTestResult>(`/connections/${connectionId}/test`);
  }

  /**
   * Validate connection configuration
   */
  async validateConnectionConfig(
    serviceType: DataSourceType,
    config: any
  ): Promise<ApiResponse<{ valid: boolean; errors: string[] }>> {
    this.validateRequired({ serviceType, config }, ['serviceType', 'config'], 'validateConnectionConfig');
    
    const data = {
      service_type: serviceType,
      config: this.sanitizeForLogging(config),
    };
    
    return this.post(`/connections/validate-config`, data);
  }

  // ============================================================================
  // CONNECTION OPERATIONS
  // ============================================================================

  /**
   * Connect to a data source
   */
  async connect(connectionId: string): Promise<ApiResponse<{ status: ConnectionStatus; message: string }>> {
    this.validateRequired({ connectionId }, ['connectionId'], 'connect');
    
    try {
      const result = await this.post<{ status: ConnectionStatus; message: string }>(`/connections/${connectionId}/connect`);
      
      // Log the connection attempt
      await this.logConnectionState(
        connectionId,
        'connect_attempt',
        result.data?.status || 'error',
        result.data?.message || 'Connection attempt completed',
        'system'
      );
      
      return result;
    } catch (error) {
      // Log the failed connection attempt
      await this.logConnectionState(
        connectionId,
        'connect_failed',
        'error',
        error instanceof Error ? error.message : 'Unknown error',
        'system'
      );
      throw error;
    }
  }

  /**
   * Disconnect from a data source
   */
  async disconnect(connectionId: string): Promise<ApiResponse<{ status: ConnectionStatus; message: string }>> {
    this.validateRequired({ connectionId }, ['connectionId'], 'disconnect');
    
    try {
      const result = await this.post<{ status: ConnectionStatus; message: string }>(`/connections/${connectionId}/disconnect`);
      
      // Log the disconnection
      await this.logConnectionState(
        connectionId,
        'disconnect',
        result.data?.status || 'disconnected',
        result.data?.message || 'Successfully disconnected',
        'system'
      );
      
      return result;
    } catch (error) {
      // Log the failed disconnection attempt
      await this.logConnectionState(
        connectionId,
        'disconnect_failed',
        'error',
        error instanceof Error ? error.message : 'Unknown error',
        'system'
      );
      throw error;
    }
  }

  /**
   * Reconnect to a data source
   */
  async reconnect(connectionId: string): Promise<ApiResponse<{ status: ConnectionStatus; message: string }>> {
    this.validateRequired({ connectionId }, ['connectionId'], 'reconnect');
    
    try {
      // First disconnect
      await this.disconnect(connectionId);
      
      // Then connect again
      return await this.connect(connectionId);
    } catch (error) {
      console.error(`Error reconnecting to ${connectionId}:`, error);
      throw error;
    }
  }

  // ============================================================================
  // CONNECTION STATISTICS AND HEALTH
  // ============================================================================

  /**
   * Get connection statistics
   */
  async getConnectionStats(connectionId: string): Promise<ApiResponse<ConnectionStats>> {
    this.validateRequired({ connectionId }, ['connectionId'], 'getConnectionStats');
    return this.get<ConnectionStats>(`/connections/${connectionId}/stats`);
  }

  /**
   * Get connection health
   */
  async getConnectionHealth(connectionId: string): Promise<ApiResponse<ConnectionHealth>> {
    this.validateRequired({ connectionId }, ['connectionId'], 'getConnectionHealth');
    return this.get<ConnectionHealth>(`/connections/${connectionId}/health`);
  }

  /**
   * Get organization connection health overview
   */
  async getOrganizationConnectionHealth(organizationId: string): Promise<ApiResponse<ConnectionHealth[]>> {
    this.validateRequired({ organizationId }, ['organizationId'], 'getOrganizationConnectionHealth');
    return this.get<ConnectionHealth[]>(`/organizations/${organizationId}/connections/health`);
  }

  /**
   * Check if connection is active
   */
  async isConnectionActive(connectionId: string): Promise<boolean> {
    try {
      const response = await this.getConnectionStats(connectionId);
      return response.data?.status === 'connected';
    } catch (error) {
      console.error(`Error checking connection status for ${connectionId}:`, error);
      return false;
    }
  }

  // ============================================================================
  // SERVICE-SPECIFIC CONNECTION METHODS
  // ============================================================================

  /**
   * Create Microsoft 365 connection
   */
  async createMicrosoft365Connection(
    organizationId: string,
    config: Microsoft365Config,
    description?: string
  ): Promise<ApiResponse<DataSourceConfig>> {
    this.validateConfig('microsoft365', config);
    
    const data: CreateConnectionRequest = {
      service_name: 'microsoft365',
      description: description || 'Microsoft 365 Integration',
      api_endpoint: 'https://graph.microsoft.com/v1.0',
      auth_type: 'oauth2',
      client_id: config.client_id,
      client_secret: config.client_secret,
      scopes: config.scopes.join(' '),
      organisation_id: organizationId,
    };
    
    return this.createConnection(data);
  }

  /**
   * Create Google Workspace connection
   */
  async createGoogleWorkspaceConnection(
    organizationId: string,
    config: GoogleWorkspaceConfig,
    description?: string
  ): Promise<ApiResponse<DataSourceConfig>> {
    this.validateConfig('googleworkspace', config);
    
    const data: CreateConnectionRequest = {
      service_name: 'googleworkspace',
      description: description || 'Google Workspace Integration',
      api_endpoint: 'https://www.googleapis.com',
      auth_type: 'oauth2',
      client_id: config.client_id,
      client_secret: config.client_secret,
      scopes: config.scopes.join(' '),
      organisation_id: organizationId,
    };
    
    return this.createConnection(data);
  }

  /**
   * Create Dropbox connection
   */
  async createDropboxConnection(
    organizationId: string,
    config: DropboxConfig,
    description?: string
  ): Promise<ApiResponse<DataSourceConfig>> {
    this.validateConfig('dropbox', config);
    
    const data: CreateConnectionRequest = {
      service_name: 'dropbox',
      description: description || 'Dropbox Integration',
      api_endpoint: 'https://api.dropboxapi.com/2',
      auth_type: 'oauth2',
      client_id: config.client_id,
      client_secret: config.client_secret,
      scopes: 'files.metadata.read files.content.read',
      organisation_id: organizationId,
    };
    
    return this.createConnection(data);
  }

  /**
   * Create Slack connection
   */
  async createSlackConnection(
    organizationId: string,
    config: SlackConfig,
    description?: string
  ): Promise<ApiResponse<DataSourceConfig>> {
    this.validateConfig('slack', config);
    
    const data: CreateConnectionRequest = {
      service_name: 'slack',
      description: description || 'Slack Integration',
      api_endpoint: 'https://slack.com/api',
      auth_type: 'oauth2',
      client_id: config.client_id,
      client_secret: config.client_secret,
      scopes: config.scopes.join(','),
      organisation_id: organizationId,
    };
    
    return this.createConnection(data);
  }

  /**
   * Create custom API connection
   */
  async createCustomApiConnection(
    organizationId: string,
    config: CustomApiConfig,
    description?: string
  ): Promise<ApiResponse<DataSourceConfig>> {
    this.validateConfig('customapi', config);
    
    const data: CreateConnectionRequest = {
      service_name: 'customapi',
      description: description || 'Custom API Integration',
      api_endpoint: config.api_url,
      auth_type: config.auth_type,
      client_id: 'custom',
      client_secret: 'custom',
      api_key: config.api_key,
      scopes: 'custom',
      organisation_id: organizationId,
    };
    
    return this.createConnection(data);
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Validate service-specific configuration
   */
  private validateConfig(service: DataSourceType, config: any): void {
    const requiredFields: Record<DataSourceType, string[]> = {
      microsoft365: ['tenant_id', 'client_id', 'client_secret', 'redirect_uri', 'scopes'],
      googleworkspace: ['account_id', 'client_id', 'client_secret', 'redirect_uri', 'scopes'],
      dropbox: ['app_key', 'client_id', 'client_secret', 'redirect_uri'],
      slack: ['workspace_id', 'client_id', 'client_secret', 'redirect_uri', 'scopes'],
      zoom: ['account_id', 'client_id', 'client_secret', 'redirect_uri'],
      jira: ['instance_url', 'client_id', 'client_secret', 'redirect_uri'],
      customapi: ['api_url', 'api_key', 'auth_type'],
    };
    
    const fields = requiredFields[service];
    if (!fields) {
      throw new Error(`Unknown service type: ${service}`);
    }
    
    this.validateRequired(config, fields, `${service} connection`);
  }
}

// Create and export a default instance
export const connectionsApi = new ConnectionsApiClient();
export default connectionsApi;

