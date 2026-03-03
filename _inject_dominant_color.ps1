$ENC  = [System.Text.Encoding]::UTF8
$SITE = 'c:\Users\salim\Documents\ClaudeCowork\Articles\site'

$pages = Get-ChildItem -Path $SITE -Filter '*.html' -Recurse | Where-Object { $_.FullName -notlike '*\_templates\*' }

foreach ($page in $pages) {
    $txt = [System.IO.File]::ReadAllText($page.FullName, $ENC)

    # Determine dominant color var
    # Case-insensitive replacement using -ireplace
    $rel = $page.FullName -ireplace [regex]::Escape("$SITE\"), ''
    $rel = $rel -replace '\\', '/'
    $dom = "var(--accent)"
    
    if ($rel -match '^about/') { $dom = "var(--sky)" }
    elseif ($rel -match '^dispatch/') { $dom = "var(--dispatch)" }
    elseif ($rel -match '^lab/') { $dom = "var(--lab)" }
    elseif ($rel -match '^learn/') { $dom = "var(--learn)" }
    # index.html remains var(--accent)

    # 1. Update footer hover color (footer-icon)
    # The previous footer injection used var(--accent). Let's replace it with $dom in the footer block.
    # Note: .footer-icon:hover was injected by _inject_footer.ps1. Let's find:
    # border-color: var(--accent);
    # color: var(--accent);
    # inside .footer-icon:hover
    
    $txt = [regex]::Replace($txt, '(\.footer-icon:hover\s*\{[^}]*border-color:\s*)var\(--accent\)', "`${1}$dom")
    $txt = [regex]::Replace($txt, '(\.footer-icon:hover\s*\{[^}]*color:\s*)var\(--accent\)', "`${1}$dom")
    
    # Update other text hover in footer (e.g., sitemap links) -> use $dom
    # .footer-sitemap a:hover { color: var(--text); ... } -> change to color: $dom;
    $txt = [regex]::Replace($txt, '(\.footer-sitemap a:hover\s*\{[^}]*color:\s*)var\(--text\)', "`${1}$dom")
    $txt = [regex]::Replace($txt, '(\.footer-bottom a:hover\s*\{[^}]*color:\s*)var\(--text\)', "`${1}$dom")
    $txt = [regex]::Replace($txt, '(\footer a:hover\s*\{[^}]*color:\s*)var\(--text\)', "`${1}$dom")

    # 2. Update language toggle button color.
    # There are two types of language toggles:
    # A) span based (.lang-toggle span.active) -> usually background change
    # B) button based (.nav-lang button.active) -> usually text color change
    
    # A) span active -> replace var(--accent) or arbitrary background with $dom
    $txt = [regex]::Replace($txt, '(nav\.scrolled \.lang-toggle span\.active\s*\{[^}]*background:\s*)var\(--accent\)', "`${1}$dom")
    $txt = [regex]::Replace($txt, '(\.lang-toggle span\.active\s*\{[^}]*background:\s*)rgba\(14,165,233,0\.85\)', "`${1}$dom")
    
    # Update non-scrolled if it has var(--accent)
    $txt = [regex]::Replace($txt, '(\.lang-toggle span\.active\s*\{[^}]*background:\s*)var\(--accent\)', "`${1}$dom")
    
    # Make sure lang-toggle text hover also gets $dom
    # Many use: nav.scrolled .lang-toggle span:hover { color: var(--accent); } 
    # Let's inject a new rule if we want to be foolproof.
    
    $overrideCss = @"
    <!-- Dynamic Dominant Colors Override -->
    <style>
        .footer-icon:hover { border-color: $dom !important; color: $dom !important; }
        .footer-sitemap a:hover { color: $dom !important; text-decoration: underline; }
        .footer-bottom a:hover { color: $dom !important; }
        
        /* Language Toggle - active state */
        nav.scrolled .lang-toggle span.active { background: $dom !important; color: #fff !important; }
        .lang-toggle span.active { background: $dom !important; color: #fff !important; border-color: $dom !important; }
        
        /* Language Toggle - text hover */
        .lang-toggle span:hover { color: $dom !important; }
        .nav-lang button.active { color: $dom !important; font-weight: 600 !important; }
        .nav-lang button:hover { color: $dom !important; }
    </style>
"@

    
    # Remove old override if exists
    $txt = [regex]::Replace($txt, '(?s)\s*<!-- Dynamic Dominant Colors Override -->.*?</style>', "")
    
    # Insert new override before </head>
    $txt = $txt -replace '(?i)</head>', "`n$overrideCss`n</head>"
    
    [System.IO.File]::WriteAllText($page.FullName, $txt, $ENC)
    Write-Host "[OK] $rel updated dominant color to $dom"
}
