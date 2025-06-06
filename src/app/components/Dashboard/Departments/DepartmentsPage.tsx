"use client"

import React, { useState, useMemo } from 'react';
import { PlusIcon, Search, ChevronDown, Users, MapPin, Download, FileText, Trash2, Edit, MoreHorizontal, ArrowUpDown, Filter, Eye, ChevronLeft, ChevronRight, PieChart, UserPlus, Briefcase } from 'lucide-react';
import DashboardLayout from '../DashboardLayout';
import OrganizationalChart from './OrganizationalChart';

// Define the Department interface
interface Department {
  id: string;
  name: string;
  head: string;
  headId: string;
  employeeCount: number;
  location: string;
  organization: string;
  status: 'Active' | 'Inactive';
  description: string;
  roles: { title: string; count: number }[];
  workModel: { type: string; count: number }[];
  teamMembers?: { id: string; name: string; role: string; avatar: string }[];
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
        
        {/* Modal panel */}
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

//Transfer Employee Modal Component
const TransferEmployeeModal: React.FC<{
  departments: Department[];
  sourceDepartment: Department;
  employee: { id: string; name: string; role: string; avatar: string };
  onClose: () => void;
  onTransfer: (
    employeeId: string, 
    sourceDepartmentId: string, 
    targetDepartmentId: string
  ) => void;
}> = ({ departments, sourceDepartment, employee, onClose, onTransfer }) => {
  const [targetDepartmentId, setTargetDepartmentId] = useState<string>('');
  
  // Filter out the current department from options
  const availableDepartments = departments.filter(
    dept => dept.id !== sourceDepartment.id
  );
  
  const handleTransfer = () => {
    if (!targetDepartmentId) return;
    onTransfer(employee.id, sourceDepartment.id, targetDepartmentId);
    onClose();
  };
  
  return (
    <Modal 
      isOpen={true} 
      onClose={onClose} 
      title="Transfer Employee"
      maxWidth="max-w-lg"
      footer={
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleTransfer}
            disabled={!targetDepartmentId}
            className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm ${
              targetDepartmentId 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-blue-400 cursor-not-allowed'
            }`}
          >
            Transfer Employee
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="flex items-center p-4 bg-gray-50 rounded-lg">
          <div className="flex-shrink-0 mr-4">
            <img className="h-16 w-16 rounded-full" src={employee.avatar} alt={employee.name} />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">{employee.name}</h3>
            <p className="text-sm text-gray-500">{employee.role}</p>
            <div className="mt-1 flex items-center">
              <span className="text-sm text-gray-500">Current Department:</span>
              <span className="ml-1 text-sm font-medium text-gray-900">{sourceDepartment.name}</span>
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="targetDepartment" className="block text-sm font-medium text-gray-700 mb-1">
            Select Target Department
          </label>
          <select
            id="targetDepartment"
            value={targetDepartmentId}
            onChange={(e) => setTargetDepartmentId(e.target.value)}
            className="block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a department</option>
            {availableDepartments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name} ({dept.location})
              </option>
            ))}
          </select>
        </div>
        
        {targetDepartmentId && (
          <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Confirmation</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    You are about to transfer <strong>{employee.name}</strong> from <strong>{sourceDepartment.name}</strong> to <strong>{departments.find(d => d.id === targetDepartmentId)?.name}</strong>. This action will update both departments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

// employee transfer functionality
const DepartmentViewModal: React.FC<{
  department: Department;
  departments: Department[]; 
  onClose: () => void;
  onEdit: () => void;
  onTransferEmployee: (
    employeeId: string, 
    sourceDepartmentId: string, 
    targetDepartmentId: string
  ) => void;
}> = ({ department, departments, onClose, onEdit, onTransferEmployee }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'team'>('overview');
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<{
    id: string;
    name: string;
    role: string;
    avatar: string;
  } | null>(null);
  
  // Generate the work model and roles charts data
  const workModelTotal = department.workModel.reduce((sum, item) => sum + item.count, 0);
  const roleTotal = department.roles.reduce((sum, item) => sum + item.count, 0);
  
  const handleTransferClick = (employee: {
    id: string;
    name: string;
    role: string;
    avatar: string;
  }) => {
    setSelectedEmployee(employee);
    setTransferModalOpen(true);
  };
  
  return (
    <>
      <Modal 
        isOpen={true} 
        onClose={onClose} 
        title="Department Details" 
        maxWidth="max-w-4xl"
        footer={
          <div className="flex justify-end space-x-3">
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
              Edit Department
            </button>
          </div>
        }
      >
        <div className="bg-gray-50 rounded-lg p-4 mb-6 flex items-center">
          <div className="p-3 bg-white rounded-md mr-4 shadow-sm border border-gray-200">
            <Briefcase size={24} className="text-blue-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{department.name}</h2>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                {department.status}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin size={14} />
                {department.location}
              </span>
              <span className="mx-2">•</span>
              <span className="inline-flex items-center gap-1">
                <Users size={14} />
                {department.employeeCount} employees
              </span>
            </div>
          </div>
        </div>
        
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`border-b-2 pb-4 px-1 text-sm font-medium ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`border-b-2 pb-4 px-1 text-sm font-medium ${
                activeTab === 'team'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('team')}
            >
              Team Members ({department.teamMembers?.length || 0})
            </button>
          </nav>
        </div>
        
        {activeTab === 'overview' ? (
          <div>
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-gray-700">{department.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Role Distribution</h3>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex flex-col space-y-3">
                    {department.roles.map((role, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: `hsl(${210 + index * 30}, 70%, 60%)` }}></div>
                          <span className="text-sm text-gray-600">{role.title}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">{role.count}</span>
                          <span className="text-xs text-gray-500 ml-1">({Math.round(role.count / roleTotal * 100)}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Work Model</h3>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex justify-between mb-4">
                    {department.workModel.map((model, index) => (
                      <div key={index} className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-2" style={{ backgroundColor: workModelColors[model.type] }}>
                          <span className="text-white font-bold">{Math.round(model.count / workModelTotal * 100)}%</span>
                        </div>
                        <div className="text-sm font-medium text-gray-900">{model.count}</div>
                        <div className="text-xs text-gray-500">{model.type}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    {department.workModel.map((model, index) => (
                      <div 
                        key={index}
                        className="h-2.5 rounded-full" 
                        style={{ 
                          width: `${Math.round(model.count / workModelTotal * 100)}%`,
                          backgroundColor: workModelColors[model.type],
                          float: 'left',
                          borderTopRightRadius: index === department.workModel.length - 1 ? '0.375rem' : '0',
                          borderBottomRightRadius: index === department.workModel.length - 1 ? '0.375rem' : '0'
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Department Details</h3>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <dl className="grid grid-cols-1 gap-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Department Head</dt>
                      <dd className="mt-1 text-sm text-gray-900 flex items-center">
                        <div className="h-6 w-6 rounded-full bg-gray-200 mr-2 overflow-hidden">
                          <img src="/api/placeholder/24/24" alt={department.head} />
                        </div>
                        {department.head}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Organization</dt>
                      <dd className="mt-1 text-sm text-gray-900">{department.organization}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Location</dt>
                      <dd className="mt-1 text-sm text-gray-900 flex items-center">
                        <div className="h-2 w-2 rounded-full mr-2" style={{ backgroundColor: locationColors[department.location] }}></div>
                        {department.location}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Team Members</h3>
              <button
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <UserPlus size={14} className="mr-1" />
                Add Member
              </button>
            </div>
            <div className="bg-white overflow-hidden border border-gray-200 rounded-lg shadow-sm">
              <ul className="divide-y divide-gray-200">
                {department.teamMembers ? (
                  department.teamMembers.map(member => (
                    <li key={member.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <img className="h-10 w-10 rounded-full" src={member.avatar} alt={member.name} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                          <p className="text-sm text-gray-500 truncate">{member.role}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleTransferClick(member)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            Transfer
                          </button>
                          <button className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            View Profile
                          </button>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="p-8 text-center text-gray-500">No team members available</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </Modal>
      
      {/* Transfer Employee Modal */}
      {transferModalOpen && selectedEmployee && (
        <TransferEmployeeModal
          departments={departments}
          sourceDepartment={department}
          employee={selectedEmployee}
          onClose={() => {
            setTransferModalOpen(false);
            setSelectedEmployee(null);
          }}
          onTransfer={onTransferEmployee}
        />
      )}
    </>
  );
};

// Department Edit Modal
const DepartmentEditModal: React.FC<{
  department: Department;
  onClose: () => void;
  onSave: (department: Department) => void;
}> = ({ department, onClose, onSave }) => {
  const [editedDepartment, setEditedDepartment] = useState<Department>({...department});
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedDepartment(prev => ({...prev, [name]: value}));
  };
  
  return (
    <Modal 
      isOpen={true} 
      onClose={onClose} 
      title="Edit Department" 
      maxWidth="max-w-3xl"
      footer={
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(editedDepartment)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      }
    >
      <form className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Department Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={editedDepartment.name}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="head" className="block text-sm font-medium text-gray-700">Department Head</label>
            <input
              type="text"
              name="head"
              id="head"
              value={editedDepartment.head}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
            <select
              name="location"
              id="location"
              value={editedDepartment.location}
              onChange={handleInputChange}
              className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="San Francisco">San Francisco</option>
              <option value="Austin">Austin</option>
              <option value="New York">New York</option>
              <option value="London">London</option>
              <option value="Chicago">Chicago</option>
              <option value="Boston">Boston</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="organization" className="block text-sm font-medium text-gray-700">Organization</label>
            <input
              type="text"
              name="organization"
              id="organization"
              value={editedDepartment.organization}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="employeeCount" className="block text-sm font-medium text-gray-700">Employee Count</label>
            <input
              type="number"
              name="employeeCount"
              id="employeeCount"
              value={editedDepartment.employeeCount}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              id="status"
              value={editedDepartment.status}
              onChange={handleInputChange}
              className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            id="description"
            rows={4}
            value={editedDepartment.description}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </form>
    </Modal>
  );
};

// Department Add Modal
const DepartmentAddModal: React.FC<{
  onClose: () => void;
  onAdd: (department: Department) => void;
  existingDepartments: Department[];
}> = ({ onClose, onAdd, existingDepartments }) => {
  const [newDepartment, setNewDepartment] = useState<Department>({
    id: `dept${existingDepartments.length + 1}`,
    name: '',
    head: '',
    headId: `user${Math.floor(Math.random() * 1000)}`,
    employeeCount: 0,
    location: 'San Francisco',
    organization: '',
    status: 'Active',
    description: '',
    roles: [],
    workModel: [
      { type: 'On-site', count: 0 },
      { type: 'Hybrid', count: 0 },
      { type: 'Remote', count: 0 }
    ]
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewDepartment(prev => ({...prev, [name]: value}));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(newDepartment);
  };
  
  return (
    <Modal 
      isOpen={true} 
      onClose={onClose} 
      title="Add New Department" 
      maxWidth="max-w-3xl"
      footer={
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
          >
            Create Department
          </button>
        </div>
      }
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Department Name*</label>
            <input
              type="text"
              name="name"
              id="name"
              required
              value={newDepartment.name}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="head" className="block text-sm font-medium text-gray-700">Department Head*</label>
            <input
              type="text"
              name="head"
              id="head"
              required
              value={newDepartment.head}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location*</label>
            <select
              name="location"
              id="location"
              required
              value={newDepartment.location}
              onChange={handleInputChange}
              className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="San Francisco">San Francisco</option>
              <option value="Austin">Austin</option>
              <option value="New York">New York</option>
              <option value="London">London</option>
              <option value="Chicago">Chicago</option>
              <option value="Boston">Boston</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="organization" className="block text-sm font-medium text-gray-700">Organization*</label>
            <input
              type="text"
              name="organization"
              id="organization"
              required
              value={newDepartment.organization}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="employeeCount" className="block text-sm font-medium text-gray-700">Initial Employee Count*</label>
            <input
              type="number"
              name="employeeCount"
              id="employeeCount"
              required
              value={newDepartment.employeeCount}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              id="status"
              value={newDepartment.status}
              onChange={handleInputChange}
              className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description*</label>
          <textarea
            name="description"
            id="description"
            rows={4}
            required
            value={newDepartment.description}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Note</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  After creating the department, you can add roles, team members, and work model information through the department details page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

// Department Card Component
const DepartmentCard: React.FC<{
  department: Department;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ department, onView, onEdit, onDelete }) => {
  // Generate role distribution data for visualization
  const totalEmployees = department.employeeCount;
  const rolePercentages = department.roles.map(role => ({
    ...role,
    percentage: Math.round((role.count / totalEmployees) * 100)
  }));
  
  // Get work model distribution
  const workModelPercentages = department.workModel.map(model => ({
    ...model,
    percentage: Math.round((model.count / totalEmployees) * 100)
  }));
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200 h-full flex flex-col">
      <div className="p-5 flex items-center border-b border-gray-100">
        <div 
          className="w-10 h-10 rounded-md flex items-center justify-center mr-3 text-white"
          style={{ backgroundColor: locationColors[department.location] || '#64748b' }}
        >
          <Briefcase size={20} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{department.name}</h3>
          <div className="flex items-center mt-1">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              department.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {department.status}
            </span>
            <span className="text-gray-500 text-sm ml-2">{department.organization}</span>
          </div>
        </div>
        <div className="relative ml-2">
          <button className="p-1.5 rounded-md hover:bg-gray-100">
            <MoreHorizontal size={16} className="text-gray-400" />
          </button>
        </div>
      </div>
      
      <div className="p-5 flex-1">
        <div className="flex justify-between mb-3">
          <div className="flex items-center">
            <MapPin size={16} className="text-gray-400 mr-1" />
            <span className="text-sm text-gray-600">{department.location}</span>
          </div>
          <div className="flex items-center">
            <Users size={16} className="text-gray-400 mr-1" />
            <span className="text-sm text-gray-600">{department.employeeCount} employees</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 h-10">
          {department.description}
        </p>
        
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <h4 className="text-xs font-medium text-gray-500 uppercase">Work Model</h4>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            {workModelPercentages.map((model, index) => (
              model.percentage > 0 && (
                <div 
                  key={index}
                  className="h-2 rounded-full" 
                  style={{ 
                    width: `${model.percentage}%`,
                    backgroundColor: workModelColors[model.type],
                    float: 'left',
                    borderTopRightRadius: index === workModelPercentages.length - 1 ? '0.375rem' : '0',
                    borderBottomRightRadius: index === workModelPercentages.length - 1 ? '0.375rem' : '0'
                  }}
                ></div>
              )
            ))}
          </div>
          <div className="flex justify-between mt-1">
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full mr-1" style={{ backgroundColor: workModelColors['On-site'] }}></div>
              <span className="text-xs text-gray-500">On-site</span>
            </div>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full mr-1" style={{ backgroundColor: workModelColors['Hybrid'] }}></div>
              <span className="text-xs text-gray-500">Hybrid</span>
            </div>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full mr-1" style={{ backgroundColor: workModelColors['Remote'] }}></div>
              <span className="text-xs text-gray-500">Remote</span>
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <h4 className="text-xs font-medium text-gray-500 uppercase">Key Roles</h4>
          </div>
          <div className="space-y-2">
            {rolePercentages.slice(0, 3).map((role, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="text-xs text-gray-600">{role.title}</div>
                <div className="text-xs font-medium text-gray-800">{role.count}</div>
              </div>
            ))}
            {rolePercentages.length > 3 && (
              <div className="text-xs text-blue-500 font-medium mt-1">+{rolePercentages.length - 3} more roles</div>
            )}
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-100 px-5 py-3 bg-gray-50 flex justify-between">
        <button
          onClick={onView}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
        >
          <Eye size={14} className="mr-1" />
          View
        </button>
        <button
          onClick={onEdit}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
        >
          <Edit size={14} className="mr-1" />
          Edit
        </button>
        <button
          onClick={onDelete}
          className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center"
        >
          <Trash2 size={14} className="mr-1" />
          Delete
        </button>
      </div>
    </div>
  );
};

// Enhanced Data Table Component
const DataTable: React.FC<{
  data: Department[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ data, onView, onEdit, onDelete }) => {
  const [sortField, setSortField] = useState<keyof Department>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const sortedData = [...data].sort((a, b) => {
    if (sortField === 'employeeCount') {
      return sortDirection === 'asc' 
        ? a[sortField] - b[sortField]
        : b[sortField] - a[sortField];
    } else {
      const aValue = a[sortField]?.toString().toLowerCase() || '';
      const bValue = b[sortField]?.toString().toLowerCase() || '';
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
  });
  
  const handleSort = (field: keyof Department) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const SortHeader: React.FC<{
    field: keyof Department;
    children: React.ReactNode;
  }> = ({ field, children }) => (
    <th 
      scope="col" 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <ArrowUpDown size={14} className={sortField === field ? 'text-blue-500' : 'text-gray-400'} />
      </div>
    </th>
  );
  
  return (
    <div className="overflow-hidden bg-white shadow-sm rounded-lg border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <SortHeader field="name">Department Name</SortHeader>
              <SortHeader field="employeeCount">Employee Count</SortHeader>
              <SortHeader field="head">Department Head</SortHeader>
              <SortHeader field="location">Location</SortHeader>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map(department => (
              <tr key={department.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 rounded flex items-center justify-center" style={{ backgroundColor: `${locationColors[department.location]}20` }}>
                      <Briefcase size={16} style={{ color: locationColors[department.location] }} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{department.name}</div>
                      <div className="text-xs text-gray-500">{department.organization}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{department.employeeCount}</div>
                  <div className="text-xs text-gray-500 flex items-center">
                    <span className="inline-block h-1.5 w-1.5 rounded-full mr-1" style={{ backgroundColor: workModelColors['On-site'] }}></span>
                    {department.workModel.find(m => m.type === 'On-site')?.count || 0} on-site
                    <span className="inline-block h-1.5 w-1.5 rounded-full mx-1 ml-2" style={{ backgroundColor: workModelColors['Remote'] }}></span>
                    {department.workModel.find(m => m.type === 'Remote')?.count || 0} remote
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gray-200 overflow-hidden">
                      <img src="/api/placeholder/24/24" alt={department.head} />
                    </div>
                    <div className="ml-2 text-sm text-gray-900">{department.head}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full mr-2" style={{ backgroundColor: locationColors[department.location] }}></div>
                    {department.location}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex space-x-3 justify-end">
                    <button onClick={() => onView(department.id)} className="text-blue-600 hover:text-blue-900">
                      <Eye size={16} />
                    </button>
                    <button onClick={() => onEdit(department.id)} className="text-indigo-600 hover:text-indigo-900">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => onDelete(department.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Main Departments Page Component
const DepartmentsPage: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState<'list' | 'grid' | 'chart'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [sizeFilter, setSizeFilter] = useState('All Sizes');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Sample department data
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: 'dept1',
      name: 'Engineering',
      head: 'Michael Chen',
      headId: 'user3',
      employeeCount: 67,
      location: 'San Francisco',
      organization: 'Product Development',
      status: 'Active',
      description: 'The Engineering department is responsible for all software development, infrastructure, and technical innovation at the company. The team consists of frontend developers, backend engineers, DevOps specialists, and QA engineers working across multiple product lines.',
      roles: [
        { title: 'Software Engineers', count: 42 },
        { title: 'DevOps Engineers', count: 12 },
        { title: 'QA Engineers', count: 8 },
        { title: 'Engineering Managers', count: 5 }
      ],
      workModel: [
        { type: 'On-site', count: 24 },
        { type: 'Hybrid', count: 30 },
        { type: 'Remote', count: 13 }
      ],
      teamMembers: [
        { id: 'emp1', name: 'James Wilson', role: 'Frontend Lead', avatar: '/api/placeholder/32/32' },
        { id: 'emp2', name: 'Sophia Garcia', role: 'Backend Lead', avatar: '/api/placeholder/32/32' },
        { id: 'emp3', name: 'Daniel Smith', role: 'DevOps', avatar: '/api/placeholder/32/32' },
        { id: 'emp4', name: 'Amanda Lopez', role: 'QA Lead', avatar: '/api/placeholder/32/32' },
        { id: 'emp5', name: 'Alice', role: 'Frontend Developer', avatar: '/api/placeholder/32/32' },
        { id: 'emp6', name: 'Bob', role: 'Frontend Developer', avatar: '/api/placeholder/32/32' },
        { id: 'emp7', name: 'Charlie', role: 'Frontend Developer', avatar: '/api/placeholder/32/32' },
        { id: 'emp8', name: 'Diana', role: 'Frontend Developer', avatar: '/api/placeholder/32/32' },
        { id: 'emp9', name: 'Eric', role: 'Backend Developer', avatar: '/api/placeholder/32/32' },
        { id: 'emp10', name: 'Fiona', role: 'Backend Developer', avatar: '/api/placeholder/32/32' },
        { id: 'emp11', name: 'George', role: 'Backend Developer', avatar: '/api/placeholder/32/32' },
        { id: 'emp12', name: 'Hannah', role: 'Backend Developer', avatar: '/api/placeholder/32/32' }
      ]
    },
    {
      id: 'dept2',
      name: 'Sales',
      head: 'Alex Thompson',
      headId: 'user5',
      employeeCount: 54,
      location: 'Austin',
      organization: 'Revenue',
      status: 'Active',
      description: 'The Sales department handles all customer acquisition, relationship management, and revenue generation activities.',
      roles: [
        { title: 'Account Executives', count: 28 },
        { title: 'Sales Development Reps', count: 18 },
        { title: 'Sales Operations', count: 5 },
        { title: 'Sales Managers', count: 3 }
      ],
      workModel: [
        { type: 'On-site', count: 20 },
        { type: 'Hybrid', count: 25 },
        { type: 'Remote', count: 9 }
      ],
      teamMembers: [
        { id: 'emp21', name: 'John Davis', role: 'Sales Director', avatar: '/api/placeholder/32/32' },
        { id: 'emp22', name: 'Rachel Kim', role: 'Senior Account Executive', avatar: '/api/placeholder/32/32' },
        { id: 'emp23', name: 'Mark Johnson', role: 'Account Executive', avatar: '/api/placeholder/32/32' }
      ]
    },
    {
      id: 'dept3',
      name: 'Marketing',
      head: 'Sarah Johnson',
      headId: 'user2',
      employeeCount: 32,
      location: 'New York',
      organization: 'Growth',
      status: 'Active',
      description: 'The Marketing department is responsible for brand management, lead generation, digital marketing campaigns, and customer communications.',
      roles: [
        { title: 'Digital Marketers', count: 12 },
        { title: 'Content Writers', count: 8 },
        { title: 'Brand Specialists', count: 6 },
        { title: 'Marketing Analysts', count: 4 },
        { title: 'Marketing Managers', count: 2 }
      ],
      workModel: [
        { type: 'On-site', count: 10 },
        { type: 'Hybrid', count: 15 },
        { type: 'Remote', count: 7 }
      ],
      teamMembers: [
        { id: 'emp31', name: 'Lisa Zhang', role: 'Marketing Director', avatar: '/api/placeholder/32/32' },
        { id: 'emp32', name: 'Tyler Scott', role: 'Content Manager', avatar: '/api/placeholder/32/32' }
      ]
    },
    {
      id: 'dept4',
      name: 'Finance',
      head: 'David Kim',
      headId: 'user6',
      employeeCount: 28,
      location: 'London',
      organization: 'Operations',
      status: 'Active',
      description: 'The Finance department manages all financial planning, accounting, budgeting, and financial reporting activities for the company.',
      roles: [
        { title: 'Financial Analysts', count: 10 },
        { title: 'Accountants', count: 12 },
        { title: 'Financial Controllers', count: 4 },
        { title: 'Finance Managers', count: 2 }
      ],
      workModel: [
        { type: 'On-site', count: 18 },
        { type: 'Hybrid', count: 8 },
        { type: 'Remote', count: 2 }
      ],
      teamMembers: [
        { id: 'emp41', name: 'Emma Wilson', role: 'Finance Director', avatar: '/api/placeholder/32/32' },
        { id: 'emp42', name: 'Nathan Lee', role: 'Senior Accountant', avatar: '/api/placeholder/32/32' }
      ]
    },
    {
      id: 'dept5',
      name: 'Product',
      head: 'Emily Rodriguez',
      headId: 'user4',
      employeeCount: 26,
      location: 'Remote',
      organization: 'Product Development',
      status: 'Active',
      description: 'The Product department oversees product strategy, roadmap planning, user experience design, and product lifecycle management.',
      roles: [
        { title: 'Product Managers', count: 10 },
        { title: 'UX Designers', count: 8 },
        { title: 'Product Analysts', count: 6 },
        { title: 'Product Directors', count: 2 }
      ],
      workModel: [
        { type: 'On-site', count: 5 },
        { type: 'Hybrid', count: 10 },
        { type: 'Remote', count: 11 }
      ],
      teamMembers: [
        { id: 'emp51', name: 'Ryan Brown', role: 'Product Director', avatar: '/api/placeholder/32/32' },
        { id: 'emp52', name: 'Julia Chen', role: 'Senior Product Manager', avatar: '/api/placeholder/32/32' }
      ]
    },
    {
      id: 'dept6',
      name: 'Customer Support',
      head: 'Robert Taylor',
      headId: 'user7',
      employeeCount: 15,
      location: 'Chicago',
      organization: 'Operations',
      status: 'Active',
      description: 'The Customer Support department provides technical assistance, product guidance, and issue resolution services to our customers.',
      roles: [
        { title: 'Support Specialists', count: 10 },
        { title: 'Technical Support Engineers', count: 3 },
        { title: 'Support Team Leads', count: 2 }
      ],
      workModel: [
        { type: 'On-site', count: 5 },
        { type: 'Hybrid', count: 5 },
        { type: 'Remote', count: 5 }
      ],
      teamMembers: [
        { id: 'emp61', name: 'Oliver Reed', role: 'Support Manager', avatar: '/api/placeholder/32/32' },
        { id: 'emp62', name: 'Mia Garcia', role: 'Senior Support Specialist', avatar: '/api/placeholder/32/32' }
      ]
    },
    {
      id: 'dept7',
      name: 'HR',
      head: 'Jessica Lee',
      headId: 'user8',
      employeeCount: 12,
      location: 'New York',
      organization: 'People Operations',
      status: 'Active',
      description: 'The HR department manages recruitment, employee onboarding, benefits administration, performance management, and employee relations.',
      roles: [
        { title: 'HR Specialists', count: 6 },
        { title: 'Recruiters', count: 4 },
        { title: 'HR Managers', count: 2 }
      ],
      workModel: [
        { type: 'On-site', count: 8 },
        { type: 'Hybrid', count: 3 },
        { type: 'Remote', count: 1 }
      ],
      teamMembers: [
        { id: 'emp71', name: 'Benjamin Thomas', role: 'HR Director', avatar: '/api/placeholder/32/32' },
        { id: 'emp72', name: 'Zoe Martinez', role: 'Senior Recruiter', avatar: '/api/placeholder/32/32' }
      ]
    },
    {
      id: 'dept8',
      name: 'Legal',
      head: 'Amanda Wilson',
      headId: 'user9',
      employeeCount: 8,
      location: 'Boston',
      organization: 'Corporate',
      status: 'Active',
      description: 'The Legal department handles all legal matters including contracts, compliance, intellectual property, and corporate governance.',
      roles: [
        { title: 'Corporate Attorneys', count: 4 },
        { title: 'Legal Specialists', count: 3 },
        { title: 'General Counsel', count: 1 }
      ],
      workModel: [
        { type: 'On-site', count: 4 },
        { type: 'Hybrid', count: 3 },
        { type: 'Remote', count: 1 }
      ],
      teamMembers: [
        { id: 'emp81', name: 'William Parker', role: 'General Counsel', avatar: '/api/placeholder/32/32' },
        { id: 'emp82', name: 'Sophia Mitchell', role: 'Senior Corporate Attorney', avatar: '/api/placeholder/32/32' }
      ]
    }
  ]);

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);

  // Filtering logic
  const filteredDepartments = useMemo(() => {
    return departments.filter(dept => {
      const matchesSearch = !searchTerm || 
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.head.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesSize = true;
      if (sizeFilter !== 'All Sizes') {
        if (sizeFilter === 'Small (1-15)' && dept.employeeCount > 15) matchesSize = false;
        if (sizeFilter === 'Medium (16-50)' && (dept.employeeCount < 16 || dept.employeeCount > 50)) matchesSize = false;
        if (sizeFilter === 'Large (51+)' && dept.employeeCount < 51) matchesSize = false;
      }
      
      const matchesLocation = locationFilter === 'All Locations' || dept.location === locationFilter;
      
      return matchesSearch && matchesSize && matchesLocation;
    });
  }, [departments, searchTerm, sizeFilter, locationFilter]);

  // Pagination logic
  const totalFilteredItems = filteredDepartments.length;
  const totalFilteredPages = Math.max(1, Math.ceil(totalFilteredItems / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const displayDepartments = filteredDepartments.slice(indexOfFirstItem, indexOfLastItem);

  // Summary statistics
  const summaryStats = useMemo(() => ({
    totalDepartments: departments.length,
    totalEmployees: departments.reduce((sum, dept) => sum + dept.employeeCount, 0),
    avgDeptSize: Math.round(departments.reduce((sum, dept) => sum + dept.employeeCount, 0) / departments.length),
    locations: [...new Set(departments.map(dept => dept.location))].length
  }), [departments]);

  // Event handlers
  const handleViewDepartment = (departmentId: string) => {
    const department = departments.find(dept => dept.id === departmentId);
    if (department) {
      setCurrentDepartment(department);
      setViewModalOpen(true);
    }
  };

  const handleEditDepartment = (departmentId: string) => {
    const department = departments.find(dept => dept.id === departmentId);
    if (department) {
      setCurrentDepartment(department);
      setEditModalOpen(true);
    }
  };

  const handleSaveEdit = (updatedDepartment: Department) => {
    setDepartments(prev => prev.map(dept => dept.id === updatedDepartment.id ? updatedDepartment : dept));
    setEditModalOpen(false);
  };

  const handleAddDepartment = (newDepartment: Department) => {
    setDepartments(prev => [...prev, newDepartment]);
    setAddModalOpen(false);
  };

  const handleDeleteDepartment = (departmentId: string) => {
    if (window.confirm('Are you sure you want to delete this department? This action cannot be undone.')) {
      setDepartments(prev => prev.filter(dept => dept.id !== departmentId));
    }
  };

  // NEW: Employee transfer handler
  const handleTransferEmployee = (
    employeeId: string,
    sourceDepartmentId: string,
    targetDepartmentId: string
  ) => {
    setDepartments(prevDepartments => {
      // Find the source and target departments
      const sourceDeptIndex = prevDepartments.findIndex(dept => dept.id === sourceDepartmentId);
      const targetDeptIndex = prevDepartments.findIndex(dept => dept.id === targetDepartmentId);
      
      if (sourceDeptIndex === -1 || targetDeptIndex === -1) return prevDepartments;
      
      const sourceDept = prevDepartments[sourceDeptIndex];
      const targetDept = prevDepartments[targetDeptIndex];
      
      if (!sourceDept.teamMembers) return prevDepartments;
      
      // Find the employee in the source department
      const employeeIndex = sourceDept.teamMembers.findIndex(emp => emp.id === employeeId);
      if (employeeIndex === -1) return prevDepartments;
      
      // Get the employee data
      const employee = sourceDept.teamMembers[employeeIndex];
      
      // Create updated teamMembers arrays
      const updatedSourceTeamMembers = [...sourceDept.teamMembers];
      updatedSourceTeamMembers.splice(employeeIndex, 1);
      
      const updatedTargetTeamMembers = targetDept.teamMembers 
        ? [...targetDept.teamMembers, employee] 
        : [employee];
      
      // Update work model counts
      // This assumes the employee's work model is the same in both departments
      // You might want to add a work model property to employees for more accurate tracking
      
      // Create a new departments array with updated data
      return prevDepartments.map(dept => {
        if (dept.id === sourceDepartmentId) {
          return {
            ...dept,
            teamMembers: updatedSourceTeamMembers,
            employeeCount: dept.employeeCount - 1
          };
        }
        if (dept.id === targetDepartmentId) {
          return {
            ...dept,
            teamMembers: updatedTargetTeamMembers,
            employeeCount: dept.employeeCount + 1
          };
        }
        return dept;
      });
    });
    
    // Show success notification
    alert(`Employee has been transferred successfully`);
  };

  // Export departments data
  const handleExport = () => {
    alert('Department data would be exported as CSV or Excel');
  };

  return (
    <DashboardLayout userName="Admin User" userAvatar="/api/placeholder/32/32">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Department Management</h1>
          <div className="flex space-x-3">
            <button
              onClick={handleExport}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Download size={16} className="mr-2" />
              Export
            </button>
            <button
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setAddModalOpen(true)}
            >
              <PlusIcon size={16} className="mr-2" />
              Add Department
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Departments</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{summaryStats.totalDepartments}</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-md">
                <Briefcase size={24} className="text-blue-500" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{summaryStats.totalEmployees}</p>
              </div>
              <div className="p-2 bg-indigo-50 rounded-md">
                <Users size={24} className="text-indigo-500" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg. Department Size</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{summaryStats.avgDeptSize}</p>
              </div>
              <div className="p-2 bg-green-50 rounded-md">
                <PieChart size={24} className="text-green-500" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Locations</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{summaryStats.locations}</p>
              </div>
              <div className="p-2 bg-orange-50 rounded-md">
                <MapPin size={24} className="text-orange-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search departments"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <Search size={18} />
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="relative w-full">
                  <select
                    className="appearance-none pl-10 pr-8 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                    value={sizeFilter}
                    onChange={(e) => setSizeFilter(e.target.value)}
                  >
                    <option>All Sizes</option>
                    <option>Small (1-15)</option>
                    <option>Medium (16-50)</option>
                    <option>Large (51+)</option>
                  </select>
                  <div className="absolute left-3 top-2.5 pointer-events-none text-gray-400">
                    <Users size={18} />
                  </div>
                  <div className="absolute right-3 top-2.5 pointer-events-none text-gray-400">
                    <ChevronDown size={18} />
                  </div>
                </div>

                <div className="relative w-full">
                  <select
                    className="appearance-none pl-10 pr-8 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                  >
                    <option>All Locations</option>
                    <option>San Francisco</option>
                    <option>Austin</option>
                    <option>New York</option>
                    <option>London</option>
                    <option>Chicago</option>
                    <option>Boston</option>
                    <option>Remote</option>
                  </select>
                  <div className="absolute left-3 top-2.5 pointer-events-none text-gray-400">
                    <MapPin size={18} />
                  </div>
                  <div className="absolute right-3 top-2.5 pointer-events-none text-gray-400">
                    <ChevronDown size={18} />
                  </div>
                </div>
              </div>
            </div>
            
            {activeTab !== 'chart' && (
              <div className="flex space-x-2 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  className={`p-2 ${activeTab === 'list' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => setActiveTab('list')}
                  title="List view"
                >
                  <FileText size={18} />
                </button>
                <button
                  className={`p-2 ${activeTab === 'grid' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => setActiveTab('grid')}
                  title="Grid view"
                >
                  <Users size={18} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`border-b-2 pb-4 px-1 text-sm font-medium transition-colors ${
                activeTab === 'list' || activeTab === 'grid'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab(prev => prev === 'list' ? 'list' : 'grid')}
            >
              Department List
            </button>
            <button
              className={`border-b-2 pb-4 px-1 text-sm font-medium transition-colors ${
                activeTab === 'chart'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('chart')}
            >
              Organizational Chart
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'list' ? (
          <>
            <DataTable 
              data={displayDepartments}
              onView={handleViewDepartment}
              onEdit={handleEditDepartment}
              onDelete={handleDeleteDepartment}
            />
            
            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-700">
                Showing {totalFilteredItems === 0 ? 0 : indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalFilteredItems)} of {totalFilteredItems} departments
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md border ${currentPage === 1 ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                >
                  <ChevronLeft size={18} />
                </button>
                {Array.from({ length: Math.min(5, totalFilteredPages) }, (_, index) => {
                  // Logic to show pages around current page
                  let pageNum;
                  if (totalFilteredPages <= 5) {
                    pageNum = index + 1;
                  } else {
                    if (currentPage <= 3) {
                      pageNum = index + 1;
                    } else if (currentPage >= totalFilteredPages - 2) {
                      pageNum = totalFilteredPages - 4 + index;
                    } else {
                      pageNum = currentPage - 2 + index;
                    }
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 flex items-center justify-center rounded-md ${
                        currentPage === pageNum
                          ? 'bg-blue-50 text-blue-600 border border-blue-200 font-medium'
                          : 'text-gray-600 hover:bg-gray-50 border border-gray-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalFilteredPages, prev + 1))}
                  disabled={currentPage === totalFilteredPages}
                  className={`p-2 rounded-md border ${currentPage === totalFilteredPages ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </>
        ) : activeTab === 'grid' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayDepartments.map(department => (
                <DepartmentCard
                  key={department.id}
                  department={department}
                  onView={() => handleViewDepartment(department.id)}
                  onEdit={() => handleEditDepartment(department.id)}
                  onDelete={() => handleDeleteDepartment(department.id)}
                />
              ))}
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-700">
                Showing {totalFilteredItems === 0 ? 0 : indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalFilteredItems)} of {totalFilteredItems} departments
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md border ${currentPage === 1 ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                >
                  <ChevronLeft size={18} />
                </button>
                {Array.from({ length: Math.min(5, totalFilteredPages) }, (_, index) => {
                  // Logic to show pages around current page
                  let pageNum;
                  if (totalFilteredPages <= 5) {
                    pageNum = index + 1;
                  } else {
                    if (currentPage <= 3) {
                      pageNum = index + 1;
                    } else if (currentPage >= totalFilteredPages - 2) {
                      pageNum = totalFilteredPages - 4 + index;
                    } else {
                      pageNum = currentPage - 2 + index;
                    }
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 flex items-center justify-center rounded-md ${
                        currentPage === pageNum
                          ? 'bg-blue-50 text-blue-600 border border-blue-200 font-medium'
                          : 'text-gray-600 hover:bg-gray-50 border border-gray-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalFilteredPages, prev + 1))}
                  disabled={currentPage === totalFilteredPages}
                  className={`p-2 rounded-md border ${currentPage === totalFilteredPages ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <OrganizationalChart />
        )}

        {/* Modals */}
        {viewModalOpen && currentDepartment && (
          <DepartmentViewModal
            department={currentDepartment}
            departments={departments} 
            onClose={() => setViewModalOpen(false)}
            onEdit={() => { setViewModalOpen(false); setEditModalOpen(true); }}
            onTransferEmployee={handleTransferEmployee} 
          />
        )}
        {editModalOpen && currentDepartment && (
          <DepartmentEditModal
            department={currentDepartment}
            onClose={() => setEditModalOpen(false)}
            onSave={handleSaveEdit}
          />
        )}
        {addModalOpen && (
          <DepartmentAddModal
            onClose={() => setAddModalOpen(false)}
            onAdd={handleAddDepartment}
            existingDepartments={departments}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default DepartmentsPage;