---

# Full Stack Next.js Todo App

A robust, full-stack task management application built with the latest React and Next.js features. This project demonstrates a seamless user experience using Server Actions for backend logic and React's `useOptimistic` hook for immediate UI feedback.

**Live Demo:** [https://full-stack-next-js-todo-obycn0kay-nicks-projects-5dd08e68.vercel.app/](https://full-stack-next-js-todo-obycn0kay-nicks-projects-5dd08e68.vercel.app/)

## 🚀 Features

* **User Authentication:** Secure sign-up and login via [Clerk](https://clerk.com/).
* **Full CRUD Operations:** Create, Read, Update (Toggle), and Delete todos.
* **Optimistic UI:** Instant interface updates using `useOptimistic` and `startTransition`, ensuring the app feels responsive even on slower networks.
* **Server Actions:** Direct backend mutations without simpler API routes, utilizing Next.js `'use server'` capabilities.
* **Database Integration:** Data persistence using Drizzle ORM.
* **Responsive Design:** Styled with Tailwind CSS for mobile and desktop compatibility.

## 🛠️ Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Database ORM:** [Drizzle ORM](https://orm.drizzle.team/)
* **Authentication:** Clerk
* **Deployment:** Vercel

## 📂 Key Code Highlights

This project utilizes modern React patterns to handle state synchronization between the client and server.

### Optimistic Updates

Instead of waiting for the database to respond, the UI updates immediately. If the server action fails, the state automatically rolls back.

```typescript
// From TodoList.tsx
const [optimisticTodos, setOptimisticTodos] = useOptimistic(
    initialTodos,
    (state: Todo[], action: Action) => {
        switch (action.type) {
            case "Add": return [...state, action.todo];
            case "Toggle": return state.map(t => t.id === action.id ? {...t, completed: !t.completed } : t);
            case "Delete": return state.filter(t => t.id !== action.id);
            default: return state;
        }
    }
);

```

### Server Actions

Database mutations are handled directly in `actions/todoActions.ts`, ensuring type safety and reducing boilerplate.

```typescript
export async function toggleTodo(id: number, currentStatus: boolean) {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');
    
    await db.update(todos)
        .set({ completed: !currentStatus })
        .where(eq(todos.id, id));
        
    revalidatePath('/'); // Refreshes server data
}

```
