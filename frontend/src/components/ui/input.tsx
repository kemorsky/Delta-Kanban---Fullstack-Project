import * as React from 'react';
import { EditorContent, type Editor } from '@tiptap/react';

import { cn } from "../../lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

type TextAreaEditorProps = {
  editor: Editor | null;
  className?: string;
};

export const InputLogin: React.FC<InputProps> = ({className, ...props}) => {
    return (
        <input type="text"
                className={cn("w-full bg-primary text-base font-normal font-secondary rounded p-2 border border-[#374151] hover:border-gray-500 focus:ring-1 focus:border-[#374151] active:ring-[#485fc7] focus:outline-none shadow-sm transform transition-all", className)}{...props}></input>
    )
}

export const InputEdit: React.FC<InputProps> = ({className, ...props}) => {
    return (
        <input type="text"
                className={cn("w-full font-secondary bg-primary px-2 rounded border border-transparent hover:border-[#485fc7] focus:ring-1 focus:ring-[#374151] focus:outline-none shadow-sm transform transition-colors", className)}{...props}></input>
    )
}

export const TextAreaEditor: React.FC<TextAreaEditorProps> = ({
  editor,
  className,
}) => {
  if (!editor) return null;

  return (
    <div
      className={cn(
        "w-full min-h-[7rem] bg-primary text-base font-normal font-secondary rounded-b p-2 border-r border-l border-b border-[#374151] hover:border-[#485fc7] focus:ring-1 focus:ring-[#374151] focus:outline-none shadow-sm transition-all cursor-text",
        className
      )}
    >
      <EditorContent
        editor={editor}
        className="w-full min-h-[6rem] outline-none bg-transparent text-white prose prose-invert"
      />
    </div>
  );
};