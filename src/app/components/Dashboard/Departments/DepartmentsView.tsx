"use client"

import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import { XIcon, PlusIcon } from 'lucide-react';
import DepartmentViewModal from './DepartmentViewModal';
import DepartmentEditModal from './DepartmentEditModal';
import DepartmentAddModal from './DepartmentAddModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import OrganizationalChart from './OrganizationalChart';

// Define department interface
interface Department {
  id: string;
  name: string;
  head: string;
  headId: string;
  employeeCount: number;
  location: string;
  organization: string;
  status: 'Active' | 'Inactive';
  description: string;
  roles: {
    title: string;
    count: number;
  }[];
  workModel: {
    type: string;
    count: number;
  }[];
  teamMembers?: {
    id: string;
    name: string;
    role: string;
    avatar: string;
  }[];
}

const DepartmentsView: React.FC = () => {
  // State for executives
  const [executives, setExecutives] = useState([
    {
      id: 'exec1',
      name: 'John Anderson',
      title: 'CEO',
      avatar: '/api/placeholder/32/32'
    }
  ]);

  // State for departments data
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: 'dept1',
      name: 'Engineering',
      head: 'Michael Chen',
      headId: 'user3',
      employeeCount: 67,
      location: 'San Francisco',
      organization: 'Product Development',
      status: 'Active',
      description: 'The Engineering department is responsible for all software development, infrastructure, and technical innovation at the company. The team consists of frontend developers, backend engineers, DevOps specialists, and QA engineers working across multiple product lines.',
      roles: [
        { title: 'Software Engineers', count: 42 },
        { title: 'DevOps Engineers', count: 12 },
        { title: 'QA Engineers', count: 8 },
        { title: 'Engineering Managers', count: 5 }
      ],
      workModel: [
        { type: 'On-site', count: 24 },
        { type: 'Hybrid', count: 30 },
        { type: 'Remote', count: 13 }
      ],
      teamMembers: [
        { id: 'emp1', name: 'James Wilson', role: 'Frontend Lead', avatar: '/api/placeholder/32/32' },
        { id: 'emp2', name: 'Sophia Garcia', role: 'Backend Lead', avatar: '/api/placeholder/32/32' },
        { id: 'emp3', name: 'Daniel Smith', role: 'DevOps', avatar: '/api/placeholder/32/32' },
        { id: 'emp4', name: 'Amanda Lopez', role: 'QA Lead', avatar: '/api/placeholder/32/32' },
        { id: 'emp5', name: 'Alice', role: 'Frontend Developer', avatar: '/api/placeholder/32/32' },
        { id: 'emp6', name: 'Bob', role: 'Frontend Developer', avatar: '/api/placeholder/32/32' },
        { id: 'emp7', name: 'Charlie', role: 'Frontend Developer', avatar: '/api/placeholder/32/32' },
        { id: 'emp8', name: 'Diana', role: 'Frontend Developer', avatar: '/api/placeholder/32/32' },
        { id: 'emp9', name: 'Eric', role: 'Backend Developer', avatar: '/api/placeholder/32/32' },
        { id: 'emp10', name: 'Fiona', role: 'Backend Developer', avatar: '/api/placeholder/32/32' },
        { id: 'emp11', name: 'George', role: 'Backend Developer', avatar: '/api/placeholder/32/32' },
        { id: 'emp12', name: 'Hannah', role: 'Backend Developer', avatar: '/api/placeholder/32/32' }
      ]
    },
    {
      id: 'dept2',
      name: 'Sales',
      head: 'Alex Thompson',
      headId: 'user5',
      employeeCount: 54,
      location: 'Austin',
      organization: 'Revenue',
      status: 'Active',
      description: 'The Sales department handles all customer acquisition, relationship management, and revenue generation activities.',
      roles: [
        { title: 'Account Executives', count: 28 },
        { title: 'Sales Development Reps', count: 18 },
        { title: 'Sales Operations', count: 5 },
        { title: 'Sales Managers', count: 3 }
      ],
      workModel: [
        { type: 'On-site', count: 20 },
        { type: 'Hybrid', count: 25 },
        { type: 'Remote', count: 9 }
      ]
    },
    {
      id: 'dept3',
      name: 'Marketing',
      head: 'Sarah Johnson',
      headId: 'user2',
      employeeCount: 32,
      location: 'New York',
      organization: 'Growth',
      status: 'Active',
      description: 'The Marketing department is responsible for brand management, lead generation, digital marketing campaigns, and customer communications.',
      roles: [
        { title: 'Digital Marketers', count: 12 },
        { title: 'Content Writers', count: 8 },
        { title: 'Brand Specialists', count: 6 },
        { title: 'Marketing Analysts', count: 4 },
        { title: 'Marketing Managers', count: 2 }
      ],
      workModel: [
        { type: 'On-site', count: 10 },
        { type: 'Hybrid', count: 15 },
        { type: 'Remote', count: 7 }
      ]
    },
    {
      id: 'dept4',
      name: 'Finance',
      head: 'David Kim',
      headId: 'user6',
      employeeCount: 28,
      location: 'London',
      organization: 'Operations',
      status: 'Active',
      description: 'The Finance department manages all financial planning, accounting, budgeting, and financial reporting activities for the company.',
      roles: [
        { title: 'Financial Analysts', count: 10 },
        { title: 'Accountants', count: 12 },
        { title: 'Financial Controllers', count: 4 },
        { title: 'Finance Managers', count: 2 }
      ],
      workModel: [
        { type: 'On-site', count: 18 },
        { type: 'Hybrid', count: 8 },
        { type: 'Remote', count: 2 }
      ]
    },
    {
      id: 'dept5',
      name: 'Product',
      head: 'Emily Rodriguez',
      headId: 'user4',
      employeeCount: 26,
      location: 'Remote',
      organization: 'Product Development',
      status: 'Active',
      description: 'The Product department oversees product strategy, roadmap planning, user experience design, and product lifecycle management.',
      roles: [
        { title: 'Product Managers', count: 10 },
        { title: 'UX Designers', count: 8 },
        { title: 'Product Analysts', count: 6 },
        { title: 'Product Directors', count: 2 }
      ],
      workModel: [
        { type: 'On-site', count: 5 },
        { type: 'Hybrid', count: 10 },
        { type: 'Remote', count: 11 }
      ]
    },
    {
      id: 'dept6',
      name: 'Customer Support',
      head: 'Robert Taylor',
      headId: 'user7',
      employeeCount: 15,
      location: 'Chicago',
      organization: 'Operations',
      status: 'Active',
      description: 'The Customer Support department provides technical assistance, product guidance, and issue resolution services to our customers.',
      roles: [
        { title: 'Support Specialists', count: 10 },
        { title: 'Technical Support Engineers', count: 3 },
        { title: 'Support Team Leads', count: 2 }
      ],
      workModel: [
        { type: 'On-site', count: 5 },
        { type: 'Hybrid', count: 5 },
        { type: 'Remote', count: 5 }
      ]
    },
    {
      id: 'dept7',
      name: 'HR',
      head: 'Jessica Lee',
      headId: 'user8',
      employeeCount: 12,
      location: 'New York',
      organization: 'People Operations',
      status: 'Active',
      description: 'The HR department manages recruitment, employee onboarding, benefits administration, performance management, and employee relations.',
      roles: [
        { title: 'HR Specialists', count: 6 },
        { title: 'Recruiters', count: 4 },
        { title: 'HR Managers', count: 2 }
      ],
      workModel: [
        { type: 'On-site', count: 8 },
        { type: 'Hybrid', count: 3 },
        { type: 'Remote', count: 1 }
      ]
    },
    {
      id: 'dept8',
      name: 'Legal',
      head: 'Amanda Wilson',
      headId: 'user9',
      employeeCount: 8,
      location: 'Boston',
      organization: 'Corporate',
      status: 'Active',
      description: 'The Legal department handles all legal matters including contracts, compliance, intellectual property, and corporate governance.',
      roles: [
        { title: 'Corporate Attorneys', count: 4 },
        { title: 'Legal Specialists', count: 3 },
        { title: 'General Counsel', count: 1 }
      ],
      workModel: [
        { type: 'On-site', count: 4 },
        { type: 'Hybrid', count: 3 },
        { type: 'Remote', count: 1 }
      ]
    }
  ]);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(departments.length / itemsPerPage);
  
  // Calculate departments to display on current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDepartments = departments.slice(indexOfFirstItem, indexOfLastItem);
  
  // State for search term
  const [searchTerm, setSearchTerm] = useState('');
  
  // Apply all filters (search term, size, location)
  const filteredDepartments = departments.filter(dept => {
    // Apply search filter
    const matchesSearch = !searchTerm || 
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.head.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply size filter
    let matchesSize = true;
    if (sizeFilter !== 'All Sizes') {
      if (sizeFilter === 'Small (1-15)' && dept.employeeCount > 15) matchesSize = false;
      if (sizeFilter === 'Medium (16-50)' && (dept.employeeCount < 16 || dept.employeeCount > 50)) matchesSize = false;
      if (sizeFilter === 'Large (51+)' && dept.employeeCount < 51) matchesSize = false;
    }
    
    // Apply location filter
    const matchesLocation = locationFilter === 'All Locations' || dept.location === locationFilter;
    
    return matchesSearch && matchesSize && matchesLocation;
  });
  
  // Get departments for the current page
  const totalFilteredItems = filteredDepartments.length;
  const totalFilteredPages = Math.max(1, Math.ceil(totalFilteredItems / itemsPerPage));
  
  // Adjust current page if it exceeds the total pages after filtering
  if (currentPage > totalFilteredPages) {
    setCurrentPage(totalFilteredPages);
  }
  
  // Get departments for display on current page
  const indexOfLastFilteredItem = currentPage * itemsPerPage;
  const indexOfFirstFilteredItem = indexOfLastFilteredItem - itemsPerPage;
  const displayDepartments = filteredDepartments.slice(
    indexOfFirstFilteredItem,
    indexOfLastFilteredItem
  );
  
  // State for sorting
  const [sizeFilter, setSizeFilter] = useState('All Sizes');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  
  // State for active tab
  const [activeTab, setActiveTab] = useState<'list' | 'chart'>('list');
  
  // State for modals
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);
  
  // Handle view department details
  const handleViewDepartment = (departmentId: string) => {
    const department = departments.find(dept => dept.id === departmentId);
    if (department) {
      setCurrentDepartment(department);
      setViewModalOpen(true);
    }
  };
  
  // Handle edit department
  const handleEditDepartment = (departmentId: string) => {
    const department = departments.find(dept => dept.id === departmentId);
    if (department) {
      setCurrentDepartment(department);
      setEditModalOpen(true);
    }
  };
  
  // Handle save edited department
  const handleSaveEdit = (updatedDepartment: Department) => {
    setDepartments(prevDepartments => 
      prevDepartments.map(dept => 
        dept.id === updatedDepartment.id ? updatedDepartment : dept
      )
    );
    setEditModalOpen(false);
  };
  
  // Handle add new department
  const handleAddDepartment = (newDepartment: Department) => {
    setDepartments(prevDepartments => [...prevDepartments, newDepartment]);
    setAddModalOpen(false);
  };
  
  // Handle delete department
  const handleDeleteDepartment = (departmentId: string) => {
    const department = departments.find(dept => dept.id === departmentId);
    if (department) {
      setCurrentDepartment(department);
      setDeleteModalOpen(true);
    }
  };
  
  // Confirm department deletion
  const confirmDeleteDepartment = () => {
    if (currentDepartment) {
      setDepartments(prevDepartments => 
        prevDepartments.filter(dept => dept.id !== currentDepartment.id)
      );
      setDeleteModalOpen(false);
    }
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Department Management</h1>
        
        {/* Search and Filter Row */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search departments"
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select
                className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sizeFilter}
                onChange={(e) => setSizeFilter(e.target.value)}
              >
                <option>All Sizes</option>
                <option>Small (1-15)</option>
                <option>Medium (16-50)</option>
                <option>Large (51+)</option>
              </select>
              <div className="absolute right-3 top-3 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            <div className="relative">
              <select
                className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                <option>All Locations</option>
                <option>San Francisco</option>
                <option>Austin</option>
                <option>New York</option>
                <option>London</option>
                <option>Chicago</option>
                <option>Boston</option>
                <option>Remote</option>
              </select>
              <div className="absolute right-3 top-3 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              onClick={() => setAddModalOpen(true)}
            >
              <PlusIcon size={16} />
              <span>Add Department</span>
            </button>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button 
              className={`border-b-2 pb-4 px-1 text-sm font-medium ${
                activeTab === 'list' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('list')}
            >
              Department List
            </button>
            <button 
              className={`border-b-2 pb-4 px-1 text-sm font-medium ${
                activeTab === 'chart' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('chart')}
            >
              Organizational Chart
            </button>
          </nav>
        </div>
        
        {/* Departments Table or Org Chart based on active tab */}
        {activeTab === 'list' ? (
          /* Departments Table */
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee Count
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department Head
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayDepartments.map((department) => (
                <tr key={department.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{department.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{department.employeeCount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{department.head}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{department.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleViewDepartment(department.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleEditDepartment(department.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteDepartment(department.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-700">
            Showing {totalFilteredItems === 0 ? 0 : indexOfFirstFilteredItem + 1} to {Math.min(indexOfLastFilteredItem, totalFilteredItems)} of {totalFilteredItems} departments
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* Page numbers */}
            {Array.from({ length: totalFilteredPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-200'}`}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(Math.min(totalFilteredPages, currentPage + 1))}
              disabled={currentPage === totalFilteredPages}
              className={`p-2 rounded ${currentPage === totalFilteredPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        ) : (
          <OrganizationalChart 
            departments={departments} 
            executives={executives}
            onViewDepartment={handleViewDepartment} 
          />
        )}
      </div>
      
      {/* View Department Modal */}
      {viewModalOpen && currentDepartment && (
        <DepartmentViewModal
          department={currentDepartment}
          onClose={() => setViewModalOpen(false)}
          onEdit={() => {
            setViewModalOpen(false);
            setEditModalOpen(true);
          }}
        />
      )}
      
      {/* Edit Department Modal */}
      {editModalOpen && currentDepartment && (
        <DepartmentEditModal
          department={currentDepartment}
          onClose={() => setEditModalOpen(false)}
          onSave={handleSaveEdit}
        />
      )}
      
      {/* Add Department Modal */}
      {addModalOpen && (
        <DepartmentAddModal
          onClose={() => setAddModalOpen(false)}
          onAdd={handleAddDepartment}
          existingDepartments={departments}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      {deleteModalOpen && currentDepartment && (
        <DeleteConfirmationModal
          departmentName={currentDepartment.name}
          onConfirm={confirmDeleteDepartment}
          onCancel={() => setDeleteModalOpen(false)}
        />
      )}
    </div>
  );
};

export default DepartmentsView;