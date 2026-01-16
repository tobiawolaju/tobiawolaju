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
        // remove active class from all buttons
        document.querySelectorAll('.filters button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        document.querySelectorAll('.project').forEach(project => {
            const categories = project.getAttribute('data-category') || "";

            if (filter === "" || categories.includes(filter)) {
                project.style.display = "block";
            } else {
                project.style.display = "none";
            }
        });
    });
});

// Trigger default filter to show ALL projects on load
document.querySelector('.filters button[data-filter=""]').click();










// --- JavaScript ---
document.addEventListener("scroll", () => {
    const footer = document.getElementById("site-footer");
    const rect = footer.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Check if footer is in view
    if (rect.top < windowHeight && rect.bottom > 0) {
        footer.classList.add("visible");
    } else {
        footer.classList.remove("visible");
    }
});
