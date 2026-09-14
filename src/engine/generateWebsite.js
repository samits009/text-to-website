function esc(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function navItems(type) {
  if (type === "restaurant") return ["Menu", "Story", "Visit"];
  if (type === "shop") return ["Shop", "Lookbook", "Help"];
  if (type === "portfolio") return ["Work", "About", "Contact"];
  if (type === "health") return ["Train", "Studio", "Join"];
  if (type === "travel") return ["Journeys", "Stays", "Plan"];
  return ["About", "Services", "Contact"];
}

function heroKicker(type) {
  const map = {
    restaurant: "A table, a season, a ritual",
    portfolio: "Independent studio",
    shop: "Made slowly, chosen quickly",
    education: "Learn in public, grow in private",
    event: "One room. Better conversations.",
    health: "Strength with a quieter mind",
    travel: "Maps drawn by people who live there",
    tech: "Product, not pitch-deck theater",
    business: "A clearer offer, beautifully framed",
  };
  return map[type] || map.business;
}

function splitTitle(title) {
  return esc(title)
    .split("")
    .map((ch, i) => {
      if (ch === " ") return `<span class="letter space" style="--i:${i}">&nbsp;</span>`;
      return `<span class="letter" style="--i:${i}">${ch}</span>`;
    })
    .join("");
}

function galleryTiles(type, title) {
  const sets = {
    restaurant: ["Hearth", "Harvest", "Late light", "Service"],
    portfolio: ["Study 01", "Study 02", "Process", "Archive"],
    shop: ["Drop 01", "Drop 02", "Lookbook", "Atelier"],
    education: ["Cohort", "Studio", "Critique", "Launch"],
    event: ["Stage", "Hall", "After", "City"],
    health: ["Floor", "Breath", "Iron", "Recover"],
    travel: ["Coast", "Market", "Night", "Road"],
    tech: ["Signal", "Lattice", "Pulse", "Core"],
    business: ["Craft", "Clarity", "Pace", "Proof"],
  };
  const labels = sets[type] || sets.business;
  return labels
    .map(
      (label, i) => `
      <figure class="tile reveal" style="--d:${0.08 * i}s; --n:${i}">
        <div class="tile-art"></div>
        <figcaption>${esc(label)} · ${esc(title)}</figcaption>
      </figure>`
    )
    .join("");
}

function featureCopy(type) {
  const map = {
    restaurant: "Plates that change with the market, not the calendar of a chain.",
    portfolio: "Work shown with the thinking still attached.",
    shop: "Pieces you keep because they earn their space.",
    education: "Less content dump. More practice you can feel.",
    event: "A night paced so people actually meet.",
    health: "Programming that respects recovery as much as load.",
    travel: "Days built around a neighborhood, not a checklist.",
    tech: "Interface that disappears once the job is done.",
    business: "A page that says the thing, then gets out of the way.",
  };
  return map[type] || map.business;
}

export function generateWebsite(spec) {
  const { title, tagline, about, type, style, colors, features, contact, cta } = spec;
  const nav = navItems(type);
  const copy = featureCopy(type);
  const cards = features
    .map(
      (feature, i) => `
      <article class="card reveal" style="--d:${0.07 * i}s">
        <div class="card-glow"></div>
        <span class="idx">0${i + 1}</span>
        <h3>${esc(feature)}</h3>
        <p>${esc(copy)}</p>
      </article>`
    )
    .join("");

  const dark = style === "dark" || colors.bg.startsWith("#0");
  const year = new Date().getFullYear();
  const marquee = [...features, title, heroKicker(type), ...features]
    .map((item) => `<span>${esc(item)}</span>`)
    .join("<i>•</i>");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    :root {
      --primary: ${colors.primary};
      --secondary: ${colors.secondary};
      --accent: ${colors.accent};
      --bg: ${colors.bg};
      --text: ${colors.text};
      --card: ${dark ? "rgba(255,255,255,.045)" : "rgba(255,255,255,.72)"};
      --line: ${dark ? "rgba(255,255,255,.14)" : "rgba(15,23,42,.1)"};
      --ink: ${dark ? "rgba(255,255,255,.55)" : "rgba(15,23,42,.62)"};
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      font-family: Outfit, system-ui, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.65;
      overflow-x: hidden;
    }
    body::before {
      content: "";
      position: fixed; inset: 0; pointer-events: none; z-index: 0;
      background:
        radial-gradient(900px 500px at 12% -10%, color-mix(in srgb, var(--accent) 34%, transparent), transparent 55%),
        radial-gradient(700px 420px at 110% 8%, color-mix(in srgb, var(--primary) 28%, transparent), transparent 50%);
      animation: aurora 18s ease-in-out infinite alternate;
    }
    body::after {
      content: "";
      position: fixed; inset: 0; pointer-events: none; z-index: 1; opacity: .07;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    }
    a { color: inherit; text-decoration: none; }
    .wrap { width: min(1160px, calc(100% - 36px)); margin: 0 auto; position: relative; z-index: 2; }
    header {
      position: sticky; top: 14px; z-index: 20; margin: 14px auto 0;
      width: min(1160px, calc(100% - 36px));
      border: 1px solid var(--line);
      border-radius: 999px;
      background: color-mix(in srgb, var(--bg) 72%, transparent);
      backdrop-filter: blur(18px) saturate(1.3);
      box-shadow: 0 10px 40px rgba(0,0,0,.08);
      animation: drop 900ms cubic-bezier(.16,1,.3,1) both;
    }
    .nav { display: flex; align-items: center; justify-content: space-between; padding: 10px 10px 10px 22px; gap: 16px; }
    .logo { font-family: "Cormorant Garamond", serif; font-weight: 700; font-size: 1.35rem; letter-spacing: -.02em; }
    .links { display: flex; gap: 22px; font-weight: 500; font-size: .92rem; opacity: .8; }
    .links a { position: relative; }
    .links a::after {
      content: ""; position: absolute; left: 0; bottom: -6px; height: 2px; width: 0;
      background: var(--accent); transition: width .35s ease;
    }
    .links a:hover::after { width: 100%; }
    .btn {
      display: inline-flex; align-items: center; justify-content: center;
      background: var(--primary); color: #fff; border: 0; border-radius: 999px;
      padding: 12px 20px; font-weight: 700; cursor: pointer; position: relative; overflow: hidden;
      transition: transform .35s cubic-bezier(.16,1,.3,1), box-shadow .35s ease;
      box-shadow: 0 10px 24px color-mix(in srgb, var(--primary) 35%, transparent);
    }
    .btn::before {
      content: ""; position: absolute; inset: 0;
      background: linear-gradient(120deg, transparent 20%, rgba(255,255,255,.35), transparent 80%);
      transform: translateX(-120%);
      animation: sheen 3.6s ease-in-out infinite;
    }
    .btn:hover { transform: translateY(-2px) scale(1.02); }
    .hero {
      padding: 78px 0 28px;
      display: grid; grid-template-columns: 1.08fr .92fr; gap: 42px; align-items: center;
    }
    .kicker {
      letter-spacing: .2em; text-transform: uppercase; font-size: .72rem; font-weight: 700;
      color: var(--primary); display: inline-flex; align-items: center; gap: 10px;
    }
    .kicker::before {
      content: ""; width: 28px; height: 1px; background: var(--accent);
      animation: grow 1.2s cubic-bezier(.16,1,.3,1) both;
    }
    h1 {
      font-family: "Cormorant Garamond", serif;
      font-size: clamp(3.1rem, 8vw, 6.4rem);
      line-height: .92; margin: 14px 0 18px; font-weight: 600; letter-spacing: -.03em;
    }
    .letter {
      display: inline-block;
      animation: rise 900ms cubic-bezier(.16,1,.3,1) both;
      animation-delay: calc(var(--i) * 28ms);
    }
    .lead { font-size: 1.18rem; max-width: 36ch; color: var(--ink); animation: fade 1.1s .25s both; }
    .hero-actions { display: flex; gap: 12px; margin-top: 30px; flex-wrap: wrap; animation: fade 1.1s .4s both; }
    .ghost {
      background: transparent; color: var(--text); border: 1px solid var(--line);
      box-shadow: none;
    }
    .ghost::before { display: none; }
    .stage {
      min-height: 420px; border-radius: 36px; overflow: hidden; position: relative;
      isolation: isolate;
      box-shadow: 0 30px 80px rgba(0,0,0,.22);
      animation: floaty 7s ease-in-out infinite;
      transform-style: preserve-3d;
    }
    .orb, .ring, .spark {
      position: absolute; border-radius: 50%;
    }
    .orb {
      inset: -20%;
      background:
        conic-gradient(from 120deg, var(--secondary), var(--primary), var(--accent), var(--secondary));
      filter: blur(8px) saturate(1.15);
      animation: spin 22s linear infinite;
    }
    .orb.alt {
      inset: 18% 8% 8% 28%;
      filter: blur(18px);
      opacity: .7;
      animation-duration: 16s; animation-direction: reverse;
    }
    .ring {
      inset: 38px; border: 1px solid rgba(255,255,255,.35);
      border-radius: 28px; animation: pulse 4.5s ease-in-out infinite;
    }
    .spark {
      width: 14px; height: 14px; background: #fff; right: 18%; top: 22%;
      box-shadow: 0 0 24px #fff; animation: drift 5s ease-in-out infinite;
    }
    .stage-label {
      position: absolute; left: 28px; bottom: 26px; z-index: 2; color: #fff;
      font-family: "Cormorant Garamond", serif; font-size: 1.7rem; font-style: italic;
      text-shadow: 0 10px 30px rgba(0,0,0,.35);
    }
    .marquee-wrap {
      margin: 28px 0 10px; overflow: hidden; border-block: 1px solid var(--line);
      mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
    }
    .marquee {
      display: flex; white-space: nowrap; padding: 16px 0;
      font-family: "Cormorant Garamond", serif; font-size: 1.45rem;
      animation: slide 28s linear infinite;
    }
    .marquee > div { flex: 0 0 auto; display: flex; align-items: center; }
    .marquee span { padding: 0 8px; }
    .marquee i { font-style: normal; opacity: .35; padding: 0 18px; color: var(--accent); }
    .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 42px; }
    .stat { padding: 16px 4px; border-top: 1px solid var(--line); }
    .stat b {
      display: block; font-family: "Cormorant Garamond", serif; font-size: 2rem; line-height: 1;
    }
    section { padding: 64px 0; position: relative; z-index: 2; }
    .section-title {
      font-family: "Cormorant Garamond", serif; font-size: clamp(2rem, 4vw, 3.1rem);
      margin: 8px 0 24px; letter-spacing: -.03em; line-height: 1.05;
    }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 16px; }
    .card {
      background: var(--card); border: 1px solid var(--line); border-radius: 24px;
      padding: 24px; min-height: 210px; position: relative; overflow: hidden;
      backdrop-filter: blur(10px);
      transition: transform .5s cubic-bezier(.16,1,.3,1), border-color .3s ease;
    }
    .card:hover { transform: translateY(-8px) rotate(-.4deg); border-color: color-mix(in srgb, var(--accent) 55%, var(--line)); }
    .card-glow {
      position: absolute; width: 160px; height: 160px; right: -40px; top: -50px; border-radius: 50%;
      background: radial-gradient(circle, color-mix(in srgb, var(--accent) 40%, transparent), transparent 70%);
      animation: pulse 5s ease-in-out infinite;
    }
    .idx { font-weight: 700; color: var(--primary); letter-spacing: .12em; font-size: .8rem; }
    .card h3 { font-size: 1.25rem; margin: 14px 0 8px; letter-spacing: -.02em; }
    .card p { color: var(--ink); font-size: .95rem; }
    .about { display: grid; grid-template-columns: .9fr 1.1fr; gap: 40px; align-items: start; }
    .mosaic {
      display: grid; grid-template-columns: 1.2fr 1fr; grid-template-rows: 180px 180px; gap: 14px;
    }
    .tile { position: relative; overflow: hidden; border-radius: 22px; isolation: isolate; }
    .tile:nth-child(1) { grid-row: 1 / span 2; }
    .tile-art {
      position: absolute; inset: 0;
      background:
        linear-gradient(160deg, color-mix(in srgb, var(--secondary) 80%, #000), var(--primary) 55%, var(--accent));
      animation: ken 14s ease-in-out infinite alternate;
    }
    .tile:nth-child(2) .tile-art { filter: hue-rotate(24deg); animation-duration: 11s; }
    .tile:nth-child(3) .tile-art { filter: hue-rotate(-18deg) saturate(1.2); animation-duration: 16s; }
    .tile:nth-child(4) .tile-art { filter: contrast(1.1) saturate(.9); }
    .tile figcaption {
      position: absolute; left: 16px; bottom: 14px; color: #fff; font-weight: 600; z-index: 1;
      text-shadow: 0 8px 18px rgba(0,0,0,.35);
    }
    .contact {
      display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
      background: color-mix(in srgb, var(--primary) 12%, var(--bg));
      border: 1px solid var(--line); border-radius: 32px; padding: 32px;
      position: relative; overflow: hidden;
    }
    .contact::before {
      content: ""; position: absolute; width: 280px; height: 280px; right: -80px; bottom: -90px;
      background: radial-gradient(circle, var(--accent), transparent 70%); opacity: .35;
      animation: pulse 6s ease-in-out infinite;
    }
    form { display: grid; gap: 10px; position: relative; }
    input, textarea {
      width: 100%; border: 1px solid var(--line); background: var(--card); color: var(--text);
      border-radius: 14px; padding: 13px 14px; font: inherit;
      transition: border-color .25s ease, transform .25s ease;
    }
    input:focus, textarea:focus { outline: none; border-color: var(--primary); transform: translateY(-1px); }
    footer { padding: 22px 0 48px; opacity: .7; font-size: .92rem; position: relative; z-index: 2; }
    .reveal { opacity: 0; transform: translateY(28px); }
    .reveal.in { animation: rise 900ms cubic-bezier(.16,1,.3,1) both; animation-delay: var(--d, 0s); }
    @keyframes rise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: none; } }
    @keyframes fade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
    @keyframes drop { from { opacity: 0; transform: translateY(-18px) scale(.98); } to { opacity: 1; transform: none; } }
    @keyframes spin { to { transform: rotate(1turn); } }
    @keyframes pulse { 50% { transform: scale(1.04); opacity: .85; } }
    @keyframes drift { 50% { transform: translate(-18px, 22px) scale(1.4); opacity: .4; } }
    @keyframes floaty { 50% { transform: translateY(-10px); } }
    @keyframes slide { from { transform: translateX(0); } to { transform: translateX(-50%); } }
    @keyframes sheen { 0%, 55% { transform: translateX(-120%); } 80%, 100% { transform: translateX(120%); } }
    @keyframes aurora { to { transform: translate3d(-4%, 3%, 0) scale(1.05); } }
    @keyframes ken { to { transform: scale(1.18) translate(4%, -3%); } }
    @keyframes grow { from { width: 0; } to { width: 28px; } }
    @media (max-width: 860px) {
      .links { display: none; }
      header { border-radius: 22px; }
      .hero, .about, .contact, .stats, .mosaic { grid-template-columns: 1fr; }
      .mosaic { grid-template-rows: 180px 140px 140px; }
      .tile:nth-child(1) { grid-row: auto; min-height: 180px; }
      .stage { min-height: 280px; }
    }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { animation: none !important; transition: none !important; }
      .reveal { opacity: 1; transform: none; }
    }
  </style>
</head>
<body>
  <header>
    <div class="nav">
      <div class="logo">${esc(title)}</div>
      <nav class="links">${nav.map((item) => `<a href="#${item.toLowerCase()}">${esc(item)}</a>`).join("")}</nav>
      <a class="btn" href="#contact">${esc(cta)}</a>
    </div>
  </header>
  <main>
    <section class="wrap hero">
      <div>
        <p class="kicker">${esc(heroKicker(type))}</p>
        <h1>${splitTitle(title)}</h1>
        <p class="lead">${esc(tagline)}</p>
        <div class="hero-actions">
          <a class="btn" href="#contact">${esc(cta)}</a>
          <a class="btn ghost" href="#services">Watch it unfold</a>
        </div>
        <div class="stats">
          <div class="stat reveal" style="--d:.05s"><b>01</b> Motion in the details</div>
          <div class="stat reveal" style="--d:.12s"><b>02</b> Built from your brief</div>
          <div class="stat reveal" style="--d:.2s"><b>03</b> Ready to share tonight</div>
        </div>
      </div>
      <div class="stage" id="stage" aria-hidden="true">
        <div class="orb"></div>
        <div class="orb alt"></div>
        <div class="ring"></div>
        <div class="spark"></div>
        <div class="stage-label">${esc(type)}</div>
      </div>
    </section>
    <div class="marquee-wrap">
      <div class="marquee">
        <div>${marquee}</div>
        <div>${marquee}</div>
      </div>
    </div>
    <section class="wrap about" id="${nav[1] ? nav[1].toLowerCase() : "about"}">
      <div class="reveal">
        <p class="kicker">About</p>
        <h2 class="section-title">Designed to feel inevitable.</h2>
      </div>
      <p class="reveal" style="--d:.12s">${esc(about)}</p>
    </section>
    <section class="wrap" id="services">
      <p class="kicker reveal">Signature</p>
      <h2 class="section-title reveal" style="--d:.06s">What ${esc(title)} is known for</h2>
      <div class="grid">${cards}</div>
    </section>
    <section class="wrap" id="${nav[0].toLowerCase()}">
      <p class="kicker reveal">Atmosphere</p>
      <h2 class="section-title reveal">A room you can almost hear</h2>
      <div class="mosaic">${galleryTiles(type, title)}</div>
    </section>
    <section class="wrap" id="contact">
      <div class="contact reveal">
        <div>
          <p class="kicker">Visit / write</p>
          <h2 class="section-title">Let’s make the next thing.</h2>
          <p>${esc(contact.location)}</p>
          <p>${esc(contact.email)}</p>
          <p>${esc(contact.phone)}</p>
        </div>
        <form onsubmit="event.preventDefault(); this.querySelector('button').textContent='Received — this is a preview';">
          <input placeholder="Your name" />
          <input placeholder="Email" />
          <textarea rows="4" placeholder="Tell us what you need"></textarea>
          <button class="btn" type="submit">Send message</button>
        </form>
      </div>
    </section>
  </main>
  <footer>
    <div class="wrap">© ${year} ${esc(title)} · Generated with SiteForge</div>
  </footer>
  <script>
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("in"); });
    }, { threshold: 0.16 });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    const stage = document.getElementById("stage");
    if (stage && window.matchMedia("(pointer:fine)").matches) {
      stage.addEventListener("mousemove", (e) => {
        const r = stage.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        stage.style.transform = "rotateY(" + (x * 12) + "deg) rotateX(" + (-y * 10) + "deg)";
      });
      stage.addEventListener("mouseleave", () => { stage.style.transform = ""; });
    }
  </script>
</body>
</html>`;
}
