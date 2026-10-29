/**
 * TOBI AWOLAJU — MULTIDISCIPLINARY ENGINEERING PORTFOLIO
 * Monochrome Editorial Engineering Client Script
 */

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMobileMenu();
  loadPortfolioData();
});

// --- Theme Management (Strict Monochrome) ---
function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
  
  applyTheme(initialTheme);

  const toggleBtn = document.getElementById("theme-toggle-btn");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
      localStorage.setItem("theme", nextTheme);
    });
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const icon = document.getElementById("theme-icon");
  if (icon) {
    icon.textContent = theme === "dark" ? "☼" : "☾";
    icon.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
  }
}

// --- Mobile Navigation ---
function initMobileMenu() {
  const menuBtn = document.getElementById("mobile-menu-btn");
  const nav = document.getElementById("site-nav");

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", isOpen);
    });

    nav.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }
}

// --- Data Loading & Rendering ---
async function loadPortfolioData() {
  try {
    const response = await fetch("engineering.json");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch engineering.json`);
    }
    const data = await response.json();
    renderApp(data);
  } catch (err) {
    console.error("Error loading portfolio data:", err);
  }
}

function renderApp(data) {
  if (!data) return;

  renderFlagships(data.flagships || []);
  renderOtherSystems(data.otherSystems || []);
  renderResearch(data.research || []);
  renderWriting(data.writing || []);
  renderAbout(data.about || {});
  renderContact(data.profile || {});

  initInteractions();
}

// --- Flagship Rendering ---
function renderFlagships(flagships) {
  const container = document.getElementById("flagships-list");
  if (!container) return;

  container.innerHTML = flagships.map((f) => {
    const cs = f.caseStudy || {};
    const isEeg = f.id === "eeg-headset";
    const isCellular = f.id === "cellular-positioning";
    const isKyp = f.id === "kyp";

    // Visual Component Generation (Monochrome diagrams & real media)
    let visualHtml = "";
    if (f.image && !f.image.includes("grey.jpg")) {
      visualHtml = `
        <div class="flagship-media-wrapper">
          <img src="${f.image}" alt="${f.title} gameplay interface" class="flagship-img" loading="lazy">
        </div>
      `;
    }

    let diagramHtml = "";
    if (isEeg) {
      diagramHtml = renderEegDiagram();
    } else if (isCellular) {
      diagramHtml = renderCellularDiagram();
    } else if (isKyp) {
      diagramHtml = renderKypDiagram();
    }

    // Deep Dive Content
    let deepDiveHtml = `
      <div class="deep-dive-grid">
        <div class="case-section">
          <h4>Problem Statement</h4>
          <p>${cs.problem || ""}</p>
        </div>
        <div class="case-section">
          <h4>Engineering Challenge</h4>
          <p>${cs.difficulty || ""}</p>
          ${cs.hardestBug ? `<p style="margin-top:8px;"><strong>Debugging Detail:</strong> ${cs.hardestBug}</p>` : ""}
        </div>
        <div class="case-section">
          <h4>Personal Contribution</h4>
          <p>${cs.personalContribution || ""}</p>
        </div>
        <div class="case-section">
          <h4>Architectural Trade-offs</h4>
          ${cs.tradeoffs ? `<ul>${cs.tradeoffs.map(t => `<li>${t}</li>`).join("")}</ul>` : ""}
          <p style="margin-top:8px;"><strong>Status:</strong> ${cs.currentStatus || f.status}</p>
          ${cs.nextSteps ? `<p style="margin-top:4px;"><strong>Next Milestone:</strong> ${cs.nextSteps}</p>` : ""}
        </div>
      </div>
    `;

    // Hardware Audit for EEG
    if (cs.auditStatus) {
      deepDiveHtml += `
        <div class="case-section" style="margin-top:14px;">
          <h4>Hardware Engineering Audit</h4>
          <table class="audit-table">
            <thead>
              <tr><th>Dimension</th><th>Status & Specification</th></tr>
            </thead>
            <tbody>
              <tr><td><strong>Components Acquired</strong></td><td>${cs.auditStatus.componentsAcquired}</td></tr>
              <tr><td><strong>Hardware Assembled</strong></td><td>${cs.auditStatus.hardwareAssembled}</td></tr>
              <tr><td><strong>Firmware Implemented</strong></td><td>${cs.auditStatus.firmwareImplemented}</td></tr>
              <tr><td><strong>Bench Results</strong></td><td>${cs.auditStatus.testedResults}</td></tr>
              <tr><td><strong>Scope & Limitations</strong></td><td>${cs.auditStatus.honestLimitations}</td></tr>
            </tbody>
          </table>
        </div>
      `;
    }

    // Research Audit for Cellular
    if (cs.researchDetails) {
      deepDiveHtml += `
        <div class="case-section" style="margin-top:14px;">
          <h4>Research Methodology & Stage</h4>
          <table class="audit-table">
            <thead>
              <tr><th>Dimension</th><th>Specification</th></tr>
            </thead>
            <tbody>
              <tr><td><strong>Features Logged</strong></td><td>${cs.researchDetails.featuresLogged}</td></tr>
              <tr><td><strong>Algorithmic Methods</strong></td><td>${cs.researchDetails.algorithmExploration}</td></tr>
              <tr><td><strong>Current Stage</strong></td><td>${cs.researchDetails.currentStage}</td></tr>
              <tr><td><strong>Constraints</strong></td><td>${cs.researchDetails.limitations}</td></tr>
            </tbody>
          </table>
        </div>
      `;
    }

    return `
      <article class="flagship-card" id="${f.id}">
        <div class="flagship-header">
          <span class="flagship-domain">${f.domain}</span>
          <span class="flagship-status-badge">${f.status}</span>
        </div>

        <div class="flagship-body">
          <h3 class="flagship-title">${f.title}</h3>
          <div class="flagship-subtitle">${f.subtitle}</div>

          <p class="flagship-desc">${f.description}</p>

          <div class="flagship-stack-list">
            ${f.stack.map(st => `<span class="stack-tag">${st}</span>`).join("")}
          </div>

          <div class="flagship-links-row">
            ${f.links.map(l => `
              <a href="${l.url}" class="btn ${l.primary ? 'btn-primary' : 'btn-secondary'}" target="${l.url.startsWith('#') ? '_self' : '_blank'}" rel="noopener noreferrer">
                ${l.text} ${l.url.startsWith('#') ? '↓' : '↗'}
              </a>
            `).join("")}
          </div>

          ${visualHtml}
          ${diagramHtml}

          <div class="deep-dive-accordion">
            <button class="deep-dive-toggle" aria-expanded="false" data-target="deep-dive-${f.id}">
              <span>Technical Breakdown & Case Study</span>
              <span class="arrow">▾</span>
            </button>
            <div class="deep-dive-content" id="deep-dive-${f.id}">
              ${deepDiveHtml}
            </div>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

// --- Monochrome System Flowcharts ---
function renderEegDiagram() {
  return `
    <div class="diagram-canvas">
      <div class="diagram-header-label">Hardware Signal Chain Architecture</div>
      <div class="system-flow-grid">
        <div class="flow-node">
          <span class="node-step">01. CAPTURE</span>
          <div class="node-title">Scalp Electrodes</div>
          <div class="node-desc">Single-point Fp1 forehead dry electrode with ear ground/reference clips.</div>
        </div>
        <div class="flow-node">
          <span class="node-step">02. DIGITIZE</span>
          <div class="node-title">TGAM Biosensing Frontend</div>
          <div class="node-desc">Hardware pre-amplification, 50Hz notch filter, and 12-bit ADC digitization.</div>
        </div>
        <div class="flow-node">
          <span class="node-step">03. PROCESS</span>
          <div class="node-title">ESP32 FreeRTOS Layer</div>
          <div class="node-desc">Core 0: 57,600-baud UART packet parsing. Core 1: Intentional threshold detection.</div>
        </div>
        <div class="flow-node">
          <span class="node-step">04. OUTPUT</span>
          <div class="node-title">Bone Conduction Audio</div>
          <div class="node-desc">DAC tone generator driving PAM8403 amplifier and bone-conduction transducers.</div>
        </div>
      </div>
    </div>
  `;
}

function renderCellularDiagram() {
  return `
    <div class="diagram-canvas">
      <div class="diagram-header-label">Cellular Fingerprinting Localization Architecture</div>
      <div class="system-flow-grid">
        <div class="flow-node">
          <span class="node-step">01. TRANSMISSION</span>
          <div class="node-title">Base Station Network</div>
          <div class="node-desc">Serving and neighboring GSM/LTE base stations broadcasting beacon signals.</div>
        </div>
        <div class="flow-node">
          <span class="node-step">02. ACQUISITION</span>
          <div class="node-title">AT-Command Logging Rig</div>
          <div class="node-desc">Dedicated cellular modem interrogating AT+CSQ, AT+CREG, and neighbor registers.</div>
        </div>
        <div class="flow-node">
          <span class="node-step">03. DATABASE</span>
          <div class="node-title">Offline Radio Map</div>
          <div class="node-desc">Calibrated spatial grid linking reference coordinates with multi-cell RSSI vectors.</div>
        </div>
        <div class="flow-node">
          <span class="node-step">04. ESTIMATION</span>
          <div class="node-title">Pattern Matching Engine</div>
          <div class="node-desc">k-Nearest Neighbors (k-NN) estimating coordinates from online measured vectors.</div>
        </div>
      </div>
    </div>
  `;
}

function renderKypDiagram() {
  return `
    <div class="diagram-canvas">
      <div class="diagram-header-label">Protocol-Agnostic Accountability Flow</div>
      <div class="system-flow-grid">
        <div class="flow-node">
          <span class="node-step">01. SYNTHESIS</span>
          <div class="node-title">AI Research Pipeline</div>
          <div class="node-desc">Dual-tier synthesis summarizing target protocol contract addresses.</div>
        </div>
        <div class="flow-node">
          <span class="node-step">02. ESCROW</span>
          <div class="node-title">Solidity Stake Vault</div>
          <div class="node-desc">User locks stake under programmable 9-day, 3-strike commitment contracts.</div>
        </div>
        <div class="flow-node">
          <span class="node-step">03. VERIFICATION</span>
          <div class="node-title">Heartbeat Log Scanner</div>
          <div class="node-desc">Dynamic getLogs indexer scanning raw block logs for address interaction.</div>
        </div>
        <div class="flow-node">
          <span class="node-step">04. SETTLEMENT</span>
          <div class="node-title">Automated Resolution</div>
          <div class="node-desc">Autonomous stake release on completion or slash distribution on expiration.</div>
        </div>
      </div>
    </div>
  `;
}

// --- Other Systems Portfolio ---
let allSystemsData = [];

function renderOtherSystems(systems) {
  allSystemsData = systems;
  const container = document.getElementById("systems-grid");
  const filterContainer = document.getElementById("systems-filter-bar");
  if (!container || !filterContainer) return;

  const categories = ["All", ...new Set(systems.map(s => s.category).filter(Boolean))];

  filterContainer.innerHTML = categories.map((cat, idx) => `
    <button class="filter-btn ${idx === 0 ? 'active' : ''}" data-category="${cat}">${cat}</button>
  `).join("");

  filterContainer.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      filterContainer.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const chosen = btn.getAttribute("data-category");
      filterSystemsGrid(chosen);
    });
  });

  filterSystemsGrid("All");
}

function filterSystemsGrid(category) {
  const container = document.getElementById("systems-grid");
  if (!container) return;

  const filtered = category === "All" 
    ? allSystemsData 
    : allSystemsData.filter(s => s.category === category);

  container.innerHTML = filtered.map(s => `
    <div class="system-card">
      <div class="system-top">
        <div class="system-header">
          <h4 class="system-title">${s.title}</h4>
          <span class="system-category">${s.category}</span>
        </div>
        <p class="system-desc" style="margin-top:8px;">${s.description}</p>
      </div>

      <div class="system-middle" style="margin: 10px 0;">
        <span class="system-highlight">${s.highlight}</span>
      </div>

      <div class="system-footer">
        <div class="system-stack">
          ${s.stack.map(tag => `<span class="system-stack-pill">${tag}</span>`).join(" · ")}
        </div>
        <div class="system-links">
          ${s.demo ? `<a href="${s.demo}" class="link-btn" target="_blank" rel="noopener noreferrer">Live ↗</a>` : ""}
          ${s.github ? `<a href="${s.github}" class="link-btn" target="_blank" rel="noopener noreferrer">Code ↗</a>` : ""}
        </div>
      </div>
    </div>
  `).join("");
}

// --- Research Section Rendering ---
function renderResearch(items) {
  const container = document.getElementById("research-grid");
  if (!container) return;

  container.innerHTML = items.map(r => `
    <article class="research-card">
      <div class="research-header">
        <span class="research-category-pill">${r.category}</span>
        <span class="research-meta">${r.role} · ${r.institution}</span>
      </div>

      <h3 class="research-title">${r.title}</h3>

      <div class="research-question-box">
        <strong>Research Question:</strong>
        ${r.question}
      </div>

      <div class="research-details-grid">
        <div class="research-col">
          <strong>Motivation</strong>
          <p>${r.motivation}</p>
        </div>
        <div class="research-col">
          <strong>Methodology</strong>
          <p>${r.methodology}</p>
        </div>
        <div class="research-col">
          <strong>Current Status</strong>
          <p>${r.status}</p>
        </div>
        <div class="research-col">
          <strong>Limitations & Next Steps</strong>
          <p>${r.limitations} ${r.nextSteps}</p>
        </div>
      </div>
    </article>
  `).join("");
}

// --- Technical Writing Rendering ---
function renderWriting(articles) {
  const container = document.getElementById("writing-grid");
  if (!container) return;

  container.innerHTML = articles.map(a => `
    <article class="writing-card">
      <div class="writing-top">
        <div class="writing-meta">
          <span>${a.publication}</span>
          <span>${a.readTime}</span>
        </div>
        <h3 class="writing-title" style="margin-top:8px;">
          <a href="${a.url}" target="_blank" rel="noopener noreferrer">${a.title} ↗</a>
        </h3>
        <p class="writing-summary">${a.summary}</p>
      </div>

      <div class="writing-footer">
        <a href="${a.url}" class="btn-read" target="_blank" rel="noopener noreferrer">Read on Substack ↗</a>
      </div>
    </article>
  `).join("");
}

// --- About & Competencies Rendering ---
function renderAbout(about) {
  const narrativeContainer = document.getElementById("about-narrative");
  const competenciesContainer = document.getElementById("competencies-list");

  if (narrativeContainer && about.narrative) {
    narrativeContainer.innerHTML = about.narrative.map(p => `<p>${p}</p>`).join("");
  }

  if (competenciesContainer && about.competencies) {
    competenciesContainer.innerHTML = about.competencies.map(comp => `
      <div class="competency-group">
        <span class="competency-title">${comp.category}</span>
        <div class="competency-tags">
          ${comp.items.map(item => `<span class="competency-pill">${item}</span>`).join("")}
        </div>
      </div>
    `).join("");
  }
}

// --- Contact & Socials Rendering ---
function renderContact(profile) {
  const emailElem = document.getElementById("contact-email");
  const copyBtn = document.getElementById("copy-email-btn");

  if (emailElem && profile.email) {
    emailElem.textContent = profile.email;
    emailElem.href = `mailto:${profile.email}`;
  }

  if (copyBtn && profile.email) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(profile.email);
        const originalText = copyBtn.textContent;
        copyBtn.textContent = "Copied";
        setTimeout(() => { copyBtn.textContent = originalText; }, 2000);
      } catch (e) {
        window.location.href = `mailto:${profile.email}`;
      }
    });
  }
}

// --- Global UI Interactions ---
function initInteractions() {
  // Deep Dive Accordion Toggles
  document.querySelectorAll(".deep-dive-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      const targetContent = document.getElementById(targetId);
      if (!targetContent) return;

      const isExpanded = targetContent.classList.toggle("expanded");
      btn.classList.toggle("expanded", isExpanded);
      btn.setAttribute("aria-expanded", isExpanded);
    });
  });

  // Handle internal anchor links to flagship deep-dives
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", () => {
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#" || hash === "#top" || hash === "#main-content") return;
      
      const targetCard = document.querySelector(hash);
      if (targetCard && targetCard.classList.contains("flagship-card")) {
        const deepDiveContent = targetCard.querySelector(".deep-dive-content");
        const deepDiveBtn = targetCard.querySelector(".deep-dive-toggle");
        if (deepDiveContent && deepDiveBtn) {
          deepDiveContent.classList.add("expanded");
          deepDiveBtn.classList.add("expanded");
          deepDiveBtn.setAttribute("aria-expanded", "true");
        }
      }
    });
  });

  // Check URL hash on page load
  if (window.location.hash) {
    const targetCard = document.querySelector(window.location.hash);
    if (targetCard && targetCard.classList.contains("flagship-card")) {
      const deepDiveContent = targetCard.querySelector(".deep-dive-content");
      const deepDiveBtn = targetCard.querySelector(".deep-dive-toggle");
      if (deepDiveContent && deepDiveBtn) {
        deepDiveContent.classList.add("expanded");
        deepDiveBtn.classList.add("expanded");
        deepDiveBtn.setAttribute("aria-expanded", "true");
      }
    }
  }
}
