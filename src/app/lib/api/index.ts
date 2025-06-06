// API Client Index - Central export point for all API clients
// Provides easy access to all API functionality

// Base client and types
export { BaseApiClient, type ApiResponse, type PaginationParams, type FilterParams } from './base-client';

// Organization API
export { 
  OrganizationApiClient, 
  organizationApi,
  type CreateOrganisationRequest,
  type UpdateOrganisationRequest,
  type CreateDepartmentRequest,
  type UpdateDepartmentRequest,
  type CreateEmployeeRequest,
  type UpdateEmployeeRequest,
  type DepartmentHierarchy,
  type OrganizationStats,
} from './organization-client';

// Data Extraction API
export {
  DataExtractionApiClient,
  dataExtractionApi,
  type EmailFilters,
  type ChatFilters,
  type MeetingFilters,
  type FileFilters,
  type ExtractionStats,
} from './data-extraction-client';

// Connections API
export {
  ConnectionsApiClient,
  connectionsApi,
  type CreateConnectionRequest,
  type UpdateConnectionRequest,
  type ConnectionTestResult,
  type ConnectionStats,
  type ConnectionHealth,
  type Microsoft365Config,
  type GoogleWorkspaceConfig,
  type DropboxConfig,
  type SlackConfig,
  type ZoomConfig,
  type JiraConfig,
  type CustomApiConfig,
} from './connections-client';

// Role Management API
export {
  RoleManagementApiClient,
  roleManagementApi,
  type CreateRoleRequest,
  type UpdateRoleRequest,
  type CreatePrivilegeRequest,
  type UpdatePrivilegeRequest,
  type AssignPrivilegeRequest,
  type RoleWithPrivileges,
  type PrivilegeCategory,
  type UserRoleAssignment,
  type RolePermissionMatrix,
} from './role-management-client';

// Create a unified API client that provides access to all modules
export class UnifiedApiClient {
  public organization: OrganizationApiClient;
  public dataExtraction: DataExtractionApiClient;
  public connections: ConnectionsApiClient;
  public roleManagement: RoleManagementApiClient;

  constructor(baseUrl: string = '/api', token?: string) {
    this.organization = new OrganizationApiClient(baseUrl, token);
    this.dataExtraction = new DataExtractionApiClient(baseUrl, token);
    this.connections = new ConnectionsApiClient(baseUrl, token);
    this.roleManagement = new RoleManagementApiClient(baseUrl, token);
  }

  /**
   * Set authentication token for all clients
   */
  setToken(token: string): void {
    this.organization.setToken(token);
    this.dataExtraction.setToken(token);
    this.connections.setToken(token);
    this.roleManagement.setToken(token);
  }

  /**
   * Clear authentication token from all clients
   */
  clearToken(): void {
    this.organization.clearToken();
    this.dataExtraction.clearToken();
    this.connections.clearToken();
    this.roleManagement.clearToken();
  }

  /**
   * Configure all clients with common settings
   */
  setConfig(config: {
    timeout?: number;
    maxRetries?: number;
    retryDelay?: number;
  }): void {
    this.organization.setConfig(config);
    this.dataExtraction.setConfig(config);
    this.connections.setConfig(config);
    this.roleManagement.setConfig(config);
  }
}

// Create and export a default unified client instance
export const apiClient = new UnifiedApiClient();

// Export individual client instances for direct access
export {
  organizationApi,
  dataExtractionApi,
  connectionsApi,
  roleManagementApi,
};

// Default export
export default apiClient;

