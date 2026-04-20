---
title: AlertDialog中使用WebView显示内容
description: AlertDialog中使用WebView显示内容
author: 博客作者
pubDatetime: 2016-07-28T00:00:00.000Z
draft: false
featured: false
tags: ["Android"]
category: Android
---
在最近的开发中，需要用到在AlertDialog中通过WebView显示内容，但是在实际操作过程中，发现有一个小小的问题需要注意一下，在此也记录一下。
首先放出代码：

```java
 AlertDialog.Builder builder = new Builder(this)
            .setView(R.layout.new_dialog_user_guide);
        View view = getLayoutInflater().inflate(R.layout.new_dialog_user_guide, null);
        WebView webView = (WebView) view.findViewById(R.id.web_user_guide);
        webView.loadUrl("http://www.baidu.com");
        builder.show();
```
上面这段代码，看似是没问题的，但是在实际显示过程中，WebView一直都是空白页面，啥也没有。开始排查问题：

<!--more-->

#### 网络问题
一开始以为是网络问题，于是将`http://www.baidu.com`换成本地的assets中的文件，更换后关键代码如下：
```java
  webView.loadUrl("file:///android_asset/test.html");
```
更换为本地文件之后，WebView中显示的依然是空白页面，啥也没有。继续排查
#### 文件问题
是否是这个HTML的文件有问题，如果直接加载HTML字符串，问题能否结局，继续修改关键代码如下：
```java
webView.loadData("<html>这是一段HTML的代码</html>","text/html", "utf-8");
//或者也可以这样
webView.loadDataWithBaseURL(null, "<html>这是一段html代码</html>", "text/html", "utf-8", null);
```
更改成直接加载HTML字符串之后，WebView还是现实空白页面，啥也没有。最后想来想去，是不是因为我们将WebView放在了AlertDialog中，所以导致我们的WebView显示有问题。于是我们将WebView单独移出来，结果发现可以显示出正确的内容。那也就是说这个问题出在AlertDialog身上了，难道WebView不能放在AlertDialog中吗。显然不是的，于是参考了官方教程之后，终于发现了问题所在。
#### 震惊！导致WebView显示空白的罪魁祸首竟然是……
先直接贴出可以运行的正确代码：
```java
AlertDialog.Builder builder = new Builder(this);
        View view = getLayoutInflater().inflate(R.layout.new_dialog_user_guide, null);
        WebView webView = (WebView) view.findViewById(R.id.web_user_guide);
        webView.setWebViewClient(new WebViewClient());
        webView.loadUrl("http://www.baidu.com");
        builder.setView(view);
        builder.setPositiveButton(R.string.confirm, null);
        builder.show();
```
问题就出在这个`setView`身上，我们的"错误代码"是先setView，然后再使用webview进行load，但是正确的顺序应该是先使用webview进行load，然后再setView。
问题到此排查结束。