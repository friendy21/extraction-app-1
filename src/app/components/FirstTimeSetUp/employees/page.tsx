"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Loader2, Users, Building, MapPin, Home, Search, Filter, 
  CheckSquare, XSquare, Plus, ArrowLeft, ArrowRight, ChevronDown,
  Briefcase, Mail, AlertTriangle
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Employee, DepartmentDistribution } from '../../../lib/types';
import { employeeService } from '../../../lib/services/employeeService';
import { useStep } from '../StepContext';
import { Button } from "../../../components/ui/button";
import EmployeeDetailModal from './employeeDetailModal';
import ManageEmployeesModal from './ManageEmployeeModal';
import AddEmployeeModal from './AddEmployeeModal';

// Constants
const BREAKPOINT = 768;
const EMPLOYEES_PER_PAGE = 5;
const COLORS = ['#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6'];

// Sub-Components
const MetricCard = ({ icon, value, label, delay = '0ms' }) => (
  <div 
    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow transition-all transform hover:translate-y-px opacity-0 animate-fade-in" 
    style={{ animationDelay: delay }}
  >
    <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 shadow-md">{icon}</div>
    <div className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-1">{value}</div>
    <div className="text-sm text-gray-500 dark:text-gray-400 text-center">{label}</div>
  </div>
);

const EmployeeMetrics = ({ employees, departmentDistribution, locationCount, remoteWorkers }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in">
    <MetricCard icon={<Users className="w-6 h-6" />} value={employees.length} label="Total Employees" delay="100ms" />
    <MetricCard icon={<Building className="w-6 h-6" />} value={departmentDistribution.length} label="Departments" delay="200ms" />
    <MetricCard icon={<MapPin className="w-6 h-6" />} value={locationCount} label="Locations" delay="300ms" />
    <MetricCard icon={<Home className="w-6 h-6" />} value={remoteWorkers} label="Remote Workers" delay="400ms" />
  </div>
);

const DepartmentDistributionSection = ({ departmentDistribution, totalEmployees }) => {
  const departmentData = departmentDistribution.map((dept, index) => ({
    ...dept,
    percentage: ((dept.count / totalEmployees) * 100).toFixed(1),
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow transition-shadow mb-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
        <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
        Department Distribution
      </h2>
      {totalEmployees > 0 && departmentDistribution.length > 0 ? (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  innerRadius={60}
                  dataKey="count"
                  nameKey="name"
                  label={({ name, percentage }) => `${percentage}%`}
                  labelLine={true}
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [
                  `${value} employees (${departmentData.find(d => d.name === name)?.percentage}%)`, 
                  name
                ]} />
                <Legend layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="lg:w-1/2 overflow-x-auto">
            <table className="w-full text-sm text-gray-700 dark:text-gray-300">
              <thead className="bg-gray-50 dark:bg-gray-700 text-xs uppercase text-gray-600 dark:text-gray-400">
                <tr>
                  <th className="px-4 py-3 text-left">Department</th>
                  <th className="px-4 py-3 text-left">Employees</th>
                  <th className="px-4 py-3 text-left">Percentage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {departmentData.map((dept) => (
                  <tr key={dept.name} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: dept.color }}></div>
                      {dept.name}
                    </td>
                    <td className="px-4 py-3">{dept.count}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-2">
                          <div className="h-2 rounded-full" style={{ width: `${dept.percentage}%`, backgroundColor: dept.color }}></div>
                        </div>
                        {dept.percentage}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-48 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
          <p className="text-gray-500 dark:text-gray-400 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-gray-400" />
            No department data available
          </p>
        </div>
      )}
    </div>
  );
};

const SearchAndFilterBar = ({ searchTerm, setSearchTerm, selectedDepartment, setSelectedDepartment, selectedStatus, setSelectedStatus, departments }) => (
  <div className="flex flex-col md:flex-row gap-4 mb-6">
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        type="text"
        placeholder="Search by name, email, position..."
        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-all"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search employees"
      />
    </div>
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <select
          className="w-full pl-3 pr-10 py-2.5 appearance-none border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          aria-label="Filter by department"
        >
          {departments.map(dept => <option key={dept} value={dept}>{dept === 'All' ? 'All Departments' : dept}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
      <div className="relative flex-1">
        <select
          className="w-full pl-3 pr-10 py-2.5 appearance-none border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="All">All Status</option>
          <option value="Included">Included</option>
          <option value="Excluded">Excluded</option>
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  </div>
);

const BulkActions = ({ selectedCount, handleBulkInclude, handleBulkExclude }) => (
  selectedCount > 0 ? (
    <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4 animate-slide-in border border-blue-100 dark:border-blue-800">
      <span className="text-blue-700 dark:text-blue-300 font-medium flex items-center">
        <CheckSquare className="h-4 w-4 mr-2" />
        {selectedCount} employee{selectedCount > 1 ? 's' : ''} selected
      </span>
      <div className="flex gap-3">
        <button 
          onClick={handleBulkInclude} 
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-sm hover:shadow"
        >
          <CheckSquare className="h-4 w-4" /> Include
        </button>
        <button 
          onClick={handleBulkExclude} 
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-sm hover:shadow"
        >
          <XSquare className="h-4 w-4" /> Exclude
        </button>
      </div>
    </div>
  ) : null
);

const PaginationControls = ({ currentPage, totalPages, handlePreviousPage, handleNextPage, startEntry, endEntry, totalFilteredEntries }) => (
  <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
    <span className="text-sm text-gray-600 dark:text-gray-400">
      {totalFilteredEntries > 0 ? `Showing ${startEntry} to ${endEntry} of ${totalFilteredEntries} entries` : 'No entries to show'}
    </span>
    <div className="flex items-center gap-3">
      <button 
        onClick={handlePreviousPage} 
        disabled={currentPage === 1} 
        className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        aria-label="Previous page"
      >
        <ArrowLeft className="h-4 w-4" /> Previous
      </button>
      <span className="text-gray-700 dark:text-gray-300 font-medium">Page {currentPage} of {totalPages || 1}</span>
      <button 
        onClick={handleNextPage} 
        disabled={currentPage === totalPages || totalPages === 0} 
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-sm"
        aria-label="Next page"
      >
        Next <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  </div>
);

const EmployeeTable = ({ 
  employees, 
  isMobile, 
  selectedEmployees, 
  onToggleSelection, 
  onToggleStatus, 
  onViewDetails, 
  selectAll, 
  onSelectAllChange 
}) => (
  isMobile ? (
    <div className="space-y-4">
      {employees.map((employee) => (
        <div key={employee.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={selectedEmployees.includes(employee.id)} 
                onChange={() => onToggleSelection(employee.id)} 
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition" 
              />
              {employee.profilePicture ? (
                <img 
                  src={employee.profilePicture} 
                  alt={`${employee.name}'s profile`} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700" 
                  loading="lazy" 
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  {employee.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'}
                </div>
              )}
              <div>
                <button 
                  onClick={() => onViewDetails(employee)} 
                  className="text-md font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {employee.name || 'N/A'}
                </button>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Mail className="h-3 w-3 mr-1" />
                  {employee.email || 'No email'}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                  {employee.department} - {employee.position}
                </div>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                employee.status === 'Included' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800/50' 
                  : 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/50'
              }`}
              onClick={() => onToggleStatus(employee.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onToggleStatus(employee.id); }}
            >
              {employee.status}
            </span>
          </div>
        </div>
      ))}
      {employees.length === 0 && (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
          <Users className="h-10 w-10 mx-auto mb-3 text-gray-400 dark:text-gray-500" />
          <p>No employees found matching your criteria.</p>
        </div>
      )}
    </div>
  ) : (
    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <table className="w-full text-sm text-gray-700 dark:text-gray-300 table-fixed">
        <thead className="bg-gray-50 dark:bg-gray-700 text-xs uppercase text-gray-600 dark:text-gray-400">
          <tr>
            <th className="p-4 w-12 text-center">
              <input 
                type="checkbox" 
                checked={selectAll} 
                onChange={(e) => onSelectAllChange(e.target.checked)} 
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition" 
                aria-label="Select all" 
              />
            </th>
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Email</th>
            <th className="p-4 text-left">Department</th>
            <th className="p-4 text-left">Position</th>
            <th className="p-4 text-left w-24">Status</th>
            <th className="p-4 text-left w-32">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {employees.map((employee) => (
            <tr key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <td className="p-4 text-center">
                <input 
                  type="checkbox" 
                  checked={selectedEmployees.includes(employee.id)} 
                  onChange={() => onToggleSelection(employee.id)} 
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition" 
                />
              </td>
              <td className="p-4 flex items-center gap-3">
                {employee.profilePicture ? (
                  <img 
                    src={employee.profilePicture} 
                    alt={`${employee.name}'s profile`} 
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700" 
                    loading="lazy" 
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
                    {employee.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'}
                  </div>
                )}
                <span className="font-medium text-gray-900 dark:text-white">{employee.name || 'N/A'}</span>
              </td>
              <td className="p-4 truncate max-w-[200px]">{employee.email || '-'}</td>
              <td className="p-4 truncate max-w-[150px]">{employee.department || '-'}</td>
              <td className="p-4 truncate max-w-[150px]">{employee.position || '-'}</td>
              <td className="p-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                    employee.status === 'Included' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800/50' 
                      : 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/50'
                  }`}
                  onClick={() => onToggleStatus(employee.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onToggleStatus(employee.id); }}
                >
                  {employee.status}
                </span>
              </td>
              <td className="p-4">
                <button 
                  onClick={() => onViewDetails(employee)} 
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors focus:outline-none focus:underline"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {employees.length === 0 && (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50">
          <Users className="h-10 w-10 mx-auto mb-3 text-gray-400 dark:text-gray-500" />
          <p>No employees found matching your criteria.</p>
        </div>
      )}
    </div>
  )
);

// Main Component
const EmployeePage = () => {
  const router = useRouter();
  const { setCurrentStep } = useStep();

  // State
  const [isDiscoveryComplete, setIsDiscoveryComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [totalDiscoveredEmployees, setTotalDiscoveredEmployees] = useState(0);
  const [employees, setEmployees] = useState([]);
  const [departmentDistribution, setDepartmentDistribution] = useState([]);
  const [locationCount, setLocationCount] = useState(0);
  const [remoteWorkers, setRemoteWorkers] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectAllOnPage, setSelectAllOnPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Memoized Values
  const departments = useMemo(() => ['All', ...Array.from(new Set(employees.map(emp => emp.department).filter(Boolean))).sort()], [employees]);
  const filteredEmployees = useMemo(() => employees.filter(emp =>
    (searchTerm === '' || [emp.name, emp.email, emp.position].some(field => field?.toLowerCase().includes(searchTerm.toLowerCase()))) &&
    (selectedDepartment === 'All' || emp.department === selectedDepartment) &&
    (selectedStatus === 'All' || emp.status === selectedStatus)
  ), [employees, searchTerm, selectedDepartment, selectedStatus]);
  const totalPages = Math.ceil(filteredEmployees.length / EMPLOYEES_PER_PAGE);
  const paginatedEmployees = useMemo(() => filteredEmployees.slice((currentPage - 1) * EMPLOYEES_PER_PAGE, currentPage * EMPLOYEES_PER_PAGE), [filteredEmployees, currentPage]);
  const startEntry = filteredEmployees.length > 0 ? (currentPage - 1) * EMPLOYEES_PER_PAGE + 1 : 0;
  const endEntry = Math.min(currentPage * EMPLOYEES_PER_PAGE, filteredEmployees.length);

  // Effects
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= BREAKPOINT);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (!isDiscoveryComplete || totalDiscoveredEmployees === 0) {
        if (isDiscoveryComplete) setEmployees([]);
        return;
      }
      try {
        const [emps, dist, loc, rem] = await Promise.all([
          employeeService.getEmployees(),
          employeeService.getDepartmentDistribution(),
          employeeService.getLocationCount(),
          employeeService.getRemoteWorkersCount()
        ]);
        setEmployees(emps);
        setDepartmentDistribution(dist);
        setLocationCount(loc);
        setRemoteWorkers(rem);
      } catch (error) {
        setErrorMessage('Failed to load employee data.');
        console.error(error);
      }
    };
    loadData();
  }, [isDiscoveryComplete, totalDiscoveredEmployees]);

  useEffect(() => setCurrentPage(1), [searchTerm, selectedDepartment, selectedStatus]);
  
  useEffect(() => { 
    setSelectedEmployees([]); 
    setSelectAllOnPage(false); 
  }, [filteredEmployees]);
  
  useEffect(() => {
    const pageIds = paginatedEmployees.map(emp => emp.id);
    setSelectAllOnPage(pageIds.length > 0 && pageIds.every(id => selectedEmployees.includes(id)));
  }, [selectedEmployees, paginatedEmployees]);

  // Callbacks
  const handleNavigation = useCallback((step, path) => { 
    setCurrentStep(step); 
    router.push(path); 
  }, [setCurrentStep, router]);
  
  const handleBack = useCallback(() => 
    handleNavigation(1, '/components/FirstTimeSetUp/ConnectionSetup'), 
    [handleNavigation]
  );
  
  const handleNext = useCallback(() => 
    handleNavigation(3, '/components/FirstTimeSetUp/DataSetup'), 
    [handleNavigation]
  );
  
  const handlePreviousPage = useCallback(() => 
    setCurrentPage(prev => Math.max(prev - 1, 1)), 
    []
  );
  
  const handleNextPage = useCallback(() => 
    setCurrentPage(prev => Math.min(prev + 1, totalPages)), 
    [totalPages]
  );

  const runDiscovery = useCallback(async () => {
    setIsLoading(true);
    setIsDiscoveryComplete(false);
    setErrorMessage(null);
    setEmployees([]);
    try {
      const count = await employeeService.runDiscovery();
      setTotalDiscoveredEmployees(count);
      setIsDiscoveryComplete(true);
    } catch (error) {
      setErrorMessage('Discovery failed. Check your connections and try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshEmployeeData = useCallback(async () => {
    try {
      const [emps, dist, loc, rem] = await Promise.all([
        employeeService.getEmployees(),
        employeeService.getDepartmentDistribution(),
        employeeService.getLocationCount(),
        employeeService.getRemoteWorkersCount()
      ]);
      setEmployees(emps);
      setDepartmentDistribution(dist);
      setLocationCount(loc);
      setRemoteWorkers(rem);
    } catch (error) {
      setErrorMessage('Failed to refresh data.');
      console.error(error);
    }
  }, []);

  const handleToggleSelection = useCallback((id) => 
    setSelectedEmployees(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    ), []
  );
  
  const handleSelectAllOnPage = useCallback((checked) => {
    const pageIds = paginatedEmployees.map(emp => emp.id);
    setSelectedEmployees(prev => 
      checked ? [...new Set([...prev, ...pageIds])] : prev.filter(id => !pageIds.includes(id))
    );
  }, [paginatedEmployees]);
  
  const handleToggleStatus = useCallback(async (id) => {
    const emp = employees.find(e => e.id === id);
    const newStatus = emp?.status === 'Included' ? 'Excluded' : 'Included';
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
    try {
      await employeeService.toggleEmployeeStatus(id);
    } catch (error) {
      setErrorMessage('Failed to update status.');
      setEmployees(prev => prev.map(e => e.id === id ? { ...e, status: emp?.status } : e));
      console.error(error);
    }
  }, [employees]);
  
  const performBulkUpdate = useCallback(async (status) => {
    const original = [...employees];
    setEmployees(prev => prev.map(emp => 
      selectedEmployees.includes(emp.id) ? { ...emp, status } : emp
    ));
    try {
      await Promise.all(selectedEmployees.map(id => 
        employeeService.updateEmployeeStatus(id, status)
      ));
      setSelectedEmployees([]);
    } catch (error) {
      setErrorMessage(`Failed to bulk update to ${status}.`);
      setEmployees(original);
      console.error(error);
    }
  }, [selectedEmployees, employees]);
  
  const handleBulkInclude = useCallback(() => 
    performBulkUpdate('Included'), 
    [performBulkUpdate]
  );
  
  const handleBulkExclude = useCallback(() => 
    performBulkUpdate('Excluded'), 
    [performBulkUpdate]
  );

  // Render
  return (
    <>
      {selectedEmployee && (
        <EmployeeDetailModal 
          isOpen={!!selectedEmployee} 
          onClose={() => setSelectedEmployee(null)} 
          employee={selectedEmployee} 
          onStatusChange={refreshEmployeeData} 
        />
      )}
      
      {isManageModalOpen && (
        <ManageEmployeesModal 
          isOpen={isManageModalOpen} 
          onClose={() => setIsManageModalOpen(false)} 
          onEmployeeStatusChange={refreshEmployeeData} 
        />
      )}
      
      {isAddEmployeeModalOpen && (
        <AddEmployeeModal 
          isOpen={isAddEmployeeModalOpen} 
          onClose={() => setIsAddEmployeeModalOpen(false)} 
          onEmployeeAdded={refreshEmployeeData} 
        />
      )}
      
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        <header className="space-y-3 border-b border-gray-200 dark:border-gray-700 pb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Employee Discovery</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl">
            Discover and manage employee data from your connected platforms.
          </p>
        </header>

        {errorMessage && (
          <div className="p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 rounded-lg animate-slide-in flex items-start" role="alert">
            <AlertTriangle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Error</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow transition-shadow">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Discover Employees</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Automatically detect and import employees from connected platforms.
              </p>
            </div>
            <button
              onClick={runDiscovery}
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition-all shadow-sm hover:shadow"
            >
              {isLoading ? <><Loader2 className="h-5 w-5 animate-spin" /> Running Discovery...</> : 'Run Discovery'}
            </button>
          </div>
          
          {isLoading && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-700 dark:text-blue-300 flex items-center border border-blue-100 dark:border-blue-800">
              <Loader2 className="h-5 w-5 animate-spin mr-3" /> 
              <div>
                <p className="font-medium">Discovery in progress</p>
                <p className="text-sm text-blue-600 dark:text-blue-400">This may take a few moments...</p>
              </div>
            </div>
          )}
          
          {isDiscoveryComplete && !isLoading && (
            <div className={`mt-6 p-4 rounded-lg flex items-center animate-slide-in border ${
              totalDiscoveredEmployees > 0 
                ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-100 dark:border-green-800' 
                : 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-100 dark:border-yellow-800'
            }`}>
              {totalDiscoveredEmployees > 0 ? (
                <>
                  <CheckSquare className="h-6 w-6 mr-3 text-green-600 dark:text-green-500" /> 
                  <div>
                    <p className="font-medium">Discovery complete!</p>
                    <p className="text-sm">Found {totalDiscoveredEmployees} employee{totalDiscoveredEmployees !== 1 ? 's' : ''}.</p>
                  </div>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-6 w-6 mr-3 text-yellow-600 dark:text-yellow-500" />
                  <div>
                    <p className="font-medium">No employees found</p>
                    <p className="text-sm">You can add employees manually using the "Add Employee" button below.</p>
                  </div>
                </>
              )}
            </div>
          )}
        </section>

        {isDiscoveryComplete && !isLoading && (
          <>
            {employees.length > 0 && (
              <>
                <EmployeeMetrics employees={employees} departmentDistribution={departmentDistribution} locationCount={locationCount} remoteWorkers={remoteWorkers} />
                <DepartmentDistributionSection departmentDistribution={departmentDistribution} totalEmployees={employees.length} />
              </>
            )}
            
            <section className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <Users className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
                  Manage Employee List
                </h2>
                <div className="flex gap-3">
                  <button 
                    className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2 transition-all shadow-sm" 
                    onClick={() => setIsManageModalOpen(true)}
                  >
                    <Users className="h-4 w-4" /> Manage All
                  </button>
                  <button 
                    className="bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 flex items-center gap-2 transition-all shadow-sm hover:shadow" 
                    onClick={() => setIsAddEmployeeModalOpen(true)}
                  >
                    <Plus className="h-4 w-4" /> Add Employee
                  </button>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow transition-shadow">
                <SearchAndFilterBar 
                  searchTerm={searchTerm} 
                  setSearchTerm={setSearchTerm} 
                  selectedDepartment={selectedDepartment} 
                  setSelectedDepartment={setSelectedDepartment} 
                  selectedStatus={selectedStatus} 
                  setSelectedStatus={setSelectedStatus} 
                  departments={departments} 
                />
                
                <BulkActions 
                  selectedCount={selectedEmployees.length} 
                  handleBulkInclude={handleBulkInclude} 
                  handleBulkExclude={handleBulkExclude} 
                />
                
                <EmployeeTable 
                  employees={paginatedEmployees} 
                  isMobile={isMobile} 
                  selectedEmployees={selectedEmployees} 
                  onToggleSelection={handleToggleSelection} 
                  onToggleStatus={handleToggleStatus} 
                  onViewDetails={setSelectedEmployee} 
                  selectAll={selectAllOnPage} 
                  onSelectAllChange={handleSelectAllOnPage} 
                />
                
                <PaginationControls 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  handlePreviousPage={handlePreviousPage} 
                  handleNextPage={handleNextPage} 
                  startEntry={startEntry} 
                  endEntry={endEntry} 
                  totalFilteredEntries={filteredEmployees.length} 
                />
              </div>
            </section>
          </>
        )}

        <footer className="flex justify-between mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button 
            onClick={handleBack} 
            variant="outline" 
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 px-6 py-2.5 rounded-lg transition-all flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Previous
          </Button>
          
          <Button 
            onClick={handleNext} 
            disabled={!isDiscoveryComplete} 
            className={`px-6 py-2.5 rounded-lg transition-all flex items-center gap-2 shadow-sm hover:shadow ${
              isDiscoveryComplete 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Next <ArrowRight className="h-4 w-4" />
          </Button>
        </footer>
      </div>
    </>
  );
};

// Custom animations
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.6s ease-out forwards;
  }
  .animate-slide-in {
    animation: slideIn 0.4s ease-out forwards;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default EmployeePage;