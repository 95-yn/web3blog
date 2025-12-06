import { prisma } from "@/lib/prisma";

/**
 * 创建标签
 */
export async function createTag(data: {
  name: string;
  slug: string;
  color?: string;
}) {
  return await prisma.tag.create({
    data,
  });
}

/**
 * 获取所有标签
 */
export async function getAllTags() {
  return await prisma.tag.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  });
}

/**
 * 根据 ID 获取标签
 */
export async function getTagById(id: string) {
  return await prisma.tag.findUnique({
    where: { id },
    include: {
      posts: {
        include: {
          post: {
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                  fullName: true,
                  avatarUrl: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

/**
 * 根据 Slug 获取标签
 */
export async function getTagBySlug(slug: string) {
  return await prisma.tag.findUnique({
    where: { slug },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  });
}

/**
 * 更新标签
 */
export async function updateTag(
  id: string,
  data: Partial<{
    name: string;
    slug: string;
    color: string;
  }>
) {
  return await prisma.tag.update({
    where: { id },
    data,
  });
}

/**
 * 删除标签
 */
export async function deleteTag(id: string) {
  return await prisma.tag.delete({
    where: { id },
  });
}

