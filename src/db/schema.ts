import { InferSelectModel, relations } from "drizzle-orm";
import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";




export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    createdAt: timestamp('created_at', {withTimezone: true}).defaultNow()
});

export const todos = pgTable('todos', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    completed: boolean('completed').default(false),
    userId: text('userId').notNull(),
    createdAt: timestamp('created_at', {withTimezone: true}).defaultNow()
});

export const usersRelation = relations(users, ({many}) => ({
    todos: many(todos)
}));

export const todosRelation = relations(todos, ({one}) =>({
    users: one(users, {
        fields: [todos.userId],
        references: [users.id]
    })
}))


export type Todo = InferSelectModel<typeof todos>;