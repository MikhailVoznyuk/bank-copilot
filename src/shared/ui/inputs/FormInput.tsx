import {ChangeEvent} from "react";
import {cn} from "@/shared/lib/cn";

type Props = {
    id: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    value: string;
    placeholder?: string;
    autocomplete?: string;
    className?: string

}

export function FormInput({id, onChange, value, placeholder, autocomplete, className}: Props) {
    return (
        <input
            id={id}
            type={'text'}
            onChange={onChange}
            value={value}
            placeholder={placeholder}
            autoComplete={autocomplete}
            className={cn('p-1.5 text-black bg-foreground border-muted border-[0.5px] w-52 rounded-[10px]', className)}
        />
    )
}