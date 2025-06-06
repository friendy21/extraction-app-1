"use client";

import React, { useEffect, useRef } from 'react';
import { Employee } from '@/app/lib/types';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    employee: Employee | null;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, employee }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    // Handle clicking outside the modal to close it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    // Handle ESC key to close modal
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
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
    }, [isOpen, onClose]);

    if (!isOpen || !employee) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div 
                ref={modalRef}
                className="bg-white rounded-lg shadow-lg w-full max-w-2xl relative animate-fadeIn"
            >
                {/* Header with close button */}
                <div className="flex justify-between items-center p-4 border-b">
                    <div className="flex items-center">
                        <img 
                            src={employee.profilePicture || `/avatars/${employee.id}.jpg`} 
                            alt={employee.name}
                            className="w-12 h-12 rounded-full mr-3" 
                        />
                        <div>
                            <h2 className="text-xl font-semibold">{employee.name}</h2>
                            <p className="text-gray-600">{employee.position}</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>
                
                {/* Content */}
                <div className="p-6">
                    <div className="grid grid-cols-2 gap-8">
                        {/* Basic Information */}
                        <div>
                            <h3 className="text-lg font-medium mb-4">Basic Information</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-gray-500 text-sm">Full Name</p>
                                    <p>{employee.name}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Email</p>
                                    <p>{employee.email}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Department</p>
                                    <p>{employee.department}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Position</p>
                                    <p>{employee.position}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Location</p>
                                    <p>{employee.location || "Not specified"}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Work Model</p>
                                    <p>{employee.workModel || "Not specified"}</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Demographics */}
                        <div>
                            <h3 className="text-lg font-medium mb-4">Demographics</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-gray-500 text-sm">Age</p>
                                    <p>{employee.age || "Not specified"}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Gender</p>
                                    <p>{employee.gender || "Not specified"}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Race/Ethnicity</p>
                                    <p>{employee.ethnicity || "Not specified"}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Time Zone</p>
                                    <p>{employee.timeZone || "Not specified"}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Tenure</p>
                                    <p>{employee.tenure || "Not specified"}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Language</p>
                                    <p>{employee.language || "Not specified"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Work Activity Section */}
                    {employee.workActivity && (
                        <div className="mt-6">
                            <h3 className="text-lg font-medium mb-4">Work Activity</h3>
                            
                            {/* Average Work Hours */}
                            <div className="mb-6">
                                <div className="flex justify-between mb-1">
                                    <p className="font-medium">Average Work Hours</p>
                                    <p className="font-medium">{employee.workActivity.avgHours} hours/week</p>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div 
                                        className="bg-blue-600 h-2.5 rounded-full" 
                                        style={{ width: `${(employee.workActivity.avgHours - 30) / 20 * 100}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>30 hrs</span>
                                    <span>40 hrs</span>
                                    <span>50 hrs</span>
                                </div>
                            </div>
                            
                            {/* Weekly Work Pattern */}
                            <div>
                                <p className="font-medium mb-3">Weekly Work Pattern</p>
                                <div className="grid grid-cols-7 gap-1">
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                                        <div key={day} className="text-center">
                                            <p className="text-sm text-gray-500 mb-1">{day}</p>
                                            <div className="bg-gray-100 rounded p-2">
                                                <div 
                                                    className={`bg-blue-600 rounded w-full`}
                                                    style={{ 
                                                        height: employee.workActivity.weeklyHours?.[index] ? '40px' : '0',
                                                        opacity: employee.workActivity.weeklyHours?.[index] ? 1 : 0.2
                                                    }}
                                                ></div>
                                                <p className="text-sm mt-1">{employee.workActivity.weeklyHours?.[index] || 0}h</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Analysis Inclusion Toggle */}
                    <div className="mt-8 border-t pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium">Analysis Inclusion</h3>
                                <p className="text-sm text-gray-500">Choose whether to include this employee's data in the workplace analysis</p>
                            </div>
                            <div className="flex items-center">
                                <span className={`mr-2 ${employee.status === 'Excluded' ? 'text-gray-900' : 'text-gray-400'}`}>Exclude</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer" 
                                        checked={employee.status === 'Included'}
                                        readOnly
                                    />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                                <span className={`ml-2 ${employee.status === 'Included' ? 'text-gray-900' : 'text-gray-400'}`}>Include</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Footer with action buttons */}
                <div className="border-t p-4 flex justify-end space-x-2">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 border rounded-md hover:bg-gray-50"
                    >
                        Close
                    </button>
                    <button 
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;