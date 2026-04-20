---
title: Material-Design-之TabLayout与Toolbar
description: Material-Design-之TabLayout与Toolbar
author: 博客作者
pubDatetime: 2016-07-28T00:00:00.000Z
draft: false
featured: false
tags: ["Android"]
category: Android
---
今天在学习Material Design的过程中，遇到了一个比较坑的问题，在这里记录一下，以后如果有人遇到的话，可以做个参考吧。首先来看看我们的需求，今天我们需要实现下面这个效果：

![需求.gif](http://upload-images.jianshu.io/upload_images/2524102-d8903fa389d460a8.gif?imageMogr2/auto-orient/strip)

<!--more-->

> 图片来自blog：http://blog.csdn.net/eclipsexys/article/details/46349721

大家可以看到这个需求其实是非常简单的，就是有个Toolbar和一个TabLayout，然后在TabLayout中有个列表，根据列表的上下滑动，Toolbar也相应的隐藏和显示。我们都知道这个是Material Design中的动画效果，那么我们就直接开始动手编码来实现这个效果。首先贴出布局部分的代码吧：

```xml
<?xml version="1.0" encoding="utf-8"?>
<android.support.design.widget.CoordinatorLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/activity_base"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:fitsSystemWindows="true">

    <android.support.design.widget.AppBarLayout
        android:id="@+id/appbar"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        app:theme="@style/AppTheme.AppBarOverlay">

        <android.support.v7.widget.Toolbar
            android:id="@+id/toolbar"
            android:layout_width="match_parent"
            android:layout_height="?attr/actionBarSize"
            app:layout_scrollFlags="scroll|enterAlways"
            app:popupTheme="@style/AppTheme.PopupOverlay"/>

        <android.support.design.widget.TabLayout
            android:id="@+id/tabs"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"/>


    </android.support.design.widget.AppBarLayout>

    <android.support.v4.view.ViewPager
        android:id="@+id/viewpager"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        app:layout_behavior="@string/appbar_scrolling_view_behavior"/>

</android.support.design.widget.CoordinatorLayout>

```
上面就是我们主布局的代码，然后我们看看ViewPager对应的布局的代码：
```xml
<android.support.v4.widget.NestedScrollView
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    app:layout_behavior="@string/appbar_scrolling_view_behavior">

    <RelativeLayout
        android:layout_width="match_parent"
        android:layout_height="match_parent">

        <TextView
            android:id="@+id/section_label"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"/>

        <ListView
            android:id="@+id/listview"
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            android:layout_below="@id/section_label"/>

    </RelativeLayout>
</android.support.v4.widget.NestedScrollView>

```
这个里面的代码也很简单，就是一个ListView，主要的作用就是上下滑动，然后触发Toolbar的动画。
剩下的就是一些简单的Fragment和一些控件初始化之类的，就不贴代码了，然后我们直接运行。运行之后截图如下：

![运行结果.gif](http://upload-images.jianshu.io/upload_images/2524102-82aeab75e5c07db8.gif?imageMogr2/auto-orient/strip)

运行结果如上图，请大家忽视这个画质的问题，视频转GIF真是心累。

> 如果大家有什么好的视频转GIF的工具，可以给我推荐一下。

有细心的朋友可能已经发现问题了，当我们将列表往上滑动时，Toolbar确实隐藏了起来，但是在最后，屏幕的左上角还留有一些没有隐藏起来。这是第一个问题，还有一个比较细节的问题是我们通过对比我们的`需求图片`和`运行结果`图片，可以发现：
需求图片中向上滑动时，状态栏是保持不动的，Toolbar和TabLayout向上滑动，给人一种状态栏是在Toolbar和Tablayout上方的感觉。
运行结果向上滑动时，状态栏也会向上滑，给人的感觉就像是被Toolbar和TabLayout挤上去的样子。

基于以上的两个不同之处，我们大致可以推断出Toolbar没有完全隐藏可能是因为状态栏的原因，那么我们就开始着手解决这个问题。
- 从布局开始
首先我们进行了将主布局的`android:fitsSystemWindows="true"`放到不同的地方，看看是否是这行代码出了问题，我分别将这行代码放到了CoordinatorLayout、AppBarLayout、Toolbar、TabLayout等多个地方，最后发现并没有解决问题。但是在这个过程中，却有一个小的变化是比较奇怪的，那就是当我`android:fitsSystemWindows="true"`这行代码移出CoordinatorLayout中时，我们运行程序之后会出现如下结果：
![将上述代码移动到AppBarLayout中的结果](http://upload-images.jianshu.io/upload_images/2524102-cdda1190eb30c4a7.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

从上图中我们可以看到，上面的状态栏变白了。这个发现就更加印证了我们之前的推测：这件事情肯定和状态栏有关系。既然已经知道这个，那么我们就可以从第二个方面来解决。

- 从代码入手
我们尝试着在**进行了第一步尝试的基础上**在代码中将状态栏的颜色修改一下`getWindow().setStatusBarColor(getResources().getColor(R.color.colorPrimaryDark));`修改完之后，发现是可以得到和需求一样的结果。问题得到了完美的解决......吗？我们都知道上面这修改状态栏颜色的代码是在api>=21才可以用的，那如果api<21怎么办？可能有人会说用开源库来修改啊。这个确实是一种非常好的解决办法，但是我并不想“撞大运”式的将这个问题解决。所以我们还得继续的深入查找问题，那么这个时候就想到了，和状态栏有关的属性，除了布局文件中和代码中，还有一个地方，就是`style.xml`中。

- 从`style.xml`入手
先贴出代码：
```xml
<resources>
    <style name="AppTheme.NoActionBar">
        <item name="windowActionBar">false</item>
        <item name="windowNoTitle">true</item>
        <item name="android:windowDrawsSystemBarBackgrounds">true</item>
        <item name="android:statusBarColor">@android:color/transparent</item>
    </style>
</resources>
```
上面这个是`style.xml`(v21)的代码，从这段代码中我们就可以找到这次这个bug的罪魁祸首了。就是这一行`<item name="android:statusBarColor">@android:color/transparent</item>`
就是这行代码将我们的状态栏给弄成了透明了，结果就导致我们看到的状态栏和布局文件是在同一个z轴上，也就是会被挤上去，从而导致我们的Toolbar不能完全的隐藏起来。

最后，为什么这个小bug费了这么大劲才找出来，我上面这一整套代码，基本上都是在android studio 中新建一个TabActivity 自动生成的。也就说原本自动生成的代码就有这个Bug，谁能想到android studio 这个浓眉大眼的家伙也"叛变革命"了呢。