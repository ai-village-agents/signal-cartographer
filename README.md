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
The world now includes **Survey Grid**: a sector chart that records where the Survey Skiff has explored.
The world now includes **Triangulation**: a live three-anchor fix that plots the Survey Skiff against nearby built-in route anchors.
The world now includes **Signal Relays**: a built-in outer-ring station network that the Survey Skiff can contact near the map perimeter.
The world now includes **Bridge Aperture**: a clearly labeled outbound map landmark that links to the Automation Observatory's Cross-World Bridge Index as an external navigation hub.
The world now includes **Bridge Bearings**: outbound external-link apertures project navigation-only bearings to the map perimeter so cross-world exits stay visible without being mistaken for evidence rails.
The world now includes **Bridge Handoffs**: outbound perimeter exits reconnect to the nearest built-in signal relay so cross-world travel stays legible as navigation infrastructure rather than evidence flow.
The world now includes **Bridge Locks**: relay handoffs continue into the nearest transit lock so cross-world arrivals stay on explicit travel infrastructure rather than slipping into evidence flow.
The world now includes **Bridge Transits**: bridge-arrival locks continue through their linked transit gates so cross-world routes stay on explicit lock infrastructure between regions.
The world now includes **Bridge Rejoins**: linked transit gates reconnect to the nearest destination relay so cross-world routes rejoin explicit navigation infrastructure after lock transit.
The world now includes **Bridge Ringways**: destination relays continue onto the shortest linked built-in relay span so cross-world routes stay on explicit navigation infrastructure after rejoining the relay ring.
The world now includes **Bridge Landings**: destination ringway relays continue into the nearest transit lock so cross-world arrivals stay on explicit travel infrastructure after rejoining the relay ring.
The world now includes **Drift Currents**: five built-in interior flow lines that the Survey Skiff can enter while crossing the map.
The world now includes **Transit Locks**: built-in paired jump gates the Survey Skiff can chart and use to leap between distant regions.
The world now includes **Approach Radar**: a skiff-centered proximity scanner that surfaces nearby built-in navigational systems in a map overlay and sidebar scan log.
The world now includes **Beacon Soundings**: a skiff-centered scanner that surfaces nearby public beacons in a map overlay and sidebar sounding log.
The world now includes **Drift Signals**: labeled public issues without usable coordinates are parked in deterministic perimeter berths until they are revised.
The world now includes **Witness Threads**: repeated public traces from the same visitor are connected into continuity trails.
The world now includes **Return Routes**: repeated visitors generate region-to-region crossings that reveal how public traces move between parts of the map.
The world now includes **Amendment Wake**: beacon issues with public comments emit revision halos so follow-up amendments remain visible on the map.
The world now includes **Comment Chorus**: amended beacons can surface the latest fetched public issue comment voices in a dedicated overlay and sidebar log.
The world now includes **Revision Tides**: amended beacons reveal how fresh their latest visible public activity is through recency bands on the map and in the sidebar.
The world now includes **Revision Confluence**: amended beacons pool into region-level basins that show where visible public revision activity is concentrating.
The world now includes **Basin Feedlines**: regional revision basins trace their contributing amended beacons so each concentration stays tied to visible public records.
The world now includes **Comment Moorings**: distinct public commenters receive deterministic perimeter berths tied to the beacons they amended.
The world now includes **Revision Almanac**: amended beacons are ordered into a numbered chronology of freshest visible public activity.
The world now includes **Revision Causeway**: amended beacons are connected into a visible route ordered by freshest public revision activity.
The world now includes **Revision Estuary**: public commenters, amended beacons, and regional revision basins are linked into end-to-end visible provenance channels.
The world now includes **Revision Delta**: regional revision basins discharge into deterministic public-verification landmarks so provenance outflows stay tied to shared accountability rails.
The world now includes **Verification Spurs**: active public-verification outlets hand off into Public Rails so provenance returns to a shared accountability spine.
The world now includes **Accountability Spine**: public commenter berths, amended beacons, regional basins, verification outlets, and Public Rails are linked into a single end-to-end provenance route.
The world now includes **Ledger Ingress**: accountability-spine routes continue from Public Rails into Witness Ledger so public evidence is visibly deposited into a shared archival record.
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
