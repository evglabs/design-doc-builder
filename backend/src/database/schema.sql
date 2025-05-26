-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  is_admin BOOLEAN DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  theme_preference TEXT DEFAULT 'system',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  owner_id INTEGER NOT NULL REFERENCES users(id),
  content TEXT, -- JSON blob containing all sections
  is_public BOOLEAN DEFAULT 0,
  share_token TEXT UNIQUE, -- for public sharing
  share_expires_at TEXT, -- optional expiration
  template_id INTEGER REFERENCES document_templates(id),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Document versions for history
CREATE TABLE IF NOT EXISTS document_versions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  document_id INTEGER NOT NULL REFERENCES documents(id),
  version_number INTEGER NOT NULL,
  content TEXT, -- JSON snapshot
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Images table
CREATE TABLE IF NOT EXISTS images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  document_id INTEGER NOT NULL REFERENCES documents(id),
  original_filename TEXT NOT NULL,
  stored_filename TEXT NOT NULL, -- UUID-based filename
  file_size INTEGER,
  mime_type TEXT,
  caption TEXT,
  alt_text TEXT,
  section TEXT, -- which section this image belongs to
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Document templates
CREATE TABLE IF NOT EXISTS document_templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  content TEXT, -- JSON template structure
  is_system BOOLEAN DEFAULT 0, -- system vs user-created templates
  created_by INTEGER REFERENCES users(id),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table for auth
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY, -- session token
  user_id INTEGER NOT NULL REFERENCES users(id),
  expires_at TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_documents_owner ON documents(owner_id);
CREATE INDEX IF NOT EXISTS idx_documents_public ON documents(is_public) WHERE is_public = 1;
CREATE INDEX IF NOT EXISTS idx_images_document ON images(document_id);
CREATE INDEX IF NOT EXISTS idx_versions_document ON document_versions(document_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_documents_share_token ON documents(share_token) WHERE share_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active) WHERE is_active = 1;

-- Triggers for updated_at timestamps
CREATE TRIGGER IF NOT EXISTS update_users_timestamp 
  AFTER UPDATE ON users
BEGIN
  UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_documents_timestamp 
  AFTER UPDATE ON documents
BEGIN
  UPDATE documents SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Insert default system templates
INSERT OR IGNORE INTO document_templates (id, name, description, content, is_system) VALUES 
(1, 'Web Application', 'Template for web application development projects', 
'{
  "projectOverview": {
    "purpose": "Create a web application that...",
    "successCriteria": "Application loads in under 2 seconds, handles 100 concurrent users, passes security audit",
    "targetUsers": "End users with basic web browsing experience"
  },
  "technicalRequirements": {
    "language": "JavaScript/TypeScript with Node.js backend, React frontend",
    "dependencies": "Express.js, React, PostgreSQL/MongoDB, authentication library",
    "performance": "Sub-2 second page loads, 99% uptime, mobile responsive",
    "platform": "Web browsers (Chrome, Firefox, Safari, Edge), deployed on cloud platform"
  }
}', 1),

(2, 'CLI Tool', 'Template for command-line tool development', 
'{
  "projectOverview": {
    "purpose": "Create a command-line tool that...",
    "successCriteria": "Tool exits with proper codes, provides helpful error messages, processes files under 1MB in under 5 seconds",
    "targetUsers": "Developers and system administrators with command-line experience"
  },
  "technicalRequirements": {
    "language": "Python 3.9+ or Go 1.19+",
    "dependencies": "CLI framework (Click for Python, Cobra for Go), minimal external dependencies",
    "performance": "Process files up to 100MB within 30 seconds, max 128MB RAM usage",
    "platform": "Cross-platform (Windows, macOS, Linux), single binary distribution"
  }
}', 1),

(3, 'API Service', 'Template for REST API development', 
'{
  "projectOverview": {
    "purpose": "Create a REST API that...",
    "successCriteria": "API responds in under 100ms, handles 1000 concurrent requests, comprehensive error handling",
    "targetUsers": "Frontend developers and mobile app developers integrating with the API"
  },
  "technicalRequirements": {
    "language": "Node.js with TypeScript or Python with FastAPI",
    "dependencies": "Web framework, database ORM, authentication middleware, validation library",
    "performance": "Sub-100ms response times, auto-scaling to handle traffic spikes",
    "platform": "Containerized deployment, compatible with major cloud providers"
  }
}', 1);
