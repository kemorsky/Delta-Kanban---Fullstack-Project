import * as React from 'react';
import type { TextareaHTMLAttributes } from 'react';

import { cn } from "../../lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const InputEdit: React.FC<InputProps> = ({className, ...props}) => {
    return (
        <input type="text"
                className={cn("w-full max-w-[75%] font-secondary", className)}{...props}></input>
    )
}

export const TextAreaEdit: React.FC<TextareaHTMLAttributes<HTMLTextAreaElement>> = ({className, ...props}) => {
  return (
    <textarea
      className={cn("w-full max-w-[75%] font-secondary", className)}
      {...props}
    />
  )
}