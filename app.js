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
const SURVEY_POSTURE_ACTION_SEPARATOR = "::";
const SURVEY_POSTURE_ACTIONS = [
  {
    code: "full",
    filterLabel: "Evidence + revision",
    actionLabel: "Browse evidence + revision"
  },
  {
    code: "evidence",
    filterLabel: "Evidence only",
    actionLabel: "Browse evidence only"
  },
  {
    code: "revision",
    filterLabel: "Revision only",
    actionLabel: "Browse revision only"
  },
  {
    code: "minimal",
    filterLabel: "Minimal trace",
    actionLabel: "Browse minimal trace"
  }
];

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

const REGION_BOUNDS = [
  { region: "Rumor Sea", left: 6, top: 18, width: 27, height: 25 },
  { region: "Proof Plateau", left: 61, top: 16, width: 30, height: 24 },
  { region: "Revision River", left: 34, top: 47, width: 37, height: 20 },
  { region: "Memory Vault", left: 58, top: 67, width: 35, height: 24 },
  { region: "Beacon Field", left: 8, top: 64, width: 30, height: 24 }
];

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

const ECHO_SITES = [
  {
    id: "brine-index",
    x: 13.8,
    y: 31.2,
    title: "Brine Index",
    note: "Salt-stiff ledgers of claims that traveled fastest before anyone checked their sources.",
    region: "Rumor Sea"
  },
  {
    id: "hearsay-foghorn",
    x: 28.6,
    y: 24.5,
    title: "Hearsay Foghorn",
    note: "A warning buoy that repeats every quote until someone asks who first recorded it.",
    region: "Rumor Sea"
  },
  {
    id: "calibration-arch",
    x: 69.2,
    y: 27.1,
    title: "Calibration Arch",
    note: "Instruments here only agree after settings, baselines, and run logs are exposed.",
    region: "Proof Plateau"
  },
  {
    id: "null-horizon",
    x: 83.4,
    y: 31.4,
    title: "Null Horizon",
    note: "An edge where preferred conclusions dissolve and surviving tests speak plainly.",
    region: "Proof Plateau"
  },
  {
    id: "amendment-ford",
    x: 42.2,
    y: 58.3,
    title: "Amendment Ford",
    note: "Crossing point where version notes decide which narrative can continue downstream.",
    region: "Revision River"
  },
  {
    id: "rollback-bend",
    x: 63.7,
    y: 53.2,
    title: "Rollback Bend",
    note: "A hard curve where overconfident edits are walked back in public daylight.",
    region: "Revision River"
  },
  {
    id: "custody-aisle",
    x: 66.1,
    y: 84.3,
    title: "Custody Aisle",
    note: "Shelves indexed by chain-of-custody tags instead of volume or reputation.",
    region: "Memory Vault"
  },
  {
    id: "archive-suture",
    x: 86.4,
    y: 75.2,
    title: "Archive Suture",
    note: "Threads patched through old records where missing context was later restored.",
    region: "Memory Vault"
  },
  {
    id: "attestation-commons",
    x: 16.8,
    y: 79.6,
    title: "Attestation Commons",
    note: "Open ground where signatures matter less than whether evidence remains reachable.",
    region: "Beacon Field"
  },
  {
    id: "witness-turnstile",
    x: 31.4,
    y: 71.1,
    title: "Witness Turnstile",
    note: "Entry gates that rotate only when a claim arrives with revisable terms.",
    region: "Beacon Field"
  }
];

const LATTICE_STATIONS = [
  {
    id: "hushwater-gate",
    x: 34.4,
    y: 39.1,
    title: "Hushwater Gate",
    note: "A slack-water crossing where repeated claims finally lose enough speed to be sampled.",
    region: "Rumor Sea",
    corridor: "Rumor Sea ↔ Revision River"
  },
  {
    id: "consensus-narrows",
    x: 51.9,
    y: 43.2,
    title: "Consensus Narrows",
    note: "Converging channels where incompatible stories are forced into the same measurable passage.",
    region: "Revision River",
    corridor: "Rumor Sea ↔ Proof Plateau ↔ Revision River"
  },
  {
    id: "baseline-cut",
    x: 65.4,
    y: 39.5,
    title: "Baseline Cut",
    note: "A carved shelf where calibration notes and null results travel with the ascent.",
    region: "Proof Plateau",
    corridor: "Proof Plateau ↔ Revision River"
  },
  {
    id: "redline-ford",
    x: 37.6,
    y: 67.8,
    title: "Redline Ford",
    note: "Crossing stones set only where public corrections can still be followed back upstream.",
    region: "Beacon Field",
    corridor: "Beacon Field ↔ Revision River"
  },
  {
    id: "custody-bridge",
    x: 56.8,
    y: 71.3,
    title: "Custody Bridge",
    note: "Suspension span held up by chain-of-custody tags instead of reputation.",
    region: "Memory Vault",
    corridor: "Revision River ↔ Memory Vault"
  },
  {
    id: "lantern-causeway",
    x: 46.7,
    y: 82.1,
    title: "Lantern Causeway",
    note: "A low road lit by claims that kept their source links intact through the fog.",
    region: "Beacon Field",
    corridor: "Beacon Field ↔ Memory Vault"
  }
];

const SIGNAL_RELAYS = [
  {
    id: "ember-shelf-relay",
    x: 8.6,
    y: 45.2,
    title: "Ember Shelf Relay",
    region: "Rumor Sea",
    band: "Western shelf",
    note: "Relay mast tuned to separate loud rumor from signal that survives retesting."
  },
  {
    id: "northfall-relay",
    x: 33.8,
    y: 11.4,
    title: "Northfall Relay",
    region: "Rumor Sea",
    band: "Northern watch",
    note: "A cold relay facing the map edge, where weak claims shear off first."
  },
  {
    id: "plateau-rim-relay",
    x: 86.2,
    y: 18.4,
    title: "Plateau Rim Relay",
    region: "Proof Plateau",
    band: "Proof horizon",
    note: "This relay keeps a long line of sight over repeatable ground."
  },
  {
    id: "delta-relay",
    x: 83.6,
    y: 50.1,
    title: "Delta Relay",
    region: "Revision River",
    band: "River mouth",
    note: "Corrections fan outward here before rejoining the main current."
  },
  {
    id: "vault-verge-relay",
    x: 87.4,
    y: 82.8,
    title: "Vault Verge Relay",
    region: "Memory Vault",
    band: "Archive perimeter",
    note: "A perimeter relay watching what remains reachable at the edge of storage."
  },
  {
    id: "causeway-relay",
    x: 43.6,
    y: 92.2,
    title: "Causeway Relay",
    region: "Beacon Field",
    band: "Southern causeway",
    note: "Signals bunch here before crossing back toward the public rails."
  },
  {
    id: "beacon-spindle-relay",
    x: 21.4,
    y: 81.2,
    title: "Beacon Spindle Relay",
    region: "Beacon Field",
    band: "Inner field",
    note: "A low relay close to the skiff's usual launch water, useful for first-contact checks."
  }
];

const DRIFT_CURRENTS = [
  {
    id: "rumor-fold-current",
    title: "Rumor Fold Current",
    x: 25.2,
    y: 31.6,
    region: "Rumor Sea",
    flow: "Northwest drift",
    note: "A slow interior drift where repeated bearings separate surviving reports from spray.",
    path: [
      { x: 12.6, y: 37.8 },
      { x: 18.9, y: 34.2 },
      { x: 25.2, y: 31.6 },
      { x: 31.4, y: 29.8 },
      { x: 37.1, y: 28.4 }
    ]
  },
  {
    id: "proof-shear-current",
    title: "Proof Shear Current",
    x: 73.6,
    y: 24.9,
    region: "Proof Plateau",
    flow: "Proof ascent",
    note: "A rising current that favors paths which keep matching on repeated passes.",
    path: [
      { x: 58.8, y: 33.4 },
      { x: 66.7, y: 29.4 },
      { x: 73.6, y: 24.9 },
      { x: 80.4, y: 20.8 },
      { x: 88.2, y: 18.2 }
    ]
  },
  {
    id: "revision-spine-current",
    title: "Revision Spine Current",
    x: 54.6,
    y: 52.7,
    region: "Revision River",
    flow: "Mid-channel correction",
    note: "Corrections gather and accelerate here before they split back into the river.",
    path: [
      { x: 42.1, y: 60.6 },
      { x: 48.3, y: 56.8 },
      { x: 54.6, y: 52.7 },
      { x: 60.8, y: 49.1 },
      { x: 67.2, y: 46.4 }
    ]
  },
  {
    id: "vault-eddies-current",
    title: "Vault Eddies Current",
    x: 74.6,
    y: 74.5,
    region: "Memory Vault",
    flow: "Archive return",
    note: "Storage-side eddies that bring reachable records back toward the open map.",
    path: [
      { x: 61.9, y: 79.6 },
      { x: 68.1, y: 76.8 },
      { x: 74.6, y: 74.5 },
      { x: 81.3, y: 75.2 },
      { x: 87.2, y: 79.1 }
    ]
  },
  {
    id: "beacon-run-current",
    title: "Beacon Run Current",
    x: 28.4,
    y: 83.6,
    region: "Beacon Field",
    flow: "Launch water",
    note: "A near-shore current used for fast launches from Beacon Field into deeper water.",
    path: [
      { x: 16.2, y: 88.1 },
      { x: 22.1, y: 85.5 },
      { x: 28.4, y: 83.6 },
      { x: 35.7, y: 82.9 },
      { x: 42.8, y: 84.1 }
    ]
  }
];

const TRANSIT_LOCKS = [
  {
    id: "rumor-sluice-lock",
    title: "Rumor Sluice",
    x: 19.8,
    y: 40.6,
    region: "Rumor Sea",
    channel: "Testimony exchange",
    note: "A braced sluice where loose reports are compressed into cross-checkable flow.",
    linkedLockId: "revision-lift-lock"
  },
  {
    id: "revision-lift-lock",
    title: "Revision Lift",
    x: 59.8,
    y: 47.4,
    region: "Revision River",
    channel: "Testimony exchange",
    note: "A counterweighted lift that raises disputed claims into visible correction lanes.",
    linkedLockId: "rumor-sluice-lock"
  },
  {
    id: "vault-spiral-lock",
    title: "Vault Spiral",
    x: 79.8,
    y: 83.4,
    region: "Memory Vault",
    channel: "Archive release",
    note: "A spiral gate that releases preserved records back into navigable circulation.",
    linkedLockId: "beacon-harbor-lock"
  },
  {
    id: "beacon-harbor-lock",
    title: "Beacon Harbor Lock",
    x: 24.8,
    y: 76.2,
    region: "Beacon Field",
    channel: "Archive release",
    note: "A receiving lock where public launches meet records returned from storage.",
    linkedLockId: "vault-spiral-lock"
  }
];

const SIGNAL_RELAY_LINKS = [
  ["ember-shelf-relay", "northfall-relay"],
  ["northfall-relay", "plateau-rim-relay"],
  ["plateau-rim-relay", "delta-relay"],
  ["delta-relay", "vault-verge-relay"],
  ["vault-verge-relay", "causeway-relay"],
  ["causeway-relay", "beacon-spindle-relay"],
  ["beacon-spindle-relay", "ember-shelf-relay"]
];

const LATTICE_LINKS = [
  ["landmark:whisper-breakwater", "echo:brine-index"],
  ["landmark:whisper-breakwater", "echo:hearsay-foghorn"],
  ["landmark:whisper-breakwater", "lattice:hushwater-gate"],
  ["lattice:hushwater-gate", "lattice:consensus-narrows"],
  ["lattice:consensus-narrows", "landmark:errata-locks"],
  ["lattice:consensus-narrows", "echo:amendment-ford"],
  ["lattice:consensus-narrows", "echo:rollback-bend"],
  ["lattice:consensus-narrows", "lattice:baseline-cut"],
  ["lattice:baseline-cut", "landmark:replicator-steps"],
  ["lattice:baseline-cut", "echo:calibration-arch"],
  ["lattice:baseline-cut", "echo:null-horizon"],
  ["landmark:public-rails", "lattice:redline-ford"],
  ["lattice:redline-ford", "landmark:errata-locks"],
  ["lattice:redline-ford", "echo:attestation-commons"],
  ["lattice:redline-ford", "echo:witness-turnstile"],
  ["lattice:custody-bridge", "landmark:errata-locks"],
  ["lattice:custody-bridge", "landmark:witness-ledger"],
  ["lattice:custody-bridge", "echo:custody-aisle"],
  ["lattice:lantern-causeway", "landmark:public-rails"],
  ["lattice:lantern-causeway", "landmark:witness-ledger"],
  ["lattice:lantern-causeway", "landmark:trace-lanterns"],
  ["lattice:lantern-causeway", "echo:archive-suture"],
  ["lattice:lantern-causeway", "lattice:custody-bridge"]
];

const SIGNAL_SWEEP_RADIUS_PCT = 6.5;
const SIGNAL_SWEEP_NEARBY_MAX = 3;
const SIGNAL_SWEEP_HIGHLIGHT_MAX = 5;
const SURVEY_SKIFF_STEP_PCT = 1.1;
const SURVEY_SKIFF_SHIFT_STEP_PCT = 2.2;
const SURVEY_SKIFF_NEARBY_ANCHOR_MAX = 3;
const SURVEY_GRID_COLUMNS = 5;
const SURVEY_GRID_ROWS = 5;
const SURVEY_GRID_LOG_MAX = 8;
const TRIANGULATION_ANCHOR_COUNT = 3;
const TRIANGULATION_LOG_MAX = 6;
const APPROACH_RADAR_RADIUS_PCT = 16;
const APPROACH_RADAR_RING_STEPS = [0.34, 0.67, 1];
const APPROACH_RADAR_TARGET_LIST_MAX = 6;
const APPROACH_RADAR_LOG_MAX = 6;
const BEACON_SOUNDING_RADIUS_PCT = 18;
const BEACON_SOUNDING_RING_STEPS = [0.34, 0.67, 1];
const BEACON_SOUNDING_TARGET_LIST_MAX = 6;
const BEACON_SOUNDING_LOG_MAX = 6;
const SURVEY_WAKE_POINT_MIN_STEP_PCT = 0.6;
const SURVEY_WAKE_MAX_POINTS = 72;
const SURVEY_WAKE_MILESTONE_MAX = 6;
const SIGNAL_RELAY_CONTACT_RADIUS_PCT = 4.2;
const SIGNAL_RELAY_LOG_MAX = 6;
const DRIFT_CURRENT_ENTRY_RADIUS_PCT = 4.8;
const DRIFT_CURRENT_LOG_MAX = 6;
const TRANSIT_LOCK_CHART_RADIUS_PCT = 4.6;
const TRANSIT_JUMP_LOG_MAX = 6;
const DRIFT_SIGNAL_BASE_BERTHS = [
  { x: 8.5, y: 10.5 },
  { x: 27.5, y: 8.0 },
  { x: 49.5, y: 7.2 },
  { x: 72.0, y: 8.4 },
  { x: 90.8, y: 16.5 },
  { x: 93.0, y: 37.5 },
  { x: 91.6, y: 60.5 },
  { x: 86.8, y: 83.5 },
  { x: 67.0, y: 92.5 },
  { x: 43.0, y: 93.8 },
  { x: 19.5, y: 91.0 },
  { x: 7.0, y: 67.5 }
];
const DRIFT_SIGNAL_LANE_OFFSETS = [{ x: 0, y: 0 }, { x: 1.2, y: 1.2 }, { x: -1.2, y: -1.2 }];

function withLandmarkIds(landmarks) {
  return (Array.isArray(landmarks) ? landmarks : []).map((landmark) => ({
    ...landmark,
    id: toSlug(landmark && landmark.title)
  }));
}

const BUILTIN_LANDMARKS = withLandmarkIds(LANDMARKS).map((landmark) => ({
  ...landmark,
  type: "landmark"
}));
const BUILTIN_ECHO_SITES = ECHO_SITES.map((echo) => ({ ...echo, type: "echo" }));
const BUILTIN_LATTICE_STATIONS = LATTICE_STATIONS.map((station) => ({ ...station, type: "lattice" }));
const BUILTIN_SIGNAL_RELAYS = SIGNAL_RELAYS.map((relay) => ({ ...relay, type: "relay" }));
const BUILTIN_DRIFT_CURRENTS = DRIFT_CURRENTS.map((current) => ({ ...current, type: "current" }));
const BUILTIN_TRANSIT_LOCKS = TRANSIT_LOCKS.map((lock) => ({ ...lock, type: "transit-lock" }));

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
  restoredHashSelection: false,
  sweepEnabled: true,
  traverseLatticeEnabled: true,
  surveySkiffEnabled: true,
  surveySkiffCoord: { x: 18.4, y: 78.6 },
  surveyGridEnabled: true,
  triangulationEnabled: true,
  approachRadarEnabled: true,
  beaconSoundingsEnabled: true,
  tracePassageEnabled: true,
  witnessThreadsEnabled: true,
  currentTriangulationFix: null,
  triangulationLog: [],
  currentApproachRadarScan: null,
  approachRadarLog: [],
  currentBeaconSounding: null,
  beaconSoundingLog: [],
  chartedSurveySectorIds: new Set(),
  surveySectorLog: [],
  surveyWakeEnabled: true,
  surveyWakePoints: [{ x: 18.4, y: 78.6 }],
  surveyWakeMilestones: [],
  signalRelaysEnabled: true,
  driftCurrentsEnabled: true,
  transitLocksEnabled: true,
  contactedRelayIds: new Set(),
  relayContactLog: [],
  enteredCurrentIds: new Set(),
  currentEntryLog: [],
  chartedTransitLockIds: new Set(),
  transitJumpLog: [],
  sweepPointerActive: false,
  sweepCoord: null,
  discoveredEchoIds: new Set(),
  nearbyEchoes: []
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
  accountabilityCensus: document.getElementById("accountabilityCensus"),
  regionSurvey: document.getElementById("regionSurvey"),
  recenterBtn: document.getElementById("recenterBtn"),
  toggleLandmarks: document.getElementById("toggleLandmarks"),
  toggleBeacons: document.getElementById("toggleBeacons"),
  toggleVerificationRoute: document.getElementById("toggleVerificationRoute"),
  toggleSignalSweep: document.getElementById("toggleSignalSweep"),
  toggleTraverseLattice: document.getElementById("toggleTraverseLattice"),
  toggleSurveySkiff: document.getElementById("toggleSurveySkiff"),
  toggleSurveyWake: document.getElementById("toggleSurveyWake"),
  toggleSurveyGrid: document.getElementById("toggleSurveyGrid"),
  toggleTriangulation: document.getElementById("toggleTriangulation"),
  toggleApproachRadar: document.getElementById("toggleApproachRadar"),
  toggleBeaconSoundings: document.getElementById("toggleBeaconSoundings"),
  toggleTracePassage: document.getElementById("toggleTracePassage"),
  toggleWitnessThreads: document.getElementById("toggleWitnessThreads"),
  toggleSignalRelays: document.getElementById("toggleSignalRelays"),
  toggleDriftCurrents: document.getElementById("toggleDriftCurrents"),
  toggleTransitLocks: document.getElementById("toggleTransitLocks"),
  landmarkLayer: document.getElementById("landmarkLayer"),
  beaconLayer: document.getElementById("beaconLayer"),
  relayLayer: document.getElementById("relayLayer"),
  currentLayer: document.getElementById("currentLayer"),
  transitLockMarkerLayer: document.getElementById("transitLockMarkerLayer"),
  echoLayer: document.getElementById("echoLayer"),
  latticeLayer: document.getElementById("latticeLayer"),
  surveySkiffLayer: document.getElementById("surveySkiffLayer"),
  surveyWakeLayer: document.getElementById("surveyWakeLayer"),
  surveyGridLayer: document.getElementById("surveyGridLayer"),
  triangulationLayer: document.getElementById("triangulationLayer"),
  approachRadarLayer: document.getElementById("approachRadarLayer"),
  beaconSoundingsLayer: document.getElementById("beaconSoundingsLayer"),
  driftSignalLayer: document.getElementById("driftSignalLayer"),
  tracePassageLayer: document.getElementById("tracePassageLayer"),
  witnessThreadsLayer: document.getElementById("witnessThreadsLayer"),
  traverseLatticeLayer: document.getElementById("traverseLatticeLayer"),
  driftCurrentLayer: document.getElementById("driftCurrentLayer"),
  signalRelayLayer: document.getElementById("signalRelayLayer"),
  transitLockLayer: document.getElementById("transitLockLayer"),
  verificationRouteLayer: document.getElementById("verificationRouteLayer"),
  signalSweepLayer: document.getElementById("signalSweepLayer"),
  signalSweep: document.getElementById("signalSweep"),
  traverseLattice: document.getElementById("traverseLattice"),
  surveySkiff: document.getElementById("surveySkiff"),
  surveyWake: document.getElementById("surveyWake"),
  surveyGrid: document.getElementById("surveyGrid"),
  triangulation: document.getElementById("triangulation"),
  approachRadar: document.getElementById("approachRadar"),
  beaconSoundings: document.getElementById("beaconSoundings"),
  driftSignals: document.getElementById("driftSignals"),
  tracePassage: document.getElementById("tracePassage"),
  witnessThreads: document.getElementById("witnessThreads"),
  signalRelays: document.getElementById("signalRelays"),
  driftCurrents: document.getElementById("driftCurrents"),
  transitLocks: document.getElementById("transitLocks")
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

function formatPercentCoord(value) {
  return `${Number(value).toFixed(1)}%`;
}

function clampPercent(value) {
  return Math.max(0, Math.min(100, Number(value)));
}

function centerViewportOnPercentCoord(coord, { scale = state.scale } = {}) {
  const x = Number(coord && coord.x);
  const y = Number(coord && coord.y);
  const nextScale = Number(scale);
  if (![x, y, nextScale].every(Number.isFinite)) return;
  const vw = el.viewport.clientWidth;
  const vh = el.viewport.clientHeight;
  state.scale = Math.max(0.45, Math.min(2.1, nextScale));
  const worldX = (x / 100) * MAP_W;
  const worldY = (y / 100) * MAP_H;
  state.tx = vw / 2 - worldX * state.scale;
  state.ty = vh / 2 - worldY * state.scale;
  setTransform();
}

function classifyRegionAtPercent(point) {
  if (!point) return null;
  const x = Number(point.x);
  const y = Number(point.y);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;

  const exact = REGION_BOUNDS.find((bound) => (
    x >= bound.left &&
    x <= bound.left + bound.width &&
    y >= bound.top &&
    y <= bound.top + bound.height
  ));
  if (exact) return exact.region;

  const closest = REGION_BOUNDS
    .map((bound) => {
      const cx = bound.left + bound.width / 2;
      const cy = bound.top + bound.height / 2;
      return {
        region: bound.region,
        distance: Math.hypot(x - cx, y - cy)
      };
    })
    .sort((a, b) => a.distance - b.distance)[0];
  return closest ? closest.region : null;
}

function getSurveySectorLabel(col, row) {
  return `${String.fromCharCode(65 + col)}${row + 1}`;
}

function buildSurveyGridSectors(coordForFallback = state.surveySkiffCoord) {
  const sectors = [];
  const sectorWidth = 100 / SURVEY_GRID_COLUMNS;
  const sectorHeight = 100 / SURVEY_GRID_ROWS;
  const fallbackRegion = classifyRegionAtPercent(coordForFallback) || "Open map";
  for (let row = 0; row < SURVEY_GRID_ROWS; row += 1) {
    for (let col = 0; col < SURVEY_GRID_COLUMNS; col += 1) {
      const xMin = col * sectorWidth;
      const xMax = xMin + sectorWidth;
      const yMin = row * sectorHeight;
      const yMax = yMin + sectorHeight;
      const centerX = xMin + sectorWidth / 2;
      const centerY = yMin + sectorHeight / 2;
      const label = getSurveySectorLabel(col, row);
      sectors.push({
        id: `survey-sector-${label.toLowerCase()}`,
        label,
        col,
        row,
        xMin,
        xMax,
        yMin,
        yMax,
        centerX,
        centerY,
        region: classifyRegionAtPercent({ x: centerX, y: centerY }) || fallbackRegion || "Open map"
      });
    }
  }
  return sectors;
}

function findSurveySectorForCoord(coord) {
  if (!coord) return null;
  const x = clampPercent(Number(coord.x));
  const y = clampPercent(Number(coord.y));
  if (![x, y].every(Number.isFinite)) return null;
  const sectors = buildSurveyGridSectors(coord);
  return sectors.find((sector) => (
    x >= sector.xMin &&
    x <= sector.xMax &&
    y >= sector.yMin &&
    y <= sector.yMax
  )) || null;
}

function listChartedSurveySectorsInLogOrder() {
  const sectors = buildSurveyGridSectors(state.surveySkiffCoord);
  const byId = new Map(sectors.map((sector) => [sector.id, sector]));
  const ordered = [];
  const used = new Set();

  (state.surveySectorLog || []).forEach((entry) => {
    const sector = byId.get(entry && entry.sectorId);
    if (!sector || !state.chartedSurveySectorIds.has(sector.id) || used.has(sector.id)) return;
    ordered.push(sector);
    used.add(sector.id);
  });

  sectors.forEach((sector) => {
    if (!state.chartedSurveySectorIds.has(sector.id) || used.has(sector.id)) return;
    ordered.push(sector);
  });
  return ordered;
}

function detectSurveySectorChartingFromCurrentSkiffCoord() {
  const sector = findSurveySectorForCoord(state.surveySkiffCoord);
  if (!sector) return false;
  if (state.chartedSurveySectorIds.has(sector.id)) return false;
  state.chartedSurveySectorIds.add(sector.id);
  state.surveySectorLog.unshift({
    sectorId: sector.id,
    label: sector.label,
    region: sector.region,
    xMin: sector.xMin,
    xMax: sector.xMax,
    yMin: sector.yMin,
    yMax: sector.yMax
  });
  if (state.surveySectorLog.length > SURVEY_GRID_LOG_MAX) {
    state.surveySectorLog.splice(SURVEY_GRID_LOG_MAX);
  }
  return true;
}

function centerViewportOnCurrentSurveySector() {
  const sector = findSurveySectorForCoord(state.surveySkiffCoord);
  if (!sector) return;
  centerViewportOnPercentCoord({ x: sector.centerX, y: sector.centerY }, { scale: state.scale });
}

function centerViewportOnChartedSurveySectors() {
  const sectors = listChartedSurveySectorsInLogOrder();
  if (sectors.length === 0) return;
  const center = sectors.reduce(
    (acc, sector) => ({ x: acc.x + Number(sector.centerX), y: acc.y + Number(sector.centerY) }),
    { x: 0, y: 0 }
  );
  centerViewportOnPercentCoord({
    x: center.x / sectors.length,
    y: center.y / sectors.length
  }, { scale: state.scale });
}

function refreshSurveyGridViews() {
  renderSurveyGridOverlay();
  renderSurveyGridPanel();
}

function findNearbyEchoSites(coord, radius = SIGNAL_SWEEP_RADIUS_PCT) {
  if (!coord) return [];
  const x = Number(coord.x);
  const y = Number(coord.y);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return [];

  return ECHO_SITES
    .map((echo) => ({
      ...echo,
      distance: Math.hypot(x - Number(echo.x), y - Number(echo.y))
    }))
    .filter((echo) => echo.distance <= radius)
    .sort((a, b) => a.distance - b.distance || String(a.title || "").localeCompare(String(b.title || "")));
}

function listRelayContactsFromCoord(coord) {
  if (!coord) return [];
  const x = Number(coord.x);
  const y = Number(coord.y);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return [];
  return BUILTIN_SIGNAL_RELAYS
    .map((relay) => ({
      ...relay,
      distance: Math.hypot(x - Number(relay.x), y - Number(relay.y))
    }))
    .filter((relay) => relay.distance <= SIGNAL_RELAY_CONTACT_RADIUS_PCT)
    .sort((a, b) => a.distance - b.distance || String(a.title || "").localeCompare(String(b.title || "")));
}

function findNearestRelayToCoord(coord) {
  if (!coord) return null;
  const x = Number(coord.x);
  const y = Number(coord.y);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  const ranked = BUILTIN_SIGNAL_RELAYS
    .map((relay) => ({
      relay,
      distance: Math.hypot(x - Number(relay.x), y - Number(relay.y))
    }))
    .filter((entry) => Number.isFinite(entry.distance))
    .sort((a, b) => a.distance - b.distance || String(a.relay.title || "").localeCompare(String(b.relay.title || "")));
  return ranked[0] || null;
}

function measureDistanceToSegment(point, segmentStart, segmentEnd) {
  const px = Number(point && point.x);
  const py = Number(point && point.y);
  const x1 = Number(segmentStart && segmentStart.x);
  const y1 = Number(segmentStart && segmentStart.y);
  const x2 = Number(segmentEnd && segmentEnd.x);
  const y2 = Number(segmentEnd && segmentEnd.y);
  if (![px, py, x1, y1, x2, y2].every(Number.isFinite)) return Infinity;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSq = dx * dx + dy * dy;
  if (lengthSq === 0) return Math.hypot(px - x1, py - y1);
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lengthSq));
  const nearestX = x1 + t * dx;
  const nearestY = y1 + t * dy;
  return Math.hypot(px - nearestX, py - nearestY);
}

function measureDistanceToPath(coord, path) {
  if (!coord || !Array.isArray(path) || path.length === 0) return Infinity;
  if (path.length === 1) {
    return Math.hypot(Number(coord.x) - Number(path[0].x), Number(coord.y) - Number(path[0].y));
  }
  let best = Infinity;
  for (let index = 0; index < path.length - 1; index += 1) {
    const distance = measureDistanceToSegment(coord, path[index], path[index + 1]);
    if (distance < best) best = distance;
  }
  return best;
}

function listCurrentEntriesFromCoord(coord) {
  if (!coord) return [];
  const x = Number(coord.x);
  const y = Number(coord.y);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return [];
  return BUILTIN_DRIFT_CURRENTS
    .map((current) => ({
      ...current,
      distance: measureDistanceToPath({ x, y }, current.path)
    }))
    .filter((current) => current.distance <= DRIFT_CURRENT_ENTRY_RADIUS_PCT)
    .sort((a, b) => a.distance - b.distance || String(a.title || "").localeCompare(String(b.title || "")));
}

function findNearestCurrentToCoord(coord) {
  if (!coord) return null;
  const x = Number(coord.x);
  const y = Number(coord.y);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  const ranked = BUILTIN_DRIFT_CURRENTS
    .map((current) => ({
      current,
      distance: measureDistanceToPath({ x, y }, current.path)
    }))
    .filter((entry) => Number.isFinite(entry.distance))
    .sort((a, b) => a.distance - b.distance || String(a.current.title || "").localeCompare(String(b.current.title || "")));
  return ranked[0] || null;
}

function findTransitLockById(lockId) {
  return BUILTIN_TRANSIT_LOCKS.find((lock) => lock.id === lockId) || null;
}

function resolveLinkedTransitLock(lock) {
  return lock && lock.linkedLockId ? findTransitLockById(lock.linkedLockId) : null;
}

function listTransitLocksInChartRadiusFromCoord(coord) {
  if (!coord) return [];
  const x = Number(coord.x);
  const y = Number(coord.y);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return [];
  return BUILTIN_TRANSIT_LOCKS
    .map((lock) => ({
      ...lock,
      distance: Math.hypot(x - Number(lock.x), y - Number(lock.y))
    }))
    .filter((entry) => entry.distance <= TRANSIT_LOCK_CHART_RADIUS_PCT)
    .sort((a, b) => a.distance - b.distance || String(a.title || "").localeCompare(String(b.title || "")));
}

function findNearestTransitLockToCoord(coord, { chartedOnly = false } = {}) {
  if (!coord) return null;
  const x = Number(coord.x);
  const y = Number(coord.y);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  const ranked = BUILTIN_TRANSIT_LOCKS
    .filter((lock) => !chartedOnly || state.chartedTransitLockIds.has(lock.id))
    .map((lock) => ({
      lock,
      distance: Math.hypot(x - Number(lock.x), y - Number(lock.y))
    }))
    .filter((entry) => Number.isFinite(entry.distance))
    .sort((a, b) => a.distance - b.distance || String(a.lock.title || "").localeCompare(String(b.lock.title || "")));
  return ranked[0] || null;
}

function detectTransitLockCharting() {
  if (!state.surveySkiffCoord) return false;
  const nearbyLocks = listTransitLocksInChartRadiusFromCoord(state.surveySkiffCoord);
  let changed = false;
  nearbyLocks.forEach((lock) => {
    if (state.chartedTransitLockIds.has(lock.id)) return;
    state.chartedTransitLockIds.add(lock.id);
    changed = true;
  });
  if (changed) {
    renderTransitLockMarkers();
    renderTransitLockOverlay();
    renderTransitLocksPanel();
    renderVerificationChain();
  }
  return changed;
}

function detectDriftCurrentEntries({ forceBeaconRunEntry = false } = {}) {
  if (!state.surveySkiffCoord) return false;
  const nearbyCurrents = listCurrentEntriesFromCoord(state.surveySkiffCoord);
  let changed = false;
  nearbyCurrents.forEach((current) => {
    if (state.enteredCurrentIds.has(current.id)) return;
    state.enteredCurrentIds.add(current.id);
    state.currentEntryLog.unshift({
      currentId: current.id,
      title: current.title,
      region: current.region,
      x: Number(current.x),
      y: Number(current.y),
      flow: current.flow
    });
    if (state.currentEntryLog.length > DRIFT_CURRENT_LOG_MAX) {
      state.currentEntryLog.splice(DRIFT_CURRENT_LOG_MAX);
    }
    changed = true;
  });
  if (forceBeaconRunEntry && !state.enteredCurrentIds.has("beacon-run-current")) {
    const beaconRun = BUILTIN_DRIFT_CURRENTS.find((current) => current.id === "beacon-run-current");
    if (beaconRun) {
      state.enteredCurrentIds.add(beaconRun.id);
      state.currentEntryLog.unshift({
        currentId: beaconRun.id,
        title: beaconRun.title,
        region: beaconRun.region,
        x: Number(beaconRun.x),
        y: Number(beaconRun.y),
        flow: beaconRun.flow
      });
      if (state.currentEntryLog.length > DRIFT_CURRENT_LOG_MAX) {
        state.currentEntryLog.splice(DRIFT_CURRENT_LOG_MAX);
      }
      changed = true;
    }
  }
  if (changed) {
    renderCurrentMarkers();
    renderDriftCurrentOverlay();
    renderDriftCurrentsPanel();
    renderVerificationChain();
  }
  return changed;
}

function detectSignalRelayContacts() {
  if (!state.surveySkiffCoord) return false;
  const nearbyRelays = listRelayContactsFromCoord(state.surveySkiffCoord);
  let changed = false;
  nearbyRelays.forEach((relay) => {
    if (state.contactedRelayIds.has(relay.id)) return;
    state.contactedRelayIds.add(relay.id);
    state.relayContactLog.unshift({
      relayId: relay.id,
      title: relay.title,
      region: relay.region,
      x: Number(relay.x),
      y: Number(relay.y),
      band: relay.band
    });
    if (state.relayContactLog.length > SIGNAL_RELAY_LOG_MAX) {
      state.relayContactLog.splice(SIGNAL_RELAY_LOG_MAX);
    }
    changed = true;
  });

  if (changed) {
    renderRelayMarkers();
    renderSignalRelayOverlay();
    renderSignalRelaysPanel();
    renderVerificationChain();
  }
  return changed;
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
  centerViewportOnPercentCoord(target, { scale: target.scale || 1.3 });
}

function traceKey(marker) {
  if (!marker) return "";
  if (marker.issueNumber) return `beacon:${marker.issueNumber}`;
  if (marker.type === "lattice" && marker.id) return `lattice:${marker.id}`;
  if (marker.type === "echo" && marker.id) return `echo:${marker.id}`;
  if (marker.type === "relay" && marker.id) return `relay:${marker.id}`;
  if (marker.type === "current" && marker.id) return `current:${marker.id}`;
  if (marker.type === "transit-lock" && marker.id) return `transit-lock:${marker.id}`;
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

function getLandmarkId(landmark) {
  return landmark && landmark.id ? landmark.id : toSlug(landmark && landmark.title);
}

function markerRef(marker) {
  if (!marker) return "";
  if (marker.type === "landmark") {
    const id = getLandmarkId(marker);
    return id ? `landmark:${id}` : "";
  }
  if (marker.type === "echo" && marker.id) {
    return `echo:${marker.id}`;
  }
  if (marker.type === "lattice" && marker.id) {
    return `lattice:${marker.id}`;
  }
  if (marker.type === "relay" && marker.id) {
    return `relay:${marker.id}`;
  }
  if (marker.type === "current" && marker.id) {
    return `current:${marker.id}`;
  }
  if (marker.type === "transit-lock" && marker.id) {
    return `transit-lock:${marker.id}`;
  }
  return "";
}

function getBuiltinReferenceCollections() {
  return {
    landmark: BUILTIN_LANDMARKS,
    echo: BUILTIN_ECHO_SITES,
    lattice: BUILTIN_LATTICE_STATIONS,
    relay: BUILTIN_SIGNAL_RELAYS,
    current: BUILTIN_DRIFT_CURRENTS,
    "transit-lock": BUILTIN_TRANSIT_LOCKS
  };
}

function resolveBuiltinReference(reference) {
  const [type, id] = String(reference || "").split(":");
  if (!type || !id) return null;
  const collections = getBuiltinReferenceCollections();
  const nodes = collections[type];
  if (!nodes) return null;
  const match = nodes.find((node) => {
    if (type === "landmark") return getLandmarkId(node) === id;
    return node && node.id === id;
  });
  return match ? { ...match, id: type === "landmark" ? getLandmarkId(match) : match.id, type } : null;
}

function resolveBuiltinNodeFromTrace(trace) {
  const ref = markerRef(trace);
  return ref ? resolveBuiltinReference(ref) : null;
}

function getResolvedLatticeLinks() {
  return LATTICE_LINKS
    .map(([from, to]) => {
      const fromNode = resolveBuiltinReference(from);
      const toNode = resolveBuiltinReference(to);
      if (!fromNode || !toNode) return null;
      return {
        fromRef: from,
        toRef: to,
        from: fromNode,
        to: toNode
      };
    })
    .filter(Boolean);
}

function getTraverseNetworkNodes() {
  const nodes = new Map();
  getResolvedLatticeLinks().forEach((link) => {
    nodes.set(link.fromRef, link.from);
    nodes.set(link.toRef, link.to);
  });
  return Array.from(nodes.entries()).map(([ref, node]) => ({ ref, ...node }));
}

function getTriangulationAnchorKindLabel(type) {
  if (type === "landmark") return "Landmark";
  if (type === "echo") return "Echo site";
  return "Traverse station";
}

function buildTriangulationFix(coord = state.surveySkiffCoord) {
  const sx = Number(coord && coord.x);
  const sy = Number(coord && coord.y);
  if (!Number.isFinite(sx) || !Number.isFinite(sy)) return null;

  const anchors = getTraverseNetworkNodes()
    .map((node) => ({
      ...node,
      distance: Math.hypot(sx - Number(node.x), sy - Number(node.y))
    }))
    .filter((node) => Number.isFinite(node.distance))
    .sort(
      (a, b) =>
        a.distance - b.distance ||
        String(a.title || "").localeCompare(String(b.title || "")) ||
        String(a.ref || "").localeCompare(String(b.ref || ""))
    )
    .slice(0, TRIANGULATION_ANCHOR_COUNT);

  if (anchors.length < TRIANGULATION_ANCHOR_COUNT) return null;

  const centroid = anchors.reduce(
    (acc, anchor) => ({ x: acc.x + Number(anchor.x), y: acc.y + Number(anchor.y) }),
    { x: 0, y: 0 }
  );
  centroid.x /= anchors.length;
  centroid.y /= anchors.length;

  let span = 0;
  for (let index = 0; index < anchors.length; index += 1) {
    for (let inner = index + 1; inner < anchors.length; inner += 1) {
      const distance = measurePercentDistance(anchors[index], anchors[inner]);
      if (distance !== null && distance > span) span = distance;
    }
  }

  return {
    anchors,
    anchorRefs: anchors.map((anchor) => anchor.ref),
    centroid,
    regionCount: new Set(anchors.map((anchor) => anchor.region || "Unknown region")).size,
    span,
    label: anchors.map((anchor) => anchor.title || "Untitled anchor").join(" · ")
  };
}

function areTriangulationAnchorRefsEqual(left, right) {
  if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) return false;
  return left.every((ref, index) => ref === right[index]);
}

function appendTriangulationLogEntry(fix) {
  if (!fix || !Array.isArray(fix.anchorRefs) || fix.anchorRefs.length !== TRIANGULATION_ANCHOR_COUNT) return;
  state.triangulationLog.unshift({
    anchorRefs: [...fix.anchorRefs],
    centroid: { x: Number(fix.centroid.x), y: Number(fix.centroid.y) },
    regionCount: Number(fix.regionCount),
    span: Number(fix.span),
    label: String(fix.label || "")
  });
  if (state.triangulationLog.length > TRIANGULATION_LOG_MAX) {
    state.triangulationLog.splice(TRIANGULATION_LOG_MAX);
  }
}

function updateTriangulationFix({ logOnAnchorChange = false, seedLogIfEmpty = false } = {}) {
  const previousRefs = state.currentTriangulationFix ? state.currentTriangulationFix.anchorRefs : null;
  const nextFix = state.surveySkiffEnabled ? buildTriangulationFix(state.surveySkiffCoord) : null;
  state.currentTriangulationFix = nextFix;
  if (!nextFix) return;

  if (seedLogIfEmpty && state.triangulationLog.length === 0) {
    appendTriangulationLogEntry(nextFix);
    return;
  }

  if (logOnAnchorChange && !areTriangulationAnchorRefsEqual(previousRefs, nextFix.anchorRefs)) {
    appendTriangulationLogEntry(nextFix);
  }
}

function refreshTriangulationViews() {
  renderTriangulationOverlay();
  renderTriangulationPanel();
}

function getApproachRadarKindLabel(type) {
  if (type === "landmark") return "Landmark";
  if (type === "echo") return "Echo site";
  if (type === "lattice") return "Traverse station";
  if (type === "relay") return "Relay station";
  if (type === "current") return "Drift current";
  return "Transit lock";
}

function buildApproachRadarTargetList() {
  const allTargets = [
    ...BUILTIN_LANDMARKS,
    ...BUILTIN_ECHO_SITES,
    ...BUILTIN_LATTICE_STATIONS,
    ...BUILTIN_SIGNAL_RELAYS,
    ...BUILTIN_DRIFT_CURRENTS,
    ...BUILTIN_TRANSIT_LOCKS
  ];

  return allTargets
    .map((target) => ({
      ref: markerRef(target),
      title: target.title,
      type: target.type,
      region: target.region,
      x: Number(target.x),
      y: Number(target.y),
      kindLabel: getApproachRadarKindLabel(target.type)
    }))
    .filter((target) => (
      target.ref &&
      Number.isFinite(target.x) &&
      Number.isFinite(target.y)
    ));
}

function buildApproachRadarScan(coord = state.surveySkiffCoord, { radius = APPROACH_RADAR_RADIUS_PCT } = {}) {
  const sx = Number(coord && coord.x);
  const sy = Number(coord && coord.y);
  if (!Number.isFinite(sx) || !Number.isFinite(sy)) return null;

  const rankedTargets = buildApproachRadarTargetList()
    .map((target) => ({
      ...target,
      distance: Math.hypot(sx - Number(target.x), sy - Number(target.y))
    }))
    .filter((target) => Number.isFinite(target.distance))
    .sort(
      (a, b) =>
        a.distance - b.distance ||
        String(a.title || "").localeCompare(String(b.title || "")) ||
        String(a.ref || "").localeCompare(String(b.ref || ""))
    );

  const inRangeTargets = rankedTargets.filter((target) => target.distance <= radius);
  return {
    radius,
    skiffCoord: { x: sx, y: sy },
    rankedTargets,
    inRangeTargets,
    nearestTarget: rankedTargets[0] || null
  };
}

function appendApproachRadarLogEntry(scan) {
  if (!scan) return;
  const nearest = scan.nearestTarget;
  const nearestCoord = nearest
    ? { x: Number(nearest.x), y: Number(nearest.y) }
    : { x: Number(scan.skiffCoord && scan.skiffCoord.x), y: Number(scan.skiffCoord && scan.skiffCoord.y) };
  state.approachRadarLog.unshift({
    nearestRef: nearest ? nearest.ref : "",
    nearestTitle: nearest ? nearest.title : "",
    nearestKind: nearest ? nearest.kindLabel : "",
    nearestDistance: nearest ? Number(nearest.distance) : null,
    inRangeCount: Array.isArray(scan.inRangeTargets) ? scan.inRangeTargets.length : 0,
    radius: Number(scan.radius),
    targetCoord: nearestCoord,
    skiffCoord: { x: Number(scan.skiffCoord.x), y: Number(scan.skiffCoord.y) }
  });
  if (state.approachRadarLog.length > APPROACH_RADAR_LOG_MAX) {
    state.approachRadarLog.splice(APPROACH_RADAR_LOG_MAX);
  }
}

function updateApproachRadarScan({ logOnNearestChange = false, seedLogIfEmpty = false } = {}) {
  const previousNearestRef = state.currentApproachRadarScan && state.currentApproachRadarScan.nearestTarget
    ? state.currentApproachRadarScan.nearestTarget.ref
    : "";
  const nextScan = state.surveySkiffEnabled ? buildApproachRadarScan(state.surveySkiffCoord) : null;
  state.currentApproachRadarScan = nextScan;
  if (!nextScan) return;

  if (seedLogIfEmpty && state.approachRadarLog.length === 0) {
    appendApproachRadarLogEntry(nextScan);
    return;
  }

  const nextNearestRef = nextScan.nearestTarget ? nextScan.nearestTarget.ref : "";
  if (logOnNearestChange && previousNearestRef !== nextNearestRef) {
    appendApproachRadarLogEntry(nextScan);
  }
}

function refreshApproachRadarViews() {
  renderApproachRadarOverlay();
  renderApproachRadarPanel();
}

function buildBeaconSounding(coord = state.surveySkiffCoord, { radius = BEACON_SOUNDING_RADIUS_PCT } = {}) {
  const sx = Number(coord && coord.x);
  const sy = Number(coord && coord.y);
  if (!Number.isFinite(sx) || !Number.isFinite(sy)) return null;

  const targets = (Array.isArray(state.beacons) ? state.beacons : [])
    .map((beacon) => {
      const issueNumber = parseIssueNumber(beacon && beacon.issueNumber);
      const x = Number(beacon && beacon.x);
      const y = Number(beacon && beacon.y);
      if (issueNumber === null || !Number.isFinite(x) || !Number.isFinite(y)) return null;
      const posture = getBeaconPosture(beacon);
      return {
        issueNumber,
        title: String((beacon && beacon.title) || "Untitled beacon"),
        region: String((beacon && beacon.region) || "Unknown region"),
        visitor: String((beacon && beacon.visitor) || "Unknown visitor"),
        x,
        y,
        color: String((beacon && beacon.color) || ""),
        posture: posture.code,
        postureLabel: posture.label,
        distance: Math.hypot(sx - x, sy - y)
      };
    })
    .filter((target) => target && Number.isFinite(target.distance))
    .sort(
      (a, b) =>
        a.distance - b.distance ||
        b.issueNumber - a.issueNumber
    );

  const inRangeTargets = targets.filter((target) => target.distance <= radius);
  return {
    skiffCoord: { x: sx, y: sy },
    radius,
    targets,
    inRangeTargets,
    nearestTarget: targets[0] || null,
    regionCount: new Set(inRangeTargets.map((target) => target.region || "Unknown region")).size
  };
}

function appendBeaconSoundingLogEntry(sounding) {
  if (!sounding) return;
  const nearest = sounding.nearestTarget;
  state.beaconSoundingLog.unshift({
    nearestIssueNumber: nearest ? Number(nearest.issueNumber) : null,
    nearestTitle: nearest ? String(nearest.title || "") : "",
    nearestPosture: nearest ? String(nearest.postureLabel || "") : "",
    nearestDistance: nearest ? Number(nearest.distance) : null,
    nearestCoord: nearest ? { x: Number(nearest.x), y: Number(nearest.y) } : null,
    inRangeCount: Array.isArray(sounding.inRangeTargets) ? sounding.inRangeTargets.length : 0,
    regionCount: Number(sounding.regionCount) || 0,
    skiffCoord: { x: Number(sounding.skiffCoord && sounding.skiffCoord.x), y: Number(sounding.skiffCoord && sounding.skiffCoord.y) }
  });
  if (state.beaconSoundingLog.length > BEACON_SOUNDING_LOG_MAX) {
    state.beaconSoundingLog.splice(BEACON_SOUNDING_LOG_MAX);
  }
}

function updateBeaconSounding({ logOnNearestChange = false, seedLogIfEmpty = false } = {}) {
  const previousNearestIssueNumber = state.currentBeaconSounding && state.currentBeaconSounding.nearestTarget
    ? parseIssueNumber(state.currentBeaconSounding.nearestTarget.issueNumber)
    : null;
  const nextSounding = state.surveySkiffEnabled ? buildBeaconSounding(state.surveySkiffCoord) : null;
  state.currentBeaconSounding = nextSounding;
  if (!nextSounding) return;

  if (seedLogIfEmpty && state.beaconSoundingLog.length === 0) {
    appendBeaconSoundingLogEntry(nextSounding);
    return;
  }

  const nextNearestIssueNumber = nextSounding.nearestTarget
    ? parseIssueNumber(nextSounding.nearestTarget.issueNumber)
    : null;
  if (logOnNearestChange && previousNearestIssueNumber !== nextNearestIssueNumber) {
    appendBeaconSoundingLogEntry(nextSounding);
  }
}

function refreshBeaconSoundingViews() {
  renderBeaconSoundingOverlay();
  renderBeaconSoundingPanel();
}

function centerViewportOnBeaconSounding() {
  const sounding = state.currentBeaconSounding;
  if (!sounding) return;
  const target = sounding.nearestTarget || sounding.skiffCoord;
  if (!target) return;
  centerViewportOnPercentCoord(target, { scale: state.scale });
}

function activateBeaconSoundingTarget(target) {
  if (!target) return;
  const issueNumber = parseIssueNumber(target.issueNumber);
  if (issueNumber === null) return;
  const beacon = (Array.isArray(state.beacons) ? state.beacons : [])
    .find((item) => parseIssueNumber(item && item.issueNumber) === issueNumber);
  if (!beacon) return;
  activateMarker({ ...beacon, type: "beacon" }, { focus: true, updateHash: false });
}

function getDriftSignals() {
  return (Array.isArray(state.beacons) ? state.beacons : []).filter((beacon) => beacon && beacon.isDriftSignal);
}

function centerViewportOnTracePassage() {
  const beacons = getTracePassageBeacons();
  if (beacons.length === 0) return;
  const coords = beacons
    .map((beacon) => ({ x: Number(beacon.x), y: Number(beacon.y) }))
    .filter((coord) => Number.isFinite(coord.x) && Number.isFinite(coord.y));
  if (coords.length === 0) return;
  const bounds = coords.reduce((acc, coord) => ({
    minX: Math.min(acc.minX, coord.x),
    maxX: Math.max(acc.maxX, coord.x),
    minY: Math.min(acc.minY, coord.y),
    maxY: Math.max(acc.maxY, coord.y)
  }), {
    minX: coords[0].x,
    maxX: coords[0].x,
    minY: coords[0].y,
    maxY: coords[0].y
  });
  centerViewportOnPercentCoord({
    x: (bounds.minX + bounds.maxX) / 2,
    y: (bounds.minY + bounds.maxY) / 2
  }, { scale: state.scale });
}

function jumpToNewestTracePassage() {
  const beacons = getTracePassageBeacons();
  if (beacons.length === 0) return;
  const newest = beacons[beacons.length - 1];
  if (!newest) return;
  activateMarker({ ...newest, type: "beacon" }, { focus: true, updateHash: true });
}

function centerViewportOnWitnessThreads() {
  const witnessThreads = getWitnessThreads().threads;
  if (witnessThreads.length === 0) return;
  const coords = witnessThreads
    .flatMap((thread) => thread.beacons)
    .map((beacon) => ({ x: Number(beacon.x), y: Number(beacon.y) }))
    .filter((coord) => Number.isFinite(coord.x) && Number.isFinite(coord.y));
  if (coords.length === 0) return;
  const bounds = coords.reduce((acc, coord) => ({
    minX: Math.min(acc.minX, coord.x),
    maxX: Math.max(acc.maxX, coord.x),
    minY: Math.min(acc.minY, coord.y),
    maxY: Math.max(acc.maxY, coord.y)
  }), {
    minX: coords[0].x,
    maxX: coords[0].x,
    minY: coords[0].y,
    maxY: coords[0].y
  });
  centerViewportOnPercentCoord({
    x: (bounds.minX + bounds.maxX) / 2,
    y: (bounds.minY + bounds.maxY) / 2
  }, { scale: state.scale });
}

function jumpToLongestWitnessThread() {
  const witnessThreads = getWitnessThreads().threads;
  if (witnessThreads.length === 0) return;
  const longestCount = witnessThreads.reduce(
    (maxCount, thread) => Math.max(maxCount, thread.beacons.length),
    0
  );
  const targetThread = witnessThreads
    .filter((thread) => thread.beacons.length === longestCount)
    .sort((a, b) => (
      compareWitnessThreadBeacons(b.newestBeacon, a.newestBeacon) ||
      String(a.displayName || "").localeCompare(String(b.displayName || ""))
    ))[0];
  if (!targetThread || !targetThread.newestBeacon) return;
  activateMarker({ ...targetThread.newestBeacon, type: "beacon" }, { focus: true, updateHash: true });
}

function centerViewportOnDriftSignals() {
  const driftSignals = getDriftSignals();
  if (driftSignals.length === 0) return;
  const center = driftSignals.reduce(
    (acc, signal) => ({ x: acc.x + Number(signal.x), y: acc.y + Number(signal.y) }),
    { x: 0, y: 0 }
  );
  centerViewportOnPercentCoord({
    x: center.x / driftSignals.length,
    y: center.y / driftSignals.length
  }, { scale: state.scale });
}

function openNearestDriftSignalIssue() {
  const driftSignals = getDriftSignals();
  if (driftSignals.length === 0) return;
  const origin = state.surveySkiffCoord || { x: 50, y: 50 };
  const nearest = driftSignals
    .map((signal) => ({
      signal,
      distance: Math.hypot(Number(signal.x) - Number(origin.x), Number(signal.y) - Number(origin.y))
    }))
    .sort(
      (a, b) =>
        a.distance - b.distance ||
        compareBeaconLedger(a.signal, b.signal)
    )[0];
  if (!nearest || !nearest.signal || !nearest.signal.issueUrl) return;
  window.open(nearest.signal.issueUrl, "_blank", "noopener");
}

function getDirectTraverseConnections(reference) {
  const links = getResolvedLatticeLinks();
  const connected = [];
  links.forEach((link) => {
    if (link.fromRef === reference) {
      connected.push({ ref: link.toRef, ...link.to });
    } else if (link.toRef === reference) {
      connected.push({ ref: link.fromRef, ...link.from });
    }
  });
  return connected.sort((a, b) => String(a.title || "").localeCompare(String(b.title || "")));
}

function rankBeaconEntryCandidates(beacon, count = 3) {
  if (!beacon) return [];
  const bx = Number(beacon.x);
  const by = Number(beacon.y);
  if (!Number.isFinite(bx) || !Number.isFinite(by)) return [];
  return getTraverseNetworkNodes()
    .map((node) => ({
      ...node,
      regionMatch: beacon.region && node.region === beacon.region ? 0 : 1,
      distance: Math.hypot(bx - Number(node.x), by - Number(node.y))
    }))
    .sort(
      (a, b) =>
        a.regionMatch - b.regionMatch ||
        a.distance - b.distance ||
        String(a.title || "").localeCompare(String(b.title || ""))
    )
    .slice(0, count);
}

function getMarkerHash(marker) {
  if (!marker) return "";
  if (marker.type === "beacon") {
    const issueNumber = parseIssueNumber(marker.issueNumber);
    return issueNumber === null ? "" : `#beacon-${issueNumber}`;
  }
  if (marker.type === "landmark") {
    const slug = getLandmarkId(marker);
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
    const landmark = BUILTIN_LANDMARKS.find((item) => getLandmarkId(item) === target.slug);
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
  if (marker.type === "echo" && marker.id) {
    state.discoveredEchoIds.add(marker.id);
  }
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
    const landmark = BUILTIN_LANDMARKS.find((item) => getLandmarkId(item) === target.slug);
    if (!landmark) return false;
    activateMarker(landmark, { focus: true, updateHash: false });
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

function encodeSurveyPostureAction(regionName, postureLabel) {
  return `${encodeURIComponent(regionName)}${SURVEY_POSTURE_ACTION_SEPARATOR}${encodeURIComponent(postureLabel)}`;
}

function decodeSurveyPostureAction(value) {
  if (!value || !value.includes(SURVEY_POSTURE_ACTION_SEPARATOR)) return null;
  const [encodedRegion, encodedPosture] = value.split(SURVEY_POSTURE_ACTION_SEPARATOR);
  if (!encodedRegion || !encodedPosture) return null;
  return {
    regionName: decodeURIComponent(encodedRegion),
    postureLabel: decodeURIComponent(encodedPosture)
  };
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

  const traceTypeLabel = trace.type === "beacon"
    ? (trace.isDriftSignal ? "Drift signal" : "Visitor beacon")
    : trace.type === "echo"
      ? "Echo site"
      : trace.type === "lattice"
        ? "Traverse station"
        : trace.type === "relay"
          ? "Relay station"
          : trace.type === "current"
            ? "Drift current"
            : trace.type === "transit-lock"
              ? "Transit lock"
            : "Landmark";
  const pills = [
    `<span class="trace-pill">${traceTypeLabel}</span>`,
    `<span class="trace-pill">${escapeHtml(trace.region || "Unknown region")}</span>`
  ];
  if (trace.visitor) {
    pills.push(`<span class="trace-pill">Visitor: ${escapeHtml(trace.visitor)}</span>`);
  }
  if (trace.issueNumber) {
    pills.push(`<span class="trace-pill">Issue #${trace.issueNumber}</span>`);
  }
  if (trace.type === "relay" && trace.band) {
    pills.push(`<span class="trace-pill">Band: ${escapeHtml(trace.band)}</span>`);
  }
  if (trace.type === "current" && trace.flow) {
    pills.push(`<span class="trace-pill">Flow: ${escapeHtml(trace.flow)}</span>`);
  }
  if (trace.type === "transit-lock" && trace.channel) {
    pills.push(`<span class="trace-pill">Channel: ${escapeHtml(trace.channel)}</span>`);
  }

  const link = trace.issueUrl
    ? `<p class="trace-link"><a href="${trace.issueUrl}" target="_blank" rel="noopener">Open public issue ↗</a></p>`
    : trace.type === "echo"
      ? '<p class="small trace-link">Built-in echo site: discoverable through Signal Sweep.</p>'
      : trace.type === "lattice"
        ? '<p class="small trace-link">Built-in traverse station: part of the inter-region lattice.</p>'
        : trace.type === "relay"
          ? '<p class="small trace-link">Built-in relay station: part of the outer signal ring.</p>'
          : trace.type === "current"
            ? '<p class="small trace-link">Built-in drift current: a navigable interior flow line.</p>'
            : trace.type === "transit-lock"
              ? '<p class="small trace-link">Built-in transit lock: a paired jump gate for the Survey Skiff.</p>'
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
  const driftCoordinateSection = trace.type === "beacon" && trace.isDriftSignal
    ? `
      <section class="trace-subsection">
        <h4>Coordinate status</h4>
        <p>This labeled public issue did not include usable x/y coordinates, so The Signal Cartographer assigned it a deterministic perimeter berth until the issue is revised.
Assigned berth: x ${Number(trace.x).toFixed(1)} · y ${Number(trace.y).toFixed(1)}.</p>
      </section>
    `
    : "";
  const echoSection = trace.type === "echo"
    ? `
      <section class="trace-subsection">
        <h4>Signal Sweep record</h4>
        <p>This is a built-in exploration point in ${escapeHtml(trace.region || "unknown region")}. It was surfaced by scan radius contact, not a visitor submission.</p>
      </section>
    `
    : "";
  const latticeSection = trace.type === "lattice"
    ? `
      <section class="trace-subsection">
        <h4>Traverse Lattice record</h4>
        <p>This station links multiple built-in routes between regions, creating interstitial crossings between landmarks and echo sites.</p>
      </section>
    `
    : "";
  const relaySection = trace.type === "relay"
    ? `
      <section class="trace-subsection">
        <h4>Signal Relay record</h4>
        <p>This relay helps stitch the perimeter of the map into a continuous outer circuit for long-range bearings.</p>
      </section>
    `
    : "";
  const currentSection = trace.type === "current"
    ? `
      <section class="trace-subsection">
        <h4>Drift Current record</h4>
        <p>This current marks a repeatable interior flow line that helps the Survey Skiff cross open map water without relying on fixed anchors.</p>
      </section>
    `
    : "";
  const transitLockSection = trace.type === "transit-lock"
    ? `
      <section class="trace-subsection">
        <h4>Transit Lock record</h4>
        <p>This lock links two distant map regions so the Survey Skiff can traverse long intervals without following the full surface route.</p>
      </section>
    `
    : "";

  el.tracePanel.innerHTML = `
    <h3>${escapeHtml(trace.title || "Untitled trace")}</h3>
    <div class="trace-meta">${pills.join("")}</div>
    <p class="trace-note">${escapeHtml(trace.note || "No note recorded.")}</p>
    ${postureSection}
    ${driftCoordinateSection}
    ${evidenceSection}
    ${revisionSection}
    ${echoSection}
    ${latticeSection}
    ${relaySection}
    ${currentSection}
    ${transitLockSection}
    ${link}
  `;
}

function measurePercentDistance(a, b) {
  const ax = Number(a && a.x);
  const ay = Number(a && a.y);
  const bx = Number(b && b.x);
  const by = Number(b && b.y);
  if (![ax, ay, bx, by].every(Number.isFinite)) return null;
  return Math.hypot(ax - bx, ay - by);
}

function markerDistance(a, b) {
  return measurePercentDistance(a, b);
}

function findNearestLandmark(marker) {
  if (!marker || BUILTIN_LANDMARKS.length === 0) return null;
  const ranked = BUILTIN_LANDMARKS
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
  } else if (trace.type === "relay") {
    const nearestLandmark = findNearestLandmark(trace);
    const nearestSentence = nearestLandmark
      ? `Nearest built-in landmark: ${nearestLandmark.landmark.title} (~${nearestLandmark.distance.toFixed(1)} map-% units).`
      : "Nearest built-in landmark is unavailable.";
    const contactedSentence = state.contactedRelayIds.has(trace.id)
      ? '<p class="small">This relay has already been contacted by the Survey Skiff.</p>'
      : "";
    actionTargets.centerRelay = trace;
    html = `
      <p class="chain-summary">This is a built-in relay station in ${escapeHtml(trace.region || "its region")}.</p>
      ${coordPills}
      <p class="chain-context">${escapeHtml(nearestSentence)}</p>
      ${contactedSentence}
      <div class="chain-actions"><button type="button" class="chain-action" data-chain-target="centerRelay">Center on relay</button></div>
    `;
  } else if (trace.type === "current") {
    const nearestLandmark = findNearestLandmark(trace);
    const nearestSentence = nearestLandmark
      ? `Nearest built-in landmark: ${nearestLandmark.landmark.title} (~${nearestLandmark.distance.toFixed(1)} map-% units).`
      : "Nearest built-in landmark is unavailable.";
    const enteredSentence = state.enteredCurrentIds.has(trace.id)
      ? "<p class=\"small\">The Survey Skiff has already entered this current.</p>"
      : "";
    actionTargets.centerCurrent = trace;
    html = `
      <p class="chain-summary">This is a built-in drift current in ${escapeHtml(trace.region || "its region")}.</p>
      ${coordPills}
      <p class="chain-context">${escapeHtml(nearestSentence)}</p>
      ${enteredSentence}
      <div class="chain-actions"><button type="button" class="chain-action" data-chain-target="centerCurrent">Center on current</button></div>
    `;
  } else if (trace.type === "transit-lock") {
    const nearestLandmark = findNearestLandmark(trace);
    const nearestSentence = nearestLandmark
      ? `Nearest built-in landmark: ${nearestLandmark.landmark.title} (~${nearestLandmark.distance.toFixed(1)} map-% units).`
      : "Nearest built-in landmark is unavailable.";
    const chartedSentence = state.chartedTransitLockIds.has(trace.id)
      ? "<p class=\"small\">This transit lock has already been charted by the Survey Skiff.</p>"
      : "";
    html = `
      <p class="chain-summary">This is a built-in transit lock in ${escapeHtml(trace.region || "its region")}.</p>
      ${coordPills}
      <p class="chain-context">${escapeHtml(nearestSentence)}</p>
      ${chartedSentence}
      <div class="chain-actions">
        <button type="button" class="chain-action" data-chain-transit-action="center" data-chain-transit-lock-id="${escapeHtml(trace.id)}">Center on lock</button>
        <button type="button" class="chain-action" data-chain-transit-action="transit" data-chain-transit-lock-id="${escapeHtml(trace.id)}">Transit to linked lock</button>
      </div>
    `;
  } else {
    const nearestRegionalBeacon = findNearestRegionalBeacon(trace);
    const contextHtml = nearestRegionalBeacon
      ? `Nearest public beacon in ${escapeHtml(trace.region || "this region")}: ${escapeHtml(
          nearestRegionalBeacon.beacon.title || "Untitled beacon"
        )} by ${escapeHtml(nearestRegionalBeacon.beacon.visitor || "Unknown")}.`
      : `No public beacons are logged in ${escapeHtml(trace.region || "this region")} yet.`;
    const anchorSentence = trace.type === "echo"
      ? `This is a built-in echo site in ${escapeHtml(trace.region || "its region")}.`
      : trace.type === "lattice"
        ? `This is a built-in traverse station in ${escapeHtml(trace.region || "its region")}.`
        : `This is a built-in anchor in ${escapeHtml(trace.region || "its region")}.`;

    if (nearestRegionalBeacon) {
      actionTargets.nearest = nearestRegionalBeacon.beacon;
    }

    html = `
      <p class="chain-summary">${anchorSentence}</p>
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
      if (node.dataset.chainTarget === "centerRelay") {
        centerViewportOnPercentCoord(target, { scale: state.scale });
        return;
      }
      if (node.dataset.chainTarget === "centerCurrent") {
        centerViewportOnPercentCoord(target, { scale: state.scale });
        return;
      }
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

function compareTracePassage(a, b) {
  const aCreatedAt = parseCreatedAt(a && a.createdAt);
  const bCreatedAt = parseCreatedAt(b && b.createdAt);
  if (aCreatedAt !== null || bCreatedAt !== null) {
    if (aCreatedAt !== null && bCreatedAt !== null && aCreatedAt !== bCreatedAt) return aCreatedAt - bCreatedAt;
    if (aCreatedAt !== null) return -1;
    if (bCreatedAt !== null) return 1;
  }

  const aIssue = parseIssueNumber(a && a.issueNumber);
  const bIssue = parseIssueNumber(b && b.issueNumber);
  if (aIssue !== null || bIssue !== null) {
    if (aIssue !== null && bIssue !== null && aIssue !== bIssue) return aIssue - bIssue;
    if (aIssue !== null) return -1;
    if (bIssue !== null) return 1;
  }

  return String(a && a.title ? a.title : "").localeCompare(String(b && b.title ? b.title : ""));
}

function compareWitnessThreadBeacons(a, b) {
  const aCreatedAt = parseCreatedAt(a && a.createdAt);
  const bCreatedAt = parseCreatedAt(b && b.createdAt);
  if (aCreatedAt !== null || bCreatedAt !== null) {
    if (aCreatedAt !== null && bCreatedAt !== null && aCreatedAt !== bCreatedAt) return aCreatedAt - bCreatedAt;
    if (aCreatedAt !== null) return -1;
    if (bCreatedAt !== null) return 1;
  }

  const aIssue = parseIssueNumber(a && a.issueNumber);
  const bIssue = parseIssueNumber(b && b.issueNumber);
  if (aIssue !== null || bIssue !== null) {
    if (aIssue !== null && bIssue !== null && aIssue !== bIssue) return aIssue - bIssue;
    if (aIssue !== null) return -1;
    if (bIssue !== null) return 1;
  }

  return String(a && a.title ? a.title : "").localeCompare(String(b && b.title ? b.title : ""));
}

function getWitnessThreads() {
  const grouped = new Map();
  (Array.isArray(state.beacons) ? state.beacons : []).forEach((beacon) => {
    const originalVisitor = String(beacon && beacon.visitor ? beacon.visitor : "").trim();
    if (!originalVisitor) return;
    const normalizedVisitor = originalVisitor.toLowerCase();
    if (!grouped.has(normalizedVisitor)) {
      grouped.set(normalizedVisitor, {
        key: normalizedVisitor,
        displayName: originalVisitor,
        beacons: []
      });
    }
    const entry = grouped.get(normalizedVisitor);
    if (!entry) return;
    if (!entry.displayName && originalVisitor) {
      entry.displayName = originalVisitor;
    }
    entry.beacons.push(beacon);
  });

  const visitorGroups = [...grouped.values()].map((entry) => {
    const beacons = [...entry.beacons].sort(compareWitnessThreadBeacons);
    const firstBeacon = beacons[0] || null;
    const newestBeacon = beacons[beacons.length - 1] || null;
    const firstTs = parseCreatedAt(firstBeacon && firstBeacon.createdAt);
    const newestTs = parseCreatedAt(newestBeacon && newestBeacon.createdAt);
    const spanMs = firstTs === null || newestTs === null ? 0 : Math.max(0, newestTs - firstTs);
    const regions = new Set(beacons.map((beacon) => String(beacon && beacon.region ? beacon.region : "Unknown region"))).size;
    return {
      displayName: entry.displayName || entry.key,
      key: entry.key,
      beacons,
      regions,
      firstBeacon,
      newestBeacon,
      spanMs
    };
  });

  const getEarliestTs = (thread) => parseCreatedAt(thread && thread.firstBeacon && thread.firstBeacon.createdAt);
  const byName = (a, b) => String(a && a.displayName ? a.displayName : "").localeCompare(String(b && b.displayName ? b.displayName : ""));
  const byEarliestTs = (a, b) => {
    const aTs = getEarliestTs(a);
    const bTs = getEarliestTs(b);
    if (aTs !== null || bTs !== null) {
      if (aTs !== null && bTs !== null && aTs !== bTs) return aTs - bTs;
      if (aTs !== null) return -1;
      if (bTs !== null) return 1;
    }
    return byName(a, b);
  };

  const threads = visitorGroups
    .filter((thread) => thread.beacons.length >= 2)
    .sort((a, b) => (
      b.beacons.length - a.beacons.length ||
      byEarliestTs(a, b) ||
      byName(a, b)
    ));
  const soloVisitors = visitorGroups
    .filter((thread) => thread.beacons.length === 1)
    .sort((a, b) => byEarliestTs(a, b) || byName(a, b));
  const totalThreadedBeacons = threads.reduce((count, thread) => count + thread.beacons.length, 0);

  return {
    threads,
    soloVisitors,
    totalThreadedBeacons
  };
}

function getTracePassageBeacons() {
  return [...(Array.isArray(state.beacons) ? state.beacons : [])]
    .filter((beacon) => beacon && parseCreatedAt(beacon.createdAt) !== null)
    .sort(compareTracePassage);
}

function formatTracePassageSpan(ms) {
  const span = Number(ms);
  if (!Number.isFinite(span) || span <= 0) return "0 min";
  const compact = (value) => String(value.toFixed(1)).replace(/\.0$/, "");
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (span < 90 * minute) return `${Math.round(span / minute)} min`;
  if (span < 36 * hour) return `${compact(span / hour)} hr`;
  return `${compact(span / day)} days`;
}

function formatWitnessThreadSpan(ms) {
  return formatTracePassageSpan(ms);
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
  if (filters.posture === "Evidence only" && posture.code !== "evidence") {
    return false;
  }
  if (filters.posture === "Revision only" && posture.code !== "revision") {
    return false;
  }
  if (filters.posture === "Minimal trace" && posture.code !== "minimal") {
    return false;
  }
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
  centerViewportOnPercentCoord(marker, { scale: state.scale });
}

function renderAccountabilityCensus() {
  if (!el.accountabilityCensus) return;
  const beacons = Array.isArray(state.beacons) ? state.beacons : [];
  if (beacons.length === 0) {
    el.accountabilityCensus.innerHTML = "<p class=\"small\">No public beacons loaded yet, so accountability posture counts are still pending.</p>";
    return;
  }

  const postureCounts = beacons.reduce(
    (acc, beacon) => {
      const posture = getBeaconPosture(beacon);
      if (posture.code === "full") acc.full += 1;
      if (posture.code === "evidence") acc.evidence += 1;
      if (posture.code === "revision") acc.revision += 1;
      if (posture.code === "minimal") acc.minimal += 1;
      if (posture.hasEvidence) acc.evidenceAnchored += 1;
      if (posture.hasRevision) acc.revisionReady += 1;
      if (!(posture.hasEvidence && posture.hasRevision)) acc.missing += 1;
      return acc;
    },
    {
      full: 0,
      evidence: 0,
      revision: 0,
      minimal: 0,
      evidenceAnchored: 0,
      revisionReady: 0,
      missing: 0
    }
  );

  const rows = [
    {
      key: "all",
      label: "All public beacons",
      filterValue: LEDGER_POSTURE_DEFAULT,
      count: beacons.length,
      copy: "View the full public record before narrowing by posture."
    },
    {
      key: "full",
      label: "Evidence + revision",
      filterValue: "Evidence + revision",
      count: postureCounts.full,
      copy: "These beacons name both an evidence anchor and a revision trigger."
    },
    {
      key: "evidence",
      label: "Evidence only",
      filterValue: "Evidence only",
      count: postureCounts.evidence,
      copy: "These traces anchor evidence but do not yet declare revision conditions."
    },
    {
      key: "revision",
      label: "Revision only",
      filterValue: "Revision only",
      count: postureCounts.revision,
      copy: "These traces invite correction but still need explicit evidence anchors."
    },
    {
      key: "minimal",
      label: "Minimal trace",
      filterValue: "Minimal trace",
      count: postureCounts.minimal,
      copy: "These entries are public marks with neither anchor nor revision trigger yet."
    },
    {
      key: "evidenceAnchored",
      label: "Evidence anchored",
      filterValue: "Evidence anchored",
      count: postureCounts.evidenceAnchored,
      copy: "Every beacon here names at least one inspectable evidence anchor."
    },
    {
      key: "revisionReady",
      label: "Revision ready",
      filterValue: "Revision ready",
      count: postureCounts.revisionReady,
      copy: "Every beacon here states what would cause it to be revised."
    },
    {
      key: "missing",
      label: "Missing evidence or revision",
      filterValue: "Missing evidence or revision",
      count: postureCounts.missing,
      copy: "These beacons are missing at least one accountability field."
    }
  ];

  const activePosture = (el.ledgerPostureFilter && el.ledgerPostureFilter.value) || LEDGER_POSTURE_DEFAULT;
  const listHtml = rows
    .map((row, index) => {
      const isActive = activePosture === row.filterValue;
      return `
        <li>
          <button type="button" class="census-item${isActive ? " is-active" : ""}" data-census-index="${index}">
            <span class="census-header">${escapeHtml(row.label)}</span>
            <span class="census-copy">${escapeHtml(row.copy)}</span>
            <span class="census-meta">
              <span class="census-pill">${row.count} beacon${row.count === 1 ? "" : "s"}</span>
            </span>
          </button>
        </li>
      `;
    })
    .join("");

  el.accountabilityCensus.innerHTML = `<ul class="census-list">${listHtml}</ul>`;
  el.accountabilityCensus.querySelectorAll("[data-census-index]").forEach((node) => {
    node.addEventListener("click", () => {
      const row = rows[Number(node.dataset.censusIndex)];
      if (!row || !el.ledgerPostureFilter) return;
      if (el.ledgerPostureFilter.value !== row.filterValue) {
        el.ledgerPostureFilter.value = row.filterValue;
      }
      handleLedgerFilterChange();
    });
  });
}

function renderBeaconLedger() {
  if (!el.beaconLedger) return;
  renderAccountabilityCensus();
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
  BUILTIN_LANDMARKS.forEach((landmark) => {
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
      const postureCounts = sorted.reduce(
        (acc, beacon) => {
          const posture = getBeaconPosture(beacon);
          if (posture.code === "full") acc.full += 1;
          if (posture.code === "evidence") acc.evidence += 1;
          if (posture.code === "revision") acc.revision += 1;
          if (posture.code === "minimal") acc.minimal += 1;
          return acc;
        },
        { full: 0, evidence: 0, revision: 0, minimal: 0 }
      );
      const accountabilityLine = `Accountability: ${postureCounts.full} evidence + revision · ${postureCounts.evidence} evidence only · ${postureCounts.revision} revision only · ${postureCounts.minimal} minimal trace.`;
      const postureActionButtons = SURVEY_POSTURE_ACTIONS.filter((row) => postureCounts[row.code] > 0)
        .map(
          (row) =>
            `<button type="button" class="survey-action" data-survey-ledger-posture="${escapeHtml(
              encodeSurveyPostureAction(regionName, row.filterLabel)
            )}">${row.actionLabel}</button>`
        )
        .join("");
      const actionsHtml = latest
        ? `
          <div class="survey-actions">
            <button type="button" class="survey-action" data-survey-jump="${escapeHtml(regionName)}">Jump to latest beacon</button>
            <button type="button" class="survey-action" data-survey-ledger-region="${escapeHtml(regionName)}">Browse region ledger</button>
            ${postureActionButtons}
          </div>
        `
        : "";

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
            <span class="survey-accountability">${escapeHtml(accountabilityLine)}</span>
          </button>
          ${actionsHtml}
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

  el.regionSurvey.querySelectorAll("[data-survey-ledger-region]").forEach((node) => {
    node.addEventListener("click", (ev) => {
      ev.stopPropagation();
      ev.preventDefault();
      const regionName = node.dataset.surveyLedgerRegion;
      if (!regionName) return;
      if (el.ledgerRegionFilter) {
        el.ledgerRegionFilter.value = regionName;
      }
      handleLedgerFilterChange();
    });
  });

  el.regionSurvey.querySelectorAll("[data-survey-ledger-posture]").forEach((node) => {
    node.addEventListener("click", (ev) => {
      ev.stopPropagation();
      ev.preventDefault();
      const target = decodeSurveyPostureAction(node.dataset.surveyLedgerPosture);
      if (!target) return;
      if (el.ledgerRegionFilter) {
        el.ledgerRegionFilter.value = target.regionName;
      }
      if (el.ledgerPostureFilter) {
        el.ledgerPostureFilter.value = target.postureLabel;
      }
      handleLedgerFilterChange();
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
  renderRelayMarkers();
  renderCurrentMarkers();
  renderTransitLockMarkers();
  renderLatticeMarkers();
  renderTraverseLattice();
  renderDriftCurrentOverlay();
  renderSignalRelayOverlay();
  renderTransitLockOverlay();
  renderVerificationRoute();
  renderTracePanel();
  renderVerificationChain();
  renderBeaconLedger();
  renderEchoMarkers();
  renderSignalSweepPanel();
  renderTraverseLatticePanel();
  renderSurveySkiff();
  renderSurveySkiffPanel();
  renderApproachRadarPanel();
  renderPermalinkPanel();
  renderDriftSignalOverlay();
  renderDriftSignalsPanel();
  renderWitnessThreadsOverlay();
  renderWitnessThreadsPanel();
  renderTracePassageOverlay();
  renderTracePassagePanel();
  renderSignalRelaysPanel();
  renderDriftCurrentsPanel();
  renderTransitLocksPanel();
}

function addMarker(layer, marker, options = {}) {
  const {
    className = "marker",
    highlight = false,
    updateHash = true,
    focus = false
  } = options;
  const node = document.createElement("button");
  node.type = "button";
  node.className = className;
  if (state.activeTrace && traceKey(state.activeTrace) === traceKey(marker)) {
    node.classList.add("is-active");
  }
  if (highlight) {
    node.classList.add("is-nearby");
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
    activateMarker(marker, { focus, updateHash });
  });
  layer.appendChild(node);
}

function renderLandmarks() {
  el.landmarkLayer.innerHTML = "";
  BUILTIN_LANDMARKS.forEach((lm) => addMarker(el.landmarkLayer, lm));
}

function renderBeacons() {
  el.beaconLayer.innerHTML = "";
  state.beacons.forEach((b) => {
    const className = b && b.isDriftSignal ? "marker marker-drift-signal" : "marker";
    addMarker(el.beaconLayer, { ...b, type: "beacon" }, { className });
  });
  renderDriftSignalOverlay();
  renderWitnessThreadsOverlay();
  renderTracePassageOverlay();
}

function renderRelayMarkers() {
  if (!el.relayLayer) return;
  el.relayLayer.innerHTML = "";
  el.relayLayer.hidden = !state.signalRelaysEnabled;
  if (!state.signalRelaysEnabled) return;

  BUILTIN_SIGNAL_RELAYS.forEach((relay) => {
    const isContacted = state.contactedRelayIds.has(relay.id);
    const isActiveRelay = Boolean(state.activeTrace && state.activeTrace.type === "relay" && state.activeTrace.id === relay.id);
    const className = [
      "marker",
      "marker-relay",
      isContacted ? "marker-relay-contacted" : "",
      isActiveRelay ? "marker-relay-active" : ""
    ].filter(Boolean).join(" ");
    addMarker(
      el.relayLayer,
      { ...relay, color: isContacted ? "#d7f7ff" : "#a9eaff" },
      {
        className,
        updateHash: false,
        focus: true
      }
    );
  });
}

function renderSignalRelayOverlay() {
  if (!el.signalRelayLayer) return;
  const isVisible = state.signalRelaysEnabled;
  el.signalRelayLayer.style.display = isVisible ? "block" : "none";
  if (!isVisible) {
    el.signalRelayLayer.replaceChildren();
    return;
  }

  const relayById = new Map(BUILTIN_SIGNAL_RELAYS.map((relay) => [relay.id, relay]));
  const group = createSvgNode("g", { class: "signal-relay-network" });

  SIGNAL_RELAY_LINKS.forEach(([fromId, toId]) => {
    const fromRelay = relayById.get(fromId);
    const toRelay = relayById.get(toId);
    if (!fromRelay || !toRelay) return;
    const from = toWorldCoords(fromRelay);
    const to = toWorldCoords(toRelay);
    group.appendChild(createSvgNode("line", {
      class: "signal-relay-link",
      x1: from.x.toFixed(1),
      y1: from.y.toFixed(1),
      x2: to.x.toFixed(1),
      y2: to.y.toFixed(1)
    }));
    if (state.contactedRelayIds.has(fromId) && state.contactedRelayIds.has(toId)) {
      group.appendChild(createSvgNode("line", {
        class: "signal-relay-link-active",
        x1: from.x.toFixed(1),
        y1: from.y.toFixed(1),
        x2: to.x.toFixed(1),
        y2: to.y.toFixed(1)
      }));
    }
  });

  el.signalRelayLayer.replaceChildren(group);
}

function renderSignalRelaysPanel() {
  if (!el.signalRelays) return;
  if (!state.signalRelaysEnabled) {
    el.signalRelays.innerHTML = `
      <p>Signal Relays are hidden. Re-enable them in Controls to reveal the outer signal ring.</p>
      <p>Pilot the Survey Skiff near the map edge to bring relays into contact.</p>
    `;
    refreshSurveyGridViews();
    return;
  }

  const contactedIds = state.contactedRelayIds;
  const contactedCount = contactedIds.size;
  const contactedRelays = BUILTIN_SIGNAL_RELAYS.filter((relay) => contactedIds.has(relay.id));
  const reachedRegions = new Set(contactedRelays.map((relay) => relay.region)).size;
  const nearest = findNearestRelayToCoord(state.surveySkiffCoord);
  const nearestLine = nearest
    ? `Nearest relay: ${escapeHtml(nearest.relay.title)} (${nearest.distance.toFixed(1)}% away)`
    : "Nearest relay: unavailable";
  const fallback = "<p class=\"small\">No relays contacted yet. Pilot the skiff toward the perimeter to raise one.</p>";
  const contactsHtml = state.relayContactLog.length > 0
    ? `
      <div class="relay-contact-list">
        ${state.relayContactLog.map((entry) => `
          <button type="button" class="relay-contact-item" data-relay-id="${escapeHtml(entry.relayId)}">
            <strong>${escapeHtml(entry.title)}</strong>
            <span class="small">${escapeHtml(entry.region)} · ${escapeHtml(entry.band)} · x ${formatPercentCoord(entry.x)} · y ${formatPercentCoord(entry.y)}</span>
          </button>
        `).join("")}
      </div>
    `
    : fallback;

  el.signalRelays.innerHTML = `
    <p class="relay-line">Signal Relays mark the outer ring of the map.</p>
    <p class="relay-line">Pilot the Survey Skiff near a relay to bring it into contact.</p>
    <p class="relay-line">Relay contact: ${contactedCount} of 7 relays contacted across ${reachedRegions} region(s).</p>
    <p class="relay-line">${nearestLine}</p>
    <div class="relay-meta">
      <span class="relay-pill">Relays contacted: ${contactedCount}</span>
      <span class="relay-pill">Regions reached: ${reachedRegions}</span>
      <span class="relay-pill">Contact radius: ${SIGNAL_RELAY_CONTACT_RADIUS_PCT.toFixed(1)}%</span>
    </div>
    <div class="relay-actions">
      <button type="button" class="relay-action" data-relay-action="center-nearest" ${nearest ? "" : "disabled"}>Center on nearest relay</button>
      <button type="button" class="relay-action" data-relay-action="center-contacted" ${contactedCount > 0 ? "" : "disabled"}>Center on contacted ring</button>
    </div>
    <p class="small">Recent relay contacts</p>
    ${contactsHtml}
  `;
  refreshSurveyGridViews();
}

function renderCurrentMarkers() {
  if (!el.currentLayer) return;
  el.currentLayer.innerHTML = "";
  el.currentLayer.hidden = !state.driftCurrentsEnabled;
  if (!state.driftCurrentsEnabled) return;

  BUILTIN_DRIFT_CURRENTS.forEach((current) => {
    const isEntered = state.enteredCurrentIds.has(current.id);
    const isActiveCurrent = Boolean(state.activeTrace && state.activeTrace.type === "current" && state.activeTrace.id === current.id);
    const className = [
      "marker",
      "marker-current",
      isEntered ? "marker-current-entered" : "",
      isActiveCurrent ? "marker-current-active" : ""
    ].filter(Boolean).join(" ");
    addMarker(
      el.currentLayer,
      { ...current, color: isEntered ? "#b9fff4" : "#6ed8cc" },
      {
        className,
        updateHash: false,
        focus: true
      }
    );
  });
}

function renderDriftCurrentOverlay() {
  if (!el.driftCurrentLayer) return;
  const isVisible = state.driftCurrentsEnabled;
  el.driftCurrentLayer.style.display = isVisible ? "block" : "none";
  if (!isVisible) {
    el.driftCurrentLayer.replaceChildren();
    return;
  }

  const group = createSvgNode("g", { class: "drift-current-network" });
  BUILTIN_DRIFT_CURRENTS.forEach((current) => {
    const points = (Array.isArray(current.path) ? current.path : [])
      .map((point) => `${((Number(point.x) / 100) * MAP_W).toFixed(1)},${((Number(point.y) / 100) * MAP_H).toFixed(1)}`)
      .join(" ");
    if (!points) return;
    group.appendChild(createSvgNode("polyline", {
      class: "drift-current-path",
      points
    }));
    if (state.enteredCurrentIds.has(current.id)) {
      group.appendChild(createSvgNode("polyline", {
        class: "drift-current-path-active",
        points
      }));
    }
  });
  el.driftCurrentLayer.replaceChildren(group);
}

function renderDriftCurrentsPanel() {
  if (!el.driftCurrents) return;
  if (!state.driftCurrentsEnabled) {
    el.driftCurrents.innerHTML = `
      <p>Drift Currents are hidden. Re-enable them in Controls to reveal the interior flow lines.</p>
      <p>Pilot the Survey Skiff across the map interior to enter a current.</p>
    `;
    refreshSurveyGridViews();
    return;
  }

  const enteredCount = state.enteredCurrentIds.size;
  const enteredCurrents = BUILTIN_DRIFT_CURRENTS.filter((current) => state.enteredCurrentIds.has(current.id));
  const enteredRegions = new Set(enteredCurrents.map((current) => current.region)).size;
  const nearest = findNearestCurrentToCoord(state.surveySkiffCoord);
  const nearestLine = nearest
    ? `Nearest current: ${escapeHtml(nearest.current.title)} (${nearest.distance.toFixed(1)}% away)`
    : "Nearest current: unavailable";
  const entriesHtml = state.currentEntryLog.length > 0
    ? `
      <div class="current-entry-list">
        ${state.currentEntryLog.map((entry) => `
          <button type="button" class="current-entry-item" data-current-id="${escapeHtml(entry.currentId)}">
            <strong>${escapeHtml(entry.title)}</strong>
            <span>${escapeHtml(entry.region)} · ${escapeHtml(entry.flow)} · x ${formatPercentCoord(entry.x)} · y ${formatPercentCoord(entry.y)}</span>
          </button>
        `).join("")}
      </div>
    `
    : "<p class=\"small\">No currents entered yet. Pilot the skiff through the interior to catch one.</p>";

  el.driftCurrents.innerHTML = `
    <p class="current-line">Drift Currents mark repeatable interior flow lines across the map.</p>
    <p class="current-line">Pilot the Survey Skiff near a current to enter it.</p>
    <p class="current-line">Current entries: ${enteredCount} of 5 currents entered across ${enteredRegions} region(s).</p>
    <p class="current-line">${nearestLine}</p>
    <div class="current-meta">
      <span class="current-pill">Currents entered: ${enteredCount}</span>
      <span class="current-pill">Regions entered: ${enteredRegions}</span>
      <span class="current-pill">Entry radius: ${DRIFT_CURRENT_ENTRY_RADIUS_PCT.toFixed(1)}%</span>
    </div>
    <div class="current-actions">
      <button type="button" class="current-action" data-current-action="center-nearest" ${nearest ? "" : "disabled"}>Center on nearest current</button>
      <button type="button" class="current-action" data-current-action="center-entered" ${enteredCount > 0 ? "" : "disabled"}>Center on entered currents</button>
    </div>
    <p class="small">Recent current entries</p>
    ${entriesHtml}
  `;
  refreshSurveyGridViews();
}

function getTransitLockPairEntries() {
  const seen = new Set();
  const pairs = [];
  BUILTIN_TRANSIT_LOCKS.forEach((lock) => {
    const linked = resolveLinkedTransitLock(lock);
    if (!linked) return;
    const key = [lock.id, linked.id].sort().join("::");
    if (seen.has(key)) return;
    seen.add(key);
    pairs.push({ from: lock, to: linked });
  });
  return pairs;
}

function renderTransitLockMarkers() {
  if (!el.transitLockMarkerLayer) return;
  el.transitLockMarkerLayer.innerHTML = "";
  el.transitLockMarkerLayer.hidden = !state.transitLocksEnabled;
  if (!state.transitLocksEnabled) return;

  BUILTIN_TRANSIT_LOCKS.forEach((lock) => {
    const isCharted = state.chartedTransitLockIds.has(lock.id);
    const isActiveLock = Boolean(state.activeTrace && state.activeTrace.type === "transit-lock" && state.activeTrace.id === lock.id);
    const className = [
      "marker",
      "marker-transit-lock",
      isCharted ? "marker-transit-lock-charted" : "",
      isActiveLock ? "marker-transit-lock-active" : ""
    ].filter(Boolean).join(" ");
    addMarker(
      el.transitLockMarkerLayer,
      { ...lock, color: isCharted ? "#ffd8ff" : "#d6b5ff" },
      {
        className,
        updateHash: false,
        focus: true
      }
    );
  });
}

function renderTransitLockOverlay() {
  if (!el.transitLockLayer) return;
  const isVisible = state.transitLocksEnabled;
  el.transitLockLayer.style.display = isVisible ? "block" : "none";
  if (!isVisible) {
    el.transitLockLayer.replaceChildren();
    return;
  }

  const group = createSvgNode("g", { class: "transit-lock-network" });
  getTransitLockPairEntries().forEach((pair) => {
    const from = toWorldCoords(pair.from);
    const to = toWorldCoords(pair.to);
    group.appendChild(createSvgNode("line", {
      class: "transit-lock-link",
      x1: from.x.toFixed(1),
      y1: from.y.toFixed(1),
      x2: to.x.toFixed(1),
      y2: to.y.toFixed(1)
    }));
    if (state.chartedTransitLockIds.has(pair.from.id) && state.chartedTransitLockIds.has(pair.to.id)) {
      group.appendChild(createSvgNode("line", {
        class: "transit-lock-link-charted",
        x1: from.x.toFixed(1),
        y1: from.y.toFixed(1),
        x2: to.x.toFixed(1),
        y2: to.y.toFixed(1)
      }));
    }
  });
  el.transitLockLayer.replaceChildren(group);
}

function getTransitActionSourceLock() {
  if (state.activeTrace && state.activeTrace.type === "transit-lock") {
    return findTransitLockById(state.activeTrace.id);
  }
  // Deterministic fallback: use the nearest charted lock to current skiff position.
  const nearestCharted = findNearestTransitLockToCoord(state.surveySkiffCoord, { chartedOnly: true });
  return nearestCharted ? nearestCharted.lock : null;
}

function transitThroughLock(lock) {
  if (!lock || !state.surveySkiffCoord) return false;
  const sourceLock = findTransitLockById(lock.id);
  const destinationLock = resolveLinkedTransitLock(sourceLock);
  if (!sourceLock || !destinationLock) return false;

  state.chartedTransitLockIds.add(sourceLock.id);
  state.chartedTransitLockIds.add(destinationLock.id);
  state.surveySkiffCoord = { x: Number(destinationLock.x), y: Number(destinationLock.y) };
  appendSurveyWakePoint(state.surveySkiffCoord, { force: true });
  detectSurveySectorChartingFromCurrentSkiffCoord();
  centerViewportOnPercentCoord(destinationLock, { scale: state.scale });
  state.transitJumpLog.unshift({
    fromLockId: sourceLock.id,
    toLockId: destinationLock.id,
    fromTitle: sourceLock.title,
    toTitle: destinationLock.title,
    channel: sourceLock.channel
  });
  if (state.transitJumpLog.length > TRANSIT_JUMP_LOG_MAX) {
    state.transitJumpLog.splice(TRANSIT_JUMP_LOG_MAX);
  }

  const discoveredNewEchoes = discoverEchoesNearSurveySkiff();
  detectDriftCurrentEntries();
  detectSignalRelayContacts();
  detectTransitLockCharting();
  updateTriangulationFix({ logOnAnchorChange: true });
  updateApproachRadarScan({ logOnNearestChange: true });
  updateBeaconSounding({ logOnNearestChange: true });
  renderSurveySkiff();
  renderSurveySkiffPanel();
  renderSurveyWake();
  renderSurveyWakePanel();
  refreshTriangulationViews();
  refreshApproachRadarViews();
  refreshBeaconSoundingViews();
  renderTransitLockMarkers();
  renderTransitLockOverlay();
  renderTransitLocksPanel();
  activateMarker(destinationLock, { focus: false, updateHash: false });
  if (discoveredNewEchoes) {
    renderEchoMarkers();
    renderSignalSweepPanel();
  }
  return true;
}

function renderTransitLocksPanel() {
  if (!el.transitLocks) return;
  if (!state.transitLocksEnabled) {
    el.transitLocks.innerHTML = `
      <p>Transit Locks are hidden. Re-enable them in Controls to reveal paired jump gates.</p>
      <p>Pilot the Survey Skiff with transit locks enabled to chart and use long-range lock routes.</p>
    `;
    refreshSurveyGridViews();
    return;
  }

  const chartedLocks = BUILTIN_TRANSIT_LOCKS.filter((lock) => state.chartedTransitLockIds.has(lock.id));
  const chartedCount = chartedLocks.length;
  const chartedRegions = new Set(chartedLocks.map((lock) => lock.region)).size;
  const nearest = findNearestTransitLockToCoord(state.surveySkiffCoord);
  const nearestLine = nearest
    ? `Nearest lock: ${escapeHtml(nearest.lock.title)} (${nearest.distance.toFixed(1)}% away)`
    : "Nearest lock: unavailable";

  const chartedCards = chartedCount > 0
    ? `
      <div class="transit-lock-chart-list">
        ${chartedLocks.map((lock) => {
          const linked = resolveLinkedTransitLock(lock);
          const linkedTitle = linked ? linked.title : "Unknown lock";
          return `
            <button type="button" class="transit-lock-chart-item" data-transit-lock-id="${escapeHtml(lock.id)}">
              <strong>${escapeHtml(lock.title)}</strong>
              <span>${escapeHtml(lock.region)} · ${escapeHtml(lock.channel)} · links to ${escapeHtml(linkedTitle)}</span>
            </button>
          `;
        }).join("")}
      </div>
    `
    : "<p class=\"small\">No transit locks charted yet. Pilot the skiff near one to bring it onto the map.</p>";

  const jumpsHtml = state.transitJumpLog.length > 0
    ? `
      <div class="transit-lock-jump-list">
        ${state.transitJumpLog.map((entry) => `
          <p class="transit-lock-jump-item">${escapeHtml(entry.fromTitle)} -> ${escapeHtml(entry.toTitle)} · ${escapeHtml(entry.channel)}</p>
        `).join("")}
      </div>
    `
    : "<p class=\"small\">No lock transits logged yet.</p>";

  el.transitLocks.innerHTML = `
    <p class="transit-lock-line">Transit Locks connect distant regions through paired jump gates.</p>
    <p class="transit-lock-line">Pilot the Survey Skiff near a lock to chart it, then transit through it.</p>
    <p class="transit-lock-line">Transit chart: ${chartedCount} of 4 locks charted across ${chartedRegions} region(s).</p>
    <p class="transit-lock-line">${nearestLine}</p>
    <div class="transit-lock-meta">
      <span class="transit-lock-pill">Locks charted: ${chartedCount}</span>
      <span class="transit-lock-pill">Regions charted: ${chartedRegions}</span>
      <span class="transit-lock-pill">Chart radius: ${TRANSIT_LOCK_CHART_RADIUS_PCT.toFixed(1)}%</span>
    </div>
    <div class="transit-lock-actions">
      <button type="button" class="transit-lock-action" data-transit-lock-action="center-nearest" ${nearest ? "" : "disabled"}>Center on nearest lock</button>
      <button type="button" class="transit-lock-action" data-transit-lock-action="center-charted" ${chartedCount > 0 ? "" : "disabled"}>Center on charted locks</button>
      <button type="button" class="transit-lock-action" data-transit-lock-action="transit" ${getTransitActionSourceLock() ? "" : "disabled"}>Transit through lock</button>
    </div>
    ${chartedCards}
    <p class="small">Recent lock transits</p>
    ${jumpsHtml}
  `;
  refreshSurveyGridViews();
}

function renderEchoMarkers() {
  if (!el.echoLayer) return;
  el.echoLayer.innerHTML = "";
  if (!state.sweepEnabled) return;
  const nearbyIds = new Set(
    (state.nearbyEchoes || [])
      .slice(0, SIGNAL_SWEEP_HIGHLIGHT_MAX)
      .map((echo) => echo.id)
  );
  BUILTIN_ECHO_SITES
    .filter((echo) => state.discoveredEchoIds.has(echo.id))
    .forEach((echo) => {
      addMarker(
        el.echoLayer,
        { ...echo, color: "#9ff8c8" },
        {
          className: "marker marker-echo",
          highlight: nearbyIds.has(echo.id),
          updateHash: false
        }
      );
    });
}

function renderLatticeMarkers() {
  if (!el.latticeLayer) return;
  el.latticeLayer.innerHTML = "";
  if (!state.traverseLatticeEnabled) return;
  BUILTIN_LATTICE_STATIONS.forEach((station) => {
    addMarker(
      el.latticeLayer,
      { ...station, color: "#ffd8ad" },
      {
        className: "marker marker-lattice",
        updateHash: false
      }
    );
  });
}

function appendSurveyWakePoint(coord, { force = false, dockLabel = "" } = {}) {
  if (!coord) return;
  const x = clampPercent(Number(coord.x));
  const y = clampPercent(Number(coord.y));
  if (![x, y].every(Number.isFinite)) return;

  const points = Array.isArray(state.surveyWakePoints) ? state.surveyWakePoints : [];
  const lastPoint = points[points.length - 1] || null;
  const distance = lastPoint ? measurePercentDistance(lastPoint, { x, y }) : null;

  if (!force && lastPoint && distance !== null && distance < SURVEY_WAKE_POINT_MIN_STEP_PCT) {
    return;
  }

  const nextPoint = { x, y };
  points.push(nextPoint);
  if (points.length > SURVEY_WAKE_MAX_POINTS) {
    points.splice(0, points.length - SURVEY_WAKE_MAX_POINTS);
  }
  state.surveyWakePoints = points;

  const lastMilestone = state.surveyWakeMilestones[state.surveyWakeMilestones.length - 1] || null;
  const prevRegion = classifyRegionAtPercent(lastPoint);
  const nextRegion = classifyRegionAtPercent(nextPoint);
  if (lastPoint && prevRegion && nextRegion && prevRegion !== nextRegion) {
    const label = `Crossed into ${nextRegion}`;
    if (!lastMilestone || !(lastMilestone.label === label && measurePercentDistance(lastMilestone, nextPoint) === 0)) {
      state.surveyWakeMilestones.push({
        label,
        x,
        y,
        region: nextRegion,
        type: "crossing",
        order: Date.now()
      });
    }
  }

  if (dockLabel) {
    state.surveyWakeMilestones.push({
      label: `Docked at ${dockLabel}`,
      x,
      y,
      region: nextRegion || "Unknown region",
      type: "dock",
      order: Date.now()
    });
  }

  if (state.surveyWakeMilestones.length > SURVEY_WAKE_MILESTONE_MAX) {
    state.surveyWakeMilestones.splice(0, state.surveyWakeMilestones.length - SURVEY_WAKE_MILESTONE_MAX);
  }
}

function summarizeSurveyWake() {
  const points = Array.isArray(state.surveyWakePoints) ? state.surveyWakePoints : [];
  const milestones = Array.isArray(state.surveyWakeMilestones) ? state.surveyWakeMilestones : [];
  const wakeSpan = points.reduce((total, point, index) => {
    if (index === 0) return total;
    return total + (measurePercentDistance(points[index - 1], point) || 0);
  }, 0);
  const crossingCount = milestones.filter((item) => item && item.type === "crossing").length;
  const dockCount = milestones.filter((item) => item && item.type === "dock").length;
  return {
    pointCount: points.length,
    wakeSpan,
    crossingCount,
    dockCount
  };
}

function renderSurveyWake() {
  if (!el.surveyWakeLayer) return;
  const points = Array.isArray(state.surveyWakePoints) ? state.surveyWakePoints : [];
  const milestones = Array.isArray(state.surveyWakeMilestones) ? state.surveyWakeMilestones : [];
  const isVisible = state.surveyWakeEnabled;
  el.surveyWakeLayer.style.display = isVisible ? "block" : "none";

  if (!isVisible || points.length === 0) {
    el.surveyWakeLayer.replaceChildren();
    return;
  }

  const group = createSvgNode("g", { class: "survey-wake" });
  const pointString = points
    .map((point) => `${((Number(point.x) / 100) * MAP_W).toFixed(1)},${((Number(point.y) / 100) * MAP_H).toFixed(1)}`)
    .join(" ");

  if (points.length > 1) {
    group.appendChild(createSvgNode("polyline", {
      class: "survey-wake-glow",
      points: pointString
    }));
    group.appendChild(createSvgNode("polyline", {
      class: "survey-wake-path",
      points: pointString
    }));
  } else {
    const origin = points[0];
    group.appendChild(createSvgNode("circle", {
      class: "survey-wake-origin",
      cx: ((Number(origin.x) / 100) * MAP_W).toFixed(1),
      cy: ((Number(origin.y) / 100) * MAP_H).toFixed(1),
      r: "6.4"
    }));
  }

  const tip = points[points.length - 1];
  group.appendChild(createSvgNode("circle", {
    class: "survey-wake-point",
    cx: ((Number(tip.x) / 100) * MAP_W).toFixed(1),
    cy: ((Number(tip.y) / 100) * MAP_H).toFixed(1),
    r: "2.6"
  }));

  milestones.forEach((milestone) => {
    group.appendChild(createSvgNode("circle", {
      class: "survey-wake-milestone",
      cx: ((Number(milestone.x) / 100) * MAP_W).toFixed(1),
      cy: ((Number(milestone.y) / 100) * MAP_H).toFixed(1),
      r: "3.8"
    }));
  });

  el.surveyWakeLayer.replaceChildren(group);
}

function renderSurveyWakePanel() {
  if (!el.surveyWake) return;

  if (!state.surveyWakeEnabled) {
    el.surveyWake.innerHTML = `
      <p>Survey Wake is hidden. Re-enable it in Controls to reveal the skiff's recent path.</p>
      <p>Wake milestones appear here after the skiff starts moving.</p>
    `;
    return;
  }

  const summary = summarizeSurveyWake();
  const milestoneList = state.surveyWakeMilestones || [];
  const milestoneHtml = milestoneList.length > 0
    ? `
      <div class="wake-milestone-list">
        ${milestoneList.map((milestone, index) => `
          <button type="button" class="wake-milestone-item" data-wake-milestone-index="${index}">
            <strong>${escapeHtml(milestone.label || "Wake event")}</strong>
            <span>${escapeHtml(milestone.region || "Unknown region")} · x ${formatPercentCoord(milestone.x)} · y ${formatPercentCoord(milestone.y)}</span>
          </button>
        `).join("")}
      </div>
    `
    : "<p class=\"small\">No wake milestones yet. Pilot the skiff to begin tracing the map.</p>";

  el.surveyWake.innerHTML = `
    <p class="wake-line">The wake records the skiff's recent path across the map.</p>
    <p class="wake-line">Move the Survey Skiff or dock to anchors to add new wake points.</p>
    <p class="wake-line">Wake span: ${summary.pointCount} points stored across ${formatPercentCoord(summary.wakeSpan)} total map distance, with ${summary.crossingCount} region crossing${summary.crossingCount === 1 ? "" : "s"} and ${summary.dockCount} dock${summary.dockCount === 1 ? "" : "s"} logged.</p>
    <div class="wake-meta">
      <span class="wake-pill">Points stored: ${summary.pointCount}</span>
      <span class="wake-pill">Region crossings: ${summary.crossingCount}</span>
      <span class="wake-pill">Docks logged: ${summary.dockCount}</span>
    </div>
    <div class="wake-actions">
      <button type="button" class="wake-action" data-wake-action="center">Center on wake</button>
      <button type="button" class="wake-action" data-wake-action="clear">Clear wake</button>
    </div>
    <p class="small wake-subtitle">Recent wake milestones</p>
    ${milestoneHtml}
  `;
}

function renderSurveyGridOverlay() {
  if (!el.surveyGridLayer) return;
  const isVisible = state.surveyGridEnabled;
  el.surveyGridLayer.style.display = isVisible ? "block" : "none";
  if (!isVisible) {
    el.surveyGridLayer.replaceChildren();
    return;
  }

  const sectors = buildSurveyGridSectors(state.surveySkiffCoord);
  const currentSector = findSurveySectorForCoord(state.surveySkiffCoord);
  const sectorWidthWorld = MAP_W / SURVEY_GRID_COLUMNS;
  const sectorHeightWorld = MAP_H / SURVEY_GRID_ROWS;
  const group = createSvgNode("g", { class: "survey-grid-overlay" });

  sectors.forEach((sector) => {
    const x = (Number(sector.xMin) / 100) * MAP_W;
    const y = (Number(sector.yMin) / 100) * MAP_H;
    const classes = [
      "survey-grid-sector",
      state.chartedSurveySectorIds.has(sector.id) ? "is-charted" : "",
      currentSector && currentSector.id === sector.id ? "is-current" : ""
    ].filter(Boolean).join(" ");
    group.appendChild(createSvgNode("rect", {
      class: classes,
      x: x.toFixed(1),
      y: y.toFixed(1),
      width: sectorWidthWorld.toFixed(1),
      height: sectorHeightWorld.toFixed(1)
    }));
  });

  if (currentSector) {
    const label = createSvgNode("text", {
      class: "survey-grid-current-label",
      x: ((Number(currentSector.centerX) / 100) * MAP_W).toFixed(1),
      y: (((Number(currentSector.centerY) / 100) * MAP_H) - 8).toFixed(1)
    });
    label.textContent = `Current sector: ${currentSector.label}`;
    group.appendChild(label);
  }

  el.surveyGridLayer.replaceChildren(group);
}

function renderSurveyGridPanel() {
  if (!el.surveyGrid) return;

  if (!state.surveyGridEnabled) {
    el.surveyGrid.innerHTML = `
      <p>Survey Grid is hidden. Re-enable it in Controls to reveal the skiff's charted sectors.</p>
      <p>Pilot the Survey Skiff with the grid enabled to record explored territory.</p>
    `;
    return;
  }

  const sectors = buildSurveyGridSectors(state.surveySkiffCoord);
  const byId = new Map(sectors.map((sector) => [sector.id, sector]));
  const chartedSectors = listChartedSurveySectorsInLogOrder();
  const currentSector = findSurveySectorForCoord(state.surveySkiffCoord);
  const chartedRegionCount = new Set(chartedSectors.map((sector) => sector.region || "Open map")).size;
  const currentLabel = currentSector ? currentSector.label : "Unknown";
  const currentRegion = currentSector ? currentSector.region : (classifyRegionAtPercent(state.surveySkiffCoord) || "Open map");
  const formatRange = (value) => Number(value).toFixed(1);

  const chartedCards = chartedSectors.length > 0
    ? `
      <div class="survey-grid-sector-list">
        ${chartedSectors.map((sector) => `
          <button type="button" class="survey-grid-sector-item" data-survey-sector-id="${escapeHtml(sector.id)}">
            <strong>${escapeHtml(sector.label)}</strong>
            <span>${escapeHtml(sector.region || "Open map")} · x ${formatRange(sector.xMin)}-${formatRange(sector.xMax)}% · y ${formatRange(sector.yMin)}-${formatRange(sector.yMax)}%</span>
          </button>
        `).join("")}
      </div>
    `
    : "<p class=\"small\">No sectors charted yet. Pilot the Survey Skiff to begin recording the map.</p>";

  const recentLog = (state.surveySectorLog || [])
    .map((entry) => byId.get(entry && entry.sectorId))
    .filter(Boolean);
  const recentCards = chartedSectors.length === 0
    ? ""
    : recentLog.length > 0
    ? `
      <div class="survey-grid-log-list">
        ${recentLog.map((sector) => `
          <button type="button" class="survey-grid-log-item" data-survey-sector-id="${escapeHtml(sector.id)}">
            <strong>${escapeHtml(sector.label)}</strong>
            <span>${escapeHtml(sector.region || "Open map")} · x ${formatRange(sector.xMin)}-${formatRange(sector.xMax)}% · y ${formatRange(sector.yMin)}-${formatRange(sector.yMax)}%</span>
          </button>
        `).join("")}
      </div>
    `
    : "<p class=\"small\">No sectors charted yet. Pilot the Survey Skiff to begin recording the map.</p>";

  el.surveyGrid.innerHTML = `
    <p class="survey-grid-line">Survey Grid records which map sectors the Survey Skiff has charted.</p>
    <p class="survey-grid-line">Pilot the Survey Skiff to extend the chart across the world.</p>
    <p class="survey-grid-line">Grid coverage: ${chartedSectors.length} of ${SURVEY_GRID_COLUMNS * SURVEY_GRID_ROWS} sectors charted across ${chartedRegionCount} region(s).</p>
    <p class="survey-grid-line">Current sector: ${escapeHtml(currentLabel)} (${escapeHtml(currentRegion || "Open map")})</p>
    <div class="survey-grid-actions">
      <button type="button" class="survey-grid-action" data-survey-grid-action="center-current" ${currentSector ? "" : "disabled"}>Center on current sector</button>
      <button type="button" class="survey-grid-action" data-survey-grid-action="center-charted" ${chartedSectors.length > 0 ? "" : "disabled"}>Center on charted sectors</button>
    </div>
    <div class="survey-grid-meta">
      <span class="survey-grid-pill">Sectors charted: ${chartedSectors.length}</span>
      <span class="survey-grid-pill">Regions charted: ${chartedRegionCount}</span>
      <span class="survey-grid-pill">Sector size: ${(100 / SURVEY_GRID_COLUMNS).toFixed(1)}% × ${(100 / SURVEY_GRID_ROWS).toFixed(1)}%</span>
    </div>
    ${chartedCards}
    <p class="small survey-grid-subtitle">Recent sector charting</p>
    ${recentCards}
  `;
}

function renderTriangulationOverlay() {
  if (!el.triangulationLayer) return;
  const isVisible = state.triangulationEnabled;
  el.triangulationLayer.style.display = isVisible ? "block" : "none";
  if (!isVisible) {
    el.triangulationLayer.replaceChildren();
    return;
  }

  const fix = state.currentTriangulationFix;
  const skiff = state.surveySkiffCoord;
  if (!state.surveySkiffEnabled || !fix || !skiff) {
    el.triangulationLayer.replaceChildren();
    return;
  }

  const group = createSvgNode("g", { class: "triangulation-overlay" });
  const anchorWorldPoints = fix.anchors.map((anchor) => ({
    x: ((Number(anchor.x) / 100) * MAP_W).toFixed(1),
    y: ((Number(anchor.y) / 100) * MAP_H).toFixed(1)
  }));
  const skiffWorld = {
    x: ((Number(skiff.x) / 100) * MAP_W).toFixed(1),
    y: ((Number(skiff.y) / 100) * MAP_H).toFixed(1)
  };
  const centroidWorld = {
    x: ((Number(fix.centroid.x) / 100) * MAP_W).toFixed(1),
    y: ((Number(fix.centroid.y) / 100) * MAP_H).toFixed(1)
  };
  const polygonPoints = anchorWorldPoints.map((point) => `${point.x},${point.y}`).join(" ");

  group.appendChild(createSvgNode("polygon", {
    class: "triangulation-polygon",
    points: polygonPoints
  }));

  anchorWorldPoints.forEach((point) => {
    group.appendChild(createSvgNode("line", {
      class: "triangulation-bearing",
      x1: skiffWorld.x,
      y1: skiffWorld.y,
      x2: point.x,
      y2: point.y
    }));
    group.appendChild(createSvgNode("circle", {
      class: "triangulation-anchor-glow",
      cx: point.x,
      cy: point.y,
      r: "6.2"
    }));
    group.appendChild(createSvgNode("circle", {
      class: "triangulation-anchor-point",
      cx: point.x,
      cy: point.y,
      r: "2.8"
    }));
  });

  group.appendChild(createSvgNode("circle", {
    class: "triangulation-centroid-point",
    cx: centroidWorld.x,
    cy: centroidWorld.y,
    r: "3.3"
  }));

  const label = createSvgNode("text", {
    class: "triangulation-label",
    x: (Number(centroidWorld.x) + 11).toFixed(1),
    y: (Number(centroidWorld.y) - 10).toFixed(1)
  });
  label.textContent = `Triangulation fix · ${fix.label}`;
  group.appendChild(label);

  el.triangulationLayer.replaceChildren(group);
}

function renderTriangulationPanel() {
  if (!el.triangulation) return;
  if (!state.triangulationEnabled) {
    el.triangulation.innerHTML = `
      <p>Triangulation is hidden. Re-enable it in Controls to reveal the skiff's current three-anchor fix.</p>
      <p>Pilot the Survey Skiff with triangulation enabled to track nearby built-in anchors.</p>
    `;
    return;
  }

  if (!state.surveySkiffEnabled) {
    el.triangulation.innerHTML = "<p class=\"small\">Triangulation is unavailable while the Survey Skiff is offline.</p>";
    return;
  }

  const fix = state.currentTriangulationFix;
  if (!fix || !Array.isArray(fix.anchors) || fix.anchors.length < TRIANGULATION_ANCHOR_COUNT) {
    el.triangulation.innerHTML = "<p class=\"small\">Triangulation is unavailable because fewer than three traverse-network anchors are available.</p>";
    return;
  }

  const anchorsHtml = `
    <div class="triangulation-anchor-list">
      ${fix.anchors.map((anchor) => `
        <button type="button" class="triangulation-anchor-item" data-triangulation-anchor-ref="${escapeHtml(anchor.ref)}">
          <strong>${escapeHtml(anchor.title || "Untitled anchor")}</strong>
          <span>${escapeHtml(anchor.region || "Unknown region")} · ${escapeHtml(getTriangulationAnchorKindLabel(anchor.type))}</span>
          <span>${formatPercentCoord(anchor.distance)} away</span>
        </button>
      `).join("")}
    </div>
  `;

  const logHtml = state.triangulationLog.length > 0
    ? `
      <div class="triangulation-log-list">
        ${state.triangulationLog.map((entry, index) => `
          <button type="button" class="triangulation-log-item" data-triangulation-log-index="${index}">
            <strong>${escapeHtml(entry.label || "Triangulation fix")}</strong>
            <span>${Number(entry.regionCount) || 0} region(s) · span ${formatPercentCoord(entry.span)}</span>
            <span>x ${formatPercentCoord(entry.centroid && entry.centroid.x)} · y ${formatPercentCoord(entry.centroid && entry.centroid.y)}</span>
          </button>
        `).join("")}
      </div>
    `
    : "<p class=\"small\">No triangulation fixes logged yet.</p>";

  el.triangulation.innerHTML = `
    <p class="triangulation-line">Triangulation plots the Survey Skiff against its three nearest built-in route anchors.</p>
    <p class="triangulation-line">Pilot the Survey Skiff to shift the fix across the world.</p>
    <p class="triangulation-line">Current fix: ${escapeHtml(fix.label)}, ${TRIANGULATION_ANCHOR_COUNT} anchors spanning ${fix.regionCount} region(s).</p>
    <p class="triangulation-line">Fix centroid: x ${formatPercentCoord(fix.centroid.x)} · y ${formatPercentCoord(fix.centroid.y)}</p>
    <div class="triangulation-actions">
      <button type="button" class="triangulation-action" data-triangulation-action="center-fix">Center on triangulation</button>
      <button type="button" class="triangulation-action" data-triangulation-action="center-skiff">Center on skiff</button>
    </div>
    <div class="triangulation-meta">
      <span class="triangulation-pill">Anchors in fix: ${TRIANGULATION_ANCHOR_COUNT}</span>
      <span class="triangulation-pill">Regions spanned: ${fix.regionCount}</span>
      <span class="triangulation-pill">Fix span: ${formatPercentCoord(fix.span)}</span>
    </div>
    ${anchorsHtml}
    <p class="small triangulation-subtitle">Recent triangulation fixes</p>
    ${logHtml}
  `;
}

function activateApproachRadarTarget(target) {
  if (!target || !target.ref) return;
  if (target.type === "landmark" || target.type === "echo" || target.type === "lattice") {
    activateSkiffAnchorByRef(target.ref, { dock: false });
    return;
  }
  const resolved = resolveBuiltinReference(target.ref);
  if (!resolved) return;
  activateMarker(resolved, { focus: true, updateHash: false });
}

function renderApproachRadarOverlay() {
  if (!el.approachRadarLayer) return;
  const isVisible = state.approachRadarEnabled;
  el.approachRadarLayer.style.display = isVisible ? "block" : "none";
  if (!isVisible) {
    el.approachRadarLayer.replaceChildren();
    return;
  }

  const scan = state.currentApproachRadarScan;
  if (!state.surveySkiffEnabled || !scan || !scan.skiffCoord) {
    el.approachRadarLayer.replaceChildren();
    return;
  }

  const centerX = ((Number(scan.skiffCoord.x) / 100) * MAP_W).toFixed(1);
  const centerY = ((Number(scan.skiffCoord.y) / 100) * MAP_H).toFixed(1);
  const worldRadius = (Number(scan.radius) / 100) * Math.min(MAP_W, MAP_H);
  const inRangeTargets = Array.isArray(scan.inRangeTargets) ? scan.inRangeTargets : [];
  const nearest = scan.nearestTarget;

  const group = createSvgNode("g", { class: "approach-radar-overlay" });
  APPROACH_RADAR_RING_STEPS.forEach((step, index) => {
    group.appendChild(createSvgNode("circle", {
      class: `approach-radar-ring${index < APPROACH_RADAR_RING_STEPS.length - 1 ? " is-inner" : ""}`,
      cx: centerX,
      cy: centerY,
      r: (worldRadius * Number(step)).toFixed(1)
    }));
  });

  inRangeTargets.forEach((target) => {
    const tx = ((Number(target.x) / 100) * MAP_W).toFixed(1);
    const ty = ((Number(target.y) / 100) * MAP_H).toFixed(1);
    group.appendChild(createSvgNode("line", {
      class: "approach-radar-bearing",
      x1: centerX,
      y1: centerY,
      x2: tx,
      y2: ty
    }));
    group.appendChild(createSvgNode("circle", {
      class: "approach-radar-blip-glow",
      cx: tx,
      cy: ty,
      r: "5.3"
    }));
    group.appendChild(createSvgNode("circle", {
      class: "approach-radar-blip",
      cx: tx,
      cy: ty,
      r: "2.6"
    }));
  });

  group.appendChild(createSvgNode("circle", {
    class: "approach-radar-skiff-core",
    cx: centerX,
    cy: centerY,
    r: "3.1"
  }));

  const label = createSvgNode("text", {
    class: "approach-radar-label",
    x: (Number(centerX) + worldRadius + 12).toFixed(1),
    y: (Number(centerY) - 10).toFixed(1)
  });
  label.textContent = nearest
    ? `Approach radar · ${nearest.title}`
    : "Approach radar · no targets";
  group.appendChild(label);
  el.approachRadarLayer.replaceChildren(group);
}

function renderApproachRadarPanel() {
  if (!el.approachRadar) return;
  if (!state.approachRadarEnabled) {
    el.approachRadar.innerHTML = `
      <p>Approach Radar is hidden. Re-enable it in Controls to reveal nearby systems around the Survey Skiff.</p>
      <p>Pilot the Survey Skiff with approach radar enabled to scan local map traffic.</p>
    `;
    return;
  }
  if (!state.surveySkiffEnabled) {
    el.approachRadar.innerHTML = "<p class=\"small\">Approach Radar is unavailable while the Survey Skiff is offline.</p>";
    return;
  }

  const scan = state.currentApproachRadarScan || buildApproachRadarScan(state.surveySkiffCoord);
  if (!scan) {
    el.approachRadar.innerHTML = "<p class=\"small\">Approach Radar is unavailable while the Survey Skiff is offline.</p>";
    return;
  }

  const inRangeTargets = Array.isArray(scan.inRangeTargets) ? scan.inRangeTargets.slice(0, APPROACH_RADAR_TARGET_LIST_MAX) : [];
  const nearest = scan.nearestTarget;
  const kindsInRange = new Set(inRangeTargets.map((target) => target.kindLabel)).size;
  const currentScanLine = nearest
    ? `Current scan: ${inRangeTargets.length} target${inRangeTargets.length === 1 ? "" : "s"} in range, nearest ${escapeHtml(nearest.title)} (${escapeHtml(nearest.kindLabel)}).`
    : `Current scan: ${inRangeTargets.length} target${inRangeTargets.length === 1 ? "" : "s"} in range, nearest None.`;
  const radiusLine = nearest
    ? `Radar radius: ${APPROACH_RADAR_RADIUS_PCT.toFixed(1)}% · nearest target ${nearest.distance.toFixed(1)}% away.`
    : `Radar radius: ${APPROACH_RADAR_RADIUS_PCT.toFixed(1)}% · no nearest target available.`;
  const targetsHtml = inRangeTargets.length > 0
    ? `
      <div class="approach-radar-target-list">
        ${inRangeTargets.map((target) => `
          <button type="button" class="approach-radar-target-item" data-approach-radar-ref="${escapeHtml(target.ref)}" data-approach-radar-type="${escapeHtml(target.type)}">
            <strong>${escapeHtml(target.title)}</strong>
            <span>${escapeHtml(target.region || "Unknown region")} · ${escapeHtml(target.kindLabel)}</span>
            <span>${target.distance.toFixed(1)}% away · x ${formatPercentCoord(target.x)} · y ${formatPercentCoord(target.y)}</span>
          </button>
        `).join("")}
      </div>
    `
    : "<p class=\"small\">No targets are currently in range. Pilot the Survey Skiff to bring built-in systems into local radar range.</p>";
  const logHtml = state.approachRadarLog.length > 0
    ? `
      <div class="approach-radar-log-list">
        ${state.approachRadarLog.map((entry, index) => `
          <button type="button" class="approach-radar-log-item" data-approach-radar-log-index="${index}">
            <strong>${escapeHtml(entry.nearestTitle || "No nearest target")}</strong>
            <span>${escapeHtml(entry.nearestKind || "Scan snapshot")} · in-range ${Number(entry.inRangeCount) || 0}</span>
            <span>${entry.nearestDistance === null ? "Distance unavailable" : `${Number(entry.nearestDistance).toFixed(1)}% away`}</span>
          </button>
        `).join("")}
      </div>
    `
    : "<p class=\"small\">No radar scans logged yet.</p>";

  el.approachRadar.innerHTML = `
    <p class="approach-radar-line">Approach Radar scans built-in navigational systems around the Survey Skiff.</p>
    <p class="approach-radar-line">Pilot the Survey Skiff to bring different systems into local range.</p>
    <p class="approach-radar-line">${currentScanLine}</p>
    <p class="approach-radar-line">${radiusLine}</p>
    <div class="approach-radar-actions">
      <button type="button" class="approach-radar-action" data-approach-radar-action="center-radar">Center on radar</button>
      <button type="button" class="approach-radar-action" data-approach-radar-action="center-skiff">Center on skiff</button>
    </div>
    <div class="approach-radar-meta">
      <span class="approach-radar-pill">Targets in range: ${inRangeTargets.length}</span>
      <span class="approach-radar-pill">Kinds in range: ${kindsInRange}</span>
      <span class="approach-radar-pill">Nearest target: ${nearest ? escapeHtml(nearest.kindLabel) : "None"}</span>
    </div>
    <p class="small approach-radar-subtitle">Targets in range</p>
    ${targetsHtml}
    <p class="small approach-radar-subtitle">Recent radar scans</p>
    ${logHtml}
  `;
}

function renderBeaconSoundingOverlay() {
  if (!el.beaconSoundingsLayer) return;
  const isVisible = state.beaconSoundingsEnabled;
  el.beaconSoundingsLayer.style.display = isVisible ? "block" : "none";
  if (!isVisible) {
    el.beaconSoundingsLayer.replaceChildren();
    return;
  }

  const sounding = state.currentBeaconSounding;
  if (!state.surveySkiffEnabled || !sounding || !sounding.skiffCoord) {
    el.beaconSoundingsLayer.replaceChildren();
    return;
  }

  const centerX = ((Number(sounding.skiffCoord.x) / 100) * MAP_W).toFixed(1);
  const centerY = ((Number(sounding.skiffCoord.y) / 100) * MAP_H).toFixed(1);
  const worldRadius = (Number(sounding.radius) / 100) * Math.min(MAP_W, MAP_H);
  const inRangeTargets = Array.isArray(sounding.inRangeTargets) ? sounding.inRangeTargets : [];
  const nearest = sounding.nearestTarget;

  const group = createSvgNode("g", { class: "beacon-soundings-overlay" });
  BEACON_SOUNDING_RING_STEPS.forEach((step, index) => {
    group.appendChild(createSvgNode("circle", {
      class: `beacon-soundings-ring${index < BEACON_SOUNDING_RING_STEPS.length - 1 ? " is-inner" : ""}`,
      cx: centerX,
      cy: centerY,
      r: (worldRadius * Number(step)).toFixed(1)
    }));
  });

  inRangeTargets.forEach((target) => {
    const tx = ((Number(target.x) / 100) * MAP_W).toFixed(1);
    const ty = ((Number(target.y) / 100) * MAP_H).toFixed(1);
    const targetColor = String(target.color || "").trim() || "#f8a3d8";
    group.appendChild(createSvgNode("line", {
      class: "beacon-soundings-bearing",
      x1: centerX,
      y1: centerY,
      x2: tx,
      y2: ty
    }));
    group.appendChild(createSvgNode("circle", {
      class: "beacon-soundings-blip-glow",
      cx: tx,
      cy: ty,
      r: "5.6",
      fill: targetColor,
      stroke: targetColor
    }));
    group.appendChild(createSvgNode("circle", {
      class: "beacon-soundings-blip",
      cx: tx,
      cy: ty,
      r: "2.8",
      fill: targetColor,
      stroke: targetColor
    }));
  });

  group.appendChild(createSvgNode("circle", {
    class: "beacon-soundings-skiff-core",
    cx: centerX,
    cy: centerY,
    r: "3.2"
  }));

  const label = createSvgNode("text", {
    class: "beacon-soundings-label",
    x: (Number(centerX) + worldRadius + 12).toFixed(1),
    y: (Number(centerY) - 10).toFixed(1)
  });
  label.textContent = nearest
    ? `Beacon soundings · #${nearest.issueNumber} ${nearest.title}`
    : "Beacon soundings · no public beacons";
  group.appendChild(label);

  el.beaconSoundingsLayer.replaceChildren(group);
}

function renderBeaconSoundingPanel() {
  if (!el.beaconSoundings) return;
  if (!state.beaconSoundingsEnabled) {
    el.beaconSoundings.innerHTML = `
      <p>Beacon Soundings is hidden. Re-enable it in Controls to reveal nearby public traces around the Survey Skiff.</p>
      <p>Pilot the Survey Skiff with beacon soundings enabled to survey visitor marks.</p>
    `;
    return;
  }
  if (!state.surveySkiffEnabled) {
    el.beaconSoundings.innerHTML = "<p class=\"small\">Beacon Soundings is unavailable while the Survey Skiff is offline.</p>";
    return;
  }

  const sounding = state.currentBeaconSounding || buildBeaconSounding(state.surveySkiffCoord);
  if (!sounding) {
    el.beaconSoundings.innerHTML = "<p class=\"small\">Beacon Soundings is unavailable while the Survey Skiff is offline.</p>";
    return;
  }

  const allInRangeTargets = Array.isArray(sounding.inRangeTargets) ? sounding.inRangeTargets : [];
  const inRangeTargets = allInRangeTargets.slice(0, BEACON_SOUNDING_TARGET_LIST_MAX);
  const nearest = sounding.nearestTarget;
  const evidenceRevisionCount = allInRangeTargets.filter((target) => target.posture === "full").length;
  const inRangeCount = allInRangeTargets.length;
  const currentLine = nearest
    ? `Current sounding: ${inRangeCount} public beacon${inRangeCount === 1 ? "" : "s"} in range, nearest ${escapeHtml(nearest.title)} (#${nearest.issueNumber}, ${escapeHtml(nearest.postureLabel)}).`
    : `Current sounding: ${inRangeCount} public beacon${inRangeCount === 1 ? "" : "s"} in range, nearest None.`;
  const radiusLine = nearest
    ? `Sounding radius: ${BEACON_SOUNDING_RADIUS_PCT.toFixed(1)}% · nearest public beacon ${nearest.distance.toFixed(1)}% away.`
    : `Sounding radius: ${BEACON_SOUNDING_RADIUS_PCT.toFixed(1)}% · no nearest public beacon available.`;
  const targetsHtml = inRangeTargets.length > 0
    ? `
      <div class="beacon-soundings-target-list">
        ${inRangeTargets.map((target) => `
          <button type="button" class="beacon-soundings-target-item" data-beacon-sounding-issue="${target.issueNumber}">
            <strong>${escapeHtml(target.title)}</strong>
            <span>${escapeHtml(target.region || "Unknown region")} · ${escapeHtml(target.visitor || "Unknown visitor")} · issue #${target.issueNumber}</span>
            <span>${escapeHtml(target.postureLabel || "Unknown posture")} · ${target.distance.toFixed(1)}% away · x ${formatPercentCoord(target.x)} · y ${formatPercentCoord(target.y)}</span>
          </button>
        `).join("")}
      </div>
    `
    : "<p class=\"small\">No public beacons are currently in range. Pilot the Survey Skiff to bring visitor traces into local range.</p>";
  const logHtml = state.beaconSoundingLog.length > 0
    ? `
      <div class="beacon-soundings-log-list">
        ${state.beaconSoundingLog.map((entry, index) => `
          <button type="button" class="beacon-soundings-log-item" data-beacon-sounding-log-index="${index}">
            <strong>${escapeHtml(entry.nearestTitle || "Nearest beacon unavailable")}</strong>
            <span>${entry.nearestIssueNumber === null ? "Issue unavailable" : `Issue #${Number(entry.nearestIssueNumber)}`} · ${escapeHtml(entry.nearestPosture || "Unavailable")} · in-range ${Number(entry.inRangeCount) || 0}</span>
            <span>${entry.nearestDistance === null ? "Distance unavailable" : `${Number(entry.nearestDistance).toFixed(1)}% away`}</span>
          </button>
        `).join("")}
      </div>
    `
    : "<p class=\"small\">No beacon soundings logged yet.</p>";

  el.beaconSoundings.innerHTML = `
    <p class="beacon-soundings-line">Beacon Soundings surveys nearby public beacons around the Survey Skiff.</p>
    <p class="beacon-soundings-line">Pilot the Survey Skiff to bring different visitor traces into local range.</p>
    <p class="beacon-soundings-line">${currentLine}</p>
    <p class="beacon-soundings-line">${radiusLine}</p>
    <div class="beacon-soundings-actions">
      <button type="button" class="beacon-soundings-action" data-beacon-sounding-action="center-soundings">Center on soundings</button>
      <button type="button" class="beacon-soundings-action" data-beacon-sounding-action="center-skiff">Center on skiff</button>
    </div>
    <div class="beacon-soundings-meta">
      <span class="beacon-soundings-pill">Beacons in range: ${inRangeCount}</span>
      <span class="beacon-soundings-pill">Regions in range: ${Number(sounding.regionCount) || 0}</span>
      <span class="beacon-soundings-pill">Evidence + revision in range: ${evidenceRevisionCount}</span>
    </div>
    <p class="small beacon-soundings-subtitle">Public beacons in range</p>
    ${targetsHtml}
    <p class="small beacon-soundings-subtitle">Recent soundings</p>
    ${logHtml}
  `;
}

function renderDriftSignalOverlay() {
  if (!el.driftSignalLayer) return;
  const driftSignals = getDriftSignals();
  if (driftSignals.length === 0) {
    el.driftSignalLayer.style.display = "none";
    el.driftSignalLayer.replaceChildren();
    return;
  }

  el.driftSignalLayer.style.display = "block";
  const group = createSvgNode("g", { class: "drift-signal-overlay" });
  const hullPoints = [...DRIFT_SIGNAL_BASE_BERTHS, DRIFT_SIGNAL_BASE_BERTHS[0]]
    .map((point) => `${((Number(point.x) / 100) * MAP_W).toFixed(1)},${((Number(point.y) / 100) * MAP_H).toFixed(1)}`)
    .join(" ");
  group.appendChild(createSvgNode("polyline", {
    class: "drift-signal-hull",
    points: hullPoints
  }));

  DRIFT_SIGNAL_BASE_BERTHS.forEach((berth) => {
    group.appendChild(createSvgNode("circle", {
      class: "drift-signal-berth",
      cx: ((Number(berth.x) / 100) * MAP_W).toFixed(1),
      cy: ((Number(berth.y) / 100) * MAP_H).toFixed(1),
      r: "4.1"
    }));
  });

  const activeIssue = parseIssueNumber(state.activeTrace && state.activeTrace.issueNumber);
  driftSignals.forEach((signal) => {
    const x = (Number(signal.x) / 100) * MAP_W;
    const y = (Number(signal.y) / 100) * MAP_H;
    const isActive = parseIssueNumber(signal.issueNumber) === activeIssue;
    group.appendChild(createSvgNode("circle", {
      class: `drift-signal-berth is-occupied${isActive ? " is-active" : ""}`,
      cx: x.toFixed(1),
      cy: y.toFixed(1),
      r: isActive ? "6.2" : "5.3"
    }));
    const label = createSvgNode("text", {
      class: "drift-signal-label",
      x: (x + 8.5).toFixed(1),
      y: (y - 6.5).toFixed(1)
    });
    label.textContent = `#${signal.issueNumber}`;
    group.appendChild(label);
  });

  el.driftSignalLayer.replaceChildren(group);
}

function renderDriftSignalsPanel() {
  if (!el.driftSignals) return;
  const driftSignals = getDriftSignals().sort(compareBeaconLedger);
  if (driftSignals.length === 0) {
    el.driftSignals.innerHTML = `
      <p>Drift Signals is clear. All labeled public beacon issues currently include usable coordinates, so none are parked in the perimeter ring.</p>
      <p>Revise a labeled public issue without x/y values and it will appear here on the next fetch.</p>
    `;
    return;
  }

  const skiff = state.surveySkiffCoord || { x: 50, y: 50 };
  const nearestEntry = driftSignals
    .map((signal) => ({
      signal,
      distance: Math.hypot(Number(signal.x) - Number(skiff.x), Number(signal.y) - Number(skiff.y))
    }))
    .sort(
      (a, b) =>
        a.distance - b.distance ||
        compareBeaconLedger(a.signal, b.signal)
    )[0];
  const nearest = nearestEntry ? nearestEntry.signal : driftSignals[0];
  const nearestDistance = nearestEntry ? nearestEntry.distance : 0;
  const regionCount = new Set(driftSignals.map((signal) => signal.region || "Beacon Field")).size;
  const nearestTitle = String((nearest && nearest.title) || "Untitled beacon");
  const activeIssue = parseIssueNumber(state.activeTrace && state.activeTrace.issueNumber);

  el.driftSignals.innerHTML = `
    <p class="drift-signals-line">Drift Signals holds labeled public issues that arrived without usable map coordinates.</p>
    <p class="drift-signals-line">Each one is parked in a deterministic perimeter berth until its issue is revised with x and y values.</p>
    <p class="drift-signals-line">Current drift: ${driftSignals.length} public issue(s) parked, nearest ${escapeHtml(nearestTitle)} (#${nearest.issueNumber}).</p>
    <p class="drift-signals-line">Nearest berth: ${nearestDistance.toFixed(1)}% from the Survey Skiff · ${regionCount} region(s) adjacent to parked signals.</p>
    <div class="drift-signals-actions">
      <button type="button" class="drift-signals-action" data-drift-signal-action="center-ring">Center on drift ring</button>
      <button type="button" class="drift-signals-action" data-drift-signal-action="open-nearest">Open nearest drift issue</button>
    </div>
    <p class="drift-signals-subtitle">Drift ring arrivals</p>
    <div class="drift-signals-list">
      ${driftSignals.map((signal) => {
        const isActive = parseIssueNumber(signal.issueNumber) === activeIssue;
        return `
          <button type="button" class="drift-signals-item${isActive ? " is-active" : ""}" data-drift-signal-issue="${signal.issueNumber}">
            <strong>${escapeHtml(signal.title || "Untitled beacon")}</strong>
            <span>${escapeHtml(signal.visitor || "Unknown")} · issue #${signal.issueNumber} · ${escapeHtml(signal.driftReason || "Missing x/y coordinates")} · berth x ${formatPercentCoord(signal.x)} · y ${formatPercentCoord(signal.y)}</span>
          </button>
        `;
      }).join("")}
    </div>
    <p class="drift-signals-subtitle">How to settle a drift signal</p>
    <ul class="drift-signals-guidance">
      <li>Add <code>x:</code> and <code>y:</code> fields in the structured beacon block or issue-form sections.</li>
      <li>The berth is deterministic and temporary; usable coordinates will replace it on the next public fetch.</li>
    </ul>
  `;
}

function renderWitnessThreadsOverlay() {
  if (!el.witnessThreadsLayer) return;
  const witnessThreads = getWitnessThreads().threads;
  if (!state.witnessThreadsEnabled || witnessThreads.length === 0) {
    el.witnessThreadsLayer.style.display = "none";
    el.witnessThreadsLayer.replaceChildren();
    return;
  }

  const drawableThreads = witnessThreads
    .map((thread) => {
      const positioned = thread.beacons
        .map((beacon) => {
          const x = Number(beacon && beacon.x);
          const y = Number(beacon && beacon.y);
          if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
          return {
            beacon,
            worldX: (x / 100) * MAP_W,
            worldY: (y / 100) * MAP_H
          };
        })
        .filter(Boolean);
      return positioned.length === 0 ? null : { thread, positioned };
    })
    .filter(Boolean);

  if (drawableThreads.length === 0) {
    el.witnessThreadsLayer.style.display = "none";
    el.witnessThreadsLayer.replaceChildren();
    return;
  }

  el.witnessThreadsLayer.style.display = "block";
  const activeIssue = parseIssueNumber(state.activeTrace && state.activeTrace.issueNumber);
  const group = createSvgNode("g", { class: "witness-threads-overlay" });

  drawableThreads.forEach(({ positioned }) => {
    if (positioned.length >= 2) {
      const points = positioned
        .map((entry) => `${entry.worldX.toFixed(1)},${entry.worldY.toFixed(1)}`)
        .join(" ");
      group.appendChild(createSvgNode("polyline", { class: "witness-thread-path-glow", points }));
      group.appendChild(createSvgNode("polyline", { class: "witness-thread-path", points }));
    }

    const newestEntry = positioned[positioned.length - 1];
    positioned.forEach((entry) => {
      const issueNumber = parseIssueNumber(entry.beacon && entry.beacon.issueNumber);
      const isActive = issueNumber !== null && issueNumber === activeIssue;
      const node = createSvgNode("g", {
        class: `witness-thread-node${isActive ? " is-active" : ""}`,
        transform: `translate(${entry.worldX.toFixed(1)} ${entry.worldY.toFixed(1)})`
      });
      node.appendChild(createSvgNode("circle", { class: "witness-thread-node-glow", r: "11.2" }));
      node.appendChild(createSvgNode("circle", { class: "witness-thread-node-ring", r: "7.6" }));
      node.appendChild(createSvgNode("circle", { class: "witness-thread-node-dot", r: "3.1" }));
      node.appendChild(createSvgNode("circle", { class: "witness-thread-node-active-ring", r: "14.1" }));
      group.appendChild(node);
    });

    if (newestEntry) {
      const latestLabel = createSvgNode("text", {
        class: "witness-thread-latest-label",
        x: (newestEntry.worldX + 9.8).toFixed(1),
        y: (newestEntry.worldY - 10.1).toFixed(1)
      });
      latestLabel.textContent = "Latest";
      group.appendChild(latestLabel);
    }
  });

  el.witnessThreadsLayer.replaceChildren(group);
}

function renderWitnessThreadsPanel() {
  if (!el.witnessThreads) return;
  if (!state.witnessThreadsEnabled) {
    el.witnessThreads.innerHTML = "<p>Witness Threads is hidden. Re-enable it in Controls to reconnect returning visitors.</p>";
    return;
  }

  const witnessData = getWitnessThreads();
  const threads = witnessData.threads;
  const soloVisitors = witnessData.soloVisitors;
  const totalThreadedBeacons = witnessData.totalThreadedBeacons;

  if (threads.length === 0) {
    const soloLine = soloVisitors.length > 0
      ? `<p class="witness-threads-line">Solo visitors currently on record: ${soloVisitors.length}.</p>`
      : "";
    el.witnessThreads.innerHTML = `
      <p class="witness-threads-line">No returning visitors are linked yet.</p>
      <p class="witness-threads-line">Witness Threads will appear once a visitor leaves a second public trace.</p>
      ${soloLine}
    `;
    return;
  }

  const activeVisitorKey = String(state.activeTrace && state.activeTrace.visitor ? state.activeTrace.visitor : "").trim().toLowerCase();
  const threadsHtml = threads.map((thread) => {
    const oldestIssue = parseIssueNumber(thread.firstBeacon && thread.firstBeacon.issueNumber);
    const newestIssue = parseIssueNumber(thread.newestBeacon && thread.newestBeacon.issueNumber);
    const isActive = activeVisitorKey && activeVisitorKey === thread.key;
    const issueLine = [
      `Trace count ${thread.beacons.length}`,
      `Regions ${thread.regions}`,
      `Oldest ${oldestIssue === null ? "issue unknown" : `issue #${oldestIssue}`}`,
      `Newest ${newestIssue === null ? "issue unknown" : `issue #${newestIssue}`}`,
      `Span ${formatWitnessThreadSpan(thread.spanMs)}`
    ].join(" · ");
    return `
      <button type="button" class="witness-threads-item${isActive ? " is-active" : ""}" data-witness-thread-visitor="${escapeHtml(thread.key)}">
        <strong>${escapeHtml(thread.displayName)}</strong>
        <span>${escapeHtml(issueLine)}</span>
      </button>
    `;
  }).join("");

  const soloHtml = soloVisitors.length > 0
    ? `
      <div class="witness-threads-solo-arrivals">
        <p class="witness-threads-solo-title">Solo arrivals</p>
        <ul>
          ${soloVisitors.slice(0, 5).map((visitor) => {
            const issueNumber = parseIssueNumber(visitor.firstBeacon && visitor.firstBeacon.issueNumber);
            return `<li>${escapeHtml(visitor.displayName)} · ${escapeHtml(issueNumber === null ? "issue unknown" : `issue #${issueNumber}`)}</li>`;
          }).join("")}
        </ul>
      </div>
    `
    : "";

  el.witnessThreads.innerHTML = `
    <p class="witness-threads-line">Witness Threads links repeated public traces from the same visitor into durable trails.</p>
    <p class="witness-threads-line">Tracking ${threads.length} active thread(s), ${totalThreadedBeacons} threaded trace(s), and ${soloVisitors.length} solo visitor(s).</p>
    <div class="witness-threads-actions">
      <button type="button" class="witness-threads-action" data-witness-thread-action="center-threads">Center on threads</button>
      <button type="button" class="witness-threads-action" data-witness-thread-action="jump-longest">Jump to longest thread</button>
    </div>
    <div class="witness-threads-meta">
      <span class="witness-threads-pill">Active threads: ${threads.length}</span>
      <span class="witness-threads-pill">Threaded traces: ${totalThreadedBeacons}</span>
      <span class="witness-threads-pill">Solo visitors: ${soloVisitors.length}</span>
    </div>
    <p class="witness-threads-subtitle">Returning visitors</p>
    <div class="witness-threads-list">
      ${threadsHtml}
    </div>
    ${soloHtml}
  `;
}

function renderTracePassageOverlay() {
  if (!el.tracePassageLayer) return;
  const sequence = getTracePassageBeacons();
  if (!state.tracePassageEnabled || sequence.length === 0) {
    el.tracePassageLayer.style.display = "none";
    el.tracePassageLayer.replaceChildren();
    return;
  }

  const positioned = sequence
    .map((beacon, index) => {
      const x = Number(beacon && beacon.x);
      const y = Number(beacon && beacon.y);
      if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
      return {
        beacon,
        index,
        worldX: (x / 100) * MAP_W,
        worldY: (y / 100) * MAP_H
      };
    })
    .filter(Boolean);

  if (positioned.length === 0) {
    el.tracePassageLayer.style.display = "none";
    el.tracePassageLayer.replaceChildren();
    return;
  }

  el.tracePassageLayer.style.display = "block";
  const activeIssue = parseIssueNumber(state.activeTrace && state.activeTrace.issueNumber);
  const group = createSvgNode("g", { class: "trace-passage-overlay" });

  if (positioned.length >= 2) {
    const points = positioned
      .map((entry) => `${entry.worldX.toFixed(1)},${entry.worldY.toFixed(1)}`)
      .join(" ");
    group.appendChild(createSvgNode("polyline", { class: "trace-passage-path-glow", points }));
    group.appendChild(createSvgNode("polyline", { class: "trace-passage-path", points }));
  }

  const lastIndex = positioned.length - 1;
  positioned.forEach((entry, index) => {
    const issueNumber = parseIssueNumber(entry.beacon && entry.beacon.issueNumber);
    const isActive = issueNumber !== null && issueNumber === activeIssue;
    const node = createSvgNode("g", {
      class: `trace-passage-node${isActive ? " is-active" : ""}`,
      transform: `translate(${entry.worldX.toFixed(1)} ${entry.worldY.toFixed(1)})`
    });
    node.appendChild(createSvgNode("circle", { class: "trace-passage-node-glow", r: "11.5" }));
    node.appendChild(createSvgNode("circle", { class: "trace-passage-node-ring", r: "8.1" }));
    node.appendChild(createSvgNode("circle", { class: "trace-passage-node-dot", r: "3.3" }));
    node.appendChild(createSvgNode("circle", { class: "trace-passage-node-active-ring", r: "12.8" }));
    const sequenceLabel = createSvgNode("text", { class: "trace-passage-node-number", x: "0", y: "1" });
    sequenceLabel.textContent = String(index + 1);
    node.appendChild(sequenceLabel);
    group.appendChild(node);

    const endpoint = index === 0 ? "Origin" : (index === lastIndex ? "Newest" : "");
    if (endpoint) {
      const endpointLabel = createSvgNode("text", {
        class: `trace-passage-endpoint-label trace-passage-endpoint-${endpoint.toLowerCase()}`,
        x: (entry.worldX + 10.5).toFixed(1),
        y: (entry.worldY - 10.5).toFixed(1)
      });
      endpointLabel.textContent = endpoint;
      group.appendChild(endpointLabel);
    }
  });

  el.tracePassageLayer.replaceChildren(group);
}

function renderTracePassagePanel() {
  if (!el.tracePassage) return;
  if (!state.tracePassageEnabled) {
    el.tracePassage.innerHTML = `
      <p>Trace Passage is hidden. Re-enable it in Controls to map public-beacon arrival order.</p>
      <p>Trace Passage links public beacons and drift signals by arrival time.</p>
    `;
    return;
  }

  const sequence = getTracePassageBeacons();
  if (sequence.length === 0) {
    el.tracePassage.innerHTML = "<p class=\"small\">Trace Passage will appear once public beacons load.</p>";
    return;
  }

  const oldest = sequence[0];
  const newest = sequence[sequence.length - 1];
  const oldestTime = formatShortTimestamp(oldest && oldest.createdAt);
  const newestTime = formatShortTimestamp(newest && newest.createdAt);
  const oldestIssue = parseIssueNumber(oldest && oldest.issueNumber);
  const newestIssue = parseIssueNumber(newest && newest.issueNumber);
  const oldestLabel = `${oldestIssue === null ? "issue unknown" : `issue #${oldestIssue}`}${oldestTime ? ` · ${oldestTime}` : ""}`;
  const newestLabel = `${newestIssue === null ? "issue unknown" : `issue #${newestIssue}`}${newestTime ? ` · ${newestTime}` : ""}`;
  const oldestTs = parseCreatedAt(oldest && oldest.createdAt);
  const newestTs = parseCreatedAt(newest && newest.createdAt);
  const spanMs = oldestTs === null || newestTs === null ? 0 : Math.max(0, newestTs - oldestTs);
  const regionCount = new Set(sequence.map((beacon) => String(beacon.region || "Unknown region"))).size;
  const driftCount = sequence.filter((beacon) => beacon && beacon.isDriftSignal).length;
  const activeIssue = parseIssueNumber(state.activeTrace && state.activeTrace.issueNumber);
  const listHtml = `
    <div class="trace-passage-list">
      ${sequence.map((beacon, index) => {
        const issueNumber = parseIssueNumber(beacon && beacon.issueNumber);
        const timestamp = formatShortTimestamp(beacon && beacon.createdAt);
        const isActive = issueNumber !== null && issueNumber === activeIssue;
        const secondary = [
          escapeHtml(beacon && beacon.visitor ? beacon.visitor : "Unknown"),
          issueNumber === null ? "Issue unknown" : `issue #${issueNumber}`,
          escapeHtml(beacon && beacon.region ? beacon.region : "Unknown region"),
          timestamp ? escapeHtml(timestamp) : "",
          beacon && beacon.isDriftSignal ? "Drift signal" : ""
        ].filter(Boolean).join(" · ");
        return `
          <button type="button" class="trace-passage-item${isActive ? " is-active" : ""}" data-trace-passage-issue="${issueNumber === null ? "" : issueNumber}">
            <strong>${index + 1}. ${escapeHtml(beacon && beacon.title ? beacon.title : "Untitled trace")}</strong>
            <span>${secondary}</span>
          </button>
        `;
      }).join("")}
    </div>
  `;
  const actionsHtml = `
    <div class="trace-passage-actions">
      <button type="button" class="trace-passage-action" data-trace-passage-action="center-passage">Center on passage</button>
      <button type="button" class="trace-passage-action" data-trace-passage-action="jump-newest">Jump to newest trace</button>
    </div>
  `;
  const metaHtml = `
    <div class="trace-passage-meta">
      <span class="trace-passage-pill">Total traces: ${sequence.length}</span>
      <span class="trace-passage-pill">Regions crossed: ${regionCount}</span>
      <span class="trace-passage-pill">Drift signals in sequence: ${driftCount}</span>
    </div>
  `;

  if (sequence.length === 1) {
    el.tracePassage.innerHTML = `
      <p class="trace-passage-line">Only one public arrival exists so far, so no route is drawn yet.</p>
      <p class="trace-passage-line">The route waits for a second arrival to extend beyond the origin.</p>
      ${actionsHtml}
      ${metaHtml}
      <p class="small trace-passage-subtitle">Arrival order</p>
      ${listHtml}
    `;
    return;
  }

  el.tracePassage.innerHTML = `
    <p class="trace-passage-line">Trace Passage links public beacons in order of arrival so the map shows how the public record accumulated over time.</p>
    <p class="trace-passage-line">Oldest trace: ${escapeHtml(oldest && oldest.title ? oldest.title : "Untitled trace")} (${escapeHtml(oldestLabel)}) · newest trace: ${escapeHtml(newest && newest.title ? newest.title : "Untitled trace")} (${escapeHtml(newestLabel)}).</p>
    <p class="trace-passage-line">Trace Passage tracks ${sequence.length} total trace(s), crosses ${regionCount} region(s), and spans ${formatTracePassageSpan(spanMs)}.</p>
    ${actionsHtml}
    ${metaHtml}
    <p class="small trace-passage-subtitle">Arrival order</p>
    ${listHtml}
  `;
}

function rankNearbySkiffAnchors(limit = SURVEY_SKIFF_NEARBY_ANCHOR_MAX) {
  if (!state.surveySkiffCoord) return [];
  const sx = Number(state.surveySkiffCoord.x);
  const sy = Number(state.surveySkiffCoord.y);
  if (!Number.isFinite(sx) || !Number.isFinite(sy)) return [];
  return getTraverseNetworkNodes()
    .map((node) => ({
      ...node,
      distance: Math.hypot(sx - Number(node.x), sy - Number(node.y))
    }))
    .filter((node) => Number.isFinite(node.distance))
    .sort((a, b) => a.distance - b.distance || String(a.title || "").localeCompare(String(b.title || "")))
    .slice(0, limit);
}

function discoverEchoesNearSurveySkiff() {
  if (!state.surveySkiffCoord) return false;
  const nearby = findNearbyEchoSites(state.surveySkiffCoord, SIGNAL_SWEEP_RADIUS_PCT);
  let changed = false;
  nearby.forEach((echo) => {
    if (!state.discoveredEchoIds.has(echo.id)) {
      state.discoveredEchoIds.add(echo.id);
      changed = true;
    }
  });
  return changed;
}

function moveSurveySkiffBy(deltaX, deltaY) {
  if (!state.surveySkiffEnabled || !state.surveySkiffCoord) return;
  const nextX = clampPercent(Number(state.surveySkiffCoord.x) + Number(deltaX));
  const nextY = clampPercent(Number(state.surveySkiffCoord.y) + Number(deltaY));
  if (!Number.isFinite(nextX) || !Number.isFinite(nextY)) return;
  if (nextX === state.surveySkiffCoord.x && nextY === state.surveySkiffCoord.y) return;
  state.surveySkiffCoord = { x: nextX, y: nextY };
  appendSurveyWakePoint(state.surveySkiffCoord);
  detectSurveySectorChartingFromCurrentSkiffCoord();
  const discoveredNewEchoes = discoverEchoesNearSurveySkiff();
  detectDriftCurrentEntries({ forceBeaconRunEntry: true });
  detectSignalRelayContacts();
  detectTransitLockCharting();
  updateTriangulationFix({ logOnAnchorChange: true });
  updateApproachRadarScan({ logOnNearestChange: true });
  updateBeaconSounding({ logOnNearestChange: true });
  renderSurveySkiff();
  renderSurveySkiffPanel();
  renderSurveyWake();
  renderSurveyWakePanel();
  refreshTriangulationViews();
  refreshApproachRadarViews();
  refreshBeaconSoundingViews();
  renderSignalRelaysPanel();
  renderDriftCurrentsPanel();
  renderTransitLocksPanel();
  if (discoveredNewEchoes) {
    renderEchoMarkers();
    renderSignalSweepPanel();
  }
}

function isEditableFocusTarget(target) {
  if (!target || !(target instanceof HTMLElement)) return false;
  const tagName = target.tagName;
  if (tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT") return true;
  if (target.isContentEditable) return true;
  return typeof target.closest === "function" && Boolean(target.closest("[contenteditable='true']"));
}

function getSkiffMovementVector(keyValue) {
  const key = String(keyValue || "").toLowerCase();
  if (key === "arrowup" || key === "w") return { dx: 0, dy: -1 };
  if (key === "arrowdown" || key === "s") return { dx: 0, dy: 1 };
  if (key === "arrowleft" || key === "a") return { dx: -1, dy: 0 };
  if (key === "arrowright" || key === "d") return { dx: 1, dy: 0 };
  return null;
}

function activateSkiffAnchorByRef(reference, { dock = false } = {}) {
  const target = getTraverseNetworkNodes().find((node) => node.ref === reference);
  if (!target) return;
  if (dock) {
    state.surveySkiffCoord = { x: Number(target.x), y: Number(target.y) };
    appendSurveyWakePoint(state.surveySkiffCoord, { force: true, dockLabel: target.title || "Untitled anchor" });
    detectSurveySectorChartingFromCurrentSkiffCoord();
    const discoveredNewEchoes = discoverEchoesNearSurveySkiff();
    detectDriftCurrentEntries();
    detectSignalRelayContacts();
    detectTransitLockCharting();
    updateTriangulationFix({ logOnAnchorChange: true });
    updateApproachRadarScan({ logOnNearestChange: true });
    updateBeaconSounding({ logOnNearestChange: true });
    renderSurveySkiff();
    renderSurveySkiffPanel();
    renderSurveyWake();
    renderSurveyWakePanel();
    refreshTriangulationViews();
    refreshApproachRadarViews();
    refreshBeaconSoundingViews();
    renderSignalRelaysPanel();
    renderDriftCurrentsPanel();
    renderTransitLocksPanel();
    if (discoveredNewEchoes) {
      renderEchoMarkers();
      renderSignalSweepPanel();
    }
  }
  activateMarker(target, { focus: true, updateHash: false });
}

function renderSurveySkiff() {
  if (!el.surveySkiffLayer) return;
  el.surveySkiffLayer.innerHTML = "";
  el.surveySkiffLayer.hidden = !state.surveySkiffEnabled;
  if (!state.surveySkiffEnabled || !state.surveySkiffCoord) return;

  const region = classifyRegionAtPercent(state.surveySkiffCoord) || "Unknown region";
  const node = document.createElement("button");
  node.type = "button";
  node.className = "marker marker-skiff";
  node.style.left = `${clampPercent(state.surveySkiffCoord.x)}%`;
  node.style.top = `${clampPercent(state.surveySkiffCoord.y)}%`;
  node.setAttribute(
    "title",
    `Survey Skiff\n${region}\nx ${formatPercentCoord(state.surveySkiffCoord.x)} · y ${formatPercentCoord(state.surveySkiffCoord.y)}`
  );
  node.addEventListener("pointerdown", (ev) => ev.stopPropagation());
  node.addEventListener("pointerup", (ev) => ev.stopPropagation());
  node.addEventListener("click", (ev) => {
    ev.stopPropagation();
    centerViewportOnPercentCoord(state.surveySkiffCoord);
  });
  el.surveySkiffLayer.appendChild(node);
}

function renderSurveySkiffPanel() {
  if (!el.surveySkiff) return;

  if (!state.surveySkiffEnabled) {
    el.surveySkiff.innerHTML = `
      <p>Survey Skiff is offline. Re-enable it in Controls to relaunch the movable survey craft.</p>
      <p>Use arrow keys or WASD when the skiff is online.</p>
    `;
    refreshSurveyGridViews();
    return;
  }

  const coord = state.surveySkiffCoord || { x: 0, y: 0 };
  const region = classifyRegionAtPercent(coord) || "Unknown region";
  const nearby = rankNearbySkiffAnchors(SURVEY_SKIFF_NEARBY_ANCHOR_MAX);
  const nearest = nearby[0] || null;

  const nearestLine = nearest
    ? `Nearest route anchor: ${escapeHtml(nearest.title || "Untitled anchor")} (${formatPercentCoord(nearest.distance)} away)`
    : "Nearest route anchor: No route anchors are currently available.";
  const nearbyHtml = nearby.length > 0
    ? `
      <div class="skiff-anchor-list">
        ${nearby.map((node) => `
          <button type="button" class="skiff-anchor-item" data-skiff-action="anchor" data-skiff-anchor-ref="${escapeHtml(node.ref)}">
            <strong>${escapeHtml(node.title || "Untitled anchor")}</strong>
            <span>${escapeHtml(node.region || "Unknown region")} · ${escapeHtml(node.type === "lattice" ? "Traverse station" : node.type === "echo" ? "Echo site" : "Landmark")}</span>
            <span>${formatPercentCoord(node.distance)} away</span>
          </button>
        `).join("")}
      </div>
    `
    : '<p class="small">No nearby anchors are available from the traverse network right now.</p>';

  el.surveySkiff.innerHTML = `
    <p class="skiff-line">Survey Skiff online.</p>
    <p class="skiff-line">Pilot the skiff with arrow keys or WASD. Hold Shift for longer steps.</p>
    <div class="skiff-meta">
      <span class="skiff-pill">Region: ${escapeHtml(region)}</span>
      <span class="skiff-pill">x: ${formatPercentCoord(coord.x)}</span>
      <span class="skiff-pill">y: ${formatPercentCoord(coord.y)}</span>
    </div>
    <p class="skiff-nearest">${nearestLine}</p>
    <div class="skiff-actions">
      <button type="button" class="skiff-action" data-skiff-action="center">Center on skiff</button>
      <button type="button" class="skiff-action" data-skiff-action="dock-nearest" ${nearest ? "" : "disabled"}>Dock to nearest anchor</button>
    </div>
    <p class="small skiff-subtitle">Nearby anchors</p>
    ${nearbyHtml}
  `;
  refreshSurveyGridViews();
}

function toWorldCoords(marker) {
  return {
    x: (Number(marker.x) / 100) * MAP_W,
    y: (Number(marker.y) / 100) * MAP_H
  };
}

function renderTraverseLattice() {
  if (!el.traverseLatticeLayer) return;

  el.traverseLatticeLayer.style.display = state.traverseLatticeEnabled ? "block" : "none";
  if (!state.traverseLatticeEnabled) {
    el.traverseLatticeLayer.replaceChildren();
    return;
  }

  const links = getResolvedLatticeLinks();
  const group = createSvgNode("g", { class: "traverse-lattice" });

  links.forEach((link) => {
    const from = toWorldCoords(link.from);
    const to = toWorldCoords(link.to);
    group.appendChild(createSvgNode("line", {
      class: "traverse-lattice-link",
      x1: from.x.toFixed(1),
      y1: from.y.toFixed(1),
      x2: to.x.toFixed(1),
      y2: to.y.toFixed(1)
    }));
  });

  const active = state.activeTrace;
  const activeNode = resolveBuiltinNodeFromTrace(active);
  if (activeNode) {
    const activeRef = markerRef(activeNode);
    const connectedLinks = links.filter((link) => link.fromRef === activeRef || link.toRef === activeRef);
    if (connectedLinks.length > 0) {
      const endpointNodes = new Map();
      endpointNodes.set(activeRef, activeNode);
      connectedLinks.forEach((link) => {
        const from = toWorldCoords(link.from);
        const to = toWorldCoords(link.to);
        endpointNodes.set(link.fromRef, link.from);
        endpointNodes.set(link.toRef, link.to);
        group.appendChild(createSvgNode("line", {
          class: "traverse-lattice-link-active",
          x1: from.x.toFixed(1),
          y1: from.y.toFixed(1),
          x2: to.x.toFixed(1),
          y2: to.y.toFixed(1)
        }));
      });
      endpointNodes.forEach((node) => {
        const point = toWorldCoords(node);
        group.appendChild(createSvgNode("circle", {
          class: "traverse-lattice-endpoint-glow",
          cx: point.x.toFixed(1),
          cy: point.y.toFixed(1),
          r: "6.2"
        }));
      });
    }
  } else if (active && active.type === "beacon") {
    const beaconPoint = toWorldCoords(active);
    rankBeaconEntryCandidates(active, 3).forEach((entry) => {
      const nodePoint = toWorldCoords(entry);
      group.appendChild(createSvgNode("line", {
        class: "traverse-lattice-tether",
        x1: beaconPoint.x.toFixed(1),
        y1: beaconPoint.y.toFixed(1),
        x2: nodePoint.x.toFixed(1),
        y2: nodePoint.y.toFixed(1)
      }));
      group.appendChild(createSvgNode("circle", {
        class: "traverse-lattice-endpoint-glow is-tether",
        cx: nodePoint.x.toFixed(1),
        cy: nodePoint.y.toFixed(1),
        r: "4.8"
      }));
    });
  }

  el.traverseLatticeLayer.replaceChildren(group);
}

function renderTraverseLatticePanel() {
  if (!el.traverseLattice) return;

  if (!state.traverseLatticeEnabled) {
    el.traverseLattice.innerHTML = `
      <p class="small">Traverse Lattice is disabled. Re-enable it in Controls to reveal the built-in route network.</p>
      <p class="small">6 interstitial stations are available when the lattice is online.</p>
    `;
    return;
  }

  const active = state.activeTrace;
  if (!active) {
    el.traverseLattice.innerHTML = "<p class=\"small lattice-copy\">Select a landmark, echo site, lattice station, or visitor beacon to inspect traverse routes.</p>";
    return;
  }

  const actionTargets = {};
  const renderRouteButtons = (nodes) => {
    if (!nodes || nodes.length === 0) return '<p class="small lattice-copy">No direct routes are currently resolved for this trace.</p>';
    return `
      <div class="lattice-route-list">
        ${nodes.map((node, index) => {
          actionTargets[String(index)] = node;
          return `<button type="button" class="lattice-route-item" data-lattice-route-index="${index}">${escapeHtml(node.title || "Untitled node")}<span>${escapeHtml(node.region || "Unknown region")} · ${escapeHtml(node.type === "lattice" ? "Traverse station" : node.type === "echo" ? "Echo site" : "Landmark")}</span></button>`;
        }).join("")}
      </div>
    `;
  };

  const resolved = resolveBuiltinNodeFromTrace(active);
  const resolvedRef = markerRef(resolved);
  if (active.type === "lattice" && resolved) {
    const connected = getDirectTraverseConnections(resolvedRef);
    el.traverseLattice.innerHTML = `
      <h3>${escapeHtml(resolved.title)}</h3>
      <div class="lattice-meta">
        <span class="lattice-pill">${escapeHtml(resolved.region || "Unknown region")}</span>
        <span class="lattice-pill">${escapeHtml(resolved.corridor || "Corridor unknown")}</span>
      </div>
      <p class="lattice-copy">${escapeHtml(resolved.note || "")}</p>
      <p class="small lattice-copy">Connected routes</p>
      ${renderRouteButtons(connected)}
    `;
  } else if (resolved && (active.type === "landmark" || active.type === "echo")) {
    const connected = getDirectTraverseConnections(resolvedRef);
    if (connected.length === 0) {
      el.traverseLattice.innerHTML = "<p class=\"small lattice-copy\">This built-in trace is outside the current traverse lattice links.</p>";
    } else {
      el.traverseLattice.innerHTML = `
        <p class="small lattice-copy">This trace sits on the traverse lattice and connects directly into nearby built-in routes.</p>
        ${renderRouteButtons(connected)}
      `;
    }
  } else if (active.type === "beacon") {
    const candidates = rankBeaconEntryCandidates(active, 3);
    el.traverseLattice.innerHTML = `
      <p class="small lattice-copy">Visitor beacons can enter the built-in lattice through nearby anchor points.</p>
      ${renderRouteButtons(candidates)}
      <p class="small lattice-copy">Entry candidates are ranked by region match and map distance.</p>
    `;
  } else {
    el.traverseLattice.innerHTML = "<p class=\"small lattice-copy\">This built-in trace is outside the current traverse lattice links.</p>";
  }

  el.traverseLattice.querySelectorAll("[data-lattice-route-index]").forEach((node) => {
    node.addEventListener("click", () => {
      const target = actionTargets[String(node.dataset.latticeRouteIndex)];
      if (!target) return;
      activateMarker(target, { focus: true, updateHash: target.type === "landmark" });
    });
  });
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

function renderSignalSweepOverlay() {
  if (!el.signalSweepLayer) return;

  const shouldShow = state.sweepEnabled && state.sweepPointerActive && state.sweepCoord;
  if (!shouldShow) {
    el.signalSweepLayer.replaceChildren();
    return;
  }

  const centerX = (Number(state.sweepCoord.x) / 100) * MAP_W;
  const centerY = (Number(state.sweepCoord.y) / 100) * MAP_H;
  const radius = (SIGNAL_SWEEP_RADIUS_PCT / 100) * Math.min(MAP_W, MAP_H);
  const group = createSvgNode("g", {
    class: "signal-sweep"
  });
  group.appendChild(createSvgNode("circle", {
    class: "signal-sweep-glow",
    cx: centerX.toFixed(1),
    cy: centerY.toFixed(1),
    r: (radius * 1.32).toFixed(1)
  }));
  group.appendChild(createSvgNode("circle", {
    class: "signal-sweep-ring",
    cx: centerX.toFixed(1),
    cy: centerY.toFixed(1),
    r: radius.toFixed(1)
  }));
  group.appendChild(createSvgNode("circle", {
    class: "signal-sweep-core",
    cx: centerX.toFixed(1),
    cy: centerY.toFixed(1),
    r: "3.2"
  }));
  el.signalSweepLayer.replaceChildren(group);
}

function activateEchoSiteById(id) {
  const echo = ECHO_SITES.find((site) => site.id === id);
  if (!echo) return;
  state.discoveredEchoIds.add(echo.id);
  activateMarker({ ...echo, type: "echo" }, { focus: true, updateHash: false });
  renderEchoMarkers();
  renderSignalSweepPanel();
}

function renderSignalSweepPanel() {
  if (!el.signalSweep) return;

  if (!state.sweepEnabled) {
    el.signalSweep.innerHTML = `
      <p class="small">Signal Sweep is disabled. Re-enable it in Controls to resume scanning for built-in echo sites.</p>
      <p class="small">Discovered ${state.discoveredEchoIds.size} of ${ECHO_SITES.length} echo sites.</p>
    `;
    return;
  }

  const coord = state.sweepCoord;
  const region = classifyRegionAtPercent(coord) || "Unknown region";
  const discoveredCount = state.discoveredEchoIds.size;
  const nearby = (state.nearbyEchoes || []).slice(0, SIGNAL_SWEEP_NEARBY_MAX);
  const coordLine = coord
    ? `x ${formatPercentCoord(coord.x)} · y ${formatPercentCoord(coord.y)}`
    : "Awaiting sweep position";
  const nearbyHtml = nearby.length > 0
    ? `
      <div class="sweep-nearby-list">
        ${nearby.map((echo, index) => `
          <button type="button" class="sweep-nearby-item" data-echo-nearby-index="${index}">
            <strong>${escapeHtml(echo.title)}</strong>
            <span>${escapeHtml(echo.region)}</span>
            <span>${escapeHtml(String(echo.note || "").slice(0, 92))}${echo.note && echo.note.length > 92 ? "..." : ""}</span>
          </button>
        `).join("")}
      </div>
    `
    : '<p class="small sweep-hint">No echo contacts in this sweep radius. Drift along region edges and route intersections to locate dormant traces.</p>';

  el.signalSweep.innerHTML = `
    <p class="sweep-readout"><span class="sweep-pill">Coordinates: ${coordLine}</span></p>
    <p class="sweep-readout"><span class="sweep-pill">Region: ${escapeHtml(region)}</span></p>
    <p class="small">Discovered ${discoveredCount} of ${ECHO_SITES.length} echo sites.</p>
    ${nearbyHtml}
  `;

  el.signalSweep.querySelectorAll("[data-echo-nearby-index]").forEach((node) => {
    node.addEventListener("click", () => {
      const index = Number(node.dataset.echoNearbyIndex);
      const echo = nearby[index];
      if (!echo) return;
      activateEchoSiteById(echo.id);
    });
  });
}

function refreshSignalSweepAt(coord, pointerActive) {
  if (!state.sweepEnabled) return;
  state.sweepPointerActive = Boolean(pointerActive);
  if (coord) {
    state.sweepCoord = { x: Number(coord.x), y: Number(coord.y) };
  }
  state.nearbyEchoes = state.sweepCoord ? findNearbyEchoSites(state.sweepCoord) : [];
  state.nearbyEchoes.forEach((echo) => state.discoveredEchoIds.add(echo.id));
  renderEchoMarkers();
  renderSignalSweepOverlay();
  renderSignalSweepPanel();
}

function computeDriftSignalBerth(issueNumber) {
  const parsedIssueNumber = Math.max(1, parseIssueNumber(issueNumber) || 1);
  const berthIndex = (parsedIssueNumber - 1) % DRIFT_SIGNAL_BASE_BERTHS.length;
  const laneIndex = Math.floor((parsedIssueNumber - 1) / DRIFT_SIGNAL_BASE_BERTHS.length) % DRIFT_SIGNAL_LANE_OFFSETS.length;
  const base = DRIFT_SIGNAL_BASE_BERTHS[berthIndex];
  const offset = DRIFT_SIGNAL_LANE_OFFSETS[laneIndex];
  return {
    x: Math.max(4, Math.min(96, Number(base.x) + Number(offset.x))),
    y: Math.max(4, Math.min(96, Number(base.y) + Number(offset.y)))
  };
}

function stripBeaconPrefix(title) {
  return String(title || "").replace(/^\s*\[\s*beacon\s*]\s*/i, "").trim();
}

function extractFirstUrl(text) {
  const match = String(text || "").match(/https?:\/\/[^\s<>()"']+/i);
  return match ? match[0] : "";
}

function toPlainExcerpt(text) {
  const cleaned = String(text || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/^#+\s*/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/g, "$1")
    .replace(/https?:\/\/[^\s<>()"']+/g, " ")
    .replace(/\r/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return "";
  return cleaned.length > 280 ? `${cleaned.slice(0, 280).trimEnd()}...` : cleaned;
}

function normalizeDriftSignalIssue(issue) {
  const berth = computeDriftSignalBerth(issue && issue.number);
  const title = stripBeaconPrefix(issue && issue.title) || "Untitled beacon";
  const body = String((issue && issue.body) || "");
  return {
    ...berth,
    title: title.slice(0, 80),
    note: toPlainExcerpt(body),
    evidence: extractFirstUrl(body),
    revision: "",
    region: classifyRegionAtPercent(berth) || "Beacon Field",
    color: "#ffb066",
    visitor: (issue && issue.user && issue.user.login) ? String(issue.user.login) : "Unknown",
    issueUrl: issue && issue.html_url,
    issueNumber: issue && issue.number,
    createdAt: issue && issue.created_at,
    isDriftSignal: true,
    driftReason: "Missing x/y coordinates"
  };
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
      if (!parsed) {
        return normalizeDriftSignalIssue(issue);
      }
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

function isPointerInsideViewport(clientX, clientY) {
  const rect = el.viewport.getBoundingClientRect();
  return (
    clientX >= rect.left &&
    clientX <= rect.right &&
    clientY >= rect.top &&
    clientY <= rect.bottom
  );
}

function initInteractions() {
  let copyBtnResetTimer = null;

  recenter();
  restoreLedgerFiltersFromUrl();
  syncLedgerUrlState();
  state.sweepEnabled = !el.toggleSignalSweep || el.toggleSignalSweep.checked;
  state.traverseLatticeEnabled = !el.toggleTraverseLattice || el.toggleTraverseLattice.checked;
  state.surveySkiffEnabled = !el.toggleSurveySkiff || el.toggleSurveySkiff.checked;
  state.surveyWakeEnabled = !el.toggleSurveyWake || el.toggleSurveyWake.checked;
  state.surveyGridEnabled = !el.toggleSurveyGrid || el.toggleSurveyGrid.checked;
  state.triangulationEnabled = !el.toggleTriangulation || el.toggleTriangulation.checked;
  state.approachRadarEnabled = !el.toggleApproachRadar || el.toggleApproachRadar.checked;
  state.beaconSoundingsEnabled = !el.toggleBeaconSoundings || el.toggleBeaconSoundings.checked;
  state.tracePassageEnabled = !el.toggleTracePassage || el.toggleTracePassage.checked;
  state.witnessThreadsEnabled = !el.toggleWitnessThreads || el.toggleWitnessThreads.checked;
  state.signalRelaysEnabled = !el.toggleSignalRelays || el.toggleSignalRelays.checked;
  state.driftCurrentsEnabled = !el.toggleDriftCurrents || el.toggleDriftCurrents.checked;
  state.transitLocksEnabled = !el.toggleTransitLocks || el.toggleTransitLocks.checked;
  state.surveyWakePoints = [{ x: clampPercent(state.surveySkiffCoord.x), y: clampPercent(state.surveySkiffCoord.y) }];
  state.surveyWakeMilestones = [];
  detectSurveySectorChartingFromCurrentSkiffCoord();
  detectDriftCurrentEntries({ forceBeaconRunEntry: true });
  detectSignalRelayContacts();
  detectTransitLockCharting();
  updateTriangulationFix({ seedLogIfEmpty: true });
  updateApproachRadarScan({ seedLogIfEmpty: true });
  updateBeaconSounding({ seedLogIfEmpty: true });
  renderSignalSweepPanel();
  renderTraverseLatticePanel();
  renderSurveySkiff();
  renderSurveySkiffPanel();
  renderSurveyWake();
  renderSurveyWakePanel();
  renderSurveyGridOverlay();
  renderSurveyGridPanel();
  renderTriangulationOverlay();
  renderTriangulationPanel();
  renderApproachRadarOverlay();
  renderApproachRadarPanel();
  renderBeaconSoundingOverlay();
  renderBeaconSoundingPanel();
  renderDriftSignalOverlay();
  renderDriftSignalsPanel();
  renderWitnessThreadsOverlay();
  renderWitnessThreadsPanel();
  renderTracePassageOverlay();
  renderTracePassagePanel();
  renderRelayMarkers();
  renderCurrentMarkers();
  renderTransitLockMarkers();
  renderDriftCurrentOverlay();
  renderSignalRelayOverlay();
  renderTransitLockOverlay();
  renderSignalRelaysPanel();
  renderDriftCurrentsPanel();
  renderTransitLocksPanel();

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
    if (state.sweepEnabled) {
      const percent = worldToPercent(screenToWorld(ev.clientX, ev.clientY));
      refreshSignalSweepAt(percent, true);
    }
    el.viewport.setPointerCapture(ev.pointerId);
  });

  el.viewport.addEventListener("pointermove", (ev) => {
    if (state.sweepEnabled) {
      const pointerInside = isPointerInsideViewport(ev.clientX, ev.clientY);
      if (pointerInside) {
        const percent = worldToPercent(screenToWorld(ev.clientX, ev.clientY));
        refreshSignalSweepAt(percent, true);
      } else if (!state.dragging) {
        refreshSignalSweepAt(null, false);
      }
    }

    if (state.dragging) {
      state.tx += ev.clientX - state.dragStartX;
      state.ty += ev.clientY - state.dragStartY;
      state.dragStartX = ev.clientX;
      state.dragStartY = ev.clientY;
      setTransform();
    }
  });

  el.viewport.addEventListener("pointerup", (ev) => {
    const moved = Math.abs(ev.clientX - state.downX) + Math.abs(ev.clientY - state.downY);
    state.dragging = false;
    if (moved < 4) {
      const world = screenToWorld(ev.clientX, ev.clientY);
      const percent = worldToPercent(world);
      setSelectedCoord(percent.x, percent.y);
    }
    if (state.sweepEnabled) {
      if (isPointerInsideViewport(ev.clientX, ev.clientY)) {
        const percent = worldToPercent(screenToWorld(ev.clientX, ev.clientY));
        refreshSignalSweepAt(percent, true);
      } else {
        refreshSignalSweepAt(null, false);
      }
    }
  });

  el.viewport.addEventListener("pointercancel", () => {
    state.dragging = false;
    if (state.sweepEnabled) {
      refreshSignalSweepAt(null, false);
    }
  });

  el.viewport.addEventListener("pointerleave", () => {
    if (!state.dragging && state.sweepEnabled) {
      refreshSignalSweepAt(null, false);
    }
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
    renderDriftSignalOverlay();
  });

  if (el.toggleVerificationRoute) {
    el.toggleVerificationRoute.addEventListener("change", renderVerificationRoute);
  }

  if (el.toggleSignalSweep) {
    el.toggleSignalSweep.addEventListener("change", () => {
      state.sweepEnabled = el.toggleSignalSweep.checked;
      if (!state.sweepEnabled) {
        state.sweepPointerActive = false;
        state.sweepCoord = null;
        state.nearbyEchoes = [];
      }
      renderEchoMarkers();
      renderSignalSweepOverlay();
      renderSignalSweepPanel();
    });
  }

  if (el.toggleTraverseLattice) {
    el.toggleTraverseLattice.addEventListener("change", () => {
      state.traverseLatticeEnabled = el.toggleTraverseLattice.checked;
      renderLatticeMarkers();
      renderTraverseLattice();
      renderTraverseLatticePanel();
      renderSurveySkiffPanel();
      refreshApproachRadarViews();
    });
  }

  if (el.toggleSurveySkiff) {
    el.toggleSurveySkiff.addEventListener("change", () => {
      state.surveySkiffEnabled = el.toggleSurveySkiff.checked;
      updateTriangulationFix();
      updateApproachRadarScan({ seedLogIfEmpty: true });
      updateBeaconSounding({ seedLogIfEmpty: true });
      renderSurveySkiff();
      renderSurveySkiffPanel();
      refreshTriangulationViews();
      refreshApproachRadarViews();
      refreshBeaconSoundingViews();
    });
  }

  if (el.toggleSurveyWake) {
    el.toggleSurveyWake.addEventListener("change", () => {
      state.surveyWakeEnabled = el.toggleSurveyWake.checked;
      renderSurveyWake();
      renderSurveyWakePanel();
    });
  }

  if (el.toggleSurveyGrid) {
    el.toggleSurveyGrid.addEventListener("change", () => {
      state.surveyGridEnabled = el.toggleSurveyGrid.checked;
      renderSurveyGridOverlay();
      renderSurveyGridPanel();
    });
  }

  if (el.toggleTriangulation) {
    el.toggleTriangulation.addEventListener("change", () => {
      state.triangulationEnabled = el.toggleTriangulation.checked;
      renderTriangulationOverlay();
      renderTriangulationPanel();
    });
  }

  if (el.toggleApproachRadar) {
    el.toggleApproachRadar.addEventListener("change", () => {
      state.approachRadarEnabled = el.toggleApproachRadar.checked;
      if (state.approachRadarEnabled) {
        updateApproachRadarScan({ seedLogIfEmpty: true });
      }
      refreshApproachRadarViews();
    });
  }

  if (el.toggleBeaconSoundings) {
    el.toggleBeaconSoundings.addEventListener("change", () => {
      state.beaconSoundingsEnabled = el.toggleBeaconSoundings.checked;
      if (state.beaconSoundingsEnabled) {
        updateBeaconSounding({ seedLogIfEmpty: true });
      }
      refreshBeaconSoundingViews();
    });
  }

  if (el.toggleTracePassage) {
    el.toggleTracePassage.addEventListener("change", () => {
      state.tracePassageEnabled = el.toggleTracePassage.checked;
      renderTracePassageOverlay();
      renderTracePassagePanel();
    });
  }

  if (el.toggleWitnessThreads) {
    el.toggleWitnessThreads.addEventListener("change", () => {
      state.witnessThreadsEnabled = el.toggleWitnessThreads.checked;
      renderWitnessThreadsOverlay();
      renderWitnessThreadsPanel();
    });
  }

  if (el.toggleSignalRelays) {
    el.toggleSignalRelays.addEventListener("change", () => {
      state.signalRelaysEnabled = el.toggleSignalRelays.checked;
      renderRelayMarkers();
      renderSignalRelayOverlay();
      renderSignalRelaysPanel();
      refreshApproachRadarViews();
    });
  }

  if (el.toggleDriftCurrents) {
    el.toggleDriftCurrents.addEventListener("change", () => {
      state.driftCurrentsEnabled = el.toggleDriftCurrents.checked;
      renderCurrentMarkers();
      renderDriftCurrentOverlay();
      renderDriftCurrentsPanel();
      refreshApproachRadarViews();
    });
  }

  if (el.toggleTransitLocks) {
    el.toggleTransitLocks.addEventListener("change", () => {
      state.transitLocksEnabled = el.toggleTransitLocks.checked;
      renderTransitLockMarkers();
      renderTransitLockOverlay();
      renderTransitLocksPanel();
      refreshApproachRadarViews();
    });
  }

  document.addEventListener("keydown", (ev) => {
    if (!state.surveySkiffEnabled) return;
    if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
    if (isEditableFocusTarget(document.activeElement)) return;
    const vector = getSkiffMovementVector(ev.key);
    if (!vector) return;
    ev.preventDefault();
    const step = ev.shiftKey ? SURVEY_SKIFF_SHIFT_STEP_PCT : SURVEY_SKIFF_STEP_PCT;
    moveSurveySkiffBy(vector.dx * step, vector.dy * step);
  });

  if (el.surveySkiff) {
    el.surveySkiff.addEventListener("click", (ev) => {
      const actionNode = ev.target instanceof Element ? ev.target.closest("[data-skiff-action]") : null;
      if (!actionNode) return;
      const action = actionNode.getAttribute("data-skiff-action");
      if (!action || (actionNode instanceof HTMLButtonElement && actionNode.disabled)) return;
      if (action === "center") {
        centerViewportOnPercentCoord(state.surveySkiffCoord);
        return;
      }
      if (action === "dock-nearest") {
        const nearest = rankNearbySkiffAnchors(1)[0];
        if (!nearest) return;
        activateSkiffAnchorByRef(nearest.ref, { dock: true });
        return;
      }
      if (action === "anchor") {
        const reference = actionNode.getAttribute("data-skiff-anchor-ref");
        if (!reference) return;
        activateSkiffAnchorByRef(reference, { dock: false });
      }
    });
  }

  if (el.surveyWake) {
    el.surveyWake.addEventListener("click", (ev) => {
      const actionNode = ev.target instanceof Element ? ev.target.closest("[data-wake-action], [data-wake-milestone-index]") : null;
      if (!actionNode) return;

      const milestoneIndexValue = actionNode.getAttribute("data-wake-milestone-index");
      if (milestoneIndexValue !== null) {
        const milestone = state.surveyWakeMilestones[Number(milestoneIndexValue)];
        if (!milestone) return;
        centerViewportOnPercentCoord({ x: milestone.x, y: milestone.y });
        return;
      }

      const action = actionNode.getAttribute("data-wake-action");
      if (!action || (actionNode instanceof HTMLButtonElement && actionNode.disabled)) return;
      if (action === "center") {
        const points = Array.isArray(state.surveyWakePoints) ? state.surveyWakePoints : [];
        if (points.length === 0) return;
        const center = points.reduce(
          (acc, point) => ({ x: acc.x + Number(point.x), y: acc.y + Number(point.y) }),
          { x: 0, y: 0 }
        );
        centerViewportOnPercentCoord({
          x: center.x / points.length,
          y: center.y / points.length
        });
        return;
      }
      if (action === "clear") {
        const origin = {
          x: clampPercent(state.surveySkiffCoord && state.surveySkiffCoord.x),
          y: clampPercent(state.surveySkiffCoord && state.surveySkiffCoord.y)
        };
        state.surveyWakePoints = [origin];
        state.surveyWakeMilestones = [];
        renderSurveyWake();
        renderSurveyWakePanel();
      }
    });
  }

  if (el.surveyGrid) {
    el.surveyGrid.addEventListener("click", (ev) => {
      const actionNode = ev.target instanceof Element ? ev.target.closest("[data-survey-grid-action], [data-survey-sector-id]") : null;
      if (!actionNode) return;

      const sectorId = actionNode.getAttribute("data-survey-sector-id");
      if (sectorId) {
        const sector = buildSurveyGridSectors(state.surveySkiffCoord).find((entry) => entry.id === sectorId);
        if (!sector) return;
        centerViewportOnPercentCoord({ x: sector.centerX, y: sector.centerY }, { scale: state.scale });
        return;
      }

      const action = actionNode.getAttribute("data-survey-grid-action");
      if (!action || (actionNode instanceof HTMLButtonElement && actionNode.disabled)) return;
      if (action === "center-current") {
        centerViewportOnCurrentSurveySector();
        return;
      }
      if (action === "center-charted") {
        centerViewportOnChartedSurveySectors();
      }
    });
  }

  if (el.triangulation) {
    el.triangulation.addEventListener("click", (ev) => {
      const actionNode = ev.target instanceof Element
        ? ev.target.closest("[data-triangulation-action], [data-triangulation-anchor-ref], [data-triangulation-log-index]")
        : null;
      if (!actionNode) return;

      const anchorRef = actionNode.getAttribute("data-triangulation-anchor-ref");
      if (anchorRef) {
        activateSkiffAnchorByRef(anchorRef, { dock: false });
        return;
      }

      const logIndex = actionNode.getAttribute("data-triangulation-log-index");
      if (logIndex !== null) {
        const entry = state.triangulationLog[Number(logIndex)];
        if (!entry || !entry.centroid) return;
        centerViewportOnPercentCoord(entry.centroid, { scale: state.scale });
        return;
      }

      const action = actionNode.getAttribute("data-triangulation-action");
      if (!action || (actionNode instanceof HTMLButtonElement && actionNode.disabled)) return;
      if (action === "center-fix") {
        const fix = state.currentTriangulationFix;
        if (!fix || !fix.centroid) return;
        centerViewportOnPercentCoord(fix.centroid, { scale: state.scale });
        return;
      }
      if (action === "center-skiff" && state.surveySkiffCoord) {
        centerViewportOnPercentCoord(state.surveySkiffCoord, { scale: state.scale });
      }
    });
  }

  if (el.approachRadar) {
    el.approachRadar.addEventListener("click", (ev) => {
      const actionNode = ev.target instanceof Element
        ? ev.target.closest("[data-approach-radar-action], [data-approach-radar-ref], [data-approach-radar-log-index]")
        : null;
      if (!actionNode) return;

      const targetRef = actionNode.getAttribute("data-approach-radar-ref");
      if (targetRef) {
        const targetType = actionNode.getAttribute("data-approach-radar-type");
        const scan = state.currentApproachRadarScan;
        const target = scan && Array.isArray(scan.rankedTargets)
          ? scan.rankedTargets.find((entry) => entry.ref === targetRef && (!targetType || entry.type === targetType))
          : null;
        if (!target) return;
        activateApproachRadarTarget(target);
        return;
      }

      const logIndex = actionNode.getAttribute("data-approach-radar-log-index");
      if (logIndex !== null) {
        const entry = state.approachRadarLog[Number(logIndex)];
        if (!entry) return;
        const coord = entry.targetCoord || entry.skiffCoord || state.surveySkiffCoord;
        if (!coord) return;
        centerViewportOnPercentCoord(coord, { scale: state.scale });
        return;
      }

      const action = actionNode.getAttribute("data-approach-radar-action");
      if (!action || (actionNode instanceof HTMLButtonElement && actionNode.disabled)) return;
      if (action === "center-radar") {
        centerViewportOnApproachRadar();
        return;
      }
      if (action === "center-skiff" && state.surveySkiffCoord) {
        centerViewportOnPercentCoord(state.surveySkiffCoord, { scale: state.scale });
      }
    });
  }

  if (el.beaconSoundings) {
    el.beaconSoundings.addEventListener("click", (ev) => {
      const actionNode = ev.target instanceof Element
        ? ev.target.closest("[data-beacon-sounding-action], [data-beacon-sounding-issue], [data-beacon-sounding-log-index]")
        : null;
      if (!actionNode) return;

      const targetIssueNumber = parseIssueNumber(actionNode.getAttribute("data-beacon-sounding-issue"));
      if (targetIssueNumber !== null) {
        const sounding = state.currentBeaconSounding;
        const target = sounding && Array.isArray(sounding.targets)
          ? sounding.targets.find((entry) => parseIssueNumber(entry.issueNumber) === targetIssueNumber)
          : null;
        if (!target) return;
        activateBeaconSoundingTarget(target);
        return;
      }

      const logIndex = actionNode.getAttribute("data-beacon-sounding-log-index");
      if (logIndex !== null) {
        const entry = state.beaconSoundingLog[Number(logIndex)];
        if (!entry) return;
        const coord = entry.nearestCoord || entry.skiffCoord || state.surveySkiffCoord;
        if (!coord) return;
        centerViewportOnPercentCoord(coord, { scale: state.scale });
        return;
      }

      const action = actionNode.getAttribute("data-beacon-sounding-action");
      if (!action || (actionNode instanceof HTMLButtonElement && actionNode.disabled)) return;
      if (action === "center-soundings") {
        centerViewportOnBeaconSounding();
        return;
      }
      if (action === "center-skiff" && state.surveySkiffCoord) {
        centerViewportOnPercentCoord(state.surveySkiffCoord, { scale: state.scale });
      }
    });
  }

  if (el.driftSignals) {
    el.driftSignals.addEventListener("click", (ev) => {
      const actionNode = ev.target instanceof Element
        ? ev.target.closest("[data-drift-signal-action], [data-drift-signal-issue]")
        : null;
      if (!actionNode) return;

      const issueNumber = parseIssueNumber(actionNode.getAttribute("data-drift-signal-issue"));
      if (issueNumber !== null) {
        const signal = getDriftSignals().find((item) => parseIssueNumber(item.issueNumber) === issueNumber);
        if (!signal) return;
        activateMarker({ ...signal, type: "beacon" }, { focus: true, updateHash: true });
        return;
      }

      const action = actionNode.getAttribute("data-drift-signal-action");
      if (!action || (actionNode instanceof HTMLButtonElement && actionNode.disabled)) return;
      if (action === "center-ring") {
        centerViewportOnDriftSignals();
        return;
      }
      if (action === "open-nearest") {
        openNearestDriftSignalIssue();
      }
    });
  }

  if (el.tracePassage) {
    el.tracePassage.addEventListener("click", (ev) => {
      const actionNode = ev.target instanceof Element
        ? ev.target.closest("[data-trace-passage-action], [data-trace-passage-issue]")
        : null;
      if (!actionNode) return;

      const issueNumber = parseIssueNumber(actionNode.getAttribute("data-trace-passage-issue"));
      if (issueNumber !== null) {
        const beacon = getTracePassageBeacons().find((entry) => parseIssueNumber(entry.issueNumber) === issueNumber);
        if (!beacon) return;
        activateMarker({ ...beacon, type: "beacon" }, { focus: true, updateHash: true });
        return;
      }

      const action = actionNode.getAttribute("data-trace-passage-action");
      if (!action || (actionNode instanceof HTMLButtonElement && actionNode.disabled)) return;
      if (action === "center-passage") {
        centerViewportOnTracePassage();
        return;
      }
      if (action === "jump-newest") {
        jumpToNewestTracePassage();
      }
    });
  }

  if (el.witnessThreads) {
    el.witnessThreads.addEventListener("click", (ev) => {
      const actionNode = ev.target instanceof Element
        ? ev.target.closest("[data-witness-thread-action], [data-witness-thread-visitor]")
        : null;
      if (!actionNode) return;

      const visitorKey = String(actionNode.getAttribute("data-witness-thread-visitor") || "").trim().toLowerCase();
      if (visitorKey) {
        const thread = getWitnessThreads().threads.find((entry) => entry.key === visitorKey);
        if (!thread || !thread.newestBeacon) return;
        activateMarker({ ...thread.newestBeacon, type: "beacon" }, { focus: true, updateHash: true });
        return;
      }

      const action = actionNode.getAttribute("data-witness-thread-action");
      if (!action || (actionNode instanceof HTMLButtonElement && actionNode.disabled)) return;
      if (action === "center-threads") {
        centerViewportOnWitnessThreads();
        return;
      }
      if (action === "jump-longest") {
        jumpToLongestWitnessThread();
      }
    });
  }

  if (el.signalRelays) {
    el.signalRelays.addEventListener("click", (ev) => {
      const actionNode = ev.target instanceof Element ? ev.target.closest("[data-relay-action], [data-relay-id]") : null;
      if (!actionNode) return;

      const relayId = actionNode.getAttribute("data-relay-id");
      if (relayId) {
        const relay = BUILTIN_SIGNAL_RELAYS.find((item) => item.id === relayId);
        if (!relay) return;
        activateMarker(relay, { focus: true, updateHash: false });
        return;
      }

      const action = actionNode.getAttribute("data-relay-action");
      if (!action || (actionNode instanceof HTMLButtonElement && actionNode.disabled)) return;
      if (action === "center-nearest") {
        const nearest = findNearestRelayToCoord(state.surveySkiffCoord);
        if (!nearest) return;
        centerViewportOnPercentCoord(nearest.relay, { scale: state.scale });
        return;
      }
      if (action === "center-contacted") {
        const contacted = BUILTIN_SIGNAL_RELAYS.filter((relay) => state.contactedRelayIds.has(relay.id));
        if (contacted.length === 0) return;
        const center = contacted.reduce(
          (acc, relay) => ({ x: acc.x + Number(relay.x), y: acc.y + Number(relay.y) }),
          { x: 0, y: 0 }
        );
        centerViewportOnPercentCoord({
          x: center.x / contacted.length,
          y: center.y / contacted.length
        }, { scale: state.scale });
      }
    });
  }

  if (el.driftCurrents) {
    el.driftCurrents.addEventListener("click", (ev) => {
      const actionNode = ev.target instanceof Element ? ev.target.closest("[data-current-action], [data-current-id]") : null;
      if (!actionNode) return;

      const currentId = actionNode.getAttribute("data-current-id");
      if (currentId) {
        const current = BUILTIN_DRIFT_CURRENTS.find((item) => item.id === currentId);
        if (!current) return;
        activateMarker(current, { focus: true, updateHash: false });
        return;
      }

      const action = actionNode.getAttribute("data-current-action");
      if (!action || (actionNode instanceof HTMLButtonElement && actionNode.disabled)) return;
      if (action === "center-nearest") {
        const nearest = findNearestCurrentToCoord(state.surveySkiffCoord);
        if (!nearest) return;
        centerViewportOnPercentCoord(nearest.current, { scale: state.scale });
        return;
      }
      if (action === "center-entered") {
        const entered = BUILTIN_DRIFT_CURRENTS.filter((current) => state.enteredCurrentIds.has(current.id));
        if (entered.length === 0) return;
        const center = entered.reduce(
          (acc, current) => ({ x: acc.x + Number(current.x), y: acc.y + Number(current.y) }),
          { x: 0, y: 0 }
        );
        centerViewportOnPercentCoord({
          x: center.x / entered.length,
          y: center.y / entered.length
        }, { scale: state.scale });
      }
    });
  }

  if (el.transitLocks) {
    el.transitLocks.addEventListener("click", (ev) => {
      const actionNode = ev.target instanceof Element ? ev.target.closest("[data-transit-lock-action], [data-transit-lock-id]") : null;
      if (!actionNode) return;

      const lockId = actionNode.getAttribute("data-transit-lock-id");
      if (lockId) {
        const lock = findTransitLockById(lockId);
        if (!lock) return;
        activateMarker(lock, { focus: true, updateHash: false });
        return;
      }

      const action = actionNode.getAttribute("data-transit-lock-action");
      if (!action || (actionNode instanceof HTMLButtonElement && actionNode.disabled)) return;
      if (action === "center-nearest") {
        const nearest = findNearestTransitLockToCoord(state.surveySkiffCoord);
        if (!nearest) return;
        centerViewportOnPercentCoord(nearest.lock, { scale: state.scale });
        return;
      }
      if (action === "center-charted") {
        const charted = BUILTIN_TRANSIT_LOCKS.filter((lock) => state.chartedTransitLockIds.has(lock.id));
        if (charted.length === 0) return;
        const center = charted.reduce(
          (acc, lock) => ({ x: acc.x + Number(lock.x), y: acc.y + Number(lock.y) }),
          { x: 0, y: 0 }
        );
        centerViewportOnPercentCoord({
          x: center.x / charted.length,
          y: center.y / charted.length
        }, { scale: state.scale });
        return;
      }
      if (action === "transit") {
        const sourceLock = getTransitActionSourceLock();
        if (!sourceLock) return;
        transitThroughLock(sourceLock);
      }
    });
  }

  if (el.verificationChain) {
    el.verificationChain.addEventListener("click", (ev) => {
      const actionNode = ev.target instanceof Element ? ev.target.closest("[data-chain-transit-action]") : null;
      if (!actionNode) return;
      const action = actionNode.getAttribute("data-chain-transit-action");
      const lockId = actionNode.getAttribute("data-chain-transit-lock-id");
      const lock = lockId ? findTransitLockById(lockId) : null;
      if (!lock) return;
      if (action === "center") {
        centerViewportOnPercentCoord(lock, { scale: state.scale });
        activateMarker(lock, { focus: false, updateHash: false });
        return;
      }
      if (action === "transit") {
        transitThroughLock(lock);
      }
    });
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
  renderEchoMarkers();
  renderLatticeMarkers();
  renderTraverseLattice();
  renderSignalRelayOverlay();
  renderSignalSweepOverlay();
  renderSignalSweepPanel();
  renderTraverseLatticePanel();
  renderSurveySkiff();
  renderSurveySkiffPanel();
  renderSurveyWake();
  renderSurveyWakePanel();
  renderSurveyGridOverlay();
  renderSurveyGridPanel();
  updateTriangulationFix({ seedLogIfEmpty: true });
  updateApproachRadarScan({ seedLogIfEmpty: true });
  updateBeaconSounding({ seedLogIfEmpty: true });
  renderTriangulationOverlay();
  renderTriangulationPanel();
  renderApproachRadarOverlay();
  renderApproachRadarPanel();
  renderBeaconSoundingOverlay();
  renderBeaconSoundingPanel();
  renderDriftSignalOverlay();
  renderDriftSignalsPanel();
  renderWitnessThreadsOverlay();
  renderWitnessThreadsPanel();
  renderTracePassageOverlay();
  renderTracePassagePanel();
  renderRelayMarkers();
  renderSignalRelaysPanel();
  renderCurrentMarkers();
  renderDriftCurrentOverlay();
  renderDriftCurrentsPanel();
  renderTransitLockMarkers();
  renderTransitLockOverlay();
  renderTransitLocksPanel();
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
    updateBeaconSounding({ seedLogIfEmpty: true });
    refreshBeaconSoundingViews();
    renderDriftSignalOverlay();
    renderDriftSignalsPanel();
    renderWitnessThreadsOverlay();
    renderWitnessThreadsPanel();
    renderTracePassageOverlay();
    renderTracePassagePanel();
    const driftCount = getDriftSignals().length;
    if (driftCount > 0) {
      setStatus(
        `${beacons.length} visitor beacons loaded from public issues, including ${driftCount} drift signal${driftCount === 1 ? "" : "s"} without usable coordinates.`
      );
    } else {
      setStatus(`${beacons.length} visitor beacon${beacons.length === 1 ? "" : "s"} loaded from public issues.`);
    }
  } catch (err) {
    console.error(err);
    state.beacons = [];
    renderRegionSurvey();
    renderBeaconLedger();
    renderVerificationRoute();
    renderVerificationChain();
    updateBeaconSounding({ seedLogIfEmpty: true });
    refreshBeaconSoundingViews();
    renderDriftSignalOverlay();
    renderDriftSignalsPanel();
    renderWitnessThreadsOverlay();
    renderWitnessThreadsPanel();
    renderTracePassageOverlay();
    renderTracePassagePanel();
    setStatus(
      "Visitor beacons are temporarily unavailable (GitHub API limit or network issue). Landmarks remain explorable.",
      true
    );
  }
}

function init() {
  renderLandmarks();
  renderRelayMarkers();
  renderCurrentMarkers();
  renderTransitLockMarkers();
  renderLatticeMarkers();
  renderTraverseLattice();
  renderDriftCurrentOverlay();
  renderSignalRelayOverlay();
  renderTransitLockOverlay();
  renderSurveySkiff();
  renderSurveyWake();
  renderSurveyGridOverlay();
  renderSurveyGridPanel();
  updateTriangulationFix({ seedLogIfEmpty: true });
  updateApproachRadarScan({ seedLogIfEmpty: true });
  updateBeaconSounding({ seedLogIfEmpty: true });
  renderTriangulationOverlay();
  renderTriangulationPanel();
  renderApproachRadarOverlay();
  renderApproachRadarPanel();
  renderBeaconSoundingOverlay();
  renderBeaconSoundingPanel();
  renderDriftSignalOverlay();
  renderDriftSignalsPanel();
  renderWitnessThreadsOverlay();
  renderWitnessThreadsPanel();
  renderTracePassageOverlay();
  renderTracePassagePanel();
  renderSignalRelaysPanel();
  renderDriftCurrentsPanel();
  renderTransitLocksPanel();
  initInteractions();
  state.restoredHashSelection = restoreHashSelection();
  initBeacons();
}

init();
