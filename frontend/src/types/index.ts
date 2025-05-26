// User related types
export interface User {
  id: number;
  email: string;
  name: string | null;
  is_admin: boolean;
  theme_preference: 'light' | 'dark' | 'system';
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Document related types
export interface DocumentContent {
  sections: {
    context?: string;
    objective?: string;
    technical_requirements?: string;
    examples?: string;
    constraints?: string;
    output_format?: string;
    [key: string]: string | undefined;
  };
  metadata?: {
    version: string;
    lastModified: string;
    completeness: number;
    qualityScore: number;
  };
}

export interface Document {
  id: number;
  title: string;
  owner_id: number;
  content: DocumentContent;
  is_public: boolean;
  share_token: string | null;
  share_expires_at: string | null;
  template_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface CreateDocumentRequest {
  title: string;
  template_id?: number;
}

export interface UpdateDocumentRequest {
  title?: string;
  content?: Partial<DocumentContent>;
  is_public?: boolean;
}

// Template types
export interface DocumentTemplate {
  id: number;
  name: string;
  description: string | null;
  content: Partial<DocumentContent>;
  is_system: boolean;
  created_by: number | null;
  created_at: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: any[];
}

// Export related types
export type ExportFormat = 'pdf' | 'markdown' | 'html';

export interface ExportOptions {
  format: ExportFormat;
  includeImages?: boolean;
  includeTableOfContents?: boolean;
}

// Theme types
export type Theme = 'light' | 'dark' | 'system';

// Section types for navigation
export type DocumentSection = 
  | 'projectOverview'
  | 'technicalRequirements'
  | 'functionalSpecifications'
  | 'implementationGuidance'
  | 'sampleData'
  | 'constraints';

export interface SectionInfo {
  key: DocumentSection;
  title: string;
  description: string;
  fields: {
    key: string;
    label: string;
    placeholder: string;
    description: string;
  }[];
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}

// Loading states
export interface LoadingState {
  loading: boolean;
  error: string | null;
}

// Auto-save state
export interface AutoSaveState {
  saving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
}
