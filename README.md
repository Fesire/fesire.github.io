# Fesire.

A responsive portfolio for Sarathchandran P, built with HTML, CSS and vanilla JavaScript. GitHub Pages serves the site directly; there is no build step.

## Editing the work

Each film is an `article.project` in `index.html`. Update the title, caption, thumbnail URL, YouTube link and `data-video` together. The `data-title` becomes the player heading and `data-kind` the category label. Filters use `data-category` (`music`, `brand`, `travel`). If adding or removing projects, update the initial project counts too.

`styles.css` controls the responsive layout and light/dark palettes. `script.js` handles category filters, theme persistence, thumbnail fallbacks, and the video/contact dialogs.

All project and contact links work without JavaScript. YouTube players are created only when a film is opened and removed on close. Escape, the close button, and tapping the backdrop close the dialogs. Reduced-motion settings disable animations and smooth scrolling.

## Preview

Serve this directory with any static HTTP server, for example `python3 -m http.server 8000`. Check small phone, tablet and desktop widths, both themes, filters, dialog keyboard controls and video links before publishing.
