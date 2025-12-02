let searchInitialized = false;
const PAGEFIND_LOADED_KEY = "pagefind-loaded";
async function loadPagefind(retryCount = 0) {
  const maxRetries = 2;
  if (sessionStorage.getItem(PAGEFIND_LOADED_KEY) === "true") {
    initializePagefind();
    return true;
  }
  const pagefindContainer = document.getElementById("pagefind-ui");
  if (!pagefindContainer) return false;
  pagefindContainer.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--muted-foreground);">加载中...</div>';
  try {
    const isDev = false;
    if (isDev) ;
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "/pagefind/pagefind-ui.js";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
    initializePagefind();
    sessionStorage.setItem(PAGEFIND_LOADED_KEY, "true");
    return true;
  } catch (error) {
    console.error("Failed to load search:", error);
    if (retryCount < maxRetries) {
      console.log(`Retrying search load... (${retryCount + 1}/${maxRetries})`);
      await new Promise((resolve) => setTimeout(resolve, 1e3));
      return loadPagefind(retryCount + 1);
    }
    if (pagefindContainer) {
      pagefindContainer.innerHTML = `
          <div style="padding: 2rem; text-align: center;">
            <p style="color: var(--muted-foreground); margin-bottom: 1rem;">搜索功能加载失败</p>
            <button id="retry-search" style="padding: 0.5rem 1rem; background: var(--accent); color: var(--accent-foreground); border: none; border-radius: 0.375rem; cursor: pointer;">
              重试
            </button>
          </div>
        `;
      const retryBtn = document.getElementById("retry-search");
      retryBtn?.addEventListener("click", () => {
        sessionStorage.removeItem(PAGEFIND_LOADED_KEY);
        loadPagefind(0);
      });
    }
    return false;
  }
}
function initializePagefind() {
  if (typeof PagefindUI !== "undefined") {
    new PagefindUI({
      element: "#pagefind-ui",
      showSubResults: true,
      showImages: false,
      excerptLength: 15,
      translations: {
        placeholder: "搜索文章...",
        clear_search: "清除",
        load_more: "加载更多",
        search_label: "搜索此站点",
        filters_label: "筛选",
        zero_results: "未找到结果 [SEARCH_TERM]",
        many_results: "找到 [COUNT] 个结果 [SEARCH_TERM]",
        one_result: "找到 [COUNT] 个结果 [SEARCH_TERM]",
        alt_search: "未找到 [SEARCH_TERM] 的结果。显示 [DIFFERENT_TERM] 的结果",
        search_suggestion: "未找到 [SEARCH_TERM] 的结果。尝试以下搜索：",
        searching: "搜索中 [SEARCH_TERM]..."
      }
    });
    setTimeout(() => {
      const input = document.querySelector(".pagefind-ui__search-input");
      if (input instanceof HTMLElement) {
        input.focus();
      }
    }, 100);
  }
}
function initSearch() {
  if (searchInitialized) return;
  searchInitialized = true;
  const searchButton = document.getElementById("search-button");
  const searchDialog = document.getElementById("search-dialog");
  const closeButton = document.getElementById("close-search");
  if (!searchButton || !searchDialog || !closeButton) return;
  let pagefindLoaded = sessionStorage.getItem(PAGEFIND_LOADED_KEY) === "true";
  const handleSearchOpen = async () => {
    searchDialog.showModal();
    document.body.style.overflow = "hidden";
    if (!pagefindLoaded) {
      const success = await loadPagefind();
      if (success) {
        pagefindLoaded = true;
      }
    } else {
      setTimeout(() => {
        const input = document.querySelector(".pagefind-ui__search-input");
        if (input instanceof HTMLElement) {
          input.focus();
        }
      }, 100);
    }
  };
  const handleSearchClose = () => {
    searchDialog.close();
    document.body.style.overflow = "";
  };
  const handleBackdropClick = (e) => {
    if (e.target === searchDialog) {
      handleSearchClose();
    }
  };
  const handleEscapeKey = (e) => {
    if (e.key === "Escape" && searchDialog.open) {
      handleSearchClose();
    }
  };
  const handleKeyboardShortcut = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      if (searchDialog.open) {
        handleSearchClose();
      } else {
        handleSearchOpen();
      }
    }
  };
  searchButton.addEventListener("click", handleSearchOpen);
  closeButton.addEventListener("click", handleSearchClose);
  searchDialog.addEventListener("click", handleBackdropClick);
  document.addEventListener("keydown", handleEscapeKey);
  document.addEventListener("keydown", handleKeyboardShortcut);
  document.addEventListener("astro:before-swap", () => {
    searchButton.removeEventListener("click", handleSearchOpen);
    closeButton.removeEventListener("click", handleSearchClose);
    searchDialog.removeEventListener("click", handleBackdropClick);
    document.removeEventListener("keydown", handleEscapeKey);
    document.removeEventListener("keydown", handleKeyboardShortcut);
    searchInitialized = false;
  }, { once: true });
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSearch);
} else {
  initSearch();
}
document.addEventListener("astro:page-load", initSearch);
//# sourceMappingURL=Search.astro_astro_type_script_index_0_lang.CcxlZfcw.js.map
