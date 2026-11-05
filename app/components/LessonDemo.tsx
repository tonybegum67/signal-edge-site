"use client";

import { useState } from "react";

const tasks = [
  "Choose computer or cloud drive",
  "Create one Second Brain folder",
  "Separate personal notes from client data",
  "Check your brokerage's AI policy",
  "Install the desktop app",
  "Point it at your folder",
];

export function LessonDemo() {
  const [done, setDone] = useState<boolean[]>([true, true, false, false, false, false]);
  const count = done.filter(Boolean).length;

  return (
    <div className="lesson rv" aria-label="Sample lesson">
      <div className="top">
        <span>
          <b>Step 1</b> · Set up the house
        </span>
        <span>6 tasks · about 25 min</span>
      </div>
      <h3>Make one clean home for your brain</h3>
      <p>
        Pick where your files will live, make one folder for everything, and draw a hard line between your personal
        notes and anything about a client.
      </p>
      <div className="meter" aria-hidden="true">
        {tasks.map((t, i) => (
          <i key={t} className={i < count ? "y" : undefined} />
        ))}
      </div>
      <div className="checks">
        {tasks.map((t, i) => (
          <label className="chk" key={t}>
            <input
              type="checkbox"
              checked={done[i]}
              onChange={() => setDone((d) => d.map((v, j) => (j === i ? !v : v)))}
            />
            <span className="bx">[{String(i + 1).padStart(2, "0")}]</span>
            <span className="tx">{t}</span>
          </label>
        ))}
      </div>
      <div className="foot">
        <span className="count" aria-live="polite">
          <b>{count}</b> of 6 done{count === 6 ? " · Step 2 unlocked" : ""}
        </span>
        <span className="note">Tick a box to try it</span>
      </div>
    </div>
  );
}
