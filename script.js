// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", async function () {
    // Splash screen timeout
    setTimeout(() => {
        const splash = document.getElementById("splash-screen");
        if (splash) {
            splash.classList.add("splash-hidden");
        }
    }, 2500);

    const jsonFile = "engineering.json";

    try {
        const response = await fetch(jsonFile);
        if (!response.ok) {
            throw new Error(`Could not load ${jsonFile}`);
        }
        const data = await response.json();
        renderPortfolio(data);
    } catch (error) {
        console.error(error);
        alert("Failed to load portfolio content.");
    }

    // Initialize UI interactions after rendering
    initInteractions();
});

function renderPortfolio(data) {
    document.title = data.pageTitle || "Tobiloba Awolaju | Web3 Systems Engineer";

    if (data.profile) {
        document.getElementById("profile-name").textContent = data.profile.name;
        document.getElementById("profile-title").textContent = data.profile.title;
        const subtitle = document.getElementById("hero-subtitle");
        if (subtitle) subtitle.textContent = data.profile.subtitle || subtitle.textContent;

        const aboutContent = document.getElementById("about-content");
        aboutContent.innerHTML = data.profile.bio || "";
        if (data.profile.resumeLink) {
            const resumeBtn = document.createElement("a");
            resumeBtn.className = "resume inline-resume";
            resumeBtn.href = data.profile.resumeLink;
            resumeBtn.target = "_blank";
            resumeBtn.rel = "noopener noreferrer";
            resumeBtn.textContent = "Open CV";
            aboutContent.appendChild(resumeBtn);
        }
    }

    const filterContainer = document.getElementById("project-filters");
    if (filterContainer && data.filters) {
        filterContainer.innerHTML = data.filters.map((filter, index) =>
            `<button data-filter="${filter.id}" class="${index === 0 ? "active" : ""}">${filter.label}</button>`
        ).join("");
    }

    const projectsList = document.getElementById("projects-list");
    if (projectsList && data.projects) {
        const flagshipProjects = data.projects.filter(project => (project.tags || []).includes("flagship"));
        projectsList.innerHTML = flagshipProjects.map(project => {
            const slug = project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").replace(/-$/, "");
            const gifSequence = Array.isArray(project.gifSequence) && project.gifSequence.length
                ? ` data-gif-sequence="${project.gifSequence.join(",")}"`
                : "";
            const preview = project.image ? `<img src="${project.image}" alt="${project.title} product preview" loading="lazy"${gifSequence}>` : "";
            return `
            <article class="project flagship-card" id="${slug}-details" data-tags="${(project.tags || []).join(",")}">
                <div class="project-media">${preview}<div class="architecture-map">${(project.architecture || []).map(item => `<span>${item}</span>`).join("")}</div></div>
                <div class="project-info">
                    <p class="project-kicker">${project.kicker || "Flagship build"}</p>
                    <h3>${project.title.replace(" ↗", "")}</h3>
                    <p class="mission">${project.description}</p>
                    <ul class="project-bullets">${(project.bullets || []).map(item => `<li>${item}</li>`).join("")}</ul>
                    <div class="links">${(project.links || []).map(link => `<a href="${link.url}" class="tag tag-blue" ${link.url.startsWith("#") ? "" : 'target="_blank" rel="noopener noreferrer"'}>${link.text}</a>`).join("")}</div>
                    ${project.details ? `<button class="writeup-toggle">Project Page ▾</button><div class="technical-writeup project-page">${Object.entries(project.details).map(([key, value]) => `<div class="writeup-section"><strong>${labelFromKey(key)}</strong><p>${linkifyDetail(value)}</p></div>`).join("")}</div>` : ""}
                </div>
            </article>`;
        }).join("");
        initProjectGifLoops();
    }

    const highlightsGrid = document.getElementById("highlights-grid");
    if (highlightsGrid && data.highlights) {
        highlightsGrid.innerHTML = data.highlights.map(item => `<article class="highlight-card"><span>✦</span><p>${item}</p></article>`).join("");
    }

    const skillsContent = document.getElementById("skills-content");
    if (skillsContent && data.techStack) {
        skillsContent.innerHTML = Object.entries(data.techStack).map(([group, items]) => `<article class="stack-card"><h3>${group}</h3><div>${items.map(item => `<span>${item}</span>`).join("")}</div></article>`).join("");
    }

    const timelineList = document.getElementById("timeline-list");
    if (timelineList && data.currentlyBuilding) {
        timelineList.innerHTML = data.currentlyBuilding.map((item, index) => `<article class="timeline-item"><span>0${index + 1}</span><p>${item}</p></article>`).join("");
    }

    const docsList = document.getElementById("docs-list");
    if (docsList && data.docs) {
        docsList.innerHTML = data.docs.map(doc => `<li><a href="${doc.link}" target="_blank" rel="noopener noreferrer"><strong>${doc.title}</strong></a><p>${doc.description}</p></li>`).join("");
    }
}

function labelFromKey(key) {
    return key.replace(/([A-Z])/g, " $1").replace(/^./, char => char.toUpperCase());
}

function linkifyDetail(value) {
    if (typeof value === "string" && /^https?:\/\//.test(value)) {
        return `<a href="${value}" target="_blank" rel="noopener noreferrer">${value}</a>`;
    }
    return value;
}

function initProjectGifLoops() {
    const gifImages = document.querySelectorAll(".project img[data-gif-sequence]");

    gifImages.forEach((image) => {
        const frames = image.dataset.gifSequence
            .split(",")
            .map(frame => frame.trim())
            .filter(Boolean);

        if (frames.length < 2) return;

        let frameIndex = 0;
        image.src = frames[frameIndex];

        const playNextGif = async () => {
            const activeGif = frames[frameIndex];
            const durationMs = await getGifDurationMs(activeGif);

            setTimeout(() => {
                frameIndex = (frameIndex + 1) % frames.length;
                image.src = frames[frameIndex];
                playNextGif();
            }, durationMs);
        };

        playNextGif();
    });
}

function initLazyIframes() {
    if (!("IntersectionObserver" in window)) {
        document.querySelectorAll("iframe[data-src]").forEach(iframe => {
            iframe.src = iframe.dataset.src;
        });
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const iframe = entry.target;
                if (iframe.dataset.src) {
                    iframe.src = iframe.dataset.src;
                    iframe.removeAttribute("data-src");
                }
                observer.unobserve(iframe);
            }
        });
    }, { rootMargin: "400px" });

    document.querySelectorAll("iframe[data-src]").forEach(iframe => {
        observer.observe(iframe);
    });
}

const gifDurationCache = new Map();
const GIF_DURATION_FALLBACK_MS = 2000;

async function getGifDurationMs(gifUrl) {
    if (gifDurationCache.has(gifUrl)) {
        return gifDurationCache.get(gifUrl);
    }

    try {
        const response = await fetch(gifUrl);
        if (!response.ok) {
            throw new Error(`Could not load GIF: ${gifUrl}`);
        }

        const buffer = await response.arrayBuffer();
        const durationMs = parseGifDurationMs(buffer);
        gifDurationCache.set(gifUrl, durationMs);
        return durationMs;
    } catch (error) {
        console.warn(`Falling back to default GIF duration for ${gifUrl}`, error);
        gifDurationCache.set(gifUrl, GIF_DURATION_FALLBACK_MS);
        return GIF_DURATION_FALLBACK_MS;
    }
}

function parseGifDurationMs(arrayBuffer) {
    const bytes = new Uint8Array(arrayBuffer);
    let pointer = 0;
    let totalMs = 0;

    // Skip GIF Header + Logical Screen Descriptor
    pointer += 13;

    // Global Color Table
    const packedFields = bytes[10];
    const hasGlobalColorTable = (packedFields & 0x80) !== 0;
    if (hasGlobalColorTable) {
        const gctSize = 3 * (2 ** ((packedFields & 0x07) + 1));
        pointer += gctSize;
    }

    while (pointer < bytes.length) {
        const blockId = bytes[pointer];

        // Graphic Control Extension
        if (blockId === 0x21 && bytes[pointer + 1] === 0xF9) {
            const delayCs = bytes[pointer + 4] | (bytes[pointer + 5] << 8);
            // GIF delay is in centiseconds; clamp tiny values to 10ms-equivalent browser behavior.
            const frameDelayMs = Math.max(delayCs, 1) * 10;
            totalMs += frameDelayMs;
            pointer += 8; // 21 F9 04 [packed] [delay lo] [delay hi] [trans index] 00
            continue;
        }

        // Extension block (other than GCE)
        if (blockId === 0x21) {
            pointer += 2; // Skip introducer + label
            while (pointer < bytes.length) {
                const size = bytes[pointer];
                pointer += 1;
                if (size === 0) break;
                pointer += size;
            }
            continue;
        }

        // Image Descriptor
        if (blockId === 0x2C) {
            pointer += 10; // Descriptor block
            const localPacked = bytes[pointer - 1];
            const hasLocalColorTable = (localPacked & 0x80) !== 0;
            if (hasLocalColorTable) {
                const lctSize = 3 * (2 ** ((localPacked & 0x07) + 1));
                pointer += lctSize;
            }

            pointer += 1; // LZW minimum code size
            while (pointer < bytes.length) {
                const size = bytes[pointer];
                pointer += 1;
                if (size === 0) break;
                pointer += size;
            }
            continue;
        }

        // GIF Trailer
        if (blockId === 0x3B) {
            break;
        }

        // Unknown block; stop parsing to avoid infinite loops
        break;
    }

    return totalMs > 0 ? totalMs : GIF_DURATION_FALLBACK_MS;
}

function initProjectFilterPinning(filterContainer, projectsSection) {
    if (!filterContainer || !projectsSection) return;

    const filtersSpacer = document.createElement("div");
    filtersSpacer.className = "filters-spacer";
    filterContainer.parentNode.insertBefore(filtersSpacer, filterContainer);
    filtersSpacer.appendChild(filterContainer);

    const filtersShell = document.createElement("div");
    filtersShell.id = "project-filters-shell";

    let isPinned = false;
    let ticking = false;

    const syncPinnedGeometry = () => {
        if (!isPinned) return;
        const rect = filtersSpacer.getBoundingClientRect();
        filtersShell.style.paddingLeft = `${rect.left}px`;
        filtersShell.style.paddingRight = `${window.innerWidth - rect.right}px`;
    };

    const setPinned = (pinned) => {
        if (pinned === isPinned) return;
        isPinned = pinned;

        if (pinned) {
            filtersSpacer.style.height = `${filterContainer.offsetHeight}px`;
            document.body.appendChild(filtersShell);
            filtersShell.appendChild(filterContainer);
            syncPinnedGeometry();
        } else {
            filtersSpacer.style.height = "";
            filtersSpacer.appendChild(filterContainer);
            filtersShell.remove();
            filtersShell.style.paddingLeft = "";
            filtersShell.style.paddingRight = "";
        }
    };

    const updatePinnedState = () => {
        ticking = false;
        const sectionRect = projectsSection.getBoundingClientRect();
        const spacerRect = filtersSpacer.getBoundingClientRect();
        const topOffset = -20;
        const shouldPin = sectionRect.top <= topOffset && sectionRect.bottom > spacerRect.height + topOffset;

        setPinned(shouldPin);
        syncPinnedGeometry();
    };

    const requestUpdate = () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(updatePinnedState);
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    requestUpdate();
}

function initInteractions() {
    // --- Scroll Progress ---
    const progress = document.querySelector(".scroll-progress");
    const updateProgress = () => {
        if (!progress) return;
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const percentage = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
        progress.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    // --- Scroll Reveal ---
    const sections = document.querySelectorAll("section");
    const revealSections = () => {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            if (rect.top <= windowHeight - 100 && rect.bottom >= 100) {
                section.classList.add("visible");
            }
        });
    };
    window.addEventListener("scroll", revealSections);
    revealSections();

    // --- Project Breakdown Toggles ---
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("writeup-toggle")) {
            const toggle = e.target;
            const content = toggle.nextElementSibling;
            const isExpanded = content.classList.toggle("expanded");
            toggle.textContent = isExpanded ? "Project Breakdown ▴" : "Project Breakdown ▾";
        }
    });

    // --- Filters ---
    const filterButtons = document.querySelectorAll('.filters button');
    const projectCards = document.querySelectorAll('.project');

    const setProjectVisibility = (activeFilter) => {
        const isAllFilter = activeFilter === "all";
        let visibleCount = 0;

        projectCards.forEach(project => {
            const tags = (project.getAttribute('data-tags') || "")
                .split(",")
                .map(tag => tag.trim())
                .filter(Boolean);
            const matchesFilter = isAllFilter || tags.includes(activeFilter);
            const shouldShow = matchesFilter;

            project.classList.toggle('is-visible', shouldShow);
            project.classList.toggle('is-hidden', !shouldShow);
            project.style.display = shouldShow ? "" : "none";

            if (shouldShow) visibleCount += 1;
        });

        if (visibleCount === 0) {
            projectCards.forEach(project => {
                project.classList.add('is-visible');
                project.classList.remove('is-hidden');
                project.style.display = "";
            });
        }
    };

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const activeFilter = btn.getAttribute('data-filter') || "all";

            projectCards.forEach(project => {
                project.classList.add('is-transitioning');
            });

            setTimeout(() => {
                setProjectVisibility(activeFilter);
                projectCards.forEach(project => project.classList.remove('is-transitioning'));
            }, 160);
        });
    });

    const defaultFilter = document.querySelector('.filters button[data-filter="all"]') || document.querySelector('.filters button');
    if (defaultFilter) defaultFilter.click();

    // --- Contact Section Reveal ---
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('vis');
                revealObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal2').forEach(el => revealObs.observe(el));


    // --- Footer Scroll ---
    const footer = document.getElementById("site-footer");
    if (footer) {
        window.addEventListener("scroll", () => {
            const rect = footer.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            if (rect.top < windowHeight && rect.bottom > 0) {
                footer.classList.add("visible");
            } else {
                footer.classList.remove("visible");
            }
        });
    }
}
