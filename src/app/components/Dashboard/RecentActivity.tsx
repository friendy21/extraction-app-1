import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock, Search, Filter, BarChart2, Calendar, Grid, List, X, ChevronDown, ChevronUp, Settings } from 'lucide-react';

// Enhanced interfaces with more properties and functionality
interface Activity {
  id: string;
  date: Date;
  time: string;
  endTime?: string;
  icon: React.ReactNode;
  title: string;
  iconBg: string;
  details?: string;
  type: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  assignedTo?: string;
  isMultiDay?: boolean;
  endDate?: Date;
  isRecurring?: boolean;
  recurringPattern?: string;
}

interface CalendarDay {
  fullDate: Date;
  date: number;
  events: Activity[];
  isCurrentMonth: boolean;
  isToday: boolean;
}

interface ActivityItemProps {
  activity: Activity;
  expandedId: string | null;
  onToggleExpand: (id: string) => void;
  onEditActivity?: (activity: Activity) => void;
  onDeleteActivity?: (id: string) => void;
  onStatusChange?: (id: string, status: 'pending' | 'in-progress' | 'completed') => void;
}

interface ActivityFilterOptions {
  type: string[];
  priority: ('low' | 'medium' | 'high')[];
  status: ('pending' | 'in-progress' | 'completed')[];
  dateRange: { start: Date | null; end: Date | null };
}

// Enhanced Activity Item Component with more interactive elements
const ActivityItem: React.FC<ActivityItemProps> = ({ 
  activity,
  expandedId, 
  onToggleExpand,
  onEditActivity,
  onDeleteActivity,
  onStatusChange
}) => {
  const { id, icon, title, time, endTime, iconBg, details, type, priority, status } = activity;
  
  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };
  
  const statusColors = {
    'pending': 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800'
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    if (onStatusChange) {
      onStatusChange(id, e.target.value as 'pending' | 'in-progress' | 'completed');
    }
  };

  return (
    <div className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-150">
      <div className="flex items-center p-4">
        <div className={`${iconBg} rounded-full p-2 mr-4 flex-shrink-0`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row md:justify-between">
            <p className="text-sm font-medium text-gray-900 truncate">
              {time}{endTime ? ` - ${endTime}` : ''} - {title}
            </p>
            <div className="flex mt-1 md:mt-0 space-x-2">
              <span className={`px-2 py-1 text-xs rounded-full ${priorityColors[priority]}`}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </span>
              <select 
                className={`px-2 py-1 text-xs rounded-full ${statusColors[status]} cursor-pointer border-none focus:ring-0`}
                value={status}
                onChange={handleStatusChange}
                onClick={(e) => e.stopPropagation()}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <span className="inline-block mt-1 text-xs text-gray-500">{type}</span>
          {details && (
            <button 
              onClick={() => onToggleExpand(id)}
              className="ml-2 text-xs text-blue-600 hover:text-blue-800"
            >
              {expandedId === id ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
        <div className="flex space-x-1 ml-2">
          {onEditActivity && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onEditActivity(activity);
              }}
              className="p-1 rounded-full hover:bg-gray-200 text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          )}
          {onDeleteActivity && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDeleteActivity(id);
              }}
              className="p-1 rounded-full hover:bg-gray-200 text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>
      {expandedId === id && details && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 ml-10 mr-4 mb-4 rounded-md">
          <p className="text-sm text-gray-700">{details}</p>
          {activity.isRecurring && (
            <div className="mt-2 text-xs text-gray-500">
              <span className="font-medium">Recurring:</span> {activity.recurringPattern}
            </div>
          )}
          {activity.assignedTo && (
            <div className="mt-2 text-xs text-gray-500">
              <span className="font-medium">Assigned to:</span> {activity.assignedTo}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Activity Analytics Component
const ActivityAnalytics: React.FC<{ activities: Activity[] }> = ({ activities }) => {
  // Calculate counts by type
  const typeCount = activities.reduce((acc, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Calculate counts by status
  const statusCount = activities.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h4 className="font-medium text-sm mb-2">Activities by Type</h4>
        <div className="space-y-2">
          {Object.entries(typeCount).map(([type, count]) => (
            <div key={type} className="flex items-center">
              <span className="text-xs text-gray-600 w-32 truncate">{type}</span>
              <div className="flex-1">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${(count / activities.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              <span className="ml-2 text-xs font-medium">{count}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h4 className="font-medium text-sm mb-2">Activities by Status</h4>
        <div className="space-y-2">
          {Object.entries(statusCount).map(([status, count]) => (
            <div key={status} className="flex items-center">
              <span className="text-xs text-gray-600 w-32 truncate">{status}</span>
              <div className="flex-1">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      status === 'completed' ? 'bg-green-500' : 
                      status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-500'
                    }`}
                    style={{ width: `${(count / activities.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              <span className="ml-2 text-xs font-medium">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// HeatMap for Activities
const ActivityHeatMap: React.FC<{ calendarDays: CalendarDay[] }> = ({ calendarDays }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h4 className="font-medium text-sm mb-2">Activity Heat Map</h4>
      <div className="grid grid-cols-7 gap-1">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="text-xs text-center text-gray-500">
            {day}
          </div>
        ))}
        {calendarDays.map((day) => {
          const intensity = day.events.length;
          let bgColor = 'bg-gray-100';
          if (intensity === 1) bgColor = 'bg-green-100';
          if (intensity === 2) bgColor = 'bg-green-300';
          if (intensity > 2) bgColor = 'bg-green-500';
          
          return (
            <div 
              key={day.fullDate.toISOString()} 
              className={`w-6 h-6 rounded-sm ${bgColor} flex items-center justify-center`}
              title={`${day.fullDate.toLocaleDateString()}: ${intensity} activities`}
            >
              <span className="text-xs">{day.date}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Filter Modal Component
const FilterModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  filterOptions: ActivityFilterOptions;
  setFilterOptions: React.Dispatch<React.SetStateAction<ActivityFilterOptions>>;
  activityTypes: string[];
}> = ({ isOpen, onClose, filterOptions, setFilterOptions, activityTypes }) => {
  const [localOptions, setLocalOptions] = useState<ActivityFilterOptions>(filterOptions);
  
  const handleApplyFilters = () => {
    setFilterOptions(localOptions);
    onClose();
  };
  
  const toggleType = (type: string) => {
    setLocalOptions(prev => ({
      ...prev,
      type: prev.type.includes(type) 
        ? prev.type.filter(t => t !== type)
        : [...prev.type, type]
    }));
  };
  
  const togglePriority = (priority: 'low' | 'medium' | 'high') => {
    setLocalOptions(prev => ({
      ...prev,
      priority: prev.priority.includes(priority)
        ? prev.priority.filter(p => p !== priority)
        : [...prev.priority, priority]
    }));
  };
  
  const toggleStatus = (status: 'pending' | 'in-progress' | 'completed') => {
    setLocalOptions(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status]
    }));
  };

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Filter Activities</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm mb-2">Activity Type</h4>
            <div className="space-y-2">
              {activityTypes.map(type => (
                <label key={type} className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="rounded text-blue-600 focus:ring-blue-500"
                    checked={localOptions.type.includes(type)}
                    onChange={() => toggleType(type)}
                  />
                  <span className="ml-2 text-sm">{type}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-sm mb-2">Priority</h4>
            <div className="flex space-x-4">
              {(['low', 'medium', 'high'] as const).map(priority => (
                <label key={priority} className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="rounded text-blue-600 focus:ring-blue-500"
                    checked={localOptions.priority.includes(priority)}
                    onChange={() => togglePriority(priority)}
                  />
                  <span className="ml-2 text-sm">{priority.charAt(0).toUpperCase() + priority.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-sm mb-2">Status</h4>
            <div className="flex space-x-4">
              {(['pending', 'in-progress', 'completed'] as const).map(status => (
                <label key={status} className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="rounded text-blue-600 focus:ring-blue-500"
                    checked={localOptions.status.includes(status)}
                    onChange={() => toggleStatus(status)}
                  />
                  <span className="ml-2 text-sm">{status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-sm mb-2">Date Range</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                <input 
                  type="date" 
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={localOptions.dateRange.start ? localOptions.dateRange.start.toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : null;
                    setLocalOptions(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, start: date }
                    }));
                  }}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">End Date</label>
                <input 
                  type="date" 
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={localOptions.dateRange.end ? localOptions.dateRange.end.toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : null;
                    setLocalOptions(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, end: date }
                    }));
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button 
            onClick={() => {
              setLocalOptions({
                type: activityTypes,
                priority: ['low', 'medium', 'high'],
                status: ['pending', 'in-progress', 'completed'],
                dateRange: { start: null, end: null }
              });
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Reset
          </button>
          <button 
            onClick={handleApplyFilters}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

// Day Activities Popup Component
const DayActivitiesPopup: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  activities: Activity[];
  expandedActivity: string | null;
  onToggleExpand: (id: string) => void;
  onEditActivity?: (activity: Activity) => void;
  onDeleteActivity?: (id: string) => void;
  onStatusChange?: (id: string, status: 'pending' | 'in-progress' | 'completed') => void;
}> = ({ 
  isOpen, 
  onClose, 
  date, 
  activities, 
  expandedActivity, 
  onToggleExpand,
  onEditActivity,
  onDeleteActivity,
  onStatusChange
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">
            Activities on {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-2">
          {activities.length > 0 ? (
            activities.map(activity => (
              <ActivityItem 
                key={activity.id}
                activity={activity}
                expandedId={expandedActivity}
                onToggleExpand={onToggleExpand}
                onEditActivity={onEditActivity}
                onDeleteActivity={onDeleteActivity}
                onStatusChange={onStatusChange}
              />
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">No activities for this date matching your filters.</p>
          )}
        </div>
        
        <div className="mt-6 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Enhanced Recent Activity Component
const RecentActivity: React.FC<{ activeUserCount?: number }> = ({ activeUserCount = 0 }) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'list' | 'analytics'>('calendar');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isDayPopupOpen, setIsDayPopupOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOptions, setFilterOptions] = useState<ActivityFilterOptions>({
    type: [],
    priority: ['low', 'medium', 'high'],
    status: ['pending', 'in-progress', 'completed'],
    dateRange: { start: null, end: null }
  });

  const today = new Date();

  // Enhanced activity types with more detailed information
  const activityTypes = [
    {
      type: "Employee Management",
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor"><path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" /></svg>,
      title: "Added new employee",
      iconBg: "bg-blue-100",
      details: "A new employee has been added to the system."
    },
    {
      type: "Data Sync",
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" /></svg>,
      title: "Data sync completed",
      iconBg: "bg-green-100",
      details: "Data synchronization has been completed successfully."
    },
    {
      type: "Department Structure",
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
      title: "Department structure updated",
      iconBg: "bg-purple-100",
      details: "The department structure has been updated."
    },
    {
      type: "Security",
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6.625 2.655A9 9 0 0119 11a1 1 0 11-2 0 7 7 0 00-9.625-6.492 1 1 0 11-.75-1.853zM4.662 4.959A1 1 0 014.75 6.37 6.97 6.97 0 003 11a1 1 0 11-2 0 8.97 8.97 0 012.25-5.953 1 1 0 011.412-.088z" clipRule="evenodd" /><path fillRule="evenodd" d="M5 11a5 5 0 1110 0 1 1 0 11-2 0 3 3 0 10-6 0c0 1.677-.345 3.276-.968 4.729a1 1 0 11-1.838-.789A9.964 9.964 0 005 11z" clipRule="evenodd" /></svg>,
      title: "Security audit completed",
      iconBg: "bg-yellow-100",
      details: "A security audit has been completed."
    },
    {
      type: "Data Privacy",
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>,
      title: "Data anonymization processed",
      iconBg: "bg-gray-100",
      details: "Data anonymization has been processed."
    },
    {
      type: "System Maintenance",
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>,
      title: "System maintenance scheduled",
      iconBg: "bg-indigo-100",
      details: "System maintenance has been scheduled."
    },
    {
      type: "Database",
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor"><path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" /><path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" /><path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" /></svg>,
      title: "Database backup completed",
      iconBg: "bg-red-100",
      details: "Database backup has been completed successfully."
    }
  ];

  // Initialize filter options with all activity types
  useEffect(() => {
    setFilterOptions(prev => ({
      ...prev,
      type: activityTypes.map(at => at.type)
    }));
  }, []);

  // Centralized function for generating activities
  const generateRandomActivity = (date: Date, i: number, k: number): Activity => {
    const typeIndex = (i + k) % activityTypes.length;
    const activityType = activityTypes[typeIndex];
    const priorities = ['low', 'medium', 'high'] as const;
    const statuses = ['pending', 'in-progress', 'completed'] as const;
    const timeOptions = [9, 10, 11, 13, 14, 15, 16];
    
    const hour = timeOptions[(i + k) % timeOptions.length];
    const durationHours = Math.floor(Math.random() * 2) + 1;
    const isMultiDay = Math.random() > 0.8;
    const isRecurring = Math.random() > 0.85;
    
    const recurringPatterns = [
      'Daily',
      'Weekly on Monday',
      'Every weekday',
      'Monthly on the first Monday',
      'Every two weeks'
    ];
    
    // In a real app, these would come from your user database
    const users = [
      'John Smith',
      'Maria Garcia',
      'Ahmed Khan',
      'Sarah Johnson',
      'Li Wei'
    ];
    
    return {
      id: `act-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${k}`,
      date: new Date(date),
      time: `${hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`,
      endTime: `${hour + durationHours}:00 ${(hour + durationHours) >= 12 ? 'PM' : 'AM'}`,
      icon: activityType.icon,
      title: activityType.title,
      iconBg: activityType.iconBg,
      details: activityType.details,
      type: activityType.type,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      assignedTo: Math.random() > 0.3 ? users[Math.floor(Math.random() * users.length)] : undefined,
      isMultiDay: isMultiDay,
      endDate: isMultiDay ? new Date(new Date(date).setDate(date.getDate() + Math.floor(Math.random() * 5) + 1)) : undefined,
      isRecurring: isRecurring,
      recurringPattern: isRecurring ? recurringPatterns[Math.floor(Math.random() * recurringPatterns.length)] : undefined
    };
  };

  const generateCalendarDays = (date: Date): CalendarDay[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayWeekday = firstDayOfMonth.getDay();
    const daysFromPrevMonth = firstDayWeekday;
    const totalDays = 42;
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const calendarDays: CalendarDay[] = [];

    // Previous month days
    for (let i = prevMonthLastDay - daysFromPrevMonth + 1; i <= prevMonthLastDay; i++) {
      const fullDate = new Date(year, month - 1, i);
      const numActivities = Math.floor(Math.random() * 3);
      const dayActivities: Activity[] = [];
      for (let k = 0; k < numActivities; k++) {
        dayActivities.push(generateRandomActivity(fullDate, i, k));
      }
      calendarDays.push({
        fullDate,
        date: i,
        events: dayActivities,
        isCurrentMonth: false,
        isToday: fullDate.toDateString() === today.toDateString()
      });
    }

    // Current month days
    const isCurrentMonthToday = today.getFullYear() === year && today.getMonth() === month;
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const fullDate = new Date(year, month, i);
      const numActivities = Math.floor(Math.random() * 3);
      const dayActivities: Activity[] = [];
      for (let k = 0; k < numActivities; k++) {
        dayActivities.push(generateRandomActivity(fullDate, i, k));
      }
      calendarDays.push({
        fullDate,
        date: i,
        events: dayActivities,
        isCurrentMonth: true,
        isToday: isCurrentMonthToday && today.getDate() === i
      });
    }

    // Next month days
    const remainingDays = totalDays - calendarDays.length;
    for (let i = 1; i <= remainingDays; i++) {
      const fullDate = new Date(year, month + 1, i);
      const numActivities = Math.floor(Math.random() * 3);
      const dayActivities: Activity[] = [];
      for (let k = 0; k < numActivities; k++) {
        dayActivities.push(generateRandomActivity(fullDate, i, k));
      }
      calendarDays.push({
        fullDate,
        date: i,
        events: dayActivities,
        isCurrentMonth: false,
        isToday: fullDate.toDateString() === today.toDateString()
      });
    }

    return calendarDays;
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const toggleExpand = (id: string) => {
    setExpandedActivity(expandedActivity === id ? null : id);
  };

  const formatMonthYear = (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Generate and memoize calendar days to prevent unnecessary recalculations
  const calendarDays = useMemo(() => generateCalendarDays(currentMonth), [currentMonth]);
  
  // Get all activities from calendarDays for list view and analytics
  const allActivities = useMemo(() => {
    return calendarDays.flatMap(day => day.events);
  }, [calendarDays]);
  
  // Filter activities based on search term and filter options
  const filteredActivities = useMemo(() => {
    return allActivities.filter(activity => {
      // Filter by search term
      const matchesSearch = searchTerm === '' || 
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.type.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by type
      const matchesType = filterOptions.type.includes(activity.type);
      
      // Filter by priority
      const matchesPriority = filterOptions.priority.includes(activity.priority);
      
      // Filter by status
      const matchesStatus = filterOptions.status.includes(activity.status);
      
      // Filter by date range
      const activityDate = new Date(activity.date);
      const matchesDateRange = 
        (!filterOptions.dateRange.start || activityDate >= filterOptions.dateRange.start) &&
        (!filterOptions.dateRange.end || activityDate <= filterOptions.dateRange.end);
      
      return matchesSearch && matchesType && matchesPriority && matchesStatus && matchesDateRange;
    });
  }, [allActivities, searchTerm, filterOptions]);
  
  // Get selected day activities
  const selectedDay = calendarDays.find(day => day.fullDate.toDateString() === selectedDate.toDateString());
  
  // Filter selected day activities based on filters
  const selectedActivities = useMemo(() => {
    if (!selectedDay) return [];
    
    return selectedDay.events.filter(activity => {
      const matchesSearch = searchTerm === '' || 
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.type.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterOptions.type.includes(activity.type);
      const matchesPriority = filterOptions.priority.includes(activity.priority);
      const matchesStatus = filterOptions.status.includes(activity.status);
      
      return matchesSearch && matchesType && matchesPriority && matchesStatus;
    });
  }, [selectedDay, searchTerm, filterOptions]);

  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const handleEditActivity = (activity: Activity) => {
    // In a real app, this would open an edit form or modal
    console.log('Edit activity:', activity);
  };

  const handleDeleteActivity = (id: string) => {
    // In a real app, this would delete the activity from your data store
    console.log('Delete activity:', id);
  };

  const handleStatusChange = (id: string, status: 'pending' | 'in-progress' | 'completed') => {
    // In a real app, this would update the activity status in your data store
    console.log('Update status:', id, status);
  };

  // New handler for day click
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setIsDayPopupOpen(true);
  };

  return (
    <div className="bg-white rounded-lg shadow max-w-4xl mx-auto">
      {/* Header with Month Navigation and View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-b">
        <div className="flex items-center mb-3 sm:mb-0">
          <h3 className="text-lg font-semibold">{formatMonthYear(currentMonth)}</h3>
          <div className="ml-4 text-sm text-gray-500">
            {activeUserCount} active user{activeUserCount !== 1 ? 's' : ''}
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex border rounded-md overflow-hidden">
            <button 
              onClick={() => setViewMode('calendar')}
              className={`p-1 px-2 text-xs ${viewMode === 'calendar' ? 'bg-blue-500 text-white' : 'bg-gray-50 text-gray-700'}`}
            >
              <Calendar className="w-4 h-4 inline-block mr-1" />
              Calendar
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1 px-2 text-xs ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-50 text-gray-700'}`}
            >
              <List className="w-4 h-4 inline-block mr-1" />
              List
            </button>
            <button 
              onClick={() => setViewMode('analytics')}
              className={`p-1 px-2 text-xs ${viewMode === 'analytics' ? 'bg-blue-500 text-white' : 'bg-gray-50 text-gray-700'}`}
            >
              <BarChart2 className="w-4 h-4 inline-block mr-1" />
              Analytics
            </button>
          </div>
          
          {/* Month Navigation */}
          <div className="flex space-x-1">
            <button 
              onClick={goToPreviousMonth}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={goToNextMonth}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="p-4 border-b">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search activities..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Filter className="-ml-1 mr-2 h-4 w-4" />
            Filter
            {Object.values(filterOptions).some(val => 
              Array.isArray(val) ? val.length < activityTypes.length : val !== null
            ) && (
              <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Active
              </span>
            )}
          </button>
          
          <button
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Settings className="-ml-1 mr-2 h-4 w-4" />
            Settings
          </button>
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="calendar-grid">
          <div className="grid grid-cols-7 border-b">
            {weekDays.map((day) => (
              <div 
                key={day}
                className="py-2 text-xs font-medium text-center text-gray-500"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 min-h-96">
            {calendarDays.map((day) => {
              // Filter events for this day based on filters
              const filteredEvents = day.events.filter(event => 
                filterOptions.type.includes(event.type) &&
                filterOptions.priority.includes(event.priority) &&
                filterOptions.status.includes(event.status) &&
                (searchTerm === '' || 
                  event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  event.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  event.type.toLowerCase().includes(searchTerm.toLowerCase())
                )
              );
              
              const hasEvents = filteredEvents.length > 0;
              
              return (
                <div 
                  key={day.fullDate.toISOString()}
                  className={`border-r border-b p-2 min-h-24 cursor-pointer transition-colors ${
                    day.isCurrentMonth ? 'bg-white hover:bg-gray-100' : 'bg-gray-50 hover:bg-gray-100'
                  } ${day.isToday ? 'bg-blue-50' : ''} ${
                    day.fullDate.toDateString() === selectedDate.toDateString() ? 'bg-blue-100' : ''
                  }`}
                  onClick={() => handleDayClick(day.fullDate)}
                >
                  <div className={`text-sm font-medium ${
                    day.isCurrentMonth ? '' : 'text-gray-400'
                  } ${day.isToday ? 'text-blue-600' : ''}`}>
                    {day.date}
                  </div>
                  
                  {/* Activity indicators using varying intensity colors */}
                  {hasEvents && (
                    <div className="mt-1 space-y-1">
                      {filteredEvents.slice(0, 3).map((event, idx) => (
                        <div 
                          key={idx} 
                          className={`${event.iconBg} px-1 py-0.5 text-xs rounded-sm truncate`}
                          title={event.title}
                        >
                          {event.time} {event.title}
                        </div>
                      ))}
                      {filteredEvents.length > 3 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{filteredEvents.length - 3} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="p-4 max-h-96 overflow-y-auto">
          <div className="space-y-2">
            {filteredActivities.length > 0 ? (
              <>
                <div className="flex justify-between text-xs text-gray-500 border-b pb-2 mb-2">
                  <span>Activity</span>
                  <div className="flex space-x-4">
                    <span className="w-16 text-center">Priority</span>
                    <span className="w-20 text-center">Status</span>
                    <span className="w-16 text-center">Actions</span>
                  </div>
                </div>
                
                {filteredActivities.map(activity => (
                  <ActivityItem 
                    key={activity.id}
                    activity={activity}
                    expandedId={expandedActivity}
                    onToggleExpand={toggleExpand}
                    onEditActivity={handleEditActivity}
                    onDeleteActivity={handleDeleteActivity}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </>
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">No activities found matching your filters.</p>
            )}
          </div>
        </div>
      )}

      {/* Analytics View */}
      {viewMode === 'analytics' && (
        <div className="p-4 space-y-4">
          <ActivityAnalytics activities={filteredActivities} />
          <ActivityHeatMap calendarDays={calendarDays} />
        </div>
      )}

      {/* Filter Modal */}
      <FilterModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filterOptions={filterOptions}
        setFilterOptions={setFilterOptions}
        activityTypes={activityTypes.map(at => at.type)}
      />

      {/* Day Activities Popup */}
      <DayActivitiesPopup
        isOpen={isDayPopupOpen}
        onClose={() => setIsDayPopupOpen(false)}
        date={selectedDate}
        activities={selectedActivities}
        expandedActivity={expandedActivity}
        onToggleExpand={toggleExpand}
        onEditActivity={handleEditActivity}
        onDeleteActivity={handleDeleteActivity}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default RecentActivity;