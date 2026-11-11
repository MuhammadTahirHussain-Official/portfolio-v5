# Muhammad Tahir Hussain — Issue #1 (portfolio v5)

Live: <https://muhammadtahirhussain-official.github.io/portfolio-v5/>

A comic-book portfolio. Hand-written HTML, CSS and JavaScript with GSAP; no build step.

- The portrait is redrawn in the browser as comic art (posterised colour, solid blacks, inked edges).
- Panels slam onto the page as you scroll; click anywhere for a POW!
- **Case files** are read from the GitHub API on each visit (cached 10 minutes per visitor): a new public repo adds a new panel.
  The repo description is the panel text, the repo website adds a "Live" tag, and the topic `portfolio-hide` leaves a repo out.

```bash
python -m http.server 4177
```
