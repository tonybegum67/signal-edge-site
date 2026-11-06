"use client";

import { useState } from "react";
import { site } from "@/lib/site";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterForm() {
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "").trim();
    if (!EMAIL.test(email)) {
      setError("Add an email address like name@company.com.");
      return;
    }
    setError("");
    setDone(true);
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="f">
        <label htmlFor="nEmail">Email</label>
        <div className="news-row">
          <input type="email" id="nEmail" name="email" placeholder="you@company.com" autoComplete="email" />
          <button className="btn p" type="submit">
            Get {site.newsletterName}
          </button>
        </div>
      </div>
      <p className="err" role="alert">
        {error}
      </p>
      <div className={`done${done ? " show" : ""}`} role="status">
        <strong>You&apos;re on the list</strong>
        <span>{site.formsLive ? "Watch your inbox for the next issue." : "This preview doesn't save sign-ups yet."}</span>
      </div>
    </form>
  );
}
