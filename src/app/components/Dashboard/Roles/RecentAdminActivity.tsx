"use client"

import React from 'react';

const RecentAdminActivity: React.FC = () => {
  const activityLog = [
    {
      user: 'Admin User',
      action: 'Updated user account',
      target: 'Sarah Johnson',
      details: 'Changed department from Sales to Marketing',
      timestamp: '10 minutes ago',
      ip: '192.168.1.105'
    },
    {
      user: 'Admin User',
      action: 'Reset password',
      target: 'Michael Chen',
      details: 'Force password reset',
      timestamp: '1 hour ago',
      ip: '192.168.1.105'
    },
    {
      user: 'Sarah Johnson',
      action: 'Logged in',
      target: '',
      details: 'Successful login',
      timestamp: 'Today, 9:41 AM',
      ip: '192.168.1.107'
    },
    {
      user: 'Admin User',
      action: 'Added new user',
      target: 'Emily Rodriguez',
      details: 'Created account with Analytics User role',
      timestamp: '3 days ago',
      ip: '192.168.1.105'
    },
    {
      user: 'Admin User',
      action: 'Suspended user',
      target: 'Emily Rodriguez',
      details: 'Account suspended',
      timestamp: '3 days ago',
      ip: '192.168.1.105'
    }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Recent Admin Activity</h3>
        <a href="#" className="text-sm text-blue-600 hover:text-blue-800">View All Activity</a>
      </div>
      
      <div className="p-1">
        <p className="text-sm text-gray-600 p-3">
          A log of recent actions performed by admin users.
        </p>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activityLog.map((activity, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-sm text-gray-600">
                        {activity.user.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {activity.user}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{activity.action}</div>
                    {activity.target && (
                      <div className="text-xs text-gray-500">
                        Target: {activity.target}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{activity.details}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{activity.timestamp}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {activity.ip}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecentAdminActivity;