(() => {
  "use strict";
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");

  document.getElementById("y").textContent = new Date().getFullYear();

  /* Tema: ikut sistem, bisa dioverride, tersimpan. */
  const btn = document.getElementById("theme");
  const syncTheme = () => {
    const dark = root.dataset.theme === "dark";
    const label = dark ? "Aktifkan tema terang" : "Aktifkan tema gelap";
    btn.setAttribute("aria-label", label);
    btn.setAttribute("title", label);
  };
  btn.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    try { localStorage.setItem("zwart-theme", root.dataset.theme); } catch (e) {}
    syncTheme();
  });
  syncTheme();

  /* Progress + header + parallax halus. */
  const hdr = document.getElementById("hdr");
  const bar = document.querySelector(".progress");
  const layers = Array.from(document.querySelectorAll("[data-parallax]"));
  let queued = false;

  const paint = () => {
    const y = scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    if (hdr) hdr.classList.toggle("stuck", y > 6);

    if (!reduce.matches) {
      for (const el of layers) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > innerHeight + 200) continue;
        const speed = parseFloat(el.dataset.parallax) || 0;
        const center = r.top + r.height / 2 - innerHeight / 2;
        el.style.translate = `0 ${(-center * speed).toFixed(1)}px`;
      }
    }
    queued = false;
  };
  const onScroll = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(paint);
  };
  paint();
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll, { passive: true });

  /* Reveal bertahap untuk elemen di bawah lipatan. */
  if (reduce.matches || !("IntersectionObserver" in window)) return;
  const items = Array.from(document.querySelectorAll("[data-rv]"))
    .filter((el) => el.getBoundingClientRect().top > innerHeight * 0.92);
  if (!items.length) return;

  const io = new IntersectionObserver((entries, obs) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("on");
      obs.unobserve(entry.target);
    }
  }, { threshold: 0.08, rootMargin: "0px 0px -4% 0px" });

  items.forEach((el, i) => {
    el.classList.add("rv");
    el.style.transitionDelay = `${(i % 6) * 55}ms`;
    io.observe(el);
  });
})();
