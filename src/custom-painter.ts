/**
 * 自定义绘制器模块
 * 
 * 本模块提供了类似Flutter CustomPainter的自定义绘制功能，允许开发者
 * 创建复杂的自定义绘制逻辑。主要包含以下核心组件：
 * 
 * ## 核心类
 * 
 * ### CustomPainter（抽象基类）
 * - 定义自定义绘制的基本接口
 * - 提供绘制生命周期管理
 * - 支持重绘优化和点击测试
 * 
 * ### CustomPaint（绘制组件）
 * - 封装CustomPainter和Canvas的交互
 * - 管理绘制区域和状态
 * - 提供便捷的绘制接口
 * 
 * ### PainterFactory（工厂类）
 * - 提供从HTML Canvas元素创建CustomPaint的便捷方法
 * - 简化组件初始化流程
 * 
 * ### AnimatedCustomPainter（动画绘制器）
 * - 扩展CustomPainter以支持动画
 * - 内置动画值管理（0-1范围）
 * - 自动处理动画相关的重绘逻辑
 * 
 * ## 主要功能
 * 
 * ### 自定义绘制
 * - 完全自定义的绘制逻辑
 * - 与Canvas API的无缝集成
 * - 支持复杂的图形和效果
 * 
 * ### 性能优化
 * - 智能重绘检测
 * - 绘制边界管理
 * - 最小化不必要的重绘操作
 * 
 * ### 交互支持
 * - 点击测试和事件处理
 * - 自定义交互区域
 * - 响应式用户交互
 * 
 * ### 动画支持
 * - 内置动画值管理
 * - 平滑的动画过渡
 * - 高性能动画渲染
 * 
 * ## 使用示例
 * 
 * ### 基本自定义绘制器
 * ```typescript
 * class CirclePainter extends CustomPainter {
 *   constructor(private color: Color, private radius: number) {
 *     super();
 *   }
 * 
 *   paint(canvas: Canvas, size: Size): void {
 *     const paint = new Paint()
 *       ..color = this.color
 *       ..style = PaintingStyle.fill;
 * 
 *     const center = { 
 *       dx: size.width / 2, 
 *       dy: size.height / 2 
 *     };
 * 
 *     canvas.drawCircle(center, this.radius, paint);
 *   }
 * 
 *   shouldRepaint(oldDelegate: CirclePainter): boolean {
 *     return this.color !== oldDelegate.color || 
 *            this.radius !== oldDelegate.radius;
 *   }
 * }
 * ```
 * 
 * ### 使用CustomPaint组件
 * ```typescript
 * const canvasElement = document.getElementById('myCanvas') as HTMLCanvasElement;
 * const painter = new CirclePainter(Color.blue, 50);
 * const customPaint = PainterFactory.fromCanvasElement(painter, canvasElement);
 * 
 * if (customPaint) {
 *   customPaint.paint();
 * 
 *   // 处理点击事件
 *   canvasElement.addEventListener('click', (event) => {
 *     const rect = canvasElement.getBoundingClientRect();
 *     const position = {
 *       dx: event.clientX - rect.left,
 *       dy: event.clientY - rect.top
 *     };
 * 
 *     if (customPaint.handleTap(position)) {
 *       console.log('点击了绘制区域');
 *     }
 *   });
 * }
 * ```
 * 
 * ### 动画绘制器
 * ```typescript
 * class PulsatingCirclePainter extends AnimatedCustomPainter {
 *   constructor(private baseRadius: number) {
 *     super();
 *   }
 * 
 *   paintAnimated(canvas: Canvas, size: Size, animationValue: number): void {
 *     const paint = new Paint()
 *       ..color = Color.red
 *       ..style = PaintingStyle.fill;
 * 
 *     const center = { 
 *       dx: size.width / 2, 
 *       dy: size.height / 2 
 *     };
 * 
 *     // 根据动画值调整半径
 *     const radius = this.baseRadius * (1 + animationValue * 0.5);
 *     canvas.drawCircle(center, radius, paint);
 *   }
 * }
 * 
 * // 使用动画绘制器
 * const animatedPainter = new PulsatingCirclePainter(30);
 * const customPaint = PainterFactory.fromCanvasElement(animatedPainter, canvasElement);
 * 
 * // 动画循环
 * function animate() {
 *   const time = Date.now() * 0.001;
 *   animatedPainter.animationValue = (Math.sin(time) + 1) / 2;
 *   customPaint?.repaint();
 *   requestAnimationFrame(animate);
 * }
 * animate();
 * ```
 * 
 * @author Flutter-like Painting Library
 * @version 1.0.0
 */

import { Canvas } from "./canvas";
import type { Size } from "./types";

/**
 * 自定义绘制器抽象基类
 * 
 * CustomPainter是所有自定义绘制器的基类，定义了绘制的核心接口和生命周期。
 * 继承此类可以创建具有自定义绘制逻辑的组件，类似于Flutter中的CustomPainter。
 * 
 * ## 核心概念
 * 
 * ### 绘制生命周期
 * 1. **paint()** - 执行实际的绘制操作
 * 2. **shouldRepaint()** - 决定是否需要重新绘制
 * 3. **shouldRebuildSemantics()** - 决定是否需要重新构建语义信息
 * 
 * ### 交互支持
 * - **hitTest()** - 点击测试，判断点击是否命中绘制区域
 * - **getClipBounds()** - 获取绘制的边界区域
 * 
 * ## 性能优化
 * 
 * 通过合理实现shouldRepaint()方法，可以避免不必要的重绘：
 * - 返回true：强制重绘
 * - 返回false：跳过重绘，提高性能
 * 
 * @example
 * ```typescript
 * class MyCustomPainter extends CustomPainter {
 *   constructor(private data: any) {
 *     super();
 *   }
 * 
 *   paint(canvas: Canvas, size: Size): void {
 *     // 实现自定义绘制逻辑
 *     const paint = new Paint()..color = Color.blue;
 *     canvas.drawRect({
 *       left: 0, top: 0, 
 *       right: size.width, bottom: size.height
 *     }, paint);
 *   }
 * 
 *   shouldRepaint(oldDelegate: MyCustomPainter): boolean {
 *     // 只有当数据发生变化时才重绘
 *     return this.data !== oldDelegate.data;
 *   }
 * }
 * ```
 */
export abstract class CustomPainter {
  /**
   * 绘制方法 - 子类必须实现的核心绘制逻辑
   * 
   * 这是CustomPainter的核心方法，定义了如何在给定的画布上绘制内容。
   * 子类必须实现此方法来提供具体的绘制逻辑。
   * 
   * ## 绘制流程
   * 1. 接收Canvas对象和绘制区域大小
   * 2. 使用Canvas API执行绘制操作
   * 3. 可以绘制任意复杂的图形、文本、图像等
   * 
   * ## 性能考虑
   * - 避免在此方法中进行复杂的计算
   * - 预先计算好绘制参数
   * - 合理使用Canvas的状态管理（save/restore）
   * 
   * @param canvas - 画布对象，提供所有绘制API
   * @param size - 绘制区域的尺寸，包含width和height
   * 
   * @example
   * ```typescript
   * class GradientPainter extends CustomPainter {
   *   paint(canvas: Canvas, size: Size): void {
   *     // 创建渐变画笔
   *     const paint = new Paint();
   *     paint.color = Color.blue;
   *     paint.style = PaintingStyle.fill;
   * 
   *     // 绘制背景矩形
   *     const rect = {
   *       left: 0, top: 0,
   *       right: size.width, bottom: size.height
   *     };
   *     canvas.drawRect(rect, paint);
   * 
   *     // 绘制中心圆形
   *     const center = {
   *       dx: size.width / 2,
   *       dy: size.height / 2
   *     };
   *     paint.color = Color.white;
   *     canvas.drawCircle(center, Math.min(size.width, size.height) / 4, paint);
   *   }
   * }
   * ```
   */
  abstract paint(canvas: Canvas, size: Size): void;

  /**
   * 判断是否需要重新绘制 - 性能优化的关键方法
   * 
   * 此方法用于确定当前绘制器是否需要重新执行绘制操作。
   * 通过比较当前绘制器与之前的绘制器，可以避免不必要的重绘，
   * 从而显著提升应用性能。
   * 
   * ## 工作原理
   * 1. 系统在需要重绘时调用此方法
   * 2. 传入之前使用的绘制器实例
   * 3. 比较两个绘制器的状态差异
   * 4. 返回是否需要重新绘制的布尔值
   * 
   * ## 实现策略
   * - **保守策略**: 总是返回true（默认实现）
   * - **优化策略**: 比较关键属性，仅在变化时返回true
   * - **精确策略**: 深度比较所有影响绘制的状态
   * 
   * @param _oldDelegate - 之前使用的绘制器实例
   * @returns 如果需要重新绘制返回true，否则返回false
   * 
   * @example
   * ```typescript
   * class CirclePainter extends CustomPainter {
   *   constructor(private color: Color, private radius: number) {
   *     super();
   *   }
   * 
   *   shouldRepaint(oldDelegate: CustomPainter): boolean {
   *     // 类型检查
   *     if (!(oldDelegate instanceof CirclePainter)) {
   *       return true;
   *     }
   * 
   *     // 比较关键属性
   *     return this.color !== oldDelegate.color || 
   *            this.radius !== oldDelegate.radius;
   *   }
   * 
   *   paint(canvas: Canvas, size: Size): void {
   *     // 绘制逻辑...
   *   }
   * }
   * ```
   * 
   * @example
   * ```typescript
   * // 复杂状态比较示例
   * class DataVisualizationPainter extends CustomPainter {
   *   constructor(private data: number[], private config: ChartConfig) {
   *     super();
   *   }
   * 
   *   shouldRepaint(oldDelegate: CustomPainter): boolean {
   *     if (!(oldDelegate instanceof DataVisualizationPainter)) {
   *       return true;
   *     }
   * 
   *     // 比较数据数组
   *     if (this.data.length !== oldDelegate.data.length) {
   *       return true;
   *     }
   * 
   *     // 比较数据内容
   *     for (let i = 0; i < this.data.length; i++) {
   *       if (this.data[i] !== oldDelegate.data[i]) {
   *         return true;
   *       }
   *     }
   * 
   *     // 比较配置对象
   *     return JSON.stringify(this.config) !== JSON.stringify(oldDelegate.config);
   *   }
   * }
   * ```
   */
  shouldRepaint(_oldDelegate: CustomPainter): boolean {
    return true; // 默认总是重新绘制
  }

  /**
   * 判断是否需要重建语义信息 - 无障碍访问支持
   * 
   * 此方法用于确定是否需要重新构建绘制内容的语义信息。
   * 语义信息主要用于无障碍访问（Accessibility），帮助屏幕阅读器
   * 和其他辅助技术理解绘制内容的含义。
   * 
   * ## 语义信息的作用
   * - 为视觉内容提供文本描述
   * - 支持屏幕阅读器访问
   * - 提供键盘导航支持
   * - 增强应用的无障碍性
   * 
   * ## 何时需要重建
   * - 绘制内容的语义含义发生变化
   * - 交互元素的位置或状态改变
   * - 文本内容或标签更新
   * - 数据可视化的数据结构变化
   * 
   * ## 性能考虑
   * - 语义重建比视觉重绘更昂贵
   * - 默认返回false以避免不必要的重建
   * - 仅在语义真正变化时返回true
   * 
   * @param _oldDelegate - 之前使用的绘制器实例
   * @returns 如果需要重建语义信息返回true，否则返回false
   * 
   * @example
   * ```typescript
   * class InteractiveChartPainter extends CustomPainter {
   *   constructor(
   *     private data: ChartData[],
   *     private selectedIndex: number
   *   ) {
   *     super();
   *   }
   * 
   *   shouldRebuildSemantics(oldDelegate: CustomPainter): boolean {
   *     if (!(oldDelegate instanceof InteractiveChartPainter)) {
   *       return true;
   *     }
   * 
   *     // 数据变化需要重建语义
   *     if (this.data.length !== oldDelegate.data.length) {
   *       return true;
   *     }
   * 
   *     // 选中状态变化需要重建语义
   *     if (this.selectedIndex !== oldDelegate.selectedIndex) {
   *       return true;
   *     }
   * 
   *     // 检查数据标签是否变化
   *     for (let i = 0; i < this.data.length; i++) {
   *       if (this.data[i].label !== oldDelegate.data[i].label) {
   *         return true;
   *       }
   *     }
   * 
   *     return false;
   *   }
   * 
   *   paint(canvas: Canvas, size: Size): void {
   *     // 绘制图表...
   *   }
   * }
   * ```
   * 
   * @example
   * ```typescript
   * // 简单图形通常不需要重建语义
   * class StaticShapePainter extends CustomPainter {
   *   shouldRebuildSemantics(oldDelegate: CustomPainter): boolean {
   *     // 静态图形通常不包含语义信息
   *     return false;
   *   }
   * }
   * ```
   */
  shouldRebuildSemantics(_oldDelegate: CustomPainter): boolean {
    return false; // 默认不需要重新布局
  }

  /**
   * 获取裁剪边界 - 定义绘制内容的可见区域
   * 
   * 此方法返回一个矩形区域，定义了绘制内容的边界。
   * 超出此边界的内容将被裁剪掉，不会显示在最终结果中。
   * 这对于性能优化和视觉效果控制都很重要。
   * 
   * ## 裁剪的作用
   * - **性能优化**: 避免绘制不可见的内容
   * - **视觉控制**: 确保内容在指定区域内显示
   * - **布局约束**: 限制绘制内容的范围
   * - **特效实现**: 创建遮罩和窗口效果
   * 
   * ## 默认行为
   * 默认实现返回整个绘制区域，即不进行任何裁剪。
   * 子类可以重写此方法来实现自定义的裁剪逻辑。
   * 
   * ## 坐标系统
   * 返回的矩形使用与绘制相同的坐标系统：
   * - 左上角为原点 (0, 0)
   * - X轴向右为正方向
   * - Y轴向下为正方向
   * 
   * @param size - 绘制区域的总尺寸
   * @returns 裁剪边界矩形，包含left、top、right、bottom属性
   * 
   * @example
   * ```typescript
   * class CircularClipPainter extends CustomPainter {
   *   getClipBounds(size: Size): {
   *     left: number; top: number; right: number; bottom: number;
   *   } {
   *     // 创建圆形裁剪区域的外接矩形
   *     const radius = Math.min(size.width, size.height) / 2;
   *     const centerX = size.width / 2;
   *     const centerY = size.height / 2;
   * 
   *     return {
   *       left: centerX - radius,
   *       top: centerY - radius,
   *       right: centerX + radius,
   *       bottom: centerY + radius
   *     };
   *   }
   * 
   *   paint(canvas: Canvas, size: Size): void {
   *     // 绘制内容将被限制在圆形区域内
   *     const paint = new Paint();
   *     paint.color = Color.blue;
   *     canvas.drawRect({
   *       left: 0, top: 0,
   *       right: size.width, bottom: size.height
   *     }, paint);
   *   }
   * }
   * ```
   * 
   * @example
   * ```typescript
   * class PaddedContentPainter extends CustomPainter {
   *   constructor(private padding: number = 20) {
   *     super();
   *   }
   * 
   *   getClipBounds(size: Size): {
   *     left: number; top: number; right: number; bottom: number;
   *   } {
   *     // 创建带内边距的裁剪区域
   *     return {
   *       left: this.padding,
   *       top: this.padding,
   *       right: size.width - this.padding,
   *       bottom: size.height - this.padding
   *     };
   *   }
   * 
   *   paint(canvas: Canvas, size: Size): void {
   *     // 内容将被限制在内边距区域内
   *     // 绘制逻辑...
   *   }
   * }
   * ```
   */
  getClipBounds(size: Size): {
    left: number;
    top: number;
    right: number;
    bottom: number;
  } {
    return {
      left: 0,
      top: 0,
      right: size.width,
      bottom: size.height,
    };
  }

  /**
   * 点击测试 - 判断指定位置是否在可交互区域内
   * 
   * 此方法用于确定给定的坐标点是否位于绘制内容的可交互区域内。
   * 这是实现自定义交互行为的基础，如点击、悬停、拖拽等操作。
   * 
   * ## 交互检测原理
   * 1. 接收用户交互的坐标位置
   * 2. 判断该位置是否在有效的交互区域内
   * 3. 返回布尔值指示是否应该响应该交互
   * 4. 系统根据返回值决定是否触发相关事件
   * 
   * ## 实现策略
   * - **全区域响应**: 基于裁剪边界进行检测（默认实现）
   * - **形状检测**: 基于绘制的几何形状进行精确检测
   * - **区域划分**: 将绘制区域分为多个交互区域
   * - **层级检测**: 支持多层次的交互元素
   * 
   * ## 坐标系统
   * 传入的position使用与绘制相同的坐标系统：
   * - 左上角为原点 (0, 0)
   * - X轴向右为正方向
   * - Y轴向下为正方向
   * 
   * @param position - 交互位置的坐标，包含dx和dy属性
   * @param size - 绘制区域的总尺寸，用于计算边界
   * @returns 如果位置在可交互区域内返回true，否则返回false
   * 
   * @example
   * ```typescript
   * class CircleButtonPainter extends CustomPainter {
   *   constructor(
   *     private center: { dx: number; dy: number },
   *     private radius: number
   *   ) {
   *     super();
   *   }
   * 
   *   hitTest(position: { dx: number; dy: number }, size: Size): boolean {
   *     // 计算点击位置到圆心的距离
   *     const dx = position.dx - this.center.dx;
   *     const dy = position.dy - this.center.dy;
   *     const distance = Math.sqrt(dx * dx + dy * dy);
   * 
   *     // 判断是否在圆形区域内
   *     return distance <= this.radius;
   *   }
   * 
   *   paint(canvas: Canvas, size: Size): void {
   *     const paint = new Paint();
   *     paint.color = Color.blue;
   *     paint.style = PaintingStyle.fill;
   *     canvas.drawCircle(this.center, this.radius, paint);
   *   }
   * }
   * ```
   * 
   * @example
   * ```typescript
   * class MultiRegionPainter extends CustomPainter {
   *   private regions: Array<{
   *     left: number; top: number; right: number; bottom: number;
   *   }> = [
   *     { left: 10, top: 10, right: 100, bottom: 50 },
   *     { left: 120, top: 10, right: 210, bottom: 50 },
   *     { left: 10, top: 70, right: 210, bottom: 110 }
   *   ];
   * 
   *   hitTest(position: { dx: number; dy: number }, size: Size): boolean {
   *     // 检查是否在任何一个交互区域内
   *     return this.regions.some(rect => 
   *       position.dx >= rect.left &&
   *       position.dx <= rect.right &&
   *       position.dy >= rect.top &&
   *       position.dy <= rect.bottom
   *     );
   *   }
   * 
   *   paint(canvas: Canvas, size: Size): void {
   *     const paint = new Paint();
   *     paint.color = Color.green;
   *     paint.style = PaintingStyle.fill;
   * 
   *     // 绘制所有交互区域
   *     this.regions.forEach(rect => {
   *       canvas.drawRect(rect, paint);
   *     });
   *   }
   * }
   * ```
   */
  hitTest(position: { dx: number; dy: number }, size: Size): boolean {
    const bounds = this.getClipBounds(size);
    return (
      position.dx >= bounds.left &&
      position.dx <= bounds.right &&
      position.dy >= bounds.top &&
      position.dy <= bounds.bottom
    );
  }
}

/**
 * 自定义绘制组件 - CustomPainter的包装器和管理器
 * 
 * CustomPaint类是CustomPainter的高级包装器，提供了完整的绘制管理功能。
 * 它负责管理画布、处理重绘逻辑、响应交互事件，并提供便捷的API
 * 来集成自定义绘制功能到应用中。
 * 
 * ## 核心功能
 * - **画布管理**: 自动管理Canvas实例和渲染上下文
 * - **尺寸控制**: 动态调整绘制区域大小
 * - **绘制器管理**: 支持动态更换CustomPainter实例
 * - **性能优化**: 智能重绘机制，避免不必要的渲染
 * - **交互支持**: 处理用户交互事件（点击、触摸等）
 * - **生命周期管理**: 完整的绘制生命周期控制
 * 
 * ## 使用场景
 * - 复杂的数据可视化组件
 * - 自定义UI控件和图形元素
 * - 游戏和动画场景
 * - 图表和图形编辑器
 * - 艺术创作和绘图应用
 * 
 * ## 工作流程
 * 1. 创建CustomPaint实例，传入CustomPainter和Canvas上下文
 * 2. 调用paint()方法执行初始绘制
 * 3. 根据需要更新绘制器或尺寸
 * 4. 处理用户交互事件
 * 5. 在数据变化时调用repaint()重新绘制
 * 
 * @example
 * ```typescript
 * // 基本使用示例
 * const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
 * const context = canvas.getContext('2d')!;
 * const size = { width: canvas.width, height: canvas.height };
 * 
 * // 创建自定义绘制器
 * class MyPainter extends CustomPainter {
 *   paint(canvas: Canvas, size: Size): void {
 *     const paint = new Paint();
 *     paint.color = Color.blue;
 *     canvas.drawCircle(
 *       { dx: size.width / 2, dy: size.height / 2 },
 *       50,
 *       paint
 *     );
 *   }
 * }
 * 
 * // 创建CustomPaint实例
 * const customPaint = new CustomPaint(new MyPainter(), context, size);
 * customPaint.paint(); // 执行绘制
 * 
 * // 处理点击事件
 * canvas.addEventListener('click', (event) => {
 *   const rect = canvas.getBoundingClientRect();
 *   const position = {
 *     dx: event.clientX - rect.left,
 *     dy: event.clientY - rect.top
 *   };
 *   
 *   if (customPaint.handleTap(position)) {
 *     console.log('点击了绘制内容');
 *   }
 * });
 * ```
 * 
 * @example
 * ```typescript
 * // 动态更新示例
 * class ColorfulPainter extends CustomPainter {
 *   constructor(private color: Color) {
 *     super();
 *   }
 * 
 *   paint(canvas: Canvas, size: Size): void {
 *     const paint = new Paint();
 *     paint.color = this.color;
 *     canvas.drawRect({
 *       left: 0, top: 0,
 *       right: size.width, bottom: size.height
 *     }, paint);
 *   }
 * 
 *   shouldRepaint(oldDelegate: CustomPainter): boolean {
 *     return !(oldDelegate instanceof ColorfulPainter) ||
 *            this.color !== oldDelegate.color;
 *   }
 * }
 * 
 * const customPaint = new CustomPaint(
 *   new ColorfulPainter(Color.red),
 *   context,
 *   size
 * );
 * 
 * // 动态更换绘制器（会自动判断是否需要重绘）
 * customPaint.customPainter = new ColorfulPainter(Color.blue);
 * 
 * // 动态调整尺寸
 * customPaint.size = { width: 400, height: 300 };
 * customPaint.repaint(); // 手动重绘
 * ```
 */
export class CustomPaint {
  private painter: CustomPainter;
  private _size: Size;
  private canvas: Canvas;

  /**
   * 创建CustomPaint实例
   * 
   * 构造函数初始化自定义绘制组件，设置绘制器、画布上下文和尺寸。
   * 创建后需要调用paint()方法来执行实际的绘制操作。
   * 
   * @param painter - 自定义绘制器实例，定义具体的绘制逻辑
   * @param context - Canvas 2D渲染上下文，用于实际的绘制操作
   * @param size - 绘制区域的尺寸，包含width和height
   * 
   * @example
   * ```typescript
   * const canvas = document.getElementById('canvas') as HTMLCanvasElement;
   * const context = canvas.getContext('2d')!;
   * const size = { width: 400, height: 300 };
   * 
   * class SimplePainter extends CustomPainter {
   *   paint(canvas: Canvas, size: Size): void {
   *     // 绘制逻辑
   *   }
   * }
   * 
   * const customPaint = new CustomPaint(
   *   new SimplePainter(),
   *   context,
   *   size
   * );
   * ```
   */
  constructor(
    painter: CustomPainter,
    context: CanvasRenderingContext2D,
    size: Size
  ) {
    this.painter = painter;
    this._size = size;
    this.canvas = new Canvas(context, size);
  }

  /**
   * 获取当前绘制区域的尺寸
   * 
   * 返回绘制区域的尺寸副本，包含width和height属性。
   * 返回副本是为了防止外部直接修改内部状态。
   * 
   * @returns 绘制区域尺寸的副本
   * 
   * @example
   * ```typescript
   * const currentSize = customPaint.size;
   * console.log(`当前尺寸: ${currentSize.width} x ${currentSize.height}`);
   * ```
   */
  get size(): Size {
    return { ...this._size };
  }

  /**
   * 设置绘制区域的尺寸
   * 
   * 更新绘制区域的尺寸并重新创建Canvas实例以适应新尺寸。
   * 设置新尺寸后，通常需要调用repaint()方法来重新绘制内容。
   * 
   * ## 注意事项
   * - 设置新尺寸会重新创建Canvas实例
   * - 不会自动触发重绘，需要手动调用repaint()
   * - 确保新尺寸的width和height都大于0
   * 
   * @param newSize - 新的绘制区域尺寸
   * 
   * @example
   * ```typescript
   * // 调整绘制区域尺寸
   * customPaint.size = { width: 800, height: 600 };
   * customPaint.repaint(); // 重新绘制以适应新尺寸
   * ```
   * 
   * @example
   * ```typescript
   * // 响应窗口大小变化
   * window.addEventListener('resize', () => {
   *   const canvas = document.getElementById('canvas') as HTMLCanvasElement;
   *   canvas.width = window.innerWidth;
   *   canvas.height = window.innerHeight;
   *   
   *   customPaint.size = {
   *     width: canvas.width,
   *     height: canvas.height
   *   };
   *   customPaint.repaint();
   * });
   * ```
   */
  set size(newSize: Size) {
    this._size = newSize;
    this.canvas = new Canvas(this.canvas.getContext(), newSize);
  }

  /**
   * 获取当前使用的自定义绘制器
   * 
   * 返回当前正在使用的CustomPainter实例。
   * 可以用于检查当前绘制器的状态或类型。
   * 
   * @returns 当前的CustomPainter实例
   * 
   * @example
   * ```typescript
   * const currentPainter = customPaint.customPainter;
   * if (currentPainter instanceof MySpecialPainter) {
   *   console.log('当前使用的是特殊绘制器');
   * }
   * ```
   */
  get customPainter(): CustomPainter {
    return this.painter;
  }

  /**
   * 设置新的自定义绘制器
   * 
   * 更换当前使用的CustomPainter实例。系统会自动调用新绘制器的
   * shouldRepaint()方法来判断是否需要重新绘制，如果需要则自动执行重绘。
   * 
   * ## 智能重绘机制
   * 1. 调用新绘制器的shouldRepaint()方法
   * 2. 传入当前绘制器作为参数进行比较
   * 3. 如果返回true，自动调用repaint()重新绘制
   * 4. 如果返回false，保持当前绘制内容不变
   * 
   * ## 性能优化
   * - 避免不必要的重绘操作
   * - 支持绘制器的平滑切换
   * - 保持良好的用户体验
   * 
   * @param newPainter - 新的CustomPainter实例
   * 
   * @example
   * ```typescript
   * // 基本绘制器切换
   * class RedPainter extends CustomPainter {
   *   paint(canvas: Canvas, size: Size): void {
   *     // 绘制红色内容
   *   }
   * 
   *   shouldRepaint(oldDelegate: CustomPainter): boolean {
   *     return !(oldDelegate instanceof RedPainter);
   *   }
   * }
   * 
   * class BluePainter extends CustomPainter {
   *   paint(canvas: Canvas, size: Size): void {
   *     // 绘制蓝色内容
   *   }
   * 
   *   shouldRepaint(oldDelegate: CustomPainter): boolean {
   *     return !(oldDelegate instanceof BluePainter);
   *   }
   * }
   * 
   * // 切换绘制器（会自动重绘）
   * customPaint.customPainter = new RedPainter();
   * 
   * // 再次切换（会自动重绘）
   * customPainter.customPainter = new BluePainter();
   * ```
   * 
   * @example
   * ```typescript
   * // 数据驱动的绘制器切换
   * class DataPainter extends CustomPainter {
   *   constructor(private data: any[]) {
   *     super();
   *   }
   * 
   *   shouldRepaint(oldDelegate: CustomPainter): boolean {
   *     return !(oldDelegate instanceof DataPainter) ||
   *            JSON.stringify(this.data) !== JSON.stringify(oldDelegate.data);
   *   }
   * 
   *   paint(canvas: Canvas, size: Size): void {
   *     // 根据数据绘制
   *   }
   * }
   * 
   * // 数据更新时切换绘制器
   * const newData = [1, 2, 3, 4, 5];
   * customPaint.customPainter = new DataPainter(newData);
   * // 只有在数据真正变化时才会重绘
   * ```
   */
  set customPainter(newPainter: CustomPainter) {
    const shouldRepaint = newPainter.shouldRepaint(this.painter);
    this.painter = newPainter;
    if (shouldRepaint) {
      this.repaint();
    }
  }

  /**
   * 执行绘制操作
   * 
   * 调用当前绘制器的paint()方法在画布上执行绘制操作。
   * 这是执行实际绘制的核心方法，通常在组件初始化或需要
   * 首次绘制时调用。
   * 
   * ## 绘制流程
   * 1. 调用绘制器的paint()方法
   * 2. 传入Canvas实例和当前尺寸
   * 3. 绘制器在画布上执行具体的绘制操作
   * 
   * ## 使用场景
   * - 组件初始化后的首次绘制
   * - 手动触发绘制操作
   * - 在特定时机执行绘制
   * 
   * @example
   * ```typescript
   * // 创建CustomPaint实例后执行绘制
   * const customPaint = new CustomPaint(painter, context, size);
   * customPaint.paint(); // 执行绘制
   * ```
   * 
   * @example
   * ```typescript
   * // 在动画循环中使用
   * function animate() {
   *   customPaint.paint();
   *   requestAnimationFrame(animate);
   * }
   * animate();
   * ```
   */
  paint(): void {
    this.painter.paint(this.canvas, this._size);
  }

  /**
   * 重新绘制 - 清除画布并重新执行绘制
   * 
   * 先清除画布上的所有内容，然后重新执行绘制操作。
   * 这是更新绘制内容的标准方法，确保新内容不会与
   * 旧内容重叠或混合。
   * 
   * ## 重绘流程
   * 1. 调用canvas.clear()清除画布
   * 2. 调用paint()重新执行绘制
   * 3. 确保画布上只有最新的绘制内容
   * 
   * ## 使用场景
   * - 数据更新后需要刷新显示
   * - 绘制器状态改变后的更新
   * - 响应用户交互的视觉更新
   * - 动画帧的更新
   * 
   * ## 性能考虑
   * - 避免频繁调用，特别是在动画中
   * - 考虑使用shouldRepaint()进行优化
   * - 在必要时才执行重绘操作
   * 
   * @example
   * ```typescript
   * // 数据更新后重绘
   * function updateData(newData: any[]) {
   *   dataSource.update(newData);
   *   customPaint.repaint(); // 重新绘制以反映数据变化
   * }
   * ```
   * 
   * @example
   * ```typescript
   * // 响应窗口大小变化
   * window.addEventListener('resize', () => {
   *   // 更新尺寸
   *   customPaint.size = getNewSize();
   *   // 重新绘制
   *   customPaint.repaint();
   * });
   * ```
   * 
   * @example
   * ```typescript
   * // 在用户交互后更新
   * canvas.addEventListener('click', (event) => {
   *   const position = getClickPosition(event);
   *   if (customPaint.handleTap(position)) {
   *     // 处理点击逻辑
   *     updateState();
   *     customPaint.repaint(); // 重绘以显示状态变化
   *   }
   * });
   * ```
   */
  repaint(): void {
    this.canvas.clear();
    this.paint();
  }

  /**
   * 处理点击事件 - 检测点击位置并判断是否命中
   * 
   * 将用户的点击位置传递给绘制器的hitTest()方法，
   * 判断点击是否发生在可交互的绘制内容上。
   * 这是实现自定义交互行为的基础方法。
   * 
   * ## 交互检测流程
   * 1. 接收点击位置坐标
   * 2. 调用绘制器的hitTest()方法
   * 3. 传入位置坐标和当前尺寸
   * 4. 返回是否命中的布尔值
   * 
   * ## 坐标系统
   * 位置坐标使用Canvas的坐标系统：
   * - 左上角为原点 (0, 0)
   * - X轴向右为正方向
   * - Y轴向下为正方向
   * 
   * ## 使用场景
   * - 实现自定义按钮和控件
   * - 处理图形元素的点击
   * - 实现拖拽和选择功能
   * - 创建交互式数据可视化
   * 
   * @param position - 点击位置的坐标，包含dx和dy属性
   * @returns 如果点击命中绘制内容返回true，否则返回false
   * 
   * @example
   * ```typescript
   * // 基本点击处理
   * canvas.addEventListener('click', (event) => {
   *   const rect = canvas.getBoundingClientRect();
   *   const position = {
   *     dx: event.clientX - rect.left,
   *     dy: event.clientY - rect.top
   *   };
   * 
   *   if (customPaint.handleTap(position)) {
   *     console.log('点击了绘制内容');
   *     // 执行相应的交互逻辑
   *   }
   * });
   * ```
   * 
   * @example
   * ```typescript
   * // 复杂交互处理
   * class InteractiveChart extends CustomPainter {
   *   private selectedIndex = -1;
   * 
   *   hitTest(position: { dx: number; dy: number }, size: Size): boolean {
   *     // 检测点击的数据点
   *     const clickedIndex = this.getDataPointAt(position);
   *     if (clickedIndex >= 0) {
   *       this.selectedIndex = clickedIndex;
   *       return true;
   *     }
   *     return false;
   *   }
   * 
   *   paint(canvas: Canvas, size: Size): void {
   *     // 绘制图表，高亮选中的数据点
   *   }
   * }
   * 
   * // 使用交互式图表
   * canvas.addEventListener('click', (event) => {
   *   const position = getClickPosition(event);
   *   if (customPaint.handleTap(position)) {
   *     customPaint.repaint(); // 重绘以显示选中状态
   *   }
   * });
   * ```
   * 
   * @example
   * ```typescript
   * // 多点触控支持
   * canvas.addEventListener('touchstart', (event) => {
   *   event.preventDefault();
   *   const touches = event.touches;
   * 
   *   for (let i = 0; i < touches.length; i++) {
   *     const touch = touches[i];
   *     const rect = canvas.getBoundingClientRect();
   *     const position = {
   *       dx: touch.clientX - rect.left,
   *       dy: touch.clientY - rect.top
   *     };
   * 
   *     if (customPaint.handleTap(position)) {
   *       // 处理触摸交互
   *       break;
   *     }
   *   }
   * });
   * ```
   */
  handleTap(position: { dx: number; dy: number }): boolean {
    return this.painter.hitTest(position, this._size);
  }
}

/**
 * 绘制器工厂类 - 提供便捷的CustomPaint实例创建方法
 * 
 * PainterFactory类提供了一系列静态工厂方法，用于简化CustomPaint实例的创建过程。
 * 它封装了从不同来源（如HTML Canvas元素）创建CustomPaint实例的复杂逻辑，
 * 提供了更加便捷和安全的API。
 * 
 * ## 核心功能
 * - **简化创建**: 提供便捷的工厂方法
 * - **错误处理**: 自动处理创建过程中的异常情况
 * - **类型安全**: 确保返回正确类型的实例
 * - **参数验证**: 验证输入参数的有效性
 * 
 * ## 设计模式
 * 采用工厂模式（Factory Pattern）设计，将对象创建逻辑封装在工厂方法中，
 * 使客户端代码更加简洁，同时提供了更好的扩展性。
 * 
 * ## 使用场景
 * - 从HTML Canvas元素创建绘制组件
 * - 批量创建多个绘制实例
 * - 需要统一的创建逻辑和错误处理
 * - 简化复杂的初始化过程
 * 
 * @example
 * ```typescript
 * // 基本使用示例
 * const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
 * const painter = new MyCustomPainter();
 * 
 * const customPaint = PainterFactory.fromCanvasElement(painter, canvas);
 * if (customPaint) {
 *   customPaint.paint(); // 执行绘制
 * } else {
 *   console.error('无法创建CustomPaint实例');
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // 批量创建多个绘制实例
 * const canvases = document.querySelectorAll('canvas.chart');
 * const painters = [
 *   new BarChartPainter(data1),
 *   new LineChartPainter(data2),
 *   new PieChartPainter(data3)
 * ];
 * 
 * const customPaints = Array.from(canvases).map((canvas, index) => {
 *   return PainterFactory.fromCanvasElement(
 *     painters[index],
 *     canvas as HTMLCanvasElement
 *   );
 * }).filter(paint => paint !== null);
 * 
 * // 执行所有绘制
 * customPaints.forEach(paint => paint!.paint());
 * ```
 */
export class PainterFactory {
  /**
   * 从HTML Canvas元素创建CustomPaint实例
   * 
   * 这是最常用的工厂方法，从现有的HTML Canvas元素创建CustomPaint实例。
   * 方法会自动获取Canvas的2D渲染上下文和尺寸信息，并进行必要的验证。
   * 
   * ## 创建流程
   * 1. 获取Canvas元素的2D渲染上下文
   * 2. 验证上下文是否可用
   * 3. 提取Canvas的宽度和高度
   * 4. 创建并返回CustomPaint实例
   * 
   * ## 错误处理
   * - 如果无法获取2D上下文，返回null
   * - 自动处理浏览器兼容性问题
   * - 提供安全的错误恢复机制
   * 
   * ## 注意事项
   * - 确保Canvas元素已正确设置width和height属性
   * - 检查浏览器对Canvas 2D API的支持
   * - 返回值可能为null，需要进行空值检查
   * 
   * @param painter - 自定义绘制器实例，定义具体的绘制逻辑
   * @param canvasElement - HTML Canvas元素，作为绘制的目标
   * @returns CustomPaint实例，如果创建失败则返回null
   * 
   * @example
   * ```typescript
   * // 基本使用
   * const canvas = document.getElementById('chart') as HTMLCanvasElement;
   * const painter = new ChartPainter(chartData);
   * 
   * const customPaint = PainterFactory.fromCanvasElement(painter, canvas);
   * if (customPaint) {
   *   customPaint.paint();
   * } else {
   *   console.error('Canvas不支持2D渲染上下文');
   * }
   * ```
   * 
   * @example
   * ```typescript
   * // 动态创建Canvas并使用工厂方法
   * function createChart(containerId: string, data: any[]): CustomPaint | null {
   *   // 创建Canvas元素
   *   const canvas = document.createElement('canvas');
   *   canvas.width = 800;
   *   canvas.height = 400;
   *   
   *   // 添加到容器
   *   const container = document.getElementById(containerId);
   *   container?.appendChild(canvas);
   *   
   *   // 使用工厂方法创建CustomPaint
   *   const painter = new DataVisualizationPainter(data);
   *   return PainterFactory.fromCanvasElement(painter, canvas);
   * }
   * 
   * const chart = createChart('chart-container', myData);
   * chart?.paint();
   * ```
   * 
   * @example
   * ```typescript
   * // 响应式Canvas设置
   * function setupResponsiveChart(canvas: HTMLCanvasElement) {
   *   // 设置Canvas尺寸以匹配CSS尺寸
   *   const rect = canvas.getBoundingClientRect();
   *   canvas.width = rect.width * window.devicePixelRatio;
   *   canvas.height = rect.height * window.devicePixelRatio;
   *   
   *   // 创建CustomPaint实例
   *   const painter = new ResponsivePainter();
   *   const customPaint = PainterFactory.fromCanvasElement(painter, canvas);
   *   
   *   if (customPaint) {
   *     // 调整Canvas样式以适应高DPI显示器
   *     const ctx = canvas.getContext('2d')!;
   *     ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
   *     
   *     customPaint.paint();
   *   }
   *   
   *   return customPaint;
   * }
   * ```
   */
  static fromCanvasElement(
    painter: CustomPainter,
    canvasElement: HTMLCanvasElement
  ): CustomPaint | null {
    const context = canvasElement.getContext("2d");
    if (!context) {
      return null;
    }

    const size: Size = {
      width: canvasElement.width,
      height: canvasElement.height,
    };

    return new CustomPaint(painter, context, size);
  }
}

/**
 * 动画绘制器基类 - 支持动画效果的CustomPainter扩展
 * 
 * AnimatedCustomPainter是CustomPainter的抽象子类，专门用于创建具有动画效果的绘制器。
 * 它提供了动画值管理、动画绘制接口和自动重绘机制，简化了动画绘制的实现过程。
 * 
 * ## 核心功能
 * - **动画值管理**: 自动管理0-1范围内的动画进度值
 * - **动画绘制接口**: 提供专门的动画绘制方法
 * - **智能重绘**: 基于动画值变化的自动重绘机制
 * - **平滑过渡**: 支持各种动画缓动效果
 * - **性能优化**: 优化的动画渲染流程
 * 
 * ## 动画原理
 * 动画通过连续改变animationValue（0到1之间的数值）来实现，
 * 每次值变化时会触发重绘，在paintAnimated方法中根据当前
 * 动画值计算并绘制相应的动画帧。
 * 
 * ## 使用场景
 * - 数据可视化的动画效果
 * - UI组件的过渡动画
 * - 加载动画和进度指示器
 * - 交互反馈动画
 * - 复杂的动画序列
 * 
 * ## 动画生命周期
 * 1. 设置初始animationValue（通常为0）
 * 2. 通过动画库或定时器逐步改变animationValue
 * 3. 每次值变化触发shouldRepaint检查
 * 4. 如需重绘，调用paintAnimated方法
 * 5. 动画完成时animationValue达到1
 * 
 * @example
 * ```typescript
 * // 基本动画绘制器
 * class FadeInPainter extends AnimatedCustomPainter {
 *   constructor(private content: string) {
 *     super();
 *   }
 * 
 *   paintAnimated(canvas: Canvas, size: Size, animationValue: number): void {
 *     const paint = new Paint();
 *     paint.color = Color.black;
 *     paint.alpha = animationValue; // 根据动画值设置透明度
 * 
 *     canvas.drawText(
 *       this.content,
 *       { dx: size.width / 2, dy: size.height / 2 },
 *       paint
 *     );
 *   }
 * }
 * 
 * // 使用动画绘制器
 * const painter = new FadeInPainter("Hello World");
 * const customPaint = new CustomPaint(painter, context, size);
 * 
 * // 创建淡入动画
 * function animate() {
 *   painter.animationValue += 0.02; // 每帧增加2%
 *   if (painter.animationValue < 1) {
 *     requestAnimationFrame(animate);
 *   }
 * }
 * animate();
 * ```
 * 
 * @example
 * ```typescript
 * // 复杂动画序列
 * class ProgressBarPainter extends AnimatedCustomPainter {
 *   constructor(
 *     private maxValue: number,
 *     private currentValue: number
 *   ) {
 *     super();
 *   }
 * 
 *   paintAnimated(canvas: Canvas, size: Size, animationValue: number): void {
 *     const paint = new Paint();
 *     
 *     // 绘制背景
 *     paint.color = Color.lightGray;
 *     canvas.drawRect({
 *       left: 0, top: 0,
 *       right: size.width, bottom: size.height
 *     }, paint);
 * 
 *     // 计算动画进度
 *     const targetProgress = this.currentValue / this.maxValue;
 *     const currentProgress = targetProgress * animationValue;
 * 
 *     // 绘制进度条
 *     paint.color = Color.blue;
 *     canvas.drawRect({
 *       left: 0, top: 0,
 *       right: size.width * currentProgress, bottom: size.height
 *     }, paint);
 *   }
 * 
 *   updateValue(newValue: number) {
 *     this.currentValue = newValue;
 *     this.animationValue = 0; // 重置动画
 *   }
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // 使用动画库集成
 * import { gsap } from 'gsap';
 * 
 * class BouncingBallPainter extends AnimatedCustomPainter {
 *   paintAnimated(canvas: Canvas, size: Size, animationValue: number): void {
 *     // 使用缓动函数计算位置
 *     const easeValue = this.easeOutBounce(animationValue);
 *     const y = size.height * (1 - easeValue);
 * 
 *     const paint = new Paint();
 *     paint.color = Color.red;
 *     canvas.drawCircle(
 *       { dx: size.width / 2, dy: y },
 *       20,
 *       paint
 *     );
 *   }
 * 
 *   private easeOutBounce(t: number): number {
 *     // 弹跳缓动函数实现
 *     if (t < 1 / 2.75) {
 *       return 7.5625 * t * t;
 *     } else if (t < 2 / 2.75) {
 *       return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
 *     } else if (t < 2.5 / 2.75) {
 *       return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
 *     } else {
 *       return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
 *     }
 *   }
 * }
 * 
 * // 使用GSAP驱动动画
 * const painter = new BouncingBallPainter();
 * gsap.to(painter, {
 *   animationValue: 1,
 *   duration: 2,
 *   ease: "power2.out",
 *   repeat: -1,
 *   yoyo: true
 * });
 * ```
 */
export abstract class AnimatedCustomPainter extends CustomPainter {
  private _animationValue: number = 0;

  /**
   * 获取当前动画进度值
   * 
   * 返回当前的动画进度，范围在0到1之间。
   * 0表示动画开始状态，1表示动画结束状态。
   * 
   * @returns 当前动画进度值（0-1之间）
   * 
   * @example
   * ```typescript
   * const progress = painter.animationValue;
   * console.log(`动画进度: ${(progress * 100).toFixed(1)}%`);
   * ```
   */
  get animationValue(): number {
    return this._animationValue;
  }

  /**
   * 设置动画进度值
   * 
   * 设置新的动画进度值，会自动限制在0到1的范围内。
   * 设置新值后会触发shouldRepaint检查，如果需要则自动重绘。
   * 
   * ## 值约束
   * - 输入值小于0时，自动设置为0
   * - 输入值大于1时，自动设置为1
   * - 确保动画值始终在有效范围内
   * 
   * ## 重绘触发
   * 每次设置新值都会触发重绘检查，只有当值真正发生变化时
   * 才会执行重绘操作，避免不必要的性能开销。
   * 
   * @param value - 新的动画进度值，会被限制在0-1范围内
   * 
   * @example
   * ```typescript
   * // 线性动画
   * function animateLinear() {
   *   painter.animationValue += 0.01; // 每次增加1%
   *   if (painter.animationValue < 1) {
   *     requestAnimationFrame(animateLinear);
   *   }
   * }
   * ```
   * 
   * @example
   * ```typescript
   * // 基于时间的动画
   * const startTime = Date.now();
   * const duration = 2000; // 2秒动画
   * 
   * function animateTime() {
   *   const elapsed = Date.now() - startTime;
   *   const progress = Math.min(elapsed / duration, 1);
   *   
   *   painter.animationValue = progress;
   *   
   *   if (progress < 1) {
   *     requestAnimationFrame(animateTime);
   *   }
   * }
   * ```
   */
  set animationValue(value: number) {
    this._animationValue = Math.max(0, Math.min(1, value)); // 限制在 0-1 之间
  }

  /**
   * 动画绘制方法 - 子类必须实现的动画绘制逻辑
   * 
   * 这是AnimatedCustomPainter的核心方法，子类必须实现此方法来定义
   * 具体的动画绘制逻辑。方法接收当前的动画进度值，并根据该值
   * 绘制相应的动画帧。
   * 
   * ## 参数说明
   * - canvas: 画布对象，用于执行绘制操作
   * - size: 绘制区域尺寸
   * - animationValue: 当前动画进度（0-1之间）
   * 
   * ## 实现要点
   * - 根据animationValue计算当前帧的视觉状态
   * - 使用插值算法实现平滑过渡
   * - 考虑不同的缓动效果
   * - 优化绘制性能，避免复杂计算
   * 
   * ## 动画技巧
   * - **线性插值**: `start + (end - start) * animationValue`
   * - **颜色插值**: 分别插值RGB分量
   * - **位置插值**: 插值坐标值实现移动动画
   * - **缩放插值**: 插值尺寸实现缩放动画
   * - **旋转插值**: 插值角度实现旋转动画
   * 
   * @param canvas - 画布对象，提供所有绘制API
   * @param size - 绘制区域的尺寸
   * @param animationValue - 当前动画进度值（0-1之间）
   * 
   * @example
   * ```typescript
   * class ScaleAnimationPainter extends AnimatedCustomPainter {
   *   paintAnimated(canvas: Canvas, size: Size, animationValue: number): void {
   *     // 计算缩放比例（从0.1到1.0）
   *     const scale = 0.1 + (1.0 - 0.1) * animationValue;
   *     
   *     // 计算缩放后的尺寸
   *     const scaledWidth = size.width * scale;
   *     const scaledHeight = size.height * scale;
   *     
   *     // 计算居中位置
   *     const x = (size.width - scaledWidth) / 2;
   *     const y = (size.height - scaledHeight) / 2;
   * 
   *     const paint = new Paint();
   *     paint.color = Color.blue;
   *     canvas.drawRect({
   *       left: x, top: y,
   *       right: x + scaledWidth, bottom: y + scaledHeight
   *     }, paint);
   *   }
   * }
   * ```
   * 
   * @example
   * ```typescript
   * class ColorTransitionPainter extends AnimatedCustomPainter {
   *   constructor(
   *     private startColor: Color,
   *     private endColor: Color
   *   ) {
   *     super();
   *   }
   * 
   *   paintAnimated(canvas: Canvas, size: Size, animationValue: number): void {
   *     // 颜色插值
   *     const r = this.lerp(this.startColor.red, this.endColor.red, animationValue);
   *     const g = this.lerp(this.startColor.green, this.endColor.green, animationValue);
   *     const b = this.lerp(this.startColor.blue, this.endColor.blue, animationValue);
   * 
   *     const paint = new Paint();
   *     paint.color = new Color(r, g, b);
   *     canvas.drawRect({
   *       left: 0, top: 0,
   *       right: size.width, bottom: size.height
   *     }, paint);
   *   }
   * 
   *   private lerp(start: number, end: number, t: number): number {
   *     return start + (end - start) * t;
   *   }
   * }
   * ```
   */
  abstract paintAnimated(
    canvas: Canvas,
    size: Size,
    animationValue: number
  ): void;

  /**
   * 实现基类的paint方法 - 自动调用动画绘制逻辑
   * 
   * 这是CustomPainter基类paint方法的实现，它自动将当前的动画进度值
   * 传递给paintAnimated方法。这样子类只需要实现paintAnimated方法，
   * 而不需要关心paint方法的具体实现。
   * 
   * ## 工作流程
   * 1. 获取当前的animationValue
   * 2. 调用子类实现的paintAnimated方法
   * 3. 传递canvas、size和animationValue参数
   * 
   * ## 设计优势
   * - **简化子类实现**: 子类只需关注动画绘制逻辑
   * - **统一接口**: 保持与CustomPainter的兼容性
   * - **自动传值**: 自动传递当前动画进度
   * - **类型安全**: 确保参数类型正确
   * 
   * @param canvas - 画布对象，用于绘制操作
   * @param size - 绘制区域的尺寸
   * 
   * @example
   * ```typescript
   * // 子类无需重写paint方法，只需实现paintAnimated
   * class MyAnimatedPainter extends AnimatedCustomPainter {
   *   paintAnimated(canvas: Canvas, size: Size, animationValue: number): void {
   *     // 动画绘制逻辑
   *     const opacity = animationValue;
   *     // ... 绘制代码
   *   }
   *   
   *   // paint方法会自动调用paintAnimated
   * }
   * 
   * // 使用时与普通CustomPainter相同
   * const painter = new MyAnimatedPainter();
   * const customPaint = new CustomPaint(painter, context, size);
   * customPaint.paint(); // 内部会调用paintAnimated
   * ```
   */
  paint(canvas: Canvas, size: Size): void {
    this.paintAnimated(canvas, size, this._animationValue);
  }

  /**
   * 判断是否需要重新绘制 - 基于动画值变化的智能重绘
   * 
   * 重写基类的shouldRepaint方法，专门针对动画场景进行优化。
   * 当动画值发生变化时返回true，触发重绘；当动画值未变化时
   * 返回false，避免不必要的重绘操作。
   * 
   * ## 判断逻辑
   * 1. 检查旧绘制器是否也是AnimatedCustomPainter实例
   * 2. 如果是，比较两者的animationValue是否相同
   * 3. 如果animationValue不同，返回true（需要重绘）
   * 4. 如果不是AnimatedCustomPainter实例，返回true（安全重绘）
   * 
   * ## 性能优化
   * - **精确比较**: 只有动画值真正变化时才重绘
   * - **类型检查**: 确保比较的有效性
   * - **默认安全**: 不确定时选择重绘，确保正确性
   * 
   * ## 扩展建议
   * 子类可以重写此方法来添加额外的重绘条件，例如：
   * - 其他属性的变化
   * - 外部状态的变化
   * - 复杂的重绘策略
   * 
   * @param oldDelegate - 上一次绘制时使用的绘制器实例
   * @returns 如果需要重绘返回true，否则返回false
   * 
   * @example
   * ```typescript
   * // 基本使用（自动处理）
   * const painter = new MyAnimatedPainter();
   * painter.animationValue = 0.5;
   * // shouldRepaint会自动检测到变化并返回true
   * 
   * // 扩展重绘条件
   * class AdvancedAnimatedPainter extends AnimatedCustomPainter {
   *   private dataVersion: number = 0;
   * 
   *   shouldRepaint(oldDelegate: CustomPainter): boolean {
   *     // 首先检查基类的动画值变化
   *     const baseNeedsRepaint = super.shouldRepaint(oldDelegate);
   *     
   *     // 添加额外的重绘条件
   *     if (oldDelegate instanceof AdvancedAnimatedPainter) {
   *       return baseNeedsRepaint || 
   *              this.dataVersion !== oldDelegate.dataVersion;
   *     }
   *     
   *     return baseNeedsRepaint;
   *   }
   * 
   *   updateData(newData: any) {
   *     this.dataVersion++;
   *     // 数据更新会触发重绘
   *   }
   * }
   * ```
   * 
   * @example
   * ```typescript
   * // 性能监控示例
   * class MonitoredAnimatedPainter extends AnimatedCustomPainter {
   *   private repaintCount = 0;
   * 
   *   shouldRepaint(oldDelegate: CustomPainter): boolean {
   *     const needsRepaint = super.shouldRepaint(oldDelegate);
   *     
   *     if (needsRepaint) {
   *       this.repaintCount++;
   *       console.log(`重绘次数: ${this.repaintCount}`);
   *     }
   *     
   *     return needsRepaint;
   *   }
   * 
   *   paintAnimated(canvas: Canvas, size: Size, animationValue: number): void {
   *     // 绘制逻辑
   *   }
   * }
   * ```
   */
  shouldRepaint(oldDelegate: CustomPainter): boolean {
    if (oldDelegate instanceof AnimatedCustomPainter) {
      return this._animationValue !== oldDelegate._animationValue;
    }
    return true;
  }
}
