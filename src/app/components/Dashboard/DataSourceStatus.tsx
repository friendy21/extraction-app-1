"use client"

import React, { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw, Clock, Settings, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

interface DataSourceProps {
  icon: React.ReactNode;
  name: string;
  syncInfo: string;
  isConnected: boolean;
  id: string;
  onConfigSaved: (id: string, config: any) => void;
}

const DataSource: React.FC<DataSourceProps & { 
  showSettings: string | null; 
  onToggleSettings: (id: string) => void;
  onConfigSaved: (id: string, config: any) => void;
}> = ({ 
  icon, 
  name, 
  syncInfo, 
  isConnected, 
  id, 
  showSettings, 
  onToggleSettings,
  onConfigSaved
}) => {
  // State for form values
  const [apiKey, setApiKey] = useState('••••••••••••••••');
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);
  const [syncFrequency, setSyncFrequency] = useState('Every hour');
  const [dataTypes, setDataTypes] = useState({
    emails: true,
    files: true,
    calendar: true
  });
  const [connectionOptions, setConnectionOptions] = useState({
    forceRefresh: false,
    debugMode: false
  });
  
  // For new connection
  const [newApiKey, setNewApiKey] = useState('');
  const [newApiSecret, setNewApiSecret] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');

  // Handle saving config changes
  const handleSaveChanges = () => {
    // Collect settings data
    const configData = {
      apiKey: apiKey,
      syncFrequency: syncFrequency,
      dataTypes: dataTypes,
      connectionOptions: connectionOptions
    };
    
    // Call parent's function to handle the save
    onConfigSaved(id, configData);
    
    // Close the settings panel
    onToggleSettings(id);
  };

  // Handle connecting new source
  const handleConnect = () => {
    // Collect connection data
    const connectionData = {
      apiKey: newApiKey,
      apiSecret: newApiSecret,
      webhookUrl: webhookUrl
    };
    
    // Call parent's function to handle the connection
    onConfigSaved(id, connectionData);
    
    // Close the settings panel
    onToggleSettings(id);
  };

  // Toggle API key visibility
  const toggleApiKeyVisibility = () => {
    setIsApiKeyVisible(!isApiKeyVisible);
    if (!isApiKeyVisible) {
      setApiKey('ak_' + Math.random().toString(36).substring(2, 15));
    } else {
      setApiKey('••••••••••••••••');
    }
  };
  
  return (
    <>
      <div className="flex items-center justify-between py-4 px-4 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-200">
        <div className="flex items-center">
          <div className="mr-4 flex-shrink-0">
            <div className={`rounded-lg p-2 ${isConnected ? 'bg-blue-50' : 'bg-gray-100'}`}>
              {icon}
            </div>
          </div>
          <div>
            <h3 className="font-medium">{name}</h3>
            <div className="flex items-center text-sm text-gray-600">
              <Clock size={14} className="mr-1" />
              {syncInfo}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`px-3 py-1 text-xs rounded-full flex items-center ${
            isConnected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            <span className={`w-2 h-2 rounded-full mr-1 ${isConnected ? 'bg-green-500' : 'bg-gray-500'}`}></span>
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
          <button 
            onClick={() => onToggleSettings(id)}
            className={`px-3 py-1 rounded-md text-sm font-medium flex items-center ${
              isConnected ? 'text-blue-600 hover:bg-blue-50' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isConnected ? 
              <><Settings size={14} className="mr-1" /> Settings</> : 
              'Connect'}
          </button>
        </div>
      </div>
      
      {/* Settings Panel (Expanded when showSettings matches this source's id) */}
      {showSettings === id && isConnected && (
        <div className="bg-gray-50 p-6 border-b border-gray-200 animate-fadeIn">
          <h3 className="text-md font-medium mb-4 flex items-center">
            <Settings size={16} className="mr-2" />
            {name} Settings
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key
              </label>
              <div className="flex">
                <input 
                  type={isApiKeyVisible ? "text" : "password"} 
                  value={apiKey} 
                  onChange={(e) => setApiKey(e.target.value)}
                  className="flex-1 border rounded-l-md py-2 px-3 text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 focus:outline-none"
                />
                <button 
                  onClick={toggleApiKeyVisibility}
                  className="bg-blue-100 text-blue-700 px-3 py-2 text-sm rounded-r-md hover:bg-blue-200 transition-colors duration-150"
                >
                  {isApiKeyVisible ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sync Frequency
              </label>
              <select 
                className="border rounded-md py-2 px-3 w-full text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 focus:outline-none"
                value={syncFrequency}
                onChange={(e) => setSyncFrequency(e.target.value)}
              >
                <option>Every hour</option>
                <option>Every 6 hours</option>
                <option>Every 12 hours</option>
                <option>Daily</option>
              </select>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Types
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input 
                    id={`${id}-emails`} 
                    type="checkbox" 
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500" 
                    checked={dataTypes.emails}
                    onChange={(e) => setDataTypes({...dataTypes, emails: e.target.checked})}
                  />
                  <label htmlFor={`${id}-emails`} className="ml-2 text-sm text-gray-700">Emails</label>
                </div>
                <div className="flex items-center">
                  <input 
                    id={`${id}-files`} 
                    type="checkbox" 
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500" 
                    checked={dataTypes.files}
                    onChange={(e) => setDataTypes({...dataTypes, files: e.target.checked})}
                  />
                  <label htmlFor={`${id}-files`} className="ml-2 text-sm text-gray-700">Files</label>
                </div>
                <div className="flex items-center">
                  <input 
                    id={`${id}-calendar`} 
                    type="checkbox" 
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500" 
                    checked={dataTypes.calendar}
                    onChange={(e) => setDataTypes({...dataTypes, calendar: e.target.checked})}
                  />
                  <label htmlFor={`${id}-calendar`} className="ml-2 text-sm text-gray-700">Calendar</label>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Connection Options
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input 
                    id={`${id}-force-refresh`} 
                    type="checkbox" 
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500" 
                    checked={connectionOptions.forceRefresh}
                    onChange={(e) => setConnectionOptions({...connectionOptions, forceRefresh: e.target.checked})}
                  />
                  <label htmlFor={`${id}-force-refresh`} className="ml-2 text-sm text-gray-700">Force refresh token</label>
                </div>
                <div className="flex items-center">
                  <input 
                    id={`${id}-debug`} 
                    type="checkbox" 
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500" 
                    checked={connectionOptions.debugMode}
                    onChange={(e) => setConnectionOptions({...connectionOptions, debugMode: e.target.checked})}
                  />
                  <label htmlFor={`${id}-debug`} className="ml-2 text-sm text-gray-700">Enable debug mode</label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button 
              onClick={() => onToggleSettings(id)} 
              className="px-4 py-2 border rounded text-sm hover:bg-gray-100 transition-colors duration-150"
            >
              Cancel
            </button>
            <button 
              onClick={handleSaveChanges}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors duration-150"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
      
      {/* Connect Panel (when not connected) */}
      {showSettings === id && !isConnected && (
        <div className="bg-gray-50 p-6 border-b border-gray-200 animate-fadeIn">
          <h3 className="text-md font-medium mb-4">Connect to {name}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="md:col-span-2 bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 flex items-center">
                <AlertTriangle size={16} className="mr-2 text-blue-600" />
                Connect to your {name} account to import data and set up automated synchronization.
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key
              </label>
              <input 
                type="text" 
                placeholder="Enter your API key" 
                className="border rounded-md py-2 px-3 w-full text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 focus:outline-none"
                value={newApiKey}
                onChange={(e) => setNewApiKey(e.target.value)}
              />
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Secret
              </label>
              <input 
                type="password" 
                placeholder="Enter your API secret" 
                className="border rounded-md py-2 px-3 w-full text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 focus:outline-none"
                value={newApiSecret}
                onChange={(e) => setNewApiSecret(e.target.value)}
              />
            </div>
            
            <div className="md:col-span-2 bg-white p-4 rounded-lg shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Webhook URL (Optional)
              </label>
              <input 
                type="text" 
                placeholder="https://..." 
                className="border rounded-md py-2 px-3 w-full text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 focus:outline-none"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
              <p className="mt-1 text-xs text-gray-500">
                Provide a webhook URL to receive real-time updates from {name}
              </p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button 
              onClick={() => onToggleSettings(id)} 
              className="px-4 py-2 border rounded text-sm hover:bg-gray-100 transition-colors duration-150"
            >
              Cancel
            </button>
            <button 
              onClick={handleConnect}
              className={`px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors duration-150 ${
                !newApiKey || !newApiSecret ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={!newApiKey || !newApiSecret}
            >
              Connect
            </button>
          </div>
        </div>
      )}
    </>
  );
};

interface DataSourceConfig {
  id: string;
  config: any;
}

interface Alert {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  description: string;
  action?: {
    text: string;
    onClick: () => void;
  };
  details?: string;
}

interface DataSourceStatusProps {
  addAlert: (alert: Alert) => void;
}

const DataSourceStatus: React.FC<DataSourceStatusProps> = ({ addAlert }) => {
  const [activeSettings, setActiveSettings] = useState<string | null>(null);
  const [savedConfigs, setSavedConfigs] = useState<DataSourceConfig[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterConnected, setFilterConnected] = useState<boolean | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState(new Date().toLocaleTimeString());
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const toggleSettings = (id: string) => {
    if (activeSettings === id) {
      setActiveSettings(null);
    } else {
      setActiveSettings(id);
    }
  };

  // Handle saving configuration
  const handleConfigSaved = (id: string, config: any) => {
    // Update saved configs
    const existingIndex = savedConfigs.findIndex(item => item.id === id);
    if (existingIndex >= 0) {
      const updatedConfigs = [...savedConfigs];
      updatedConfigs[existingIndex] = { id, config };
      setSavedConfigs(updatedConfigs);
    } else {
      setSavedConfigs([...savedConfigs, { id, config }]);
    }

    // Find data source name
    const source = dataSources.find(source => source.id === id);
    const sourceName = source ? source.name : id;

    // Create alert for this action
    if (source?.isConnected) {
      // Settings saved
      addAlert({
        id: `alert-${id}-${Date.now()}`,
        type: 'info',
        title: `${sourceName} settings updated`,
        description: `Configuration changes for ${sourceName} have been saved.`,
        action: { 
          text: "View", 
          onClick: () => toggleSettings(id) 
        },
        details: `Updated settings include sync frequency (${config.syncFrequency}), data types, and connection options.`
      });
    } else {
      // New connection
      addAlert({
        id: `alert-${id}-${Date.now()}`,
        type: 'success',
        title: `${sourceName} connected successfully`,
        description: `${sourceName} has been connected to your account.`,
        action: { 
          text: "View", 
          onClick: () => toggleSettings(id) 
        },
        details: `Connection established with API key ${config.apiKey?.slice(0, 3)}...${config.apiKey?.slice(-3) || ''}. Initial data sync will begin shortly.`
      });

      // Update the data source to be connected
      dataSources = dataSources.map(source => 
        source.id === id 
          ? { ...source, isConnected: true, syncInfo: "Last synced: Just now" } 
          : source
      );
    }
  };

  // Simulate refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastSyncTime(new Date().toLocaleTimeString());
      setIsRefreshing(false);
      addAlert({
        id: `refresh-${Date.now()}`,
        type: 'info',
        title: "Data sources refreshed",
        description: `All data sources synced at ${new Date().toLocaleTimeString()}`
      });
    }, 1500);
  };
  
  let dataSources = [
    {
      id: 'microsoft365',
      icon: (
        <div className="p-2">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 11V0H0V11H11Z" fill="#F25022"/>
            <path d="M24 11V0H13V11H24Z" fill="#7FBA00"/>
            <path d="M11 24V13H0V24H11Z" fill="#00A4EF"/>
            <path d="M24 24V13H13V24H24Z" fill="#FFB900"/>
          </svg>
        </div>
      ),
      name: "Microsoft 365",
      syncInfo: "Last synced: Today at 9:41 AM",
      isConnected: true
    },
    {
      id: 'googleworkspace',
      icon: (
        <div className="p-2">
          <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" fill="#4285F4"/>
          </svg>
        </div>
      ),
      name: "Google Workspace",
      syncInfo: "Last synced: Today at 10:23 AM",
      isConnected: true
    },
    {
      id: 'slack',
      icon: (
        <div className="p-2">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.07 15.77C9.07 16.88 8.17 17.78 7.06 17.78C5.95 17.78 5.05 16.88 5.05 15.77C5.05 14.66 5.95 13.76 7.06 13.76H9.07V15.77Z" fill="#E01E5A"/>
            <path d="M10.08 15.77C10.08 14.66 10.98 13.76 12.09 13.76C13.2 13.76 14.1 14.66 14.1 15.77V20.79C14.1 21.9 13.2 22.8 12.09 22.8C10.98 22.8 10.08 21.9 10.08 20.79V15.77Z" fill="#E01E5A"/>
            <path d="M12.09 9.05C10.98 9.05 10.08 8.15 10.08 7.04C10.08 5.93 10.98 5.03 12.09 5.03C13.2 5.03 14.1 5.93 14.1 7.04V9.05H12.09Z" fill="#36C5F0"/>
            <path d="M12.09 10.06C13.2 10.06 14.1 10.96 14.1 12.07C14.1 13.18 13.2 14.08 12.09 14.08H7.07C5.96 14.08 5.06 13.18 5.06 12.07C5.06 10.96 5.96 10.06 7.07 10.06H12.09Z" fill="#36C5F0"/>
            <path d="M18.81 12.07C18.81 10.96 19.71 10.06 20.82 10.06C21.93 10.06 22.83 10.96 22.83 12.07C22.83 13.18 21.93 14.08 20.82 14.08H18.81V12.07Z" fill="#2EB67D"/>
            <path d="M17.8 12.07C17.8 13.18 16.9 14.08 15.79 14.08C14.68 14.08 13.78 13.18 13.78 12.07V7.05C13.78 5.94 14.68 5.04 15.79 5.04C16.9 5.04 17.8 5.94 17.8 7.05V12.07Z" fill="#2EB67D"/>
            <path d="M15.79 18.79C16.9 18.79 17.8 19.69 17.8 20.8C17.8 21.91 16.9 22.81 15.79 22.81C14.68 22.81 13.78 21.91 13.78 20.8V18.79H15.79Z" fill="#ECB22E"/>
            <path d="M15.79 17.78C14.68 17.78 13.78 16.88 13.78 15.77C13.78 14.66 14.68 13.76 15.79 13.76H20.81C21.92 13.76 22.82 14.66 22.82 15.77C22.82 16.88 21.92 17.78 20.81 17.78H15.79Z" fill="#ECB22E"/>
          </svg>
        </div>
      ),
      name: "Slack",
      syncInfo: "Last synced: Today at 8:17 AM",
      isConnected: true
    },
    {
      id: 'zoom',
      icon: (
        <div className="p-2 bg-blue-100 rounded-md">
          <svg className="h-5 w-5" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="256" cy="256" r="256" fill="#2D8CFF" />
            <path
              d="M352 228.3v55.4c0 10.6-11.6 17-20.6 11.2l-45.4-27.7v22.8c0 11.1-9 20.1-20.1 20.1H160.1c-11.1 0-20.1-9-20.1-20.1v-76.4c0-11.1 9-20.1 20.1-20.1h106.8c11.1 0 20.1 9 20.1 20.1v22.8l45.4-27.7c9.1-5.6 20.6 0.6 20.6 11.2z"
              fill="#fff"
            />
          </svg>
        </div>
      ),
      name: "Zoom",
      syncInfo: "Last synced: Today at 7:52 AM",
      isConnected: true
    },
    {
      id: 'dropbox',
      icon: (
        <div className="p-2">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.2 1.5L0 6.6L5.1 10.95L12.3 6.15L7.2 1.5Z" fill="#0061FF"/>
            <path d="M0 15.3L7.2 20.4L12.3 15.75L5.1 10.95L0 15.3Z" fill="#0061FF"/>
            <path d="M12.3 15.75L17.4 20.4L24.6 15.3L19.5 10.95L12.3 15.75Z" fill="#0061FF"/>
            <path d="M24.6 6.6L17.4 1.5L12.3 6.15L19.5 10.95L24.6 6.6Z" fill="#0061FF"/>
            <path d="M12.3262 16.7963L7.2 21.4963L5.1 20.0963V21.8963L12.3262 25.4963L19.5 21.8963V20.0963L17.4 21.4963L12.3262 16.7963Z" fill="#0061FF"/>
          </svg>
        </div>
      ),
      name: "Dropbox",
      syncInfo: "Last synced: Today at 6:45 AM",
      isConnected: true
    },
    {
      id: 'asana',
      icon: (
        <div className="p-2">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.3625 0 0 5.3625 0 12C0 18.6375 5.3625 24 12 24C18.6375 24 24 18.6375 24 12C24 5.3625 18.6375 0 12 0Z" fill="#F06A6A"/>
            <path d="M17.4094 12.1406C15.9469 12.1406 14.7656 13.3219 14.7656 14.7844C14.7656 16.2469 15.9469 17.4281 17.4094 17.4281C18.8719 17.4281 20.0531 16.2469 20.0531 14.7844C20.0625 13.3219 18.8719 12.1406 17.4094 12.1406Z" fill="white"/>
            <path d="M6.59062 12.1406C5.12812 12.1406 3.94688 13.3219 3.94688 14.7844C3.94688 16.2469 5.12812 17.4281 6.59062 17.4281C8.05312 17.4281 9.23438 16.2469 9.23438 14.7844C9.23438 13.3219 8.05312 12.1406 6.59062 12.1406Z" fill="white"/>
            <path d="M12 6.5625C10.5375 6.5625 9.35625 7.74375 9.35625 9.20625C9.35625 10.6688 10.5375 11.85 12 11.85C13.4625 11.85 14.6438 10.6688 14.6438 9.20625C14.6438 7.74375 13.4625 6.5625 12 6.5625Z" fill="white"/>
          </svg>
        </div>
      ),
      name: "Asana",
      syncInfo: "Not connected",
      isConnected: false
    },
    {
      id: 'twilio',
      icon: (
        <div className="p-2">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12Z" fill="#F22F46"/>
            <path d="M14.6866 14.6861C14.3268 15.0454 13.7454 15.0454 13.3861 14.6861C13.0268 14.3268 13.0268 13.7454 13.3861 13.3861C13.7454 13.0268 14.3268 13.0268 14.6866 13.3861C15.0454 13.7454 15.0454 14.3268 14.6866 14.6861ZM14.6866 10.6139C14.3268 10.9732 13.7454 10.9732 13.3861 10.6139C13.0268 10.2546 13.0268 9.67324 13.3861 9.31345C13.7454 8.95417 14.3268 8.95417 14.6866 9.31345C15.0454 9.67324 15.0454 10.2546 14.6866 10.6139ZM10.6139 14.6861C10.2546 15.0454 9.67324 15.0454 9.31345 14.6861C8.95417 14.3268 8.95417 13.7454 9.31345 13.3861C9.67324 13.0268 10.2546 13.0268 10.6139 13.3861C10.9732 13.7454 10.9732 14.3268 10.6139 14.6861ZM10.6139 10.6139C10.2546 10.9732 9.67324 10.9732 9.31345 10.6139C8.95417 10.2546 8.95417 9.67324 9.31345 9.31345C9.67324 8.95417 10.2546 8.95417 10.6139 9.31345C10.9732 9.67324 10.9732 10.2546 10.6139 10.6139Z" fill="white"/>
          </svg>
        </div>
      ),
      name: "Twilio",
      syncInfo: "Not connected",
      isConnected: false
    },
    {
      id: 'github',
      icon: (
        <div className="p-2">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37 0 0 5.37 0 12C0 17.31 3.435 21.795 8.205 23.385C8.805 23.49 9.03 23.13 9.03 22.815C9.03 22.53 9.015 21.585 9.015 20.58C6 21.135 5.22 19.845 4.98 19.17C4.845 18.825 4.26 17.76 3.75 17.475C3.33 17.25 2.73 16.695 3.735 16.68C4.68 16.665 5.355 17.55 5.58 17.91C6.66 19.725 8.385 19.215 9.075 18.9C9.18 18.12 9.495 17.595 9.84 17.295C7.17 16.995 4.38 15.96 4.38 11.37C4.38 10.065 4.845 8.985 5.61 8.145C5.49 7.845 5.07 6.615 5.73 4.965C5.73 4.965 6.735 4.65 9.03 6.195C9.99 5.925 11.01 5.79 12.03 5.79C13.05 5.79 14.07 5.925 15.03 6.195C17.325 4.635 18.33 4.965 18.33 4.965C18.99 6.615 18.57 7.845 18.45 8.145C19.215 8.985 19.68 10.05 19.68 11.37C19.68 15.975 16.875 16.995 14.205 17.295C14.64 17.67 15.015 18.39 15.015 19.515C15.015 21.12 15 22.41 15 22.815C15 23.13 15.225 23.505 15.825 23.385C18.2072 22.5807 20.2772 21.0497 21.7437 19.0074C23.2101 16.965 23.9993 14.5143 24 12C24 5.37 18.63 0 12 0Z" fill="#1B1F23"/>
          </svg>
        </div>
      ),
      name: "GitHub",
      syncInfo: "Not connected",
      isConnected: false
    },
  ];

  // Filter data sources
  const filteredDataSources = dataSources.filter(source => {
    // Filter by search term
    const matchesSearch = source.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by connection status
    const matchesConnection = filterConnected === null || 
      (filterConnected === true && source.isConnected) || 
      (filterConnected === false && !source.isConnected);
    
    return matchesSearch && matchesConnection;
  });
  
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900 mb-2 sm:mb-0">Data Source Connections</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Last sync: {lastSyncTime}</span>
            <button 
              onClick={handleRefresh}
              className={`p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`}
              disabled={isRefreshing}
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search data sources..." 
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filter */}
          <div className="sm:w-48">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={16} className="text-gray-400" />
              </div>
              <select 
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 focus:outline-none appearance-none"
                value={filterConnected === null ? 'all' : filterConnected ? 'connected' : 'disconnected'}
                onChange={(e) => {
                  if (e.target.value === 'all') setFilterConnected(null);
                  else if (e.target.value === 'connected') setFilterConnected(true);
                  else setFilterConnected(false);
                }}
              >
                <option value="all">All sources</option>
                <option value="connected">Connected</option>
                <option value="disconnected">Disconnected</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown size={16} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Data Source List with Scrollbar */}
      <div className="max-h-96 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
        {filteredDataSources.length > 0 ? (
          filteredDataSources.map(source => (
            <DataSource 
              key={source.id}
              id={source.id}
              icon={source.icon}
              name={source.name}
              syncInfo={source.syncInfo}
              isConnected={source.isConnected}
              showSettings={activeSettings}
              onToggleSettings={toggleSettings}
              onConfigSaved={handleConfigSaved}
            />
          ))
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-500">No data sources found</p>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {filteredDataSources.filter(s => s.isConnected).length} of {filteredDataSources.length} sources connected
          </span>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors duration-150 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Source
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataSourceStatus;