'use client'

import { addTodo, deleteTodo, toggleTodo } from "@/actions/todoActions";
import { startTransition, useOptimistic } from "react";


export type Todo = {
    id: number;
    title: string;
    completed: boolean;
}

type Action = {type: "Add", todo: Todo} | {type: "Toggle", id: number} | {type: "Delete", id: number}


export function TodoList({initialTodos} : {initialTodos: Todo[]}) {
    const [optimisticTodos, setOptimisticTodos] = useOptimistic(
        initialTodos, 
        (state: Todo[], action: Action) => {
            switch (action.type) {
                case "Add":
                    return [...state, action.todo];
                case "Toggle":
                    return state.map(t => t.id === action.id ? {...t, completed: !t.completed } : t);
                case "Delete":
                    return state.filter(t => t.id !== action.id);
                default:
                    return state;
            }
        }
    );

    const handleToggle = async (id: number, completed: boolean) => {
        startTransition(() => {
            setOptimisticTodos({type: "Toggle", id});
        });
        await toggleTodo(id, completed);
    };

    const handleDelete = async (id: number) => {
        startTransition(() => {
            setOptimisticTodos({type: "Delete", id: id});
        })
        await deleteTodo(id);
    }

    const handleAdd = async (formData: FormData) => {
        const title = formData.get('title') as string;
        if (!title) return;

        const tempId = Math.random();
        startTransition(() => {
            setOptimisticTodos({
                type: "Add",
                todo: {id: tempId, completed: false, title }
            });
        });
        await addTodo(title);
    }
    

    return (
        <div>
            <form action={(formData: FormData) => handleAdd(formData)} className="flex gap-2 mb-4">
                <input 
                    name="title"
                    type="text" 
                    placeholder="New task..."
                    className="border p-2 rounded w-full text-white"
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Add
                </button>
            </form>
            <div className="flex flex-col gap-2">
                {optimisticTodos.map((t) => (
                    <div key={t.id} className="flex items-center justify-between p-2 border-2">
                        <div className="flex items-center gap-2">
                            <input 
                                type="checkbox" 
                                checked={t.completed} 
                                // onChange={() => {setTransition(() => {toggleTodo(id, isCompleted)})}} 
                                onChange={() => handleToggle(t.id, t.completed)}
                                className="size-5 rounded-full"
                            />
                            <span className={t.completed ? "line-through text-gray-400" : ""}>{t.title}</span>
                        </div>
                        <button 
                            onClick={() => {handleDelete(t.id)}}
                            className="text-red-500 text-sm">
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}