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
  AlertCircle,
  CheckCircle,
  Loader2,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  Clock,
  DollarSign,
  UserCheck,
  UserX
} from 'lucide-react';
import DashboardLayout from '../DashboardLayout';
import { organizationApi } from '../../../lib/api';
import { 
  ExtractedEmployee, 
  ExtractedDepartment,
  ApiResponse 
} from '../../../lib/database-types';

// Enhanced Employee interface with additional display fields
interface EmployeeWithDepartment extends ExtractedEmployee {
  department_name?: string;
  manager_name?: string;
}

// Modal Component
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

// Employee Form Component
interface EmployeeFormProps {
  employee?: ExtractedEmployee;
  departments: ExtractedDepartment[];
  employees: ExtractedEmployee[];
  organizationId: string;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  employee,
  departments,
  employees,
  organizationId,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    full_name: employee?.full_name || '',
    work_email: employee?.work_email || '',
    email: employee?.email || '',
    phone: employee?.phone || '',
    job_title: employee?.job_title || '',
    department_id: employee?.department_id || '',
    manager_id: employee?.manager_id || '',
    employee_code: employee?.employee_code || '',
    employment_type: employee?.employment_type || 'full-time',
    hired_at: employee?.hired_at ? employee.hired_at.split('T')[0] : '',
    salary: employee?.salary || 0,
    office_location: employee?.office_location || '',
    work_schedule: employee?.work_schedule || {},
    data_source: employee?.data_source || 'manual',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }
    
    if (!formData.work_email.trim()) {
      newErrors.work_email = 'Work email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.work_email)) {
      newErrors.work_email = 'Invalid email format';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Personal email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.job_title.trim()) {
      newErrors.job_title = 'Job title is required';
    }
    
    if (!formData.department_id) {
      newErrors.department_id = 'Department is required';
    }
    
    if (!formData.employee_code.trim()) {
      newErrors.employee_code = 'Employee code is required';
    }
    
    if (!formData.hired_at) {
      newErrors.hired_at = 'Hire date is required';
    }
    
    if (formData.salary < 0) {
      newErrors.salary = 'Salary must be a positive number';
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
        hired_at: new Date(formData.hired_at).toISOString(),
      });
    } catch (error) {
      console.error('Error submitting employee form:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Filter out current employee from manager options
  const availableManagers = employees.filter(
    emp => emp.id !== employee?.id
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="full_name"
            value={formData.full_name}
            onChange={(e) => handleInputChange('full_name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.full_name ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter full name"
          />
          {errors.full_name && <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>}
        </div>

        <div>
          <label htmlFor="employee_code" className="block text-sm font-medium text-gray-700 mb-2">
            Employee Code *
          </label>
          <input
            type="text"
            id="employee_code"
            value={formData.employee_code}
            onChange={(e) => handleInputChange('employee_code', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.employee_code ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter employee code"
          />
          {errors.employee_code && <p className="mt-1 text-sm text-red-600">{errors.employee_code}</p>}
        </div>

        <div>
          <label htmlFor="work_email" className="block text-sm font-medium text-gray-700 mb-2">
            Work Email *
          </label>
          <input
            type="email"
            id="work_email"
            value={formData.work_email}
            onChange={(e) => handleInputChange('work_email', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.work_email ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter work email"
          />
          {errors.work_email && <p className="mt-1 text-sm text-red-600">{errors.work_email}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Personal Email *
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter personal email"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <label htmlFor="job_title" className="block text-sm font-medium text-gray-700 mb-2">
            Job Title *
          </label>
          <input
            type="text"
            id="job_title"
            value={formData.job_title}
            onChange={(e) => handleInputChange('job_title', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.job_title ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter job title"
          />
          {errors.job_title && <p className="mt-1 text-sm text-red-600">{errors.job_title}</p>}
        </div>

        <div>
          <label htmlFor="department_id" className="block text-sm font-medium text-gray-700 mb-2">
            Department *
          </label>
          <select
            id="department_id"
            value={formData.department_id}
            onChange={(e) => handleInputChange('department_id', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.department_id ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select department</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
          {errors.department_id && <p className="mt-1 text-sm text-red-600">{errors.department_id}</p>}
        </div>

        <div>
          <label htmlFor="manager_id" className="block text-sm font-medium text-gray-700 mb-2">
            Manager
          </label>
          <select
            id="manager_id"
            value={formData.manager_id}
            onChange={(e) => handleInputChange('manager_id', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">No manager</option>
            {availableManagers.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.full_name} - {emp.job_title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="employment_type" className="block text-sm font-medium text-gray-700 mb-2">
            Employment Type *
          </label>
          <select
            id="employment_type"
            value={formData.employment_type}
            onChange={(e) => handleInputChange('employment_type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="intern">Intern</option>
            <option value="consultant">Consultant</option>
          </select>
        </div>

        <div>
          <label htmlFor="hired_at" className="block text-sm font-medium text-gray-700 mb-2">
            Hire Date *
          </label>
          <input
            type="date"
            id="hired_at"
            value={formData.hired_at}
            onChange={(e) => handleInputChange('hired_at', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.hired_at ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.hired_at && <p className="mt-1 text-sm text-red-600">{errors.hired_at}</p>}
        </div>

        <div>
          <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-2">
            Salary
          </label>
          <input
            type="number"
            id="salary"
            min="0"
            step="0.01"
            value={formData.salary}
            onChange={(e) => handleInputChange('salary', parseFloat(e.target.value) || 0)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.salary ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter salary"
          />
          {errors.salary && <p className="mt-1 text-sm text-red-600">{errors.salary}</p>}
        </div>

        <div>
          <label htmlFor="office_location" className="block text-sm font-medium text-gray-700 mb-2">
            Office Location
          </label>
          <input
            type="text"
            id="office_location"
            value={formData.office_location}
            onChange={(e) => handleInputChange('office_location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter office location"
          />
        </div>
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
          {employee ? 'Update Employee' : 'Create Employee'}
        </button>
      </div>
    </form>
  );
};

// Employee Detail Modal
interface EmployeeDetailModalProps {
  employee: EmployeeWithDepartment;
  onClose: () => void;
  onEdit: () => void;
  onDeactivate: () => void;
  onReactivate: () => void;
}

const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  employee,
  onClose,
  onEdit,
  onDeactivate,
  onReactivate
}) => {
  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Employee Details"
      maxWidth="max-w-4xl"
      footer={
        <div className="flex justify-between">
          <div className="flex space-x-3">
            {employee.is_active ? (
              <button
                onClick={onDeactivate}
                className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 border border-red-300 rounded-md hover:bg-red-200"
              >
                <UserX className="w-4 h-4 mr-2 inline" />
                Deactivate Employee
              </button>
            ) : (
              <button
                onClick={onReactivate}
                className="px-4 py-2 text-sm font-medium text-green-700 bg-green-100 border border-green-300 rounded-md hover:bg-green-200"
              >
                <UserCheck className="w-4 h-4 mr-2 inline" />
                Reactivate Employee
              </button>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            >
              Close
            </button>
            <button
              onClick={onEdit}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
            >
              <Edit className="w-4 h-4 mr-2 inline" />
              Edit Employee
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header with avatar and basic info */}
        <div className="flex items-start space-x-4">
          <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold text-gray-700">
            {employee.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{employee.full_name}</h2>
            <p className="text-lg text-gray-600">{employee.job_title}</p>
            <p className="text-sm text-gray-500">{employee.department_name}</p>
            <div className="mt-2 flex items-center space-x-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                employee.is_active 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {employee.is_active ? 'Active' : 'Inactive'}
              </span>
              {employee.isVerified ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Pending Verification
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
            
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Work Email</p>
                <p className="text-sm text-gray-600">{employee.work_email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Personal Email</p>
                <p className="text-sm text-gray-600">{employee.email}</p>
              </div>
            </div>
            
            {employee.phone && (
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Phone</p>
                  <p className="text-sm text-gray-600">{employee.phone}</p>
                </div>
              </div>
            )}
            
            {employee.office_location && (
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Office Location</p>
                  <p className="text-sm text-gray-600">{employee.office_location}</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Employment Details</h3>
            
            <div className="flex items-center space-x-3">
              <Briefcase className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Employee Code</p>
                <p className="text-sm text-gray-600">{employee.employee_code}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Employment Type</p>
                <p className="text-sm text-gray-600 capitalize">{employee.employment_type}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Hire Date</p>
                <p className="text-sm text-gray-600">
                  {new Date(employee.hired_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            {employee.salary > 0 && (
              <div className="flex items-center space-x-3">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Salary</p>
                  <p className="text-sm text-gray-600">
                    ${employee.salary.toLocaleString()}
                  </p>
                </div>
              </div>
            )}
            
            {employee.manager_name && (
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Manager</p>
                  <p className="text-sm text-gray-600">{employee.manager_name}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Data Source Information */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Data Source Information</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-900">Data Source</p>
                <p className="text-gray-600 capitalize">{employee.data_source}</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Created</p>
                <p className="text-gray-600">
                  {new Date(employee.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Last Updated</p>
                <p className="text-gray-600">
                  {new Date(employee.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

// Main Employees Page Component
const EmployeesPage: React.FC = () => {
  // State management
  const [employees, setEmployees] = useState<EmployeeWithDepartment[]>([]);
  const [departments, setDepartments] = useState<ExtractedDepartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState<'full_name' | 'job_title' | 'department' | 'hired_at'>('full_name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeWithDepartment | null>(null);
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

      // Load employees and departments in parallel
      const [employeesResponse, departmentsResponse] = await Promise.all([
        organizationApi.getEmployees(organizationId),
        organizationApi.getDepartments(organizationId)
      ]);

      if (departmentsResponse.success && departmentsResponse.data) {
        setDepartments(departmentsResponse.data);
      }

      if (employeesResponse.success && employeesResponse.data) {
        // Enhance employees with department and manager names
        const enhancedEmployees = employeesResponse.data.map(emp => {
          const department = departmentsResponse.data?.find(dept => dept.id === emp.department_id);
          const manager = employeesResponse.data?.find(mgr => mgr.id === emp.manager_id);
          
          return {
            ...emp,
            department_name: department?.name || 'Unknown Department',
            manager_name: manager?.full_name || undefined,
          };
        });

        setEmployees(enhancedEmployees);
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load employees and departments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle employee creation
  const handleCreateEmployee = async (data: any) => {
    try {
      setIsSubmitting(true);
      const response = await organizationApi.createEmployee(data);
      
      if (response.success) {
        setShowAddModal(false);
        await loadData(); // Reload data
      } else {
        throw new Error(response.error || 'Failed to create employee');
      }
    } catch (err) {
      console.error('Error creating employee:', err);
      setError(err instanceof Error ? err.message : 'Failed to create employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle employee update
  const handleUpdateEmployee = async (data: any) => {
    if (!selectedEmployee) return;

    try {
      setIsSubmitting(true);
      const response = await organizationApi.updateEmployee({
        id: selectedEmployee.id,
        ...data,
      });
      
      if (response.success) {
        setShowEditModal(false);
        setSelectedEmployee(null);
        await loadData(); // Reload data
      } else {
        throw new Error(response.error || 'Failed to update employee');
      }
    } catch (err) {
      console.error('Error updating employee:', err);
      setError(err instanceof Error ? err.message : 'Failed to update employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle employee deletion
  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return;

    try {
      setIsSubmitting(true);
      const response = await organizationApi.deleteEmployee(selectedEmployee.id);
      
      if (response.success) {
        setShowDeleteModal(false);
        setSelectedEmployee(null);
        await loadData(); // Reload data
      } else {
        throw new Error(response.error || 'Failed to delete employee');
      }
    } catch (err) {
      console.error('Error deleting employee:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle employee deactivation
  const handleDeactivateEmployee = async () => {
    if (!selectedEmployee) return;

    try {
      setIsSubmitting(true);
      const response = await organizationApi.deactivateEmployee(selectedEmployee.id);
      
      if (response.success) {
        setShowDetailModal(false);
        setSelectedEmployee(null);
        await loadData(); // Reload data
      } else {
        throw new Error(response.error || 'Failed to deactivate employee');
      }
    } catch (err) {
      console.error('Error deactivating employee:', err);
      setError(err instanceof Error ? err.message : 'Failed to deactivate employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle employee reactivation
  const handleReactivateEmployee = async () => {
    if (!selectedEmployee) return;

    try {
      setIsSubmitting(true);
      const response = await organizationApi.reactivateEmployee(selectedEmployee.id);
      
      if (response.success) {
        setShowDetailModal(false);
        setSelectedEmployee(null);
        await loadData(); // Reload data
      } else {
        throw new Error(response.error || 'Failed to reactivate employee');
      }
    } catch (err) {
      console.error('Error reactivating employee:', err);
      setError(err instanceof Error ? err.message : 'Failed to reactivate employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter and sort employees
  const filteredAndSortedEmployees = useMemo(() => {
    let filtered = employees.filter(emp => {
      const matchesSearch = 
        emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.work_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employee_code.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = !departmentFilter || emp.department_id === departmentFilter;
      
      const matchesStatus = !statusFilter || 
        (statusFilter === 'active' && emp.is_active) ||
        (statusFilter === 'inactive' && !emp.is_active) ||
        (statusFilter === 'verified' && emp.isVerified) ||
        (statusFilter === 'unverified' && !emp.isVerified);

      return matchesSearch && matchesDepartment && matchesStatus;
    });

    filtered.sort((a, b) => {
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
        case 'department':
          aValue = a.department_name?.toLowerCase() || '';
          bValue = b.department_name?.toLowerCase() || '';
          break;
        case 'hired_at':
          aValue = new Date(a.hired_at).getTime();
          bValue = new Date(b.hired_at).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [employees, searchTerm, departmentFilter, statusFilter, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredAndSortedEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle sort change
  const handleSort = (field: typeof sortBy) => {
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
        <LoadingSpinner message="Loading employees..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your organization's employees and their information
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Employee
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-') as [typeof sortBy, typeof sortOrder];
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="full_name-asc">Name A-Z</option>
                <option value="full_name-desc">Name Z-A</option>
                <option value="job_title-asc">Job Title A-Z</option>
                <option value="job_title-desc">Job Title Z-A</option>
                <option value="department-asc">Department A-Z</option>
                <option value="department-desc">Department Z-A</option>
                <option value="hired_at-desc">Newest First</option>
                <option value="hired_at-asc">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Employees Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <EmployeeTable
            employees={paginatedEmployees}
            onView={(emp) => {
              setSelectedEmployee(emp);
              setShowDetailModal(true);
            }}
            onEdit={(emp) => {
              setSelectedEmployee(emp);
              setShowEditModal(true);
            }}
            onDelete={(emp) => {
              setSelectedEmployee(emp);
              setShowDeleteModal(true);
            }}
            onSort={handleSort}
            sortBy={sortBy}
            sortOrder={sortOrder}
          />
        </div>

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
                    {Math.min(currentPage * itemsPerPage, filteredAndSortedEmployees.length)}
                  </span>
                  {' '}of{' '}
                  <span className="font-medium">{filteredAndSortedEmployees.length}</span>
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

        {/* Modals */}
        {showAddModal && (
          <Modal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            title="Add New Employee"
            maxWidth="max-w-4xl"
          >
            <EmployeeForm
              departments={departments}
              employees={employees}
              organizationId={organizationId}
              onSubmit={handleCreateEmployee}
              onCancel={() => setShowAddModal(false)}
              isLoading={isSubmitting}
            />
          </Modal>
        )}

        {showEditModal && selectedEmployee && (
          <Modal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setSelectedEmployee(null);
            }}
            title="Edit Employee"
            maxWidth="max-w-4xl"
          >
            <EmployeeForm
              employee={selectedEmployee}
              departments={departments}
              employees={employees}
              organizationId={organizationId}
              onSubmit={handleUpdateEmployee}
              onCancel={() => {
                setShowEditModal(false);
                setSelectedEmployee(null);
              }}
              isLoading={isSubmitting}
            />
          </Modal>
        )}

        {showDetailModal && selectedEmployee && (
          <EmployeeDetailModal
            employee={selectedEmployee}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedEmployee(null);
            }}
            onEdit={() => {
              setShowDetailModal(false);
              setShowEditModal(true);
            }}
            onDeactivate={handleDeactivateEmployee}
            onReactivate={handleReactivateEmployee}
          />
        )}

        {showDeleteModal && selectedEmployee && (
          <Modal
            isOpen={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false);
              setSelectedEmployee(null);
            }}
            title="Delete Employee"
            maxWidth="max-w-md"
            footer={
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedEmployee(null);
                  }}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteEmployee}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 disabled:opacity-50 flex items-center"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Delete Employee
                </button>
              </div>
            }
          >
            <div className="space-y-4">
              <div className="flex items-center">
                <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Are you sure you want to delete this employee?
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    This action cannot be undone. All data associated with this employee will be permanently removed.
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900">{selectedEmployee.full_name}</h4>
                <p className="text-sm text-gray-600">{selectedEmployee.job_title}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedEmployee.work_email}
                </p>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  );
};

// Employee Table Component
interface EmployeeTableProps {
  employees: EmployeeWithDepartment[];
  onView: (employee: EmployeeWithDepartment) => void;
  onEdit: (employee: EmployeeWithDepartment) => void;
  onDelete: (employee: EmployeeWithDepartment) => void;
  onSort: (field: 'full_name' | 'job_title' | 'department' | 'hired_at') => void;
  sortBy: string;
  sortOrder: string;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  onView,
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
              onClick={() => onSort('full_name')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              <div className="flex items-center space-x-1">
                <span>Employee</span>
                {getSortIcon('full_name')}
              </div>
            </th>
            <th
              onClick={() => onSort('job_title')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              <div className="flex items-center space-x-1">
                <span>Job Title</span>
                {getSortIcon('job_title')}
              </div>
            </th>
            <th
              onClick={() => onSort('department')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              <div className="flex items-center space-x-1">
                <span>Department</span>
                {getSortIcon('department')}
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Employment Type
            </th>
            <th
              onClick={() => onSort('hired_at')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              <div className="flex items-center space-x-1">
                <span>Hire Date</span>
                {getSortIcon('hired_at')}
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {employees.map((employee) => (
            <tr key={employee.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-700">
                      {employee.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{employee.full_name}</div>
                    <div className="text-sm text-gray-500">{employee.work_email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{employee.job_title}</div>
                <div className="text-sm text-gray-500">{employee.employee_code}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {employee.department_name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                {employee.employment_type}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(employee.hired_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col space-y-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    employee.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {employee.is_active ? 'Active' : 'Inactive'}
                  </span>
                  {employee.isVerified ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Pending
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onView(employee)}
                    className="text-blue-600 hover:text-blue-900"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(employee)}
                    className="text-blue-600 hover:text-blue-900"
                    title="Edit Employee"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(employee)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete Employee"
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

export default EmployeesPage;

