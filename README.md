# Flutter Canvas TypeScript

一个 TypeScript 实现的 Flutter painting 库，提供了类似 Flutter 的绘制 API，可以在 Web 环境中使用。

## 🚀 特性

- **完整的绘制 API**: 提供类似 Flutter 的 Canvas、Paint、Path 等核心类
- **类型安全**: 完全使用 TypeScript 编写，提供完整的类型定义
- **自定义绘制器**: 支持 CustomPainter 抽象类，便于创建复杂的绘制逻辑
- **动画支持**: 内置动画绘制器基类，支持动画效果
- **Web 兼容**: 基于 HTML5 Canvas API，在所有现代浏览器中运行

## 📦 安装

```bash
npm install flutter-canvas-ts
```

## 🎯 快速开始

### 基本使用

```typescript
import {
  Canvas,
  Paint,
  Color,
  PaintingUtils,
  PaintingStyle,
} from "flutter-canvas-ts";

// 获取 Canvas 元素和上下文
const canvasElement = document.getElementById("myCanvas") as HTMLCanvasElement;
const ctx = canvasElement.getContext("2d")!;
const size = { width: canvasElement.width, height: canvasElement.height };

// 创建 Canvas 实例
const canvas = new Canvas(ctx, size);

// 创建画笔
const paint = new Paint();
paint.color = Color.blue;
paint.style = PaintingStyle.fill;

// 绘制矩形
const rect = PaintingUtils.rectFromLTWH(50, 50, 100, 80);
canvas.drawRect(rect, paint);

// 绘制圆形
const center = PaintingUtils.offset(200, 100);
canvas.drawCircle(center, 40, paint);
```

### 使用自定义绘制器

```typescript
import { CustomPainter, PainterFactory } from "flutter-canvas-ts";

class MyPainter extends CustomPainter {
  paint(canvas: Canvas, size: Size): void {
    // 创建渐变背景
    const ctx = canvas.getContext();
    const gradient = ctx.createLinearGradient(0, 0, size.width, size.height);
    gradient.addColorStop(0, Color.red.toCssString());
    gradient.addColorStop(1, Color.blue.toCssString());

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size.width, size.height);

    // 绘制白色圆形
    const paint = new Paint();
    paint.color = Color.white.withOpacity(0.8);
    paint.style = PaintingStyle.fill;

    canvas.drawCircle(
      PaintingUtils.offset(size.width / 2, size.height / 2),
      50,
      paint
    );
  }
}

// 使用绘制器
const painter = new MyPainter();
const customPaint = PainterFactory.fromCanvasElement(painter, canvasElement);
customPaint?.paint();
```

### 复杂路径绘制

```typescript
import { Path, PathFillType } from "flutter-canvas-ts";

// 创建自定义路径
const path = new Path();
path.moveTo(100, 100);
path.lineTo(200, 100);
path.quadraticBezierTo(250, 150, 200, 200);
path.lineTo(100, 200);
path.close();

// 设置填充规则
path.fillType = PathFillType.evenOdd;

// 绘制路径
const paint = new Paint();
paint.color = Color.green;
paint.style = PaintingStyle.fill;

canvas.drawPath(path, paint);
```

### 动画绘制

```typescript
import { AnimatedCustomPainter } from "flutter-canvas-ts";

class AnimatedCirclePainter extends AnimatedCustomPainter {
  paintAnimated(canvas: Canvas, size: Size, animationValue: number): void {
    // 清空画布
    canvas.clear();

    // 根据动画值改变颜色和大小
    const paint = new Paint();
    paint.color = Color.fromRGBO(
      Math.round(255 * animationValue),
      Math.round(255 * (1 - animationValue)),
      128,
      1.0
    );
    paint.style = PaintingStyle.fill;

    const radius = 20 + animationValue * 50;
    const center = PaintingUtils.offset(size.width / 2, size.height / 2);

    canvas.drawCircle(center, radius, paint);
  }
}

// 使用动画绘制器
const animatedPainter = new AnimatedCirclePainter();
const customPaint = PainterFactory.fromCanvasElement(
  animatedPainter,
  canvasElement
);

// 动画循环
function animate() {
  const time = Date.now() * 0.001;
  const animationValue = (Math.sin(time) + 1) / 2; // 0-1 之间的值

  animatedPainter.animationValue = animationValue;
  customPaint?.repaint();

  requestAnimationFrame(animate);
}

animate();
```

## 📚 API 文档

### 核心类

#### Canvas

提供绘制图形的接口，类似 Flutter 的 Canvas。

**主要方法:**

- `drawRect(rect, paint)` - 绘制矩形
- `drawCircle(center, radius, paint)` - 绘制圆形
- `drawPath(path, paint)` - 绘制路径
- `drawLine(p1, p2, paint)` - 绘制直线
- `save()` / `restore()` - 保存/恢复绘制状态
- `translate(dx, dy)` - 平移坐标系
- `scale(sx, sy)` - 缩放坐标系
- `rotate(radians)` - 旋转坐标系

#### Paint

定义绘制样式，类似 Flutter 的 Paint。

**主要属性:**

- `color` - 颜色
- `style` - 绘制样式（填充/描边）
- `strokeWidth` - 线条宽度
- `strokeCap` - 线条端点样式
- `strokeJoin` - 线条连接样式
- `blendMode` - 混合模式

#### Color

颜色类，提供颜色操作方法。

**主要方法:**

- `Color.fromARGB(a, r, g, b)` - 从 ARGB 创建颜色
- `Color.fromRGBO(r, g, b, opacity)` - 从 RGBO 创建颜色
- `withOpacity(opacity)` - 调整透明度
- `toCssString()` - 转换为 CSS 颜色字符串

#### Path

路径类，用于创建复杂的绘制路径。

**主要方法:**

- `moveTo(x, y)` - 移动到指定点
- `lineTo(x, y)` - 绘制直线到指定点
- `quadraticBezierTo(x1, y1, x2, y2)` - 绘制二次贝塞尔曲线
- `cubicTo(x1, y1, x2, y2, x3, y3)` - 绘制三次贝塞尔曲线
- `addRect(rect)` - 添加矩形路径
- `addCircle(center, radius)` - 添加圆形路径
- `close()` - 闭合路径

#### CustomPainter

自定义绘制器抽象类。

**需要实现的方法:**

- `paint(canvas, size)` - 绘制方法
- `shouldRepaint(oldDelegate)` - 判断是否需要重新绘制

### 工具类

#### PaintingUtils

提供常用的几何对象创建方法。

**主要方法:**

- `offset(dx, dy)` - 创建偏移量
- `size(width, height)` - 创建尺寸
- `rect(left, top, right, bottom)` - 创建矩形
- `rectFromLTWH(left, top, width, height)` - 从左上角和宽高创建矩形
- `rectFromCenter(center, width, height)` - 从中心点创建矩形

## 🎨 示例

查看 `src/examples/` 目录中的示例文件：

- `basic-shapes.ts` - 基本图形绘制示例
- `demo.html` - 完整的 HTML 演示页面

## 🔧 开发

```bash
# 安装依赖
npm install

# 编译 TypeScript
npm run build

# 运行测试
npm test
```

## 📄 许可证

ISC License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 支持

如果你在使用过程中遇到问题，请：

1. 查看示例代码
2. 阅读 API 文档
3. 提交 Issue

---

**注意**: 这个库是 Flutter painting API 的 TypeScript 实现，主要用于 Web 环境。如果你需要在 Flutter 应用中进行绘制，请使用 Flutter 官方的 painting API。
