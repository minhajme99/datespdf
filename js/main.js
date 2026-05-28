document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const toolSearch = document.getElementById("toolSearch");

  // Mobile menu
  const overlay = document.createElement("div");
  overlay.classList.add("nav-overlay");
  document.body.appendChild(overlay);

  function closeMenu() {
    if (navToggle) navToggle.classList.remove("active");
    if (navMenu) navMenu.classList.remove("open");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("active");
      navMenu.classList.toggle("open");
      overlay.classList.toggle("active");
      document.body.style.overflow = navMenu.classList.contains("open") ? "hidden" : "";
    });
  }

  overlay.addEventListener("click", closeMenu);

  // Tool search
  if (toolSearch) {
    toolSearch.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();
      const cards = document.querySelectorAll(".tool-card");

      cards.forEach((card) => {
        const title = card.querySelector(".tool-card__title").textContent.toLowerCase();
        const desc = card.querySelector(".tool-card__desc").textContent.toLowerCase();
        const match = !query || title.includes(query) || desc.includes(query);
        card.style.display = match ? "" : "none";
      });
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href === "#") return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        closeMenu();
      }
    });
  });
});
