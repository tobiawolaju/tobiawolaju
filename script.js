// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const target = urlParams.get("target") || "engineering"; // Default to engineering
    const jsonFile = `${target}.json`;

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

    // 4. Projects
    const projectsList = document.getElementById("projects-list");
    if (data.projects) {
        projectsList.innerHTML = data.projects.map(project => `
            <div class="project" data-category="${project.category}">
                <img src="${project.image}" alt="${project.title}">
                <div class="project-info">
                    <a href="#"><strong>${project.title}</strong></a>
                    <p class="mission">${project.description}</p>
                    
                    <div class="links" style="margin-top: 1rem;">
                        ${project.links.map(link => `<a href="${link.url}" target="_blank">${link.text}</a>`).join("")}
                    </div>

                    ${project.writeup ? `
                    <button class="writeup-toggle">Engineering Log ▾</button>
                    <div class="technical-writeup" style="border-left: 2px solid #ccc; padding-left: 1rem;">
                        <div class="writeup-section">
                            <strong>1. Motivation:</strong>
                            <p>${project.writeup.motivation}</p>
                        </div>
                        <div class="writeup-section">
                            <strong>2. Objectives:</strong>
                            <ul>${project.writeup.objectives.map(obj => `<li>${obj}</li>`).join("")}</ul>
                        </div>
                        <div class="writeup-section">
                            <strong>3. Architecture:</strong>
                            <p>${project.writeup.architecture}</p>
                        </div>
                        <div class="writeup-section">
                            <strong>4. Hardware:</strong>
                            <p>${project.writeup.hardware}</p>
                        </div>
                        <div class="writeup-section">
                            <strong>5. Software:</strong>
                            <p>${project.writeup.software}</p>
                        </div>
                        ${project.writeup.perception ? `
                        <div class="writeup-section">
                            <strong>6. Perception:</strong>
                            <p>${project.writeup.perception}</p>
                        </div>
                        ` : ''}
                        <div class="writeup-section">
                            <strong>7. Challenges:</strong>
                            <p>${project.writeup.challenges}</p>
                        </div>
                        <div class="writeup-section">
                            <strong>8. Results:</strong>
                            <p>${project.writeup.results}</p>
                        </div>
                        <div class="writeup-section">
                            <strong>9. Lessons:</strong>
                            <p>${project.writeup.lessons}</p>
                        </div>
                        <div class="writeup-section">
                            <strong>10. Future:</strong>
                            <p>${project.writeup.future}</p>
                        </div>
                        <div class="writeup-section">
                            <strong>11. References:</strong>
                            <p>${project.writeup.references}</p>
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>
        `).join("");
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

    // --- Engineering Log Toggles ---
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("writeup-toggle")) {
            const toggle = e.target;
            const content = toggle.nextElementSibling;
            const isExpanded = content.classList.toggle("expanded");
            toggle.textContent = isExpanded ? "Engineering Log ▴" : "Engineering Log ▾";
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
