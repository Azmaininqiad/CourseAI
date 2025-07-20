import React from 'react';

interface MarkdownRendererExampleProps {
  content: string;
}

const MarkdownRendererExample: React.FC<MarkdownRendererExampleProps> = ({ content }) => {
  return (
    <div className="markdown-content">
      {content}
    </div>
  );
};

export default MarkdownRendererExample; 