import { Environment } from '../types';

export function loadEnvironment(): Environment {
  return {
    NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
    PORT: parseInt(process.env.PORT || '3000', 10),
    JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
    DATABASE_PATH: process.env.DATABASE_PATH || './database/app.db',
    UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads',
    MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB
    MAX_FILES_PER_DOCUMENT: parseInt(process.env.MAX_FILES_PER_DOCUMENT || '20', 10),
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    REQUIRE_ADMIN_APPROVAL: process.env.REQUIRE_ADMIN_APPROVAL === 'true',
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
  };
}

export const DOCUMENT_SECTIONS = [
  'projectOverview',
  'technicalRequirements', 
  'functionalSpecifications',
  'implementationGuidance',
  'sampleData',
  'constraints'
] as const;

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png', 
  'image/gif',
  'image/webp'
] as const;

export const EXPORT_FORMATS = ['pdf', 'markdown', 'html'] as const;

export const DEFAULT_DOCUMENT_CONTENT = {
  sections: {},
  metadata: {
    version: '1.0',
    lastModified: new Date().toISOString(),
    completeness: 0,
    qualityScore: 0
  }
};
