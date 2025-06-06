// lib/services/employeeService.ts
import { Employee, DepartmentDistribution } from '../types';

// Mock data for the employee service
const mockEmployees: Employee[] = [
  {
    id: 1,
    name: 'Jane Cooper',
    email: 'jane.cooper@example.com',
    department: 'Marketing',
    position: 'Marketing Director',
    status: 'Included',
    location: 'New York City',
    workModel: 'Hybrid (3 days in office)',
    age: 34,
    gender: 'Female',
    ethnicity: 'White',
    timeZone: 'Eastern Time (ET)',
    tenure: '3 years, 2 months',
    language: 'English (Primary), Spanish',
    profilePicture: '/avatars/1.jpg',
    workActivity: {
      avgHours: 42.5,
      weeklyHours: [8.4, 10.8, 9.0, 7.8, 6.6, 0, 0]
    }
  },
  {
    id: 2,
    name: 'John Smith',
    email: 'john.smith@example.com',
    department: 'Engineering',
    position: 'Software Engineer',
    status: 'Included',
    location: 'San Francisco',
    workModel: 'Remote',
    age: 29,
    gender: 'Male',
    ethnicity: 'Asian',
    timeZone: 'Pacific Time (PT)',
    tenure: '1 year, 8 months',
    language: 'English, Mandarin',
    profilePicture: '/avatars/2.jpg',
    workActivity: {
      avgHours: 45.2,
      weeklyHours: [9.5, 9.8, 9.2, 8.7, 8.0, 0, 0]
    }
  },
  {
    id: 3,
    name: 'Robert Johnson',
    email: 'robert.johnson@example.com',
    department: 'Sales',
    position: 'Sales Manager',
    status: 'Included',
    location: 'Austin',
    workModel: 'Hybrid (2 days in office)',
    age: 41,
    gender: 'Male',
    ethnicity: 'Black',
    timeZone: 'Central Time (CT)',
    tenure: '5 years, 3 months',
    language: 'English, French',
    profilePicture: '/avatars/3.jpg',
    workActivity: {
      avgHours: 47.8,
      weeklyHours: [9.5, 10.2, 9.8, 9.3, 8.2, 0.8, 0]
    }
  },
  {
    id: 4,
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@example.com',
    department: 'Product',
    position: 'Product Manager',
    status: 'Excluded',
    location: 'Remote',
    workModel: 'Remote',
    age: 32,
    gender: 'Female',
    ethnicity: 'Hispanic',
    timeZone: 'Mountain Time (MT)',
    tenure: '2 years, 5 months',
    language: 'English, Spanish',
    profilePicture: '/avatars/4.jpg',
    workActivity: {
      avgHours: 39.5,
      weeklyHours: [8.0, 8.5, 8.2, 7.8, 7.0, 0, 0]
    }
  },
  {
    id: 5,
    name: 'David Kim',
    email: 'david.kim@example.com',
    department: 'Finance',
    position: 'Finance Director',
    status: 'Included',
    location: 'London',
    workModel: 'In-office',
    age: 38,
    gender: 'Male',
    ethnicity: 'Asian',
    timeZone: 'GMT',
    tenure: '4 years, 1 month',
    language: 'English, Korean',
    profilePicture: '/avatars/5.jpg',
    workActivity: {
      avgHours: 44.2,
      weeklyHours: [9.2, 9.5, 9.0, 8.5, 8.0, 0, 0]
    }
  }
];

// Create full mock data set with 248 employees
const generateFullEmployeeList = (): Employee[] => {
  const departments = ['Engineering', 'Sales', 'Marketing', 'Finance', 'Product', 'HR', 'Customer Support', 'Legal'];
  const positions = {
    'Engineering': ['Software Engineer', 'QA Engineer', 'DevOps Engineer', 'Engineering Manager', 'CTO'],
    'Sales': ['Sales Representative', 'Account Executive', 'Sales Manager', 'VP of Sales'],
    'Marketing': ['Marketing Specialist', 'Content Writer', 'Marketing Manager', 'CMO', 'Marketing Director'],
    'Finance': ['Financial Analyst', 'Accountant', 'Finance Manager', 'CFO', 'Finance Director'],
    'Product': ['Product Manager', 'UX Designer', 'Product Owner', 'VP of Product'],
    'HR': ['HR Specialist', 'Recruiter', 'HR Manager', 'Chief People Officer'],
    'Customer Support': ['Support Specialist', 'Support Manager', 'Customer Success Manager'],
    'Legal': ['Legal Counsel', 'Compliance Officer', 'General Counsel']
  };
  const locations = ['New York City', 'San Francisco', 'Austin', 'Chicago', 'London', 'Berlin', 'Singapore', 'Tokyo', 'Sydney', 'Toronto', 'Remote', 'Paris'];
  const workModels = ['Remote', 'In-office', 'Hybrid (1 day in office)', 'Hybrid (2 days in office)', 'Hybrid (3 days in office)', 'Hybrid (4 days in office)'];
  
  // Distribution based on the images
  const departmentCounts = {
    'Engineering': 67,
    'Sales': 54,
    'Marketing': 32,
    'Finance': 28,
    'Product': 26,
    'HR': 18,
    'Customer Support': 15,
    'Legal': 8
  };
  
  let id = 6;
  const fullList = [...mockEmployees];
  
  // Generate remaining employees to match department distribution
  Object.entries(departmentCounts).forEach(([dept, count]) => {
    // Calculate how many more employees to add for this department
    const existingCount = mockEmployees.filter(e => e.department === dept).length;
    const remainingToAdd = count - existingCount;
    
    for (let i = 0; i < remainingToAdd; i++) {
      const positionsForDept = positions[dept as keyof typeof positions];
      const position = positionsForDept[Math.floor(Math.random() * positionsForDept.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const workModel = workModels[Math.floor(Math.random() * workModels.length)];
      const firstName = `Employee`;
      const lastName = `${id}`;
      
      fullList.push({
        id,
        name: `${firstName} ${lastName}`,
        email: `employee${id}@example.com`,
        department: dept,
        position,
        status: Math.random() > 0.02 ? 'Included' : 'Excluded', // ~2% excluded
        location,
        workModel,
        age: 25 + Math.floor(Math.random() * 30),
        workActivity: {
          avgHours: 38 + Math.random() * 12,
          weeklyHours: [
            Math.random() * 10,
            Math.random() * 10,
            Math.random() * 10,
            Math.random() * 10,
            Math.random() * 10,
            Math.random() > 0.8 ? Math.random() * 4 : 0,
            Math.random() > 0.9 ? Math.random() * 2 : 0
          ]
        }
      });
      
      id++;
    }
  });
  
  return fullList;
};

// Initialize with empty array, will be populated when discovery runs
let employeeList: Employee[] = [];

export const employeeService = {
  // Run discovery to find employees
  runDiscovery: async (): Promise<number> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate the full employee list
    employeeList = generateFullEmployeeList();
    
    return employeeList.length;
  },
  
  // Get all employees
  getEmployees: async (): Promise<Employee[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return employeeList;
  },
  
  // Toggle employee status (Included/Excluded)
  toggleEmployeeStatus: async (employeeId: number): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const employee = employeeList.find(emp => emp.id === employeeId);
    if (employee) {
      employee.status = employee.status === 'Included' ? 'Excluded' : 'Included';
      return true;
    }
    
    return false;
  },
  
  // Add a new employee
  addEmployee: async (employee: Omit<Employee, 'id'>): Promise<Employee> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newId = Math.max(...employeeList.map(emp => emp.id)) + 1;
    const newEmployee = {
      ...employee,
      id: newId
    };
    
    employeeList.push(newEmployee);
    
    return newEmployee;
  },
  
  // Get department distribution
  getDepartmentDistribution: async (): Promise<DepartmentDistribution[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const departmentCounts: Record<string, number> = {};
    employeeList.forEach(emp => {
      departmentCounts[emp.department] = (departmentCounts[emp.department] || 0) + 1;
    });
    
    return Object.entries(departmentCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  },
  
  // Get location count
  getLocationCount: async (): Promise<number> => {
    const locations = new Set(employeeList.map(emp => emp.location).filter(Boolean));
    return locations.size;
  },
  
  // Get remote workers count
  getRemoteWorkersCount: async (): Promise<number> => {
    return employeeList.filter(emp => emp.workModel === 'Remote').length;
  }
};