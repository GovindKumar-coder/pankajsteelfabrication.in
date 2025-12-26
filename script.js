document.addEventListener("DOMContentLoaded", function () {

  /* --------------------------------
     HERO SLIDER WITH DOTS + AUTO SLIDE
  ----------------------------------- */
  const slides = document.querySelectorAll(".hero-slide");
  const dotsContainer = document.querySelector(".slider-dots");
  let index = 0;
  let slideInterval = null;

  if (slides.length && dotsContainer) {
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.classList.add("dot");
      dot.type = "button";
      dot.setAttribute("aria-label", "Go to slide " + (i + 1));
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
        dot.classList.toggle("active", idx === i);
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
     IMAGE ZOOM
  ----------------------------------- */
  const zoomableImages = document.querySelectorAll(".product-gallery img, .full-gallery img");

  zoomableImages.forEach(img => {
    img.addEventListener("click", () => {
      const overlay = document.createElement("div");
      overlay.className = "zoom-overlay";

      const zoomImg = document.createElement("img");
      zoomImg.className = "zoomed-image";

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

      overlay.appendChild(zoomImg);
      document.body.appendChild(overlay);

      overlay.addEventListener("click", () => overlay.remove());
    });
  });

  /* --------------------------------
     LOAD MORE BUTTON
  ----------------------------------- */
  const items = document.querySelectorAll(".product-gallery .img-card");
  const loadMoreBtn = document.getElementById("loadMoreBtn");

  if (items.length && loadMoreBtn) {
    let itemsToShow = 20;

    items.forEach((item, index) => {
      if (index >= itemsToShow) {
        item.style.display = "none";
      }
    });

    loadMoreBtn.addEventListener("click", function () {
      let revealed = 0;

      items.forEach((item, index) => {
        if (item.style.display === "none" && revealed < 20) {
          item.style.display = "flex";
          revealed++;
        }
      });

      const stillHidden = [...items].filter(i => i.style.display === "none");
      if (stillHidden.length === 0) {
        loadMoreBtn.style.display = "none";
      }
    });
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
      threshold: 0.01,                // trigger as soon as 1% visible
      rootMargin: "0px 0px 300px 0px" // preload before scrolling into view
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
     MOBILE FALLBACK (force visible if small/medium screens)
  ----------------------------------- */
  if (window.innerWidth < 800) {
    document.querySelectorAll(".img-card").forEach(card => card.classList.add("visible"));
    document.querySelectorAll(".img-card img").forEach(img => img.classList.add("loaded"));
  }

});
