"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import "react-quill-new/dist/quill.snow.css";

// Dynamic import to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), {
    ssr: false,
    loading: () => (
        <div className="h-64 border rounded-md flex items-center justify-center text-muted-foreground">
            Loading editor...
        </div>
    ),
});

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["blockquote", "link"],
        ["clean"],
    ],
};

const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "blockquote",
    "link",
];

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({
    value,
    onChange,
    placeholder = "Write your content here...",
}: RichTextEditorProps) {
    const quillStyles = useMemo(
        () => ({
            height: "300px",
            marginBottom: "50px",
        }),
        []
    );

    return (
        <div className="rich-text-editor">
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
                style={quillStyles}
            />
            <style jsx global>{`
        .rich-text-editor .ql-container {
          font-size: 16px;
          font-family: inherit;
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
        }
        .rich-text-editor .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          background: #f9fafb;
        }
        .rich-text-editor .ql-editor {
          min-height: 200px;
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
      `}</style>
        </div>
    );
}
