/**
 * Canvas 类测试用例
 * 测试画布绘制、变换、裁剪等功能
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Canvas } from '../src/canvas';
import { Paint } from '../src/paint';
import { Color } from '../src/color';
import { Path } from '../src/path';
import { PaintingStyle, PathFillType } from '../src/types';

describe('Canvas', () => {
  let canvas: Canvas;
  let mockContext: CanvasRenderingContext2D;
  let paint: Paint;

  beforeEach(() => {
    // 创建模拟的Canvas 2D上下文
    mockContext = {
      save: vi.fn(),
      restore: vi.fn(),
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      strokeRect: vi.fn(),
      translate: vi.fn(),
      scale: vi.fn(),
      rotate: vi.fn(),
      transform: vi.fn(),
      setTransform: vi.fn(),
      resetTransform: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      arc: vi.fn(),
      ellipse: vi.fn(),
      roundRect: vi.fn(),
      rect: vi.fn(),
      closePath: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      clip: vi.fn(),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      lineCap: 'butt',
      lineJoin: 'miter',
      miterLimit: 10,
      globalCompositeOperation: 'source-over',
      imageSmoothingEnabled: true,
    } as any;

    canvas = new Canvas(mockContext, { width: 800, height: 600 });
    
    paint = new Paint();
    paint.color = Color.black;
    paint.style = PaintingStyle.fill;
  });

  describe('构造函数和基本属性', () => {
    it('应该正确创建Canvas实例', () => {
      expect(canvas).toBeInstanceOf(Canvas);
      expect(canvas.size).toEqual({ width: 800, height: 600 });
    });

    it('应该返回画布尺寸的副本', () => {
      const size1 = canvas.size;
      const size2 = canvas.size;
      
      expect(size1).toEqual(size2);
      expect(size1).not.toBe(size2); // 应该是不同的对象
      
      // 修改返回的尺寸不应影响原始尺寸
      size1.width = 1000;
      expect(canvas.size.width).toBe(800);
    });

    it('应该正确获取底层上下文', () => {
      expect(canvas.getContext()).toBe(mockContext);
    });
  });

  describe('状态管理', () => {
    describe('save和restore', () => {
      it('应该保存绘制状态', () => {
        canvas.save();
        expect(mockContext.save).toHaveBeenCalledTimes(1);
      });

      it('应该恢复绘制状态', () => {
        canvas.restore();
        expect(mockContext.restore).toHaveBeenCalledTimes(1);
      });

      it('应该支持嵌套保存和恢复', () => {
        canvas.save();
        canvas.save();
        canvas.restore();
        canvas.restore();
        
        expect(mockContext.save).toHaveBeenCalledTimes(2);
        expect(mockContext.restore).toHaveBeenCalledTimes(2);
      });
    });

    describe('clear', () => {
      it('应该清空画布', () => {
        canvas.clear();
        expect(mockContext.clearRect).toHaveBeenCalledWith(0, 0, 800, 600);
      });

      it('应该用指定颜色填充画布', () => {
        const color = Color.fromARGB(255, 240, 240, 240);
        canvas.clear(color);
        
        expect(mockContext.fillStyle).toBe(color.toCssString());
        expect(mockContext.fillRect).toHaveBeenCalledWith(0, 0, 800, 600);
      });

      it('应该用半透明颜色填充画布', () => {
        const color = Color.fromARGB(128, 255, 0, 0);
        canvas.clear(color);
        
        expect(mockContext.fillStyle).toBe(color.toCssString());
        expect(mockContext.fillRect).toHaveBeenCalledWith(0, 0, 800, 600);
      });
    });
  });

  describe('坐标变换', () => {
    describe('translate', () => {
      it('应该平移坐标系', () => {
        canvas.translate(100, 50);
        expect(mockContext.translate).toHaveBeenCalledWith(100, 50);
      });

      it('应该支持负值平移', () => {
        canvas.translate(-50, -25);
        expect(mockContext.translate).toHaveBeenCalledWith(-50, -25);
      });

      it('应该支持零值平移', () => {
        canvas.translate(0, 0);
        expect(mockContext.translate).toHaveBeenCalledWith(0, 0);
      });
    });

    describe('scale', () => {
      it('应该等比例缩放', () => {
        canvas.scale(2);
        expect(mockContext.scale).toHaveBeenCalledWith(2, 2);
      });

      it('应该非等比例缩放', () => {
        canvas.scale(2, 1.5);
        expect(mockContext.scale).toHaveBeenCalledWith(2, 1.5);
      });

      it('应该支持翻转', () => {
        canvas.scale(-1, 1); // 水平翻转
        expect(mockContext.scale).toHaveBeenCalledWith(-1, 1);
        
        canvas.scale(1, -1); // 垂直翻转
        expect(mockContext.scale).toHaveBeenCalledWith(1, -1);
      });

      it('应该支持小数缩放', () => {
        canvas.scale(0.5, 0.8);
        expect(mockContext.scale).toHaveBeenCalledWith(0.5, 0.8);
      });
    });

    describe('rotate', () => {
      it('应该旋转坐标系', () => {
        const angle = Math.PI / 4; // 45度
        canvas.rotate(angle);
        expect(mockContext.rotate).toHaveBeenCalledWith(angle);
      });

      it('应该支持负角度旋转', () => {
        const angle = -Math.PI / 2; // -90度
        canvas.rotate(angle);
        expect(mockContext.rotate).toHaveBeenCalledWith(angle);
      });

      it('应该支持大角度旋转', () => {
        const angle = 2 * Math.PI; // 360度
        canvas.rotate(angle);
        expect(mockContext.rotate).toHaveBeenCalledWith(angle);
      });
    });

    describe('transform', () => {
      it('应该应用变换矩阵', () => {
        canvas.transform(1, 0, 0, 1, 100, 50);
        expect(mockContext.transform).toHaveBeenCalledWith(1, 0, 0, 1, 100, 50);
      });

      it('应该应用复杂变换矩阵', () => {
        const cos = Math.cos(Math.PI / 4);
        const sin = Math.sin(Math.PI / 4);
        canvas.transform(cos, sin, -sin, cos, 0, 0);
        expect(mockContext.transform).toHaveBeenCalledWith(cos, sin, -sin, cos, 0, 0);
      });
    });

    describe('setTransform', () => {
      it('应该设置变换矩阵', () => {
        canvas.setTransform(2, 0, 0, 2, 100, 100);
        expect(mockContext.setTransform).toHaveBeenCalledWith(2, 0, 0, 2, 100, 100);
      });

      it('应该设置单位矩阵', () => {
        canvas.setTransform(1, 0, 0, 1, 0, 0);
        expect(mockContext.setTransform).toHaveBeenCalledWith(1, 0, 0, 1, 0, 0);
      });
    });

    describe('resetTransform', () => {
      it('应该重置变换矩阵', () => {
        canvas.resetTransform();
        expect(mockContext.resetTransform).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('基本图形绘制', () => {
    describe('drawPoint', () => {
      it('应该绘制点', () => {
        const point = { dx: 100, dy: 100 };
        paint.strokeWidth = 4;
        
        canvas.drawPoint(point, paint);
        
        expect(mockContext.beginPath).toHaveBeenCalled();
        expect(mockContext.arc).toHaveBeenCalledWith(100, 100, 2, 0, 2 * Math.PI);
        expect(mockContext.fill).toHaveBeenCalled();
      });

      it('应该根据strokeWidth调整点的大小', () => {
        const point = { dx: 50, dy: 50 };
        paint.strokeWidth = 10;
        
        canvas.drawPoint(point, paint);
        
        expect(mockContext.arc).toHaveBeenCalledWith(50, 50, 5, 0, 2 * Math.PI);
      });
    });

    describe('drawPoints', () => {
      it('应该绘制多个点', () => {
        const points = [
          { dx: 10, dy: 10 },
          { dx: 20, dy: 20 },
          { dx: 30, dy: 30 }
        ];
        
        canvas.drawPoints(points, paint);
        
        expect(mockContext.beginPath).toHaveBeenCalledTimes(3);
        expect(mockContext.arc).toHaveBeenCalledTimes(3);
        expect(mockContext.fill).toHaveBeenCalledTimes(3);
      });

      it('应该处理空点数组', () => {
        canvas.drawPoints([], paint);
        
        expect(mockContext.beginPath).not.toHaveBeenCalled();
        expect(mockContext.arc).not.toHaveBeenCalled();
      });
    });

    describe('drawLine', () => {
      it('应该绘制直线', () => {
        const p1 = { dx: 10, dy: 10 };
        const p2 = { dx: 100, dy: 100 };
        
        canvas.drawLine(p1, p2, paint);
        
        expect(mockContext.beginPath).toHaveBeenCalled();
        expect(mockContext.moveTo).toHaveBeenCalledWith(10, 10);
        expect(mockContext.lineTo).toHaveBeenCalledWith(100, 100);
        expect(mockContext.stroke).toHaveBeenCalled();
      });

      it('应该绘制水平线', () => {
        const p1 = { dx: 0, dy: 50 };
        const p2 = { dx: 100, dy: 50 };
        
        canvas.drawLine(p1, p2, paint);
        
        expect(mockContext.moveTo).toHaveBeenCalledWith(0, 50);
        expect(mockContext.lineTo).toHaveBeenCalledWith(100, 50);
      });

      it('应该绘制垂直线', () => {
        const p1 = { dx: 50, dy: 0 };
        const p2 = { dx: 50, dy: 100 };
        
        canvas.drawLine(p1, p2, paint);
        
        expect(mockContext.moveTo).toHaveBeenCalledWith(50, 0);
        expect(mockContext.lineTo).toHaveBeenCalledWith(50, 100);
      });
    });

    describe('drawRect', () => {
      it('应该绘制填充矩形', () => {
        const rect = { left: 10, top: 20, right: 110, bottom: 70 };
        paint.style = PaintingStyle.fill;
        
        canvas.drawRect(rect, paint);
        
        expect(mockContext.fillRect).toHaveBeenCalledWith(10, 20, 100, 50);
      });

      it('应该绘制描边矩形', () => {
        const rect = { left: 10, top: 20, right: 110, bottom: 70 };
        paint.style = PaintingStyle.stroke;
        
        canvas.drawRect(rect, paint);
        
        expect(mockContext.strokeRect).toHaveBeenCalledWith(10, 20, 100, 50);
      });

      it('应该处理零尺寸矩形', () => {
        const rect = { left: 50, top: 50, right: 50, bottom: 50 };
        
        canvas.drawRect(rect, paint);
        
        expect(mockContext.fillRect).toHaveBeenCalledWith(50, 50, 0, 0);
      });

      it('应该处理负尺寸矩形', () => {
        const rect = { left: 100, top: 100, right: 50, bottom: 50 };
        
        canvas.drawRect(rect, paint);
        
        expect(mockContext.fillRect).toHaveBeenCalledWith(100, 100, -50, -50);
      });
    });

    describe('drawRRect', () => {
      it('应该绘制圆角矩形', () => {
        const rrect = {
          rect: { left: 10, top: 10, right: 110, bottom: 60 },
          tlRadiusX: 5, tlRadiusY: 5,
          trRadiusX: 5, trRadiusY: 5,
          brRadiusX: 5, brRadiusY: 5,
          blRadiusX: 5, blRadiusY: 5
        };
        
        canvas.drawRRect(rrect, paint);
        
        expect(mockContext.beginPath).toHaveBeenCalled();
        expect(mockContext.roundRect).toHaveBeenCalledWith(10, 10, 100, 50, 5);
        expect(mockContext.fill).toHaveBeenCalled();
      });

      it('应该绘制描边圆角矩形', () => {
        const rrect = {
          rect: { left: 0, top: 0, right: 100, bottom: 100 },
          tlRadiusX: 10, tlRadiusY: 8,
          trRadiusX: 10, trRadiusY: 8,
          brRadiusX: 10, brRadiusY: 8,
          blRadiusX: 10, blRadiusY: 8
        };
        paint.style = PaintingStyle.stroke;
        
        canvas.drawRRect(rrect, paint);
        
        expect(mockContext.roundRect).toHaveBeenCalledWith(0, 0, 100, 100, 8); // 取较小值
        expect(mockContext.stroke).toHaveBeenCalled();
      });
    });

    describe('drawCircle', () => {
      it('应该绘制填充圆形', () => {
        const center = { dx: 100, dy: 100 };
        const radius = 50;
        
        canvas.drawCircle(center, radius, paint);
        
        expect(mockContext.beginPath).toHaveBeenCalled();
        expect(mockContext.arc).toHaveBeenCalledWith(100, 100, 50, 0, 2 * Math.PI);
        expect(mockContext.fill).toHaveBeenCalled();
      });

      it('应该绘制描边圆形', () => {
        const center = { dx: 200, dy: 150 };
        const radius = 30;
        paint.style = PaintingStyle.stroke;
        
        canvas.drawCircle(center, radius, paint);
        
        expect(mockContext.arc).toHaveBeenCalledWith(200, 150, 30, 0, 2 * Math.PI);
        expect(mockContext.stroke).toHaveBeenCalled();
      });

      it('应该处理零半径圆形', () => {
        const center = { dx: 50, dy: 50 };
        
        canvas.drawCircle(center, 0, paint);
        
        expect(mockContext.arc).toHaveBeenCalledWith(50, 50, 0, 0, 2 * Math.PI);
      });

      it('应该处理负半径圆形', () => {
        const center = { dx: 50, dy: 50 };
        
        canvas.drawCircle(center, -10, paint);
        
        expect(mockContext.arc).toHaveBeenCalledWith(50, 50, -10, 0, 2 * Math.PI);
      });
    });

    describe('drawOval', () => {
      it('应该绘制椭圆', () => {
        const rect = { left: 50, top: 25, right: 150, bottom: 75 };
        
        canvas.drawOval(rect, paint);
        
        expect(mockContext.beginPath).toHaveBeenCalled();
        expect(mockContext.ellipse).toHaveBeenCalledWith(100, 50, 50, 25, 0, 0, 2 * Math.PI);
        expect(mockContext.fill).toHaveBeenCalled();
      });

      it('应该绘制描边椭圆', () => {
        const rect = { left: 0, top: 0, right: 200, bottom: 100 };
        paint.style = PaintingStyle.stroke;
        
        canvas.drawOval(rect, paint);
        
        expect(mockContext.ellipse).toHaveBeenCalledWith(100, 50, 100, 50, 0, 0, 2 * Math.PI);
        expect(mockContext.stroke).toHaveBeenCalled();
      });

      it('应该处理正方形椭圆（圆形）', () => {
        const rect = { left: 0, top: 0, right: 100, bottom: 100 };
        
        canvas.drawOval(rect, paint);
        
        expect(mockContext.ellipse).toHaveBeenCalledWith(50, 50, 50, 50, 0, 0, 2 * Math.PI);
      });
    });

    describe('drawArc', () => {
      it('应该绘制扇形', () => {
        const rect = { left: 50, top: 50, right: 150, bottom: 150 };
        const startAngle = 0;
        const sweepAngle = Math.PI / 2;
        
        canvas.drawArc(rect, startAngle, sweepAngle, true, paint);
        
        expect(mockContext.beginPath).toHaveBeenCalled();
        expect(mockContext.moveTo).toHaveBeenCalledWith(100, 100); // 中心点
        expect(mockContext.arc).toHaveBeenCalledWith(100, 100, 50, 0, Math.PI / 2);
        expect(mockContext.closePath).toHaveBeenCalled();
        expect(mockContext.fill).toHaveBeenCalled();
      });

      it('应该绘制弧线', () => {
        const rect = { left: 0, top: 0, right: 100, bottom: 100 };
        const startAngle = Math.PI;
        const sweepAngle = Math.PI / 2;
        paint.style = PaintingStyle.stroke;
        
        canvas.drawArc(rect, startAngle, sweepAngle, false, paint);
        
        expect(mockContext.moveTo).not.toHaveBeenCalled(); // 不连接中心
        expect(mockContext.arc).toHaveBeenCalledWith(50, 50, 50, Math.PI, Math.PI + Math.PI / 2);
        expect(mockContext.closePath).not.toHaveBeenCalled();
        expect(mockContext.stroke).toHaveBeenCalled();
      });

      it('应该处理完整圆弧', () => {
        const rect = { left: 0, top: 0, right: 100, bottom: 100 };
        
        canvas.drawArc(rect, 0, 2 * Math.PI, true, paint);
        
        expect(mockContext.arc).toHaveBeenCalledWith(50, 50, 50, 0, 2 * Math.PI);
      });
    });
  });

  describe('裁剪操作', () => {
    describe('clipRect', () => {
      it('应该设置矩形裁剪区域', () => {
        const rect = { left: 50, top: 50, right: 150, bottom: 150 };
        
        canvas.clipRect(rect);
        
        expect(mockContext.beginPath).toHaveBeenCalled();
        expect(mockContext.rect).toHaveBeenCalledWith(50, 50, 100, 100);
        expect(mockContext.clip).toHaveBeenCalled();
      });

      it('应该处理零尺寸裁剪区域', () => {
        const rect = { left: 100, top: 100, right: 100, bottom: 100 };
        
        canvas.clipRect(rect);
        
        expect(mockContext.rect).toHaveBeenCalledWith(100, 100, 0, 0);
      });
    });

    describe('clipRRect', () => {
      it('应该设置圆角矩形裁剪区域', () => {
        const rrect = {
          rect: { left: 25, top: 25, right: 175, bottom: 125 },
          tlRadiusX: 15, tlRadiusY: 15,
          trRadiusX: 15, trRadiusY: 15,
          brRadiusX: 15, brRadiusY: 15,
          blRadiusX: 15, blRadiusY: 15
        };
        
        canvas.clipRRect(rrect);
        
        expect(mockContext.beginPath).toHaveBeenCalled();
        expect(mockContext.roundRect).toHaveBeenCalledWith(25, 25, 150, 100, 15);
        expect(mockContext.clip).toHaveBeenCalled();
      });
    });
  });

  describe('路径绘制', () => {
    let path: Path;

    beforeEach(() => {
      path = new Path();
      path.applyToContext = vi.fn();
      path.fillType = PathFillType.nonZero;
    });

    describe('drawPath', () => {
      it('应该绘制填充路径', () => {
        paint.style = PaintingStyle.fill;
        
        canvas.drawPath(path, paint);
        
        expect(path.applyToContext).toHaveBeenCalledWith(mockContext);
        expect(mockContext.fill).toHaveBeenCalledWith(PathFillType.nonZero);
      });

      it('应该绘制描边路径', () => {
        paint.style = PaintingStyle.stroke;
        
        canvas.drawPath(path, paint);
        
        expect(path.applyToContext).toHaveBeenCalledWith(mockContext);
        expect(mockContext.stroke).toHaveBeenCalled();
      });

      it('应该支持evenOdd填充规则', () => {
        path.fillType = PathFillType.evenOdd;
        paint.style = PaintingStyle.fill;
        
        canvas.drawPath(path, paint);
        
        expect(mockContext.fill).toHaveBeenCalledWith(PathFillType.evenOdd);
      });
    });

    describe('clipPath', () => {
      it('应该设置路径裁剪区域', () => {
        canvas.clipPath(path);
        
        expect(path.applyToContext).toHaveBeenCalledWith(mockContext);
        expect(mockContext.clip).toHaveBeenCalledWith(PathFillType.nonZero);
      });

      it('应该支持evenOdd裁剪规则', () => {
        path.fillType = PathFillType.evenOdd;
        
        canvas.clipPath(path);
        
        expect(mockContext.clip).toHaveBeenCalledWith(PathFillType.evenOdd);
      });
    });
  });

  describe('Paint应用', () => {
    it('应该在绘制前应用Paint样式', () => {
      const mockPaint = {
        applyToContext: vi.fn(),
        style: PaintingStyle.fill,
        strokeWidth: 2
      } as any;

      canvas.drawPoint({ dx: 50, dy: 50 }, mockPaint);
      
      expect(mockPaint.applyToContext).toHaveBeenCalledWith(mockContext);
    });

    it('应该为不同绘制操作应用Paint', () => {
      const mockPaint = {
        applyToContext: vi.fn(),
        style: PaintingStyle.stroke,
        strokeWidth: 3
      } as any;

      canvas.drawLine({ dx: 0, dy: 0 }, { dx: 100, dy: 100 }, mockPaint);
      canvas.drawRect({ left: 10, top: 10, right: 60, bottom: 60 }, mockPaint);
      canvas.drawCircle({ dx: 200, dy: 200 }, 50, mockPaint);
      
      expect(mockPaint.applyToContext).toHaveBeenCalledTimes(3);
    });
  });

  describe('复杂绘制场景', () => {
    it('应该支持变换后绘制', () => {
      canvas.save();
      canvas.translate(100, 100);
      canvas.rotate(Math.PI / 4);
      canvas.scale(2, 2);
      
      canvas.drawRect({ left: 0, top: 0, right: 50, bottom: 50 }, paint);
      
      canvas.restore();
      
      expect(mockContext.save).toHaveBeenCalled();
      expect(mockContext.translate).toHaveBeenCalledWith(100, 100);
      expect(mockContext.rotate).toHaveBeenCalledWith(Math.PI / 4);
      expect(mockContext.scale).toHaveBeenCalledWith(2, 2);
      expect(mockContext.fillRect).toHaveBeenCalledWith(0, 0, 50, 50);
      expect(mockContext.restore).toHaveBeenCalled();
    });

    it('应该支持裁剪后绘制', () => {
      canvas.save();
      canvas.clipRect({ left: 50, top: 50, right: 150, bottom: 150 });
      
      canvas.drawCircle({ dx: 100, dy: 100 }, 80, paint);
      
      canvas.restore();
      
      expect(mockContext.clip).toHaveBeenCalled();
      expect(mockContext.arc).toHaveBeenCalledWith(100, 100, 80, 0, 2 * Math.PI);
    });

    it('应该支持多层变换和裁剪', () => {
      canvas.save();
      canvas.translate(50, 50);
      canvas.clipRect({ left: 0, top: 0, right: 100, bottom: 100 });
      
      canvas.save();
      canvas.scale(0.5, 0.5);
      canvas.rotate(Math.PI / 6);
      
      canvas.drawRect({ left: 0, top: 0, right: 200, bottom: 200 }, paint);
      
      canvas.restore();
      canvas.restore();
      
      expect(mockContext.save).toHaveBeenCalledTimes(2);
      expect(mockContext.restore).toHaveBeenCalledTimes(2);
    });
  });

  describe('边界条件和错误处理', () => {
    it('应该处理NaN坐标', () => {
      canvas.drawPoint({ dx: NaN, dy: NaN }, paint);
      canvas.drawLine({ dx: NaN, dy: 0 }, { dx: 0, dy: NaN }, paint);
      
      // 应该不抛出错误
      expect(mockContext.arc).toHaveBeenCalled();
      expect(mockContext.moveTo).toHaveBeenCalled();
      expect(mockContext.lineTo).toHaveBeenCalled();
    });

    it('应该处理无穷大坐标', () => {
      canvas.drawCircle({ dx: Infinity, dy: -Infinity }, 50, paint);
      canvas.drawRect({ left: -Infinity, top: Infinity, right: 100, bottom: 100 }, paint);
      
      // 应该不抛出错误
      expect(mockContext.arc).toHaveBeenCalled();
      expect(mockContext.fillRect).toHaveBeenCalled();
    });

    it('应该处理极大数值', () => {
      const largeValue = Number.MAX_SAFE_INTEGER;
      canvas.translate(largeValue, largeValue);
      canvas.scale(largeValue, largeValue);
      
      expect(mockContext.translate).toHaveBeenCalledWith(largeValue, largeValue);
      expect(mockContext.scale).toHaveBeenCalledWith(largeValue, largeValue);
    });

    it('应该处理极小数值', () => {
      const smallValue = Number.MIN_VALUE;
      canvas.drawCircle({ dx: 50, dy: 50 }, smallValue, paint);
      
      expect(mockContext.arc).toHaveBeenCalledWith(50, 50, smallValue, 0, 2 * Math.PI);
    });
  });

  describe('性能测试', () => {
    it('应该高效处理大量绘制操作', () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        canvas.drawPoint({ dx: i % 800, dy: i % 600 }, paint);
      }
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(100); // 应该在100ms内完成
    });

    it('应该高效处理大量变换操作', () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 100; i++) {
        canvas.save();
        canvas.translate(i, i);
        canvas.rotate(i * 0.1);
        canvas.scale(1 + i * 0.01, 1 + i * 0.01);
        canvas.drawRect({ left: 0, top: 0, right: 10, bottom: 10 }, paint);
        canvas.restore();
      }
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(50); // 应该在50ms内完成
    });

    it('应该高效处理复杂路径绘制', () => {
      const complexPath = new Path();
      complexPath.applyToContext = vi.fn();
      
      const startTime = performance.now();
      
      for (let i = 0; i < 100; i++) {
        canvas.drawPath(complexPath, paint);
      }
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(50); // 应该在50ms内完成
    });
  });

  describe('集成测试', () => {
    it('应该正确绘制复杂图形组合', () => {
      // 绘制一个复杂的图形组合
      canvas.save();
      
      // 背景
      canvas.clear(Color.white);
      
      // 主图形
      canvas.translate(400, 300);
      canvas.rotate(Math.PI / 8);
      
      // 外圆
      const outerPaint = new Paint();
      outerPaint.color = Color.blue;
      outerPaint.style = PaintingStyle.fill;
      canvas.drawCircle({ dx: 0, dy: 0 }, 100, outerPaint);
      
      // 内矩形
      const innerPaint = new Paint();
      innerPaint.color = Color.red;
      innerPaint.style = PaintingStyle.fill;
      canvas.drawRect({ left: -50, top: -50, right: 50, bottom: 50 }, innerPaint);
      
      canvas.restore();
      
      // 验证调用序列
      expect(mockContext.clearRect).toHaveBeenCalled();
      expect(mockContext.save).toHaveBeenCalled();
      expect(mockContext.translate).toHaveBeenCalledWith(400, 300);
      expect(mockContext.rotate).toHaveBeenCalledWith(Math.PI / 8);
      expect(mockContext.arc).toHaveBeenCalledWith(0, 0, 100, 0, 2 * Math.PI);
      expect(mockContext.fillRect).toHaveBeenCalledWith(-50, -50, 100, 100);
      expect(mockContext.restore).toHaveBeenCalled();
    });

    it('应该正确处理嵌套裁剪', () => {
      canvas.save();
      
      // 第一层裁剪
      canvas.clipRect({ left: 100, top: 100, right: 300, bottom: 300 });
      
      canvas.save();
      
      // 第二层裁剪
      canvas.clipRect({ left: 150, top: 150, right: 250, bottom: 250 });
      
      // 在嵌套裁剪区域内绘制
      canvas.drawCircle({ dx: 200, dy: 200 }, 80, paint);
      
      canvas.restore();
      canvas.restore();
      
      expect(mockContext.save).toHaveBeenCalledTimes(2);
      expect(mockContext.clip).toHaveBeenCalledTimes(2);
      expect(mockContext.restore).toHaveBeenCalledTimes(2);
    });
  });
});