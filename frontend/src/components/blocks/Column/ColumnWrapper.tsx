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
                className="w-full max-w-[22rem] h-full min-h-[28rem]
                        bg-red-200 flex flex-col rounded-xl gap-4"
                >
                    {children}
        </article>
        )
    }
);