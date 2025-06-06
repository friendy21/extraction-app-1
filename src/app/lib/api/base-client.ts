// Base API Client - Provides common functionality for all API clients
// This client handles authentication, error handling, and common HTTP operations

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  statusCode?: number;
}

export class ApiClientError extends Error {
  public statusCode: number;
  public apiError?: ApiError;

  constructor(message: string, statusCode: number, apiError?: ApiError) {
    super(message);
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
    this.apiError = apiError;
  }
}

export interface RequestOptions {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  headers?: Record<string, string>;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  department?: string;
  dataSource?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Base API Client class that provides common functionality for all API operations
 */
export class BaseApiClient {
  protected baseUrl: string;
  protected token?: string;
  protected defaultTimeout = 30000; // 30 seconds
  protected maxRetries = 3;
  protected retryDelay = 1000; // 1 second

  constructor(baseUrl: string = '/api', token?: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  /**
   * Set the authentication token
   */
  public setToken(token: string): void {
    this.token = token;
  }

  /**
   * Clear the authentication token
   */
  public clearToken(): void {
    this.token = undefined;
  }

  /**
   * Update client configuration
   */
  public setConfig(config: {
    timeout?: number;
    maxRetries?: number;
    retryDelay?: number;
  }): void {
    if (config.timeout) this.defaultTimeout = config.timeout;
    if (config.maxRetries) this.maxRetries = config.maxRetries;
    if (config.retryDelay) this.retryDelay = config.retryDelay;
  }

  /**
   * Get default headers for requests
   */
  protected getHeaders(additionalHeaders?: Record<string, string>): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...additionalHeaders,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * Make an HTTP request with retry logic and error handling
   */
  protected async request<T>(
    url: string,
    method: string,
    body?: any,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const timeout = options.timeout || this.defaultTimeout;
    const maxRetries = options.retries || this.maxRetries;
    const retryDelay = options.retryDelay || this.retryDelay;
    
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        const response = await fetch(url, {
          method,
          headers: this.getHeaders(options.headers),
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          let errorData: ApiError;
          
          try {
            errorData = await response.json();
          } catch (e) {
            errorData = {
              code: 'unknown_error',
              message: `HTTP ${response.status}: ${response.statusText}`,
              statusCode: response.status,
            };
          }
          
          throw new ApiClientError(
            errorData.message || `HTTP ${response.status}`,
            response.status,
            errorData
          );
        }
        
        return await response.json() as ApiResponse<T>;
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry for client errors (4xx) or abort errors
        if (
          error instanceof DOMException && error.name === 'AbortError' ||
          error instanceof ApiClientError && error.statusCode >= 400 && error.statusCode < 500 ||
          attempt >= maxRetries
        ) {
          break;
        }
        
        // Wait before retrying with exponential backoff
        await new Promise(resolve => 
          setTimeout(resolve, retryDelay * Math.pow(2, attempt))
        );
      }
    }
    
    throw lastError || new Error('Request failed after multiple attempts');
  }

  /**
   * GET request
   */
  protected async get<T>(
    endpoint: string, 
    params?: Record<string, any>,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    return this.request<T>(url.toString(), 'GET', undefined, options);
  }

  /**
   * POST request
   */
  protected async post<T>(
    endpoint: string,
    body?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(`${this.baseUrl}${endpoint}`, 'POST', body, options);
  }

  /**
   * PUT request
   */
  protected async put<T>(
    endpoint: string,
    body?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(`${this.baseUrl}${endpoint}`, 'PUT', body, options);
  }

  /**
   * PATCH request
   */
  protected async patch<T>(
    endpoint: string,
    body?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(`${this.baseUrl}${endpoint}`, 'PATCH', body, options);
  }

  /**
   * DELETE request
   */
  protected async delete<T>(
    endpoint: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(`${this.baseUrl}${endpoint}`, 'DELETE', undefined, options);
  }

  /**
   * Build query parameters for pagination and filtering
   */
  protected buildQueryParams(
    pagination?: PaginationParams,
    filters?: FilterParams
  ): Record<string, any> {
    const params: Record<string, any> = {};
    
    if (pagination) {
      if (pagination.page) params.page = pagination.page;
      if (pagination.limit) params.limit = pagination.limit;
      if (pagination.sortBy) params.sortBy = pagination.sortBy;
      if (pagination.sortOrder) params.sortOrder = pagination.sortOrder;
    }
    
    if (filters) {
      if (filters.search) params.search = filters.search;
      if (filters.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters.dateTo) params.dateTo = filters.dateTo;
      if (filters.status) params.status = filters.status;
      if (filters.department) params.department = filters.department;
      if (filters.dataSource) params.dataSource = filters.dataSource;
    }
    
    return params;
  }

  /**
   * Validate required fields in an object
   */
  protected validateRequired(obj: any, fields: string[], context: string): void {
    const missing = fields.filter(field => !obj[field]);
    if (missing.length > 0) {
      throw new Error(`Missing required fields for ${context}: ${missing.join(', ')}`);
    }
  }

  /**
   * Sanitize sensitive data for logging
   */
  protected sanitizeForLogging(obj: any): any {
    const sanitized = { ...obj };
    const sensitiveFields = [
      'password', 'token', 'secret', 'key', 'client_secret', 'api_key'
    ];
    
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***';
      }
    });
    
    return sanitized;
  }
}

