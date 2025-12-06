import { prisma } from "@/lib/prisma";
import { User, UserRole } from "@prisma/client";

/**
 * 根据邮箱获取用户
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  return await prisma.user.findUnique({
    where: { email },
  });
}

/**
 * 根据 ID 获取用户
 */
export async function getUserById(id: string): Promise<User | null> {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      posts: {
        take: 5,
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

/**
 * 创建新用户
 */
export async function createUser(data: {
  email: string;
  username?: string;
  fullName?: string;
  avatarUrl?: string;
}): Promise<User> {
  return await prisma.user.create({
    data,
  });
}

/**
 * 更新用户信息
 */
export async function updateUser(
  id: string,
  data: Partial<{
    username: string;
    fullName: string;
    avatarUrl: string;
    bio: string;
  }>
): Promise<User> {
  return await prisma.user.update({
    where: { id },
    data,
  });
}

/**
 * 获取所有用户（分页）
 */
export async function getUsers(params: {
  page?: number;
  pageSize?: number;
  role?: UserRole;
}) {
  const { page = 1, pageSize = 20, role } = params;
  const skip = (page - 1) * pageSize;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: role ? { role } : undefined,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { posts: true, comments: true },
        },
      },
    }),
    prisma.user.count({
      where: role ? { role } : undefined,
    }),
  ]);

  return {
    users,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

