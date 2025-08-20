import { cn } from "../../lib/utils";

type LabelProps = {
  className?: string;
  children: React.ReactNode;
};

export const Label:  React.FC<LabelProps> = ({className, children, ...props}) => {
    return <span className={cn("flex items-center justify-between gap-1 bg-blue-600 rounded px-2 py-1 text-sm border border-black", className)}{...props}>
                {children}
            </span>
};