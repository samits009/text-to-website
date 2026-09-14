const TYPE_KEYWORDS = [
  {
    type: "restaurant",
    words: ["restaurant", "cafe", "coffee", "bakery", "food", "menu", "diner", "bistro", "kitchen"],
  },
  {
    type: "portfolio",
    words: ["portfolio", "designer", "photographer", "developer", "resume", "freelancer", "artist"],
  },
  {
    type: "shop",
    words: ["shop", "store", "ecommerce", "e-commerce", "boutique", "products", "sell", "marketplace"],
  },
  {
    type: "education",
    words: ["school", "college", "course", "tutor", "academy", "university", "learning", "coaching"],
  },
  {
    type: "event",
    words: ["event", "wedding", "conference", "festival", "meetup", "concert", "launch"],
  },
  {
    type: "health",
    words: ["gym", "fitness", "yoga", "clinic", "hospital", "doctor", "spa", "wellness"],
  },
  {
    type: "travel",
    words: ["travel", "hotel", "tour", "resort", "trip", "vacation", "booking"],
  },
  {
    type: "tech",
    words: ["saas", "app", "startup", "software", "ai", "tech", "platform", "product"],
  },
];

const STYLE_KEYWORDS = [
  { style: "dark", words: ["dark", "neon", "night", "cyber"] },
  { style: "elegant", words: ["elegant", "luxury", "premium", "classy", "gold"] },
  { style: "playful", words: ["playful", "fun", "colorful", "kids", "bright"] },
  { style: "minimal", words: ["minimal", "simple", "clean", "white"] },
  { style: "modern", words: ["modern", "bold", "contemporary"] },
];

const COLOR_MAP = {
  blue: "#2563EB",
  navy: "#1E3A8A",
  green: "#059669",
  teal: "#0D9488",
  purple: "#7C3AED",
  violet: "#6D28D9",
  red: "#DC2626",
  orange: "#EA580C",
  gold: "#C9A227",
  yellow: "#CA8A04",
  pink: "#DB2777",
  rose: "#E11D48",
  black: "#111827",
  brown: "#92400E",
  maroon: "#9F1239",
};

const PALETTES = {
  restaurant: { primary: "#C2410C", secondary: "#7C2D12", accent: "#F59E0B", bg: "#FFF7ED", text: "#1C1917" },
  portfolio: { primary: "#4F46E5", secondary: "#312E81", accent: "#22D3EE", bg: "#F8FAFC", text: "#0F172A" },
  shop: { primary: "#BE185D", secondary: "#9D174D", accent: "#FB7185", bg: "#FFF1F2", text: "#1F2937" },
  education: { primary: "#1D4ED8", secondary: "#1E3A8A", accent: "#38BDF8", bg: "#F0F9FF", text: "#0F172A" },
  event: { primary: "#7C3AED", secondary: "#5B21B6", accent: "#F472B6", bg: "#FAF5FF", text: "#1E1B4B" },
  health: { primary: "#059669", secondary: "#064E3B", accent: "#34D399", bg: "#ECFDF5", text: "#064E3B" },
  travel: { primary: "#0284C7", secondary: "#075985", accent: "#F59E0B", bg: "#F0F9FF", text: "#0C4A6E" },
  tech: { primary: "#4F46E5", secondary: "#1E1B4B", accent: "#22D3EE", bg: "#0B1220", text: "#E2E8F0" },
  business: { primary: "#0F766E", secondary: "#134E4A", accent: "#14B8A6", bg: "#F8FAFC", text: "#0F172A" },
};

function findFirst(text, map) {
  for (const item of map) {
    if (item.words.some((word) => text.includes(word))) return item.type || item.style;
  }
  return null;
}

function extractQuoted(text) {
  const match = text.match(/["“']([^"”']{2,60})["”']/);
  return match ? match[1].trim() : null;
}

function extractNamed(text) {
  const match = text.match(
    /(?:called|named|for|brand|company|business|cafe|restaurant|studio)\s+([A-Z][\w&.'-]*(?:\s+[A-Z][\w&.'-]*){0,4})/
  );
  return match ? match[1].trim() : null;
}

function titleFromText(text) {
  const quoted = extractQuoted(text);
  if (quoted) return quoted;
  const named = extractNamed(text);
  if (named) return named;
  const words = text
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .slice(0, 3);
  if (!words.length) return "My Studio";
  return words.map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}

function extractColor(text) {
  for (const [name, hex] of Object.entries(COLOR_MAP)) {
    if (text.includes(name)) return hex;
  }
  return null;
}

function extractContact(text) {
  const email = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const phone = text.match(/(\+?\d[\d\s-]{8,16}\d)/);
  const cityMatch = text.match(/\bin\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/);
  return {
    email: email ? email[0] : "hello@example.com",
    phone: phone ? phone[1].trim() : "+91 98765 43210",
    location: cityMatch ? cityMatch[1] : "Your City",
  };
}

function extractFeatures(text, type) {
  const defaults = {
    restaurant: ["Seasonal Menu", "Farm Fresh Ingredients", "Cozy Dining", "Weekend Brunch"],
    portfolio: ["Selected Work", "Case Studies", "Creative Process", "Client Stories"],
    shop: ["New Arrivals", "Free Shipping", "Easy Returns", "Member Rewards"],
    education: ["Expert Mentors", "Live Classes", "Career Support", "Flexible Schedule"],
    event: ["Keynote Talks", "Workshops", "Networking", "After Party"],
    health: ["Personal Training", "Group Classes", "Nutrition Plans", "Recovery Studio"],
    travel: ["Guided Tours", "Local Stays", "Custom Itineraries", "24/7 Support"],
    tech: ["Fast Setup", "Secure by Default", "Analytics", "Integrations"],
    business: ["Strategy", "Design", "Development", "Support"],
  };

  const listed = [];
  const withList = text.match(/(?:with|including|features?|offers?|services?)\s+([^.!?]+)/i);
  if (withList) {
    withList[1]
      .split(/,| and /)
      .map((item) => item.trim())
      .filter((item) => item.length > 2 && item.length < 40)
      .forEach((item) => listed.push(item.replace(/^\w/, (c) => c.toUpperCase())));
  }
  const base = defaults[type] || defaults.business;
  return [...listed, ...base].filter((v, i, a) => a.indexOf(v) === i).slice(0, 6);
}

function extractTagline(text, type) {
  const dash = text.match(/[-–:]\s*([^.!?]{8,80})/);
  if (dash) return dash[1].trim();
  const lines = {
    restaurant: "Food made with patience, served with warmth.",
    portfolio: "A focused studio for work that lasts.",
    shop: "Thoughtful pieces for everyday living.",
    education: "Learn skills that actually move your career.",
    event: "One night. New ideas. Better conversations.",
    health: "Train with intention. Recover with care.",
    travel: "Trips planned around the places locals love.",
    tech: "Software that stays out of the way.",
    business: "A clearer website for a clearer offer.",
  };
  return lines[type] || lines.business;
}

function withStyle(colors, style) {
  if (style === "dark") {
    return { ...colors, bg: "#0B1220", text: "#E5E7EB", secondary: "#020617" };
  }
  if (style === "minimal") {
    return { ...colors, bg: "#FFFFFF", text: "#111827", primary: colors.primary };
  }
  if (style === "elegant") {
    return { ...colors, primary: "#B45309", accent: "#C9A227", bg: "#FFFBEB", text: "#1C1917" };
  }
  return colors;
}

export function parsePrompt(raw) {
  const text = (raw || "").trim();
  const lower = text.toLowerCase();
  const type = findFirst(lower, TYPE_KEYWORDS) || "business";
  const style = findFirst(lower, STYLE_KEYWORDS) || (type === "tech" ? "dark" : "modern");
  const title = titleFromText(text);
  const userColor = extractColor(lower);
  let colors = { ...(PALETTES[type] || PALETTES.business) };
  if (userColor) colors.primary = userColor;
  colors = withStyle(colors, style);

  return {
    title,
    tagline: extractTagline(text, type),
    about:
      text.length > 40
        ? text.replace(/\s+/g, " ").slice(0, 280)
        : `${title} is built around a simple idea: make something useful, beautiful, and easy to understand.`,
    type,
    style,
    colors,
    features: extractFeatures(lower, type),
    contact: extractContact(text),
    cta: type === "restaurant" ? "Reserve a table" : type === "shop" ? "Shop the collection" : "Get in touch",
    prompt: text,
  };
}
