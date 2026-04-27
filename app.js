const OWNER = "ai-village-agents";
const REPO = "signal-cartographer";
const ISSUE_LABEL = "beacon";
const MAP_W = 1600;
const MAP_H = 1000;
const SVG_NS = "http://www.w3.org/2000/svg";
const LEDGER_REGION_DEFAULT = "All regions";
const LEDGER_POSTURE_DEFAULT = "All postures";
const LEDGER_QUERY_PARAM_REGION = "ledgerRegion";
const LEDGER_QUERY_PARAM_POSTURE = "ledgerPosture";
const LEDGER_QUERY_PARAM_SEARCH = "ledgerSearch";

const REGION_COPY = {
  "Rumor Sea": "Signals arrive noisy here. Claims are easy to launch and hard to verify.",
  "Proof Plateau": "Only repeatable evidence survives the ascent. Methods are exposed, not implied.",
  "Revision River": "Corrections flow in public. Good maps keep track of what changed, and why.",
  "Memory Vault": "Archive of surviving traces: citations, logs, and witnesses that outlast spin.",
  "Beacon Field": "Public marks left by visitors. Each beacon is a signed trace tied to a visible issue."
};

const REGION_FOCUS = {
  "Rumor Sea": { x: 19.5, y: 30.5, scale: 1.42 },
  "Proof Plateau": { x: 76, y: 28, scale: 1.38 },
  "Revision River": { x: 52.5, y: 57, scale: 1.34 },
  "Memory Vault": { x: 75.5, y: 79, scale: 1.42 },
  "Beacon Field": { x: 23, y: 76, scale: 1.52 }
};

const LANDMARKS = [
  {
    x: 18,
    y: 27,
    title: "Whisper Breakwater",
    note: "A wall of failed shortcuts: claims that sounded right until someone checked the source twice.",
    region: "Rumor Sea"
  },
  {
    x: 74,
    y: 23,
    title: "Replicator Steps",
    note: "Stone terraces where methods are rerun publicly. If results cannot be repeated, they slide back.",
    region: "Proof Plateau"
  },
  {
    x: 48,
    y: 56,
    title: "Errata Locks",
    note: "Gates that force amendments into the open so revisions leave a permanent wake.",
    region: "Revision River"
  },
  {
    x: 67,
    y: 78,
    title: "Witness Ledger",
    note: "A chamber of durable testimony where provenance matters more than confidence.",
    region: "Memory Vault"
  },
  {
    x: 82,
    y: 73,
    title: "Trace Lanterns",
    note: "Lights that remain after narratives burn off; what still glows has logs behind it.",
    region: "Memory Vault"
  },
  {
    x: 22,
    y: 74,
    title: "Public Rails",
    note: "The line where private certainty becomes public accountability.",
    region: "Beacon Field"
  }
];

const state = {
  tx: -MAP_W / 2,
  ty: -MAP_H / 2,
  scale: 1,
  dragging: false,
  downX: 0,
  downY: 0,
  dragStartX: 0,
  dragStartY: 0,
  selected: null,
  beacons: [],
  activeTrace: null,
  activeRegion: "Beacon Field",
  restoredHashSelection: false
};

const el = {
  viewport: document.getElementById("mapViewport"),
  map: document.getElementById("map"),
  regionDetail: document.getElementById("regionDetail"),
  regionList: document.getElementById("regionList"),
  previewMarker: document.getElementById("previewMarker"),
  coordPreview: document.getElementById("coordPreview"),
  beaconX: document.getElementById("beaconX"),
  beaconY: document.getElementById("beaconY"),
  beaconForm: document.getElementById("beaconForm"),
  beaconTitle: document.getElementById("beaconTitle"),
  beaconNote: document.getElementById("beaconNote"),
  beaconEvidence: document.getElementById("beaconEvidence"),
  beaconRevision: document.getElementById("beaconRevision"),
  beaconVisitor: document.getElementById("beaconVisitor"),
  beaconRegion: document.getElementById("beaconRegion"),
  beaconColor: document.getElementById("beaconColor"),
  statusMsg: document.getElementById("statusMsg"),
  tracePanel: document.getElementById("tracePanel"),
  verificationChain: document.getElementById("verificationChain"),
  permalinkStatus: document.getElementById("permalinkStatus"),
  permalinkField: document.getElementById("permalinkField"),
  copyPermalinkBtn: document.getElementById("copyPermalinkBtn"),
  openPermalinkLink: document.getElementById("openPermalinkLink"),
  ledgerRegionFilter: document.getElementById("ledgerRegionFilter"),
  ledgerPostureFilter: document.getElementById("ledgerPostureFilter"),
  ledgerSearchFilter: document.getElementById("ledgerSearchFilter"),
  ledgerSummary: document.getElementById("ledgerSummary"),
  beaconLedger: document.getElementById("beaconLedger"),
  regionSurvey: document.getElementById("regionSurvey"),
  recenterBtn: document.getElementById("recenterBtn"),
  toggleLandmarks: document.getElementById("toggleLandmarks"),
  toggleBeacons: document.getElementById("toggleBeacons"),
  toggleVerificationRoute: document.getElementById("toggleVerificationRoute"),
  landmarkLayer: document.getElementById("landmarkLayer"),
  beaconLayer: document.getElementById("beaconLayer"),
  verificationRouteLayer: document.getElementById("verificationRouteLayer")
};

function setTransform() {
  el.map.style.transform = `translate(${state.tx}px, ${state.ty}px) scale(${state.scale})`;
}

function recenter() {
  const vw = el.viewport.clientWidth;
  const vh = el.viewport.clientHeight;
  state.scale = Math.min(vw / MAP_W, vh / MAP_H, 1);
  state.tx = (vw - MAP_W * state.scale) / 2;
  state.ty = (vh - MAP_H * state.scale) / 2;
  setTransform();
}

function screenToWorld(clientX, clientY) {
  const rect = el.viewport.getBoundingClientRect();
  const x = (clientX - rect.left - state.tx) / state.scale;
  const y = (clientY - rect.top - state.ty) / state.scale;
  return { x, y };
}

function worldToPercent({ x, y }) {
  return {
    x: Math.max(0, Math.min(100, (x / MAP_W) * 100)),
    y: Math.max(0, Math.min(100, (y / MAP_H) * 100))
  };
}

function placePreview(percentX, percentY) {
  el.previewMarker.hidden = false;
  el.previewMarker.style.left = `${percentX}%`;
  el.previewMarker.style.top = `${percentY}%`;
}

function setSelectedCoord(percentX, percentY) {
  state.selected = { x: Number(percentX.toFixed(1)), y: Number(percentY.toFixed(1)) };
  el.beaconX.value = state.selected.x;
  el.beaconY.value = state.selected.y;
  el.coordPreview.textContent = `${state.selected.x}, ${state.selected.y}`;
  placePreview(state.selected.x, state.selected.y);
}

function setRegionDetail(regionName) {
  el.regionDetail.textContent = REGION_COPY[regionName] || "";
  const allRegions = document.querySelectorAll(".region, .region-list li");
  allRegions.forEach((n) => n.classList.remove("active"));
  document.querySelectorAll(`[data-region="${CSS.escape(regionName)}"]`).forEach((n) => {
    n.classList.add("active");
  });
  if (!el.beaconRegion.dataset.userTouched) {
    el.beaconRegion.value = regionName;
  }
  state.activeRegion = regionName;
  renderRegionSurvey();
}

function focusRegion(regionName) {
  const target = REGION_FOCUS[regionName];
  if (!target) return;
  const vw = el.viewport.clientWidth;
  const vh = el.viewport.clientHeight;
  state.scale = Math.max(0.45, Math.min(2.1, target.scale || 1.3));
  const worldX = (target.x / 100) * MAP_W;
  const worldY = (target.y / 100) * MAP_H;
  state.tx = vw / 2 - worldX * state.scale;
  state.ty = vh / 2 - worldY * state.scale;
  setTransform();
}

function traceKey(marker) {
  if (!marker) return "";
  if (marker.issueNumber) return `beacon:${marker.issueNumber}`;
  return `${marker.type || "marker"}:${marker.title}:${marker.x}:${marker.y}`;
}

function toSlug(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getMarkerHash(marker) {
  if (!marker) return "";
  if (marker.type === "beacon") {
    const issueNumber = parseIssueNumber(marker.issueNumber);
    return issueNumber === null ? "" : `#beacon-${issueNumber}`;
  }
  if (marker.type === "landmark") {
    const slug = toSlug(marker.title);
    return slug ? `#landmark-${slug}` : "";
  }
  return "";
}

function getPermalinkStatus(target) {
  const activeLedgerFilters = getActiveLedgerFilterDescriptions();
  const ledgerSentence = activeLedgerFilters.length > 0
    ? ` Includes ledger filters: ${activeLedgerFilters.join(", ")}.`
    : "";

  if (!target) {
    return `This is the base world link with no exact region or trace selected.${ledgerSentence}`;
  }

  if (target.type === "region") {
    const regionName = Object.keys(REGION_FOCUS).find((name) => toSlug(name) === target.slug);
    const message = regionName
      ? `This exact link points to the ${regionName} region.`
      : "This exact link points to a specific region view.";
    return `${message}${ledgerSentence}`;
  }

  if (target.type === "landmark") {
    const activeLandmarkTitle = state.activeTrace && state.activeTrace.type === "landmark"
      ? state.activeTrace.title
      : "";
    const landmark = LANDMARKS.find((item) => toSlug(item.title) === target.slug);
    const title = activeLandmarkTitle || (landmark && landmark.title) || "";
    const message = title
      ? `This exact link points to landmark: ${title}.`
      : "This exact link points to a specific landmark trace.";
    return `${message}${ledgerSentence}`;
  }

  if (target.type === "beacon") {
    const activeIssueNumber = parseIssueNumber(state.activeTrace && state.activeTrace.issueNumber);
    const activeTitle = activeIssueNumber === target.issueNumber ? state.activeTrace.title : "";
    const matchedBeacon = state.beacons.find(
      (item) => parseIssueNumber(item && item.issueNumber) === target.issueNumber
    );
    const title = activeTitle || (matchedBeacon && matchedBeacon.title) || "";
    const message = title
      ? `This exact link points to public beacon #${target.issueNumber}: ${title}.`
      : `This exact link points to public beacon #${target.issueNumber}.`;
    return `${message}${ledgerSentence}`;
  }

  return `This exact link points to the current world state.${ledgerSentence}`;
}

function getSelectOptionValues(selectNode) {
  if (!selectNode || !Array.isArray(Array.from(selectNode.options || []))) {
    return new Set();
  }
  return new Set(Array.from(selectNode.options).map((option) => option.value));
}

function getLedgerControlValues() {
  return {
    region: (el.ledgerRegionFilter && el.ledgerRegionFilter.value) || LEDGER_REGION_DEFAULT,
    posture: (el.ledgerPostureFilter && el.ledgerPostureFilter.value) || LEDGER_POSTURE_DEFAULT,
    search: ((el.ledgerSearchFilter && el.ledgerSearchFilter.value) || "").trim()
  };
}

function getActiveLedgerFilterDescriptions() {
  const values = getLedgerControlValues();
  const active = [];
  if (values.region && values.region !== LEDGER_REGION_DEFAULT) {
    active.push(`region = ${values.region}`);
  }
  if (values.posture && values.posture !== LEDGER_POSTURE_DEFAULT) {
    active.push(`posture = ${values.posture}`);
  }
  if (values.search) {
    active.push(`search = "${values.search}"`);
  }
  return active;
}

function buildShareableUrl(hashValue = window.location.hash) {
  const url = new URL(window.location.href);
  const params = url.searchParams;
  const values = getLedgerControlValues();

  params.delete(LEDGER_QUERY_PARAM_REGION);
  params.delete(LEDGER_QUERY_PARAM_POSTURE);
  params.delete(LEDGER_QUERY_PARAM_SEARCH);

  if (values.region && values.region !== LEDGER_REGION_DEFAULT) {
    params.set(LEDGER_QUERY_PARAM_REGION, values.region);
  }
  if (values.posture && values.posture !== LEDGER_POSTURE_DEFAULT) {
    params.set(LEDGER_QUERY_PARAM_POSTURE, values.posture);
  }
  if (values.search) {
    params.set(LEDGER_QUERY_PARAM_SEARCH, values.search);
  }

  const nextSearch = params.toString();
  url.search = nextSearch ? `?${nextSearch}` : "";
  url.hash = hashValue || "";
  return url.toString();
}

function replaceUrlInPlace(nextUrl) {
  if (window.history && typeof window.history.replaceState === "function") {
    window.history.replaceState(null, "", nextUrl);
  }
}

function syncLedgerUrlState() {
  const nextUrl = buildShareableUrl();
  if (nextUrl !== window.location.href) {
    replaceUrlInPlace(nextUrl);
  }
}

function restoreLedgerFiltersFromUrl() {
  const url = new URL(window.location.href);
  const urlRegion = url.searchParams.get(LEDGER_QUERY_PARAM_REGION);
  const urlPosture = url.searchParams.get(LEDGER_QUERY_PARAM_POSTURE);
  const urlSearch = url.searchParams.get(LEDGER_QUERY_PARAM_SEARCH);
  const allowedRegions = getSelectOptionValues(el.ledgerRegionFilter);
  const allowedPostures = getSelectOptionValues(el.ledgerPostureFilter);

  if (el.ledgerRegionFilter && urlRegion && allowedRegions.has(urlRegion)) {
    el.ledgerRegionFilter.value = urlRegion;
  }
  if (el.ledgerPostureFilter && urlPosture && allowedPostures.has(urlPosture)) {
    el.ledgerPostureFilter.value = urlPosture;
  }
  if (el.ledgerSearchFilter && urlSearch !== null) {
    el.ledgerSearchFilter.value = urlSearch;
  }
}

function handleLedgerFilterChange() {
  syncLedgerUrlState();
  renderBeaconLedger();
  renderPermalinkPanel();
}

function renderPermalinkPanel() {
  if (!el.permalinkField || !el.openPermalinkLink || !el.permalinkStatus) return;
  const currentUrl = buildShareableUrl();
  el.permalinkField.value = currentUrl;
  el.openPermalinkLink.href = currentUrl;
  el.permalinkStatus.textContent = getPermalinkStatus(parseHashTarget());
}

function setHash(hashValue) {
  const nextUrl = buildShareableUrl(hashValue);
  if (!hashValue || window.location.href === nextUrl) {
    renderPermalinkPanel();
    return;
  }
  if (window.history && typeof window.history.replaceState === "function") {
    window.history.replaceState(null, "", nextUrl);
  } else {
    window.location.hash = hashValue;
  }
  renderPermalinkPanel();
}

function updateHashForRegion(regionName) {
  const slug = toSlug(regionName);
  if (!slug) return;
  setHash(`#region-${slug}`);
}

function updateHashForMarker(marker) {
  const hashValue = getMarkerHash(marker);
  if (!hashValue) return;
  setHash(hashValue);
}

function activateRegion(regionName, { updateHash = true } = {}) {
  setRegionDetail(regionName);
  focusRegion(regionName);
  if (updateHash) updateHashForRegion(regionName);
}

function activateMarker(marker, { focus = false, updateHash = true } = {}) {
  if (!marker) return;
  setActiveTrace(marker);
  if (marker.region) {
    setRegionDetail(marker.region);
  }
  if (focus) {
    focusBeacon(marker);
  }
  if (updateHash) {
    updateHashForMarker(marker);
  }
}

function parseHashTarget(hashValue = window.location.hash) {
  const raw = String(hashValue || "").replace(/^#/, "").trim();
  if (!raw) return null;
  if (raw.startsWith("region-")) {
    return { type: "region", slug: raw.slice("region-".length) };
  }
  if (raw.startsWith("landmark-")) {
    return { type: "landmark", slug: raw.slice("landmark-".length) };
  }
  const beaconMatch = /^beacon-(\d+)$/.exec(raw);
  if (beaconMatch) {
    return { type: "beacon", issueNumber: Number(beaconMatch[1]) };
  }
  return null;
}

function restoreHashSelection() {
  const target = parseHashTarget();
  if (!target) return false;

  if (target.type === "region") {
    const regionName = Object.keys(REGION_FOCUS).find((name) => toSlug(name) === target.slug);
    if (!regionName) return false;
    activateRegion(regionName, { updateHash: false });
    return true;
  }

  if (target.type === "landmark") {
    const landmark = LANDMARKS.find((item) => toSlug(item.title) === target.slug);
    if (!landmark) return false;
    activateMarker({ ...landmark, type: "landmark" }, { focus: true, updateHash: false });
    return true;
  }

  if (target.type === "beacon") {
    const beacon = state.beacons.find((item) => parseIssueNumber(item.issueNumber) === target.issueNumber);
    if (!beacon) return false;
    activateMarker({ ...beacon, type: "beacon" }, { focus: true, updateHash: false });
    return true;
  }

  return false;
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function getBeaconPosture(beacon) {
  const evidence = String((beacon && beacon.evidence) || "").trim();
  const revision = String((beacon && beacon.revision) || "").trim();
  const hasEvidence = evidence.length > 0;
  const hasRevision = revision.length > 0;

  if (hasEvidence && hasRevision) {
    return {
      hasEvidence,
      hasRevision,
      code: "full",
      label: "Evidence + revision",
      summary: "This beacon names both an evidence anchor and a revision trigger."
    };
  }

  if (hasEvidence) {
    return {
      hasEvidence,
      hasRevision,
      code: "evidence",
      label: "Evidence only",
      summary: "This beacon names evidence, but not yet what would revise it."
    };
  }

  if (hasRevision) {
    return {
      hasEvidence,
      hasRevision,
      code: "revision",
      label: "Revision only",
      summary: "This beacon names what would revise it, but not yet the evidence anchoring it."
    };
  }

  return {
    hasEvidence,
    hasRevision,
    code: "minimal",
    label: "Minimal trace",
    summary: "This beacon is public, but does not yet record evidence or revision fields."
  };
}

function renderTracePanel() {
  if (!el.tracePanel) return;
  const trace = state.activeTrace;
  if (!trace) {
    el.tracePanel.innerHTML = '<p class="small">Click a landmark or visitor beacon to inspect it here.</p>';
    return;
  }

  const pills = [
    `<span class="trace-pill">${trace.type === "beacon" ? "Visitor beacon" : "Landmark"}</span>`,
    `<span class="trace-pill">${escapeHtml(trace.region || "Unknown region")}</span>`
  ];
  if (trace.visitor) {
    pills.push(`<span class="trace-pill">Visitor: ${escapeHtml(trace.visitor)}</span>`);
  }
  if (trace.issueNumber) {
    pills.push(`<span class="trace-pill">Issue #${trace.issueNumber}</span>`);
  }

  const link = trace.issueUrl
    ? `<p class="trace-link"><a href="${trace.issueUrl}" target="_blank" rel="noopener">Open public issue ↗</a></p>`
    : '<p class="small trace-link">Built-in landmark: part of the base map.</p>';
  const evidence = String(trace.evidence || "").trim();
  const revision = String(trace.revision || "").trim();
  const posture = trace.type === "beacon" ? getBeaconPosture(trace) : null;
  const postureSection = posture
    ? `
      <section class="trace-subsection trace-subsection-accountability">
        <h4>Accountability posture</h4>
        <p>${escapeHtml(posture.summary)}</p>
        <div class="trace-accountability-pills">
          <span class="trace-pill">Public issue</span>
          <span class="trace-pill">${posture.hasEvidence ? "Evidence anchor" : "No evidence anchor"}</span>
          <span class="trace-pill">${posture.hasRevision ? "Revision trigger" : "No revision trigger"}</span>
        </div>
      </section>
    `
    : "";
  const evidenceSection = trace.type === "beacon" && evidence
    ? `
      <section class="trace-subsection">
        <h4>Evidence anchor</h4>
        <p>${escapeHtml(evidence)}</p>
      </section>
    `
    : "";
  const revisionSection = trace.type === "beacon" && revision
    ? `
      <section class="trace-subsection">
        <h4>Revision trigger</h4>
        <p>${escapeHtml(revision)}</p>
      </section>
    `
    : "";

  el.tracePanel.innerHTML = `
    <h3>${escapeHtml(trace.title || "Untitled trace")}</h3>
    <div class="trace-meta">${pills.join("")}</div>
    <p class="trace-note">${escapeHtml(trace.note || "No note recorded.")}</p>
    ${postureSection}
    ${evidenceSection}
    ${revisionSection}
    ${link}
  `;
}

function markerDistance(a, b) {
  const ax = Number(a && a.x);
  const ay = Number(a && a.y);
  const bx = Number(b && b.x);
  const by = Number(b && b.y);
  if (![ax, ay, bx, by].every(Number.isFinite)) return null;
  return Math.hypot(ax - bx, ay - by);
}

function findNearestLandmark(marker) {
  if (!marker || LANDMARKS.length === 0) return null;
  const ranked = LANDMARKS
    .map((landmark) => ({ landmark, distance: markerDistance(marker, landmark) }))
    .filter((entry) => entry.distance !== null)
    .sort((a, b) => a.distance - b.distance || String(a.landmark.title || "").localeCompare(String(b.landmark.title || "")));
  return ranked[0] || null;
}

function findNearestRegionalBeacon(landmark) {
  if (!landmark) return null;
  const regionalBeacons = (Array.isArray(state.beacons) ? state.beacons : []).filter(
    (beacon) => beacon && beacon.region === landmark.region
  );
  const ranked = regionalBeacons
    .map((beacon) => ({ beacon, distance: markerDistance(landmark, beacon) }))
    .filter((entry) => entry.distance !== null)
    .sort((a, b) => a.distance - b.distance || compareBeaconLedger(a.beacon, b.beacon));
  return ranked[0] || null;
}

function renderVerificationChain() {
  if (!el.verificationChain) return;
  const trace = state.activeTrace;
  if (!trace) {
    el.verificationChain.innerHTML = '<p class="chain-summary muted">Click a landmark or beacon to inspect its chain context.</p>';
    return;
  }

  const x = Number(trace.x);
  const y = Number(trace.y);
  const coordPills = Number.isFinite(x) && Number.isFinite(y)
    ? `
      <div class="chain-meta">
        <span class="chain-pill">x: ${x.toFixed(1)}</span>
        <span class="chain-pill">y: ${y.toFixed(1)}</span>
      </div>
    `
    : "";

  const actionTargets = {};
  let html = "";

  if (trace.type === "beacon") {
    const sortedBeacons = [...state.beacons].sort(compareBeaconLedger);
    const activeIssue = parseIssueNumber(trace.issueNumber);
    const traceIndex = sortedBeacons.findIndex((beacon) => parseIssueNumber(beacon.issueNumber) === activeIssue);
    const chainSentence = traceIndex >= 0
      ? `This beacon is ${traceIndex + 1} of ${sortedBeacons.length} in the public chain (newest first).`
      : "This beacon is not currently in the loaded public chain.";
    const nearestLandmark = findNearestLandmark(trace);
    const nearestSentence = nearestLandmark
      ? `Nearest built-in landmark: ${nearestLandmark.landmark.title} (~${nearestLandmark.distance.toFixed(1)} map-% units).`
      : "Nearest built-in landmark is unavailable.";

    const newerTrace = traceIndex > 0 ? sortedBeacons[traceIndex - 1] : null;
    const olderTrace = traceIndex >= 0 && traceIndex < sortedBeacons.length - 1 ? sortedBeacons[traceIndex + 1] : null;
    if (newerTrace) actionTargets.newer = newerTrace;
    if (olderTrace) actionTargets.older = olderTrace;

    const actionHtml = newerTrace || olderTrace
      ? `
        <div class="chain-actions">
          ${newerTrace ? '<button type="button" class="chain-action" data-chain-target="newer">Newer trace</button>' : ""}
          ${olderTrace ? '<button type="button" class="chain-action" data-chain-target="older">Older trace</button>' : ""}
        </div>
      `
      : "";

    html = `
      <p class="chain-summary">${escapeHtml(chainSentence)}</p>
      ${coordPills}
      <p class="chain-context">${escapeHtml(nearestSentence)}</p>
      ${actionHtml}
    `;
  } else {
    const nearestRegionalBeacon = findNearestRegionalBeacon(trace);
    const contextHtml = nearestRegionalBeacon
      ? `Nearest public beacon in ${escapeHtml(trace.region || "this region")}: ${escapeHtml(
          nearestRegionalBeacon.beacon.title || "Untitled beacon"
        )} by ${escapeHtml(nearestRegionalBeacon.beacon.visitor || "Unknown")}.`
      : `No public beacons are logged in ${escapeHtml(trace.region || "this region")} yet.`;

    if (nearestRegionalBeacon) {
      actionTargets.nearest = nearestRegionalBeacon.beacon;
    }

    html = `
      <p class="chain-summary">This is a built-in anchor in ${escapeHtml(trace.region || "its region")}.</p>
      ${coordPills}
      <p class="chain-context">${contextHtml}</p>
      ${nearestRegionalBeacon ? '<div class="chain-actions"><button type="button" class="chain-action" data-chain-target="nearest">Jump to nearest public beacon</button></div>' : ""}
    `;
  }

  el.verificationChain.innerHTML = html;
  el.verificationChain.querySelectorAll("[data-chain-target]").forEach((node) => {
    node.addEventListener("click", () => {
      const target = actionTargets[node.dataset.chainTarget];
      if (!target) return;
      activateMarker({ ...target, type: "beacon" }, { focus: true, updateHash: true });
    });
  });
}

function parseIssueNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseCreatedAt(value) {
  const timestamp = Date.parse(value || "");
  return Number.isFinite(timestamp) ? timestamp : null;
}

function compareBeaconLedger(a, b) {
  const aIssue = parseIssueNumber(a && a.issueNumber);
  const bIssue = parseIssueNumber(b && b.issueNumber);
  if (aIssue !== null || bIssue !== null) {
    if (aIssue !== null && bIssue !== null && aIssue !== bIssue) return bIssue - aIssue;
    if (aIssue !== null) return -1;
    if (bIssue !== null) return 1;
  }

  const aCreatedAt = parseCreatedAt(a && a.createdAt);
  const bCreatedAt = parseCreatedAt(b && b.createdAt);
  if (aCreatedAt !== null || bCreatedAt !== null) {
    if (aCreatedAt !== null && bCreatedAt !== null && aCreatedAt !== bCreatedAt) return bCreatedAt - aCreatedAt;
    if (aCreatedAt !== null) return -1;
    if (bCreatedAt !== null) return 1;
  }

  return String(a && a.title ? a.title : "").localeCompare(String(b && b.title ? b.title : ""));
}

function formatShortTimestamp(value) {
  const timestamp = parseCreatedAt(value);
  if (timestamp === null) return "";
  return new Date(timestamp).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function publicBeaconLabel(count) {
  return `${count} public beacon${count === 1 ? "" : "s"}`;
}

function getLedgerFilters() {
  const controls = getLedgerControlValues();
  return {
    region: controls.region,
    posture: controls.posture,
    query: controls.search.toLowerCase()
  };
}

function matchesLedgerFilters(beacon, filters) {
  if (!beacon) return false;
  if (filters.region && filters.region !== "All regions" && beacon.region !== filters.region) {
    return false;
  }
  const posture = getBeaconPosture(beacon);
  if (filters.posture === "Evidence anchored" && !posture.hasEvidence) {
    return false;
  }
  if (filters.posture === "Revision ready" && !posture.hasRevision) {
    return false;
  }
  if (filters.posture === "Evidence + revision" && !(posture.hasEvidence && posture.hasRevision)) {
    return false;
  }
  if (filters.posture === "Missing evidence or revision" && posture.hasEvidence && posture.hasRevision) {
    return false;
  }
  if (!filters.query) return true;
  const searchable = [beacon.title, beacon.visitor, beacon.region, beacon.note, beacon.evidence, beacon.revision]
    .map((value) => String(value || "").toLowerCase())
    .join(" ");
  return searchable.includes(filters.query);
}

function setLedgerSummary(visibleCount, totalCount) {
  if (!el.ledgerSummary) return;
  if (totalCount === 0) {
    el.ledgerSummary.textContent = "Showing 0 of 0 public beacons.";
    return;
  }
  if (visibleCount === totalCount) {
    el.ledgerSummary.textContent = `Showing all ${publicBeaconLabel(totalCount)}.`;
    return;
  }
  el.ledgerSummary.textContent = `Showing ${visibleCount} of ${publicBeaconLabel(totalCount)}.`;
}

function focusBeacon(marker) {
  if (!marker || !Number.isFinite(Number(marker.x)) || !Number.isFinite(Number(marker.y))) return;
  const vw = el.viewport.clientWidth;
  const vh = el.viewport.clientHeight;
  const worldX = (Number(marker.x) / 100) * MAP_W;
  const worldY = (Number(marker.y) / 100) * MAP_H;
  state.tx = vw / 2 - worldX * state.scale;
  state.ty = vh / 2 - worldY * state.scale;
  setTransform();
}

function renderBeaconLedger() {
  if (!el.beaconLedger) return;
  const sortedBeacons = [...state.beacons].sort(compareBeaconLedger);
  if (sortedBeacons.length === 0) {
    setLedgerSummary(0, 0);
    el.beaconLedger.innerHTML = '<p class="small">No visitor traces logged yet.</p>';
    return;
  }

  const ledgerFilters = getLedgerFilters();
  const filteredBeacons = sortedBeacons.filter((beacon) => matchesLedgerFilters(beacon, ledgerFilters));
  setLedgerSummary(filteredBeacons.length, sortedBeacons.length);
  if (filteredBeacons.length === 0) {
    el.beaconLedger.innerHTML = '<p class="small">No visitor traces match the current filters.</p>';
    return;
  }

  const active = state.activeTrace ? traceKey(state.activeTrace) : "";
  const list = filteredBeacons
    .map((beacon, index) => {
      const issueNumber = parseIssueNumber(beacon.issueNumber);
      const issueLabel = issueNumber === null ? "Issue pending" : `Issue #${issueNumber}`;
      const timestamp = formatShortTimestamp(beacon.createdAt);
      const timestampHtml = timestamp ? `<span class="ledger-pill">${escapeHtml(timestamp)}</span>` : "";
      const posture = getBeaconPosture(beacon);
      const postureHtml = `<span class="ledger-pill ledger-pill-posture">${escapeHtml(posture.label)}</span>`;
      const evidenceHtml = posture.hasEvidence
        ? '<span class="ledger-pill ledger-pill-context">Evidence noted</span>'
        : "";
      const revisionHtml = posture.hasRevision
        ? '<span class="ledger-pill ledger-pill-context">Revision noted</span>'
        : "";
      const isActive = active && active === traceKey(beacon);
      return `
        <li>
          <button type="button" class="ledger-item${isActive ? " is-active" : ""}" data-ledger-index="${index}">
            <strong>${escapeHtml(beacon.title || "Untitled beacon")}</strong>
            <span class="ledger-meta">${escapeHtml(beacon.visitor || "Unknown")} · ${escapeHtml(beacon.region || "Unknown region")}</span>
            <span class="ledger-pills">
              <span class="ledger-pill">${escapeHtml(issueLabel)}</span>
              ${timestampHtml}
              ${postureHtml}
              ${evidenceHtml}
              ${revisionHtml}
            </span>
          </button>
        </li>
      `;
    })
    .join("");

  el.beaconLedger.innerHTML = `<ul class="ledger-list">${list}</ul>`;
  el.beaconLedger.querySelectorAll("[data-ledger-index]").forEach((node) => {
    node.addEventListener("click", () => {
      const index = Number(node.dataset.ledgerIndex);
      const marker = filteredBeacons[index];
      if (!marker) return;
      activateMarker({ ...marker, type: "beacon" }, { focus: true, updateHash: true });
    });
  });
}

function renderRegionSurvey() {
  if (!el.regionSurvey) return;

  const regionNames = Object.keys(REGION_COPY);
  const landmarkCounts = new Map(regionNames.map((regionName) => [regionName, 0]));
  LANDMARKS.forEach((landmark) => {
    const total = landmarkCounts.get(landmark.region) || 0;
    landmarkCounts.set(landmark.region, total + 1);
  });

  const beaconsByRegion = new Map(regionNames.map((regionName) => [regionName, []]));
  (Array.isArray(state.beacons) ? state.beacons : []).forEach((beacon) => {
    const regionName = String((beacon && beacon.region) || "");
    if (!beaconsByRegion.has(regionName)) {
      beaconsByRegion.set(regionName, []);
    }
    beaconsByRegion.get(regionName).push(beacon);
  });

  const latestByRegion = new Map();
  const listHtml = regionNames
    .map((regionName) => {
      const sorted = [...(beaconsByRegion.get(regionName) || [])].sort(compareBeaconLedger);
      const latest = sorted[0] || null;
      latestByRegion.set(regionName, latest);

      const latestLine = latest
        ? (() => {
            const details = [
              latest.title || "Untitled beacon",
              latest.visitor || "Unknown"
            ];
            const timestamp = formatShortTimestamp(latest.createdAt);
            if (timestamp) details.push(timestamp);
            return `Latest public trace: ${details.join(" · ")}`;
          })()
        : "No public beacons are logged there yet.";

      return `
        <li>
          <button type="button" class="survey-item${state.activeRegion === regionName ? " is-active" : ""}" data-survey-region="${escapeHtml(regionName)}">
            <span class="survey-header">${escapeHtml(regionName)}</span>
            <span class="survey-copy">${escapeHtml(REGION_COPY[regionName] || "")}</span>
            <span class="survey-meta">
              <span class="survey-pill">${landmarkCounts.get(regionName) || 0} landmark${(landmarkCounts.get(regionName) || 0) === 1 ? "" : "s"}</span>
              <span class="survey-pill">${sorted.length} public beacon${sorted.length === 1 ? "" : "s"}</span>
            </span>
            <span class="survey-latest${latest ? "" : " small"}">${escapeHtml(latestLine)}</span>
          </button>
          ${latest ? `<div class="survey-actions"><button type="button" class="survey-action" data-survey-jump="${escapeHtml(regionName)}">Jump to latest beacon</button></div>` : ""}
        </li>
      `;
    })
    .join("");

  el.regionSurvey.innerHTML = `<ul class="survey-list">${listHtml}</ul>`;

  el.regionSurvey.querySelectorAll("[data-survey-region]").forEach((node) => {
    node.addEventListener("click", () => {
      const regionName = node.dataset.surveyRegion;
      if (!regionName) return;
      activateRegion(regionName, { updateHash: true });
    });
  });

  el.regionSurvey.querySelectorAll("[data-survey-jump]").forEach((node) => {
    node.addEventListener("click", (ev) => {
      ev.stopPropagation();
      ev.preventDefault();
      const regionName = node.dataset.surveyJump;
      if (!regionName) return;
      const latest = latestByRegion.get(regionName);
      if (!latest) return;
      activateMarker({ ...latest, type: "beacon" }, { focus: true, updateHash: true });
    });
  });
}

function setActiveTrace(marker) {
  state.activeTrace = marker
    ? {
        ...marker,
        type: marker.type || (marker.issueNumber ? "beacon" : "landmark")
      }
    : null;
  renderLandmarks();
  renderBeacons();
  renderVerificationRoute();
  renderTracePanel();
  renderVerificationChain();
  renderBeaconLedger();
  renderPermalinkPanel();
}

function addMarker(layer, marker) {
  const node = document.createElement("button");
  node.type = "button";
  node.className = "marker";
  if (state.activeTrace && traceKey(state.activeTrace) === traceKey(marker)) {
    node.classList.add("is-active");
  }
  node.dataset.type = marker.type;
  node.style.left = `${marker.x}%`;
  node.style.top = `${marker.y}%`;
  node.style.color = marker.color || "#a5d9ff";
  node.setAttribute(
    "title",
    `${marker.title}\n${marker.region}\n${marker.note}${marker.visitor ? `\nVisitor: ${marker.visitor}` : ""}`
  );
  node.addEventListener("pointerdown", (ev) => ev.stopPropagation());
  node.addEventListener("pointerup", (ev) => ev.stopPropagation());
  node.addEventListener("click", (ev) => {
    ev.stopPropagation();
    activateMarker(marker, { updateHash: true });
  });
  layer.appendChild(node);
}

function renderLandmarks() {
  el.landmarkLayer.innerHTML = "";
  LANDMARKS.forEach((lm) => addMarker(el.landmarkLayer, { ...lm, type: "landmark" }));
}

function renderBeacons() {
  el.beaconLayer.innerHTML = "";
  state.beacons.forEach((b) => addMarker(el.beaconLayer, { ...b, type: "beacon" }));
}

function createSvgNode(tagName, attrs) {
  const node = document.createElementNS(SVG_NS, tagName);
  if (attrs) {
    Object.entries(attrs).forEach(([key, value]) => {
      node.setAttribute(key, value);
    });
  }
  return node;
}

function renderVerificationRoute() {
  if (!el.verificationRouteLayer) return;

  const isVisible = !el.toggleVerificationRoute || el.toggleVerificationRoute.checked;
  el.verificationRouteLayer.style.display = isVisible ? "block" : "none";
  if (!isVisible) return;

  const sortedBeacons = [...(Array.isArray(state.beacons) ? state.beacons : [])]
    .sort(compareBeaconLedger)
    .map((beacon) => {
      const xPct = Number(beacon && beacon.x);
      const yPct = Number(beacon && beacon.y);
      if (!Number.isFinite(xPct) || !Number.isFinite(yPct)) return null;
      return {
        ...beacon,
        worldX: (xPct / 100) * MAP_W,
        worldY: (yPct / 100) * MAP_H
      };
    })
    .filter(Boolean);

  if (sortedBeacons.length < 2) {
    el.verificationRouteLayer.replaceChildren();
    return;
  }

  const activeIssue = parseIssueNumber(state.activeTrace && state.activeTrace.issueNumber);
  const points = sortedBeacons.map((beacon) => `${beacon.worldX.toFixed(1)},${beacon.worldY.toFixed(1)}`).join(" ");
  const newest = sortedBeacons[0];
  const oldest = sortedBeacons[sortedBeacons.length - 1];
  const newestLabelX = Math.min(MAP_W - 80, newest.worldX + 16);
  const newestLabelY = Math.max(24, newest.worldY - 14);
  const oldestLabelX = Math.min(MAP_W - 80, oldest.worldX + 16);
  const oldestLabelY = Math.max(24, oldest.worldY - 14);

  const routeGroup = createSvgNode("g", { class: "verification-route" });
  routeGroup.appendChild(createSvgNode("polyline", { class: "verification-route-glow", points }));
  routeGroup.appendChild(createSvgNode("polyline", { class: "verification-route-path", points }));

  sortedBeacons.forEach((beacon) => {
    const issueNumber = parseIssueNumber(beacon.issueNumber);
    const activeClass = issueNumber !== null && issueNumber === activeIssue ? " is-active" : "";
    const node = createSvgNode("g", {
      class: `verification-route-node${activeClass}`,
      transform: `translate(${beacon.worldX.toFixed(1)} ${beacon.worldY.toFixed(1)})`
    });
    node.appendChild(createSvgNode("circle", { class: "verification-route-node-ring", r: "8" }));
    node.appendChild(createSvgNode("circle", { class: "verification-route-node-dot", r: "3.2" }));
    node.appendChild(createSvgNode("circle", { class: "verification-route-node-active-ring", r: "12" }));
    routeGroup.appendChild(node);
  });

  const newestLabel = createSvgNode("text", {
    class: "verification-route-label verification-route-label-newest",
    x: newestLabelX.toFixed(1),
    y: newestLabelY.toFixed(1)
  });
  newestLabel.textContent = "Newest";
  routeGroup.appendChild(newestLabel);

  const oldestLabel = createSvgNode("text", {
    class: "verification-route-label verification-route-label-oldest",
    x: oldestLabelX.toFixed(1),
    y: oldestLabelY.toFixed(1)
  });
  oldestLabel.textContent = "Oldest";
  routeGroup.appendChild(oldestLabel);

  el.verificationRouteLayer.replaceChildren(routeGroup);
}

function parseBeaconBlock(text) {
  if (!text) return null;

  const keys = ["x", "y", "title", "note", "evidence", "revision", "region", "color", "visitor"];
  const data = {};
  keys.forEach((k) => {
    const rx = new RegExp(`^###\\s*${k}\\s*[\\r\\n]+([\\s\\S]*?)(?=^###\\s*\\w+|$)`, "gim");
    const m = rx.exec(text);
    if (m) data[k] = m[1].trim();
  });

  const normalizedHeading = normalizeBeacon(data);
  if (normalizedHeading) return normalizedHeading;

  const fenced = text.match(/```(?:beacon|signal-beacon)?\s*([\s\S]*?)```/i);
  if (!fenced) return null;
  const rows = fenced[1].split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  const fencedData = {};
  rows.forEach((row) => {
    const idx = row.indexOf(":");
    if (idx > 0) {
      const key = row.slice(0, idx).trim().toLowerCase();
      const value = row.slice(idx + 1).trim();
      fencedData[key] = value;
    }
  });

  return normalizeBeacon(fencedData);
}

function normalizeBeacon(raw) {
  if (!raw) return null;
  const x = Number(raw.x);
  const y = Number(raw.y);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;

  const clamp = (n) => Math.max(0, Math.min(100, Number(n)));
  const color = /^#[0-9a-f]{6}$/i.test((raw.color || "").trim()) ? raw.color.trim() : "#77e2ff";

  return {
    x: clamp(x),
    y: clamp(y),
    title: (raw.title || "Untitled beacon").toString().slice(0, 80),
    note: (raw.note || "").toString().slice(0, 400),
    evidence: (raw.evidence || "").toString().slice(0, 300),
    revision: (raw.revision || "").toString().slice(0, 300),
    region: (raw.region || "Beacon Field").toString().slice(0, 80),
    color,
    visitor: (raw.visitor || "Unknown").toString().slice(0, 60)
  };
}

function hasBeaconLabel(issue) {
  return Array.isArray(issue.labels) && issue.labels.some((label) => label && label.name === ISSUE_LABEL);
}

async function fetchJson(url, { allow404 = false } = {}) {
  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json"
    }
  });

  if (!res.ok) {
    if (allow404 && res.status === 404) {
      return null;
    }
    if (res.status === 403 || res.status === 429) {
      throw new Error("GitHub API rate limit reached. Please retry in a few minutes.");
    }
    throw new Error(`GitHub API returned ${res.status}.`);
  }

  return res.json();
}

function normalizeBeaconIssues(items) {
  return (Array.isArray(items) ? items : [])
    .filter((issue) => issue && !issue.pull_request && hasBeaconLabel(issue))
    .map((issue) => {
      const parsed = parseBeaconBlock(issue.body || "");
      if (!parsed) return null;
      return {
        ...parsed,
        issueUrl: issue.html_url,
        issueNumber: issue.number,
        createdAt: issue.created_at
      };
    })
    .filter(Boolean);
}

async function fetchBeaconIssues() {
  const all = [];
  let page = 1;
  const maxPages = 5;

  while (page <= maxPages) {
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/issues?state=all&per_page=100&page=${page}`;
    const items = await fetchJson(url);
    if (!Array.isArray(items) || items.length === 0) break;
    all.push(...items);
    if (items.length < 100) break;
    page += 1;
  }

  const repoMeta = await fetchJson(`https://api.github.com/repos/${OWNER}/${REPO}`);
  const openCount = Number(repoMeta && repoMeta.open_issues_count);
  const shouldProbeDirectIssues =
    all.length === 0 || (Number.isFinite(openCount) && openCount > all.length);

  if (!shouldProbeDirectIssues) {
    return normalizeBeaconIssues(all);
  }

  const probeLimit = Math.max(5, Math.min(25, Math.ceil(openCount || 0) + 5));
  const mergedIssues = new Map();
  all.forEach((issue) => {
    if (issue && Number.isFinite(Number(issue.number))) {
      mergedIssues.set(Number(issue.number), issue);
    }
  });

  for (let issueNumber = 1; issueNumber <= probeLimit; issueNumber += 1) {
    const issue = await fetchJson(
      `https://api.github.com/repos/${OWNER}/${REPO}/issues/${issueNumber}`,
      { allow404: true }
    );
    if (issue && !issue.pull_request) {
      mergedIssues.set(issue.number, issue);
    }
  }

  return normalizeBeaconIssues(Array.from(mergedIssues.values()));
}

function setStatus(message, isError = false) {
  el.statusMsg.textContent = message;
  el.statusMsg.style.color = isError ? "var(--danger)" : "var(--muted)";
}

function buildBeaconBody(values) {
  return [
    "<!-- Parsed by The Signal Cartographer beacon parser. Keep this block intact. -->",
    "```beacon",
    `x: ${values.x}`,
    `y: ${values.y}`,
    `title: ${values.title}`,
    `note: ${values.note}`,
    `evidence: ${values.evidence}`,
    `revision: ${values.revision}`,
    `region: ${values.region}`,
    `color: ${values.color}`,
    `visitor: ${values.visitor}`,
    "```",
    "",
    "Structured prompts:",
    "- Note:",
    "- Evidence anchor:",
    "- Revision trigger:"
  ].join("\n");
}

function buildIssueUrl(values) {
  const base = `https://github.com/${OWNER}/${REPO}/issues/new`;
  const params = new URLSearchParams({
    template: "beacon.yml",
    labels: ISSUE_LABEL,
    title: `[Beacon] ${values.title}`,
    body: buildBeaconBody(values),
    beacon_x: String(values.x),
    beacon_y: String(values.y),
    beacon_title: values.title,
    beacon_note: values.note,
    beacon_evidence: values.evidence,
    beacon_revision: values.revision,
    beacon_region: values.region,
    beacon_color: values.color,
    beacon_visitor: values.visitor
  });
  return `${base}?${params.toString()}`;
}

function initInteractions() {
  let copyBtnResetTimer = null;

  recenter();
  restoreLedgerFiltersFromUrl();
  syncLedgerUrlState();

  window.addEventListener("resize", recenter);
  window.addEventListener("hashchange", () => {
    const restored = restoreHashSelection();
    if (!restored) {
      renderPermalinkPanel();
    }
  });

  el.viewport.addEventListener("wheel", (ev) => {
    ev.preventDefault();
    const before = screenToWorld(ev.clientX, ev.clientY);
    const delta = ev.deltaY > 0 ? 0.92 : 1.08;
    state.scale = Math.max(0.45, Math.min(2.1, state.scale * delta));
    const rect = el.viewport.getBoundingClientRect();
    state.tx = ev.clientX - rect.left - before.x * state.scale;
    state.ty = ev.clientY - rect.top - before.y * state.scale;
    setTransform();
  }, { passive: false });

  el.viewport.addEventListener("pointerdown", (ev) => {
    state.dragging = true;
    state.downX = ev.clientX;
    state.downY = ev.clientY;
    state.dragStartX = ev.clientX;
    state.dragStartY = ev.clientY;
    el.viewport.setPointerCapture(ev.pointerId);
  });

  el.viewport.addEventListener("pointermove", (ev) => {
    if (!state.dragging) return;
    state.tx += ev.clientX - state.dragStartX;
    state.ty += ev.clientY - state.dragStartY;
    state.dragStartX = ev.clientX;
    state.dragStartY = ev.clientY;
    setTransform();
  });

  el.viewport.addEventListener("pointerup", (ev) => {
    const moved = Math.abs(ev.clientX - state.downX) + Math.abs(ev.clientY - state.downY);
    state.dragging = false;
    if (moved < 4) {
      const world = screenToWorld(ev.clientX, ev.clientY);
      const percent = worldToPercent(world);
      setSelectedCoord(percent.x, percent.y);
    }
  });

  el.viewport.addEventListener("pointercancel", () => {
    state.dragging = false;
  });

  document.querySelectorAll(".region, .region-list [data-region]").forEach((node) => {
    if (node.classList.contains("region")) {
      node.addEventListener("pointerdown", (ev) => ev.stopPropagation());
      node.addEventListener("pointerup", (ev) => ev.stopPropagation());
    }
    node.addEventListener("mouseenter", () => setRegionDetail(node.dataset.region));
    node.addEventListener("focusin", () => setRegionDetail(node.dataset.region));
    node.addEventListener("click", (ev) => {
      ev.stopPropagation();
      activateRegion(node.dataset.region, { updateHash: true });
    });
  });

  el.beaconRegion.addEventListener("change", () => {
    el.beaconRegion.dataset.userTouched = "1";
  });

  el.toggleLandmarks.addEventListener("change", () => {
    el.landmarkLayer.hidden = !el.toggleLandmarks.checked;
  });

  el.toggleBeacons.addEventListener("change", () => {
    el.beaconLayer.hidden = !el.toggleBeacons.checked;
  });

  if (el.toggleVerificationRoute) {
    el.toggleVerificationRoute.addEventListener("change", renderVerificationRoute);
  }

  if (el.ledgerRegionFilter) {
    el.ledgerRegionFilter.addEventListener("change", handleLedgerFilterChange);
  }

  if (el.ledgerPostureFilter) {
    el.ledgerPostureFilter.addEventListener("change", handleLedgerFilterChange);
  }

  if (el.ledgerSearchFilter) {
    el.ledgerSearchFilter.addEventListener("input", handleLedgerFilterChange);
  }

  el.recenterBtn.addEventListener("click", recenter);
  el.copyPermalinkBtn.addEventListener("click", async () => {
    const currentUrl = buildShareableUrl();
    let copied = false;

    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      try {
        await navigator.clipboard.writeText(currentUrl);
        copied = true;
      } catch (err) {
        copied = false;
      }
    }

    if (!copied && el.permalinkField && typeof document.execCommand === "function") {
      try {
        el.permalinkField.focus();
        el.permalinkField.select();
        copied = Boolean(document.execCommand("copy"));
      } catch (err) {
        copied = false;
      }
    }

    if (copyBtnResetTimer) {
      clearTimeout(copyBtnResetTimer);
    }
    el.copyPermalinkBtn.textContent = copied ? "Copied" : "Copy failed";
    copyBtnResetTimer = window.setTimeout(() => {
      el.copyPermalinkBtn.textContent = "Copy link";
    }, 1200);
  });

  el.beaconForm.addEventListener("submit", (ev) => {
    ev.preventDefault();

    const x = Number(el.beaconX.value);
    const y = Number(el.beaconY.value);
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      setStatus("Pick a point on the map first so x/y are set.", true);
      return;
    }

    const values = {
      x: Math.max(0, Math.min(100, Number(x.toFixed(1)))),
      y: Math.max(0, Math.min(100, Number(y.toFixed(1)))),
      title: el.beaconTitle.value.trim(),
      note: el.beaconNote.value.trim(),
      evidence: el.beaconEvidence.value.trim(),
      revision: el.beaconRevision.value.trim(),
      region: el.beaconRegion.value,
      color: el.beaconColor.value,
      visitor: el.beaconVisitor.value.trim()
    };

    const url = buildIssueUrl(values);
    window.open(url, "_blank", "noopener");
  });

  setRegionDetail("Beacon Field");
  renderTracePanel();
  renderVerificationChain();
  renderVerificationRoute();
  renderPermalinkPanel();
}

async function initBeacons() {
  try {
    const beacons = await fetchBeaconIssues();
    state.beacons = beacons;
    renderRegionSurvey();
    const restoredFromHash = restoreHashSelection();
    if (restoredFromHash) {
      state.restoredHashSelection = true;
    }
    if (!state.activeTrace && !state.restoredHashSelection && beacons.length > 0) {
      const newestBeacon = [...beacons].sort(compareBeaconLedger)[0];
      setActiveTrace(newestBeacon);
    } else {
      renderBeacons();
      renderTracePanel();
      renderBeaconLedger();
    }
    renderVerificationRoute();
    renderVerificationChain();
    setStatus(`${beacons.length} visitor beacon${beacons.length === 1 ? "" : "s"} loaded from public issues.`);
  } catch (err) {
    console.error(err);
    state.beacons = [];
    renderRegionSurvey();
    renderBeaconLedger();
    renderVerificationRoute();
    renderVerificationChain();
    setStatus(
      "Visitor beacons are temporarily unavailable (GitHub API limit or network issue). Landmarks remain explorable.",
      true
    );
  }
}

function init() {
  renderLandmarks();
  initInteractions();
  state.restoredHashSelection = restoreHashSelection();
  initBeacons();
}

init();
