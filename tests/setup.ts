/**
 * Vitest 测试环境设置文件
 * 配置全局测试环境和模拟对象
 */

import { vi, beforeAll, beforeEach, afterEach } from "vitest";

// 模拟 Canvas API
class MockCanvasRenderingContext2D {
  canvas: HTMLCanvasElement;
  fillStyle: string | CanvasGradient | CanvasPattern = "#000000";
  strokeStyle: string | CanvasGradient | CanvasPattern = "#000000";
  lineWidth: number = 1;
  lineCap: CanvasLineCap = "butt";
  lineJoin: CanvasLineJoin = "miter";
  globalAlpha: number = 1;
  globalCompositeOperation: GlobalCompositeOperation = "source-over";

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  // 路径方法
  beginPath = vi.fn();
  closePath = vi.fn();
  moveTo = vi.fn();
  lineTo = vi.fn();
  quadraticCurveTo = vi.fn();
  bezierCurveTo = vi.fn();
  arc = vi.fn();
  arcTo = vi.fn();
  rect = vi.fn();

  // 绘制方法
  fill = vi.fn();
  stroke = vi.fn();
  fillRect = vi.fn();
  strokeRect = vi.fn();
  clearRect = vi.fn();
  fillText = vi.fn();
  strokeText = vi.fn();
  drawImage = vi.fn();

  // 变换方法
  save = vi.fn();
  restore = vi.fn();
  translate = vi.fn();
  rotate = vi.fn();
  scale = vi.fn();
  transform = vi.fn();
  setTransform = vi.fn();
  resetTransform = vi.fn();

  // 裁剪方法
  clip = vi.fn();

  // 测量方法
  measureText = vi.fn().mockReturnValue({ width: 100 });

  // 图像数据方法
  createImageData = vi.fn();
  getImageData = vi.fn();
  putImageData = vi.fn();

  // 渐变和模式
  createLinearGradient = vi.fn();
  createRadialGradient = vi.fn();
  createPattern = vi.fn();

  // 路径检测
  isPointInPath = vi.fn().mockReturnValue(false);
  isPointInStroke = vi.fn().mockReturnValue(false);
}

class MockHTMLCanvasElement {
  width: number = 300;
  height: number = 150;

  getContext(contextId: string): MockCanvasRenderingContext2D | null {
    if (contextId === "2d") {
      return new MockCanvasRenderingContext2D(this as any);
    }
    return null;
  }

  toDataURL = vi.fn().mockReturnValue("data:image/png;base64,mock");
  toBlob = vi.fn();
}

// 全局设置
beforeAll(() => {
  // 模拟 HTMLCanvasElement
  global.HTMLCanvasElement = MockHTMLCanvasElement as any;

  // 模拟 document.createElement
  const originalCreateElement = document.createElement;
  document.createElement = vi.fn().mockImplementation((tagName: string) => {
    if (tagName === "canvas") {
      return new MockHTMLCanvasElement();
    }
    return originalCreateElement.call(document, tagName);
  });

  // 模拟 Image 构造函数
  global.Image = class MockImage {
    src: string = "";
    width: number = 0;
    height: number = 0;
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;

    constructor() {
      // 模拟异步加载
      setTimeout(() => {
        this.width = 100;
        this.height = 100;
        if (this.onload) {
          this.onload();
        }
      }, 0);
    }
  } as any;

  // 模拟 requestAnimationFrame
  global.requestAnimationFrame = vi
    .fn()
    .mockImplementation((callback: FrameRequestCallback) => {
      return setTimeout(callback, 16);
    });

  global.cancelAnimationFrame = vi.fn().mockImplementation((id: number) => {
    clearTimeout(id);
  });
});

// 每个测试前的清理
beforeEach(() => {
  vi.clearAllMocks();
});

// 测试后的清理
afterEach(() => {
  vi.restoreAllMocks();
});

// 导出模拟类供测试使用
export { MockCanvasRenderingContext2D, MockHTMLCanvasElement };
