---
title: 欢迎来到雅俗共赏
description: 了解这个博客当前的内容方向、设计取向与阅读体验。
author: 博客作者
pubDatetime: 2024-01-15T00:00:00.000Z
draft: false
featured: true
tags: ["Astro", "博客", "设计"]
category: 公告
---
欢迎来到 **雅俗共赏**。这里记录技术、阅读与开源更新，也保留一点个人兴趣和长期积累的笔记。

## 设计理念

这个主题的设计遵循以下原则：

- **内容优先**：简洁的单栏布局，让读者专注于文字
- **性能至上**：静态生成，零 JavaScript 打包
- **类型安全**：使用 Content Collections 管理内容
- **用户友好**：支持全文搜索、RSS 订阅与主题配色切换

## 主要特性

### 1. Content Collections

使用 Astro 的 Content Collections API，提供类型安全的内容管理：

```typescript
const blogPosts = await getCollection('blog', ({ data }) => {
  return data.draft !== true;
});
```

### 2. 全文搜索

集成 Pagefind 实现离线全文搜索，支持中文分词。

### 3. 响应式设计

从移动端到桌面端，都提供最佳的阅读体验。

### 4. 深色模式

自动适配系统主题，并支持手动切换。

## 开始使用

查看更多文章，看看这个站点最近在关注什么。