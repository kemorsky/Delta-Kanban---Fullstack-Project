type ColumnWrapperProps = {
    children: React.ReactNode,
    ref?: React.Ref<HTMLElement>,
    style?: React.CSSProperties
}

export default function ColumnWrapper({children}: ColumnWrapperProps) {
    return (
        <article className="w-full max-w-[28rem] h-full min-h-[28rem]
                 bg-red-200 flex flex-col rounded-xl gap-4 p-4">
                    {children}
        </article>
    )
}