---
title: Android开发使用lambda表达式
description: Android开发使用lambda表达式
author: 博客作者
pubDatetime: 2016-07-28T00:00:00.000Z
draft: false
featured: false
tags: ["Android"]
category: Android
---
在Java9即将发布之际，我们来讲讲如何使用Java8的新特性-->lambda表达式。lambda表达式可以让我们的代码非常简洁，提高代码的可读性，那么如何在Android开发中来使用lambda表达式呢。

<!--more-->

1. 在项目根目录的build.gradle中添加classpath

   ```groovy
   buildscript {
       repositories {
           jcenter()
           mavenCentral() //添加
       }
       dependencies {
          	……
           classpath 'me.tatarka:gradle-retrolambda:3.2.5'  //添加
       }
   }
   ```

2. 在项目module的build.gradle中添加

   ```groovy
   apply plugin: 'me.tatarka.retrolambda'//引用lambda插件
   ```

3. 在项目module的build.gradle中添加

   ```groovy
   android {
            ...
            //设置java版本
           compileOptions {
               sourceCompatibility JavaVersion.VERSION_1_8
               targetCompatibility JavaVersion.VERSION_1_8
           }
   }
   ```

以上的内容添加完毕之后，即可在Android中使用lambda表达式，这时候我们可以回到Android Studio中看看我们使用匿名内部类的一些情况，比如注册View的点击事件、RxJava的一些事件，可以发现IDE会提示我们可以使用lambda来代替。