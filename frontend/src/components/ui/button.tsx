import { cn } from "../../lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const ButtonAddColumn: React.FC<ButtonProps> = ({className, ...props}) => {
    return <button className={cn("w-[18.75rem] p-2 flex flex-shrink-0 items-center justify-center text-base bg-[#1F2937] hover:bg-[#1F2937]/80 border-none transform transition-colors", className)}{...props}></button>;
};

export const ButtonDeleteColumn: React.FC<ButtonProps> = ({className, ...props}) => {
    return <button className={cn("p-2 bg-yellow-600 hover:bg-yellow-500", className)}{...props}></button>;
};

export const ButtonAddTodo: React.FC<ButtonProps> = ({className, ...props}) => {
    return <button className={cn("w-full p-2 flex items-center justify-center text-base hover:bg-blue-500 border-none transform transition-colors", className)}{...props}></button>;
};


