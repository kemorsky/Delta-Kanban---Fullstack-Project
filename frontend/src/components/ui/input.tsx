import * as React from 'react';
import type { TextareaHTMLAttributes } from 'react';

import { cn } from "../../lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const InputLogin: React.FC<InputProps> = ({className, ...props}) => {
    return (
        <input type="text"
                className={cn("w-full text-base font-normal font-secondary rounded p-2 border-none focus:ring-1 focus:ring-gray-200 focus:outline-none shadow-sm transition-colors", className)}{...props}></input>
    )
}

export const InputEdit: React.FC<InputProps> = ({className, ...props}) => {
    return (
        <input type="text"
                className={cn("w-full max-w-[75%] font-secondary", className)}{...props}></input>
    )
}

export const TextAreaEdit: React.FC<TextareaHTMLAttributes<HTMLTextAreaElement>> = ({className, ...props}) => {
  return (
    <textarea
      className={cn("w-full min-h-[7rem] font-secondary", className)}
      {...props}
    ></textarea>
  )
}