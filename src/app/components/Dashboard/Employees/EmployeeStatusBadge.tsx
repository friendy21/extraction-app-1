import React from 'react';

interface EmployeeStatusBadgeProps {
  status: 'Included' | 'Excluded';
}

const EmployeeStatusBadge: React.FC<EmployeeStatusBadgeProps> = ({ status }) => {
  const baseClasses = "px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full";
  
  return status === 'Included' ? (
    <span className={`${baseClasses} bg-green-100 text-green-800`}>
      Included
    </span>
  ) : (
    <span className={`${baseClasses} bg-red-100 text-red-800`}>
      Excluded
    </span>
  );
};

export default EmployeeStatusBadge;