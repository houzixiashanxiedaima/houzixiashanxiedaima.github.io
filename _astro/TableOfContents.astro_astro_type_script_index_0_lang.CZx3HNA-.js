let tocInitialized = false;
function initTOC() {
  const tocContainer = document.querySelector(".toc");
  if (!tocContainer || tocInitialized) return;
  tocInitialized = true;
  const tocItems = Array.from(document.querySelectorAll(".toc-item"));
  const headingElements = document.querySelectorAll(".article-content h2, .article-content h3, .article-content h4");
  if (headingElements.length === 0) return;
  let headingsInfo = [];
  function updateHeadingPositions() {
    headingsInfo = Array.from(headingElements).map((el, index) => {
      const rect = el.getBoundingClientRect();
      const scrollTop = window.scrollY;
      const top = rect.top + scrollTop;
      const nextHeading = headingElements[index + 1];
      let bottom;
      if (nextHeading) {
        const nextRect = nextHeading.getBoundingClientRect();
        bottom = nextRect.top + scrollTop;
      } else {
        const article = document.querySelector(".article-content");
        if (article) {
          const articleRect = article.getBoundingClientRect();
          bottom = articleRect.bottom + scrollTop;
        } else {
          bottom = document.documentElement.scrollHeight;
        }
      }
      return {
        id: el.id,
        element: el,
        top,
        bottom
      };
    });
  }
  const readSlugs = /* @__PURE__ */ new Set();
  function updateProgress() {
    const scrollTop = window.scrollY;
    const viewportHeight = window.innerHeight;
    const headerOffset = 80;
    const documentHeight = document.documentElement.scrollHeight;
    const currentScrollPos = scrollTop + headerOffset;
    const isAtBottom = scrollTop + viewportHeight >= documentHeight - 50;
    tocItems.forEach((item, index) => {
      const slug = item.getAttribute("data-slug");
      if (!slug) return;
      const headingInfo = headingsInfo.find((h) => h.id === slug);
      if (!headingInfo) return;
      const link = item.querySelector(".toc-link");
      const progressBar = item.querySelector(".toc-progress-bar");
      if (!link || !progressBar) return;
      const sectionTop = headingInfo.top;
      const sectionBottom = headingInfo.bottom;
      const isLastSection = index === tocItems.length - 1;
      if (currentScrollPos >= sectionTop) {
        readSlugs.add(slug);
      }
      const isRead = readSlugs.has(slug) && (currentScrollPos >= sectionBottom || isLastSection && isAtBottom);
      const isReading = currentScrollPos >= sectionTop && currentScrollPos < sectionBottom && !(isLastSection && isAtBottom);
      !readSlugs.has(slug) && currentScrollPos < sectionTop;
      item.classList.remove("is-read", "is-reading", "is-unread");
      if (isRead) {
        item.classList.add("is-read");
        item.style.setProperty("--progress", "100%");
      } else if (isReading) {
        item.classList.add("is-reading");
        const sectionHeight = sectionBottom - sectionTop;
        const scrolledInSection = currentScrollPos - sectionTop;
        let progress;
        if (isLastSection) {
          const maxScroll = documentHeight - viewportHeight;
          const remainingScroll = maxScroll - scrollTop;
          progress = Math.min(Math.max(scrolledInSection / Math.min(sectionHeight, scrolledInSection + remainingScroll), 0), 1);
        } else {
          progress = Math.min(Math.max(scrolledInSection / sectionHeight, 0), 1);
        }
        item.style.setProperty("--progress", `${progress * 100}%`);
      } else {
        item.classList.add("is-unread");
        item.style.setProperty("--progress", "0%");
      }
    });
  }
  updateHeadingPositions();
  updateProgress();
  let ticking = false;
  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateProgress();
        ticking = false;
      });
      ticking = true;
    }
  };
  let resizeTimeout;
  const handleResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updateHeadingPositions();
      updateProgress();
    }, 100);
  };
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleResize, { passive: true });
  const handleTocClick = (e) => {
    const target = e.target;
    const link = target.closest(".toc-link");
    if (!link) return;
    e.preventDefault();
    const targetId = link.getAttribute("data-slug");
    const targetElement = targetId ? document.getElementById(targetId) : null;
    if (targetElement) {
      const headerOffset = 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };
  tocContainer.addEventListener("click", handleTocClick);
  document.addEventListener("astro:before-swap", () => {
    window.removeEventListener("scroll", handleScroll);
    window.removeEventListener("resize", handleResize);
    tocContainer.removeEventListener("click", handleTocClick);
    clearTimeout(resizeTimeout);
    tocInitialized = false;
  }, { once: true });
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTOC);
} else {
  initTOC();
}
document.addEventListener("astro:page-load", initTOC);
//# sourceMappingURL=TableOfContents.astro_astro_type_script_index_0_lang.CZx3HNA-.js.map
