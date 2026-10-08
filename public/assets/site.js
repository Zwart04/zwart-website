/* Zwart Studio — motion system v3 */
(() => {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Content remains visible if JS cannot load.
  if (!reduced.matches && "IntersectionObserver" in window) {
    const elements = $$(".section-top, .section-title, .showcase-card, .founder-panel, .contact h2, .contact p, .contact .actions");
    const observer = new IntersectionObserver((entries, ob) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("in-view");
        ob.unobserve(entry.target);
      }
    }, { threshold: 0.06, rootMargin: "0px 0px -5% 0px" });
    elements.forEach((el, index) => {
      el.classList.add("reveal-ready");
      el.style.setProperty("--reveal-delay", String((index % 2) * 85) + "ms");
      observer.observe(el);
    });
    document.documentElement.classList.add("motion-ready");
  }

  const progress = $(".scroll-progress");
  const cards = $$(".showcase-card");
  const panels = cards.map(card => ({ card: card, panel: $(".showcase-window", card) })).filter(item => item.panel);
  const root = document.documentElement;
  let scrollFrame = 0;
  function updateOnScroll() {
    scrollFrame = 0;
    const max = Math.max(1, root.scrollHeight - window.innerHeight);
    root.style.setProperty("--zw-scroll", Math.min(1, Math.max(0, window.scrollY / max)).toFixed(4));
    if (reduced.matches) return;
    const mid = window.innerHeight * 0.5;
    for (const item of panels) {
      const rect = item.card.getBoundingClientRect();
      if (rect.bottom < -100 || rect.top > window.innerHeight + 100) continue;
      const shift = Math.max(-15, Math.min(15, (mid - (rect.top + rect.height * 0.5)) * 0.035));
      item.panel.style.setProperty("--float-y", shift.toFixed(1) + "px");
    }
  }
  function scheduleScroll() {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(updateOnScroll);
  }
  window.addEventListener("scroll", scheduleScroll, { passive: true });
  window.addEventListener("resize", scheduleScroll, { passive: true });
  if (progress) scheduleScroll();

  // Mouse/trackpad depth, disabled for touch and reduced motion.
  if (finePointer.matches && !reduced.matches) {
    panels.forEach(item => {
      let pointerFrame = 0;
      let x = 0, y = 0;
      item.card.addEventListener("pointermove", event => {
        x = event.clientX; y = event.clientY;
        if (pointerFrame) return;
        pointerFrame = window.requestAnimationFrame(() => {
          pointerFrame = 0;
          const bounds = item.card.getBoundingClientRect();
          const dx = Math.max(-1, Math.min(1, (x - bounds.left) / bounds.width * 2 - 1));
          const dy = Math.max(-1, Math.min(1, (y - bounds.top) / bounds.height * 2 - 1));
          item.panel.style.setProperty("--ty", (dx * 6).toFixed(2) + "deg");
          item.panel.style.setProperty("--tx", (-dy * 4).toFixed(2) + "deg");
        });
      }, { passive: true });
      item.card.addEventListener("pointerleave", () => {
        item.panel.style.setProperty("--tx", "0deg");
        item.panel.style.setProperty("--ty", "0deg");
      });
    });
  }

  if (typeof reduced.addEventListener === "function") {
    reduced.addEventListener("change", () => {
      if (reduced.matches) {
        $$(".reveal-ready").forEach(el => el.classList.add("in-view"));
        panels.forEach(item => {
          item.panel.style.setProperty("--float-y", "0px");
          item.panel.style.setProperty("--tx", "0deg");
          item.panel.style.setProperty("--ty", "0deg");
        });
      }
    });
  }
})();