"use client"

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  Bell, ChevronDown, ChevronUp, X, Check, Filter, Clock, Eye, 
  ExternalLink, AlertTriangle, AlertCircle, Info, CheckCircle,
  Search, MoreHorizontal, ArrowUp, ArrowDown, Trash2, Settings,
  Calendar, Pin, PinOff, RefreshCw, SaveIcon, Inbox, Star
} from 'lucide-react';

// Enhanced typings
export type AlertType = 'warning' | 'error' | 'info' | 'success';
export type AlertStatus = 'active' | 'resolved' | 'acknowledged';
export type ServiceType = 
  | 'microsoft365' 
  | 'googleworkspace' 
  | 'slack' 
  | 'zoom' 
  | 'dropbox' 
  | 'storage' 
  | 'asana' 
  | 'twilio' 
  | 'github'
  | 'aws'
  | 'azure'
  | 'gcp'
  | 'salesforce'
  | 'jira'
  | 'database'
  | 'network'
  | 'security'
  | 'monitoring'
  | 'custom';

export type Priority = 'critical' | 'high' | 'medium' | 'low';

export type ActionType = 'resolve' | 'acknowledge' | 'escalate' | 'investigate' | 'view' | 'custom';

export interface AlertAction {
  text: string;
  onClick: () => void;
  type?: ActionType;
  icon?: React.ReactNode;
  disabled?: boolean;
  confirmationRequired?: boolean;
  confirmationText?: string;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
}

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  actions: AlertAction[];
  details?: string;
  timestamp?: string;
  timestampDate?: Date;
  service?: ServiceType;
  isRead?: boolean;
  isPinned?: boolean;
  priority?: Priority;
  status?: AlertStatus;
  source?: string;
  category?: string;
  tags?: string[];
  assignedTo?: User;
  createdBy?: User;
  relatedAlerts?: string[];
  relatedResources?: string[];
  affectedUsers?: number;
  metadata?: Record<string, any>;
}

interface AlertTheme {
  colors: {
    warning: {
      text: string;
      bg: string;
      border: string;
      hover: string;
    };
    error: {
      text: string;
      bg: string;
      border: string;
      hover: string;
    };
    info: {
      text: string;
      bg: string;
      border: string;
      hover: string;
    };
    success: {
      text: string;
      bg: string;
      border: string;
      hover: string;
    };
  };
  animations: {
    transition: string;
    expand: string;
    fadeIn: string;
    pulse: string;
  };
}

// Define enhanced theme with better contrast
const defaultTheme: AlertTheme = {
  colors: {
    warning: {
      text: 'text-amber-800',
      bg: 'bg-amber-100',
      border: 'border-l-amber-600',
      hover: 'hover:bg-amber-200',
    },
    error: {
      text: 'text-red-800',
      bg: 'bg-red-100',
      border: 'border-l-red-600',
      hover: 'hover:bg-red-200',
    },
    info: {
      text: 'text-blue-800',
      bg: 'bg-blue-100',
      border: 'border-l-blue-600',
      hover: 'hover:bg-blue-200',
    },
    success: {
      text: 'text-green-800',
      bg: 'bg-green-100',
      border: 'border-l-green-600',
      hover: 'hover:bg-green-200',
    },
  },
  animations: {
    transition: 'transition-all duration-300 ease-in-out',
    expand: 'animate-expand',
    fadeIn: 'animate-fadeIn',
    pulse: 'animate-pulse',
  },
};

// Dark theme variant with enhanced contrast
const darkTheme: AlertTheme = {
  colors: {
    warning: {
      text: 'text-amber-300',
      bg: 'bg-amber-900/50',
      border: 'border-l-amber-500',
      hover: 'hover:bg-amber-900/70',
    },
    error: {
      text: 'text-red-300',
      bg: 'bg-red-900/50',
      border: 'border-l-red-500',
      hover: 'hover:bg-red-900/70',
    },
    info: {
      text: 'text-blue-300',
      bg: 'bg-blue-900/50',
      border: 'border-l-blue-500',
      hover: 'hover:bg-blue-900/70',
    },
    success: {
      text: 'text-green-300',
      bg: 'bg-green-900/50',
      border: 'border-l-green-500',
      hover: 'hover:bg-green-900/70',
    },
  },
  animations: {
    transition: 'transition-all duration-300 ease-in-out',
    expand: 'animate-expand',
    fadeIn: 'animate-fadeIn',
    pulse: 'animate-pulse',
  },
};

// UI Configuration
interface UIConfig {
  compactMode: boolean;
  showStatusIndicators: boolean;
  showTimestamps: boolean;
  showServiceIcons: boolean;
  enableAnimations: boolean;
  enableHoverEffects: boolean;
  maxHeight: string;
  rowSpacing: 'tight' | 'normal' | 'relaxed';
  borderRadius: string;
  theme: 'light' | 'dark' | 'system';
}

const defaultUIConfig: UIConfig = {
  compactMode: false,
  showStatusIndicators: true,
  showTimestamps: true,
  showServiceIcons: true,
  enableAnimations: true,
  enableHoverEffects: true,
  maxHeight: '32rem',
  rowSpacing: 'normal',
  borderRadius: 'rounded-lg',
  theme: 'light',
};

// Helper Functions for Date/Time
const formatTimeAgo = (date: Date, currentTime: Date): string => {
  if (!date) return '';
  
  const seconds = Math.floor((currentTime.getTime() - date.getTime()) / 1000);
  
  if (seconds < 5) return "Just now";
  if (seconds < 60) return `${seconds} seconds ago`;
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;
  
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
  
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;
  
  const years = Math.floor(days / 365);
  return `${years} year${years !== 1 ? 's' : ''} ago`;
};

// Format to local date & time
const formatLocalDateTime = (date: Date): string => {
  if (!date) return '';
  
  try {
    return new Intl.DateTimeFormat(navigator.language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch (error) {
    return date.toLocaleString();
  }
};

interface AlertItemProps {
  alert: Alert;
  expandedId: string | null;
  onToggleExpand: (id: string) => void;
  onDismiss: (id: string) => void;
  onMarkAsRead: (id: string) => void;
  onTogglePin: (id: string) => void;
  onAssign: (id: string, userId?: string) => void;
  showTimeAgo: boolean;
  currentTime: Date;
  theme: AlertTheme;
  config: UIConfig;
  isSelected: boolean;
  onSelect: (id: string, multiSelect?: boolean) => void;
  tabIndex: number;
}

const AlertItem: React.FC<AlertItemProps> = ({ 
  alert, 
  expandedId, 
  onToggleExpand,
  onDismiss,
  onMarkAsRead,
  onTogglePin,
  onAssign,
  showTimeAgo,
  currentTime,
  theme,
  config,
  isSelected,
  onSelect,
  tabIndex
}) => {
  const alertRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Get theme colors based on alert type
  const getThemeColors = () => {
    switch (alert.type) {
      case 'warning': return theme.colors.warning;
      case 'error': return theme.colors.error;
      case 'info': return theme.colors.info;
      case 'success': return theme.colors.success;
      default: return theme.colors.info;
    }
  };
  
  const { text: iconColor, bg: iconBg, border: borderColor, hover: hoverColor } = getThemeColors();
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Keyboard navigation handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
        onToggleExpand(alert.id);
        break;
      case 'Delete':
        onDismiss(alert.id);
        break;
      case 'r':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          onMarkAsRead(alert.id);
        }
        break;
      case 'p':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          onTogglePin(alert.id);
        }
        break;
      case 'm':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          setMenuOpen(!menuOpen);
        }
        break;
    }
  };
  
  // Service Icons with enhanced SVG rendering
  const renderServiceIcon = () => {
    if (!alert.service || !config.showServiceIcons) {
      // Default type icons if no service specified
      switch (alert.type) {
        case 'warning':
          return <AlertTriangle className={`h-5 w-5 ${iconColor}`} />;
        case 'error':
          return <AlertCircle className={`h-5 w-5 ${iconColor}`} />;
        case 'info':
          return <Info className={`h-5 w-5 ${iconColor}`} />;
        case 'success':
          return <CheckCircle className={`h-5 w-5 ${iconColor}`} />;
      }
    }

    switch (alert.service) {
      case 'microsoft365':
        return (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 11V0H0V11H11Z" fill="#F25022"/>
            <path d="M24 11V0H13V11H24Z" fill="#7FBA00"/>
            <path d="M11 24V13H0V24H11Z" fill="#00A4EF"/>
            <path d="M24 24V13H13V24H24Z" fill="#FFB900"/>
          </svg>
        );
      case 'googleworkspace':
        return (
          <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" fill="#4285F4"/>
          </svg>
        );
      case 'slack':
        return (
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
        );
      case 'zoom':
        return (
          <svg className="h-5 w-5" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="256" cy="256" r="256" fill="#2D8CFF" />
            <path
              d="M352 228.3v55.4c0 10.6-11.6 17-20.6 11.2l-45.4-27.7v22.8c0 11.1-9 20.1-20.1 20.1H160.1c-11.1 0-20.1-9-20.1-20.1v-76.4c0-11.1 9-20.1 20.1-20.1h106.8c11.1 0 20.1 9 20.1 20.1v22.8l45.4-27.7c9.1-5.6 20.6 0.6 20.6 11.2z"
              fill="#fff"
            />
          </svg>
        );
      case 'dropbox':
        return (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.2 1.5L0 6.6L5.1 10.95L12.3 6.15L7.2 1.5Z" fill="#0061FF"/>
            <path d="M0 15.3L7.2 20.4L12.3 15.75L5.1 10.95L0 15.3Z" fill="#0061FF"/>
            <path d="M12.3 15.75L17.4 20.4L24.6 15.3L19.5 10.95L12.3 15.75Z" fill="#0061FF"/>
            <path d="M24.6 6.6L17.4 1.5L12.3 6.15L19.5 10.95L24.6 6.6Z" fill="#0061FF"/>
            <path d="M12.3262 16.7963L7.2 21.4963L5.1 20.0963V21.8963L12.3262 25.4963L19.5 21.8963V20.0963L17.4 21.4963L12.3262 16.7963Z" fill="#0061FF"/>
          </svg>
        );
      case 'aws':
        return (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.763 10.849c0 .302.035.545.093.731.07.174.151.372.267.57.04.070.058.14.058.186 0 .081-.046.163-.174.244l-.581.384c-.082.058-.163.082-.232.082-.093 0-.186-.046-.279-.151-.128-.163-.244-.337-.349-.511-.105-.198-.21-.418-.337-.69-.849 1-.918 1.512-2.019 1.512-1.022 0-1.674-.628-1.674-1.883 0-.942.337-1.674 1.012-2.182.512-.418 1.232-.628 2.087-.628.29 0 .59.024.906.059.058 0 .313.035.662.058v-.418c0-.872-.186-1.489-.546-1.8-.372-.314-.99-.465-1.79-.465-.244 0-.498.024-.763.07-.267.059-.523.128-.788.221-.128.046-.221.07-.267.082a.475.475 0 0 1-.128.023c-.116 0-.174-.081-.174-.244v-.384c0-.128.017-.221.07-.279.046-.058.128-.116.244-.174.302-.163.663-.3 1.081-.406.418-.105.859-.163 1.325-.163 1.011 0 1.755.232 2.25.695.488.464.732 1.162.732 2.111v2.784h.012zm-2.798 1.302c.279 0 .569-.052.893-.151.325-.105.616-.291.859-.534.14-.163.244-.348.302-.57.058-.221.093-.488.093-.8v-.384c-.244-.035-.5-.058-.754-.07a6.033 6.033 0 0 0-.73-.035c-.522 0-.906.104-1.162.313-.255.21-.383.512-.383.918 0 .395.105.686.313.871.203.209.488.302.872.302zm6.684.93c-.15 0-.256-.026-.325-.093-.07-.058-.128-.186-.174-.372L8.06 6.078c-.047-.197-.07-.325-.07-.407 0-.158.07-.244.222-.244h.906c.174 0 .29.029.348.093.07.058.128.186.175.372l.895 3.513.824-3.513c.04-.197.094-.314.163-.372.07-.058.198-.093.36-.093h.731c.174 0 .29.029.36.093.07.058.128.186.162.372l.836 3.548.918-3.548c.047-.197.105-.314.175-.372.07-.058.186-.093.36-.093h.859c.151 0 .244.082.244.244 0 .046-.01.093-.17.151-.12.058-.24.128-.48.256l-1.93 6.539c-.47.196-.94.313-.174.372-.7.058-.186.093-.337.093h-.788c-.174 0-.29-.026-.358-.093-.07-.058-.128-.186-.163-.372l-.824-3.42-.812 3.409c-.042.197-.092.314-.163.372-.07.058-.186.093-.36.093h-.789zm9.079.232c-.372 0-.743-.046-1.093-.128a3.283 3.283 0 0 1-.824-.29c-.116-.058-.198-.128-.232-.186a.475.475 0 0 1-.046-.186v-.395c0-.163.058-.244.175-.244.046 0 .092.011.139.023.046.012.116.047.198.082a4.47 4.47 0 0 0 .73.244c.268.058.534.093.8.093.424 0 .754-.07.977-.221.222-.151.337-.371.337-.662 0-.198-.058-.36-.175-.488-.116-.128-.337-.244-.662-.372l-.952-.3c-.488-.151-.848-.371-1.069-.662-.22-.302-.325-.626-.325-1 0-.29.58-.557.175-.79.116-.232.279-.441.488-.605.21-.163.454-.29.73-.383a3.3 3.3 0 0 1 .907-.128c.162 0 .325.012.476.035a4.46 4.46 0 0 1 .43.094c.128.035.244.07.348.116.104.047.186.094.233.128.076.058.128.116.162.186.035.7.058.151.058.256v.36c0 .162-.058.244-.174.244a.905.905 0 0 1-.314-.093 3.274 3.274 0 0 0-1.011-.185c-.383 0-.685.058-.884.186-.198.128-.302.325-.302.593 0 .197.066.36.186.49.13.13.36.255.7.371l.93.29c.477.153.824.36 1.034.628.21.267.314.57.314.94 0 .3-.58.57-.174.824a1.8 1.8 0 0 1-.5.662c-.22.186-.48.325-.788.43-.313.105-.66.152-1.023.152z" fill="#F90"/>
            <path d="M21.102 17.509c-2.52 1.861-6.177 2.844-9.312 2.844-4.406 0-8.371-1.628-11.367-4.332-.233-.21-.023-.5.256-.337 3.188 1.86 7.13 2.97 11.215 2.97 2.753 0 5.773-.57 8.557-1.755.418-.174.767.279.35.61zm1.057-1.209c-.325-.418-2.136-.198-2.949-.093-.244.035-.29-.186-.07-.348 1.453-1.023 3.826-.73 4.104-.384.279.348-.07 2.74-1.441 3.886-.21.175-.407.082-.314-.151.302-.754.988-2.484.67-2.91z" fill="#F90"/>
          </svg>
        );
      case 'azure':
        return (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.2125 4.76875L9.13125 9.76875L4.35 17.25H11.6625L13.2125 4.76875Z" fill="#0072C6"/>
            <path d="M13.2125 4.76875L17.1375 9.76875L20.0625 17.25H11.6625L13.2125 4.76875Z" fill="#0072C6"/>
            <path d="M4.35 17.25L9.13125 9.76875L17.1375 9.76875L20.0625 17.25H4.35Z" fill="#0072C6"/>
          </svg>
        );
      case 'gcp':
        return (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.7784 5.12938L15.2222 5.57264L8.95071 11.8444L6.06177 8.95531L6.50507 8.51206L8.95071 10.9579L14.7784 5.12938Z" fill="#EA4335"/>
            <path d="M16.7675 6.95592L17.2121 7.40037L14.3228 10.2903L14.7672 10.7349L17.2121 8.289L17.6565 8.73345L14.7675 11.6227L13.4342 10.2892L16.7675 6.95592Z" fill="#FBBC05"/>
            <path d="M18.8448 12.0004C18.8448 15.782 15.7818 18.8449 12.0002 18.8449C8.21852 18.8449 5.15564 15.782 5.15564 12.0004C5.15564 8.21874 8.21852 5.15586 12.0002 5.15586C12.4447 5.15586 12.8789 5.20014 13.3022 5.27722L9.51282 9.06682L6.62393 6.17793L6.18073 6.62123L9.51282 9.95327L5.5999 13.8659C5.30758 13.2766 5.15564 12.6545 5.15564 12.0004C5.15564 11.346 5.30763 10.7239 5.6 10.1342L5.27697 9.81116C4.9265 10.4732 4.71118 11.2066 4.71118 12.0004C4.71118 16.0284 8.05456 19.2894 12.0002 19.2894C15.9458 19.2894 19.2893 16.0284 19.2893 12.0004H18.8448Z" fill="#4285F4"/>
            <path d="M19.2893 12.0004C19.2893 11.2066 19.0738 10.4731 18.7233 9.81104L14.7675 13.7665L14.323 13.3223L18.7233 8.92216C18.3728 8.26006 17.8911 7.67866 17.3286 7.20605L17.1016 7.48309C17.6193 7.9115 18.0607 8.44504 18.4 9.0663L13.878 13.5889L12.9888 12.6996L16.3231 9.36502L15.8786 8.92057L12.5445 12.2551L12.0999 11.8106L15.4341 8.4765L14.9896 8.03205L11.2 11.8223L12.5333 13.1558L18.4 7.2896C17.4117 5.92667 15.9011 5.15586 14.2227 5.15586C13.4849 5.15586 12.7788 5.31054 12.1336 5.60023L12.3606 5.87726C12.9339 5.6231 13.5561 5.48428 14.2227 5.48428C15.7677 5.48428 17.1471 6.17788 18.0665 7.40037L12.9891 12.4776L14.3228 13.8111L18.7235 9.41036C19.016 10.0001 19.2893 10.622 19.2893 12.0004Z" fill="#34A853"/>
          </svg>
        );
      case 'jira':
        return (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.571 0H0V11.571H3.857V3.857H11.571V0Z" fill="#2684FF"/>
            <path d="M7.714 3.857H19.286V15.429H15.429V7.714H7.714V3.857Z" fill="#2684FF"/>
            <path d="M4.714 7.714H16.286V19.286H12.429V11.571H4.714V7.714Z" fill="#2684FF"/>
            <path d="M8.571 11.571H20.143V23.143H0V11.571L8.571 20.143V11.571Z" fill="#2684FF"/>
          </svg>
        );
      case 'salesforce':
        return (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.1011 7.1981C13.7529 6.69087 14.5595 6.42857 15.4286 6.42857C16.9978 6.42857 18.3391 7.42639 18.8286 8.82857C19.4179 8.58245 20.0647 8.42857 20.7429 8.42857C23.0954 8.42857 25 10.3331 25 12.6857C25 15.0382 23.0954 16.9428 20.7429 16.9428C20.477 16.9428 20.2249 16.9147 19.9714 16.8762C19.5251 18.1161 18.3475 19 17 19C16.4022 19 15.8364 18.8424 15.3429 18.5619C14.8494 20.0389 13.4431 21.1143 11.8 21.1143C10.1569 21.1143 8.75343 20.0389 8.25714 18.5619C7.76364 18.8424 7.19777 19 6.6 19C4.61766 19 3 17.3824 3 15.4C3 14.2877 3.51373 13.2932 4.32 12.6674C3.71604 12.0249 3.34286 11.1783 3.34286 10.2571C3.34286 8.17464 5.0318 6.48571 7.11429 6.48571C8.39547 6.48571 9.54161 7.07139 10.28 8.00571C10.8303 6.72729 12.0686 5.82857 13.5 5.82857C13.7213 5.82857 13.9202 5.86232 14.1143 5.9032C13.4621 6.58521 13.0857 7.49365 13.0857 8.48571C13.0857 8.74394 13.1188 8.99264 13.1714 9.23057C12.5798 9.68622 12.1543 10.3394 11.9829 11.0857C11.9025 11.072 11.8213 11.0571 11.7429 11.0571C10.2221 11.0571 9 12.2793 9 13.8C9 15.3207 10.2221 16.5428 11.7429 16.5428C13.2636 16.5428 14.4857 15.3207 14.4857 13.8C14.4857 12.282 13.2696 11.0621 11.7524 11.0571C11.9238 10.3109 12.3525 9.66088 12.9429 9.21143C13.0172 10.2886 13.5044 11.2469 14.2829 11.9143C14.348 12.1962 14.4857 12.4585 14.6857 12.6857C15.1429 13.2 15.9238 13.4113 16.5429 13.1429C16.7952 13.0336 17 12.7952 17 12.5143C17 12.3865 16.9534 12.2691 16.8857 12.18C16.6667 11.88 16.3143 11.7429 15.9714 11.7429C15.7071 11.7429 15.48 11.6 15.48 11.3143C15.48 11.0286 15.7238 10.8857 15.9714 10.8857C17.064 10.8857 17.9626 11.7741 17.9771 12.8629C18.3018 12.6975 18.5714 12.4502 18.7771 12.1429C18.814 12.5771 18.7543 13.0235 18.5429 13.4286C18.2667 13.9429 17.8095 14.2857 17.2572 14.4572C17.1058 15.9878 15.8223 17.1714 14.2857 17.1714C12.7136 17.1714 11.4286 15.8864 11.4286 14.3143C11.4286 12.7422 12.7136 11.4571 14.2857 11.4571C14.7578 11.4571 15.2114 11.5867 15.5429 11.8C15.526 11.7819 15.5122 11.76 15.4857 11.7429C15.0286 11.3143 14.7714 10.6857 14.7714 10.0286C14.7714 8.71279 15.8426 7.6421 17.1582 7.64571C16.7143 8.19036 16.4571 8.87776 16.4571 9.62857C16.4571 11.362 17.8691 12.7714 19.6 12.7714C21.3336 12.7714 22.7429 11.362 22.7429 9.62857C22.7429 7.89511 21.3309 6.48571 19.6 6.48571C18.2396 6.48571 17.0622 7.32953 16.624 8.52229C16.3123 7.68584 15.4708 7.08571 14.4857 7.08571C13.9333 7.08571 13.4191 7.25371 13.0036 7.53714C13.0308 7.75868 13.0857 7.97124 13.0857 8.2C13.0857 8.43371 13.0648 8.66242 13.0143 8.88571C13.0367 8.88571 13.0632 8.9 13.0857 8.9C14.8028 8.9 16.2 10.2972 16.2 12.0143C16.2 13.7313 14.8028 15.1286 13.0857 15.1286C11.3687 15.1286 9.97143 13.7313 9.97143 12.0143C9.97143 10.304 11.3584 8.90911 13.068 8.9C13.0228 8.66667 13 8.42367 13 8.17143C13 7.83394 13.0367 7.50748 13.1011 7.1981Z" fill="#00A1E0"/>
          </svg>
        );
      case 'security':
        return (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 11.99H19C18.47 16.11 15.72 19.78 12 20.93V12H5V6.3L12 3.19V11.99Z" fill={iconColor.replace('text-', '')}/>
          </svg>
        );
      case 'storage':
        return (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm14 1a1 1 0 11-2 0 1 1 0 012 0zM2 13a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2zm14 1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" className={iconColor} />
          </svg>
        );
      case 'database':
        return (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 4.91 2 8.5V17.5C2 21.09 6.48 24 12 24C17.52 24 22 21.09 22 17.5V8.5C22 4.91 17.52 2 12 2ZM12 5.25C15.97 5.25 19 6.88 19 8.5C19 10.12 15.97 11.75 12 11.75C8.03 11.75 5 10.12 5 8.5C5 6.88 8.03 5.25 12 5.25ZM12 20.75C8.03 20.75 5 19.12 5 17.5V13.63C6.95 15.02 9.62 15.75 12 15.75C14.38 15.75 17.05 15.02 19 13.63V17.5C19 19.12 15.97 20.75 12 20.75Z" className={iconColor}/>
          </svg>
        );
      case 'network':
        return (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM6.5 17.5L14.01 14.01L17.5 6.5L9.99 9.99L6.5 17.5ZM12 10.9C12.61 10.9 13.1 11.39 13.1 12C13.1 12.61 12.61 13.1 12 13.1C11.39 13.1 10.9 12.61 10.9 12C10.9 11.39 11.39 10.9 12 10.9Z" className={iconColor}/>
          </svg>
        );
      case 'monitoring':
        return (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM7 10H9V17H7V10ZM11 7H13V17H11V7ZM15 13H17V17H15V13Z" className={iconColor}/>
          </svg>
        );
      case 'github':
        return (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.374 0 0 5.373 0 12C0 17.302 3.438 21.8 8.207 23.387C8.806 23.498 9 23.126 9 22.81V20.576C5.662 21.302 4.967 19.16 4.967 19.16C4.421 17.773 3.634 17.404 3.634 17.404C2.545 16.659 3.717 16.675 3.717 16.675C4.922 16.759 5.556 17.912 5.556 17.912C6.626 19.746 8.363 19.216 9.048 18.909C9.155 18.134 9.466 17.604 9.81 17.305C7.145 17 4.343 15.971 4.343 11.374C4.343 10.063 4.812 8.993 5.579 8.153C5.455 7.85 5.044 6.629 5.696 4.977C5.696 4.977 6.704 4.655 8.997 6.207C9.954 5.941 10.98 5.808 12 5.803C13.02 5.808 14.047 5.941 15.006 6.207C17.297 4.655 18.303 4.977 18.303 4.977C18.956 6.63 18.545 7.851 18.421 8.153C19.191 8.993 19.656 10.064 19.656 11.374C19.656 15.983 16.849 16.998 14.177 17.295C14.607 17.667 15 18.397 15 19.517V22.81C15 23.129 15.192 23.504 15.801 23.386C20.566 21.797 24 17.3 24 12C24 5.373 18.627 0 12 0Z" fill="#1B1F23"/>
          </svg>
        );
      case 'twilio':
        return (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12Z" fill="#F22F46"/>
            <path d="M14.6866 14.6861C14.3268 15.0454 13.7454 15.0454 13.3861 14.6861C13.0268 14.3268 13.0268 13.7454 13.3861 13.3861C13.7454 13.0268 14.3268 13.0268 14.6866 13.3861C15.0454 13.7454 15.0454 14.3268 14.6866 14.6861ZM14.6866 10.6139C14.3268 10.9732 13.7454 10.9732 13.3861 10.6139C13.0268 10.2546 13.0268 9.67324 13.3861 9.31345C13.7454 8.95417 14.3268 8.95417 14.6866 9.31345C15.0454 9.67324 15.0454 10.2546 14.6866 10.6139ZM10.6139 14.6861C10.2546 15.0454 9.67324 15.0454 9.31345 14.6861C8.95417 14.3268 8.95417 13.7454 9.31345 13.3861C9.67324 13.0268 10.2546 13.0268 10.6139 13.3861C10.9732 13.7454 10.9732 14.3268 10.6139 14.6861ZM10.6139 10.6139C10.2546 10.9732 9.67324 10.9732 9.31345 10.6139C8.95417 10.2546 8.95417 9.67324 9.31345 9.31345C9.67324 8.95417 10.2546 8.95417 10.6139 9.31345C10.9732 9.67324 10.9732 10.2546 10.6139 10.6139Z" fill="white"/>
          </svg>
        );
      case 'asana':
        return (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.3625 0 0 5.3625 0 12C0 18.6375 5.3625 24 12 24C18.6375 24 24 18.6375 24 12C24 5.3625 18.6375 0 12 0Z" fill="#F06A6A"/>
            <path d="M17.4094 12.1406C15.9469 12.1406 14.7656 13.3219 14.7656 14.7844C14.7656 16.2469 15.9469 17.4281 17.4094 17.4281C18.8719 17.4281 20.0531 16.2469 20.0531 14.7844C20.0625 13.3219 18.8719 12.1406 17.4094 12.1406Z" fill="white"/>
            <path d="M6.59062 12.1406C5.12812 12.1406 3.94688 13.3219 3.94688 14.7844C3.94688 16.2469 5.12812 17.4281 6.59062 17.4281C8.05312 17.4281 9.23438 16.2469 9.23438 14.7844C9.23438 13.3219 8.05312 12.1406 6.59062 12.1406Z" fill="white"/>
            <path d="M12 6.5625C10.5375 6.5625 9.35625 7.74375 9.35625 9.20625C9.35625 10.6688 10.5375 11.85 12 11.85C13.4625 11.85 14.6438 10.6688 14.6438 9.20625C14.6438 7.74375 13.4625 6.5625 12 6.5625Z" fill="white"/>
          </svg>
        );
      case 'custom':
        return (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" className={iconColor}/>
            <path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" className={iconColor}/>
          </svg>
        );
      default:
        // Default alert type icon as fallback
        return (
          <svg className={`h-5 w-5 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  // Helper function to get Priority badge
  const renderPriorityBadge = () => {
    if (!alert.priority) return null;
    
    let bgColor;
    let textColor;
    
    switch (alert.priority) {
      case 'critical':
        bgColor = 'bg-red-200 dark:bg-red-900/50';
        textColor = 'text-red-900 dark:text-red-200';
        break;
      case 'high':
        bgColor = 'bg-orange-200 dark:bg-orange-900/50';
        textColor = 'text-orange-900 dark:text-orange-200';
        break;
      case 'medium':
        bgColor = 'bg-amber-200 dark:bg-amber-900/50';
        textColor = 'text-amber-900 dark:text-amber-200';
        break;
      case 'low':
        bgColor = 'bg-green-200 dark:bg-green-900/50';
        textColor = 'text-green-900 dark:text-green-200';
        break;
      default:
        bgColor = 'bg-gray-200 dark:bg-gray-800';
        textColor = 'text-gray-900 dark:text-gray-200';
    }
    
    return (
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${bgColor} ${textColor}`}>
        {alert.priority.charAt(0).toUpperCase() + alert.priority.slice(1)}
      </span>
    );
  };
  
  // Format timestamp
  const timestampDate = alert.timestampDate || new Date();
  const formattedTime = showTimeAgo ? formatTimeAgo(timestampDate, currentTime) : formatLocalDateTime(timestampDate);
  
  // Set spacing based on config
  const getRowSpacing = () => {
    switch (config.rowSpacing) {
      case 'tight': return 'py-2 px-3';
      case 'relaxed': return 'py-6 px-5';
      default: return 'py-4 px-4';
    }
  };
  
  const rowSpacing = getRowSpacing();
  const isExpanded = expandedId === alert.id;
  
  // Determine if we need to show service tags
  const hasCategory = alert.category && alert.category.trim().length > 0;
  const hasTags = alert.tags && alert.tags.length > 0;

  // Action on confirmation modal state
  const [confirmAction, setConfirmAction] = useState<{
    action: AlertAction | null;
    isOpen: boolean;
  }>({
    action: null,
    isOpen: false
  });
  
  return (
    <div 
      ref={alertRef}
      className={`border-b border-gray-300 dark:border-gray-600 last:border-b-0 ${
        theme.animations.transition
      } ${
        config.enableHoverEffects ? hoverColor : ''
      } ${
        !alert.isRead ? 'bg-gray-50 dark:bg-gray-800/70' : 'bg-white dark:bg-gray-800'
      } border-l-4 ${borderColor} ${
        isSelected ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
      }`}
      onClick={(e) => {
        // If user clicks on the row but not on buttons, select it
        if ((e.target as HTMLElement).tagName !== 'BUTTON' &&
            !((e.target as HTMLElement).closest('button'))) {
          onSelect(alert.id, e.ctrlKey || e.metaKey);
        }
      }}
      tabIndex={tabIndex}
      onKeyDown={handleKeyDown}
      aria-expanded={isExpanded}
      data-alert-id={alert.id}
    >
      <div className={`flex items-start justify-between ${rowSpacing} ${config.compactMode ? 'items-center' : ''}`}>
        <div className="flex items-start flex-1">
          {/* Indicator and Icon */}
          <div className={`${iconBg} rounded-full p-2 mr-4 flex-shrink-0 ${config.compactMode ? 'h-8 w-8 flex items-center justify-center' : ''}`}>
            {renderServiceIcon()}
            {alert.isPinned && (
              <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full h-3 w-3 border border-white dark:border-gray-800"></div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className={`font-semibold text-gray-900 dark:text-white ${config.compactMode ? 'text-sm' : ''}`}>
                {alert.title}
              </h3>
              
              {/* Status Indicators */}
              {config.showStatusIndicators && (
                <>
                  {!alert.isRead && (
                    <span className="bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 text-xs font-semibold px-2 py-0.5 rounded-full">
                      New
                    </span>
                  )}
                  
                  {renderPriorityBadge()}
                  
                  {alert.status && alert.status !== 'active' && (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      alert.status === 'resolved' 
                        ? 'bg-green-200 dark:bg-green-900/50 text-green-900 dark:text-green-200' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200'
                    }`}>
                      {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                    </span>
                  )}
                </>
              )}
            </div>
            
            <div className="flex justify-between items-start gap-4">
              <p className={`text-gray-800 dark:text-gray-200 pr-4 ${config.compactMode ? 'text-xs line-clamp-1' : 'text-sm'}`}>
                {alert.description}
              </p>
              
              {/* Time indicator */}
              {alert.timestamp && config.showTimestamps && (
                <div className="flex items-center text-xs text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  <Clock className="h-3 w-3 mr-1" />
                  {formattedTime}
                </div>
              )}
            </div>
            
            {/* Category and tags */}
            {(hasCategory || hasTags) && (
              <div className="mt-1 flex flex-wrap gap-1">
                {hasCategory && (
                  <span className="inline-flex items-center rounded-md bg-gray-200 dark:bg-gray-700 px-2 py-0.5 text-xs font-medium text-gray-900 dark:text-gray-100">
                    {alert.category}
                  </span>
                )}
                
                {hasTags && alert.tags?.map((tag, index) => (
                  <span 
                    key={`${alert.id}-tag-${index}`}
                    className="inline-flex items-center rounded-md bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 text-xs font-medium text-blue-800 dark:text-blue-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            {/* Details toggle */}
            {alert.details && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpand(alert.id);
                }}
                className={`text-xs text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-200 mt-1 flex items-center ${theme.animations.transition}`}
                aria-expanded={isExpanded}
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-3 w-3 mr-1" />
                    Hide details
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3 mr-1" />
                    View details
                  </>
                )}
              </button>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-1 ml-2 shrink-0">
          {alert.isPinned && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin(alert.id);
              }}
              className="p-1.5 text-amber-600 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-200 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/40"
              title="Unpin alert"
            >
              <Pin className="h-4 w-4" />
            </button>
          )}
          
          {!alert.isPinned && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin(alert.id);
              }}
              className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-300 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/40"
              title="Pin alert"
            >
              <PinOff className="h-4 w-4" />
            </button>
          )}
        
          {!alert.isRead && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead(alert.id);
              }}
              className="p-1.5 text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/40"
              title="Mark as read"
            >
              <Eye className="h-4 w-4" />
            </button>
          )}
          
          {/* Primary action button */}
          {alert.actions.length > 0 && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (alert.actions[0].confirmationRequired) {
                  setConfirmAction({ action: alert.actions[0], isOpen: true });
                } else {
                  alert.actions[0].onClick();
                }
              }}
              disabled={alert.actions[0].disabled}
              className={`px-3 py-1 text-sm font-medium rounded flex items-center ${
                alert.type === 'error' 
                  ? 'bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-100 hover:bg-red-300 dark:hover:bg-red-700' 
                : alert.type === 'warning' 
                  ? 'bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 hover:bg-amber-300 dark:hover:bg-amber-700' 
                : alert.type === 'success' 
                  ? 'bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100 hover:bg-green-300 dark:hover:bg-green-700' 
                : 'bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 hover:bg-blue-300 dark:hover:bg-blue-700'
              } ${
                alert.actions[0].disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {alert.actions[0].text}
              {alert.actions[0].icon || <ExternalLink className="h-3 w-3 ml-1" />}
            </button>
          )}
          
          {/* More options menu if there are additional actions */}
          {alert.actions.length > 1 && (
            <div className="relative" ref={menuRef}>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
                className="p-1.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                title="More options"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
              
              {menuOpen && (
                <div className="absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 dark:divide-gray-700 z-10 animate-fadeIn">
                  <div className="py-1">
                    {alert.actions.slice(1).map((action, idx) => (
                      <button 
                        key={`${alert.id}-action-${idx}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(false);
                          if (action.confirmationRequired) {
                            setConfirmAction({ action, isOpen: true });
                          } else {
                            action.onClick();
                          }
                        }}
                        disabled={action.disabled}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          action.disabled 
                            ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                            : 'text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                        } flex items-center`}
                      >
                        {action.icon}
                        <span className="ml-2">{action.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Dismiss button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDismiss(alert.id);
            }}
            className="p-1.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
            title="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Expanded details section */}
      {isExpanded && alert.details && (
        <div className={`px-5 py-4 bg-gray-100 dark:bg-gray-800/80 border-t border-gray-300 dark:border-gray-600 ${theme.animations.expand}`}>
          <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{alert.details}</p>
          
          {/* Related resources if available */}
          {alert.relatedResources && alert.relatedResources.length > 0 && (
            <div className="mt-3">
              <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Related Resources:</h4>
              <div className="flex flex-wrap gap-2">
                {alert.relatedResources.map((resource, idx) => (
                  <span 
                    key={`${alert.id}-resource-${idx}`}
                    className="inline-flex items-center rounded-md bg-gray-200 dark:bg-gray-700 px-2 py-0.5 text-xs text-gray-900 dark:text-gray-100"
                  >
                    {resource}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Related alerts if available */}
          {alert.relatedAlerts && alert.relatedAlerts.length > 0 && (
            <div className="mt-3">
              <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Related Alerts:</h4>
              <div className="flex flex-wrap gap-2">
                {alert.relatedAlerts.map((relatedAlert, idx) => (
                  <span 
                    key={`${alert.id}-related-${idx}`}
                    className="inline-flex items-center rounded-md bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 text-xs text-blue-800 dark:text-blue-200"
                  >
                    {relatedAlert}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Additional info if available */}
          {alert.metadata && Object.keys(alert.metadata).length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              {Object.entries(alert.metadata).map(([key, value], idx) => (
                <div key={`${alert.id}-meta-${idx}`}>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{key}: </span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </span>
                </div>
              ))}
            </div>
          )}
          
          {/* Affected users if available */}
          {alert.affectedUsers && (
            <div className="mt-2 text-xs text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Affected users: </span>
              <span className="text-gray-900 dark:text-gray-100">{alert.affectedUsers.toLocaleString()}</span>
            </div>
          )}
          
          {/* Assignment info if available */}
          {alert.assignedTo && (
            <div className="mt-3 flex items-center text-xs text-gray-800 dark:text-gray-200">
              <span className="font-semibold text-gray-700 dark:text-gray-300 mr-1">Assigned to: </span>
              <div className="flex items-center">
                {alert.assignedTo.avatar ? (
                  <img 
                    src={alert.assignedTo.avatar} 
                    alt={alert.assignedTo.name}
                    className="h-5 w-5 rounded-full mr-1"
                  />
                ) : (
                  <div className="h-5 w-5 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center mr-1">
                    <span className="text-xs text-gray-800 dark:text-gray-200">
                      {alert.assignedTo.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span>{alert.assignedTo.name}</span>
                {alert.assignedTo.role && (
                  <span className="ml-1 text-gray-700 dark:text-gray-300">({alert.assignedTo.role})</span>
                )}
              </div>
            </div>
          )}
          
          <div className="mt-3 flex justify-end space-x-3">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDismiss(alert.id);
              }}
              className="px-3 py-1.5 text-xs bg-white dark:bg-gray-700 border border-gray-400 dark:border-gray-500 rounded-md shadow-sm text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
            >
              <X className="h-3 w-3 mr-1" />
              Dismiss
            </button>
            
            {alert.actions.length > 0 && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (alert.actions[0].confirmationRequired) {
                    setConfirmAction({ action: alert.actions[0], isOpen: true });
                  } else {
                    alert.actions[0].onClick();
                  }
                }}
                disabled={alert.actions[0].disabled}
                className={`px-3 py-1.5 text-xs ${
                  alert.type === 'error' 
                    ? 'bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-600'
                  : alert.type === 'warning'
                    ? 'bg-amber-600 dark:bg-amber-700 hover:bg-amber-700 dark:hover:bg-amber-600'
                  : alert.type === 'success'
                    ? 'bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-600'
                  : 'bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600'
                } border border-transparent rounded-md shadow-sm text-white font-semibold flex items-center ${
                  alert.actions[0].disabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {alert.actions[0].text}
                {alert.actions[0].icon || <ExternalLink className="h-3 w-3 ml-1" />}
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Confirmation modal */}
      {confirmAction.isOpen && confirmAction.action && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 dark:bg-opacity-80 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-96 mx-4">
            <div className="flex items-center justify-center mb-4">
              <div className={`${iconBg} rounded-full p-3`}>
                {alert.type === 'warning' ? (
                  <AlertTriangle className={`h-6 w-6 ${iconColor}`} />
                ) : alert.type === 'error' ? (
                  <AlertCircle className={`h-6 w-6 ${iconColor}`} />
                ) : alert.type === 'success' ? (
                  <CheckCircle className={`h-6 w-6 ${iconColor}`} />
                ) : (
                  <Info className={`h-6 w-6 ${iconColor}`} />
                )}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
              Confirm Action
            </h3>
            <p className="text-center text-gray-800 dark:text-gray-200 mb-4">
              {confirmAction.action.confirmationText || `Are you sure you want to ${confirmAction.action.text.toLowerCase()}?`}
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmAction({ action: null, isOpen: false });
                }}
                className="px-4 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-400 dark:border-gray-500 rounded-md shadow-sm text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  confirmAction.action?.onClick();
                  setConfirmAction({ action: null, isOpen: false });
                }}
                className={`px-4 py-2 text-sm font-semibold ${
                  alert.type === 'error' 
                    ? 'bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-600'
                  : alert.type === 'warning'
                    ? 'bg-amber-600 dark:bg-amber-700 hover:bg-amber-700 dark:hover:bg-amber-600'
                  : alert.type === 'success'
                    ? 'bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-600'
                  : 'bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600'
                } border border-transparent rounded-md shadow-sm text-white`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Search component
interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
}

const SearchInput: React.FC<SearchProps> = ({ 
  value, 
  onChange, 
  onSearch, 
  placeholder = "Search alerts..." 
}) => {
  return (
    <div className="relative flex-1">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-600 dark:text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        className="pl-10 pr-4 py-2 w-full border border-gray-400 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-gray-900"
        placeholder={placeholder}
      />
    </div>
  );
};
export interface ImportantAlertsProps {
  externalAlerts?: Alert[];
  title?: string;
  onAlertAction?: (alert: Alert, actionType: string) => void;
  onSelectionChange?: (selectedAlerts: Alert[]) => void;
  theme?: 'light'; // Remove dark and system options
  maxHeight?: string;
  compactMode?: boolean;
  enableGroupActions?: boolean;
}

const ImportantAlerts: React.FC<ImportantAlertsProps> = ({ 
  externalAlerts = [],
  title = "Important Alerts",
  onAlertAction,
  onSelectionChange,
  theme: userTheme = 'light', // Always light
  maxHeight,
  compactMode = false,
  enableGroupActions = true
}) => {
  // ...
  // UI state
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterService, setFilterService] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showTimeAgo, setShowTimeAgo] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSearch, setActiveSearch] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<{field: string, direction: 'asc' | 'desc'}>({
    field: 'timestamp',
    direction: 'desc'
  });
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);
  const [uiConfig, setUiConfig] = useState<UIConfig>({
    ...defaultUIConfig,
    compactMode,
    theme: userTheme,
    maxHeight: maxHeight || defaultUIConfig.maxHeight
  });
  
  // Refs
  const alertContainerRef = useRef<HTMLDivElement>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  
  // Setup initial alerts with enhanced data
  const defaultAlerts: Alert[] = [
    {
      id: 'alert1',
      type: 'warning',
      title: 'Google Workspace API limit approaching',
      description: '80% of daily quota used. Consider increasing limits.',
      actions: [
        { 
          text: "View Dashboard", 
          onClick: () => handleAlertAction('alert1', 'view'),
          type: 'view'
        },
        {
          text: "Increase Quota",
          onClick: () => handleAlertAction('alert1', 'increase_quota'),
          type: 'custom',
          icon: <ArrowUp className="h-4 w-4 mr-1" />
        },
        {
          text: "Optimize Usage",
          onClick: () => handleAlertAction('alert1', 'optimize'),
          type: 'custom',
          icon: <Settings className="h-4 w-4 mr-1" />
        }
      ],
      details: 'Your Google Workspace API is currently at 80% of its daily limit. If the limit is reached, data synchronization will be paused until the quota resets at midnight UTC. To prevent disruption, consider upgrading your API tier or optimizing your API usage patterns.',
      timestamp: '15 minutes ago',
      timestampDate: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      service: 'googleworkspace',
      isRead: false,
      priority: 'high',
      status: 'active',
      category: 'API Quota',
      tags: ['integration', 'performance'],
      affectedUsers: 215,
      metadata: {
        'Current Usage': '80%',
        'Reset Time': 'Midnight UTC',
        'API Endpoint': '/calendar/v3/*'
      }
    },
    {
      id: 'alert2',
      type: 'error',
      title: 'Slack token needs reauthorization',
      description: 'Token will expire in 2 days. Please reauthorize immediately.',
      actions: [
        { 
          text: "Fix Now", 
          onClick: () => handleAlertAction('alert2', 'fix'),
          type: 'resolve',
          confirmationRequired: true,
          confirmationText: "You'll be redirected to Slack to reauthorize the integration. Continue?"
        },
        {
          text: "Temporarily Disable",
          onClick: () => handleAlertAction('alert2', 'disable'),
          type: 'custom',
          icon: <X className="h-4 w-4 mr-1" />
        }
      ],
      details: 'Your Slack integration token is set to expire in 2 days. Once expired, the system will no longer be able to retrieve data from Slack. Please reauthorize the connection to generate a new token. This requires admin access to your Slack workspace.',
      timestamp: '30 minutes ago',
      timestampDate: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      service: 'slack',
      isRead: false,
      priority: 'critical',
      status: 'active',
      category: 'Authentication',
      tags: ['security', 'integration'],
      relatedResources: ['Slack Workspace', 'Integration Settings'],
      assignedTo: {
        id: 'user123',
        name: 'Admin Team',
        role: 'System Administrators'
      }
    },
    {
      id: 'alert3',
      type: 'info',
      title: 'Storage usage at 75%',
      description: 'Consider archiving older data or upgrading storage.',
      actions: [
        { 
          text: "Manage", 
          onClick: () => handleAlertAction('alert3', 'manage'),
          type: 'view'
        },
        {
          text: "Upgrade Plan",
          onClick: () => handleAlertAction('alert3', 'upgrade'),
          type: 'custom',
          icon: <ArrowUp className="h-4 w-4 mr-1" />
        },
        {
          text: "Archive Data",
          onClick: () => handleAlertAction('alert3', 'archive'),
          type: 'custom',
          icon: <SaveIcon className="h-4 w-4 mr-1" />
        }
      ],
      details: 'Your system storage utilization has reached 75% of allocated capacity. At current growth rates, you have approximately 45 days before reaching capacity. Consider archiving older data or increasing your storage allocation to prevent potential data loss.',
      timestamp: '1 hour ago',
      timestampDate: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      service: 'storage',
      isRead: true,
      priority: 'medium',
      status: 'acknowledged',
      category: 'Storage',
      tags: ['infrastructure', 'capacity'],
      metadata: {
        'Current Usage': '75%',
        'Growth Rate': '0.5% per day',
        'Estimated Days Remaining': 45
      }
    },
    {
      id: 'alert4',
      type: 'warning',
      title: 'Microsoft 365 subscription expiring',
      description: 'Your subscription will expire in 14 days.',
      actions: [
        { 
          text: "Renew", 
          onClick: () => handleAlertAction('alert4', 'renew'),
          type: 'resolve'
        },
        {
          text: "Change Plan",
          onClick: () => handleAlertAction('alert4', 'change_plan'),
          type: 'custom'
        }
      ],
      details: 'Your Microsoft 365 Business subscription is set to expire in 14 days. To avoid service interruption, please renew your subscription before the expiration date.',
      timestamp: '2 hours ago',
      timestampDate: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      service: 'microsoft365',
      isRead: true,
      priority: 'medium',
      status: 'active',
      category: 'Subscription',
      tags: ['billing', 'license'],
      metadata: {
        'Expiry Date': new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toLocaleDateString(),
        'License Type': 'Microsoft 365 Business Premium',
        'Seats': '25'
      }
    },
    {
      id: 'alert5',
      type: 'info',
      title: 'Dropbox storage near capacity',
      description: 'You have used 90% of your Dropbox storage.',
      actions: [
        { 
          text: "Upgrade", 
          onClick: () => handleAlertAction('alert5', 'upgrade'),
          type: 'resolve'
        },
        {
          text: "Clean Up",
          onClick: () => handleAlertAction('alert5', 'cleanup'),
          type: 'custom',
          icon: <Trash2 className="h-4 w-4 mr-1" />
        }
      ],
      details: 'Your Dropbox storage is almost full. To continue syncing your files without interruption, consider upgrading your plan or freeing up space by removing unnecessary files.',
      timestamp: '3 hours ago',
      timestampDate: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      service: 'dropbox',
      isRead: false,
      isPinned: true,
      priority: 'medium',
      status: 'active',
      category: 'Storage',
      tags: ['cloud', 'capacity'],
      affectedUsers: 42
    },
    {
      id: 'alert6',
      type: 'warning',
      title: 'Zoom meeting recording storage full',
      description: 'Unable to save new meeting recordings.',
      actions: [
        { 
          text: "Manage", 
          onClick: () => handleAlertAction('alert6', 'manage'),
          type: 'view'
        },
        {
          text: "Delete Old Recordings",
          onClick: () => handleAlertAction('alert6', 'delete_recordings'),
          type: 'custom',
          icon: <Trash2 className="h-4 w-4 mr-1" />
        },
        {
          text: "Upgrade Storage",
          onClick: () => handleAlertAction('alert6', 'upgrade'),
          type: 'custom',
          icon: <ArrowUp className="h-4 w-4 mr-1" />
        }
      ],
      details: 'Your Zoom cloud recording storage has reached its capacity. New meetings will not be recorded until you free up space or upgrade your storage plan.',
      timestamp: '4 hours ago',
      timestampDate: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      service: 'zoom',
      isRead: true,
      priority: 'high',
      status: 'active',
      category: 'Storage',
      tags: ['meetings', 'recordings'],
      metadata: {
        'Available Space': '0 MB',
        'Total Capacity': '1 GB',
        'Recordings Count': '42'
      }
    },
    {
      id: 'alert7',
      type: 'success',
      title: 'Database backup completed successfully',
      description: 'Weekly backup has been stored and verified.',
      actions: [
        { 
          text: "View Details", 
          onClick: () => handleAlertAction('alert7', 'view'),
          type: 'view'
        },
        {
          text: "Download Backup",
          onClick: () => handleAlertAction('alert7', 'download'),
          type: 'custom',
          icon: <SaveIcon className="h-4 w-4 mr-1" />
        }
      ],
      details: 'The weekly database backup completed successfully. The backup includes all production databases and has been verified for integrity. It has been stored according to retention policies and is available for recovery if needed.',
      timestamp: '5 hours ago',
      timestampDate: new Date(Date.now() - 1000 * 60 * 60 * 5),
      service: 'database',
      isRead: true,
      priority: 'low',
      status: 'resolved',
      category: 'Backup',
      tags: ['database', 'maintenance'],
      metadata: {
        'Size': '24.5 GB',
        'Duration': '28 minutes',
        'Backup ID': 'BKP-2023-04-15-001'
      }
    },
    {
      id: 'alert8',
      type: 'error',
      title: 'AWS EC2 instance unreachable',
      description: 'Production web server has failed health checks.',
      actions: [
        { 
          text: "Restart", 
          onClick: () => handleAlertAction('alert8', 'restart'),
          type: 'resolve',
          confirmationRequired: true,
          confirmationText: "This will restart the production web server. Continue?"
        },
        {
          text: "Investigate",
          onClick: () => handleAlertAction('alert8', 'investigate'),
          type: 'custom',
          icon: <Search className="h-4 w-4 mr-1" />
        }
      ],
      details: 'The production web server (AWS EC2 instance i-0a1b2c3d4e5f6g7h8) has failed multiple health checks. The instance is currently unreachable. This may impact the availability of the production website.',
      timestamp: '10 minutes ago',
      timestampDate: new Date(Date.now() - 1000 * 60 * 10),
      service: 'aws',
      isRead: false,
      isPinned: true,
      priority: 'critical',
      status: 'active',
      category: 'Infrastructure',
      tags: ['server', 'availability', 'production'],
      assignedTo: {
        id: 'user456',
        name: 'DevOps Team',
        role: 'On-call Engineer'
      },
      affectedUsers: 3450,
      relatedAlerts: ['Network Latency Spike', 'Load Balancer Warnings']
    }
  ];
  
  const [alerts, setAlerts] = useState<Alert[]>(defaultAlerts);

  // Handle alert actions with callback
  const handleAlertAction = (alertId: string, actionType: string) => {
    const alert = alerts.find(a => a.id === alertId);
    if (alert && onAlertAction) {
      onAlertAction(alert, actionType);
    }
    
    // Handle default actions
    if (actionType === 'resolve') {
      setAlerts(alerts.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: 'resolved' as AlertStatus } 
          : alert
      ));
    }
  };

  // Determine if dark mode should be used
  useEffect(() => {
    const updateTheme = () => {
      if (uiConfig.theme === 'dark') {
        setIsDarkMode(true);
      } else if (uiConfig.theme === 'light') {
        setIsDarkMode(false);
      } else {
        // System theme
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(prefersDark);
      }
    };
    
    updateTheme();
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => updateTheme();
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [uiConfig.theme]);

  // Update current time every minute for "time ago" display
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // update every minute
    
    return () => clearInterval(timer);
  }, []);

  // Update config when props change
  useEffect(() => {
    setUiConfig(prev => ({
      ...prev,
      compactMode,
      theme: userTheme,
      maxHeight: maxHeight || prev.maxHeight
    }));
  }, [compactMode, userTheme, maxHeight]);

  // Add timestamp to alerts if not present
  const addTimestamp = (alert: Alert): Alert => {
    if (!alert.timestamp) {
      return { 
        ...alert, 
        timestamp: 'Just now',
        timestampDate: new Date(),
        isRead: false
      };
    }
    return alert;
  };

  // Handle external alerts
  useEffect(() => {
    if (externalAlerts.length > 0) {
      const timestampedAlerts = externalAlerts.map(addTimestamp);
      setAlerts(prev => [...timestampedAlerts, ...prev]);
    }
  }, [externalAlerts]);

  // Function to add a new alert
  const addAlert = (alert: Alert) => {
    setAlerts(prev => [addTimestamp(alert), ...prev]);
  };

  const toggleExpand = (id: string) => {
    if (expandedAlert === id) {
      setExpandedAlert(null);
    } else {
      setExpandedAlert(id);
    }
  };

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    setSelectedAlerts(prev => prev.filter(selectedId => selectedId !== id));
  };
  
  const markAsRead = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, isRead: true } : alert
    ));
  };
  
  const togglePin = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, isPinned: !alert.isPinned } : alert
    ));
  };
  
  const assignAlert = (id: string, userId?: string) => {
    // In a real scenario this would open a user picker or assign to the selected user
    // For demo, we'll just toggle between assigned/unassigned
    setAlerts(alerts.map(alert => 
      alert.id === id ? { 
        ...alert, 
        assignedTo: alert.assignedTo 
          ? undefined 
          : { id: 'user-demo', name: 'Current User', role: 'Support' } 
      } : alert
    ));
  };
  
  const handleSearch = () => {
    setActiveSearch(searchQuery.trim().toLowerCase());
  };
  
  const markAllAsRead = () => {
    setAlerts(alerts.map(alert => ({ ...alert, isRead: true })));
  };
  
  const dismissAll = () => {
    setAlerts([]);
    setSelectedAlerts([]);
  };
  
  const dismissSelected = () => {
    setAlerts(alerts.filter(alert => !selectedAlerts.includes(alert.id)));
    setSelectedAlerts([]);
  };
  
  const markSelectedAsRead = () => {
    setAlerts(alerts.map(alert => 
      selectedAlerts.includes(alert.id) ? { ...alert, isRead: true } : alert
    ));
  };

  const handleSort = (field: string) => {
    setSortOrder(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  const handleSelectAlert = (id: string, multiSelect: boolean = false) => {
    if (multiSelect) {
      setSelectedAlerts(prev => 
        prev.includes(id) 
          ? prev.filter(selectedId => selectedId !== id) 
          : [...prev, id]
      );
    } else {
      setSelectedAlerts(prev => 
        prev.includes(id) && prev.length === 1
          ? []
          : [id]
      );
    }
  };
  
  const handleSelectAll = () => {
    if (selectedAlerts.length === filteredAlerts.length) {
      setSelectedAlerts([]);
    } else {
      setSelectedAlerts(filteredAlerts.map(alert => alert.id));
    }
  };
  
  // Provide selected alerts to parent component
  useEffect(() => {
    if (onSelectionChange) {
      const selected = alerts.filter(alert => selectedAlerts.includes(alert.id));
      onSelectionChange(selected);
    }
  }, [selectedAlerts, alerts, onSelectionChange]);
  
  // Filter and sort alerts
  const filteredAlerts = useMemo(() => {
    // First filter
    let filtered = alerts.filter(alert => {
      // Type filter
      const typeMatch = filterType === 'all' || alert.type === filterType;
      
      // Service filter
      const serviceMatch = filterService === 'all' || alert.service === filterService;
      
      // Priority filter
      const priorityMatch = filterPriority === 'all' || alert.priority === filterPriority;
      
      // Status filter
      const statusMatch = filterStatus === 'all' || alert.status === filterStatus;
      
      // Search query
      const searchMatch = !activeSearch || (
        (alert.title && alert.title.toLowerCase().includes(activeSearch)) ||
        (alert.description && alert.description.toLowerCase().includes(activeSearch)) ||
        (alert.details && alert.details.toLowerCase().includes(activeSearch)) ||
        (alert.category && alert.category.toLowerCase().includes(activeSearch)) ||
        (alert.tags && alert.tags.some(tag => tag.toLowerCase().includes(activeSearch)))
      );
      
      return typeMatch && serviceMatch && priorityMatch && statusMatch && searchMatch;
    });
    
    // Then sort
    return filtered.sort((a, b) => {
      if (sortOrder.field === 'priority') {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3, undefined: 4 };
        const aVal = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 4;
        const bVal = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 4;
        return sortOrder.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      if (sortOrder.field === 'timestamp') {
        const aTime = a.timestampDate?.getTime() || 0;
        const bTime = b.timestampDate?.getTime() || 0;
        return sortOrder.direction === 'asc' ? aTime - bTime : bTime - aTime;
      }
      
      if (sortOrder.field === 'type') {
        const typeOrder = { error: 0, warning: 1, info: 2, success: 3 };
        const aVal = typeOrder[a.type as keyof typeof typeOrder];
        const bVal = typeOrder[b.type as keyof typeof typeOrder];
        return sortOrder.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      if (sortOrder.field === 'title') {
        const aVal = a.title.toLowerCase();
        const bVal = b.title.toLowerCase();
        return sortOrder.direction === 'asc' 
          ? aVal.localeCompare(bVal) 
          : bVal.localeCompare(aVal);
      }
      
      // Default to pinned items first, then timestamp
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      const aTime = a.timestampDate?.getTime() || 0;
      const bTime = b.timestampDate?.getTime() || 0;
      return bTime - aTime; // Default to newer first
    });
  }, [
    alerts, 
    filterType, 
    filterService, 
    filterPriority, 
    filterStatus, 
    activeSearch, 
    sortOrder
  ]);
  
  // Count unread alerts
  const unreadCount = alerts.filter(alert => !alert.isRead).length;
  
  // Count alerts by type
  const errorCount = alerts.filter(a => a.type === 'error').length;
  const warningCount = alerts.filter(a => a.type === 'warning').length;
  const infoCount = alerts.filter(a => a.type === 'info').length;
  const successCount = alerts.filter(a => a.type === 'success').length;
  
  // Get unique services, priorities, and statuses for filter dropdowns
  const services = [...new Set(alerts.map(alert => alert.service))].filter(Boolean) as string[];
  const priorities = [...new Set(alerts.map(alert => alert.priority))].filter(Boolean) as string[];
  const statuses = [...new Set(alerts.map(alert => alert.status))].filter(Boolean) as string[];
  
  // Set the theme based on dark mode state
  const activeTheme = isDarkMode ? darkTheme : defaultTheme;
  
  return (
    <div className={`${
      isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-black'
    } rounded-lg shadow-lg overflow-hidden ${uiConfig.borderRadius} border border-gray-300 dark:border-gray-600`}>
      {/* Header with filters */}
      <div className="p-4 border-b border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div className="flex items-center mb-2 md:mb-0">
            <div className="bg-blue-200 dark:bg-blue-800 rounded-full p-2 mr-3">
              <Bell className="h-5 w-5 text-blue-800 dark:text-blue-200" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
              {unreadCount > 0 && (
                <span className="ml-2 bg-blue-700 dark:bg-blue-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
                  {unreadCount} new
                </span>
              )}
            </h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              className="flex items-center text-sm text-gray-800 dark:text-gray-200 hover:text-blue-800 dark:hover:text-blue-300 px-2 py-1"
              onClick={() => setShowTimeAgo(!showTimeAgo)}
              aria-label={showTimeAgo ? "Show absolute timestamps" : "Show relative timestamps"}
            >
              {showTimeAgo ? (
                <Calendar className="h-4 w-4 mr-1" />
              ) : (
                <Clock className="h-4 w-4 mr-1" />
              )}
              {showTimeAgo ? "Show date/time" : "Show time ago"}
            </button>
            
            <button
              className="p-1.5 text-gray-700 dark:text-gray-300 hover:text-blue-800 dark:hover:text-blue-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30"
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label={isCollapsed ? "Expand alerts" : "Collapse alerts"}
              aria-expanded={!isCollapsed}
            >
              {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </button>
          </div>
        </div>
        
        {!isCollapsed && (
          <div className="space-y-3">
            {/* Search and action buttons */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <SearchInput 
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={handleSearch}
                placeholder="Search alerts by title, description, tags..."
              />
              
              <div className="flex space-x-2">
                <button
                  className="flex items-center justify-center px-3 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => {
                    setFilterType('all');
                    setFilterService('all');
                    setFilterPriority('all');
                    setFilterStatus('all');
                    setActiveSearch('');
                    setSearchQuery('');
                  }}
                  aria-label="Reset filters"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
                
                <button
                  className="flex items-center px-3 py-2 bg-blue-600 dark:bg-blue-700 text-white font-medium rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                  onClick={() => setUiConfig(prev => ({
                    ...prev,
                    compactMode: !prev.compactMode
                  }))}
                  aria-label={uiConfig.compactMode ? "Expand view" : "Compact view"}
                >
                  {uiConfig.compactMode ? "Expanded View" : "Compact View"}
                </button>
              </div>
            </div>
            
            {/* Filters row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              {/* Alert Type Filter */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400">
                  <Filter className="h-4 w-4" />
                </div>
                <select
                  className="pl-9 pr-4 py-2 border border-gray-400 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full text-sm dark:bg-gray-700 dark:text-white text-gray-900"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  aria-label="Filter by alert type"
                >
                  <option value="all">All types</option>
                  <option value="warning">Warnings ({warningCount})</option>
                  <option value="error">Errors ({errorCount})</option>
                  <option value="info">Info ({infoCount})</option>
                  <option value="success">Success ({successCount})</option>
                </select>
              </div>
              
              {/* Service Filter */}
              {services.length > 0 && (
                <div className="relative">
                  <select
                    className="pl-3 pr-4 py-2 border border-gray-400 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full text-sm dark:bg-gray-700 dark:text-white text-gray-900"
                    value={filterService}
                    onChange={(e) => setFilterService(e.target.value)}
                    aria-label="Filter by service"
                  >
                    <option value="all">All services</option>
                    {services.map(service => (
                      <option key={service} value={service}>
                        {service.charAt(0).toUpperCase() + service.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              {/* Priority Filter */}
              {priorities.length > 0 && (
                <div className="relative">
                  <select
                    className="pl-3 pr-4 py-2 border border-gray-400 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full text-sm dark:bg-gray-700 dark:text-white text-gray-900"
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    aria-label="Filter by priority"
                  >
                    <option value="all">All priorities</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              )}
              
              {/* Status Filter */}
              {statuses.length > 0 && (
                <div className="relative">
                  <select
                    className="pl-3 pr-4 py-2 border border-gray-400 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full text-sm dark:bg-gray-700 dark:text-white text-gray-900"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    aria-label="Filter by status"
                  >
                    <option value="all">All statuses</option>
                    {statuses.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            
            {/* Sort and Actions */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
              {/* Sorting controls */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Sort by:</span>
                <button 
                  className={`px-2 py-1 text-xs rounded-md flex items-center ${
                    sortOrder.field === 'timestamp' 
                      ? 'bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 font-semibold' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                  onClick={() => handleSort('timestamp')}
                >
                  Time
                  {sortOrder.field === 'timestamp' && (
                    sortOrder.direction === 'asc' 
                      ? <ArrowUp className="h-3 w-3 ml-1" /> 
                      : <ArrowDown className="h-3 w-3 ml-1" />
                  )}
                </button>
                <button 
                  className={`px-2 py-1 text-xs rounded-md flex items-center ${
                    sortOrder.field === 'priority' 
                      ? 'bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 font-semibold' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                  onClick={() => handleSort('priority')}
                >
                  Priority
                  {sortOrder.field === 'priority' && (
                    sortOrder.direction === 'asc' 
                      ? <ArrowUp className="h-3 w-3 ml-1" /> 
                      : <ArrowDown className="h-3 w-3 ml-1" />
                  )}
                </button>
                <button 
                  className={`px-2 py-1 text-xs rounded-md flex items-center ${
                    sortOrder.field === 'type' 
                      ? 'bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 font-semibold' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                  onClick={() => handleSort('type')}
                >
                  Type
                  {sortOrder.field === 'type' && (
                    sortOrder.direction === 'asc' 
                      ? <ArrowUp className="h-3 w-3 ml-1" /> 
                      : <ArrowDown className="h-3 w-3 ml-1" />
                  )}
                </button>
              </div>
              
              {/* Bulk actions */}
              <div className="flex space-x-2 w-full sm:w-auto justify-end">
                {unreadCount > 0 && (
                  <button
                    className="text-sm text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-200 font-medium"
                    onClick={markAllAsRead}
                  >
                    Mark all as read
                  </button>
                )}
                
                {selectedAlerts.length > 0 && enableGroupActions && (
                  <>
                    <button
                      className="text-sm text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-200 font-medium"
                      onClick={markSelectedAsRead}
                    >
                      Mark {selectedAlerts.length} as read
                    </button>
                    <button
                      className="text-sm text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-200 font-medium"
                      onClick={dismissSelected}
                    >
                      Dismiss {selectedAlerts.length} selected
                    </button>
                  </>
                )}
                
                {alerts.length > 0 && !selectedAlerts.length && (
                  <button
                    className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 font-medium"
                    onClick={dismissAll}
                  >
                    Dismiss all
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Select all checkbox if group actions enabled */}
      {!isCollapsed && filteredAlerts.length > 0 && enableGroupActions && (
        <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600 flex items-center">
          <label className="flex items-center space-x-2 text-sm text-gray-800 dark:text-gray-200">
            <input 
              type="checkbox" 
              checked={selectedAlerts.length === filteredAlerts.length && filteredAlerts.length > 0} 
              onChange={handleSelectAll}
              className="h-4 w-4 text-blue-600 rounded border-gray-400 dark:border-gray-500 focus:ring-blue-500"
            />
            <span>Select all</span>
          </label>
          <span className="text-xs text-gray-700 dark:text-gray-300 ml-4">
            {selectedAlerts.length} of {filteredAlerts.length} selected
          </span>
        </div>
      )}
      
      {/* Alerts list with scroll area */}
      {!isCollapsed && (
        <div 
          className={`overflow-y-auto scroll-smooth ${activeTheme.animations.transition}`}
          style={{ 
            scrollbarWidth: 'thin',
            maxHeight: uiConfig.maxHeight
          }}
          ref={alertContainerRef}
          tabIndex={0}
          role="list"
          aria-label="Alerts list"
        >
          {filteredAlerts.length > 0 ? filteredAlerts.map((alert, index) => (
            <AlertItem 
              key={alert.id}
              alert={alert}
              expandedId={expandedAlert}
              onToggleExpand={toggleExpand}
              onDismiss={dismissAlert}
              onMarkAsRead={markAsRead}
              onTogglePin={togglePin}
              onAssign={assignAlert}
              showTimeAgo={showTimeAgo}
              currentTime={currentTime}
              theme={activeTheme}
              config={uiConfig}
              isSelected={selectedAlerts.includes(alert.id)}
              onSelect={handleSelectAlert}
              tabIndex={index + 1}
            />
          )) : (
            <div className="py-12 px-4 text-center">
              <div className="bg-green-200 dark:bg-green-800 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center mb-4">
                {activeSearch || filterType !== 'all' || filterService !== 'all' || filterPriority !== 'all' || filterStatus !== 'all' ? (
                  <Search className="h-8 w-8 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Check className="h-8 w-8 text-green-700 dark:text-green-300" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {activeSearch || filterType !== 'all' || filterService !== 'all' || filterPriority !== 'all' || filterStatus !== 'all'
                  ? 'No matching alerts found'
                  : 'All systems normal'}
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 max-w-md mx-auto">
                {activeSearch || filterType !== 'all' || filterService !== 'all' || filterPriority !== 'all' || filterStatus !== 'all' 
                  ? 'Try adjusting your filters or search terms to find what you\'re looking for.' 
                  : 'There are no active alerts at this time. All monitored systems are operating normally.'}
              </p>
              
              {(activeSearch || filterType !== 'all' || filterService !== 'all' || filterPriority !== 'all' || filterStatus !== 'all') && alerts.length > 0 && (
                <button 
                  onClick={() => {
                    setFilterType('all');
                    setFilterService('all');
                    setFilterPriority('all');
                    setFilterStatus('all');
                    setActiveSearch('');
                    setSearchQuery('');
                  }}
                  className="mt-4 px-4 py-2 text-sm bg-blue-600 dark:bg-blue-700 text-white font-medium rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      )}
      
      {isCollapsed && alerts.length > 0 && (
        <div className="p-4 text-center text-sm text-gray-800 dark:text-gray-200 font-medium">
          {alerts.length} alert{alerts.length !== 1 ? 's' : ''} {unreadCount > 0 ? `(${unreadCount} new)` : ''}
        </div>
      )}
      
      {/* Footer with stats */}
      {!isCollapsed && filteredAlerts.length > 0 && (
        <div className="p-3 border-t border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300 flex justify-between items-center flex-wrap gap-2">
          <div>
            {filteredAlerts.length} alert{filteredAlerts.length !== 1 ? 's' : ''} displayed
            {(activeSearch || filterType !== 'all' || filterService !== 'all' || filterPriority !== 'all' || filterStatus !== 'all')
              ? ` (filtered from ${alerts.length})`
              : ''}
          </div>
          <div className="flex flex-wrap gap-4">
            {errorCount > 0 && (
              <span className="flex items-center">
                <span className="w-2 h-2 bg-red-600 rounded-full mr-1"></span>
                {errorCount} error{errorCount !== 1 ? 's' : ''}
              </span>
            )}
            {warningCount > 0 && (
              <span className="flex items-center">
                <span className="w-2 h-2 bg-amber-600 rounded-full mr-1"></span>
                {warningCount} warning{warningCount !== 1 ? 's' : ''}
              </span>
            )}
            {infoCount > 0 && (
              <span className="flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-1"></span>
                {infoCount} info
              </span>
            )}
            {successCount > 0 && (
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-1"></span>
                {successCount} success
              </span>
            )}
          </div>
        </div>
      )}
      
      {/* Keyboard shortcuts help */}
      <div className="hidden">
        <div id="keyboardShortcuts" role="dialog" aria-label="Keyboard shortcuts">
          <h3>Keyboard Shortcuts</h3>
          <dl>
            <dt>Enter</dt><dd>Expand/collapse alert details</dd>
            <dt>Ctrl+R</dt><dd>Mark alert as read</dd>
            <dt>Ctrl+P</dt><dd>Pin/unpin alert</dd>
            <dt>Delete</dt><dd>Dismiss alert</dd>
            <dt>Ctrl+M</dt><dd>Open actions menu</dd>
          </dl>
        </div>
      </div>
      
      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes expand {
          from { max-height: 0; opacity: 0; }
          to { max-height: 1000px; opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-in-out;
        }
        .animate-expand {
          animation: expand 0.3s ease-out;
          overflow: hidden;
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default ImportantAlerts;