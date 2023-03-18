/**
 * 事件类
 */
 export default class EventEmitter {
    _eventsMap = {}; // 事件对象
  
    // 监听方法
    $on(eventName, handler) {
      const eventsMap = this._eventsMap;
      const handlers = eventsMap[eventName] || (eventsMap[eventName] = []);
      handlers.push(handler);
      return this;
    }
  
    // 触发一次
    $once(eventName, handler) {
      const eventsMap = this._eventsMap;
      const handlers = eventsMap[eventName] || (eventsMap[eventName] = []);
      const self = this;
      const fn = function (...args) {
        handler(...args);
        self.$off(eventName, fn);
      };
      handlers.push(fn);
      return this;
    }
  
    // 取消监听
    $off(eventName, handler) {
      const eventsMap = this._eventsMap;
      if (!handler) {
        eventsMap[eventName].length = 0;
        return this;
      }
  
      const handlers = eventsMap[eventName];
      if (!handlers) {
        return this;
      }
  
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
  
      return this;
    }
  
    // 触发事件回调
    $emit(eventName, ...args) {
      const eventsMap = this._eventsMap;
      const handlers = eventsMap[eventName];
      if (Array.isArray(handlers)) {
        handlers.forEach((fn) => fn(...args));
      }
    }
  }
  