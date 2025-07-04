# Extraction Application - Refactored for New Database Schema

## Overview

This is a completely refactored version of the Extraction Application, rebuilt to work with a new, comprehensive database schema. The application has been enhanced with improved data models, a robust API layer, and modern TypeScript implementations.

## Key Improvements

### 🗄️ Enhanced Database Schema
- **Multi-organizational support** with strict data isolation
- **Comprehensive employee management** with detailed profiles and employment history
- **Hierarchical department structure** supporting complex organizational charts
- **Multi-source data integration** from various platforms (Microsoft 365, Google Workspace, Slack, etc.)
- **Role-based access control** with fine-grained permissions
- **Comprehensive audit trails** for all data changes

### 🚀 Refactored API Layer
- **Modular API clients** for different data domains (Organization, Employee, Department, etc.)
- **Type-safe interfaces** with comprehensive TypeScript definitions
- **Robust error handling** with detailed error messages and recovery guidance
- **Data validation** using Zod schemas for all form inputs
- **Transformation utilities** for data conversion and display formatting

### 🎨 Updated Frontend Components
- **Refactored React components** using the new API clients
- **Enhanced employee management** with advanced filtering, sorting, and bulk operations
- **Improved department management** with hierarchy visualization
- **Real-time data synchronization** with external sources
- **Responsive design** optimized for both desktop and mobile

### 📚 Comprehensive Documentation
- **Complete API documentation** with examples and use cases
- **Migration guide** from the previous version
- **TypeScript interfaces** for all data models
- **Form validation schemas** with detailed error messages

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Validation**: Zod
- **State Management**: React Hooks
- **API Client**: Custom TypeScript clients with fetch API

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── Dashboard/
│   │   │   ├── Departments/
│   │   │   │   ├── DepartmentsPageRefactored.tsx
│   │   │   │   └── types.ts
│   │   │   ├── Employees/
│   │   │   │   └── EmployeesPageRefactored.tsx
│   │   │   └── DashboardLayout.tsx
│   │   └── ...
│   ├── lib/
│   │   ├── api/
│   │   │   ├── base-client.ts
│   │   │   ├── organization-client.ts
│   │   │   ├── data-extraction-client.ts
│   │   │   ├── connections-client.ts
│   │   │   ├── role-management-client.ts
│   │   │   └── index.ts
│   │   ├── database-types.ts
│   │   ├── types.ts
│   │   ├── data-utils.ts
│   │   └── validation-schemas.ts
│   └── ...
├── API_DOCUMENTATION.md
├── README.md
└── package.json
```

## Installation and Setup

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Access to the new database API endpoints

### Installation Steps

1. **Clone or extract the application**:
   ```bash
   # If from zip file
   unzip extraction-app-refactored.zip
   cd extraction-app-refactored
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   # API Configuration
   NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com
   NEXT_PUBLIC_API_VERSION=v2
   
   # Authentication
   NEXT_PUBLIC_AUTH_DOMAIN=your-auth-domain.com
   NEXT_PUBLIC_CLIENT_ID=your-client-id
   
   # Organization
   NEXT_PUBLIC_DEFAULT_ORG_ID=your-default-org-id
   
   # Feature Flags
   NEXT_PUBLIC_ENABLE_REAL_TIME_SYNC=true
   NEXT_PUBLIC_ENABLE_BULK_OPERATIONS=true
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open the application**:
   Navigate to `http://localhost:3000` in your browser.

## Configuration

### API Client Configuration

The API clients are configured in `src/app/lib/api/base-client.ts`. Update the base URL and authentication settings:

```typescript
const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  version: process.env.NEXT_PUBLIC_API_VERSION || 'v2',
  timeout: 30000,
  retries: 3
};
```

### Authentication Setup

The application supports multiple authentication methods:

1. **Bearer Token Authentication** (recommended for production)
2. **API Key Authentication** (for server-to-server integrations)
3. **OAuth2 Integration** (for third-party applications)

Configure authentication in your environment variables and update the auth configuration in the API clients.

## Usage

### Employee Management

The refactored employee management system provides comprehensive functionality:

```typescript
import { organizationApi } from '../lib/api';

// List employees with filtering
const employees = await organizationApi.getEmployees(organizationId, {
  search: 'john',
  departmentId: 'dept-uuid',
  isActive: true,
  page: 1,
  limit: 20
});

// Create new employee
const newEmployee = await organizationApi.createEmployee({
  full_name: 'John Doe',
  work_email: 'john.doe@company.com',
  job_title: 'Software Engineer',
  department_id: 'dept-uuid',
  // ... other fields
});

// Update employee
const updatedEmployee = await organizationApi.updateEmployee({
  id: 'employee-uuid',
  salary: 95000,
  job_title: 'Senior Software Engineer'
});
```

### Department Management

Manage organizational structure with hierarchy support:

```typescript
// Create department with parent relationship
const department = await organizationApi.createDepartment({
  name: 'Data Science',
  description: 'Advanced analytics team',
  parent_department_id: 'engineering-dept-uuid',
  head_id: 'manager-uuid',
  office_location: 'San Francisco, CA'
});

// Get department hierarchy
const hierarchy = await organizationApi.getDepartmentHierarchy(organizationId);
```

### Data Source Integration

Connect and sync data from external sources:

```typescript
import { connectionsApi } from '../lib/api';

// Create connection
const connection = await connectionsApi.createConnection({
  service_name: 'microsoft365',
  description: 'Microsoft 365 Integration',
  api_endpoint: 'https://graph.microsoft.com/v1.0',
  auth_type: 'oauth2',
  client_id: 'your-client-id',
  client_secret: 'your-client-secret',
  scopes: 'Mail.Read Calendars.Read'
});

// Sync data
await connectionsApi.syncDataSource(connection.id, {
  syncType: 'incremental',
  dataTypes: ['emails', 'meetings']
});
```

## API Documentation

Comprehensive API documentation is available in `API_DOCUMENTATION.md`. A minimal OpenAPI definition is provided in `docs/swagger.yaml`.
The documentation includes:

- Complete endpoint reference with examples
- Data model specifications
- Authentication and authorization guide
- Error handling and troubleshooting
- Migration guide from the previous version
- SDK examples and use cases

## Migration from Previous Version

If you're migrating from the previous version of the application, please refer to the migration guide in the API documentation. Key changes include:

### Breaking Changes
- All endpoints now require organization context
- Employee `name` field renamed to `full_name`
- Department structure now supports hierarchy
- All IDs changed from integers to UUIDs
- New authentication and permission system

### Migration Steps
1. Update API endpoint URLs to include organization ID
2. Update data models to use new field names
3. Implement new authentication flow
4. Update error handling for new error format
5. Test all functionality with new API

### Data Migration
Use the provided migration scripts in the API documentation to migrate existing data to the new schema.

## Development

### Code Structure

The application follows a modular architecture:

- **API Layer** (`src/app/lib/api/`): Type-safe API clients for different domains
- **Components** (`src/app/components/`): React components organized by feature
- **Types** (`src/app/lib/`): TypeScript interfaces and validation schemas
- **Utilities** (`src/app/lib/`): Helper functions for data transformation and validation

### Adding New Features

1. **Define Types**: Add TypeScript interfaces in `database-types.ts`
2. **Create API Client**: Implement API client in `src/app/lib/api/`
3. **Add Validation**: Create Zod schemas in `validation-schemas.ts`
4. **Build Components**: Create React components using the new API client
5. **Update Documentation**: Document new endpoints and usage

### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

The Jest configuration uses `ts-jest` to compile TypeScript tests. Ensure dependencies are installed by running `npm install` before executing the commands above.

### Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Deployment

### Environment Setup

1. **Production Environment Variables**:
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://api.your-domain.com
   NEXT_PUBLIC_AUTH_DOMAIN=auth.your-domain.com
   NODE_ENV=production
   ```

2. **Build and Deploy**:
   ```bash
   npm run build
   npm start
   ```

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

## Troubleshooting

### Common Issues

1. **API Connection Errors**:
   - Verify API base URL in environment variables
   - Check authentication credentials
   - Ensure organization ID is correct

2. **Authentication Failures**:
   - Verify token expiration
   - Check user permissions
   - Ensure proper role assignments

3. **Data Loading Issues**:
   - Check network connectivity
   - Verify API endpoint availability
   - Review browser console for errors

### Debug Mode

Enable debug mode by setting:
```env
NEXT_PUBLIC_DEBUG=true
```

This will enable detailed logging and error reporting.

## Support and Resources

- **API Documentation**: See `API_DOCUMENTATION.md`
- **GitHub Issues**: Report bugs and feature requests
- **Developer Portal**: Access additional resources and examples
- **Community Forum**: Get help from other developers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Changelog

### Version 2.0.0 (Current)
- Complete refactor for new database schema
- Enhanced API layer with type safety
- Improved component architecture
- Comprehensive documentation
- Migration tools and guides

### Version 1.x (Legacy)
- Original implementation
- Basic employee and department management
- Limited data source integration

---

**Note**: This refactored version represents a significant improvement over the previous implementation. Please review the migration guide and API documentation before deploying to production.

