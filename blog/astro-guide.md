---
title: Astro 快速入门指南
description: 学习如何使用 Astro 构建快速、现代的网站。
author: 博客作者
pubDatetime: 2024-01-10T00:00:00.000Z
draft: false
featured: false
tags: ["Astro", "Web开发", "教程"]
category: 教程
---
Astro 是一个现代化的静态站点生成器，它专注于性能和开发体验。

## 为什么选择 Astro？

### 1. 零 JavaScript（默认）

Astro 默认不发送任何 JavaScript 到浏览器，这使得网站加载速度极快。

### 2. 岛屿架构

当你需要交互时，可以使用"岛屿"来按需加载 JavaScript：

```astro
---
import Counter from './Counter.jsx';
---

<Counter client:load />
```

### 3. 框架无关

可以混合使用 React、Vue、Svelte 等框架。

## Content Collections

这是 Astro 最强大的特性之一：

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.date(),
  }),
});

export const collections = { blog };
```

## 部署

Astro 可以部署到任何支持静态站点的平台：

- Cloudflare Pages
- Vercel
- Netlify
- GitHub Pages

开始你的 Astro 之旅吧！