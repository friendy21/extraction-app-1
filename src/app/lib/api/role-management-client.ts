// Role Management API Client - Handles roles, privileges, and permissions
// Manages user access control and authorization

import { BaseApiClient, ApiResponse, PaginationParams, FilterParams } from './base-client';
import {
  Role,
  Privilege,
  RolePrivilege,
} from '../database-types';

export interface CreateRoleRequest {
  name: string;
  description: string;
  is_system_role?: boolean;
}

export interface UpdateRoleRequest extends Partial<CreateRoleRequest> {
  id: string;
}

export interface CreatePrivilegeRequest {
  code: string;
  name: string;
  description: string;
  category: string;
}

export interface UpdatePrivilegeRequest extends Partial<CreatePrivilegeRequest> {
  id: string;
}

export interface AssignPrivilegeRequest {
  role_id: string;
  privilege_id: string;
}

export interface RoleWithPrivileges extends Role {
  privileges: Privilege[];
}

export interface PrivilegeCategory {
  category: string;
  privileges: Privilege[];
}

export interface UserRoleAssignment {
  user_id: string;
  role_id: string;
  assigned_by: string;
  assigned_at: string;
  expires_at?: string;
}

export interface RolePermissionMatrix {
  role: Role;
  permissions: Array<{
    privilege: Privilege;
    granted: boolean;
  }>;
}

/**
 * API Client for role management operations
 */
export class RoleManagementApiClient extends BaseApiClient {
  
  // ============================================================================
  // ROLE OPERATIONS
  // ============================================================================

  /**
   * Get all roles
   */
  async getRoles(
    pagination?: PaginationParams,
    filters?: FilterParams
  ): Promise<ApiResponse<Role[]>> {
    const params = this.buildQueryParams(pagination, filters);
    return this.get<Role[]>('/roles', params);
  }

  /**
   * Get role by ID
   */
  async getRole(id: string): Promise<ApiResponse<Role>> {
    this.validateRequired({ id }, ['id'], 'getRole');
    return this.get<Role>(`/roles/${id}`);
  }

  /**
   * Get role with privileges
   */
  async getRoleWithPrivileges(id: string): Promise<ApiResponse<RoleWithPrivileges>> {
    this.validateRequired({ id }, ['id'], 'getRoleWithPrivileges');
    return this.get<RoleWithPrivileges>(`/roles/${id}/with-privileges`);
  }

  /**
   * Create a new role
   */
  async createRole(data: CreateRoleRequest): Promise<ApiResponse<Role>> {
    this.validateRequired(data, ['name', 'description'], 'createRole');
    
    // Ensure unique role name
    const existingRoles = await this.getRoles(undefined, { search: data.name });
    if (existingRoles.data && existingRoles.data.length > 0) {
      throw new Error(`Role with name '${data.name}' already exists`);
    }
    
    return this.post<Role>('/roles', data);
  }

  /**
   * Update a role
   */
  async updateRole(data: UpdateRoleRequest): Promise<ApiResponse<Role>> {
    this.validateRequired(data, ['id'], 'updateRole');
    const { id, ...updateData } = data;
    
    // Check if role is system role and prevent modification of critical fields
    const existingRole = await this.getRole(id);
    if (existingRole.data?.is_system_role && updateData.name) {
      throw new Error('Cannot modify name of system role');
    }
    
    return this.put<Role>(`/roles/${id}`, updateData);
  }

  /**
   * Delete a role
   */
  async deleteRole(id: string): Promise<ApiResponse<void>> {
    this.validateRequired({ id }, ['id'], 'deleteRole');
    
    // Check if role is system role
    const existingRole = await this.getRole(id);
    if (existingRole.data?.is_system_role) {
      throw new Error('Cannot delete system role');
    }
    
    return this.delete<void>(`/roles/${id}`);
  }

  /**
   * Get system roles
   */
  async getSystemRoles(): Promise<ApiResponse<Role[]>> {
    return this.get<Role[]>('/roles/system');
  }

  /**
   * Get custom roles
   */
  async getCustomRoles(): Promise<ApiResponse<Role[]>> {
    return this.get<Role[]>('/roles/custom');
  }

  // ============================================================================
  // PRIVILEGE OPERATIONS
  // ============================================================================

  /**
   * Get all privileges
   */
  async getPrivileges(
    pagination?: PaginationParams,
    filters?: FilterParams
  ): Promise<ApiResponse<Privilege[]>> {
    const params = this.buildQueryParams(pagination, filters);
    return this.get<Privilege[]>('/privileges', params);
  }

  /**
   * Get privilege by ID
   */
  async getPrivilege(id: string): Promise<ApiResponse<Privilege>> {
    this.validateRequired({ id }, ['id'], 'getPrivilege');
    return this.get<Privilege>(`/privileges/${id}`);
  }

  /**
   * Get privilege by code
   */
  async getPrivilegeByCode(code: string): Promise<ApiResponse<Privilege>> {
    this.validateRequired({ code }, ['code'], 'getPrivilegeByCode');
    return this.get<Privilege>(`/privileges/by-code/${code}`);
  }

  /**
   * Get privileges by category
   */
  async getPrivilegesByCategory(category: string): Promise<ApiResponse<Privilege[]>> {
    this.validateRequired({ category }, ['category'], 'getPrivilegesByCategory');
    return this.get<Privilege[]>(`/privileges/category/${category}`);
  }

  /**
   * Get privilege categories
   */
  async getPrivilegeCategories(): Promise<ApiResponse<PrivilegeCategory[]>> {
    return this.get<PrivilegeCategory[]>('/privileges/categories');
  }

  /**
   * Create a new privilege
   */
  async createPrivilege(data: CreatePrivilegeRequest): Promise<ApiResponse<Privilege>> {
    this.validateRequired(data, ['code', 'name', 'description', 'category'], 'createPrivilege');
    
    // Ensure unique privilege code
    try {
      await this.getPrivilegeByCode(data.code);
      throw new Error(`Privilege with code '${data.code}' already exists`);
    } catch (error) {
      // If privilege doesn't exist, continue with creation
      if (error instanceof Error && error.message.includes('already exists')) {
        throw error;
      }
    }
    
    return this.post<Privilege>('/privileges', data);
  }

  /**
   * Update a privilege
   */
  async updatePrivilege(data: UpdatePrivilegeRequest): Promise<ApiResponse<Privilege>> {
    this.validateRequired(data, ['id'], 'updatePrivilege');
    const { id, ...updateData } = data;
    return this.put<Privilege>(`/privileges/${id}`, updateData);
  }

  /**
   * Delete a privilege
   */
  async deletePrivilege(id: string): Promise<ApiResponse<void>> {
    this.validateRequired({ id }, ['id'], 'deletePrivilege');
    
    // Check if privilege is assigned to any roles
    const rolePrivileges = await this.getRolePrivilegesByPrivilege(id);
    if (rolePrivileges.data && rolePrivileges.data.length > 0) {
      throw new Error('Cannot delete privilege that is assigned to roles');
    }
    
    return this.delete<void>(`/privileges/${id}`);
  }

  // ============================================================================
  // ROLE-PRIVILEGE OPERATIONS
  // ============================================================================

  /**
   * Get all role-privilege assignments
   */
  async getRolePrivileges(
    pagination?: PaginationParams
  ): Promise<ApiResponse<RolePrivilege[]>> {
    const params = this.buildQueryParams(pagination);
    return this.get<RolePrivilege[]>('/role-privileges', params);
  }

  /**
   * Get privileges for a role
   */
  async getRolePrivilegesByRole(roleId: string): Promise<ApiResponse<RolePrivilege[]>> {
    this.validateRequired({ roleId }, ['roleId'], 'getRolePrivilegesByRole');
    return this.get<RolePrivilege[]>(`/roles/${roleId}/privileges`);
  }

  /**
   * Get roles that have a privilege
   */
  async getRolePrivilegesByPrivilege(privilegeId: string): Promise<ApiResponse<RolePrivilege[]>> {
    this.validateRequired({ privilegeId }, ['privilegeId'], 'getRolePrivilegesByPrivilege');
    return this.get<RolePrivilege[]>(`/privileges/${privilegeId}/roles`);
  }

  /**
   * Assign privilege to role
   */
  async assignPrivilegeToRole(data: AssignPrivilegeRequest): Promise<ApiResponse<RolePrivilege>> {
    this.validateRequired(data, ['role_id', 'privilege_id'], 'assignPrivilegeToRole');
    
    // Check if assignment already exists
    const existingAssignments = await this.getRolePrivilegesByRole(data.role_id);
    const alreadyAssigned = existingAssignments.data?.some(
      rp => rp.privilege_id === data.privilege_id
    );
    
    if (alreadyAssigned) {
      throw new Error('Privilege is already assigned to this role');
    }
    
    return this.post<RolePrivilege>('/role-privileges', data);
  }

  /**
   * Remove privilege from role
   */
  async removePrivilegeFromRole(roleId: string, privilegeId: string): Promise<ApiResponse<void>> {
    this.validateRequired({ roleId, privilegeId }, ['roleId', 'privilegeId'], 'removePrivilegeFromRole');
    return this.delete<void>(`/roles/${roleId}/privileges/${privilegeId}`);
  }

  /**
   * Bulk assign privileges to role
   */
  async bulkAssignPrivilegesToRole(
    roleId: string,
    privilegeIds: string[]
  ): Promise<ApiResponse<{ assigned: number; failed: string[] }>> {
    this.validateRequired({ roleId, privilegeIds }, ['roleId', 'privilegeIds'], 'bulkAssignPrivilegesToRole');
    
    const data = {
      role_id: roleId,
      privilege_ids: privilegeIds,
    };
    
    return this.post(`/roles/${roleId}/privileges/bulk-assign`, data);
  }

  /**
   * Bulk remove privileges from role
   */
  async bulkRemovePrivilegesFromRole(
    roleId: string,
    privilegeIds: string[]
  ): Promise<ApiResponse<{ removed: number; failed: string[] }>> {
    this.validateRequired({ roleId, privilegeIds }, ['roleId', 'privilegeIds'], 'bulkRemovePrivilegesFromRole');
    
    const data = {
      privilege_ids: privilegeIds,
    };
    
    return this.post(`/roles/${roleId}/privileges/bulk-remove`, data);
  }

  // ============================================================================
  // PERMISSION CHECKING AND VALIDATION
  // ============================================================================

  /**
   * Check if role has privilege
   */
  async roleHasPrivilege(roleId: string, privilegeCode: string): Promise<ApiResponse<{ hasPrivilege: boolean }>> {
    this.validateRequired({ roleId, privilegeCode }, ['roleId', 'privilegeCode'], 'roleHasPrivilege');
    return this.get(`/roles/${roleId}/has-privilege/${privilegeCode}`);
  }

  /**
   * Get role permission matrix
   */
  async getRolePermissionMatrix(roleId: string): Promise<ApiResponse<RolePermissionMatrix>> {
    this.validateRequired({ roleId }, ['roleId'], 'getRolePermissionMatrix');
    return this.get<RolePermissionMatrix>(`/roles/${roleId}/permission-matrix`);
  }

  /**
   * Validate role permissions
   */
  async validateRolePermissions(
    roleId: string,
    requiredPrivileges: string[]
  ): Promise<ApiResponse<{ valid: boolean; missing: string[] }>> {
    this.validateRequired({ roleId, requiredPrivileges }, ['roleId', 'requiredPrivileges'], 'validateRolePermissions');
    
    const data = {
      required_privileges: requiredPrivileges,
    };
    
    return this.post(`/roles/${roleId}/validate-permissions`, data);
  }

  // ============================================================================
  // ROLE TEMPLATES AND PRESETS
  // ============================================================================

  /**
   * Get role templates
   */
  async getRoleTemplates(): Promise<ApiResponse<Array<{ name: string; description: string; privileges: string[] }>>> {
    return this.get('/roles/templates');
  }

  /**
   * Create role from template
   */
  async createRoleFromTemplate(
    templateName: string,
    roleName: string,
    roleDescription?: string
  ): Promise<ApiResponse<RoleWithPrivileges>> {
    this.validateRequired({ templateName, roleName }, ['templateName', 'roleName'], 'createRoleFromTemplate');
    
    const data = {
      template_name: templateName,
      role_name: roleName,
      role_description: roleDescription || `Role created from ${templateName} template`,
    };
    
    return this.post<RoleWithPrivileges>('/roles/from-template', data);
  }

  // ============================================================================
  // ANALYTICS AND REPORTING
  // ============================================================================

  /**
   * Get role usage statistics
   */
  async getRoleUsageStats(): Promise<ApiResponse<Array<{ role: Role; userCount: number; lastUsed: string }>>> {
    return this.get('/roles/usage-stats');
  }

  /**
   * Get privilege usage statistics
   */
  async getPrivilegeUsageStats(): Promise<ApiResponse<Array<{ privilege: Privilege; roleCount: number }>>> {
    return this.get('/privileges/usage-stats');
  }

  /**
   * Export role configuration
   */
  async exportRoleConfiguration(
    format: 'json' | 'csv' | 'xlsx'
  ): Promise<ApiResponse<{ downloadUrl: string; expiresAt: string }>> {
    this.validateRequired({ format }, ['format'], 'exportRoleConfiguration');
    return this.post('/roles/export', { format });
  }

  /**
   * Import role configuration
   */
  async importRoleConfiguration(
    fileData: any,
    options: { overwrite?: boolean; validateOnly?: boolean } = {}
  ): Promise<ApiResponse<{ imported: number; failed: number; errors: string[] }>> {
    this.validateRequired({ fileData }, ['fileData'], 'importRoleConfiguration');
    
    const data = {
      file_data: fileData,
      ...options,
    };
    
    return this.post('/roles/import', data);
  }
}

// Create and export a default instance
export const roleManagementApi = new RoleManagementApiClient();
export default roleManagementApi;

