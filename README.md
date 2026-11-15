# Triple C (NASA Space Apps)

A frontend-only React + TypeScript (Vite) build of the **Nasa Space App** Figma design and its prototype flow.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static site in dist/
```

The app is a fixed 1440×810 scene, the same size as the Figma frames, and scales to fit any window. It uses hash routing, so `dist/` works on any static host.

## Flow

| Start page button | Route |
|---|---|
| Astronaut based in **United States** | `/usa/welcome` → `/usa/updates` → `/usa/home` |
| Astronaut based in **Singapore** | `/sg/welcome` → `/sg/updates` → `/sg/home` |
| **Doodle Space Agency** | `/events/cny` → `raya` → `deepavali` → `christmas` → `haze` → `july4` → `/events/end` |

Both countries share the same screens, with the otter for Singapore and the eagle for the USA:

- **Home:** START → journal `feelings → sleep → energy → food → social → tasks` → `journal/done` (moves on by itself after 3 s) → `mood-trend` → Next → Home. Home switches to the "mascot says" version after 4 s and back after 6 s.
- **Messages:** PLAY → `messages/view`. WRITE A NOTE → `messages/write`, which has GET DATA (Ephemeris popup), SAVE DRAFT and SEND NOTE (popups that close by themselves).
- **Stats:** a scrolling Mood Report.
- **Elsewhere:** "Triple C //Start" on the start page opens **Members**. On the end screen, *Respawn* restarts the events and *Title Screen* goes back to Start.

## Images

Images live in `src/assets/figma/` and are picked up **by file name**, so no code changes are needed. A missing image shows as a dashed box labelled with the file name it expects.

**`ASSETS.md`** is the checklist: every image, the file name to save it as, and where it is in Figma. After adding files, run `npm run assets` to refresh it.

Export each one from Figma as **PNG, 1x**. Mascots need a **transparent background**: export only the character layer, not the whole frame.

Mascot positions on each screen are set in `src/regions.ts`. Entries marked `// est.` were measured from screenshots. If an exported image looks slightly off, adjust its `x`, `y`, `w` and `h` there.

## Project layout

```
src/
  App.tsx               routes
  assets.ts             image list + auto-loader
  regions.ts            Singapore / USA differences (mascots, text, positions)
  state/journal.tsx     journal selections
  components/Stage.tsx  scaled 1440×810 stage, Img, Scene
  components/ui.tsx     header, nav, buttons, bubbles, pickers, chips
  screens/              Start/Members, Intro (welcome/updates/home), Journal,
                        Messages, Stats, Events
scripts/asset-list.mjs  writes ASSETS.md
```
