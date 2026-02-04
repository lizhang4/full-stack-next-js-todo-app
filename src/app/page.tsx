

import { AddTodoForm } from "@/components/AddTodoForm";
import { TodoItem } from "@/components/TodoItem";
import { Todo, TodoList } from "@/components/TodoList";
import { db } from "@/db";
import { users, todos } from "@/db/schema";
import { useUser } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import Image from "next/image";



export default async function Home() {

  const user = await currentUser();
  
  let todos: Todo[];

  if (user) {
      const todosList = await db.query.todos.findMany({
      where: (todos, {eq}) => eq(todos.userId, user.id)
    })
    todos = todosList.map(tl => {
      return {
        id: tl.id,
        title: tl.title,
        completed: tl.completed ? tl.completed : false
      }
    });
  }
  else {
    todos = [];
  }


  return (
    <main className="max-w-md mx-auto mt-10 p-4 border rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">User: {user?.fullName}</h1>

      {user ? (
        <>
        <TodoList initialTodos={todos}/>
      </>) : (<p>Please log in to view todos</p>)
      }
      
    </main>
    
  );
}
