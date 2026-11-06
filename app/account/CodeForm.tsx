"use client";

import { useActionState } from "react";
import { redeemCode, type CodeState } from "./actions";

export function CodeForm({ initialCode = "" }: { initialCode?: string }) {
  const [state, action, pending] = useActionState(redeemCode, { status: "idle" } as CodeState);

  return (
    <form action={action} noValidate>
      <div className="f">
        <label htmlFor="accessCode">Access code</label>
        <div className="news-row">
          <input
            type="text"
            id="accessCode"
            name="code"
            defaultValue={initialCode}
            placeholder="ABC-123"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
          />
          <button className="btn p" type="submit" disabled={pending}>
            {pending ? "Checking..." : "Add code"}
          </button>
        </div>
      </div>
      <p className="err" role="alert">
        {state.status === "error" ? state.message : ""}
      </p>
      <div className={`done${state.status === "done" ? " show" : ""}`} role="status">
        <strong>You&apos;re on Pro</strong>
        <span>Your code worked. Your plan above shows how long it runs.</span>
      </div>
    </form>
  );
}
