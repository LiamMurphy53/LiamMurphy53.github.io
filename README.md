# Liam Murphy Portfolio

Static portfolio for Liam Murphy, Aerospace Engineering at CU Boulder (May 2027).

## Design

Combines Index’s cool gray background, clean typography, and slate accents with After Hours’ large introduction and two-column project gallery. Mobile uses a single-column layout. Desktop and mobile keep their separately sized portraits.

Run a local static web server from this directory and open `index.html`. No build step or package installation is needed. Older theme URLs also show the combined design.

## Content

- `index.html`: introduction, six selected projects, experience, motorsport, and contact. Full project details are stored in the `detail-fallback` section and opened in accessible dialogs. Direct detail links also work without JavaScript.
- `assets/site.css`: the combined design and responsive layouts.
- `assets/site.js`: project dialogs, including Escape to close and focus restoration.
- `resume.pdf`: latest résumé (Resume-5).
- `images/`: original project photos. These are preserved as supplied.
- `assets/photos/`: resized WebP copies used by the site, including the motor test stand CAD and robotics mapping CAD. Selected sideways photos are corrected.

Project metrics distinguish design targets from results. The undertray's 30% downforce gain is presented as CFD-predicted, with physical validation in progress.

## Hosting

Compatible with GitHub Pages at https://liammurphy53.github.io/. Changes appear publicly only after publishing through the repository's GitHub Pages workflow.

Contact: murli01quebo@gmail.com
