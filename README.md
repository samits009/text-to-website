# SiteForge — Text to Website

Mobile app (Expo / React Native) that turns a written brief into a real webpage.

## What it does

1. You describe the website you want (name, type, colors, city, services).
2. The app generates a complete HTML page.
3. You preview it like a live site, inspect the HTML, and share it.

It works **offline** with a built-in generator. If you add a **Google Gemini** API key in Settings, it designs a custom page from your text.

## Run on your phone

1. Install [Node.js](https://nodejs.org/) (LTS).
2. In this folder:

```bash
npm install
npx expo start
```

3. Install **Expo Go** on your Android/iPhone.
4. Scan the QR code.

## Run in the browser (quick demo)

```bash
npm install
npx expo start --web
```

## Project layout

- `App.js` — screens and navigation
- `src/screens/` — Home (prompt), Preview (WebView), Settings (optional AI key)
- `src/engine/parsePrompt.js` — reads names, colors, and site type from your text
- `src/engine/generateWebsite.js` — builds the HTML/CSS page
- `src/engine/aiGenerate.js` — optional Gemini generation

## Example prompts

- `A dark modern website for an AI startup called Nimbus that sells a writing assistant. Blue and teal colors.`
- `Elegant restaurant site for "Lotus Kitchen" in Jaipur. Gold and maroon, tasting menu, reservations.`
- `Portfolio for a product designer named Aanya. Minimal white layout and a Hire Me button.`
