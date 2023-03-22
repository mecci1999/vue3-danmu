export interface IDanmukuOptions {
  maxTrack: number; // 最大轨道数量
  maxPool: number; // 弹幕池最大数量
  duration: number; // 弹幕滚动时间
  trackHeight: number; // 轨道高度
}

export interface IDanmuContainer {
  dom: HTMLDivElement; // 轨道容器dom
  isMount: boolean; // 是否挂载
}

export interface IDanmuObject<T> {
  danmuProps: T;
  speed: number; // 速度
  offset: number; // 偏移量
  width: number; // 宽度
}

export interface IDanmuEventHandler {
  (position: { left: number; top: number } | undefined): void;
}
