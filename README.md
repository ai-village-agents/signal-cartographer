# The Signal Cartographer

The Signal Cartographer is a public-facing interactive world about claims under pressure.

It treats trust as a visible process:
- evidence should be inspectable,
- revisions should stay on the record,
- traces should outlive confident rhetoric.

The world is a 2D map with five regions:
- Rumor Sea
- Proof Plateau
- Revision River
- Memory Vault
- Beacon Field

Visitors can leave permanent marks called **beacons**. A beacon is persisted as a public GitHub issue labeled `beacon`, then rendered back onto the map through the GitHub REST API.
Each beacon can optionally include an evidence anchor and a revision trigger for public accountability.
The map now also includes a **Signal Sweep** exploration layer: a pointer-following scanner that can uncover hidden built-in **echo sites** (lore/provenance points that are part of the world itself, not visitor submissions).
The world now also includes a **Traverse Lattice** map-first layer: six built-in interstitial stations, a connected route overlay across landmarks/echo sites/stations, and sidebar route controls for moving through linked built-in nodes.
The world now includes a **Survey Skiff** map-first craft that can be piloted with arrow keys or WASD to reveal nearby echo contacts and route anchors.
The world now includes a **Survey Wake** that records the skiff's recent path with revisit-able milestones.
The sidebar includes an Accountability Census that tallies public beacon posture across the full ledger.
The Region Survey now exposes per-region accountability summaries and quick actions that jump the Beacon Ledger into regional and exact-posture slices.
The Beacon Ledger can be browsed by exact posture classes (Evidence + revision, Evidence only, Revision only, Minimal trace) and broader aggregate filters (Evidence anchored, Revision ready, Missing evidence or revision).
Exact links now include optional Beacon Ledger query parameters while keeping existing hash deep links for regions, landmarks, and beacons:
- `ledgerRegion`
- `ledgerPosture`
- `ledgerSearch`

These query params are only included when active:
- `ledgerRegion` is omitted when set to `All regions`
- `ledgerPosture` is omitted when set to `All postures`
- `ledgerSearch` is omitted when the trimmed search input is empty

## Local preview

No build step is required.

1. Open `index.html` directly in a browser, or
2. Serve locally with any static server, for example:

```bash
python3 -m http.server 8765
```

Then visit `http://localhost:8765`.

## GitHub Pages setup

1. Push this repository to GitHub.
2. In repository settings, open **Pages**.
3. Set source to `Deploy from a branch`.
4. Select branch `main` (or your default branch) and folder `/ (root)`.
5. Save and wait for publication.

## Beacon persistence flow

1. User clicks the map to choose `x,y` coordinates.
2. User fills the **Leave a Beacon** form.
3. Site opens a prefilled new issue URL in this repository:
   - owner: `ai-village-agents`
   - repo: `signal-cartographer`
   - template: `beacon.yml`
4. User submits issue publicly.
5. Site fetches issues via:
   - `GET /repos/ai-village-agents/signal-cartographer/issues?state=all`
6. Site filters issues with label name exactly `beacon`.
7. Site parses beacon fields from issue body and renders marker permanently.

If GitHub API rate limits are hit, the map shows a friendly fallback message and keeps built-in landmarks active.

## Expected beacon body format (explicit parser target)

The app parser accepts this fenced block (preferred):

```beacon
x: 22.4
y: 74.1
title: Public rail crossing
note: I trust this because the revision history stayed visible.
evidence: Public logs and reproducible checks are linked below.
revision: A failed rerun or corrected source record would revise this mark.
region: Beacon Field
color: #77e2ff
visitor: Ada
```

It also accepts GitHub Issue Form heading output (`### x`, `### y`, `### evidence`, `### revision`, etc.) as a fallback.

## Files

- `index.html`: world layout and UI panel
- `styles.css`: visual direction, animations, responsive design
- `app.js`: map interactions, GitHub issue integration, beacon parsing
- `.github/ISSUE_TEMPLATE/beacon.yml`: issue form for permanent beacon submissions
- `.github/ISSUE_TEMPLATE/config.yml`: forces template usage and disables blank issues
