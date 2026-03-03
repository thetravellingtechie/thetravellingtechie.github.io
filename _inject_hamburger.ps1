# =============================================================
# Injection of Hamburger Menu (Mobile Navigation)
# =============================================================

$ENC  = [System.Text.Encoding]::UTF8
$SITE = 'c:\Users\salim\Documents\ClaudeCowork\Articles\site'

# ── 1. Hamburger CSS ─────────────────────────────────────────
$HAMBURGER_CSS = @'

        /* Hamburger Menu */
        .nav-hamburger {
            display: none;
            background: none;
            border: none;
            cursor: pointer;
            padding: 0.5rem;
            z-index: 1001;
            position: relative;
        }

        .nav-hamburger span {
            display: block;
            width: 24px;
            height: 2px;
            background: var(--text);
            margin: 5px 0;
            transition: 0.3s;
        }

        nav:not(.scrolled) .nav-hamburger span {
            background: #fff;
        }

        .nav-hamburger.active span:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 5px);
        }

        .nav-hamburger.active span:nth-child(2) {
            opacity: 0;
        }

        .nav-hamburger.active span:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -5px);
        }

        .nav-mobile-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: var(--bg);
            z-index: 1000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 2rem;
            opacity: 0;
            visibility: hidden;
            transition: 0.3s;
        }

        .nav-mobile-overlay.active {
            opacity: 1;
            visibility: visible;
        }

        .nav-mobile-overlay a {
            font-size: 1.5rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--text);
            text-decoration: none;
            font-family: 'Outfit', sans-serif;
        }

        @media (max-width: 768px) {
            .nav-hamburger {
                display: block;
            }
            .nav-center {
                display: none;
            }
        }
'@

# ── 2. Hamburger HTML ────────────────────────────────────────
$HAMBURGER_BUTTON_HTML = @'
        <button class="nav-hamburger" id="navHamburger" aria-label="Menu">
            <span></span>
            <span></span>
            <span></span>
        </button>
'@

$MOBILE_OVERLAY_HTML = @'
    <div class="nav-mobile-overlay" id="navMobileOverlay">
        <a href="/dispatch/" data-fr="Dispatch" data-en="Dispatch">Dispatch</a>
        <a href="/learn/"    data-fr="Apprendre" data-en="Learn">Apprendre</a>
        <a href="/lab/"      data-fr="Lab" data-en="Lab">Lab</a>
        <a href="/about/"    data-fr="&Agrave; propos" data-en="About">About</a>
    </div>
'@

# ── 3. Hamburger JS ──────────────────────────────────────────
$HAMBURGER_JS = @'
    <!-- Mobile menu toggle logic -->
    <script id="hamburger-js">
        (function() {
            const hamburger = document.getElementById('navHamburger');
            const overlay = document.getElementById('navMobileOverlay');
            const body = document.body;

            if (hamburger && overlay) {
                hamburger.addEventListener('click', function() {
                    hamburger.classList.toggle('active');
                    overlay.classList.toggle('active');
                    body.style.overflow = overlay.classList.contains('active') ? 'hidden' : '';
                });

                // Close menu when a link is clicked
                overlay.querySelectorAll('a').forEach(function(link) {
                    link.addEventListener('click', function() {
                        hamburger.classList.remove('active');
                        overlay.classList.remove('active');
                        body.style.overflow = '';
                    });
                });
            }
        })();
    </script>
'@

# ── Process each production HTML page ────────────────────────
$pages = Get-ChildItem -Path $SITE -Filter '*.html' -Recurse |
    Where-Object { $_.FullName -notlike '*\_templates\*' }

foreach ($page in $pages) {
    $txt = [System.IO.File]::ReadAllText($page.FullName, $ENC)

    # 1. Inject CSS before </style>
    if ($txt -notmatch 'nav-hamburger') {
        $headClose = $txt.IndexOf('</head>')
        $styleClose = $txt.LastIndexOf('</style>', $headClose)
        if ($styleClose -gt 0) {
            $txt = $txt.Substring(0, $styleClose) + $HAMBURGER_CSS + "`n    </style>" + $txt.Substring($styleClose + '</style>'.Length)
        }
    }

    # 2. Inject HTML Button inside <nav> (before closing </nav>)
    if ($txt -notmatch 'id="navHamburger"') {
        $navClose = $txt.IndexOf('</nav>')
        if ($navClose -gt 0) {
            $txt = $txt.Substring(0, $navClose) + "`n        " + $HAMBURGER_BUTTON_HTML + "`n    </nav>" + $txt.Substring($navClose + '</nav>'.Length)
        }
    }

    # 3. Inject Mobile Overlay after <body>
    if ($txt -notmatch 'id="navMobileOverlay"') {
        $bodyOpen = $txt.IndexOf('<body>')
        if ($bodyOpen -gt 0) {
            $txt = $txt.Substring(0, $bodyOpen + 6) + "`n" + $MOBILE_OVERLAY_HTML + $txt.Substring($bodyOpen + 6)
        }
    } else {
        # Update existing overlay to fix encoding if needed
        $txt = $txt -replace '(?s)<div class="nav-mobile-overlay" id="navMobileOverlay">.*?</div>', $MOBILE_OVERLAY_HTML
    }

    # 4. Inject JS before </body>
    if ($txt -notmatch 'id="hamburger-js"') {
        $bodyClose = $txt.LastIndexOf('</body>')
        if ($bodyClose -gt 0) {
            $txt = $txt.Substring(0, $bodyClose) + $HAMBURGER_JS + "`n    " + $txt.Substring($bodyClose)
        }
    }

    [System.IO.File]::WriteAllText($page.FullName, $txt, $ENC)
    $rel = $page.FullName.Replace($SITE + '\', '')
    Write-Host "[OK] $rel"
}

Write-Host "`nHamburger menu system updated correctly in all pages."
