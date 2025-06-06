"use client"

import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, X } from "lucide-react";

interface ConnectionRequiredTooltipProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * A tooltip that appears when the user tries to proceed without connecting any services.
 * This provides a less intrusive notification compared to the modal.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the tooltip is open
 * @param {Function} props.onClose - Function to call when the tooltip is closed
 * @returns {React.ReactElement | null} - The tooltip component or null if not open
 */
const ConnectionRequiredTooltip: React.FC<ConnectionRequiredTooltipProps> = ({ isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle visibility with animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Auto-close after 5 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isOpen) {
      timer = setTimeout(() => {
        onClose();
      }, 5000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  if (!isVisible) return null;

  return (
    <div 
      ref={tooltipRef}
      className="fixed bottom-4 right-4 bg-white border-2 border-red-400 rounded-lg shadow-lg p-4 max-w-md z-50 animate-in slide-in-from-right duration-300"
    >
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-medium text-red-700 mb-1">Connection Required</h4>
          <p className="text-sm text-gray-700">
            Please connect at least one service before proceeding to the next step.
          </p>
        </div>
        <button 
          onClick={onClose}
          className="ml-2 p-1 rounded-full hover:bg-gray-100"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default ConnectionRequiredTooltip;