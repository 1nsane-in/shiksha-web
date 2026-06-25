# LMS Platform Deployment Guide

## 1. Overview

This document provides comprehensive guidelines for deploying and operating the Medical Admission Management Platform in production environments.

## 2. Infrastructure Requirements

### 2.1 Hardware Requirements

#### Application Servers
- CPU: Minimum 2 vCPUs, recommended 4 vCPUs
- RAM: Minimum 4GB, recommended 8GB
- Storage: Minimum 50GB SSD, recommended 100GB SSD
- Network: 100Mbps minimum bandwidth

#### Database Server
- CPU: Minimum 4 vCPUs, recommended 8 vCPUs
- RAM: Minimum 8GB, recommended 16GB
- Storage: Minimum 100GB SSD, recommended 500GB SSD
- Network: 1Gbps bandwidth

#### File Storage
- Storage: Sufficient capacity for document uploads (estimated 1TB minimum)
- Bandwidth: 1Gbps minimum for file transfers

### 2.2 Software Requirements

#### Base Operating System
- Ubuntu 20.04 LTS or later
- CentOS Stream 8 or later
- Debian 11 or later

#### Runtime Dependencies
- Node.js 18.x LTS
- PostgreSQL 14+
- Docker Engine 20.10+
- Docker Compose 2.0+

#### Additional Services
- Redis 6.x (for caching)
- Cloudflare R2 (for file storage)
- Razorpay (for payments)
- Twilio (for SMS)
- Zeptomail (for email)

## 3. Deployment Architecture

### 3.1 Production Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Load Balancer                              │
└─────────────────────────┬─────────────────────────────────────────┘
                          │
┌─────────────────────────▼─────────────────────────────────────────┐
│                      Reverse Proxy (Nginx)                        │
└─────────────────────────┬─────────────────────────────────────────┘
                          │
┌─────────────────────────▼─────────────────────────────────────────┐
│                     Application Servers (NestJS)                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   API 1     │  │   API 2     │  │   API 3     │  │   API 4     │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │
└─────────────────────────┬─────────────────────────────────────────┘
                          │
┌─────────────────────────▼─────────────────────────────────────────┐
│                       Database Cluster                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   DB 1      │  │   DB 2      │  │   DB 3      │  │   DB 4      │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │
└─────────────────────────┬─────────────────────────────────────────┘
                          │
┌─────────────────────────▼─────────────────────────────────────────┐
│                    File Storage (Cloudflare R2)                   │
└───────────────────────────────────────────────────────────────────┘
```

### 3.2 Container Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Docker Compose                             │
│                                                                     │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌──────────┐ │
│  │   API       │   │   Database  │   │   Redis     │   │  Frontend│ │
│  │  NestJS     │   │  PostgreSQL │   │  Caching    │   │  Next.js │ │
│  └─────────────┘   └─────────────┘   └─────────────┘   └──────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

## 4. Environment Configuration

### 4.1 Environment Variables

The following environment variables must be configured:

```bash
# Database Configuration
DATABASE_URL=postgresql://user:password@host:port/dbname

# JWT Configuration
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here

# Payment Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# File Storage Configuration
R2_ACCOUNT_ID=your_r2_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=your_bucket_name

# Email Configuration
ZEPTOMAIL_API_KEY=your_zepomail_api_key

# SMS Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_VERIFY_SERVICE_SID=your_verify_service_sid

# AI Configuration
OPENROUTER_API_KEY=your_openrouter_api_key
AI_DEFAULT_MODEL=amazon/nova-lite-v1

# Application Configuration
NODE_ENV=production
PORT=3000
```

### 4.2 Configuration Files

#### Docker Compose (docker-compose.yml)
```yaml
version: '3.8'
services:
  api:
    build: ./apps/api
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - JWT_ACCESS_SECRET=${JWT_ACCESS_SECRET}
      - JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
      - RAZORPAY_KEY_ID=${RAZORPAY_KEY_ID}
      - RAZORPAY_KEY_SECRET=${RAZORPAY_KEY_SECRET}
      - R2_ACCOUNT_ID=${R2_ACCOUNT_ID}
      - R2_ACCESS_KEY_ID=${R2_ACCESS_KEY_ID}
      - R2_SECRET_ACCESS_KEY=${R2_SECRET_ACCESS_KEY}
      - R2_BUCKET_NAME=${R2_BUCKET_NAME}
    ports:
      - "3000:3000"
    depends_on:
      - database
      - redis
    networks:
      - app-network

  database:
    image: postgres:14
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network

  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"
    networks:
      - app-network

  frontend:
    build: ./apps/web
    ports:
      - "3000:3000"
    networks:
      - app-network

volumes:
  postgres_data:

networks:
  app-network:
    driver: bridge
```

## 5. Deployment Process

### 5.1 Pre-deployment Checklist

1. **Environment Setup**
   - Configure all required environment variables
   - Set up monitoring and alerting systems
   - Configure backup and disaster recovery procedures

2. **Database Preparation**
   - Initialize PostgreSQL database
   - Configure database users and permissions
   - Execute initial database migrations
   - Set up database backups

3. **Infrastructure Setup**
   - Provision servers and load balancers
   - Configure firewall rules
   - Set up SSL certificates
   - Configure DNS records

### 5.2 Deployment Steps

#### Step 1: Build and Push Docker Images
```bash
# Build API image
cd apps/api
docker build -t medical-admission-api:latest .

# Build frontend image
cd apps/web
docker build -t medical-admission-frontend:latest .
```

#### Step 2: Deploy Services
```bash
# Start all services
docker-compose up -d

# Check service status
docker-compose ps
```

#### Step 3: Database Migrations
```bash
# Run database migrations
docker exec medical-admission-api npm run migrate:up
```

#### Step 4: Health Checks
```bash
# Test API health
curl http://localhost:3000/health

# Check database connectivity
docker exec medical-admission-api npm run db:health
```

### 5.3 Rolling Updates

For zero-downtime deployments:

1. **Prepare New Version**
   - Build new Docker images
   - Test in staging environment

2. **Deploy New Version**
   - Deploy new API containers
   - Wait for services to be healthy
   - Update load balancer configuration

3. **Clean Up**
   - Remove old containers
   - Clean up unused images

## 6. Monitoring and Logging

### 6.1 Application Monitoring

#### Health Checks
```bash
# API Health Endpoint
GET /health

# Database Health Check
GET /db/health

# Redis Health Check
GET /redis/health
```

#### Metrics Collection
- CPU and memory usage
- Database connection pool status
- API response times
- Error rates
- Request volume

### 6.2 Logging Configuration

#### Log Levels
- **Info**: Normal operational events
- **Warn**: Potential issues
- **Error**: Errors and exceptions
- **Debug**: Detailed diagnostic information

#### Log Format
```json
{
  "timestamp": "2023-01-01T00:00:00Z",
  "level": "info",
  "message": "User login successful",
  "service": "api",
  "correlationId": "uuid",
  "userId": "uuid"
}
```

### 6.3 Alerting System

#### Critical Alerts
- Service downtime
- Database connection failures
- High error rates
- Security incidents

#### Warning Alerts
- Slow response times
- High memory usage
- Low disk space
- Failed authentication attempts

## 7. Backup and Recovery

### 7.1 Database Backups

#### Automated Backups
```bash
# Daily backup script
#!/bin/bash
pg_dump -h database -U username dbname > backup_$(date +%Y%m%d_%H%M%S).sql
gzip backup_*.sql
```

#### Backup Retention
- 7 daily backups
- 4 weekly backups
- Monthly backups for 1 year

### 7.2 File Storage Backups

#### Object Storage Snapshots
- Daily snapshots of Cloudflare R2 buckets
- Cross-region replication for disaster recovery
- Versioned backups for file restoration

### 7.3 Recovery Procedures

#### Database Recovery
1. Restore from latest backup
2. Apply transaction logs
3. Validate data integrity
4. Bring services online

#### File Recovery
1. Identify lost files from audit logs
2. Restore from Cloudflare R2 backups
3. Regenerate signed URLs
4. Notify affected users

## 8. Scaling Strategies

### 8.1 Horizontal Scaling

#### API Scaling
- Scale API containers based on request volume
- Use load balancer for distribution
- Implement circuit breaker patterns

#### Database Scaling
- Primary-secondary replication
- Read replicas for reporting
- Sharding for large datasets

### 8.2 Vertical Scaling

#### Resource Allocation
- Increase CPU and memory for high-traffic periods
- Adjust database connection pool sizes
- Optimize Redis memory usage

## 9. Security Hardening

### 9.1 Docker Security

#### Container Hardening
- Run containers as non-root users
- Disable unnecessary capabilities
- Use read-only root filesystems where possible
- Scan images for vulnerabilities

### 9.2 Network Security

#### Firewall Rules
- Allow only necessary ports
- Block unauthorized access to internal services
- Implement rate limiting for API endpoints

### 9.3 Application Security

#### Secure Configuration
- Disable debug mode in production
- Secure session management
- Implement proper CORS policies
- Use HTTPS for all communications

## 10. Performance Optimization

### 10.1 Database Optimization

#### Indexing Strategy
- Create indexes on frequently queried columns
- Monitor slow query performance
- Regular index maintenance

#### Connection Pooling
- Configure optimal connection pool sizes
- Implement connection timeouts
- Monitor pool utilization

### 10.2 Caching Strategy

#### Redis Configuration
- Use Redis for session storage
- Implement caching for frequently accessed data
- Set appropriate TTL values

#### CDN Usage
- Cache static assets with CDN
- Implement cache invalidation strategies
- Monitor cache hit ratios

## 11. Maintenance Procedures

### 11.1 Regular Maintenance

#### Weekly Tasks
- Review logs for errors
- Check backup integrity
- Monitor system resources
- Update security patches

#### Monthly Tasks
- Database vacuum and analyze
- Review and rotate secrets
- Update dependencies
- Performance tuning

### 11.2 Emergency Procedures

#### Service Outage
1. Identify root cause
2. Implement failover if available
3. Notify stakeholders
4. Restore service from backup
5. Document incident for future improvement

#### Security Breach
1. Isolate affected systems
2. Contain the breach
3. Investigate the incident
4. Notify authorities if required
5. Implement additional security measures
6. Restore services safely

## 12. Disaster Recovery Plan

### 12.1 Recovery Time Objectives (RTO)

- **API Services**: 15 minutes
- **Database**: 1 hour
- **File Storage**: 2 hours
- **User Access**: 30 minutes

### 12.2 Recovery Point Objectives (RPO)

- **Database**: 15 minutes
- **File Storage**: 1 hour
- **Application Data**: 1 day
- **Configuration**: Real-time

### 12.3 Recovery Steps

1. **Assessment**: Determine scope of failure
2. **Activation**: Activate DR plan
3. **Recovery**: Restore from backups
4. **Validation**: Verify data integrity
5. **Recovery**: Bring systems online
6. **Documentation**: Record incident and lessons learned

This deployment guide provides comprehensive instructions for deploying and operating the Medical Admission Management Platform in production environments, ensuring reliability, security, and performance.