"use client";

import Link from "next/link";
import { useState } from "react";
import { Wordmark } from "./Wordmark";

const links = [
  { href: "/#how", label: "How we work" },
  { href: "/#industries", label: "Industries" },
  { href: "/#results", label: "Results" },
  { href: "/#steps", label: "Steps" },
  { href: "/#newsletter", label: "Newsletter" },
];

export function Nav({ signedIn = false }: { signedIn?: boolean }) {
  const member = signedIn
    ? [
        { href: "/steps", label: "My Steps" },
        { href: "/account", label: "My account" },
      ]
    : [{ href: "/sign-in", label: "Sign in" }];
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <nav className="nav" aria-label="Main">
      <div className="in">
        <Wordmark href="/" />
        <div className="links">
          {links.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
          {member.map((m) => (
            <Link key={m.href} href={m.href}>
              {m.label}
            </Link>
          ))}
        </div>
        <Link className="btn p desk" href="/#prep">
          Book a session
        </Link>
        <button
          className="menu-btn"
          type="button"
          aria-expanded={open}
          aria-controls="mobileMenu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      <div className={`mobile-menu${open ? " open" : ""}`} id="mobileMenu">
        <div className="in">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={close}>
              {l.label}
            </Link>
          ))}
          {member.map((m) => (
            <Link key={m.href} href={m.href} onClick={close}>
              {m.label}
            </Link>
          ))}
          <Link className="btn p" href="/#prep" onClick={close}>
            Book a session
          </Link>
        </div>
      </div>
    </nav>
  );
}
