import React from 'react';

export type Platform = {
  label: string;
  icon: React.ReactNode;
  description: string;
  connectionKey: string;
  serviceName: string;
};

// Default platform list (would come from backend in real app)
const defaultPlatforms: Platform[] = [
  { label: 'Microsoft 365', icon: null, description: 'Access Microsoft data', connectionKey: 'microsoft365', serviceName: 'microsoft365' },
  { label: 'Google Workspace', icon: null, description: 'Access Google data', connectionKey: 'googleWorkspace', serviceName: 'googleWorkspace' },
  { label: 'Dropbox', icon: null, description: 'Access Dropbox files', connectionKey: 'dropbox', serviceName: 'dropbox' },
  { label: 'Slack', icon: null, description: 'Access Slack messages', connectionKey: 'slack', serviceName: 'slack' },
  { label: 'Zoom', icon: null, description: 'Access Zoom meetings', connectionKey: 'zoom', serviceName: 'zoom' },
  { label: 'Jira', icon: null, description: 'Access Jira issues', connectionKey: 'jira', serviceName: 'jira' },
];

export const connectionService = {
  async getPlatforms(): Promise<Platform[]> {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('platformOrder');
      if (saved) {
        const order: string[] = JSON.parse(saved);
        return order
          .map((key) => defaultPlatforms.find((p) => p.connectionKey === key))
          .filter(Boolean) as Platform[];
      }
    }
    return defaultPlatforms;
  },

  async savePlatformOrder(order: string[]): Promise<Platform[]> {
    if (typeof window !== 'undefined') {
      localStorage.setItem('platformOrder', JSON.stringify(order));
    }
    return order
      .map((key) => defaultPlatforms.find((p) => p.connectionKey === key))
      .filter(Boolean) as Platform[];
  },
};

