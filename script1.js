
document.addEventListener("DOMContentLoaded", function () {
    console.log("Website loaded successfully!");

    
    // Learn More button (if used elsewhere)
    window.learnMore = function () {
        alert("Explore our services and products!");
    };

    // Search functionality
    const searchIcon = document.querySelector(".fa-search");
    const searchBox = document.querySelector("#search-box");

    if (searchIcon && searchBox) {
        searchIcon.addEventListener("click", function () {
            const query = searchBox.value.trim();
            if (query) {
                alert("Searching for: " + query);
            } else {
                alert("Please enter a search term.");
            }
        });
    }

    // Hero slider
    const slides = document.querySelectorAll(".hero-slide");
    const button = document.getElementById("shopBtn");
    let index = 0;

    function showSlide(i) {
        slides.forEach((slide, idx) => {
            slide.classList.remove("active");
            if (idx === i) slide.classList.add("active");
        });
        if (button) button.style.display = i === 0 ? "block" : "none";
    }

    showSlide(index);

    setInterval(() => {
        index = (index + 1) % slides.length;
        showSlide(index);
    }, 4000);
});