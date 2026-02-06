"use client";

import { useState } from "react";
import { Heading } from "@/components/layout/heading.component";
import { cn } from "@/utils/cn.util";

type CodeBlockProps = {
  heading?: string | null;
  description?: string | null;
  code?: string | null;
  language?: string | null;
  /** When true, heading and description are hidden (used in portable text context) */
  codeOnly?: boolean;
};

export const CodeBlock = (props: CodeBlockProps) => {
  const { heading, description, code, language, codeOnly } = props;

  if (!code) return null;

  const showHeader = !codeOnly && (heading || description);

  return (
    <div className="flex flex-col gap-md">
      {showHeader && (
        <div className="flex flex-col gap-[10px]">
          {heading && (
            <Heading level={3} size={3}>
              {heading}
            </Heading>
          )}
          {description && (
            <p className="text-base leading-[145%] text-text-primary">{description}</p>
          )}
        </div>
      )}
      <CodeBox code={code} language={language} />
    </div>
  );
};

type CodeBoxProps = {
  code: string;
  language?: string | null;
};

const CodeBox = ({ code }: CodeBoxProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-sm rounded bg-container-tertiary-2 p-xs">
      <pre className="overflow-x-auto">
        <code className="font-mono text-base leading-[150%] text-text-primary whitespace-pre-wrap">
          {code}
        </code>
      </pre>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            "rounded-3xs border border-buttons-secondary-stroke px-sm py-2xs text-base leading-[145%] text-buttons-secondary-text transition-colors",
            "hover:border-buttons-secondary-stroke-hover hover:text-buttons-secondary-text-hover",
          )}
        >
          {copied ? "Copied!" : "Copy code"}
        </button>
      </div>
    </div>
  );
};
