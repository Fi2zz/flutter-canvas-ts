# API 索引

这里是 Flutter Canvas TypeScript 库的完整 API 索引，按功能分类整理。

## 🎨 核心绘制类

### Canvas 类
**文档**: [Canvas API](./canvas.md)

| 方法 | 描述 | 参数 |
|------|------|------|
| `drawPoint` | 绘制点 | `point: Offset, paint: Paint` |
| `drawLine` | 绘制直线 | `p1: Offset, p2: Offset, paint: Paint` |
| `drawRect` | 绘制矩形 | `rect: Rect, paint: Paint` |
| `drawRRect` | 绘制圆角矩形 | `rrect: RRect, paint: Paint` |
| `drawCircle` | 绘制圆形 | `center: Offset, radius: number, paint: Paint` |
| `drawOval` | 绘制椭圆 | `rect: Rect, paint: Paint` |
| `drawArc` | 绘制弧形 | `rect: Rect, startAngle: number, sweepAngle: number, useCenter: boolean, paint: Paint` |
| `drawPath` | 绘制路径 | `path: Path, paint: Paint` |
| `drawImage` | 绘制图像 | `image: HTMLImageElement, offset: Offset, paint?: Paint` |
| `drawImageRect` | 绘制图像到矩形 | `image: HTMLImageElement, src: Rect, dst: Rect, paint?: Paint` |
| `drawText` | 绘制文本 | `text: string, offset: Offset, paint: Paint` |
| `save` | 保存状态 | - |
| `restore` | 恢复状态 | - |
| `translate` | 平移 | `dx: number, dy: number` |
| `rotate` | 旋转 | `radians: number` |
| `scale` | 缩放 | `sx: number, sy?: number` |
| `transform` | 矩阵变换 | `matrix: number[]` |
| `clipRect` | 矩形裁剪 | `rect: Rect` |
| `clipRRect` | 圆角矩形裁剪 | `rrect: RRect` |
| `clipPath` | 路径裁剪 | `path: Path` |

### Paint 类
**文档**: [Paint API](./paint.md)

| 属性/方法 | 类型 | 描述 |
|-----------|------|------|
| `color` | `Color` | 画笔颜色 |
| `style` | `PaintingStyle` | 绘制样式（填充/描边） |
| `strokeWidth` | `number` | 描边宽度 |
| `strokeCap` | `StrokeCap` | 描边端点样式 |
| `strokeJoin` | `StrokeJoin` | 描边连接样式 |
| `blendMode` | `BlendMode` | 混合模式 |
| `isAntiAlias` | `boolean` | 是否抗锯齿 |
| `setColor(color)` | `Paint` | 设置颜色（链式调用） |
| `setStyle(style)` | `Paint` | 设置样式（链式调用） |
| `setStrokeWidth(width)` | `Paint` | 设置描边宽度（链式调用） |
| `setStrokeCap(cap)` | `Paint` | 设置描边端点（链式调用） |
| `setStrokeJoin(join)` | `Paint` | 设置描边连接（链式调用） |
| `setBlendMode(mode)` | `Paint` | 设置混合模式（链式调用） |
| `setAntiAlias(antiAlias)` | `Paint` | 设置抗锯齿（链式调用） |

### Path 类
**文档**: [Path API](./path.md)

| 方法 | 描述 | 参数 |
|------|------|------|
| `moveTo` | 移动到点 | `x: number, y: number` |
| `lineTo` | 直线到点 | `x: number, y: number` |
| `relativeMoveTo` | 相对移动 | `dx: number, dy: number` |
| `relativeLineTo` | 相对直线 | `dx: number, dy: number` |
| `quadraticBezierTo` | 二次贝塞尔曲线 | `x1: number, y1: number, x2: number, y2: number` |
| `relativeQuadraticBezierTo` | 相对二次贝塞尔 | `x1: number, y1: number, x2: number, y2: number` |
| `cubicTo` | 三次贝塞尔曲线 | `x1: number, y1: number, x2: number, y2: number, x3: number, y3: number` |
| `relativeCubicTo` | 相对三次贝塞尔 | `x1: number, y1: number, x2: number, y2: number, x3: number, y3: number` |
| `arcTo` | 弧线到点 | `rect: Rect, startAngle: number, sweepAngle: number, forceMoveTo: boolean` |
| `addRect` | 添加矩形 | `rect: Rect` |
| `addRRect` | 添加圆角矩形 | `rrect: RRect` |
| `addOval` | 添加椭圆 | `rect: Rect` |
| `addCircle` | 添加圆形 | `center: Offset, radius: number` |
| `addPolygon` | 添加多边形 | `points: Offset[], close: boolean` |
| `close` | 闭合路径 | - |
| `reset` | 重置路径 | - |
| `contains` | 点是否在路径内 | `point: Offset` |
| `getBounds` | 获取边界矩形 | - |
| `getPerimeter` | 获取周长 | - |
| `intersects` | 是否与矩形相交 | `rect: Rect` |
| `applyToContext` | 应用到上下文 | `ctx: CanvasRenderingContext2D` |
| `clone` | 克隆路径 | - |
| `transform` | 变换路径 | `matrix: number[]` |

### Color 类
**文档**: [Color API](./color.md)

| 属性/方法 | 类型 | 描述 |
|-----------|------|------|
| `value` | `number` | 32位ARGB值 |
| `alpha` | `number` | Alpha通道值 (0-255) |
| `red` | `number` | 红色通道值 (0-255) |
| `green` | `number` | 绿色通道值 (0-255) |
| `blue` | `number` | 蓝色通道值 (0-255) |
| `opacity` | `number` | 不透明度 (0.0-1.0) |
| `fromARGB(a, r, g, b)` | `Color` | 从ARGB创建颜色 |
| `fromRGBO(r, g, b, opacity)` | `Color` | 从RGBO创建颜色 |
| `withOpacity(opacity)` | `Color` | 设置不透明度 |
| `withAlpha(alpha)` | `Color` | 设置Alpha值 |
| `toCssString()` | `string` | 转换为CSS字符串 |
| `toHex()` | `string` | 转换为十六进制字符串 |

**预定义颜色常量**:
`transparent`, `black`, `white`, `red`, `green`, `blue`, `yellow`, `cyan`, `magenta`, `orange`, `purple`, `pink`, `grey`, `darkGrey`, `lightGrey`

## 🔧 自定义绘制系统

### CustomPainter 抽象类
**文档**: [CustomPainter API](./custom-painter.md#custompainter-抽象基类)

| 方法 | 描述 | 参数 | 返回值 |
|------|------|------|-------|
| `paint` | 绘制方法（抽象） | `canvas: Canvas, size: Size` | `void` |
| `shouldRepaint` | 是否需要重绘 | `oldDelegate: CustomPainter` | `boolean` |
| `shouldRebuildSemantics` | 是否重建语义 | `oldDelegate: CustomPainter` | `boolean` |
| `getClipBounds` | 获取裁剪边界 | `size: Size` | `Rect \| null` |
| `hitTest` | 点击测试 | `position: Offset, size: Size` | `boolean` |

### CustomPaint 组件
**文档**: [CustomPaint API](./custom-painter.md#custompaint-绘制组件)

| 属性/方法 | 类型 | 描述 |
|-----------|------|------|
| `size` | `Size` | 组件尺寸 |
| `customPainter` | `CustomPainter \| null` | 自定义绘制器 |
| `paint()` | `void` | 执行绘制 |
| `repaint()` | `void` | 强制重绘 |
| `handleTap(position)` | `boolean` | 处理点击事件 |

### AnimatedCustomPainter 动画绘制器
**文档**: [AnimatedCustomPainter API](./custom-painter.md#animatedcustompainter-动画绘制器)

| 属性/方法 | 类型 | 描述 |
|-----------|------|------|
| `animationValue` | `number` | 动画值 (0.0-1.0) |
| `paintAnimated` | 抽象方法 | `canvas: Canvas, size: Size, animationValue: number` |

### PainterFactory 工厂类
**文档**: [PainterFactory API](./custom-painter.md#painterfactory-工厂类)

| 方法 | 描述 | 参数 | 返回值 |
|------|------|------|-------|
| `fromCanvasElement` | 从Canvas元素创建 | `painter: CustomPainter, canvasElement: HTMLCanvasElement` | `CustomPaint \| null` |

## 📋 类型定义系统

### 基础几何类型
**文档**: [基础几何类型](./types.md#基础几何类型)

| 类型 | 属性 | 描述 |
|------|------|------|
| `Offset` | `dx: number, dy: number` | 2D偏移量/坐标点 |
| `Size` | `width: number, height: number` | 2D尺寸 |
| `Rect` | `left: number, top: number, right: number, bottom: number` | 矩形区域 |
| `RRect` | `rect: Rect, tlRadius: number, trRadius: number, blRadius: number, brRadius: number` | 圆角矩形 |

### 绘制样式枚举
**文档**: [绘制样式枚举](./types.md#绘制样式枚举)

| 枚举 | 值 | 描述 |
|------|----|----- |
| `PaintingStyle` | `fill`, `stroke` | 绘制样式 |
| `StrokeCap` | `butt`, `round`, `square` | 描边端点样式 |
| `StrokeJoin` | `miter`, `round`, `bevel` | 描边连接样式 |
| `BlendMode` | 30+ 种模式 | 混合模式 |

### 路径操作枚举
**文档**: [路径操作枚举](./types.md#路径操作枚举)

| 枚举 | 值 | 描述 |
|------|----|----- |
| `PathOperation` | `difference`, `intersect`, `union`, `xor`, `reverseDifference` | 路径布尔运算 |
| `PathFillType` | `nonZero`, `evenOdd` | 路径填充规则 |

### 文本相关枚举
**文档**: [文本相关枚举](./types.md#文本相关枚举)

| 枚举 | 值 | 描述 |
|------|----|----- |
| `TextAlign` | `left`, `right`, `center`, `justify`, `start`, `end` | 文本对齐方式 |
| `FontWeight` | `w100`-`w900`, `normal`, `bold` | 字体粗细 |
| `FontStyle` | `normal`, `italic` | 字体样式 |

### 渐变相关类型
**文档**: [渐变相关类型](./types.md#渐变相关类型)

| 类型 | 属性 | 描述 |
|------|------|------|
| `GradientStop` | `offset: number, color: Color` | 渐变停止点 |
| `TileMode` | `clamp`, `repeat`, `mirror`, `decal` | 平铺模式 |

## 🔍 快速查找

### 按功能分类

#### 基础绘制
- 点: `Canvas.drawPoint`
- 线: `Canvas.drawLine`
- 矩形: `Canvas.drawRect`
- 圆形: `Canvas.drawCircle`
- 椭圆: `Canvas.drawOval`
- 弧形: `Canvas.drawArc`

#### 路径绘制
- 移动: `Path.moveTo`, `Path.relativeMoveTo`
- 直线: `Path.lineTo`, `Path.relativeLineTo`
- 曲线: `Path.quadraticBezierTo`, `Path.cubicTo`
- 几何形状: `Path.addRect`, `Path.addCircle`, `Path.addOval`

#### 颜色管理
- 创建: `Color.fromARGB`, `Color.fromRGBO`
- 变换: `Color.withOpacity`, `Color.withAlpha`
- 转换: `Color.toCssString`, `Color.toHex`

#### 坐标变换
- 平移: `Canvas.translate`
- 旋转: `Canvas.rotate`
- 缩放: `Canvas.scale`
- 矩阵: `Canvas.transform`

#### 裁剪操作
- 矩形裁剪: `Canvas.clipRect`
- 圆角矩形裁剪: `Canvas.clipRRect`
- 路径裁剪: `Canvas.clipPath`

#### 状态管理
- 保存: `Canvas.save`
- 恢复: `Canvas.restore`
- 重绘判断: `CustomPainter.shouldRepaint`

### 按使用频率排序

#### 高频使用
1. `Canvas.drawRect` - 绘制矩形
2. `Canvas.drawCircle` - 绘制圆形
3. `Paint.setColor` - 设置颜色
4. `Paint.setStyle` - 设置样式
5. `Color.fromARGB` - 创建颜色

#### 中频使用
1. `Path.moveTo` - 路径移动
2. `Path.lineTo` - 路径直线
3. `Canvas.save/restore` - 状态管理
4. `Canvas.translate` - 坐标平移
5. `CustomPainter.paint` - 自定义绘制

#### 低频使用
1. `Path.cubicTo` - 三次贝塞尔曲线
2. `Canvas.transform` - 矩阵变换
3. `Paint.setBlendMode` - 混合模式
4. `Path.intersects` - 路径相交检测
5. `CustomPainter.hitTest` - 点击测试

## 📖 相关文档

- [主文档](../README.md) - 完整的使用指南和教程
- [Canvas API](./canvas.md) - 画布绘制详细文档
- [Paint API](./paint.md) - 画笔样式详细文档
- [Path API](./path.md) - 路径绘制详细文档
- [Color API](./color.md) - 颜色管理详细文档
- [CustomPainter API](./custom-painter.md) - 自定义绘制详细文档
- [Types API](./types.md) - 类型定义详细文档

---

**提示**: 使用 `Ctrl+F` (或 `Cmd+F`) 快速搜索特定的 API 方法或属性。