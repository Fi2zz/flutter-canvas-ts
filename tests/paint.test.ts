/**
 * Paint 类测试用例
 * 测试绘制样式的创建、配置、应用等功能
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Paint } from '../src/paint';
import { Color } from '../src/color';
import { PaintingStyle, StrokeCap, StrokeJoin, BlendMode } from '../src/types';

describe('Paint', () => {
  let paint: Paint;
  let mockContext: CanvasRenderingContext2D;

  beforeEach(() => {
    paint = new Paint();
    
    // 创建模拟的 Canvas 2D 上下文
    mockContext = {
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 0,
      lineCap: 'butt',
      lineJoin: 'miter',
      miterLimit: 4,
      globalCompositeOperation: 'source-over',
      imageSmoothingEnabled: true,
    } as any;
  });

  describe('构造函数和默认值', () => {
    it('应该创建具有默认值的Paint实例', () => {
      const paint = new Paint();
      
      expect(paint.color.value).toBe(Color.black.value);
      expect(paint.style).toBe(PaintingStyle.fill);
      expect(paint.strokeWidth).toBe(0.0);
      expect(paint.strokeCap).toBe(StrokeCap.butt);
      expect(paint.strokeJoin).toBe(StrokeJoin.miter);
      expect(paint.strokeMiterLimit).toBe(4.0);
      expect(paint.blendMode).toBe(BlendMode.srcOver);
      expect(paint.isAntiAlias).toBe(true);
    });
  });

  describe('颜色属性', () => {
    it('应该正确设置和获取颜色', () => {
      const redColor = Color.red;
      paint.color = redColor;
      
      expect(paint.color.value).toBe(redColor.value);
      expect(paint.color.red).toBe(255);
      expect(paint.color.green).toBe(0);
      expect(paint.color.blue).toBe(0);
    });

    it('应该支持透明颜色', () => {
      const transparentColor = Color.red.withOpacity(0.5);
      paint.color = transparentColor;
      
      expect(paint.color.opacity).toBeCloseTo(0.5, 2);
      expect(paint.color.alpha).toBe(128);
    });

    it('应该支持预定义颜色常量', () => {
      paint.color = Color.blue;
      expect(paint.color.value).toBe(Color.blue.value);
      
      paint.color = Color.green;
      expect(paint.color.value).toBe(Color.green.value);
      
      paint.color = Color.transparent;
      expect(paint.color.value).toBe(Color.transparent.value);
    });
  });

  describe('绘制样式', () => {
    it('应该正确设置填充样式', () => {
      paint.style = PaintingStyle.fill;
      expect(paint.style).toBe(PaintingStyle.fill);
    });

    it('应该正确设置描边样式', () => {
      paint.style = PaintingStyle.stroke;
      expect(paint.style).toBe(PaintingStyle.stroke);
    });
  });

  describe('描边属性', () => {
    describe('strokeWidth', () => {
      it('应该正确设置描边宽度', () => {
        paint.strokeWidth = 5.0;
        expect(paint.strokeWidth).toBe(5.0);
      });

      it('应该处理负值（设为0）', () => {
        paint.strokeWidth = -1.0;
        expect(paint.strokeWidth).toBe(0.0);
      });

      it('应该处理小数值', () => {
        paint.strokeWidth = 2.5;
        expect(paint.strokeWidth).toBe(2.5);
      });

      it('应该处理极大值', () => {
        paint.strokeWidth = 1000.0;
        expect(paint.strokeWidth).toBe(1000.0);
      });
    });

    describe('strokeCap', () => {
      it('应该支持所有端点样式', () => {
        paint.strokeCap = StrokeCap.butt;
        expect(paint.strokeCap).toBe(StrokeCap.butt);

        paint.strokeCap = StrokeCap.round;
        expect(paint.strokeCap).toBe(StrokeCap.round);

        paint.strokeCap = StrokeCap.square;
        expect(paint.strokeCap).toBe(StrokeCap.square);
      });
    });

    describe('strokeJoin', () => {
      it('应该支持所有连接样式', () => {
        paint.strokeJoin = StrokeJoin.miter;
        expect(paint.strokeJoin).toBe(StrokeJoin.miter);

        paint.strokeJoin = StrokeJoin.round;
        expect(paint.strokeJoin).toBe(StrokeJoin.round);

        paint.strokeJoin = StrokeJoin.bevel;
        expect(paint.strokeJoin).toBe(StrokeJoin.bevel);
      });
    });

    describe('strokeMiterLimit', () => {
      it('应该正确设置斜接限制', () => {
        paint.strokeMiterLimit = 10.0;
        expect(paint.strokeMiterLimit).toBe(10.0);
      });

      it('应该处理小于1的值（设为1）', () => {
        paint.strokeMiterLimit = 0.5;
        expect(paint.strokeMiterLimit).toBe(1.0);
      });

      it('应该处理负值（设为1）', () => {
        paint.strokeMiterLimit = -2.0;
        expect(paint.strokeMiterLimit).toBe(1.0);
      });
    });
  });

  describe('混合模式', () => {
    it('应该支持常用混合模式', () => {
      paint.blendMode = BlendMode.multiply;
      expect(paint.blendMode).toBe(BlendMode.multiply);

      paint.blendMode = BlendMode.screen;
      expect(paint.blendMode).toBe(BlendMode.screen);

      paint.blendMode = BlendMode.overlay;
      expect(paint.blendMode).toBe(BlendMode.overlay);

      paint.blendMode = BlendMode.srcOver;
      expect(paint.blendMode).toBe(BlendMode.srcOver);
    });
  });

  describe('抗锯齿', () => {
    it('应该正确设置抗锯齿开关', () => {
      paint.isAntiAlias = false;
      expect(paint.isAntiAlias).toBe(false);

      paint.isAntiAlias = true;
      expect(paint.isAntiAlias).toBe(true);
    });
  });

  describe('应用到上下文', () => {
    it('应该正确应用填充样式到上下文', () => {
      paint.color = Color.red;
      paint.style = PaintingStyle.fill;
      paint.isAntiAlias = false;
      
      paint.applyToContext(mockContext);
      
      expect(mockContext.fillStyle).toBe('rgba(255, 0, 0, 1)');
      expect(mockContext.imageSmoothingEnabled).toBe(false);
    });

    it('应该正确应用描边样式到上下文', () => {
      paint.color = Color.blue;
      paint.style = PaintingStyle.stroke;
      paint.strokeWidth = 3.0;
      paint.strokeCap = StrokeCap.round;
      paint.strokeJoin = StrokeJoin.round;
      paint.strokeMiterLimit = 8.0;
      
      paint.applyToContext(mockContext);
      
      expect(mockContext.strokeStyle).toBe('rgba(0, 0, 255, 1)');
      expect(mockContext.lineWidth).toBe(3.0);
      expect(mockContext.lineCap).toBe('round');
      expect(mockContext.lineJoin).toBe('round');
      expect(mockContext.miterLimit).toBe(8.0);
    });

    it('应该正确应用混合模式到上下文', () => {
      paint.blendMode = BlendMode.multiply;
      
      paint.applyToContext(mockContext);
      
      expect(mockContext.globalCompositeOperation).toBe('multiply');
    });

    it('应该正确应用透明颜色到上下文', () => {
      paint.color = Color.red.withOpacity(0.5);
      paint.style = PaintingStyle.fill;
      
      paint.applyToContext(mockContext);
      
      expect(mockContext.fillStyle).toBe('rgba(255, 0, 0, 0.5)');
    });
  });

  describe('克隆功能', () => {
    it('应该创建完全独立的副本', () => {
      paint.color = Color.red;
      paint.style = PaintingStyle.stroke;
      paint.strokeWidth = 5.0;
      paint.strokeCap = StrokeCap.round;
      paint.strokeJoin = StrokeJoin.round;
      paint.strokeMiterLimit = 8.0;
      paint.blendMode = BlendMode.multiply;
      paint.isAntiAlias = false;
      
      const cloned = paint.clone();
      
      expect(cloned).not.toBe(paint);
      expect(cloned.color.value).toBe(paint.color.value);
      expect(cloned.style).toBe(paint.style);
      expect(cloned.strokeWidth).toBe(paint.strokeWidth);
      expect(cloned.strokeCap).toBe(paint.strokeCap);
      expect(cloned.strokeJoin).toBe(paint.strokeJoin);
      expect(cloned.strokeMiterLimit).toBe(paint.strokeMiterLimit);
      expect(cloned.blendMode).toBe(paint.blendMode);
      expect(cloned.isAntiAlias).toBe(paint.isAntiAlias);
    });

    it('应该创建独立的颜色对象', () => {
      paint.color = Color.red;
      const cloned = paint.clone();
      
      // 修改原始对象的颜色不应影响克隆对象
      paint.color = Color.blue;
      
      expect(cloned.color.value).toBe(Color.red.value);
      expect(paint.color.value).toBe(Color.blue.value);
    });
  });

  describe('重置功能', () => {
    it('应该重置所有属性到默认值', () => {
      // 修改所有属性
      paint.color = Color.red;
      paint.style = PaintingStyle.stroke;
      paint.strokeWidth = 5.0;
      paint.strokeCap = StrokeCap.round;
      paint.strokeJoin = StrokeJoin.round;
      paint.strokeMiterLimit = 8.0;
      paint.blendMode = BlendMode.multiply;
      paint.isAntiAlias = false;
      
      // 重置
      paint.reset();
      
      // 验证所有属性都回到默认值
      expect(paint.color.value).toBe(Color.black.value);
      expect(paint.style).toBe(PaintingStyle.fill);
      expect(paint.strokeWidth).toBe(0.0);
      expect(paint.strokeCap).toBe(StrokeCap.butt);
      expect(paint.strokeJoin).toBe(StrokeJoin.miter);
      expect(paint.strokeMiterLimit).toBe(4.0);
      expect(paint.blendMode).toBe(BlendMode.srcOver);
      expect(paint.isAntiAlias).toBe(true);
    });
  });

  describe('边界条件和错误处理', () => {
    it('应该处理NaN值', () => {
      paint.strokeWidth = NaN;
      expect(paint.strokeWidth).toBe(0.0);
      
      paint.strokeMiterLimit = NaN;
      expect(paint.strokeMiterLimit).toBe(1.0);
    });

    it('应该处理无穷大值', () => {
      paint.strokeWidth = Infinity;
      expect(paint.strokeWidth).toBe(0.0);
      
      paint.strokeMiterLimit = Infinity;
      expect(paint.strokeMiterLimit).toBe(1.0);
    });

    it('应该处理极小值', () => {
      paint.strokeWidth = Number.MIN_VALUE;
      expect(paint.strokeWidth).toBe(Number.MIN_VALUE);
      
      paint.strokeMiterLimit = Number.MIN_VALUE;
      expect(paint.strokeMiterLimit).toBe(1.0);
    });
  });

  describe('性能测试', () => {
    it('应该高效处理大量属性设置', () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        paint.color = Color.fromRGBO(i % 256, (i * 2) % 256, (i * 3) % 256, 1);
        paint.strokeWidth = i % 10;
        paint.style = i % 2 === 0 ? PaintingStyle.fill : PaintingStyle.stroke;
        paint.strokeCap = [StrokeCap.butt, StrokeCap.round, StrokeCap.square][i % 3];
        paint.strokeJoin = [StrokeJoin.miter, StrokeJoin.round, StrokeJoin.bevel][i % 3];
      }
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(50); // 应该在50ms内完成
    });

    it('应该高效处理大量上下文应用', () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 100; i++) {
        paint.color = Color.fromRGBO(i % 256, (i * 2) % 256, (i * 3) % 256, 1);
        paint.applyToContext(mockContext);
      }
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(20); // 应该在20ms内完成
    });

    it('应该高效处理大量克隆操作', () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 100; i++) {
        const cloned = paint.clone();
        cloned.color = Color.fromRGBO(i % 256, (i * 2) % 256, (i * 3) % 256, 1);
      }
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(20); // 应该在20ms内完成
    });
  });
});