import React from 'react';
import DOMPurify from 'dompurify';

interface DisplayComponentProps {
    content?: string;
}

const DisplayComponent: React.FC<DisplayComponentProps> = ({ content }) => {
    const sanitizedContent = DOMPurify.sanitize(content as string); // Sanitize the content

    return (
        <div className='w-full'>
            <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
        </div>
    );
};

export default DisplayComponent;