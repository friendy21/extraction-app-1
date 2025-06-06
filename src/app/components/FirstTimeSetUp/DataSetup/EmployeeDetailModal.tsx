"use client"

import React from 'react';
import { X, User, AlertTriangle, Calendar, FileText } from 'lucide-react';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { 
  Dialog, 
  DialogContent,
  DialogFooter
} from '../../ui/dialog';

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
  isIncluded?: boolean; // Add this property to match DataOverviewPage
}

interface EmployeeDetailModalProps {
  employee: Employee;
  onClose: () => void;
  onUpdateInclusionStatus: (employee: Employee) => void; // Add this prop
}

const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({ 
  employee, 
  onClose,
  onUpdateInclusionStatus 
}) => {
  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  // Handle inclusion status changes
  const handleInclude = () => {
    const updatedEmployee = { ...employee, isIncluded: true };
    onUpdateInclusionStatus(updatedEmployee);
    onClose();
  };

  const handleExclude = () => {
    const updatedEmployee = { ...employee, isIncluded: false };
    onUpdateInclusionStatus(updatedEmployee);
    onClose();
  };

  // Generate random percentage changes for metrics
  const getRandomPercentage = (min: number, max: number) => {
    const isPositive = Math.random() > 0.3;
    const value = Math.floor(Math.random() * (max - min + 1)) + min;
    return isPositive ? `+${value}%` : `-${value}%`;
  };

  const emailPercentage = getRandomPercentage(5, 15);
  const chatPercentage = getRandomPercentage(3, 12);
  const meetingPercentage = getRandomPercentage(2, 10);
  const filePercentage = getRandomPercentage(5, 20);

  // Generate mock recent activity
  const generateRecentActivity = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    return [
      {
        type: 'meeting',
        icon: <Calendar className="h-3 w-3 text-white" />,
        iconBg: "bg-blue-500",
        content: `Meeting with ${employee.department || 'Marketing'} Team`,
        time: `Today, ${Math.floor(Math.random() * 12 + 1)}:${Math.random() > 0.5 ? '30' : '00'} ${Math.random() > 0.5 ? 'AM' : 'PM'}`
      },
      {
        type: 'chat',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>,
        iconBg: "bg-green-500",
        content: `Sent ${Math.floor(Math.random() * 30 + 5)} messages in #${employee.department?.toLowerCase() || 'product'}-team channel`,
        time: `Today, ${Math.floor(Math.random() * 12 + 1)}:${Math.random() > 0.5 ? '30' : '00'} ${Math.random() > 0.5 ? 'AM' : 'PM'}`
      },
      {
        type: 'file',
        icon: <FileText className="h-3 w-3 text-white" />,
        iconBg: "bg-purple-500",
        content: `Updated Q${Math.floor(Math.random() * 4 + 1)} Project Plan.docx`,
        time: `Yesterday, ${Math.floor(Math.random() * 12 + 1)}:${Math.random() > 0.5 ? '30' : '00'} ${Math.random() > 0.5 ? 'AM' : 'PM'}`
      }
    ];
  };

  const recentActivity = generateRecentActivity();

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden">
        {/* Header with employee info */}
        <div className="p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2">
              <User className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{employee.name}</h2>
              <p className="text-gray-600 text-sm">{employee.emails[0].address}</p>
            </div>
          </div>
        </div>

        {/* Communication Metrics */}
        <div className="grid grid-cols-4 gap-2 px-4">
          <div className="bg-gray-50 p-2 rounded">
            <p className="text-xs text-gray-500 uppercase font-medium">Emails</p>
            <p className="text-base font-bold">{formatNumber(employee.emailCount)}</p>
            <p className={`text-xs ${emailPercentage.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {emailPercentage}
            </p>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <p className="text-xs text-gray-500 uppercase font-medium">Chats</p>
            <p className="text-base font-bold">{formatNumber(employee.chatCount)}</p>
            <p className={`text-xs ${chatPercentage.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {chatPercentage}
            </p>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <p className="text-xs text-gray-500 uppercase font-medium">Meetings</p>
            <p className="text-base font-bold">{employee.meetingCount}</p>
            <p className={`text-xs ${meetingPercentage.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {meetingPercentage}
            </p>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <p className="text-xs text-gray-500 uppercase font-medium">Files</p>
            <p className="text-base font-bold">{employee.fileAccessCount}</p>
            <p className={`text-xs ${filePercentage.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {filePercentage}
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="px-4 py-3">
          <h3 className="font-medium text-xs mb-2">Recent Activity</h3>
          <div className="space-y-2">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start">
                <div className={`w-6 h-6 rounded-full ${activity.iconBg} flex items-center justify-center text-white flex-shrink-0`}>
                  {activity.icon}
                </div>
                <div className="ml-2">
                  <p className="text-xs">{activity.content}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Inclusion Status */}
        <div className="px-4 py-2">
          <div className="flex items-center">
            <p className="text-xs font-medium mr-2">Current Status:</p>
            <Badge className={employee.isIncluded !== false ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
              {employee.isIncluded !== false ? "Included" : "Excluded"}
            </Badge>
          </div>
        </div>

        {/* Data Quality Issue */}
        {employee.hasQualityIssues && (
          <div className="mx-4 mb-3 p-2 bg-amber-50 border border-amber-200 rounded-md">
            <div className="flex">
              <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5 mr-2" />
              <div>
                <p className="text-amber-800 text-xs font-medium">Data Quality Issue</p>
                {employee.issueType === 'alias' && (
                  <p className="text-amber-700 text-xs">
                    Multiple email addresses found. Resolve before analysis.
                  </p>
                )}
                {employee.issueType === 'conflict' && (
                  <p className="text-amber-700 text-xs">
                    Conflicting data across sources. Resolve before analysis.
                  </p>
                )}
                {employee.issueType === 'missing' && (
                  <p className="text-amber-700 text-xs">
                    Missing critical information. Complete before proceeding.
                  </p>
                )}
                <Button 
                  variant="link" 
                  className="text-amber-800 font-medium p-0 h-auto text-xs"
                >
                  Resolve Issue
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <DialogFooter className="p-3 border-t flex items-center justify-between">
          <Button 
            variant="destructive" 
            className="bg-red-600 hover:bg-red-700 text-xs h-8"
            onClick={handleExclude}
            disabled={employee.isIncluded === false}
          >
            Exclude
          </Button>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="text-xs h-8"
            >
              Close
            </Button>
            
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8"
              onClick={handleInclude}
              disabled={employee.isIncluded === true}
            >
              Include
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDetailModal;