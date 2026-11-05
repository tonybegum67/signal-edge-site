"use client";

import { useState } from "react";

const steps = [
  { n: "STEP 01", title: "Assess", body: "We walk your workflow and your data, then pick the one number that would matter most if it moved.", out: "An opportunity map and a target metric" },
  { n: "STEP 02", title: "Design", body: "We map the target to the data you own and design the agent, automation or assistant that moves it.", out: "A build plan your team signs off on" },
  { n: "STEP 03", title: "Build", body: "We build it inside your existing tools, test it with your people and fix what trips them up.", out: "A working system, live with your team" },
  { n: "STEP 04", title: "Run", body: "We keep it current as tools change, train new people and report the number every month.", out: "A monthly results report" },
];

export function HowWeWork() {
  const [active, setActive] = useState(0);
  return (
    <div className="steps4 rv">
      {steps.map((s, i) => (
        <div key={s.n} className={`st${i === active ? " on" : ""}`} onMouseEnter={() => setActive(i)}>
          <span className="bar" />
          <span className="n">{s.n}</span>
          <h3>{s.title}</h3>
          <p>{s.body}</p>
          <div className="out">
            <b>YOU GET</b>
            {s.out}
          </div>
        </div>
      ))}
    </div>
  );
}
