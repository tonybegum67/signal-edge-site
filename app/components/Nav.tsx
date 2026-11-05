"use client";

import { useState } from "react";
import { Wordmark } from "./Wordmark";

const links = [
  { href: "#how", label: "How we work" },
  { href: "#industries", label: "Industries" },
  { href: "#results", label: "Results" },
  { href: "#steps", label: "Steps" },
  { href: "#newsletter", label: "Newsletter" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <nav className="nav" aria-label="Main">
      <div className="in">
        <Wordmark />
        <div className="links">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </div>
        <a className="btn p desk" href="#prep">
          Book a session
        </a>
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
            <a key={l.href} href={l.href} onClick={close}>
              {l.label}
            </a>
          ))}
          <a className="btn p" href="#prep" onClick={close}>
            Book a session
          </a>
        </div>
      </div>
    </nav>
  );
}
