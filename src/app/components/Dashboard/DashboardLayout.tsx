"use client"

import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardLayoutProps {
  children: ReactNode;
  userName?: string;
  userAvatar?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  userName = 'Admin User',
  userAvatar = '/api/placeholder/32/32'
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header userName={userName} userAvatar={userAvatar} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;