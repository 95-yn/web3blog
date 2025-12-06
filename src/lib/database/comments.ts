import { prisma } from "@/lib/prisma";

/**
 * 创建评论
 */
export async function createComment(data: {
  content: string;
  postId: string;
  authorId: string;
}) {
  return await prisma.comment.create({
    data,
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
  });
}

/**
 * 获取文章的评论
 */
export async function getCommentsByPostId(postId: string) {
  return await prisma.comment.findMany({
    where: { postId },
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
  });
}

/**
 * 更新评论
 */
export async function updateComment(id: string, content: string) {
  return await prisma.comment.update({
    where: { id },
    data: { content },
  });
}

/**
 * 删除评论
 */
export async function deleteComment(id: string) {
  return await prisma.comment.delete({
    where: { id },
  });
}

