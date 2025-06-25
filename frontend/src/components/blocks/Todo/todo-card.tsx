import * as React from "react"
import { cn } from "../../../lib/utils";
import type { Todo } from "../../../types/types";

type TodoCardProps = React.HTMLAttributes<HTMLElement> & {
    children: React.ReactNode,
    ref?: React.Ref<HTMLElement>,
    todo: Todo
};

const TodoCard = React.forwardRef<HTMLElement, TodoCardProps
    >(({ className, ...props },ref) => (
        <article 
            ref={ref}
            className={cn("bg-blue-500 rounded-md flex flex-col p-2 gap-2 cursor-grab relative", className)}
        {...props}
        />
    ))
    TodoCard.displayName = "TodoCard";

const TodoCardId = React.forwardRef<
    HTMLHeadingElement,
    React.HTMLAttributes<HTMLHeadingElement>
    >(({ className, ...props },ref) => (
        <h2 
            ref={ref}
            className={cn("bg-blue-500 rounded-md", className)}
        {...props}
        />
    ))
    TodoCard.displayName = "TodoCardId";

const TodoCardTitle = React.forwardRef<
    HTMLHeadingElement,
    React.HTMLAttributes<HTMLHeadingElement>
    >(({ className, ...props },ref) => (
        <h3 
            ref={ref}
            className={cn("bg-blue-500 rounded-md", className)}
        {...props}
        />
    ))
    TodoCard.displayName = "TodoCardTitle";

const TodoCardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
    >(({ className, ...props },ref) => (
        <p 
            ref={ref}
            className={cn("bg-blue-500 rounded-md", className)}
        {...props}
        />
    ))
    TodoCard.displayName = "TodoCardDescription";

export {TodoCard, TodoCardId, TodoCardTitle, TodoCardDescription}