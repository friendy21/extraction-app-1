// Organization API Client - Handles all organization-related API operations
// Manages organizations, departments, and employees

import { BaseApiClient, ApiResponse, PaginationParams, FilterParams } from './base-client';
import {
  Organisation,
  ExtractedDepartment,
  ExtractedEmployee,
} from '../database-types';

export interface CreateOrganisationRequest {
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
  owner_id: string;
}

export interface UpdateOrganisationRequest extends Partial<CreateOrganisationRequest> {
  id: string;
}

export interface CreateDepartmentRequest {
  organisation_id: string;
  name: string;
  description: string;
  parent_department_id?: string;
  head_id: string;
  office_location: string;
  data_source: string;
}

export interface UpdateDepartmentRequest extends Partial<CreateDepartmentRequest> {
  id: string;
}

export interface CreateEmployeeRequest {
  organisation_id: string;
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

export interface UpdateEmployeeRequest extends Partial<CreateEmployeeRequest> {
  id: string;
}

export interface DepartmentHierarchy extends ExtractedDepartment {
  children: DepartmentHierarchy[];
  employees: ExtractedEmployee[];
  employeeCount: number;
}

export interface OrganizationStats {
  totalEmployees: number;
  totalDepartments: number;
  activeEmployees: number;
  inactiveEmployees: number;
  departmentDistribution: Array<{
    department: string;
    count: number;
  }>;
  employmentTypeDistribution: Array<{
    type: string;
    count: number;
  }>;
  locationDistribution: Array<{
    location: string;
    count: number;
  }>;
}

/**
 * API Client for organization-related operations
 */
export class OrganizationApiClient extends BaseApiClient {
  
  // ============================================================================
  // ORGANIZATION OPERATIONS
  // ============================================================================

  /**
   * Get all organizations
   */
  async getOrganizations(
    pagination?: PaginationParams,
    filters?: FilterParams
  ): Promise<ApiResponse<Organisation[]>> {
    const params = this.buildQueryParams(pagination, filters);
    return this.get<Organisation[]>('/organizations', params);
  }

  /**
   * Get organization by ID
   */
  async getOrganization(id: string): Promise<ApiResponse<Organisation>> {
    this.validateRequired({ id }, ['id'], 'getOrganization');
    return this.get<Organisation>(`/organizations/${id}`);
  }

  /**
   * Create a new organization
   */
  async createOrganization(data: CreateOrganisationRequest): Promise<ApiResponse<Organisation>> {
    this.validateRequired(data, [
      'name', 'email', 'phone', 'address', 'website', 'industry', 
      'country', 'state', 'size', 'owner_id'
    ], 'createOrganization');
    
    return this.post<Organisation>('/organizations', data);
  }

  /**
   * Update an organization
   */
  async updateOrganization(data: UpdateOrganisationRequest): Promise<ApiResponse<Organisation>> {
    this.validateRequired(data, ['id'], 'updateOrganization');
    const { id, ...updateData } = data;
    return this.put<Organisation>(`/organizations/${id}`, updateData);
  }

  /**
   * Delete an organization
   */
  async deleteOrganization(id: string): Promise<ApiResponse<void>> {
    this.validateRequired({ id }, ['id'], 'deleteOrganization');
    return this.delete<void>(`/organizations/${id}`);
  }

  /**
   * Get organization statistics
   */
  async getOrganizationStats(id: string): Promise<ApiResponse<OrganizationStats>> {
    this.validateRequired({ id }, ['id'], 'getOrganizationStats');
    return this.get<OrganizationStats>(`/organizations/${id}/stats`);
  }

  // ============================================================================
  // DEPARTMENT OPERATIONS
  // ============================================================================

  /**
   * Get all departments for an organization
   */
  async getDepartments(
    organizationId: string,
    pagination?: PaginationParams,
    filters?: FilterParams
  ): Promise<ApiResponse<ExtractedDepartment[]>> {
    this.validateRequired({ organizationId }, ['organizationId'], 'getDepartments');
    const params = this.buildQueryParams(pagination, filters);
    return this.get<ExtractedDepartment[]>(`/organizations/${organizationId}/departments`, params);
  }

  /**
   * Get department by ID
   */
  async getDepartment(id: string): Promise<ApiResponse<ExtractedDepartment>> {
    this.validateRequired({ id }, ['id'], 'getDepartment');
    return this.get<ExtractedDepartment>(`/departments/${id}`);
  }

  /**
   * Get department hierarchy
   */
  async getDepartmentHierarchy(organizationId: string): Promise<ApiResponse<DepartmentHierarchy[]>> {
    this.validateRequired({ organizationId }, ['organizationId'], 'getDepartmentHierarchy');
    return this.get<DepartmentHierarchy[]>(`/organizations/${organizationId}/departments/hierarchy`);
  }

  /**
   * Create a new department
   */
  async createDepartment(data: CreateDepartmentRequest): Promise<ApiResponse<ExtractedDepartment>> {
    this.validateRequired(data, [
      'organisation_id', 'name', 'description', 'head_id', 
      'office_location', 'data_source'
    ], 'createDepartment');
    
    return this.post<ExtractedDepartment>('/departments', data);
  }

  /**
   * Update a department
   */
  async updateDepartment(data: UpdateDepartmentRequest): Promise<ApiResponse<ExtractedDepartment>> {
    this.validateRequired(data, ['id'], 'updateDepartment');
    const { id, ...updateData } = data;
    return this.put<ExtractedDepartment>(`/departments/${id}`, updateData);
  }

  /**
   * Delete a department
   */
  async deleteDepartment(id: string): Promise<ApiResponse<void>> {
    this.validateRequired({ id }, ['id'], 'deleteDepartment');
    return this.delete<void>(`/departments/${id}`);
  }

  /**
   * Verify a department
   */
  async verifyDepartment(id: string): Promise<ApiResponse<ExtractedDepartment>> {
    this.validateRequired({ id }, ['id'], 'verifyDepartment');
    return this.patch<ExtractedDepartment>(`/departments/${id}/verify`);
  }

  // ============================================================================
  // EMPLOYEE OPERATIONS
  // ============================================================================

  /**
   * Get all employees for an organization
   */
  async getEmployees(
    organizationId: string,
    pagination?: PaginationParams,
    filters?: FilterParams
  ): Promise<ApiResponse<ExtractedEmployee[]>> {
    this.validateRequired({ organizationId }, ['organizationId'], 'getEmployees');
    const params = this.buildQueryParams(pagination, filters);
    return this.get<ExtractedEmployee[]>(`/organizations/${organizationId}/employees`, params);
  }

  /**
   * Get employees by department
   */
  async getEmployeesByDepartment(
    departmentId: string,
    pagination?: PaginationParams,
    filters?: FilterParams
  ): Promise<ApiResponse<ExtractedEmployee[]>> {
    this.validateRequired({ departmentId }, ['departmentId'], 'getEmployeesByDepartment');
    const params = this.buildQueryParams(pagination, filters);
    return this.get<ExtractedEmployee[]>(`/departments/${departmentId}/employees`, params);
  }

  /**
   * Get employee by ID
   */
  async getEmployee(id: string): Promise<ApiResponse<ExtractedEmployee>> {
    this.validateRequired({ id }, ['id'], 'getEmployee');
    return this.get<ExtractedEmployee>(`/employees/${id}`);
  }

  /**
   * Create a new employee
   */
  async createEmployee(data: CreateEmployeeRequest): Promise<ApiResponse<ExtractedEmployee>> {
    this.validateRequired(data, [
      'organisation_id', 'full_name', 'work_email', 'email', 'phone',
      'job_title', 'department_id', 'employee_code', 'employment_type',
      'hired_at', 'salary', 'office_location', 'work_schedule', 'data_source'
    ], 'createEmployee');
    
    return this.post<ExtractedEmployee>('/employees', data);
  }

  /**
   * Update an employee
   */
  async updateEmployee(data: UpdateEmployeeRequest): Promise<ApiResponse<ExtractedEmployee>> {
    this.validateRequired(data, ['id'], 'updateEmployee');
    const { id, ...updateData } = data;
    return this.put<ExtractedEmployee>(`/employees/${id}`, updateData);
  }

  /**
   * Delete an employee
   */
  async deleteEmployee(id: string): Promise<ApiResponse<void>> {
    this.validateRequired({ id }, ['id'], 'deleteEmployee');
    return this.delete<void>(`/employees/${id}`);
  }

  /**
   * Verify an employee
   */
  async verifyEmployee(id: string): Promise<ApiResponse<ExtractedEmployee>> {
    this.validateRequired({ id }, ['id'], 'verifyEmployee');
    return this.patch<ExtractedEmployee>(`/employees/${id}/verify`);
  }

  /**
   * Deactivate an employee
   */
  async deactivateEmployee(id: string, terminationDate?: string): Promise<ApiResponse<ExtractedEmployee>> {
    this.validateRequired({ id }, ['id'], 'deactivateEmployee');
    return this.patch<ExtractedEmployee>(`/employees/${id}/deactivate`, {
      terminated_at: terminationDate || new Date().toISOString()
    });
  }

  /**
   * Reactivate an employee
   */
  async reactivateEmployee(id: string): Promise<ApiResponse<ExtractedEmployee>> {
    this.validateRequired({ id }, ['id'], 'reactivateEmployee');
    return this.patch<ExtractedEmployee>(`/employees/${id}/reactivate`);
  }

  /**
   * Search employees
   */
  async searchEmployees(
    organizationId: string,
    query: string,
    pagination?: PaginationParams
  ): Promise<ApiResponse<ExtractedEmployee[]>> {
    this.validateRequired({ organizationId, query }, ['organizationId', 'query'], 'searchEmployees');
    const params = this.buildQueryParams(pagination, { search: query });
    return this.get<ExtractedEmployee[]>(`/organizations/${organizationId}/employees/search`, params);
  }

  /**
   * Get employee reporting structure
   */
  async getEmployeeReports(id: string): Promise<ApiResponse<ExtractedEmployee[]>> {
    this.validateRequired({ id }, ['id'], 'getEmployeeReports');
    return this.get<ExtractedEmployee[]>(`/employees/${id}/reports`);
  }

  /**
   * Get employee manager chain
   */
  async getEmployeeManagerChain(id: string): Promise<ApiResponse<ExtractedEmployee[]>> {
    this.validateRequired({ id }, ['id'], 'getEmployeeManagerChain');
    return this.get<ExtractedEmployee[]>(`/employees/${id}/manager-chain`);
  }
}

// Create and export a default instance
export const organizationApi = new OrganizationApiClient();
export default organizationApi;

