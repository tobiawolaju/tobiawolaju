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
        const profileContainer = document.getElementById("profile-pic-container");
        profileContainer.innerHTML = `
            <img src="${data.profile.image}" alt="${data.profile.imageAlt || 'Profile'}"
                style="width: 60px; height: 60px; border-radius: 25%; vertical-align: middle; margin-right: 10px;">
            ${data.profile.tooltip ? `
            <span id="tooltip" style="visibility: hidden; opacity: 0; transition: opacity 0.3s;
                background-color: rgb(69, 69, 69); color: #ffffff; text-align: center; border-radius: 5px;
                padding: 3px 6px; position: absolute; bottom: 70%; left: 130%; transform: translateX(-50%);
                font-size: 12px; white-space: nowrap;">
                ${data.profile.tooltip}
            </span>
            <style> #profile-pic-container:hover #tooltip { visibility: visible; opacity: 1; } </style>
            ` : ''}
        `;

        // Add tooltip logic if tooltip exists
        if (data.profile.tooltip) {
            const container = document.getElementById("profile-pic-container");
            const tooltip = document.getElementById("tooltip");
            if (container && tooltip) {
                let hideTimeout;
                container.addEventListener("mouseenter", () => {
                    clearTimeout(hideTimeout);
                    tooltip.style.visibility = "visible";
                    tooltip.style.opacity = "1";
                    hideTimeout = setTimeout(() => {
                        tooltip.style.opacity = "0";
                        setTimeout(() => tooltip.style.visibility = "hidden", 300);
                    }, 2000);
                });
                container.addEventListener("mouseleave", () => {
                    clearTimeout(hideTimeout);
                    tooltip.style.opacity = "0";
                    setTimeout(() => tooltip.style.visibility = "hidden", 300);
                });
            }
        }

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
            resumeBtn.textContent = "View Resume ↗";
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
            filterHTML += `<button data-filter="${filter.id === 'all' ? 'all' : filter.id}" class="${activeClass}">${filter.label}</button>`;
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

            return `
            <div class="project" data-category="${project.category}">
                <img src="${project.image}" alt="${project.title}"${gifSequence}>
                <div class="project-info">
                    <a href="#"><strong>${project.title}</strong></a>
                    <p class="mission">${project.description}</p>
                    
                    <div class="links" style="margin-top: 1rem;">
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
                        <div class="writeup-section">
                            <strong>1. Overview:</strong>
                            <p>${project.writeup.overview}</p>
                        </div>
                        <div class="writeup-section">
                            <strong>2. Core Features:</strong>
                            <ul>${project.writeup.features.map(feat => `<li>${feat}</li>`).join("")}</ul>
                        </div>
                        <div class="writeup-section">
                            <strong>3. Architecture:</strong>
                            <p>${project.writeup.architecture}</p>
                        </div>
                        <div class="writeup-section">
                            <strong>4. Tech Stack:</strong>
                            <p>${project.writeup.techStack}</p>
                        </div>
                        <div class="writeup-section">
                            <strong>5. Infrastructure:</strong>
                            <p>${project.writeup.infrastructure}</p>
                        </div>
                        ${project.writeup.web3 ? `
                        <div class="writeup-section">
                            <strong>6. Web3 & Smart Contracts:</strong>
                            <p>${project.writeup.web3}</p>
                        </div>
                        ` : ''}
                        <div class="writeup-section">
                            <strong>7. Challenges:</strong>
                            <p>${project.writeup.challenges}</p>
                        </div>
                        <div class="writeup-section">
                            <strong>8. Outcomes:</strong>
                            <p>${project.writeup.outcomes}</p>
                        </div>
                        <div class="writeup-section">
                            <strong>9. Future Scope:</strong>
                            <p>${project.writeup.future}</p>
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
        }).join("");

        initProjectGifLoops();
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
                    <strong>${doc.title}</strong>
                </a>
                <p style="opacity: 50%;">${doc.description}</p>
            </li>
        `).join("");
    }

    // 6. Activity / Contributions
    if (data.sectionLabels && data.sectionLabels.activity) {
        document.getElementById("activity-header").innerHTML = `${data.sectionLabels.activity} <a style=" opacity: 0.4;">Contributions</a>`;
    }
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

    // --- Toggles ---
    const toggles = document.querySelectorAll(".toggle");
    toggles.forEach(toggle => {
        toggle.addEventListener("click", () => {
            const content = toggle.nextElementSibling;
            content.classList.toggle("hidden");
        });
    });

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
    document.querySelectorAll('.filters button').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filters button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            document.querySelectorAll('.project').forEach(project => {
                const category = project.getAttribute('data-category');
                if (filter === "all" || category === filter) {
                    project.style.display = "block";
                } else {
                    project.style.display = "none";
                }
            });
        });
    });

    // Trigger first filter click
    const firstFilter = document.querySelector('.filters button');
    if (firstFilter) firstFilter.click();

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
