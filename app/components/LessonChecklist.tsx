"use client";

import { useSyncExternalStore } from "react";

const EVENT = "se-steps";

function read(key: string) {
  try {
    return localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

// The "you're done when" list at the end of a lesson. Ticks are kept on this device only.
export function LessonChecklist({ step, tasks, next }: { step: number; tasks: string[]; next?: string }) {
  const key = `se-step-${step}`;
  const raw = useSyncExternalStore(subscribe, () => read(key), () => "");

  let done: boolean[] = tasks.map(() => false);
  try {
    const saved = raw ? JSON.parse(raw) : null;
    if (Array.isArray(saved) && saved.length === tasks.length) done = saved.map(Boolean);
  } catch {
    // Unreadable ticks: start fresh.
  }

  function toggle(i: number) {
    const nextDone = done.map((v, j) => (j === i ? !v : v));
    try {
      localStorage.setItem(key, JSON.stringify(nextDone));
      window.dispatchEvent(new Event(EVENT));
    } catch {
      // Storage blocked: nothing to save on this device.
    }
  }

  const count = done.filter(Boolean).length;
  const all = count === tasks.length;

  return (
    <div className="lesson" aria-label={`Step ${step} checklist`}>
      <div className="top">
        <span>
          <b>Step {step}</b> · You&apos;re done when
        </span>
        <span>
          {tasks.length} tasks
        </span>
      </div>
      <div className="meter" aria-hidden="true" style={{ gridTemplateColumns: `repeat(${tasks.length},1fr)` }}>
        {tasks.map((t, i) => (
          <i key={t} className={i < count ? "y" : undefined} />
        ))}
      </div>
      <div className="checks">
        {tasks.map((t, i) => (
          <label className="chk" key={t}>
            <input type="checkbox" checked={done[i]} onChange={() => toggle(i)} />
            <span className="bx">[{String(i + 1).padStart(2, "0")}]</span>
            <span className="tx">{t}</span>
          </label>
        ))}
      </div>
      <div className="foot">
        <span className="count" aria-live="polite">
          <b>{count}</b> of {tasks.length} done{all && next ? ` · ${next}` : ""}
        </span>
        <span className="note">Saved on this device</span>
      </div>
    </div>
  );
}
