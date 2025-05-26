# Complete Design Document Builder - Specification & Guide

*The Complete Reference for AI Coding Prompt Design Documents and Implementation*

---

## Table of Contents

1. [Introduction to Design Documents](#introduction-to-design-documents)
2. [Design Document Framework](#design-document-framework)
3. [Application Technical Specification](#application-technical-specification)
4. [Implementation Guide](#implementation-guide)
5. [Deployment & Maintenance](#deployment--maintenance)
6. [User Guide](#user-guide)

---

## Introduction to Design Documents

### What Are Design Documents for AI Coding?

A design document for AI coding is a structured specification that provides all the context, requirements, and examples an AI assistant needs to generate high-quality code that meets your exact needs. Think of it as a detailed blueprint that eliminates ambiguity and reduces the number of iterations needed to get working code.

### Why Design Documents Matter

**Without a design document:**
- AI generates generic solutions that don't fit your specific needs
- Multiple back-and-forth iterations to clarify requirements
- Missing edge cases and error handling
- Code that works but doesn't follow your standards or architecture

**With a comprehensive design document:**
- AI understands your exact requirements from the start
- Generated code includes proper error handling and edge cases
- Output follows your coding standards and architectural preferences
- Significantly fewer revisions needed

### Core Principles

**Clarity Over Brevity**: Be explicit rather than assuming the AI will infer your intentions. Detailed specifications prevent misunderstandings and reduce iterations.

**Progressive Disclosure**: Start with high-level requirements, then drill down into specifics. This helps the AI understand context before diving into implementation details.

**Concrete Examples**: Include sample inputs, outputs, and edge cases. Examples are often clearer than abstract descriptions.

---

## Design Document Framework

### Document Structure Overview

A comprehensive AI coding design document should include six core sections:

1. **Project Overview** - Purpose, success criteria, target users
2. **Technical Requirements** - Languages, dependencies, performance needs
3. **Functional Specifications** - Features, I/O, interface requirements
4. **Implementation Guidance** - Architecture, code style, testing
5. **Sample Data & Examples** - Realistic inputs, outputs, edge cases
6. **Constraints & Limitations** - What to avoid, security, compatibility

### Section 1: Project Overview

**Purpose Statement**
- Clearly articulate what the program should accomplish in 1-2 sentences
- Focus on the core functionality and primary value proposition
- Be specific about the problem being solved

**Success Criteria**
- Define what "done" looks like with measurable outcomes
- Include specific metrics, performance targets, or behaviors
- Specify exit codes, response times, or other quantifiable results

**Target Users**
- Specify who will use this program and their technical level
- Include context about their workflow and environment
- Consider both primary and secondary user types

**Example:**
```
Purpose: Create a command-line tool that validates JSON files against custom schemas
Success: Tool exits with code 0 for valid files, code 1 for invalid files, with clear error messages under 100ms
Target Users: DevOps engineers with intermediate command-line experience who need fast validation in CI/CD pipelines
```

### Section 2: Technical Requirements

**Programming Language & Version**
- Specify exact versions when compatibility matters
- Include justification for language choice if relevant
- Consider runtime requirements and compatibility

**Dependencies & External Libraries**
- List required libraries with version constraints
- Include APIs, external services, or system dependencies
- Specify if certain dependencies should be avoided

**Performance Requirements**
- Define speed, memory, and scalability expectations
- Include specific benchmarks or acceptable limits
- Consider concurrent usage and resource constraints

**Platform & Environment**
- Specify operating systems and runtime environments
- Include deployment targets and infrastructure needs
- Consider compatibility requirements

**Example:**
```
Language: Python 3.9+ (for walrus operator and typing improvements)
Dependencies: jsonschema 4.0+, click 8.0+ for CLI, no pandas (too heavy)
Performance: Process files up to 100MB within 30 seconds, max 128MB RAM usage
Platform: Cross-platform (Windows, macOS, Linux), containerizable
```

### Section 3: Functional Specifications

**Core Features**
- List primary functionality with clear acceptance criteria
- Break down complex features into testable components
- Prioritize features if not all are essential

**Input/Output Specifications**
- Define data formats, file types, and expected responses
- Include API specifications if relevant
- Specify validation requirements and error responses

**User Interface Requirements**
- For CLI tools: specify argument structure and help text
- For GUIs: describe layout, interactions, and user flow
- For APIs: define endpoint structure and response format

**Error Handling**
- Specify how different error conditions should be handled
- Define error message format and helpful guidance
- Include logging and debugging requirements

**Example:**
```
Core Features:
- Validate single JSON files against schema files
- Batch validate multiple files in a directory  
- Generate detailed validation reports with line numbers

CLI Interface:
- `validate --schema schema.json file.json` (single file)
- `validate --schema schema.json --batch /path/to/files/` (batch mode)
- `--verbose` flag for detailed output
- `--format json|text|csv` for output format

Error Handling:
- File not found: Exit code 2 with helpful message
- Invalid JSON: Show line/column of syntax error
- Schema violations: List all validation failures with context
```

### Section 4: Implementation Guidance

**Architecture & Design Patterns**
- Specify preferred code organization and structure
- Recommend design patterns or architectural approaches
- Include modularization and separation of concerns

**Code Style & Standards**
- Reference specific style guides or provide formatting rules
- Specify naming conventions and documentation requirements
- Include type annotation and code organization preferences

**Testing Requirements**  
- Specify what types of tests should be included
- Define testing frameworks and coverage expectations
- Include specific test scenarios or edge cases

**Documentation Needs**
- Specify what documentation should be generated
- Include README requirements and code comments
- Define API documentation format if applicable

**Example:**
```
Architecture:
- Use modular design with separate validator, reporter, and CLI modules
- Implement Command pattern for different validation types
- Keep business logic separate from CLI interface

Code Style: 
- Follow PEP 8 with 88-character line length
- Use type hints for all function parameters and returns
- Include docstrings following Google format

Testing: 
- Include unit tests for core validation functions
- Integration tests for CLI interface
- Test with malformed JSON and edge case schemas
- Minimum 80% code coverage

Documentation:
- README with installation and usage examples
- API documentation for validation functions
- Contributing guide with development setup
```

### Section 5: Sample Data & Examples

**Sample Inputs**
- Provide realistic sample data representing typical use cases
- Include various complexity levels and data types
- Show both valid and invalid examples

**Expected Outputs**
- Show exactly what the program should produce for given inputs
- Include success cases, error cases, and edge cases
- Specify output format and structure

**Edge Cases & Error Scenarios**
- Include boundary conditions and unusual inputs
- Cover error scenarios and recovery behavior
- Test malformed data and system limitations

**Example:**
```
Sample Valid JSON:
{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "preferences": {
    "theme": "dark",
    "notifications": true
  }
}

Sample Schema:
{
  "type": "object",
  "required": ["name", "age"],
  "properties": {
    "name": {"type": "string", "minLength": 1},
    "age": {"type": "integer", "minimum": 0, "maximum": 150},
    "email": {"type": "string", "format": "email"}
  }
}

Expected Success Output:
✓ user.json is valid (validated in 12ms)

Expected Error Output:
✗ user.json is invalid:
  Line 3: Missing required field: 'name'
  Line 4: Field 'age' must be an integer (got string)
  Line 5: Invalid email format

Edge Cases:
- Empty JSON file: Should show clear "empty file" error
- 100MB JSON file: Should process without memory issues
- Circular references in schema: Should detect and report
- Unicode characters: Should handle UTF-8 properly
```

### Section 6: Constraints & Limitations

**What NOT to Include**
- Explicitly state features or approaches to avoid
- Prevent scope creep by defining boundaries
- Clarify what problems you're NOT trying to solve

**Security Considerations**
- Highlight security requirements or restrictions
- Specify data handling and privacy requirements
- Include authentication or authorization needs

**Compatibility Requirements**
- Specify version compatibility needs
- Define backward compatibility requirements
- Include integration constraints

**Resource Limitations**
- Note memory, storage, or processing constraints
- Define acceptable resource usage limits
- Consider deployment environment limitations

**Example:**
```
What NOT to Include:
- Schema generation or inference tools (out of scope)
- JSON editing or transformation features
- Web interface (CLI only)
- Support for YAML or other formats

Security:
- Do not execute or eval any JSON content
- Validate file paths to prevent directory traversal
- No network requests or external data fetching

Compatibility:
- Must work with Python 3.9+ (no earlier versions)
- Schema must be JSON Schema Draft 7 or later
- No dependency on specific operating system features

Resource Limits:
- Maximum file size: 100MB
- Maximum memory usage: 256MB
- Should complete validation within 60 seconds
```

---

## Application Technical Specification

### Project Overview

**Purpose Statement:** Create a lightweight, self-hosted web application that allows a small team (5-20 users) to collaboratively build comprehensive design documents for AI coding prompts, with support for image uploads, PDF export, and simple user management.

**Success Criteria:**
- Deploy with single `docker-compose up` command
- Support 5-20 concurrent users comfortably on modest hardware (2GB RAM)
- Generate PDF exports with embedded images under 25MB
- Maintain user data safely with automated backups
- Require minimal ongoing maintenance (monthly updates at most)
- Light/dark theme support with user preference persistence

**Target Users:**
- **Primary**: Small development teams, indie developers, consultants
- **Secondary**: Freelancers and small agencies creating AI specifications
- **Technical Level**: Users comfortable with basic Docker commands for deployment

### Technical Requirements

**Programming Language & Version:**
- **Backend**: Node.js 18+ with TypeScript
- **Frontend**: React 18+ with TypeScript, Vite for build tooling
- **Database**: SQLite with better-sqlite3 (file-based, zero maintenance)

**Core Dependencies:**
```
Backend:
- Express.js 4.18+ (web framework)
- better-sqlite3 (embedded database)
- bcrypt (password hashing)
- jsonwebtoken (authentication)
- multer (file uploads)
- puppeteer (PDF generation)
- sharp (image processing and optimization)
- helmet (basic security headers)
- express-rate-limit (basic rate limiting)

Frontend:
- React Router 6+ (navigation)
- Tailwind CSS (styling without complex components)
- React Hook Form (form handling with validation)
- Zustand (lightweight state management)
- React Query/TanStack Query (data fetching and caching)
- Lucide React (icons)
- React Hot Toast (notifications)
```

**Performance Requirements:**
- **Response Time**: < 500ms for form saves, < 2 minutes for PDF generation
- **File Upload**: Support images up to 5MB each, max 20 images per document
- **Concurrent Users**: Handle 20 simultaneous users on 2GB RAM server
- **Database Performance**: SQLite with proper indexing for sub-100ms queries
- **Image Processing**: Automatic WebP conversion and resizing for optimization

**Platform & Environment:**
- **Deployment**: Single Docker Compose stack with multi-stage builds
- **Reverse Proxy**: Compatible with nginx, Apache, or Traefik
- **Hardware**: Runs on Raspberry Pi 4+ or basic VPS (2GB RAM, 20GB storage)
- **File Storage**: Local filesystem with organized directory structure
- **Backup**: Simple file-based backups (database + images folder)

### Functional Specifications

**Core Features:**

*User Management & Authentication:*
- Email/password registration with optional admin approval
- Simple session management with configurable timeout
- Basic admin panel to manage users (activate/deactivate)
- Password reset via email (optional, can be admin-managed)
- User profiles with basic settings (theme preference, name)

*Document Creation & Editing:*
- Six-section guided document builder following the framework above
- Individual document ownership with optional public sharing
- Auto-save every 60 seconds with visual indicators
- Simple version history (keep last 5 versions per document)
- Document templates for common project types
- Document duplication and fork functionality

*Image Management:*
- Drag-and-drop image upload with progress indicators
- Automatic image optimization (WebP conversion, resizing)
- Image gallery with caption and alt-text support
- Organize images by document with proper cleanup on deletion
- Support for JPEG, PNG, GIF, WebP formats

*Export & Sharing:*
- PDF export with embedded images and professional formatting
- Markdown export with local image references
- HTML export for web viewing or printing
- Public sharing via secure generated links with optional expiration
- Bulk export of multiple documents

*Theme System:*
- Light and dark theme with smooth transitions
- System preference auto-detection
- Per-user theme persistence
- High contrast accessibility options

**Database Schema (SQLite):**
```sql
-- Users table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  is_admin BOOLEAN DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  theme_preference TEXT DEFAULT 'system', -- 'light', 'dark', 'system'
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Documents table
CREATE TABLE documents (
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
CREATE TABLE document_versions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  document_id INTEGER NOT NULL REFERENCES documents(id),
  version_number INTEGER NOT NULL,
  content TEXT, -- JSON snapshot
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Images table
CREATE TABLE images (
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
CREATE TABLE document_templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  content TEXT, -- JSON template structure
  is_system BOOLEAN DEFAULT 0, -- system vs user-created templates
  created_by INTEGER REFERENCES users(id),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table for auth
CREATE TABLE sessions (
  id TEXT PRIMARY KEY, -- session token
  user_id INTEGER NOT NULL REFERENCES users(id),
  expires_at TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_documents_owner ON documents(owner_id);
CREATE INDEX idx_documents_public ON documents(is_public) WHERE is_public = 1;
CREATE INDEX idx_images_document ON images(document_id);
CREATE INDEX idx_versions_document ON document_versions(document_id);
CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);
```

**API Endpoints:**
```
Authentication:
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/register
GET /api/auth/me
PUT /api/auth/profile

Documents:
GET /api/documents (list user's documents)
POST /api/documents (create new document)
GET /api/documents/:id
PUT /api/documents/:id (update document)
DELETE /api/documents/:id
POST /api/documents/:id/duplicate
GET /api/documents/:id/versions
POST /api/documents/:id/export (PDF/Markdown/HTML)
POST /api/documents/:id/share (generate share link)

Images:
POST /api/documents/:id/images (upload image)
PUT /api/images/:id (update caption/alt-text)
DELETE /api/images/:id

Templates:
GET /api/templates (list available templates)
POST /api/templates (create template from document)
GET /api/templates/:id

Admin:
GET /api/admin/users
PUT /api/admin/users/:id/toggle (activate/deactivate)
DELETE /api/admin/users/:id
GET /api/admin/stats (basic usage statistics)

Public:
GET /api/public/:shareToken (view shared document)
```

**User Interface Requirements:**

*Application Layout:*
- Responsive single-page application
- Collapsible sidebar navigation for sections
- Main content area with tabbed editing interface
- Header with user menu, theme toggle, and save status
- Toast notifications for feedback and errors

*Document Editor Interface:*
- Six-section navigation with completion indicators
- Rich text areas with basic formatting (bold, italic, lists)
- Image upload zones with drag-and-drop support
- Auto-resize textareas with minimum heights
- Real-time character counts for long fields
- Form validation with inline error messages

*Theme Implementation:*
- CSS custom properties for theme variables
- Smooth color transitions between themes
- System preference detection via `prefers-color-scheme`
- Theme persistence in user database
- High contrast mode support

*Export Interface:*
- Export modal with format selection (PDF/Markdown/HTML)
- Preview option before final export
- Progress indicator for PDF generation
- Download handling with proper filenames

**Error Handling:**

*Client-Side Error Handling:*
- Network connectivity: Offline detection with retry queue
- Form validation: Real-time validation with helpful messages
- File upload failures: Retry mechanism with size/format guidance
- Authentication timeouts: Automatic token refresh

*Server-Side Error Handling:*
- Database errors: Graceful degradation with user-friendly messages
- File system errors: Proper cleanup and error reporting
- PDF generation failures: Fallback to other export formats
- Rate limiting: Clear messaging about limits and retry timing

*Image Processing Errors:*
- Unsupported formats: Clear format requirements
- File size limits: Compression suggestions
- Corrupted files: Validation and rejection with helpful message

### Implementation Guidance

**Project Structure:**
```
design-doc-builder/
├── backend/
│   ├── src/
│   │   ├── routes/           # Express route handlers
│   │   ├── middleware/       # Auth, validation, error handling
│   │   ├── services/         # Business logic (documents, users, export)
│   │   ├── database/         # SQLite connection and migrations
│   │   ├── utils/           # Helper functions
│   │   └── types/           # TypeScript type definitions
│   ├── uploads/             # Image storage directory
│   ├── database/            # SQLite database file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route-based page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API communication layer
│   │   ├── stores/          # Zustand state management
│   │   ├── utils/           # Helper functions and constants
│   │   └── types/           # TypeScript interfaces
│   ├── public/              # Static assets
│   └── package.json
├── docker-compose.yml
├── Dockerfile
├── nginx.conf
└── README.md
```

**Architecture & Design Patterns:**

*Backend Architecture:*
- **MVC Pattern**: Clear separation of routes, services, and data access
- **Service Layer**: Business logic isolated from HTTP handling
- **Repository Pattern**: Database operations abstracted behind interfaces
- **Middleware Chain**: Authentication, validation, and error handling
- **File Organization**: Feature-based modules with clear dependencies

*Frontend Architecture:*
- **Component Composition**: Small, focused components with clear props
- **Custom Hooks**: Business logic extracted from components
- **Service Layer**: API calls centralized with proper error handling
- **State Management**: Zustand for global state, React Query for server state
- **Route-Based Code Splitting**: Lazy loading for better performance

*Database Design Principles:*
- **Normalized Structure**: Proper foreign keys and relationships
- **Indexed Queries**: Performance optimization for common operations
- **JSON Storage**: Flexible document content with SQLite JSON functions
- **Soft Deletes**: Keep audit trail for deleted documents
- **Migration Support**: Schema versioning for future updates

**Code Style & Standards:**

*TypeScript Configuration:*
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true
  }
}
```

*ESLint + Prettier Setup:*
- Airbnb TypeScript config as base
- Prettier integration for consistent formatting
- Import sorting and organization rules
- React hooks exhaustive deps checking
- No console.log in production builds

*Component Standards:*
```typescript
// Standard component structure
interface ComponentProps {
  required: string;
  optional?: number;
  children?: React.ReactNode;
}

export const Component: React.FC<ComponentProps> = ({
  required,
  optional = 0,
  children
}) => {
  // Custom hooks first
  const { data, loading } = useQuery();
  
  // Event handlers
  const handleClick = useCallback(() => {
    // Implementation
  }, [dependencies]);
  
  // Early returns
  if (loading) return <LoadingSpinner />;
  
  // Main render
  return (
    <div className="component-container">
      {children}
    </div>
  );
};
```

**Testing Requirements:**

*Backend Testing:*
- **Unit Tests**: Jest for service layer and utility functions
- **Integration Tests**: API endpoint testing with supertest
- **Database Tests**: In-memory SQLite for fast test execution
- **File Upload Tests**: Mock multer and test image processing
- **Authentication Tests**: JWT token generation and validation

*Frontend Testing:*
- **Component Tests**: React Testing Library for UI interactions
- **Hook Tests**: Testing custom hooks with renderHook
- **Integration Tests**: User flow testing with MSW for API mocking
- **Accessibility Tests**: Basic a11y testing with jest-axe
- **Visual Tests**: Screenshot testing for theme consistency

*Testing Strategy:*
- **50% Coverage Target**: Focus on critical paths and edge cases
- **Manual Testing Checklist**: Document key user flows for manual verification
- **Cross-Browser Testing**: Ensure compatibility with target browsers
- **Performance Testing**: Basic load testing for expected user counts

**Documentation Standards:**

*Code Documentation:*
- **JSDoc Comments**: All public functions and complex logic
- **README Files**: Setup, development, and deployment instructions
- **API Documentation**: OpenAPI spec for backend endpoints
- **Component Documentation**: Storybook for UI component library

*User Documentation:*
- **Getting Started Guide**: Step-by-step setup for non-technical users
- **User Manual**: Feature overview with screenshots
- **Admin Guide**: User management and maintenance procedures
- **Troubleshooting**: Common issues and solutions

---

## Deployment & Maintenance

### Quick Start Deployment

**Prerequisites:**
- Docker and Docker Compose installed
- Basic understanding of environment variables
- Domain name or local network access

**Step-by-Step Setup:**

1. **Clone and Configure:**
```bash
git clone https://github.com/yourorg/design-doc-builder
cd design-doc-builder
cp .env.example .env
```

2. **Edit Environment Variables:**
```bash
# .env file
NODE_ENV=production
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# Database
DATABASE_PATH=./database/app.db

# File uploads
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880  # 5MB in bytes
MAX_FILES_PER_DOCUMENT=20

# Admin settings
ADMIN_EMAIL=admin@yourdomain.com
REQUIRE_ADMIN_APPROVAL=false

# Email (optional, for password resets)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

3. **Deploy with Docker Compose:**
```bash
docker-compose up -d
```

4. **Create Admin User:**
```bash
docker-compose exec app npm run create-admin
# Follow prompts to create first admin user
```

5. **Access Application:**
- Open browser to `http://localhost` (or your domain)
- Login with admin credentials
- Start creating design documents!

**Docker Compose Configuration:**
```yaml
version: '3.8'

services:
  app:
    build: 
      context: .
      dockerfile: Dockerfile
      target: production
    container_name: design-doc-builder
    ports:
      - "3000:3000"
    volumes:
      - ./database:/app/database
      - ./uploads:/app/uploads
      - ./backups:/app/backups
    environment:
      - NODE_ENV=production
    env_file:
      - .env
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    container_name: design-doc-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro  # If using SSL certificates
    depends_on:
      - app
    restart: unless-stopped

volumes:
  database:
  uploads:
  backups:
```

**Nginx Configuration:**
```nginx
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3000;
    }
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/m;
    limit_req_zone $binary_remote_addr zone=upload:10m rate=2r/m;
    
    server {
        listen 80;
        server_name yourdomain.com;
        
        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        
        # Main application
        location / {
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
            
            # Apply rate limiting to API routes
            location /api/ {
                limit_req zone=api burst=20 nodelay;
                proxy_pass http://app;
            }
            
            # Special handling for file uploads
            location /api/documents/*/images {
                limit_req zone=upload burst=5 nodelay;
                client_max_body_size 10M;
                proxy_pass http://app;
                proxy_request_buffering off;
            }
        }
        
        # Serve uploaded images directly (optional optimization)
        location /uploads/ {
            alias /path/to/uploads/;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

### Backup Strategy

**Automated Backup Script:**
```bash
#!/bin/bash
# backup.sh - Automated backup script

BACKUP_DIR="/app/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="design-docs-backup_${DATE}"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup database and uploads
tar -czf "$BACKUP_DIR/${BACKUP_NAME}.tar.gz" \
    -C /app \
    database/ \
    uploads/ \
    .env \
    --exclude="*.log"

# Keep only last 7 days of backups
find "$BACKUP_DIR" -name "design-docs-backup_*.tar.gz" -mtime +7 -delete

echo "Backup completed: ${BACKUP_NAME}.tar.gz"
echo "Backup size: $(du -h "$BACKUP_DIR/${BACKUP_NAME}.tar.gz" | cut -f1)"
```

**Cron Job Setup:**
```bash
# Run backup daily at 2 AM
0 2 * * * /app/backup.sh >> /var/log/backup.log 2>&1
```

**Restore Procedure:**
```bash
#!/bin/bash
# restore.sh - Restore from backup

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup-file.tar.gz>"
    exit 1
fi

# Stop the application
docker-compose down

# Extract backup
tar -xzf "$BACKUP_FILE" -C /app/

# Restart application
docker-compose up -d

echo "Restore completed from: $BACKUP_FILE"
```

### Maintenance Tasks

**Weekly Tasks:**
- Check disk space usage: `df -h`
- Review application logs: `docker-compose logs --tail=100 app`
- Verify backup completion: `ls -la backups/`
- Check for security updates: `docker-compose pull`

**Monthly Tasks:**
- Update Docker images: `docker-compose pull && docker-compose up -d`
- Clean up old images: `docker image prune -a`
- Review user accounts and remove inactive users
- Check database size and performance: `sqlite3 database/app.db ".schema"`

**Quarterly Tasks:**
- Review and update SSL certificates
- Audit user permissions and admin accounts
- Test backup and restore procedures
- Review application metrics and performance

**Monitoring Script:**
```bash
#!/bin/bash
# monitor.sh - Basic health monitoring

# Check if application is responding
if ! curl -f http://localhost:3000/api/health >/dev/null 2>&1; then
    echo "Application not responding - restarting..."
    docker-compose restart app
fi

# Check disk space
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 85 ]; then
    echo "Warning: Disk usage is ${DISK_USAGE}%"
fi

# Check database size
DB_SIZE=$(du -sh database/app.db | cut -f1)
echo "Database size: $DB_SIZE"

# Check upload directory size  
UPLOAD_SIZE=$(du -sh uploads/ | cut -f1)
echo "Upload directory size: $UPLOAD_SIZE"
```

### Security Considerations

**Basic Security Measures:**
- **HTTPS Enforcement**: Use SSL certificates (Let's Encrypt recommended)
- **Rate Limiting**: Prevent abuse with nginx rate limiting
- **File Upload Security**: Validate file types and scan for malware
- **Input Validation**: Sanitize all user inputs on backend
- **Session Security**: Secure JWT tokens with proper expiration

**Security Headers:**
```nginx
# Additional security headers for nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:";
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

**Database Security:**
- Regular SQLite database backups with integrity checks
- File permissions: `chmod 600 database/app.db`
- No direct database access from web interface
- Prepared statements to prevent SQL injection

---

## User Guide

### Getting Started

**Creating Your First Design Document:**

1. **Register/Login:**
   - Navigate to your deployed application
   - Click "Register" if you're a new user
   - Fill in email and password (admin approval may be required)
   - Login with your credentials

2. **Create New Document:**
   - Click "New Document" button
   - Enter a descriptive title
   - Choose a template or start blank
   - Begin filling out sections

3. **Working with Sections:**
   - Use sidebar navigation to jump between sections
   - Green checkmarks indicate completed sections
   - Progress bar shows overall completion
   - Auto-save happens every 60 seconds

### Document Sections Guide

**Section 1: Project Overview**
- **Purpose**: What your program should do (be specific!)
- **Success Criteria**: How you'll know it works (measurable outcomes)
- **Target Users**: Who will use it and their skill level

*Example:*
```
Purpose: Create a REST API that manages user authentication and session handling
Success: API responds in <100ms, handles 1000 concurrent users, passes security audit
Users: Frontend developers integrating with mobile and web applications
```

**Section 2: Technical Requirements**
- **Language**: Programming language and version constraints
- **Dependencies**: Required libraries, APIs, external services
- **Performance**: Speed, memory, scalability requirements
- **Platform**: Operating systems, deployment environments

**Section 3: Functional Specifications**
- **Core Features**: Main functionality with acceptance criteria
- **Input/Output**: Data formats, API specifications
- **User Interface**: CLI args, GUI layout, API endpoints
- **Error Handling**: How errors should be managed and reported

**Section 4: Implementation Guidance**
- **Architecture**: Code organization, design patterns
- **Code Style**: Formatting, naming conventions, documentation
- **Testing**: Test types, coverage requirements
- **Documentation**: README, API docs, comments

**Section 5: Sample Data & Examples**
- **Sample Inputs**: Realistic test data and use cases
- **Expected Outputs**: Exact program responses
- **Edge Cases**: Boundary conditions, error scenarios

**Section 6: Constraints & Limitations**
- **Exclusions**: What NOT to include (prevent scope creep)
- **Security**: Data protection, access control requirements
- **Compatibility**: Version requirements, integration needs
- **Resources**: Memory, storage, processing limits

### Working with Images

**Adding Images:**
1. Navigate to any section
2. Click the image upload area or drag files directly
3. Images are automatically optimized (converted to WebP, resized)
4. Add captions and alt-text for accessibility
5. Images appear in final exported documents

**Managing Images:**
- View all document images in the gallery
- Edit captions and alt-text after upload
- Delete unused images to save space
- Images are organized by document automatically

### Exporting Documents

**PDF Export:**
- Click "Export" button in sidebar
- Select "PDF" format
- Wait for generation (may take 1-2 minutes for large documents)
- Professional formatting with embedded images
- Table of contents and page numbers included

**Markdown Export:**
- Exports plain text with formatting
- Images saved as separate files
- Perfect for version control systems
- Can be edited in any text editor

**HTML Export:**
- Web-ready version for sharing
- Includes styling and images
- Can be hosted on any web server
- Print-friendly CSS included

### Sharing Documents

**Public Sharing:**
1. Open document you want to share
2. Click "Share" button
3. Enable public sharing
4. Copy the generated link
5. Set optional expiration date
6. Share link with anyone (no login required)

**Team Collaboration:**
- Documents are private by default
- Share edit access via user management
- No real-time collaborative editing (by design for simplicity)
- Use version history to track changes

### Tips for Better Design Documents

**Be Specific:**
- Instead of "fast performance" → "responds in under 100ms"
- Instead of "user-friendly" → "CLI with --help and error guidance"
- Instead of "handles errors well" → "shows line numbers for JSON syntax errors"

**Include Examples:**
- Provide sample inputs and outputs
- Show both success and error cases
- Include edge cases and boundary conditions
- Use realistic data, not toy examples

**Think About Edge Cases:**
- What happens with empty inputs?
- How should the program handle network failures?
- What about extremely large files or data?
- How should concurrent usage be managed?

**Specify What NOT to Do:**
- Explicitly exclude features to prevent scope creep
- Mention security considerations and limitations
- Define resource constraints and boundaries
- Clarify integration requirements and restrictions

### Troubleshooting

**Common Issues:**

*Can't Upload Images:*
- Check file size (max 5MB per image)
- Ensure file type is supported (JPEG, PNG, GIF, WebP)
- Try refreshing page if upload seems stuck
- Contact admin if persistent issues

*PDF Export Fails:*
- Large documents may take 2+ minutes to generate
- Try exporting without images first
- Reduce image count or sizes
- Check browser console for error messages

*Lost Work:*
- Auto-save happens every 60 seconds
- Check version history for recent saves
- Contact admin for database recovery if needed

*Performance Issues:*
- Clear browser cache and cookies
- Close other browser tabs/applications
- Check network connection stability
- Report persistent slowness to admin

---

This complete specification provides everything needed to understand, build, deploy, and maintain the Design Document Builder application. The document serves both as a comprehensive guide to effective AI coding prompts and as the technical specification for building the tool that creates them.
