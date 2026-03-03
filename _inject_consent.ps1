# =============================================================
# Approach A: Consent-first GA4 — RGPD strict
# Reads/writes files as explicit UTF-8 (no BOM issues)
# =============================================================

$ENC    = [System.Text.Encoding]::UTF8
$GA4_ID = 'G-M8CD1PMVMS'
$SITE   = 'c:\Users\salim\Documents\ClaudeCowork\Articles\site'

# ── 1. Cookie consent CSS ────────────────────────────────────
$CSS = @'

        /* Cookie consent banner */
        #cookieBanner {
            position: fixed;
            bottom: 1.5rem; left: 50%; transform: translateX(-50%);
            width: min(640px, calc(100vw - 2rem));
            background: rgba(10, 10, 20, 0.97);
            border: 1px solid rgba(255,255,255,0.10);
            border-radius: 14px;
            padding: 1.1rem 1.5rem;
            display: flex; align-items: center;
            justify-content: space-between;
            gap: 1.25rem;
            z-index: 9999;
            backdrop-filter: blur(22px);
            -webkit-backdrop-filter: blur(22px);
            box-shadow: 0 10px 48px rgba(0,0,0,0.6);
            font-family: 'Inter', sans-serif;
            transition: opacity 0.35s ease, transform 0.35s ease;
        }
        #cookieBanner.hidden {
            opacity: 0;
            transform: translateX(-50%) translateY(16px);
            pointer-events: none;
        }
        #cookieBanner p {
            font-size: 0.77rem; color: rgba(255,255,255,0.62);
            margin: 0; line-height: 1.55; flex: 1;
        }
        #cookieBanner p a {
            color: rgba(255,255,255,0.42);
            text-decoration: underline; text-underline-offset: 2px;
        }
        .cookie-actions { display: flex; gap: 0.5rem; flex-shrink: 0; }
        .cookie-btn {
            padding: 0.42rem 1rem; border-radius: 6px; cursor: pointer;
            font-size: 0.67rem; font-weight: 600; letter-spacing: 0.07em;
            text-transform: uppercase; border: none;
            font-family: 'Inter', sans-serif;
            transition: opacity 0.18s, transform 0.15s;
            white-space: nowrap;
        }
        .cookie-btn:hover { opacity: 0.78; transform: translateY(-1px); }
        .cookie-btn-accept { background: #6366f1; color: #fff; }
        .cookie-btn-decline {
            background: rgba(255,255,255,0.06);
            color: rgba(255,255,255,0.50);
            border: 1px solid rgba(255,255,255,0.12);
        }
        @media (max-width: 540px) {
            #cookieBanner { flex-direction: column; align-items: flex-start; gap: 0.85rem; }
            .cookie-actions { width: 100%; justify-content: flex-end; }
        }
'@

# ── 2. Banner HTML (HTML entities for accented chars) ────────
$BANNER_HTML = @'
    <!-- Cookie consent (RGPD / GDPR) -->
    <div id="cookieBanner" class="hidden" role="dialog" aria-live="polite" aria-label="Consentement cookies">
      <p>Ce site mesure son audience via Google Analytics (donn&#233;es anonymis&#233;es &mdash; aucune revente). <a href="/about/" target="_blank" rel="noopener">En savoir plus</a></p>
      <div class="cookie-actions">
        <button class="cookie-btn cookie-btn-decline" id="cookieDecline">Refuser</button>
        <button class="cookie-btn cookie-btn-accept" id="cookieAccept">Accepter</button>
      </div>
    </div>
'@

# ── 3. Consent JS (loads GA4 dynamically — Approach A) ───────
$CONSENT_JS = @"

    <!-- Analytics consent manager (Approach A / RGPD) -->
    <script>
      (function () {
        var ID  = '$GA4_ID';
        var KEY = 'ttt-analytics-consent';
        var banner = document.getElementById('cookieBanner');

        function loadGA4() {
          if (window._ga4loaded) return;
          window._ga4loaded = true;
          var s = document.createElement('script');
          s.async = true;
          s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
          document.head.appendChild(s);
          window.dataLayer = window.dataLayer || [];
          function gtag() { dataLayer.push(arguments); }
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', ID, { anonymize_ip: true, cookie_flags: 'SameSite=None;Secure' });
        }

        function hideBanner() {
          if (!banner) return;
          banner.classList.add('hidden');
          setTimeout(function () { if (banner) banner.style.display = 'none'; }, 380);
        }

        var c = localStorage.getItem(KEY);
        if (c === 'granted') {
          loadGA4();
          if (banner) banner.style.display = 'none';
        } else if (c === 'denied') {
          if (banner) banner.style.display = 'none';
        } else {
          setTimeout(function () { if (banner) banner.classList.remove('hidden'); }, 900);
        }

        var btnA = document.getElementById('cookieAccept');
        var btnD = document.getElementById('cookieDecline');
        if (btnA) btnA.addEventListener('click', function () {
          localStorage.setItem(KEY, 'granted'); loadGA4(); hideBanner();
        });
        if (btnD) btnD.addEventListener('click', function () {
          localStorage.setItem(KEY, 'denied'); hideBanner();
        });
      })();
    </script>
"@

# ── Process each production HTML page ────────────────────────
$pages = Get-ChildItem -Path $SITE -Filter '*.html' -Recurse |
    Where-Object { $_.FullName -notlike '*\_templates\*' }

foreach ($page in $pages) {
    $txt = [System.IO.File]::ReadAllText($page.FullName, $ENC)

    # ── STEP A: Remove ALL unconditional GA4 from <head> ─────
    # Removes: optional comment block + optional async loader + inline dataLayer script
    $txt = $txt -replace '(?s)\s*<!--[-=-]+\s+ANALYTICS[^>]+-->', ''
    $txt = $txt -replace '(?s)\s*<script async src="https://www\.googletagmanager\.com[^"]*"></script>', ''
    $txt = $txt -replace '(?s)\s*<script>\s*window\.dataLayer = window\.dataLayer[^<]*</script>', ''

    # ── STEP B: Remove any stale/garbled banner from body ─────
    # Catches any existing cookieBanner div (clean or garbled)
    $txt = $txt -replace '(?s)\s*<!--[^>-]*[Cc]ookie[^>-]*-->\s*<div id="cookieBanner"[^>]*>.*?</div>\s*</div>', ''

    # ── STEP C: Remove any stale consent JS from body ─────────
    $txt = $txt -replace "(?s)\s*<!--[^>]*Analytics consent[^>]*-->\s*<script>\s*\(function \(\) \{.*?\}\)\(\);\s*</script>", ''

    # ── STEP D: Add CSS if missing ────────────────────────────
    if ($txt -notmatch '#cookieBanner') {
        # Inject before the LAST </style> that appears before </head>
        $headClose = $txt.IndexOf('</head>')
        $styleClose = $txt.LastIndexOf('</style>', $headClose)
        if ($styleClose -gt 0) {
            $txt = $txt.Substring(0, $styleClose) + $CSS + "`n    </style>" + $txt.Substring($styleClose + '</style>'.Length)
        }
    }

    # ── STEP E: Add banner HTML after <body> ──────────────────
    $txt = $txt -replace '(<body>(\r?\n))', "`$1$BANNER_HTML"

    # ── STEP F: Add consent JS before </body> ─────────────────
    $txt = $txt -replace '(</body>)', "$CONSENT_JS`n`$1"

    [System.IO.File]::WriteAllText($page.FullName, $txt, $ENC)
    $rel = $page.FullName.Replace($SITE + '\', '')
    Write-Host "[OK] $rel"
}

Write-Host "`nAll pages processed with Approach A (consent-first GA4)."
