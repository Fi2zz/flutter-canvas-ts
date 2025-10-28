# Flutter Canvas TypeScript API 文档

欢迎使用 Flutter Canvas TypeScript 的 API 文档！这是一个为 Web 环境提供类似 Flutter 绘制 API 的 TypeScript 库。

## 📚 完整文档导航

### 🎨 核心绘制 API
| 类名 | 描述 | 主要功能 |
|------|------|----------|
| [Canvas](./api/canvas.md) | 画布绘制核心类 | 图形绘制、坐标变换、状态管理 |
| [Paint](./api/paint.md) | 画笔样式配置类 | 颜色、描边、填充、混合模式 |
| [Path](./api/path.md) | 路径绘制类 | 复杂路径、贝塞尔曲线、几何形状 |
| [Color](./api/color.md) | 颜色管理类 | 颜色创建、转换、预定义常量 |

### 🔧 自定义绘制系统
| 类名 | 描述 | 适用场景 |
|------|------|----------|
| [CustomPainter](./api/custom-painter.md#custompainter-抽象基类) | 自定义绘制器基类 | 复杂绘制逻辑、交互式图形 |
| [CustomPaint](./api/custom-painter.md#custompaint-绘制组件) | 绘制组件包装器 | 绘制管理、事件处理 |
| [AnimatedCustomPainter](./api/custom-painter.md#animatedcustompainter-动画绘制器) | 动画绘制器 | 动画效果、过渡动画 |
| [PainterFactory](./api/custom-painter.md#painterfactory-工厂类) | 绘制器工厂 | 便捷创建、实例管理 |

### 📋 类型定义系统
| 分类 | 描述 | 包含类型 |
|------|------|----------|
| [基础几何类型](./api/types.md#基础几何类型) | 位置、尺寸、区域定义 | Offset, Size, Rect, RRect |
| [绘制样式枚举](./api/types.md#绘制样式枚举) | 绘制选项和模式 | PaintingStyle, StrokeCap, StrokeJoin, BlendMode |
| [路径操作枚举](./api/types.md#路径操作枚举) | 路径布尔运算 | PathOperation, PathFillType |
| [文本相关枚举](./api/types.md#文本相关枚举) | 文本样式设置 | TextAlign, FontWeight, FontStyle |
| [渐变相关类型](./api/types.md#渐变相关类型) | 颜色渐变定义 | GradientStop, TileMode |

## 🚀 快速开始指南

### 基础绘制示例

```typescript
import { Canvas, Paint, Color, PaintingStyle } from 'flutter-canvas-ts';

// 获取 Canvas 元素
const canvasElement = document.getElementById('myCanvas') as HTMLCanvasElement;
const ctx = canvasElement.getContext('2d')!;
const size = { width: canvasElement.width, height: canvasElement.height };

// 创建 Canvas 实例
const canvas = new Canvas(ctx, size);

// 创建填充画笔
const fillPaint = new Paint();
fillPaint.color = Color.blue;
fillPaint.style = PaintingStyle.fill;

// 创建描边画笔
const strokePaint = new Paint();
strokePaint.color = Color.red;
strokePaint.style = PaintingStyle.stroke;
strokePaint.strokeWidth = 3;

// 绘制图形
canvas.drawRect({ left: 50, top: 50, right: 150, bottom: 100 }, fillPaint);
canvas.drawCircle({ dx: 200, dy: 100 }, 40, strokePaint);
```

### 路径绘制示例

```typescript
import { Path, Color, PaintingStyle } from 'flutter-canvas-ts';

// 创建复杂路径
const path = new Path();
path.moveTo(100, 100);
path.lineTo(200, 100);
path.quadraticBezierTo(250, 50, 300, 100);
path.lineTo(300, 200);
path.close();

// 创建画笔
const paint = new Paint();
paint.color = Color.green;
paint.style = PaintingStyle.fill;

// 绘制路径
canvas.drawPath(path, paint);
```

### 自定义绘制器示例

```typescript
import { CustomPainter, CustomPaint, PainterFactory } from 'flutter-canvas-ts';

class CirclePainter extends CustomPainter {
  constructor(private color: Color, private radius: number) {
    super();
  }

  paint(canvas: Canvas, size: Size): void {
    const paint = new Paint();
    paint.color = this.color;
    paint.style = PaintingStyle.fill;

    const center = { dx: size.width / 2, dy: size.height / 2 };
    canvas.drawCircle(center, this.radius, paint);
  }

  shouldRepaint(oldDelegate: CustomPainter): boolean {
    return oldDelegate instanceof CirclePainter &&
           (this.color !== oldDelegate.color || this.radius !== oldDelegate.radius);
  }
}

// 使用自定义绘制器
const painter = new CirclePainter(Color.purple, 50);
const customPaint = PainterFactory.fromCanvasElement(painter, canvasElement);
customPaint?.paint();
```

## 📖 核心特性详解

### 🎨 绘制功能
- **基础图形**：点、线、矩形、圆形、椭圆、弧形
- **复杂路径**：贝塞尔曲线、多边形、自定义形状
- **坐标变换**：平移、旋转、缩放、矩阵变换
- **裁剪操作**：矩形、圆角矩形、路径裁剪

### 🎯 画笔系统
- **颜色管理**：RGB、RGBA、HSL、命名颜色、透明度控制
- **描边样式**：线宽、端点样式、连接样式、虚线模式
- **填充模式**：实心填充、描边、渐变填充
- **混合模式**：30+ 种混合效果，支持特殊视觉效果

### 🔧 高级功能
- **自定义绘制器**：类似 Flutter 的 CustomPainter 架构
- **动画支持**：内置动画绘制器，支持流畅动画
- **交互检测**：点击测试、边界检测、碰撞检测
- **性能优化**：智能重绘、状态管理、内存优化

### 🛡️ 类型安全
- **完整类型定义**：所有 API 都有详细的 TypeScript 类型
- **编译时检查**：避免运行时错误，提高开发效率
- **智能提示**：IDE 自动补全和参数提示
- **文档集成**：JSDoc 注释提供详细说明

## 🛠️ 安装和配置

### NPM 安装
```bash
npm install flutter-canvas-ts
```

### 基础导入
```typescript
// 导入核心类
import { Canvas, Paint, Color, Path } from 'flutter-canvas-ts';

// 导入类型定义
import type { Offset, Size, Rect, PaintingStyle } from 'flutter-canvas-ts';

// 导入自定义绘制相关
import { CustomPainter, CustomPaint, AnimatedCustomPainter } from 'flutter-canvas-ts';
```

### HTML 设置
```html
<!DOCTYPE html>
<html>
<head>
    <title>Flutter Canvas TypeScript</title>
</head>
<body>
    <canvas id="myCanvas" width="800" height="600"></canvas>
    <script src="your-app.js"></script>
</body>
</html>
```

## 📚 学习路径建议

### 🔰 初学者路径
1. **基础概念** - 阅读 [Canvas](./api/canvas.md) 和 [Paint](./api/paint.md) 文档
2. **简单绘制** - 学习基础图形绘制方法
3. **颜色系统** - 掌握 [Color](./api/color.md) 类的使用
4. **类型系统** - 了解 [基础几何类型](./api/types.md#基础几何类型)

### 🚀 进阶路径
1. **路径绘制** - 深入学习 [Path](./api/path.md) 类的高级功能
2. **坐标变换** - 掌握复杂的变换操作
3. **混合模式** - 学习各种 [BlendMode](./api/types.md#blendmode-枚举) 效果
4. **性能优化** - 了解重绘机制和优化技巧

### 🎯 专家路径
1. **自定义绘制** - 创建复杂的 [CustomPainter](./api/custom-painter.md)
2. **动画系统** - 使用 [AnimatedCustomPainter](./api/custom-painter.md#animatedcustompainter-动画绘制器)
3. **交互处理** - 实现点击检测和用户交互
4. **架构设计** - 构建可维护的绘制系统

## 🎯 实际应用场景

### 📊 数据可视化
- 图表绘制（柱状图、饼图、折线图）
- 实时数据展示
- 交互式仪表盘

### 🎮 游戏开发
- 2D 游戏图形
- 粒子效果
- 动画系统

### 🎨 创意工具
- 绘图应用
- 图像编辑器
- 设计工具

### 📱 UI 组件
- 自定义控件
- 进度指示器
- 装饰性图形

## 📝 示例和教程

每个 API 文档页面都包含：
- **详细的方法说明**
- **完整的代码示例**
- **最佳实践建议**
- **常见问题解答**
- **性能优化提示**

## 🤝 社区和支持

- **GitHub 仓库**：[flutter-canvas-ts](https://github.com/your-repo/flutter-canvas-ts)
- **问题反馈**：通过 GitHub Issues 报告 bug 或提出功能请求
- **贡献指南**：欢迎提交 Pull Request 改进库的功能
- **讨论社区**：加入我们的开发者社区讨论最佳实践

## 📄 许可证

MIT License - 详见 [LICENSE](../LICENSE) 文件。

---

**开始探索 Flutter Canvas TypeScript 的强大功能吧！** 🚀