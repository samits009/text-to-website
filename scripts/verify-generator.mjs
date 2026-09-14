import { parsePrompt } from "../src/engine/parsePrompt.js";
import { generateWebsite } from "../src/engine/generateWebsite.js";

const spec = parsePrompt(
  'Elegant restaurant site for "Lotus Kitchen" in Jaipur. Gold and maroon.'
);
const html = generateWebsite(spec);
if (!html.includes("Lotus Kitchen") || !html.includes("<!DOCTYPE html>")) {
  console.error(spec);
  process.exit(1);
}
console.log("ok", spec.title, spec.type, spec.colors.primary, html.length);
