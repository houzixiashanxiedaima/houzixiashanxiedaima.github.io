---
title: build.gradle.kts + buildSrc管理Gradle依赖
description: build.gradle.kts + buildSrc管理Gradle依赖
author: 博客作者
pubDatetime: 2020-08-09T00:00:00.000Z
draft: false
featured: false
tags: ["Android", "Gradle", "Kotlin"]
category: Android
---
在Android开发过程中，经常需要管理Gradle的依赖，但是传统的Gradle管理方式有几个不好的地方

- 对于多个module支持不太好，无法共用
- build.gradle文件中无法使用自动补全
- 如果某个库在多module中引用，需要改动多个地方
- ……

虽然Google官方推荐使用ext的形式统一管理，但是对于现在大家使用Kotlin越来越多的情况下，是否能够使用Kotlin一门语言统一Android开发。

<!--More-->

今天就给大家介绍build.gradle.kts + buildSrc的方式来管理Gradle依赖，这种方式管理Gradle依赖，能够利用Kotlin语言的自动补全，让我们更方便地书写代码。接下来我们就一步步的将`build.gradle`转化为`build.gradle.kts`

### build.gradle -> build.gradle.kts

修改文件名为`build.gradle.kts`

**替换单引号为双引号**

在gradle语法中，可以用单引号`'`和双引号`"`来表示字符串，但是在`build.gradle.kts`中只能使用双引号表示字符串，所以我们要做的第一步就是将`build.gradle`文件中所有的单引号转换为双引号，这一步使用Android Studio自带的替换功能即可。

在文件中按下快捷键`Ctrl+R`，然后输入要查找的单引号，再输入要替换的双引号，点击`Replace all`，替换完成。

**修改gradle语法为kts语法**

- setting.gradle

  ```kotlin
  //修改前
  include ':app'
  rootProject.name = "BlogTmp"
  
  //修改后
  include(":app")
  rootProject.name = "BlogTmp"
  ```

- build.gradle(project)

  ```kotlin
  //修改前
  // Top-level build file where you can add configuration options common to all sub-projects/modules.
  buildscript {
      ext.kotlin_version = "1.3.72"
      repositories {
          google()
          jcenter()
      }
      dependencies {
          classpath "com.android.tools.build:gradle:4.0.1"
          classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
  
          // NOTE: Do not place your application dependencies here; they belong
          // in the individual module build.gradle files
      }
  }
  
  allprojects {
      repositories {
          google()
          jcenter()
      }
  }
  
  task clean(type: Delete) {
      delete rootProject.buildDir
  }
  
  //修改后
  // Top-level build file where you can add configuration options common to all sub-projects/modules.
  buildscript {
      val kotlin_version = "1.3.72"
      repositories {
          google()
          jcenter()
      }
      dependencies {
          classpath ("com.android.tools.build:gradle:4.0.1")
          classpath ("org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version")
  
          // NOTE: Do not place your application dependencies here; they belong
          // in the individual module build.gradle files
      }
  }
  
  allprojects {
      repositories {
          google()
          jcenter()
      }
  }
  
  tasks.register("clean", Delete::class) {
      delete(rootProject.buildDir)
  }
  ```

- build.gradle(app)

  修改前

  ```kotlin
  apply plugin: 'com.android.application'
  apply plugin: 'kotlin-android'
  apply plugin: 'kotlin-android-extensions'
  
  android {
      compileSdkVersion 29
      buildToolsVersion "29.0.3"
  
      defaultConfig {
          applicationId "com.agiao.blogtmp"
          minSdkVersion 16
          targetSdkVersion 29
          versionCode 1
          versionName "1.0"
  
          testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
      }
  
      buildTypes {
          release {
              minifyEnabled false
              proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
          }
      }
  }
  
  dependencies {
      implementation fileTree(dir: "libs", include: ["*.jar"])
      implementation "org.jetbrains.kotlin:kotlin-stdlib:$kotlin_version"
      implementation 'androidx.core:core-ktx:1.3.1'
      implementation 'androidx.appcompat:appcompat:1.1.0'
      implementation 'androidx.constraintlayout:constraintlayout:1.1.3'
      testImplementation 'junit:junit:4.12'
      androidTestImplementation 'androidx.test.ext:junit:1.1.1'
      androidTestImplementation 'androidx.test.espresso:espresso-core:3.2.0'
  
  }
  ```

  修改后

  ```kotlin
  plugins {
      id("com.android.application")
      id("kotlin-android")
      id("kotlin-android-extensions")
      id("kotlin-kapt")
  }
  
  
  android {
  
      compileSdkVersion(Versions.compileSdkVersion)
      buildToolsVersion(Versions.buildToolsVersion)
  
      defaultConfig {
          applicationId = Versions.applicationId
          minSdkVersion(Versions.minSdkVersion)
          targetSdkVersion(Versions.targetSdkVersion)
          versionCode = Versions.versionCode
          versionName = Versions.versionName
  
          testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
      }
  
      buildTypes {
          getByName(BuildType.release) {
              isMinifyEnabled = true
              proguardFiles(getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro")
          }
      }
  
      compileOptions {
          sourceCompatibility = JavaVersion.VERSION_1_8
          targetCompatibility = JavaVersion.VERSION_1_8
      }
  }
  
  dependencies {
      implementation(fileTree(mapOf("dir" to "libs", "include" to listOf("*.jar"))))
      implementation(Dependencies.kotlinStd)
      implementation(Dependencies.coreKTX)
      implementation(Dependencies.constraintLayout)
      implementation(Dependencies.appCompat)
  
      testImplementation(Test.junit)
      androidTestImplementation(Test.junitTest)
      androidTestImplementation(Test.espresso)
  }
  ```

修改的几个注意点：

- `kts`文件中大多都是函数调用，所以需要加上括号，字符串是作为参数传进去的
- `project-build.gradle`中的`task`需要修改为新的写法
- `app-build.gradle`中的`fileTree`需要修改为新的写法

在上述的修改中，使用到了`Dependencies.appCompat`这种调用方式，`Dependencies`就是我们在buildSrc中定义的统一管理文件。

### 新建buildSrc模块

在Android Studio中，将目录切换为`Project`，然后新建`buildSrc`文件夹，在`buildSrc`文件夹下新建`build.gradle.kts`文件，然后填入下面的代码，点击`sync now`进行同步。

```kotlin
plugins {
    `kotlin-dsl`
}
repositories{
    jcenter()
}
```

同步完成之后，`buildSrc`就变成了和`app`一样的一个`module`。然后在`buildSrc`文件夹上右键-新建文件夹-选择`src/main/java`，接下来就可以将我们的依赖写在该文件下的文件中了。

### 新建统一依赖管理文件

在上述的`src/main/java`文件夹中新建Dependencies.kt文件（文件名可以任意取）

```kotlin
object Dependencies {

    const val kotlinStd = "org.jetbrains.kotlin:kotlin-stdlib:${Versions.kotlinVersion}"
    const val coreKTX = "androidx.core:core-ktx:${Versions.coreKTX}"
    const val appCompat = "androidx.appcompat:appcompat:${Versions.appCompact}"
    const val constraintLayout =
        "androidx.constraintlayout:constraintlayout:${Versions.constraintLayout}"

    const val roomRuntime = "androidx.room:room-runtime:${Versions.roomVersion}"
    const val roomCompiler = "androidx.room:room-compiler:${Versions.roomVersion}"
    const val roomCoroutines = "androidx.room:room-ktx:${Versions.roomVersion}"

    const val liveData = "androidx.lifecycle:lifecycle-viewmodel-ktx:${Versions.lifeCycleVersion}"
    const val viewModel = "androidx.lifecycle:lifecycle-livedata-ktx:${Versions.lifeCycleVersion}"
    const val lifeCycleCompiler =
        "androidx.lifecycle:lifecycle-compiler:${Versions.lifeCycleVersion}"

    const val material = "com.google.android.material:material:${Versions.materialVersion}"
}

object Versions {
    const val compileSdkVersion = 29
    const val buildToolsVersion = "29.0.3"
    const val applicationId = "com.agiao.blogtmp"
    const val minSdkVersion = 16
    const val targetSdkVersion = 29
    const val versionCode = 1
    const val versionName = "1.0"

    const val kotlinVersion = "1.3.72"
    const val coreKTX = "1.3.0"
    const val appCompact = "1.1.0"
    const val constraintLayout = "2.0.0-rc1"

    const val roomVersion = "2.2.5"
    const val lifeCycleVersion = "2.2.0"
    const val materialVersion = "1.1.0"

    const val junit = "4.12"
    const val junitTest = "1.1.1"
    const val espresso = "3.2.0"
}

object Test {
    const val testRoom = "androidx.room:room-testing:${Versions.roomVersion}"
    const val junit = "junit:junit:${Versions.junit}"
    const val junitTest = "androidx.test.ext:junit:${Versions.junitTest}"
    const val espresso = "androidx.test.espresso:espresso-core:${Versions.espresso}"
}

object BuildType {
    const val release = "release"
    const val debug = "debug"
}
```

上述的依赖库可以根据自己的需要调整，也可以把每个`object`都提取为单独的文件，这部分就是根据个人喜好自己调整。

至此，我们的`build.gradle`就完全改造完成了。现在就可以在`build.gradle.kts`中使用Kotlin的语法进行依赖导入了，同时还能使用Kotlin的自动补全功能，更方便的管理和导入依赖了。