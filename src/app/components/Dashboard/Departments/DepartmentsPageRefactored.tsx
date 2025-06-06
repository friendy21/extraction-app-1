"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { 
  PlusIcon, 
  Search, 
  ChevronDown, 
  Users, 
  MapPin, 
  Download, 
  FileText, 
  Trash2, 
  Edit, 
  MoreHorizontal, 
  ArrowUpDown, 
  Filter, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  PieChart, 
  UserPlus, 
  Briefcase,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import DashboardLayout from '../DashboardLayout';
import OrganizationalChart from './OrganizationalChart';
import { organizationApi } from '../../../lib/api';
import { 
  ExtractedDepartment, 
  ExtractedEmployee, 
  DepartmentHierarchy,
  ApiResponse 
} from '../../../lib/database-types';

// Enhanced Department interface with new database fields
interface DepartmentWithStats extends ExtractedDepartment {
  employeeCount: number;
  roles: { title: string; count: number }[];
  workModel: { type: string; count: number }[];
  teamMembers?: ExtractedEmployee[];
  children?: DepartmentWithStats[];
}

// Add colors for better visualization
const locationColors: Record<string, string> = {
  'San Francisco': '#3b82f6', 
  'Austin': '#f97316', 
  'New York': '#059669', 
  'London': '#8b5cf6', 
  'Chicago': '#ec4899', 
  'Boston': '#6366f1', 
  'Remote': '#64748b', 
};

const workModelColors: Record<string, string> = {
  'On-site': '#3b82f6', 
  'Hybrid': '#8b5cf6', 
  'Remote': '#64748b', 
};

// Enhanced Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl', footer }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby={title} role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" aria-hidden="true" onClick={onClose}></div>
        
        <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6 w-full sm:w-full" style={{maxWidth: maxWidth === 'full' ? '90%' : ''}}>
          <div className={`${maxWidth} mx-auto`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mt-2">{children}</div>
            
            {footer && <div className="mt-5 border-t border-gray-200 pt-5">{footer}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading Component
const LoadingSpinner: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="w-6 h-6 animate-spin mr-2" />
    <span className="text-gray-600">{message}</span>
  </div>
);

// Error Component
const ErrorMessage: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <div className="flex items-center justify-center p-8 bg-red-50 rounded-lg">
    <AlertCircle className="w-6 h-6 text-red-500 mr-2" />
    <span className="text-red-700">{message}</span>
    {onRetry && (
      <button
        onClick={onRetry}
        className="ml-4 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
      >
        Retry
      </button>
    )}
  </div>
);

// Department Form Component
interface DepartmentFormProps {
  department?: ExtractedDepartment;
  employees: ExtractedEmployee[];
  departments: ExtractedDepartment[];
  organizationId: string;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const DepartmentForm: React.FC<DepartmentFormProps> = ({
  department,
  employees,
  departments,
  organizationId,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    name: department?.name || '',
    description: department?.description || '',
    head_id: department?.head_id || '',
    parent_department_id: department?.parent_department_id || '',
    office_location: department?.office_location || '',
    data_source: department?.data_source || 'manual',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Department name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.head_id) {
      newErrors.head_id = 'Department head is required';
    }
    
    if (!formData.office_location.trim()) {
      newErrors.office_location = 'Office location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit({
        ...formData,
        organisation_id: organizationId,
      });
    } catch (error) {
      console.error('Error submitting department form:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Filter out current department from parent options
  const availableParentDepartments = departments.filter(
    dept => dept.id !== department?.id
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Department Name *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter department name"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="office_location" className="block text-sm font-medium text-gray-700 mb-2">
            Office Location *
          </label>
          <input
            type="text"
            id="office_location"
            value={formData.office_location}
            onChange={(e) => handleInputChange('office_location', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.office_location ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter office location"
          />
          {errors.office_location && <p className="mt-1 text-sm text-red-600">{errors.office_location}</p>}
        </div>

        <div>
          <label htmlFor="head_id" className="block text-sm font-medium text-gray-700 mb-2">
            Department Head *
          </label>
          <select
            id="head_id"
            value={formData.head_id}
            onChange={(e) => handleInputChange('head_id', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.head_id ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select department head</option>
            {employees.map(employee => (
              <option key={employee.id} value={employee.id}>
                {employee.full_name} - {employee.job_title}
              </option>
            ))}
          </select>
          {errors.head_id && <p className="mt-1 text-sm text-red-600">{errors.head_id}</p>}
        </div>

        <div>
          <label htmlFor="parent_department_id" className="block text-sm font-medium text-gray-700 mb-2">
            Parent Department
          </label>
          <select
            id="parent_department_id"
            value={formData.parent_department_id}
            onChange={(e) => handleInputChange('parent_department_id', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">No parent department</option>
            {availableParentDepartments.map(dept => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          id="description"
          rows={4}
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.description ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Enter department description"
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-50 flex items-center"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
          {department ? 'Update Department' : 'Create Department'}
        </button>
      </div>
    </form>
  );
};

// Main Departments Page Component
const DepartmentsPage: React.FC = () => {
  // State management
  const [departments, setDepartments] = useState<DepartmentWithStats[]>([]);
  const [employees, setEmployees] = useState<ExtractedEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'employeeCount' | 'location'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'chart'>('grid');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<ExtractedDepartment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Organization ID - in a real app, this would come from context or props
  const organizationId = 'default-org-id';

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load departments and employees in parallel
      const [departmentsResponse, employeesResponse] = await Promise.all([
        organizationApi.getDepartments(organizationId),
        organizationApi.getEmployees(organizationId)
      ]);

      if (departmentsResponse.success && departmentsResponse.data) {
        // Transform departments to include stats
        const departmentsWithStats = await Promise.all(
          departmentsResponse.data.map(async (dept) => {
            const deptEmployees = employeesResponse.data?.filter(
              emp => emp.department_id === dept.id
            ) || [];

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
            const workModel = [
              { type: 'On-site', count: Math.floor(deptEmployees.length * 0.6) },
              { type: 'Hybrid', count: Math.floor(deptEmployees.length * 0.3) },
              { type: 'Remote', count: Math.floor(deptEmployees.length * 0.1) },
            ];

            return {
              ...dept,
              employeeCount: deptEmployees.length,
              roles,
              workModel,
              teamMembers: deptEmployees.slice(0, 5), // Show first 5 employees
            };
          })
        );

        setDepartments(departmentsWithStats);
      }

      if (employeesResponse.success && employeesResponse.data) {
        setEmployees(employeesResponse.data);
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load departments and employees. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle department creation
  const handleCreateDepartment = async (data: any) => {
    try {
      setIsSubmitting(true);
      const response = await organizationApi.createDepartment(data);
      
      if (response.success) {
        setShowAddModal(false);
        await loadData(); // Reload data
      } else {
        throw new Error(response.error || 'Failed to create department');
      }
    } catch (err) {
      console.error('Error creating department:', err);
      setError(err instanceof Error ? err.message : 'Failed to create department');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle department update
  const handleUpdateDepartment = async (data: any) => {
    if (!selectedDepartment) return;

    try {
      setIsSubmitting(true);
      const response = await organizationApi.updateDepartment({
        id: selectedDepartment.id,
        ...data,
      });
      
      if (response.success) {
        setShowEditModal(false);
        setSelectedDepartment(null);
        await loadData(); // Reload data
      } else {
        throw new Error(response.error || 'Failed to update department');
      }
    } catch (err) {
      console.error('Error updating department:', err);
      setError(err instanceof Error ? err.message : 'Failed to update department');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle department deletion
  const handleDeleteDepartment = async () => {
    if (!selectedDepartment) return;

    try {
      setIsSubmitting(true);
      const response = await organizationApi.deleteDepartment(selectedDepartment.id);
      
      if (response.success) {
        setShowDeleteModal(false);
        setSelectedDepartment(null);
        await loadData(); // Reload data
      } else {
        throw new Error(response.error || 'Failed to delete department');
      }
    } catch (err) {
      console.error('Error deleting department:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete department');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter and sort departments
  const filteredAndSortedDepartments = useMemo(() => {
    let filtered = departments.filter(dept =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.office_location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'employeeCount':
          aValue = a.employeeCount;
          bValue = b.employeeCount;
          break;
        case 'location':
          aValue = a.office_location.toLowerCase();
          bValue = b.office_location.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [departments, searchTerm, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedDepartments.length / itemsPerPage);
  const paginatedDepartments = filteredAndSortedDepartments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle sort change
  const handleSort = (field: 'name' | 'employeeCount' | 'location') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner message="Loading departments..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your organization's departments and structure
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Department
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <ErrorMessage 
            message={error} 
            onRetry={() => {
              setError(null);
              loadData();
            }}
          />
        )}

        {/* Filters and Search */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search departments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
                >
                  <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                  </div>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
                >
                  <FileText className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('chart')}
                  className={`p-2 rounded ${viewMode === 'chart' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
                >
                  <PieChart className="w-4 h-4" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-') as [typeof sortBy, typeof sortOrder];
                    setSortBy(field);
                    setSortOrder(order);
                  }}
                  className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="employeeCount-desc">Most Employees</option>
                  <option value="employeeCount-asc">Least Employees</option>
                  <option value="location-asc">Location A-Z</option>
                  <option value="location-desc">Location Z-A</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Content based on view mode */}
        {viewMode === 'chart' ? (
          <div className="bg-white shadow rounded-lg p-6">
            <OrganizationalChart departments={departments} />
          </div>
        ) : (
          <>
            {/* Departments Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedDepartments.map((department) => (
                  <DepartmentCard
                    key={department.id}
                    department={department}
                    onEdit={(dept) => {
                      setSelectedDepartment(dept);
                      setShowEditModal(true);
                    }}
                    onDelete={(dept) => {
                      setSelectedDepartment(dept);
                      setShowDeleteModal(true);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <DepartmentTable
                  departments={paginatedDepartments}
                  onEdit={(dept) => {
                    setSelectedDepartment(dept);
                    setShowEditModal(true);
                  }}
                  onDelete={(dept) => {
                    setSelectedDepartment(dept);
                    setShowDeleteModal(true);
                  }}
                  onSort={handleSort}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                />
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between bg-white px-4 py-3 border-t border-gray-200 sm:px-6 rounded-lg shadow">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{' '}
                      <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>
                      {' '}to{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * itemsPerPage, filteredAndSortedDepartments.length)}
                      </span>
                      {' '}of{' '}
                      <span className="font-medium">{filteredAndSortedDepartments.length}</span>
                      {' '}results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === currentPage
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Modals */}
        {showAddModal && (
          <Modal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            title="Add New Department"
            maxWidth="max-w-4xl"
          >
            <DepartmentForm
              employees={employees}
              departments={departments}
              organizationId={organizationId}
              onSubmit={handleCreateDepartment}
              onCancel={() => setShowAddModal(false)}
              isLoading={isSubmitting}
            />
          </Modal>
        )}

        {showEditModal && selectedDepartment && (
          <Modal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setSelectedDepartment(null);
            }}
            title="Edit Department"
            maxWidth="max-w-4xl"
          >
            <DepartmentForm
              department={selectedDepartment}
              employees={employees}
              departments={departments}
              organizationId={organizationId}
              onSubmit={handleUpdateDepartment}
              onCancel={() => {
                setShowEditModal(false);
                setSelectedDepartment(null);
              }}
              isLoading={isSubmitting}
            />
          </Modal>
        )}

        {showDeleteModal && selectedDepartment && (
          <Modal
            isOpen={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false);
              setSelectedDepartment(null);
            }}
            title="Delete Department"
            maxWidth="max-w-md"
            footer={
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedDepartment(null);
                  }}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteDepartment}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 disabled:opacity-50 flex items-center"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Delete Department
                </button>
              </div>
            }
          >
            <div className="space-y-4">
              <div className="flex items-center">
                <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Are you sure you want to delete this department?
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    This action cannot be undone. All data associated with this department will be permanently removed.
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900">{selectedDepartment.name}</h4>
                <p className="text-sm text-gray-600">{selectedDepartment.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Location: {selectedDepartment.office_location}
                </p>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  );
};

// Department Card Component (for grid view)
interface DepartmentCardProps {
  department: DepartmentWithStats;
  onEdit: (department: ExtractedDepartment) => void;
  onDelete: (department: ExtractedDepartment) => void;
}

const DepartmentCard: React.FC<DepartmentCardProps> = ({ department, onEdit, onDelete }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{department.name}</h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{department.description}</p>
            
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              {department.office_location}
            </div>
            
            <div className="flex items-center text-sm text-gray-500">
              <Users className="w-4 h-4 mr-1" />
              {department.employeeCount} employees
            </div>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="py-1">
                  <button
                    onClick={() => {
                      onEdit(department);
                      setShowDropdown(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Department
                  </button>
                  <button
                    onClick={() => {
                      onDelete(department);
                      setShowDropdown(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Department
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Verification Status */}
        <div className="mt-4 flex items-center">
          {department.isVerified ? (
            <div className="flex items-center text-green-600">
              <CheckCircle className="w-4 h-4 mr-1" />
              <span className="text-sm">Verified</span>
            </div>
          ) : (
            <div className="flex items-center text-yellow-600">
              <AlertCircle className="w-4 h-4 mr-1" />
              <span className="text-sm">Pending Verification</span>
            </div>
          )}
        </div>
        
        {/* Team Members Preview */}
        {department.teamMembers && department.teamMembers.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Team Members</h4>
            <div className="flex -space-x-2">
              {department.teamMembers.slice(0, 4).map((member) => (
                <div
                  key={member.id}
                  className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-700"
                  title={member.full_name}
                >
                  {member.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
              ))}
              {department.teamMembers.length > 4 && (
                <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-500">
                  +{department.teamMembers.length - 4}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Department Table Component (for list view)
interface DepartmentTableProps {
  departments: DepartmentWithStats[];
  onEdit: (department: ExtractedDepartment) => void;
  onDelete: (department: ExtractedDepartment) => void;
  onSort: (field: 'name' | 'employeeCount' | 'location') => void;
  sortBy: string;
  sortOrder: string;
}

const DepartmentTable: React.FC<DepartmentTableProps> = ({
  departments,
  onEdit,
  onDelete,
  onSort,
  sortBy,
  sortOrder
}) => {
  const getSortIcon = (field: string) => {
    if (sortBy !== field) return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    return sortOrder === 'asc' ? 
      <ArrowUpDown className="w-4 h-4 text-blue-500 rotate-180" /> : 
      <ArrowUpDown className="w-4 h-4 text-blue-500" />;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              onClick={() => onSort('name')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              <div className="flex items-center space-x-1">
                <span>Department</span>
                {getSortIcon('name')}
              </div>
            </th>
            <th
              onClick={() => onSort('location')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              <div className="flex items-center space-x-1">
                <span>Location</span>
                {getSortIcon('location')}
              </div>
            </th>
            <th
              onClick={() => onSort('employeeCount')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              <div className="flex items-center space-x-1">
                <span>Employees</span>
                {getSortIcon('employeeCount')}
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data Source
            </th>
            <th className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {departments.map((department) => (
            <tr key={department.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">{department.name}</div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">{department.description}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-900">
                  <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                  {department.office_location}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-900">
                  <Users className="w-4 h-4 mr-1 text-gray-400" />
                  {department.employeeCount}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {department.isVerified ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Pending
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className="capitalize">{department.data_source}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEdit(department)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(department)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DepartmentsPage;

