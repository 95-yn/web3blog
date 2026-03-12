# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:20-alpine AS deps

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies (use npm for better compatibility on remote servers)
RUN npm ci --only=production=false

# ============================================
# Stage 2: Builder
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY package.json pnpm-lock.yaml ./

# Copy source code
COPY . .

# Build the application
RUN npm run build

# ============================================
# Stage 3: Production
# ============================================
FROM node:20-alpine AS production

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -u 1001 -S nodejs -G nodejs

# Copy built artifacts
COPY --from=builder --chown=nodejs:nodejs /app/.next/standalone ./.next/standalone
COPY --from=builder --chown=nodejs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nodejs:nodejs /app/public ./public
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./

# Set environment
ENV NODE_ENV=production \
    PORT=3000

# Expose port
EXPOSE 3000

# Start with non-root user
USER nodejs

CMD ["node", ".next/standalone/server.js"]
