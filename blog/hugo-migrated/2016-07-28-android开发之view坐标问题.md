---
title: Android开发之View坐标问题
description: Android开发之View坐标问题
author: 博客作者
pubDatetime: 2016-07-28T00:00:00.000Z
draft: false
featured: false
tags: ["Android"]
category: Android
---
在我们日常的开发过程中，接触最多的就是View了，各种各样的View，但是我们可能对View的知识了解一些，但是还是感觉有些地方不太够，尤其是View的坐标问题。我们今天就来看看这个View的坐标到底是怎么定义的。

<!--more-->

别的不说，先上代码：

```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    app:layout_behavior="@string/appbar_scrolling_view_behavior"
    tools:context="stephen.com.bugstest.MainActivity"
    tools:showIn="@layout/activity_main">

    <TextView
        android:id="@+id/tv_test"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_centerInParent="true"
        android:background="@color/colorPrimary"
        android:padding="10dp"
        android:text="测试文本"
        android:textColor="#FFFFFF"/>
</RelativeLayout>
```
上面这个是一个简单布局文件，这个布局文件对应的`坐标信息`：

![TextView的坐标信息](http://upload-images.jianshu.io/upload_images/2524102-c83b13d3a71e882f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

> 图画的很粗糙，意思表达到了就行。
win10 下有什么好的画这种图的软件也可以推荐下。

上面图中，外层红色框表示的RelativeLayout，里面的蓝色实心矩形表示的是TextView。图中的标明的坐标信息解释如下：
> getTop()表示Textview上边缘距离父布局上边的距离