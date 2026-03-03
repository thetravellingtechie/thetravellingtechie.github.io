$ENC  = [System.Text.Encoding]::UTF8
$SITE = 'c:\Users\salim\Documents\ClaudeCowork\Articles\site'

$pages = Get-ChildItem -Path $SITE -Filter '*.html' -Recurse | Where-Object { $_.FullName -notlike '*\_templates\*' }

foreach ($page in $pages) {
    if (-not [System.IO.File]::Exists($page.FullName)) { continue }
    $txt = [System.IO.File]::ReadAllText($page.FullName, $ENC)

    $alignmentCss = @"
        /* Footer Alignment Overrides */
        .footer-modern { text-align: left !important; }
        .footer-content { text-align: left !important; }
        .footer-col h3, .footer-col h4, .footer-col p { text-align: left !important; margin-left: 0 !important; margin-right: auto !important; }
        .footer-sitemap { align-items: flex-start !important; }
        .footer-icons { justify-content: flex-start !important; }
        
        @media (max-width: 768px) {
            .footer-modern { text-align: center !important; }
            .footer-col h3, .footer-col h4, .footer-col p { text-align: left !important; margin-left: 0 !important; margin-right: auto !important; }
            .footer-sitemap { align-items: flex-start !important; }
            .footer-icons { justify-content: flex-start !important; }
            .footer-bottom { align-items: center !important; flex-direction: column; gap: 1rem; text-align: center !important; }
        }
"@

    if ($txt -notmatch 'Footer Alignment Overrides') {
        $txt = $txt -replace '(?s)(/\* Language Toggle - active state \*/)', "$alignmentCss`n`n        `$1"
        [System.IO.File]::WriteAllText($page.FullName, $txt, $ENC)
        Write-Host "Updated $($page.FullName.Replace($SITE+'\', ''))"
    } else {
        Write-Host "Already updated $($page.FullName.Replace($SITE+'\', ''))"
    }
}
