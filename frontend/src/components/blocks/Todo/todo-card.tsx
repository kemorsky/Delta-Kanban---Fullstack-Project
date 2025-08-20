import * as React from "react"
import { cn } from "../../../lib/utils";
import type { Todo } from "../../../types/types";

type TodoCardProps = React.HTMLAttributes<HTMLElement> & {
    children: React.ReactNode,
    ref?: React.Ref<HTMLElement>,
    todo: Todo,
};

const TodoCard = React.forwardRef<HTMLElement, TodoCardProps
    >(({ className, ...props }, ref) => (
        <article 
            ref={ref}
            className={cn("w-[282px] bg-primary rounded-md flex flex-col p-2 gap-1 cursor-pointer relative border border-transparent hover:border hover:border-[#4073ffb0] transition-colors transform", className)}
        {...props}
        />
    ))
    TodoCard.displayName = "TodoCard";

const TodoCardId = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
    >(({ className, ...props }, ref) => (
        <span 
            ref={ref}
            className={cn("font-secondary text-[0.875rem] text-white/50", className)}
        {...props}
        />
    ))
    TodoCard.displayName = "TodoCardId";

const TodoCardTitle = React.forwardRef<
    HTMLHeadingElement,
    React.HTMLAttributes<HTMLHeadingElement>
    >(({ className, ...props }, ref) => (
        <h3 
            ref={ref}
            className={cn("font-secondary truncate", className)}
        {...props}
        />
    ))
    TodoCard.displayName = "TodoCardTitle";

const TodoCardDoneTag = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
    >(({ className, ...props }, ref) => (
        <span 
            ref={ref}
            className={cn("font-secondary text-[0.875rem] w-12 h-[1.3125rem] text-center rounded bg-green-700", className)}
        {...props}
        />
    ))
    TodoCard.displayName = "TodoCardDoneTag";

const TodoCardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
    >(({ className, ...props }, ref) => (
        <p 
            ref={ref}
            className={cn("rounded-md", className)}
        {...props}
        />
    ))
    TodoCard.displayName = "TodoCardDescription";

export {TodoCard, TodoCardId, TodoCardTitle, TodoCardDoneTag, TodoCardDescription}