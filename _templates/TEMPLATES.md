# Templates — The Travelling Techie

> Modèles de pages prêts à l'emploi. Copier le dossier, remplacer les placeholders, publier.

---

## Structure

```
_templates/
├── TEMPLATES.md                    ← ce fichier
├── snippets/
│   ├── analytics.html              ← GA4 + Microsoft Clarity
│   ├── cookie-consent.html         ← bandeau RGPD (CSS + HTML + JS)
│   └── custom-events.js            ← événements GA4 personnalisés
└── article-dispatch/
    ├── en/index.html               ← template article Dispatch (anglais)
    └── fr/index.html               ← template article Dispatch (français)
```

---

## Créer un nouvel article Dispatch

### 1. Copier le bon template

```bash
# Article EN (racine) + FR (sous-dossier)
cp -r site/_templates/article-dispatch/en/ site/dispatch/mon-article/
cp -r site/_templates/article-dispatch/fr/ site/dispatch/mon-article/fr/
```

### 2. Placeholders à remplacer (ctrl+H dans votre éditeur)

| Placeholder | Exemple | Obligatoire |
|---|---|---|
| `ARTICLE_SLUG` | `trump-anthropic-ai-future` | ✅ |
| `ARTICLE_TITLE` | `Trump, Anthropic et l'avenir de l'IA` | ✅ |
| `ARTICLE_DESC` | `Une analyse des enjeux géopolitiques…` (≤ 160 cars) | ✅ |
| `ARTICLE_DATE` | `2026-03-02` | ✅ |
| `ARTICLE_DATE_DISPLAY` | `2 mars 2026` / `March 2, 2026` | ✅ |
| `HERO_IMAGE_PATH` | `hero.jpg` | ✅ |
| `HERO_IMAGE_ALT` | `Texte alternatif de l'image` | ✅ |
| `HERO_META_TAGS` | `Enquête &nbsp;·&nbsp; IA` | ✅ |
| `GA4_MEASUREMENT_ID` | `G-XXXXXXXXXX` | ✅ avant mise en prod |
| `CLARITY_PROJECT_ID` | `xxxxxxxxxx` | ✅ avant mise en prod |
| `TITRE_SECTION` / `SECTION_TITLE` | `Contexte & enjeux` | ✅ |
| `TITRE_CONCLUSION` / `CONCLUSION_TITLE` | `L'éveil. Maintenant.` | ✅ |

### 3. Contenu de l'article

- Remplacer les balises `<section id="partie1">` … `<section id="conclusion">` par le contenu réel
- Mettre à jour le tableau de navigation `chapterIds` dans le JS en bas de page
- Mettre à jour les liens `.chapter-item` dans le panneau FAB
- Ajouter les sources dans la section `<section class="sources">`

### 4. Image hero

- Déposer l'image dans `site/dispatch/ARTICLE_SLUG/images/`
- Format recommandé : JPG, 1920×1080 ou supérieur, sujet principal en haut
- Créer aussi `og-cover.jpg` (1200×630) pour les partages réseaux sociaux

---

## Analytics — Mise en service

### Étape 1 — Obtenir les IDs

**Google Analytics 4**
1. Aller sur [analytics.google.com](https://analytics.google.com)
2. Admin → Créer une propriété → Flux de données → Web
3. Copier l'ID de mesure (`G-XXXXXXXXXX`)

**Microsoft Clarity**
1. Aller sur [clarity.microsoft.com](https://clarity.microsoft.com)
2. Nouveau projet → type Site web
3. Copier l'ID du projet (`xxxxxxxxxx`)

### Étape 2 — Remplacer les IDs

Faire un remplacement global dans tout le dossier `site/` :

```bash
# Exemple avec sed (macOS/Linux)
find site/ -name "*.html" -exec sed -i '' \
  's/GA4_MEASUREMENT_ID/G-VOTREVRAIIID/g; s/CLARITY_PROJECT_ID/votreprojetid/g' {} +
```

Ou utiliser « Remplacer dans tous les fichiers » dans VS Code.

### Étape 3 — Activer les événements personnalisés (Phase 3)

Une fois les IDs actifs, décommenter le bloc `/* ... */` en bas de chaque page article (section "Custom analytics events").

Les événements disponibles :

| Événement | Déclencheur |
|---|---|
| `scroll_depth` | Passage à 25%, 50%, 75%, 100% de la page |
| `article_read` | Scroll ≥ 75% **et** temps ≥ 60 secondes |
| `social_click` | Clic sur un bouton de partage ou icône réseau |
| `language_toggle` | Changement de langue FR ↔ EN |
| `chapter_nav` | Clic sur un chapitre dans le FAB |
| `outbound_click` | Clic sur un lien externe (`target="_blank"`) |

---

## Snippets autonomes

### `snippets/analytics.html`
À coller juste avant `</head>` sur chaque page.
Contient GA4 + Clarity avec `anonymize_ip: true` (conformité RGPD).

### `snippets/cookie-consent.html`
Bandeau de consentement complet (CSS + HTML + JS).
- La clé `localStorage` utilisée est `ttt-analytics-consent`
- Valeurs possibles : `'granted'` | `'denied'`
- Le bandeau n'apparaît que lors de la première visite (pas de choix mémorisé)

### `snippets/custom-events.js`
Script standalone à inclure après le snippet GA4 et après chargement du DOM.
Peut être partagé via un `<script src="/assets/js/custom-events.js">` commun.

---

## Convention de nommage

```
site/
├── index.html                      ← page d'accueil
├── dispatch/
│   ├── index.html                  ← liste des articles
│   └── mon-article-slug/
│       ├── index.html              ← article EN
│       ├── fr/
│       │   └── index.html          ← article FR
│       └── images/
│           ├── hero.jpg            ← image hero (≥ 1920px)
│           └── og-cover.jpg        ← image Open Graph (1200×630)
└── _templates/                     ← ce dossier (ignoré par GitHub Pages)
```

---

*Dernière mise à jour : mars 2026*
