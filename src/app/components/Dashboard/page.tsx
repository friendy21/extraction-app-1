"use client"

import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import SystemOverview from './SystemOverview';
import DataSourceStatus from './DataSourceStatus';
import ImportantAlerts, { Alert } from './ImportantAlerts';
import RecentActivity from './RecentActivity';

// Define user and session types
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  department: string;
  ipAddress: string;
}

interface Session {
  id: string;
  role: string;
  department: string;
  ipAddress: string;
  status: string;
  duration: string;
}

const DashboardPage: React.FC = () => {
  // Initialize shared state for users and sessions
  const [users, setUsers] = useState<User[]>([
    {
      id: 'user1',
      name: 'Admin User',
      email: 'admin@company.com',
      avatar: '/api/placeholder/32/32',
      role: 'System Admin',
      department: 'All Departments',
      ipAddress: '192.168.1.105'
    },
    {
      id: 'user2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      avatar: '/api/placeholder/32/32',
      role: 'Department Admin',
      department: 'Marketing',
      ipAddress: '192.168.1.107'
    },
    {
      id: 'user3',
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      avatar: '/api/placeholder/32/32',
      role: 'Department Admin',
      department: 'Engineering',
      ipAddress: '192.168.1.109'
    },
    {
      id: 'user4',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@company.com',
      avatar: '/api/placeholder/32/32',
      role: 'Analytics User',
      department: 'Product',
      ipAddress: '192.168.1.112'
    }
  ]);
  
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: 'session1',
      role: 'System Admin',
      department: 'All Departments',
      ipAddress: '192.168.1.105',
      status: 'Active Now',
      duration: '1h 12m'
    },
    {
      id: 'session2',
      role: 'Department Admin',
      department: 'Marketing',
      ipAddress: '192.168.1.107',
      status: 'Active Now',
      duration: '45m'
    },
    {
      id: 'session3',
      role: 'Department Admin',
      department: 'Engineering',
      ipAddress: '192.168.1.109',
      status: 'Idle (5m)',
      duration: '27m'
    },
    {
      id: 'session4',
      role: 'Analytics User',
      department: 'Product',
      ipAddress: '192.168.1.112',
      status: 'Active Now',
      duration: '18m'
    }
  ]);

  // State for alerts
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Function to add a new alert
  const addAlert = (alert: Alert) => {
    setAlerts(prev => [alert, ...prev]);
  };

  // Function to terminate a session
  const handleTerminateSession = (sessionId: string) => {
    // Remove the session
    const sessionToRemove = sessions.find(s => s.id === sessionId);
    if (!sessionToRemove) return;
    
    setSessions(prevSessions => prevSessions.filter(s => s.id !== sessionId));
    
    // Find the matching user
    const userToRemove = users.find(user => user.ipAddress === sessionToRemove.ipAddress);
    
    // Remove the matching user
    setUsers(prevUsers => prevUsers.filter(user => 
      user.ipAddress !== sessionToRemove.ipAddress
    ));

    // Add alert for user termination
    if (userToRemove) {
      addAlert({
        id: `alert-terminate-${sessionId}`,
        type: 'info',
        title: 'User session terminated',
        description: `${userToRemove.name}'s session has been terminated`,
        action: { 
          text: "View Users", 
          onClick: () => console.log('View active users') 
        },
        details: `${userToRemove.name} (${userToRemove.email}) was disconnected from the system. They will need to sign in again to access the platform.`,
        timestamp: 'Just now'
      });
    }
  };

  // Function to terminate all sessions
  const handleTerminateAllSessions = () => {
    // Count the users before clearing
    const userCount = users.length;
    
    // Clear sessions and users
    setSessions([]);
    setUsers([]);

    // Add alert for multiple terminations
    if (userCount > 0) {
      addAlert({
        id: `alert-terminate-all-${Date.now()}`,
        type: 'warning',
        title: 'All user sessions terminated',
        description: `${userCount} active user sessions have been disconnected`,
        action: { 
          text: "View Users", 
          onClick: () => console.log('View active users') 
        },
        details: `All ${userCount} active user sessions have been forcefully terminated by an administrator. This is a security-impacting action that has been logged for audit purposes.`,
        timestamp: 'Just now'
      });
    }
  };

  // Get the current user for the header, defaulting to empty values if not found
  const currentUser = users.find(user => user.id === 'user1') || { name: '', avatar: '' };

  return (
    <DashboardLayout 
      userName={currentUser?.name} 
      userAvatar={currentUser?.avatar}
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        {/* System Overview with Active Users Count and Session Management */}
        <SystemOverview 
          activeUserCount={users.length}
          users={users}
          sessions={sessions}
          onTerminateSession={handleTerminateSession}
          onTerminateAllSessions={handleTerminateAllSessions}
          addAlert={addAlert}
        />
        
        {/* Important Alerts with External Alert Support
        <div className="mt-8">
          <ImportantAlerts externalAlerts={alerts} />
        </div> */}
        
        {/* Data Source Status with Alert Integration */}
        <div className="mt-8">
          <DataSourceStatus addAlert={addAlert} />
        </div>
        
        {/* Recent Activity with User Activity Info */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <RecentActivity activeUserCount={users.length} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
