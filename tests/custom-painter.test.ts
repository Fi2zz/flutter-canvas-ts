import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CustomPainter, CustomPaint, PainterFactory, AnimatedCustomPainter } from '../src/custom-painter';
import { Canvas } from '../src/canvas';
import { Paint } from '../src/paint';
import { Color } from '../src/color';
import { Size } from '../src/types';

// 测试用的具体CustomPainter实现
class TestCustomPainter extends CustomPainter {
  constructor(private color: Color = Color.red, private radius: number = 50) {
    super();
  }

  paint(canvas: Canvas, size: Size): void {
    const paint = new Paint();
    paint.color = this.color;
    
    const center = {
      dx: size.width / 2,
      dy: size.height / 2
    };
    
    canvas.drawCircle(center, this.radius, paint);
  }

  shouldRepaint(oldDelegate: CustomPainter): boolean {
    if (!(oldDelegate instanceof TestCustomPainter)) {
      return true;
    }
    return this.color !== oldDelegate.color || this.radius !== oldDelegate.radius;
  }

  getColor(): Color {
    return this.color;
  }

  getRadius(): number {
    return this.radius;
  }
}

// 测试用的AnimatedCustomPainter实现
class TestAnimatedPainter extends AnimatedCustomPainter {
  constructor(private baseRadius: number = 30) {
    super();
  }

  paintAnimated(canvas: Canvas, size: Size, animationValue: number): void {
    const paint = new Paint();
    paint.color = Color.blue;
    
    const center = {
      dx: size.width / 2,
      dy: size.height / 2
    };
    
    // 根据动画值调整半径
    const radius = this.baseRadius * (1 + animationValue * 0.5);
    canvas.drawCircle(center, radius, paint);
  }

  getBaseRadius(): number {
    return this.baseRadius;
  }
}

describe('CustomPainter', () => {
  let mockCanvas: Canvas;
  let mockContext: CanvasRenderingContext2D;
  let size: Size;

  beforeEach(() => {
    // 创建模拟的Canvas上下文
    mockContext = {
      save: vi.fn(),
      restore: vi.fn(),
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      strokeRect: vi.fn(),
      beginPath: vi.fn(),
      closePath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      clip: vi.fn(),
      translate: vi.fn(),
      scale: vi.fn(),
      rotate: vi.fn(),
      transform: vi.fn(),
      setTransform: vi.fn(),
      resetTransform: vi.fn(),
      createLinearGradient: vi.fn(),
      createRadialGradient: vi.fn(),
      createPattern: vi.fn(),
      measureText: vi.fn(() => ({ width: 100 })),
      fillText: vi.fn(),
      strokeText: vi.fn(),
      drawImage: vi.fn(),
      getImageData: vi.fn(),
      putImageData: vi.fn(),
      createImageData: vi.fn(),
      globalAlpha: 1,
      globalCompositeOperation: 'source-over',
      fillStyle: '#000000',
      strokeStyle: '#000000',
      lineWidth: 1,
      lineCap: 'butt',
      lineJoin: 'miter',
      miterLimit: 10,
      font: '10px sans-serif',
      textAlign: 'start',
      textBaseline: 'alphabetic',
      shadowColor: 'rgba(0, 0, 0, 0)',
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      canvas: {} as HTMLCanvasElement
    } as any;

    mockCanvas = new Canvas(mockContext, { width: 200, height: 200 });
    size = { width: 200, height: 200 };
  });

  describe('基本功能', () => {
    it('应该能够创建CustomPainter实例', () => {
      const painter = new TestCustomPainter();
      expect(painter).toBeInstanceOf(CustomPainter);
      expect(painter).toBeInstanceOf(TestCustomPainter);
    });

    it('应该能够执行绘制操作', () => {
      const painter = new TestCustomPainter(Color.blue, 75);
      
      // 执行绘制
      painter.paint(mockCanvas, size);
      
      // 验证绘制方法被调用
      expect(mockContext.beginPath).toHaveBeenCalled();
      expect(mockContext.arc).toHaveBeenCalled();
      expect(mockContext.fill).toHaveBeenCalled();
    });

    it('应该能够正确传递绘制参数', () => {
      const painter = new TestCustomPainter(Color.green, 100);
      
      painter.paint(mockCanvas, size);
      
      // 验证圆形绘制参数
      expect(mockContext.arc).toHaveBeenCalledWith(
        100, // centerX
        100, // centerY
        100, // radius
        0,   // startAngle
        2 * Math.PI, // endAngle
        false // anticlockwise
      );
    });
  });

  describe('shouldRepaint方法', () => {
    it('默认实现应该返回true', () => {
      const painter = new TestCustomPainter();
      const oldPainter = new TestCustomPainter();
      
      // 使用基类的默认实现
      const basePainter = new (class extends CustomPainter {
        paint() {}
      })();
      
      expect(basePainter.shouldRepaint(oldPainter)).toBe(true);
    });

    it('相同参数时应该返回false', () => {
      const painter1 = new TestCustomPainter(Color.red, 50);
      const painter2 = new TestCustomPainter(Color.red, 50);
      
      expect(painter1.shouldRepaint(painter2)).toBe(false);
    });

    it('不同颜色时应该返回true', () => {
      const painter1 = new TestCustomPainter(Color.red, 50);
      const painter2 = new TestCustomPainter(Color.blue, 50);
      
      expect(painter1.shouldRepaint(painter2)).toBe(true);
    });

    it('不同半径时应该返回true', () => {
      const painter1 = new TestCustomPainter(Color.red, 50);
      const painter2 = new TestCustomPainter(Color.red, 75);
      
      expect(painter1.shouldRepaint(painter2)).toBe(true);
    });

    it('不同类型的绘制器应该返回true', () => {
      const painter1 = new TestCustomPainter();
      const painter2 = new (class extends CustomPainter {
        paint() {}
      })();
      
      expect(painter1.shouldRepaint(painter2)).toBe(true);
    });
  });

  describe('shouldRebuildSemantics方法', () => {
    it('默认实现应该返回false', () => {
      const painter = new TestCustomPainter();
      const oldPainter = new TestCustomPainter();
      
      expect(painter.shouldRebuildSemantics(oldPainter)).toBe(false);
    });
  });

  describe('getClipBounds方法', () => {
    it('应该返回完整的绘制区域', () => {
      const painter = new TestCustomPainter();
      const bounds = painter.getClipBounds(size);
      
      expect(bounds).toEqual({
        left: 0,
        top: 0,
        right: 200,
        bottom: 200
      });
    });

    it('应该处理不同的尺寸', () => {
      const painter = new TestCustomPainter();
      const customSize = { width: 300, height: 150 };
      const bounds = painter.getClipBounds(customSize);
      
      expect(bounds).toEqual({
        left: 0,
        top: 0,
        right: 300,
        bottom: 150
      });
    });
  });

  describe('hitTest方法', () => {
    it('默认实现应该返回false', () => {
      const painter = new TestCustomPainter();
      const position = { dx: 100, dy: 100 };
      
      expect(painter.hitTest(position, size)).toBe(false);
    });

    it('应该接受不同的位置参数', () => {
      const painter = new TestCustomPainter();
      
      expect(painter.hitTest({ dx: 0, dy: 0 }, size)).toBe(false);
      expect(painter.hitTest({ dx: 200, dy: 200 }, size)).toBe(false);
      expect(painter.hitTest({ dx: -10, dy: -10 }, size)).toBe(false);
    });
  });
});

describe('CustomPaint', () => {
  let mockContext: CanvasRenderingContext2D;
  let size: Size;
  let painter: TestCustomPainter;

  beforeEach(() => {
    mockContext = {
      save: vi.fn(),
      restore: vi.fn(),
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      strokeRect: vi.fn(),
      beginPath: vi.fn(),
      closePath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      clip: vi.fn(),
      translate: vi.fn(),
      scale: vi.fn(),
      rotate: vi.fn(),
      transform: vi.fn(),
      setTransform: vi.fn(),
      resetTransform: vi.fn(),
      createLinearGradient: vi.fn(),
      createRadialGradient: vi.fn(),
      createPattern: vi.fn(),
      measureText: vi.fn(() => ({ width: 100 })),
      fillText: vi.fn(),
      strokeText: vi.fn(),
      drawImage: vi.fn(),
      getImageData: vi.fn(),
      putImageData: vi.fn(),
      createImageData: vi.fn(),
      globalAlpha: 1,
      globalCompositeOperation: 'source-over',
      fillStyle: '#000000',
      strokeStyle: '#000000',
      lineWidth: 1,
      lineCap: 'butt',
      lineJoin: 'miter',
      miterLimit: 10,
      font: '10px sans-serif',
      textAlign: 'start',
      textBaseline: 'alphabetic',
      shadowColor: 'rgba(0, 0, 0, 0)',
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      canvas: {} as HTMLCanvasElement
    } as any;

    size = { width: 300, height: 200 };
    painter = new TestCustomPainter(Color.blue, 60);
  });

  describe('构造函数', () => {
    it('应该能够创建CustomPaint实例', () => {
      const customPaint = new CustomPaint(painter, mockContext, size);
      
      expect(customPaint).toBeInstanceOf(CustomPaint);
      expect(customPaint.customPainter).toBe(painter);
      expect(customPaint.size).toEqual(size);
    });

    it('应该正确初始化Canvas', () => {
      const customPaint = new CustomPaint(painter, mockContext, size);
      
      // Canvas应该被正确创建
      expect(customPaint.size).toEqual(size);
    });
  });

  describe('属性访问', () => {
    it('应该能够获取和设置size', () => {
      const customPaint = new CustomPaint(painter, mockContext, size);
      
      expect(customPaint.size).toEqual(size);
      
      const newSize = { width: 400, height: 300 };
      customPaint.size = newSize;
      expect(customPaint.size).toEqual(newSize);
    });

    it('应该能够获取和设置customPainter', () => {
      const customPaint = new CustomPaint(painter, mockContext, size);
      
      expect(customPaint.customPainter).toBe(painter);
      
      const newPainter = new TestCustomPainter(Color.green, 80);
      customPaint.customPainter = newPainter;
      expect(customPaint.customPainter).toBe(newPainter);
    });
  });

  describe('绘制方法', () => {
    it('paint方法应该调用绘制器的paint方法', () => {
      const customPaint = new CustomPaint(painter, mockContext, size);
      const paintSpy = vi.spyOn(painter, 'paint');
      
      customPaint.paint();
      
      expect(paintSpy).toHaveBeenCalledWith(expect.any(Canvas), size);
    });

    it('repaint方法应该调用绘制器的paint方法', () => {
      const customPaint = new CustomPaint(painter, mockContext, size);
      const paintSpy = vi.spyOn(painter, 'paint');
      
      customPaint.repaint();
      
      expect(paintSpy).toHaveBeenCalledWith(expect.any(Canvas), size);
    });

    it('更换绘制器时应该自动重绘', () => {
      const customPaint = new CustomPaint(painter, mockContext, size);
      const newPainter = new TestCustomPainter(Color.yellow, 90);
      const paintSpy = vi.spyOn(newPainter, 'paint');
      
      customPaint.customPainter = newPainter;
      
      // 由于shouldRepaint返回true，应该自动重绘
      expect(paintSpy).toHaveBeenCalled();
    });

    it('相同绘制器时不应该重绘', () => {
      const customPaint = new CustomPaint(painter, mockContext, size);
      const samePainter = new TestCustomPainter(Color.blue, 60); // 相同参数
      const paintSpy = vi.spyOn(samePainter, 'paint');
      
      customPaint.customPainter = samePainter;
      
      // 由于shouldRepaint返回false，不应该重绘
      expect(paintSpy).not.toHaveBeenCalled();
    });
  });

  describe('交互处理', () => {
    it('handleTap应该调用绘制器的hitTest方法', () => {
      const customPaint = new CustomPaint(painter, mockContext, size);
      const hitTestSpy = vi.spyOn(painter, 'hitTest');
      const position = { dx: 150, dy: 100 };
      
      customPaint.handleTap(position);
      
      expect(hitTestSpy).toHaveBeenCalledWith(position, size);
    });

    it('handleTap应该返回hitTest的结果', () => {
      const customPaint = new CustomPaint(painter, mockContext, size);
      const position = { dx: 150, dy: 100 };
      
      // 模拟hitTest返回true
      vi.spyOn(painter, 'hitTest').mockReturnValue(true);
      expect(customPaint.handleTap(position)).toBe(true);
      
      // 模拟hitTest返回false
      vi.spyOn(painter, 'hitTest').mockReturnValue(false);
      expect(customPaint.handleTap(position)).toBe(false);
    });
  });
});

describe('PainterFactory', () => {
  let mockCanvasElement: HTMLCanvasElement;
  let mockContext: CanvasRenderingContext2D;
  let painter: TestCustomPainter;

  beforeEach(() => {
    mockContext = {
      save: vi.fn(),
      restore: vi.fn(),
      clearRect: vi.fn(),
      canvas: {} as HTMLCanvasElement
    } as any;

    mockCanvasElement = {
      width: 400,
      height: 300,
      getContext: vi.fn().mockReturnValue(mockContext)
    } as any;

    painter = new TestCustomPainter();
  });

  describe('fromCanvasElement方法', () => {
    it('应该能够从Canvas元素创建CustomPaint实例', () => {
      const customPaint = PainterFactory.fromCanvasElement(painter, mockCanvasElement);
      
      expect(customPaint).toBeInstanceOf(CustomPaint);
      expect(customPaint?.customPainter).toBe(painter);
      expect(customPaint?.size).toEqual({ width: 400, height: 300 });
    });

    it('应该正确调用getContext方法', () => {
      PainterFactory.fromCanvasElement(painter, mockCanvasElement);
      
      expect(mockCanvasElement.getContext).toHaveBeenCalledWith('2d');
    });

    it('当getContext返回null时应该返回null', () => {
      mockCanvasElement.getContext = vi.fn().mockReturnValue(null);
      
      const customPaint = PainterFactory.fromCanvasElement(painter, mockCanvasElement);
      
      expect(customPaint).toBeNull();
    });

    it('应该使用Canvas元素的尺寸', () => {
      mockCanvasElement.width = 500;
      mockCanvasElement.height = 400;
      
      const customPaint = PainterFactory.fromCanvasElement(painter, mockCanvasElement);
      
      expect(customPaint?.size).toEqual({ width: 500, height: 400 });
    });
  });
});

describe('AnimatedCustomPainter', () => {
  let mockCanvas: Canvas;
  let mockContext: CanvasRenderingContext2D;
  let size: Size;

  beforeEach(() => {
    mockContext = {
      save: vi.fn(),
      restore: vi.fn(),
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      strokeRect: vi.fn(),
      beginPath: vi.fn(),
      closePath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      clip: vi.fn(),
      translate: vi.fn(),
      scale: vi.fn(),
      rotate: vi.fn(),
      transform: vi.fn(),
      setTransform: vi.fn(),
      resetTransform: vi.fn(),
      createLinearGradient: vi.fn(),
      createRadialGradient: vi.fn(),
      createPattern: vi.fn(),
      measureText: vi.fn(() => ({ width: 100 })),
      fillText: vi.fn(),
      strokeText: vi.fn(),
      drawImage: vi.fn(),
      getImageData: vi.fn(),
      putImageData: vi.fn(),
      createImageData: vi.fn(),
      globalAlpha: 1,
      globalCompositeOperation: 'source-over',
      fillStyle: '#000000',
      strokeStyle: '#000000',
      lineWidth: 1,
      lineCap: 'butt',
      lineJoin: 'miter',
      miterLimit: 10,
      font: '10px sans-serif',
      textAlign: 'start',
      textBaseline: 'alphabetic',
      shadowColor: 'rgba(0, 0, 0, 0)',
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      canvas: {} as HTMLCanvasElement
    } as any;

    mockCanvas = new Canvas(mockContext, { width: 200, height: 200 });
    size = { width: 200, height: 200 };
  });

  describe('基本功能', () => {
    it('应该能够创建AnimatedCustomPainter实例', () => {
      const painter = new TestAnimatedPainter();
      expect(painter).toBeInstanceOf(AnimatedCustomPainter);
      expect(painter).toBeInstanceOf(CustomPainter);
    });

    it('初始动画值应该为0', () => {
      const painter = new TestAnimatedPainter();
      expect(painter.animationValue).toBe(0);
    });
  });

  describe('animationValue属性', () => {
    it('应该能够设置和获取动画值', () => {
      const painter = new TestAnimatedPainter();
      
      painter.animationValue = 0.5;
      expect(painter.animationValue).toBe(0.5);
      
      painter.animationValue = 1.0;
      expect(painter.animationValue).toBe(1.0);
    });

    it('应该将动画值限制在0-1范围内', () => {
      const painter = new TestAnimatedPainter();
      
      // 测试小于0的值
      painter.animationValue = -0.5;
      expect(painter.animationValue).toBe(0);
      
      // 测试大于1的值
      painter.animationValue = 1.5;
      expect(painter.animationValue).toBe(1);
      
      // 测试边界值
      painter.animationValue = 0;
      expect(painter.animationValue).toBe(0);
      
      painter.animationValue = 1;
      expect(painter.animationValue).toBe(1);
    });
  });

  describe('绘制方法', () => {
    it('paint方法应该调用paintAnimated', () => {
      const painter = new TestAnimatedPainter();
      const paintAnimatedSpy = vi.spyOn(painter, 'paintAnimated');
      
      painter.animationValue = 0.3;
      painter.paint(mockCanvas, size);
      
      expect(paintAnimatedSpy).toHaveBeenCalledWith(mockCanvas, size, 0.3);
    });

    it('paintAnimated应该根据动画值调整绘制', () => {
      const painter = new TestAnimatedPainter(40);
      
      // 测试动画值为0时
      painter.animationValue = 0;
      painter.paint(mockCanvas, size);
      
      // 验证绘制了基础半径的圆形
      expect(mockContext.arc).toHaveBeenCalledWith(
        100, 100, 40, 0, 2 * Math.PI, false
      );
      
      // 重置mock
      mockContext.arc = vi.fn();
      
      // 测试动画值为1时
      painter.animationValue = 1;
      painter.paint(mockCanvas, size);
      
      // 验证绘制了放大后的圆形 (40 * 1.5 = 60)
      expect(mockContext.arc).toHaveBeenCalledWith(
        100, 100, 60, 0, 2 * Math.PI, false
      );
    });
  });

  describe('shouldRepaint方法', () => {
    it('相同动画值时应该返回false', () => {
      const painter1 = new TestAnimatedPainter();
      const painter2 = new TestAnimatedPainter();
      
      painter1.animationValue = 0.5;
      painter2.animationValue = 0.5;
      
      expect(painter1.shouldRepaint(painter2)).toBe(false);
    });

    it('不同动画值时应该返回true', () => {
      const painter1 = new TestAnimatedPainter();
      const painter2 = new TestAnimatedPainter();
      
      painter1.animationValue = 0.5;
      painter2.animationValue = 0.7;
      
      expect(painter1.shouldRepaint(painter2)).toBe(true);
    });

    it('与非AnimatedCustomPainter比较时应该返回true', () => {
      const animatedPainter = new TestAnimatedPainter();
      const regularPainter = new TestCustomPainter();
      
      expect(animatedPainter.shouldRepaint(regularPainter)).toBe(true);
    });

    it('初始状态下相同实例应该返回false', () => {
      const painter1 = new TestAnimatedPainter();
      const painter2 = new TestAnimatedPainter();
      
      // 两者都是初始值0
      expect(painter1.shouldRepaint(painter2)).toBe(false);
    });
  });

  describe('动画场景测试', () => {
    it('应该支持连续的动画值变化', () => {
      const painter = new TestAnimatedPainter(50);
      const paintAnimatedSpy = vi.spyOn(painter, 'paintAnimated');
      
      // 模拟动画序列
      const animationValues = [0, 0.25, 0.5, 0.75, 1.0];
      
      animationValues.forEach(value => {
        painter.animationValue = value;
        painter.paint(mockCanvas, size);
      });
      
      // 验证每个动画值都被正确传递
      animationValues.forEach((value, index) => {
        expect(paintAnimatedSpy).toHaveBeenNthCalledWith(
          index + 1,
          mockCanvas,
          size,
          value
        );
      });
    });

    it('应该支持动画循环', () => {
      const painter = new TestAnimatedPainter();
      
      // 模拟正弦波动画
      for (let i = 0; i <= 10; i++) {
        const t = i / 10;
        const animationValue = (Math.sin(t * Math.PI * 2) + 1) / 2;
        painter.animationValue = animationValue;
        
        expect(painter.animationValue).toBeGreaterThanOrEqual(0);
        expect(painter.animationValue).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('边界条件', () => {
    it('应该处理极值动画值', () => {
      const painter = new TestAnimatedPainter();
      
      // 测试极小值
      painter.animationValue = Number.MIN_VALUE;
      expect(painter.animationValue).toBe(Number.MIN_VALUE);
      
      // 测试接近1的值
      painter.animationValue = 0.9999999;
      expect(painter.animationValue).toBe(0.9999999);
      
      // 测试NaN（应该被限制）
      painter.animationValue = NaN;
      expect(painter.animationValue).toBe(0); // NaN被Math.max(0, ...)处理为0
    });

    it('应该处理无穷大值', () => {
      const painter = new TestAnimatedPainter();
      
      painter.animationValue = Infinity;
      expect(painter.animationValue).toBe(1);
      
      painter.animationValue = -Infinity;
      expect(painter.animationValue).toBe(0);
    });
  });
});

describe('集成测试', () => {
  let mockCanvasElement: HTMLCanvasElement;
  let mockContext: CanvasRenderingContext2D;

  beforeEach(() => {
    mockContext = {
      save: vi.fn(),
      restore: vi.fn(),
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      strokeRect: vi.fn(),
      beginPath: vi.fn(),
      closePath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      clip: vi.fn(),
      translate: vi.fn(),
      scale: vi.fn(),
      rotate: vi.fn(),
      transform: vi.fn(),
      setTransform: vi.fn(),
      resetTransform: vi.fn(),
      createLinearGradient: vi.fn(),
      createRadialGradient: vi.fn(),
      createPattern: vi.fn(),
      measureText: vi.fn(() => ({ width: 100 })),
      fillText: vi.fn(),
      strokeText: vi.fn(),
      drawImage: vi.fn(),
      getImageData: vi.fn(),
      putImageData: vi.fn(),
      createImageData: vi.fn(),
      globalAlpha: 1,
      globalCompositeOperation: 'source-over',
      fillStyle: '#000000',
      strokeStyle: '#000000',
      lineWidth: 1,
      lineCap: 'butt',
      lineJoin: 'miter',
      miterLimit: 10,
      font: '10px sans-serif',
      textAlign: 'start',
      textBaseline: 'alphabetic',
      shadowColor: 'rgba(0, 0, 0, 0)',
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      canvas: {} as HTMLCanvasElement
    } as any;

    mockCanvasElement = {
      width: 300,
      height: 200,
      getContext: vi.fn().mockReturnValue(mockContext)
    } as any;
  });

  it('完整的绘制流程应该正常工作', () => {
    const painter = new TestCustomPainter(Color.purple, 80);
    const customPaint = PainterFactory.fromCanvasElement(painter, mockCanvasElement);
    
    expect(customPaint).not.toBeNull();
    
    if (customPaint) {
      // 执行绘制
      customPaint.paint();
      
      // 验证绘制操作
      expect(mockContext.beginPath).toHaveBeenCalled();
      expect(mockContext.arc).toHaveBeenCalledWith(150, 100, 80, 0, 2 * Math.PI, false);
      expect(mockContext.fill).toHaveBeenCalled();
    }
  });

  it('动画绘制流程应该正常工作', () => {
    const animatedPainter = new TestAnimatedPainter(60);
    const customPaint = PainterFactory.fromCanvasElement(animatedPainter, mockCanvasElement);
    
    expect(customPaint).not.toBeNull();
    
    if (customPaint) {
      // 设置动画值并绘制
      animatedPainter.animationValue = 0.5;
      customPaint.paint();
      
      // 验证动画绘制 (60 * 1.25 = 75)
      expect(mockContext.arc).toHaveBeenCalledWith(150, 100, 75, 0, 2 * Math.PI, false);
    }
  });

  it('绘制器切换应该正常工作', () => {
    const painter1 = new TestCustomPainter(Color.red, 50);
    const painter2 = new TestCustomPainter(Color.blue, 70);
    
    const customPaint = PainterFactory.fromCanvasElement(painter1, mockCanvasElement);
    
    if (customPaint) {
      // 初始绘制
      customPaint.paint();
      expect(mockContext.arc).toHaveBeenCalledWith(150, 100, 50, 0, 2 * Math.PI, false);
      
      // 重置mock
      mockContext.arc = vi.fn();
      
      // 切换绘制器（应该自动重绘）
      customPaint.customPainter = painter2;
      expect(mockContext.arc).toHaveBeenCalledWith(150, 100, 70, 0, 2 * Math.PI, false);
    }
  });

  it('尺寸变化应该正常工作', () => {
    const painter = new TestCustomPainter(Color.green, 40);
    const customPaint = PainterFactory.fromCanvasElement(painter, mockCanvasElement);
    
    if (customPaint) {
      // 初始绘制
      customPaint.paint();
      expect(mockContext.arc).toHaveBeenCalledWith(150, 100, 40, 0, 2 * Math.PI, false);
      
      // 重置mock
      mockContext.arc = vi.fn();
      
      // 改变尺寸
      customPaint.size = { width: 400, height: 300 };
      customPaint.repaint();
      
      // 验证新的中心点
      expect(mockContext.arc).toHaveBeenCalledWith(200, 150, 40, 0, 2 * Math.PI, false);
    }
  });
});