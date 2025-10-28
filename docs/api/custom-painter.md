# CustomPainter 和 AnimatedCustomPainter API 文档

## 概述

自定义绘制器模块提供了类似 Flutter CustomPainter 的自定义绘制功能，允许开发者创建复杂的自定义绘制逻辑。该模块包含四个核心类：

- **CustomPainter**: 抽象基类，定义自定义绘制的基本接口
- **CustomPaint**: 绘制组件，封装 CustomPainter 和 Canvas 的交互
- **PainterFactory**: 工厂类，提供便捷的创建方法
- **AnimatedCustomPainter**: 动画绘制器，支持动画效果的绘制

---

## CustomPainter 抽象基类

### 概述

CustomPainter 是所有自定义绘制器的基类，定义了绘制的核心接口和生命周期。继承此类可以创建具有自定义绘制逻辑的组件。

### 核心概念

#### 绘制生命周期
1. **paint()** - 执行实际的绘制操作
2. **shouldRepaint()** - 决定是否需要重新绘制
3. **shouldRebuildSemantics()** - 决定是否需要重新构建语义信息

#### 交互支持
- **hitTest()** - 点击测试，判断点击是否命中绘制区域
- **getClipBounds()** - 获取绘制的边界区域

### 抽象方法

#### `abstract paint(canvas: Canvas, size: Size): void`

绘制方法，子类必须实现的核心绘制逻辑。

**参数:**
- `canvas: Canvas` - 画布对象，提供所有绘制 API
- `size: Size` - 绘制区域的尺寸，包含 width 和 height

**示例:**
```typescript
class GradientPainter extends CustomPainter {
  paint(canvas: Canvas, size: Size): void {
    // 创建渐变画笔
    const paint = new Paint();
    paint.color = Color.blue;
    paint.style = PaintingStyle.fill;

    // 绘制背景矩形
    const rect = {
      left: 0, top: 0,
      right: size.width, bottom: size.height
    };
    canvas.drawRect(rect, paint);

    // 绘制中心圆形
    const center = {
      dx: size.width / 2,
      dy: size.height / 2
    };
    paint.color = Color.white;
    canvas.drawCircle(center, Math.min(size.width, size.height) / 4, paint);
  }
}
```

### 生命周期方法

#### `shouldRepaint(oldDelegate: CustomPainter): boolean`

判断是否需要重新绘制，性能优化的关键方法。

**参数:**
- `oldDelegate: CustomPainter` - 之前使用的绘制器实例

**返回值:** 如果需要重新绘制返回 true，否则返回 false

**默认实现:** 总是返回 true

**示例:**
```typescript
class CirclePainter extends CustomPainter {
  constructor(private color: Color, private radius: number) {
    super();
  }

  shouldRepaint(oldDelegate: CustomPainter): boolean {
    // 类型检查
    if (!(oldDelegate instanceof CirclePainter)) {
      return true;
    }

    // 比较关键属性
    return this.color !== oldDelegate.color || 
           this.radius !== oldDelegate.radius;
  }

  paint(canvas: Canvas, size: Size): void {
    // 绘制逻辑...
  }
}
```

#### `shouldRebuildSemantics(oldDelegate: CustomPainter): boolean`

判断是否需要重建语义信息，用于无障碍访问支持。

**参数:**
- `oldDelegate: CustomPainter` - 之前使用的绘制器实例

**返回值:** 如果需要重建语义信息返回 true，否则返回 false

**默认实现:** 返回 false

**示例:**
```typescript
class InteractiveChartPainter extends CustomPainter {
  constructor(
    private data: ChartData[],
    private selectedIndex: number
  ) {
    super();
  }

  shouldRebuildSemantics(oldDelegate: CustomPainter): boolean {
    if (!(oldDelegate instanceof InteractiveChartPainter)) {
      return true;
    }

    // 数据变化需要重建语义
    if (this.data.length !== oldDelegate.data.length) {
      return true;
    }

    // 选中状态变化需要重建语义
    if (this.selectedIndex !== oldDelegate.selectedIndex) {
      return true;
    }

    return false;
  }
}
```

### 交互方法

#### `getClipBounds(size: Size): { left: number; top: number; right: number; bottom: number }`

获取裁剪边界，定义绘制内容的可见区域。

**参数:**
- `size: Size` - 绘制区域的总尺寸

**返回值:** 裁剪边界矩形

**默认实现:** 返回整个绘制区域

**示例:**
```typescript
class CircularClipPainter extends CustomPainter {
  getClipBounds(size: Size): {
    left: number; top: number; right: number; bottom: number;
  } {
    // 创建圆形裁剪区域的外接矩形
    const radius = Math.min(size.width, size.height) / 2;
    const centerX = size.width / 2;
    const centerY = size.height / 2;

    return {
      left: centerX - radius,
      top: centerY - radius,
      right: centerX + radius,
      bottom: centerY + radius
    };
  }
}
```

#### `hitTest(position: { dx: number; dy: number }, size: Size): boolean`

点击测试，判断指定位置是否在可交互区域内。

**参数:**
- `position: { dx: number; dy: number }` - 交互位置的坐标
- `size: Size` - 绘制区域的总尺寸

**返回值:** 如果位置在可交互区域内返回 true，否则返回 false

**默认实现:** 基于裁剪边界进行检测

**示例:**
```typescript
class CircleButtonPainter extends CustomPainter {
  constructor(
    private center: { dx: number; dy: number },
    private radius: number
  ) {
    super();
  }

  hitTest(position: { dx: number; dy: number }, size: Size): boolean {
    // 计算点击位置到圆心的距离
    const dx = position.dx - this.center.dx;
    const dy = position.dy - this.center.dy;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // 判断是否在圆形区域内
    return distance <= this.radius;
  }

  paint(canvas: Canvas, size: Size): void {
    const paint = new Paint();
    paint.color = Color.blue;
    paint.style = PaintingStyle.fill;
    canvas.drawCircle(this.center, this.radius, paint);
  }
}
```

---

## CustomPaint 绘制组件

### 概述

CustomPaint 类是 CustomPainter 的高级包装器，提供了完整的绘制管理功能。它负责管理画布、处理重绘逻辑、响应交互事件。

### 构造函数

#### `constructor(painter: CustomPainter, context: CanvasRenderingContext2D, size: Size)`

创建 CustomPaint 实例。

**参数:**
- `painter: CustomPainter` - 自定义绘制器实例
- `context: CanvasRenderingContext2D` - Canvas 2D 渲染上下文
- `size: Size` - 绘制区域的尺寸

**示例:**
```typescript
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const context = canvas.getContext('2d')!;
const size = { width: 400, height: 300 };

class SimplePainter extends CustomPainter {
  paint(canvas: Canvas, size: Size): void {
    // 绘制逻辑
  }
}

const customPaint = new CustomPaint(
  new SimplePainter(),
  context,
  size
);
```

### 属性

#### `size: Size` (读写)

获取或设置当前绘制区域的尺寸。

**示例:**
```typescript
// 获取当前尺寸
const currentSize = customPaint.size;
console.log(`当前尺寸: ${currentSize.width} x ${currentSize.height}`);

// 设置新尺寸
customPaint.size = { width: 800, height: 600 };
customPaint.repaint(); // 重新绘制以适应新尺寸
```

#### `customPainter: CustomPainter` (读写)

获取或设置当前使用的自定义绘制器。

**示例:**
```typescript
// 获取当前绘制器
const currentPainter = customPaint.customPainter;

// 设置新绘制器（会自动判断是否需要重绘）
customPaint.customPainter = new NewPainter();
```

### 方法

#### `paint(): void`

执行绘制操作，调用当前绘制器的 paint() 方法。

**示例:**
```typescript
const customPaint = new CustomPaint(painter, context, size);
customPaint.paint(); // 执行绘制
```

#### `repaint(): void`

重新绘制，先清除画布然后重新执行绘制操作。

**示例:**
```typescript
// 数据更新后重绘
function updateData(newData: any[]) {
  dataSource.update(newData);
  customPaint.repaint(); // 重新绘制以反映数据变化
}
```

#### `handleTap(position: { dx: number; dy: number }): boolean`

处理点击事件，检测点击位置并判断是否命中。

**参数:**
- `position: { dx: number; dy: number }` - 点击位置的坐标

**返回值:** 如果点击命中绘制内容返回 true，否则返回 false

**示例:**
```typescript
canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();
  const position = {
    dx: event.clientX - rect.left,
    dy: event.clientY - rect.top
  };

  if (customPaint.handleTap(position)) {
    console.log('点击了绘制内容');
    // 执行相应的交互逻辑
  }
});
```

---

## PainterFactory 工厂类

### 概述

PainterFactory 类提供了一系列静态工厂方法，用于简化 CustomPaint 实例的创建过程。

### 静态方法

#### `static fromCanvasElement(painter: CustomPainter, canvasElement: HTMLCanvasElement): CustomPaint | null`

从 HTML Canvas 元素创建 CustomPaint 实例。

**参数:**
- `painter: CustomPainter` - 自定义绘制器实例
- `canvasElement: HTMLCanvasElement` - HTML Canvas 元素

**返回值:** CustomPaint 实例，如果创建失败则返回 null

**示例:**
```typescript
const canvas = document.getElementById('chart') as HTMLCanvasElement;
const painter = new ChartPainter(chartData);

const customPaint = PainterFactory.fromCanvasElement(painter, canvas);
if (customPaint) {
  customPaint.paint();
} else {
  console.error('Canvas不支持2D渲染上下文');
}
```

---

## AnimatedCustomPainter 动画绘制器

### 概述

AnimatedCustomPainter 是 CustomPainter 的抽象子类，专门用于创建具有动画效果的绘制器。它提供了动画值管理、动画绘制接口和自动重绘机制。

### 属性

#### `animationValue: number` (读写)

获取或设置当前动画进度值，范围在 0 到 1 之间。

**示例:**
```typescript
// 获取当前动画进度
const progress = painter.animationValue;
console.log(`动画进度: ${(progress * 100).toFixed(1)}%`);

// 设置动画进度
painter.animationValue = 0.5; // 50% 进度
```

### 抽象方法

#### `abstract paintAnimated(canvas: Canvas, size: Size, animationValue: number): void`

动画绘制方法，子类必须实现的动画绘制逻辑。

**参数:**
- `canvas: Canvas` - 画布对象，用于执行绘制操作
- `size: Size` - 绘制区域尺寸
- `animationValue: number` - 当前动画进度（0-1 之间）

**示例:**
```typescript
class ScaleAnimationPainter extends AnimatedCustomPainter {
  paintAnimated(canvas: Canvas, size: Size, animationValue: number): void {
    // 计算缩放比例（从0.1到1.0）
    const scale = 0.1 + (1.0 - 0.1) * animationValue;
    
    // 计算缩放后的尺寸
    const scaledWidth = size.width * scale;
    const scaledHeight = size.height * scale;
    
    // 计算居中位置
    const x = (size.width - scaledWidth) / 2;
    const y = (size.height - scaledHeight) / 2;

    const paint = new Paint();
    paint.color = Color.blue;
    canvas.drawRect({
      left: x, top: y,
      right: x + scaledWidth, bottom: y + scaledHeight
    }, paint);
  }
}
```

### 重写方法

#### `paint(canvas: Canvas, size: Size): void`

实现基类的 paint 方法，自动调用动画绘制逻辑。

**注意:** 子类无需重写此方法，它会自动调用 paintAnimated 方法。

#### `shouldRepaint(oldDelegate: CustomPainter): boolean`

基于动画值变化的智能重绘判断。

**返回值:** 当动画值发生变化时返回 true，否则返回 false

## 完整使用示例

### 基本自定义绘制器

```typescript
import { CustomPainter, CustomPaint, PainterFactory, Canvas, Paint, Color, PaintingStyle } from 'flutter-canvas-ts';

class CirclePainter extends CustomPainter {
  constructor(private color: Color, private radius: number) {
    super();
  }

  paint(canvas: Canvas, size: Size): void {
    const paint = new Paint()
      ..color = this.color
      ..style = PaintingStyle.fill;

    const center = { 
      dx: size.width / 2, 
      dy: size.height / 2 
    };

    canvas.drawCircle(center, this.radius, paint);
  }

  shouldRepaint(oldDelegate: CirclePainter): boolean {
    return this.color !== oldDelegate.color || 
           this.radius !== oldDelegate.radius;
  }
}

// 使用CustomPaint组件
const canvasElement = document.getElementById('myCanvas') as HTMLCanvasElement;
const painter = new CirclePainter(Color.blue, 50);
const customPaint = PainterFactory.fromCanvasElement(painter, canvasElement);

if (customPaint) {
  customPaint.paint();

  // 处理点击事件
  canvasElement.addEventListener('click', (event) => {
    const rect = canvasElement.getBoundingClientRect();
    const position = {
      dx: event.clientX - rect.left,
      dy: event.clientY - rect.top
    };

    if (customPaint.handleTap(position)) {
      console.log('点击了绘制区域');
    }
  });
}
```

### 动画绘制器

```typescript
import { AnimatedCustomPainter } from 'flutter-canvas-ts';

class PulsatingCirclePainter extends AnimatedCustomPainter {
  constructor(private baseRadius: number) {
    super();
  }

  paintAnimated(canvas: Canvas, size: Size, animationValue: number): void {
    const paint = new Paint()
      ..color = Color.red
      ..style = PaintingStyle.fill;

    const center = { 
      dx: size.width / 2, 
      dy: size.height / 2 
    };

    // 根据动画值调整半径
    const radius = this.baseRadius * (1 + animationValue * 0.5);
    canvas.drawCircle(center, radius, paint);
  }
}

// 使用动画绘制器
const animatedPainter = new PulsatingCirclePainter(30);
const customPaint = PainterFactory.fromCanvasElement(animatedPainter, canvasElement);

// 动画循环
function animate() {
  const time = Date.now() * 0.001;
  animatedPainter.animationValue = (Math.sin(time) + 1) / 2;
  customPaint?.repaint();
  requestAnimationFrame(animate);
}
animate();
```

### 复杂交互式绘制器

```typescript
class InteractiveChart extends CustomPainter {
  private selectedIndex = -1;
  private dataPoints: { x: number; y: number; value: number }[] = [];

  constructor(private data: number[]) {
    super();
    this.calculateDataPoints();
  }

  private calculateDataPoints() {
    // 计算数据点位置
    this.dataPoints = this.data.map((value, index) => ({
      x: (index + 0.5) * (400 / this.data.length),
      y: 200 - (value / 100) * 150,
      value
    }));
  }

  paint(canvas: Canvas, size: Size): void {
    const paint = new Paint();
    
    // 绘制背景
    paint.color = Color.lightGrey;
    canvas.drawRect({
      left: 0, top: 0,
      right: size.width, bottom: size.height
    }, paint);

    // 绘制数据点
    this.dataPoints.forEach((point, index) => {
      paint.color = index === this.selectedIndex ? Color.red : Color.blue;
      canvas.drawCircle({ dx: point.x, dy: point.y }, 8, paint);
    });
  }

  hitTest(position: { dx: number; dy: number }, size: Size): boolean {
    // 检测点击的数据点
    const clickedIndex = this.dataPoints.findIndex(point => {
      const dx = position.dx - point.x;
      const dy = position.dy - point.y;
      return Math.sqrt(dx * dx + dy * dy) <= 8;
    });

    if (clickedIndex >= 0) {
      this.selectedIndex = clickedIndex;
      return true;
    }
    return false;
  }

  shouldRepaint(oldDelegate: CustomPainter): boolean {
    if (!(oldDelegate instanceof InteractiveChart)) {
      return true;
    }
    return this.selectedIndex !== oldDelegate.selectedIndex ||
           JSON.stringify(this.data) !== JSON.stringify(oldDelegate.data);
  }
}
```

## 注意事项

1. **性能优化**: 合理实现 shouldRepaint() 方法以避免不必要的重绘
2. **内存管理**: 及时清理不再使用的绘制器实例
3. **坐标系统**: 注意 Canvas 坐标系统（左上角为原点）
4. **动画流畅性**: 动画绘制器中避免复杂计算，预先计算动画参数
5. **交互响应**: hitTest() 方法应该高效且准确
6. **错误处理**: 使用 PainterFactory 时检查返回值是否为 null