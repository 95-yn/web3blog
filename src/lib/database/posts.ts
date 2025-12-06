import { prisma } from "@/lib/prisma";
import { Post, PostStatus } from "@prisma/client";

/**
 * 创建文章
 */
export async function createPost(data: {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  authorId: string;
  tagIds?: string[];
}) {
  const { tagIds, ...postData } = data;

  return await prisma.post.create({
    data: {
      ...postData,
      tags: tagIds
        ? {
            create: tagIds.map((tagId) => ({
              tag: { connect: { id: tagId } },
            })),
          }
        : undefined,
    },
    include: {
      author: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });
}

/**
 * 根据 ID 获取文章
 */
export async function getPostById(id: string) {
  return await prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          fullName: true,
          avatarUrl: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
      comments: {
        orderBy: { createdAt: "desc" },
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
  });
}

/**
 * 根据 Slug 获取文章
 */
export async function getPostBySlug(slug: string) {
  return await prisma.post.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          fullName: true,
          avatarUrl: true,
          bio: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
      comments: {
        orderBy: { createdAt: "desc" },
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
  });
}

/**
 * 获取文章列表（分页）
 */
export async function getPosts(params: {
  page?: number;
  pageSize?: number;
  status?: PostStatus;
  authorId?: string;
  tagId?: string;
}) {
  const { page = 1, pageSize = 10, status, authorId, tagId } = params;
  const skip = (page - 1) * pageSize;

  const where = {
    ...(status && { status }),
    ...(authorId && { authorId }),
    ...(tagId && {
      tags: {
        some: {
          tagId,
        },
      },
    }),
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { publishedAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    }),
    prisma.post.count({ where }),
  ]);

  return {
    posts,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

/**
 * 更新文章
 */
export async function updatePost(
  id: string,
  data: Partial<{
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    coverImage: string;
    status: PostStatus;
  }>
) {
  return await prisma.post.update({
    where: { id },
    data,
    include: {
      author: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });
}

/**
 * 发布文章
 */
export async function publishPost(id: string) {
  return await prisma.post.update({
    where: { id },
    data: {
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });
}

/**
 * 删除文章
 */
export async function deletePost(id: string) {
  return await prisma.post.delete({
    where: { id },
  });
}

/**
 * 增加文章浏览量
 */
export async function incrementPostViews(id: string) {
  return await prisma.post.update({
    where: { id },
    data: {
      viewCount: {
        increment: 1,
      },
    },
  });
}

/**
 * 点赞文章
 */
export async function likePost(id: string) {
  return await prisma.post.update({
    where: { id },
    data: {
      likeCount: {
        increment: 1,
      },
    },
  });
}

