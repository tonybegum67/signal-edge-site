import Link from "next/link";

export function Wordmark({ href = "#top" }: { href?: string }) {
  return (
    <Link className="wm" href={href} aria-label="Signal-Edge AI home">
      <span>Signal</span>
      <svg viewBox="0 0 24 16" aria-hidden="true">
        <path
          d="M1 9h6l2.5-7 4 13 2.5-6H23"
          fill="none"
          stroke="#FFB23E"
          strokeWidth="2.4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
      <span>Edge</span>
      <span className="ai">AI</span>
    </Link>
  );
}
