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
    // 1. Page Title
    document.title = data.pageTitle || "Tobi's Portfolio";

    // 2. Profile
    if (data.profile) {

        document.getElementById("profile-name").textContent = data.profile.name;
        document.getElementById("profile-title").textContent = data.profile.title;

        // About Content
        const aboutContent = document.getElementById("about-content");
        aboutContent.innerHTML = data.profile.bio;
        if (data.profile.resumeLink) {
            const resumeBtn = document.createElement("a");
            resumeBtn.className = "resume";
            resumeBtn.href = data.profile.resumeLink;
            resumeBtn.target = "_blank";
            resumeBtn.rel = "noopener noreferrer";
            resumeBtn.innerHTML = `<img src="https://img.icons8.com/ios-filled/24/000000/documents.png" alt="CV" class="cv-icon cv-icon-light" width="16" height="16" style="vertical-align:middle; margin-right:6px;"><img src="https://img.icons8.com/ios-filled/24/ffffff/documents.png" alt="CV" class="cv-icon cv-icon-dark" width="16" height="16" style="vertical-align:middle; margin-right:6px;">Open CV`;
            aboutContent.appendChild(resumeBtn);
        }
    }

    // 3. Projects filters
    const filterContainer = document.getElementById("project-filters");
    if (data.filters) {
        let filterHTML = "";
        data.filters.forEach((filter, index) => {
            // First one active by default
            const activeClass = index === 0 ? "active" : "";
            filterHTML += `<button data-filter="${filter.id}" class="${activeClass}">${filter.label}</button>`;
        });
        filterContainer.innerHTML = filterHTML;
    }

    // Projects Header Description
    const projectsHeaderDescription = document.getElementById("projects-header-description");
    if (projectsHeaderDescription && data.sectionLabels && data.sectionLabels.projectsDescription) {
        projectsHeaderDescription.innerHTML = `<p style="opacity: 0.6; margin-bottom: 2rem;">${data.sectionLabels.projectsDescription}</p>`;
        projectsHeaderDescription.style.display = "block";
    } else if (projectsHeaderDescription) {
        projectsHeaderDescription.style.display = "none";
    }

    // 4. Projects
    const projectsList = document.getElementById("projects-list");
    if (data.projects) {
        projectsList.innerHTML = data.projects.map(project => {
            const gifSequence = Array.isArray(project.gifSequence) && project.gifSequence.length
                ? ` data-gif-sequence="${project.gifSequence.join(",")}"`
                : "";

            const primaryLiveLink = (project.links || []).find(link => !/github/i.test(link.text || link.url));
            const projectPreview = primaryLiveLink?.url
                ? `<div class="project-preview" aria-hidden="true"><iframe data-src="${primaryLiveLink.url}" title="${project.title} live preview" loading="lazy" referrerpolicy="no-referrer-when-downgrade" tabindex="-1"></iframe></div>`
                : `<img src="${project.image}" alt="${project.title}"${gifSequence}>`;

            return `
            <div class="project" data-tags="${(project.tags || []).join(",")}">
                ${projectPreview}
                <div class="project-info">
                    <a href="#"><strong>${project.title}</strong></a>
                    <p class="mission">${project.description}</p>
                </div>
                <div class="project-footer">
                    <div class="links">
                        ${project.links.map(link => {
                let tagClass = 'tag-blue';
                const text = link.text.toLowerCase();
                if (text.includes('github')) tagClass = 'tag-purple';
                else if (text.includes('demo') || text.includes('video')) tagClass = 'tag-green';
                else if (text.includes('3d') || text.includes('files')) tagClass = 'tag-yellow';
                else if (text.includes('docs') || text.includes('paper')) tagClass = 'tag-blue';
                else if (text.includes('testing') || text.includes('results')) tagClass = 'tag-red';
                return `<a href="${link.url}" class="tag ${tagClass}" target="_blank">${link.text}</a>`;
            }).join("")}
                    </div>
                    ${project.writeup ? `
                    <button class="writeup-toggle">Project Breakdown ▾</button>
                    <div class="technical-writeup" style="border-left: 2px solid #ccc; padding-left: 1rem;">
                        ${project.writeup.goal ? `
                        <div class="writeup-section">
                            <strong>• The Goal:</strong>
                            <p>${project.writeup.goal}</p>
                        </div>
                        ` : ''}
                        ${project.writeup.overview ? `
                        <div class="writeup-section">
                            <strong>1. Overview:</strong>
                            <p>${project.writeup.overview}</p>
                        </div>
                        ` : ''}
                        ${project.writeup.features ? `
                        <div class="writeup-section">
                            <strong>2. Core Features:</strong>
                            <ul>${project.writeup.features.map(feat => `<li>${feat}</li>`).join("")}</ul>
                        </div>
                        ` : ''}
                        ${project.writeup.architecture ? `
                        <div class="writeup-section">
                            <strong>3. Architecture:</strong>
                            <p>${project.writeup.architecture}</p>
                        </div>
                        ` : ''}
                        ${project.writeup.hardPart ? `
                        <div class="writeup-section">
                            <strong>• The Hard Part (Engineering):</strong>
                            <p>${project.writeup.hardPart}</p>
                        </div>
                        ` : ''}
                        ${project.writeup.techStack ? `
                        <div class="writeup-section">
                            <strong>4. Tech Stack:</strong>
                            <p>${project.writeup.techStack}</p>
                        </div>
                        ` : ''}
                        ${project.writeup.stack ? `
                        <div class="writeup-section">
                            <strong>• The Stack:</strong>
                            <p>${project.writeup.stack}</p>
                        </div>
                        ` : ''}
                        ${project.writeup.infrastructure ? `
                        <div class="writeup-section">
                            <strong>5. Infrastructure:</strong>
                            <p>${project.writeup.infrastructure}</p>
                        </div>
                        ` : ''}
                        ${project.writeup.web3 ? `
                        <div class="writeup-section">
                            <strong>6. Web3 &amp; Smart Contracts:</strong>
                            <p>${project.writeup.web3}</p>
                        </div>
                        ` : ''}
                        ${project.writeup.challenges ? `
                        <div class="writeup-section">
                            <strong>7. Challenges:</strong>
                            <p>${project.writeup.challenges}</p>
                        </div>
                        ` : ''}
                        ${project.writeup.outcomes ? `
                        <div class="writeup-section">
                            <strong>8. Outcomes:</strong>
                            <p>${project.writeup.outcomes}</p>
                        </div>
                        ` : ''}
                        ${project.writeup.value ? `
                        <div class="writeup-section">
                            <strong>• Value to a Team:</strong>
                            <p>${project.writeup.value}</p>
                        </div>
                        ` : ''}
                        ${project.writeup.future ? `
                        <div class="writeup-section">
                            <strong>9. Future Scope:</strong>
                            <p>${project.writeup.future}</p>
                        </div>
                        ` : ''}
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
        }).join("");

        initProjectGifLoops();
        initLazyIframes();
    }

    // 5. Docs
    const docsList = document.getElementById("docs-list");
    if (data.docs) {
        // Set dynamic title
        if (data.sectionLabels && data.sectionLabels.docs) {
            document.getElementById("docs-header").innerHTML = `${data.sectionLabels.docs}<a style="opacity: 0.4;">↗</a>`;
        } else {
            document.getElementById("docs-header").innerHTML = `Docs<a style="opacity: 0.4;">↗</a>`;
        }

        docsList.innerHTML = data.docs.map(doc => `
            <li>
                <a href="${doc.link}" target="_blank" rel="noopener noreferrer">
                    <strong><span style="color: #FFD700;">{</span> ${doc.title} <span style="color: #FFD700;">}</span></strong>
                </a>
                <p style="opacity: 50%;">${doc.description}</p>
            </li>
        `).join("");
    }

    // 6. Activity / Contributions
    if (data.sectionLabels && data.sectionLabels.activity) {
        const activityHeader = document.getElementById("activity-header");
        if (activityHeader) {
            activityHeader.textContent = data.sectionLabels.activity;
        }
    }

    const projectsSection = document.getElementById("projects-section");
    initProjectFilterPinning(filterContainer, projectsSection);
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

function initInteractions() {
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
            project.style.display = shouldShow ? "block" : "none";

            if (shouldShow) visibleCount += 1;
        });

        // Ensure no empty states: fallback to showing all projects.
        if (visibleCount === 0) {
            projectCards.forEach(project => {
                project.classList.add('is-visible');
                project.classList.remove('is-hidden');
                project.style.display = "block";
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

    // Default selected filter is "All"
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
