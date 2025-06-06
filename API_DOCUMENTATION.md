# Extraction Application API Documentation

**Version:** 2.0.0  
**Author:** Manus AI  
**Last Updated:** December 2024

## Table of Contents

1. [Introduction](#introduction)
2. [Authentication](#authentication)
3. [Database Schema Overview](#database-schema-overview)
4. [API Endpoints](#api-endpoints)
5. [Data Models](#data-models)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)
8. [SDK and Client Libraries](#sdk-and-client-libraries)
9. [Examples and Use Cases](#examples-and-use-cases)
10. [Migration Guide](#migration-guide)
11. [Appendices](#appendices)

---

## Introduction

The Extraction Application API provides a comprehensive interface for managing organizational data extraction, employee management, department organization, and communication analytics. This API has been completely refactored to work with a new database schema that provides enhanced data integrity, better performance, and more flexible data relationships.

### Key Features

The refactored API offers several significant improvements over the previous version:

**Enhanced Data Model**: The new database schema provides a more normalized structure with proper foreign key relationships, ensuring data consistency and enabling complex queries across related entities. The schema supports multi-organizational tenancy, allowing a single instance to serve multiple organizations while maintaining strict data isolation.

**Comprehensive Employee Management**: The API now supports detailed employee profiles with extensive metadata including employment history, salary information, work schedules, and verification status. The system tracks data sources for each employee record, enabling audit trails and data quality assessments.

**Advanced Department Hierarchy**: Departments can now be organized in hierarchical structures with parent-child relationships, enabling complex organizational charts and reporting structures. Each department maintains its own metadata including location information, head assignments, and verification status.

**Multi-Source Data Integration**: The API supports data extraction from multiple sources including Microsoft 365, Google Workspace, Slack, Zoom, and custom APIs. Each data source maintains its own connection configuration and authentication credentials, with support for OAuth2, API keys, and other authentication methods.

**Role-Based Access Control**: A comprehensive privilege system allows fine-grained control over user permissions. Roles can be assigned multiple privileges, and the system supports both system-defined and custom roles for maximum flexibility.

**Communication Analytics**: The API provides detailed analytics for emails, team chats, meetings, and file sharing activities. This enables organizations to understand communication patterns, identify collaboration bottlenecks, and optimize team productivity.

### Architecture Overview

The API follows RESTful principles with a modular architecture that separates concerns into distinct service layers:

**API Layer**: Handles HTTP requests, authentication, validation, and response formatting. All endpoints follow consistent naming conventions and return standardized response formats.

**Business Logic Layer**: Contains the core application logic, data transformation, and business rules. This layer is responsible for enforcing data integrity constraints and implementing complex business workflows.

**Data Access Layer**: Provides abstracted access to the database with support for transactions, connection pooling, and query optimization. The layer includes comprehensive error handling and logging for debugging and monitoring.

**Integration Layer**: Manages connections to external data sources and handles data synchronization, transformation, and error recovery. Each integration maintains its own configuration and state management.

### API Design Principles

The API design follows several key principles to ensure consistency, reliability, and ease of use:

**Consistency**: All endpoints follow the same naming conventions, parameter structures, and response formats. HTTP status codes are used consistently across all endpoints to indicate success, client errors, and server errors.

**Versioning**: The API uses semantic versioning with backward compatibility guarantees within major versions. Version information is included in the URL path and response headers.

**Security**: All endpoints require authentication and implement proper authorization checks. Sensitive data is encrypted in transit and at rest, with comprehensive audit logging for security monitoring.

**Performance**: The API implements efficient pagination, caching, and query optimization to ensure fast response times even with large datasets. Rate limiting prevents abuse and ensures fair resource allocation.

**Documentation**: Every endpoint is thoroughly documented with examples, parameter descriptions, and response schemas. Interactive documentation is available for testing and exploration.




---

## Authentication

The API uses a multi-layered authentication system that supports various authentication methods depending on the use case and security requirements. All API requests must include valid authentication credentials, and the system implements comprehensive authorization checks to ensure users can only access data they are permitted to view or modify.

### Authentication Methods

**Bearer Token Authentication**: The primary authentication method uses JWT (JSON Web Tokens) that contain encrypted user information and permissions. Tokens are issued upon successful login and must be included in the Authorization header of all API requests. Tokens have a configurable expiration time and can be refreshed using a separate refresh token mechanism.

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**API Key Authentication**: For server-to-server integrations and automated systems, the API supports API key authentication. API keys are organization-specific and can be configured with specific permissions and rate limits. Keys should be included in the X-API-Key header.

```http
X-API-Key: ak_live_1234567890abcdef...
```

**OAuth2 Integration**: For third-party applications and integrations, the API supports OAuth2 authorization code flow. This enables secure access delegation without sharing user credentials. The system supports standard OAuth2 scopes for fine-grained permission control.

### Token Management

**Token Issuance**: Tokens are issued through the `/auth/login` endpoint upon successful authentication. The response includes both an access token and a refresh token. Access tokens are short-lived (typically 1 hour) while refresh tokens have longer expiration times (typically 30 days).

**Token Refresh**: When an access token expires, clients can use the refresh token to obtain a new access token without requiring the user to re-authenticate. This is done through the `/auth/refresh` endpoint.

**Token Revocation**: Tokens can be revoked through the `/auth/logout` endpoint or by administrators through the user management interface. Revoked tokens are immediately invalidated and cannot be used for further API access.

### Authorization and Permissions

The API implements a role-based access control (RBAC) system with fine-grained permissions. Each user is assigned one or more roles, and each role contains a set of privileges that determine what actions the user can perform.

**Organization-Level Access**: Users are associated with specific organizations and can only access data within their assigned organizations. Cross-organization access is strictly prohibited unless explicitly configured by system administrators.

**Resource-Level Permissions**: Permissions are defined at the resource level, allowing granular control over who can create, read, update, or delete specific types of data. For example, a user might have permission to view employee data but not modify it.

**Dynamic Permission Evaluation**: Permissions are evaluated dynamically for each request, taking into account the user's roles, the requested resource, and any additional context such as data ownership or departmental hierarchy.

### Security Considerations

**Encryption**: All authentication tokens are encrypted using industry-standard algorithms. Sensitive data within tokens is further encrypted to prevent information disclosure even if tokens are compromised.

**Rate Limiting**: Authentication endpoints are subject to strict rate limiting to prevent brute force attacks. Failed authentication attempts are logged and monitored for suspicious activity.

**Session Management**: The system maintains secure session management with automatic session timeout and concurrent session limits. Users can view and manage their active sessions through the user interface.

**Audit Logging**: All authentication and authorization events are logged with detailed information including IP addresses, user agents, and timestamps. These logs are used for security monitoring and compliance reporting.

---

## Database Schema Overview

The refactored database schema represents a significant improvement over the previous version, providing better data normalization, enhanced relationships, and improved performance characteristics. The schema is designed to support multi-tenancy, comprehensive audit trails, and flexible data extraction from various sources.

### Core Entity Relationships

The database schema is organized around several core entities that represent the fundamental concepts of organizational data management:

**Organizations**: The top-level entity that represents a company or organization. All other entities are associated with an organization, providing strict data isolation and multi-tenancy support. Organizations contain metadata such as industry, size, location, and contact information.

**Employees**: Individual people within an organization, with comprehensive profile information including personal details, employment information, and work-related metadata. Employees are linked to departments and can have manager-subordinate relationships.

**Departments**: Organizational units that group employees by function, location, or other criteria. Departments support hierarchical structures with parent-child relationships, enabling complex organizational charts and reporting structures.

**Data Sources**: External systems from which data is extracted, such as email servers, chat platforms, and file storage systems. Each data source maintains connection configuration, authentication credentials, and synchronization status.

**Extracted Data**: Various types of data extracted from external sources, including emails, chat messages, meetings, and files. Each extracted record maintains metadata about its source, extraction time, and verification status.

### Data Integrity and Constraints

The schema implements comprehensive data integrity constraints to ensure data quality and consistency:

**Foreign Key Relationships**: All relationships between entities are enforced through foreign key constraints, preventing orphaned records and maintaining referential integrity. Cascade delete rules are carefully configured to prevent accidental data loss.

**Unique Constraints**: Critical fields such as employee codes, email addresses, and organization identifiers are protected by unique constraints to prevent duplicates and ensure data uniqueness.

**Check Constraints**: Business rules are enforced through check constraints, such as ensuring hire dates are not in the future and salary values are positive numbers.

**Data Validation**: The schema includes validation rules for data formats, such as email address patterns, phone number formats, and URL structures.

### Audit and Versioning

Every table in the schema includes comprehensive audit fields that track data changes over time:

**Creation Tracking**: All records include created_at timestamps and created_by user references to track when and by whom records were created.

**Modification Tracking**: Records include updated_at timestamps and updated_by user references to track the most recent modifications.

**Soft Deletion**: Instead of physically deleting records, the schema uses soft deletion with deleted_at timestamps and is_active flags to maintain data history while hiding deleted records from normal queries.

**Version Control**: Critical entities include version numbers that are incremented with each modification, enabling optimistic locking and conflict detection in concurrent update scenarios.

### Performance Optimization

The schema is designed with performance in mind, including strategic indexing and query optimization:

**Primary Indexes**: All tables have optimized primary key indexes, typically using UUID values for global uniqueness and better distribution.

**Foreign Key Indexes**: All foreign key columns are indexed to ensure fast join operations and referential integrity checks.

**Search Indexes**: Frequently searched columns such as names, email addresses, and descriptions include specialized indexes to support fast text search operations.

**Composite Indexes**: Multi-column indexes are strategically placed to support common query patterns and improve performance for complex filtering and sorting operations.

### Data Source Integration

The schema is designed to support data extraction from multiple external sources while maintaining data lineage and quality metrics:

**Source Tracking**: Every extracted record includes metadata about its source system, extraction method, and data quality indicators.

**Deduplication**: The schema includes mechanisms to identify and handle duplicate records from multiple sources, with configurable merge strategies.

**Synchronization State**: Each data source maintains synchronization state information, including last sync timestamps, error counts, and configuration versions.

**Data Transformation**: The schema supports storing both raw extracted data and transformed/normalized versions, enabling data quality analysis and debugging.


---

## API Endpoints

The API is organized into several modules, each responsible for managing specific aspects of the organizational data extraction system. All endpoints follow RESTful conventions with consistent parameter naming, response formats, and error handling.

### Organization Management

The organization management module provides endpoints for managing organization profiles, settings, and metadata. These endpoints are typically used by system administrators and organization owners.

#### Get Organization Details

```http
GET /api/organizations/{organizationId}
```

Retrieves detailed information about a specific organization, including profile data, settings, and statistics.

**Parameters:**
- `organizationId` (path, required): UUID of the organization

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Acme Corporation",
    "email": "contact@acme.com",
    "phone": "+1-555-123-4567",
    "address": "123 Business Ave, Suite 100, City, State 12345",
    "website": "https://www.acme.com",
    "logo_url": "https://cdn.acme.com/logo.png",
    "industry": "Technology",
    "country": "United States",
    "state": "California",
    "size": 500,
    "owner_id": "660e8400-e29b-41d4-a716-446655440001",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-12-01T14:22:00Z"
  }
}
```

#### Update Organization

```http
PUT /api/organizations/{organizationId}
```

Updates organization information. Only organization owners and system administrators can modify organization details.

**Parameters:**
- `organizationId` (path, required): UUID of the organization

**Request Body:**
```json
{
  "name": "Acme Corporation Ltd",
  "email": "info@acme.com",
  "phone": "+1-555-123-4567",
  "address": "456 New Business Blvd, Suite 200, City, State 12345",
  "website": "https://www.acme.com",
  "logo_url": "https://cdn.acme.com/new-logo.png",
  "industry": "Technology Services",
  "size": 750
}
```

#### Get Organization Statistics

```http
GET /api/organizations/{organizationId}/statistics
```

Retrieves comprehensive statistics about the organization including employee counts, department distribution, and data extraction metrics.

**Parameters:**
- `organizationId` (path, required): UUID of the organization
- `period` (query, optional): Time period for statistics (7d, 30d, 90d, 1y). Default: 30d

**Response:**
```json
{
  "success": true,
  "data": {
    "totalEmployees": 487,
    "activeEmployees": 456,
    "totalDepartments": 12,
    "verifiedEmployees": 423,
    "departmentDistribution": [
      {"department": "Engineering", "count": 156, "percentage": 32.0},
      {"department": "Sales", "count": 89, "percentage": 18.3},
      {"department": "Marketing", "count": 67, "percentage": 13.8}
    ],
    "employmentTypeDistribution": [
      {"type": "full-time", "count": 398, "percentage": 81.7},
      {"type": "contract", "count": 56, "percentage": 11.5},
      {"type": "part-time", "count": 33, "percentage": 6.8}
    ],
    "dataExtractionStats": {
      "totalEmails": 45678,
      "totalChats": 23456,
      "totalMeetings": 3456,
      "totalFiles": 12345,
      "lastSyncDate": "2024-12-01T08:00:00Z"
    }
  }
}
```

### Employee Management

The employee management module provides comprehensive functionality for managing employee records, including creation, updates, search, and bulk operations.

#### List Employees

```http
GET /api/organizations/{organizationId}/employees
```

Retrieves a paginated list of employees with optional filtering and sorting capabilities.

**Parameters:**
- `organizationId` (path, required): UUID of the organization
- `page` (query, optional): Page number (default: 1)
- `limit` (query, optional): Items per page (default: 20, max: 100)
- `search` (query, optional): Search term for name, email, or employee code
- `departmentId` (query, optional): Filter by department UUID
- `isActive` (query, optional): Filter by active status (true/false)
- `isVerified` (query, optional): Filter by verification status (true/false)
- `employmentType` (query, optional): Filter by employment type
- `sortBy` (query, optional): Sort field (full_name, job_title, hired_at, salary)
- `sortOrder` (query, optional): Sort direction (asc, desc)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440002",
      "organisation_id": "550e8400-e29b-41d4-a716-446655440000",
      "full_name": "John Smith",
      "work_email": "john.smith@acme.com",
      "email": "john.smith@personal.com",
      "phone": "+1-555-987-6543",
      "job_title": "Senior Software Engineer",
      "department_id": "880e8400-e29b-41d4-a716-446655440003",
      "manager_id": "990e8400-e29b-41d4-a716-446655440004",
      "employee_code": "EMP001",
      "employment_type": "full-time",
      "hired_at": "2022-03-15T00:00:00Z",
      "salary": 95000,
      "is_active": true,
      "office_location": "San Francisco, CA",
      "work_schedule": {
        "monday": {"start": "09:00", "end": "17:00"},
        "tuesday": {"start": "09:00", "end": "17:00"},
        "wednesday": {"start": "09:00", "end": "17:00"},
        "thursday": {"start": "09:00", "end": "17:00"},
        "friday": {"start": "09:00", "end": "17:00"}
      },
      "data_source": "manual",
      "isVerified": true,
      "created_at": "2022-03-15T10:30:00Z",
      "updated_at": "2024-11-15T14:22:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 487,
    "totalPages": 25,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### Create Employee

```http
POST /api/organizations/{organizationId}/employees
```

Creates a new employee record with comprehensive validation and duplicate checking.

**Parameters:**
- `organizationId` (path, required): UUID of the organization

**Request Body:**
```json
{
  "full_name": "Jane Doe",
  "work_email": "jane.doe@acme.com",
  "email": "jane.doe@personal.com",
  "phone": "+1-555-123-7890",
  "job_title": "Product Manager",
  "department_id": "880e8400-e29b-41d4-a716-446655440005",
  "manager_id": "990e8400-e29b-41d4-a716-446655440006",
  "employee_code": "EMP502",
  "employment_type": "full-time",
  "hired_at": "2024-12-01T00:00:00Z",
  "salary": 85000,
  "office_location": "New York, NY",
  "work_schedule": {
    "monday": {"start": "08:30", "end": "16:30"},
    "tuesday": {"start": "08:30", "end": "16:30"},
    "wednesday": {"start": "08:30", "end": "16:30"},
    "thursday": {"start": "08:30", "end": "16:30"},
    "friday": {"start": "08:30", "end": "16:30"}
  },
  "data_source": "manual"
}
```

#### Update Employee

```http
PUT /api/organizations/{organizationId}/employees/{employeeId}
```

Updates an existing employee record with partial update support and validation.

**Parameters:**
- `organizationId` (path, required): UUID of the organization
- `employeeId` (path, required): UUID of the employee

**Request Body:** (All fields optional for partial updates)
```json
{
  "job_title": "Senior Product Manager",
  "salary": 95000,
  "manager_id": "990e8400-e29b-41d4-a716-446655440007"
}
```

#### Delete Employee

```http
DELETE /api/organizations/{organizationId}/employees/{employeeId}
```

Soft deletes an employee record, maintaining data integrity while hiding the record from normal operations.

**Parameters:**
- `organizationId` (path, required): UUID of the organization
- `employeeId` (path, required): UUID of the employee

#### Bulk Employee Operations

```http
POST /api/organizations/{organizationId}/employees/bulk
```

Performs bulk operations on multiple employees, including creation, updates, and deletion.

**Request Body:**
```json
{
  "operation": "update",
  "employees": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440002",
      "salary": 100000
    },
    {
      "id": "770e8400-e29b-41d4-a716-446655440008",
      "department_id": "880e8400-e29b-41d4-a716-446655440009"
    }
  ]
}
```

### Department Management

The department management module handles organizational structure, including hierarchical relationships and department-specific metadata.

#### List Departments

```http
GET /api/organizations/{organizationId}/departments
```

Retrieves all departments within an organization with optional hierarchy information.

**Parameters:**
- `organizationId` (path, required): UUID of the organization
- `includeHierarchy` (query, optional): Include parent-child relationships (default: false)
- `includeEmployeeCount` (query, optional): Include employee counts (default: false)

#### Create Department

```http
POST /api/organizations/{organizationId}/departments
```

Creates a new department with validation for hierarchy constraints and head assignment.

**Request Body:**
```json
{
  "name": "Data Science",
  "description": "Advanced analytics and machine learning team",
  "head_id": "770e8400-e29b-41d4-a716-446655440010",
  "parent_department_id": "880e8400-e29b-41d4-a716-446655440003",
  "office_location": "San Francisco, CA",
  "data_source": "manual"
}
```

#### Update Department

```http
PUT /api/organizations/{organizationId}/departments/{departmentId}
```

Updates department information with validation for circular hierarchy references.

#### Get Department Hierarchy

```http
GET /api/organizations/{organizationId}/departments/hierarchy
```

Retrieves the complete department hierarchy as a tree structure with employee counts and metadata.

### Data Source Connections

The connections module manages integrations with external data sources, including authentication, configuration, and synchronization status.

#### List Connections

```http
GET /api/organizations/{organizationId}/connections
```

Retrieves all configured data source connections with status information.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "organisation_id": "550e8400-e29b-41d4-a716-446655440000",
      "service_name": "microsoft365",
      "description": "Microsoft 365 Email and Calendar Integration",
      "api_endpoint": "https://graph.microsoft.com/v1.0",
      "auth_type": "oauth2",
      "client_id": "12345678-1234-1234-1234-123456789012",
      "scopes": "Mail.Read Calendars.Read User.Read",
      "status": "connected",
      "last_sync": "2024-12-01T08:00:00Z",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-12-01T08:00:00Z"
    }
  ]
}
```

#### Create Connection

```http
POST /api/organizations/{organizationId}/connections
```

Creates a new data source connection with authentication setup and validation.

**Request Body:**
```json
{
  "service_name": "googleworkspace",
  "description": "Google Workspace Gmail and Drive Integration",
  "api_endpoint": "https://www.googleapis.com",
  "auth_type": "oauth2",
  "client_id": "your-google-client-id",
  "client_secret": "your-google-client-secret",
  "scopes": "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/drive.readonly"
}
```

#### Test Connection

```http
POST /api/organizations/{organizationId}/connections/{connectionId}/test
```

Tests a data source connection to verify authentication and connectivity.

#### Sync Data Source

```http
POST /api/organizations/{organizationId}/connections/{connectionId}/sync
```

Initiates data synchronization from the specified data source with optional parameters for incremental sync.

**Request Body:**
```json
{
  "syncType": "incremental",
  "startDate": "2024-11-01T00:00:00Z",
  "endDate": "2024-12-01T23:59:59Z",
  "dataTypes": ["emails", "meetings", "files"]
}
```

### Extracted Data Management

The extracted data module provides access to data that has been synchronized from external sources, including emails, chats, meetings, and files.

#### List Extracted Emails

```http
GET /api/organizations/{organizationId}/extracted-data/emails
```

Retrieves extracted email data with comprehensive filtering and search capabilities.

**Parameters:**
- `organizationId` (path, required): UUID of the organization
- `page` (query, optional): Page number
- `limit` (query, optional): Items per page
- `search` (query, optional): Search in subject and body
- `sender` (query, optional): Filter by sender email
- `recipient` (query, optional): Filter by recipient email
- `dateFrom` (query, optional): Start date filter (ISO 8601)
- `dateTo` (query, optional): End date filter (ISO 8601)
- `hasAttachments` (query, optional): Filter by attachment presence
- `dataSource` (query, optional): Filter by data source

#### List Extracted Meetings

```http
GET /api/organizations/{organizationId}/extracted-data/meetings
```

Retrieves extracted meeting data with participant information and metadata.

#### List Extracted Files

```http
GET /api/organizations/{organizationId}/extracted-data/files
```

Retrieves extracted file metadata with sharing and access information.

#### Get Communication Analytics

```http
GET /api/organizations/{organizationId}/extracted-data/analytics
```

Provides comprehensive analytics on communication patterns, including volume trends, top communicators, and collaboration metrics.

**Parameters:**
- `period` (query, optional): Analysis period (7d, 30d, 90d, 1y)
- `groupBy` (query, optional): Grouping dimension (day, week, month, department, employee)

### Role and Privilege Management

The role management module provides fine-grained access control with customizable roles and privileges.

#### List Roles

```http
GET /api/roles
```

Retrieves all available roles with their associated privileges.

#### Create Role

```http
POST /api/roles
```

Creates a new role with specified privileges.

**Request Body:**
```json
{
  "name": "department_manager",
  "description": "Department manager with employee management privileges",
  "privileges": [
    "EMPLOYEE_READ",
    "EMPLOYEE_UPDATE",
    "DEPARTMENT_READ",
    "REPORTS_READ"
  ]
}
```

#### Assign Role to User

```http
POST /api/users/{userId}/roles
```

Assigns one or more roles to a user with optional expiration dates.

#### List Privileges

```http
GET /api/privileges
```

Retrieves all available system privileges organized by category.


---

## Data Models

The API uses a comprehensive set of data models that represent the various entities and relationships within the organizational data extraction system. All models include validation rules, type definitions, and relationship constraints.

### Core Entity Models

#### Organization Model

The Organization model represents a company or organizational entity and serves as the top-level container for all other data.

```typescript
interface Organisation {
  id: string;                    // UUID primary key
  name: string;                  // Organization name (required, 2-255 chars)
  email: string;                 // Contact email (required, valid email format)
  phone: string;                 // Contact phone (required, international format)
  address: string;               // Physical address (required, max 500 chars)
  website: string;               // Website URL (required, valid URL format)
  logo_url?: string;             // Logo image URL (optional, valid URL)
  industry: string;              // Industry classification (required, max 255 chars)
  country: string;               // Country name (required, max 100 chars)
  state: string;                 // State/province (required, max 100 chars)
  size: number;                  // Number of employees (required, positive integer)
  owner_id: string;              // Owner user ID (required, UUID)
  created_at: string;            // Creation timestamp (ISO 8601)
  updated_at: string;            // Last update timestamp (ISO 8601)
}
```

**Validation Rules:**
- Name must be unique within the system
- Email must be a valid email address and unique
- Phone must follow international format (+country-area-number)
- Website must be a valid URL with HTTPS protocol
- Size must be between 1 and 1,000,000 employees
- Industry must be from predefined list or custom value

#### Employee Model

The Employee model represents individual people within an organization with comprehensive profile and employment information.

```typescript
interface ExtractedEmployee {
  id: string;                    // UUID primary key
  organisation_id: string;       // Organization reference (required, UUID)
  full_name: string;             // Full legal name (required, 2-255 chars)
  work_email: string;            // Work email address (required, unique within org)
  email: string;                 // Personal email address (required, valid email)
  phone?: string;                // Phone number (optional, international format)
  job_title: string;             // Job title/position (required, max 255 chars)
  department_id: string;         // Department reference (required, UUID)
  manager_id?: string;           // Manager reference (optional, UUID)
  employee_code: string;         // Unique employee identifier (required, unique within org)
  employment_type: EmploymentType; // Employment classification (required, enum)
  hired_at: string;              // Hire date (required, ISO 8601 date)
  terminated_at?: string;        // Termination date (optional, ISO 8601 date)
  salary: number;                // Annual salary (optional, non-negative)
  is_active: boolean;            // Active status (required, default true)
  office_location: string;       // Work location (optional, max 100 chars)
  work_schedule: Record<string, any>; // Work schedule configuration (optional, JSON)
  data_source: string;           // Source of data (required, max 50 chars)
  isVerified: boolean;           // Verification status (required, default false)
  created_at: string;            // Creation timestamp (ISO 8601)
  updated_at: string;            // Last update timestamp (ISO 8601)
}

type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'intern' | 'consultant';
```

**Validation Rules:**
- Work email must be unique within the organization
- Employee code must be unique within the organization
- Hire date cannot be in the future
- Termination date must be after hire date if specified
- Manager cannot be the employee themselves
- Salary must be non-negative if specified

#### Department Model

The Department model represents organizational units with support for hierarchical structures.

```typescript
interface ExtractedDepartment {
  id: string;                    // UUID primary key
  organisation_id: string;       // Organization reference (required, UUID)
  name: string;                  // Department name (required, 2-255 chars)
  description: string;           // Department description (required, 10-1000 chars)
  parent_department_id?: string; // Parent department (optional, UUID)
  head_id: string;               // Department head (required, UUID)
  office_location: string;       // Primary location (required, max 255 chars)
  data_source: string;           // Source of data (required, max 50 chars)
  isVerified: boolean;           // Verification status (required, default false)
  created_at: string;            // Creation timestamp (ISO 8601)
  updated_at: string;            // Last update timestamp (ISO 8601)
}
```

**Validation Rules:**
- Name must be unique within the organization
- Cannot create circular hierarchy references
- Department head must be an active employee
- Parent department must exist and belong to same organization

### Communication Data Models

#### Email Model

The Email model represents extracted email messages with comprehensive metadata and content analysis.

```typescript
interface ExtractedEmail {
  id: string;                    // UUID primary key
  organisation_id: string;       // Organization reference (required, UUID)
  message_id: string;            // Original message ID (required, unique)
  thread_id?: string;            // Email thread identifier (optional)
  sender_email: string;          // Sender email address (required, valid email)
  recipient_emails: string[];    // Recipient email addresses (required, array of emails)
  cc_emails?: string[];          // CC recipients (optional, array of emails)
  bcc_emails?: string[];         // BCC recipients (optional, array of emails)
  subject: string;               // Email subject (required, max 500 chars)
  body_text?: string;            // Plain text body (optional)
  body_html?: string;            // HTML body (optional)
  date_sent: string;             // Send timestamp (required, ISO 8601)
  date_received: string;         // Receive timestamp (required, ISO 8601)
  has_attachments: boolean;      // Attachment indicator (required, default false)
  attachment_count: number;      // Number of attachments (required, default 0)
  is_read: boolean;              // Read status (required, default false)
  is_starred: boolean;           // Starred status (required, default false)
  folder: string;                // Email folder/label (optional, max 100 chars)
  data_source: string;           // Source system (required, max 50 chars)
  raw_data?: Record<string, any>; // Original raw data (optional, JSON)
  created_at: string;            // Extraction timestamp (ISO 8601)
  updated_at: string;            // Last update timestamp (ISO 8601)
}
```

#### Meeting Model

The Meeting model represents extracted meeting and calendar events with participant information.

```typescript
interface ExtractedMeeting {
  id: string;                    // UUID primary key
  organisation_id: string;       // Organization reference (required, UUID)
  meeting_id: string;            // Original meeting ID (required, unique)
  title: string;                 // Meeting title (required, max 500 chars)
  description?: string;          // Meeting description (optional)
  organizer_email: string;       // Organizer email (required, valid email)
  attendee_emails: string[];     // Attendee emails (required, array of emails)
  start: string;                 // Start time (required, ISO 8601)
  end: string;                   // End time (required, ISO 8601)
  location?: string;             // Meeting location (optional, max 255 chars)
  is_virtual: boolean;           // Virtual meeting indicator (required, default false)
  meeting_url?: string;          // Virtual meeting URL (optional, valid URL)
  status: MeetingStatus;         // Meeting status (required, enum)
  data_source: string;           // Source system (required, max 50 chars)
  raw_data?: Record<string, any>; // Original raw data (optional, JSON)
  created_at: string;            // Extraction timestamp (ISO 8601)
  updated_at: string;            // Last update timestamp (ISO 8601)
}

type MeetingStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
```

### Connection and Integration Models

#### Connection Model

The Connection model represents configured integrations with external data sources.

```typescript
interface Connection {
  id: number;                    // Auto-increment primary key
  organisation_id: string;       // Organization reference (required, UUID)
  service_name: ServiceType;     // Service type (required, enum)
  description: string;           // Connection description (required, max 500 chars)
  api_endpoint: string;          // API endpoint URL (required, valid URL)
  auth_type: AuthType;           // Authentication type (required, enum)
  client_id: string;             // OAuth client ID (required, max 255 chars)
  client_secret: string;         // OAuth client secret (required, encrypted)
  api_key?: string;              // API key (optional, encrypted)
  scopes: string;                // OAuth scopes (required, max 500 chars)
  access_token?: string;         // Current access token (optional, encrypted)
  refresh_token?: string;        // Refresh token (optional, encrypted)
  token_expires_at?: string;     // Token expiration (optional, ISO 8601)
  status: ConnectionStatus;      // Connection status (required, enum)
  last_sync?: string;            // Last sync timestamp (optional, ISO 8601)
  sync_frequency?: number;       // Sync frequency in hours (optional, positive integer)
  created_at: string;            // Creation timestamp (ISO 8601)
  updated_at: string;            // Last update timestamp (ISO 8601)
}

type ServiceType = 'microsoft365' | 'googleworkspace' | 'dropbox' | 'slack' | 'zoom' | 'jira' | 'customapi';
type AuthType = 'oauth2' | 'api_key' | 'basic_auth' | 'bearer_token';
type ConnectionStatus = 'pending' | 'connected' | 'disconnected' | 'error';
```

### Role and Permission Models

#### Role Model

The Role model defines user roles with associated privileges for access control.

```typescript
interface Role {
  id: string;                    // UUID primary key
  name: string;                  // Role name (required, unique, 2-50 chars)
  description: string;           // Role description (required, 10-500 chars)
  is_system_role: boolean;       // System role indicator (required, default false)
  created_at: string;            // Creation timestamp (ISO 8601)
  updated_at: string;            // Last update timestamp (ISO 8601)
}
```

#### Privilege Model

The Privilege model defines specific permissions that can be assigned to roles.

```typescript
interface Privilege {
  id: string;                    // UUID primary key
  code: string;                  // Privilege code (required, unique, uppercase)
  name: string;                  // Privilege name (required, max 100 chars)
  description: string;           // Privilege description (required, max 500 chars)
  category: string;              // Privilege category (required, max 50 chars)
  created_at: string;            // Creation timestamp (ISO 8601)
  updated_at: string;            // Last update timestamp (ISO 8601)
}
```

---

## Error Handling

The API implements comprehensive error handling with consistent error response formats, detailed error messages, and appropriate HTTP status codes. All errors include sufficient information for debugging while maintaining security by not exposing sensitive system details.

### Error Response Format

All API errors follow a standardized response format that includes error codes, messages, and additional context where appropriate:

```json
{
  "success": false,
  "error": "Validation failed for employee data",
  "code": "VALIDATION_ERROR",
  "details": {
    "field": "work_email",
    "message": "Email address is already in use",
    "value": "john.doe@acme.com"
  },
  "timestamp": "2024-12-01T14:30:00Z",
  "requestId": "req_1234567890abcdef"
}
```

### HTTP Status Codes

The API uses standard HTTP status codes to indicate the type of error:

**2xx Success Codes:**
- `200 OK`: Request successful, data returned
- `201 Created`: Resource created successfully
- `204 No Content`: Request successful, no data returned

**4xx Client Error Codes:**
- `400 Bad Request`: Invalid request format or parameters
- `401 Unauthorized`: Authentication required or invalid
- `403 Forbidden`: Insufficient permissions for requested action
- `404 Not Found`: Requested resource does not exist
- `409 Conflict`: Resource conflict (duplicate, constraint violation)
- `422 Unprocessable Entity`: Validation errors in request data
- `429 Too Many Requests`: Rate limit exceeded

**5xx Server Error Codes:**
- `500 Internal Server Error`: Unexpected server error
- `502 Bad Gateway`: External service unavailable
- `503 Service Unavailable`: Service temporarily unavailable
- `504 Gateway Timeout`: External service timeout

### Common Error Scenarios

**Authentication Errors:**
```json
{
  "success": false,
  "error": "Invalid or expired authentication token",
  "code": "AUTH_TOKEN_INVALID",
  "details": {
    "reason": "Token has expired",
    "expiredAt": "2024-12-01T12:00:00Z"
  }
}
```

**Validation Errors:**
```json
{
  "success": false,
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": {
    "fields": {
      "full_name": "Full name is required",
      "work_email": "Invalid email format",
      "hired_at": "Hire date cannot be in the future"
    }
  }
}
```

**Resource Not Found:**
```json
{
  "success": false,
  "error": "Employee not found",
  "code": "RESOURCE_NOT_FOUND",
  "details": {
    "resource": "employee",
    "id": "770e8400-e29b-41d4-a716-446655440999"
  }
}
```

**Permission Denied:**
```json
{
  "success": false,
  "error": "Insufficient permissions to access this resource",
  "code": "PERMISSION_DENIED",
  "details": {
    "required_privilege": "EMPLOYEE_UPDATE",
    "user_privileges": ["EMPLOYEE_READ", "DEPARTMENT_READ"]
  }
}
```

### Error Recovery and Retry Logic

The API provides guidance for error recovery and implements retry-friendly error responses:

**Temporary Errors**: Errors with codes like `SERVICE_UNAVAILABLE` or `RATE_LIMIT_EXCEEDED` include retry information:

```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_EXCEEDED",
  "details": {
    "retryAfter": 60,
    "limit": 1000,
    "remaining": 0,
    "resetTime": "2024-12-01T15:00:00Z"
  }
}
```

**Idempotency**: POST and PUT operations support idempotency keys to prevent duplicate operations during retry scenarios.

---

## Rate Limiting

The API implements comprehensive rate limiting to ensure fair usage and system stability. Rate limits are applied per organization and per user, with different limits for different types of operations.

### Rate Limit Tiers

**Standard Tier:**
- 1,000 requests per hour per organization
- 100 requests per minute per user
- 10 concurrent connections per organization

**Premium Tier:**
- 5,000 requests per hour per organization
- 500 requests per minute per user
- 50 concurrent connections per organization

**Enterprise Tier:**
- 25,000 requests per hour per organization
- 2,500 requests per minute per user
- 250 concurrent connections per organization

### Rate Limit Headers

All API responses include rate limit information in the headers:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
X-RateLimit-Reset: 1701435600
X-RateLimit-Retry-After: 60
```

### Rate Limit Bypass

Certain critical operations bypass rate limits:
- Authentication and token refresh
- Health check endpoints
- Emergency data export requests

---

## SDK and Client Libraries

The API provides official client libraries for popular programming languages, making integration easier and more reliable.

### JavaScript/TypeScript SDK

```bash
npm install @extraction-app/api-client
```

```typescript
import { ExtractionApiClient } from '@extraction-app/api-client';

const client = new ExtractionApiClient({
  baseUrl: 'https://api.extraction-app.com',
  apiKey: 'your-api-key',
  organizationId: 'your-org-id'
});

// List employees
const employees = await client.employees.list({
  page: 1,
  limit: 20,
  search: 'john'
});

// Create employee
const newEmployee = await client.employees.create({
  full_name: 'John Doe',
  work_email: 'john.doe@company.com',
  job_title: 'Software Engineer',
  department_id: 'dept-uuid'
});
```

### Python SDK

```bash
pip install extraction-app-client
```

```python
from extraction_app import ExtractionApiClient

client = ExtractionApiClient(
    base_url='https://api.extraction-app.com',
    api_key='your-api-key',
    organization_id='your-org-id'
)

# List employees
employees = client.employees.list(page=1, limit=20, search='john')

# Create employee
new_employee = client.employees.create({
    'full_name': 'John Doe',
    'work_email': 'john.doe@company.com',
    'job_title': 'Software Engineer',
    'department_id': 'dept-uuid'
})
```

---

## Examples and Use Cases

This section provides comprehensive examples of common API usage patterns and integration scenarios.

### Complete Employee Onboarding Workflow

This example demonstrates a complete employee onboarding process, from creating the employee record to setting up data access and notifications.

```typescript
async function onboardNewEmployee(employeeData: EmployeeFormData) {
  try {
    // Step 1: Create employee record
    const employee = await client.employees.create({
      full_name: employeeData.full_name,
      work_email: employeeData.work_email,
      email: employeeData.email,
      job_title: employeeData.job_title,
      department_id: employeeData.department_id,
      manager_id: employeeData.manager_id,
      employee_code: employeeData.employee_code,
      employment_type: 'full-time',
      hired_at: new Date().toISOString(),
      salary: employeeData.salary,
      office_location: employeeData.office_location,
      data_source: 'manual'
    });

    // Step 2: Assign default role
    await client.users.assignRole(employee.id, 'employee');

    // Step 3: Add to department
    await client.departments.addMember(employeeData.department_id, employee.id);

    // Step 4: Notify manager
    if (employeeData.manager_id) {
      await client.notifications.send({
        recipient_id: employeeData.manager_id,
        type: 'new_team_member',
        data: {
          employee_name: employee.full_name,
          employee_id: employee.id,
          start_date: employee.hired_at
        }
      });
    }

    // Step 5: Schedule data extraction for new employee
    await client.dataExtraction.scheduleSync({
      employee_id: employee.id,
      data_sources: ['microsoft365', 'slack'],
      start_date: employee.hired_at
    });

    return {
      success: true,
      employee: employee,
      message: 'Employee onboarded successfully'
    };

  } catch (error) {
    console.error('Onboarding failed:', error);
    throw new Error(`Failed to onboard employee: ${error.message}`);
  }
}
```

### Bulk Data Import from CSV

This example shows how to import employee data from a CSV file with validation and error handling.

```typescript
async function importEmployeesFromCSV(csvData: string, organizationId: string) {
  const results = {
    successful: [],
    failed: [],
    total: 0
  };

  try {
    // Parse CSV data
    const employees = parseCSV(csvData);
    results.total = employees.length;

    // Process in batches to avoid rate limits
    const batchSize = 10;
    for (let i = 0; i < employees.length; i += batchSize) {
      const batch = employees.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (employeeData, index) => {
        try {
          // Validate data
          const validation = validateEmployeeData(employeeData);
          if (!validation.isValid) {
            throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
          }

          // Check for duplicates
          const existing = await client.employees.findByEmail(employeeData.work_email);
          if (existing) {
            throw new Error('Employee with this email already exists');
          }

          // Create employee
          const employee = await client.employees.create({
            ...employeeData,
            organisation_id: organizationId,
            data_source: 'csv_import'
          });

          results.successful.push({
            row: i + index + 1,
            employee: employee
          });

        } catch (error) {
          results.failed.push({
            row: i + index + 1,
            data: employeeData,
            error: error.message
          });
        }
      });

      await Promise.all(batchPromises);
      
      // Add delay between batches to respect rate limits
      if (i + batchSize < employees.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;

  } catch (error) {
    throw new Error(`Import failed: ${error.message}`);
  }
}
```

### Real-time Communication Analytics Dashboard

This example demonstrates how to build a real-time analytics dashboard using the communication data endpoints.

```typescript
class CommunicationAnalyticsDashboard {
  private client: ExtractionApiClient;
  private organizationId: string;
  private updateInterval: number = 30000; // 30 seconds

  constructor(client: ExtractionApiClient, organizationId: string) {
    this.client = client;
    this.organizationId = organizationId;
  }

  async initializeDashboard() {
    // Load initial data
    await this.updateAllMetrics();
    
    // Set up periodic updates
    setInterval(() => {
      this.updateAllMetrics();
    }, this.updateInterval);
  }

  async updateAllMetrics() {
    try {
      const [
        emailStats,
        meetingStats,
        chatStats,
        topCommunicators,
        communicationTrends
      ] = await Promise.all([
        this.getEmailStatistics(),
        this.getMeetingStatistics(),
        this.getChatStatistics(),
        this.getTopCommunicators(),
        this.getCommunicationTrends()
      ]);

      this.updateDashboardUI({
        emailStats,
        meetingStats,
        chatStats,
        topCommunicators,
        communicationTrends
      });

    } catch (error) {
      console.error('Failed to update dashboard metrics:', error);
    }
  }

  async getEmailStatistics() {
    const response = await this.client.extractedData.getAnalytics({
      organizationId: this.organizationId,
      dataType: 'emails',
      period: '7d',
      groupBy: 'day'
    });

    return {
      totalEmails: response.data.total,
      dailyAverage: response.data.dailyAverage,
      trend: response.data.trend,
      topSenders: response.data.topSenders
    };
  }

  async getMeetingStatistics() {
    const response = await this.client.extractedData.getAnalytics({
      organizationId: this.organizationId,
      dataType: 'meetings',
      period: '7d',
      groupBy: 'day'
    });

    return {
      totalMeetings: response.data.total,
      totalHours: response.data.totalDuration / 3600,
      averageDuration: response.data.averageDuration,
      virtualMeetingPercentage: response.data.virtualPercentage
    };
  }

  async getCommunicationTrends() {
    const response = await this.client.extractedData.getAnalytics({
      organizationId: this.organizationId,
      period: '30d',
      groupBy: 'week'
    });

    return response.data.timeSeriesData.map(item => ({
      week: item.date,
      emails: item.emails,
      meetings: item.meetings,
      chats: item.chats
    }));
  }

  private updateDashboardUI(data: any) {
    // Update dashboard UI components with new data
    // This would integrate with your frontend framework
    console.log('Dashboard updated with new data:', data);
  }
}
```

---

## Migration Guide

This section provides detailed guidance for migrating from the previous API version to the new refactored API.

### Breaking Changes

The refactored API introduces several breaking changes that require code updates:

**URL Structure Changes:**
- Old: `/api/employees` → New: `/api/organizations/{organizationId}/employees`
- Old: `/api/departments` → New: `/api/organizations/{organizationId}/departments`
- All endpoints now require organization context

**Data Model Changes:**
- Employee `name` field renamed to `full_name`
- Employee `position` field renamed to `job_title`
- Department `head` field renamed to `head_id` and now requires UUID
- All ID fields changed from integers to UUIDs

**Authentication Changes:**
- API now requires organization-scoped tokens
- Role-based permissions replace simple admin/user roles
- OAuth2 scopes have been restructured

### Migration Steps

**Step 1: Update Authentication**

Old authentication:
```javascript
const response = await fetch('/api/employees', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

New authentication:
```javascript
const response = await fetch(`/api/organizations/${organizationId}/employees`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'X-Organization-ID': organizationId
  }
});
```

**Step 2: Update Data Models**

Old employee creation:
```javascript
const employee = {
  name: 'John Doe',
  email: 'john@company.com',
  position: 'Developer',
  department: 'Engineering'
};
```

New employee creation:
```javascript
const employee = {
  full_name: 'John Doe',
  work_email: 'john@company.com',
  email: 'john.personal@gmail.com',
  job_title: 'Developer',
  department_id: 'dept-uuid-here',
  employee_code: 'EMP001',
  employment_type: 'full-time',
  hired_at: '2024-01-15T00:00:00Z',
  data_source: 'manual'
};
```

**Step 3: Update Error Handling**

The new API uses structured error responses:

```javascript
try {
  const response = await client.employees.create(employeeData);
} catch (error) {
  if (error.code === 'VALIDATION_ERROR') {
    // Handle validation errors
    console.log('Validation errors:', error.details.fields);
  } else if (error.code === 'PERMISSION_DENIED') {
    // Handle permission errors
    console.log('Missing privilege:', error.details.required_privilege);
  }
}
```

### Data Migration Script

Use this script to migrate existing data to the new schema:

```javascript
async function migrateOrganizationData(oldOrgData) {
  // Create organization
  const organization = await client.organizations.create({
    name: oldOrgData.name,
    email: oldOrgData.email,
    phone: oldOrgData.phone || '+1-555-000-0000',
    address: oldOrgData.address || 'Unknown',
    website: oldOrgData.website || 'https://example.com',
    industry: oldOrgData.industry || 'Technology',
    country: oldOrgData.country || 'United States',
    state: oldOrgData.state || 'Unknown',
    size: oldOrgData.employeeCount || 1
  });

  // Migrate departments
  const departmentMap = new Map();
  for (const oldDept of oldOrgData.departments) {
    const department = await client.departments.create({
      organisation_id: organization.id,
      name: oldDept.name,
      description: oldDept.description || 'Migrated department',
      head_id: 'temp-head-id', // Will be updated after employee migration
      office_location: oldDept.location || 'Unknown',
      data_source: 'migration'
    });
    departmentMap.set(oldDept.id, department.id);
  }

  // Migrate employees
  for (const oldEmployee of oldOrgData.employees) {
    const employee = await client.employees.create({
      organisation_id: organization.id,
      full_name: oldEmployee.name,
      work_email: oldEmployee.email,
      email: oldEmployee.personalEmail || oldEmployee.email,
      phone: oldEmployee.phone,
      job_title: oldEmployee.position,
      department_id: departmentMap.get(oldEmployee.departmentId),
      employee_code: oldEmployee.id.toString(),
      employment_type: 'full-time',
      hired_at: oldEmployee.hireDate || new Date().toISOString(),
      salary: oldEmployee.salary || 0,
      is_active: oldEmployee.status === 'active',
      office_location: oldEmployee.location || 'Unknown',
      data_source: 'migration'
    });
  }

  return organization;
}
```

---

## Appendices

### Appendix A: Complete API Reference

For a complete, interactive API reference with all endpoints, parameters, and response schemas, visit our API documentation portal at `https://docs.extraction-app.com/api`.

### Appendix B: Postman Collection

Download our comprehensive Postman collection for testing and development:
`https://docs.extraction-app.com/postman/extraction-app-api.json`

### Appendix C: OpenAPI Specification

The complete OpenAPI 3.0 specification is available at:
`https://api.extraction-app.com/openapi.json`

### Appendix D: Support and Resources

- **Developer Portal**: https://developers.extraction-app.com
- **Community Forum**: https://community.extraction-app.com
- **GitHub Repository**: https://github.com/extraction-app/api-examples
- **Support Email**: api-support@extraction-app.com
- **Status Page**: https://status.extraction-app.com

---

*This documentation is maintained by the Manus AI team and is updated regularly to reflect the latest API changes and improvements. For questions or feedback, please contact our developer support team.*

