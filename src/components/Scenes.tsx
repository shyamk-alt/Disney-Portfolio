import { motion, MotionValue, useTransform } from "framer-motion";
import { Fragment, ReactNode } from "react";
import { portfolio } from "../data/portfolio";
import type { Scene } from "../data/film";

const RAMP = 0.016;

/** Whole-scene envelope: drifts in out of focus, settles, then floats past the camera. */
function useEnvelope(p: MotionValue<number>, a: number, b: number, hold = false, travel = 50) {
  const end = hold ? 99 : b;
  const opacity = useTransform(p, [a, a + RAMP, end - RAMP, end], [0, 1, 1, 0]);
  const blurV = useTransform(p, [a, a + RAMP * 1.3, end - RAMP, end], [16, 0, 0, 18]);
  const filter = useTransform(blurV, (v) => `blur(${v}px)`);
  const y = useTransform(p, [a, hold ? a + 0.05 : end], [travel, hold ? 0 : -travel]);
  const scale = useTransform(p, [a, a + RAMP * 1.5, end - RAMP, end], [0.97, 1, 1, 1.05]);
  const pointerEvents = useTransform(p, (v) => (v > a + RAMP * 0.6 && v < end - RAMP * 0.6 ? "auto" : "none"));
  return { opacity, filter, y, scale, pointerEvents };
}

/** A line inside a scene that arrives a beat after the one before it. */
function Beat({ p, a, i, children, className, as = "div" }: { p: MotionValue<number>; a: number; i: number; children: ReactNode; className?: string; as?: "div" | "p" | "h2" | "h3" }) {
  const s = a + 0.005 + i * 0.0028;
  const opacity = useTransform(p, [s, s + 0.012], [0, 1]);
  const y = useTransform(p, [s, s + 0.014], [18, 0]);
  const blurV = useTransform(p, [s, s + 0.012], [8, 0]);
  const filter = useTransform(blurV, (v) => `blur(${v}px)`);
  const M = motion[as];
  return (
    <M className={className} style={{ opacity, y, filter }}>
      {children}
    </M>
  );
}

/** Big chapter title, letters rising out of the light one by one. */
function Letters({ text, p, a, span = 0.016, className }: { text: string; p: MotionValue<number>; a: number; span?: number; className?: string }) {
  const chars = text.split("");
  return (
    <span className={className} aria-label={text}>
      {chars.map((c, i) => (
        <Letter key={i} c={c} p={p} s={a + (i / chars.length) * span} />
      ))}
    </span>
  );
}
function Letter({ c, p, s }: { c: string; p: MotionValue<number>; s: number }) {
  const opacity = useTransform(p, [s, s + 0.01], [0, 1]);
  const y = useTransform(p, [s, s + 0.014], ["0.5em", "0em"]);
  const blurV = useTransform(p, [s, s + 0.012], [14, 0]);
  const filter = useTransform(blurV, (v) => `blur(${v}px)`);
  return (
    <motion.span aria-hidden className="ltr" style={{ opacity, y, filter }}>
      {c === " " ? " " : c}
    </motion.span>
  );
}

const MailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="M3.5 7.5l8.5 6 8.5-6" />
  </svg>
);

const ChatIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.6-4.2A8.5 8.5 0 1 1 20.5 11.5z" />
    <path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 .8a4 4 0 0 1-2-2l.8-1-1-2z" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Skill constellations: words drift through the sky at different depths */
type Word = { t: string; x: number; y: number; size: number; depth: number; label?: boolean };
const ADD_HERE = "[Add Here]";
const clusters: Word[][] = [
  // left side of the frame — Writing & Creative work
  [
    { t: "Writing", x: 6, y: 16, size: 1, depth: 0.6, label: true },
    { t: "Poetry", x: 8, y: 26, size: 1.6, depth: 1 },
    { t: "Cipta Puisi", x: 22, y: 24, size: 1.1, depth: 0.7 },
    { t: "Letter Writing", x: 13, y: 35, size: 1.35, depth: 1.2 },
    { t: "Menulis Surat", x: 8, y: 43, size: 0.95, depth: 0.6 },
    { t: "Creative Work", x: 7, y: 56, size: 1, depth: 0.6, label: true },
    { t: "Creative Expression", x: 9, y: 66, size: 1.4, depth: 1.1 },
    { t: "Seniman Karya", x: 18, y: 75, size: 1.05, depth: 0.8 },
  ],
  // right side — History, Geography & Civics
  [
    { t: "History & Geography", x: 66, y: 15, size: 1, depth: 0.6, label: true },
    { t: "History", x: 72, y: 25, size: 1.55, depth: 1.1 },
    { t: "Sejarah", x: 86, y: 21, size: 1.05, depth: 0.7 },
    { t: "Geography", x: 70, y: 35, size: 1.4, depth: 0.9 },
    { t: "Geografi", x: 85, y: 38, size: 1, depth: 0.6 },
    { t: "Civics", x: 72, y: 56, size: 1, depth: 0.6, label: true },
    { t: "PPKn", x: 70, y: 66, size: 1.5, depth: 1.1 },
    { t: "Civics", x: 84, y: 64, size: 1.1, depth: 0.8 },
  ],
  // lower band — Competitions & what's still to come
  [
    { t: "Competitions", x: 8, y: 62, size: 1, depth: 0.6, label: true },
    { t: "National Olympiads", x: 9, y: 71, size: 1.3, depth: 1.1 },
    { t: "Writing Contests", x: 14, y: 81, size: 1.1, depth: 0.8 },
    { t: "Gold Medalist", x: 8, y: 90, size: 1, depth: 0.6 },
    { t: "More Skills", x: 66, y: 62, size: 1, depth: 0.6, label: true },
    { t: ADD_HERE, x: 66, y: 72, size: 1.4, depth: 1.1 },
    { t: ADD_HERE, x: 80, y: 82, size: 1.1, depth: 0.8 },
  ],
];

const isPhone = typeof window !== "undefined" && window.innerWidth < 760;

function SkillWord({ w: w0, p, a, b, i, n }: { w: Word; p: MotionValue<number>; a: number; b: number; i: number; n: number }) {
  // On phones the sky is narrow: lay the words out as an airy zig-zag instead
  const w = isPhone ? { ...w0, x: w0.label ? 6 : i % 2 ? 58 : 10, y: 12 + (i * 74) / Math.max(1, n - 1), size: w0.label ? w0.size : Math.min(w0.size, 1.2) } : w0;
  const s = a + 0.004 + (i % 7) * 0.003;
  const opacity = useTransform(p, [s, s + 0.012, b - 0.012, b], [0, w.label ? 1 : 0.95, w.label ? 1 : 0.95, 0]);
  const y = useTransform(p, [a, b], [60 * w.depth, -90 * w.depth]);
  const blurV = useTransform(p, [s, s + 0.012, b - 0.012, b], [10, w.depth < 0.6 ? 0.6 : 0, 0, 10]);
  const filter = useTransform(blurV, (v) => `blur(${v}px)`);
  return (
    <motion.span
      className={`sk ${w.label ? "sk-label" : ""}`}
      style={{ left: `${w.x}%`, top: `${w.y}%`, translate: `-${w.x}% 0`, opacity, y, filter, fontSize: `calc(${w.size} * var(--sk))` }}
    >
      {w.label ? (
        <>
          <i /> {w.t}
        </>
      ) : (
        w.t
      )}
    </motion.span>
  );
}

/* ------------------------------------------------------------------ */
export function SceneView({ s, p }: { s: Scene; p: MotionValue<number> }) {
  const [a, b] = s.at;
  const hold = s.kind === "contact";
  const env = useEnvelope(p, a, b, hold, s.kind === "heading" ? 30 : 50);
  const P = portfolio;

  switch (s.kind) {
    case "opening":
      return (
        <motion.div className="sc sc-center halo" style={env}>
          <p className="t-eyebrow">An {P.name} film</p>
          <p className="t-meta">Scroll to begin</p>
        </motion.div>
      );

    case "hero":
      return (
        <motion.div className="sc sc-lower halo" style={env}>
          <Beat p={p} a={a - 0.006} i={0} as="p" className="t-eyebrow">The Kingdom of</Beat>
          <h1 className="h-hero h-name" aria-label={P.name}>
            {P.heroWords.map((w, i) => (
              <span key={w}>
                {i > 0 && " "}
                <span className="hw">
                  <Letters text={w} p={p} a={a + i * 0.0045} span={0.012} />
                </span>
              </span>
            ))}
          </h1>
        </motion.div>
      );

    case "heading":
      return (
        <motion.div className={`sc sc-${s.pos} halo-soft`} style={env}>
          <Beat p={p} a={a - 0.006} i={0} as="p" className="h-eyebrow">✦ {s.eyebrow} ✦</Beat>
          <h2 className="h-chapter">
            <Letters text={s.text} p={p} a={a} />
          </h2>
          <Beat p={p} a={a} i={3} className="h-line"><i /></Beat>
        </motion.div>
      );

    case "about":
      return (
        <motion.div className="sc sc-lm halo comp" style={env}>
          <Beat p={p} a={a - 0.006} i={0} as="p" className="h-eyebrow">✦ Chapter I ✦</Beat>
          <h2 className="h-section">
            <Letters text="About Me" p={p} a={a} span={0.012} />
          </h2>
          <Beat p={p} a={a} i={3} as="p" className="comp-lead">
            A student of <b>{P.school}</b>, {P.province} — a <b>poet</b>, <b>letter writer</b> and national gold medalist in <b>History</b> &amp; <b>Geography</b>.
          </Beat>
          <Beat p={p} a={a} i={5} className="comp-stats">
            {P.stats.map((s, i) => (
              <Fragment key={s.label}>
                {i > 0 && <em />}
                <div><b>{s.value}</b><span>{s.label}</span></div>
              </Fragment>
            ))}
          </Beat>
        </motion.div>
      );

    case "starring":
      return (
        <motion.div className="sc sc-tl halo" style={env}>
          <p className="t-eyebrow">Starring</p>
          <p className="t-title">{P.name}</p>
        </motion.div>
      );

    case "education":
      return (
        <motion.div className="sc sc-rm halo comp right" style={env}>
          <Beat p={p} a={a - 0.006} i={0} as="p" className="h-eyebrow">✦ The Royal Academy ✦</Beat>
          <h2 className="h-section">
            <Letters text="Education" p={p} a={a} span={0.012} />
          </h2>
          {P.education.map((e, i) => (
            <Beat key={e.title} p={p} a={a} i={3 + i * 3} className="edu-line">
              <span className="edu-year">{e.year}</span>
              <p className="edu-title">{e.title}</p>
              <p className="edu-place">{e.place}</p>
              {e.pill && <span className="pill-glass">{e.pill}</span>}
            </Beat>
          ))}
          <Beat p={p} a={a} i={9} as="p" className="edu-honour">✦ {P.educationHonour} ✦</Beat>
        </motion.div>
      );

    case "skills":
      return (
        <div className="sc-field">
          {clusters[s.cluster].map((w, i) => (
            <SkillWord key={`${i}-${w.t}`} w={w} p={p} a={a} b={b} i={i} n={clusters[s.cluster].length} />
          ))}
        </div>
      );

    case "project": {
      const pr = P.projects[s.index];
      return (
        <motion.div className={`sc sc-${s.pos}`} style={env}>
          <Glass p={p} a={a} b={b} wide={s.pos !== "rm"}>
            <Beat p={p} a={a} i={0} as="p" className="g-num">{pr.numeral}</Beat>
            <div className="g-main">
              <Beat p={p} a={a} i={1} as="p" className="g-kicker">{pr.kicker}</Beat>
              <Beat p={p} a={a} i={2} as="h3" className="g-title">{pr.title}</Beat>
              <Beat p={p} a={a} i={3} as="p" className="g-body">{pr.summary}</Beat>
              <Beat p={p} a={a} i={4} className="g-tech">
                {pr.tags.join("  ·  ")}
              </Beat>
              <Beat p={p} a={a} i={5}>
                {pr.url ? (
                  <a className="g-link" href={pr.url} target="_blank" rel="noreferrer">
                    View the work <span aria-hidden>→</span>
                  </a>
                ) : (
                  <span className="g-link g-todo">Link to the work: {ADD_HERE}</span>
                )}
              </Beat>
            </div>
          </Glass>
        </motion.div>
      );
    }

    case "achievements":
      return (
        <motion.div className="sc sc-tl-wide halo comp" style={env}>
          <Beat p={p} a={a - 0.006} i={0} as="p" className="h-eyebrow">✦ Chapter IV ✦</Beat>
          <h2 className="h-section">
            <Letters text="Achievements" p={p} a={a} span={0.014} />
          </h2>
          <Beat p={p} a={a} i={3} className="ach-big">
            <b>{P.achievements.big.value}</b>
            <span>{P.achievements.big.label}</span>
          </Beat>
          <Beat p={p} a={a} i={4} as="p" className="ach-meta">{P.achievements.meta}</Beat>
          {P.achievements.lines.map((l, i) => (
            <Beat key={l.tag + l.text} p={p} a={a} i={5 + i} as="p" className="ach-line"><span>{l.tag}</span> {l.text}</Beat>
          ))}
        </motion.div>
      );

    case "experience":
      return (
        <motion.div className="sc sc-rm halo comp right" style={env}>
          <Beat p={p} a={a - 0.006} i={0} as="p" className="h-eyebrow">✦ Chapter V ✦</Beat>
          <h2 className="h-section">
            <Letters text="Experience" p={p} a={a} span={0.012} />
          </h2>
          {P.experience.map((x, i) => (
            <Beat key={x.title} p={p} a={a} i={3 + i * 2} className="edu-line">
              <span className="edu-year">{x.period}</span>
              <p className="edu-title">{x.title}</p>
              <p className="edu-place">{x.place}</p>
            </Beat>
          ))}
          <Beat p={p} a={a} i={7} as="p" className="cert-head">Competed at</Beat>
          <Beat p={p} a={a} i={8} as="p" className="cert-roll">
            {P.competedAt.join("  ✦  ")}  ✦  Internship / organisation: {ADD_HERE}
          </Beat>
        </motion.div>
      );

    case "contact":
      return (
        <motion.div className="sc sc-center halo-strong" style={env}>
          <Beat p={p} a={a - 0.006} i={0} as="p" className="h-eyebrow">✦ Epilogue ✦</Beat>
          <h2 className="h-chapter ct-h">
            <Letters text="Contact Me" p={p} a={a} />
          </h2>
          <Beat p={p} a={a} i={3}>
            <a className="ct-mail" href={`mailto:${P.contact.email}`}>{P.contact.email}</a>
          </Beat>
          <Beat p={p} a={a} i={4}>
            <a className="ct-mail ct-phone" href={`tel:${P.contact.phoneTel}`}>{P.contact.phone}</a>
          </Beat>
          <Beat p={p} a={a} i={5} className="ct-pic">
            <span className="ct-fw" aria-hidden>
              <i /><i /><i /><i /><i /><i />
            </span>
            <img
              className="ct-img"
              src="princess.png"
              alt={P.name}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </Beat>
          <Beat p={p} a={a} i={7} className="ct-links">
            <a className="pill-glass link" href={`mailto:${P.contact.email}`}><MailIcon /> Email</a>
            <a className="pill-glass link" href={P.contact.whatsapp} target="_blank" rel="noreferrer"><ChatIcon /> WhatsApp</a>
          </Beat>
          <Beat p={p} a={a} i={9} as="p" className="ct-credit">© 2026 {P.name} · Visuals created with AI (Google Gemini)</Beat>
        </motion.div>
      );
  }
}

/** Premium frosted glass: almost invisible edges, a specular sheen that slides as the camera moves. */
function Glass({ p, a, b, wide, children }: { p: MotionValue<number>; a: number; b: number; wide?: boolean; children: ReactNode }) {
  const sheen = useTransform(p, [a, b], ["-60%", "160%"]);
  const tilt = useTransform(p, [a, b], [4, -4]);
  return (
    <motion.div className={`glass ${wide ? "wide" : ""}`} style={{ rotateY: tilt }}>
      <motion.span className="glass-sheen" style={{ x: sheen }} />
      <span className="glass-edge" />
      {children}
    </motion.div>
  );
}
