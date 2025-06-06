"use client"

import React from 'react';
import { X } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

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
  teamMembers?: TeamMember[];
}

interface DepartmentViewModalProps {
  department: Department;
  onClose: () => void;
  onEdit: () => void;
}

const DepartmentViewModal: React.FC<DepartmentViewModalProps> = ({ 
  department, 
  onClose,
  onEdit
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{department.name}</h2>
            <p className="text-sm text-gray-600">{department.head}, Department Head</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Modal Content - Two Columns */}
        <div className="p-6 grid grid-cols-2 gap-8">
          {/* Left Column - Department Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-4">Department Information</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Department Name</p>
                <p className="font-medium">{department.name}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Department Head</p>
                <p className="font-medium">{department.head}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Employee Count</p>
                <p className="font-medium">{department.employeeCount}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Organization</p>
                <p className="font-medium">{department.organization}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{department.location}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  department.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {department.status}
                </span>
              </div>
            </div>
          </div>
          
          {/* Right Column - Team Composition */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-4">Team Composition</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Roles */}
              <div>
                <p className="text-sm font-medium mb-2">Roles</p>
                <div className="space-y-2">
                  {department.roles.map((role, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-sm text-gray-600">{role.title}</span>
                      <span className="text-sm font-medium">{role.count}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Work Model */}
              <div>
                <p className="text-sm font-medium mb-2">Work Model</p>
                <div className="space-y-2">
                  {department.workModel.map((model, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-sm text-gray-600">{model.type}</span>
                      <span className="text-sm font-medium">{model.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Department Description */}
        <div className="px-6 py-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Department Description</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {department.description}
          </p>
        </div>
        
        {/* Team Members */}
        {department.teamMembers && department.teamMembers.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-500">Team Members</h3>
              <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {department.teamMembers.map(member => (
                <div key={member.id} className="bg-white rounded-lg p-3 text-center border border-gray-200">
                  <img 
                    src={member.avatar || '/api/placeholder/32/32'} 
                    alt={member.name} 
                    className="w-12 h-12 rounded-full mx-auto mb-2" 
                  />
                  <p className="font-medium text-sm truncate">{member.name}</p>
                  <p className="text-xs text-gray-500 truncate">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Modal Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Edit Department
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentViewModal;