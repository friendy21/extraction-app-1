"use client"

import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, X, Download, Plus } from 'lucide-react';
import DashboardLayout from '../DashboardLayout';
import EmployeeModal from './EmployeeModal';
import AddEmployeeModal from './AddEmployeeModal';
import EmployeeStatusBadge from './EmployeeStatusBadge';
import { fakeEmployeeData, Employee } from './employeeData'; 

const EmployeesPage: React.FC = () => {
  // State for employees data
  const [employees, setEmployees] = useState<Employee[]>(fakeEmployeeData);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const totalEmployees = employees.length;
  const totalPages = Math.ceil(totalEmployees / itemsPerPage);
  
  // State for selected employee
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');
  const [statusFilter, setStatusFilter] = useState('All Status');
  
  // State for selected employees
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  
  // Filter employees based on search query and filters
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = 
      departmentFilter === 'All Departments' || 
      employee.department === departmentFilter;
    
    const matchesStatus = 
      statusFilter === 'All Status' || 
      employee.status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });
  
  // Get current employees based on pagination
  const indexOfLastEmployee = currentPage * itemsPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);
  
  // Calculate statistics
  const includedCount = employees.filter(emp => emp.status === 'Included').length;
  const excludedCount = employees.filter(emp => emp.status === 'Excluded').length;
  const departmentsSet = new Set(employees.map(emp => emp.department));
  const totalDepartments = departmentsSet.size-7;
  
  // Handler for pagination buttons
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };
  
  // Handler for viewing employee details
  const handleViewDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };
  
  // Handler for modal close
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
  };
  
  // Handler for employee status toggle
  const handleStatusChange = (employee: Employee, include: boolean) => {
    setEmployees(employees.map(emp => {
      if (emp.id === employee.id) {
        return {
          ...emp,
          status: include ? 'Included' : 'Excluded'
        };
      }
      return emp;
    }));
    setShowModal(false);
  };
  
  // Handler for adding new employee
  const handleAddEmployee = (newEmployee: Employee) => {
    setEmployees([newEmployee, ...employees]);
  };
  
  // Handler for selecting all employees on current page
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      // Select all employees on current page
      const currentIds = currentEmployees.map(emp => emp.id);
      setSelectedEmployees([...new Set([...selectedEmployees, ...currentIds])]);
    } else {
      // Deselect all employees on current page
      const currentIds = new Set(currentEmployees.map(emp => emp.id));
      setSelectedEmployees(selectedEmployees.filter(id => !currentIds.has(id)));
    }
  };
  
  // Handler for selecting individual employee
  const handleSelectEmployee = (e: React.ChangeEvent<HTMLInputElement>, employeeId: string) => {
    if (e.target.checked) {
      setSelectedEmployees([...selectedEmployees, employeeId]);
    } else {
      setSelectedEmployees(selectedEmployees.filter(id => id !== employeeId));
    }
  };
  
  // Check if all employees on current page are selected
  const areAllCurrentSelected = currentEmployees.length > 0 && 
    currentEmployees.every(emp => selectedEmployees.includes(emp.id));
  
  // CSV Export functionality
  const handleExportCSV = () => {
    // Create CSV header
    const headers = [
      'Name',
      'Email',
      'Department',
      'Position',
      'Status',
      'Location',
      'Work Model'
    ].join(',');
    
    // Create CSV rows
    const rows = employees.map(employee => {
      return [
        `"${employee.name}"`,
        `"${employee.email}"`,
        `"${employee.department}"`,
        `"${employee.position}"`,
        `"${employee.status}"`,
        `"${employee.location || ''}"`,
        `"${employee.workModel || ''}"`
      ].join(',');
    });
    
    // Combine header and rows
    const csvContent = [headers, ...rows].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'employees.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate pagination page numbers
  const getPaginationGroup = () => {
    let start = Math.max(currentPage - 2, 1);
    let end = Math.min(start + 4, totalPages);
    
    // If we're near the end, shift the window to show 5 pages where possible
    if (end - start < 4 && totalPages > 5) {
      start = Math.max(end - 4, 1);
    }
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  // Get the admin user for the header display
  const adminUser = {
    name: 'Admin User',
    avatar: '/api/placeholder/32/32'
  };

  return (
    <DashboardLayout userName={adminUser.name} userAvatar={adminUser.avatar}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Employee Management</h1>
          <div className="flex space-x-3">
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={18} className="mr-2" />
              Add Employee
            </button>
            <button 
              className="border border-gray-300 px-4 py-2 rounded-md flex items-center text-gray-700"
              onClick={handleExportCSV}
            >
              <Download size={18} className="mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-gray-600 text-sm mb-1">Total Employees</div>
            <div className="text-3xl font-bold">{totalEmployees}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-gray-600 text-sm mb-1">Included in Analysis</div>
            <div className="text-3xl font-bold text-green-600">{includedCount}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-gray-600 text-sm mb-1">Excluded from Analysis</div>
            <div className="text-3xl font-bold text-red-600">{excludedCount}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-gray-600 text-sm mb-1">Total Departments</div>
            <div className="text-3xl font-bold text-blue-600">{totalDepartments}</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div className="relative w-1/3">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search employees"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div className="flex space-x-3">
              <div className="relative">
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-md bg-white"
                >
                  <option>All Departments</option>
                  <option>Marketing</option>
                  <option>Engineering</option>
                  <option>Sales</option>
                  <option>Product</option>
                  <option>Finance</option>
                  <option>HR</option>
                  <option>Design</option>
                  <option>Customer Support</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-md bg-white"
                >
                  <option>All Status</option>
                  <option>Included</option>
                  <option>Excluded</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Employees Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white">
              <tr>
                <th scope="col" className="w-12 px-4 py-3">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 rounded border-gray-300" 
                    checked={areAllCurrentSelected}
                    onChange={handleSelectAll}
                  />
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 rounded border-gray-300"
                      checked={selectedEmployees.includes(employee.id)}
                      onChange={(e) => handleSelectEmployee(e, employee.id)}
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full overflow-hidden mr-3">
                        <img src={employee.avatar} alt={employee.name} />
                      </div>
                      <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {employee.email}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {employee.department}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {employee.position}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <EmployeeStatusBadge status={employee.status} />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600">
                    <button 
                      onClick={() => handleViewDetails(employee)}
                      className="font-medium hover:text-blue-800"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Pagination */}
          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:block">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstEmployee + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastEmployee, filteredEmployees.length)}
                </span>{' '}
                of <span className="font-medium">{totalEmployees}</span> results
              </p>
            </div>
            <div className="flex-1 flex justify-end">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronDown className="h-5 w-5 transform rotate-90" />
                </button>
                
                {/* Pagination buttons */}
                {currentPage > 3 && (
                  <>
                    <button
                      onClick={() => handlePageChange(1)}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 text-sm font-medium"
                    >
                      1
                    </button>
                    {currentPage > 4 && (
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        ...
                      </span>
                    )}
                  </>
                )}
                
                {getPaginationGroup().map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`relative inline-flex items-center px-4 py-2 border ${
                      currentPage === pageNumber
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    } text-sm font-medium`}
                  >
                    {pageNumber}
                  </button>
                ))}
                
                {currentPage < totalPages - 2 && (
                  <>
                    {currentPage < totalPages - 3 && (
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        ...
                      </span>
                    )}
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 text-sm font-medium"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <ChevronDown className="h-5 w-5 transform -rotate-90" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Detail Modal */}
      {showModal && selectedEmployee && (
        <EmployeeModal
          employee={selectedEmployee}
          onClose={handleCloseModal}
          onStatusChange={handleStatusChange}
        />
      )}
      
      {/* Add Employee Modal */}
      {showAddModal && (
        <AddEmployeeModal
          onClose={() => setShowAddModal(false)}
          onAddEmployee={handleAddEmployee}
        />
      )}
    </DashboardLayout>
  );
};

export default EmployeesPage;