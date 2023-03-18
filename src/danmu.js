/**
 * 弹幕类
 */
 import { h, render } from 'vue'
 import EventEmitter from './event-emitter'
 
 class Danmu extends EventEmitter {
   danmuContainer // 承载弹幕的容器
   dom // 生成的弹幕dom
   offset = 0 // 弹幕偏移量
   speed = 0 // 弹幕速度
   width = 0 // 弹幕长度
   stop = false // 是否停止当前弹幕
 
   constructor(danmuContainer, danmuComp, danmuProps, left) {
     super()
     this.danmuContainer = danmuContainer
     this.offset = left
     this.create(danmuComp, danmuProps)
     this.initStyle()
   }
 
   initStyle() {
     this.dom.style.position = 'absolute'
     this.dom.style.transform = `translate(${this.offset}px)`
     this.dom.style.pointerEvents = 'auto'
   }
 
   create(danmuComp, danmuProps) {
     render(h(danmuComp, danmuProps), this.danmuContainer?.dom)
     this.dom = this.danmuContainer?.dom
     this.dom.id = 'danmu-container'
   }
 }
 
 export default Danmu
 