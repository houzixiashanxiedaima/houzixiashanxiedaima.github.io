---
title: Virtualbox与Mactype共存
description: Virtualbox与Mactype共存
author: 博客作者
pubDatetime: 2016-07-28T00:00:00.000Z
draft: false
featured: false
tags: ["Android"]
category: Android
---
# Virtualbox与Mactype共存

最近心血来潮，准备重启吃灰好久的ubuntu虚拟机玩玩，于是开开心心准备打开机器，顺利进入，准备更新下软件，发现网速好慢，虽然主机能够高速访问“外网”，但是虚拟机并没有享受到这种福利，那么能不能让虚拟机也享受呢？这么一说，就是一段折腾史……

<!--more-->

##　虚拟机“外网”访问
虚拟机访问“外网”，可以通过设置虚拟机的网络为桥接模式，然后在虚拟机中设置主机的ip和端口即可。具体设置我们后面再说，先来打开桥接模式。
首先我们打开virtualbox的设置->网络->网卡1->连接方式->桥接网卡。到这一步的时候，被无情的提示“未指定”。原因是下图中红色箭头标记的那个东西没有
![未指定.png](http://upload-images.jianshu.io/upload_images/2524102-7d2b077d6ffba4d3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
根据网上的[提示](http://www.dabu.info/the-virtual-box-bridging-error-not-specified-network-interface-to-be-bridged.html)安装桥接网卡驱动，但是安装完毕之后，依然没有显示出来。经过多方查证，发现是虚拟机版本太低，于是选择将4.3.12升级到5.1.18（最新版），升级完毕之后选择桥接网卡，一切顺利。

![桥接网卡.png](http://upload-images.jianshu.io/upload_images/2524102-c9fc08a01d6f881c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

准备开机起飞……还没飞起来就被无情打脸，虚拟机不能启动，报错信息如下：

![虚拟机报错.png](http://upload-images.jianshu.io/upload_images/2524102-4cb56fa29e06e494.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
这个报错信息就是我们今天的关键信息，这个报错信息一般都是出现在`virtualbox 5.0+`和`windows 8+`上面，那么具体是什么原因呢，是因为virtualbox5.0之后对于系统的要求更严格了，说白了就是系统中如果安装了一些杀毒软件、主题修改的东西，那么虚拟机基本上就是会报这个错误。但是由于我的电脑一直是裸奔状态，于是我就将目标转向了mactype，这是我装的唯一一个主题修改类软件，于是经过多方查证找到了[解决办法](https://www.zhihu.com/question/27159349)
按照上面的步骤操作之后，然后准备再次起飞……依然没飞起来被打脸，打脸的还是那个报错信息。于是再次排查，找了半天，发现virtualbox5.0之后安装完虚拟机还要安装一个驱动，具体操作[在这里](https://jingyan.baidu.com/article/4d58d541186ad89dd4e9c018.html)
这次安装完毕之后，再次信心满满的准备起飞……最后还是被打脸，我在想这飞机是不是有问题，准备换回4.3.12了，但是内心有个声音告诉我，一定要征服这个虚拟机，我就不信了。然后又到处找资料，找来找去还是找回到之前的杀毒软件和主题修改软件方向上，于是我仔细检查了一下我的电脑，搞了一下午，结果发现电脑右下角有一个净网大师，于是怒卸载之。
卸载完毕，再次小心翼翼的准备起飞，这一次飞机平稳的起飞，心中的大石头也落地了，这一下午算是值了。

![飞机平稳起飞咯](http://upload-images.jianshu.io/upload_images/2524102-81efa0e0b9c7c6b5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
最后说一下关于ubuntu虚拟机桥接主机高速访问“外网”的方法：
在宿主机windows上运行shadowsocks.exe并勾选“允许局域网连接”
使用桥接方式运行虚拟机（这时虚拟机与宿主处于同一个局域网）
进入ubuntu系统，System Settings – Network – Network proxy勾选Manual（手动）,地址全部填宿主机IP（局域网网段），设置好代理端口（可在windows下的shadowsocks查看，一般为默认1080）
ubuntu用浏览器访问www.google.com，成功。