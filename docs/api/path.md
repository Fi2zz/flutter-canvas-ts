# Path 类 API 文档

Path 类提供了一个强大的路径构建系统，类似于 Flutter 中的 Path 类。它允许创建复杂的 2D 图形路径，包括直线、曲线、弧形和各种几何形状。

## 类概述

```typescript
class Path {
  constructor()
  
  // 属性
  get fillType(): PathFillType
  set fillType(value: PathFillType)
  
  // 基本路径操作
  moveTo(x: number, y: number): void
  relativeMoveTo(dx: number, dy: number): void
  lineTo(x: number, y: number): void
  relativeLineTo(dx: number, dy: number): void
  
  // 曲线操作
  quadraticBezierTo(x1: number, y1: number, x2: number, y2: number): void
  relativeQuadraticBezierTo(x1: number, y1: number, x2: number, y2: number): void
  cubicTo(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): void
  relativeCubicTo(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): void
  
  // 弧形操作
  arcTo(rect: Rect, startAngle: number, sweepAngle: number, forceMoveTo: boolean): void
  
  // 几何形状
  addRect(rect: Rect): void
  addRRect(rrect: RRect): void
  addOval(rect: Rect): void
  addCircle(center: Offset, radius: number): void
  addPolygon(points: Offset[], close: boolean): void
  
  // 路径管理
  close(): void
  reset(): void
  
  // 几何计算
  contains(point: Offset): boolean
  getBounds(): Rect
  getPerimeter(): number
  intersects(other: Path): boolean
  
  // 路径操作
  applyToContext(ctx: CanvasRenderingContext2D): void
  clone(): Path
  transform(matrix: number[]): Path
  
  // 静态方法
  static combine(operation: PathOperation, path1: Path, path2: Path): Path
}
```

## 构造函数

### `constructor()`

创建一个空的路径实例。

**示例：**
```typescript
const path = new Path();
console.log(path.fillType); // 'nonZero'

// 开始构建路径
path.moveTo(50, 50);
path.lineTo(100, 100);
path.close();
```

## 属性

### `fillType`

获取或设置路径填充类型。

**类型：** `PathFillType` (`'nonZero'` | `'evenOdd'`)

**值说明：**
- `'nonZero'` - 非零环绕规则（默认）
- `'evenOdd'` - 奇偶规则

**示例：**
```typescript
const path = new Path();
path.fillType = 'evenOdd';  // 使用奇偶填充规则
```

## 基本路径操作

### `moveTo(x, y)`

移动到指定点，不绘制线条。

**参数：**
- `x: number` - X 坐标
- `y: number` - Y 坐标

**示例：**
```typescript
const path = new Path();
path.moveTo(100, 100);  // 移动到 (100, 100)
```

### `relativeMoveTo(dx, dy)`

相对当前点移动指定距离。

**参数：**
- `dx: number` - X 轴偏移
- `dy: number` - Y 轴偏移

**示例：**
```typescript
const path = new Path();
path.moveTo(100, 100);
path.relativeMoveTo(50, 30);  // 移动到 (150, 130)
```

### `lineTo(x, y)`

从当前点绘制直线到指定点。

**参数：**
- `x: number` - 目标 X 坐标
- `y: number` - 目标 Y 坐标

**示例：**
```typescript
const path = new Path();
path.moveTo(50, 50);
path.lineTo(150, 100);  // 绘制直线
```

### `relativeLineTo(dx, dy)`

从当前点绘制相对直线。

**参数：**
- `dx: number` - X 轴偏移
- `dy: number` - Y 轴偏移

**示例：**
```typescript
const path = new Path();
path.moveTo(50, 50);
path.relativeLineTo(100, 50);  // 绘制到 (150, 100)
```

## 曲线操作

### `quadraticBezierTo(x1, y1, x2, y2)`

绘制二次贝塞尔曲线。

**参数：**
- `x1: number` - 控制点 X 坐标
- `y1: number` - 控制点 Y 坐标
- `x2: number` - 终点 X 坐标
- `y2: number` - 终点 Y 坐标

**示例：**
```typescript
const path = new Path();
path.moveTo(50, 100);
path.quadraticBezierTo(100, 50, 150, 100);  // 绘制弯曲线条
```

### `relativeQuadraticBezierTo(x1, y1, x2, y2)`

绘制相对二次贝塞尔曲线。

### `cubicTo(x1, y1, x2, y2, x3, y3)`

绘制三次贝塞尔曲线。

**参数：**
- `x1: number` - 第一个控制点 X 坐标
- `y1: number` - 第一个控制点 Y 坐标
- `x2: number` - 第二个控制点 X 坐标
- `y2: number` - 第二个控制点 Y 坐标
- `x3: number` - 终点 X 坐标
- `y3: number` - 终点 Y 坐标

**示例：**
```typescript
const path = new Path();
path.moveTo(50, 100);
path.cubicTo(75, 50, 125, 50, 150, 100);  // S 形曲线
```

### `relativeCubicTo(x1, y1, x2, y2, x3, y3)`

绘制相对三次贝塞尔曲线。

## 弧形操作

### `arcTo(rect, startAngle, sweepAngle, forceMoveTo)`

绘制弧形。

**参数：**
- `rect: Rect` - 弧形的外接矩形
- `startAngle: number` - 起始角度（弧度）
- `sweepAngle: number` - 扫描角度（弧度）
- `forceMoveTo: boolean` - 是否强制移动到起点

**示例：**
```typescript
const path = new Path();
const rect = { left: 50, top: 50, right: 150, bottom: 150 };
path.arcTo(rect, 0, Math.PI, false);  // 半圆弧
```

## 几何形状

### `addRect(rect)`

添加矩形到路径。

**参数：**
- `rect: Rect` - 矩形定义

**示例：**
```typescript
const path = new Path();
path.addRect({ left: 10, top: 10, right: 110, bottom: 60 });
```

### `addRRect(rrect)`

添加圆角矩形到路径。

**参数：**
- `rrect: RRect` - 圆角矩形定义

### `addOval(rect)`

添加椭圆到路径。

**参数：**
- `rect: Rect` - 椭圆的外接矩形

**示例：**
```typescript
const path = new Path();
path.addOval({ left: 50, top: 50, right: 150, bottom: 100 });
```

### `addCircle(center, radius)`

添加圆形到路径。

**参数：**
- `center: Offset` - 圆心位置
- `radius: number` - 半径

**示例：**
```typescript
const path = new Path();
path.addCircle({ dx: 100, dy: 100 }, 50);
```

### `addPolygon(points, close)`

添加多边形到路径。

**参数：**
- `points: Offset[]` - 顶点数组
- `close: boolean` - 是否闭合路径

**示例：**
```typescript
const path = new Path();
const triangle = [
  { dx: 100, dy: 50 },
  { dx: 50, dy: 150 },
  { dx: 150, dy: 150 }
];
path.addPolygon(triangle, true);
```

## 路径管理

### `close()`

闭合当前路径。

**示例：**
```typescript
const path = new Path();
path.moveTo(50, 50);
path.lineTo(150, 50);
path.lineTo(100, 150);
path.close();  // 自动连接到起点
```

### `reset()`

重置路径，清除所有命令。

**示例：**
```typescript
const path = new Path();
path.addRect({ left: 0, top: 0, right: 100, bottom: 100 });
path.reset();  // 路径现在为空
```

## 几何计算

### `contains(point)`

检查点是否在路径内部。

**参数：**
- `point: Offset` - 要检查的点

**返回值：** `boolean`

**示例：**
```typescript
const path = new Path();
path.addCircle({ dx: 100, dy: 100 }, 50);

const isInside = path.contains({ dx: 100, dy: 100 });  // true
const isOutside = path.contains({ dx: 200, dy: 200 }); // false
```

### `getBounds()`

获取路径的边界矩形。

**返回值：** `Rect`

**示例：**
```typescript
const path = new Path();
path.addCircle({ dx: 100, dy: 100 }, 50);

const bounds = path.getBounds();
// bounds: { left: 50, top: 50, right: 150, bottom: 150 }
```

### `getPerimeter()`

计算路径的周长。

**返回值：** `number`

**示例：**
```typescript
const path = new Path();
path.addCircle({ dx: 0, dy: 0 }, 50);

const perimeter = path.getPerimeter();
// 约等于 2 * Math.PI * 50 = 314.16
```

### `intersects(other)`

检查两个路径是否相交。

**参数：**
- `other: Path` - 另一个路径

**返回值：** `boolean`

## 路径操作

### `applyToContext(ctx)`

将路径应用到 Canvas 2D 上下文。

**参数：**
- `ctx: CanvasRenderingContext2D` - Canvas 2D 上下文

**示例：**
```typescript
const path = new Path();
path.addRect({ left: 10, top: 10, right: 110, bottom: 60 });

path.applyToContext(ctx);
ctx.fill();  // 填充路径
```

### `clone()`

创建路径的深拷贝。

**返回值：** `Path`

**示例：**
```typescript
const originalPath = new Path();
originalPath.addCircle({ dx: 100, dy: 100 }, 50);

const clonedPath = originalPath.clone();
// 修改克隆路径不会影响原路径
```

### `transform(matrix)`

应用变换矩阵到路径。

**参数：**
- `matrix: number[]` - 6 元素变换矩阵 [a, b, c, d, e, f]

**返回值：** `Path` - 变换后的新路径

**示例：**
```typescript
const path = new Path();
path.addRect({ left: 0, top: 0, right: 100, bottom: 100 });

// 放大 2 倍
const scaledPath = path.transform([2, 0, 0, 2, 0, 0]);

// 旋转 45 度
const cos45 = Math.cos(Math.PI / 4);
const sin45 = Math.sin(Math.PI / 4);
const rotatedPath = path.transform([cos45, sin45, -sin45, cos45, 0, 0]);
```

## 静态方法

### `Path.combine(operation, path1, path2)`

合并两个路径。

**参数：**
- `operation: PathOperation` - 合并操作类型
- `path1: Path` - 第一个路径
- `path2: Path` - 第二个路径

**返回值：** `Path` - 合并后的路径

**操作类型：**
- `'union'` - 并集
- `'intersect'` - 交集
- `'difference'` - 差集
- `'xor'` - 异或

**示例：**
```typescript
const rect1 = new Path();
rect1.addRect({ left: 0, top: 0, right: 100, bottom: 100 });

const rect2 = new Path();
rect2.addRect({ left: 50, top: 50, right: 150, bottom: 150 });

// 合并两个矩形
const union = Path.combine('union', rect1, rect2);

// 获取交集
const intersection = Path.combine('intersect', rect1, rect2);
```

## 完整示例

### 基础路径绘制

```typescript
import { Path, Canvas, Paint, Color } from 'flutter-canvas-ts';

// 创建简单路径
const path = new Path();
path.moveTo(50, 50);
path.lineTo(150, 50);
path.lineTo(100, 150);
path.close();

// 绘制路径
const paint = new Paint();
paint.color = Color.blue;
paint.style = 'fill';

canvas.drawPath(path, paint);
```

### 复杂曲线路径

```typescript
// 创建心形路径
const heartPath = new Path();
heartPath.moveTo(100, 150);
heartPath.cubicTo(100, 120, 70, 120, 70, 150);
heartPath.cubicTo(70, 180, 100, 200, 100, 230);
heartPath.cubicTo(100, 200, 130, 180, 130, 150);
heartPath.cubicTo(130, 120, 100, 120, 100, 150);
heartPath.close();

// 应用变换
const scaledHeart = heartPath.transform([1.5, 0, 0, 1.5, 50, 50]);
```

### 星形路径

```typescript
// 创建五角星
const starPath = new Path();
const center = { dx: 100, dy: 100 };
const outerRadius = 50;
const innerRadius = 25;
const points = 5;

for (let i = 0; i < points * 2; i++) {
  const angle = (i * Math.PI) / points;
  const radius = i % 2 === 0 ? outerRadius : innerRadius;
  const x = center.dx + radius * Math.cos(angle - Math.PI / 2);
  const y = center.dy + radius * Math.sin(angle - Math.PI / 2);
  
  if (i === 0) {
    starPath.moveTo(x, y);
  } else {
    starPath.lineTo(x, y);
  }
}
starPath.close();
```

### 路径运算

```typescript
// 创建两个重叠的圆
const circle1 = new Path();
circle1.addCircle({ dx: 100, dy: 100 }, 50);

const circle2 = new Path();
circle2.addCircle({ dx: 150, dy: 100 }, 50);

// 各种路径运算
const union = Path.combine('union', circle1, circle2);        // 并集
const intersection = Path.combine('intersect', circle1, circle2); // 交集
const difference = Path.combine('difference', circle1, circle2);  // 差集
const xor = Path.combine('xor', circle1, circle2);               // 异或

// 检查几何属性
const bounds = union.getBounds();
const perimeter = union.getPerimeter();
const containsPoint = union.contains({ dx: 125, dy: 100 });
```