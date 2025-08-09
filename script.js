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








// ====== PERMISSION TOGGLE ======
let allowAccess = false; // change to true to allow viewing

document.addEventListener("DOMContentLoaded", () => {
    if (!allowAccess) {
        const overlay = document.createElement("div");
        overlay.innerHTML = `<div class="overlay-message">
    <div class="message-wrapper">
        <svg viewBox="0 0 24 24" aria-label="Protected portfolio" role="img" 
             xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor">
            <path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 
                     2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 
                     2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm-3 
                     5a3 3 0 1 1 6 0v3H9V7zm9 5v8H6v-8h12z"/>
        </svg>
         <p>Only approved visitors can view this portfolio.</p>
    </div>
   
    <a class="requestaccess" href="https://x.com/tobiawolaju/" 
       target="_blank" class="request-btn">
       Request Permission
    </a>
</div>


        `;
        overlay.classList.add("overlay");
        document.body.appendChild(overlay);
    }
});

