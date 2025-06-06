"use client"

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle, 
  RefreshCw, 
  Merge, 
  Loader2,
  Check,
  X,
  Eye
} from "lucide-react";

// Import the DataQualityIssues component
import DataQualityIssues, { type Email, type Employee, type IssueStats } from './DataQualityIssues';

// Constants
const ITEMS_PER_PAGE = 10;
const TOTAL_EMPLOYEES = 242;

// Reusable component interfaces
interface PaginationControlProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'success' | 'error' | 'warning' | 'info' | 'default';
}

interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  variant?: 'outline' | 'ghost' | 'default' | 'danger' | 'success';
  title?: string;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
  isLoading?: boolean;
}

interface EmployeeDetailModalProps {
  employee: Employee | null;
  onClose: () => void;
  onUpdateInclusion: (employeeId: string, newStatus: boolean) => void;
}

interface EmployeeTableProps {
  employees: Employee[];
  onViewDetails: (employee: Employee) => void;
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  onSort: (column: string) => void;
  selectedEmployees: string[];
  onToggleSelect: (employeeId: string) => void;
  onToggleSelectAll: (checked: boolean) => void;
}

// Mock data generation utilities
const generateMockEmployee = (id: number): Employee => {
  const nameIndex = id % 20;
  const departmentIndex = id % 5;
  const hasIssue = id % 6 === 0 || id % 7 === 0 || id % 9 === 0;
  const issueType = id % 9 === 0 ? 'missing' : id % 7 === 0 ? 'conflict' : id % 6 === 0 ? 'alias' : null;
  const multipleEmails = id % 5 === 0 || id % 7 === 0;
  
  const firstNames = ['John', 'Jane', 'Robert', 'Michael', 'Emily', 'David', 'Sarah', 'Alex', 'Jennifer', 'Jessica', 
                      'William', 'Lisa', 'James', 'Mary', 'Thomas', 'Patricia', 'Charles', 'Linda', 'Daniel', 'Barbara'];
  const lastNames = ['Smith', 'Cooper', 'Johnson', 'Chen', 'Rodriguez', 'Kim', 'Williams', 'Thompson', 'Taylor', 'Lee',
                    'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Harris', 'Clark', 'Lewis', 'Young', 'Walker'];
  const departments = ['Marketing', 'Sales', 'Engineering', 'Finance', 'Product'];
  const positions = [
    ['Marketing Manager', 'Content Strategist', 'Digital Marketing Specialist', 'Brand Manager', 'Marketing Analyst'],
    ['Sales Director', 'Account Executive', 'Sales Representative', 'VP Sales', 'Sales Analyst'],
    ['Software Engineer', 'Senior Developer', 'DevOps Engineer', 'QA Engineer', 'Engineering Manager'],
    ['Finance Director', 'Financial Analyst', 'Accountant', 'CFO', 'Finance Manager'],
    ['Product Manager', 'Product Owner', 'UX Designer', 'Product Analyst', 'Product Marketing Manager']
  ];
  
  const firstName = firstNames[nameIndex];
  const lastName = lastNames[id % lastNames.length];
  const department = departments[departmentIndex];
  const position = positions[departmentIndex][id % 5];
  
  const mainEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`;
  const emails: Email[] = [{ address: mainEmail, source: "Primary", isPrimary: true }];
  
  if (multipleEmails) {
    if (id % 2 === 0) {
      emails.push({ 
        address: `${firstName.toLowerCase()[0]}${lastName.toLowerCase()}@company.com`, 
        source: "Google Workspace",
        isPrimary: false
      });
    } else {
      emails.push({ 
        address: `${firstName.toLowerCase()}.${lastName.toLowerCase()[0]}@company.com`, 
        source: "Microsoft 365",
        isPrimary: false
      });
    }
    
    if (id % 10 === 0) {
      emails.push({ 
        address: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`.replace('.', '_'), 
        source: "Slack",
        isPrimary: false
      });
    }
  }
  
  const base = 500 + (id * 7) % 800;
  const emailCount = base + (id * 13) % 500;
  const chatCount = base - (id * 11) % 300;
  const meetingCount = 50 + (id * 3) % 100;
  const fileAccessCount = 100 + (id * 17) % 300;
  
  const isIncluded = id % 13 !== 0;
  
  return {
    id: id.toString(),
    name: `${firstName} ${lastName}`,
    emails,
    emailCount,
    chatCount,
    meetingCount,
    fileAccessCount,
    department: hasIssue && issueType === 'missing' ? undefined : department,
    position: hasIssue && issueType === 'missing' ? undefined : position,
    hasQualityIssues: hasIssue,
    issueType,
    isIncluded,
  };
};

// Reusable Components
const Badge: React.FC<BadgeProps> = ({ children, className = '', variant = 'default' }) => {
  const variantClasses = {
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    warning: 'bg-amber-100 text-amber-800',
    info: 'bg-blue-100 text-blue-800',
    default: 'bg-gray-100 text-gray-800'
  };

  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
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
  title,
  type = 'button',
  ariaLabel,
  isLoading = false
}) => {
  const variantClasses = {
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
    ghost: 'bg-transparent hover:bg-gray-50 text-gray-700',
    default: 'border border-transparent text-white bg-blue-600 hover:bg-blue-700',
    danger: 'border border-transparent text-white bg-red-600 hover:bg-red-700',
    success: 'border border-transparent text-white bg-green-600 hover:bg-green-700'
  };

  const baseClass = "inline-flex items-center justify-center px-4 py-2 rounded-md shadow-sm text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";
  const variantClass = variantClasses[variant];
  const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "";
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClass} ${variantClass} ${disabledClass} ${className}`}
      title={title}
      aria-label={ariaLabel}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {children}
        </>
      ) : children}
    </button>
  );
};

const PaginationControl: React.FC<PaginationControlProps> = ({ 
  currentPage, 
  totalPages, 
  itemsPerPage, 
  totalItems, 
  onPageChange 
}) => {
  const pageNumbers = useMemo(() => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
    } else if (currentPage >= totalPages - 2) {
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        pages.push(i);
      }
    }
    return pages;
  }, [currentPage, totalPages]);

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div className="flex-1 flex justify-between sm:hidden">
        <Button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          variant="outline"
          ariaLabel="Previous page"
        >
          Previous
        </Button>
        <Button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          variant="outline"
          ariaLabel="Next page"
        >
          Next
        </Button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{startItem}</span> to{" "}
            <span className="font-medium">{endItem}</span>{" "}
            of <span className="font-medium">{totalItems}</span> results
          </p>
        </div>
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Previous page"
          >
            <span className="sr-only">Previous</span>
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          {pageNumbers.map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                currentPage === pageNum
                  ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
              aria-current={currentPage === pageNum ? "page" : undefined}
              aria-label={`Page ${pageNum}`}
            >
              {pageNum}
            </button>
          ))}
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Next page"
          >
            <span className="sr-only">Next</span>
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </div>
  );
};

const EmployeeTable: React.FC<EmployeeTableProps> = ({ 
  employees, 
  onViewDetails, 
  sortColumn, 
  sortDirection, 
  onSort, 
  selectedEmployees, 
  onToggleSelect, 
  onToggleSelectAll 
}) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th scope="col" className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={employees.length > 0 && employees.every(emp => selectedEmployees.includes(emp.id))}
                  onChange={(e) => onToggleSelectAll(e.target.checked)}
                  aria-label="Select all employees on this page"
                />
              </th>
              <th 
                scope="col" 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" 
                onClick={() => onSort('name')}
              >
                Name
                {sortColumn === 'name' && (sortDirection === 'asc' ? <span>↑</span> : <span>↓</span>)}
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th 
                scope="col" 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" 
                onClick={() => onSort('emailCount')}
              >
                Email Count
                {sortColumn === 'emailCount' && (sortDirection === 'asc' ? <span>↑</span> : <span>↓</span>)}
              </th>
              <th 
                scope="col" 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" 
                onClick={() => onSort('chatCount')}
              >
                Chat Count
                {sortColumn === 'chatCount' && (sortDirection === 'asc' ? <span>↑</span> : <span>↓</span>)}
              </th>
              <th 
                scope="col" 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" 
                onClick={() => onSort('meetingCount')}
              >
                Meeting Count
                {sortColumn === 'meetingCount' && (sortDirection === 'asc' ? <span>↑</span> : <span>↓</span>)}
              </th>
              <th 
                scope="col" 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" 
                onClick={() => onSort('fileAccessCount')}
              >
                File Access
                {sortColumn === 'fileAccessCount' && (sortDirection === 'asc' ? <span>↑</span> : <span>↓</span>)}
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {employees.map(employee => {
              const shouldHighlight = employee.hasQualityIssues || employee.emails.length > 1;
              const rowClassName = shouldHighlight 
                ? "bg-red-50 hover:bg-red-100" 
                : "hover:bg-gray-50";
                
              return (
                <tr key={employee.id} className={rowClassName}>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedEmployees.includes(employee.id)}
                      onChange={() => onToggleSelect(employee.id)}
                      aria-label={`Select ${employee.name}`}
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 flex items-center">
                      {employee.name}
                      {employee.hasQualityIssues && (
                        <Badge variant="warning" className="ml-2">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Issue
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {employee.emails[0].address}
                      {employee.emails.length > 1 && (
                        <Badge variant="warning" className="ml-2">
                          +{employee.emails.length - 1} more
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{employee.emailCount.toLocaleString()}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{employee.chatCount.toLocaleString()}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{employee.meetingCount.toLocaleString()}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{employee.fileAccessCount.toLocaleString()}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Badge variant={employee.isIncluded ? "success" : "error"}>
                      {employee.isIncluded ? "Included" : "Excluded"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={() => onViewDetails(employee)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center focus:outline-none focus:underline"
                      aria-label={`View details for ${employee.name}`}
                    >
                      <Eye className="h-4 w-4 mr-1" aria-hidden="true" />
                      View Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({ 
  employee, 
  onClose,
  onUpdateInclusion 
}) => {
  if (!employee) return null;
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="employee-detail-title"
      onKeyDown={handleKeyDown}
    >
      <div 
        className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto focus:outline-none"
        tabIndex={-1}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 id="employee-detail-title" className="text-xl font-semibold text-gray-900">{employee.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Department</p>
            <p className="font-medium">{employee.department || "Not specified"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Position</p>
            <p className="font-medium">{employee.position || "Not specified"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Email Count</p>
            <p className="font-medium">{employee.emailCount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Chat Count</p>
            <p className="font-medium">{employee.chatCount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Meeting Count</p>
            <p className="font-medium">{employee.meetingCount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">File Access Count</p>
            <p className="font-medium">{employee.fileAccessCount.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-medium mb-2">Email Addresses</h3>
          <div className="space-y-2" role="list">
            {employee.emails.map((email, index) => (
              <div 
                key={index} 
                className="flex items-center p-3 border rounded bg-gray-50"
                role="listitem"
              >
                <div className="flex-grow">
                  {email.address}
                  {email.source && (
                    <Badge 
                      variant={email.isPrimary ? "info" : "default"} 
                      className="ml-2"
                    >
                      {email.source}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center mb-6">
          <p className="text-sm text-gray-500 mr-2">Inclusion Status:</p>
          <Badge variant={employee.isIncluded ? "success" : "error"}>
            {employee.isIncluded ? "Included" : "Excluded"}
          </Badge>
        </div>
        
        <div className="flex justify-between border-t pt-4">
          <Button 
            variant="outline"
            onClick={() => {
              onUpdateInclusion(employee.id, !employee.isIncluded);
              onClose();
            }}
            ariaLabel={employee.isIncluded ? "Exclude employee" : "Include employee"}
          >
            {employee.isIncluded ? "Exclude Employee" : "Include Employee"}
          </Button>
          <Button onClick={onClose} ariaLabel="Close modal">Close</Button>
        </div>
      </div>
    </div>
  );
};

// Main Component
const DataOverviewPage: React.FC = () => {
  const [isCollecting, setIsCollecting] = useState<boolean>(false);
  const [dataCollected, setDataCollected] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [employeesWithAliases, setEmployeesWithAliases] = useState<Employee[]>([]);
  const [employeesWithConflicts, setEmployeesWithConflicts] = useState<Employee[]>([]);
  const [employeesWithMissingData, setEmployeesWithMissingData] = useState<Employee[]>([]);
  const [isApplyingChanges, setIsApplyingChanges] = useState<boolean>(false);
  const [issueStats, setIssueStats] = useState<IssueStats>({
    aliasCount: 18,
    conflictCount: 14,
    missingCount: 23
  });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedInclusion, setSelectedInclusion] = useState<string>('all');
  const [sortColumn, setSortColumn] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  const router = useRouter();
  const departments = ['Marketing', 'Sales', 'Engineering', 'Finance', 'Product'];

  // Memoized Data Computations
  const filteredEmployees = useMemo(() => {
    return allEmployees.filter(employee => {
      const matchesSearch = 
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.emails.some(email => email.address.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment;
      const matchesInclusion = selectedInclusion === 'all' || 
                               (selectedInclusion === 'included' && employee.isIncluded) ||
                               (selectedInclusion === 'excluded' && !employee.isIncluded);
      return matchesSearch && matchesDepartment && matchesInclusion;
    });
  }, [allEmployees, searchTerm, selectedDepartment, selectedInclusion]);

  const sortedEmployees = useMemo(() => {
    const sorted = [...filteredEmployees];
    sorted.sort((a, b) => {
      let aValue, bValue;
      switch (sortColumn) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'emailCount':
          aValue = a.emailCount;
          bValue = b.emailCount;
          break;
        case 'chatCount':
          aValue = a.chatCount;
          bValue = b.chatCount;
          break;
        case 'meetingCount':
          aValue = a.meetingCount;
          bValue = b.meetingCount;
          break;
        case 'fileAccessCount':
          aValue = a.fileAccessCount;
          bValue = b.fileAccessCount;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredEmployees, sortColumn, sortDirection]);

  const totalPages = Math.ceil(sortedEmployees.length / ITEMS_PER_PAGE);

  const currentPageData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return sortedEmployees.slice(start, end);
  }, [sortedEmployees, currentPage]);

  // Adjust currentPage if out of bounds
  useEffect(() => {
    const maxPage = Math.max(1, totalPages);
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [totalPages, currentPage]);

  // Sync issue lists with allEmployees
  useEffect(() => {
    setEmployeesWithAliases(allEmployees.filter(emp => emp.issueType === 'alias'));
    setEmployeesWithConflicts(allEmployees.filter(emp => emp.issueType === 'conflict'));
    setEmployeesWithMissingData(allEmployees.filter(emp => emp.issueType === 'missing'));
    setIssueStats({
      aliasCount: allEmployees.filter(emp => emp.issueType === 'alias').length,
      conflictCount: allEmployees.filter(emp => emp.issueType === 'conflict').length,
      missingCount: allEmployees.filter(emp => emp.issueType === 'missing').length
    });
  }, [allEmployees]);

  // Handlers
  const generateSampleIssueData = useCallback((type: 'alias' | 'conflict' | 'missing', count: number = 3): Employee[] => {
    const result: Employee[] = [];
    let startId: number = 0;
    switch (type) {
      case 'alias': startId = 10; break;
      case 'conflict': startId = 30; break;
      case 'missing': startId = 50; break;
    }
    for (let i = 0; i < count; i++) {
      const mockEmployee = generateMockEmployee(startId + i);
      mockEmployee.hasQualityIssues = true;
      mockEmployee.issueType = type;
      if (type === 'alias' && mockEmployee.emails.length === 1) {
        mockEmployee.emails.push({ 
          address: mockEmployee.emails[0].address.replace('.', '_'), 
          source: "Google Workspace",
          isPrimary: false
        });
      }
      result.push(mockEmployee);
    }
    return result;
  }, []);

  const handleCollectData = useCallback((): void => {
    setIsCollecting(true);
    setTimeout(() => {
      const generatedEmployees = Array.from({ length: TOTAL_EMPLOYEES }, (_, i) => generateMockEmployee(i + 1));
      setAllEmployees(generatedEmployees);
      setDataCollected(true);
      setIsCollecting(false);
    }, 2000);
  }, []);

  const handleBack = useCallback((): void => {
    router.push('/components/FirstTimeSetUp/employees');
  }, [router]);

  const handleNext = useCallback((): void => {
    router.push('/components/FirstTimeSetUp/Anonymization');
  }, [router]);

  const handleViewDetails = useCallback((employee: Employee): void => {
    setSelectedEmployee(employee);
    setShowDetailModal(true);
  }, []);

  const handleCloseModal = useCallback((): void => {
    setShowDetailModal(false);
  }, []);

  const handleUpdateInclusionStatus = useCallback((employeeId: string, newStatus: boolean): void => {
    setAllEmployees(prev => 
      prev.map(emp => 
        emp.id === employeeId ? {...emp, isIncluded: newStatus} : emp
      )
    );
  }, []);

  const handleMergeEmails = useCallback((employeeId: string): void => {
    setAllEmployees(prev => 
      prev.map(emp => {
        if (emp.id === employeeId) {
          const primaryEmail = emp.emails.find(email => email.isPrimary) || emp.emails[0];
          return {
            ...emp,
            emails: [primaryEmail],
            hasQualityIssues: emp.issueType === 'alias' ? false : emp.hasQualityIssues,
            issueType: emp.issueType === 'alias' ? null : emp.issueType
          };
        }
        return emp;
      })
    );
  }, []);

  const handleMergeAllEmails = useCallback((): void => {
    setIsApplyingChanges(true);
    setTimeout(() => {
      setAllEmployees(prev => 
        prev.map(employee => {
          if (employee.emails.length > 1) {
            const primaryEmail = employee.emails.find(email => email.isPrimary) || employee.emails[0];
            return {
              ...employee,
              emails: [primaryEmail],
              hasQualityIssues: employee.issueType !== 'alias' && employee.hasQualityIssues,
              issueType: employee.issueType === 'alias' ? null : employee.issueType
            };
          }
          return employee;
        })
      );
      setIsApplyingChanges(false);
    }, 1500);
  }, []);

  const handleApplyResolutions = useCallback((): void => {
    setIsApplyingChanges(true);
    setTimeout(() => {
      setAllEmployees(prev => 
        prev.map(emp => {
          if (emp.hasQualityIssues && emp.issueType === 'conflict') {
            return { ...emp, hasQualityIssues: false, issueType: null };
          }
          return emp;
        })
      );
      setIsApplyingChanges(false);
    }, 1500);
  }, []);

  const handleSaveInformation = useCallback((employeeId: string): void => {
    setAllEmployees(prev => 
      prev.map(emp => {
        if (emp.id === employeeId) {
          return {
            ...emp,
            department: parseInt(emp.id) % 2 === 0 ? "Engineering" : emp.department || "Sales",
            position: parseInt(emp.id) % 2 === 0 ? "Software Engineer" : emp.position || "VP Sales",
            hasQualityIssues: emp.issueType === 'missing' ? false : emp.hasQualityIssues,
            issueType: emp.issueType === 'missing' ? null : emp.issueType
          };
        }
        return emp;
      })
    );
  }, []);

  const handleFixAllIssues = useCallback((): void => {
    setIsApplyingChanges(true);
    setTimeout(() => {
      setAllEmployees(prev => 
        prev.map(employee => {
          const primaryEmail = employee.emails.find(email => email.isPrimary) || employee.emails[0];
          return {
            ...employee,
            emails: [primaryEmail],
            hasQualityIssues: false,
            issueType: null,
            department: employee.department || "Not Specified",
            position: employee.position || "Not Specified"
          };
        })
      );
      setIsApplyingChanges(false);
    }, 2000);
  }, []);

  const handleSort = useCallback((column: string) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  }, [sortColumn]);

  const handleToggleSelect = useCallback((employeeId: string) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId) 
        : [...prev, employeeId]
    );
  }, []);

  const handleToggleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      const pageIds = currentPageData.map(emp => emp.id);
      setSelectedEmployees(prev => [...new Set([...prev, ...pageIds])]);
    } else {
      const pageIds = currentPageData.map(emp => emp.id);
      setSelectedEmployees(prev => prev.filter(id => !pageIds.includes(id)));
    }
  }, [currentPageData]);

  const handleBulkAction = useCallback((action: 'include' | 'exclude') => {
    const newStatus = action === 'include';
    setAllEmployees(prev => 
      prev.map(emp => 
        selectedEmployees.includes(emp.id) ? {...emp, isIncluded: newStatus} : emp
      )
    );
    setSelectedEmployees([]);
  }, [selectedEmployees]);

  const handleExport = useCallback(() => {
    const csvContent = [
      ['ID', 'Name', 'Email', 'Email Count', 'Chat Count', 'Meeting Count', 'File Access Count', 'Department', 'Position', 'Status'],
      ...sortedEmployees.map(emp => [
        emp.id,
        emp.name,
        emp.emails[0].address,
        emp.emailCount,
        emp.chatCount,
        emp.meetingCount,
        emp.fileAccessCount,
        emp.department || 'Not Specified',
        emp.position || 'Not Specified',
        emp.isIncluded ? 'Included' : 'Excluded'
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'employee_data.csv';
    link.click();
  }, [sortedEmployees]);

  const totalIssues = useMemo(() => 
    issueStats.aliasCount + issueStats.conflictCount + issueStats.missingCount, 
  [issueStats]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Data Overview</h1>
        <p className="text-gray-600 mt-2">Collect and review data for all employees before analysis.</p>
      </header>

      <section className="bg-white shadow rounded-lg p-6 mb-6" aria-labelledby="data-collection-heading">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
          <div className="mb-4 md:mb-0">
            <h2 id="data-collection-heading" className="text-lg font-semibold text-blue-600">Collect Data</h2>
            <p className="text-gray-500">Run data collection to gather communication information for all employees.</p>
          </div>
          <Button 
            onClick={handleCollectData}
            disabled={isCollecting}
            isLoading={isCollecting}
            ariaLabel="Run data collection"
          >
            {isCollecting ? 'Collecting Data...' : 'Run Data Collection'}
          </Button>
        </div>

        {isCollecting && (
          <div className="text-blue-600 mt-4 font-semibold flex items-center" aria-live="polite">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            Data collection in progress...
          </div>
        )}

        {dataCollected && !isCollecting && (
          <>
            <div className="flex items-center text-green-600 mb-6" aria-live="polite">
              <Check className="mr-2 h-5 w-5" aria-hidden="true" />
              <span className="font-medium">Data collection complete! Information gathered for {allEmployees.length} employees.</span>
            </div>

            <section aria-labelledby="employee-data-heading" className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 id="employee-data-heading" className="text-lg font-semibold text-blue-600">Employee Data</h2>
                <div className="flex items-center space-x-2">
                  {totalIssues > 0 && (
                    <Badge variant="warning" className="mr-2">
                      <AlertTriangle className="h-3 w-3 mr-1" aria-hidden="true" />
                      {totalIssues} issues found
                    </Badge>
                  )}
                  <Button 
                    onClick={handleMergeAllEmails}
                    variant="outline" 
                    className="text-blue-600 border-blue-600"
                    disabled={isApplyingChanges || issueStats.aliasCount === 0}
                    isLoading={isApplyingChanges && issueStats.aliasCount > 0}
                    ariaLabel="Merge all email addresses"
                  >
                    {!isApplyingChanges && <Merge className="mr-2 h-4 w-4" aria-hidden="true" />}
                    Merge All Emails
                  </Button>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex flex-wrap gap-4">
                    <div>
                      <label htmlFor="search" className="sr-only">Search</label>
                      <input
                        id="search"
                        type="text"
                        placeholder="Search by name or email"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Search employees"
                      />
                    </div>
                    <div>
                      <label htmlFor="department" className="sr-only">Department</label>
                      <select
                        id="department"
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Filter by department"
                      >
                        <option value="all">All Departments</option>
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="inclusion" className="sr-only">Inclusion Status</label>
                      <select
                        id="inclusion"
                        value={selectedInclusion}
                        onChange={(e) => setSelectedInclusion(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Filter by inclusion status"
                      >
                        <option value="all">All Statuses</option>
                        <option value="included">Included</option>
                        <option value="excluded">Excluded</option>
                      </select>
                    </div>
                  </div>
                  <Button 
                    onClick={handleExport} 
                    variant="outline"
                    ariaLabel="Export data to CSV"
                  >
                    Export to CSV
                  </Button>
                </div>
                {selectedEmployees.length > 0 && (
                  <div className="flex items-center space-x-4">
                    <span>{selectedEmployees.length} employees selected</span>
                    <Button 
                      onClick={() => handleBulkAction('include')}
                      ariaLabel="Include selected employees"
                    >
                      Include Selected
                    </Button>
                    <Button 
                      onClick={() => handleBulkAction('exclude')}
                      ariaLabel="Exclude selected employees"
                    >
                      Exclude Selected
                    </Button>
                  </div>
                )}
              </div>

              {sortedEmployees.length === 0 ? (
                <div className="text-center py-4 text-gray-500">No employees found matching the criteria.</div>
              ) : (
                <EmployeeTable 
                  employees={currentPageData} 
                  onViewDetails={handleViewDetails}
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  selectedEmployees={selectedEmployees}
                  onToggleSelect={handleToggleSelect}
                  onToggleSelectAll={handleToggleSelectAll}
                />
              )}
              
              <PaginationControl 
                currentPage={currentPage} 
                totalPages={totalPages}
                itemsPerPage={ITEMS_PER_PAGE}
                totalItems={sortedEmployees.length} 
                onPageChange={setCurrentPage} 
              />
            </section>

            <DataQualityIssues
              employeesWithAliases={employeesWithAliases}
              employeesWithConflicts={employeesWithConflicts}
              employeesWithMissingData={employeesWithMissingData}
              issueStats={issueStats}
              isApplyingChanges={isApplyingChanges}
              handleMergeEmails={handleMergeEmails}
              handleApplyResolutions={handleApplyResolutions}
              handleSaveInformation={handleSaveInformation}
              handleFixAllIssues={handleFixAllIssues}
              handleMergeAllEmails={handleMergeAllEmails}
            />
          </>
        )}
      </section>

      <div className="flex justify-between mt-6 mb-6">
        <Button 
          onClick={handleBack} 
          variant="outline"
          ariaLabel="Go to previous page"
        >
          <ChevronLeft className="mr-1 h-4 w-4" aria-hidden="true" />
          Previous
        </Button>
        <Button 
          onClick={handleNext}
          disabled={!dataCollected}
          title={!dataCollected ? "Please collect data before proceeding" : undefined}
          ariaLabel="Go to next page"
        >
          Next
          <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
        </Button>
      </div>

      {!dataCollected && !isCollecting && (
        <div className="text-sm text-gray-500 text-center mt-2" aria-live="polite">
          Run data collection to enable the Next button
        </div>
      )}

      {selectedEmployee && showDetailModal && (
        <EmployeeDetailModal 
          employee={selectedEmployee} 
          onClose={handleCloseModal}
          onUpdateInclusion={handleUpdateInclusionStatus}
        />
      )}
    </div>
  );
};

export default DataOverviewPage;