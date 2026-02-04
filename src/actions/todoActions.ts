'use server'

import { db } from "@/db"
import { Todo, todos } from "@/db/schema"
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";



export async function addTodo(title: string) {
    const {userId} = await auth();
    if (!userId) throw new Error('Unauthorized');

    const todo = await db.insert(todos).values({
        title: title,
        completed: false,
        userId: userId
    }).returning();
    revalidatePath('/');
}

export async function toggleTodo(id: number, currentStatus: boolean) {
    const {userId} = await auth();

    if (!userId) throw new Error('Unauthorized');
    await db.update(todos).set({completed: !currentStatus}).where(eq(todos.id, id));
    revalidatePath('/');
}

export async function deleteTodo(id: number) {
    const {userId} = await auth();

    if (!userId) throw new Error('Unauthorized');
    await db.delete(todos).where(eq(todos.id, id));
    revalidatePath('/');
}

export async function getAllTodos(): Promise<Todo[]> {
    const {userId} = await auth();

    if (!userId) throw new Error('Unauthorized');

    return await db.query.todos.findMany({
        where: (todos, {eq}) => eq(todos.userId, userId)
    }) 
}