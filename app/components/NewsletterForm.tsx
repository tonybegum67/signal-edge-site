"use client";

import { useActionState, useState } from "react";
import { site } from "@/lib/site";
import { subscribe, type FormState } from "../actions/forms";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterForm() {
  const [state, action, pending] = useActionState(subscribe, { status: "idle" } as FormState);
  const [clientError, setClientError] = useState("");
  const done = state.status === "done";

  // Check the address before sending, so a typo doesn't clear the box.
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    const email = String(new FormData(e.currentTarget).get("email") ?? "").trim();
    const problem = EMAIL.test(email) ? "" : "Add an email address like name@company.com.";
    setClientError(problem);
    if (problem) e.preventDefault();
  }

  return (
    <form action={action} onSubmit={onSubmit} noValidate>
      {!done && (
        <div className="f">
          <label htmlFor="nEmail">Email</label>
          <div className="news-row">
            <input type="email" id="nEmail" name="email" placeholder="you@company.com" autoComplete="email" />
            <button className="btn p" type="submit" disabled={pending}>
              {pending ? "Adding..." : `Get ${site.newsletterName}`}
            </button>
          </div>
        </div>
      )}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
      <p className="err" role="alert">
        {clientError || (state.status === "error" ? state.message : "")}
      </p>
      <div className={`done${done ? " show" : ""}`} role="status">
        <strong>{state.already ? "Already on the list" : "You're on the list"}</strong>
        <span>
          {state.already
            ? "Good news, you're already getting it. Watch your inbox for the next issue."
            : "Watch your inbox for the next issue."}
        </span>
      </div>
    </form>
  );
}
