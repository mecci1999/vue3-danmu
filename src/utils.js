/**
 * 是否是HTML元素
 */
 function isHtmlEle(el) {
    return el instanceof HTMLElement;
  }
  
  // 获取dom
  function getEl(el) {
    const _el = typeof el === 'string' ? document.querySelector(el) : el;
    if (!isHtmlEle(_el)) {
      throw new Error('Type Error: el is not HTMLElement');
    }
    return _el;
  }
  
  // 创建弹幕容器，参数为轨道宽度
  function createDanmuContainer(trackWidth) {
    const danmuContainer = document.createElement('div');
    danmuContainer.style.display = 'inline-block';
    danmuContainer.style.transform = `translate(${trackWidth}px, ${0}px)`; // 初始化弹幕位置
    return danmuContainer;
  }
  
  // 是否是对象
  function isObject(value) {
    const type = Object.prototype.toString.call(value);
    return type === '[object Object]';
  }
  
  // 是否为数组
  function isArray(value) {
    return Array.isArray(value);
  }
  
  // 是否为空数组
  function isEmptyArray(array) {
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
  