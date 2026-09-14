const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-3.6-flash"];

export async function generateWithGemini(prompt, apiKey) {
  const key = apiKey || process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (!key) {
    throw new Error("No Gemini API key found. Please add your key in Settings or set EXPO_PUBLIC_GEMINI_API_KEY.");
  }

  const instruction = `You are a website designer. Create a complete, self-contained HTML5 page for this request:
"""
${prompt}
"""
Rules:
- Return ONLY HTML, no markdown fences.
- Include CSS in a <style> tag and a little vanilla JS if needed.
- Make it cinematic and attractive: floating orbs, letter-by-letter hero, marquee, scroll reveals, hover lift, animated gradients, grain, sticky pill nav.
- Use Google Fonts (editorial serif + modern sans). Responsive. Original — not Bootstrap or generic purple AI cards.
- Include nav, hero, 3-6 content sections, mosaic/gallery, and contact.
- Honor prefers-reduced-motion.
- Do not use external JS libraries.`;

  let lastError = null;

  for (const model of GEMINI_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: instruction }] }],
          generationConfig: { temperature: 0.8, maxOutputTokens: 8192 },
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        lastError = new Error(err.slice(0, 180) || "Gemini request failed");
        continue;
      }

      const data = await response.json();
      const parts = data?.candidates?.[0]?.content?.parts || [];
      const textPart = parts.find((p) => p.text && !p.thought) || parts.find((p) => p.text) || {};
      let html = textPart.text || "";

      html = html.replace(/^```html\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/, "").trim();
      if (!html.includes("<html")) {
        throw new Error("The AI did not return a full HTML page.");
      }
      return html;
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error("Failed to generate page with Gemini.");
}
