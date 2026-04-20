---
title: NavigationView-子菜单问题
description: NavigationView-子菜单问题
author: 博客作者
pubDatetime: 2016-07-28T00:00:00.000Z
draft: false
featured: false
tags: ["Android"]
category: Android
---
在Android 5.0之后，Google推出了Material Design兼容库，在Material Design的兼容库中，有个用的比较多的控件就是`NavigationView`。在我们平时使用过程中，对于`NavigationView`的一些小细节可能也并没有过多的关注，所以就导致我们在遇到特殊需求的时候无从下手，那么在这里我就简单记录一下使用`NavigationView`的一些小坑，暂时可能也并没有遇到很多的坑，如果以后遇到的话会不定时更新。

<!--more-->

## NavigationView基本使用
有很多人对于`NavigationView`的基本使用还是比较了解的， 那么我这里推荐一种非常偷懒的方法，就是我们在`Android Studio`中新建`Activity`时可以直接进行如下操作：


![New Navigation Activity.png](http://upload-images.jianshu.io/upload_images/2524102-ed42f064db473404.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

在选择了`Navigation Drawer Activity`之后会出现如下界面：


![Navigation Drawer Activity.png](http://upload-images.jianshu.io/upload_images/2524102-ba08509342d568c7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

然后点击`Finish`就可以完成一个最基础的带有`NavigationView`的`Activity`创建，创建之后就可以在原有的基础上进行修改了，这样也是非常的方便。

## NavigationView Menu的设置
### Menu的第一种布局设置
最基本的`Menu`的设置就是每行一个项目。在`menu`中的代码是这样的：
```xml
<?xml version="1.0" encoding="utf-8"?>
<menu xmlns:android="http://schemas.android.com/apk/res/android">
    <item
        android:id="@+id/nav_camera"
        android:icon="@drawable/ic_menu_camera"
        android:title="Import"/>
    <item
        android:id="@+id/nav_gallery"
        android:icon="@drawable/ic_menu_gallery"
        android:title="Gallery"/>
    <item
        android:id="@+id/nav_slideshow"
        android:icon="@drawable/ic_menu_slideshow"
        android:title="Slideshow"/>
    <item
        android:id="@+id/nav_manage"
        android:icon="@drawable/ic_menu_manage"
        android:title="Tools"/>

    <item
        android:id="@+id/nav_share"
        android:icon="@drawable/ic_menu_share"
        android:title="Share"/>
    <item
        android:id="@+id/nav_send"
        android:icon="@drawable/ic_menu_send"
        android:title="Send"/>
</menu>
```
实际效果是这样的：


![normal menu.png](http://upload-images.jianshu.io/upload_images/2524102-d4299d3d8b622021.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

通过上面的图片我们可以看到，这样设置之后，每个`item`都是独立的，各占一行，每一行代表着一个操作。
### Menu的第二种布局设置
子菜单的设置是这样的：
```xml
<?xml version="1.0" encoding="utf-8"?>
<menu xmlns:android="http://schemas.android.com/apk/res/android">

    <group android:checkableBehavior="single">
        <item
            android:id="@+id/nav_camera"
            android:icon="@drawable/ic_menu_camera"
            android:title="Import"/>
        <item
            android:id="@+id/nav_gallery"
            android:icon="@drawable/ic_menu_gallery"
            android:title="Gallery"/>
        <item
            android:id="@+id/nav_slideshow"
            android:icon="@drawable/ic_menu_slideshow"
            android:title="Slideshow"/>
        <item
            android:id="@+id/nav_manage"
            android:icon="@drawable/ic_menu_manage"
            android:title="Tools"/>
    </group>
    <item android:title="Communicate">
        <menu>
            <item
                android:id="@+id/nav_share"
                android:icon="@drawable/ic_menu_share"
                android:title="Share"/>
            <item
                android:id="@+id/nav_send"
                android:icon="@drawable/ic_menu_send"
                android:title="Send"/>
        </menu>
    </item>
    <item
        android:title="about">
        <menu>
            <item
                android:id="@+id/nav_about"
                android:icon="@drawable/ic_history"
                android:title="about"/>

        </menu>
    </item>
</menu>
```
设置之后的效果是这样的：


![group menu.png](http://upload-images.jianshu.io/upload_images/2524102-14bcb6aaaca2a190.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

通过这种设置分组之后，我们可以发现，每个组是一起的，是通过`group`将同一个组的`item`包裹起来，组内的`item`可能会相互影响，这取决于你设置属性`android:checkableBehavior`的值。而且在上面的图片中我们也可以发现一个小的细节，就是我们组和组之间有一条小横线隔开了，有点类似于我们在`ListView`中设置的`divider`属性。

### Menu的第三种布局设置

那么在我们实际的开发过程中，有时候我们需要把第一种和第二种结合起来，也就是说呈现出下图中的效果：


![group menu special.png](http://upload-images.jianshu.io/upload_images/2524102-e5c2c8f0c2f049d3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

细心的朋友可能已经看出来第三种和第二种的区别。
第二种的布局结果是每个`group`下有一个`title`，然后在`title`下面才是我们的子`item`
第三种是直接每个`group`下就是子`item`并没有第二种中出现的`title`
很显然在某些情况下，我们的开发需求需要像第三种这样简约但是不简单的`Navigation Menu`还是先来看看我们第三种布局的`menu`文件：
```xml
<?xml version="1.0" encoding="utf-8"?>
<menu xmlns:android="http://schemas.android.com/apk/res/android">

    <group
        android:id="@+id/nav_group_normal"
        android:checkableBehavior="single">
        <item
            android:id="@+id/nav_camera"
            android:icon="@drawable/ic_menu_camera"
            android:title="Import"/>
        <item
            android:id="@+id/nav_gallery"
            android:icon="@drawable/ic_menu_gallery"
            android:title="Gallery"/>
        <item
            android:id="@+id/nav_slideshow"
            android:icon="@drawable/ic_menu_slideshow"
            android:title="Slideshow"/>
        <item
            android:id="@+id/nav_manage"
            android:icon="@drawable/ic_menu_manage"
            android:title="Tools"/>
    </group>
    <group
        android:id="@+id/nav_commnunicate"
        android:title="Communicate">
        <item
            android:id="@+id/nav_share"
            android:icon="@drawable/ic_menu_share"
            android:title="Share"/>
        <item
            android:id="@+id/nav_send"
            android:icon="@drawable/ic_menu_send"
            android:title="Send"/>
    </group>
    <group
        android:id="@+id/nav_about_group">
        <item
            android:title="about">
            <item
                android:id="@+id/nav_about"
                android:icon="@drawable/ic_history"
                android:title="about"/>
        </item>
    </group>

</menu>
```
这个布局文件就是用`group`包裹起每个组的`item`，有点类似第二种布局，但是**最关键**的地方就是要为每一个`group`设置一个`id`，设置完成之后就可以得到第三种布局的效果。