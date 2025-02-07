import { CKEditor } from "ckeditor4-react";
import { useEffect, useState } from "react";

interface EditorFieldProps {
  initData: string;
  ref?: HTMLDivElement;
  onChange: (data: string) => void;
  config?: any; // Allow passing custom configuration
}

export const EditorField = ({initData, ref, onChange, config}: EditorFieldProps) => {
  const [editorInstance, setEditorInstance] = useState<any>(null); // Store editor instance


  useEffect(() => {
    if (editorInstance && initData) {
      editorInstance.setData(initData);
    }
  }, [editorInstance, initData]);

  const handleInstanceReady = (editor: any) => {
    setEditorInstance(editor);
  };

  const handleOnChange = (event: any) => {
    const data = event.editor.getData();
    onChange(data);
  };


  return (
    <>
      <CKEditor
        editorUrl="../../ckeditor"
        // initData={initData}
        data={initData}
        ref={ref}
        onChange={handleOnChange}
        onInstanceReady={handleInstanceReady}
        config={config}
        
  />
  </>);
}

// export default editorField;