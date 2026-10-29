/**
 * TOBI AWOLAJU — MULTIDISCIPLINARY ENGINEERING PORTFOLIO
 * Vanilla JS Application Architecture
 */

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMobileMenu();
  loadPortfolioData();
});

// --- Theme Management ---
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

  container.innerHTML = flagships.map((f, idx) => {
    const isFirst = idx === 0;
    const isEeg = f.id === "eeg-headset";
    const isCellular = f.id === "cellular-positioning";
    const isKyp = f.id === "kyp";

    // Visual Component Generation
    let visualHtml = "";
    if (f.gifSequence && f.gifSequence.length > 0) {
      visualHtml = `
        <div class="gif-player-wrapper" id="gif-player-${f.id}">
          <img src="${f.gifSequence[0]}" alt="${f.title} gameplay capture" class="gif-frame-view" id="gif-view-${f.id}" loading="lazy">
          <div class="gif-controls-bar">
            <span class="gif-counter" id="gif-counter-${f.id}">Frame 1 / ${f.gifSequence.length}</span>
            <div class="gif-btn-group">
              <button class="gif-ctrl-btn" data-action="prev" data-id="${f.id}" aria-label="Previous frame">← Prev</button>
              <button class="gif-ctrl-btn" data-action="toggle" data-id="${f.id}" id="gif-toggle-btn-${f.id}" aria-label="Pause animation">Pause</button>
              <button class="gif-ctrl-btn" data-action="next" data-id="${f.id}" aria-label="Next frame">Next →</button>
            </div>
          </div>
        </div>
      `;
    } else if (isEeg) {
      visualHtml = renderEegDiagram();
    } else if (isCellular) {
      visualHtml = renderCellularDiagram();
    } else if (isKyp) {
      visualHtml = renderKypDiagram();
    }

    // Deep Dive Content Generation
    const cs = f.caseStudy || {};
    let deepDiveHtml = `
      <div class="deep-dive-grid">
        <div class="case-section">
          <h4>Problem Statement</h4>
          <p>${cs.problem || ""}</p>
        </div>
        <div class="case-section">
          <h4>Technical Challenge & Bottleneck</h4>
          <p>${cs.difficulty || ""}</p>
          ${cs.hardestBug ? `<p style="margin-top:8px;"><strong>Debugging Deep Dive:</strong> ${cs.hardestBug}</p>` : ""}
        </div>
        <div class="case-section">
          <h4>Personal Engineering Ownership</h4>
          <p>${cs.personalContribution || ""}</p>
        </div>
        <div class="case-section">
          <h4>Trade-offs & Architecture</h4>
          ${cs.tradeoffs ? `<ul>${cs.tradeoffs.map(t => `<li>${t}</li>`).join("")}</ul>` : ""}
          <p style="margin-top:8px;"><strong>Current Verified Status:</strong> ${cs.verifiedStatus || f.status}</p>
          <p style="margin-top:4px;"><strong>Next Milestone:</strong> ${cs.nextSteps || ""}</p>
        </div>
      </div>
    `;

    // Special Audit Matrix for Hardware & Research
    if (cs.auditStatus) {
      deepDiveHtml += `
        <div class="case-section" style="margin-top:16px;">
          <h4>Hardware Engineering Audit & BOM</h4>
          <table class="audit-table">
            <thead>
              <tr><th>Subsystem / Parameter</th><th>Engineering Status</th><th>Detail</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>BOM & Components</strong></td>
                <td><span class="badge-verified">Acquired</span></td>
                <td>${cs.auditStatus.componentsAcquired ? cs.auditStatus.componentsAcquired.join(", ") : "TGAM, ESP32, PAM8403, Transducers"}</td>
              </tr>
              <tr>
                <td><strong>Hardware Assembly</strong></td>
                <td><span class="badge-verified">Assembled</span></td>
                <td>${cs.auditStatus.hardwareAssembled || ""}</td>
              </tr>
              <tr>
                <td><strong>Firmware Pipeline</strong></td>
                <td><span class="badge-verified">Operational</span></td>
                <td>${cs.auditStatus.firmwareImplemented || ""}</td>
              </tr>
              <tr>
                <td><strong>Validation Results</strong></td>
                <td><span class="badge-verified">Tested</span></td>
                <td>${cs.auditStatus.testedResults || ""}</td>
              </tr>
              <tr>
                <td><strong>Honest Scope & Limits</strong></td>
                <td><span class="badge-in-progress">Constrained</span></td>
                <td>${cs.auditStatus.limitationsAndHonestScope || ""}</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    }

    if (cs.researchDetails) {
      deepDiveHtml += `
        <div class="case-section" style="margin-top:16px;">
          <h4>Research Methodology & Capstone Audit</h4>
          <table class="audit-table">
            <thead>
              <tr><th>Dimension</th><th>Status</th><th>Specification</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>RF Features Logged</strong></td>
                <td><span class="badge-verified">Configured</span></td>
                <td>${cs.researchDetails.featuresLogged ? cs.researchDetails.featuresLogged.join(", ") : ""}</td>
              </tr>
              <tr>
                <td><strong>Algorithmic Methods</strong></td>
                <td><span class="badge-verified">In Testing</span></td>
                <td>${cs.researchDetails.algorithmExploration || ""}</td>
              </tr>
              <tr>
                <td><strong>Current Stage</strong></td>
                <td><span class="badge-in-progress">In Progress</span></td>
                <td>${cs.researchDetails.currentStage || ""}</td>
              </tr>
              <tr>
                <td><strong>Physical Constraints</strong></td>
                <td><span class="badge-in-progress">Environmental</span></td>
                <td>${cs.researchDetails.limitations || ""}</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    }

    return `
      <article class="flagship-card" id="${f.id}">
        <div class="flagship-header">
          <div class="flagship-index-group">
            <span class="flagship-index">SYS // ${f.index}</span>
            <span class="flagship-category">${f.category}</span>
          </div>
          <span class="flagship-status-badge ${f.badge.includes('🏆') ? 'highlight' : ''}">${f.badge}</span>
        </div>

        <div class="flagship-body">
          <div class="flagship-headline">
            <h3 class="flagship-title">${f.title}</h3>
            <div class="flagship-subtitle">${f.subtitle}</div>
          </div>

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

          <div class="flagship-visual-container">
            ${visualHtml}
          </div>

          <div class="deep-dive-accordion">
            <button class="deep-dive-toggle" aria-expanded="false" data-target="deep-dive-${f.id}">
              <span>Engineering Breakdown & System Case Study</span>
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

  initGifPlayers(flagships);
}

// --- SVG System Diagrams ---
function renderEegDiagram() {
  return `
    <div class="diagram-canvas">
      <div class="diagram-header-label">
        <span>Hardware Architecture & Biosignal Pipeline</span>
        <span>PHY.SYS // TGAM-ESP32</span>
      </div>
      <div class="system-flow-grid">
        <div class="flow-node">
          <span class="node-step">STAGE 01</span>
          <div class="node-title">Scalp Electrodes</div>
          <div class="node-desc">Fp1 Forehead Dry Sensor with ear ground/reference clips capturing 10-100μV biological potentials.</div>
        </div>
        <div class="flow-node">
          <span class="node-step">STAGE 02</span>
          <div class="node-title">TGAM ASIC Frontend</div>
          <div class="node-desc">Analog filtering (50Hz notch + bandpass) and 12-bit ADC digitization into ThinkGear serial stream.</div>
        </div>
        <div class="flow-node">
          <span class="node-step">STAGE 03</span>
          <div class="node-title">ESP32 Dual-Core Engine</div>
          <div class="node-desc">Core 0: 57,600 baud UART parser & checksum check. Core 1: rolling SD intentional gesture detector.</div>
        </div>
        <div class="flow-node">
          <span class="node-step">STAGE 04</span>
          <div class="node-title">Audio & Bone Conduction</div>
          <div class="node-desc">PAM8403 amplifier driving 8Ω bone-conduction transducers directly against cranial temporal bones.</div>
        </div>
      </div>
    </div>
  `;
}

function renderCellularDiagram() {
  return `
    <div class="diagram-canvas">
      <div class="diagram-header-label">
        <span>Cellular Fingerprinting Localization Architecture</span>
        <span>RF.SYS // GSM-LTE-KNN</span>
      </div>
      <div class="system-flow-grid">
        <div class="flow-node">
          <span class="node-step">PHASE 01</span>
          <div class="node-title">Cellular Transceivers</div>
          <div class="node-desc">Multiple commercial eNodeB / BTS towers broadcasting RF carrier signals across 900/1800/2100MHz bands.</div>
        </div>
        <div class="flow-node">
          <span class="node-step">PHASE 02</span>
          <div class="node-title">AT-Command Logging Rig</div>
          <div class="node-desc">Dedicated modem polling AT+CSQ (RSSI), AT+CREG (LAC/CID) and neighbor cell measurements.</div>
        </div>
        <div class="flow-node">
          <span class="node-step">PHASE 03</span>
          <div class="node-title">Offline Radio Map DB</div>
          <div class="node-desc">Calibrated spatial grid linking reference coordinates (X, Y) with multi-dimensional RSSI fingerprint vectors.</div>
        </div>
        <div class="flow-node">
          <span class="node-step">PHASE 04</span>
          <div class="node-title">Online Pattern Matching</div>
          <div class="node-desc">Weighted k-Nearest Neighbors (WkNN) and Bayesian estimation mapping unknown vectors to real coordinates.</div>
        </div>
      </div>
    </div>
  `;
}

function renderKypDiagram() {
  return `
    <div class="diagram-canvas">
      <div class="diagram-header-label">
        <span>Protocol-Agnostic Accountability Pipeline</span>
        <span>EVM.SYS // MONAD-KYP</span>
      </div>
      <div class="system-flow-grid">
        <div class="flow-node">
          <span class="node-step">STEP 01</span>
          <div class="node-title">AI Research Pipeline</div>
          <div class="node-desc">Dual-agent framework (Flash + Deep Researcher via Gemini) synthesizing target protocol contracts.</div>
        </div>
        <div class="flow-node">
          <span class="node-step">STEP 02</span>
          <div class="node-title">Solidity Stake Vault</div>
          <div class="node-desc">User locks economic stake under a programmable 9-day, 3-strike accountability contract.</div>
        </div>
        <div class="flow-node">
          <span class="node-step">STEP 03</span>
          <div class="node-title">Heartbeat Log Scanner</div>
          <div class="node-desc">Autonomous zero-cost daemon invoking getLogs filtering for user address interaction with target contracts.</div>
        </div>
        <div class="flow-node">
          <span class="node-step">STEP 04</span>
          <div class="node-title">Automated Resolution</div>
          <div class="node-desc">Deterministic stake release upon successful completion or slashing redistribution upon strike expiration.</div>
        </div>
      </div>
    </div>
  `;
}

// --- GIF Player Controls ---
function initGifPlayers(flagships) {
  const gifHolders = {};

  flagships.forEach(f => {
    if (!f.gifSequence || f.gifSequence.length === 0) return;

    gifHolders[f.id] = {
      frames: f.gifSequence,
      currentIndex: 0,
      isPlaying: true,
      timer: null
    };

    const view = document.getElementById(`gif-view-${f.id}`);
    const counter = document.getElementById(`gif-counter-${f.id}`);
    const toggleBtn = document.getElementById(`gif-toggle-btn-${f.id}`);

    const updateView = () => {
      const state = gifHolders[f.id];
      if (view) view.src = state.frames[state.currentIndex];
      if (counter) counter.textContent = `Frame ${state.currentIndex + 1} / ${state.frames.length}`;
    };

    const startLoop = () => {
      const state = gifHolders[f.id];
      if (state.timer) clearInterval(state.timer);
      state.timer = setInterval(() => {
        state.currentIndex = (state.currentIndex + 1) % state.frames.length;
        updateView();
      }, 2400);
      state.isPlaying = true;
      if (toggleBtn) toggleBtn.textContent = "Pause";
    };

    const stopLoop = () => {
      const state = gifHolders[f.id];
      if (state.timer) clearInterval(state.timer);
      state.isPlaying = false;
      if (toggleBtn) toggleBtn.textContent = "Play";
    };

    startLoop();

    // Attach Button Handlers
    const container = document.getElementById(`gif-player-${f.id}`);
    if (container) {
      container.querySelectorAll(".gif-ctrl-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const action = btn.getAttribute("data-action");
          const state = gifHolders[f.id];

          if (action === "toggle") {
            if (state.isPlaying) stopLoop();
            else startLoop();
          } else if (action === "next") {
            stopLoop();
            state.currentIndex = (state.currentIndex + 1) % state.frames.length;
            updateView();
          } else if (action === "prev") {
            stopLoop();
            state.currentIndex = (state.currentIndex - 1 + state.frames.length) % state.frames.length;
            updateView();
          }
        });
      });
    }
  });
}

// --- Other Systems Rendering & Filtering ---
let allSystemsData = [];

function renderOtherSystems(systems) {
  allSystemsData = systems;
  const container = document.getElementById("systems-grid");
  const filterContainer = document.getElementById("systems-filter-bar");
  if (!container || !filterContainer) return;

  // Extract unique categories
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
          <span class="system-domain">${s.category}</span>
        </div>
        <p class="system-desc" style="margin-top:10px;">${s.description}</p>
      </div>

      <div class="system-middle" style="margin: 12px 0;">
        <span class="system-metric">⚡ ${s.metric}</span>
      </div>

      <div class="system-footer">
        <div class="system-stack">
          ${s.stack.map(tag => `<span class="system-stack-pill">${tag}</span>`).join(" · ")}
        </div>
        <div class="system-links">
          ${s.demo ? `<a href="${s.demo}" class="link-icon-btn" target="_blank" rel="noopener noreferrer">Live ↗</a>` : ""}
          ${s.github ? `<a href="${s.github}" class="link-icon-btn" target="_blank" rel="noopener noreferrer">Code ↗</a>` : ""}
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
        <span class="research-status-pill">${r.status}</span>
        <span class="research-role">${r.role} · ${r.institution}</span>
      </div>

      <h3 class="research-title">${r.title}</h3>

      <div class="research-question-box">
        <strong>Research Question:</strong>
        ${r.question}
      </div>

      <div class="research-details-grid">
        <div class="research-col">
          <strong>Context & Motivation</strong>
          <p>${r.context}</p>
        </div>
        <div class="research-col">
          <strong>Methodology</strong>
          <p>${r.methodology}</p>
        </div>
        <div class="research-col">
          <strong>Current Findings</strong>
          <p>${r.currentFindings}</p>
        </div>
        <div class="research-col">
          <strong>Open Questions</strong>
          <p>${r.openQuestions}</p>
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
          <span class="writing-platform">${a.publication}</span>
          <span>${a.readTime}</span>
        </div>
        <h3 class="writing-title" style="margin-top:10px;">
          <a href="${a.url}" target="_blank" rel="noopener noreferrer">${a.title} ↗</a>
        </h3>
        <p class="writing-summary" style="margin-top:8px;">${a.summary}</p>
      </div>

      <div class="writing-footer">
        <a href="${a.url}" class="btn-read-essay" target="_blank" rel="noopener noreferrer">Read Essay on Substack ↗</a>
      </div>
    </article>
  `).join("");
}

// --- About & Competencies Rendering ---
function renderAbout(about) {
  const narrativeContainer = document.getElementById("about-narrative");
  const competenciesContainer = document.getElementById("competencies-list");

  if (narrativeContainer && about.narrative) {
    narrativeContainer.innerHTML = `
      <p class="lead">${about.summary || ""}</p>
      ${about.narrative.map(p => `<p>${p}</p>`).join("")}
    `;
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
        copyBtn.textContent = "Copied!";
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
    anchor.addEventListener("click", (e) => {
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
