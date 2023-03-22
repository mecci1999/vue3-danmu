/**
 * 是否是HTML元素
 */
function isHtmlEle(el: any) {
  return el instanceof HTMLElement;
}

// 获取dom
function getEl(el: HTMLElement | string): HTMLElement {
  const _el = typeof el === "string" ? document.querySelector(el) : el;
  if (!isHtmlEle(_el)) {
    throw new Error("Type Error: el is not HTMLElement");
  }
  return _el as HTMLElement;
}

// 创建弹幕容器，参数为轨道宽度
function createDanmuContainer(trackWidth: number): HTMLElement {
  const danmuContainer = document.createElement("div");
  danmuContainer.style.display = "inline-block";
  danmuContainer.style.transform = `translate(${trackWidth}px, ${0}px)`; // 初始化弹幕位置
  return danmuContainer;
}

// 是否是对象
function isObject(value: any): boolean {
  const type = Object.prototype.toString.call(value);
  return type === "[object Object]";
}

// 是否为数组
function isArray(value: any): boolean {
  return Array.isArray(value);
}

// 是否为空数组
function isEmptyArray(array: Array<any>): boolean {
  return array.length === 0;
}

export {
  isHtmlEle,
  getEl,
  createDanmuContainer,
  isObject,
  isArray,
  isEmptyArray,
};
