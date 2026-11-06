"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { site } from "@/lib/site";
import { sendPrep, type FormState } from "../actions/forms";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const aiOptions = [
  { value: "claude", label: "Claude, paid" },
  { value: "chatgpt", label: "ChatGPT, paid" },
  { value: "free", label: "A free plan" },
  { value: "none", label: "None yet" },
];
const filesOptions = [
  { value: "google", label: "Google Drive" },
  { value: "dropbox", label: "Dropbox" },
  { value: "onedrive", label: "OneDrive" },
  { value: "computer", label: "On my computer" },
  { value: "mix", label: "A mix, or not sure" },
];
const comfortOptions = ["1", "2", "3", "4", "5"];
const laptopOptions = [
  { value: "mac", label: "Mac" },
  { value: "win", label: "Windows" },
  { value: "unsure", label: "Not sure" },
];

export function PrepForm() {
  const [state, action, pending] = useActionState(sendPrep, { status: "idle" } as FormState);
  const [clientError, setClientError] = useState("");
  const done = state.status === "done";

  // Check the basics before sending, so a typo doesn't clear the form.
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    const data = new FormData(e.currentTarget);
    const form = e.currentTarget;
    let problem = "";
    let field: HTMLElement | null = null;
    if (!String(data.get("name") ?? "").trim()) {
      problem = "Add your name so we know who is coming.";
      field = form.querySelector("#pName");
    } else if (!EMAIL.test(String(data.get("email") ?? "").trim())) {
      problem = "Add an email address like name@company.com.";
      field = form.querySelector("#pEmail");
    }
    setClientError(problem);
    if (problem) {
      e.preventDefault();
      field?.focus();
    }
  }

  return (
    <form className="panel rv" action={action} onSubmit={onSubmit} noValidate>
      <div>
        <h3>Session prep</h3>
        <p className="sub" style={{ marginTop: 8 }}>
          Three minutes. We use this to tailor the session and nothing else.
        </p>
      </div>
      <div className="fields">
        <div className="f">
          <label htmlFor="pName">Full name</label>
          <input type="text" id="pName" name="name" placeholder="Jordan Avery" autoComplete="name" />
        </div>
        <div className="f">
          <label htmlFor="pEmail">Email</label>
          <input type="email" id="pEmail" name="email" placeholder="jordan@yourcompany.com" autoComplete="email" />
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
        <fieldset className="f full">
          <legend>Where do most of your work files live?</legend>
          <div className="seg">
            {filesOptions.map((o) => (
              <label key={o.value}>
                <input type="radio" name="files" value={o.value} />
                <span>{o.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="f full">
          <label htmlFor="pCrm">Which CRM do you use?</label>
          <input type="text" id="pCrm" name="crm" placeholder="Follow Up Boss, kvCORE, a spreadsheet, none..." />
        </div>
        <fieldset className="f full">
          <legend>How comfortable are you with AI today? 1 is brand new, 5 is daily use</legend>
          <div className="seg">
            {comfortOptions.map((v) => (
              <label key={v}>
                <input type="radio" name="comfort" value={v} />
                <span>{v}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="f full">
          <label htmlFor="pPain">Biggest time sinks right now</label>
          <input type="text" id="pPain" name="timeSink" placeholder="Follow-ups, listing copy, paperwork..." />
        </div>
        <div className="f full">
          <label htmlFor="pRemember">Anything we should know before the session? (optional)</label>
          <input type="text" id="pRemember" name="remember" placeholder="One thing you'd like us to remember" />
        </div>
      </div>
      <label className="optin">
        <input type="checkbox" name="optin" />
        <span>
          Add me to {site.newsletterName}
          <small>
            {site.newsletterCadence} with prompts and AI updates that matter for your work. Unsubscribe anytime. See
            our <Link href="/privacy">privacy note</Link>.
          </small>
        </span>
      </label>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
      <p className="err" role="alert">
        {clientError || (state.status === "error" ? state.message : "")}
      </p>
      <div className={`done${done ? " show" : ""}`} role="status">
        <strong>Got it</strong>
        <span>{state.message ?? "Thanks. You're set for the session."}</span>
      </div>
      {!done && (
        <div>
          <button className="btn p" type="submit" disabled={pending}>
            {pending ? "Sending..." : "Send my answers"} <span className="arr">→</span>
          </button>
        </div>
      )}
    </form>
  );
}
