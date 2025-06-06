# Deployment Configuration

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com
NEXT_PUBLIC_API_VERSION=v2
NEXT_PUBLIC_API_TIMEOUT=30000

# Authentication
NEXT_PUBLIC_AUTH_DOMAIN=your-auth-domain.com
NEXT_PUBLIC_CLIENT_ID=your-client-id
NEXT_PUBLIC_CLIENT_SECRET=your-client-secret

# Organization
NEXT_PUBLIC_DEFAULT_ORG_ID=your-default-org-id

# Feature Flags
NEXT_PUBLIC_ENABLE_REAL_TIME_SYNC=true
NEXT_PUBLIC_ENABLE_BULK_OPERATIONS=true
NEXT_PUBLIC_ENABLE_DATA_EXPORT=true
NEXT_PUBLIC_ENABLE_ADVANCED_ANALYTICS=true

# Debug and Monitoring
NEXT_PUBLIC_DEBUG=false
NEXT_PUBLIC_LOG_LEVEL=info
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn

# Performance
NEXT_PUBLIC_CACHE_TTL=300
NEXT_PUBLIC_MAX_CONCURRENT_REQUESTS=10
```

## Docker Configuration

### Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn build

# If using npm comment out above and use below instead
# RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  extraction-app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_BASE_URL=${API_BASE_URL}
      - NEXT_PUBLIC_AUTH_DOMAIN=${AUTH_DOMAIN}
      - NEXT_PUBLIC_CLIENT_ID=${CLIENT_ID}
      - NEXT_PUBLIC_DEFAULT_ORG_ID=${DEFAULT_ORG_ID}
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - extraction-app
    restart: unless-stopped
```

## Kubernetes Configuration

### deployment.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: extraction-app
  labels:
    app: extraction-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: extraction-app
  template:
    metadata:
      labels:
        app: extraction-app
    spec:
      containers:
      - name: extraction-app
        image: your-registry/extraction-app:2.0.0
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: NEXT_PUBLIC_API_BASE_URL
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: api-base-url
        - name: NEXT_PUBLIC_AUTH_DOMAIN
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: auth-domain
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: extraction-app-service
spec:
  selector:
    app: extraction-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: LoadBalancer
```

### configmap.yaml

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  api-base-url: "https://api.your-domain.com"
  auth-domain: "auth.your-domain.com"
  default-org-id: "your-default-org-id"
  enable-real-time-sync: "true"
  enable-bulk-operations: "true"
```

## Nginx Configuration

### nginx.conf

```nginx
events {
    worker_connections 1024;
}

http {
    upstream extraction-app {
        server extraction-app:3000;
    }

    server {
        listen 80;
        server_name your-domain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        # Gzip compression
        gzip on;
        gzip_vary on;
        gzip_min_length 1024;
        gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

        location / {
            proxy_pass http://extraction-app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Static assets caching
        location /_next/static/ {
            proxy_pass http://extraction-app;
            add_header Cache-Control "public, max-age=31536000, immutable";
        }

        # API rate limiting
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://extraction-app;
        }
    }

    # Rate limiting zones
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
}
```

## Cloud Platform Deployments

### Vercel

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NEXT_PUBLIC_API_BASE_URL": "@api-base-url",
    "NEXT_PUBLIC_AUTH_DOMAIN": "@auth-domain",
    "NEXT_PUBLIC_CLIENT_ID": "@client-id"
  },
  "regions": ["iad1", "sfo1"],
  "functions": {
    "app/**": {
      "maxDuration": 30
    }
  }
}
```

### Netlify

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[headers]]
  for = "/_next/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### AWS ECS

```json
{
  "family": "extraction-app",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "extraction-app",
      "image": "your-account.dkr.ecr.region.amazonaws.com/extraction-app:2.0.0",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "NEXT_PUBLIC_API_BASE_URL",
          "value": "https://api.your-domain.com"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/extraction-app",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

## Monitoring and Logging

### Health Check Endpoint

The application includes a health check endpoint at `/api/health` that returns:

```json
{
  "status": "healthy",
  "timestamp": "2024-12-01T12:00:00Z",
  "version": "2.0.0",
  "uptime": 3600,
  "dependencies": {
    "database": "connected",
    "api": "connected"
  }
}
```

### Logging Configuration

Configure logging levels and outputs:

```env
# Logging
LOG_LEVEL=info
LOG_FORMAT=json
LOG_OUTPUT=stdout
ENABLE_ACCESS_LOGS=true
ENABLE_ERROR_TRACKING=true
```

### Metrics and Monitoring

Recommended monitoring setup:
- **Application Performance**: New Relic, DataDog, or Sentry
- **Infrastructure**: Prometheus + Grafana
- **Logs**: ELK Stack or Splunk
- **Uptime**: Pingdom or StatusCake

## Security Considerations

### SSL/TLS Configuration
- Use TLS 1.2 or higher
- Implement HSTS headers
- Use strong cipher suites
- Regular certificate renewal

### Environment Security
- Never commit secrets to version control
- Use environment-specific configurations
- Implement proper secret management
- Regular security audits

### API Security
- Implement rate limiting
- Use CORS properly
- Validate all inputs
- Monitor for suspicious activity

## Backup and Recovery

### Database Backups
- Daily automated backups
- Point-in-time recovery capability
- Cross-region backup replication
- Regular restore testing

### Application Backups
- Configuration backups
- Static asset backups
- Log archival
- Disaster recovery procedures

## Performance Optimization

### Caching Strategy
- CDN for static assets
- API response caching
- Database query caching
- Browser caching headers

### Optimization Techniques
- Image optimization
- Code splitting
- Lazy loading
- Bundle analysis

## Troubleshooting

### Common Issues
1. **Build failures**: Check Node.js version and dependencies
2. **API connection errors**: Verify environment variables
3. **Authentication issues**: Check token configuration
4. **Performance issues**: Monitor resource usage

### Debug Mode
Enable debug mode for detailed logging:
```env
NEXT_PUBLIC_DEBUG=true
DEBUG=*
```

### Support Resources
- Application logs
- Error tracking
- Performance monitoring
- Health check endpoints

