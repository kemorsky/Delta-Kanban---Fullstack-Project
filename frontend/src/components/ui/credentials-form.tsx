import { cn } from "../../lib/utils";

type Props = {
    className?: string,
    children: React.ReactNode,
    onSubmit: (e: React.FormEvent) => void
}

export const Form: React.FC<Props> = ({ className, onSubmit, children }: Props) => {
    return (
        <form 
            autoComplete="off" 
            onSubmit={onSubmit}
            className={cn("h-full max-h-[25rem] min-w-[23rem] max-w-[25rem] rounded-md bg-secondary p-4 flex flex-col items-center justify-start gap-4 shadow-[0px_0px_10px_0px_#2a4365]", className)}>
                {children}
        </form>
    )
}