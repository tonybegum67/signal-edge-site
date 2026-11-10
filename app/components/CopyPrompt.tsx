"use client";

import { useState } from "react";

// A ready-made prompt with a Copy button, so nobody has to retype it.
export function CopyPrompt({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the text is still there to select by hand.
    }
  }

  return (
    <figure className="prompt">
      <figcaption>
        <span>{label}</span>
        <button type="button" className="copy" onClick={copy} aria-live="polite">
          {copied ? "Copied" : "Copy"}
        </button>
      </figcaption>
      <p>{text}</p>
    </figure>
  );
}
