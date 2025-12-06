import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * 同步用户数据到 Prisma 数据库
 * 当用户在 Supabase 注册后，调用此 API 在 Prisma 中创建对应记录
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, email, username, fullName } = body;

    // 验证必需字段
    if (!id || !email) {
      return NextResponse.json(
        { error: "缺少必需字段: id, email" },
        { status: 400 }
      );
    }

    // 检查用户是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (existingUser) {
      // 用户已存在，更新信息
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          email,
          username: username || undefined,
          fullName: fullName || undefined,
        },
      });

      return NextResponse.json({
        success: true,
        user: updatedUser,
        message: "用户信息已更新",
      });
    }

    // 创建新用户
    const newUser = await prisma.user.create({
      data: {
        id,
        email,
        username: username || null,
        fullName: fullName || null,
        emailVerified: false,
      },
    });

    return NextResponse.json({
      success: true,
      user: newUser,
      message: "用户创建成功",
    });
  } catch (error: any) {
    console.error("同步用户数据失败:", error);

    // 处理唯一约束冲突
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "邮箱或用户名已存在" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: error.message || "同步用户数据失败" },
      { status: 500 }
    );
  }
}

