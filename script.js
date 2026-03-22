const menuToggle = document.getElementById("menuToggle");
const mobileNav = document.getElementById("mobileNav");
const loader = document.getElementById("loader");

menuToggle.addEventListener("click", () => {
  mobileNav.classList.toggle("active");
  menuToggle.classList.toggle("active");
});

document.querySelectorAll(".mobile-nav a").forEach(link => {
  link.addEventListener("click", () => {
    mobileNav.classList.remove("active");
    menuToggle.classList.remove("active");
  });
});

window.addEventListener("load", () => {
  setTimeout(() => {
    loader.classList.add("hide");
  }, 1400);
});

const revealItems = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, {
  threshold: 0.15
});

revealItems.forEach((item) => observer.observe(item));

const counters = document.querySelectorAll(".counter");
let counterStarted = false;

function animateCounters() {
  if (counterStarted) return;
  counterStarted = true;

  counters.forEach(counter => {
    const target = parseFloat(counter.getAttribute("data-target"));
    const isDecimal = target % 1 !== 0;
    let current = 0;
    const increment = target / 60;

    const updateCounter = () => {
      current += increment;

      if (current >= target) {
        counter.textContent = isDecimal ? target.toFixed(1) : Math.floor(target);
      } else {
        counter.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
        requestAnimationFrame(updateCounter);
      }
    };

    updateCounter();
  });
}

const statsSection = document.querySelector(".stats-strip");

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
    }
  });
}, { threshold: 0.35 });

if (statsSection) {
  statsObserver.observe(statsSection);
}
