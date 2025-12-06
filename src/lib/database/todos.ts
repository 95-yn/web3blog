import { createClient } from "@/lib/supabase/server";
import { Todo, TodoInsert } from "@/types/database";

/**
 * 获取当前用户的所有待办事项
 */
export async function getTodos(): Promise<Todo[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("未登录");

  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * 根据 ID 获取单个待办事项
 */
export async function getTodoById(id: string): Promise<Todo | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching todo:", error);
    return null;
  }

  return data;
}

/**
 * 创建新的待办事项
 */
export async function createTodo(
  todo: Omit<TodoInsert, "user_id">
): Promise<Todo> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("未登录");

  const { data, error } = await supabase
    .from("todos")
    .insert({
      ...todo,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * 更新待办事项
 */
export async function updateTodo(
  id: string,
  updates: Partial<Pick<Todo, "title" | "description" | "is_complete">>
): Promise<Todo> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("todos")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * 删除待办事项
 */
export async function deleteTodo(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from("todos").delete().eq("id", id);

  if (error) throw error;
}

/**
 * 切换待办事项完成状态
 */
export async function toggleTodoComplete(id: string): Promise<Todo> {
  const supabase = await createClient();

  // 先获取当前状态
  const todo = await getTodoById(id);
  if (!todo) throw new Error("待办事项不存在");

  // 切换状态
  return updateTodo(id, { is_complete: !todo.is_complete });
}
