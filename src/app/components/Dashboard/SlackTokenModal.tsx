"use client"

import React from 'react';

interface SlackTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TokenDetailProps {
  label: string;
  value: string;
  isDate?: boolean;
}

const TokenDetail: React.FC<TokenDetailProps> = ({ label, value, isDate }) => {
  return (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
      <span className="text-gray-600">{label}:</span>
      <span className={isDate && value.includes('days') ? 'text-red-600 font-medium' : 'font-medium'}>
        {value}
      </span>
    </div>
  );
};

const SlackTokenModal: React.FC<SlackTokenModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  const handleReauthorize = () => {
    // This would redirect to Slack auth in a real app
    console.log('Reauthorizing Slack token');
    // Then close the modal
    onClose();
  };
  
  const handleRemindLater = () => {
    console.log('Remind later');
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-100 rounded-full p-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          
          <h2 className="text-xl font-bold text-center mb-2">Slack Token Needs Reauthorization</h2>
          <p className="text-gray-600 text-center mb-6">
            Your Slack integration token will expire in 2 days. To ensure uninterrupted data sync, please reauthorize the Glynac application with your Slack workspace.
          </p>
          
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Token Details</h3>
            <div className="space-y-2">
              <TokenDetail label="Workspace" value="acme-corp.slack.com" />
              <TokenDetail label="Created" value="June 12, 2024" />
              <TokenDetail label="Expires" value="March 24, 2025 (2 days)" isDate={true} />
              <TokenDetail label="Scopes" value="channels:read, chat:read, users:read" />
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Reauthorization Steps</h3>
            <ol className="space-y-2 list-decimal list-inside text-gray-700">
              <li>Click the "Reauthorize" button below</li>
              <li>You'll be redirected to Slack's authorization page</li>
              <li>Review the requested permissions and approve</li>
              <li>You'll be returned to Glynac with renewed access</li>
            </ol>
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={handleRemindLater}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Remind Me Later
            </button>
            <button 
              onClick={handleReauthorize}
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Reauthorize Slack
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlackTokenModal;