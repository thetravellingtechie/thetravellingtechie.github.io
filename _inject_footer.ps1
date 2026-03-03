# =============================================================
# Injection of Premium Modern Footer with Sitemap
# =============================================================

$ENC  = [System.Text.Encoding]::UTF8
$SITE = 'c:\Users\salim\Documents\ClaudeCowork\Articles\site'

# ── 1. Modern Footer CSS ─────────────────────────────────────
$FOOTER_CSS = @'

        /* ── MODERN FOOTER ── */
        .footer-modern {
            border-top: 1px solid var(--border);
            padding: 4rem 2rem 1.5rem 2rem;
            margin-top: 4rem;
            background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.2));
        }

        .footer-content {
            max-width: 1080px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 2fr 1fr 1fr;
            gap: 3rem;
        }

        .footer-col h3 {
            font-family: 'Outfit', sans-serif;
            font-size: 1.4rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: var(--text);
            letter-spacing: -0.02em;
        }

        .footer-col h4 {
            font-family: 'Outfit', sans-serif;
            font-size: 0.9rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--text);
            margin-bottom: 1.2rem;
            opacity: 0.9;
        }

        .footer-col p {
            color: var(--text-muted);
            font-size: 0.95rem;
            line-height: 1.6;
            max-width: 300px;
        }

        .footer-sitemap {
            display: flex;
            flex-direction: column;
            gap: 0.8rem;
        }

        .footer-sitemap a {
            color: var(--text-muted);
            text-decoration: none;
            font-size: 0.95rem;
            transition: color 0.2s, transform 0.2s;
            width: fit-content;
        }

        .footer-sitemap a:hover {
            color: var(--text);
            transform: translateX(3px);
        }

        .footer-icons {
            display: flex;
            gap: 0.8rem;
            flex-wrap: wrap;
        }

        .footer-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border: 1px solid var(--border);
            border-radius: 8px;
            color: var(--text-muted);
            text-decoration: none;
            transition: all 0.3s ease;
            background: rgba(255, 255, 255, 0.02);
        }

        .footer-icon:hover {
            border-color: var(--accent);
            color: var(--accent);
            background: rgba(255, 255, 255, 0.05);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .footer-icon svg {
            width: 18px;
            height: 18px;
            fill: currentColor;
        }

        .footer-bottom {
            max-width: 1080px;
            margin: 3rem auto 0 auto;
            padding-top: 1.5rem;
            border-top: 1px solid rgba(255, 255, 255, 0.06);
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.85rem;
            color: var(--text-muted);
        }

        @media (max-width: 768px) {
            .footer-content {
                grid-template-columns: 1fr;
                gap: 2.5rem;
                text-align: center;
            }
            .footer-col p {
                margin: 0 auto;
            }
            .footer-sitemap {
                align-items: center;
            }
            .footer-icons {
                justify-content: center;
            }
            .footer-bottom {
                flex-direction: column;
                gap: 1rem;
                text-align: center;
            }
        }
'@

# ── Process each production HTML page ────────────────────────
$pages = Get-ChildItem -Path $SITE -Filter '*.html' -Recurse |
    Where-Object { $_.FullName -notlike '*\_templates\*' }

foreach ($page in $pages) {
    $txt = [System.IO.File]::ReadAllText($page.FullName, $ENC)

    # 1. Inject new CSS before </style>
    if ($txt -notmatch 'footer-modern') {
        $headClose = $txt.IndexOf('</head>')
        $styleClose = $txt.LastIndexOf('</style>', $headClose)
        if ($styleClose -gt 0) {
            $txt = $txt.Substring(0, $styleClose) + $FOOTER_CSS + "`n    </style>" + $txt.Substring($styleClose + '</style>'.Length)
        }
    }

    # 2. Extract existing social icons block to preserve them
    $iconsMatch = [regex]::Match($txt, '(?s)<div class="footer-icons">.*?</div>\s*</div>')
    # Or just the inner icons block (some files might have a slightly different span, so we grab everything between <div class="footer-icons"> and its closing tag)
    $iconsHtml = ""
    # Try more precise match:
    # <footer> ... <div class="footer-icons"> ... </div> ... </footer>
    if ($txt -match '(?s)(<div class="footer-icons">.*?</div>(\s*<p.*?</p>)?\s*</footer>)') {
        # we need just the icons div content
        $iconsRawMatch = [regex]::Match($txt, '(?s)<div class="footer-icons">(.*?)</div>\s*<p class="footer-copy"')
        if ($iconsRawMatch.Success) {
            $iconsHtml = $iconsRawMatch.Groups[1].Value.Trim()
        } else {
             # fallback, just grab the whole div
             $fallbackMatch = [regex]::Match($txt, '(?s)<div class="footer-icons">(.*?)</div>\s*(<p|</footer>)')
             if ($fallbackMatch.Success) {
                 $iconsHtml = $fallbackMatch.Groups[1].Value.Trim()
             }
        }
    }

    if ($iconsHtml -eq "") {
        Write-Host "[WARNING] Could not extract social icons from $($page.FullName)"
        continue
    }

    # 3. Construct modern footer replacing the old
    $MODERN_FOOTER_HTML = @"
    <footer class="footer-modern">
        <div class="footer-content">
            <div class="footer-col footer-brand-col">
                <h3>The Traveling Techie</h3>
                <p data-fr="Explorateur du Cloud, de l'IA et des nouvelles technologies. Décryptages et tutoriels pour les professionnels tech." 
                   data-en="Explorer of Cloud, AI and new technologies. Analysis and tutorials for tech professionals.">
                    Explorateur du Cloud, de l'IA et des nouvelles technologies. Décryptages et tutoriels pour les professionnels tech.
                </p>
            </div>
            
            <div class="footer-col footer-links-col">
                <h4 data-fr="Plan du site" data-en="Sitemap">Plan du site</h4>
                <div class="footer-sitemap">
                    <a href="/"          data-fr="Accueil"   data-en="Home">Accueil</a>
                    <a href="/dispatch/" data-fr="Dispatch"  data-en="Dispatch">Dispatch</a>
                    <a href="/learn/"    data-fr="Apprendre" data-en="Learn">Apprendre</a>
                    <a href="/lab/"      data-fr="Lab"       data-en="Lab">Lab</a>
                    <a href="/about/"    data-fr="&Agrave; propos" data-en="About">À propos</a>
                </div>
            </div>

            <div class="footer-col footer-social-col">
                <h4 data-fr="Réseaux" data-en="Socials">Réseaux</h4>
                <div class="footer-icons">
                    $iconsHtml
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2026 Salim &mdash; The Traveling Techie</p>
            <div class="footer-bottom-links">
                <!-- Keep clear for future privacy policies or terms if needed -->
            </div>
        </div>
    </footer>
"@

    # Replace old footer with new footer
    $txt = $txt -replace '(?s)<footer>.*?</footer>', $MODERN_FOOTER_HTML

    [System.IO.File]::WriteAllText($page.FullName, $txt, $ENC)
    $rel = $page.FullName.Replace($SITE + '\', '')
    Write-Host "[OK] $rel"
}

Write-Host "`nPremium modern footer with sitemap injected into all pages."
