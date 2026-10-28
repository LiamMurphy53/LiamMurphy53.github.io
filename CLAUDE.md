# CLAUDE.md — Liam Murphy portfolio site

Personal engineering portfolio for Liam Murphy (aerospace engineering, CU Boulder, May 2027).
Live at https://liammurphy53.github.io/ via GitHub Pages from `main`. Pushing to `main` publishes.
Note: this file is in a public Pages repo, so it is publicly readable. Keep private notes out of it.

## Stack

- Plain static HTML/CSS/JS. No framework, no build step, no package install. Don't add one for small changes.
- Preview: `python3 -m http.server 8765` from the repo root, then open http://127.0.0.1:8765/
- DM Sans from Google Fonts with a normal CSS fallback stack.

## Files

- `index.html`: all content. Sections: intro (`#top`, bio `#about`), Projects (`#work`), Experience (`#experience`), Motorsport (`#motorsport`), Contact (`#contact`).
  - Six project cards: `#aerodynamics`, `#fpv`, `#launcher`, `#test-stand`, `#robotics`, `#vex`.
  - Full project details live in `.detail-fallback` as `#detail-<id>` sections and are cloned into `<dialog id="project-dialog">`.
- `assets/site.css`: all styling. It has layered refinements, so later rules override earlier ones. Read the whole cascade before changing a value.
- `assets/site.js`: section navigation, initial scroll to intro, dialog open/close/cloning, focus restoration, section observer.
- `assets/photos/`: optimized WebP images the site uses.
- `images/`: original photos (~230 MB). Keep them as supplied. Make resized WebP copies in `assets/photos/` instead of linking originals.
- `resume.pdf`: current resume (Resume-5).
- `README.md` describes an earlier design stage. The current HTML/CSS are authoritative.

## Must keep working

- Detail anchors work without JavaScript (no-JS fallback).
- Escape closes the dialog, focus returns to the trigger, modified clicks (cmd/ctrl-click) behave normally.
- Every image has meaningful alt text. Width/height on images where known.
- Fresh visits land on the intro; normal nav doesn't leave section-specific URLs.
- Desktop: two-column project grid. Mobile: single column. Desktop and mobile headshot sizes are tuned separately.

## Design direction

Simple, personal, "less vibecoded": cool grays with slate accents, strong intro type, real engineering photos (no stock or placeholder art), full Cliffside hero photo with an even dark tint, persistent slim top nav, "Resume" not "Résumé". Keep this look; don't add decorative flourishes.

## Accuracy of claims (important)

Never present a design target as a demonstrated result. Current wording to preserve:
- FSAE undertray: 30% *CFD-predicted* downforce gain. Physical validation (suspension potentiometers) is *in progress*.
- FPV drones: 3+ power-to-weight is a *target*.
- Launcher: *requirement* of 18 m/s at an 8° *launch angle* (not angle of attack). The aircraft *targets* >200 mph, which is not demonstrated.
- Motor test stand: in development. 5 kg S-type load cell.
- Lidar quadcopter: >60% field coverage is a *design* objective.
- VEX 4154X: completed. Worlds 2022 finalist.
Project status labels: FSAE Completed, FPV Testing / In development, Launcher / Test stand / Lidar In development, VEX Completed.

## Working style

- Concise and technical. Short lowercase code comments.
- Ask before changing professional claims, bio text or resume.
- Don't push to `main` without Liam's OK.

## Ideas (not approved)

Project videos, CAD-to-build sequences, "My role" summaries, click-to-enlarge gallery photos.
