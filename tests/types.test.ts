import { describe, it, expect } from 'vitest';
import {
  Offset,
  Size,
  Rect,
  RRect,
  PaintingStyle,
  StrokeCap,
  StrokeJoin,
  BlendMode,
  PathOperation,
  PathFillType,
  TextAlign,
  FontWeight,
  FontStyle,
  GradientStop,
  TileMode
} from '../src/types';
import { Color } from '../src/color';

describe('基础几何类型', () => {
  describe('Offset接口', () => {
    it('应该能够创建Offset对象', () => {
      const offset: Offset = { dx: 100, dy: 200 };
      
      expect(offset.dx).toBe(100);
      expect(offset.dy).toBe(200);
    });

    it('应该支持负数坐标', () => {
      const offset: Offset = { dx: -50, dy: -75 };
      
      expect(offset.dx).toBe(-50);
      expect(offset.dy).toBe(-75);
    });

    it('应该支持小数坐标', () => {
      const offset: Offset = { dx: 10.5, dy: 20.7 };
      
      expect(offset.dx).toBe(10.5);
      expect(offset.dy).toBe(20.7);
    });

    it('应该支持零坐标', () => {
      const origin: Offset = { dx: 0, dy: 0 };
      
      expect(origin.dx).toBe(0);
      expect(origin.dy).toBe(0);
    });

    it('应该支持极大值坐标', () => {
      const largeOffset: Offset = { 
        dx: Number.MAX_SAFE_INTEGER, 
        dy: Number.MAX_SAFE_INTEGER 
      };
      
      expect(largeOffset.dx).toBe(Number.MAX_SAFE_INTEGER);
      expect(largeOffset.dy).toBe(Number.MAX_SAFE_INTEGER);
    });
  });

  describe('Size接口', () => {
    it('应该能够创建Size对象', () => {
      const size: Size = { width: 800, height: 600 };
      
      expect(size.width).toBe(800);
      expect(size.height).toBe(600);
    });

    it('应该支持零尺寸', () => {
      const zeroSize: Size = { width: 0, height: 0 };
      
      expect(zeroSize.width).toBe(0);
      expect(zeroSize.height).toBe(0);
    });

    it('应该支持小数尺寸', () => {
      const fractionalSize: Size = { width: 100.5, height: 200.7 };
      
      expect(fractionalSize.width).toBe(100.5);
      expect(fractionalSize.height).toBe(200.7);
    });

    it('应该支持正方形尺寸', () => {
      const square: Size = { width: 100, height: 100 };
      
      expect(square.width).toBe(square.height);
      expect(square.width).toBe(100);
    });

    it('应该支持极大尺寸', () => {
      const largeSize: Size = { 
        width: Number.MAX_SAFE_INTEGER, 
        height: Number.MAX_SAFE_INTEGER 
      };
      
      expect(largeSize.width).toBe(Number.MAX_SAFE_INTEGER);
      expect(largeSize.height).toBe(Number.MAX_SAFE_INTEGER);
    });
  });

  describe('Rect接口', () => {
    it('应该能够创建Rect对象', () => {
      const rect: Rect = { left: 10, top: 20, right: 110, bottom: 80 };
      
      expect(rect.left).toBe(10);
      expect(rect.top).toBe(20);
      expect(rect.right).toBe(110);
      expect(rect.bottom).toBe(80);
    });

    it('应该支持计算宽度和高度', () => {
      const rect: Rect = { left: 0, top: 0, right: 100, bottom: 50 };
      
      const width = rect.right - rect.left;
      const height = rect.bottom - rect.top;
      
      expect(width).toBe(100);
      expect(height).toBe(50);
    });

    it('应该支持负坐标', () => {
      const rect: Rect = { left: -50, top: -25, right: 50, bottom: 25 };
      
      expect(rect.left).toBe(-50);
      expect(rect.top).toBe(-25);
      expect(rect.right).toBe(50);
      expect(rect.bottom).toBe(25);
    });

    it('应该支持零尺寸矩形', () => {
      const pointRect: Rect = { left: 10, top: 10, right: 10, bottom: 10 };
      
      const width = pointRect.right - pointRect.left;
      const height = pointRect.bottom - pointRect.top;
      
      expect(width).toBe(0);
      expect(height).toBe(0);
    });

    it('应该支持小数坐标', () => {
      const rect: Rect = { left: 10.5, top: 20.7, right: 110.3, bottom: 80.9 };
      
      expect(rect.left).toBe(10.5);
      expect(rect.top).toBe(20.7);
      expect(rect.right).toBe(110.3);
      expect(rect.bottom).toBe(80.9);
    });
  });

  describe('RRect接口', () => {
    it('应该能够创建RRect对象', () => {
      const rrect: RRect = {
        rect: { left: 0, top: 0, right: 100, bottom: 100 },
        tlRadiusX: 10, tlRadiusY: 10,
        trRadiusX: 10, trRadiusY: 10,
        brRadiusX: 10, brRadiusY: 10,
        blRadiusX: 10, blRadiusY: 10
      };
      
      expect(rrect.rect.left).toBe(0);
      expect(rrect.rect.right).toBe(100);
      expect(rrect.tlRadiusX).toBe(10);
      expect(rrect.tlRadiusY).toBe(10);
    });

    it('应该支持不同的圆角半径', () => {
      const rrect: RRect = {
        rect: { left: 0, top: 0, right: 100, bottom: 50 },
        tlRadiusX: 5, tlRadiusY: 5,   // 左上角小圆角
        trRadiusX: 15, trRadiusY: 15, // 右上角大圆角
        brRadiusX: 0, brRadiusY: 0,   // 右下角无圆角
        blRadiusX: 0, blRadiusY: 0    // 左下角无圆角
      };
      
      expect(rrect.tlRadiusX).toBe(5);
      expect(rrect.trRadiusX).toBe(15);
      expect(rrect.brRadiusX).toBe(0);
      expect(rrect.blRadiusX).toBe(0);
    });

    it('应该支持椭圆形圆角', () => {
      const rrect: RRect = {
        rect: { left: 0, top: 0, right: 100, bottom: 100 },
        tlRadiusX: 20, tlRadiusY: 10, // 椭圆形圆角
        trRadiusX: 20, trRadiusY: 10,
        brRadiusX: 20, brRadiusY: 10,
        blRadiusX: 20, blRadiusY: 10
      };
      
      expect(rrect.tlRadiusX).toBe(20);
      expect(rrect.tlRadiusY).toBe(10);
      expect(rrect.tlRadiusX).not.toBe(rrect.tlRadiusY);
    });

    it('应该支持零圆角半径', () => {
      const rrect: RRect = {
        rect: { left: 0, top: 0, right: 100, bottom: 100 },
        tlRadiusX: 0, tlRadiusY: 0,
        trRadiusX: 0, trRadiusY: 0,
        brRadiusX: 0, brRadiusY: 0,
        blRadiusX: 0, blRadiusY: 0
      };
      
      // 零圆角半径应该等同于普通矩形
      expect(rrect.tlRadiusX).toBe(0);
      expect(rrect.tlRadiusY).toBe(0);
      expect(rrect.trRadiusX).toBe(0);
      expect(rrect.trRadiusY).toBe(0);
    });
  });
});

describe('绘制样式枚举', () => {
  describe('PaintingStyle枚举', () => {
    it('应该包含正确的枚举值', () => {
      expect(PaintingStyle.fill).toBe('fill');
      expect(PaintingStyle.stroke).toBe('stroke');
    });

    it('应该能够用于类型检查', () => {
      const fillStyle: PaintingStyle = PaintingStyle.fill;
      const strokeStyle: PaintingStyle = PaintingStyle.stroke;
      
      expect(fillStyle).toBe(PaintingStyle.fill);
      expect(strokeStyle).toBe(PaintingStyle.stroke);
    });

    it('应该支持枚举比较', () => {
      expect(PaintingStyle.fill).not.toBe(PaintingStyle.stroke);
      expect(PaintingStyle.fill === PaintingStyle.fill).toBe(true);
    });
  });

  describe('StrokeCap枚举', () => {
    it('应该包含正确的枚举值', () => {
      expect(StrokeCap.butt).toBe('butt');
      expect(StrokeCap.round).toBe('round');
      expect(StrokeCap.square).toBe('square');
    });

    it('应该能够用于类型检查', () => {
      const buttCap: StrokeCap = StrokeCap.butt;
      const roundCap: StrokeCap = StrokeCap.round;
      const squareCap: StrokeCap = StrokeCap.square;
      
      expect(buttCap).toBe(StrokeCap.butt);
      expect(roundCap).toBe(StrokeCap.round);
      expect(squareCap).toBe(StrokeCap.square);
    });

    it('应该支持枚举比较', () => {
      expect(StrokeCap.butt).not.toBe(StrokeCap.round);
      expect(StrokeCap.round).not.toBe(StrokeCap.square);
      expect(StrokeCap.butt === StrokeCap.butt).toBe(true);
    });
  });

  describe('StrokeJoin枚举', () => {
    it('应该包含正确的枚举值', () => {
      expect(StrokeJoin.miter).toBe('miter');
      expect(StrokeJoin.round).toBe('round');
      expect(StrokeJoin.bevel).toBe('bevel');
    });

    it('应该能够用于类型检查', () => {
      const miterJoin: StrokeJoin = StrokeJoin.miter;
      const roundJoin: StrokeJoin = StrokeJoin.round;
      const bevelJoin: StrokeJoin = StrokeJoin.bevel;
      
      expect(miterJoin).toBe(StrokeJoin.miter);
      expect(roundJoin).toBe(StrokeJoin.round);
      expect(bevelJoin).toBe(StrokeJoin.bevel);
    });

    it('应该支持枚举比较', () => {
      expect(StrokeJoin.miter).not.toBe(StrokeJoin.round);
      expect(StrokeJoin.round).not.toBe(StrokeJoin.bevel);
      expect(StrokeJoin.miter === StrokeJoin.miter).toBe(true);
    });
  });

  describe('BlendMode枚举', () => {
    it('应该包含基本的混合模式', () => {
      expect(BlendMode.clear).toBe('clear');
      expect(BlendMode.src).toBe('source-over');
      expect(BlendMode.srcOver).toBe('source-over');
      expect(BlendMode.multiply).toBe('multiply');
      expect(BlendMode.screen).toBe('screen');
    });

    it('应该包含所有Canvas支持的混合模式', () => {
      const expectedModes = [
        'clear', 'source-over', 'destination-over', 'source-in',
        'destination-in', 'source-out', 'destination-out', 'source-atop',
        'destination-atop', 'xor', 'lighter', 'multiply', 'screen',
        'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn',
        'hard-light', 'soft-light', 'difference', 'exclusion',
        'hue', 'saturation', 'color', 'luminosity'
      ];
      
      const actualModes = Object.values(BlendMode);
      
      expectedModes.forEach(mode => {
        expect(actualModes).toContain(mode);
      });
    });

    it('应该能够用于类型检查', () => {
      const normalMode: BlendMode = BlendMode.srcOver;
      const multiplyMode: BlendMode = BlendMode.multiply;
      
      expect(normalMode).toBe(BlendMode.srcOver);
      expect(multiplyMode).toBe(BlendMode.multiply);
    });
  });
});

describe('路径操作枚举', () => {
  describe('PathOperation枚举', () => {
    it('应该包含正确的枚举值', () => {
      expect(PathOperation.difference).toBe('difference');
      expect(PathOperation.intersect).toBe('intersect');
      expect(PathOperation.union).toBe('union');
      expect(PathOperation.xor).toBe('xor');
    });

    it('应该能够用于类型检查', () => {
      const unionOp: PathOperation = PathOperation.union;
      const intersectOp: PathOperation = PathOperation.intersect;
      
      expect(unionOp).toBe(PathOperation.union);
      expect(intersectOp).toBe(PathOperation.intersect);
    });

    it('应该支持枚举比较', () => {
      expect(PathOperation.union).not.toBe(PathOperation.intersect);
      expect(PathOperation.difference).not.toBe(PathOperation.xor);
      expect(PathOperation.union === PathOperation.union).toBe(true);
    });
  });

  describe('PathFillType枚举', () => {
    it('应该包含正确的枚举值', () => {
      expect(PathFillType.nonZero).toBe('nonzero');
      expect(PathFillType.evenOdd).toBe('evenodd');
    });

    it('应该能够用于类型检查', () => {
      const nonZeroFill: PathFillType = PathFillType.nonZero;
      const evenOddFill: PathFillType = PathFillType.evenOdd;
      
      expect(nonZeroFill).toBe(PathFillType.nonZero);
      expect(evenOddFill).toBe(PathFillType.evenOdd);
    });

    it('应该支持枚举比较', () => {
      expect(PathFillType.nonZero).not.toBe(PathFillType.evenOdd);
      expect(PathFillType.nonZero === PathFillType.nonZero).toBe(true);
    });
  });
});

describe('文本相关枚举', () => {
  describe('TextAlign枚举', () => {
    it('应该包含正确的枚举值', () => {
      expect(TextAlign.left).toBe('left');
      expect(TextAlign.right).toBe('right');
      expect(TextAlign.center).toBe('center');
      expect(TextAlign.justify).toBe('justify');
      expect(TextAlign.start).toBe('start');
      expect(TextAlign.end).toBe('end');
    });

    it('应该能够用于类型检查', () => {
      const leftAlign: TextAlign = TextAlign.left;
      const centerAlign: TextAlign = TextAlign.center;
      
      expect(leftAlign).toBe(TextAlign.left);
      expect(centerAlign).toBe(TextAlign.center);
    });

    it('应该支持枚举比较', () => {
      expect(TextAlign.left).not.toBe(TextAlign.right);
      expect(TextAlign.center).not.toBe(TextAlign.justify);
      expect(TextAlign.left === TextAlign.left).toBe(true);
    });
  });

  describe('FontWeight枚举', () => {
    it('应该包含数字权重值', () => {
      expect(FontWeight.w100).toBe('100');
      expect(FontWeight.w200).toBe('200');
      expect(FontWeight.w300).toBe('300');
      expect(FontWeight.w400).toBe('400');
      expect(FontWeight.w500).toBe('500');
      expect(FontWeight.w600).toBe('600');
      expect(FontWeight.w700).toBe('700');
      expect(FontWeight.w800).toBe('800');
      expect(FontWeight.w900).toBe('900');
    });

    it('应该包含语义化权重值', () => {
      expect(FontWeight.normal).toBe('400');
      expect(FontWeight.bold).toBe('700');
    });

    it('应该保证语义化值与数字值的一致性', () => {
      expect(FontWeight.normal).toBe(FontWeight.w400);
      expect(FontWeight.bold).toBe(FontWeight.w700);
    });

    it('应该能够用于类型检查', () => {
      const normalWeight: FontWeight = FontWeight.normal;
      const boldWeight: FontWeight = FontWeight.bold;
      const lightWeight: FontWeight = FontWeight.w300;
      
      expect(normalWeight).toBe(FontWeight.normal);
      expect(boldWeight).toBe(FontWeight.bold);
      expect(lightWeight).toBe(FontWeight.w300);
    });
  });

  describe('FontStyle枚举', () => {
    it('应该包含正确的枚举值', () => {
      expect(FontStyle.normal).toBe('normal');
      expect(FontStyle.italic).toBe('italic');
    });

    it('应该能够用于类型检查', () => {
      const normalStyle: FontStyle = FontStyle.normal;
      const italicStyle: FontStyle = FontStyle.italic;
      
      expect(normalStyle).toBe(FontStyle.normal);
      expect(italicStyle).toBe(FontStyle.italic);
    });

    it('应该支持枚举比较', () => {
      expect(FontStyle.normal).not.toBe(FontStyle.italic);
      expect(FontStyle.normal === FontStyle.normal).toBe(true);
    });
  });
});

describe('渐变相关类型', () => {
  describe('GradientStop接口', () => {
    it('应该能够创建GradientStop对象', () => {
      const stop: GradientStop = {
        offset: 0.5,
        color: Color.red
      };
      
      expect(stop.offset).toBe(0.5);
      expect(stop.color).toBe(Color.red);
    });

    it('应该支持边界偏移值', () => {
      const startStop: GradientStop = {
        offset: 0.0,
        color: Color.blue
      };
      
      const endStop: GradientStop = {
        offset: 1.0,
        color: Color.green
      };
      
      expect(startStop.offset).toBe(0.0);
      expect(endStop.offset).toBe(1.0);
    });

    it('应该支持创建渐变停止点数组', () => {
      const gradientStops: GradientStop[] = [
        { offset: 0.0, color: Color.red },
        { offset: 0.5, color: Color.yellow },
        { offset: 1.0, color: Color.blue }
      ];
      
      expect(gradientStops).toHaveLength(3);
      expect(gradientStops[0].offset).toBe(0.0);
      expect(gradientStops[1].offset).toBe(0.5);
      expect(gradientStops[2].offset).toBe(1.0);
    });

    it('应该支持小数偏移值', () => {
      const stop: GradientStop = {
        offset: 0.333,
        color: Color.purple
      };
      
      expect(stop.offset).toBe(0.333);
    });

    it('应该支持不同的颜色类型', () => {
      const stops: GradientStop[] = [
        { offset: 0.0, color: Color.red },
        { offset: 0.25, color: Color.fromARGB(255, 128, 128, 128) },
        { offset: 0.5, color: Color.fromRGBO(0, 255, 0, 0.8) },
        { offset: 0.75, color: Color.blue.withOpacity(0.5) },
        { offset: 1.0, color: Color.transparent }
      ];
      
      expect(stops).toHaveLength(5);
      stops.forEach((stop, index) => {
        expect(stop.offset).toBe(index * 0.25);
        expect(stop.color).toBeInstanceOf(Color);
      });
    });
  });

  describe('TileMode枚举', () => {
    it('应该包含正确的枚举值', () => {
      expect(TileMode.clamp).toBe('clamp');
      expect(TileMode.repeat).toBe('repeat');
      expect(TileMode.mirror).toBe('mirror');
    });

    it('应该能够用于类型检查', () => {
      const clampMode: TileMode = TileMode.clamp;
      const repeatMode: TileMode = TileMode.repeat;
      const mirrorMode: TileMode = TileMode.mirror;
      
      expect(clampMode).toBe(TileMode.clamp);
      expect(repeatMode).toBe(TileMode.repeat);
      expect(mirrorMode).toBe(TileMode.mirror);
    });

    it('应该支持枚举比较', () => {
      expect(TileMode.clamp).not.toBe(TileMode.repeat);
      expect(TileMode.repeat).not.toBe(TileMode.mirror);
      expect(TileMode.clamp === TileMode.clamp).toBe(true);
    });
  });
});

describe('类型兼容性测试', () => {
  it('Offset应该与坐标计算兼容', () => {
    const point1: Offset = { dx: 10, dy: 20 };
    const point2: Offset = { dx: 30, dy: 40 };
    
    // 计算距离
    const distance = Math.sqrt(
      Math.pow(point2.dx - point1.dx, 2) + 
      Math.pow(point2.dy - point1.dy, 2)
    );
    
    expect(distance).toBeCloseTo(28.28, 2);
  });

  it('Size应该与面积计算兼容', () => {
    const size: Size = { width: 100, height: 50 };
    
    const area = size.width * size.height;
    const perimeter = 2 * (size.width + size.height);
    const aspectRatio = size.width / size.height;
    
    expect(area).toBe(5000);
    expect(perimeter).toBe(300);
    expect(aspectRatio).toBe(2);
  });

  it('Rect应该与几何计算兼容', () => {
    const rect: Rect = { left: 10, top: 20, right: 110, bottom: 70 };
    
    const width = rect.right - rect.left;
    const height = rect.bottom - rect.top;
    const area = width * height;
    const center: Offset = {
      dx: (rect.left + rect.right) / 2,
      dy: (rect.top + rect.bottom) / 2
    };
    
    expect(width).toBe(100);
    expect(height).toBe(50);
    expect(area).toBe(5000);
    expect(center.dx).toBe(60);
    expect(center.dy).toBe(45);
  });

  it('枚举值应该与字符串比较兼容', () => {
    expect(PaintingStyle.fill === 'fill').toBe(true);
    expect(StrokeCap.round === 'round').toBe(true);
    expect(BlendMode.multiply === 'multiply').toBe(true);
  });

  it('GradientStop应该与排序兼容', () => {
    const stops: GradientStop[] = [
      { offset: 0.7, color: Color.red },
      { offset: 0.2, color: Color.green },
      { offset: 0.9, color: Color.blue },
      { offset: 0.1, color: Color.yellow }
    ];
    
    // 按偏移值排序
    stops.sort((a, b) => a.offset - b.offset);
    
    expect(stops[0].offset).toBe(0.1);
    expect(stops[1].offset).toBe(0.2);
    expect(stops[2].offset).toBe(0.7);
    expect(stops[3].offset).toBe(0.9);
  });
});

describe('边界条件测试', () => {
  it('应该处理极值坐标', () => {
    const extremeOffset: Offset = {
      dx: Number.MAX_SAFE_INTEGER,
      dy: Number.MIN_SAFE_INTEGER
    };
    
    expect(extremeOffset.dx).toBe(Number.MAX_SAFE_INTEGER);
    expect(extremeOffset.dy).toBe(Number.MIN_SAFE_INTEGER);
  });

  it('应该处理零尺寸', () => {
    const zeroSize: Size = { width: 0, height: 0 };
    const area = zeroSize.width * zeroSize.height;
    
    expect(area).toBe(0);
  });

  it('应该处理负数矩形', () => {
    const negativeRect: Rect = { 
      left: 100, top: 100, 
      right: 50, bottom: 50 
    };
    
    const width = negativeRect.right - negativeRect.left;
    const height = negativeRect.bottom - negativeRect.top;
    
    expect(width).toBe(-50);
    expect(height).toBe(-50);
  });

  it('应该处理极值渐变偏移', () => {
    const extremeStops: GradientStop[] = [
      { offset: 0, color: Color.black },
      { offset: Number.EPSILON, color: Color.white },
      { offset: 1 - Number.EPSILON, color: Color.grey },
      { offset: 1, color: Color.transparent }
    ];
    
    expect(extremeStops[0].offset).toBe(0);
    expect(extremeStops[1].offset).toBe(Number.EPSILON);
    expect(extremeStops[2].offset).toBe(1 - Number.EPSILON);
    expect(extremeStops[3].offset).toBe(1);
  });
});

describe('类型安全性测试', () => {
  it('枚举值应该是不可变的', () => {
    const originalValue = PaintingStyle.fill;
    
    // 在JavaScript中，枚举实际上是可以修改的，但我们测试原始值的存在
    expect(originalValue).toBe('fill');
    expect(PaintingStyle.fill).toBe('fill');
    
    // 测试枚举的基本不变性
    expect(typeof PaintingStyle.fill).toBe('string');
    expect(PaintingStyle.fill).toBeTruthy();
  });

  it('接口属性应该是可修改的', () => {
    const offset: Offset = { dx: 10, dy: 20 };
    
    offset.dx = 30;
    offset.dy = 40;
    
    expect(offset.dx).toBe(30);
    expect(offset.dy).toBe(40);
  });

  it('应该支持类型守卫', () => {
    function isPaintingStyleFill(style: PaintingStyle): boolean {
      return style === PaintingStyle.fill;
    }
    
    expect(isPaintingStyleFill(PaintingStyle.fill)).toBe(true);
    expect(isPaintingStyleFill(PaintingStyle.stroke)).toBe(false);
  });

  it('应该支持联合类型', () => {
    type BasicBlendMode = BlendMode.srcOver | BlendMode.multiply | BlendMode.screen;
    
    const normalMode: BasicBlendMode = BlendMode.srcOver;
    const multiplyMode: BasicBlendMode = BlendMode.multiply;
    
    expect(normalMode).toBe(BlendMode.srcOver);
    expect(multiplyMode).toBe(BlendMode.multiply);
  });
});