import { cn } from "../../lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const ButtonAddColumn: React.FC<ButtonProps> = ({className, ...props}) => {
    return <button className={cn("p-2 bg-blue-600 hover:bg-blue-500", className)}{...props}></button>;
};

export const ButtonDeleteColumn: React.FC<ButtonProps> = ({className, ...props}) => {
    return <button className={cn("p-2 bg-yellow-600 hover:bg-yellow-500", className)}{...props}></button>;
};

export const ButtonAddTodo: React.FC<ButtonProps> = ({className, ...props}) => {
    return <button className={cn("p-2 bg-blue-600 hover:bg-blue-500", className)}{...props}></button>;
};


