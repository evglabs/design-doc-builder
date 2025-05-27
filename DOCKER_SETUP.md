# Docker Setup Guide

This guide explains how to run the Design Document Builder using Docker.

## 🐳 Docker Configuration Overview

The application uses a simplified single-container setup:
- **app**: Main application container (frontend + backend combined)
- **volumes**: Persistent storage for database, uploads, and backups

## 📋 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+

## 🚀 Quick Start

### **Option 1: Background Mode**
```bash
# Build and run in background
docker-compose up -d --build
```

### **Option 2: With Live Logs**
```bash
# Build and run with live log output
docker-compose up --build
```

### **Option 3: Just Build**
```bash
# Build the container only
docker-compose build
```

**Access at**: http://localhost:3000

## 🔧 Environment Configuration

### **Production Environment**
The Docker setup uses `.env.production` by default. Key settings:

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=change-this-super-secret-jwt-key-in-production
DATABASE_PATH=/app/database/app.db
UPLOAD_PATH=/app/uploads
```

### **⚠️ Security Warning**
**IMPORTANT**: Change the JWT_SECRET in `.env.production` before deploying:
```bash
# Generate a secure JWT secret
openssl rand -base64 32
```

## 📁 Data Persistence

Docker volumes ensure data persists across container restarts:

- **Database**: `./database` → `/app/database`
- **Uploads**: `./uploads` → `/app/uploads`  
- **Backups**: `./backups` → `/app/backups`

## 🌐 Network Configuration

### **Ports**
- **App Container**: Port 3000 (exposed to host)

### **URLs**
- **Application**: http://localhost:3000
- **API Health Check**: http://localhost:3000/api/health

## 🛠 Build Process

The Dockerfile uses multi-stage builds:

1. **Frontend Build**: Compiles React/TypeScript to static files
2. **Backend Build**: Compiles TypeScript to JavaScript
3. **Production Runtime**: Installs only production dependencies
4. **Final Image**: Combines built frontend and backend with optimized Node.js runtime

## 📊 Monitoring & Health Checks

### **Built-in Health Checks**
```bash
# Check application health
curl http://localhost:3000/api/health

# View container status
docker-compose ps

# View logs
docker-compose logs app
```

### **Container Status**
```bash
# Show running containers
docker ps

# Show resource usage
docker stats
```

## 🔄 Common Operations

### **Start Services**
```bash
docker-compose up -d          # Background mode
docker-compose up --build     # Rebuild and start
```

### **Stop Services**
```bash
docker-compose down           # Stop containers
docker-compose down -v        # Stop and remove volumes (⚠️ deletes data)
```

### **Update Application**
```bash
# Pull latest code and rebuild
git pull
docker-compose down
docker-compose up --build
```

### **View Logs**
```bash
docker-compose logs -f app    # Follow app logs
docker-compose logs app       # View recent logs
```

### **Database Operations**
```bash
# Backup database
docker-compose exec app cp /app/database/app.db /app/backups/backup-$(date +%Y%m%d).db

# Access database files
ls -la ./database/

# Connect to container shell
docker-compose exec app sh
```

## 🔍 Troubleshooting

### **Container Won't Start**
```bash
# Check logs for errors
docker-compose logs app

# Verify environment file
cat .env.production

# Check port conflicts
netstat -tulpn | grep :3000
```

### **Permission Issues**
```bash
# Fix volume permissions
sudo chown -R $USER:$USER ./database ./uploads ./backups
chmod 755 ./database ./uploads ./backups
```

### **Build Failures**
```bash
# Clean build cache
docker system prune -a

# Rebuild from scratch
docker-compose build --no-cache
```

### **Application Issues**
```bash
# Check container health
docker-compose exec app curl -f http://localhost:3000/api/health

# Inspect container
docker-compose exec app ps aux
docker-compose exec app ls -la /app
```

## 🏗 Development vs Production

### **Development** (Use ./start-dev.sh)
- Hot reload enabled
- Source maps available
- Debug logging
- Direct file mounting
- Frontend: http://localhost:5174
- Backend: http://localhost:3000

### **Production** (Use Docker)
- Optimized builds
- Security hardening
- Combined frontend + backend
- Health monitoring
- Single URL: http://localhost:3000

## 📈 Performance Tuning

### **Resource Limits**
Add to docker-compose.yml:
```yaml
services:
  app:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'
```

### **Application Optimizations**
The production build includes:
- Minified frontend assets
- Tree-shaken JavaScript bundles
- Optimized images and fonts
- Gzip compression via Express
- Static file caching

## 🔐 Adding SSL/HTTPS (Optional)

Since nginx is removed, you have several options for SSL:

### **Option 1: External Reverse Proxy**
Use an external nginx, Apache, or cloud load balancer to handle SSL and proxy to http://localhost:3000

### **Option 2: Add SSL to Express**
Modify the backend to handle SSL certificates directly (requires code changes)

### **Option 3: Use Docker with SSL Termination**
Add a separate nginx container or use a service like Traefik

## 🚨 Important Notes

1. **First Run**: Database will be created automatically
2. **Persistence**: Data survives container restarts via volumes
3. **Security**: Change default JWT_SECRET before production use
4. **Port**: Ensure port 3000 is available
5. **Resources**: Monitor disk space for database and uploads
6. **Single Container**: Frontend and backend run in the same container
7. **Direct Access**: No reverse proxy - direct connection to application

## 📝 Simplified Commands

```bash
# Start the application
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop the application
docker-compose down

# Full restart with rebuild
docker-compose down && docker-compose up --build
```

---

**Need help?** Check the main README.md for additional troubleshooting steps.
