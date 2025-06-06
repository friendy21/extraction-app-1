"use client"

import React from 'react';
import { Button } from '../../../components/ui/button';
import { Eye } from 'lucide-react';

interface Email {
  address: string;
  source?: string;
  isPrimary?: boolean;
}

interface Employee {
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
}

interface ViewDetailsButtonProps {
  employee: Employee;
  onViewDetails: (employee: Employee) => void;
}

const ViewDetailsButton: React.FC<ViewDetailsButtonProps> = ({ employee, onViewDetails }) => {
  // Handle the button click
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("View details clicked for employee:", employee.id, employee.name);
    
    const employeeCopy = JSON.parse(JSON.stringify(employee));
    onViewDetails(employeeCopy);
  };

  return (
    <Button 
      variant="link" 
      className="text-blue-600 hover:text-blue-800 flex items-center"
      onClick={handleClick}
    >
      <Eye className="h-4 w-4 mr-1" />
      View Details
    </Button>
  );
};

export default ViewDetailsButton;