"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  userName?: string;
  userAvatar?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  userName = 'Admin User',
  userAvatar = '/api/placeholder/32/32'
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();
  
  // Handle sign out action with loading state
  const handleSignOut = async () => {
    // Set loading state
    setIsSigningOut(true);
    
    try {
      // Here you would typically clear authentication tokens/cookies
      // For example: localStorage.removeItem('token');
      
      // Simulate a longer loading time (2 seconds)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to the global app page
      window.location.href = '/'; // This will redirect to the root of the application
    } catch (error) {
      console.error('Sign out error:', error);
      // Reset loading state if there's an error
      setIsSigningOut(false);
    }
  };
  
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex justify-between items-center">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-blue-600">Glynac</h1>
        <span className="ml-2 text-sm text-gray-500">Admin</span>
      </div>
      
      <div className="relative">
        <button 
          className="flex items-center space-x-2 focus:outline-none"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          disabled={isSigningOut}
        >
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img 
              src={userAvatar}
              alt="User Avatar"
              className="w-full h-full object-cover" 
            />
          </div>
          <span className="text-sm">{userName}</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isDropdownOpen && !isSigningOut && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</a>
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
            <button 
              onClick={handleSignOut}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              disabled={isSigningOut}
            >
              Sign out
            </button>
          </div>
        )}
        
        {/* Show loading indicator when signing out */}
        {isSigningOut && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-3 px-4 z-10 flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm font-medium">Signing out...</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;