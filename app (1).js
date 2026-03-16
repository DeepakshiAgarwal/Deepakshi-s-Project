/* ============================================================
   app.js — Deepakshi Agarwal Project Hub
   ============================================================
   All project data lives in DEFAULT_PROJECTS below.
   You can also edit projects directly on the website using
   the Admin Panel (click the lock icon in the footer).
   ============================================================ */

// ── CHANGE THIS PASSWORD ──────────────────────────────────────
const ADMIN_PASSWORD = "deepakshi2024";
// ─────────────────────────────────────────────────────────────

const DEFAULT_PROJECTS = [
  {
    id:          "flow-desk",
    name:        "Flow Desk",
    category:    "Tool",
    description: "A CX task management system that streamlines ticket routing, team assignments, and SLA tracking for customer-facing teams.",
    tags:        ["Task Management", "CX", "Workflow"],
    icon:        "🗂️",
    liveUrl:     "https://deepakshiagarwal.github.io/Flow-Desk/",
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
];

/* ============================================================
   STORAGE — projects saved in localStorage so edits persist
   ============================================================ */
let PROJECTS = loadProjects();
let isAdminLoggedIn = false;
let editingId = null; // null = adding new, string = editing existing

function loadProjects() {
  try {
    const saved = localStorage.getItem("da_projects");
    return saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(DEFAULT_PROJECTS));
  } catch(e) {
    return JSON.parse(JSON.stringify(DEFAULT_PROJECTS));
  }
}

function saveProjects() {
  localStorage.setItem("da_projects", JSON.stringify(PROJECTS));
}

/* ============================================================
   CATEGORY CONFIG
   ============================================================ */
const CATEGORY_META = {
  Dashboard:  { cssClass: "cat-dashboard" },
  Tool:       { cssClass: "cat-tool"      },
  Training:   { cssClass: "cat-training"  },
  Automation: { cssClass: "cat-automation"},
};

const ICON_DEMO = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;
const ICON_CODE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`;
const ICON_EDIT = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;
const ICON_DEL  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>`;

/* ============================================================
   STATE
   ============================================================ */
let activeFilter = "all";
let searchQuery  = "";

/* ============================================================
   RENDER PROJECTS
   ============================================================ */
function renderProjects() {
  const grid        = document.getElementById("projectsGrid");
  const emptyState  = document.getElementById("emptyState");
  const resultCount = document.getElementById("resultCount");

  const filtered = PROJECTS.filter(p => {
    const matchesCat    = activeFilter === "all" || p.category.toLowerCase() === activeFilter.toLowerCase();
    const q             = searchQuery.toLowerCase();
    const matchesSearch = !q || [p.name, p.description, p.category, ...(p.tags||[])].join(" ").toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const total = PROJECTS.length;
  resultCount.textContent = filtered.length === total
    ? `${total} project${total !== 1 ? "s" : ""}`
    : `${filtered.length} of ${total} project${total !== 1 ? "s" : ""}`;

  if (filtered.length === 0) {
    grid.innerHTML = "";
    emptyState.style.display = "flex";
    return;
  }
  emptyState.style.display = "none";
  grid.innerHTML = filtered.map((p, i) => buildCard(p, i)).join("");
  document.getElementById("stat-total").textContent = PROJECTS.length;
}

function buildCard(p, index) {
  const meta        = CATEGORY_META[p.category] || { cssClass: "cat-tool" };
  const tags        = (p.tags||[]).map(t => `<span class="card-tag">${escHtml(t)}</span>`).join("");
  const demoDisabled = (!p.liveUrl || p.liveUrl === "#") ? 'style="opacity:.4;pointer-events:none;"' : "";
  const codeDisabled = (!p.repoUrl || p.repoUrl === "#") ? 'style="opacity:.4;pointer-events:none;"' : "";
  const adminBtns   = isAdminLoggedIn ? `
    <div class="admin-card-actions">
      <button class="admin-card-btn edit-btn"  onclick="openEditForm('${escHtml(p.id)}')">${ICON_EDIT} Edit</button>
      <button class="admin-card-btn delete-btn" onclick="deleteProject('${escHtml(p.id)}')">${ICON_DEL} Delete</button>
    </div>` : "";

  return `
    <article class="project-card ${meta.cssClass}${isAdminLoggedIn ? ' admin-mode' : ''}" style="animation-delay:${index*60}ms" data-id="${escHtml(p.id)}">
      ${adminBtns}
      <div class="card-header">
        <div class="card-icon-wrap" aria-hidden="true">${escHtml(p.icon)}</div>
        <span class="card-category">${escHtml(p.category)}</span>
      </div>
      <h2 class="card-title">${escHtml(p.name)}</h2>
      <p class="card-description">${escHtml(p.description)}</p>
      ${tags ? `<div class="card-tags">${tags}</div>` : ""}
      <div class="card-actions">
        <a href="${escHtml(p.liveUrl||"#")}" target="_blank" rel="noopener" class="btn btn-primary" ${demoDisabled}>${ICON_DEMO} Live Demo</a>
        <a href="${escHtml(p.repoUrl||"#")}" target="_blank" rel="noopener" class="btn btn-outline" ${codeDisabled}>${ICON_CODE} View Code</a>
      </div>
    </article>`;
}

/* ============================================================
   FILTER BUTTONS
   ============================================================ */
function buildFilters() {
  const group = document.querySelector(".filter-group");
  const cats  = [...new Set(PROJECTS.map(p => p.category))].sort();
  // Remove old dynamic buttons, keep "All"
  group.querySelectorAll(".filter-btn:not([data-filter='all'])").forEach(b => b.remove());
  cats.forEach(cat => {
    const btn = document.createElement("button");
    btn.className      = "filter-btn";
    btn.dataset.filter = cat.toLowerCase();
    btn.textContent    = cat;
    group.appendChild(btn);
  });
}

/* ============================================================
   SEARCH
   ============================================================ */
function initSearch() {
  const input    = document.getElementById("searchInput");
  const clearBtn = document.getElementById("clearSearch");
  input.addEventListener("input", () => {
    searchQuery = input.value.trim();
    clearBtn.style.display = searchQuery ? "flex" : "none";
    renderProjects();
  });
  clearBtn.addEventListener("click", () => {
    input.value = ""; searchQuery = "";
    clearBtn.style.display = "none";
    input.focus(); renderProjects();
  });
}

/* ============================================================
   ADMIN — LOGIN / LOGOUT
   ============================================================ */
function toggleAdminLogin() {
  if (isAdminLoggedIn) {
    isAdminLoggedIn = false;
    document.getElementById("adminPanel").style.display = "none";
    document.getElementById("adminLockBtn").innerHTML = LOCK_ICON + " Admin";
    document.getElementById("adminLockBtn").classList.remove("admin-active");
    renderProjects();
    return;
  }
  const pw = prompt("Enter admin password:");
  if (pw === ADMIN_PASSWORD) {
    isAdminLoggedIn = true;
    document.getElementById("adminPanel").style.display = "block";
    document.getElementById("adminLockBtn").innerHTML = UNLOCK_ICON + " Admin ✓";
    document.getElementById("adminLockBtn").classList.add("admin-active");
    renderProjects();
  } else if (pw !== null) {
    alert("Incorrect password.");
  }
}

const LOCK_ICON   = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>`;
const UNLOCK_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 019.9-1"/></svg>`;

/* ============================================================
   ADMIN — PROJECT FORM (Add / Edit)
   ============================================================ */
function openAddForm() {
  editingId = null;
  document.getElementById("formTitle").textContent = "➕ Add New Project";
  clearForm();
  document.getElementById("projectFormWrap").style.display = "block";
  document.getElementById("projectFormWrap").scrollIntoView({ behavior: "smooth", block: "start" });
}

function openEditForm(id) {
  const p = PROJECTS.find(x => x.id === id);
  if (!p) return;
  editingId = id;
  document.getElementById("formTitle").textContent = "✏️ Edit Project";
  document.getElementById("fName").value        = p.name        || "";
  document.getElementById("fCategory").value    = p.category    || "Tool";
  document.getElementById("fDescription").value = p.description || "";
  document.getElementById("fTags").value        = (p.tags||[]).join(", ");
  document.getElementById("fIcon").value        = p.icon        || "🗂️";
  document.getElementById("fLiveUrl").value     = (p.liveUrl === "#" ? "" : p.liveUrl) || "";
  document.getElementById("fRepoUrl").value     = (p.repoUrl === "#" ? "" : p.repoUrl) || "";
  document.getElementById("projectFormWrap").style.display = "block";
  document.getElementById("projectFormWrap").scrollIntoView({ behavior: "smooth", block: "start" });
}

function saveForm() {
  const name  = document.getElementById("fName").value.trim();
  const desc  = document.getElementById("fDescription").value.trim();
  if (!name || !desc) { alert("Name and Description are required."); return; }

  const project = {
    id:          editingId || name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now(),
    name,
    category:    document.getElementById("fCategory").value,
    description: desc,
    tags:        document.getElementById("fTags").value.split(",").map(t => t.trim()).filter(Boolean),
    icon:        document.getElementById("fIcon").value.trim() || "🗂️",
    liveUrl:     document.getElementById("fLiveUrl").value.trim() || "#",
    repoUrl:     document.getElementById("fRepoUrl").value.trim() || "#",
  };

  if (editingId) {
    const idx = PROJECTS.findIndex(x => x.id === editingId);
    if (idx > -1) PROJECTS[idx] = project;
  } else {
    PROJECTS.push(project);
  }

  saveProjects();
  buildFilters();
  renderProjects();
  cancelForm();
  showToast(editingId ? "Project updated!" : "Project added!");
}

function cancelForm() {
  document.getElementById("projectFormWrap").style.display = "none";
  clearForm();
  editingId = null;
}

function clearForm() {
  ["fName","fDescription","fTags","fLiveUrl","fRepoUrl"].forEach(id => {
    document.getElementById(id).value = "";
  });
  document.getElementById("fCategory").value = "Tool";
  document.getElementById("fIcon").value     = "🗂️";
}

/* ============================================================
   ADMIN — DELETE
   ============================================================ */
function deleteProject(id) {
  const p = PROJECTS.find(x => x.id === id);
  if (!p) return;
  if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
  PROJECTS = PROJECTS.filter(x => x.id !== id);
  saveProjects();
  buildFilters();
  renderProjects();
  showToast("Project deleted.");
}

/* ============================================================
   TOAST NOTIFICATION
   ============================================================ */
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2800);
}

/* ============================================================
   HELPERS
   ============================================================ */
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
  return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();
  document.getElementById("stat-total").textContent = PROJECTS.length;

  buildFilters();
  initSearch();
  renderProjects();

  // Filter button clicks
  document.querySelector(".filter-group").addEventListener("click", e => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    activeFilter = btn.dataset.filter;
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderProjects();
  });
});
