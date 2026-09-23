import React from 'react';
import { VillageInfo } from '../types';

interface AtmosphericWeatherIntelligenceProps {
  village: VillageInfo;
  onSelectCity?: (cityName: string) => void;
}

export const AtmosphericWeatherIntelligence: React.FC<AtmosphericWeatherIntelligenceProps> = ({
  village,
}) => {
  const initialCityName = village?.name || 'Cuttack';
  const initialAdmin = village?.district || village?.state || 'Odisha';

  const fullHtmlContent = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
  <meta name="theme-color" content="#0a0612" />
  <meta name="description"
    content="Vayunetra — Premium atmospheric intelligence dashboard. Live weather, AQI, solar data and BBC environmental news." />
  <title>Vayunetra | Atmospheric Intelligence</title>

  <!-- CDN: Fonts, Icons, Chart.js -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&family=Space+Grotesk:wght@500;700&display=swap"
    rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js" defer></script>

  <style>
    /* GK Table Styles – add to your existing CSS */
    .gk-table {
      width: 100%;
      border-collapse: collapse;
      background: rgba(26, 13, 46, 0.55);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      overflow: hidden;
      border: 1px solid var(--border);
      font-size: 0.9rem;
    }

    .gk-table th,
    .gk-table td {
      text-align: left;
      padding: 16px 20px;
      border-bottom: 1px solid var(--border);
      vertical-align: top;
    }

    .gk-table th {
      font-family: 'JetBrains Mono', monospace;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      font-size: 0.7rem;
      color: var(--cyan);
      background: rgba(255, 179, 71, 0.08);
    }

    .gk-table tr:last-child td {
      border-bottom: none;
    }

    .gk-table tr:hover td {
      background: rgba(255, 215, 128, 0.06);
    }

    .gk-table td:first-child {
      font-weight: 700;
      color: var(--cyan-soft);
      font-family: 'Space Grotesk', monospace;
      border-right: 1px solid var(--border);
      width: 28%;
    }

    .gk-table td:last-child {
      color: var(--muted);
      line-height: 1.55;
      font-size: 0.85rem;
    }

    @media (max-width: 760px) {

      .gk-table th,
      .gk-table td {
        padding: 12px 14px;
      }
    }

    /* ==========================================================
   VAYUNETRA — ORBITAL OBSIDIAN
   Glassmorphism 2.0 · NASA Mission Control · Earth Visualization
   ========================================================== */
    :root {
      --obsidian: #0a0612;
      --obsidian-2: #140a1f;
      --indigo: #1a0d2e;
      --indigo-2: #26143f;
      --glass: rgba(255, 215, 128, .04);
      --glass-strong: rgba(255, 215, 128, .08);
      --border: rgba(255, 200, 120, .12);
      --border-strong: rgba(255, 200, 120, .22);
      --text: #fff5e1;
      --muted: #c4a878;
      --muted-2: #8a7556;
      --cyan: #ffb347;
      /* royal saffron (primary accent) */
      --cyan-soft: #ffd27a;
      /* warm gold */
      --aurora: #e8c547;
      /* deep gold */
      --violet: #c1272d;
      /* deep crimson */
      --magenta: #a0153e;
      /* royal maroon */
      --amber: #ff9933;
      /* India saffron */
      --red: #8b0000;
      /* deep red */
      --bbc: #bb1919;
      --shadow: 0 30px 80px -20px rgba(20, 5, 40, .7);
      --glow-cyan: 0 0 40px rgba(255, 179, 71, .40);
      --radius: 22px;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0
    }

    html,
    body {
      background: var(--obsidian);
      color: var(--text);
      font-family: 'Inter', system-ui, sans-serif;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden
    }

    body {
      background:
        radial-gradient(1200px 600px at 8% -10%, rgba(255, 153, 51, .14), transparent 60%),
        radial-gradient(900px 500px at 95% 10%, rgba(193, 39, 45, .12), transparent 60%),
        radial-gradient(1400px 700px at 50% 110%, rgba(232, 197, 71, .08), transparent 60%),
        var(--obsidian);
      min-height: 100vh;
    }

    a {
      color: inherit;
      text-decoration: none
    }

    button {
      font-family: inherit;
      cursor: pointer;
      border: none;
      background: none;
      color: inherit
    }

    img {
      display: block;
      max-width: 100%
    }

    .mono {
      font-family: 'JetBrains Mono', monospace;
      letter-spacing: .04em
    }

    .display {
      font-family: 'Space Grotesk', 'Inter', sans-serif;
      letter-spacing: -.02em
    }

    /* Aurora background blobs */
    .aurora {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      overflow: hidden
    }

    .aurora b {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: .5;
      animation: drift 22s ease-in-out infinite
    }

    .aurora b:nth-child(1) {
      width: 520px;
      height: 520px;
      background: rgba(255, 153, 51, .32);
      top: -120px;
      left: -100px
    }

    .aurora b:nth-child(2) {
      width: 600px;
      height: 600px;
      background: rgba(193, 39, 45, .24);
      top: 30%;
      right: -160px;
      animation-delay: -7s
    }

    .aurora b:nth-child(3) {
      width: 480px;
      height: 480px;
      background: rgba(232, 197, 71, .20);
      bottom: -160px;
      left: 30%;
      animation-delay: -14s
    }

    @keyframes drift {

      0%,
      100% {
        transform: translate3d(0, 0, 0) scale(1)
      }

      50% {
        transform: translate3d(6%, 4%, 0) scale(1.18)
      }
    }

    .container {
      max-width: 1440px;
      margin: 0 auto;
      padding: 0 24px;
      position: relative;
      z-index: 1
    }

    /* ============ HEADER ============ */
    .nav {
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      background: rgba(10, 6, 18, .72);
      border-bottom: 1px solid var(--border)
    }

    .nav-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      padding: 14px 0;
      flex-wrap: wrap
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 14px
    }

    .brand-mark {
      width: 42px;
      height: 42px;
      border-radius: 14px;
      background: linear-gradient(135deg, #ff9933 0%, #c1272d 50%, #138808 100%);
      display: grid;
      place-items: center;
      box-shadow: var(--glow-cyan);
      position: relative;
      overflow: hidden
    }

    .brand-mark::after {
      content: "";
      position: absolute;
      inset: 2px;
      border-radius: 12px;
      background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, .4), transparent 60%)
    }

    .brand-mark i {
      color: #fff5e1;
      font-size: 18px;
      position: relative;
      z-index: 1
    }

    .brand-text small {
      display: block;
      color: var(--cyan);
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      letter-spacing: .32em;
      line-height: 1
    }

    .brand-text strong {
      display: block;
      font-size: 18px;
      letter-spacing: -.01em;
      margin-top: 4px;
      line-height: 1
    }

    .search {
      flex: 1;
      max-width: 480px;
      position: relative
    }

    .search input {
      width: 100%;
      padding: 12px 14px 12px 42px;
      border-radius: 14px;
      background: var(--glass);
      border: 1px solid var(--border);
      color: var(--text);
      font-size: 14px;
      outline: none;
      transition: .2s
    }

    .search input::placeholder {
      color: var(--muted-2)
    }

    .search input:focus {
      border-color: var(--cyan);
      box-shadow: 0 0 0 4px rgba(255, 179, 71, .18);
      background: var(--glass-strong)
    }

    .search i {
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--muted)
    }

    .search-results {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      right: 0;
      background: rgba(10, 14, 26, .95);
      backdrop-filter: blur(24px);
      border: 1px solid var(--border-strong);
      border-radius: 14px;
      overflow: hidden;
      max-height: 340px;
      overflow-y: auto;
      z-index: 50;
      display: none;
      box-shadow: var(--shadow)
    }

    .search-results.open {
      display: block
    }

    .sr-item {
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      cursor: pointer;
      border-bottom: 1px solid var(--border)
    }

    .sr-item:hover {
      background: var(--glass-strong)
    }

    .sr-item small {
      color: var(--muted);
      font-size: 11px
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 12px
    }

    .live-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--cyan);
      color: #1a0d2e;
      padding: 10px 16px;
      border-radius: 999px;
      font-weight: 700;
      font-size: 13px;
      transition: .2s
    }

    .live-btn:hover {
      filter: brightness(1.1);
      transform: translateY(-1px)
    }

    .live-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #1a0d2e;
      animation: pulse 1.4s ease-in-out infinite
    }

    @keyframes pulse {

      0%,
      100% {
        opacity: 1
      }

      50% {
        opacity: .3
      }
    }

    /* ============ TICKER ============ */
    .ticker {
      border-bottom: 1px solid var(--border);
      background: linear-gradient(90deg, rgba(255, 153, 51, .08), rgba(193, 39, 45, .05));
      overflow: hidden;
      padding: 10px 0;
      position: relative;
      z-index: 2
    }

    .ticker-track {
      display: inline-flex;
      white-space: nowrap;
      animation: marquee 60s linear infinite;
      gap: 48px;
      padding-left: 48px
    }

    .ticker-track span {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      letter-spacing: .18em;
      text-transform: uppercase;
      color: var(--cyan-soft)
    }

    .ticker-track span i {
      color: var(--cyan);
      margin-right: 8px
    }

    @keyframes marquee {
      from {
        transform: translateX(0)
      }

      to {
        transform: translateX(-50%)
      }
    }

    /* ============ HERO ============ */
    .hero {
      padding: 40px 0 28px
    }

    .hero-grid {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      gap: 24px
    }

    @media(max-width:1024px) {
      .hero-grid {
        grid-template-columns: 1fr
      }
    }

    .hero-main {
      position: relative;
      border-radius: 32px;
      padding: 36px;
      overflow: hidden;
      border: 1px solid var(--border-strong);
      background: linear-gradient(135deg, rgba(255, 153, 51, .10), rgba(193, 39, 45, .08)), rgba(26, 13, 46, .6);
      backdrop-filter: blur(24px);
      min-height: 440px;
      display: flex;
      flex-direction: column;
      justify-content: space-between
    }

    .hero-main::before {
      content: "";
      position: absolute;
      inset: 0;
      background: radial-gradient(600px 300px at 80% 10%, rgba(255, 179, 71, .22), transparent 60%);
      pointer-events: none
    }

    .hero-top {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      flex-wrap: wrap;
      position: relative
    }

    .hero-loc {
      display: flex;
      flex-direction: column;
      gap: 6px
    }

    .hero-loc .tag {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      letter-spacing: .32em;
      color: var(--cyan);
      text-transform: uppercase
    }

    .hero-loc h1 {
      font-size: clamp(28px, 4vw, 44px);
      font-weight: 700;
      letter-spacing: -.03em
    }

    .hero-loc .coords {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: var(--muted)
    }

    .hero-time {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: var(--muted);
      text-align: right
    }

    .hero-time strong {
      display: block;
      color: var(--text);
      font-size: 28px;
      font-weight: 500;
      letter-spacing: -.02em;
      margin-bottom: 4px
    }

    .hero-temp {
      display: flex;
      align-items: flex-end;
      gap: 24px;
      flex-wrap: wrap;
      margin: 20px 0;
      position: relative
    }

    .hero-temp .big {
      font-size: clamp(96px, 14vw, 176px);
      line-height: .9;
      font-weight: 200;
      letter-spacing: -.06em;
      background: linear-gradient(180deg, #fff5e1, #c4a878);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent
    }

    .hero-temp .deg {
      position: absolute;
      top: 6px;
      font-size: 32px;
      color: var(--cyan);
      margin-left: 6px
    }

    .hero-temp .desc {
      padding-bottom: 16px
    }

    .hero-temp .desc div:first-child {
      font-size: 22px;
      font-weight: 500
    }

    .hero-temp .desc div:last-child {
      color: var(--muted);
      margin-top: 4px;
      font-size: 14px
    }

    .hero-stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
      position: relative
    }

    @media(max-width:640px) {
      .hero-stats {
        grid-template-columns: repeat(2, 1fr)
      }
    }

    .hstat {
      padding: 14px;
      border-radius: 16px;
      background: rgba(255, 255, 255, .04);
      border: 1px solid var(--border)
    }

    .hstat small {
      display: block;
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px;
      letter-spacing: .24em;
      color: var(--muted);
      text-transform: uppercase;
      margin-bottom: 6px
    }

    .hstat strong {
      font-size: 20px;
      font-weight: 600;
      letter-spacing: -.01em;
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap
    }

    .hstat strong span {
      font-size: 11px;
      color: var(--muted);
      font-weight: 400;
      margin-left: 4px
    }

    .hero-side {
      display: flex;
      flex-direction: column;
      gap: 20px
    }

    .side-card {
      border-radius: 24px;
      padding: 22px;
      background: rgba(26, 13, 46, .55);
      border: 1px solid var(--border);
      backdrop-filter: blur(20px);
      position: relative;
      overflow: hidden
    }

    .side-card h3 {
      font-size: 13px;
      font-family: 'JetBrains Mono', monospace;
      letter-spacing: .18em;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px
    }

    .side-card h3 i {
      color: var(--cyan)
    }

    .ai-text {
      font-size: 15px;
      line-height: 1.65;
      color: #cdd4e8
    }

    .ai-text b {
      color: var(--cyan-soft)
    }

    .solar-wheel {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px
    }

    .solar-arc {
      position: relative;
      width: 130px;
      height: 80px
    }

    .solar-arc svg {
      width: 100%;
      height: 100%
    }

    .solar-arc .sun {
      position: absolute;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: var(--amber);
      box-shadow: 0 0 18px var(--amber);
      top: 38px;
      transform: translate(-50%, -50%)
    }

    .solar-times {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: var(--muted)
    }

    .solar-times b {
      color: var(--text);
      font-size: 13px;
      display: block
    }

    /* ============ SECTION HEADER ============ */
    section {
      padding: 36px 0;
      position: relative;
      z-index: 1
    }

    .shead {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 20px;
      margin-bottom: 24px;
      padding-bottom: 18px;
      border-bottom: 1px solid var(--border);
      flex-wrap: wrap
    }

    .shead h2 {
      font-size: clamp(22px, 3vw, 32px);
      font-weight: 700;
      letter-spacing: -.02em
    }

    .shead small {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      letter-spacing: .28em;
      text-transform: uppercase;
      color: var(--cyan);
      display: block;
      margin-bottom: 8px
    }

    .shead p {
      color: var(--muted);
      font-size: 13px;
      margin-top: 4px
    }

    .shead .right {
      color: var(--cyan);
      font-weight: 600;
      font-size: 13px;
      letter-spacing: .08em;
      text-transform: uppercase
    }

    /* ============ HOURLY ============ */
    .hourly {
      display: flex;
      gap: 12px;
      overflow-x: auto;
      padding-bottom: 8px;
      scroll-snap-type: x mandatory;
      scrollbar-width: thin;
      scrollbar-color: var(--border) transparent
    }

    .hourly::-webkit-scrollbar {
      height: 6px
    }

    .hourly::-webkit-scrollbar-thumb {
      background: var(--border);
      border-radius: 6px
    }

    .hcell {
      flex: 0 0 86px;
      padding: 16px 8px;
      border-radius: 18px;
      background: rgba(26, 13, 46, .5);
      border: 1px solid var(--border);
      text-align: center;
      scroll-snap-align: start;
      transition: .2s
    }

    .hcell.now {
      background: linear-gradient(180deg, rgba(255, 179, 71, .22), rgba(255, 179, 71, .05));
      border-color: var(--cyan);
      box-shadow: var(--glow-cyan)
    }

    .hcell:hover {
      transform: translateY(-3px);
      border-color: var(--border-strong)
    }

    .hcell .t {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: var(--muted);
      margin-bottom: 6px
    }

    .hcell .ic {
      font-size: 22px;
      margin: 6px 0
    }

    .hcell .tp {
      font-size: 18px;
      font-weight: 600
    }

    .hcell .pp {
      font-size: 10px;
      color: var(--cyan-soft);
      margin-top: 4px;
      font-family: 'JetBrains Mono', monospace
    }

    /* ============ CHARTS ============ */
    .chart-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px
    }

    @media(max-width:1024px) {
      .chart-grid {
        grid-template-columns: 1fr
      }
    }

    .chart-card {
      padding: 24px;
      border-radius: 24px;
      background: rgba(26, 13, 46, .55);
      border: 1px solid var(--border);
      backdrop-filter: blur(20px)
    }

    .chart-card h4 {
      font-size: 14px;
      font-family: 'JetBrains Mono', monospace;
      letter-spacing: .18em;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 18px
    }

    .chart-card h4 span {
      color: var(--cyan)
    }

    .cwrap {
      position: relative;
      height: 280px
    }

    /* ============ METRIC GRID ============ */
    .mgrid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 18px
    }

    @media(max-width:1024px) {
      .mgrid {
        grid-template-columns: repeat(2, 1fr)
      }
    }

    @media(max-width:520px) {
      .mgrid {
        grid-template-columns: 1fr 1fr
      }
    }

    .metric {
      padding: 22px;
      border-radius: 22px;
      background: rgba(26, 13, 46, .55);
      border: 1px solid var(--border);
      backdrop-filter: blur(20px);
      position: relative;
      overflow: hidden;
      transition: .25s
    }

    .metric:hover {
      border-color: var(--border-strong);
      transform: translateY(-3px)
    }

    .metric::before {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: radial-gradient(circle, var(--accent, #00f0ff) 0%, transparent 70%);
      opacity: .15;
      transform: translate(40%, -40%)
    }

    .metric .head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px
    }

    .metric .head small {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      letter-spacing: .24em;
      text-transform: uppercase;
      color: var(--muted)
    }

    .metric .head i {
      color: var(--accent, var(--cyan));
      font-size: 14px
    }

    .metric .val {
      font-size: 38px;
      font-weight: 600;
      letter-spacing: -.02em;
      line-height: 1
    }

    .metric .val span {
      font-size: 14px;
      color: var(--muted);
      font-weight: 400;
      margin-left: 4px
    }

    .metric .desc {
      margin-top: 8px;
      font-size: 12px;
      color: var(--muted)
    }

    .metric .bar {
      margin-top: 14px;
      height: 4px;
      border-radius: 4px;
      background: rgba(255, 255, 255, .06);
      overflow: hidden
    }

    .metric .bar i {
      display: block;
      height: 100%;
      background: var(--accent, var(--cyan));
      border-radius: 4px;
      transition: width .8s
    }

    .metric.cyan {
      --accent: #00f0ff
    }

    .metric.violet {
      --accent: #a78bfa
    }

    .metric.aurora {
      --accent: #7dffc5
    }

    .metric.amber {
      --accent: #ffb648
    }

    .metric.red {
      --accent: #ff4d6d
    }

    /* compass */
    .compass {
      width: 100px;
      height: 100px;
      border: 1px solid var(--border-strong);
      border-radius: 50%;
      position: relative;
      margin: 8px auto;
      background: radial-gradient(circle, rgba(255, 179, 71, .10), transparent)
    }

    .compass::before,
    .compass::after {
      content: "";
      position: absolute;
      background: var(--border)
    }

    .compass::before {
      width: 1px;
      height: 100%;
      left: 50%;
      top: 0
    }

    .compass::after {
      width: 100%;
      height: 1px;
      left: 0;
      top: 50%
    }

    .compass .needle {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 2px;
      height: 42px;
      background: linear-gradient(180deg, var(--cyan), transparent);
      transform-origin: bottom center;
      transform: translate(-50%, -100%) rotate(0deg);
      transition: transform .8s
    }

    .compass .center {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--cyan);
      transform: translate(-50%, -50%);
      box-shadow: 0 0 12px var(--cyan)
    }

    .compass span {
      position: absolute;
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px;
      color: var(--muted)
    }

    .compass .n {
      top: 4px;
      left: 50%;
      transform: translateX(-50%)
    }

    .compass .s {
      bottom: 4px;
      left: 50%;
      transform: translateX(-50%)
    }

    .compass .e {
      right: 4px;
      top: 50%;
      transform: translateY(-50%)
    }

    .compass .w {
      left: 4px;
      top: 50%;
      transform: translateY(-50%)
    }

    /* ============ EARTH VIZ (Branding removed) ============ */
    .earth-viz-section {
      margin: 20px 0 40px;
      position: relative;
      z-index: 2
    }

    .earth-container {
      position: relative;
      border-radius: 36px;
      overflow: hidden;
      border: 1px solid var(--border-strong);
      background: #0a0612;
      box-shadow: 0 20px 60px -20px rgba(0, 0, 0, .8), 0 0 0 1px rgba(255, 179, 71, .14) inset, 0 0 40px rgba(255, 179, 71, .18);
      transition: box-shadow .3s
    }

    .earth-container:hover {
      box-shadow: 0 20px 70px -15px rgba(255, 179, 71, .25), 0 0 0 1px rgba(255, 179, 71, .35) inset, var(--glow-cyan)
    }

    .earth-iframe {
      display: block;
      width: 100%;
      height: 82vh;
      min-height: 580px;
      border: none;
      background: #0a0612;
      filter: brightness(1.02) contrast(1.05)
    }

    .earth-overlay {
      position: absolute;
      bottom: 20px;
      left: 20px;
      background: rgba(10, 6, 18, .72);
      backdrop-filter: blur(16px);
      border-radius: 32px;
      padding: 8px 20px;
      border-left: 3px solid var(--cyan);
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      letter-spacing: .14em;
      color: var(--cyan-soft);
      pointer-events: none;
      z-index: 3
    }

    .earth-overlay i {
      margin-right: 8px
    }

    /* Removed attribution div containing Chinese text */
    @media(max-width:768px) {
      .earth-iframe {
        height: 65vh;
        min-height: 420px
      }

      .earth-overlay {
        font-size: 8px;
        padding: 6px 14px
      }
    }


    /* Cover external iframe branding/menu (cross-origin: we can't modify content, only overlay) */
    .earth-container {
      position: relative
    }

    .earth-mask {
      position: absolute;
      background: #0a0612;
      z-index: 4;
      pointer-events: auto;
      border: 1px solid rgba(255, 200, 120, .18)
    }

    .earth-mask.tl {
      top: 0;
      left: 0;
      width: 230px;
      height: 64px;
      border-top-left-radius: 36px;
      background: linear-gradient(135deg, #0a0612 60%, rgba(10, 6, 18, .85))
    }

    .earth-mask.bl {
      bottom: 0;
      left: 0;
      width: 340px;
      height: 54px;
      border-bottom-left-radius: 36px;
      background: linear-gradient(45deg, #0a0612 70%, rgba(10, 6, 18, .9))
    }

    .earth-mask.br {
      bottom: 0;
      right: 0;
      width: 170px;
      height: 46px;
      border-bottom-right-radius: 36px;
      background: linear-gradient(-45deg, #0a0612 70%, rgba(10, 6, 18, .9))
    }

    .earth-mask .lbl {
      position: absolute;
      left: 18px;
      top: 50%;
      transform: translateY(-50%);
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      letter-spacing: .18em;
      color: var(--cyan-soft);
      text-transform: uppercase
    }

    .earth-mask.br .lbl {
      left: auto;
      right: 14px;
      color: var(--muted)
    }

    @media(max-width:768px) {
      .earth-mask.tl {
        width: 160px;
        height: 50px
      }

      .earth-mask.bl {
        width: 240px;
        height: 44px
      }

      .earth-mask.br {
        width: 120px;
        height: 38px
      }

      .earth-mask .lbl {
        font-size: 9px
      }
    }

    /* ============ NEWS ============ */
    .news-toolbar {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 20px;
      align-items: center
    }

    .news-search {
      flex: 1;
      min-width: 220px;
      position: relative
    }

    .news-search input {
      width: 100%;
      padding: 12px 14px 12px 42px;
      border-radius: 14px;
      background: var(--glass);
      border: 1px solid var(--border);
      color: var(--text);
      font-size: 14px;
      outline: none
    }

    .news-search input:focus {
      border-color: var(--cyan)
    }

    .news-search i {
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--muted)
    }

    .chip {
      padding: 9px 16px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      border: 1px solid var(--border);
      color: var(--muted);
      background: var(--glass);
      transition: .18s;
      display: inline-flex;
      align-items: center;
      gap: 6px
    }

    .chip:hover {
      color: var(--text);
      border-color: var(--border-strong)
    }

    .chip.active {
      background: var(--cyan);
      color: #1a0d2e;
      border-color: var(--cyan)
    }

    .bbc-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--bbc);
      color: #fff;
      font-weight: 800;
      font-size: 10px;
      padding: 4px 8px;
      border-radius: 4px;
      letter-spacing: .1em;
      font-family: 'Inter', sans-serif
    }

    .news-breaking {
      background: linear-gradient(90deg, rgba(187, 25, 25, .18), rgba(187, 25, 25, .04));
      border: 1px solid rgba(187, 25, 25, .4);
      border-radius: 14px;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 20px;
      overflow: hidden
    }

    .news-breaking .pill {
      background: var(--bbc);
      color: #fff;
      font-weight: 800;
      font-size: 10px;
      padding: 5px 10px;
      border-radius: 6px;
      letter-spacing: .14em;
      flex-shrink: 0
    }

    .news-breaking .scroll {
      flex: 1;
      overflow: hidden;
      white-space: nowrap
    }

    .news-breaking .scroll div {
      display: inline-block;
      animation: marquee 45s linear infinite;
      font-size: 13px;
      color: #f5d9d9
    }

    .news-breaking .scroll div span {
      margin: 0 24px
    }

    .news-layout {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      gap: 24px
    }

    @media(max-width:1024px) {
      .news-layout {
        grid-template-columns: 1fr
      }
    }

    .featured {
      position: relative;
      border-radius: 24px;
      overflow: hidden;
      border: 1px solid var(--border-strong);
      background: rgba(26, 13, 46, .55);
      min-height: 420px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      cursor: pointer;
      transition: .25s
    }

    .featured:hover {
      transform: translateY(-4px)
    }

    .featured img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: brightness(.5)
    }

    .featured::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, transparent 30%, rgba(5, 7, 13, .95) 100%)
    }

    .featured .meta {
      position: relative;
      z-index: 2;
      padding: 28px
    }

    .featured .meta h3 {
      font-size: clamp(20px, 2.4vw, 28px);
      font-weight: 700;
      letter-spacing: -.01em;
      margin: 12px 0 10px;
      text-wrap: balance
    }

    .featured .meta p {
      color: #b8c0d4;
      font-size: 14px;
      line-height: 1.55;
      display: -webkit-box;
      line-clamp: 2;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden
    }

    .featured .meta .row {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--muted);
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: .14em;
      margin-top: 14px
    }

    .trending {
      display: flex;
      flex-direction: column;
      gap: 14px
    }

    .trending h4 {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      letter-spacing: .24em;
      text-transform: uppercase;
      color: var(--cyan);
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 8px
    }

    .tr-item {
      display: flex;
      gap: 14px;
      padding: 14px;
      border-radius: 14px;
      background: rgba(26, 13, 46, .55);
      border: 1px solid var(--border);
      cursor: pointer;
      transition: .2s
    }

    .tr-item:hover {
      border-color: var(--border-strong);
      transform: translateX(4px);
      background: var(--glass-strong)
    }

    .tr-item .num {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 28px;
      font-weight: 700;
      color: var(--cyan);
      line-height: 1;
      min-width: 32px
    }

    .tr-item .body h5 {
      font-size: 13px;
      font-weight: 600;
      line-height: 1.4;
      margin-bottom: 6px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden
    }

    .tr-item .body small {
      font-family: 'JetBrains Mono', monospace;
      color: var(--muted);
      font-size: 10px;
      letter-spacing: .14em;
      text-transform: uppercase
    }

    .news-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 22px;
      margin-top: 28px
    }

    @media(max-width:1024px) {
      .news-grid {
        grid-template-columns: repeat(2, 1fr)
      }
    }

    @media(max-width:640px) {
      .news-grid {
        grid-template-columns: 1fr
      }
    }

    .ncard {
      border-radius: 22px;
      overflow: hidden;
      background: rgba(26, 13, 46, .55);
      border: 1px solid var(--border);
      cursor: pointer;
      transition: .25s;
      display: flex;
      flex-direction: column
    }

    .ncard:hover {
      transform: translateY(-4px);
      border-color: var(--border-strong);
      box-shadow: var(--shadow)
    }

    .ncard .ic {
      aspect-ratio: 16/10;
      background: #140a1f;
      position: relative;
      overflow: hidden
    }

    .ncard .ic img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: .5s;
      filter: grayscale(.3) brightness(.9)
    }

    .ncard:hover .ic img {
      transform: scale(1.06);
      filter: grayscale(0) brightness(1)
    }

    .ncard .ic .badge {
      position: absolute;
      top: 12px;
      left: 12px
    }

    .ncard .body {
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1
    }

    .ncard .body .cat {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      letter-spacing: .18em;
      text-transform: uppercase;
      color: var(--cyan)
    }

    .ncard .body h4 {
      font-size: 16px;
      font-weight: 600;
      line-height: 1.4;
      text-wrap: balance;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden
    }

    .ncard .body p {
      font-size: 13px;
      color: var(--muted);
      line-height: 1.55;
      display: -webkit-box;
      line-clamp: 2;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden
    }

    .ncard .body .foot {
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      letter-spacing: .12em;
      text-transform: uppercase;
      color: var(--muted);
      padding-top: 8px
    }

    .news-loading {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 22px;
      margin-top: 28px
    }

    .skel {
      aspect-ratio: 4/5;
      border-radius: 22px;
      background: linear-gradient(110deg, rgba(26, 13, 46, .6) 10%, rgba(255, 255, 255, .04) 30%, rgba(26, 13, 46, .6) 50%);
      background-size: 200% 100%;
      animation: shimmer 1.6s linear infinite
    }

    @keyframes shimmer {
      from {
        background-position: 200% 0
      }

      to {
        background-position: -200% 0
      }
    }

    footer {
      padding: 48px 0 32px;
      border-top: 1px solid var(--border);
      margin-top: 48px;
      background: rgba(10, 6, 18, .5)
    }

    .foot {
      display: flex;
      justify-content: space-between;
      gap: 24px;
      flex-wrap: wrap;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: var(--muted);
      letter-spacing: .14em;
      text-transform: uppercase
    }

    .foot a {
      color: var(--cyan)
    }

    .toast {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(120%);
      background: rgba(26, 13, 46, .95);
      border: 1px solid var(--border-strong);
      backdrop-filter: blur(20px);
      padding: 14px 22px;
      border-radius: 14px;
      color: var(--text);
      font-size: 13px;
      z-index: 9999;
      transition: .4s;
      box-shadow: var(--shadow)
    }

    .toast.show {
      transform: translateX(-50%) translateY(0)
    }

    .loader {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid var(--border);
      border-top-color: var(--cyan);
      border-radius: 50%;
      animation: spin .8s linear infinite
    }

    @keyframes spin {
      to {
        transform: rotate(360deg)
      }
    }

    @media(max-width:640px) {
      .container {
        padding: 0 16px
      }

      .hero-main {
        padding: 24px;
        border-radius: 24px
      }

      .side-card {
        padding: 18px
      }
    }
  </style>
</head>

<body>
  <div class="aurora"><b></b><b></b><b></b></div>
  <nav class="nav">
    <div class="container nav-inner">
      <div class="brand">
        <div class="brand-mark"><i class="fa-solid fa-eye"></i></div>
        <div class="brand-text"><small>वायुनेत्र</small><strong>VAYUNETRA</strong></div>
      </div>
      <div class="search"><i class="fa-solid fa-magnifying-glass"></i><input id="locSearch" type="search"
          placeholder="Search any city, region, or coordinate…" autocomplete="off" />
        <div class="search-results" id="searchResults"></div>
      </div>
      <div class="nav-actions"><button class="live-btn"
          onclick="document.getElementById('earthViz').scrollIntoView({behavior:'smooth'})"><span
            class="live-dot"></span>Earth Observatory</button></div>
    </div>
  </nav>
  <div class="ticker">
    <div class="ticker-track" id="ticker"><span><i class="fa-solid fa-satellite-dish"></i>Initializing telemetry
        feed…</span></div>
  </div>

  <section class="hero">
    <div class="container">
      <div class="hero-grid">
        <div class="hero-main">
          <div class="hero-top">
            <div class="hero-loc">
              <div class="tag"><i class="fa-solid fa-location-crosshairs"></i><span>Sector · Active Station</span></div>
              <h1 id="locName" class="display">Loading…</h1>
              <div class="coords" id="locCoords">LAT — · LON —</div>
            </div>
            <div class="hero-time"><strong id="clock">--:--</strong><span id="dateLine">—</span></div>
          </div>
          <div class="hero-temp">
            <div style="position:relative"><span class="big" id="bigTemp">—</span><span class="deg mono">°C</span></div>
            <div class="desc">
              <div id="condText">—</div>
              <div id="feelsLine">Feels like —°</div>
            </div>
          </div>
          <div class="hero-stats">
            <div class="hstat"><small>AQI</small><strong id="hAqi">—<span id="hAqiTier"></span></strong></div>
            <div class="hstat"><small>UV Index</small><strong id="hUv">—</strong></div>
            <div class="hstat"><small>Wind</small><strong id="hWind">—<span>km/h</span></strong></div>
            <div class="hstat"><small>Humidity</small><strong id="hHum">—<span>%</span></strong></div>
          </div>
        </div>
        <div class="hero-side">
          <div class="side-card">
            <h3><i class="fa-solid fa-wand-magic-sparkles"></i>Atmospheric AI Brief</h3>
            <p class="ai-text" id="aiText">Analysing live atmospheric telemetry…</p>
          </div>
          <div class="side-card">
            <h3><i class="fa-solid fa-sun"></i>Solar Cycle</h3>
            <div class="solar-wheel">
              <div class="solar-arc"><svg viewBox="0 0 130 80">
                  <path d="M 10 70 A 55 55 0 0 1 120 70" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="2" />
                  <path id="solarPath" d="M 10 70 A 55 55 0 0 1 120 70" fill="none" stroke="url(#sg)" stroke-width="2"
                    stroke-dasharray="180" stroke-dashoffset="180" />
                  <defs>
                    <linearGradient id="sg" x1="0" x2="1">
                      <stop offset="0%" stop-color="#ffb648" />
                      <stop offset="100%" stop-color="#ff5cd1" />
                    </linearGradient>
                  </defs>
                </svg>
                <div class="sun" id="sunMarker" style="left:10px"></div>
              </div>
              <div class="solar-times"><span>Sunrise <b id="sunrise">—</b></span><span>Sunset <b
                    id="sunset">—</b></span><span>Daylight <b id="daylight">—</b></span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section>
    <div class="container">
      <div class="shead">
        <div><small>24-hour atmospheric timeline</small>
          <h2 class="display">Hourly Forecast</h2>
          <p>Temperature, precipitation probability and wind across the next day</p>
        </div><a class="right" href="#charts">Trend analysis →</a>
      </div>
      <div class="hourly" id="hourly"></div>
    </div>
  </section>

  <section id="charts">
    <div class="container">
      <div class="shead">
        <div><small>10-day atmospheric trends</small>
          <h2 class="display">Forecast Intelligence</h2>
          <p>Thermal envelopes, precipitation accumulation and UV exposure</p>
        </div><span class="right mono">Open-Meteo · ECMWF · GFS</span>
      </div>
      <div class="chart-grid">
        <div class="chart-card">
          <h4>Thermal Envelope <span>· °C</span></h4>
          <div class="cwrap"><canvas id="tempChart"></canvas></div>
        </div>
        <div class="chart-card">
          <h4>Precipitation <span>· mm</span></h4>
          <div class="cwrap"><canvas id="precipChart"></canvas></div>
        </div>
      </div>
    </div>
  </section>

  <section>
    <div class="container">
      <div class="shead">
        <div><small>Pollutants · Vectors · Pressure · Visibility</small>
          <h2 class="display">Atmospheric Command Centre</h2>
          <p>Comprehensive readings across every measurable air column</p>
        </div>
      </div>
      <div class="mgrid">
        <div class="metric cyan">
          <div class="head"><small>PM2.5 · µg/m³</small><i class="fa-solid fa-smog"></i></div>
          <div class="val" id="mPm25">—</div>
          <div class="desc" id="mPm25Desc">Fine particulate matter</div>
          <div class="bar"><i id="mPm25Bar" style="width:0%"></i></div>
        </div>
        <div class="metric violet">
          <div class="head"><small>PM10 · µg/m³</small><i class="fa-solid fa-wind"></i></div>
          <div class="val" id="mPm10">—</div>
          <div class="desc">Coarse particulate matter</div>
          <div class="bar"><i id="mPm10Bar" style="width:0%"></i></div>
        </div>
        <div class="metric aurora">
          <div class="head"><small>Ozone O₃</small><i class="fa-solid fa-circle-radiation"></i></div>
          <div class="val" id="mO3">—</div>
          <div class="desc">Tropospheric ozone</div>
          <div class="bar"><i id="mO3Bar" style="width:0%"></i></div>
        </div>
        <div class="metric amber">
          <div class="head"><small>NO₂ · µg/m³</small><i class="fa-solid fa-industry"></i></div>
          <div class="val" id="mNo2">—</div>
          <div class="desc">Nitrogen dioxide</div>
          <div class="bar"><i id="mNo2Bar" style="width:0%"></i></div>
        </div>
        <div class="metric cyan">
          <div class="head"><small>Wind Vector</small><i class="fa-solid fa-location-arrow"></i></div>
          <div class="val" id="mWind">—<span>km/h</span></div>
          <div class="compass"><span class="n">N</span><span class="s">S</span><span class="e">E</span><span
              class="w">W</span>
            <div class="needle" id="windNeedle"></div>
            <div class="center"></div>
          </div>
        </div>
        <div class="metric violet">
          <div class="head"><small>Pressure · hPa</small><i class="fa-solid fa-gauge-high"></i></div>
          <div class="val" id="mPress">—</div>
          <div class="desc" id="mPressDesc">Sea-level pressure</div>
          <div class="bar"><i id="mPressBar" style="width:0%"></i></div>
        </div>
        <div class="metric aurora">
          <div class="head"><small>Cloud Cover</small><i class="fa-solid fa-cloud"></i></div>
          <div class="val" id="mCloud">—<span>%</span></div>
          <div class="desc">Total sky obscuration</div>
          <div class="bar"><i id="mCloudBar" style="width:0%"></i></div>
        </div>
        <div class="metric amber">
          <div class="head"><small>Apparent Temp</small><i class="fa-solid fa-temperature-three-quarters"></i></div>
          <div class="val" id="mFeels">—<span>°C</span></div>
          <div class="desc" id="mFeelsDesc">Perceived temperature</div>
          <div class="bar"><i id="mFeelsBar" style="width:0%"></i></div>
        </div>
      </div>
    </div>
  </section>
  <section class="gk-section">
    <div class="container">
      <div class="shead">
        <div>
          <small>weather literacy & essential facts</small>
          <h2 class="display">Atmospheric General Knowledge</h2>
          <p>Basic weather phenomena, meteorological terms and atmospheric science</p>
        </div>
        <span class="right mono"><i class="fa-regular fa-compass"></i> reference hub</span>
      </div>
      <div style="overflow-x: auto; border-radius: 24px;">
        <table class="gk-table">
          <thead>
            <tr>
              <th>Weather Element / Term</th>
              <th>General Knowledge & Explanation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding:12px 18px;">🌊 Jet Stream</td>
              <td style="padding:12px 18px;">Narrow bands of strong high-altitude wind (8–12 km) that steer weather
                systems and influence storm tracks across hemispheres.</td>
            </tr>
            <tr>
              <td style="padding:12px 18px;">💧 Atmospheric River</td>
              <td style="padding:12px 18px;">Long, narrow corridors of intense moisture transport – responsible for up
                to 50% of West Coast precipitation and extreme flooding events.</td>
            </tr>
            <tr>
              <td style="padding:12px 18px;">🌡️ Heat Index</td>
              <td style="padding:12px 18px;">"Feels-like" temperature combining actual heat and relative humidity; above
                40°C can cause heat stress & heatstroke risks.</td>
            </tr>
            <tr>
              <td style="padding:12px 18px;">❄️ Wind Chill</td>
              <td style="padding:12px 18px;">Perceived temperature drop due to wind removing body heat; minus wind chill
                leads to rapid frostbite in arctic conditions.</td>
            </tr>
            <tr>
              <td style="padding:12px 18px;">💨 Dew Point</td>
              <td style="padding:12px 18px;">The temperature at which air becomes fully saturated; higher dew point
                (>18°C) indicates oppressive humidity and thunderstorm potential.</td>
            </tr>
            <tr>
              <td style="padding:12px 18px;">⚡ CAPE (Instability)</td>
              <td style="padding:12px 18px;">Convective Available Potential Energy – measures atmospheric instability.
                Values above 2000 J/kg often trigger severe thunderstorms and tornadoes.</td>
            </tr>
            <tr>
              <td style="padding:12px 18px;">🌈 Virga</td>
              <td style="padding:12px 18px;">Precipitation that evaporates before reaching the ground, visible as wispy
                trailing streaks beneath clouds, common in dry climates.</td>
            </tr>
            <tr>
              <td style="padding:12px 18px;">🌀 Haboob</td>
              <td style="padding:12px 18px;">Intense dust storm driven by thunderstorm outflow winds; can reach heights
                of 1500m and reduce visibility to near-zero instantly.</td>
            </tr>
            <tr>
              <td style="padding:12px 18px;">🌪️ Supercell</td>
              <td style="padding:12px 18px;">Highly organized thunderstorm with a rotating mesocyclone – most violent
                weather producer: large hail, downbursts, and EF2+ tornadoes.</td>
            </tr>
            <tr>
              <td style="padding:12px 18px;">🌙 Monsoon</td>
              <td style="padding:12px 18px;">Seasonal wind reversal causing pronounced wet/dry spells; the Indian
                monsoon delivers 80% of South Asia's annual rainfall.</td>
            </tr>
            <tr>
              <td style="padding:12px 18px;">❄️ Polar Vortex</td>
              <td style="padding:12px 18px;">Persistent large-scale cyclonic circulation near poles; when it weakens,
                arctic air plunges into mid-latitudes triggering extreme cold spells.</td>
            </tr>
            <tr>
              <td style="padding:12px 18px;">🌫️ Radiation Fog</td>
              <td style="padding:12px 18px;">Forms on clear, calm nights when ground cools rapidly, condensing moisture
                near surface – common in valleys and often dissipates after sunrise.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
  <!-- Earth Visualization (branding and Chinese text removed) -->
  <div class="earth-viz-section" id="earthViz">
    <div class="container">
      <div class="shead">
        <div><small>NASA-style earth observatory</small>
          <h2 class="display">Global Synoptic View</h2>
          <p>Real-time atmospheric simulation & ocean currents</p>
        </div><span class="right mono">Global wind & weather simulation</span>
      </div>
      <div class="earth-container"><iframe class="earth-iframe" src="https://earth.nullschool.net/"
          title="Atmospheric global visualization" allowfullscreen loading="lazy"></iframe>
        <div class="earth-mask tl"><span class="lbl"><i class="fa-solid fa-satellite"></i> VAYUNETRA · ORBITAL</span>
        </div>
        <div class="earth-mask bl"><span class="lbl"><i class="fa-solid fa-earth-asia"></i> Global Wind &amp; Weather ·
            Live</span></div>
        <div class="earth-mask br"><span class="lbl">SYNOPTIC FEED</span></div>
        <div class="earth-overlay" style="left:auto;right:20px;bottom:70px"><i class="fa-solid fa-earth-asia"></i> LIVE
          EARTH · WIND &amp; WEATHER</div>
      </div>
    </div>
  </div>

  <section id="news">
    <div class="container">
      <div class="shead">
        <div><small>Global climate &amp; weather intelligence</small>
          <h2 class="display">Environmental Brief</h2>
          <p>Real-time monitoring · BBC News Science &amp; Environment</p>
        </div><a class="right" href="https://www.bbc.com/news/science_and_environment" target="_blank"
          rel="noopener">View global archive →</a>
      </div>
      <div class="news-breaking"><span class="pill">BBC · BREAKING</span>
        <div class="scroll">
          <div id="breakingScroll">Loading live environmental intelligence…</div>
        </div>
      </div>
      <div class="news-toolbar">
        <div class="news-search"><i class="fa-solid fa-magnifying-glass"></i><input id="newsSearch" type="search"
            placeholder="Search BBC environmental news…" /></div><button class="chip active" data-cat="all"><i
            class="fa-solid fa-globe"></i>All</button><button class="chip" data-cat="science"><i
            class="fa-solid fa-atom"></i>Science</button><button class="chip" data-cat="climate"><i
            class="fa-solid fa-leaf"></i>Climate</button><button class="chip" data-cat="weather"><i
            class="fa-solid fa-cloud-bolt"></i>Weather</button><button class="chip" data-cat="world"><i
            class="fa-solid fa-earth-americas"></i>World</button>
      </div>
      <div class="news-layout">
        <div id="featuredWrap">
          <div class="featured" style="background:rgba(26,13,46,.55)">
            <div class="meta"><span class="bbc-badge">BBC</span>
              <h3>Loading featured story…</h3>
              <p>Connecting to BBC RSS intelligence feed.</p>
            </div>
          </div>
        </div>
        <div class="trending">
          <h4><i class="fa-solid fa-chart-line"></i>Trending Now</h4>
          <div id="trendingList">
            <div class="skel" style="aspect-ratio:5/1;border-radius:14px"></div>
          </div>
        </div>
      </div>
      <div id="newsGrid" class="news-loading">
        <div class="skel"></div>
        <div class="skel"></div>
        <div class="skel"></div>
      </div>
    </div>
  </section>

  <footer>
    <div class="container foot">
      <div>© 2026 Vayunetra · Atmospheric Intelligence System</div>
      <div>Data <a href="https://open-meteo.com" target="_blank" rel="noopener">Open-Meteo</a> · <a
          href="https://www.bbc.com/news" target="_blank">BBC News</a></div>
      <div>Build 2026.06 · v4.0</div>
    </div>
  </footer>
  <div class="toast" id="toast"></div>

  <script>
    /* VAYUNETRA — Fixed Backend: Robust error handling, API resilience, UI fallbacks */
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => [...r.querySelectorAll(s)];
    const toast = (msg) => { const t = $("#toast"); if(t) { t.textContent = msg; t.classList.add("show"); clearTimeout(window.__toast); window.__toast = setTimeout(() => t.classList.remove("show"), 2800); } };
    const fmtTime = (iso) => { if (!iso) return "--:--"; try { return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); } catch (e) { return "--:--"; } };
    const compass = (deg) => ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"][Math.round(((deg % 360) / 22.5)) % 16];
    const aqiTier = (v) => { if (v <= 20) return { label: "Excellent", color: "#7dffc5" }; if (v <= 40) return { label: "Good", color: "#a8ff80" }; if (v <= 60) return { label: "Moderate", color: "#ffb648" }; if (v <= 80) return { label: "Poor", color: "#ff8a5b" }; if (v <= 100) return { label: "Very Poor", color: "#ff4d6d" }; return { label: "Hazardous", color: "#ff5cd1" }; };
    const getUvRisk = (val) => { const n = parseFloat(val); if (isNaN(n)) return { label: "N/A", color: "#c4a878" }; if (n <= 2) return { label: "Low", color: "#7dffc5" }; if (n <= 5) return { label: "Moderate", color: "#ffb648" }; if (n <= 7) return { label: "High", color: "#ff8a5b" }; if (n <= 10) return { label: "Very High", color: "#ff4d6d" }; return { label: "Extreme", color: "#a78bfa" }; };
    const codeMap = { 0: ["Clear sky", "☀️"], 1: ["Mainly clear", "🌤️"], 2: ["Partly cloudy", "⛅"], 3: ["Overcast", "☁️"], 45: ["Fog", "🌫️"], 48: ["Rime fog", "🌫️"], 51: ["Light drizzle", "🌦️"], 53: ["Drizzle", "🌧️"], 55: ["Dense drizzle", "🌧️"], 61: ["Light rain", "🌦️"], 63: ["Rain", "🌧️"], 65: ["Heavy rain", "🌧️"], 71: ["Light snow", "🌨️"], 73: ["Snow", "🌨️"], 75: ["Heavy snow", "❄️"], 80: ["Rain showers", "🌦️"], 81: ["Showers", "🌧️"], 82: ["Violent showers", "⛈️"], 95: ["Thunderstorm", "⛈️"], 96: ["Thunder + hail", "⛈️"], 99: ["Severe thunder", "⛈️"] };

    const state = { location: { name: "${initialCityName.replace(/"/g, '\\"')}", country: "India", admin1: "${initialAdmin.replace(/"/g, '\\"')}", latitude: 20.4625, longitude: 85.8828, timezone: "Asia/Kolkata" }, weather: null, news: [], newsFiltered: [], newsCat: "all", newsQuery: "" };
    function startClock() { const tick = () => { const d = new Date(); if($("#clock")) $("#clock").textContent = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); if($("#dateLine")) $("#dateLine").textContent = d.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" }); }; tick(); setInterval(tick, 30000); }

    let searchTimer;
    async function geocode(q) {
      if (!q || q.length < 2) { if($("#searchResults")) $("#searchResults").classList.remove("open"); return; }
      try {
        const r = await fetch(\`https://geocoding-api.open-meteo.com/v1/search?name=\${encodeURIComponent(q)}&count=12&language=en&format=json\`);
        if (!r.ok) throw new Error("Geo failed");
        const j = await r.json();
        let list = j.results || [];
        const lowerQ = q.toLowerCase();
        list.sort((a, b) => {
          const aInd = a.country === "India" ? 2 : (a.country?.toLowerCase() === "india" ? 2 : 0);
          const bInd = b.country === "India" ? 2 : (b.country?.toLowerCase() === "india" ? 2 : 0);
          if (aInd !== bInd) return bInd - aInd;
          const aExact = a.name.toLowerCase() === lowerQ ? 1 : 0;
          const bExact = b.name.toLowerCase() === lowerQ ? 1 : 0;
          if (aExact !== bExact) return bExact - aExact;
          return 0;
        });
        const wrap = $("#searchResults");
        if (!wrap) return;
        if (!list.length) { wrap.innerHTML = \`<div class="sr-item"><span>No matches</span></div>\`; wrap.classList.add("open"); return; }
        wrap.innerHTML = list.map(g => \`<div class="sr-item" data-lat="\${g.latitude}" data-lon="\${g.longitude}" data-name="\${g.name}" data-country="\${g.country}" data-admin="\${g.admin1 || ''}" data-tz="\${g.timezone}"><span><strong>\${g.name}</strong>\${g.admin1 ? ", " + g.admin1 : ""}</span><small>\${g.country}</small></div>\`).join("");
        wrap.classList.add("open");
        $$(".sr-item", wrap).forEach(el => el.addEventListener("click", () => { const d = el.dataset; selectLocation({ name: d.name, country: d.country, admin1: d.admin, latitude: +d.lat, longitude: +d.lon, timezone: d.tz }); wrap.classList.remove("open"); if($("#locSearch")) $("#locSearch").value = ""; }));
      } catch (e) { console.error(e); toast("Search unavailable"); }
    }
    if($("#locSearch")) $("#locSearch").addEventListener("input", e => { clearTimeout(searchTimer); searchTimer = setTimeout(() => geocode(e.target.value), 280); });
    document.addEventListener("click", e => { if (!e.target.closest(".search")) if($("#searchResults")) $("#searchResults").classList.remove("open"); });
    function selectLocation(loc) { state.location = loc; loadWeather(); toast(\`Tracking \${loc.name}\`); }

    async function loadWeather() {
      const { latitude: lat, longitude: lon } = state.location;
      const wUrl = \`https://api.open-meteo.com/v1/forecast?latitude=\${lat}&longitude=\${lon}&timezone=auto&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code,is_day,pressure_msl,cloud_cover&hourly=temperature_2m,precipitation_probability,wind_speed_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset,uv_index_max&forecast_days=10\`;
      const aUrl = \`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=\${lat}&longitude=\${lon}&current=european_aqi,pm2_5,pm10,nitrogen_dioxide,ozone,carbon_monoxide&timezone=auto\`;
      try {
        const [wRes, aRes] = await Promise.allSettled([fetch(wUrl), fetch(aUrl)]);
        if (wRes.status !== "fulfilled" || !wRes.value.ok) throw new Error("Weather API failed");
        const w = await wRes.value.json();
        let a = null;
        if (aRes.status === "fulfilled" && aRes.value.ok) a = await aRes.value.json();
        if (!w.current || !w.daily) throw new Error("Incomplete weather data");
        state.weather = { w, a };
        renderWeather();
      } catch (e) {
        console.error(e);
        state.weather = null;
        toast("Weather service temporarily unavailable");
        renderWeatherError();
      }
    }

    function renderWeatherError() {
      if($("#locName")) $("#locName").innerHTML = state.location.name || "Unavailable";
      if($("#bigTemp")) $("#bigTemp").innerHTML = "—";
      if($("#condText")) $("#condText").innerHTML = "⚠️ Data offline";
      if($("#feelsLine")) $("#feelsLine").innerHTML = "Feels like —° · retry soon";
      if($("#hWind")) $("#hWind").innerHTML = "—";
      if($("#hHum")) $("#hHum").innerHTML = "—";
      if($("#hUv")) $("#hUv").innerHTML = "—";
      if($("#hAqi")) $("#hAqi").innerHTML = "—";
      if($("#aiText")) $("#aiText").innerHTML = \`Atmospheric feed interrupted for \${state.location.name}. Check connection or refresh.\`;
      if($("#sunrise")) $("#sunrise").textContent = "--:--";
      if($("#sunset")) $("#sunset").textContent = "--:--";
      if($("#daylight")) $("#daylight").textContent = "—";
      if($("#hourly")) $("#hourly").innerHTML = \`<div class="hcell"><div class="t">Error</div><div class="ic">⚠️</div><div class="tp">—</div></div>\`;
      ["mPm25", "mPm10", "mO3", "mNo2", "mPress", "mCloud", "mFeels"].forEach(id => { const el = $("#" + id); if (el) el.innerHTML = "—"; });
      if (window.tempChart) tempChart.destroy();
      if (window.precipChart) precipChart.destroy();
    }

    function getCurrentUV(data) {
      if (!data?.hourly?.time || !data.hourly.uv_index) return null;
      const times = data.hourly.time;
      const uvArr = data.hourly.uv_index;
      const now = new Date();
      let idx = -1;
      for (let i = 0; i < times.length; i++) {
        if (new Date(times[i]) <= now) idx = i;
        else break;
      }
      if (idx >= 0 && uvArr[idx] !== undefined && uvArr[idx] !== null) return uvArr[idx];
      return null;
    }

    function renderWeather() {
      if (!state.weather || !state.weather.w || !state.weather.w.current) {
        renderWeatherError();
        return;
      }
      const { w, a } = state.weather;
      const loc = state.location;
      const c = w.current;
      const [label, icon] = codeMap[c.weather_code] || ["Unknown", "❔"];
      if($("#locName")) $("#locName").innerHTML = \`\${loc.name}\${loc.admin1 ? ", " + loc.admin1 : ""}\`;
      if($("#locCoords")) $("#locCoords").innerHTML = \`LAT \${loc.latitude.toFixed(3)}° · LON \${loc.longitude.toFixed(3)}° · \${loc.timezone}\`;
      if($("#bigTemp")) $("#bigTemp").innerHTML = Math.round(c.temperature_2m);
      if($("#condText")) $("#condText").innerHTML = \`\${icon} \${label}\`;
      if($("#feelsLine")) $("#feelsLine").innerHTML = \`Feels like \${Math.round(c.apparent_temperature)}° · \${loc.country}\`;
      if($("#hWind")) $("#hWind").innerHTML = \`\${Math.round(c.wind_speed_10m)} <span>km/h \${compass(c.wind_direction_10m)}</span>\`;
      if($("#hHum")) $("#hHum").innerHTML = \`\${Math.round(c.relative_humidity_2m)}<span>%</span>\`;
      const uvCurrent = getCurrentUV(w);
      if (uvCurrent !== null && !isNaN(uvCurrent)) {
        const uvVal = Number(uvCurrent).toFixed(1);
        const risk = getUvRisk(uvCurrent);
        if($("#hUv")) $("#hUv").innerHTML = \`\${uvVal}<span style="color:\${risk.color}; font-size:12px;"> \${risk.label}</span>\`;
      } else { if($("#hUv")) $("#hUv").innerHTML = \`<span style="color:var(--muted)">Data Unavailable</span>\`; }
      if (a?.current) {
        const t = aqiTier(a.current.european_aqi);
        if($("#hAqi")) $("#hAqi").innerHTML = \`\${Math.round(a.current.european_aqi)} <span style="color:\${t.color}">\${t.label}</span>\`;
        setMetric("Pm25", a.current.pm2_5, 75, " µg/m³");
        setMetric("Pm10", a.current.pm10, 150, " µg/m³");
        setMetric("O3", a.current.ozone, 240, " µg/m³");
        setMetric("No2", a.current.nitrogen_dioxide, 200, " µg/m³");
      } else { if($("#hAqi")) $("#hAqi").innerHTML = \`— <span>n/a</span>\`; }
      if($("#mWind")) $("#mWind").innerHTML = \`\${Math.round(c.wind_speed_10m)}<span> km/h \${compass(c.wind_direction_10m)}</span>\`;
      if($("#windNeedle")) $("#windNeedle").style.transform = \`translate(-50%,-100%) rotate(\${c.wind_direction_10m}deg)\`;
      setMetric("Press", c.pressure_msl, 1050, " hPa", v => v < 1000 ? "Low system" : v > 1020 ? "High system" : "Normal");
      if($("#mCloud")) $("#mCloud").innerHTML = \`\${Math.round(c.cloud_cover)}<span>%</span>\`; if($("#mCloudBar")) $("#mCloudBar").style.width = c.cloud_cover + "%";
      if($("#mFeels")) $("#mFeels").innerHTML = \`\${Math.round(c.apparent_temperature)}<span>°C</span>\`; if($("#mFeelsBar")) $("#mFeelsBar").style.width = Math.min(100, Math.max(0, (c.apparent_temperature + 10) * 2)) + "%";
      const sr = w.daily?.sunrise?.[0], ss = w.daily?.sunset?.[0];
      if($("#sunrise")) $("#sunrise").textContent = fmtTime(sr); if($("#sunset")) $("#sunset").textContent = fmtTime(ss);
      let daylightH = 0, daylightM = 0;
      if (sr && ss) {
        const sunMs = new Date(ss) - new Date(sr);
        if (!isNaN(sunMs)) { daylightH = Math.floor(sunMs / 3600000); daylightM = Math.floor((sunMs % 3600000) / 60000); }
      }
      if($("#daylight")) $("#daylight").textContent = \`\${daylightH}h \${daylightM}m\`;
      if (sr && ss) {
        const now = Date.now(); const sunMs = new Date(ss) - new Date(sr);
        let prog = 0;
        if (sunMs > 0) prog = Math.max(0, Math.min(1, (now - new Date(sr).getTime()) / sunMs));
        const x = 10 + prog * 110; const y = 70 - Math.sin(prog * Math.PI) * 55;
        if($("#sunMarker")) $("#sunMarker").style.left = x + "px"; if($("#sunMarker")) $("#sunMarker").style.top = y + "px"; if($("#solarPath")) $("#solarPath").style.strokeDashoffset = (180 * (1 - prog)).toString();
      }
      const hourly = w.hourly?.time?.slice(0, 24).map((t, i) => ({ t, temp: w.hourly.temperature_2m?.[i] ?? 0, pp: w.hourly.precipitation_probability?.[i] ?? 0 })) || [];
      if($("#hourly")) $("#hourly").innerHTML = hourly.length ? hourly.map((h, i) => { const tStr = i === 0 ? "Now" : new Date(h.t).toLocaleTimeString([], { hour: "2-digit" }); return \`<div class="hcell \${i === 0 ? 'now' : ''}"><div class="t">\${tStr}</div><div class="ic">\${icon}</div><div class="tp">\${Math.round(h.temp)}°</div><div class="pp">\${h.pp}%</div></div>\`; }).join("") : '<div class="hcell"><div class="t">N/A</div><div class="ic">⚠️</div><div class="tp">—</div></div>';
      drawCharts(w);
      if($("#aiText")) $("#aiText").innerHTML = buildAIBrief(c, w, a);
      const tk = [\`\${loc.name.toUpperCase()} · \${Math.round(c.temperature_2m)}°C · \${label}\`, \`Wind \${Math.round(c.wind_speed_10m)} km/h \${compass(c.wind_direction_10m)}\`, \`Pressure \${Math.round(c.pressure_msl)} hPa\`, a?.current ? \`AQI \${Math.round(a.current.european_aqi)} \${aqiTier(a.current.european_aqi).label}\` : \`AQI n/a\`, \`UV \${uvCurrent !== null ? uvCurrent.toFixed(1) : '--'}\`, \`Sunrise \${fmtTime(sr)} · Sunset \${fmtTime(ss)}\`];
      if($("#ticker")) $("#ticker").innerHTML = [...tk, ...tk].map(s => \`<span><i class="fa-solid fa-satellite-dish"></i>\${s}</span>\`).join("");
    }
    function setMetric(id, val, max, unit = "", descFn) { if (val === null || val === undefined || isNaN(val)) { if($("#m" + id)) $("#m" + id).innerHTML = \`—\${unit}\`; if ($("#m" + id + "Bar")) $("#m" + id + "Bar").style.width = "0%"; return; } if($("#m" + id)) $("#m" + id).innerHTML = \`\${Number(val).toFixed(val >= 10 ? 0 : 1)}<span>\${unit}</span>\`; if($("#m" + id + "Bar")) $("#m" + id + "Bar").style.width = Math.min(100, Math.max(0, (val / max) * 100)) + "%"; if (descFn) { const el = $("#" + id + "Desc"); if (el) el.textContent = descFn(val); } }
    function buildAIBrief(c, w, a) { const [label] = codeMap[c.weather_code] || ["mixed conditions"]; const t = Math.round(c.temperature_2m); const feels = Math.round(c.apparent_temperature); const wind = Math.round(c.wind_speed_10m); const dir = compass(c.wind_direction_10m); const uvNow = getCurrentUV(w); const uvS = uvNow ? uvNow.toFixed(1) : "N/A"; const aqi = a?.current?.european_aqi; let s = \`<b>\${state.location.name}</b> recording <b>\${t}°C</b> with \${label.toLowerCase()}, perceived at \${feels}°. Winds \${wind} km/h from \${dir}. UV index \${uvS}. \`; if (aqi != null) s += \`Air quality is <b>\${aqiTier(aqi).label.toLowerCase()}</b> (AQI \${Math.round(aqi)}). \`; return s; }
    let tempChart, precipChart;
    function drawCharts(w) { if (!w?.daily?.time) return; const labels = w.daily.time.map(d => new Date(d).toLocaleDateString([], { weekday: "short" })); const ctx1 = $("#tempChart")?.getContext("2d"); const ctx2 = $("#precipChart")?.getContext("2d"); if (!ctx1 || !ctx2) return; const grad1 = ctx1.createLinearGradient(0, 0, 0, 280); grad1.addColorStop(0, "rgba(255,179,71,.55)"); grad1.addColorStop(1, "rgba(255,179,71,0)"); const grad2 = ctx2.createLinearGradient(0, 0, 0, 280); grad2.addColorStop(0, "rgba(193,39,45,.85)"); grad2.addColorStop(1, "rgba(193,39,45,.1)"); if (tempChart) tempChart.destroy(); tempChart = new Chart(ctx1, { type: "line", data: { labels, datasets: [{ label: "Max", data: w.daily.temperature_2m_max, borderColor: "#ffb347", backgroundColor: grad1, fill: true, tension: .4, borderWidth: 2, pointBackgroundColor: "#ffb347", pointRadius: 3 }, { label: "Min", data: w.daily.temperature_2m_min, borderColor: "#c1272d", backgroundColor: "transparent", fill: false, tension: .4, borderWidth: 2, borderDash: [4, 4], pointBackgroundColor: "#c1272d", pointRadius: 3 }] }, options: chartOpts("°C") }); if (precipChart) precipChart.destroy(); precipChart = new Chart(ctx2, { type: "bar", data: { labels, datasets: [{ label: "Precip mm", data: w.daily.precipitation_sum, backgroundColor: grad2, borderColor: "#c1272d", borderWidth: 1, borderRadius: 8 }] }, options: chartOpts("mm") }); }
    function chartOpts(unit) { return { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: "#c4a878", font: { family: "JetBrains Mono", size: 10 } } }, tooltip: { backgroundColor: "rgba(10,6,18,.96)", borderColor: "rgba(255,179,71,.35)", borderWidth: 1, padding: 12, titleFont: { family: "Inter" }, bodyFont: { family: "JetBrains Mono" }, callbacks: { label: c => \` \${c.dataset.label}: \${c.parsed.y}\${unit}\` } } }, scales: { x: { grid: { color: "rgba(255,200,120,.06)" }, ticks: { color: "#c4a878", font: { family: "JetBrains Mono", size: 10 } } }, y: { grid: { color: "rgba(255,200,120,.06)" }, ticks: { color: "#c4a878", font: { family: "JetBrains Mono", size: 10 } } } } }; }
    const feeds = [{ url: "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml", cat: "science", label: "Science & Environment" }, { url: "http://feeds.bbci.co.uk/weather/feeds/rss/5day/world/", cat: "weather", label: "Weather" }, { url: "https://feeds.bbci.co.uk/news/world/rss.xml", cat: "world", label: "World" }];
    function categorize(item) { const s = (item.title + " " + item.description).toLowerCase(); if (/climate|carbon|emission|warming|cop|biodivers|glacier|sea level/.test(s)) return "climate"; if (/storm|flood|hurricane|cyclone|monsoon|heatwave|wildfire|drought|weather|rain|snow/.test(s)) return "weather"; if (/science|nasa|space|research|study|discover/.test(s)) return "science"; return item._sourceCat || "world"; }
    async function loadNews() {
      try {
        const all = [];
        for (const f of feeds) {
          try {
            const r = await fetch(\`https://api.rss2json.com/v1/api.json?rss_url=\${encodeURIComponent(f.url)}\`);
            if (!r.ok) continue;
            const j = await r.json();
            for (const it of (j.items || [])) {
              it._sourceCat = f.cat; it._sourceLabel = f.label; it._category = categorize(it); it._desc = (it.description || "").replace(/<[^>]+>/g, "").slice(0, 220); it._img = it.thumbnail || it.enclosure?.link || (it.description?.match(/<img[^>]+src="([^"]+)"/)?.[1]) || null; all.push(it);
            }
          } catch (e) { console.warn(\`RSS fail \${f.url}\`, e); }
        }
        if (!all.length) {
          if(document.getElementById("newsGrid")) document.getElementById("newsGrid").innerHTML = \`<div class="ncard" style="grid-column:1/-1;padding:32px;text-align:center;color:var(--muted)"><i class="fa-solid fa-newspaper"></i> Environmental news feed unavailable. Please check network or try again later.</div>\`;
          if(document.getElementById("featuredWrap")) document.getElementById("featuredWrap").innerHTML = \`<div class="featured"><div class="meta"><span class="bbc-badge">BBC</span><h3>News offline</h3><p>Unable to fetch latest updates.</p></div></div>\`;
          if(document.getElementById("trendingList")) document.getElementById("trendingList").innerHTML = \`<div class="tr-item"><div class="body"><h5>Service temporarily unreachable</h5></div></div>\`;
          return;
        }
        state.news = all.sort((a, b) => +new Date(b.pubDate) - +new Date(a.pubDate));
        renderNews();
      } catch (e) { console.error(e); toast("News service error"); }
    }
    function renderNews() {
      let list = state.news;
      if (state.newsCat !== "all") list = list.filter(n => n._category === state.newsCat);
      if (state.newsQuery) { const q = state.newsQuery.toLowerCase(); list = list.filter(n => n.title.toLowerCase().includes(q) || n._desc.toLowerCase().includes(q)); }
      if($("#breakingScroll")) $("#breakingScroll").innerHTML = state.news.slice(0, 6).map(n => \`<span>● \${n.title}</span>\`).join("") + state.news.slice(0, 6).map(n => \`<span>● \${n.title}</span>\`).join("");
      if (!list.length) {
        if($("#newsGrid")) $("#newsGrid").innerHTML = \`<div class="ncard" style="grid-column:1/-1;padding:32px;text-align:center;color:var(--muted)">No matching stories.</div>\`;
        if($("#featuredWrap")) $("#featuredWrap").innerHTML = ""; if($("#trendingList")) $("#trendingList").innerHTML = "";
        return;
      }
      const f = list[0];
      if($("#featuredWrap")) $("#featuredWrap").innerHTML = \`<a class="featured" href="\${f.link}" target="_blank" rel="noopener">\${f._img ? \`<img src="\${f._img}" alt="" loading="lazy">\` : ""}<div class="meta"><span class="bbc-badge">BBC · \${f._sourceLabel}</span><h3>\${f.title}</h3><p>\${f._desc}</p><div class="row"><i class="fa-solid fa-clock"></i><span>\${new Date(f.pubDate).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</span><span>·</span><span>\${f._category.toUpperCase()}</span></div></div></a>\`;
      if($("#trendingList")) $("#trendingList").innerHTML = list.slice(1, 6).map((n, i) => \`<a class="tr-item" href="\${n.link}" target="_blank" rel="noopener"><div class="num">0\${i + 1}</div><div class="body"><h5>\${n.title}</h5><small>\${n._category} · \${new Date(n.pubDate).toLocaleDateString([], { month: "short", day: "numeric" })}</small></div></a>\`).join("");
      if($("#newsGrid")) $("#newsGrid").className = "news-grid";
      if($("#newsGrid")) $("#newsGrid").innerHTML = list.slice(6, 15).map(n => \`<a class="ncard" href="\${n.link}" target="_blank" rel="noopener"><div class="ic">\${n._img ? \`<img src="\${n._img}" alt="" loading="lazy">\` : \`<div style="width:100%;height:100%;display:grid;place-items:center;color:var(--muted-2);font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.18em">BBC · NO IMAGE</div>\`}<span class="badge bbc-badge">BBC</span></div><div class="body"><span class="cat">\${n._category}</span><h4>\${n.title}</h4><p>\${n._desc}</p><div class="foot"><span>\${n._sourceLabel}</span><span>\${new Date(n.pubDate).toLocaleDateString([], { month: "short", day: "numeric" })}</span></div></div></a>\`).join("");
    }
    $$(".chip").forEach(c => c.addEventListener("click", () => { $$(".chip").forEach(x => x.classList.remove("active")); c.classList.add("active"); state.newsCat = c.dataset.cat; renderNews(); }));
    if($("#newsSearch")) $("#newsSearch").addEventListener("input", e => { state.newsQuery = e.target.value.trim(); renderNews(); });

    async function init() { startClock(); if (navigator.geolocation) { navigator.geolocation.getCurrentPosition(async pos => { try { const r = await fetch(\`https://geocoding-api.open-meteo.com/v1/reverse?latitude=\${pos.coords.latitude}&longitude=\${pos.coords.longitude}&language=en&format=json\`); const j = await r.json(); const g = j.results?.[0]; if (g) { state.location = { name: g.name, country: g.country, admin1: g.admin1, latitude: g.latitude, longitude: g.longitude, timezone: g.timezone }; } } catch (e) { } finish(); }, finish, { timeout: 4000 }); } else finish(); }
    function finish() { loadWeather(); loadNews(); }
    window.addEventListener("load", init);
  </script>
</body>

</html>`;

  return (
    <div className="w-full min-h-screen rounded-3xl overflow-hidden border border-amber-500/20 shadow-2xl bg-[#0a0612]">
      <iframe
        title="Vayunetra Atmospheric Intelligence"
        srcDoc={fullHtmlContent}
        className="w-full min-h-[900px] h-[calc(100vh-80px)] border-0"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
    </div>
  );
};
