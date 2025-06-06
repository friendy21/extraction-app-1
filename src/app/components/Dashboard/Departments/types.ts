// Department and related interfaces

export interface TeamMember {
    id: string;
    name: string;
    role: string;
    avatar: string;
  }
  
  export interface Role {
    title: string;
    count: number;
  }
  
  export interface WorkModel {
    type: string;
    count: number;
  }
  
  export interface Department {
    id: string;
    name: string;
    head: string;
    headId: string;
    employeeCount: number;
    location: string;
    organization: string;
    status: 'Active' | 'Inactive';
    description: string;
    parentId?: string;
    roles: Role[];
    workModel: WorkModel[];
    teamMembers?: TeamMember[];
  }
  
  // User interface from main Dashboard
  export interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: string;
    department: string;
    ipAddress: string;
  }