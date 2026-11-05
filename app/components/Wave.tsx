"use client";

import { useEffect, useRef } from "react";

type WaveOptions = {
  base: number;
  calm: number;
  amp: number;
  peak: number;
  layers: number;
  speed: number;
};

// The brand waveform: noisy data on the left resolves into one clean amber pulse at the edge.
export function Wave({ options, ...rest }: { options: WaveOptions } & React.CanvasHTMLAttributes<HTMLCanvasElement>) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const o = options;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let last = 0;
    let frame = 0;

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const noise = (x: number, t: number) =>
      Math.sin(x * 0.021 + t * 1.6) * 0.55 + Math.sin(x * 0.067 - t * 2.2) * 0.3 + Math.sin(x * 0.15 + t * 3.3) * 0.15;

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const base = h * o.base;
      const calm = w * o.calm;
      const end = w * 0.86;
      const amp = h * o.amp;
      const g = ctx.createLinearGradient(0, 0, w, 0);
      g.addColorStop(0, "rgba(111,124,142,0.10)");
      g.addColorStop(0.55, "rgba(142,155,173,0.5)");
      g.addColorStop(0.74, "rgba(255,178,62,0.9)");
      g.addColorStop(1, "rgba(255,178,62,1)");
      for (let layer = o.layers - 1; layer >= 0; layer--) {
        ctx.beginPath();
        const off = layer * 0.9;
        const la = 1 - layer * 0.28;
        for (let x = 0; x <= w; x += 3) {
          let y = base;
          if (x < calm) {
            const a = amp * (1 - x / calm) * la + 2;
            y = base + noise(x + layer * 40, t + off) * a;
          } else if (x < end) {
            const p = (x - calm) / (end - calm);
            const pk = h * o.peak * la;
            let pu = 0;
            if (p > 0.38 && p < 0.5) pu = -((p - 0.38) / 0.12) * pk;
            else if (p >= 0.5 && p < 0.62) pu = -pk + ((p - 0.5) / 0.12) * pk * 1.35;
            else if (p >= 0.62 && p < 0.72) pu = pk * 0.35 - ((p - 0.62) / 0.1) * pk * 0.35;
            y = base + pu;
          }
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = layer === 0 ? g : `rgba(111,124,142,${0.16 - layer * 0.05})`;
        ctx.lineWidth = layer === 0 ? 2.2 : 1.2;
        ctx.shadowColor = layer === 0 ? "rgba(255,178,62,0.35)" : "transparent";
        ctx.shadowBlur = layer === 0 ? 10 : 0;
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
      const r = 4 + Math.sin(t * 3) * 1.2;
      ctx.beginPath();
      ctx.arc(w - 10, base, r + 6, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,178,62,0.15)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(w - 10, base, r, 0, Math.PI * 2);
      ctx.fillStyle = "#FFB23E";
      ctx.fill();
    };

    const onResize = () => {
      size();
      draw(last);
    };
    size();
    draw(0);
    window.addEventListener("resize", onResize);

    if (!reduce) {
      const t0 = performance.now();
      const loop = (now: number) => {
        last = ((now - t0) / 1000) * o.speed;
        draw(last);
        frame = requestAnimationFrame(loop);
      };
      frame = requestAnimationFrame(loop);
    }
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frame);
    };
  }, [options]);

  return <canvas ref={ref} aria-hidden="true" {...rest} />;
}
