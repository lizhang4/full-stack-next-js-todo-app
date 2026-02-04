'use client'

import { addTodo, deleteTodo, toggleTodo } from "@/actions/todoActions";
import { useState, useTransition } from "react"

export function TodoItem({id, title, isCompleted} : {id: number, title: string, isCompleted: boolean}) {
    const [isPending, startTransition] = useTransition();


    return (
        <div className="flex items-center justify-between p-2 border-2">
            <div className="flex items-center gap-2">
                <input 
                    type="checkbox" 
                    checked={isCompleted} 
                    // onChange={() => {setTransition(() => {toggleTodo(id, isCompleted)})}} 
                    onChange={() => startTransition(() => toggleTodo(id, isCompleted))}
                    disabled={isPending}  
                    className="size-5 rounded-full"
                />
                <span className={isCompleted ? "line-through text-gray-400" : ""}>{title}</span>
            </div>
            <button 
                onClick={() => {startTransition(() => deleteTodo(id))}}
                className="text-red-500 text-sm">
                Delete
            </button>
        </div>

    );
    
}