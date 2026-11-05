"use client";

import { useActionState } from "react";
import { sendSignInLink, type SignInState } from "./actions";

export function SignInForm({ next, linkError }: { next: string; linkError: boolean }) {
  const [state, action, pending] = useActionState<SignInState, FormData>(sendSignInLink, { status: "idle" });

  if (state.status === "sent") {
    return (
      <div className="done show" role="status">
        <strong>Check your email</strong>
        <span>
          We sent a sign-in link to {state.email}. Open it on this device and you&apos;re in. No password needed.
        </span>
      </div>
    );
  }

  return (
    <form action={action} noValidate style={{ display: "grid", gap: 16 }}>
      <input type="hidden" name="next" value={next} />
      <div className="f">
        <label htmlFor="sEmail">Email</label>
        <div className="news-row">
          <input type="email" id="sEmail" name="email" placeholder="you@company.com" autoComplete="email" required />
          <button className="btn p" type="submit" disabled={pending}>
            {pending ? "Sending..." : "Email me a link"}
          </button>
        </div>
      </div>
      <p className="err" role="alert">
        {state.status === "error" ? state.message : linkError ? "That link expired or was already used. Send a new one." : ""}
      </p>
    </form>
  );
}
