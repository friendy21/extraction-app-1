"use client"

import React, { useState } from 'react';

interface User {
  id: string;
  name: string;
  role: string;
  status: string;
  twoFA: boolean;
  lastPasswordChange: number; 
  loginAttempts: number;
  lastLogin: number; 
  riskScore: number;
}

interface SecurityIssue {
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  issue: string;
  count: number;
  details: string;
  recommendation: string;
}

interface ActivityLog {
  user: string;
  action: string;
  timestamp: string;
  ipAddress: string;
  location: string;
  deviceType: string;
}

interface SecurityReportModalProps {
  onClose: () => void;
  users: User[];
}

const SecurityReportModal: React.FC<SecurityReportModalProps> = ({ onClose, users }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'issues' | 'activity' | 'recommendations'>('overview');

  // Calculate security metrics
  const totalUsers = users.length;
  const twoFAEnabled = users.filter(user => user.twoFA).length;
  const twoFAPercentage = Math.round((twoFAEnabled / totalUsers) * 100);
  
  const activeUsers = users.filter(user => user.status === 'Active').length;
  const activePercentage = Math.round((activeUsers / totalUsers) * 100);
  
  const updatedPasswords = users.filter(user => user.lastPasswordChange < 60).length;
  const passwordUpdatedPercentage = Math.round((updatedPasswords / totalUsers) * 100);
  
  const securityScore = Math.round((twoFAPercentage * 0.5) + (passwordUpdatedPercentage * 0.3) + (activePercentage * 0.2));

  // Security issues calculation
  const securityIssues: SecurityIssue[] = [
    {
      severity: 'Critical',
      issue: 'Admin accounts without 2FA',
      count: users.filter(user => !user.twoFA && user.role.includes('Admin')).length,
      details: users.filter(user => !user.twoFA && user.role.includes('Admin')).map(u => u.name).join(', '),
      recommendation: 'Enforce 2FA for all administrative accounts immediately'
    },
    {
      severity: 'High',
      issue: 'Users without 2FA',
      count: users.filter(user => !user.twoFA).length,
      details: users.filter(user => !user.twoFA).map(u => u.name).join(', '),
      recommendation: 'Enable 2FA for all users as part of security policy'
    },
    {
      severity: 'High',
      issue: 'Passwords not changed in 90+ days',
      count: users.filter(user => user.lastPasswordChange > 90).length,
      details: users.filter(user => user.lastPasswordChange > 90).map(u => u.name).join(', '),
      recommendation: 'Enforce 90-day password rotation policy'
    },
    {
      severity: 'Medium',
      issue: 'Inactive accounts still enabled',
      count: users.filter(user => user.status === 'Inactive' && user.lastLogin > 30).length,
      details: 'Inactive accounts should be deactivated after 30 days of no activity',
      recommendation: 'Implement automatic account deactivation policy'
    },
    {
      severity: 'Medium',
      issue: 'Multiple failed login attempts',
      count: users.filter(user => user.loginAttempts > 5).length,
      details: users.filter(user => user.loginAttempts > 5).map(u => u.name).join(', '),
      recommendation: 'Review and investigate these accounts for potential compromise'
    },
    {
      severity: 'Low',
      issue: 'High-risk users',
      count: users.filter(user => user.riskScore > 70).length,
      details: 'Users with elevated risk scores based on behavior analytics',
      recommendation: 'Implement additional verification measures for high-risk users'
    }
  ];
  
  const activityLog: ActivityLog[] = [
    { user: 'Admin User', action: 'Reset 2FA for Emily Rodriguez', timestamp: '2 days ago', ipAddress: '192.168.1.45', location: 'San Francisco, CA', deviceType: 'Desktop - Chrome' },
    { user: 'Admin User', action: 'Changed role for Michael Chen from Analytics User to Department Admin', timestamp: '3 days ago', ipAddress: '192.168.1.45', location: 'San Francisco, CA', deviceType: 'Desktop - Firefox' },
    { user: 'Sarah Johnson', action: 'Suspended account for Emily Rodriguez', timestamp: '3 days ago', ipAddress: '192.168.1.23', location: 'New York, NY', deviceType: 'Mobile - iOS' },
    { user: 'Admin User', action: 'Added new user David Kim', timestamp: '1 week ago', ipAddress: '192.168.1.45', location: 'San Francisco, CA', deviceType: 'Desktop - Chrome' },
    { user: 'Admin User', action: 'Reset password for Sarah Johnson', timestamp: '2 weeks ago', ipAddress: '192.168.1.45', location: 'San Francisco, CA', deviceType: 'Desktop - Chrome' },
    { user: 'System', action: 'Blocked login attempt for Michael Chen', timestamp: '1 week ago', ipAddress: '203.57.142.91', location: 'Unknown', deviceType: 'Desktop - Chrome' }
  ];

  const recommendations = [
    { title: 'Enforce 2FA for all users', details: 'Configure your IdP to require 2FA enrollment for all users, especially those with administrative access.' },
    { title: 'Implement regular password rotation', details: 'Set a policy requiring password changes every 90 days with minimum complexity requirements.' },
    { title: 'Review inactive accounts monthly', details: 'Create an automated report of accounts with no activity in 30+ days and deactivate or remove them.' },
    { title: 'Set up login attempt alerts', details: 'Configure alerts for multiple failed login attempts and unusual location logins.' },
    { title: 'Implement role-based access control', details: 'Review user roles quarterly to ensure principle of least privilege is maintained.' },
    { title: 'Deploy endpoint protection', details: 'Ensure all devices accessing the system have up-to-date security software installed.' }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-purple-100 text-purple-800';
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-medium text-gray-800">Security Score</h4>
                  <span className={`text-3xl font-bold ${getScoreColor(securityScore)}`}>{securityScore}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {securityScore >= 90 ? 'Excellent security posture' : 
                   securityScore >= 70 ? 'Good security posture with room for improvement' : 
                   'Security posture needs immediate attention'}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                  <div 
                    className={`h-2 rounded-full ${securityScore >= 90 ? 'bg-green-500' : securityScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${securityScore}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <h4 className="text-lg font-medium text-gray-800 mb-4">Security Issues</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="inline-block w-3 h-3 rounded-full bg-purple-500 mr-2"></span>
                      <span className="text-sm text-gray-600">Critical</span>
                    </div>
                    <span className="font-medium">{securityIssues.filter(i => i.severity === 'Critical').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                      <span className="text-sm text-gray-600">High</span>
                    </div>
                    <span className="font-medium">{securityIssues.filter(i => i.severity === 'High').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                      <span className="text-sm text-gray-600">Medium</span>
                    </div>
                    <span className="font-medium">{securityIssues.filter(i => i.severity === 'Medium').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                      <span className="text-sm text-gray-600">Low</span>
                    </div>
                    <span className="font-medium">{securityIssues.filter(i => i.severity === 'Low').length}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <h4 className="text-lg font-medium text-gray-800 mb-3">2FA Adoption</h4>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div 
                    className={`h-2 rounded-full ${twoFAPercentage >= 80 ? 'bg-green-500' : twoFAPercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${twoFAPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">
                    {twoFAEnabled} of {totalUsers} users
                  </span>
                  <span className="font-medium">{twoFAPercentage}%</span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <h4 className="text-lg font-medium text-gray-800 mb-3">Password Health</h4>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div 
                    className={`h-2 rounded-full ${passwordUpdatedPercentage >= 80 ? 'bg-green-500' : passwordUpdatedPercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${passwordUpdatedPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">
                    {updatedPasswords} of {totalUsers} updated
                  </span>
                  <span className="font-medium">{passwordUpdatedPercentage}%</span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <h4 className="text-lg font-medium text-gray-800 mb-3">Account Activity</h4>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div 
                    className={`h-2 rounded-full ${activePercentage >= 80 ? 'bg-green-500' : activePercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${activePercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">
                    {activeUsers} of {totalUsers} active
                  </span>
                  <span className="font-medium">{activePercentage}%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
              <h4 className="text-lg font-medium text-gray-800 mb-4">Recent Security Activity</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {activityLog.slice(0, 3).map((activity, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-sm text-gray-600">
                              {activity.user.split(' ')[0][0]}{activity.user.split(' ').length > 1 ? activity.user.split(' ')[1][0] : ''}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{activity.user}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{activity.action}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{activity.timestamp}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{activity.location}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );
        
      case 'issues':
        return (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h4 className="text-lg font-medium text-gray-800 mb-4">Security Issues ({securityIssues.length})</h4>
            
            {securityIssues.length === 0 ? (
              <p className="text-sm text-gray-600">No security issues detected.</p>
            ) : (
              <div className="space-y-4">
                {securityIssues.map((issue, index) => (
                  <div 
                    key={index} 
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full mr-3 text-sm font-bold
                          ${getSeverityColor(issue.severity)}`}>
                          {issue.severity[0]}
                        </span>
                        <span className="text-base font-medium text-gray-800">{issue.issue}</span>
                      </div>
                      <span className="text-base font-medium bg-gray-100 py-1 px-3 rounded-full">{issue.count}</span>
                    </div>
                    <div className="ml-11 space-y-2">
                      <p className="text-sm text-gray-600">{issue.details}</p>
                      <div className="flex items-center pt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <p className="text-sm font-medium text-green-600">Recommendation: {issue.recommendation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
        
      case 'activity':
        return (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium text-gray-800">Security Activity Log</h4>
              <div>
                <select className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                  <option value="all">All Activities</option>
                  <option value="user">User Changes</option>
                  <option value="login">Login Events</option>
                  <option value="admin">Admin Actions</option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activityLog.map((activity, index) => (
                    <tr key={index} className={activity.action.includes('Blocked') ? 'bg-red-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-sm text-gray-600">
                            {activity.user.split(' ')[0][0]}{activity.user.split(' ').length > 1 ? activity.user.split(' ')[1][0] : ''}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{activity.user}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{activity.action}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{activity.timestamp}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{activity.ipAddress}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{activity.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{activity.deviceType}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
        
      case 'recommendations':
        return (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h4 className="text-lg font-medium text-gray-800 mb-4">Security Recommendations</h4>
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-100 rounded-full p-2 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="text-base font-medium text-gray-800 mb-1">{rec.title}</h5>
                      <p className="text-sm text-gray-600">{rec.details}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative bg-gray-50 rounded-lg shadow-xl max-w-5xl w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white rounded-t-lg">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-full p-2 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Enterprise Security Report</h3>
          </div>
          <div className="flex items-center">
            <button
              type="button"
              className="bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-medium py-2 px-4 rounded-md mr-3"
              onClick={() => { /* Export functionality */ }}
            >
              Export Report
            </button>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="bg-white border-b border-gray-200">
          <nav className="flex -mb-px px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm mr-8
                ${activeTab === 'overview' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('issues')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm mr-8
                ${activeTab === 'issues' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Security Issues
              <span className="ml-2 bg-red-100 text-red-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                {securityIssues.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm mr-8
                ${activeTab === 'activity' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Activity Log
            </button>
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'recommendations' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Recommendations
            </button>
          </nav>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {renderTabContent()}
        </div>
        
        <div className="p-6 bg-white border-t border-gray-200 rounded-b-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Report generated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</span>
            <button
              type="button"
              className="py-2 px-4 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 text-sm font-medium"
              onClick={onClose}
            >
              Close Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityReportModal;