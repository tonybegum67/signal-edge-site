import type { Block, Part } from "@/lib/lessons";
import { CopyPrompt } from "./CopyPrompt";

function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case "text":
      return <p>{block.text}</p>;
    case "list":
      return (
        <ul className="ticks">
          {block.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      );
    case "apps":
      return (
        <div className="apps">
          <div>
            <span className="app">In Claude</span>
            <p>{block.apps.claude}</p>
          </div>
          <div>
            <span className="app">In ChatGPT</span>
            <p>{block.apps.chatgpt}</p>
          </div>
        </div>
      );
    case "prompt":
      return <CopyPrompt label={block.label} text={block.text} />;
    case "split":
      return (
        <div className="split">
          <div className="yes">
            <span className="app">{block.left.title}</span>
            <ul className="ticks">
              {block.left.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
          <div className="no">
            <span className="app">{block.right.title}</span>
            <ul className="ticks">
              {block.right.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        </div>
      );
    case "tip":
      return <p className="tip">{block.text}</p>;
  }
}

// One lesson's parts, numbered, in order.
export function LessonBody({ parts }: { parts: Part[] }) {
  return (
    <ol className="parts">
      {parts.map((part, i) => (
        <li key={part.title}>
          <span className="n">{String(i + 1).padStart(2, "0")}</span>
          <div className="part">
            <h2>{part.title}</h2>
            {part.blocks.map((b, j) => (
              <BlockView key={j} block={b} />
            ))}
          </div>
        </li>
      ))}
    </ol>
  );
}
