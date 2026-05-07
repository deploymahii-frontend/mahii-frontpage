# 🚀 Deployment Guide

Guide for deploying Mahii to production environments.

---

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations completed
- [ ] SSL certificates installed
- [ ] Backup strategy in place
- [ ] Monitoring setup complete
- [ ] Load balancing configured
- [ ] CDN for static assets configured
- [ ] Email service configured
- [ ] Payment gateway in production mode
- [ ] Scaling plan documented

---

## Deployment Platforms

### Option 1: Heroku (Easiest)

**Backend:**
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create mahii-api

# Set environment variables
heroku config:set PORT=5000
heroku config:set MONGODB_URI=your_production_mongodb_uri
heroku config:set JWT_SECRET=your_secret_key
heroku config:set RAZORPAY_KEY_ID=your_production_key
heroku config:set RAZORPAY_KEY_SECRET=your_production_secret

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

**Frontend:**
```bash
# Create frontend app
heroku create mahii-web

# Add buildpack for Node
heroku buildpacks:add heroku/nodejs

# Deploy
git push heroku main

# Visit app
heroku open
```

---

### Option 2: AWS (Scalable)

**EC2 Setup:**
```bash
# 1. Launch EC2 instance
# - Ubuntu 20.04 LTS
# - t3.medium or larger
# - Security group: Allow 22 (SSH), 80 (HTTP), 443 (HTTPS)

# 2. SSH into instance
ssh -i your-key.pem ubuntu@your-instance-ip

# 3. Install dependencies
sudo apt-get update
sudo apt-get install -y nodejs npm git nginx certbot python3-certbot-nginx

# 4. Clone repository
git clone https://github.com/your-repo/mahii.git
cd mahii

# 5. Setup backend
cd server
npm install
cp .env.production .env
npm run build

# 6. Setup frontend
cd ../client
npm install
npm run build

# 7. Configure PM2 for process management
npm install -g pm2
pm2 start server/server.js --name "mahii-api"
pm2 start "npm run start" --name "mahii-web" --cwd client
pm2 save
pm2 startup

# 8. Configure Nginx
sudo nano /etc/nginx/sites-available/mahii
# Add proxy configuration

# 9. Enable HTTPS
sudo certbot --nginx -d yourdomain.com

# 10. Restart Nginx
sudo systemctl restart nginx
```

---

### Option 3: Docker + Kubernetes

**Dockerfile for Backend:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

**Dockerfile for Frontend:**
```dockerfile
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**Docker Compose:**
```yaml
version: '3.8'

services:
  backend:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
      - NODE_ENV=production
    depends_on:
      - mongodb

  frontend:
    build: ./client
    ports:
      - "3000:3000"
    depends_on:
      - backend

  mongodb:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

---

## Environment Configuration

**Production `.env`:**
```env
# Server
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mahii_db?ssl=true

# Security
JWT_SECRET=your_super_secret_production_key
JWT_EXPIRE=7d

# Razorpay (Production Keys)
RAZORPAY_KEY_ID=rzp_live_XXXXX
RAZORPAY_KEY_SECRET=XXXXX

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_production_email@gmail.com
EMAIL_PASS=your_app_password

# URLs
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com

# Logging
LOG_LEVEL=info
SENTRY_DSN=your_sentry_dsn

# Storage
S3_BUCKET=your-bucket-name
S3_REGION=us-east-1
```

---

## Production Database Setup

**MongoDB Atlas:**
1. Create production cluster (M10 or higher for production)
2. Enable automatic backups
3. Set up IP whitelist (only office IPs)
4. Enable encryption at rest
5. Enable audit logging
6. Create read replicas for failover

**Backup Strategy:**
```bash
# Daily backups
mongodump --uri="your_mongodb_uri" --out=/backups/$(date +%Y%m%d)

# Archive old backups
tar -czf backup_$(date +%Y%m%d).tar.gz /backups/$(date +%Y%m%d)
```

---

## SSL/TLS Setup

**Let's Encrypt with Nginx:**
```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Verify
sudo certbot renew --dry-run
```

**Nginx Configuration:**
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://localhost:3000;
    }

    location /api {
        proxy_pass http://localhost:5000;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## Monitoring & Analytics

**Sentry Setup (Error Tracking):**
```javascript
// server/server.js
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

**New Relic Setup (APM):**
```javascript
require('newrelic');
```

**Datadog Integration:**
```bash
npm install dd-trace

# Initialize in server.js before other imports
const tracer = require('dd-trace').init()
```

---

## Performance Optimization

**Caching Strategy:**
```javascript
// Redis cache
const redis = require('redis');
const client = redis.createClient();

// Cache API responses
app.get('/api/shops', async (req, res) => {
  const cacheKey = `shops_${JSON.stringify(req.query)}`;
  
  const cached = await client.get(cacheKey);
  if (cached) return res.json(JSON.parse(cached));
  
  const shops = await Shop.find(req.query);
  client.setex(cacheKey, 3600, JSON.stringify(shops)); // 1 hour TTL
  res.json(shops);
});
```

**CDN Configuration:**
```javascript
// Serve static assets from CDN
const CDN_URL = 'https://cdn.yourdomain.com';

app.get('/static/:file', (req, res) => {
  res.redirect(`${CDN_URL}/static/${req.params.file}`);
});
```

---

## Scaling Strategy

**Horizontal Scaling:**
```yaml
# Kubernetes deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mahii-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: mahii-api
  template:
    metadata:
      labels:
        app: mahii-api
    spec:
      containers:
      - name: api
        image: mahii-api:latest
        ports:
        - containerPort: 5000
        env:
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: mahii-secrets
              key: mongodb-uri
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

---

## Health Checks & Monitoring

**Health Check Endpoint:**
```javascript
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await mongoose.connection.db.admin().ping();
    
    res.json({
      status: 'healthy',
      timestamp: new Date(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      database: 'connected'
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});
```

---

## CI/CD Pipeline

**GitHub Actions:**
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd server && npm install
          cd ../client && npm install
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Heroku
        run: git push https://heroku:${{ secrets.HEROKU_API_KEY }}@git.heroku.com/${{ secrets.HEROKU_APP_NAME }}.git main
```

---

## Disaster Recovery

**Backup Schedule:**
- Daily automated backups
- Weekly incremental backups
- Monthly full backups archived
- Test restore procedures monthly

**Failover Setup:**
- Database replication (primary + 2 replicas)
- Load balancer with health checks
- Automatic failover on primary failure
- RTO: 5 minutes
- RPO: 1 hour

---

## Security Hardening

**Production Checklist:**
- [ ] All secrets in environment variables
- [ ] HTTPS enforced
- [ ] CORS configured for specific origins only
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (MongoDB injection prevention)
- [ ] CSRF protection enabled
- [ ] Security headers set (Helmet)
- [ ] Regular security audits
- [ ] DDoS protection enabled

---

## Cost Optimization

| Service | Free Tier | Production | Monthly Cost |
|---------|-----------|-----------|--------------|
| MongoDB Atlas | 512MB | M10 cluster | $57 |
| AWS EC2 | 750h t2.micro | t3.medium | $30 |
| CloudFlare | Yes | Pro | $20 |
| Let's Encrypt | Yes | Automatic | $0 |
| SendGrid Email | 100/day | 5000/month | $10 |
| New Relic APM | Limited | Pro | $99 |
| **Total** | - | - | **~$216** |

---

## Maintenance Schedule

**Daily:**
- Monitor error rates
- Check database backups
- Review API response times

**Weekly:**
- Security updates
- Database optimization
- Performance analysis

**Monthly:**
- Disaster recovery drill
- Capacity planning review
- Cost analysis

**Quarterly:**
- Security audit
- Infrastructure upgrade assessment
- Performance bottleneck analysis

---

**Deployment Guide Last Updated:** April 2026
