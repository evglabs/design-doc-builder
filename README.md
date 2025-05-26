# Design Document Builder

A lightweight, self-hosted web application for building comprehensive AI coding prompt design documents. Built with Node.js, SQLite, React, and TypeScript.

## Features

- **Guided Document Creation**: Six-section framework for comprehensive design documents
- **Template System**: Pre-built templates for common project types (Web Apps, CLI Tools, APIs)
- **User Management**: Simple authentication with admin controls
- **Image Support**: Upload and manage images with automatic optimization
- **Export Options**: Generate PDF, Markdown, and HTML exports
- **Sharing**: Public sharing with optional expiration dates
- **Version History**: Keep track of document changes (last 5 versions)
- **Dark/Light Theme**: User preference with system detection
- **Auto-save**: Automatic saving every 60 seconds

## Quick Start with Docker

### Prerequisites

- Docker and Docker Compose installed
- At least 2GB RAM and 20GB storage

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd design-doc-builder
```

2. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your preferred settings
```

3. **Start the application:**
```bash
docker-compose up -d
```

4. **Access the application:**
- Open your browser to `http://localhost`
- Register a new account or login

## Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm run install:all
```

2. **Set up environment:**
```bash
cp .env.example .env
```

3. **Start development servers:**
```bash
npm run dev
```

This will start:
- Backend API on `http://localhost:3000`
- Frontend dev server on `http://localhost:5173`

### Project Structure

```
design-doc-builder/
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── database/       # SQLite setup and migrations
│   │   ├── middleware/     # Authentication and validation
│   │   ├── routes/         # API route handlers
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript interfaces
│   │   └── utils/          # Helper functions
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Route-based pages
│   │   ├── services/       # API communication
│   │   ├── stores/         # Zustand state management
│   │   └── types/          # TypeScript interfaces
│   └── package.json
├── docker-compose.yml      # Docker orchestration
├── Dockerfile             # Multi-stage build
└── README.md
```

## Design Document Framework

The application guides users through creating comprehensive design documents with six core sections:

### 1. Project Overview
- **Purpose**: Clear statement of what the program should accomplish
- **Success Criteria**: Measurable outcomes and performance targets
- **Target Users**: Who will use the program and their technical level

### 2. Technical Requirements
- **Language**: Programming language and version constraints
- **Dependencies**: Required libraries, APIs, external services
- **Performance**: Speed, memory, and scalability requirements
- **Platform**: Operating systems and deployment environments

### 3. Functional Specifications
- **Core Features**: Main functionality with acceptance criteria
- **Input/Output**: Data formats and interface requirements
- **User Interface**: CLI arguments, GUI layout, API endpoints
- **Error Handling**: How different error conditions should be managed

### 4. Implementation Guidance
- **Architecture**: Code organization and design patterns
- **Code Style**: Formatting, naming conventions, documentation
- **Testing**: Test types, coverage requirements, frameworks
- **Documentation**: README, API docs, inline comments

### 5. Sample Data & Examples
- **Sample Inputs**: Realistic test data and use cases
- **Expected Outputs**: Exact program responses for given inputs
- **Edge Cases**: Boundary conditions and error scenarios

### 6. Constraints & Limitations
- **Exclusions**: What NOT to include (prevents scope creep)
- **Security**: Data protection and access control requirements
- **Compatibility**: Version requirements and integration needs
- **Resources**: Memory, storage, and processing limits

## API Documentation

### Authentication Endpoints

```
POST /api/auth/login
POST /api/auth/register
GET  /api/auth/me
PUT  /api/auth/profile
POST /api/auth/logout
```

### Document Endpoints

```
GET    /api/documents              # List user's documents
POST   /api/documents              # Create new document
GET    /api/documents/:id          # Get document by ID
PUT    /api/documents/:id          # Update document
DELETE /api/documents/:id          # Delete document
POST   /api/documents/:id/duplicate # Duplicate document
GET    /api/documents/:id/versions # Get version history
POST   /api/documents/:id/export   # Export document
POST   /api/documents/:id/share    # Generate share link
```

### Template Endpoints

```
GET  /api/templates               # List available templates
POST /api/templates               # Create template from document
GET  /api/templates/:id           # Get template by ID
```

## Configuration

### Environment Variables

```bash
# Application
NODE_ENV=production
PORT=3000

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# Database
DATABASE_PATH=./database/app.db

# File uploads
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
MAX_FILES_PER_DOCUMENT=20

# Admin settings
ADMIN_EMAIL=admin@yourdomain.com
REQUIRE_ADMIN_APPROVAL=false

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Deployment

### Docker Production Deployment

1. **Update environment variables** in `.env` for production
2. **Configure SSL** (recommended) by mounting certificates
3. **Set up reverse proxy** (nginx configuration included)
4. **Run the application:**

```bash
docker-compose up -d
```

### Manual Deployment

1. **Build the application:**
```bash
npm run build
```

2. **Start the server:**
```bash
npm start
```

### Backup and Maintenance

**Automated Backup:**
```bash
# Backup script runs daily via cron
./backup.sh
```

**Manual Backup:**
```bash
tar -czf backup.tar.gz database/ uploads/ .env
```

**Restore:**
```bash
tar -xzf backup.tar.gz
docker-compose restart
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Commit your changes: `git commit -am 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Check the [Issues](https://github.com/yourorg/design-doc-builder/issues) page
- Create a new issue with detailed information
- Include logs and environment details

## Roadmap

- [ ] Real-time collaborative editing
- [ ] Advanced export templates
- [ ] Integration with popular development tools
- [ ] Advanced admin analytics
- [ ] Mobile-responsive improvements
- [ ] Plugin system for custom sections
