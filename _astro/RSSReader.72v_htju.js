import { r as requireReact, a as reactExports } from './index.BzcyvVHr.js';

var jsxRuntime = {exports: {}};

var reactJsxRuntime_production_min = {};

/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactJsxRuntime_production_min;

function requireReactJsxRuntime_production_min () {
	if (hasRequiredReactJsxRuntime_production_min) return reactJsxRuntime_production_min;
	hasRequiredReactJsxRuntime_production_min = 1;
var f=requireReact(),k=Symbol.for("react.element"),l=Symbol.for("react.fragment"),m=Object.prototype.hasOwnProperty,n=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p={key:true,ref:true,__self:true,__source:true};
	function q(c,a,g){var b,d={},e=null,h=null;void 0!==g&&(e=""+g);void 0!==a.key&&(e=""+a.key);void 0!==a.ref&&(h=a.ref);for(b in a)m.call(a,b)&&!p.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps,a) void 0===d[b]&&(d[b]=a[b]);return {$$typeof:k,type:c,key:e,ref:h,props:d,_owner:n.current}}reactJsxRuntime_production_min.Fragment=l;reactJsxRuntime_production_min.jsx=q;reactJsxRuntime_production_min.jsxs=q;
	return reactJsxRuntime_production_min;
}

var hasRequiredJsxRuntime;

function requireJsxRuntime () {
	if (hasRequiredJsxRuntime) return jsxRuntime.exports;
	hasRequiredJsxRuntime = 1;
	{
	  jsxRuntime.exports = requireReactJsxRuntime_production_min();
	}
	return jsxRuntime.exports;
}

var jsxRuntimeExports = requireJsxRuntime();

const CORS_PROXY = "https://rss-cors-proxy.houzixiashanxiedaima.workers.dev/?url=";
const parseRSSFeed = async (url) => {
  const response = await fetch(url);
  const text = await response.text();
  const parser = new DOMParser();
  const xml = parser.parseFromString(text, "text/xml");
  const parserError = xml.querySelector("parsererror");
  if (parserError) {
    throw new Error("XML 解析失败");
  }
  const articles = [];
  const isAtom = xml.querySelector("feed") !== null;
  if (isAtom) {
    const entries = xml.querySelectorAll("entry");
    entries.forEach((entry) => {
      const title = entry.querySelector("title")?.textContent || "无标题";
      const link = entry.querySelector("link")?.getAttribute("href") || "";
      const published = entry.querySelector("published")?.textContent || entry.querySelector("updated")?.textContent || "";
      const summary = entry.querySelector("summary")?.textContent || "";
      const content = entry.querySelector("content")?.textContent || entry.querySelector("summary")?.textContent || "无内容";
      articles.push({
        title,
        link,
        pubDate: published,
        contentSnippet: summary.substring(0, 200),
        content
      });
    });
  } else {
    const items = xml.querySelectorAll("item");
    items.forEach((item) => {
      const title = item.querySelector("title")?.textContent || "无标题";
      const link = item.querySelector("link")?.textContent || "";
      const pubDate = item.querySelector("pubDate")?.textContent || "";
      const description = item.querySelector("description")?.textContent || "";
      const contentEncoded = item.querySelector("encoded")?.textContent || item.querySelector("content\\:encoded")?.textContent || "";
      const content = contentEncoded || description || "无内容";
      const mediaContent = item.querySelector("media\\:content, content");
      const mediaThumbnail = item.querySelector("media\\:thumbnail, thumbnail");
      const enclosure = item.querySelector("enclosure");
      let thumbnail;
      if (mediaThumbnail) {
        thumbnail = mediaThumbnail.getAttribute("url") || void 0;
      } else if (mediaContent) {
        thumbnail = mediaContent.getAttribute("url") || void 0;
      } else if (enclosure && enclosure.getAttribute("type")?.startsWith("image/")) {
        thumbnail = enclosure.getAttribute("url") || void 0;
      }
      articles.push({
        title,
        link,
        pubDate,
        contentSnippet: description.substring(0, 200),
        content,
        thumbnail
      });
    });
  }
  return articles;
};
function RSSReader() {
  const [categories, setCategories] = reactExports.useState([]);
  const [selectedFeed, setSelectedFeed] = reactExports.useState(null);
  const [articles, setArticles] = reactExports.useState([]);
  const [selectedArticle, setSelectedArticle] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const inferFeedType = (url, category) => {
    if (category === "Articles" || category === "SocialMedia") return "article";
    if (category === "Videos") return "video";
    if (category === "Audios") return "audio";
    if (category === "Pictures") return "image";
    if (category === "Notifications") return "notification";
    if (url.includes("bilibili/user/video")) return "video";
    if (url.includes("xiaoyuzhou/podcast")) return "audio";
    if (url.includes("telegram/channel") && category === "Pictures")
      return "image";
    if (url.includes("github.com") && url.includes("releases.atom"))
      return "notification";
    return "article";
  };
  const parseOPMLWithCategories = (xml) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, "text/xml");
    const categoriesMap = /* @__PURE__ */ new Map();
    const topLevelOutlines = doc.querySelectorAll("body > outline");
    topLevelOutlines.forEach((categoryOutline) => {
      const categoryName = categoryOutline.getAttribute("text") || "未分类";
      const processOutline = (outline, parentCategory) => {
        const xmlUrl = outline.getAttribute("xmlUrl");
        if (xmlUrl) {
          if (!categoriesMap.has(parentCategory)) {
            categoriesMap.set(parentCategory, []);
          }
          const feeds = categoriesMap.get(parentCategory);
          feeds.push({
            id: `${Date.now()}_${feeds.length}`,
            title: outline.getAttribute("title") || outline.getAttribute("text") || "未命名",
            url: xmlUrl,
            category: parentCategory,
            type: inferFeedType(xmlUrl, parentCategory)
          });
        } else {
          const subCategory = outline.getAttribute("text") || "未命名";
          const subOutlines = outline.querySelectorAll(":scope > outline");
          subOutlines.forEach(
            (sub) => processOutline(sub, `${parentCategory} / ${subCategory}`)
          );
        }
      };
      const outlines = categoryOutline.querySelectorAll(":scope > outline");
      outlines.forEach((outline) => processOutline(outline, categoryName));
    });
    const categories2 = [];
    categoriesMap.forEach((feeds, name) => {
      categories2.push({
        name,
        feeds,
        collapsed: false
      });
    });
    return categories2;
  };
  reactExports.useEffect(() => {
    const loadOPML = async () => {
      try {
        const response = await fetch("/follow.opml");
        const xml = await response.text();
        const parsedCategories = parseOPMLWithCategories(xml);
        setCategories(parsedCategories);
        const totalFeeds = parsedCategories.reduce(
          (sum, cat) => sum + cat.feeds.length,
          0
        );
        console.log(
          `✅ 自动加载 ${totalFeeds} 个订阅源，分为 ${parsedCategories.length} 个分类`
        );
      } catch (error) {
        console.error("❌ 自动加载 OPML 失败:", error);
      }
    };
    loadOPML();
  }, []);
  const handleOPMLImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const xml = event.target?.result;
      const parsedCategories = parseOPMLWithCategories(xml);
      setCategories(parsedCategories);
      const totalFeeds = parsedCategories.reduce(
        (sum, cat) => sum + cat.feeds.length,
        0
      );
      alert(
        `成功导入 ${totalFeeds} 个订阅源，分为 ${parsedCategories.length} 个分类！`
      );
    };
    reader.readAsText(file);
  };
  const toggleCategory = (categoryName) => {
    setCategories(
      (prev) => prev.map(
        (cat) => cat.name === categoryName ? { ...cat, collapsed: !cat.collapsed } : cat
      )
    );
  };
  const fetchFeed = async (feed) => {
    setLoading(true);
    setSelectedFeed(feed);
    setArticles([]);
    setSelectedArticle(null);
    try {
      const proxyUrl = CORS_PROXY + encodeURIComponent(feed.url);
      const newArticles = await parseRSSFeed(proxyUrl);
      setArticles(newArticles);
      if (newArticles.length > 0) {
        setSelectedArticle(newArticles[0]);
      }
    } catch (error) {
      console.error("获取 RSS 失败:", error);
      alert("获取 RSS 失败: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  const getCategoryIcon = (categoryName) => {
    const icons = {
      Articles: "📰",
      Videos: "🎬",
      Audios: "🎧",
      Pictures: "🖼️",
      SocialMedia: "💬",
      Notifications: "🔔"
    };
    return icons[categoryName] || "📁";
  };
  const getTypeIcon = (type) => {
    const icons = {
      article: "📄",
      video: "▶️",
      audio: "🎵",
      image: "🖼️",
      notification: "🔔"
    };
    return icons[type || "article"];
  };
  const filteredCategories = categories.map((cat) => ({
    ...cat,
    feeds: cat.feeds.filter(
      (feed) => feed.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter((cat) => cat.feeds.length > 0);
  const formatRelativeTime = (dateStr) => {
    if (!dateStr) return "未知时间";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "未知时间";
    const diffMs = Date.now() - date.getTime();
    const diffSec = Math.floor(diffMs / 1e3);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);
    if (diffSec < 60) return "刚刚";
    if (diffMin < 60) return `${diffMin} 分钟前`;
    if (diffHr < 24) return `${diffHr} 小时前`;
    if (diffDay < 30) return `${diffDay} 天前`;
    return date.toLocaleDateString("zh-CN");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-screen bg-gray-50 dark:bg-gray-900", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-gray-200 dark:border-gray-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold mb-3 text-gray-900 dark:text-gray-100", children: "RSS 阅读器" }),
        categories.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block px-4 py-2 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-center rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors mb-3", children: [
          "🔄 重新导入 OPML",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "file",
              accept: ".opml,.xml",
              onChange: handleOPMLImport,
              className: "hidden"
            }
          )
        ] }),
        categories.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            placeholder: "🔍 搜索订阅源...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            className: "w-full mt-3 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: filteredCategories.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-center text-gray-500 dark:text-gray-400", children: categories.length === 0 ? "正在加载订阅源..." : "无匹配的订阅源" }) : filteredCategories.map((category) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "border-b border-gray-200 dark:border-gray-700",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => toggleCategory(category.name),
                className: "w-full px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-750 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: getCategoryIcon(category.name) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-gray-900 dark:text-gray-100", children: category.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: [
                      "(",
                      category.feeds.length,
                      ")"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "svg",
                    {
                      className: `w-4 h-4 text-gray-500 transition-transform ${category.collapsed ? "" : "rotate-90"}`,
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "path",
                        {
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                          strokeWidth: 2,
                          d: "M9 5l7 7-7 7"
                        }
                      )
                    }
                  )
                ]
              }
            ),
            !category.collapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white dark:bg-gray-800", children: category.feeds.map((feed) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => fetchFeed(feed),
                className: `w-full text-left px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors border-l-4 ${selectedFeed?.id === feed.id ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500" : "border-transparent"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm flex-shrink-0", children: getTypeIcon(feed.type) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-sm text-gray-900 dark:text-gray-100", children: feed.title })
                ]
              },
              feed.id
            )) })
          ]
        },
        category.name
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto flex flex-col", children: selectedFeed ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-gray-200 dark:border-gray-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: getTypeIcon(selectedFeed.type) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-gray-900 dark:text-gray-100", children: selectedFeed.title })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: [
          articles.length,
          " 篇文章"
        ] })
      ] }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-gray-500 dark:text-gray-400", children: "加载中..." })
      ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-3 space-y-3", children: articles.map((article, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setSelectedArticle(article),
          className: "w-full text-left",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `flex gap-3 items-center rounded-xl border transition-colors bg-gray-50 border-gray-200 dark:bg-gray-800/80 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-400 ${selectedArticle?.link === article.link ? "ring-2 ring-blue-400/50" : ""}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 px-4 py-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-gray-900 dark:text-gray-100", children: selectedFeed?.title }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1 w-1 rounded-full bg-amber-500 inline-block" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatRelativeTime(article.pubDate) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold mb-1 line-clamp-2 text-gray-900 dark:text-gray-100", children: article.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-relaxed text-gray-600 dark:text-gray-300 line-clamp-2", children: article.contentSnippet })
                ] }),
                article.thumbnail && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-24 h-24 mr-3 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: article.thumbnail,
                    alt: "",
                    loading: "lazy",
                    className: "w-full h-full object-cover"
                  }
                ) })
              ]
            }
          )
        },
        index
      )) })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl mb-2 block", children: "📰" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "选择一个订阅源开始阅读" })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 bg-white dark:bg-gray-800 overflow-y-auto", children: selectedArticle ? /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "w-full h-full px-12 py-8 max-w-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100", children: selectedArticle.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: selectedArticle.pubDate ? new Date(selectedArticle.pubDate).toLocaleString("zh-CN") : "未知时间" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: selectedArticle.link,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 hover:underline",
            children: "查看原文 →"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "prose prose-lg dark:prose-invert max-w-none\n                prose-headings:text-gray-900 dark:prose-headings:text-gray-100\n                prose-p:text-gray-700 dark:prose-p:text-gray-300\n                prose-a:text-blue-500 dark:prose-a:text-blue-400\n                prose-strong:text-gray-900 dark:prose-strong:text-gray-100\n                prose-code:text-gray-900 dark:prose-code:text-gray-100\n                prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900\n                prose-img:rounded-lg",
          dangerouslySetInnerHTML: { __html: selectedArticle.content }
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-full text-gray-500 dark:text-gray-400", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl mb-2 block", children: "📖" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "选择一篇文章开始阅读" })
    ] }) }) })
  ] });
}

export { RSSReader as default };
//# sourceMappingURL=RSSReader.72v_htju.js.map
