"use client"

import React, { useState, useEffect } from 'react';
import { XIcon } from 'lucide-react';

interface EditAdminUserModalProps {
  user: any;
  onClose: () => void;
  onSave: (user: any) => void;
}

const EditAdminUserModal: React.FC<EditAdminUserModalProps> = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    department: '',
    status: '',
    twoFA: false,
    lastPasswordChange: '2 months ago',
    activeSessions: 0
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Split name into first and last name
    const nameParts = user.name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    setFormData({
      firstName,
      lastName,
      email: user.email,
      role: user.role,
      department: user.department,
      status: user.status,
      twoFA: user.twoFA,
      lastPasswordChange: '2 months ago',
      activeSessions: user.activeSessions
    });
    
    // Add event listener to close modal on escape key
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    
    // Block scrolling on the body while modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'auto';
    };
  }, [user, onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate network request time
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onSave({
        ...user,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        role: formData.role,
        department: formData.department,
        status: formData.status,
        twoFA: formData.twoFA
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = () => {
    alert('Password reset requested');
  };

  const handleReset2FA = () => {
    alert('2FA reset requested');
  };

  const handleTerminateAllSessions = () => {
    alert('All sessions terminated');
  };

  // Status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Suspended': return 'bg-yellow-100 text-yellow-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h4 className="text-sm font-semibold text-gray-800 mb-4">{children}</h4>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4 sm:p-6 transition-opacity duration-200">
      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-auto animate-fadeIn" 
           onClick={(e) => e.stopPropagation()}
           aria-modal="true"
           role="dialog"
           aria-labelledby="modal-title">
           
        {/* Header with sticky positioning */}
        <div className="sticky top-0 z-10 flex justify-between items-center p-5 bg-white rounded-t-xl border-b border-gray-200">
          <h3 id="modal-title" className="text-xl font-semibold text-gray-900">
            Edit Admin User
          </h3>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100 transition-colors duration-150"
            onClick={onClose}
            aria-label="Close"
          >
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto">
          <div className="p-5 sm:p-6">
            {/* User Profile Quick View */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="bg-blue-100 text-blue-800 rounded-full w-16 h-16 flex items-center justify-center text-xl font-semibold">
                {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
              </div>
              <div className="text-center sm:text-left">
                <div className="text-lg font-semibold">{formData.firstName} {formData.lastName}</div>
                <div className="text-gray-500 text-sm">{formData.email}</div>
                <div className="mt-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium inline-block ${getStatusColor(formData.status)}`}>
                    {formData.status}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Basic Information */}
            <section className="mb-8">
              <SectionTitle>Basic Information</SectionTitle>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </section>
            
            {/* Role Settings */}
            <section className="mb-8">
              <SectionTitle>Role Settings</SectionTitle>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Role Type
                  </label>
                  <select
                    name="role"
                    id="role"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="System Admin">System Admin</option>
                    <option value="Department Admin">Department Admin</option>
                    <option value="Analytics User">Analytics User</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="department" className="flex items-center">
                    <span className="block text-sm font-medium text-gray-700 mb-1">
                      Department Access
                    </span>
                    {formData.role === "System Admin" && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        All Access
                      </span>
                    )}
                  </label>
                  <select
                    name="department"
                    id="department"
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors ${
                      formData.role === "System Admin" ? "bg-gray-50" : ""
                    }`}
                    value={formData.department}
                    onChange={handleChange}
                    disabled={formData.role === "System Admin"}
                  >
                    {formData.role === "System Admin" ? (
                      <option value="All Departments">All Departments</option>
                    ) : (
                      <>
                        <option value="Marketing">Marketing</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Product">Product</option>
                        <option value="Finance">Finance</option>
                        <option value="Human Resources">Human Resources</option>
                        <option value="Sales">Sales</option>
                      </>
                    )}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Account Status
                  </label>
                  <select
                    name="status"
                    id="status"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </section>
            
            {/* Security Settings */}
            <section>
              <SectionTitle>Security Settings</SectionTitle>
              
              {/* Two-Factor Authentication */}
              <div className="mb-5 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <div>
                    <h5 className="text-sm font-medium text-gray-800">Two-Factor Authentication</h5>
                    <div className="mt-1 flex items-center">
                      <div className={`w-2.5 h-2.5 rounded-full mr-2 ${formData.twoFA ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <p className="text-sm text-gray-600">
                        {formData.twoFA ? "Enabled" : "Disabled"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="px-3 py-1.5 border border-gray-300 text-sm rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={handleReset2FA}
                  >
                    Reset 2FA
                  </button>
                </div>
              </div>
              
              {/* Password Management */}
              <div className="mb-5 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <div>
                    <h5 className="text-sm font-medium text-gray-800">Password Management</h5>
                    <p className="text-sm text-gray-600 mt-1">
                      Last changed: {formData.lastPasswordChange}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="px-3 py-1.5 border border-gray-300 text-sm rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={handleResetPassword}
                  >
                    Force Reset
                  </button>
                </div>
              </div>
              
              {/* Active Sessions */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <div>
                    <h5 className="text-sm font-medium text-gray-800">Active Sessions</h5>
                    <p className="text-sm text-gray-600 mt-1">
                      {formData.activeSessions} active session{formData.activeSessions !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <button
                    type="button"
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                      formData.activeSessions === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                    onClick={handleTerminateAllSessions}
                    disabled={formData.activeSessions === 0}
                  >
                    Terminate All
                  </button>
                </div>
              </div>
            </section>
          </div>
          
          {/* Footer with sticky positioning */}
          <div className="sticky bottom-0 px-5 py-4 bg-white border-t border-gray-200 rounded-b-xl flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <button
              type="button"
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex justify-center items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAdminUserModal;