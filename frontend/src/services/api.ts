import { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  Document, 
  CreateDocumentRequest, 
  UpdateDocumentRequest,
  DocumentTemplate,
  ApiResponse,
  ExportFormat,
  ExportOptions
} from '../types';

// Dynamic API URL detection for reverse proxy support
const getApiBaseUrl = (): string => {
  // If VITE_API_URL is set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // If we're in production and running under the same domain (reverse proxy)
  if (import.meta.env.PROD && window.location.protocol !== 'file:') {
    return `${window.location.protocol}//${window.location.host}/api`;
  }
  
  // Development fallback
  return 'http://localhost:3000/api';
};

const API_BASE_URL = getApiBaseUrl();

class ApiService {
  private getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.success && response.data) {
      localStorage.setItem('auth_token', response.data.token);
      return response.data;
    }
    
    throw new Error(response.error || 'Login failed');
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.success && response.data) {
      localStorage.setItem('auth_token', response.data.token);
      return response.data;
    }
    
    throw new Error(response.error || 'Registration failed');
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.request<User>('/auth/me');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to get user data');
  }

  async logout(): Promise<void> {
    await this.request('/auth/logout', { method: 'POST' });
    localStorage.removeItem('auth_token');
  }

  // Document methods
  async getDocuments(): Promise<Document[]> {
    const response = await this.request<Document[]>('/documents');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch documents');
  }

  async getDocument(id: number): Promise<Document> {
    const response = await this.request<Document>(`/documents/${id}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch document');
  }

  async createDocument(documentData: CreateDocumentRequest): Promise<Document> {
    const response = await this.request<Document>('/documents', {
      method: 'POST',
      body: JSON.stringify(documentData),
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to create document');
  }

  async updateDocument(id: number, updates: UpdateDocumentRequest): Promise<Document> {
    const response = await this.request<Document>(`/documents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to update document');
  }

  async deleteDocument(id: number): Promise<void> {
    const response = await this.request(`/documents/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete document');
    }
  }

  async duplicateDocument(id: number, newTitle: string): Promise<Document> {
    const response = await this.request<Document>(`/documents/${id}/duplicate`, {
      method: 'POST',
      body: JSON.stringify({ title: newTitle }),
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to duplicate document');
  }

  // Sharing methods
  async generateShareToken(id: number, expiresAt?: string): Promise<string> {
    const response = await this.request<{ shareToken: string }>(`/documents/${id}/share`, {
      method: 'POST',
      body: JSON.stringify({ expiresAt }),
    });
    
    if (response.success && response.data) {
      return response.data.shareToken;
    }
    
    throw new Error(response.error || 'Failed to generate share token');
  }

  async revokeShare(id: number): Promise<void> {
    const response = await this.request(`/documents/${id}/share`, {
      method: 'DELETE',
    });
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to revoke share');
    }
  }

  async getSharedDocument(shareToken: string): Promise<Document> {
    const response = await this.request<Document>(`/shared/${shareToken}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch shared document');
  }

  // Template methods
  async getTemplates(): Promise<DocumentTemplate[]> {
    const response = await this.request<DocumentTemplate[]>('/templates');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch templates');
  }

  async getTemplate(id: number): Promise<DocumentTemplate> {
    const response = await this.request<DocumentTemplate>(`/templates/${id}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch template');
  }

  // Export methods
  async exportDocument(id: number, format: ExportFormat, options?: ExportOptions): Promise<Blob> {
    const queryParams = new URLSearchParams();
    queryParams.set('format', format);
    
    if (options?.includeImages !== undefined) {
      queryParams.set('includeImages', options.includeImages.toString());
    }
    if (options?.includeTableOfContents !== undefined) {
      queryParams.set('includeTableOfContents', options.includeTableOfContents.toString());
    }

    const response = await fetch(`${API_BASE_URL}/documents/${id}/export?${queryParams}`, {
      headers: this.getAuthHeader(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Export failed');
    }

    return response.blob();
  }

  // Version methods
  async getDocumentVersions(id: number): Promise<any[]> {
    const response = await this.request<any[]>(`/documents/${id}/versions`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch document versions');
  }

  // User profile methods
  async updateProfile(updates: Partial<User>): Promise<User> {
    const response = await this.request<User>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to update profile');
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const response = await this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to change password');
    }
  }
}

export const apiService = new ApiService();
export default apiService;
