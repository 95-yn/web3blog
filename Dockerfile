# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:20-alpine AS deps

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies
RUN pnpm install --frozen-lockfile --prod=false

# ============================================
# Stage 2: Builder
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# ============================================
# Stage 3: Production
# ============================================
FROM node:20-alpine AS production

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -u 1001 -S nodejs -G nodejs

# Copy built artifacts
COPY --from=builder --chown=nodejs:nodejs /app/.next/standalone ./.next
COPY --from=builder --chown=nodejs:nodejs /app/public ./public
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./
COPY --from=builder --chown=nodejs:nodejs /app/.next/static ./.next/static

# Set environment
ENV NODE_ENV=production \
    PORT=3000 \
    NEXT_PUBLIC_BASE_PATH="" \
    __NEXT_ASSET_PREFIX=""

# Expose port
EXPOSE 3000

# Start with non-root user
USER nodejs

CMD ["node", ".next/standalone/server.js"]
