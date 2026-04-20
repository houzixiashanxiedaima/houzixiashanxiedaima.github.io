---
title: Hexo + Github Pages搭建博客
description: Hexo + Github Pages搭建博客
author: 博客作者
pubDatetime: 2020-02-13T00:00:00.000Z
draft: false
featured: false
tags: ["Android"]
category: Android
---
本文以Windows 10操作系统为例，介绍Hexo + Github Pages搭建个人博客的具体步骤。先简单介绍下Hexo和Github Pages

- Hexo是一个快速、简洁且高效的博客框架
- Github Pages是Github推出的静态页面托管服务

将由Hexo生成的静态页面托管到Github Pages上，即可实现简单的个人博客或是项目介绍页面，那么接下来就来看看具体的操作步骤。

![](https://i.loli.net/2020/04/15/DNjXiwZC51ekBy8.png)



<!--more-->



## 环境配置

### 创建Github仓库

1. 创建私有的源文件仓库

   创建私有源文件仓库是因为部分源文件中会包含一些敏感的信息，为了更好地保护隐私。具体操作如图所示
   
      ![](https://i.loli.net/2020/04/15/3OiMJrNfTyUQCIB.png)


   在上图中，我们创建了一个名为`HexoSourceRepo`仓库，以后我们就会将博客的基本配置和文件存放在这个仓库。因此后续的主要操作，都是在`HexoSourceRepo`仓库进行的。

2. 创建公开的静态页面仓库

   ![](https://i.loli.net/2020/04/15/PEpmUk12brxzRvC.png)

   创建静态页面仓库和源文件仓库步骤是一样的，但是有两个地方需要注意

   1. 公开仓库的名称必须是你的用户名.github.io，比如你的用户名是`zhangsan`，那么仓库名称就必须是`zhangsan.github.io`
   2.  静态页面仓库，也就是`zhangsan.github.io`是公开的，而源文件仓库是私有的。

创建好两个仓库之后，我们就可以开始安装`Hexo`了，但是在安装`Hexo`之前，需要先安装`Node`环境，因为`Hexo`是`Node.js`支持的。

### 安装Node

直接去[Node官网](https://nodejs.org/zh-cn/)下载最新的安装包即可，推荐长期支持版，下载完成之后，打开安装包，一路下一步傻瓜式安装。安装完成之后，在命令行输入`node --version`和`npm -v`查看是否有输出，输出如下就表示没问题。

![](https://i.loli.net/2020/04/15/IcFY6D8ZgyBW2hR.png)

在安装`Node`的时候会自动安装`npm`包管理工具，但是`npm`默认使用国外的镜像，所以在后面安装包的时候可能会非常慢，所以我们先将`npm`替换为`cnpm`，在命令行中输入如下命令

```bash
npm install -g cnpm --registry=https://registry.npm.taobao.org 
```

~~安装`cnpm`并将镜像替换为国内的`taobao`镜像，加速包的下载速度。如果不想安装`cnpm`也可以直接将`npm`的镜像替换为`taobao`镜像~~

 ```bash
  npm config set registry https://registry.npm.taobao.org   
 ```

~~安装完`cnpm`之后，就可以将所有的`npm`命令使用`cnpm`代替。~~

> 2020-5-1 15:47:56更新

--可以安装`nrm`来选择各种源，具体操作为--

```bash
#安装nrm
npm install -g nrm
#常用命令
nrm help #显示帮助
nrm ls #列出所有的源
nrm use cnpm #切换源
```

通过`nrm`我们可以更好的管理各种源，选择国内的源能够显著的提升包的安装速度。

### 安装Git

在[Git官方页面](https://git-scm.com/download/win)下载Git，完成之后一路下一步傻瓜式安装。安装完成之后，即可使用`Git Bash`和`Git GUI`

来进行`Git`操作，本文全程使用`Git Bash`操作。为了能在`Git Bash`中使用`Node`和`npm`命令，还需要配置一下`Node`的环境变量，否则会出现`command not found`错误。

在环境变量－系统变量中，添加一个`NODE_PATH`值为`C:\Program Files\nodejs`(注意替换为自己的`Node`安装路径)，然后在`Path`中添加`%NODE_PATH%`即可。

### 安装Hexo

在喜欢的位置，新建一个文件夹，名为`HexoSourceRepo`，和上面创建的私有文件仓库同名。然后在文件夹中打开`Git Bash`依次进行如下操作

```bash
git init //初始化Git仓库
git remote add origin https://github.com/yourname/HexoSourceRepo.git //添加远程仓库
git add . 
git commit -m "init hexo blog" //第一次提交
git push -u origin master

cnpm install hexo //安装Hexo
hexo init //初始化Hexo
cnpm install //安装依赖包
cnpm install hexo-deployer-git //安装部署插件
```

安装完`Hexo`之后，可以在命令行执行`hexo -v`查看所有的信息，如果提示`command not found`那么就将`Hexo`添加到环境变量的`Path`中`C:\HexoSourceRepo\node_modules\.bin`(注意替换为自己的目录)。

经过上面的一系列操作，我们搭建好了基本的环境，接下来就是进行`Hexo`的博客配置，这部分内容主要是在`HexoSourceRepo`中进行的。后文中的根目录指的也是`HexoSourceRepo`这个目录。

打开根目录中的`_config.yml文件`，修改文件最后的`deploy`参数为如下内容

```yaml
deploy:
  type: git
  repository: 
    github: git@github.com:yourname/yourname.github.io.git //注意将yourname替换为自己的用户名
  branch: master
```

修改完成之后，我们再进行一次提交

```bash
git add .
git commit -m "first deploy"
git push origin master 
//然后继续执行
hexo g -d //将生成的网站部署到Github Pages静态页面上
```

至此，我们就完成了个人博客的搭建和部署。