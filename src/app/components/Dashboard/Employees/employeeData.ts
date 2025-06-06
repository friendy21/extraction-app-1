// Define employee type
export interface Employee {
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
    weeklyPattern?: {
      [key: string]: { hours: number; active: boolean }
    };
  }
  
  // Arrays for random data generation
  const firstNames = [
    'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth',
    // ... rest of the firstNames array
  ];
  
  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
    // ... rest of the lastNames array
  ];
  
  const departments = [
    'Marketing', 'Engineering', 'Sales', 'Product', 'Finance', 'HR', 'Design', 'Customer Support',
    'Operations', 'Legal', 'Research', 'IT', 'Administration', 'Business Development', 'Quality Assurance'
  ];
  
  const positions = {
    'Marketing': ['Marketing Director', 'Marketing Manager', 'Digital Marketing Specialist', 'Content Strategist', 'SEO Specialist', 'Social Media Manager', 'Brand Manager', 'Marketing Analyst'],
    'Engineering': ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer', 'QA Engineer', 'Data Scientist', 'Engineering Manager', 'Senior Developer', 'Systems Architect'],
    // ... rest of the positions object
  };
  
  // Helper functions
  const getRandomElement = <T>(arr: T[]): T => {
    return arr[Math.floor(Math.random() * arr.length)];
  };
  
  const getRandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
  
  const getRandomBoolean = (probability = 0.5): boolean => {
    return Math.random() < probability;
  };
  
  const locations = [
    'New York City', 'San Francisco', 'Chicago', 'Los Angeles', 'Boston', 'Seattle', 'Austin', 'Denver',
    'Atlanta', 'Remote', 'Miami', 'Portland', 'Dallas', 'Philadelphia', 'Washington DC', 'Toronto',
    'London', 'Berlin', 'Paris', 'Sydney', 'Singapore', 'Tokyo', 'Dublin', 'Amsterdam'
  ];
  
  const workModels = [
    'Remote', 'In-office', 'Hybrid (3 days in office)', 'Hybrid (2 days in office)', 'Hybrid (1 day in office)'
  ];
  
  const timeZones = [
    'Eastern Time (ET)', 'Pacific Time (PT)', 'Central Time (CT)', 'Mountain Time (MT)',
    'Greenwich Mean Time (GMT)', 'Central European Time (CET)', 'Japan Standard Time (JST)',
    'Australian Eastern Time (AET)', 'Indian Standard Time (IST)'
  ];
  
  const races = [
    'White', 'Black or African American', 'Asian', 'Hispanic or Latino', 'Middle Eastern',
    'Native American', 'Pacific Islander', 'Two or more races', 'Prefer not to say'
  ];
  
  const languages = [
    'English (Primary)', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Korean',
    'Portuguese', 'Italian', 'Russian', 'Hindi', 'Arabic'
  ];
  
  const formatTenure = (): string => {
    const years = getRandomNumber(0, 7);
    const months = getRandomNumber(1, 11);
    
    if (years === 0) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    } else {
      return `${years} year${years !== 1 ? 's' : ''}, ${months} month${months !== 1 ? 's' : ''}`;
    }
  };
  
  const generateRandomWeeklyPattern = (): Record<string, { hours: number; active: boolean }> => {
    const isRemote = getRandomBoolean(0.3);
    const hasWeekendHours = getRandomBoolean(0.2);
    
    return {
      'Mon': { hours: isRemote ? getRandomNumber(6, 10) : getRandomNumber(7, 9), active: true },
      'Tue': { hours: isRemote ? getRandomNumber(6, 10) : getRandomNumber(7, 9), active: true },
      'Wed': { hours: isRemote ? getRandomNumber(6, 10) : getRandomNumber(7, 9), active: true },
      'Thu': { hours: isRemote ? getRandomNumber(6, 10) : getRandomNumber(7, 9), active: true },
      'Fri': { hours: isRemote ? getRandomNumber(4, 8) : getRandomNumber(6, 8), active: true },
      'Sat': { hours: hasWeekendHours ? getRandomNumber(1, 4) : 0, active: hasWeekendHours },
      'Sun': { hours: hasWeekendHours ? getRandomNumber(1, 3) : 0, active: hasWeekendHours }
    };
  };
  
  const generateEmployeeEmail = (firstName: string, lastName: string): string => {
    const format = getRandomNumber(1, 3);
    
    switch (format) {
      case 1:
        return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
      case 2:
        return `${firstName.toLowerCase()[0]}${lastName.toLowerCase()}@example.com`;
      default:
        return `${firstName.toLowerCase()}${getRandomNumber(1, 100)}@example.com`;
    }
  };
  
  // Main generator function
  export const generateFakeEmployees = (count: number): Employee[] => {
    const employees: Employee[] = [];
    
    for (let i = 1; i <= count; i++) {
      const firstName = getRandomElement(firstNames);
      const lastName = getRandomElement(lastNames);
      const name = `${firstName} ${lastName}`;
      const department = getRandomElement(departments);
      const position = getRandomElement(positions[department as keyof typeof positions] || positions['Marketing']);
      const weeklyPattern = generateRandomWeeklyPattern();
      const weeklyHours = Object.values(weeklyPattern).reduce((sum, day) => sum + day.hours, 0);
      const includeDetailedData = getRandomBoolean(0.3);
      
      employees.push({
        id: `emp-${i}`,
        name,
        email: generateEmployeeEmail(firstName, lastName),
        avatar: '/api/placeholder/32/32',
        department,
        position,
        status: getRandomBoolean(0.85) ? 'Included' : 'Excluded',
        ...(includeDetailedData && {
          age: getRandomNumber(22, 65),
          gender: getRandomBoolean(0.48) ? 'Female' : getRandomBoolean(0.96) ? 'Male' : 'Non-binary',
          raceEthnicity: getRandomElement(races),
          timeZone: getRandomElement(timeZones),
          tenure: formatTenure(),
          location: getRandomElement(locations),
          workModel: getRandomElement(workModels),
          language: `${getRandomElement(languages)}${getRandomBoolean(0.3) ? `, ${getRandomElement(languages)}` : ''}`,
          workHours: parseFloat(weeklyHours.toFixed(1)),
          weeklyPattern
        })
      });
    }
    
    return employees;
  };
  
  export const fakeEmployeeData = generateFakeEmployees(250);