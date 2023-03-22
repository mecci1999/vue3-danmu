/**
 * 弹幕类
 */
import { h, render } from "vue";
import EventEmitter from "./event-emitter";
import { IDanmuContainer } from "./types";

class Danmu<T> extends EventEmitter {
  danmuContainer: IDanmuContainer; // 承载弹幕的容器
  // @ts-ignore
  dom: HTMLElement; // 生成的弹幕dom
  offset: number = 0; // 弹幕偏移量
  speed: number = 0; // 弹幕速度
  width: number = 0; // 弹幕长度
  stop: boolean = false; // 是否停止当前弹幕

  constructor(
    danmuContainer: IDanmuContainer,
    danmuComp: any, // 弹幕组件
    danmuProps: T,
    left: number
  ) {
    super();
    this.danmuContainer = danmuContainer;
    this.offset = left;
    this.create(danmuComp, danmuProps);
    this.initStyle();
  }

  initStyle() {
    this.dom.style.position = "absolute";
    this.dom.style.transform = `translate(${this.offset}px)`;
    this.dom.style.pointerEvents = "auto";
  }

  create(danmuComp: any, danmuProps: any) {
    const { dom } = this.danmuContainer;
    render(h(danmuComp, danmuProps), dom);
    this.dom = dom;
    this.dom.id = "danmu-container";
  }
}

export default Danmu;
