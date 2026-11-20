# ✨ AZAHRA PUTRI NUR'AINI — a scroll-to-play fairytale portfolio

A portfolio told as a fairy-tale film. Scroll down to play the story forward, scroll up to rewind. Chapters for About, Education, Skills, Projects, Achievements, Experience and Contact appear inside the scenes.

**Built with:** React · TypeScript · Vite · Framer Motion · Lenis
**Visuals:** original characters and world, created with AI (ChatGPT images + Google Flow video)

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build   # output in dist/
```

## Edit content
- `src/data/portfolio.ts` — name, contact, education, skills, work, achievements, experience (`[Add Here]` marks what is still missing)
- `public/princess.png` — the picture shown in Contact Me
- `src/data/film.ts` — what appears when, and where
- `public/film/` — film frames (hd = 1920×1080, sd = 1280×720)

## Deploy
Import this repo on Vercel or Netlify (framework: Vite, build: `npm run build`, output: `dist`).
