// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // Select all sections on the page
    const sections = document.querySelectorAll("section");

    // Function to handle visibility based on scroll position
    const revealSections = () => {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;

            // If the section is visible in the viewport, add the 'visible' class
            if (rect.top <= windowHeight - 100 && rect.bottom >= 100) {
                section.classList.add("visible");
            }
        });
    };

    // Add an event listener for scroll and run the reveal function initially
    window.addEventListener("scroll", revealSections);
    revealSections();
});


//hide that shit 
document.addEventListener("DOMContentLoaded", () => {
    const toggles = document.querySelectorAll(".toggle");
    toggles.forEach(toggle => {
        toggle.addEventListener("click", () => {
            const content = toggle.nextElementSibling;
            content.classList.toggle("hidden");
        });
    });
});


// Project filters
document.querySelectorAll('.filters button').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filters button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        document.querySelectorAll('.project').forEach(project => {
            const categories = project.getAttribute('data-category') || "";
            if (categories.includes(filter)) {
                project.style.display = "block";
            } else {
                project.style.display = "none";
            }
        });
    });
});

// Trigger default filter to show 'All' projects on load
document.querySelector('[data-filter="robotics"]').click(); // MODIFIED LINE






document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("overlay");

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    let allowAccess = false;
    const masterCode = "hr"; // Master code

    if (code) {
        if (code === masterCode) {
            // Always allow access if master code is entered
            allowAccess = true;
        } else if (!isNaN(code)) {
            // Check numeric time-based code
            const codeTime = parseInt(code, 10);
            const now = Date.now();
            const oneHour = 60 * 60 * 1000; // ms in an hour

            if (now - codeTime <= oneHour) {
                allowAccess = true;
            }
        }
    }

    if (allowAccess) {
        overlay.classList.add("hidden");
    } else {
        overlay.classList.remove("hidden");
    }
});