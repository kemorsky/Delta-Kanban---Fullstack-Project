import { } from "lucide-react";
import { cn } from "../../lib/utils";
import { Plus, X, Trash2 } from 'lucide-react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const ButtonLogin: React.FC<ButtonProps> = ({className, ...props}) => {
    return <button className={cn("w-[7rem] px-4 py-2 mt-2 self-end text-base font-secondary hover:text-white/75 bg-[#485fc7] hover:bg-[#485fc7]/80 border-none transform transition-colors", className)}{...props}>
                    Login
            </button>;
};

export const ButtonLogout: React.FC<ButtonProps> = ({className, ...props}) => {
    return <button className={cn("px-4 py-2 text-base font-secondary hover:text-white/75 bg-secondary hover:bg-secondary/80 border-none rounded transform transition-colors", className)}{...props}>
                    Logout
            </button>;
};

export const ButtonAddColumn: React.FC<ButtonProps> = ({className, ...props}) => {
    return <button className={cn("w-[18.75rem] p-2 flex flex-shrink-0 items-center justify-center font-secondary hover:text-white/75 text-base bg-secondary hover:bg-secondary/80 border-none transform transition-colors", className)}{...props}>
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
    return <button className={cn("w-full p-2 flex flex-shrink-0 items-center justify-center font-secondary hover:text-white/75 text-base bg-none hover:bg-primary/80 border-none transform transition-colors", className)}{...props}>
        <Plus className="w-[1.3125rem] h-[1.3125rem]" />Add Todo
    </button>
};

export const ButtonEditTodoDescription: React.FC<ButtonProps> = ({className, ...props}) => {
    return <button className={cn("w-[5rem] text-center p-2 bg-none border-green-700 hover:border-green-700 hover:bg-green-600 hover:text-white font-secondary font-semibold text-[0.875rem] text-green-200 transform transition-colors mt-2", className)}{...props}>
                Save
            </button>
};

export const ButtonDeleteTodo: React.FC<ButtonProps> = ({className, ...props}) => {
    return <button className={cn("flex p-2 bg-none border-red-500 hover:border-red-500 hover:bg-red-500 hover:text-white font-secondary font-semibold text-[0.875rem] text-red-200 transform transition-colors", className)}
                    {...props}>
                <Trash2 className="w-5 h-5 mr-1"/> Delete Todo
            </button>
};

export const ButtonAddLabel: React.FC<ButtonProps> = ({className, ...props}) => {
    return <button className={cn("flex justify-center items-center px-2 py-1 text-sm font-secondary bg-black/20 hover:bg-black/35 rounded transform transition-colors", className)}{...props}></button>
};

export const ButtonDeleteLabel: React.FC<ButtonProps> = ({className, ...props}) => {
    return <button className={cn("w-[1.250rem] h-[1.250rem] flex items-center justify-center text-base bg-black/20 hover:bg-black/35 border border-transparent hover:border-[#485fc7] rounded-full transform transition-colors", className)}{...props}>< X className="w-[0.75rem] h-[0.75rem]" /></button>
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



