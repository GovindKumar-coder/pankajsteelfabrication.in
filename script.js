document.addEventListener("DOMContentLoaded", function () {

  /* --------------------------------
     HERO SLIDER WITH DOTS + AUTO SLIDE
  ----------------------------------- */
  const slides = document.querySelectorAll(".hero-slide");
  const dotsContainer = document.querySelector(".slider-dots");
  let index = 0;
  let slideInterval = null;

  if (slides.length && dotsContainer) {
    dotsContainer.innerHTML = "";
    dotsContainer.setAttribute("role", "tablist");

    slides.forEach((slide, i) => {
      slide.id = "slide-" + (i + 1);

      const dot = document.createElement("button");
      dot.classList.add("dot");
      dot.type = "button";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", "Go to slide " + (i + 1));
      dot.setAttribute("aria-controls", slide.id);
      dot.setAttribute("aria-current", i === 0 ? "true" : "false");

      if (i === 0) dot.classList.add("active");

      dot.addEventListener("click", () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll(".dot");

    function showSlide(i) {
      slides.forEach((slide, idx) => {
        slide.classList.toggle("active", idx === i);
      });
      dots.forEach((dot, idx) => {
        const isActive = idx === i;
        dot.classList.toggle("active", isActive);
        dot.setAttribute("aria-current", isActive ? "true" : "false");
      });
    }

    function goToSlide(i) {
      index = i;
      showSlide(index);
      restartAutoSlide();
    }

    function nextSlide() {
      index = (index + 1) % slides.length;
      showSlide(index);
    }

    function startAutoSlide() {
      slideInterval = setInterval(nextSlide, 4000);
    }

    function restartAutoSlide() {
      if (slideInterval) clearInterval(slideInterval);
      startAutoSlide();
    }

    dots.forEach(dot => {
      dot.addEventListener("mouseenter", () => clearInterval(slideInterval));
      dot.addEventListener("mouseleave", startAutoSlide);
      dot.addEventListener("focus", () => clearInterval(slideInterval));
      dot.addEventListener("blur", startAutoSlide);
    });

    showSlide(index);
    startAutoSlide();
  }

  /* --------------------------------
     FOOTER YEAR
  ----------------------------------- */
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  /* --------------------------------
   IMAGE GALLERY LIGHTBOX
----------------------------------- */
const galleryImages = document.querySelectorAll(".product-gallery img, .full-gallery img");
let currentIndex = -1;
let overlay, zoomImg;

function openGallery(index) {
  currentIndex = index;

  // Create overlay if not exists
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "zoom-overlay";

    zoomImg = document.createElement("img");
    zoomImg.className = "zoomed-image";
    overlay.appendChild(zoomImg);

    document.body.appendChild(overlay);

    // Close on click background
    overlay.addEventListener("click", e => {
      if (e.target === overlay) closeGallery();
    });

    // Keyboard navigation
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") closeGallery();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    });

    // Touch swipe navigation
    let startX = 0;
    overlay.addEventListener("touchstart", e => {
      startX = e.touches[0].clientX;
    });
    overlay.addEventListener("touchend", e => {
      let endX = e.changedTouches[0].clientX;
      if (startX - endX > 50) showNext();   // swipe left
      if (endX - startX > 50) showPrev();   // swipe right
    });
  }

  updateImage();
  overlay.style.display = "flex";
}

function updateImage() {
  const img = galleryImages[currentIndex];
  let src;
  if (img.dataset.zoomDesktop || img.dataset.zoomTablet || img.dataset.zoomMobile) {
    if (window.innerWidth >= 1024 && img.dataset.zoomDesktop) {
      src = img.dataset.zoomDesktop;
    } else if (window.innerWidth >= 600 && img.dataset.zoomTablet) {
      src = img.dataset.zoomTablet;
    } else if (img.dataset.zoomMobile) {
      src = img.dataset.zoomMobile;
    } else {
      src = img.src;
    }
  } else {
    src = img.src;
  }
  zoomImg.src = src;
  zoomImg.alt = img.alt || "";
}

function closeGallery() {
  overlay.style.display = "none";
}

function showNext() {
  currentIndex = (currentIndex + 1) % galleryImages.length;
  updateImage();
}

function showPrev() {
  currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
  updateImage();
}

// Attach click events
galleryImages.forEach((img, i) => {
  img.addEventListener("click", () => openGallery(i));
});


  /* --------------------------------
   INFINITE SCROLL (Batch Reveal with IntersectionObserver)
----------------------------------- */
const items = document.querySelectorAll(".product-gallery .img-card");
const totalItems = items.length;
let itemsToShow = 20;   // show first 20
const batchSize = 20;   // reveal 20 more each time

if (totalItems) {
  if (totalItems <= itemsToShow) {
    // If fewer than or equal to 20, show all immediately
    items.forEach(item => {
      item.style.display = "flex";
    });
  } else {
    // Hide all beyond first 20
    items.forEach((item, index) => {
      if (index >= itemsToShow) {
        item.style.display = "none";
      }
    });

    const revealBatch = () => {
      let revealed = 0;
      items.forEach((item, index) => {
        if (item.style.display === "none" && revealed < batchSize) {
          item.style.display = "flex";
          revealed++;
        }
      });

      // Update observer to watch the new last visible item
      const visibleItems = [...items].filter(i => i.style.display !== "none");
      const lastVisible = visibleItems[visibleItems.length - 1];
      if (lastVisible) {
        observer.observe(lastVisible);
      }
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target); // stop watching old last item
          revealBatch();
        }
      });
    }, {
      rootMargin: "200px"
    });

    // Start observing the last of the initial batch
    observer.observe(items[itemsToShow - 1]);
  }
}

  /* --------------------------------
     FADE-IN ON SCROLL (cards)
  ----------------------------------- */
  const cardObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          cardObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.01,
      rootMargin: "0px 0px 300px 0px"
    }
  );

  document.querySelectorAll(".img-card").forEach(card => {
    cardObserver.observe(card);
  });

  /* --------------------------------
     FADE-IN WHEN IMAGE LOADS
  ----------------------------------- */
  const imgObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.complete) {
            img.classList.add("loaded");
          } else {
            img.addEventListener("load", () => img.classList.add("loaded"));
          }
          imgObserver.unobserve(img);
        }
      });
    },
    {
      threshold: 0.01,
      rootMargin: "0px 0px 300px 0px"
    }
  );

  document.querySelectorAll(".img-card img").forEach(img => {
    imgObserver.observe(img);
  });

  /* --------------------------------
     MOBILE FALLBACK
  ----------------------------------- */
  if (window.innerWidth < 800) {
    document.querySelectorAll(".img-card").forEach(card => card.classList.add("visible"));
    document.querySelectorAll(".img-card img").forEach(img => img.classList.add("loaded"));
  }

});
