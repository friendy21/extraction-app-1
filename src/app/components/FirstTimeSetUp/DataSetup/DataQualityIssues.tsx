"use client"

import { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  RefreshCw, 
  Loader2,
  Check,
  Eye,
  X,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Info,
  AlertCircle,
  BarChart,
  PieChart,
  User,
  Mail,
  Calendar,
  Clock,
  Shield,
  CheckCircle2,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Type definitions
export interface Email {
  address: string;
  source?: string;
  isPrimary?: boolean;
  lastUsed?: string;
}

export interface Employee {
  id: string;
  name: string;
  emails: Email[];
  emailCount: number;
  chatCount: number;
  meetingCount: number;
  fileAccessCount: number;
  department?: string;
  position?: string;
  hasQualityIssues?: boolean;
  issueType?: 'alias' | 'conflict' | 'missing' | null;
  isIncluded?: boolean;
  avatar?: string;
  lastActive?: string;
}

export interface IssueStats {
  aliasCount: number;
  conflictCount: number;
  missingCount: number;
  totalIssueCount: number;
  percentComplete: number;
}

// Component interfaces
interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  variant?: 'outline' | 'ghost' | 'default' | 'danger' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

interface TabsProps {
  value: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  value: string;
  className?: string;
  children: React.ReactNode;
  count?: number;
  countVariant?: 'default' | 'warning' | 'error' | 'success';
}

interface TabsContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface CardProps {
  className?: string;
  children: React.ReactNode;
  variant?: 'default' | 'bordered' | 'elevated';
}

interface ProgressProps {
  value: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
  showLabel?: boolean;
}

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

interface AccordionProps {
  items: {
    title: React.ReactNode;
    content: React.ReactNode;
    id: string;
  }[];
  className?: string;
}

interface DataQualityIssuesProps {
  employeesWithAliases: Employee[];
  employeesWithConflicts: Employee[];
  employeesWithMissingData: Employee[];
  issueStats: IssueStats;
  isApplyingChanges: boolean;
  handleMergeEmails: (employeeId: string) => void;
  handleApplyResolutions: () => void;
  handleSaveInformation: (employeeId: string) => void;
  handleFixAllIssues: () => void;
  handleMergeAllEmails: () => void;
}

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } }
};

const slideIn = {
  hidden: { x: 20, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.3 } }
};

// Higher-order components
const withTooltip = (Component: React.FC<any>) => {
  return ({ tooltip, ...props }: any) => {
    if (!tooltip) return <Component {...props} />;
    
    return (
      <Tooltip content={tooltip}>
        <Component {...props} />
      </Tooltip>
    );
  };
};

// Helper Components
const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  
  const positionStyles = {
    top: { bottom: '100%', left: '50%', transform: 'translateX(-50%) translateY(-8px)' },
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%) translateY(8px)' },
    left: { right: '100%', top: '50%', transform: 'translateX(-8px) translateY(-50%)' },
    right: { left: '100%', top: '50%', transform: 'translateX(8px) translateY(-50%)' }
  }[position];
  
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, ...positionStyles, scale: 0.9 }}
            animate={{ opacity: 1, ...positionStyles, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 px-2 py-1 text-xs bg-gray-800 text-white rounded shadow-lg whitespace-nowrap"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Badge: React.FC<BadgeProps> = ({ children, className = '', variant = 'default' }) => {
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-amber-100 text-amber-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  disabled = false, 
  className = '', 
  children, 
  variant = 'default',
  size = 'md',
  iconLeft,
  iconRight,
  fullWidth = false
}) => {
  const variantStyles = {
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    ghost: "bg-transparent hover:bg-gray-50 text-gray-700",
    default: "border border-transparent text-white bg-blue-600 hover:bg-blue-700",
    danger: "border border-transparent text-white bg-red-600 hover:bg-red-700",
    success: "border border-transparent text-white bg-green-600 hover:bg-green-700",
    warning: "border border-transparent text-white bg-amber-600 hover:bg-amber-700"
  };
  
  const sizeStyles = {
    sm: "px-2.5 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center rounded-md shadow-sm font-medium transition-all duration-200
        ${variantStyles[variant]} 
        ${sizeStyles[size]} 
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
    >
      {iconLeft && <span className="mr-2">{iconLeft}</span>}
      {children}
      {iconRight && <span className="ml-2">{iconRight}</span>}
    </button>
  );
};

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  variant = 'default' 
}) => {
  const variantStyles = {
    default: 'bg-white border',
    bordered: 'bg-white border-2 border-gray-200',
    elevated: 'bg-white border shadow-lg'
  };
  
  return (
    <div className={`rounded-lg p-4 ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
};

const Progress: React.FC<ProgressProps> = ({ 
    value, 
    variant = 'default',
    className = '',
    showLabel = true
  }) => {
    const variantStyles = {
      default: 'bg-blue-600',
      success: 'bg-green-600',
      warning: 'bg-amber-500',
      error: 'bg-red-600'
    };
  
    // Ensure value is a number and constrain it between 0-100
    const safeValue = typeof value === 'number' ? Math.min(Math.max(value, 0), 100) : 0;
  
    return (
      <div className={`relative w-full ${className}`}>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full ${variantStyles[variant]}`}
            style={{ width: `${safeValue}%` }}
          />
        </div>
        {showLabel && (
          <div className="mt-1 text-xs text-gray-500 text-right">{safeValue}% complete</div>
        )}
      </div>
    );
  };
  
const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  name, 
  size = 'md',
  className = '' 
}) => {
  const sizeStyles = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base'
  };
  
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  return (
    <div className={`relative rounded-full overflow-hidden flex items-center justify-center bg-blue-100 text-blue-800 font-medium ${sizeStyles[size]} ${className}`}>
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};

const Accordion: React.FC<AccordionProps> = ({ items, className = '' }) => {
  const [openItems, setOpenItems] = useState<string[]>([]);
  
  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };
  
  return (
    <div className={`space-y-2 ${className}`}>
      {items.map(item => (
        <div key={item.id} className="border rounded-lg overflow-hidden">
          <button
            className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
            onClick={() => toggleItem(item.id)}
          >
            <div className="font-medium text-left">{item.title}</div>
            {openItems.includes(item.id) ? (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-500" />
            )}
          </button>
          <AnimatePresence>
            {openItems.includes(item.id) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-4 border-t">
                  {item.content}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

// Main Component
const DataQualityIssues: React.FC<DataQualityIssuesProps> = ({ 
  employeesWithAliases, 
  employeesWithConflicts, 
  employeesWithMissingData,
  issueStats,
  isApplyingChanges,
  handleMergeEmails,
  handleApplyResolutions,
  handleSaveInformation,
  handleFixAllIssues,
  handleMergeAllEmails
}) => {
  const [activeTab, setActiveTab] = useState<string>("aliases");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [suggestedEmployees, setSuggestedEmployees] = useState<Employee[]>([]);
  const [isAutoFixModalOpen, setIsAutoFixModalOpen] = useState(false);
  
  useEffect(() => {
    // Generate some suggested employees for the sidebar
    const suggested = [...employeesWithAliases, ...employeesWithConflicts, ...employeesWithMissingData]
      .slice(0, 3)
      .map(emp => ({
        ...emp,
        issueType: Math.random() > 0.5 ? 'alias' : Math.random() > 0.5 ? 'conflict' : 'missing'
      }));
      
    setSuggestedEmployees(suggested);
  }, [employeesWithAliases, employeesWithConflicts, employeesWithMissingData]);
  
  // Tab component
  const Tabs: React.FC<TabsProps> = ({ value, onValueChange, children, className = '' }) => {
    return (
      <div className={className}>
        {children}
      </div>
    );
  };
  
  const TabsList: React.FC<TabsListProps> = ({ children, className = '' }) => {
    return (
      <div className={`flex space-x-2 ${className}`}>
        {children}
      </div>
    );
  };
  
  const TabsTrigger: React.FC<TabsTriggerProps> = ({ 
    value, 
    className = '', 
    children,
    count,
    countVariant = 'warning'
  }) => {
    const isActive = activeTab === value;
    
    return (
      <button
        className={`
          px-4 py-2 font-medium rounded-md transition-all duration-200
          ${isActive 
            ? 'bg-white text-blue-600 shadow-sm border border-gray-200' 
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }
          ${className}
        `}
        onClick={() => setActiveTab(value)}
      >
        <div className="flex items-center space-x-2">
          <span>{children}</span>
          {count !== undefined && count > 0 && (
            <Badge variant={countVariant}>
              {count}
            </Badge>
          )}
        </div>
      </button>
    );
  };
  
  const TabsContent: React.FC<TabsContentProps> = ({ value, className = '', children }) => {
    if (value !== activeTab) return null;
    
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className={className}
      >
        {children}
      </motion.div>
    );
  };

  const EmployeeModal = () => {
    if (!selectedEmployee) return null;
    
    return (
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white rounded-lg w-full max-w-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b px-6 py-4">
                <h3 className="text-lg font-semibold">Employee Details</h3>
                <button onClick={() => setIsModalOpen(false)}>
                  <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar name={selectedEmployee.name} size="lg" />
                  <div>
                    <h2 className="text-xl font-semibold">{selectedEmployee.name}</h2>
                    <p className="text-gray-600">{selectedEmployee.position || 'Unknown Position'}</p>
                    <p className="text-gray-500 text-sm">{selectedEmployee.department || 'Unknown Department'}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3 text-gray-700">Contact Information</h4>
                    <div className="space-y-2">
                      {selectedEmployee.emails.map((email, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{email.address}</span>
                          {email.isPrimary && (
                            <Badge variant="info">Primary</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3 text-gray-700">Activity Statistics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-4 w-4 mr-2" />
                          <span>Emails</span>
                        </div>
                        <span className="font-medium">{selectedEmployee.emailCount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-sm text-gray-600">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          <span>Chats</span>
                        </div>
                        <span className="font-medium">{selectedEmployee.chatCount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Meetings</span>
                        </div>
                        <span className="font-medium">{selectedEmployee.meetingCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium mb-3 text-gray-700">Data Quality Issues</h4>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5 mr-3" />
                      <div>
                        <p className="font-medium text-amber-800">
                          {selectedEmployee.issueType === 'alias' 
                            ? 'Multiple Email Aliases Detected' 
                            : selectedEmployee.issueType === 'conflict' 
                              ? 'Data Source Conflicts Found' 
                              : 'Missing Critical Information'}
                        </p>
                        <p className="text-amber-700 text-sm mt-1">
                          {selectedEmployee.issueType === 'alias' 
                            ? `This employee has ${selectedEmployee.emails.length} different email addresses across systems.` 
                            : selectedEmployee.issueType === 'conflict' 
                              ? 'Employee information varies across different data sources.' 
                              : 'This employee is missing important information needed for analysis.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t px-6 py-4 flex justify-end space-x-3 bg-gray-50">
                <Button 
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </Button>
                {selectedEmployee.issueType === 'alias' && (
                  <Button
                    onClick={() => {
                      handleMergeEmails(selectedEmployee.id);
                      setIsModalOpen(false);
                    }}
                    iconLeft={<RefreshCw className="h-4 w-4" />}
                  >
                    Merge Email Aliases
                  </Button>
                )}
                {selectedEmployee.issueType === 'conflict' && (
                  <Button
                    onClick={() => setIsModalOpen(false)}
                    iconLeft={<Check className="h-4 w-4" />}
                  >
                    Resolve Conflicts
                  </Button>
                )}
                {selectedEmployee.issueType === 'missing' && (
                  <Button
                    onClick={() => {
                      handleSaveInformation(selectedEmployee.id);
                      setIsModalOpen(false);
                    }}
                    iconLeft={<Check className="h-4 w-4" />}
                  >
                    Complete Information
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };
  
  const AutoFixModal = () => {
    return (
      <AnimatePresence>
        {isAutoFixModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setIsAutoFixModalOpen(false)}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white rounded-lg w-full max-w-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="bg-blue-100 p-3 rounded-full mb-4">
                    <Zap className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Auto-Fix All Issues</h3>
                  <p className="text-gray-600 max-w-md">
                    This will automatically apply recommended fixes to all data quality issues. Would you like to proceed?
                  </p>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Merge {issueStats.aliasCount} email aliases</p>
                      <p className="text-sm text-gray-600">Consolidate multiple emails for accurate communication analysis</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Resolve {issueStats.conflictCount} data conflicts</p>
                      <p className="text-sm text-gray-600">Apply intelligent resolution to conflicting employee information</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Complete {issueStats.missingCount} missing entries</p>
                      <p className="text-sm text-gray-600">Fill in critical missing information using AI predictions</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t px-6 py-4 flex justify-end space-x-3 bg-gray-50">
                <Button 
                  variant="ghost"
                  onClick={() => setIsAutoFixModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    handleFixAllIssues();
                    setIsAutoFixModalOpen(false);
                  }}
                  iconLeft={isApplyingChanges ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                  disabled={isApplyingChanges}
                >
                  {isApplyingChanges ? 'Applying Fixes...' : 'Apply All Fixes'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-blue-600 mb-1">Data Quality Issues</h2>
          <p className="text-gray-600">Review and resolve data issues before proceeding with your analysis</p>
        </div>
        <Tooltip content="Fix all detected issues with recommended solutions">
          <Button 
            onClick={() => setIsAutoFixModalOpen(true)}
            variant="success" 
            size="lg"
            iconLeft={<Zap className="h-5 w-5" />}
            disabled={isApplyingChanges || (issueStats.aliasCount === 0 && issueStats.conflictCount === 0 && issueStats.missingCount === 0)}
          >
            {isApplyingChanges ? 'Applying Fixes...' : 'Auto-Fix All Issues'}
          </Button>
        </Tooltip>
      </div>
      
      {/* Main content area with sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main content */}
        <div className="lg:col-span-3">
          <Card variant="bordered" className="overflow-hidden">
            {/* Data quality progress */}
            <div className="px-6 py-4 bg-gray-50 border-b">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Data Quality Score</h3>
                <Badge 
                  variant={issueStats.percentComplete > 70 ? 'success' : issueStats.percentComplete > 40 ? 'warning' : 'error'}
                >
                  {issueStats.percentComplete}% Complete
                </Badge>
              </div>
              <Progress 
                value={issueStats.percentComplete} 
                variant={issueStats.percentComplete > 70 ? 'success' : issueStats.percentComplete > 40 ? 'warning' : 'error'} 
                showLabel={false}
              />
            </div>
            
            <div className="p-6">
              {/* Tabs navigation */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger 
                    value="aliases" 
                    count={issueStats.aliasCount}
                    countVariant="warning"
                  >
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Aliases
                    </div>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="conflicts" 
                    count={issueStats.conflictCount}
                    countVariant="warning"
                  >
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Data Source Conflicts
                    </div>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="missing" 
                    count={issueStats.missingCount}
                    countVariant="error"
                  >
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Missing Data
                    </div>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="aliases" className="space-y-6">
                  {issueStats.aliasCount > 0 ? (
                    <>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start">
                          <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5 mr-3" />
                          <div>
                            <p className="font-medium text-blue-800">About Email Aliases</p>
                            <p className="text-blue-700 text-sm mt-1">
                              We've detected employees with multiple email addresses across different systems. 
                              Consolidating these aliases ensures accurate communication analysis and prevents 
                              data fragmentation.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Employees with Multiple Email Addresses</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          iconLeft={<RefreshCw className="h-4 w-4" />}
                          onClick={handleMergeAllEmails}
                        >
                          Merge All Aliases
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        {employeesWithAliases.map(employee => (
                          <motion.div 
                            key={employee.id} 
                            className="bg-white border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                            initial="hidden"
                            animate="visible"
                            variants={slideIn}
                          >
                            <div className="p-4 border-b bg-gray-50">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                  <Avatar name={employee.name} />
                                  <div>
                                    <h4 className="font-medium">{employee.name}</h4>
                                    <p className="text-sm text-gray-500">
                                      {employee.position || 'Unknown Position'} 
                                      {employee.department && ` • ${employee.department}`}
                                    </p>
                                  </div>
                                </div>
                                <Badge variant="warning">
                                  {employee.emails.length} Email Addresses
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="p-4">
                              <div className="grid md:grid-cols-2 gap-3">
                                {employee.emails.map((email, index) => (
                                  <div key={index} className="flex items-center p-3 bg-gray-50 border rounded-lg">
                                    <Mail className="h-4 w-4 text-gray-500 mr-3" />
                                    <div className="flex-grow">
                                      <div className="font-medium text-sm break-all">{email.address}</div>
                                      <div className="flex items-center mt-1">
                                        {email.source && (
                                          <Badge className="mr-2">
                                            {email.source}
                                          </Badge>
                                        )}
                                        {email.isPrimary && (
                                          <Badge variant="info">
                                            Primary
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              
                              <div className="mt-4 flex justify-between items-center">
                                <Button 
                                  variant="ghost"
                                  size="sm"
                                  iconLeft={<Eye className="h-4 w-4" />}
                                  onClick={() => {
                                    setSelectedEmployee({...employee, issueType: 'alias'});
                                    setIsModalOpen(true);
                                  }}
                                >
                                  View Details
                                </Button>
                                <Button 
                                  onClick={() => handleMergeEmails(employee.id)}
                                  iconLeft={<RefreshCw className="h-4 w-4" />}
                                >
                                  Merge Email Addresses
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="bg-green-100 p-3 rounded-full mb-4">
                        <Check className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-medium text-green-700 mb-2">All Email Aliases Resolved</h3>
                      <p className="text-gray-600 max-w-md">
                        All employee email aliases have been successfully consolidated. 
                        Your data is now optimized for accurate communication analysis.
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="conflicts" className="space-y-6">
                  {issueStats.conflictCount > 0 ? (
                    <>
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start">
                          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5 mr-3" />
                          <div>
                            <p className="font-medium text-amber-800">About Data Source Conflicts</p>
                            <p className="text-amber-700 text-sm mt-1">
                              We've found conflicting information across different data sources for some employees.
                              Resolving these conflicts ensures your analysis is based on consistent, accurate data.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Employees with Conflicting Information</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          iconLeft={<Check className="h-4 w-4" />}
                          onClick={handleApplyResolutions}
                          disabled={isApplyingChanges}
                        >
                          {isApplyingChanges ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Applying...
                            </>
                          ) : (
                            'Apply All Resolutions'
                          )}
                        </Button>
                      </div>
                      
                      <div className="space-y-6">
                        {employeesWithConflicts.map(employee => (
                          <motion.div 
                            key={employee.id} 
                            className="bg-white border border-amber-200 rounded-lg shadow-sm overflow-hidden"
                            initial="hidden"
                            animate="visible"
                            variants={slideIn}
                          >
                            <div className="p-4 border-b bg-amber-50">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                  <Avatar name={employee.name} />
                                  <div>
                                    <h4 className="font-medium">{employee.name}</h4>
                                    <div className="flex items-center mt-1">
                                      <Badge variant="warning" className="mr-2">
                                        {parseInt(employee.id) % 2 === 0 ? "Department Conflict" : "Position Conflict"}
                                      </Badge>
                                      <p className="text-sm text-amber-800">
                                        Conflicting information detected across sources
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <Button 
                                  variant="ghost"
                                  size="sm"
                                  iconLeft={<Eye className="h-4 w-4" />}
                                  onClick={() => {
                                    setSelectedEmployee({...employee, issueType: 'conflict'});
                                    setIsModalOpen(true);
                                  }}
                                >
                                  View Details
                                </Button>
                              </div>
                            </div>
                            
                            <div className="p-4">
                              <h5 className="font-medium mb-3 text-gray-700">Select the correct information:</h5>
                              <div className="grid md:grid-cols-3 gap-4">
                                <div className="bg-white p-4 rounded border hover:shadow-md transition-shadow">
                                  <div className="font-medium mb-2 flex items-center text-gray-800">
                                    <Shield className="h-4 w-4 mr-2 text-blue-600" />
                                    Microsoft 365
                                  </div>
                                  <div className="font-medium">
                                    {parseInt(employee.id) % 2 === 0 ? "Engineering" : "Finance Director"}
                                  </div>
                                  <div className="text-sm text-gray-500 mb-4">
                                    {parseInt(employee.id) % 2 === 0 ? "Software Engineer" : "Finance"}
                                  </div>
                                  <div className="flex justify-center">
                                    <input 
                                      type="radio" 
                                      name={`conflict-${employee.id}`} 
                                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                                    />
                                  </div>
                                </div>
                                
                                <div className="bg-white p-4 rounded border hover:shadow-md transition-shadow">
                                  <div className="font-medium mb-2 flex items-center text-gray-800">
                                    <Shield className="h-4 w-4 mr-2 text-purple-600" />
                                    {parseInt(employee.id) % 2 === 0 ? "Slack" : "Google Workspace"}
                                  </div>
                                  <div className="font-medium">
                                    {parseInt(employee.id) % 2 === 0 ? "Product" : "CFO"}
                                  </div>
                                  <div className="text-sm text-gray-500 mb-4">
                                    {parseInt(employee.id) % 2 === 0 ? "Software Engineer" : "Finance"}
                                  </div>
                                  <div className="flex justify-center">
                                    <input 
                                      type="radio" 
                                      name={`conflict-${employee.id}`} 
                                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                                    />
                                  </div>
                                </div>
                                
                                <div className="bg-white p-4 rounded border border-blue-300 shadow-sm hover:shadow-md transition-shadow">
                                  <div className="font-medium mb-2 flex items-center text-gray-800">
                                    <Shield className="h-4 w-4 mr-2 text-green-600" />
                                    Combined (Recommended)
                                  </div>
                                  <div className="font-medium">
                                    {parseInt(employee.id) % 2 === 0 ? "Engineering" : "Finance Director"}
                                  </div>
                                  <div className="text-sm text-gray-500 mb-4">
                                    {parseInt(employee.id) % 2 === 0 ? "Software Engineer" : "Finance"}
                                  </div>
                                  <div className="flex justify-center">
                                    <input 
                                      type="radio" 
                                      name={`conflict-${employee.id}`} 
                                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                                      defaultChecked 
                                    />
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex justify-end mt-4">
                                <Button 
                                  variant="outline"
                                  className="mr-2"
                                  onClick={() => {}}
                                >
                                  Skip
                                </Button>
                                <Button 
                                  onClick={() => handleApplyResolutions()}
                                >
                                  Apply Resolution
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="bg-green-100 p-3 rounded-full mb-4">
                        <Check className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-medium text-green-700 mb-2">All Conflicts Resolved</h3>
                      <p className="text-gray-600 max-w-md">
                        All data source conflicts have been successfully resolved. 
                        Your employee data is now consistent across all systems.
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="missing" className="space-y-6">
                  {issueStats.missingCount > 0 ? (
                    <>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start">
                          <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5 mr-3" />
                          <div>
                            <p className="font-medium text-red-800">About Missing Data</p>
                            <p className="text-red-700 text-sm mt-1">
                              Some employees have incomplete information critical for analysis.
                              Complete the missing fields or determine how to handle these cases before proceeding.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Employees with Incomplete Information</h3>
                      </div>
                      
                      <div className="space-y-6">
                        {employeesWithMissingData.map(employee => (
                          <motion.div 
                            key={employee.id} 
                            className="bg-white border border-red-200 rounded-lg shadow-sm overflow-hidden"
                            initial="hidden"
                            animate="visible"
                            variants={slideIn}
                          >
                            <div className="p-4 border-b bg-red-50">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                  <Avatar name={employee.name} />
                                  <div>
                                    <h4 className="font-medium">{employee.name}</h4>
                                    <div className="flex items-center mt-1">
                                      <Badge variant="error" className="mr-2">
                                        {parseInt(employee.id) % 2 === 0 ? "High Severity" : "Medium Severity"}
                                      </Badge>
                                      <p className="text-sm text-red-800">
                                        {parseInt(employee.id) % 2 === 0
                                          ? "Missing critical information: Department, Position" 
                                          : "Missing information: Location, Hire Date"}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <Button 
                                  variant="ghost"
                                  size="sm"
                                  iconLeft={<Eye className="h-4 w-4" />}
                                  onClick={() => {
                                    setSelectedEmployee({...employee, issueType: 'missing'});
                                    setIsModalOpen(true);
                                  }}
                                >
                                  View Details
                                </Button>
                              </div>
                            </div>
                            
                            <div className="p-4">
                              <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 p-4 rounded border">
                                  <h5 className="font-medium mb-3 text-gray-700">Available Information</h5>
                                  <div className="space-y-2">
                                    <div className="flex items-center">
                                      <Mail className="h-4 w-4 text-gray-500 mr-2" />
                                      <div className="text-sm">
                                        <span className="font-medium">Email:</span> {employee.emails[0].address}
                                      </div>
                                    </div>
                                    <div className="flex items-center">
                                      <Shield className="h-4 w-4 text-gray-500 mr-2" />
                                      <div className="text-sm">
                                        <span className="font-medium">Sources:</span> {employee.emails[0].source || "Microsoft 365"}
                                      </div>
                                    </div>
                                    {parseInt(employee.id) % 2 === 1 && (
                                      <>
                                        <div className="flex items-center">
                                          <User className="h-4 w-4 text-gray-500 mr-2" />
                                          <div className="text-sm">
                                            <span className="font-medium">Department:</span> Sales
                                          </div>
                                        </div>
                                        <div className="flex items-center">
                                          <User className="h-4 w-4 text-gray-500 mr-2" />
                                          <div className="text-sm">
                                            <span className="font-medium">Position:</span> VP Sales
                                          </div>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="bg-white p-4 rounded border shadow-sm">
                                  <h5 className="font-medium mb-3 text-gray-700">Fill Missing Data</h5>
                                  {parseInt(employee.id) % 2 === 0 ? (
                                    <>
                                      <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                        <select className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500">
                                          <option>Select Department</option>
                                          <option selected>Engineering</option>
                                          <option>Marketing</option>
                                          <option>Sales</option>
                                          <option>Finance</option>
                                          <option>Product</option>
                                        </select>
                                      </div>
                                      <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                                        <input 
                                          type="text" 
                                          placeholder="Enter position" 
                                          defaultValue="Software Engineer" 
                                          className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500" 
                                        />
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                        <select className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500">
                                          <option>Select Location</option>
                                          <option>New York</option>
                                          <option selected>San Francisco</option>
                                          <option>London</option>
                                          <option>Tokyo</option>
                                          <option>Remote</option>
                                        </select>
                                      </div>
                                      <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Hire Date</label>
                                        <input 
                                          type="date" 
                                          defaultValue="2023-04-15" 
                                          className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500" 
                                        />
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                              
                              <div className="mt-4 flex justify-between">
                                <div>
                                  <Tooltip content="Skip this issue and review later">
                                    <Button 
                                      variant="ghost" 
                                      className="mr-2 border border-gray-300 text-gray-700"
                                    >
                                      Skip
                                    </Button>
                                  </Tooltip>
                                  {parseInt(employee.id) % 2 === 0 ? (
                                    <Tooltip content="Remove this employee from analysis due to incomplete data">
                                      <Button 
                                        variant="outline" 
                                        className="border border-red-600 text-red-600"
                                      >
                                        Exclude from Analysis
                                      </Button>
                                    </Tooltip>
                                  ) : (
                                    <Tooltip content="Include this employee with partial information">
                                      <Button 
                                        variant="outline" 
                                        className="border border-gray-500 text-gray-700"
                                      >
                                        Proceed with Partial Data
                                      </Button>
                                    </Tooltip>
                                  )}
                                </div>
                                <Button 
                                  onClick={() => handleSaveInformation(employee.id)}
                                  iconLeft={<Check className="h-4 w-4" />}
                                >
                                  Save Information
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="bg-green-100 p-3 rounded-full mb-4">
                        <Check className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-medium text-green-700 mb-2">All Missing Data Resolved</h3>
                      <p className="text-gray-600 max-w-md">
                        All employee information has been successfully completed. 
                        Your data is now ready for comprehensive analysis.
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </Card>
          
          {/* Data Quality Summary Card */}
          <Card className="mt-6 border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Data Quality Summary</h3>
              <Badge 
                variant={
                  issueStats.totalIssueCount === 0 
                    ? 'success' 
                    : issueStats.totalIssueCount > 5 
                      ? 'error' 
                      : 'warning'
                }
              >
                {issueStats.totalIssueCount} Issues Found
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg border ${
                issueStats.aliasCount > 0 ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'
              }`}>
                <div className="flex items-start">
                  {issueStats.aliasCount > 0 ? (
                    <div className="p-2 bg-amber-100 rounded-full mr-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                    </div>
                  ) : (
                    <div className="p-2 bg-green-100 rounded-full mr-3">
                      <Check className="h-5 w-5 text-green-600" />
                    </div>
                  )}
                  <div>
                    <div className={`font-medium ${
                      issueStats.aliasCount > 0 ? 'text-amber-800' : 'text-green-800'
                    }`}>Email Aliases</div>
                    <div className={`text-sm mt-1 ${issueStats.aliasCount > 0 ? 'text-amber-700' : 'text-green-700'}`}>
                      {issueStats.aliasCount > 0 
                        ? `${issueStats.aliasCount} employees with multiple emails` 
                        : 'All aliases consolidated'}
                    </div>
                    {issueStats.aliasCount > 0 && (
                      <Button 
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-amber-800 hover:bg-amber-100"
                        onClick={() => setActiveTab('aliases')}
                      >
                        Review
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg border ${
                issueStats.conflictCount > 0 ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'
              }`}>
                <div className="flex items-start">
                  {issueStats.conflictCount > 0 ? (
                    <div className="p-2 bg-amber-100 rounded-full mr-3">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                    </div>
                  ) : (
                    <div className="p-2 bg-green-100 rounded-full mr-3">
                      <Check className="h-5 w-5 text-green-600" />
                    </div>
                  )}
                  <div>
                    <div className={`font-medium ${
                      issueStats.conflictCount > 0 ? 'text-amber-800' : 'text-green-800'
                    }`}>Source Conflicts</div>
                    <div className={`text-sm mt-1 ${issueStats.conflictCount > 0 ? 'text-amber-700' : 'text-green-700'}`}>
                      {issueStats.conflictCount > 0 
                        ? `${issueStats.conflictCount} employees with conflicting data` 
                        : 'All conflicts resolved'}
                    </div>
                    {issueStats.conflictCount > 0 && (
                      <Button 
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-amber-800 hover:bg-amber-100"
                        onClick={() => setActiveTab('conflicts')}
                      >
                        Review
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg border ${
                issueStats.missingCount > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
              }`}>
                <div className="flex items-start">
                  {issueStats.missingCount > 0 ? (
                    <div className="p-2 bg-red-100 rounded-full mr-3">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                  ) : (
                    <div className="p-2 bg-green-100 rounded-full mr-3">
                      <Check className="h-5 w-5 text-green-600" />
                    </div>
                  )}
                  <div>
                    <div className={`font-medium ${
                      issueStats.missingCount > 0 ? 'text-red-800' : 'text-green-800'
                    }`}>Missing Data</div>
                    <div className={`text-sm mt-1 ${issueStats.missingCount > 0 ? 'text-red-700' : 'text-green-700'}`}>
                      {issueStats.missingCount > 0 
                        ? `${issueStats.missingCount} employees with incomplete information` 
                        : 'All missing data completed'}
                    </div>
                    {issueStats.missingCount > 0 && (
                      <Button 
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-red-800 hover:bg-red-100"
                        onClick={() => setActiveTab('missing')}
                      >
                        Review
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-gray-50 p-4 rounded-lg border">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5 mr-3" />
                <div className="text-gray-700">
                  {(issueStats.aliasCount > 0 || issueStats.conflictCount > 0 || issueStats.missingCount > 0) 
                    ? "Resolve data quality issues before proceeding to analyze employee data. Unresolved issues may impact analysis accuracy."
                    : "All data quality issues have been resolved. Your data is now ready for comprehensive analysis."}
                </div>
              </div>
              
              {(issueStats.aliasCount === 0 && issueStats.conflictCount === 0 && issueStats.missingCount === 0) && (
                <div className="mt-4 flex justify-end">
                  <Button 
                    variant="success"
                    iconLeft={<BarChart className="h-4 w-4" />}
                  >
                    Proceed to Analysis
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            
            {/* Progress Overview */}
            <Card variant="default">
              <h3 className="font-semibold mb-4">Resolution Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Email Aliases</span>
                    <span className="text-sm font-medium">
                      {issueStats.aliasCount === 0 ? 'Complete' : `${Math.max(0, 100 - (issueStats.aliasCount * 10))}%`}
                    </span>
                  </div>
                  <Progress 
                    value={Math.max(0, 100 - (issueStats.aliasCount * 10))} 
                    variant={issueStats.aliasCount === 0 ? 'success' : 'default'} 
                    showLabel={false}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Data Conflicts</span>
                    <span className="text-sm font-medium">
                      {issueStats.conflictCount === 0 ? 'Complete' : `${Math.max(0, 100 - (issueStats.conflictCount * 12))}%`}
                    </span>
                  </div>
                  <Progress 
                    value={Math.max(0, 100 - (issueStats.conflictCount * 12))} 
                    variant={issueStats.conflictCount === 0 ? 'success' : 'warning'} 
                    showLabel={false}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Missing Data</span>
                    <span className="text-sm font-medium">
                      {issueStats.missingCount === 0 ? 'Complete' : `${Math.max(0, 100 - (issueStats.missingCount * 15))}%`}
                    </span>
                  </div>
                  <Progress 
                    value={Math.max(0, 100 - (issueStats.missingCount * 15))} 
                    variant={issueStats.missingCount === 0 ? 'success' : 'error'} 
                    showLabel={false}
                  />
                </div>
                
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                    <span className="text-sm font-medium">
                      {issueStats.percentComplete}%
                    </span>
                  </div>
                  <Progress 
                    value={issueStats.percentComplete} 
                    variant={
                      issueStats.percentComplete === 100 
                        ? 'success' 
                        : issueStats.percentComplete > 70 
                          ? 'default' 
                          : issueStats.percentComplete > 40 
                            ? 'warning' 
                            : 'error'
                    } 
                    showLabel={false}
                  />
                </div>
              </div>
            </Card>
            
            {/* Suggested Fixes */}
            {suggestedEmployees.length > 0 && (
              <Card variant="default">
                <h3 className="font-semibold mb-4">Suggested Fixes</h3>
                <div className="space-y-3">
                  {suggestedEmployees.map(employee => (
                    <div 
                      key={employee.id}
                      className={`p-3 rounded-lg border ${
                        employee.issueType === 'alias' 
                          ? 'bg-amber-50 border-amber-200' 
                          : employee.issueType === 'conflict' 
                            ? 'bg-amber-50 border-amber-200' 
                            : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <Avatar name={employee.name} size="sm" className="mr-2" />
                        <div className="flex-grow">
                          <div className="font-medium text-sm">{employee.name}</div>
                          <div className={`text-xs ${
                            employee.issueType === 'alias' 
                              ? 'text-amber-800' 
                              : employee.issueType === 'conflict' 
                                ? 'text-amber-800' 
                                : 'text-red-800'
                          }`}>
                            {employee.issueType === 'alias' 
                              ? 'Multiple Email Aliases' 
                              : employee.issueType === 'conflict' 
                                ? 'Data Source Conflict' 
                                : 'Missing Information'}
                          </div>
                        </div>
                        <Button 
                          variant="ghost"
                          size="sm"
                          className="p-1"
                          onClick={() => {
                            setSelectedEmployee({...employee});
                            setIsModalOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4 text-gray-500" />
                        </Button>
                      </div>
                      <Button 
                        size="sm"
                        fullWidth
                        variant={employee.issueType === 'missing' ? 'danger' : 'warning'}
                        className={
                          employee.issueType === 'alias' 
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-300' 
                            : employee.issueType === 'conflict' 
                              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-300' 
                              : 'bg-red-100 text-red-800 hover:bg-red-200 border-red-300'
                        }
                        onClick={() => {
                          if (employee.issueType === 'alias') {
                            handleMergeEmails(employee.id);
                          } else if (employee.issueType === 'conflict') {
                            handleApplyResolutions();
                          } else {
                            handleSaveInformation(employee.id);
                          }
                        }}
                      >
                        {employee.issueType === 'alias' 
                          ? 'Merge Emails' 
                          : employee.issueType === 'conflict' 
                            ? 'Resolve Conflict' 
                            : 'Complete Information'}
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}
            
            {/* Help & Resources */}
            <Card variant="default">
              <h3 className="font-semibold mb-4">Help & Resources</h3>
              <Accordion
                items={[
                  {
                    id: 'faq-1',
                    title: 'Why do I need to resolve these issues?',
                    content: (
                      <div className="text-sm text-gray-700">
                        <p>Resolving data quality issues ensures that your analysis is accurate. Duplicate email addresses can skew metrics, while missing or conflicting data can lead to incomplete insights.</p>
                      </div>
                    )
                  },
                  {
                    id: 'faq-2',
                    title: 'What does "Auto-Fix" do?',
                    content: (
                      <div className="text-sm text-gray-700">
                        <p>The Auto-Fix feature applies intelligent recommendations to resolve all detected issues at once. It will merge email aliases, resolve conflicts using the most reliable sources, and fill in missing data based on patterns and user history.</p>
                      </div>
                    )
                  },
                  {
                    id: 'faq-3',
                    title: 'How should I handle missing data?',
                    content: (
                      <div className="text-sm text-gray-700">
                        <p>For each employee with missing data, you can:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                          <li>Complete the information manually</li>
                          <li>Proceed with partial data (for non-critical fields)</li>
                          <li>Exclude the employee from analysis (if missing critical information)</li>
                        </ul>
                      </div>
                    )
                  }
                ]}
              />
            </Card>
          </div>
        </div>
      </div>
      
      {/* Modals */}
      <EmployeeModal />
      <AutoFixModal />
    </div>
  );
};

// Added enhanced type for IssueStats
const defaultIssueStats: IssueStats = {
  aliasCount: 3,
  conflictCount: 2,
  missingCount: 4,
  totalIssueCount: 9,
  percentComplete: 65
};

export default DataQualityIssues;