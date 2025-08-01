import { Plus } from "lucide-react";
import { cn } from "../../lib/utils";
import { X } from 'lucide-react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const ButtonAddColumn: React.FC<ButtonProps> = ({className, ...props}) => {
    return <button className={cn("w-[18.75rem] p-2 flex flex-shrink-0 items-center justify-center text-base bg-[#1F2937] hover:bg-[#1F2937]/80 border-none transform transition-colors", className)}{...props}>
                <Plus className="w-[1.3125rem] h-[1.3125rem]"/>
                    Add column
            </button>;
};

export const ButtonDeleteColumn: React.FC<ButtonProps> = ({className, ...props}) => {
    return <button className={cn("p-2 bg-yellow-600 hover:bg-yellow-500", className)}{...props}></button>;
};

export const ButtonAddTodo: React.FC<ButtonProps> = ({className, ...props}) => {
    return <button className={cn("w-full p-2 flex items-center justify-center text-base hover:bg-blue-500 border-none transform transition-colors", className)}{...props}></button>;
};

export const ButtonDeleteTodo: React.FC<ButtonProps> = ({className, ...props}) => {
    return <button className={cn("w-full max-w-[7rem] p-2 flex items-center justify-center text-base bg-red-600 hover:bg-red-500 border-none transform transition-colors", className)}{...props}></button>;
};

export const ButtonDeleteLabel: React.FC<ButtonProps> = ({className, ...props}) => {
    return <button className={cn("w-[1.250rem] h-[1.250rem] flex items-center justify-center text-base bg-black/20 hover:bg-black/35 border-none rounded-full transform transition-colors", className)}{...props}>< X className="w-[0.75rem] h-[0.75rem]" /></button>;
};



