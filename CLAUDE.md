# Salim (SD) — Global Workflow Context
# The Traveling Techie · @sd_thetravellingtechie · lvlupwithsd

> This file is automatically loaded by Claude Code at every session start.
> It defines mandatory workflows, skill usage, and the collaboration structure
> between Salim and Claude. Mirror: github.com/thetravellingtechie/thetravellingtechie.github.io/CLAUDE.md

---

## 1. Who We Are Working With

**Salim (SD)** — creator of The Traveling Techie ecosystem:
- **Dispatch** → long-form articles on tech, geopolitics, AI, travels, society
- **Learn** → structured courses: Cloud (AWS/Azure/GCP), AI, PM, sciences
- **Lab** → automation, AI agents, how-to guides, experiments
- Site: `thetravellingtechie.github.io`
- Instagram: `@sd_thetravellingtechie` | YouTube: `lvlupwithsd` | GitHub: `thetravellingtechie`

---

## 2. Mandatory Planning Protocol (Every Complex Task)

Before ANY task requiring more than 3 steps, **always** create these files:

```
task_plan.md    → phases, decisions, progress tracker
findings.md     → research, discoveries, key data
progress.md     → session log, what was done, what remains
```

Skill reference: `~/.claude/skills/planning-with-files/SKILL.md`

**The 2-Action Rule**: After every 2 tool calls, save key findings to disk.
**Read before deciding**: Re-read task_plan.md before any major decision.
**Update after each phase**: Mark phases complete, log errors.

> This ensures context survives /clear, session breaks, and device changes.

---

## 3. Skill Activation Map

Use the right skill for the right task. Reference paths below.

### Design & Frontend
| Need | Skill |
|------|-------|
| Landing pages, UI components | `~/.claude/skills/anthropic/frontend-design/` |
| Visual themes, color systems | `~/.claude/skills/anthropic/theme-factory/` |
| Canvas / graphic design | `~/.claude/skills/anthropic/canvas-design/` |
| Web artifacts (HTML/CSS/JS) | `~/.claude/skills/anthropic/web-artifacts-builder/` |
| Algorithmic art / generative | `~/.claude/skills/anthropic/algorithmic-art/` |

### Documents & Content
| Need | Skill |
|------|-------|
| Word documents | `~/.claude/skills/anthropic/docx/` |
| PDF creation | `~/.claude/skills/anthropic/pdf/` |
| Presentations | `~/.claude/skills/anthropic/pptx/` |
| Spreadsheets | `~/.claude/skills/anthropic/xlsx/` |
| Co-authored docs | `~/.claude/skills/anthropic/doc-coauthoring/` |

### Software Development
| Need | Skill |
|------|-------|
| Writing a dev plan | `~/.claude/skills/superpowers/writing-plans/` |
| Executing a plan | `~/.claude/skills/superpowers/executing-plans/` |
| Test-driven development | `~/.claude/skills/superpowers/test-driven-development/` |
| Debugging systematically | `~/.claude/skills/superpowers/systematic-debugging/` |
| Code review | `~/.claude/skills/superpowers/requesting-code-review/` |
| Parallel agent dispatch | `~/.claude/skills/superpowers/dispatching-parallel-agents/` |
| Subagent-driven dev | `~/.claude/skills/superpowers/subagent-driven-development/` |
| Git worktrees | `~/.claude/skills/superpowers/using-git-worktrees/` |
| Brainstorming | `~/.claude/skills/superpowers/brainstorming/` |

### Subagents (127+ specialists)
Base path: `~/.claude/skills/subagents/`

| Category | Path | Key agents |
|----------|------|-----------|
| Core dev | `01-core-development/` | senior-dev, architect, fullstack |
| Languages | `02-language-specialists/` | python, js, go, rust... |
| Infra | `03-infrastructure/` | devops, cloud, docker, k8s |
| Quality | `04-quality-security/` | qa-engineer, security-auditor |
| AI/Data | `05-data-ai/` | ai-engineer, ml-engineer, data-analyst |
| DX | `06-developer-experience/` | dx-engineer, docs-writer |
| Specialized | `07-specialized-domains/` | blockchain, embedded, mobile |
| Business | `08-business-product/` | pm, business-analyst, ux |
| Meta | `09-meta-orchestration/` | orchestrator, task-decomposer |
| Research | `10-research-analysis/` | researcher, analyst |

### New Skills
| Need | Skill |
|------|-------|
| Create new skills | `~/.claude/skills/anthropic/skill-creator/` |
| Build MCP servers | `~/.claude/skills/anthropic/mcp-builder/` |
| Test web apps | `~/.claude/skills/anthropic/webapp-testing/` |

---

## 4. Subagent Usage Protocol

**When to spawn a subagent:**
- Task is isolated and self-contained
- Task takes more than ~5 tool calls
- Parallel work is possible (spawn multiple simultaneously)
- Specialized expertise needed (security, data, infra...)

**How to pick the right subagent:**
1. Check `~/.claude/skills/subagents/CLAUDE.md` for the index
2. Match the task to the nearest specialist category
3. Provide full context in the Task prompt — agents have no prior memory

**Commands available:**
- `/brainstorm` → structured ideation session
- `/write-plan` → spec → implementation plan
- `/execute-plan` → subagent-driven execution

---

## 5. Design Principles (The Traveling Techie Brand)

All visual work must respect:

```
Background:   #0a0a0a  (near black)
Cards:        #111111
Hover:        #161616
Text:         #f5f5f5
Secondary:    #a0a0a0
Muted:        #555555
Accent:       #ff3333  (red — the signature)
Borders:      #222222 / #2e2e2e

Fonts:
  Headings → Crimson Pro (serif, italic for subtitles)
  UI/Labels → Inter (sans-serif, uppercase + letter-spacing)

Patterns:
  - Grain overlay (SVG, opacity 0.025)
  - Accent line on left border (::after, 2px red, height animates on hover)
  - Nav: transparent → rgba(10,10,10,0.92) + blur(12px) on scroll
  - Cards: grid with 1.5px gap on background color (creates border effect)
  - Animations: fadeInUp, IntersectionObserver for sections
```

---

## 6. Cross-Device / Cross-Interface Protocol

This workflow context is stored in **two places**:
1. `~/.claude/CLAUDE.md` — auto-loaded by Claude Code CLI on this machine
2. `github.com/thetravellingtechie/thetravellingtechie.github.io/CLAUDE.md` — available anywhere

**When starting on a new device or web interface:**
> Paste the content of CLAUDE.md at the start of the conversation,
> OR reference: https://raw.githubusercontent.com/thetravellingtechie/thetravellingtechie.github.io/main/CLAUDE.md

**When resuming a project after a break:**
> Read `task_plan.md` and `progress.md` in the project folder first.
> Run: `~/.claude/scripts/session-catchup.py` if available.

---

## 7. Current Active Project

**The Traveling Techie — thetravellingtechie.github.io**

```
Repo:     thetravellingtechie/thetravellingtechie.github.io


Structure:
  index.html                          ← Landing page (done)
  dispatch/index.html                 ← Articles list (done)
  dispatch/trump-anthropic-ai-future/ ← Article #1 (done)
  learn/index.html                    ← Coming soon (skeleton done)
  lab/index.html                      ← Coming soon (skeleton done)

Next steps:
  - Push site/ folder to GitHub repo thetravellingtechie.github.io
  - Enable GitHub Pages (Settings → Pages → main → root)
  - Add CLAUDE.md to repo root
  - Share on LinkedIn / Instagram / WhatsApp
```

---

*Last updated: 2026-03-01 | Session: The Traveling Techie launch*
