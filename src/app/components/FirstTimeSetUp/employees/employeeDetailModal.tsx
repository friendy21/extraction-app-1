"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Users, Building, MapPin, Home, Search, Filter, CheckSquare, XSquare, Plus } from 'lucide-react';
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
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6'];

// Sub-Components
const MetricCard: React.FC<{ icon: React.ReactNode; value: number | string; label: string }> = ({ icon, value, label }) => (
  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 opacity-0 animate-fade-in" style={{ animationDelay: '0.1s' }}>
    <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">{icon}</div>
    <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
    <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
  </div>
);

const EmployeeMetrics: React.FC<{ employees: Employee[]; departmentDistribution: DepartmentDistribution[]; locationCount: number; remoteWorkers: number }> = ({ employees, departmentDistribution, locationCount, remoteWorkers }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <MetricCard icon={<Users className="w-6 h-6" />} value={employees.length} label="Total Employees" />
    <MetricCard icon={<Building className="w-6 h-6" />} value={departmentDistribution.length} label="Departments" />
    <MetricCard icon={<MapPin className="w-6 h-6" />} value={locationCount} label="Locations" />
    <MetricCard icon={<Home className="w-6 h-6" />} value={remoteWorkers} label="Remote Workers" />
  </div>
);

const DepartmentDistributionSection: React.FC<{ departmentDistribution: DepartmentDistribution[]; totalEmployees: number }> = ({ departmentDistribution, totalEmployees }) => {
  const [hoveredDept, setHoveredDept] = useState<string | null>(null);

  const departmentData = departmentDistribution.map((dept, index) => ({
    ...dept,
    percentage: ((dept.count / totalEmployees) * 100).toFixed(1),
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow mb-8">
      <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-6">Department Distribution</h2>
      {totalEmployees > 0 && departmentDistribution.length > 0 ? (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2 relative">
            <svg viewBox="0 0 100 100" className="w-full h-64">
              {departmentData.map((dept, index) => {
                const startAngle = departmentData.slice(0, index).reduce((sum, d) => sum + parseFloat(d.percentage), 0) * 3.6;
                const endAngle = startAngle + (parseFloat(dept.percentage) * 3.6);
                const largeArc = (endAngle - startAngle) > 180 ? 1 : 0;
                const pathData = `M50,50 L${50 + 40 * Math.cos(startAngle * Math.PI / 180)},${50 + 40 * Math.sin(startAngle * Math.PI / 180)} A40,40 0 ${largeArc},1 ${50 + 40 * Math.cos(endAngle * Math.PI / 180)},${50 + 40 * Math.sin(endAngle * Math.PI / 180)} Z`;
                return (
                  <path
                    key={dept.name}
                    d={pathData}
                    fill={dept.color}
                    stroke="white"
                    strokeWidth="2"
                    onMouseEnter={() => setHoveredDept(dept.name)}
                    onMouseLeave={() => setHoveredDept(null)}
                    className="transition-all duration-300"
                    style={{ transform: hoveredDept === dept.name ? 'scale(1.05)' : 'scale(1)', transformOrigin: '50% 50%' }}
                  />
                );
              })}
              <circle cx="50" cy="50" r="30" fill="white" />
            </svg>
            {hoveredDept && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-lg font-bold text-gray-900 dark:text-white">{hoveredDept}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{departmentData.find(d => d.name === hoveredDept)?.percentage}%</p>
              </div>
            )}
          </div>
          <div className="lg:w-1/2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {departmentData.map((dept) => (
                <div key={dept.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: dept.color }}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{dept.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{dept.count} employees ({dept.percentage}%)</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No department data available.</p>
      )}
    </div>
  );
};

const SearchAndFilterBar: React.FC<{ searchTerm: string; setSearchTerm: (term: string) => void; selectedDepartment: string; setSelectedDepartment: (dept: string) => void; selectedStatus: string; setSelectedStatus: (status: string) => void; departments: string[] }> = ({ searchTerm, setSearchTerm, selectedDepartment, setSelectedDepartment, selectedStatus, setSelectedStatus, departments }) => (
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
          className="w-full pl-3 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white appearance-none"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          aria-label="Filter by department"
        >
          {departments.map(dept => <option key={dept} value={dept}>{dept === 'All' ? 'All Departments' : dept}</option>)}
        </select>
        <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>
      <div className="relative flex-1">
        <select
          className="w-full pl-3 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white appearance-none"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="All">All Status</option>
          <option value="Included">Included</option>
          <option value="Excluded">Excluded</option>
        </select>
        <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>
    </div>
  </div>
);

const BulkActions: React.FC<{ selectedCount: number; handleBulkInclude: () => void; handleBulkExclude: () => void }> = ({ selectedCount, handleBulkInclude, handleBulkExclude }) => (
  selectedCount > 0 ? (
    <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4 opacity-0 animate-slide-in" style={{ animationDelay: '0.2s' }}>
      <span className="text-blue-700 dark:text-blue-200 font-medium">{selectedCount} employee{selectedCount > 1 ? 's' : ''} selected</span>
      <div className="flex gap-3">
        <button onClick={handleBulkInclude} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"><CheckSquare className="h-4 w-4" /> Include</button>
        <button onClick={handleBulkExclude} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"><XSquare className="h-4 w-4" /> Exclude</button>
      </div>
    </div>
  ) : null
);

const PaginationControls: React.FC<{ currentPage: number; totalPages: number; handlePreviousPage: () => void; handleNextPage: () => void; startEntry: number; endEntry: number; totalFilteredEntries: number }> = ({ currentPage, totalPages, handlePreviousPage, handleNextPage, startEntry, endEntry, totalFilteredEntries }) => (
  <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
    <span className="text-sm text-gray-600 dark:text-gray-400">
      {totalFilteredEntries > 0 ? `Showing ${startEntry} to ${endEntry} of ${totalFilteredEntries} entries` : 'No entries to show'}
    </span>
    <div className="flex items-center gap-3">
      <button onClick={handlePreviousPage} disabled={currentPage === 1} className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-all" aria-label="Previous page">Previous</button>
      <span className="text-gray-700 dark:text-gray-300 font-medium">Page {currentPage} of {totalPages || 1}</span>
      <button onClick={handleNextPage} disabled={currentPage === totalPages || totalPages === 0} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all" aria-label="Next page">Next</button>
    </div>
  </div>
);

interface EmployeeTableProps {
  employees: Employee[];
  isMobile: boolean;
  selectedEmployees: number[];
  onToggleSelection: (employeeId: number) => void;
  onToggleStatus: (employeeId: number) => void;
  onViewDetails: (employee: Employee) => void;
  selectAll: boolean;
  onSelectAllChange: (checked: boolean) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ employees, isMobile, selectedEmployees, onToggleSelection, onToggleStatus, onViewDetails, selectAll, onSelectAllChange }) => (
  isMobile ? (
    <div className="space-y-4">
      {employees.map((employee) => (
        <div key={employee.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={selectedEmployees.includes(employee.id)} onChange={() => onToggleSelection(employee.id)} className="h-4 w-4 text-blue-600" />
              {employee.profilePicture ? (
                <img src={employee.profilePicture} alt={`${employee.name}'s profile`} className="w-12 h-12 rounded-full object-cover" loading="lazy" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">{employee.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'}</div>
              )}
              <div>
                <button onClick={() => onViewDetails(employee)} className="text-base font-medium text-gray-900 dark:text-white hover:underline">{employee.name || 'N/A'}</button>
                <p className="text-sm text-gray-500 dark:text-gray-400">{employee.email || 'No Email'}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{employee.department} - {employee.position}</p>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer ${employee.status === 'Included' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
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
      {employees.length === 0 && <div className="p-4 text-center text-gray-500 dark:text-gray-400">No employees found.</div>}
    </div>
  ) : (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <table className="w-full text-sm text-gray-700 dark:text-gray-300">
        <thead className="bg-gray-100 dark:bg-gray-700 text-xs uppercase text-gray-600 dark:text-gray-400">
          <tr>
            <th className="p-4 text-center"><input type="checkbox" checked={selectAll} onChange={(e) => onSelectAllChange(e.target.checked)} className="h-4 w-4 text-blue-600" aria-label="Select all" /></th>
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Email</th>
            <th className="p-4 text-left">Department</th>
            <th className="p-4 text-left">Position</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {employees.map((employee) => (
            <tr key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <td className="p-4 text-center"><input type="checkbox" checked={selectedEmployees.includes(employee.id)} onChange={() => onToggleSelection(employee.id)} className="h-4 w-4 text-blue-600" /></td>
              <td className="p-4 flex items-center gap-3">
                {employee.profilePicture ? (
                  <img src={employee.profilePicture} alt={`${employee.name}'s profile`} className="w-10 h-10 rounded-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">{employee.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'}</div>
                )}
                <button onClick={() => onViewDetails(employee)} className="font-medium text-gray-900 dark:text-white hover:underline">{employee.name || 'N/A'}</button>
              </td>
              <td className="p-4 truncate max-w-[200px]">{employee.email || '-'}</td>
              <td className="p-4 truncate max-w-[150px]">{employee.department || '-'}</td>
              <td className="p-4 truncate max-w-[150px]">{employee.position || '-'}</td>
              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer ${employee.status === 'Included' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                  onClick={() => onToggleStatus(employee.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onToggleStatus(employee.id); }}
                >
                  {employee.status}
                </span>
              </td>
              <td className="p-4"><button onClick={() => onViewDetails(employee)} className="text-blue-600 hover:text-blue-800 font-medium">View Details</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {employees.length === 0 && <div className="p-4 text-center text-gray-500 dark:text-gray-400">No employees found.</div>}
    </div>
  )
);

// Main Component
const EmployeePage: React.FC = () => {
  const router = useRouter();
  const { setCurrentStep } = useStep();

  // State
  const [isDiscoveryComplete, setIsDiscoveryComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [totalDiscoveredEmployees, setTotalDiscoveredEmployees] = useState(0);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departmentDistribution, setDepartmentDistribution] = useState<DepartmentDistribution[]>([]);
  const [locationCount, setLocationCount] = useState(0);
  const [remoteWorkers, setRemoteWorkers] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
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
  useEffect(() => { setSelectedEmployees([]); setSelectAllOnPage(false); }, [filteredEmployees]);
  useEffect(() => {
    const pageIds = paginatedEmployees.map(emp => emp.id);
    setSelectAllOnPage(pageIds.length > 0 && pageIds.every(id => selectedEmployees.includes(id)));
  }, [selectedEmployees, paginatedEmployees]);

  // Callbacks
  const handleNavigation = useCallback((step: number, path: string) => { setCurrentStep(step); router.push(path); }, [setCurrentStep, router]);
  const handleBack = useCallback(() => handleNavigation(1, '/components/FirstTimeSetUp/ConnectionSetup'), [handleNavigation]);
  const handleNext = useCallback(() => handleNavigation(3, '/components/FirstTimeSetUp/DataSetup'), [handleNavigation]);
  const handlePreviousPage = useCallback(() => setCurrentPage(prev => Math.max(prev - 1, 1)), []);
  const handleNextPage = useCallback(() => setCurrentPage(prev => Math.min(prev + 1, totalPages)), [totalPages]);

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

  const handleToggleSelection = useCallback((id: number) => setSelectedEmployees(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]), []);
  const handleSelectAllOnPage = useCallback((checked: boolean) => {
    const pageIds = paginatedEmployees.map(emp => emp.id);
    setSelectedEmployees(prev => checked ? [...new Set([...prev, ...pageIds])] : prev.filter(id => !pageIds.includes(id)));
  }, [paginatedEmployees]);
  const handleToggleStatus = useCallback(async (id: number) => {
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
  const performBulkUpdate = useCallback(async (status: 'Included' | 'Excluded') => {
    const original = [...employees];
    setEmployees(prev => prev.map(emp => selectedEmployees.includes(emp.id) ? { ...emp, status } : emp));
    try {
      await Promise.all(selectedEmployees.map(id => employeeService.updateEmployeeStatus(id, status)));
      setSelectedEmployees([]);
    } catch (error) {
      setErrorMessage(`Failed to bulk update to ${status}.`);
      setEmployees(original);
      console.error(error);
    }
  }, [selectedEmployees, employees]);
  const handleBulkInclude = useCallback(() => performBulkUpdate('Included'), [performBulkUpdate]);
  const handleBulkExclude = useCallback(() => performBulkUpdate('Excluded'), [performBulkUpdate]);

  // Render
  return (
    <>
      {selectedEmployee && <EmployeeDetailModal isOpen={!!selectedEmployee} onClose={() => setSelectedEmployee(null)} employee={selectedEmployee} onStatusChange={refreshEmployeeData} />}
      {isManageModalOpen && <ManageEmployeesModal isOpen={isManageModalOpen} onClose={() => setIsManageModalOpen(false)} onEmployeeStatusChange={refreshEmployeeData} />}
      {isAddEmployeeModalOpen && <AddEmployeeModal isOpen={isAddEmployeeModalOpen} onClose={() => setIsAddEmployeeModalOpen(false)} onEmployeeAdded={refreshEmployeeData} />}
      <div className="p-6 max-w-7xl mx-auto space-y-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">Employee Discovery</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and explore your employee data with ease.</p>
        </header>

        {errorMessage && (
          <div className="p-4 bg-red-50 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 rounded-lg animate-slide-in" role="alert">
            <p className="font-semibold">Error</p>
            <p>{errorMessage}</p>
          </div>
        )}

        <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400">Discover Employees</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Fetch employees from connected platforms.</p>
            </div>
            <button
              onClick={runDiscovery}
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition-all"
            >
              {isLoading ? <><Loader2 className="h-5 w-5 animate-spin" /> Running...</> : 'Run Discovery'}
            </button>
          </div>
          {isLoading && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg text-blue-700 dark:text-blue-200 flex items-center animate-pulse">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Discovery in progress...
            </div>
          )}
          {isDiscoveryComplete && !isLoading && (
            <div className={`mt-4 p-4 rounded-lg flex items-center text-sm ${totalDiscoveredEmployees > 0 ? 'bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-100' : 'bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-100'} animate-slide-in`}>
              {totalDiscoveredEmployees > 0 ? <><CheckSquare className="h-5 w-5 mr-2" /> Discovery complete! Found {totalDiscoveredEmployees} employee{totalDiscoveredEmployees !== 1 ? 's' : ''}.</> : <><Users className="h-5 w-5 mr-2" /> No employees found. Add manually below.</>}
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
                <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">Manage Employee List</h2>
                <div className="flex gap-3">
                  <button className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2 transition-all" onClick={() => setIsManageModalOpen(true)}>
                    <Users className="h-4 w-4" /> Manage All
                  </button>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 transition-all" onClick={() => setIsAddEmployeeModalOpen(true)}>
                    <Plus className="h-4 w-4" /> Add Employee
                  </button>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <SearchAndFilterBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedDepartment={selectedDepartment} setSelectedDepartment={setSelectedDepartment} selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} departments={departments} />
                <BulkActions selectedCount={selectedEmployees.length} handleBulkInclude={handleBulkInclude} handleBulkExclude={handleBulkExclude} />
                <EmployeeTable employees={paginatedEmployees} isMobile={isMobile} selectedEmployees={selectedEmployees} onToggleSelection={handleToggleSelection} onToggleStatus={handleToggleStatus} onViewDetails={setSelectedEmployee} selectAll={selectAllOnPage} onSelectAllChange={handleSelectAllOnPage} />
                <PaginationControls currentPage={currentPage} totalPages={totalPages} handlePreviousPage={handlePreviousPage} handleNextPage={handleNextPage} startEntry={startEntry} endEntry={endEntry} totalFilteredEntries={filteredEmployees.length} />
              </div>
            </section>
          </>
        )}

        <footer className="flex justify-between mt-8">
          <Button onClick={handleBack} variant="outline" className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 px-6 py-2 rounded-lg transition-all">Previous</Button>
          <Button onClick={handleNext} disabled={!isDiscoveryComplete} className={`px-6 py-2 rounded-lg ${isDiscoveryComplete ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} transition-all`}>Next</Button>
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
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.5s ease-in-out forwards;
  }
  .animate-slide-in {
    animation: slideIn 0.5s ease-in-out forwards;
  }
`;
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default EmployeePage;