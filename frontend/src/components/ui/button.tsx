import { Plus } from "lucide-react";
import { cn } from "../../lib/utils";
import { X, Trash2 } from 'lucide-react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const ButtonLogin: React.FC<ButtonProps> = ({className, ...props}) => {
    return <button className={cn("w-[10rem] p-2 font-secondary text-base rounded bg-green-500 hover:bg-green-600 border-none transform transition-colors", className)}{...props}>
                    Login
            </button>;
};

export const ButtonAddColumn: React.FC<ButtonProps> = ({className, ...props}) => {
    return <button className={cn("w-[18.75rem] p-2 flex flex-shrink-0 items-center justify-center text-base bg-[#1F2937] hover:bg-[#1F2937]/80 border-none transform transition-colors", className)}{...props}>
                <Plus className="w-[1.3125rem] h-[1.3125rem]"/>
                    Add column
            </button>;
};

export const ButtonDeleteColumn: React.FC<ButtonProps> = ({className, ...props}) => {
    return <button className={cn("flex p-2 bg-none border-red-500 hover:border-red-500 hover:bg-red-500 hover:text-white font-secondary font-semibold text-[0.875rem] text-red-200 transform transition-colors", className)}
                    {...props}>
                <Trash2 className="w-5 h-5 mr-1"/> Delete
            </button>
};

export const ButtonAddTodo: React.FC<ButtonProps> = ({className, ...props}) => {
    return <button className={cn("w-full p-2 flex items-center justify-center text-base hover:bg-blue-500 border-none transform transition-colors", className)}{...props}>
        <Plus className="w-[1.3125rem] h-[1.3125rem]" />Add Todo
    </button>
};

export const ButtonDeleteTodo: React.FC<ButtonProps> = ({className, ...props}) => {
    return <button className={cn("flex p-2 bg-none border-red-500 hover:border-red-500 hover:bg-red-500 hover:text-white font-secondary font-semibold text-[0.875rem] text-red-200 transform transition-colors", className)}
                    {...props}>
                <Trash2 className="w-5 h-5 mr-1"/> Delete Todo
            </button>
};

export const ButtonAddLabel: React.FC<ButtonProps> = ({className, ...props}) => {
    return <button className={cn("px-2 py-1 text-sm font-secondary bg-black/20 hover:bg-black/35 rounded transform transition-colors", className)}{...props}></button>
};

export const ButtonDeleteLabel: React.FC<ButtonProps> = ({className, ...props}) => {
    return <button className={cn("w-[1.250rem] h-[1.250rem] flex items-center justify-center text-base bg-black/20 hover:bg-black/35 border-none rounded-full transform transition-colors", className)}{...props}>< X className="w-[0.75rem] h-[0.75rem]" /></button>
};

export const ButtonCloseModal: React.FC<ButtonProps> = ({className, ...props}) => {
    return <button className={cn("w-[2.5rem] h-[2.5rem] flex items-center justify-center hover:bg-black/35 border-none rounded-xl transform transition-colors", className)}
                {...props}>
                < X className="w-[2rem] h-[2rem]" />
            </button>
};

export const ButtonTextFormat: React.FC<ButtonProps> = ({className, ...props}) => {
    return <button className={cn("w-[2rem] h-[2rem] bg-none rounded border border-transparent hover:border-gray-500 hover:bg-secondary/80 transform transition-colors", className)}{...props}></button>;
}



