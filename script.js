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
  }, 1450);
});

const revealItems = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, { threshold: 0.15 });

revealItems.forEach((item) => observer.observe(item));

/* counters */
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

    const update = () => {
      current += increment;

      if (current >= target) {
        counter.textContent = isDecimal ? target.toFixed(1) : Math.floor(target);
      } else {
        counter.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
        requestAnimationFrame(update);
      }
    };

    update();
  });
}

const statsSection = document.querySelector(".stats-strip");
if (statsSection) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) animateCounters();
    });
  }, { threshold: 0.35 });

  statsObserver.observe(statsSection);
}

/* smarter live status */
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const weeklyHours = {
  0: { open: "09:00", close: "18:00" },
  1: { open: "09:30", close: "21:30" },
  2: { open: "09:00", close: "18:00" },
  3: { open: "09:00", close: "18:00" },
  4: { open: "09:00", close: "18:00" },
  5: { open: "09:00", close: "18:00" },
  6: { open: "09:00", close: "18:00" }
};

function toMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function formatTime(time) {
  let [h, m] = time.split(":").map(Number);
  const ap = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m.toString().padStart(2, "0")} ${ap}`;
}

function updateStatus() {
  const statusEl = document.getElementById("liveStatus");
  const heroEl = document.getElementById("heroStatus");
  if (!statusEl || !heroEl) return;

  const now = new Date();
  const day = now.getDay();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const today = weeklyHours[day];
  const openMin = toMinutes(today.open);
  const closeMin = toMinutes(today.close);

  if (nowMin >= openMin && nowMin < closeMin) {
    statusEl.innerHTML = `<span class="status-dot open"></span> Open now · ${dayNames[day]} closes ${formatTime(today.close)}`;
    heroEl.innerHTML = `<i class="fa-solid fa-clock"></i> Open now · Closes ${formatTime(today.close)}`;
  } else {
    let nextDay = day;
    let nextOpen = today.open;

    if (nowMin >= closeMin) {
      nextDay = (day + 1) % 7;
      nextOpen = weeklyHours[nextDay].open;
    }

    statusEl.innerHTML = `<span class="status-dot closed"></span> Closed now · ${dayNames[nextDay]} opens ${formatTime(nextOpen)}`;
    heroEl.innerHTML = `<i class="fa-solid fa-clock"></i> Closed · Opens ${dayNames[nextDay]} ${formatTime(nextOpen)}`;
  }
}

updateStatus();
setInterval(updateStatus, 60000);

/* highlight today's row */
function highlightToday() {
  const today = new Date().getDay();
  const rows = document.querySelectorAll(".hours-row");

  rows.forEach(row => {
    row.classList.remove("today");
    if (parseInt(row.getAttribute("data-day")) === today) {
      row.classList.add("today");
    }
  });
}

highlightToday();
