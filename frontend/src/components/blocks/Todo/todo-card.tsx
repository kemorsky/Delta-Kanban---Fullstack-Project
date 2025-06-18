import * as React from "react"
import { cn } from "../../../lib/utils";

const TodoCard = React.forwardRef<
    HTMLElement,
    React.HTMLAttributes<HTMLElement>
    >(({ className, ...props },ref) => (
        <article 
            ref={ref}
            className={cn("bg-blue-500 rounded-md p-2 cursor-grab", className)}
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
            className={cn("bg-blue-500 rounded-md p-2", className)}
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
            className={cn("bg-blue-500 rounded-md p-2", className)}
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
            className={cn("bg-blue-500 rounded-md p-2", className)}
        {...props}
        />
    ))
    TodoCard.displayName = "TodoCardDescription";

    export {TodoCard, TodoCardId, TodoCardTitle, TodoCardDescription}