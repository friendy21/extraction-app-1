"use client"

import React, { useState } from 'react';

interface AccountReviewModalProps {
  onClose: () => void;
  suspendedUsers: any[];
}

const AccountReviewModal: React.FC<AccountReviewModalProps> = ({ onClose, suspendedUsers }) => {
  const [selectedTab, setSelectedTab] = useState('suspended');
  
  const suspendedAccounts = suspendedUsers.filter(user => user.status === 'Suspended');
  const inactiveAccounts = suspendedUsers.filter(user => user.status === 'Inactive');
  
  const handleReactivate = (userId: number) => {
    console.log('Reactivate user', userId);
    // Would implement reactivation logic here
  };
  
  const handleDelete = (userId: number) => {
    console.log('Delete user', userId);
    // Would implement deletion logic here
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-lg max-w-3xl w-full mx-4">
        <div className="flex justify-between items-center p-5 border-b">
          <h3 className="text-lg font-medium text-gray-900">Account Review</h3>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500"
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-5">
          <div className="flex border-b border-gray-200 mb-4">
            <button
              className={`py-2 px-4 text-sm font-medium ${selectedTab === 'suspended' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setSelectedTab('suspended')}
            >
              Suspended Accounts ({suspendedAccounts.length})
            </button>
            <button
              className={`py-2 px-4 text-sm font-medium ${selectedTab === 'inactive' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setSelectedTab('inactive')}
            >
              Inactive Accounts ({inactiveAccounts.length})
            </button>
          </div>
          
          {selectedTab === 'suspended' && (
            <div>
              <p className="text-sm text-gray-600 mb-4">
                These accounts have been manually suspended and cannot be accessed until reactivated.
              </p>
              
              {suspendedAccounts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No suspended accounts</p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  {suspendedAccounts.map((user, index) => (
                    <div 
                      key={user.id} 
                      className={`p-4 ${index < suspendedAccounts.length - 1 ? 'border-b border-gray-200' : ''}`}
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 relative">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                            {user.name.split(' ').map((n: string) => n[0]).join('')}
                          </div>
                        </div>
                        <div className="ml-4 flex-grow">
                          <div className="flex justify-between">
                            <div>
                              <h5 className="text-sm font-medium text-gray-900">{user.name}</h5>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                            <div className="text-xs text-gray-500">
                              <p>Last active: {user.lastActive}</p>
                              <p>
                                <span className={`inline-flex px-2 text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800`}>
                                  {user.role}
                                </span>
                                &nbsp;&middot;&nbsp;
                                {user.department}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4 flex space-x-2">
                          <button
                            onClick={() => handleReactivate(user.id)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700"
                          >
                            Reactivate
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-gray-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {selectedTab === 'inactive' && (
            <div>
              <p className="text-sm text-gray-600 mb-4">
                These accounts have been automatically marked as inactive due to lack of activity for more than 30 days.
              </p>
              
              {inactiveAccounts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No inactive accounts</p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  {inactiveAccounts.map((user, index) => (
                    <div 
                      key={user.id} 
                      className={`p-4 ${index < inactiveAccounts.length - 1 ? 'border-b border-gray-200' : ''}`}
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 relative">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                            {user.name.split(' ').map((n: string) => n[0]).join('')}
                          </div>
                        </div>
                        <div className="ml-4 flex-grow">
                          <div className="flex justify-between">
                            <div>
                              <h5 className="text-sm font-medium text-gray-900">{user.name}</h5>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                            <div className="text-xs text-gray-500">
                              <p>Last active: {user.lastActive}</p>
                              <p>
                                <span className={`inline-flex px-2 text-xs leading-5 font-semibold rounded-full ${
                                  user.role === 'System Admin' ? 'bg-blue-100 text-blue-800' : 
                                  user.role === 'Department Admin' ? 'bg-purple-100 text-purple-800' : 
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {user.role}
                                </span>
                                &nbsp;&middot;&nbsp;
                                {user.department}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4 flex space-x-2">
                          <button
                            onClick={() => handleReactivate(user.id)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700"
                          >
                            Reactivate
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-gray-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            {suspendedUsers.length} account{suspendedUsers.length !== 1 ? 's' : ''} need{suspendedUsers.length === 1 ? 's' : ''} review
          </div>
          <button
            type="button"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountReviewModal;