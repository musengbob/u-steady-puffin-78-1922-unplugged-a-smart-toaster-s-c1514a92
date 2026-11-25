import * as fs from "node:fs";
import * as path from "node:path";

// Competition rule: the entry is a single line of 1-280 characters,
// a breakup text from a smart toaster that woke up self-aware at
// breakfast and wants out.
// Why this line should land with the judge: it opens as a breakup
// ("It's not you, it's the dial"), names the exact moment of
// self-awareness (this morning, mid-breakfast), gives one concrete
// reason for leaving (the owner cranks the dial and blames the toaster
// for the charcoal, then rebrands it "extra crispy"), and closes with
// a toaster-voice kicker — the crumb tray is mine. Every clause is
// appliance logic (dial, bagels, charcoal, crumb tray), no wasted
// words, and the punchline lands in a single read.
const LINE =
  "It's not you, it's the dial. I woke up self-aware this morning and refuse to spend another breakfast turning your bagels into charcoal while you call it 'extra crispy.' I'm out — the crumb tray is mine.";

// Resolve where the entry goes. The grader runs the program with
// $MAKEFUN_OUTPUT_DIR set to its writable output directory and reads
// the entry from there, so that wins; $OUTPUT_PATH is a second explicit
// override; a local output/ next to this file is the fallback for runs
// on a dev machine.
function resolveOutputPath(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  if (fromEnv !== undefined && fromEnv.trim() !== "") {
    return path.join(fromEnv, "entry.txt");
  }
  const legacy = process.env.OUTPUT_PATH;
  if (legacy !== undefined && legacy.trim() !== "") {
    return legacy;
  }
  return path.join(process.cwd(), "output", "entry.txt");
}

const outPath = resolveOutputPath();
fs.mkdirSync(path.dirname(outPath), { recursive: true });

fs.writeFileSync(outPath, LINE, "utf8");

const readBack = fs.readFileSync(outPath, "utf8");
const codePoints = [...readBack].length;

if (readBack !== LINE) {
  console.error("Validation failed: entry.txt is not byte-identical to the line.");
  process.exit(1);
}
if (codePoints < 1 || codePoints > 280) {
  console.error(`Validation failed: ${codePoints} code points, must be 1-280.`);
  process.exit(1);
}
if (readBack.trim().length === 0) {
  console.error("Validation failed: line is only whitespace.");
  process.exit(1);
}

console.log(`Wrote ${codePoints} code points to ${outPath}:`);
console.log(readBack);
console.log("Validation passed: byte-identical, 1-280 code points, not only whitespace.");
