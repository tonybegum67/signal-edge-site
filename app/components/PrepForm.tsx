"use client";

import { useRef, useState } from "react";
import { site } from "@/lib/site";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const aiOptions = [
  { value: "claude", label: "Claude, paid" },
  { value: "chatgpt", label: "ChatGPT, paid" },
  { value: "free", label: "A free plan" },
  { value: "none", label: "None yet" },
];
const laptopOptions = [
  { value: "mac", label: "Mac" },
  { value: "win", label: "Windows" },
  { value: "unsure", label: "Not sure" },
];

export function PrepForm() {
  const [error, setError] = useState("");
  const [doneText, setDoneText] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    if (!name) {
      setError("Add your name so we know who is coming.");
      nameRef.current?.focus();
      return;
    }
    if (!EMAIL.test(email)) {
      setError("Add an email address like name@company.com.");
      emailRef.current?.focus();
      return;
    }
    setError("");
    const optIn = data.get("optin") === "on";
    // Supabase hookup comes in the forms update; until then nothing is stored.
    setDoneText(
      `Thanks, ${name.split(" ")[0]}. You're set for the session${optIn ? ` and on ${site.newsletterName}` : ""}.` +
        (site.formsLive ? "" : " This preview doesn't save answers yet."),
    );
  }

  return (
    <form className="panel rv" onSubmit={onSubmit} noValidate>
      <div>
        <h3>Session prep</h3>
        <p className="sub" style={{ marginTop: 8 }}>
          Two minutes. We use this to tailor the session and nothing else.
        </p>
      </div>
      <div className="fields">
        <div className="f">
          <label htmlFor="pName">Full name</label>
          <input ref={nameRef} type="text" id="pName" name="name" placeholder="Jordan Avery" autoComplete="name" />
        </div>
        <div className="f">
          <label htmlFor="pEmail">Email</label>
          <input ref={emailRef} type="email" id="pEmail" name="email" placeholder="jordan@yourcompany.com" autoComplete="email" />
        </div>
        <div className="f">
          <label htmlFor="pCo">Company</label>
          <input type="text" id="pCo" name="company" placeholder="Your brokerage or company" autoComplete="organization" />
        </div>
        <div className="f">
          <label htmlFor="pRole">Role</label>
          <select id="pRole" name="role" defaultValue="">
            <option value="">Choose one</option>
            <option>Agent</option>
            <option>Team lead or broker</option>
            <option>Operations or admin</option>
            <option>Business owner</option>
            <option>Other</option>
          </select>
        </div>
        <fieldset className="f full">
          <legend>Which AI do you use today?</legend>
          <div className="seg">
            {aiOptions.map((o) => (
              <label key={o.value}>
                <input type="radio" name="ai" value={o.value} />
                <span>{o.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="f full">
          <legend>Laptop you&apos;ll bring</legend>
          <div className="seg">
            {laptopOptions.map((o) => (
              <label key={o.value}>
                <input type="radio" name="laptop" value={o.value} />
                <span>{o.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="f full">
          <label htmlFor="pPain">Biggest time sink right now</label>
          <input type="text" id="pPain" name="timeSink" placeholder="Follow-ups, listing copy, paperwork..." />
        </div>
      </div>
      <label className="optin">
        <input type="checkbox" name="optin" defaultChecked />
        <span>
          Add me to {site.newsletterName}
          <small>{site.newsletterCadence} with prompts and AI updates that matter for your work. Unsubscribe anytime.</small>
        </span>
      </label>
      <p className="err" role="alert">
        {error}
      </p>
      <div className={`done${doneText ? " show" : ""}`} role="status">
        <strong>Got it</strong>
        <span>{doneText}</span>
      </div>
      <div>
        <button className="btn p" type="submit">
          Send my answers <span className="arr">→</span>
        </button>
      </div>
    </form>
  );
}
