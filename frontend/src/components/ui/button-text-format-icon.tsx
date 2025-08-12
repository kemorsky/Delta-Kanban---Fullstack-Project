import { cn } from "../../lib/utils";

type Props = {
    children: React.ReactNode,
    className?: string
}
export const ButtonTextFormatIcon: React.FC<Props> = ({className, children}: Props) => {
    return (
        <span className={cn("w-full group flex items-center justify-center relative", className)}>{children}</span>
    )
}

export const ButtonTextFormatTipTop: React.FC<Props> = ({className, children}: Props) => {
    return (
        <p className={cn('group-hover:visible invisible min-w-[3rem] bg-black opacity-75 rounded text-white text-[0.875rem] px-2 py-1 transform transition-colors absolute bottom-[2rem] z-1', className)}>{children}</p>
    )
}