---
title: DrawerLayout：Write-Once，Run-EveryWhere
description: DrawerLayout：Write-Once，Run-EveryWhere
author: 博客作者
pubDatetime: 2016-07-28T00:00:00.000Z
draft: false
featured: false
tags: ["Android"]
category: Android
---
自从Material Design出来之后，各种各样的控件也是让人眼花缭乱，但是用的时候还是需要克制，比如Google在官方的Material Design Guideline中就建议内容相同的列表不要使用Cardview，而是推荐使用普通的布局，中间加上divider即可，避免给人一种分裂感。

在使用DrawerLayout的时候，可能我们多个Activity中都需要用到，我们是不是每个Activity都需要新建为Navigation Drawer Activity呢，答案是：NO。所以这次我们就来看看，如何“克制地”使用DrawerLayout

> Write Once，Run Everywhere

<!--more-->

## 新建Navigation Drawer Activity

首先我们新建一个Navigation Drawer Activity作为我们BaseActivity，布局文件如下：
```xml
<?xml version="1.0" encoding="utf-8"?>
<android.support.v4.widget.DrawerLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/drawer_layout"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:fitsSystemWindows="true"
    tools:openDrawer="start">

    <!--<include
        layout="@layout/app_bar_base_drawer"
        android:layout_width="match_parent"
        android:layout_height="match_parent"/>
-->
    <FrameLayout
        android:id="@+id/frame_container"
        android:layout_width="match_parent"
        android:layout_height="match_parent"/>

    <android.support.design.widget.NavigationView
        android:id="@+id/nav_view"
        android:layout_width="wrap_content"
        android:layout_height="match_parent"
        android:layout_gravity="start"
        android:fitsSystemWindows="true"
        app:headerLayout="@layout/nav_header_base_drawer"
        app:menu="@menu/activity_base_drawer_drawer"/>

</android.support.v4.widget.DrawerLayout>

```
我们首先将Android studio自己生成的`<include></include>`注释掉，换成代码中的FrameLayout，接下来修改自动生成的BaseActivity代码：

重写setContentView函数,重写后的函数如下：

 ``` kotlin
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }
    override fun setContentView(layoutResID: Int) {
        //首先获取带有DrawerLayout的布局
        val drawer = layoutInflater.inflate(R.layout.activity_base_drawer, null) as DrawerLayout
        //然后获取这个布局里面的FrameLayout，也就是我们刚才在xml中添加的FrameLayout
        val frameContainer = drawer.findViewById(R.id.frame_container) as FrameLayout
        //然后将子类的布局添加到FrameLayout中
        layoutInflater.inflate(layoutResID, frameContainer, true)
        //最后设置布局为DrawerLayout的布局
        setContentView(drawer)
        //下面就是一些设置DrawerLayout动作和点击事件的代码
        val toggle = ActionBarDrawerToggle(
                this, drawer, R.string.navigation_drawer_open, R.string.navigation_drawer_close)
        drawer.setDrawerListener(toggle)
        toggle.syncState()

        val navigationView = findViewById(R.id.nav_view) as NavigationView
        navigationView.setNavigationItemSelectedListener(this)

        toolbar.setNavigationOnClickListener { view -> drawer.openDrawer(Gravity.START) }
    }
 ```
上面的代码使用Kotlin写的，顺便提一句：
> 在今天凌晨的Google I/O 2017上，Android Team已经将Kotlin做为Android开发的"first-class"了。

上面设置完之后，我们可以随便新建一个Activity，然后继承BaseActivity即可。
```kotlin
class DrawerActivity : BaseDrawerActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.app_bar_base_drawer)
        fab.setOnClickListener { view -> Snackbar.make(view, "可以", Snackbar.LENGTH_SHORT).show() }
    }
}
```
来看看结果：
![drawer-layout.gif](http://upload-images.jianshu.io/upload_images/2524102-d6e24c1d16735925.gif?imageMogr2/auto-orient/strip)
可以看到我们的功能已经实现了，但是有一些小瑕疵：

> Toolbar上面没有菜单键，需要通过从屏幕左边滑才能呼出Drawer

这个问题从我们上面的代码中也体现出来了，在BaseActivity中并没有将Drawer的操作与Toolbar联系到一起，接下来我们就来添加代码，让Toolbar和Drawer联系到一起，添加到上面重写的setContentView中相应的位置
```kotlin
  //获取Toolbar
  val toolbar = frameContainer.findViewById(R.id.toolbar) as Toolbar
        setSupportActionBar(toolbar)
  // 将Toolbar与Drawer的动作联系起来
  val toggle = ActionBarDrawerToggle(
                this, drawer,toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close)
  //最后设置toolbar的点击事件
  toolbar.setNavigationOnClickListener { view -> drawer.openDrawer(Gravity.START) }
```
经过上面的设置之后，再来看看运行效果：
![drawer-layout-new.gif](http://upload-images.jianshu.io/upload_images/2524102-d49733181469cf69.gif?imageMogr2/auto-orient/strip)

> 如果点击菜单键没有反应的话，请删除掉继承自BaseActivity的activity中的setSupportActionBar这行代码即可