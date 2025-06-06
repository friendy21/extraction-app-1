// Active Sessions Modal Content with Working Terminate Functionality
const ActiveSessionsContent: React.FC = () => {
    const [viewType, setViewType] = useState('users'); // 'users' or 'sessions'
    
    // State for users and sessions
    const [users, setUsers] = useState([
      {
        id: 'user1',
        name: 'Admin User',
        email: 'admin@company.com',
        avatar: '/api/placeholder/32/32',
        role: 'System Admin',
        department: 'All Departments',
        ipAddress: '192.168.1.105'
      },
      {
        id: 'user2',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@company.com',
        avatar: '/api/placeholder/32/32',
        role: 'Department Admin',
        department: 'Marketing',
        ipAddress: '192.168.1.107'
      },
      {
        id: 'user3',
        name: 'Michael Chen',
        email: 'michael.chen@company.com',
        avatar: '/api/placeholder/32/32',
        role: 'Department Admin',
        department: 'Engineering',
        ipAddress: '192.168.1.109'
      },
      {
        id: 'user4',
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@company.com',
        avatar: '/api/placeholder/32/32',
        role: 'Analytics User',
        department: 'Product',
        ipAddress: '192.168.1.112'
      }
    ]);
    
    const [sessions, setSessions] = useState([
      {
        id: 'session1',
        role: 'System Admin',
        department: 'All Departments',
        ipAddress: '192.168.1.105',
        status: 'Active Now',
        duration: '1h 12m'
      },
      {
        id: 'session2',
        role: 'Department Admin',
        department: 'Marketing',
        ipAddress: '192.168.1.107',
        status: 'Active Now',
        duration: '45m'
      },
      {
        id: 'session3',
        role: 'Department Admin',
        department: 'Engineering',
        ipAddress: '192.168.1.109',
        status: 'Idle (5m)',
        duration: '27m'
      },
      {
        id: 'session4',
        role: 'Analytics User',
        department: 'Product',
        ipAddress: '192.168.1.112',
        status: 'Active Now',
        duration: '18m'
      }
    ]);
    
    // Terminate a single session
    const handleTerminateSession = (id: string) => {
      setSessions(sessions.filter(session => session.id !== id));
      // Also remove the corresponding user
      setUsers(users.filter(user => {
        // Match by IP address as a simple way to correlate sessions and users
        const sessionToRemove = sessions.find(s => s.id === id);
        return user.ipAddress !== sessionToRemove?.ipAddress;
      }));
    };
    
    // Terminate all sessions
    const handleTerminateAllSessions = () => {
      setSessions([]);
      setUsers([]);
    };
    
    // Get role style class
    const getRoleStyle = (role: string) => {
      switch (role) {
        case 'System Admin':
          return 'bg-blue-100 text-blue-800';
        case 'Department Admin':
          return 'bg-purple-100 text-purple-800';
        case 'Analytics User':
          return 'bg-green-100 text-green-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };
    
    // Get status style class
    const getStatusStyle = (status: string) => {
      if (status.startsWith('Active')) {
        return 'bg-green-100 text-green-800';
      } else if (status.startsWith('Idle')) {
        return 'bg-yellow-100 text-yellow-800';
      } else {
        return 'bg-gray-100 text-gray-800';
      }
    };
    
    return (
      <div>
        <p className="text-sm text-gray-600 mb-4">Admin users currently logged in to the Glynac Analytics platform.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="border rounded-lg p-4">
            <h3 className="text-sm text-gray-600 mb-1">Total Active Sessions</h3>
            <p className="text-2xl font-semibold mb-1">{users.length}</p>
            <p className="text-xs text-green-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              {users.length > 0 ? `${Math.round((users.length / 8) * 100)}% of admin users` : '0% of admin users'}
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="text-sm text-gray-600 mb-1">Role Distribution</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">System Admin:</span>
                <span className="text-sm font-medium">{users.filter(u => u.role === 'System Admin').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Department Admin:</span>
                <span className="text-sm font-medium">{users.filter(u => u.role === 'Department Admin').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Analytics User:</span>
                <span className="text-sm font-medium">{users.filter(u => u.role === 'Analytics User').length}</span>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="text-sm text-gray-600 mb-1">Avg. Session Duration</h3>
            <p className="text-2xl font-semibold mb-1">38m</p>
            <p className="text-xs text-red-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              5% from yesterday
            </p>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 text-sm font-medium ${viewType === 'users' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setViewType('users')}
            >
              User View
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${viewType === 'sessions' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setViewType('sessions')}
            >
              Session View
            </button>
          </div>
        </div>
        
        {viewType === 'users' ? (
          <div className="overflow-x-auto">
            {users.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IP Address
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map(user => (
                    <tr key={user.id}>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <img className="h-8 w-8 rounded-full mr-3" src={user.avatar} alt={user.name} />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleStyle(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.department}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.ipAddress}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => {
                            // Find matching session by IP and terminate it
                            const sessionId = sessions.find(s => s.ipAddress === user.ipAddress)?.id;
                            if (sessionId) handleTerminateSession(sessionId);
                          }} 
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Terminate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 bg-white border rounded-lg">
                <p className="text-gray-500">No active users</p>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            {sessions.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IP Address
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sessions.map(session => (
                    <tr key={session.id}>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleStyle(session.role)}`}>
                          {session.role}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {session.department}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {session.ipAddress}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyle(session.status)}`}>
                            {session.status}
                          </span>
                          <div className="text-xs text-gray-500 mt-1">Duration: {session.duration}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => handleTerminateSession(session.id)} 
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Terminate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 bg-white border rounded-lg">
                <p className="text-gray-500">No active sessions</p>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-6 flex justify-between">
          <button 
            onClick={handleTerminateAllSessions}
            disabled={users.length === 0}
            className={`${
              users.length === 0 
                ? 'bg-red-300 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-700'
            } text-white font-medium py-2 px-4 rounded`}
          >
            Terminate All Sessions
          </button>
          
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded">
            Close
          </button>
        </div>
      </div>
    );
  };