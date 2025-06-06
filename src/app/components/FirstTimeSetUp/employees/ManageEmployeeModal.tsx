"use client";

import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronDown, ChevronUp, Download, Upload, AlertTriangle, Check, MoreHorizontal, Filter } from 'lucide-react';
import { Employee } from '../../../lib/types';
import { employeeService } from '../../../lib/services/employeeService';
import EmployeeDetailModal from './employeeDetailModal';
import AddEmployeeModal from './AddEmployeeModal';

interface ManageEmployeesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEmployeeStatusChange: () => void;
}

type SortField = 'name' | 'email' | 'department' | 'position' | 'location' | 'status';
type SortDirection = 'asc' | 'desc';

const ManageEmployeesModal: React.FC<ManageEmployeesModalProps> = ({ 
    isOpen, 
    onClose,
    onEmployeeStatusChange
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [isEmployeeDetailOpen, setIsEmployeeDetailOpen] = useState(false);
    const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [showBulkActionMenu, setShowBulkActionMenu] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState<{show: boolean, action: string, message: string}>({
        show: false,
        action: '',
        message: ''
    });
    const [actionInProgress, setActionInProgress] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    
    // Filters
    const [departmentFilter, setDepartmentFilter] = useState<string>('All Departments');
    const [locationFilter, setLocationFilter] = useState<string>('All Locations');
    const [statusFilter, setStatusFilter] = useState<string>('All Status');
    
    // Sorting
    const [sortField, setSortField] = useState<SortField>('name');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    
    const employeesPerPage = 6;
    const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);
    const bulkActionMenuRef = useRef<HTMLDivElement>(null);

    // Load employees when modal opens
    useEffect(() => {
        const loadEmployees = async () => {
            if (isOpen) {
                setIsLoading(true);
                try {
                    const loadedEmployees = await employeeService.getEmployees();
                    setEmployees(loadedEmployees);
                    setFilteredEmployees(loadedEmployees);
                } catch (error) {
                    console.error("Error loading employees:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        
        loadEmployees();
    }, [isOpen]);

    // Handle clicking outside the bulk action menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (bulkActionMenuRef.current && !bulkActionMenuRef.current.contains(event.target as Node)) {
                setShowBulkActionMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Apply filtering and sorting
    useEffect(() => {
        if (employees.length === 0) return;
        
        let result = [...employees];
        
        // Apply department filter
        if (departmentFilter !== 'All Departments') {
            result = result.filter(emp => emp.department === departmentFilter);
        }
        
        // Apply location filter
        if (locationFilter !== 'All Locations') {
            result = result.filter(emp => emp.location === locationFilter);
        }
        
        // Apply status filter
        if (statusFilter !== 'All Status') {
            result = result.filter(emp => emp.status === statusFilter);
        }
        
        // Apply search term
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(emp => 
                emp.name.toLowerCase().includes(term) || 
                emp.email.toLowerCase().includes(term) ||
                emp.position.toLowerCase().includes(term) ||
                emp.department.toLowerCase().includes(term)
            );
        }
        
        // Apply sorting
        result.sort((a, b) => {
            const fieldA = a[sortField] || '';
            const fieldB = b[sortField] || '';
            
            if (sortDirection === 'asc') {
                return fieldA.localeCompare(fieldB);
            } else {
                return fieldB.localeCompare(fieldA);
            }
        });
        
        setFilteredEmployees(result);
        // Reset to first page when filters change
        setCurrentPage(1);
    }, [employees, departmentFilter, locationFilter, statusFilter, searchTerm, sortField, sortDirection]);

    // Handle clicking outside the modal to close it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Ensure we're not closing when interaction is inside the modal
            // or if other modals are open
            if (isEmployeeDetailOpen || isAddEmployeeModalOpen || showConfirmDialog.show) {
                return;
            }
            
            // Only close if clicking on the overlay background, not on any content
            const target = event.target as HTMLElement;
            if (target.classList.contains('modal-overlay') && 
                modalRef.current && 
                !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose, isEmployeeDetailOpen, isAddEmployeeModalOpen, showConfirmDialog]);

    // Handle ESC key to close modal
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            // Don't close the parent modal if a child modal is open
            if (isEmployeeDetailOpen || isAddEmployeeModalOpen || showConfirmDialog.show) {
                return;
            }
            
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
        }
        
        return () => {
            document.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose, isEmployeeDetailOpen, isAddEmployeeModalOpen, showConfirmDialog]);

    // Success message timeout
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
            
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const handleStatusChange = async (employeeId: number) => {
        await employeeService.toggleEmployeeStatus(employeeId);
        
        // Refresh the employee list
        const updatedEmployees = await employeeService.getEmployees();
        setEmployees(updatedEmployees);
        
        // Notify parent component
        onEmployeeStatusChange();
    };

    const handleToggleAllRows = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            // Select all rows on current page
            const currentPageEmployees = getCurrentPageEmployees();
            setSelectedRows(currentPageEmployees.map(emp => emp.id));
        } else {
            // Deselect all
            setSelectedRows([]);
        }
    };

    const handleToggleRow = (employeeId: number) => {
        if (selectedRows.includes(employeeId)) {
            setSelectedRows(selectedRows.filter(id => id !== employeeId));
        } else {
            setSelectedRows([...selectedRows, employeeId]);
        }
    };

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            // Toggle direction
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleEmployeeAdded = async () => {
        // Refresh employees after adding a new one
        const updatedEmployees = await employeeService.getEmployees();
        setEmployees(updatedEmployees);
        onEmployeeStatusChange();
        setIsAddEmployeeModalOpen(false);
        setSuccessMessage('Employee added successfully');
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleViewDetails = (employee: Employee) => {
        setSelectedEmployee(employee);
        setIsEmployeeDetailOpen(true);
    };

    const handleEmployeeDetailsClose = async () => {
        setSelectedEmployee(null);
        setIsEmployeeDetailOpen(false);
        
        // Refresh employee list after closing details modal
        const updatedEmployees = await employeeService.getEmployees();
        setEmployees(updatedEmployees);
        onEmployeeStatusChange();
    };

    // Handle bulk actions
    const handleBulkInclude = async () => {
        setShowBulkActionMenu(false);
        setShowConfirmDialog({
            show: true,
            action: 'include',
            message: `Are you sure you want to include ${selectedRows.length} employees in the analysis?`
        });
    };

    const handleBulkExclude = async () => {
        setShowBulkActionMenu(false);
        setShowConfirmDialog({
            show: true,
            action: 'exclude',
            message: `Are you sure you want to exclude ${selectedRows.length} employees from the analysis?`
        });
    };

    const handleBulkDelete = async () => {
        setShowBulkActionMenu(false);
        setShowConfirmDialog({
            show: true,
            action: 'delete',
            message: `Are you sure you want to delete ${selectedRows.length} employees? This action cannot be undone.`
        });
    };

    const executeConfirmedAction = async () => {
        setActionInProgress(true);
        
        try {
            const action = showConfirmDialog.action;
            
            if (action === 'include') {
                await Promise.all(selectedRows.map(id => 
                    employeeService.updateEmployeeStatus(id, 'Included')
                ));
                setSuccessMessage(`${selectedRows.length} employees included successfully`);
            } else if (action === 'exclude') {
                await Promise.all(selectedRows.map(id => 
                    employeeService.updateEmployeeStatus(id, 'Excluded')
                ));
                setSuccessMessage(`${selectedRows.length} employees excluded successfully`);
            } else if (action === 'delete') {
                await Promise.all(selectedRows.map(id => 
                    employeeService.deleteEmployee(id)
                ));
                setSuccessMessage(`${selectedRows.length} employees deleted successfully`);
            }
            
            // Refresh employee data
            const updatedEmployees = await employeeService.getEmployees();
            setEmployees(updatedEmployees);
            onEmployeeStatusChange();
            
            // Clear selected rows
            setSelectedRows([]);
        } catch (error) {
            console.error(`Error performing bulk ${showConfirmDialog.action}:`, error);
        } finally {
            setActionInProgress(false);
            setShowConfirmDialog({ show: false, action: '', message: '' });
        }
    };

    const cancelConfirmedAction = () => {
        setShowConfirmDialog({ show: false, action: '', message: '' });
    };

    // Export employee data
    const handleExportEmployees = () => {
        setShowBulkActionMenu(false);
        
        // Create CSV content
        const headers = ['Name', 'Email', 'Department', 'Position', 'Location', 'Status'];
        
        let csvContent = headers.join(',') + '\n';
        
        // If employees are selected, export only those, otherwise export all filtered employees
        const employeesToExport = selectedRows.length > 0
            ? employees.filter(emp => selectedRows.includes(emp.id))
            : filteredEmployees;
            
        employeesToExport.forEach(emp => {
            const row = [
                `"${emp.name}"`,
                `"${emp.email}"`,
                `"${emp.department}"`,
                `"${emp.position}"`,
                `"${emp.location || ''}"`,
                `"${emp.status}"`
            ];
            csvContent += row.join(',') + '\n';
        });
        
        // Create download link
        const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'employee_data.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setSuccessMessage(`${employeesToExport.length} employees exported successfully`);
    };

    // Import employee data
    const handleImportClick = () => {
        setShowBulkActionMenu(false);
        // Trigger file input click
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        try {
            // This is a placeholder for your file upload implementation
            // In a real implementation, you would:
            // 1. Read the file (CSV or Excel)
            // 2. Parse it
            // 3. Send the data to your backend or directly update the employee state
            
            // Simulating a successful import
            setTimeout(async () => {
                // Refresh employee data
                const updatedEmployees = await employeeService.getEmployees();
                setEmployees(updatedEmployees);
                onEmployeeStatusChange();
                
                setSuccessMessage('Employees imported successfully');
                
                // Reset file input
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }, 1000);
        } catch (error) {
            console.error('Error importing employees:', error);
            // Handle error (show error message, etc.)
        }
    };

    // Get employees for current page
    const getCurrentPageEmployees = () => {
        const startIndex = (currentPage - 1) * employeesPerPage;
        return filteredEmployees.slice(startIndex, startIndex + employeesPerPage);
    };

    // Get unique departments for filter
    const getDepartments = () => {
        const departments = new Set<string>();
        employees.forEach(emp => departments.add(emp.department));
        return Array.from(departments).sort();
    };

    // Get unique locations for filter
    const getLocations = () => {
        const locations = new Set<string>();
        employees.forEach(emp => {
            if (emp.location) {
                locations.add(emp.location);
            }
        });
        return Array.from(locations).sort();
    };

    // Clear all filters
    const clearAllFilters = () => {
        setSearchTerm('');
        setDepartmentFilter('All Departments');
        setLocationFilter('All Locations');
        setStatusFilter('All Status');
    };

    // Get sorted icon for table header
    const getSortIcon = (field: SortField) => {
        if (sortField !== field) {
            return null;
        }
        
        return sortDirection === 'asc' 
            ? <ChevronUp className="w-4 h-4 inline ml-1" /> 
            : <ChevronDown className="w-4 h-4 inline ml-1" />;
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4 modal-overlay">
                <div 
                    ref={modalRef}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-5xl h-auto max-h-[90vh] flex flex-col animate-fadeIn"
                    onClick={(e) => e.stopPropagation()} // Prevent events from bubbling up
                >
                    <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Manage Employees</h2>
                        <button 
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            aria-label="Close"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    
                    {/* Success Message */}
                    {successMessage && (
                        <div className="p-4 bg-green-50 border-l-4 border-green-400 m-4 rounded">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <Check className="h-5 w-5 text-green-400" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-green-700">{successMessage}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap justify-between items-center gap-2">
                        {/* Search */}
                        <div className="relative flex-grow max-w-md">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                </svg>
                            </div>
                            <input 
                                type="search" 
                                className="block w-full p-2 pl-10 text-sm border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                                placeholder="Search employees"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        {/* Active filters display */}
                        {(departmentFilter !== 'All Departments' || locationFilter !== 'All Locations' || statusFilter !== 'All Status' || searchTerm) && (
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <Filter className="w-4 h-4 mr-1" />
                                <span>Active filters:</span>
                                {departmentFilter !== 'All Departments' && (
                                    <span className="ml-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs dark:bg-blue-900 dark:text-blue-100">
                                        Dept: {departmentFilter}
                                    </span>
                                )}
                                {locationFilter !== 'All Locations' && (
                                    <span className="ml-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs dark:bg-blue-900 dark:text-blue-100">
                                        Location: {locationFilter}
                                    </span>
                                )}
                                {statusFilter !== 'All Status' && (
                                    <span className="ml-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs dark:bg-blue-900 dark:text-blue-100">
                                        Status: {statusFilter}
                                    </span>
                                )}
                                {searchTerm && (
                                    <span className="ml-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs dark:bg-blue-900 dark:text-blue-100">
                                        Search: "{searchTerm}"
                                    </span>
                                )}
                                <button 
                                    className="ml-2 text-blue-600 hover:text-blue-800 text-xs dark:text-blue-400 dark:hover:text-blue-300"
                                    onClick={clearAllFilters}
                                >
                                    Clear all
                                </button>
                            </div>
                        )}
                        
                        {/* Filters */}
                        <div className="flex flex-wrap gap-2">
                            <select
                                value={departmentFilter}
                                onChange={(e) => setDepartmentFilter(e.target.value)}
                                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
                            >
                                <option value="All Departments">All Departments</option>
                                {getDepartments().map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                            
                            <select
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
                            >
                                <option value="All Locations">All Locations</option>
                                {getLocations().map(loc => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                            
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
                            >
                                <option value="All Status">All Status</option>
                                <option value="Included">Included</option>
                                <option value="Excluded">Excluded</option>
                            </select>
                            
                            <button
                                onClick={() => setIsAddEmployeeModalOpen(true)}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                            >
                                <svg className="w-3.5 h-3.5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
                                </svg>
                                Add Employee
                            </button>
                        </div>
                    </div>
                    
                    {/* Bulk actions menu */}
                    {selectedRows.length > 0 && (
                        <div className="p-2 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900 flex justify-between items-center">
                            <div className="text-blue-700 dark:text-blue-100 text-sm">
                                <span className="font-semibold">{selectedRows.length}</span> {selectedRows.length === 1 ? 'employee' : 'employees'} selected
                            </div>
                            <div className="relative">
                                <button
                                    onClick={() => setShowBulkActionMenu(!showBulkActionMenu)}
                                    className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                                >
                                    Bulk Actions
                                    <ChevronDown className="w-4 h-4 ml-1" />
                                </button>
                                
                                {showBulkActionMenu && (
                                    <div 
                                        ref={bulkActionMenuRef}
                                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700"
                                    >
                                        <div className="py-1">
                                            <button
                                                onClick={handleBulkInclude}
                                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center text-green-600 dark:text-green-400"
                                            >
                                                <Check className="w-4 h-4 mr-2" />
                                                Include Selected
                                            </button>
                                            <button
                                                onClick={handleBulkExclude}
                                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center text-orange-600 dark:text-orange-400"
                                            >
                                                <X className="w-4 h-4 mr-2" />
                                                Exclude Selected
                                            </button>
                                            <button
                                                onClick={handleExportEmployees}
                                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center text-blue-600 dark:text-blue-400"
                                            >
                                                <Download className="w-4 h-4 mr-2" />
                                                Export Selected
                                            </button>
                                            <button
                                                onClick={handleBulkDelete}
                                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center text-red-600 dark:text-red-400"
                                            >
                                                <AlertTriangle className="w-4 h-4 mr-2" />
                                                Delete Selected
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    
                    <div className="overflow-x-auto flex-grow overflow-y-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                                <tr>
                                    <th scope="col" className="p-4">
                                        <div className="flex items-center">
                                            <input 
                                                id="checkbox-all" 
                                                type="checkbox" 
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                onChange={handleToggleAllRows}
                                                checked={selectedRows.length > 0 && getCurrentPageEmployees().every(emp => selectedRows.includes(emp.id))}
                                            />
                                            <label htmlFor="checkbox-all" className="sr-only">checkbox</label>
                                        </div>
                                    </th>
                                    <th 
                                        scope="col" 
                                        className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                        onClick={() => handleSort('name')}
                                    >
                                        NAME {getSortIcon('name')}
                                    </th>
                                    <th 
                                        scope="col" 
                                        className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                        onClick={() => handleSort('email')}
                                    >
                                        EMAIL {getSortIcon('email')}
                                    </th>
                                    <th 
                                        scope="col" 
                                        className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                        onClick={() => handleSort('department')}
                                    >
                                        DEPARTMENT {getSortIcon('department')}
                                    </th>
                                    <th 
                                        scope="col" 
                                        className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                        onClick={() => handleSort('position')}
                                    >
                                        POSITION {getSortIcon('position')}
                                    </th>
                                    <th 
                                        scope="col" 
                                        className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                        onClick={() => handleSort('location')}
                                    >
                                        LOCATION {getSortIcon('location')}
                                    </th>
                                    <th 
                                        scope="col" 
                                        className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                        onClick={() => handleSort('status')}
                                    >
                                        STATUS {getSortIcon('status')}
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        ACTIONS
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={8} className="text-center py-4">
                                            <div className="flex justify-center items-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Loading employees...
                                            </div>
                                        </td>
                                    </tr>
                                ) : getCurrentPageEmployees().length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="text-center py-8 text-gray-500 dark:text-gray-400">
                                            <div className="flex flex-col items-center">
                                                <svg className="w-12 h-12 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                                <p className="text-lg font-semibold mb-1">No employees found</p>
                                                <p className="text-sm">Try adjusting your search or filter criteria</p>
                                                {(departmentFilter !== 'All Departments' || locationFilter !== 'All Locations' || statusFilter !== 'All Status' || searchTerm) && (
                                                    <button 
                                                        onClick={clearAllFilters}
                                                        className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                                                    >
                                                        Clear all filters
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    getCurrentPageEmployees().map((employee) => (
                                        <tr key={employee.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="w-4 p-4">
                                                <div className="flex items-center">
                                                    <input 
                                                        id={`checkbox-${employee.id}`} 
                                                        type="checkbox" 
                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                        checked={selectedRows.includes(employee.id)}
                                                        onChange={() => handleToggleRow(employee.id)}
                                                    />
                                                    <label htmlFor={`checkbox-${employee.id}`} className="sr-only">checkbox</label>
                                                </div>
                                            </td>
                                            <th scope="row" className="flex items-center px-6 py-4 whitespace-nowrap">
                                                {employee.profilePicture ? (
                                                    <img className="w-10 h-10 rounded-full" src={employee.profilePicture} alt={employee.name} />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                                                        {employee.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                )}
                                                <div className="pl-3">
                                                    <div className="text-base font-semibold text-gray-900 dark:text-white">{employee.name}</div>
                                                </div>
                                            </th>
                                            <td className="px-6 py-4">{employee.email}</td>
                                            <td className="px-6 py-4">{employee.department}</td>
                                            <td className="px-6 py-4">{employee.position}</td>
                                            <td className="px-6 py-4">{employee.location || "Not specified"}</td>
                                            <td className="px-6 py-4">
                                                <span 
                                                    className={`px-2 py-1 rounded text-xs cursor-pointer ${
                                                        employee.status === 'Included' 
                                                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100' 
                                                            : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
                                                    }`}
                                                    onClick={() => handleStatusChange(employee.id)}
                                                >
                                                    {employee.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="relative inline-block text-left">
                                                    <button 
                                                        type="button" 
                                                        className="text-blue-600 hover:underline font-medium dark:text-blue-500"
                                                        onClick={() => handleViewDetails(employee)}
                                                    >
                                                        View Details
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex flex-wrap justify-between items-center">
                        <div className="text-sm text-gray-700 dark:text-gray-400">
                            Showing {filteredEmployees.length > 0 ? ((currentPage - 1) * employeesPerPage) + 1 : 0} to {Math.min(currentPage * employeesPerPage, filteredEmployees.length)} of {filteredEmployees.length} results
                        </div>
                        
                        {filteredEmployees.length > 0 && (
                            <div className="inline-flex mt-2 md:mt-0">
                                <button 
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1}
                                    className={`px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
                                >
                                    Previous
                                </button>
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    // Show pages around current page
                                    let pageToShow;
                                    if (totalPages <= 5) {
                                        pageToShow = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageToShow = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageToShow = totalPages - 4 + i;
                                    } else {
                                        pageToShow = currentPage - 2 + i;
                                    }
                                    
                                    return (
                                        <button
                                            key={pageToShow}
                                            onClick={() => setCurrentPage(pageToShow)}
                                            className={`px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-700 ${
                                                currentPage === pageToShow
                                                    ? 'text-blue-600 bg-blue-50 dark:bg-gray-700 dark:text-white'
                                                    : 'text-gray-700 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                                            }`}
                                        >
                                            {pageToShow}
                                        </button>
                                    );
                                })}
                                {totalPages > 5 && currentPage < totalPages - 2 && (
                                    <>
                                        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
                                            ...
                                        </button>
                                        <button
                                            onClick={() => setCurrentPage(totalPages)}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700"
                                        >
                                            {totalPages}
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                    className={`px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 ${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''}`}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                    
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between gap-2">
                        <div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".csv,.xlsx,.xls"
                                onChange={handleFileUpload}
                            />
                            <button
                                onClick={handleImportClick}
                                className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 flex items-center"
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Import
                            </button>
                        </div>
                        
                        <div className="flex gap-2">
                            <button
                                onClick={handleExportEmployees}
                                className="px-4 py-2 text-sm font-medium border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:border-blue-500 dark:text-blue-500 dark:hover:bg-gray-800 flex items-center"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Export
                            </button>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Confirmation Dialog */}
            {showConfirmDialog.show && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 animate-fadeIn">
                        <div className="flex items-center mb-4">
                            <AlertTriangle className="h-6 w-6 text-yellow-500 mr-3" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Confirm Action</h3>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">{showConfirmDialog.message}</p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={cancelConfirmedAction}
                                className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                disabled={actionInProgress}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={executeConfirmedAction}
                                className={`px-4 py-2 text-sm font-medium text-white ${showConfirmDialog.action === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} rounded-lg flex items-center`}
                                disabled={actionInProgress}
                            >
                                {actionInProgress && (
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Employee Detail Modal */}
            {selectedEmployee && isEmployeeDetailOpen && (
                <EmployeeDetailModal
                    isOpen={true}
                    onClose={handleEmployeeDetailsClose}
                    employee={selectedEmployee}
                    onStatusChange={onEmployeeStatusChange}
                />
            )}
            
            {/* Add Employee Modal */}
            {isAddEmployeeModalOpen && (
                <AddEmployeeModal
                    isOpen={true}
                    onClose={() => setIsAddEmployeeModalOpen(false)}
                    onEmployeeAdded={handleEmployeeAdded}
                />
            )}
        </>
    );
};

export default ManageEmployeesModal;