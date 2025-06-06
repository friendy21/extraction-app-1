"use client"

import React, { useState, useCallback, useEffect } from 'react';
import { Alert } from './ImportantAlerts';
import { ArrowDown, ArrowUp, AlertTriangle, Zap, Clock, Users, Server, RefreshCw, Database, Shield } from 'lucide-react';

// User and Session types
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

// System metrics interface
interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  apiResponseTime: number;
  dbQueryTime: number;
  analyticsProcessingTime: number;
  authServiceTime: number;
}

// Props for SystemOverview component
interface SystemOverviewProps {
  activeUserCount: number;
  users: User[];
  sessions: Session[];
  onTerminateSession: (sessionId: string) => void;
  onTerminateAllSessions: () => void;
  addAlert: (alert: Alert) => void;
}

// Modal Component
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-grow">
          {children}
        </div>
      </div>
    </div>
  );
};



// Data Sync History Modal Content
const DataSyncContent: React.FC<{
  addAlert: (alert: Alert) => void;
}> = ({ addAlert }) => {
  // Initial data
  const allSyncData = [
    {
      id: '1',
      date: 'Today at 10:23 AM',
      source: 'Google Workspace',
      sourceIcon: '/api/placeholder/24/24',
      records: 12456,
      duration: '3m 42s',
      status: 'Success'
    },
    {
      id: '2',
      date: 'Today at 9:41 AM',
      source: 'Microsoft 365',
      sourceIcon: '/api/placeholder/24/24',
      records: 31872,
      duration: '6m 15s',
      status: 'Success'
    },
    {
      id: '3',
      date: 'Today at 8:17 AM',
      source: 'Slack',
      sourceIcon: '/api/placeholder/24/24',
      records: 5428,
      duration: '2m 08s',
      status: 'Success'
    },
    {
      id: '4',
      date: 'Yesterday at 11:35 PM',
      source: 'Zoom',
      sourceIcon: '/api/placeholder/24/24',
      records: 456,
      duration: '1m 35s',
      status: 'Failed'
    },
    {
      id: '5',
      date: 'Yesterday at 6:14 PM',
      source: 'Microsoft 365',
      sourceIcon: '/api/placeholder/24/24',
      records: 28945,
      duration: '5m 52s',
      status: 'Partial'
    }
  ];
  
  // State for filters
  const [sourceFilter, setSourceFilter] = useState<string>('All Sources');
  const [statusFilter, setStatusFilter] = useState<string>('All Status');
  const [dateFilter, setDateFilter] = useState<string>('');
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  // State for sync running
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncSources, setSyncSources] = useState<string[]>([]);
  
  // Apply filters and get filtered data
  const getFilteredData = useCallback(() => {
    return allSyncData.filter(item => {
      // Source filter
      if (sourceFilter !== 'All Sources' && item.source !== sourceFilter) {
        return false;
      }
      
      // Status filter
      if (statusFilter !== 'All Status' && item.status !== statusFilter) {
        return false;
      }
      
      // Date filter - simplified for demo
      if (dateFilter && !item.date.toLowerCase().includes(dateFilter.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }, [sourceFilter, statusFilter, dateFilter]);
  
  // Get filtered data
  const filteredData = getFilteredData();
  
  // Get paginated data
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  };
  
  // Get total pages
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Get page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    // Always show first page
    pageNumbers.push(1);
    
    // Add current page and surrounding pages
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (!pageNumbers.includes(i)) {
        pageNumbers.push(i);
      }
    }
    
    // Always show last page if there are more than 1 page
    if (totalPages > 1 && !pageNumbers.includes(totalPages)) {
      // Add ellipsis if there's a gap
      if (pageNumbers[pageNumbers.length - 1] !== totalPages - 1) {
        pageNumbers.push(-1); // Use -1 to represent ellipsis
      }
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  // Function to run manual sync
  const runManualSync = () => {
    setIsSyncing(true);
    setSyncProgress(0);
    setSyncSources(['Google Workspace', 'Microsoft 365', 'Slack', 'Zoom']);

    // Simulate sync operation with progress updates
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSyncing(false);
          
          // Add alert about successful sync
          addAlert({
            id: `sync-${Date.now()}`,
            type: 'success',
            title: 'Manual data sync completed',
            description: 'All data sources synced successfully',
            action: { 
              text: "View", 
              onClick: () => console.log('View sync details') 
            },
            details: 'Manual data synchronization from all sources has completed. 48,624 records were processed across 4 connected platforms.'
          });
          
          return 0;
        }
        
        return prev + 5;
      });
    }, 150);
  };
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [sourceFilter, statusFilter, dateFilter]);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-600">View the history of data synchronizations from connected platforms.</p>
        <button 
          onClick={runManualSync}
          disabled={isSyncing}
                        className={`px-4 py-2 rounded-md text-sm flex items-center ${
            isSyncing 
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isSyncing ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Syncing...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Run Manual Sync
            </>
          )}
        </button>
      </div>
      
      {isSyncing && (
        <div className="mb-6 bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Syncing Data</h3>
            <span className="text-sm font-medium">{syncProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${syncProgress}%` }}
            ></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {syncSources.map((source, index) => (
              <div 
                key={source} 
                className={`text-xs p-2 rounded-lg flex items-center ${
                  syncProgress > (index + 1) * 25 ? 'bg-green-100 text-green-800' : 'bg-gray-100'
                }`}
              >
                {syncProgress > (index + 1) * 25 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="animate-spin h-4 w-4 mr-1 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {source}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex-1 min-w-[200px]">
          <select 
            className="w-full border rounded-md py-2 px-3"
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
          >
            <option>All Sources</option>
            <option>Microsoft 365</option>
            <option>Google Workspace</option>
            <option>Slack</option>
            <option>Zoom</option>
          </select>
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <select 
            className="w-full border rounded-md py-2 px-3"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All Status</option>
            <option>Success</option>
            <option>Failed</option>
            <option>Partial</option>
          </select>
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <input 
            type="text" 
            placeholder="mm/dd/yyyy" 
            className="w-full border rounded-md py-2 px-3" 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
        
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center"
          onClick={() => setCurrentPage(1)} 
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filter
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Source
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Records Processed
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {getPaginatedData().map(item => (
              <tr key={item.id}>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.date}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img className="h-6 w-6 mr-2" src={item.sourceIcon} alt={item.source} />
                    <span className="text-sm">{item.source}</span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.records.toLocaleString()}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.duration}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    item.status === 'Success' ? 'bg-green-100 text-green-800' :
                    item.status === 'Failed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <button 
                    onClick={() => {
                      if (item.status === 'Failed' || item.status === 'Partial') {
                        addAlert({
                          id: `retry-sync-${item.id}-${Date.now()}`,
                          type: 'info',
                          title: `Retrying ${item.source} sync`,
                          description: `Attempting to resync data from ${item.source}`,
                          action: { 
                            text: "View", 
                            onClick: () => console.log('View sync progress') 
                          }
                        });
                      } else {
                        addAlert({
                          id: `view-sync-${item.id}-${Date.now()}`,
                          type: 'info',
                          title: `${item.source} sync details`,
                          description: `Viewing details for ${item.source} sync from ${item.date}`,
                          action: { 
                            text: "View", 
                            onClick: () => console.log('View full sync details') 
                          },
                          details: `Full details for ${item.source} synchronization: ${item.records.toLocaleString()} records processed in ${item.duration}. Status: ${item.status}`
                        });
                      }
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {item.status === 'Failed' || item.status === 'Partial' ? 'Retry' : 'View'}
                  </button>
                </td>
              </tr>
            ))}
            
            {getPaginatedData().length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
                  No matching records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          Showing {filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} results
        </div>
        
        <div className="flex">
          <button 
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`border rounded-l px-3 py-1 text-sm ${
              currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'
            }`}
          >
            &lt;
          </button>
          
          {getPageNumbers().map((page, index) => (
            page === -1 ? (
              <span key={`ellipsis-${index}`} className="border-t border-b border-r px-3 py-1 text-sm">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`border-t border-b border-r px-3 py-1 text-sm ${
                  currentPage === page ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            )
          ))}
          
          <button 
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`border-t border-b border-r rounded-r px-3 py-1 text-sm ${
              currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'
            }`}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

// Security Modal Content
const SecurityContent: React.FC<{
  addAlert: (alert: Alert) => void;
}> = ({ addAlert }) => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isRunningAudit, setIsRunningAudit] = useState(false);

  const runSecurityAudit = () => {
    setIsRunningAudit(true);
    
    // Simulate audit
    setTimeout(() => {
      setIsRunningAudit(false);
      
      // Add alert about audit
      addAlert({
        id: `security-audit-${Date.now()}`,
        type: 'success',
        title: 'Security audit completed',
        description: 'No critical vulnerabilities detected',
        action: { 
          text: "View Report", 
          onClick: () => console.log('View audit report') 
        },
        details: 'Security audit completed successfully. 3 low-severity warnings were detected and have been logged for review.'
      });
    }, 2500);
  };
  
  return (
    <div>
      <div className="mb-6 border-b">
        <div className="flex space-x-2">
          <button 
            className={`px-4 py-2 font-medium text-sm ${selectedTab === 'overview' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setSelectedTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`px-4 py-2 font-medium text-sm ${selectedTab === 'access' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setSelectedTab('access')}
          >
            Access Control
          </button>
          <button 
            className={`px-4 py-2 font-medium text-sm ${selectedTab === 'logs' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setSelectedTab('logs')}
          >
            Security Logs
          </button>
        </div>
      </div>

      {selectedTab === 'overview' && (
        <>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">Current security status and threat assessment.</p>
            <button 
              onClick={runSecurityAudit}
              disabled={isRunningAudit}
              className={`px-4 py-2 rounded-md text-sm flex items-center ${
                isRunningAudit 
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isRunningAudit ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Running Audit...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Run Security Audit
                </>
              )}
            </button>
          </div>
          
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg flex items-center mb-6">
            <div className="bg-green-500 rounded-full p-2 mr-4 text-white">
              <Shield className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">Security Status: Secure</h3>
              <p className="text-sm text-gray-600">Last audit: Today at 8:30 AM</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-medium mb-3">Vulnerability Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Critical</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">High</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Medium</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Low</span>
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">3</span>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-medium mb-3">Authentication</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">2FA Enabled Users</span>
                  <span className="text-sm font-medium">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Failed Login Attempts (24h)</span>
                  <span className="text-sm font-medium">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Password Policy Compliance</span>
                  <span className="text-sm font-medium">100%</span>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-medium mb-3">Data Protection</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Encryption Status</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Last Backup</span>
                  <span className="text-sm">Today at 06:00 AM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Data Compliance</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Compliant</span>
                </div>
              </div>
            </div>
          </div>
          
          <h3 className="font-medium mb-3">Recent Security Events</h3>
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Today at 11:32 AM</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">Multiple failed login attempts</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Warning</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">192.168.5.123</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Today at 10:15 AM</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">New admin user created</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Info</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Admin User</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Today at 8:30 AM</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">Security audit completed</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Info</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">System</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Yesterday at 5:42 PM</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">Suspicious file upload detected</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Warning</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">192.168.1.42</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      {selectedTab === 'access' && (
        <div>
          <p className="text-sm text-gray-600 mb-4">Manage access control and permissions for system users.</p>
          
          <div className="border rounded-lg p-4 mb-6">
            <h3 className="font-medium mb-3">Role Permissions</h3>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">View Data</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edit Data</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin Actions</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Security</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">System Admin</span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Department Admin</span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Analytics User</span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3">Two-Factor Authentication Status</h3>
              <div className="h-64 bg-gray-50 flex items-center justify-center">
                {/* Placeholder for 2FA chart */}
                <p className="text-gray-400">2FA status chart would be displayed here</p>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3">Recently Modified Permissions</h3>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Marketing Department Access</p>
                      <p className="text-xs text-gray-500">Modified by Admin User</p>
                    </div>
                    <span className="text-xs text-gray-500">Today at 9:15 AM</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Emily's Role Change</p>
                      <p className="text-xs text-gray-500">Modified by Admin User</p>
                    </div>
                    <span className="text-xs text-gray-500">Yesterday at 2:30 PM</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Finance Report Access</p>
                      <p className="text-xs text-gray-500">Modified by Sarah Johnson</p>
                    </div>
                    <span className="text-xs text-gray-500">May 1, 2025</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'logs' && (
        <div>
          <p className="text-sm text-gray-600 mb-4">Security event logs for system monitoring and audit.</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="flex-1 min-w-[200px]">
              <select className="w-full border rounded-md py-2 px-3 text-sm">
                <option>All Event Types</option>
                <option>Login Attempts</option>
                <option>Permission Changes</option>
                <option>Data Access</option>
                <option>System Changes</option>
              </select>
            </div>
            
            <div className="flex-1 min-w-[200px]">
              <select className="w-full border rounded-md py-2 px-3 text-sm">
                <option>All Severity Levels</option>
                <option>Critical</option>
                <option>Warning</option>
                <option>Info</option>
              </select>
            </div>
            
            <div className="flex-1 min-w-[200px]">
              <input 
                type="text" 
                placeholder="Search logs..." 
                className="w-full border rounded-md py-2 px-3 text-sm" 
              />
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">2025-05-02 11:32:15</td>
                  <td className="px-4 py-3 text-sm">Multiple failed login attempts</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Unknown</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">192.168.5.123</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Warning</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">2025-05-02 10:15:42</td>
                  <td className="px-4 py-3 text-sm">New admin user created</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Admin User</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">192.168.1.105</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Info</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">2025-05-02 09:58:33</td>
                  <td className="px-4 py-3 text-sm">User permissions updated</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Admin User</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">192.168.1.105</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Info</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">2025-05-02 08:30:17</td>
                  <td className="px-4 py-3 text-sm">Security audit completed</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">System</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">127.0.0.1</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Info</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">2025-05-01 17:42:09</td>
                  <td className="px-4 py-3 text-sm">Suspicious file upload detected</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Emily Rodriguez</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">192.168.1.42</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Warning</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">2025-05-01 16:15:33</td>
                  <td className="px-4 py-3 text-sm">User password changed</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Sarah Johnson</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">192.168.1.107</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Info</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">2025-05-01 14:08:51</td>
                  <td className="px-4 py-3 text-sm">Unauthorized API access attempt</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Unknown</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">203.0.113.42</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Critical</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              Showing 1-7 of 1,285 events
            </div>
            
            <div className="flex">
              <button className="border rounded-l px-3 py-1 text-sm hover:bg-gray-100">
                &lt;
              </button>
              <button className="border-t border-b border-r px-3 py-1 text-sm bg-blue-50 text-blue-600">
                1
              </button>
              <button className="border-t border-b border-r px-3 py-1 text-sm hover:bg-gray-100">
                2
              </button>
              <button className="border-t border-b border-r px-3 py-1 text-sm hover:bg-gray-100">
                3
              </button>
              <button className="border-t border-b border-r px-3 py-1 text-sm">
                ...
              </button>
              <button className="border-t border-b border-r px-3 py-1 text-sm hover:bg-gray-100">
                129
              </button>
              <button className="border-t border-b border-r rounded-r px-3 py-1 text-sm hover:bg-gray-100">
                &gt;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Active Sessions Modal Content with props from parent
const ActiveSessionsContent: React.FC<{
  users: User[];
  sessions: Session[];
  onTerminateSession: (id: string) => void;
  onTerminateAllSessions: () => void;
  onClose: () => void;
  addAlert: (alert: Alert) => void;
}> = ({ 
  users, 
  sessions, 
  onTerminateSession, 
  onTerminateAllSessions, 
  onClose,
  addAlert
}) => {
  const [viewType, setViewType] = useState('users'); // 'users' or 'sessions'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  
  // Get filtered users
  const filteredUsers = users.filter(user => {
    if (searchQuery && !user.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !user.email.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (selectedRole !== 'All Roles' && user.role !== selectedRole) {
      return false;
    }
    
    if (selectedDepartment !== 'All Departments' && user.department !== selectedDepartment) {
      return false;
    }
    
    return true;
  });
  
  // Get filtered sessions
  const filteredSessions = sessions.filter(session => {
    if (selectedRole !== 'All Roles' && session.role !== selectedRole) {
      return false;
    }
    
    if (selectedDepartment !== 'All Departments' && session.department !== selectedDepartment) {
      return false;
    }
    
    if (searchQuery && !session.ipAddress.includes(searchQuery)) {
      return false;
    }
    
    return true;
  });
  
  // Get all available roles
  const allRoles = ['All Roles', ...new Set(users.map(user => user.role))];
  
  // Get all available departments
  const allDepartments = ['All Departments', ...new Set(users.map(user => user.department))];
  
  // Get role style class
  const getRoleStyle = (role: string) => {
    switch (role) {
      case 'System Admin':
        return 'bg-blue-100 text-blue-800';
      case 'Department Admin':
        return 'bg-purple-100 text-purple-800';
      case 'Analytics User':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get status style class
  const getStatusStyle = (status: string) => {
    if (status.startsWith('Active')) {
      return 'bg-green-100 text-green-800';
    } else if (status.startsWith('Idle')) {
      return 'bg-yellow-100 text-yellow-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle termination with confirmation
  const handleTerminate = (sessionId: string) => {
    // Find user info for better alert
    const sessionToTerminate = sessions.find(s => s.id === sessionId);
    const userToTerminate = users.find(u => u.ipAddress === sessionToTerminate?.ipAddress);
    
    // Call the parent function to terminate
    onTerminateSession(sessionId);
  };
  
  return (
    <div>
      <p className="text-sm text-gray-600 mb-4">Admin users currently logged in to the Glynac Analytics platform.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="border rounded-lg p-4">
          <h3 className="text-sm text-gray-600 mb-1">Total Active Sessions</h3>
          <p className="text-2xl font-semibold mb-1">{users.length}</p>
          <p className="text-xs text-green-600 flex items-center">
            <ArrowUp className="h-4 w-4 mr-1" />
            {users.length > 0 ? `${Math.round((users.length / 8) * 100)}% of admin users` : '0% of admin users'}
          </p>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="text-sm text-gray-600 mb-1">Role Distribution</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">System Admin:</span>
              <span className="text-sm font-medium">{users.filter(u => u.role === 'System Admin').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Department Admin:</span>
              <span className="text-sm font-medium">{users.filter(u => u.role === 'Department Admin').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Analytics User:</span>
              <span className="text-sm font-medium">{users.filter(u => u.role === 'Analytics User').length}</span>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="text-sm text-gray-600 mb-1">Avg. Session Duration</h3>
          <p className="text-2xl font-semibold mb-1">38m</p>
          <p className="text-xs text-red-600 flex items-center">
            <ArrowDown className="h-4 w-4 mr-1" />
            5% from yesterday
          </p>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 mb-4">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 text-sm font-medium ${viewType === 'users' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setViewType('users')}
          >
            User View
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${viewType === 'sessions' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setViewType('sessions')}
          >
            Session View
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
          <input
            type="text"
            placeholder={viewType === 'users' ? "Search by name or email..." : "Search by IP..."}
            className="border rounded-md px-3 py-2 text-sm w-full md:w-48"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          <select
            className="border rounded-md px-3 py-2 text-sm w-full md:w-auto"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            {allRoles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          
          <select
            className="border rounded-md px-3 py-2 text-sm w-full md:w-auto"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            {allDepartments.map(department => (
              <option key={department} value={department}>{department}</option>
            ))}
          </select>
        </div>
      </div>
      
      {viewType === 'users' ? (
        <div className="overflow-x-auto rounded-lg border">
          {filteredUsers.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <img className="h-8 w-8 rounded-full mr-3" src={user.avatar} alt={user.name} />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleStyle(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.department}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.ipAddress}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => {
                          // Find matching session by IP and terminate it
                          const sessionId = sessions.find(s => s.ipAddress === user.ipAddress)?.id;
                          if (sessionId) handleTerminate(sessionId);
                        }} 
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Terminate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 bg-white">
              <p className="text-gray-500">No active users match your filters</p>
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          {filteredSessions.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSessions.map(session => (
                  <tr key={session.id}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleStyle(session.role)}`}>
                        {session.role}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {session.department}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {session.ipAddress}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyle(session.status)}`}>
                          {session.status}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">Duration: {session.duration}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => handleTerminate(session.id)} 
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Terminate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 bg-white">
              <p className="text-gray-500">No active sessions match your filters</p>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-6 flex justify-between">
        <button 
          onClick={onTerminateAllSessions}
          disabled={users.length === 0}
          className={`${
            users.length === 0 
              ? 'bg-red-300 cursor-not-allowed' 
              : 'bg-red-600 hover:bg-red-700'
          } text-white font-medium py-2 px-4 rounded flex items-center`}
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          Terminate All Sessions
        </button>
        
        <button 
          onClick={onClose}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

interface StatusCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  onClick: () => void;
  color: string;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
    description: string;
  };
}

const StatusCard: React.FC<StatusCardProps> = ({ icon, title, value, onClick, color, trend }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start mb-4">
        <div className={`rounded-lg p-3 ${color}`}>
          {icon}
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-sm text-gray-600">{title}</h3>
          <p className="text-xl font-semibold">{value}</p>
          
          {trend && (
            <p className={`text-xs flex items-center mt-1 ${
              trend.direction === 'up' ? 'text-green-600' : 
              trend.direction === 'down' ? 'text-red-600' : 'text-gray-500'
            }`}>
              {trend.direction === 'up' ? (
                <ArrowUp className="h-3 w-3 mr-1" />
              ) : trend.direction === 'down' ? (
                <ArrowDown className="h-3 w-3 mr-1" />
              ) : null}
              {trend.value} {trend.description}
            </p>
          )}
        </div>
      </div>
      <button 
        onClick={onClick}
        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
      >
        View details
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

// Main SystemOverview component with props
const SystemOverview: React.FC<SystemOverviewProps> = ({
  activeUserCount,
  users,
  sessions,
  onTerminateSession,
  onTerminateAllSessions,
  addAlert
}) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  
  const openModal = (modalType: string) => {
    setActiveModal(modalType);
  };
  
  const closeModal = () => {
    setActiveModal(null);
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">System Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatusCard 
          icon={<Clock className="h-6 w-6 text-white" />}
          title="Data Freshness"
          value="1 hour ago"
          onClick={() => openModal('dataSync')}
          color="bg-blue-500"
          trend={{
            value: "38%",
            direction: "up",
            description: "faster sync"
          }}
        />
        
        <StatusCard 
          icon={<Users className="h-6 w-6 text-white" />}
          title="Active Users"
          value={activeUserCount.toString()}
          onClick={() => openModal('activeSessions')}
          color="bg-purple-500"
          trend={{
            value: "25%",
            direction: "up", 
            description: "from yesterday"
          }}
        />
        
        <StatusCard 
          icon={<Shield className="h-6 w-6 text-white" />}
          title="Security"
          value="Secure"
          onClick={() => openModal('security')}
          color="bg-amber-500"
          trend={{
            value: "3",
            direction: "down",
            description: "warnings cleared"
          }}
        />
      </div>
      
      {/* Data Sync History Modal */}
      <Modal 
        isOpen={activeModal === 'dataSync'} 
        onClose={closeModal}
        title="Data Sync History"
      >
        <DataSyncContent addAlert={addAlert} />
      </Modal>
      
      {/* Active Sessions Modal */}
      <Modal 
        isOpen={activeModal === 'activeSessions'} 
        onClose={closeModal}
        title="Active Sessions"
      >
        <ActiveSessionsContent 
          users={users}
          sessions={sessions}
          onTerminateSession={onTerminateSession}
          onTerminateAllSessions={onTerminateAllSessions}
          onClose={closeModal}
          addAlert={addAlert}
        />
      </Modal>
      
      {/* Security Modal */}
      <Modal 
        isOpen={activeModal === 'security'} 
        onClose={closeModal}
        title="Security Center"
      >
        <SecurityContent addAlert={addAlert} />
      </Modal>
    </div>
  );
};

export default SystemOverview;