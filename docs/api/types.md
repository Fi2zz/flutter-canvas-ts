# 类型定义 API 文档

## 概述

本文档详细介绍了 Flutter Canvas TypeScript 库中使用的所有核心类型、接口和枚举。这些类型提供了完整的绘制系统所需的数据结构，确保类型安全和开发体验。

类型系统包含以下几个主要分类：
- **基础几何类型** - 用于描述位置、尺寸和区域
- **绘制样式枚举** - 定义各种绘制选项和模式
- **路径操作枚举** - 用于复杂路径的布尔运算
- **文本相关枚举** - 用于文本渲染的样式设置
- **渐变相关类型** - 用于颜色渐变和图案定义

---

## 基础几何类型

### Offset 接口

表示二维平面上的一个点，包含 X 和 Y 坐标。

```typescript
interface Offset {
  dx: number;  // X 轴坐标值
  dy: number;  // Y 轴坐标值
}
```

**使用示例:**
```typescript
// 创建一个坐标点
const point: Offset = { dx: 100, dy: 200 };

// 计算两点之间的距离
function distance(p1: Offset, p2: Offset): number {
  return Math.sqrt(
    Math.pow(p2.dx - p1.dx, 2) + 
    Math.pow(p2.dy - p1.dy, 2)
  );
}

// 向量运算
function addOffset(a: Offset, b: Offset): Offset {
  return { dx: a.dx + b.dx, dy: a.dy + b.dy };
}
```

### Size 接口

表示二维对象的尺寸，包含宽度和高度。

```typescript
interface Size {
  width: number;   // 宽度值，应为非负数
  height: number;  // 高度值，应为非负数
}
```

**使用示例:**
```typescript
// 定义画布尺寸
const canvasSize: Size = { width: 800, height: 600 };

// 计算面积
const area = canvasSize.width * canvasSize.height;

// 计算宽高比
const aspectRatio = canvasSize.width / canvasSize.height;

// 缩放尺寸
function scaleSize(size: Size, factor: number): Size {
  return {
    width: size.width * factor,
    height: size.height * factor
  };
}
```

### Rect 接口

表示一个矩形区域，通过四个边界坐标定义。

```typescript
interface Rect {
  left: number;    // 左边界 X 坐标
  top: number;     // 上边界 Y 坐标
  right: number;   // 右边界 X 坐标
  bottom: number;  // 下边界 Y 坐标
}
```

**使用示例:**
```typescript
// 定义一个矩形区域
const rect: Rect = { left: 10, top: 10, right: 110, bottom: 60 };

// 计算矩形的宽度和高度
const width = rect.right - rect.left;   // 100
const height = rect.bottom - rect.top;  // 50

// 检查点是否在矩形内
function containsPoint(rect: Rect, point: Offset): boolean {
  return point.dx >= rect.left && point.dx <= rect.right &&
         point.dy >= rect.top && point.dy <= rect.bottom;
}

// 矩形工具函数
function rectFromLTWH(left: number, top: number, width: number, height: number): Rect {
  return {
    left,
    top,
    right: left + width,
    bottom: top + height
  };
}

function rectCenter(rect: Rect): Offset {
  return {
    dx: (rect.left + rect.right) / 2,
    dy: (rect.top + rect.bottom) / 2
  };
}
```

### RRect 接口

表示一个带有圆角的矩形，每个角可以有不同的水平和垂直圆角半径。

```typescript
interface RRect {
  rect: Rect;           // 基础矩形区域
  tlRadiusX: number;    // 左上角水平圆角半径
  tlRadiusY: number;    // 左上角垂直圆角半径
  trRadiusX: number;    // 右上角水平圆角半径
  trRadiusY: number;    // 右上角垂直圆角半径
  brRadiusX: number;    // 右下角水平圆角半径
  brRadiusY: number;    // 右下角垂直圆角半径
  blRadiusX: number;    // 左下角水平圆角半径
  blRadiusY: number;    // 左下角垂直圆角半径
}
```

**使用示例:**
```typescript
// 创建一个统一圆角的矩形
const uniformRRect: RRect = {
  rect: { left: 0, top: 0, right: 100, bottom: 100 },
  tlRadiusX: 10, tlRadiusY: 10,  // 左上角
  trRadiusX: 10, trRadiusY: 10,  // 右上角
  brRadiusX: 10, brRadiusY: 10,  // 右下角
  blRadiusX: 10, blRadiusY: 10   // 左下角
};

// 创建一个只有上方圆角的矩形（类似标签页）
const tabRRect: RRect = {
  rect: { left: 0, top: 0, right: 100, bottom: 50 },
  tlRadiusX: 8, tlRadiusY: 8,    // 左上角有圆角
  trRadiusX: 8, trRadiusY: 8,    // 右上角有圆角
  brRadiusX: 0, brRadiusY: 0,    // 右下角无圆角
  blRadiusX: 0, blRadiusY: 0     // 左下角无圆角
};

// 工具函数：创建统一圆角矩形
function createUniformRRect(rect: Rect, radius: number): RRect {
  return {
    rect,
    tlRadiusX: radius, tlRadiusY: radius,
    trRadiusX: radius, trRadiusY: radius,
    brRadiusX: radius, brRadiusY: radius,
    blRadiusX: radius, blRadiusY: radius
  };
}
```

---

## 绘制样式枚举

### PaintingStyle 枚举

定义图形的绘制方式：填充或描边。

```typescript
enum PaintingStyle {
  fill = "fill",      // 填充模式 - 填充图形内部
  stroke = "stroke"   // 描边模式 - 只绘制图形边框
}
```

**使用示例:**
```typescript
import { PaintingStyle } from 'flutter-canvas-ts';

// 创建填充样式的画笔
const fillPaint = new Paint();
fillPaint.style = PaintingStyle.fill;
fillPaint.color = Color.blue;

// 创建描边样式的画笔
const strokePaint = new Paint();
strokePaint.style = PaintingStyle.stroke;
strokePaint.strokeWidth = 2;
strokePaint.color = Color.red;
```

### StrokeCap 枚举

定义线条两端的绘制样式。

```typescript
enum StrokeCap {
  butt = "butt",      // 平头端点 - 线条在端点处平直截断
  round = "round",    // 圆形端点 - 线条端点为半圆形
  square = "square"   // 方形端点 - 线条端点延伸半个线宽的方形
}
```

**使用示例:**
```typescript
import { StrokeCap } from 'flutter-canvas-ts';

// 平头端点（默认）
paint.strokeCap = StrokeCap.butt;

// 圆形端点（常用于平滑效果）
paint.strokeCap = StrokeCap.round;

// 方形端点（延伸半个线宽）
paint.strokeCap = StrokeCap.square;
```

### StrokeJoin 枚举

定义两条线段连接处的绘制样式。

```typescript
enum StrokeJoin {
  miter = "miter",    // 尖角连接 - 线段延伸直到相交形成尖角
  round = "round",    // 圆角连接 - 连接处为圆弧
  bevel = "bevel"     // 斜角连接 - 连接处为平直的斜切面
}
```

**使用示例:**
```typescript
import { StrokeJoin } from 'flutter-canvas-ts';

// 尖角连接（默认）
paint.strokeJoin = StrokeJoin.miter;
paint.strokeMiterLimit = 4.0;  // 控制尖角的最大长度

// 圆角连接（平滑效果）
paint.strokeJoin = StrokeJoin.round;

// 斜角连接（切掉尖角）
paint.strokeJoin = StrokeJoin.bevel;
```

### BlendMode 枚举

定义新绘制的内容与画布上现有内容的混合方式。

```typescript
enum BlendMode {
  // 基础混合模式
  clear = "clear",                    // 清除模式
  src = "source-over",               // 源覆盖模式
  dst = "destination-over",          // 目标覆盖模式
  srcOver = "source-over",           // 源在上模式（默认）
  dstOver = "destination-over",      // 目标在上模式
  srcIn = "source-in",               // 源在内模式
  dstIn = "destination-in",          // 目标在内模式
  srcOut = "source-out",             // 源在外模式
  dstOut = "destination-out",        // 目标在外模式
  srcATop = "source-atop",           // 源在顶部模式
  dstATop = "destination-atop",      // 目标在顶部模式
  xor = "xor",                       // 异或模式
  plus = "lighter",                  // 加法模式
  
  // 高级混合模式
  multiply = "multiply",             // 乘法模式（变暗效果）
  screen = "screen",                 // 屏幕模式（变亮效果）
  overlay = "overlay",               // 叠加模式
  darken = "darken",                 // 变暗模式
  lighten = "lighten",               // 变亮模式
  colorDodge = "color-dodge",        // 颜色减淡模式
  colorBurn = "color-burn",          // 颜色加深模式
  hardLight = "hard-light",          // 强光模式
  softLight = "soft-light",          // 柔光模式
  difference = "difference",         // 差值模式
  exclusion = "exclusion",           // 排除模式
  hue = "hue",                       // 色相模式
  saturation = "saturation",         // 饱和度模式
  color = "color",                   // 颜色模式
  luminosity = "luminosity"          // 亮度模式
}
```

**使用示例:**
```typescript
import { BlendMode } from 'flutter-canvas-ts';

// 正常绘制（默认）
paint.blendMode = BlendMode.srcOver;

// 乘法混合（变暗效果）
paint.blendMode = BlendMode.multiply;

// 屏幕混合（变亮效果）
paint.blendMode = BlendMode.screen;

// 差值混合（创建特殊效果）
paint.blendMode = BlendMode.difference;

// 创建发光效果
function createGlowEffect(canvas: Canvas, shape: Path) {
  const glowPaint = new Paint();
  glowPaint.color = Color.white;
  glowPaint.blendMode = BlendMode.screen;
  
  // 绘制多层发光
  for (let i = 1; i <= 5; i++) {
    glowPaint.strokeWidth = i * 2;
    glowPaint.color = Color.white.withOpacity(0.3 / i);
    canvas.drawPath(shape, glowPaint);
  }
}
```

---

## 路径操作枚举

### PathOperation 枚举

定义两个路径之间的布尔运算类型。

```typescript
enum PathOperation {
  difference = "difference",  // 差集 - 从第一个路径中减去第二个路径
  intersect = "intersect",    // 交集 - 两个路径的重叠部分
  union = "union",            // 并集 - 两个路径的合并
  xor = "xor"                 // 异或 - 两个路径的非重叠部分
}
```

**使用示例:**
```typescript
import { PathOperation } from 'flutter-canvas-ts';

// 创建两个路径
const circle1 = new Path();
circle1.addCircle({dx: 50, dy: 50}, 30);

const circle2 = new Path();
circle2.addCircle({dx: 70, dy: 50}, 30);

// 计算两个圆的并集
const union = Path.combine(PathOperation.union, circle1, circle2);

// 计算两个圆的交集
const intersection = Path.combine(PathOperation.intersect, circle1, circle2);

// 计算两个圆的差集
const difference = Path.combine(PathOperation.difference, circle1, circle2);

// 计算两个圆的异或
const xor = Path.combine(PathOperation.xor, circle1, circle2);
```

### PathFillType 枚举

定义复杂路径的填充规则，特别是对于自相交路径。

```typescript
enum PathFillType {
  nonZero = "nonzero",  // 非零规则 - 基于路径方向的缠绕数判断填充
  evenOdd = "evenodd"   // 奇偶规则 - 基于射线与路径交点数的奇偶性判断填充
}
```

**使用示例:**
```typescript
import { PathFillType } from 'flutter-canvas-ts';

const path = new Path();
// 创建一个五角星路径（自相交）
path.moveTo(50, 0);
path.lineTo(61, 35);
path.lineTo(98, 35);
path.lineTo(68, 57);
path.lineTo(79, 91);
path.lineTo(50, 70);
path.lineTo(21, 91);
path.lineTo(32, 57);
path.lineTo(2, 35);
path.lineTo(39, 35);
path.close();

// 使用非零规则填充（默认）
path.fillType = PathFillType.nonZero;

// 使用奇偶规则填充
path.fillType = PathFillType.evenOdd;
```

---

## 文本相关枚举

### TextAlign 枚举

定义文本在指定区域内的对齐方式。

```typescript
enum TextAlign {
  left = "left",        // 左对齐
  right = "right",      // 右对齐
  center = "center",    // 居中对齐
  justify = "justify",  // 两端对齐
  start = "start",      // 起始对齐（根据文本方向决定左或右）
  end = "end"           // 结束对齐（根据文本方向决定右或左）
}
```

**使用示例:**
```typescript
import { TextAlign } from 'flutter-canvas-ts';

// 左对齐文本
const leftAlignedStyle = {
  textAlign: TextAlign.left,
  fontSize: 16
};

// 居中对齐文本
const centeredStyle = {
  textAlign: TextAlign.center,
  fontSize: 20
};

// 右对齐文本
const rightAlignedStyle = {
  textAlign: TextAlign.right,
  fontSize: 14
};
```

### FontWeight 枚举

定义字体的粗细程度，从最细到最粗。

```typescript
enum FontWeight {
  w100 = "100",      // 最细
  w200 = "200",      // 极细
  w300 = "300",      // 细
  w400 = "400",      // 正常
  w500 = "500",      // 中等
  w600 = "600",      // 半粗
  w700 = "700",      // 粗
  w800 = "800",      // 极粗
  w900 = "900",      // 最粗
  normal = "400",    // 正常粗细，等同于 w400
  bold = "700"       // 粗体，等同于 w700
}
```

**使用示例:**
```typescript
import { FontWeight } from 'flutter-canvas-ts';

// 使用数字权重
const lightText = { fontWeight: FontWeight.w300 };
const normalText = { fontWeight: FontWeight.w400 };
const boldText = { fontWeight: FontWeight.w700 };

// 使用语义化权重
const normalText2 = { fontWeight: FontWeight.normal };
const boldText2 = { fontWeight: FontWeight.bold };

// 创建字体权重渐变效果
const weights = [
  FontWeight.w100, FontWeight.w200, FontWeight.w300,
  FontWeight.w400, FontWeight.w500, FontWeight.w600,
  FontWeight.w700, FontWeight.w800, FontWeight.w900
];
```

### FontStyle 枚举

定义字体的样式，主要是正常和斜体。

```typescript
enum FontStyle {
  normal = "normal",  // 正常字体
  italic = "italic"   // 斜体字体
}
```

**使用示例:**
```typescript
import { FontStyle } from 'flutter-canvas-ts';

// 正常字体
const normalStyle = {
  fontStyle: FontStyle.normal,
  fontSize: 16
};

// 斜体字体
const italicStyle = {
  fontStyle: FontStyle.italic,
  fontSize: 16
};
```

---

## 渐变相关类型

### GradientStop 接口

定义渐变中的一个颜色停止点，包含位置和颜色信息。

```typescript
interface GradientStop {
  offset: number;  // 停止点位置 (0.0 到 1.0)
  color: Color;    // 该停止点的颜色
}
```

**使用示例:**
```typescript
import { GradientStop, Color } from 'flutter-canvas-ts';

// 创建一个从红色到蓝色的渐变
const gradientStops: GradientStop[] = [
  { offset: 0.0, color: Color.red },      // 起始点为红色
  { offset: 0.5, color: Color.yellow },  // 中间点为黄色
  { offset: 1.0, color: Color.blue }     // 结束点为蓝色
];

// 创建一个彩虹渐变
const rainbowStops: GradientStop[] = [
  { offset: 0.0, color: Color.red },
  { offset: 0.17, color: Color.orange },
  { offset: 0.33, color: Color.yellow },
  { offset: 0.5, color: Color.green },
  { offset: 0.67, color: Color.blue },
  { offset: 0.83, color: Color.purple },
  { offset: 1.0, color: Color.magenta }
];

// 创建金属质感渐变
const metalStops: GradientStop[] = [
  { offset: 0.0, color: Color.fromRGB(192, 192, 192) },  // 银色
  { offset: 0.25, color: Color.fromRGB(255, 255, 255) }, // 白色高光
  { offset: 0.5, color: Color.fromRGB(169, 169, 169) },  // 深银色
  { offset: 0.75, color: Color.fromRGB(255, 255, 255) }, // 白色高光
  { offset: 1.0, color: Color.fromRGB(192, 192, 192) }   // 银色
];
```

### TileMode 枚举

定义渐变或图案超出定义边界时的处理方式。

```typescript
enum TileMode {
  clamp = "clamp",    // 夹紧模式 - 边缘颜色延伸到边界外
  repeat = "repeat",  // 重复模式 - 渐变模式重复
  mirror = "mirror"   // 镜像模式 - 渐变模式镜像重复
}
```

**使用示例:**
```typescript
import { TileMode } from 'flutter-canvas-ts';

// 创建不同平铺模式的渐变

// 夹紧模式 - 边缘颜色延伸
const clampGradient = {
  stops: gradientStops,
  tileMode: TileMode.clamp
};

// 重复模式 - 渐变重复
const repeatGradient = {
  stops: gradientStops,
  tileMode: TileMode.repeat
};

// 镜像模式 - 渐变镜像重复
const mirrorGradient = {
  stops: gradientStops,
  tileMode: TileMode.mirror
};

// 创建条纹效果
function createStripePattern(colors: Color[], stripeWidth: number): GradientStop[] {
  const stops: GradientStop[] = [];
  const numColors = colors.length;
  
  for (let i = 0; i < numColors; i++) {
    const offset = i / (numColors - 1);
    stops.push({ offset, color: colors[i] });
  }
  
  return stops;
}
```

---

## 类型使用最佳实践

### 1. 类型安全的几何计算

```typescript
// 创建类型安全的几何工具函数
class GeometryUtils {
  static rectFromCenter(center: Offset, size: Size): Rect {
    const halfWidth = size.width / 2;
    const halfHeight = size.height / 2;
    
    return {
      left: center.dx - halfWidth,
      top: center.dy - halfHeight,
      right: center.dx + halfWidth,
      bottom: center.dy + halfHeight
    };
  }
  
  static rectIntersection(a: Rect, b: Rect): Rect | null {
    const left = Math.max(a.left, b.left);
    const top = Math.max(a.top, b.top);
    const right = Math.min(a.right, b.right);
    const bottom = Math.min(a.bottom, b.bottom);
    
    if (left >= right || top >= bottom) {
      return null; // 无交集
    }
    
    return { left, top, right, bottom };
  }
  
  static offsetDistance(a: Offset, b: Offset): number {
    const dx = b.dx - a.dx;
    const dy = b.dy - a.dy;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
```

### 2. 样式组合和复用

```typescript
// 创建可复用的样式配置
interface PaintConfig {
  color?: Color;
  style?: PaintingStyle;
  strokeWidth?: number;
  strokeCap?: StrokeCap;
  strokeJoin?: StrokeJoin;
  blendMode?: BlendMode;
}

class PaintFactory {
  static createPaint(config: PaintConfig): Paint {
    const paint = new Paint();
    
    if (config.color) paint.color = config.color;
    if (config.style) paint.style = config.style;
    if (config.strokeWidth) paint.strokeWidth = config.strokeWidth;
    if (config.strokeCap) paint.strokeCap = config.strokeCap;
    if (config.strokeJoin) paint.strokeJoin = config.strokeJoin;
    if (config.blendMode) paint.blendMode = config.blendMode;
    
    return paint;
  }
  
  // 预定义样式
  static get defaultFill(): Paint {
    return this.createPaint({
      style: PaintingStyle.fill,
      color: Color.black
    });
  }
  
  static get defaultStroke(): Paint {
    return this.createPaint({
      style: PaintingStyle.stroke,
      strokeWidth: 1,
      strokeCap: StrokeCap.round,
      strokeJoin: StrokeJoin.round,
      color: Color.black
    });
  }
}
```

### 3. 渐变工具函数

```typescript
class GradientUtils {
  static linearGradient(
    start: Offset,
    end: Offset,
    colors: Color[],
    stops?: number[]
  ): GradientStop[] {
    const gradientStops: GradientStop[] = [];
    const numColors = colors.length;
    
    for (let i = 0; i < numColors; i++) {
      const offset = stops ? stops[i] : i / (numColors - 1);
      gradientStops.push({ offset, color: colors[i] });
    }
    
    return gradientStops;
  }
  
  static radialGradient(
    center: Offset,
    radius: number,
    colors: Color[],
    stops?: number[]
  ): GradientStop[] {
    return this.linearGradient({ dx: 0, dy: 0 }, { dx: 1, dy: 0 }, colors, stops);
  }
  
  static createRainbow(): GradientStop[] {
    return [
      { offset: 0.0, color: Color.red },
      { offset: 0.17, color: Color.orange },
      { offset: 0.33, color: Color.yellow },
      { offset: 0.5, color: Color.green },
      { offset: 0.67, color: Color.blue },
      { offset: 0.83, color: Color.purple },
      { offset: 1.0, color: Color.magenta }
    ];
  }
}
```

## 注意事项

1. **坐标系统**: 所有坐标都基于左上角为原点的坐标系
2. **数值范围**: 颜色值应在 0-255 范围内，透明度在 0.0-1.0 范围内
3. **性能考虑**: 频繁创建复杂类型对象可能影响性能，建议复用对象
4. **类型检查**: 使用 TypeScript 的严格模式以获得更好的类型安全
5. **浏览器兼容性**: 某些混合模式在旧版浏览器中可能不支持

## 导入和使用

```typescript
// 导入所有类型
import {
  Offset, Size, Rect, RRect,
  PaintingStyle, StrokeCap, StrokeJoin, BlendMode,
  PathOperation, PathFillType,
  TextAlign, FontWeight, FontStyle,
  GradientStop, TileMode
} from 'flutter-canvas-ts';

// 或者按需导入
import type { Offset, Size, Rect } from 'flutter-canvas-ts';
import { PaintingStyle, BlendMode } from 'flutter-canvas-ts';
```