import Danmu from "./danmu";

/**
 * 弹幕轨道类
 */
class Track<T> {
  danmus: Danmu<T>[] = []; // 弹幕
  offset: number = 0; // 轨道已经被占据的宽度

  // 推入弹幕
  push(item: Danmu<T>) {
    this.danmus.push(item);
  }

  // 去除第一条弹幕
  remove() {
    this.danmus.shift();
  }

  // 移除索引为index的弹幕
  removeOfIndex(index: number) {
    if (index < 0 || index >= this.danmus.length) {
      return;
    }
    return this.danmus.splice(index, 1)[0];
  }

  // 重置
  reset() {
    this.danmus = [];
    this.offset = 0;
  }

  // 更新占用空间，为了计算当前轨道的剩余空间
  updateOffset() {
    const lastDanmu = this.danmus[this.danmus.length - 1]; // 获取当前轨道的最后一条弹幕
    if (lastDanmu) {
      const { speed } = lastDanmu; // 获取最后一条弹幕的速度
      this.offset -= speed; //
    }
  }
}

export default Track;
