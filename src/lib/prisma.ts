import { PrismaClient } from "@prisma/client";

// PrismaClient 单例模式
// 避免在开发环境中创建多个实例

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Prisma 7.x: 数据库 URL 在 prisma.config.ts 中配置
// 应用查询会自动使用 DATABASE_URL（如果设置了的话）
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;

