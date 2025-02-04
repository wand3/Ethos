import { Description, Field, Input, Label } from '@headlessui/react'
import clsx from 'clsx'
import React from 'react'


type InputFieldProps = {
    value: string;
    name: string;
    label?: string;
    type?: string;
    placeholder?: string;
    error?: string;
    description?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    Fieldref?: React.RefObject<HTMLInputElement>;
}


export const InputField = ({ name, label, type, placeholder, error, Fieldref, onChange, description}: InputFieldProps
    ) => {


    return(
    
        <>
            <div className="w-full max-w-md px-4">
                { label && (
                <Field>
                    <Label className="text-sm font-medium" htmlFor={name}>{label}</Label>
                    <Input 
                    placeholder={placeholder}
                    type={type}
                    ref={Fieldref}
                    onChange={onChange}
                    className={clsx(
                        'mt-3 block w-full rounded-lg border-none py-2 mb-1 px-3 text-sm bg-white/5',
                        'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                    )}
                    />
                    <Description>
                        {description && <p className="mb-2 text-sm/3 text-gray-400">{description}</p>}
                     </Description>
                </Field>
                )}
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

            </div>
        </>
    
    )

}

export default InputField;