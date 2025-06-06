"use client"

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

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
  roles: {
    title: string;
    count: number;
  }[];
  workModel: {
    type: string;
    count: number;
  }[];
}

interface DepartmentAddModalProps {
  onClose: () => void;
  onAdd: (department: Department) => void;
  existingDepartments: Department[];
}

const DepartmentAddModal: React.FC<DepartmentAddModalProps> = ({
  onClose,
  onAdd,
  existingDepartments
}) => {
  // Initialize with empty department data
  const [formData, setFormData] = useState<Department>({
    id: `dept${existingDepartments.length + 1}`,
    name: '',
    head: '',
    headId: '',
    employeeCount: 0,
    location: '',
    organization: 'Product Development',
    status: 'Active',
    description: '',
    roles: [
      { title: 'Role title', count: 0 },
      { title: 'Role title', count: 0 },
      { title: 'Role title', count: 0 }
    ],
    workModel: [
      { type: 'On-site', count: 0 },
      { type: 'Hybrid', count: 0 },
      { type: 'Remote', count: 0 }
    ]
  });
  
  // Handle input change for basic fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle role change
  const handleRoleChange = (index: number, field: 'title' | 'count', value: string) => {
    const updatedRoles = [...formData.roles];
    if (field === 'title') {
      updatedRoles[index].title = value;
    } else {
      updatedRoles[index].count = parseInt(value) || 0;
    }
    
    setFormData(prev => ({
      ...prev,
      roles: updatedRoles
    }));
  };
  
  // Handle work model change
  const handleWorkModelChange = (index: number, field: 'type' | 'count', value: string) => {
    const updatedWorkModel = [...formData.workModel];
    if (field === 'type') {
      updatedWorkModel[index].type = value;
    } else {
      updatedWorkModel[index].count = parseInt(value) || 0;
    }
    
    setFormData(prev => ({
      ...prev,
      workModel: updatedWorkModel
    }));
  };
  
  // Update headId when head changes
  const handleHeadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const headName = e.target.value;
    let headId = '';
    
    // Map head names to IDs (you would have a more robust implementation in a real app)
    switch(headName) {
      case 'Michael Chen':
        headId = 'user3';
        break;
      case 'Sarah Johnson':
        headId = 'user2';
        break;
      case 'Emily Rodriguez':
        headId = 'user4';
        break;
      case 'Alex Thompson':
        headId = 'user5';
        break;
      case 'David Kim':
        headId = 'user6';
        break;
      case 'Jessica Lee':
        headId = 'user8';
        break;
      case 'Robert Taylor':
        headId = 'user7';
        break;
      case 'Amanda Wilson':
        headId = 'user9';
        break;
      default:
        headId = '';
    }
    
    setFormData(prev => ({
      ...prev,
      head: headName,
      headId
    }));
  };
  
  // Calculate total employee count from roles
  useEffect(() => {
    const totalEmployees = formData.roles.reduce((sum, role) => sum + role.count, 0);
    setFormData(prev => ({
      ...prev,
      employeeCount: totalEmployees
    }));
  }, [formData.roles]);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Add New Department</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Basic Information</h3>
            
            <div className="space-y-4">
              {/* Department Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Department Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              {/* Department Head */}
              <div>
                <label htmlFor="head" className="block text-sm font-medium text-gray-700 mb-1">
                  Department Head <span className="text-red-500">*</span>
                </label>
                <select
                  id="head"
                  name="head"
                  value={formData.head}
                  onChange={handleHeadChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  required
                >
                  <option value="">Select a department head</option>
                  <option value="Michael Chen">Michael Chen</option>
                  <option value="Sarah Johnson">Sarah Johnson</option>
                  <option value="Emily Rodriguez">Emily Rodriguez</option>
                  <option value="Alex Thompson">Alex Thompson</option>
                  <option value="David Kim">David Kim</option>
                  <option value="Jessica Lee">Jessica Lee</option>
                  <option value="Robert Taylor">Robert Taylor</option>
                  <option value="Amanda Wilson">Amanda Wilson</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Organization */}
                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
                    Organization
                  </label>
                  <select
                    id="organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="Product Development">Product Development</option>
                    <option value="Revenue">Revenue</option>
                    <option value="Growth">Growth</option>
                    <option value="Operations">Operations</option>
                    <option value="People Operations">People Operations</option>
                    <option value="Corporate">Corporate</option>
                  </select>
                </div>
                
                {/* Parent Department (if applicable) */}
                <div>
                  <label htmlFor="parentDepartment" className="block text-sm font-medium text-gray-700 mb-1">
                    Parent Department
                  </label>
                  <select
                    id="parentDepartment"
                    name="parentDepartment"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="None">None</option>
                    {existingDepartments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional Details */}
          <div className="px-6 py-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Additional Details</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Primary Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Location
                </label>
                <select
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  required
                >
                  <option value="">Select a location</option>
                  <option value="San Francisco">San Francisco</option>
                  <option value="Austin">Austin</option>
                  <option value="New York">New York</option>
                  <option value="London">London</option>
                  <option value="Chicago">Chicago</option>
                  <option value="Boston">Boston</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
              
              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {/* Initial Team Structure */}
          <div className="px-6 py-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Initial Team Structure</h3>
            
            <div className="grid grid-cols-2 gap-6">
              {/* Role Breakdown */}
              <div>
                <h4 className="text-sm font-medium mb-2">Role Breakdown</h4>
                
                {formData.roles.map((role, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={role.title}
                      onChange={(e) => handleRoleChange(index, 'title', e.target.value)}
                      className="flex-grow px-3 py-1 border border-gray-300 rounded-md text-sm"
                      placeholder="Role title"
                    />
                    <input
                      type="number"
                      value={role.count}
                      onChange={(e) => handleRoleChange(index, 'count', e.target.value)}
                      className="w-16 px-3 py-1 border border-gray-300 rounded-md text-sm"
                      min="0"
                    />
                  </div>
                ))}
              </div>
              
              {/* Work Model */}
              <div>
                <h4 className="text-sm font-medium mb-2">Work Model</h4>
                
                {formData.workModel.map((model, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={model.type}
                      onChange={(e) => handleWorkModelChange(index, 'type', e.target.value)}
                      className="flex-grow px-3 py-1 border border-gray-300 rounded-md text-sm"
                      placeholder="Work model"
                    />
                    <input
                      type="number"
                      value={model.count}
                      onChange={(e) => handleWorkModelChange(index, 'count', e.target.value)}
                      className="w-16 px-3 py-1 border border-gray-300 rounded-md text-sm"
                      min="0"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Modal Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Add Department
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentAddModal;