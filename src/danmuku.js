/**
 * 弹幕库类
 */
import Track from "./track.js";
import { getEl, isArray, isEmptyArray, isObject } from "./utils.js";
import { TIME_PER_FRAME } from "./config.js";
import Danmu from "./danmu.js";
import EventEmitter from "./event-emitter.js";

class Danmaku extends EventEmitter {
  el;
  waitingQueue = [];
  tracks = [];
  maxTrack = 4;
  domPool = [];
  maxPool = 10;
  danmuComp;
  duration = 8000; // 弹幕展示的时长
  trackWidth; // 轨道的宽度
  trackHeight = 32; // 轨道的高度
  animation = null;
  elmToObj = new WeakMap();

  constructor(el, danmuComp, options) {
    super();
    this.el = getEl(el);
    this.trackWidth = this.el.offsetWidth;
    this.danmuComp = danmuComp;
    if (isObject(options)) {
      options?.duration && (this.duration = options.duration);
      options?.maxTrack && (this.maxTrack = options.maxTrack);
      options?.maxPool && (this.maxPool = options.maxPool);
      options?.trackHeight && (this.trackHeight = options.trackHeight);
    }
    this.initTracks();
    this.initDomPool();
    this.bindEvent();
  }

  get _defaultSpeed() {
    // return this.trackWidth / (this.duration / TIME_PER_FRAME)
    return (this.trackWidth / this.duration) * TIME_PER_FRAME;
  }

  // 获取一个速度系数，用于随机速度
  get _speedCoefficient() {
    return 0.8 + Math.random() * 1.3;
  }
  bindEvent() {
    this.el.addEventListener("click", (e) => {
      this.clearStopStatus();
      console.log(e.target);

      const target = e.target;

      const obj = this.elmToObj.get(target);

      if (target.id === "danmu-container") {
        obj.stop = true;
        this.el.style.pointerEvents = "auto";
        const rect = target.getBoundingClientRect();
        const position = {
          top: rect.top + rect.height,
          left: e.layerX,
        };
        this.$emit("onChoose", position);
      } else {
        this.$emit("onUnchoose");
      }
    });
  }
  clearStopStatus() {
    this.el.style.pointerEvents = "none";
    this.tracks.forEach((track) => {
      track.danmus.forEach((danmu) => {
        danmu.stop = false;
      });
    });
  }
  // 添加弹幕到等待队列中
  add(data) {
    if (isArray(data)) {
      data.forEach((item) => {
        const danmuObject = {
          danmuProps: item,
          speed: 0,
          offset: this.trackWidth,
          width: 0,
        };
        this.waitingQueue.push(danmuObject);
      });
    } else {
      const danmuObject = {
        danmuProps: data,
        speed: 0,
        offset: this.trackWidth,
        width: 0,
      };
      this.waitingQueue.push(danmuObject);
    }
  }
  // 初始化dom池
  initDomPool() {
    for (let i = 0; i < this.maxPool; i++) {
      const dom = document.createElement("div");
      dom.style.display = "inline-block";
      const danmuContainer = {
        dom,
        isMount: false,
      };
      this.domPool.push(danmuContainer);
    }
  }
  // 初始化轨道实例
  initTracks() {
    for (let i = 0; i < this.maxTrack; i++) {
      this.tracks.push(new Track());
    }
  }
  // 开始
  start() {
    // 显示容器
    this.el.style.opacity = "1";
    if (this.animation) {
      return;
    }
    // 开始渲染
    this._render();
  }
  // 暂停
  stop() {
    if (!this.animation) {
      return;
    }
    cancelAnimationFrame(this.animation);
    this.animation = null;
  }
  // 清除
  clear() {
    this.tracks.forEach((track) => {
      track.danmus.forEach((danmu) => {
        this.el.removeChild(danmu.dom);
      });
      track.reset();
    });
    this.stop();
  }
  // 核心方法，负责轨道的渲染
  _render() {
    this._extractDanmu();
    this.tracks.forEach((track, trackIndex) => {
      let isRemove = false;
      let removeIndex = -1;
      track.danmus.forEach((danmu, danmuIndex) => {
        if (danmu.stop) {
          return;
        }
        const { dom, offset } = danmu;
        // 给弹幕设定运行轨道
        dom.style.transform = `translate(${offset}px, ${
          trackIndex * this.trackHeight + trackIndex * 16
        }px)`;

        danmu.offset -= danmu.speed;

        // 清除已经运行完的弹幕
        if (danmu.offset < 0 && Math.abs(danmu.offset) > danmu.width + 5) {
          isRemove = true;
          removeIndex = danmuIndex;
          const { danmuContainer, dom } = danmu;
          this.domPool.push(danmuContainer);
          this.elmToObj.delete(dom);
          // 清除dom
        }
      });
      track.updateOffset();
      if (isRemove) {
        track.removeOfIndex(removeIndex);
      }
    });

    this.animation = requestAnimationFrame(this._render.bind(this));
  }
  // 将等待队列中的弹幕推送到合适的轨道
  _extractDanmu() {
    let isEntered;
    for (let i = 0; i < this.waitingQueue.length; ) {
      isEntered = this._pushToTrack(this.waitingQueue[i]);
      if (!isEntered) {
        break;
      }
      this.waitingQueue.shift();
    }
  }
  // 推入轨道
  _pushToTrack(danmuObject) {
    const trackId = this._findTrack();
    if (trackId === -1) {
      return false;
    }
    if (!this.domPool.length) {
      return false;
    }
    const danmuContainer = this.domPool.pop();
    // 创建弹幕的实例
    const { offset, danmuProps } = danmuObject;
    const danmu = new Danmu(danmuContainer, this.danmuComp, danmuProps, offset);
    if (!danmuContainer.isMount) {
      this.el.appendChild(danmu.dom);
      danmuContainer.isMount = true;
    }
    const width = (danmu.width = danmu.dom.offsetWidth);
    this.elmToObj.set(danmu.dom, danmu);
    // 计算弹幕的速度
    const track = this.tracks[trackId];
    const trackOffset = track.offset;
    const trackWidth = this.trackWidth;
    let speed;
    if (isEmptyArray(track.danmus)) {
      speed = this._defaultSpeed * this._speedCoefficient;
    } else {
      const { speed: preSpeed } = track.danmus[track.danmus.length - 1];
      speed = (trackWidth * preSpeed) / trackOffset;
    }
    speed = Math.min(speed, this._defaultSpeed * 2);
    danmu.speed = speed;
    // 将弹幕实例推送到轨道
    track.danmus.push(danmu);
    track.offset = trackWidth + width * 1.1 + Math.random() * 50;
    return true;
  }
  // 查找合适推送弹幕的轨道
  _findTrack() {
    let id = -1;
    let max = -Infinity; // 最大剩余空间
    this.tracks.forEach((tranck, index) => {
      const trackOffset = tranck.offset;
      if (trackOffset > this.trackWidth) {
        return;
      }
      // 存在多个合适的轨道时，使用剩余空间最大的
      const t = this.trackWidth - trackOffset;
      if (t > max) {
        id = index;
        max = t;
      }
    });
    return id;
  }

  onChoose(handler) {
    this.$on("onChoose", handler);
  }
  onUnchoose(handler) {
    this.$on("onUnchoose", handler);
  }
}

export default Danmaku;
