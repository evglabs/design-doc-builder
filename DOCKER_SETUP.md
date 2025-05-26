# Docker Setup Guide

This guide explains how to run the Design Document Builder using Docker.

## 🐳 Docker Configuration Overview

The application uses a multi-container setup:
- **app**: Main application container (frontend + backend)
- **nginx**: Reverse proxy and load balancer
- **volumes**: Persistent storage for database, uploads, and backups

## 📋 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+

## 🚀 Quick Start

### **Option 1: Simple App Only**
```bash
# Build and run just the main application
docker-compose up app
```
Access at: http://localhost:3000

### **Option 2: Full Production Setup**
```bash
# Build and run with nginx reverse proxy
docker-compose up --build
```
Access at: http://localhost (port 80)

### **Option 3: Development with Live Logs**
```bash
# Run with live log output
docker-compose up --build --no-daemon
```

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
- **App Container**: Internal port 3000
- **Nginx Container**: Ports 80 (HTTP) and 443 (HTTPS)

### **URLs**
- **Direct App Access**: http://localhost:3000
- **Via Nginx**: http://localhost
- **API Health Check**: http://localhost/health

## 🛠 Build Process

The Dockerfile uses multi-stage builds:

1. **Frontend Build**: Compiles React/TypeScript to static files
2. **Backend Build**: Compiles TypeScript to JavaScript
3. **Production Image**: Combines both with optimized Node.js runtime

## 📊 Monitoring & Health Checks

### **Built-in Health Checks**
```bash
# Check application health
curl http://localhost/health

# View container status
docker-compose ps

# View logs
docker-compose logs app
docker-compose logs nginx
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
docker-compose logs nginx     # View nginx logs
```

### **Database Operations**
```bash
# Backup database
docker-compose exec app cp /app/database/app.db /app/backups/backup-$(date +%Y%m%d).db

# Access database files
ls -la ./database/
```

## 🔍 Troubleshooting

### **Container Won't Start**
```bash
# Check logs for errors
docker-compose logs app

# Verify environment file
cat .env.production

# Check port conflicts
netstat -tulpn | grep :80
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

### **Network Issues**
```bash
# Check container networking
docker network ls
docker-compose exec app ping nginx
```

## 🏗 Development vs Production

### **Development** (Use ./start-dev.sh)
- Hot reload enabled
- Source maps available
- Debug logging
- Direct file mounting

### **Production** (Use Docker)
- Optimized builds
- Security hardening
- Reverse proxy
- Health monitoring

## 🔐 SSL/HTTPS Setup (Optional)

To enable HTTPS:

1. **Add SSL certificates to `./ssl/` directory**
2. **Update nginx.conf** (uncomment HTTPS server block)
3. **Restart containers**:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

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
```

### **Nginx Optimizations**
The nginx.conf includes:
- Gzip compression
- Static file caching
- Performance headers
- Security headers

## 🚨 Important Notes

1. **First Run**: Database will be created automatically
2. **Persistence**: Data survives container restarts via volumes
3. **Security**: Change default JWT_SECRET before production use
4. **Ports**: Ensure ports 80 and 3000 are available
5. **Resources**: Monitor disk space for database and uploads

---

**Need help?** Check the main README.md for additional troubleshooting steps.
