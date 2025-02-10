import { CKEditor } from "ckeditor4-react";
import { useEffect, useState } from "react";
import { string } from "yup";


interface EditorFieldProps {
  initData?: string;
  ref?: HTMLDivElement;
  onChange?: (event: any) => void;
  config?: any; // Allow passing custom configuration
}

export const EditorField = ({initData, ref, onChange, config}: EditorFieldProps) => {
  // contentsCss = '../../ckstyledescription.css'
  return (
    <>
      <CKEditor
        // editorUrl="../../ckeditor"
        initData={initData}
        ref={ref}
        onChange={onChange}
        config={config}
      />
  </>);
}
