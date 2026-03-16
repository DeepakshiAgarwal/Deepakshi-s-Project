/* ============================================================
   app.js — Deepakshi Agarwal Project Hub
   ============================================================

   HOW TO ADD A NEW PROJECT:
   --------------------------
   1. Find the PROJECTS array below.
   2. Copy any existing project object.
   3. Fill in your new project's details.
   4. Save the file — that's it!

   FIELD REFERENCE:
   ----------------
   id          → unique identifier (any string, no spaces)
   name        → project name shown on the card
   category    → must match one of: "Dashboard" | "Tool" | "Training" | "Automation"
   description → 1–2 sentence summary shown on the card
   tags        → small labels (array of strings), e.g. ["React", "Firebase"]
   icon        → emoji displayed on the card
   liveUrl     → URL for the "Live Demo" button  (use "#" if not yet deployed)
   repoUrl     → URL for the "View Code" button  (GitHub repo link)
   ============================================================ */

// ╔══════════════════════════════════════════════════════════╗
// ║                  ↓  EDIT PROJECTS HERE  ↓               ║
// ╚══════════════════════════════════════════════════════════╝

const PROJECTS = [

  // ── ADD NEW PROJECTS BY COPYING THE BLOCK BELOW ──
  // {
  //   id:          "unique-id",
  //   name:        "Project Name",
  //   category:    "Dashboard",           // Dashboard | Tool | Training | Automation
  //   description: "What this project does and why it matters.",
  //   tags:        ["Tag1", "Tag2"],
  //   icon:        "🗂️",
  //   liveUrl:     "https://your-live-demo.com",
  //   repoUrl:     "https://github.com/yourusername/repo",
  // },

  {
    id:          "flow-desk",
    name:        "Flow Desk",
    category:    "Tool",
    description: "A CX task management system that streamlines ticket routing, team assignments, and SLA tracking for customer-facing teams.",
    tags:        ["Task Management", "CX", "Workflow"],
    icon:        "🗂️",
    liveUrl:     "#",
    repoUrl:     "#",
  },

  {
    id:          "cx-ticket-dashboard",
    name:        "CX Ticket Dashboard",
    category:    "Dashboard",
    description: "A real-time dashboard visualising open tickets, resolution rates, and team performance metrics across support queues.",
    tags:        ["Analytics", "Support", "Metrics"],
    icon:        "📊",
    liveUrl:     "#",
    repoUrl:     "#",
  },

  {
    id:          "training-process-hub",
    name:        "Training & Process Hub",
    category:    "Training",
    description: "A centralised knowledge base and onboarding portal for CX teams, housing SOPs, training modules, and process documentation.",
    tags:        ["Onboarding", "Knowledge Base", "SOPs"],
    icon:        "🎓",
    liveUrl:     "#",
    repoUrl:     "#",
  },

  {
    id:          "cx-tools",
    name:        "Customer Experience Tools",
    category:    "Tool",
    description: "A suite of lightweight utilities for CX teams — CSAT calculators, response templates, escalation triggers, and feedback collectors.",
    tags:        ["CSAT", "Templates", "Feedback"],
    icon:        "🛠️",
    liveUrl:     "#",
    repoUrl:     "#",
  },

  // ── EXAMPLE PLACEHOLDER — delete or replace ──
  // {
  //   id:          "ops-automator",
  //   name:        "Ops Automator",
  //   category:    "Automation",
  //   description: "Automates routine operations tasks using scheduled scripts and webhook triggers, reducing manual effort by 60%.",
  //   tags:        ["Python", "Webhooks", "Scheduling"],
  //   icon:        "⚙️",
  //   liveUrl:     "#",
  //   repoUrl:     "#",
  // },

];
// ╔══════════════════════════════════════════════════════════╗
// ║                  ↑  END OF PROJECTS  ↑                  ║
// ╚══════════════════════════════════════════════════════════╝


/* ============================================================
   INTERNAL CONFIG — no need to edit below unless customising
   ============================================================ */

// Maps category names → CSS class modifier and button label
const CATEGORY_META = {
  Dashboard:  { cssClass: "cat-dashboard" },
  Tool:       { cssClass: "cat-tool"       },
  Training:   { cssClass: "cat-training"   },
  Automation: { cssClass: "cat-automation" },
};

// SVG icons for the "Live Demo" and "View Code" buttons
const ICON_DEMO = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
  <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
</svg>`;

const ICON_CODE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
  <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
</svg>`;


/* ============================================================
   STATE
   ============================================================ */
let activeFilter  = "all";
let searchQuery   = "";


/* ============================================================
   RENDER
   ============================================================ */

function renderProjects() {
  const grid        = document.getElementById("projectsGrid");
  const emptyState  = document.getElementById("emptyState");
  const resultCount = document.getElementById("resultCount");

  // Filter
  const filtered = PROJECTS.filter(p => {
    const matchesCategory = activeFilter === "all" || p.category.toLowerCase() === activeFilter.toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesSearch   = !q || [p.name, p.description, p.category, ...(p.tags || [])].join(" ").toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  // Update result count
  const total = PROJECTS.length;
  resultCount.textContent = filtered.length === total
    ? `${total} project${total !== 1 ? "s" : ""}`
    : `${filtered.length} of ${total} project${total !== 1 ? "s" : ""}`;

  // Empty state
  if (filtered.length === 0) {
    grid.innerHTML        = "";
    emptyState.style.display = "flex";
    return;
  }
  emptyState.style.display = "none";

  // Build cards
  grid.innerHTML = filtered.map((project, index) => buildCard(project, index)).join("");
}

function buildCard(p, index) {
  const meta    = CATEGORY_META[p.category] || { cssClass: "cat-tool" };
  const tags    = (p.tags || []).map(t => `<span class="card-tag">${escHtml(t)}</span>`).join("");
  const demoDisabled = (!p.liveUrl || p.liveUrl === "#") ? 'style="opacity:.45;pointer-events:none;"' : "";
  const codeDisabled = (!p.repoUrl || p.repoUrl === "#") ? 'style="opacity:.45;pointer-events:none;"' : "";

  return `
    <article class="project-card ${meta.cssClass}" style="animation-delay:${index * 60}ms" data-id="${escHtml(p.id)}">
      <div class="card-header">
        <div class="card-icon-wrap" aria-hidden="true">${escHtml(p.icon)}</div>
        <span class="card-category">${escHtml(p.category)}</span>
      </div>

      <h2 class="card-title">${escHtml(p.name)}</h2>
      <p class="card-description">${escHtml(p.description)}</p>

      ${tags ? `<div class="card-tags">${tags}</div>` : ""}

      <div class="card-actions">
        <a href="${escHtml(p.liveUrl || "#")}" target="_blank" rel="noopener"
           class="btn btn-primary" ${demoDisabled}>
          ${ICON_DEMO} Live Demo
        </a>
        <a href="${escHtml(p.repoUrl || "#")}" target="_blank" rel="noopener"
           class="btn btn-outline" ${codeDisabled}>
          ${ICON_CODE} View Code
        </a>
      </div>
    </article>`;
}


/* ============================================================
   FILTER BUTTONS
   ============================================================ */

function buildFilters() {
  const group = document.querySelector(".filter-group");
  const categories = [...new Set(PROJECTS.map(p => p.category))].sort();

  // Keep the "All" button, append category buttons
  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.className    = "filter-btn";
    btn.dataset.filter = cat.toLowerCase();
    btn.textContent  = cat;
    group.appendChild(btn);
  });

  group.addEventListener("click", e => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    activeFilter = btn.dataset.filter;
    group.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderProjects();
  });
}


/* ============================================================
   SEARCH
   ============================================================ */

function initSearch() {
  const input       = document.getElementById("searchInput");
  const clearBtn    = document.getElementById("clearSearch");

  input.addEventListener("input", () => {
    searchQuery = input.value.trim();
    clearBtn.style.display = searchQuery ? "flex" : "none";
    renderProjects();
  });

  clearBtn.addEventListener("click", () => {
    input.value           = "";
    searchQuery           = "";
    clearBtn.style.display = "none";
    input.focus();
    renderProjects();
  });
}


/* ============================================================
   GLOBAL HELPERS
   ============================================================ */

// Called by the empty-state "Clear filters" button
function resetFilters() {
  activeFilter = "all";
  searchQuery  = "";
  document.getElementById("searchInput").value = "";
  document.getElementById("clearSearch").style.display = "none";
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  document.querySelector('.filter-btn[data-filter="all"]').classList.add("active");
  renderProjects();
}

function escHtml(str) {
  if (!str) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}


/* ============================================================
   INIT
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  // Set current year in footer
  document.getElementById("year").textContent = new Date().getFullYear();

  // Update header stat with total project count
  document.getElementById("stat-total").textContent = PROJECTS.length;

  // Build dynamic filter buttons from categories
  buildFilters();

  // Wire up search
  initSearch();

  // Initial render
  renderProjects();
});
