# Paint 类 API 文档

Paint 类封装了绘制图形时所需的所有样式信息，类似于 Flutter 中的 Paint 类。它定义了如何绘制图形的外观，包括颜色、填充/描边样式、线条属性、混合模式等。

## 类概述

```typescript
class Paint {
  constructor()
  
  // 颜色属性
  get color(): Color
  set color(value: Color)
  
  // 绘制样式
  get style(): PaintingStyle
  set style(value: PaintingStyle)
  
  // 描边属性
  get strokeWidth(): number
  set strokeWidth(value: number)
  get strokeCap(): StrokeCap
  set strokeCap(value: StrokeCap)
  get strokeJoin(): StrokeJoin
  set strokeJoin(value: StrokeJoin)
  get strokeMiterLimit(): number
  set strokeMiterLimit(value: number)
  
  // 渲染属性
  get blendMode(): BlendMode
  set blendMode(value: BlendMode)
  get isAntiAlias(): boolean
  set isAntiAlias(value: boolean)
  
  // 方法
  applyToContext(ctx: CanvasRenderingContext2D): void
  clone(): Paint
  reset(): void
}
```

## 构造函数

### `constructor()`

创建具有默认样式的 Paint 实例。

**默认样式：**
- 颜色：黑色
- 样式：填充 (`'fill'`)
- 描边宽度：0
- 描边端点：平头 (`'butt'`)
- 描边连接：斜接 (`'miter'`)
- 斜接限制：4.0
- 混合模式：源覆盖 (`'srcOver'`)
- 抗锯齿：启用

**示例：**
```typescript
const paint = new Paint();
console.log(paint.color);  // Color.black
console.log(paint.style);  // 'fill'
console.log(paint.isAntiAlias);  // true
```

## 颜色属性

### `color`

获取或设置绘制颜色。

**类型：** `Color`

**示例：**
```typescript
const paint = new Paint();

// 设置为预定义颜色
paint.color = Color.blue;

// 设置为自定义颜色
paint.color = Color.fromARGB(255, 128, 64, 192);

// 设置为半透明颜色
paint.color = Color.red.withOpacity(0.5);

// 获取颜色信息
console.log(paint.color.red);    // 红色分量
console.log(paint.color.alpha);  // 透明度分量
```

## 绘制样式属性

### `style`

获取或设置绘制样式。

**类型：** `PaintingStyle` (`'fill'` | `'stroke'`)

**值说明：**
- `'fill'` - 填充模式，绘制实心图形
- `'stroke'` - 描边模式，只绘制图形轮廓

**示例：**
```typescript
const paint = new Paint();

// 填充模式（默认）
paint.style = 'fill';

// 描边模式
paint.style = 'stroke';
paint.strokeWidth = 2;  // 描边模式下需要设置线宽
```

## 描边属性

### `strokeWidth`

获取或设置描边宽度。仅在描边模式下有效。

**类型：** `number`

**示例：**
```typescript
const paint = new Paint();
paint.style = 'stroke';
paint.strokeWidth = 3;  // 设置线宽为 3 像素
```

### `strokeCap`

获取或设置描边端点样式。

**类型：** `StrokeCap` (`'butt'` | `'round'` | `'square'`)

**值说明：**
- `'butt'` - 平头端点（默认）
- `'round'` - 圆形端点
- `'square'` - 方形端点

**示例：**
```typescript
const paint = new Paint();
paint.style = 'stroke';
paint.strokeWidth = 5;

// 不同的端点样式
paint.strokeCap = 'butt';    // 平头
paint.strokeCap = 'round';   // 圆头
paint.strokeCap = 'square';  // 方头
```

### `strokeJoin`

获取或设置描边连接样式。

**类型：** `StrokeJoin` (`'miter'` | `'round'` | `'bevel'`)

**值说明：**
- `'miter'` - 尖角连接（默认）
- `'round'` - 圆角连接
- `'bevel'` - 斜角连接

**示例：**
```typescript
const paint = new Paint();
paint.style = 'stroke';
paint.strokeWidth = 5;

// 不同的连接样式
paint.strokeJoin = 'miter';  // 尖角
paint.strokeJoin = 'round';  // 圆角
paint.strokeJoin = 'bevel';  // 斜角
```

### `strokeMiterLimit`

获取或设置斜接限制。控制尖角连接的最大长度。

**类型：** `number`

**默认值：** `4.0`

**示例：**
```typescript
const paint = new Paint();
paint.style = 'stroke';
paint.strokeJoin = 'miter';
paint.strokeMiterLimit = 10;  // 允许更长的尖角
```

## 渲染属性

### `blendMode`

获取或设置混合模式。控制新绘制内容与现有内容的混合方式。

**类型：** `BlendMode`

**常用值：**
- `'srcOver'` - 源覆盖（默认）
- `'multiply'` - 正片叠底
- `'screen'` - 滤色
- `'overlay'` - 叠加
- `'darken'` - 变暗
- `'lighten'` - 变亮

**示例：**
```typescript
const paint = new Paint();
paint.blendMode = 'multiply';  // 正片叠底混合
```

### `isAntiAlias`

获取或设置抗锯齿开关。控制是否启用平滑渲染。

**类型：** `boolean`

**默认值：** `true`

**示例：**
```typescript
const paint = new Paint();
paint.isAntiAlias = false;  // 关闭抗锯齿，获得像素级精确绘制
```

## 方法

### `applyToContext(ctx)`

将当前 Paint 的样式应用到 Canvas 2D 渲染上下文。

**参数：**
- `ctx: CanvasRenderingContext2D` - Canvas 2D 渲染上下文

**示例：**
```typescript
const paint = new Paint();
paint.color = Color.red;
paint.style = 'stroke';
paint.strokeWidth = 3;

// 应用样式到上下文
paint.applyToContext(ctx);

// 现在可以使用原生 Canvas API 绘制
ctx.strokeRect(10, 10, 100, 100);
```

### `clone()`

创建当前 Paint 实例的深拷贝。

**返回值：** `Paint` - 新的 Paint 实例

**示例：**
```typescript
const originalPaint = new Paint();
originalPaint.color = Color.blue;
originalPaint.strokeWidth = 5;

const clonedPaint = originalPaint.clone();
clonedPaint.color = Color.red;  // 修改克隆实例不会影响原实例

console.log(originalPaint.color);  // Color.blue（未改变）
console.log(clonedPaint.color);    // Color.red
```

### `reset()`

重置 Paint 实例到默认状态。

**示例：**
```typescript
const paint = new Paint();
paint.color = Color.red;
paint.style = 'stroke';
paint.strokeWidth = 10;

paint.reset();

// 现在所有属性都恢复到默认值
console.log(paint.color);       // Color.black
console.log(paint.style);       // 'fill'
console.log(paint.strokeWidth); // 0
```

## 链式调用支持

Paint 类支持链式调用，可以更流畅地设置多个属性：

```typescript
const paint = new Paint()
  .setColor(Color.blue)
  .setStyle('stroke')
  .setStrokeWidth(3)
  .setStrokeCap('round')
  .setStrokeJoin('round');
```

## 完整示例

### 基础使用

```typescript
import { Paint, Color } from 'flutter-canvas-ts';

// 创建填充画笔
const fillPaint = new Paint();
fillPaint.color = Color.red;
fillPaint.style = 'fill';

// 创建描边画笔
const strokePaint = new Paint();
strokePaint.color = Color.blue;
strokePaint.style = 'stroke';
strokePaint.strokeWidth = 2;
strokePaint.strokeCap = 'round';
strokePaint.strokeJoin = 'round';

// 应用到画布
fillPaint.applyToContext(ctx);
ctx.fillRect(10, 10, 100, 100);

strokePaint.applyToContext(ctx);
ctx.strokeRect(120, 10, 100, 100);
```

### 高级样式

```typescript
import { Paint, Color } from 'flutter-canvas-ts';

// 创建带特效的画笔
const fancyPaint = new Paint();
fancyPaint.color = Color.fromARGB(128, 255, 0, 255);  // 半透明紫色
fancyPaint.style = 'stroke';
fancyPaint.strokeWidth = 5;
fancyPaint.strokeCap = 'round';
fancyPaint.strokeJoin = 'round';
fancyPaint.blendMode = 'multiply';
fancyPaint.isAntiAlias = true;

// 克隆并修改
const shadowPaint = fancyPaint.clone();
shadowPaint.color = Color.black.withOpacity(0.3);
shadowPaint.blendMode = 'multiply';
```

### 动态样式切换

```typescript
import { Paint, Color } from 'flutter-canvas-ts';

const paint = new Paint();

// 绘制填充矩形
paint.color = Color.red;
paint.style = 'fill';
paint.applyToContext(ctx);
ctx.fillRect(10, 10, 100, 100);

// 切换到描边模式
paint.style = 'stroke';
paint.strokeWidth = 3;
paint.color = Color.blue;
paint.applyToContext(ctx);
ctx.strokeRect(120, 10, 100, 100);

// 重置并使用新样式
paint.reset();
paint.color = Color.green;
paint.style = 'fill';
paint.applyToContext(ctx);
ctx.fillRect(230, 10, 100, 100);
```