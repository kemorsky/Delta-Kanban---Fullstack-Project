import * as React from 'react';

type ColumnWrapperProps = {
    children: React.ReactNode,
    ref?: React.Ref<HTMLElement>,
    style?: React.CSSProperties
}

export const ColumnWrapper = React.forwardRef<HTMLElement, ColumnWrapperProps>(({children, style}, ref) => {
    return (
        <article 
                ref={ref}
                style={style}
                className="w-full max-w-[18.75rem] h-full bg-[#1F2937] flex flex-shrink-0 flex-col rounded-xl gap-4 p-2"
                >
                    {children}
        </article>
        )
    }
);