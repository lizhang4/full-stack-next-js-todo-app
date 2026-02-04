'use client'

import { addTodo } from "@/actions/todoActions";
import { useRef } from "react";


export function AddTodoForm() {
    const formRef = useRef<HTMLFormElement>(null);

    const action = async (formData: FormData) => {
        const title : string = formData.get('title') as string;
        if (!title) return;
        await addTodo(title)
        formRef.current?.reset();
    }

    return (
        <form ref={formRef} action={action} className="flex gap-2 mb-4">
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
        
    );
}