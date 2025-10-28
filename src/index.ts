/**
 * Flutter Painting TypeScript Implementation
 *
 * 这是一个 TypeScript 实现的 Flutter painting 库，提供了类似 Flutter 的绘制 API，
 * 可以在 Web 环境中使用。该库包含以下核心功能：
 *
 * 1. Canvas - 画布绘制接口，提供各种图形绘制方法
 * 2. Paint - 绘制样式配置，包括颜色、线条样式、混合模式等
 * 3. Color - 颜色处理，支持 ARGB、RGB、HSL 等多种颜色格式
 * 4. Path - 路径构建，支持复杂的矢量图形绘制
 * 5. CustomPainter - 自定义绘制器，支持动画和交互
 *
 */

// ==================== 核心类导出 ====================
// 这些是库的核心绘制类，提供基础的绘制功能

/**
 * Canvas - 画布类
 * 提供在 HTML5 Canvas 上绘制图形的接口，包括：
 * - 基础图形绘制（矩形、圆形、椭圆等）
 * - 路径绘制和裁剪
 * - 坐标变换（平移、旋转、缩放）
 * - 绘制状态管理（保存/恢复）
 */
export { Canvas } from "./canvas";

/**
 * Paint - 绘制样式类
 * 定义如何绘制图形的样式属性，包括：
 * - 颜色和透明度
 * - 填充或描边样式
 * - 线条宽度、端点样式、连接样式
 * - 混合模式和抗锯齿设置
 */
export { Paint } from "./paint";

/**
 * Color - 颜色类
 * 提供颜色的创建、转换和操作功能，支持：
 * - ARGB、RGB、HSL 颜色格式
 * - 颜色透明度调整
 * - 预定义常用颜色常量
 * - CSS 颜色字符串转换
 */
export { Color } from "./color";

/**
 * Path - 路径类
 * 用于构建复杂的矢量图形路径，支持：
 * - 直线、曲线、弧线绘制
 * - 复杂形状组合
 * - 路径变换和操作
 * - 点击测试和边界计算
 */
export { Path } from "./path";

// ==================== 自定义绘制相关导出 ====================
// 这些类用于创建自定义的绘制逻辑和组件

/**
 * CustomPainter - 自定义绘制器抽象类
 * 用于实现自定义的绘制逻辑，子类需要实现 paint 方法
 *
 * CustomPaint - 自定义绘制组件
 * 将 CustomPainter 与 Canvas 结合，提供完整的自定义绘制功能
 *
 * PainterFactory - 绘制器工厂类
 * 提供便捷的方法来创建和管理 CustomPaint 实例
 *
 * AnimatedCustomPainter - 动画绘制器抽象类
 * 扩展 CustomPainter，添加动画支持，适用于需要动画效果的绘制场景
 */
export {
  CustomPainter,
  CustomPaint,
  PainterFactory,
  AnimatedCustomPainter,
} from "./custom-painter";

// ==================== 类型定义导出 ====================
// 这些是库中使用的核心数据结构和接口定义

/**
 * 基础几何类型：
 * - Offset: 二维坐标点，包含 dx 和 dy 属性
 * - Size: 尺寸信息，包含 width 和 height 属性
 * - Rect: 矩形区域，包含 left、top、right、bottom 属性
 * - RRect: 圆角矩形，包含矩形区域和各个角的圆角半径
 * - IColor: 颜色接口，定义颜色的基本属性
 * - GradientStop: 渐变停止点，用于定义渐变效果
 */
export type { Offset, Size, Rect, RRect, GradientStop } from "./types";

// ==================== 枚举类型导出 ====================
// 这些枚举定义了绘制过程中使用的各种选项和模式

/**
 * 绘制相关枚举：
 * - PaintingStyle: 绘制样式（填充/描边）
 * - StrokeCap: 线条端点样式（平头/圆头/方头）
 * - StrokeJoin: 线条连接样式（尖角/圆角/斜角）
 * - BlendMode: 混合模式，定义新绘制内容与现有内容的混合方式
 *
 * 路径相关枚举：
 * - PathOperation: 路径操作类型（并集/交集/差集/异或）
 * - PathFillType: 路径填充规则（非零/奇偶）
 *
 * 文本相关枚举：
 * - TextAlign: 文本对齐方式
 * - FontWeight: 字体粗细
 * - FontStyle: 字体样式（正常/斜体）
 *
 * 渐变相关枚举：
 * - TileMode: 平铺模式，定义渐变超出边界时的处理方式
 */
export {
  PaintingStyle,
  StrokeCap,
  StrokeJoin,
  BlendMode,
  PathOperation,
  PathFillType,
  TextAlign,
  FontWeight,
  FontStyle,
  TileMode,
} from "./types";

// ==================== 工具函数集合 ====================
// 提供便捷的几何对象创建和数学计算功能

/**
 * PaintingHelpers - 绘制辅助工具集
 *
 * 这个工具集提供了一系列便捷的静态方法，用于：
 * 1. 创建基础几何对象（Offset、Size、Rect、RRect）
 * 2. 进行数学计算（角度转换、线性插值）
 * 3. 颜色操作（颜色插值）
 *
 * 使用示例：
 * ```typescript
 * import { PaintingHelpers } from 'flutter-canvas-ts';
 *
 * // 创建坐标点
 * const point = PaintingHelpers.offset(100, 200);
 *
 * // 创建矩形
 * const rect = PaintingHelpers.rectFromLTWH(0, 0, 100, 100);
 *
 * // 角度转换
 * const radians = PaintingHelpers.degreesToRadians(90);
 * ```
 */
export const PaintingHelpers = {
  /**
   * 创建 Offset 对象（二维坐标点）
   *
   * @param dx - X 轴坐标值
   * @param dy - Y 轴坐标值
   * @returns 包含指定坐标的 Offset 对象
   *
   * @example
   * ```typescript
   * const center = PaintingHelpers.offset(100, 100);
   * const origin = PaintingHelpers.offset(0, 0);
   * ```
   */
  offset(dx: number, dy: number): Offset {
    return { dx, dy };
  },

  /**
   * 创建 Size 对象（尺寸信息）
   *
   * @param width - 宽度值，必须为非负数
   * @param height - 高度值，必须为非负数
   * @returns 包含指定尺寸的 Size 对象
   *
   * @example
   * ```typescript
   * const canvasSize = PaintingHelpers.size(800, 600);
   * const iconSize = PaintingHelpers.size(24, 24);
   * ```
   */
  size(width: number, height: number): Size {
    return { width, height };
  },

  /**
   * 创建 Rect 对象（矩形区域）
   *
   * @param left - 左边界坐标
   * @param top - 上边界坐标
   * @param right - 右边界坐标
   * @param bottom - 下边界坐标
   * @returns 包含指定边界的 Rect 对象
   *
   * @example
   * ```typescript
   * const rect = PaintingHelpers.rect(10, 10, 110, 60);
   * ```
   */
  rect(left: number, top: number, right: number, bottom: number): Rect {
    return { left, top, right, bottom };
  },

  /**
   * 从 LTRB（Left-Top-Right-Bottom）参数创建 Rect
   * 这是 rect() 方法的别名，提供更明确的语义
   *
   * @param left - 左边界坐标
   * @param top - 上边界坐标
   * @param right - 右边界坐标
   * @param bottom - 下边界坐标
   * @returns 包含指定边界的 Rect 对象
   */
  rectFromLTRB(left: number, top: number, right: number, bottom: number): Rect {
    return { left, top, right, bottom };
  },

  /**
   * 从 LTWH（Left-Top-Width-Height）参数创建 Rect
   * 这是创建矩形最常用的方法，通过左上角坐标和尺寸定义矩形
   *
   * @param left - 左边界坐标
   * @param top - 上边界坐标
   * @param width - 矩形宽度，必须为非负数
   * @param height - 矩形高度，必须为非负数
   * @returns 计算得出的 Rect 对象
   *
   * @example
   * ```typescript
   * // 创建一个从 (50, 50) 开始，大小为 100x80 的矩形
   * const rect = PaintingHelpers.rectFromLTWH(50, 50, 100, 80);
   * // 结果: { left: 50, top: 50, right: 150, bottom: 130 }
   * ```
   */
  rectFromLTWH(left: number, top: number, width: number, height: number): Rect {
    return {
      left,
      top,
      right: left + width,
      bottom: top + height,
    };
  },

  /**
   * 从中心点和尺寸创建 Rect
   * 根据中心点坐标和矩形的宽高，计算出矩形的边界
   *
   * @param center - 矩形的中心点坐标
   * @param width - 矩形宽度，必须为非负数
   * @param height - 矩形高度，必须为非负数
   * @returns 以指定点为中心的 Rect 对象
   *
   * @example
   * ```typescript
   * const center = PaintingHelpers.offset(100, 100);
   * const rect = PaintingHelpers.rectFromCenter(center, 80, 60);
   * // 结果: { left: 60, top: 70, right: 140, bottom: 130 }
   * ```
   */
  rectFromCenter(center: Offset, width: number, height: number): Rect {
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    return {
      left: center.dx - halfWidth,
      top: center.dy - halfHeight,
      right: center.dx + halfWidth,
      bottom: center.dy + halfHeight,
    };
  },

  /**
   * 创建统一圆角的圆角矩形（RRect）
   * 所有四个角使用相同的圆角半径
   *
   * @param rect - 基础矩形区域
   * @param radius - 圆角半径，必须为非负数
   * @returns 包含指定圆角的 RRect 对象
   *
   * @example
   * ```typescript
   * const rect = PaintingHelpers.rectFromLTWH(0, 0, 100, 100);
   * const roundedRect = PaintingHelpers.rRect(rect, 10);
   * ```
   */
  rRect(rect: Rect, radius: number): RRect {
    return {
      rect,
      tlRadiusX: radius,
      tlRadiusY: radius,
      trRadiusX: radius,
      trRadiusY: radius,
      brRadiusX: radius,
      brRadiusY: radius,
      blRadiusX: radius,
      blRadiusY: radius,
    };
  },

  /**
   * 创建不同圆角半径的圆角矩形（RRect）
   * 可以为每个角指定不同的圆角半径，实现更灵活的圆角效果
   *
   * @param rect - 基础矩形区域
   * @param topLeft - 左上角圆角半径，默认为 0
   * @param topRight - 右上角圆角半径，默认为 0
   * @param bottomRight - 右下角圆角半径，默认为 0
   * @param bottomLeft - 左下角圆角半径，默认为 0
   * @returns 包含指定圆角的 RRect 对象
   *
   * @example
   * ```typescript
   * const rect = PaintingHelpers.rectFromLTWH(0, 0, 100, 100);
   * // 只有左上角和右上角有圆角的矩形（类似标签页效果）
   * const tabRect = PaintingHelpers.rRectFromRadii(rect, 10, 10, 0, 0);
   * ```
   */
  rRectFromRadii(
    rect: Rect,
    topLeft: number = 0,
    topRight: number = 0,
    bottomRight: number = 0,
    bottomLeft: number = 0
  ): RRect {
    return {
      rect,
      tlRadiusX: topLeft,
      tlRadiusY: topLeft,
      trRadiusX: topRight,
      trRadiusY: topRight,
      brRadiusX: bottomRight,
      brRadiusY: bottomRight,
      blRadiusX: bottomLeft,
      blRadiusY: bottomLeft,
    };
  },

  /**
   * 将角度转换为弧度
   *
   * @param degrees - 角度值（0-360）
   * @returns 对应的弧度值（0-2π）
   *
   * @example
   * ```typescript
   * const rightAngle = PaintingHelpers.degreesToRadians(90); // π/2
   * const fullCircle = PaintingHelpers.degreesToRadians(360); // 2π
   * ```
   */
  degreesToRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
  },

  /**
   * 将弧度转换为角度
   *
   * @param radians - 弧度值（0-2π）
   * @returns 对应的角度值（0-360）
   *
   * @example
   * ```typescript
   * const rightAngle = PaintingHelpers.radiansToDegrees(Math.PI / 2); // 90
   * const fullCircle = PaintingHelpers.radiansToDegrees(Math.PI * 2); // 360
   * ```
   */
  radiansToDegrees(radians: number): number {
    return (radians * 180) / Math.PI;
  },

  /**
   * 线性插值计算
   * 在两个数值之间进行线性插值，常用于动画和渐变计算
   *
   * @param a - 起始值
   * @param b - 结束值
   * @param t - 插值参数（0-1），0 返回 a，1 返回 b
   * @returns 插值结果
   *
   * @example
   * ```typescript
   * const start = 0;
   * const end = 100;
   * const middle = PaintingHelpers.lerp(start, end, 0.5); // 50
   * const quarter = PaintingHelpers.lerp(start, end, 0.25); // 25
   * ```
   */
  lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  },

  /**
   * 颜色线性插值
   * 在两个颜色之间进行线性插值，用于创建颜色渐变效果
   *
   * @param a - 起始颜色
   * @param b - 结束颜色
   * @param t - 插值参数（0-1），0 返回颜色 a，1 返回颜色 b
   * @returns 插值得到的新颜色
   *
   * @example
   * ```typescript
   * const red = Color.red;
   * const blue = Color.blue;
   * const purple = PaintingHelpers.lerpColor(red, blue, 0.5);
   * ```
   */
  lerpColor(a: Color, b: Color, t: number): Color {
    const r = Math.round(this.lerp(a.red, b.red, t));
    const g = Math.round(this.lerp(a.green, b.green, t));
    const bl = Math.round(this.lerp(a.blue, b.blue, t));
    const alpha = Math.round(this.lerp(a.alpha, b.alpha, t));
    return Color.fromARGB(alpha, r, g, bl);
  },
};

// ==================== 类型导入 ====================
// 重新导入类型以避免循环引用问题
import type { Offset, Size, Rect, RRect } from "./types";
import { Color } from "./color";
