import { Description, Field, Input, Label, Dialog, Transition } from '@headlessui/react'
import clsx from 'clsx'
import React, {useState, ChangeEvent} from 'react'
import UseApi from '../../hooks/UseApi';


type ImageFieldProps = {
    multiple?: boolean;
    onChange?: () => React.ChangeEvent<ImageFieldProps> | undefined;
    // Fieldref?: React.RefObject<HTMLInputElement>;
    error?: () => string;
}


export const ImageUpload = ({multiple = false, onChange, error}: ImageFieldProps ) => {

  return (
    <>

        <input
        type="file"
        accept="image/*"
        // ref={Fieldref}
        onError={error}
        multiple={multiple}
        onChange={onChange}
        className="mt-4"
        />


    
        
    
    </>
  )
}
