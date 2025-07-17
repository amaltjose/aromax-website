document.addEventListener("DOMContentLoaded", function() {
  const spices = [
    {
      name: "Aromax Cardamom",
      desc: "Handpicked from the lush hills of Idukki, our cardamom pods burst with rich aroma and flavor. Perfect for enhancing sweet and savory dishes, teas, and traditional recipes.",
      main: "images/cardamom-main.png",
      icon: "images/cardamom-icon.png",
      leaf: "images/leaf.png",
      bg: "#e8e4df"
    },
    {
      name: "Aromax Whole Black Pepper",
      desc: "Sourced from the misty hills of Idukki, these bold, whole peppercorns bring unmatched freshness and taste to your kitchen. Grind or use whole for authentic flavor.",
      main: "images/pepper-main.png",
      icon: "images/pepper-icon.png",
      leaf: "images/leaf.png",
      bg: "#e8e4df"
    },
    {
      name: "Aromax Black Pepper Powder",
      desc: "Freshly ground from premium whole peppercorns, this pepper powder adds an intense kick to your cooking. Ideal for seasoning, marination, and everyday use.",
      main: "images/pepperpowder-main.png",
      icon: "images/pepperpowder-icon.png",
      leaf: "images/leaf.png",
      bg: "#e8e4df"
    }
  ];

  let current = 0;
  let isScrolling = false;
  let lockSliderAtEnd = false;

  // --- AUTO SLIDE SETTINGS ---
  let autoSlideEnabled = true; // Set to false to turn off auto slide
  const autoSlideInterval = 7000; // 7 seconds
  let autoSlideTimer = null;

  function createSpicePicker() {
    const picker = document.getElementById('spice-picker');
    picker.innerHTML = '';
    spices.forEach((spice, i) => {
      const img = document.createElement('img');
      img.src = spice.icon;
      img.alt = spice.name;
      img.className = 'spice-btn-img' + (i === current ? ' active' : '');
      img.title = spice.name;
      img.addEventListener('click', () => {
        if (current !== i) {
          showSpice(i, i > current ? 'next' : 'prev');
          current = i;
        }
      });
      picker.appendChild(img);
    });
  }

  function animateOut(dir) {
    const mainImg = document.getElementById("spice-main-img");
    mainImg.classList.remove("spice-img-in");
    mainImg.classList.add("spice-img-out");
    const content = document.getElementById("spice-content");
    content.classList.remove("spice-content-in");
    content.classList.add("spice-content-out");
  }

  function animateIn() {
    setTimeout(() => {
      const mainImg = document.getElementById("spice-main-img");
      mainImg.classList.remove("spice-img-out");
      mainImg.classList.add("spice-img-in");
      const content = document.getElementById("spice-content");
      content.classList.remove("spice-content-out");
      content.classList.add("spice-content-in");
    }, 800);
  }

  function showSpice(idx, direction = 'next') {
    animateOut(direction);
    setTimeout(() => {
      document.getElementById("spice-main-img").src = spices[idx].main;
      document.getElementById("split-left").style.background = spices[idx].bg;
      document.getElementById("slide-index").innerHTML = `<span>0${idx + 1}</span> / <span>0${spices.length}</span>`;
      document.getElementById("spice-title").textContent = spices[idx].name;
      document.getElementById("spice-desc").textContent = spices[idx].desc;
      if (window.innerWidth > 900) createSpicePicker();
      animateIn();
      lockSliderAtEnd = (idx === spices.length - 1);
      resetAutoSlide();
    }, 800);
  }

  function goToNextSlide() {
    if (current < spices.length - 1) {
      current++;
      showSpice(current, 'next');
    }
  }
  function goToPrevSlideInfinite() {
    // Infinite scroll up: If at first slide, go to last, else previous
    if (current > 0) {
      current--;
    } else {
      current = spices.length - 1;
    }
    showSpice(current, 'prev');
  }

  document.querySelector(".arrow.up").addEventListener("click", goToPrevSlideInfinite);
  document.querySelector(".arrow.down").addEventListener("click", () => {
    if (current < spices.length - 1) {
      goToNextSlide();
    }
  });

  function handleScroll(e) {
    if (isScrolling) return;
    let direction = e.deltaY > 0 ? 'down' : 'up';
    if (direction === 'down' && lockSliderAtEnd) return; // allow normal scroll to next section
    if (direction === 'down' && current < spices.length - 1) {
      goToNextSlide();
      isScrolling = true;
      setTimeout(() => { isScrolling = false; }, 1000);
      e.preventDefault();
    } else if (direction === 'up') {
      goToPrevSlideInfinite();
      isScrolling = true;
      setTimeout(() => { isScrolling = false; }, 1000);
      e.preventDefault();
    }
  }
  window.addEventListener("wheel", handleScroll, { passive: false });

  // TOUCH SWIPE
  let touchStartY = null;
  document.addEventListener('touchstart', function(e) {
    touchStartY = e.touches[0].clientY;
  });
  document.addEventListener('touchend', function(e) {
    if (touchStartY === null) return;
    let touchEndY = e.changedTouches[0].clientY;
    if (Math.abs(touchEndY - touchStartY) > 50) {
      if (touchEndY < touchStartY && lockSliderAtEnd) return;
      if (touchEndY < touchStartY && current < spices.length - 1) {
        goToNextSlide();
      } else if (touchEndY > touchStartY) {
        goToPrevSlideInfinite();
      }
    }
    touchStartY = null;
  });

  // --- AUTO SLIDE LOGIC ---
  function startAutoSlide() {
    if (!autoSlideEnabled) return;
    stopAutoSlide();
    autoSlideTimer = setInterval(() => {
      if (current < spices.length - 1) {
        goToNextSlide();
      }
    }, autoSlideInterval);
  }
  function stopAutoSlide() {
    if (autoSlideTimer) clearInterval(autoSlideTimer);
  }
  function resetAutoSlide() {
    stopAutoSlide();
    if (!lockSliderAtEnd && autoSlideEnabled) startAutoSlide();
  }

  // --- INITIALIZE ---
  createSpicePicker();
  document.getElementById("spice-main-img").classList.add("spice-img-in");
  document.getElementById("spice-content").classList.add("spice-content-in");
  showSpice(current, 'next');
  startAutoSlide();

  window.addEventListener("scroll", () => {
    let offset = window.scrollY;
    document.getElementById("split-left").style.transform =
      `translateY(${offset * 0.05}px)`;
    document.querySelector(".split-right").style.opacity =
      `${1 - Math.min(offset * 0.002, 0.15)}`;
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) createSpicePicker();
  });
});