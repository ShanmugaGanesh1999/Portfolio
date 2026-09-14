// Spinner verbs — curated from the real Claude Code CLI's whimsical
// gerund list (~150 of the originals). A random verb animates the
// working spinner; the past tense is shown on completion.

export const SPINNER_GLYPHS = ["·", "✢", "✳", "✶", "✻", "✽"];

// Ping-pong frame order, like the CLI: forward then reverse.
export const SPINNER_FRAMES = [
  SPINNER_GLYPHS[0],
  SPINNER_GLYPHS[1],
  SPINNER_GLYPHS[2],
  SPINNER_GLYPHS[3],
  SPINNER_GLYPHS[4],
  SPINNER_GLYPHS[5],
  SPINNER_GLYPHS[4],
  SPINNER_GLYPHS[3],
  SPINNER_GLYPHS[2],
  SPINNER_GLYPHS[1],
];

const IRREGULAR = {
  Baking: "Baked",
  Beaming: "Beamed",
  Billowing: "Billowed",
  Bloviating: "Bloviated",
  Brewing: "Brewed",
  Cascading: "Cascaded",
  Channeling: "Channeled",
  Channelling: "Channelled",
  Churning: "Churned",
  Clauding: "Clauded",
  Crystallizing: "Crystallized",
  Doing: "Did",
  Drizzling: "Drizzled",
  Flowing: "Flowed",
  Forging: "Forged",
  Forming: "Formed",
  Generating: "Generated",
  Gitifying: "Gitified",
  Hatching: "Hatched",
  Honking: "Honked",
  Imagining: "Imagined",
  Inferring: "Inferred",
  Ionizing: "Ionized",
  Levitating: "Levitated",
  Manifesting: "Manifested",
  Misting: "Misted",
  Moseying: "Moseyed",
  Mulling: "Mulled",
  Mustering: "Mustered",
  Nesting: "Nested",
  Orbiting: "Orbited",
  Perusing: "Perused",
  Printing: "Printed",
  Processing: "Processed",
  Proofing: "Proofed",
  Puzzling: "Puzzled",
  Roosting: "Roosted",
  Running: "Ran",
  Simmering: "Simmered",
  Sketching: "Sketched",
  Spinning: "Spun",
  Sprouting: "Sprouted",
  Stewing: "Stewed",
  Swirling: "Swirled",
  Thinking: "Thought",
  Thundering: "Thundered",
  Wandering: "Wandered",
  Whisking: "Whisked",
  Working: "Worked",
};

export const SPINNER_VERBS = [
  "Accomplishing", "Actioning", "Actualizing", "Architecting", "Baking",
  "Beaming", "Bebopping", "Befuddling", "Billowing", "Blanching",
  "Bloviating", "Boogieing", "Booping", "Bootstrapping", "Brewing",
  "Bunning", "Burrowing", "Calculating", "Canoodling", "Caramelizing",
  "Cascading", "Catapulting", "Cerebrating", "Channeling", "Choreographing",
  "Churning", "Clauding", "Coalescing", "Cogitating", "Combobulating",
  "Composing", "Computing", "Concocting", "Considering", "Contemplating",
  "Cooking", "Crafting", "Creating", "Crunching", "Crystallizing",
  "Cultivating", "Deciphering", "Deliberating", "Determining", "Doing",
  "Doodling", "Drizzling", "Ebbing", "Effecting", "Elucidating",
  "Enchanting", "Envisioning", "Fermenting", "Finagling", "Flambeing",
  "Flowing", "Flummoxing", "Fluttering", "Forging", "Forming",
  "Frosting", "Gallivanting", "Galloping", "Garnishing", "Generating",
  "Gesticulating", "Germinating", "Gitifying", "Grooving", "Harmonizing",
  "Hashing", "Hatching", "Herding", "Honking", "Ideating", "Imagining",
  "Improvising", "Incubating", "Inferring", "Infusing", "Ionizing",
  "Jitterbugging", "Kneading", "Leavening", "Levitating", "Lollygagging",
  "Manifesting", "Marinating", "Meandering", "Mulling", "Mustering",
  "Musing", "Noodling", "Orbiting", "Orchestrating", "Osmosing",
  "Percolating", "Perusing", "Philosophising", "Pondering", "Pontificating",
  "Pouncing", "Precipitating", "Processing", "Proofing", "Propagating",
  "Puttering", "Puzzling", "Ruminating", "Sauteing", "Scampering",
  "Schlepping", "Scurrying", "Seasoning", "Shimmying", "Simmering",
  "Skedaddling", "Sketching", "Slithering", "Spelunking", "Spinning",
  "Sprouting", "Stewing", "Swirling", "Swooping", "Synthesizing",
  "Tempering", "Thinking", "Thundering", "Tinkering", "Transmuting",
  "Twisting", "Undulating", "Unfurling", "Unravelling", "Vibing",
  "Waddling", "Wandering", "Warping", "Whisking", "Wibbling", "Working",
  "Wrangling", "Zesting", "Zigzagging",
];

export function randomVerb() {
  return SPINNER_VERBS[Math.floor(Math.random() * SPINNER_VERBS.length)];
}

/** Best-effort past tense ("Pondering" → "Pondered", "Doing" → "Did"). */
export function pastTense(verb) {
  if (IRREGULAR[verb]) return IRREGULAR[verb];
  if (/ie$/.test(verb)) return verb.replace(/ie$/, "ied"); // Sauteing → Sauteed
  if (/(ss|sh|ch|x|z)$/.test(verb)) return verb + "ed"; // Processing → Processed
  if (/[^aeiou]y$/.test(verb)) return verb.slice(0, -1) + "ied"; // Pondering→Pondered
  return verb + "ed";
}

/** "1m 32s" / "45s" style elapsed formatting. */
export function formatElapsed(ms) {
  const s = Math.max(1, Math.round(ms / 1000));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rest = s % 60;
  if (m < 60) return `${m}m ${rest}s`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

/** "2.2k tokens" style count. */
export function formatTokens(n) {
  if (n < 1000) return `${n}`;
  return `${(n / 1000).toFixed(1)}k`;
}
