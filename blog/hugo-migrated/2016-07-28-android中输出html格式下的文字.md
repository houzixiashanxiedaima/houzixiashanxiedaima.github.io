---
title: Android中输出HTML格式下的文字
description: Android中输出HTML格式下的文字
author: 博客作者
pubDatetime: 2016-07-28T00:00:00.000Z
draft: false
featured: false
tags: ["Android"]
category: Android
---
# Android中输出HTML格式下的文字

在Android中，我们经常会用到TextView这个控件，在使用的过程中，我们用到最多的方法就是setText()，单纯的使用基本上能够满足我们日常的需求，但是有时候我们需要对文字进行一些处理，比如说加粗、斜体、下划线等等，这些也都是可以通过Android提供的原生方法完成。但是如果我们需要实现下面的效果呢：

![图1](http://upload-images.jianshu.io/upload_images/2524102-92f803de79292a20.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

<!--more-->

## HTML下的文字解析(快速版)

从图片上我们可以看到，这段文字分别有`两种大小，三种颜色`。我们当然可以定义多个TextView来实现这样的效果，但是如果我们的文字变化较多，那么定义多个TextView也非常的麻烦。那么接下来我们就来介绍一个比较简单的方法：
```Java
String str = "恭喜您！您的手机跑分为<font color='#F50057'><big><big><big>888888分</big></big></big></font>，已经超过全国<font color='#00E676'><big><big><big>99%</big></big></big></font>的Android手机。";
tv.setText(Html.fromHtml(str));
```
上面的代码中，我们用到了一个方法`Html.fromHtml()`，这个方法是Android中专门用来解析HTML格式的一个方法，我们可以将任意的HTML格式下的代码通过此方法解析，最后得到我们需要的结果。
通过上面的方法，我们就可以实现在`setText()`中使用各种带HTML效果的文字了。这样应该能够实现我们开发中98%的需求了，那么还有1-2%的需求是什么呢？

## HTML下的文字解析(多语言支持)

比如说我们现在的APP需要兼容多种语言，包括中文、法语、英语、日语等等。在平时的开发过程中，我们都知道多语言的实现可以通过不同`values`文件夹下的`string.xml`文件来实现。我们这里就以中文来举例，看看我们如何在`string.xml`文件中定义HTML格式的文字。
首先我们来尝试将我们上面定义的`str`中的字符串直接放到`string.xml`中。
```xml
<string name="test_string">
      恭喜您！您的手机跑分为<font color='#F50057'><big><big><big>888888分</big></big></big></font>
      ，已经超过全国<font color='#00E676'><big><big><big>99%</big></big></big></font>的Android手机。
   </string>
```
```java
tv.setText(Html.fromHtml(getString(R.string.test_string)));
```


运行程序，结果如下：

![图2](http://upload-images.jianshu.io/upload_images/2524102-d8922d1d6ea9bc47.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

并没有出现我们预期的效果，HTML格式并没有被解析出来。这是什么原因呢？原因就在于我们使用的`getString()`方法，官方对于这个方法的解释如下：
> Return the string value associated with a particular resource ID. It will be stripped of any styled text information.
返回与特定资源ID相关联的字符串值，它将删除任何样式的文本信息。

那么也就是说我们的HTML格式被`getString()`方法给删除了，所以我们的文字才会变成普通的字符串。要解决这个问题，我们需要将我们的`string.xml`中的字符串使用`<![CDATA[...your html...]]>`包裹起来，被`CDATA`包裹起来的字符都会被解析器忽略，也就是说`CDATA`中的HTML格式将会被原封不动的保留下来，最终交给我们的`Html.fromHtml()`进行解析。那么我们来尝试以下，将我们`string.xml`中的字符串改为如下：
``` xml
<string name="test_string">
        <![CDATA[
            恭喜您！您的手机跑分为<font color='#F50057'><big><big><big>888888分</big></big></big></font>
            ，已经超过全国<font color='#00E676'><big><big><big>99%</big></big></big></font>的Android手机。
        ]]>
    </string>
```
编译运行，结果编译时报错：
```xml
Error:(17, 5) Apostrophe not preceded by \ (in  鎭枩鎮紒鎮ㄧ殑鎵嬫満璺戝垎涓?<font color='#F50057'><big><big><big>888888鍒?</big></big></big></font>
```
报错的关键词为：
> Apostrophe not preceded by \
> 撇号前面没有\

通过上面的这个报错信息我们可以知道，这是因为`'`没有进行转义，那么我根据报错信息将所有的单引号进行转义。最后的结果如下：
```xml
<string name="test_string">
       <![CDATA[
           恭喜您！您的手机跑分为<font color=\'#F50057\'><big><big><big>888888分</big></big></big></font>
           ，已经超过全国<font color=\'#00E676\'><big><big><big>99%</big></big></big></font>的Android手机。
       ]]>
   </string>
```
最后我们再次运行，得到的就是和我们文章开头一样的结果。
关于Android中HTML格式下的文字解析大概就是这样了，如果大家还有其他的方法，欢迎交流。
## 后记
最后附上一个在尝试过程中遇到的错误，本来想情景重现的，结果怎么样都无法再遇到那个错误了。如果有遇到这个错误的朋友，可以尝试下面的解决办法。
错误：
> Multiple annotations found at this line:  
- error: Multiple substitutions specified in non-positional format; did you mean to add  
the formatted="false" attribute?  
- error: Unexpected end tag string  

导致错误的可能原因及解决方法：
1. string.xml中的字符串中有`%`，对`%`进行转义，即改为`\%`；或者使用两个百分号表示一个，即改为`%%`。
2. string.xml中的字符串被格式化了，导致解析器解析出错，解决办法为`<string name="test_string" formatted="false">`，将formatted设置为false即可。