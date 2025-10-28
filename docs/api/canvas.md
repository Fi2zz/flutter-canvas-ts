# Canvas 类 API 文档

Canvas 类是 Flutter Canvas TypeScript 的核心绘制类，提供了类似 Flutter 的画布绘制 API。

## 类概述

```typescript
class Canvas {
  constructor(context: CanvasRenderingContext2D, size: Size)
  
  // 属性
  get size(): Size
  
  // 状态管理
  save(): void
  restore(): void
  clear(color?: Color): void
  
  // 坐标变换
  translate(dx: number, dy: number): void
  scale(sx: number, sy?: number): void
  rotate(radians: number): void
  transform(a: number, b: number, c: number, d: number, e: number, f: number): void
  setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void
  resetTransform(): void
  
  // 基础绘制
  drawPoint(offset: Offset, paint: Paint): void
  drawPoints(points: Offset[], paint: Paint): void
  drawLine(p1: Offset, p2: Offset, paint: Paint): void
  drawRect(rect: Rect, paint: Paint): void
  drawRRect(rrect: RRect, paint: Paint): void
  drawCircle(center: Offset, radius: number, paint: Paint): void
  drawOval(rect: Rect, paint: Paint): void
  drawArc(rect: Rect, startAngle: number, sweepAngle: number, useCenter: boolean, paint: Paint): void
  
  // 路径绘制
  drawPath(path: Path, paint: Paint): void
  
  // 裁剪操作
  clipRect(rect: Rect): void
  clipRRect(rrect: RRect): void
  clipPath(path: Path): void
  
  // 工具方法
  getContext(): CanvasRenderingContext2D
}
```

## 构造函数

### `constructor(context, size)`

创建一个新的 Canvas 实例。

**参数：**
- `context: CanvasRenderingContext2D` - HTML5 Canvas 2D 渲染上下文
- `size: Size` - 画布的尺寸信息

**示例：**
```typescript
const canvasElement = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvasElement.getContext('2d')!;
const canvas = new Canvas(ctx, { width: 800, height: 600 });
```

## 属性

### `size`

获取画布尺寸信息。

**类型：** `Size`

**示例：**
```typescript
const size = canvas.size;
console.log(`画布尺寸: ${size.width} x ${size.height}`);
```

## 状态管理方法

### `save()`

保存当前绘制状态到状态栈中。

**示例：**
```typescript
canvas.save();
canvas.translate(100, 100);
canvas.rotate(Math.PI / 4);
// 进行一些绘制操作...
canvas.restore(); // 恢复到 save() 时的状态
```

### `restore()`

从状态栈中恢复之前保存的绘制状态。

### `clear(color?)`

清空画布，可选择填充指定颜色。

**参数：**
- `color?: Color` - 可选的填充颜色

**示例：**
```typescript
// 清空画布为透明
canvas.clear();

// 清空画布并填充白色
canvas.clear(Color.white);
```

## 坐标变换方法

### `translate(dx, dy)`

平移坐标系。

**参数：**
- `dx: number` - X 轴平移距离
- `dy: number` - Y 轴平移距离

**示例：**
```typescript
canvas.translate(100, 50);
// 现在 (0, 0) 点对应原来的 (100, 50) 点
```

### `scale(sx, sy?)`

缩放坐标系。

**参数：**
- `sx: number` - X 轴缩放比例
- `sy?: number` - Y 轴缩放比例（默认与 sx 相同）

**示例：**
```typescript
canvas.scale(2); // 等比例放大 2 倍
canvas.scale(2, 0.5); // X 轴放大 2 倍，Y 轴缩小一半
```

### `rotate(radians)`

旋转坐标系。

**参数：**
- `radians: number` - 旋转角度（弧度）

**示例：**
```typescript
canvas.rotate(Math.PI / 4); // 顺时针旋转 45 度
```

### `transform(a, b, c, d, e, f)`

应用变换矩阵。

**参数：**
- `a: number` - 水平缩放
- `b: number` - 水平倾斜
- `c: number` - 垂直倾斜
- `d: number` - 垂直缩放
- `e: number` - 水平平移
- `f: number` - 垂直平移

### `setTransform(a, b, c, d, e, f)`

设置变换矩阵（重置后应用）。

### `resetTransform()`

重置变换矩阵为单位矩阵。

## 基础绘制方法

### `drawPoint(offset, paint)`

绘制单个点。

**参数：**
- `offset: Offset` - 点的位置
- `paint: Paint` - 绘制样式

**示例：**
```typescript
const paint = new Paint().setColor(Color.red).setStrokeWidth(3);
canvas.drawPoint({ x: 100, y: 100 }, paint);
```

### `drawPoints(points, paint)`

绘制多个点。

**参数：**
- `points: Offset[]` - 点的位置数组
- `paint: Paint` - 绘制样式

### `drawLine(p1, p2, paint)`

绘制直线。

**参数：**
- `p1: Offset` - 起点
- `p2: Offset` - 终点
- `paint: Paint` - 绘制样式

**示例：**
```typescript
const paint = new Paint().setColor(Color.blue).setStrokeWidth(2);
canvas.drawLine({ x: 0, y: 0 }, { x: 100, y: 100 }, paint);
```

### `drawRect(rect, paint)`

绘制矩形。

**参数：**
- `rect: Rect` - 矩形区域
- `paint: Paint` - 绘制样式

**示例：**
```typescript
const paint = new Paint().setColor(Color.green);
canvas.drawRect({ left: 10, top: 10, right: 110, bottom: 60 }, paint);
```

### `drawRRect(rrect, paint)`

绘制圆角矩形。

**参数：**
- `rrect: RRect` - 圆角矩形定义
- `paint: Paint` - 绘制样式

### `drawCircle(center, radius, paint)`

绘制圆形。

**参数：**
- `center: Offset` - 圆心位置
- `radius: number` - 半径
- `paint: Paint` - 绘制样式

**示例：**
```typescript
const paint = new Paint().setColor(Color.red);
canvas.drawCircle({ x: 200, y: 100 }, 50, paint);
```

### `drawOval(rect, paint)`

绘制椭圆。

**参数：**
- `rect: Rect` - 椭圆的外接矩形
- `paint: Paint` - 绘制样式

### `drawArc(rect, startAngle, sweepAngle, useCenter, paint)`

绘制弧形。

**参数：**
- `rect: Rect` - 弧形的外接矩形
- `startAngle: number` - 起始角度（弧度）
- `sweepAngle: number` - 扫描角度（弧度）
- `useCenter: boolean` - 是否连接到中心点
- `paint: Paint` - 绘制样式

## 路径绘制方法

### `drawPath(path, paint)`

绘制路径。

**参数：**
- `path: Path` - 要绘制的路径
- `paint: Paint` - 绘制样式

**示例：**
```typescript
const path = new Path();
path.moveTo(50, 50);
path.lineTo(150, 50);
path.lineTo(100, 150);
path.close();

const paint = new Paint().setColor(Color.purple);
canvas.drawPath(path, paint);
```

## 裁剪操作方法

### `clipRect(rect)`

设置矩形裁剪区域。

**参数：**
- `rect: Rect` - 裁剪矩形

### `clipRRect(rrect)`

设置圆角矩形裁剪区域。

**参数：**
- `rrect: RRect` - 裁剪圆角矩形

### `clipPath(path)`

设置路径裁剪区域。

**参数：**
- `path: Path` - 裁剪路径

## 工具方法

### `getContext()`

获取底层的 Canvas 2D 渲染上下文。

**返回值：** `CanvasRenderingContext2D`

**示例：**
```typescript
const ctx = canvas.getContext();
// 可以直接使用原生 Canvas API
ctx.fillText('Hello World', 10, 30);
```

## 完整示例

```typescript
import { Canvas, Paint, Color, Path } from 'flutter-canvas-ts';

// 获取画布元素
const canvasElement = document.getElementById('myCanvas') as HTMLCanvasElement;
const ctx = canvasElement.getContext('2d')!;

// 创建 Canvas 实例
const canvas = new Canvas(ctx, { width: 800, height: 600 });

// 清空画布为白色
canvas.clear(Color.white);

// 创建画笔
const redPaint = new Paint()
  .setColor(Color.red)
  .setStrokeWidth(3);

const bluePaint = new Paint()
  .setColor(Color.blue)
  .setStyle('fill');

// 绘制基础图形
canvas.drawRect({ left: 50, top: 50, right: 150, bottom: 100 }, redPaint);
canvas.drawCircle({ x: 300, y: 200 }, 60, bluePaint);

// 使用变换
canvas.save();
canvas.translate(400, 300);
canvas.rotate(Math.PI / 6);
canvas.drawRect({ left: -25, top: -25, right: 25, bottom: 25 }, redPaint);
canvas.restore();

// 绘制复杂路径
const path = new Path();
path.moveTo(500, 100);
path.quadraticCurveTo(550, 50, 600, 100);
path.lineTo(580, 150);
path.close();

canvas.drawPath(path, bluePaint);
```