"use client"

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface WeekPattern {
  [key: string]: { hours: number; active: boolean };
}

interface Employee {
  id: string;
  name: string;
  email: string;
  avatar: string;
  department: string;
  position: string;
  status: 'Included' | 'Excluded';
  age?: number;
  gender?: string;
  raceEthnicity?: string;
  timeZone?: string;
  tenure?: string;
  location?: string;
  workModel?: string;
  language?: string;
  workHours?: number;
  weeklyPattern?: WeekPattern;
}

interface EmployeeModalProps {
  employee: Employee;
  onClose: () => void;
  onStatusChange: (employee: Employee, include: boolean) => void;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({
  employee,
  onClose,
  onStatusChange
}) => {
  const [isIncluded, setIsIncluded] = useState(employee.status === 'Included');
  
  const handleToggleStatus = () => {
    setIsIncluded(!isIncluded);
  };
  
  const handleSaveChanges = () => {
    onStatusChange(employee, isIncluded);
  };
  
  // Calculate average work hours for the bar display
  const avgWorkHours = employee.workHours || 40;
  const avgWorkHoursPercentage = Math.min(100, (avgWorkHours / 50) * 100);
  
  // Days of the week for the weekly pattern
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header with employee name and close button */}
          <div className="flex justify-between items-center pb-4 border-b">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                <img src={employee.avatar} alt={employee.name} />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{employee.name}</h2>
                <p className="text-gray-600">{employee.position}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>
          
          {/* Content sections */}
          <div className="grid grid-cols-2 gap-6 mt-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Basic Information</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-gray-500">Full Name</p>
                  <p>{employee.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-gray-500">Email</p>
                  <p>{employee.email}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-gray-500">Department</p>
                  <p>{employee.department}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-gray-500">Position</p>
                  <p>{employee.position}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-gray-500">Location</p>
                  <p>{employee.location || "Not specified"}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-gray-500">Work Model</p>
                  <p>{employee.workModel || "Not specified"}</p>
                </div>
              </div>
            </div>
            
            {/* Demographics */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Demographics</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-gray-500">Age</p>
                  <p>{employee.age || "Not specified"}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-gray-500">Gender</p>
                  <p>{employee.gender || "Not specified"}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-gray-500">Race/Ethnicity</p>
                  <p>{employee.raceEthnicity || "Not specified"}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-gray-500">Time Zone</p>
                  <p>{employee.timeZone || "Not specified"}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-gray-500">Tenure</p>
                  <p>{employee.tenure || "Not specified"}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-gray-500">Language</p>
                  <p>{employee.language || "Not specified"}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Work Activity Section */}
          {employee.workHours && (
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Work Activity</h3>
              
              {/* Average Work Hours */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span>Average Work Hours</span>
                  <span className="font-medium">{employee.workHours} hours/week</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-500 h-2.5 rounded-full" 
                    style={{ width: `${avgWorkHoursPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>30 hrs</span>
                  <span>40 hrs</span>
                  <span>50 hrs</span>
                </div>
              </div>
              
              {/* Weekly Work Pattern */}
              {employee.weeklyPattern && (
                <div>
                  <h4 className="font-medium mb-2">Weekly Work Pattern</h4>
                  <div className="flex space-x-1">
                    {daysOfWeek.map(day => (
                      <div key={day} className="flex flex-col items-center flex-1">
                        <div className="text-xs mb-1">{day}</div>
                        <div 
                          className={`w-full rounded-t-md ${
                            employee.weeklyPattern?.[day]?.active 
                              ? 'bg-blue-500' 
                              : 'bg-blue-100'
                          }`} 
                          style={{ 
                            height: `${(employee.weeklyPattern?.[day]?.hours || 0) * 5}px`,
                            minHeight: '20px'
                          }}
                        ></div>
                        <div className="text-xs mt-1">
                          {employee.weeklyPattern?.[day]?.hours || 0}h
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Analysis Inclusion Section */}
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Analysis Inclusion</h3>
            <p className="text-gray-500 text-sm mb-4">
              Choose whether to include this employee's data in the workplace analysis
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex space-x-4">
                <span className="text-gray-700">Exclude</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isIncluded}
                    onChange={handleToggleStatus}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
                <span className="text-gray-700">Include</span>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={onClose} 
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
                >
                  Close
                </button>
                <button 
                  onClick={handleSaveChanges}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;