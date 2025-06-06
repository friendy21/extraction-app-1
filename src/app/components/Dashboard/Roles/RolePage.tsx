"use client"

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../DashboardLayout';
import AddAdminUserModal from './AddAdminUserModal';
import EditAdminUserModal from './EditAdminUserModal';
import ActiveSessionsModal from './ActiveSessionsModal';
import SecurityReportModal from './SecurityReportModal';
import AccountReviewModal from './AccountReviewModal';
import RecentAdminActivity from './RecentAdminActivity';

const RolePage: React.FC = () => {
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showActiveSessionsModal, setShowActiveSessionsModal] = useState(false);
  const [showSecurityReportModal, setShowSecurityReportModal] = useState(false);
  const [showAccountReviewModal, setShowAccountReviewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Admin User",
      email: "admin@company.com",
      role: "System Admin",
      department: "All Departments",
      status: "Active",
      lastActive: "Today, 10:23 AM",
      activeSessions: 2,
      twoFA: true
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      role: "Department Admin",
      department: "Marketing",
      status: "Active",
      lastActive: "Today, 9:41 AM",
      activeSessions: 1,
      twoFA: true
    },
    {
      id: 3,
      name: "Michael Chen",
      email: "michael.chen@company.com",
      role: "Department Admin",
      department: "Engineering",
      status: "Active",
      lastActive: "Yesterday, 4:23 PM",
      activeSessions: 1,
      twoFA: true
    },
    {
      id: 4,
      name: "Emily Rodriguez",
      email: "emily.rodriguez@company.com",
      role: "Analytics User",
      department: "Product",
      status: "Suspended",
      lastActive: "3 days ago",
      activeSessions: 0,
      twoFA: false
    },
    {
      id: 5,
      name: "David Kim",
      email: "david.kim@company.com",
      role: "Analytics User",
      department: "Finance",
      status: "Inactive",
      lastActive: "1 week ago",
      activeSessions: 0,
      twoFA: false
    },
    {
      id: 6,
      name: "Jennifer Smith",
      email: "jennifer.smith@company.com",
      role: "Department Admin",
      department: "Human Resources",
      status: "Active",
      lastActive: "2 days ago",
      activeSessions: 0,
      twoFA: true
    },
    {
      id: 7,
      name: "Robert Johnson",
      email: "robert.johnson@company.com",
      role: "Analytics User",
      department: "Sales",
      status: "Active",
      lastActive: "Yesterday, 2:15 PM",
      activeSessions: 0,
      twoFA: true
    }
  ]);

  // Initialize stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    activeSessions: 0,
    twoFAEnabled: 0,
    twoFAPercentage: 0,
    suspendedInactive: 0
  });

  // Update stats whenever users change
  useEffect(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.status === "Active").length;
    const activeSessions = users.reduce((total, user) => total + user.activeSessions, 0);
    const twoFAEnabled = users.filter(user => user.twoFA).length;
    const suspendedInactive = users.filter(user => user.status === "Suspended" || user.status === "Inactive").length;
    
    setStats({
      totalUsers,
      activeUsers,
      activeSessions,
      twoFAEnabled,
      twoFAPercentage: totalUsers > 0 ? Math.round((twoFAEnabled / totalUsers) * 100) : 0,
      suspendedInactive
    });
  }, [users]);

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setShowEditUserModal(true);
  };

  const handleDeleteUser = (userId: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleSaveUser = (updatedUser: any) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
    setShowEditUserModal(false);
  };

  const handleAddUser = (newUser: any) => {
    // Ensure the new user has a unique ID
    const maxId = Math.max(...users.map(user => user.id), 0);
    const userWithId = { ...newUser, id: maxId + 1 };
    setUsers([...users, userWithId]);
    setShowAddUserModal(false);
  };

  const filteredUsers = users
    .filter(user => roleFilter === "All Roles" || user.role === roleFilter)
    .filter(user => statusFilter === "All Statuses" || user.status === statusFilter)
    .filter(user => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.department.toLowerCase().includes(query)
      );
    });

  // Get the current admin user for the header
  const adminUser = users.find(user => user.id === 1) || {
    name: "Admin User",
    avatar: "/api/placeholder/32/32"
  };

  return (
    <DashboardLayout userName={adminUser.name} userAvatar="/api/placeholder/32/32">
      <div className="p-6">
        {/* Removed duplicate ADMINISTRATION and navigation menu that was here */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Role Management</h1>
          <button 
            onClick={() => setShowAddUserModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Admin User
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Admin Users</p>
              <p className="text-xl font-semibold">{stats.totalUsers}</p>
            </div>
            {/* Card info only */}
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center">
            <div className="bg-green-100 p-3 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Sessions</p>
              <p className="text-xl font-semibold">{stats.activeSessions}</p>
            </div>
            <div className="ml-auto">
              <button 
                onClick={() => setShowActiveSessionsModal(true)}
                className="text-blue-600 text-sm hover:underline"
              >
                View all sessions
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center">
            <div className="bg-amber-100 p-3 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">2FA Enabled</p>
              <p className="text-xl font-semibold">{stats.twoFAEnabled} / {stats.totalUsers} ({stats.twoFAPercentage}%)</p>
            </div>
            <div className="ml-auto">
              <button 
                onClick={() => setShowSecurityReportModal(true)}
                className="text-blue-600 text-sm hover:underline"
              >
                View security report
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center">
            <div className="bg-red-100 p-3 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Suspended/Inactive</p>
              <p className="text-xl font-semibold">{stats.suspendedInactive}</p>
            </div>
            <div className="ml-auto">
              <button 
                onClick={() => setShowAccountReviewModal(true)}
                className="text-blue-600 text-sm hover:underline"
              >
                Review accounts
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="p-4 border-b border-gray-200 flex flex-wrap gap-4">
            <div className="relative">
              <select 
                className="block appearance-none w-40 bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option>All Roles</option>
                <option>System Admin</option>
                <option>Department Admin</option>
                <option>Analytics User</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
            
            <div className="relative">
              <select 
                className="block appearance-none w-40 bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>All Statuses</option>
                <option>Active</option>
                <option>Suspended</option>
                <option>Inactive</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
            
            <div className="flex-grow">
              <div className="relative">
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department Access
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                    <tr key={user.id}>
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
                            {user.twoFA ? (
                              <div className="text-xs text-green-600">2FA Enabled</div>
                            ) : (
                              <div className="text-xs text-gray-400">2FA Disabled</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${user.role === 'System Admin' ? 'bg-blue-100 text-blue-800' : 
                          user.role === 'Department Admin' ? 'bg-purple-100 text-purple-800' : 
                          'bg-green-100 text-green-800'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 
                          user.status === 'Suspended' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.lastActive}</div>
                        <div className="text-xs text-gray-500">{user.activeSessions > 0 ? `${user.activeSessions} active session${user.activeSessions > 1 ? 's' : ''}` : '0 active sessions'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button 
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              {filteredUsers.length === 0 
                ? "No users found" 
                : `Showing 1 to ${filteredUsers.length} of ${filteredUsers.length} admin users`}
            </div>
            <div className="flex-1 flex justify-end">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button aria-current="page" className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  1
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
        
        <RecentAdminActivity />
        
        {showAddUserModal && (
          <AddAdminUserModal 
            onClose={() => setShowAddUserModal(false)}
            onSave={handleAddUser}
          />
        )}
        
        {showEditUserModal && selectedUser && (
          <EditAdminUserModal 
            user={selectedUser}
            onClose={() => setShowEditUserModal(false)}
            onSave={handleSaveUser}
          />
        )}
        
        {showActiveSessionsModal && (
          <ActiveSessionsModal 
            onClose={() => setShowActiveSessionsModal(false)}
            activeUsers={users.filter(user => user.activeSessions > 0)}
          />
        )}
        
        {showSecurityReportModal && (
          <SecurityReportModal 
            onClose={() => setShowSecurityReportModal(false)}
            users={users}
          />
        )}
        
        {showAccountReviewModal && (
          <AccountReviewModal 
            onClose={() => setShowAccountReviewModal(false)}
            suspendedUsers={users.filter(user => user.status === 'Suspended' || user.status === 'Inactive')}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default RolePage;