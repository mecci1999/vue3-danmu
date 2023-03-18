### 简介
这是一个基于Vue3的简易弹幕系统

### 使用方法

#### 参数
引入Barrage类，该类有三个参数。
第一个参数为要创建的弹幕容器对象类名，例如'.barrage__container'，
第二个参数为单条弹幕的组件，
第三个参数为弹幕的配置选项

#### 方法
**start()**  启动弹幕

**stop()** 停止弹幕

**clear()** 清除弹幕

**add()** 添加弹幕

### 举例
``` javascript
// 弹幕容器组件

<template>
    <div class="barrage__container"></div>
</template>

<script setup>
import Barrage from 'vue-simple-barrage'
import BarrageItem from './barrage-item.vue'

// 弹幕容器对象
let danmu = null;

// 定时器
let timer = null

// 弹幕可选参数
const options = {
    duration: 8000, // 弹幕展示时长 默认为8000
    maxTrack: 4, // 弹幕轨道数量 默认为4
    trackHeight: 32, // 弹幕轨道高度 默认32
    maxPool: 10 // 弹幕池最大容纳弹幕数量 默认10
}

// 开始播放弹幕
const handlePlay = () => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  if (!danmaku) {
    initDanmaku()
  }
  // 启动弹幕
  danmaku?.start()
  // 每隔0.3s推入一条弹幕
  timer = setTimeout(function insertBarrage() {
    let sumScroll = 1 + Math.floor(12 * Math.random())
    while (sumScroll--) {
      danmaku?.add('123')
    }
    timer = setTimeout(insertBarrage, 1000 + Math.floor(Math.random() * 3000))
  }, 300)
}

// 暂停
const handlePause = () => {
  danmaku?.stop()
}

// 结束
const handleEnded = () => {
  clearTimeout(timer)
  timer = null
  if (danmaku) {
    danmaku.clear()
    danmaku = null
  }
}

// 弹幕初始化
const initDanmaku = () => {
  danmu = new Barrage('.barrage__container',BarrageItem, options);
}

onMounted(() => {
  initDanmaku()
})

onUnmounted(() => {
  clearTimeout(timer)
  timer = null
})
</script>
```

``` javascript
// 单条弹幕组件
// barrage-item.vue

<script setup>
const props = defineProps({
  item: {
    type: String
  }
})
</script>

<template>
  <div class="barrage-item">
    <span class="barrage-item__name">{{ item }}：</span>
  </div>
</template>
```