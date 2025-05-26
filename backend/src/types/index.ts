// User related types
export interface User {
  id: number;
  email: string;
  password_hash: string;
  name: string | null;
  is_admin: boolean;
  is_active: boolean;
  theme_preference: 'light' | 'dark' | 'system';
  created_at: string;
  updated_at: string;
}

export interface CreateUserInput {
  email: string;
  password: string;
  name?: string;
  is_admin?: boolean;
}

export interface UserProfile {
  id: number;
  email: string;
  name: string | null;
  is_admin: boolean;
  theme_preference: 'light' | 'dark' | 'system';
  created_at: string;
}

// Document related types
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

export interface CreateDocumentInput {
  title: string;
  template_id?: number;
}

export interface UpdateDocumentInput {
  title?: string;
  content?: Partial<DocumentContent>;
  is_public?: boolean;
}

// Image related types
export interface Image {
  id: number;
  document_id: number;
  original_filename: string;
  stored_filename: string;
  file_size: number;
  mime_type: string;
  caption: string | null;
  alt_text: string | null;
  section: string | null;
  created_at: string;
}

export interface CreateImageInput {
  document_id: number;
  original_filename: string;
  stored_filename: string;
  file_size: number;
  mime_type: string;
  section?: string;
}

export interface UpdateImageInput {
  caption?: string;
  alt_text?: string;
  section?: string;
}

// Document version types
export interface DocumentVersion {
  id: number;
  document_id: number;
  version_number: number;
  content: DocumentContent;
  created_at: string;
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

export interface CreateTemplateInput {
  name: string;
  description?: string;
  content: Partial<DocumentContent>;
  is_system?: boolean;
}

// Session types
export interface Session {
  id: string;
  user_id: number;
  expires_at: string;
  created_at: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Export related types
export type ExportFormat = 'pdf' | 'markdown' | 'html';

export interface ExportOptions {
  format: ExportFormat;
  includeImages?: boolean;
  includeTableOfContents?: boolean;
}

// Authentication types
export interface JWTPayload {
  userId: number;
  email: string;
  isAdmin: boolean;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name?: string;
}

// Request extensions
declare global {
  namespace Express {
    interface Request {
      user?: UserProfile;
    }
  }
}

// Environment variables
export interface Environment {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  DATABASE_PATH: string;
  UPLOAD_PATH: string;
  MAX_FILE_SIZE: number;
  MAX_FILES_PER_DOCUMENT: number;
  ADMIN_EMAIL?: string | undefined;
  REQUIRE_ADMIN_APPROVAL: boolean;
  SMTP_HOST?: string | undefined;
  SMTP_PORT?: number | undefined;
  SMTP_USER?: string | undefined;
  SMTP_PASS?: string | undefined;
}
