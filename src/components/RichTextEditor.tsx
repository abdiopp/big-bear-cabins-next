"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import "react-quill-new/dist/quill.snow.css";

// Dynamic import to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="h-64 border rounded-md flex items-center justify-center text-muted-foreground animate-pulse bg-gray-50">
      Loading editor...
    </div>
  ),
});

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["blockquote", "code-block"],
    ["link", "image"],
    ["clean"],
  ],
  clipboard: {
    // Preserve formatting when pasting from Word/Docs
    matchVisual: false,
  },
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "list",
  "indent",
  "align",
  "blockquote",
  "code-block",
  "link",
  "image",
];

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your content here...",
  minHeight = "400px",
}: RichTextEditorProps) {
  const quillStyles = useMemo(
    () => ({
      marginBottom: "0px",
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
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <style jsx global>{`
        .rich-text-editor {
          position: relative;
          z-index: 40;
          border-radius: 0.5rem;
          border: 1px solid hsl(var(--border, 214.3 31.8% 91.4%));
        }
        .rich-text-editor .ql-toolbar {
          border: none;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
          padding: 8px 12px;
          flex-wrap: wrap;
          gap: 2px;
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
        }
        .rich-text-editor .ql-container {
          border: none;
          font-size: 16px;
          font-family: inherit;
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
        }
        .rich-text-editor .ql-tooltip {
          z-index: 50 !important;
        }
        .rich-text-editor .ql-editor {
          min-height: ${minHeight};
          padding: 16px;
          line-height: 1.75;
          color: #111827;
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
          left: 16px;
        }
        /* Paragraph spacing */
        .rich-text-editor .ql-editor p {
          margin-bottom: 1em;
        }
        /* Empty paragraphs (blank lines): Quill uses <p><br></p> */
        .rich-text-editor .ql-editor p:has(> br:only-child),
        .rich-text-editor .ql-editor p:empty {
          min-height: 1.5em;
          margin-bottom: 0;
        }
        /* Heading styles */
        .rich-text-editor .ql-editor h1 { font-size: 2em; font-weight: 700; margin: 1em 0 0.5em; }
        .rich-text-editor .ql-editor h2 { font-size: 1.5em; font-weight: 700; margin: 1em 0 0.5em; }
        .rich-text-editor .ql-editor h3 { font-size: 1.25em; font-weight: 600; margin: 1em 0 0.5em; }
        .rich-text-editor .ql-editor h4 { font-size: 1.1em; font-weight: 600; margin: 1em 0 0.5em; }
        /* List styles */
        .rich-text-editor .ql-editor ul,
        .rich-text-editor .ql-editor ol {
          padding-left: 1.5em;
          margin-bottom: 1em;
        }
        .rich-text-editor .ql-editor ul li { list-style-type: disc; }
        .rich-text-editor .ql-editor ol li { list-style-type: decimal; }
        /* Blockquote */
        .rich-text-editor .ql-editor blockquote {
          border-left: 4px solid #22c55e;
          margin: 1em 0;
          padding: 0.5em 1em;
          background: #f0fdf4;
          color: #374151;
          font-style: italic;
          border-radius: 0 0.25rem 0.25rem 0;
        }
        /* Code block */
        .rich-text-editor .ql-editor pre.ql-syntax {
          background: #1e1e2e;
          color: #cdd6f4;
          border-radius: 0.5rem;
          padding: 1em;
          font-family: ui-monospace, monospace;
          font-size: 0.875em;
          overflow-x: auto;
          margin: 1em 0;
        }
        /* Links */
        .rich-text-editor .ql-editor a {
          color: #477023;
          text-decoration: underline;
        }
        /* Images */
        .rich-text-editor .ql-editor img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1em 0;
        }
        /* Strong / em */
        .rich-text-editor .ql-editor strong { font-weight: 700; }
        .rich-text-editor .ql-editor em { font-style: italic; }
      `}</style>
    </div>
  );
}
