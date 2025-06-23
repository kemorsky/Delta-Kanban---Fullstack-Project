import * as React from 'react';

import { cn } from "../../lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const InputEdit: React.FC<InputProps> = ({className, ...props}) => {
    return (
        <input type="text"
                className={cn("w-full max-w-[75%]", className)}{...props}></input>
    )
}