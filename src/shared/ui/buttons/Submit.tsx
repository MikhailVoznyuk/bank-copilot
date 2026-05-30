import { cn } from "@/shared/lib/cn";
import {ReactNode} from "react";
type Props = {
    className?: string;
    children: ReactNode;
}
export function Submit({className, children}: Props) {
    return (
        <button
            type="submit"
            className={cn('flex items-center justify-center bg-accent text-white cursor-pointer text-base px-3 py-1.5 rounded-full', className)}
        >
            {children}
        </button>
    )
}