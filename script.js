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
