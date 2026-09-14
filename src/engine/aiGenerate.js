const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-3.6-flash"];

const SYSTEM_INSTRUCTION = `You are an elite, modern website designer and developer.
Create a complete, single-file, self-contained HTML5 webpage based on the user brief.

CRITICAL OUTPUT RULES:
1. Output ONLY valid, complete HTML starting with <!DOCTYPE html> and ending with </html>.
2. Do NOT output any markdown fences (no \`\`\`html), no preambles, and no conversational text.
3. Put all styling inside a <style> tag in the <head>. Always close all tags (especially </style>, </body>, </html>).
4. NEVER use large base64 data URLs or images. Use CSS gradients, CSS shapes, emojis, or inline SVGs for visuals.
5. Make the page responsive, mobile-ready, cinematic, and beautifully styled with a modern color palette, readable typography, navigation bar, hero banner, feature sections, and footer.`;

export async function generateWithGemini(prompt, apiKey) {
  const key = apiKey || process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (!key) {
    throw new Error("No Gemini API key found. Please add your key in Settings or set EXPO_PUBLIC_GEMINI_API_KEY.");
  }

  let lastError = null;

  for (const model of GEMINI_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }],
          },
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
            thinkingConfig: { thinkingBudget: 0 },
          },
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
      let rawText = textPart.text || "";

      // Extract HTML cleanly
      const htmlMatch = rawText.match(/<!DOCTYPE html[\s\S]*<\/html>/i) || rawText.match(/<html[\s\S]*<\/html>/i);
      let html = htmlMatch ? htmlMatch[0] : rawText;

      // Clean any accidental markdown backticks
      html = html.replace(/^```html\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/, "").trim();

      // Ensure style tag is closed if unexpectedly cut
      if (html.includes("<style>") && !html.includes("</style>")) {
        html += "\n</style>\n</body>\n</html>";
      } else if (!html.includes("</html>")) {
        html += "\n</body>\n</html>";
      }

      if (!html.includes("<html")) {
        throw new Error("The AI did not return a valid HTML page.");
      }

      return html;
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error("Failed to generate page with Gemini.");
}
