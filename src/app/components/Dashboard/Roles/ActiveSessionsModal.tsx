"use client"

import React, { useState } from 'react';

interface ActiveSessionsModalProps {
  onClose: () => void;
  activeUsers: any[];
}

const ActiveSessionsModal: React.FC<ActiveSessionsModalProps> = ({ onClose, activeUsers }) => {
  const [showByUser, setShowByUser] = useState(true);
  
  // Calculate session data
  const totalSessions = activeUsers.reduce((sum, user) => sum + user.activeSessions, 0);
  const roleDistribution = {
    'System Admin': activeUsers.filter(u => u.role === 'System Admin').length,
    'Department Admin': activeUsers.filter(u => u.role === 'Department Admin').length,
    'Analytics User': activeUsers.filter(u => u.role === 'Analytics User').length,
  };
  
  // Mock session details with duration and status
  const sessions = [
    { user: activeUsers.find(u => u.name === 'Admin User'), role: 'System Admin', department: 'All Departments', ip: '192.168.1.105', status: 'Active Now', duration: '1h 12m' },
    { user: activeUsers.find(u => u.name === 'Sarah Johnson'), role: 'Department Admin', department: 'Marketing', ip: '192.168.1.107', status: 'Active Now', duration: '45m' },
    { user: activeUsers.find(u => u.name === 'Michael Chen'), role: 'Department Admin', department: 'Engineering', ip: '192.168.1.109', status: 'Idle (5m)', duration: '27m' },
    { user: activeUsers.find(u => u.name === 'Emily Rodriguez'), role: 'Analytics User', department: 'Product', ip: '192.168.1.112', status: 'Active Now', duration: '18m' },
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-lg max-w-3xl w-full mx-4">
        <div className="flex justify-between items-center p-5 border-b">
          <h3 className="text-lg font-medium text-gray-900">Active Sessions</h3>
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
          <p className="text-sm text-gray-500 mb-5">
            Admin users currently logged in to the Glynac Analytics platform.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="text-sm text-gray-700 mb-1">Total Active Sessions</h4>
              <p className="text-2xl font-semibold text-gray-900">{totalSessions}</p>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                50% of admin users
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="text-sm text-gray-700 mb-1">Role Distribution</h4>
              <div className="space-y-1 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">System Admin:</span>
                  <span className="text-xs font-medium">{roleDistribution['System Admin']}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Department Admin:</span>
                  <span className="text-xs font-medium">{roleDistribution['Department Admin']}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Analytics User:</span>
                  <span className="text-xs font-medium">{roleDistribution['Analytics User']}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="text-sm text-gray-700 mb-1">Avg. Session Duration</h4>
              <p className="text-2xl font-semibold text-gray-900">38m</p>
              <p className="text-xs text-red-600 mt-1 flex items-center">
                <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                </svg>
                5% from yesterday
              </p>
            </div>
          </div>
          
          <div className="flex mb-4">
            <button
              className={`px-3 py-1 text-sm rounded-md ${showByUser ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
              onClick={() => setShowByUser(true)}
            >
              View by User
            </button>
            <button
              className={`ml-2 px-3 py-1 text-sm rounded-md ${!showByUser ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
              onClick={() => setShowByUser(false)}
            >
              View by Session
            </button>
          </div>
          
          {showByUser ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IP Address
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activeUsers.map((user, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 relative">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            {user.twoFA && (
                              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${user.role === 'System Admin' ? 'bg-blue-100 text-blue-800' : 
                          user.role === 'Department Admin' ? 'bg-purple-100 text-purple-800' : 
                          'bg-green-100 text-green-800'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        192.168.1.{100 + index}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IP Address
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sessions.map((session, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${session.role === 'System Admin' ? 'bg-blue-100 text-blue-800' : 
                          session.role === 'Department Admin' ? 'bg-purple-100 text-purple-800' : 
                          'bg-green-100 text-green-800'}`}>
                          {session.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {session.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {session.ip}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${session.status.includes('Active') ? 'bg-green-100 text-green-800' : 
                            'bg-yellow-100 text-yellow-800'}`}>
                            {session.status}
                          </span>
                          <span className="ml-2 text-sm text-gray-500">
                            Duration: {session.duration}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 hover:text-red-900">
                        <button>Terminate</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <button
            type="button"
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
          >
            Terminate All Sessions
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActiveSessionsModal;