/**
 * Flutter Painting 相关类型定义
 *
 * 本文件定义了 Flutter Painting 库中使用的所有核心类型、接口和枚举。
 * 这些类型提供了完整的绘制系统所需的数据结构，包括：
 *
 * 1. 基础几何类型 - 用于描述位置、尺寸和区域
 * 2. 颜色相关类型 - 用于颜色表示和渐变定义
 * 3. 绘制样式枚举 - 定义各种绘制选项和模式
 * 4. 路径操作枚举 - 用于复杂路径的布尔运算
 * 5. 文本相关枚举 - 用于文本渲染的样式设置
 *
 * @author Vue State Builders Team
 * @version 1.0.0
 */

import type { Color } from "./color";

// ==================== 基础几何类型 ====================
// 这些接口定义了绘制系统中的基本几何概念

/**
 * Offset - 二维坐标点接口
 *
 * 表示二维平面上的一个点，包含 X 和 Y 坐标。
 * 在 Flutter 中，Offset 通常用于表示位置、偏移量或向量。
 *
 * @interface Offset
 *
 * @example
 * ```typescript
 * // 创建一个坐标点
 * const point: Offset = { dx: 100, dy: 200 };
 *
 * // 计算两点之间的距离
 * const distance = Math.sqrt(
 *   Math.pow(point2.dx - point1.dx, 2) +
 *   Math.pow(point2.dy - point1.dy, 2)
 * );
 * ```
 */
export interface Offset {
  /** X 轴坐标值 */
  dx: number;
  /** Y 轴坐标值 */
  dy: number;
}

/**
 * Size - 尺寸信息接口
 *
 * 表示二维对象的尺寸，包含宽度和高度。
 * 用于定义画布大小、组件尺寸、图像尺寸等。
 *
 * @interface Size
 *
 * @example
 * ```typescript
 * // 定义画布尺寸
 * const canvasSize: Size = { width: 800, height: 600 };
 *
 * // 计算面积
 * const area = canvasSize.width * canvasSize.height;
 *
 * // 计算宽高比
 * const aspectRatio = canvasSize.width / canvasSize.height;
 * ```
 */
export interface Size {
  /** 宽度值，应为非负数 */
  width: number;
  /** 高度值，应为非负数 */
  height: number;
}

/**
 * Rect - 矩形区域接口
 *
 * 表示一个矩形区域，通过四个边界坐标定义。
 * 这是绘制系统中最常用的几何形状之一。
 *
 * @interface Rect
 *
 * @example
 * ```typescript
 * // 定义一个矩形区域
 * const rect: Rect = { left: 10, top: 10, right: 110, bottom: 60 };
 *
 * // 计算矩形的宽度和高度
 * const width = rect.right - rect.left;   // 100
 * const height = rect.bottom - rect.top;  // 50
 *
 * // 检查点是否在矩形内
 * function containsPoint(rect: Rect, point: Offset): boolean {
 *   return point.dx >= rect.left && point.dx <= rect.right &&
 *          point.dy >= rect.top && point.dy <= rect.bottom;
 * }
 * ```
 */
export interface Rect {
  /** 左边界 X 坐标 */
  left: number;
  /** 上边界 Y 坐标 */
  top: number;
  /** 右边界 X 坐标 */
  right: number;
  /** 下边界 Y 坐标 */
  bottom: number;
}

/**
 * RRect - 圆角矩形接口
 *
 * 表示一个带有圆角的矩形，每个角可以有不同的水平和垂直圆角半径。
 * 这允许创建复杂的圆角效果，如椭圆形圆角。
 *
 * @interface RRect
 *
 * @example
 * ```typescript
 * // 创建一个统一圆角的矩形
 * const uniformRRect: RRect = {
 *   rect: { left: 0, top: 0, right: 100, bottom: 100 },
 *   tlRadiusX: 10, tlRadiusY: 10,  // 左上角
 *   trRadiusX: 10, trRadiusY: 10,  // 右上角
 *   brRadiusX: 10, brRadiusY: 10,  // 右下角
 *   blRadiusX: 10, blRadiusY: 10   // 左下角
 * };
 *
 * // 创建一个只有上方圆角的矩形（类似标签页）
 * const tabRRect: RRect = {
 *   rect: { left: 0, top: 0, right: 100, bottom: 50 },
 *   tlRadiusX: 8, tlRadiusY: 8,    // 左上角有圆角
 *   trRadiusX: 8, trRadiusY: 8,    // 右上角有圆角
 *   brRadiusX: 0, brRadiusY: 0,    // 右下角无圆角
 *   blRadiusX: 0, blRadiusY: 0     // 左下角无圆角
 * };
 * ```
 */
export interface RRect {
  /** 基础矩形区域 */
  rect: Rect;
  /** 左上角水平圆角半径 */
  tlRadiusX: number;
  /** 左上角垂直圆角半径 */
  tlRadiusY: number;
  /** 右上角水平圆角半径 */
  trRadiusX: number;
  /** 右上角垂直圆角半径 */
  trRadiusY: number;
  /** 右下角水平圆角半径 */
  brRadiusX: number;
  /** 右下角垂直圆角半径 */
  brRadiusY: number;
  /** 左下角水平圆角半径 */
  blRadiusX: number;
  /** 左下角垂直圆角半径 */
  blRadiusY: number;
}

// ==================== 绘制样式枚举 ====================

/**
 * PaintingStyle - 绘制样式枚举
 *
 * 定义图形的绘制方式：填充或描边。
 * 这是绘制系统中最基本的样式选择。
 *
 * @enum PaintingStyle
 *
 * @example
 * ```typescript
 * import { PaintingStyle } from './types';
 *
 * // 创建填充样式的画笔
 * const fillPaint = new Paint();
 * fillPaint.style = PaintingStyle.fill;
 *
 * // 创建描边样式的画笔
 * const strokePaint = new Paint();
 * strokePaint.style = PaintingStyle.stroke;
 * strokePaint.strokeWidth = 2;
 * ```
 */
export enum PaintingStyle {
  /** 填充模式 - 填充图形内部 */
  fill = "fill",
  /** 描边模式 - 只绘制图形边框 */
  stroke = "stroke",
}

/**
 * StrokeCap - 线条端点样式枚举
 *
 * 定义线条两端的绘制样式。
 * 影响线条的视觉效果，特别是在线条较粗时更为明显。
 *
 * @enum StrokeCap
 *
 * @example
 * ```typescript
 * import { StrokeCap } from './types';
 *
 * // 平头端点（默认）
 * paint.strokeCap = StrokeCap.butt;
 *
 * // 圆形端点（常用于平滑效果）
 * paint.strokeCap = StrokeCap.round;
 *
 * // 方形端点（延伸半个线宽）
 * paint.strokeCap = StrokeCap.square;
 * ```
 */
export enum StrokeCap {
  /** 平头端点 - 线条在端点处平直截断 */
  butt = "butt",
  /** 圆形端点 - 线条端点为半圆形 */
  round = "round",
  /** 方形端点 - 线条端点延伸半个线宽的方形 */
  square = "square",
}

/**
 * StrokeJoin - 线条连接样式枚举
 *
 * 定义两条线段连接处的绘制样式。
 * 影响路径中线段连接点的视觉效果。
 *
 * @enum StrokeJoin
 *
 * @example
 * ```typescript
 * import { StrokeJoin } from './types';
 *
 * // 尖角连接（默认）
 * paint.strokeJoin = StrokeJoin.miter;
 * paint.strokeMiterLimit = 4.0;  // 控制尖角的最大长度
 *
 * // 圆角连接（平滑效果）
 * paint.strokeJoin = StrokeJoin.round;
 *
 * // 斜角连接（切掉尖角）
 * paint.strokeJoin = StrokeJoin.bevel;
 * ```
 */
export enum StrokeJoin {
  /** 尖角连接 - 线段延伸直到相交形成尖角 */
  miter = "miter",
  /** 圆角连接 - 连接处为圆弧 */
  round = "round",
  /** 斜角连接 - 连接处为平直的斜切面 */
  bevel = "bevel",
}

/**
 * BlendMode - 混合模式枚举
 *
 * 定义新绘制的内容与画布上现有内容的混合方式。
 * 对应 Canvas 2D API 的 globalCompositeOperation 属性。
 *
 * @enum BlendMode
 *
 * @example
 * ```typescript
 * import { BlendMode } from './types';
 *
 * // 正常绘制（默认）
 * paint.blendMode = BlendMode.srcOver;
 *
 * // 乘法混合（变暗效果）
 * paint.blendMode = BlendMode.multiply;
 *
 * // 屏幕混合（变亮效果）
 * paint.blendMode = BlendMode.screen;
 *
 * // 差值混合（创建特殊效果）
 * paint.blendMode = BlendMode.difference;
 * ```
 */
export enum BlendMode {
  /** 清除模式 - 清除目标区域 */
  clear = "clear",
  /** 源覆盖模式 - 新内容覆盖旧内容 */
  src = "source-over",
  /** 目标覆盖模式 - 旧内容覆盖新内容 */
  dst = "destination-over",
  /** 源在上模式 - 默认的正常绘制模式 */
  srcOver = "source-over",
  /** 目标在上模式 - 在现有内容下方绘制 */
  dstOver = "destination-over",
  /** 源在内模式 - 只在现有内容区域内绘制 */
  srcIn = "source-in",
  /** 目标在内模式 - 只保留现有内容与新内容重叠的部分 */
  dstIn = "destination-in",
  /** 源在外模式 - 只在现有内容区域外绘制 */
  srcOut = "source-out",
  /** 目标在外模式 - 只保留现有内容与新内容不重叠的部分 */
  dstOut = "destination-out",
  /** 源在顶部模式 - 在现有内容上方绘制，但只在重叠区域 */
  srcATop = "source-atop",
  /** 目标在顶部模式 - 现有内容在新内容上方，但只在重叠区域 */
  dstATop = "destination-atop",
  /** 异或模式 - 只显示不重叠的部分 */
  xor = "xor",
  /** 加法模式 - 颜色值相加（变亮） */
  plus = "lighter",
  /** 调制模式 - 颜色值相乘 */
  modulate = "multiply",
  /** 乘法模式 - 颜色相乘（变暗效果） */
  multiply = "multiply",
  /** 屏幕模式 - 反向乘法（变亮效果） */
  screen = "screen",
  /** 叠加模式 - 结合乘法和屏幕模式 */
  overlay = "overlay",
  /** 变暗模式 - 选择较暗的颜色 */
  darken = "darken",
  /** 变亮模式 - 选择较亮的颜色 */
  lighten = "lighten",
  /** 颜色减淡模式 - 减少对比度使颜色变亮 */
  colorDodge = "color-dodge",
  /** 颜色加深模式 - 增加对比度使颜色变暗 */
  colorBurn = "color-burn",
  /** 强光模式 - 强烈的叠加效果 */
  hardLight = "hard-light",
  /** 柔光模式 - 柔和的叠加效果 */
  softLight = "soft-light",
  /** 差值模式 - 颜色值相减的绝对值 */
  difference = "difference",
  /** 排除模式 - 类似差值但对比度较低 */
  exclusion = "exclusion",
  /** 色相模式 - 保留底层的饱和度和亮度，使用顶层的色相 */
  hue = "hue",
  /** 饱和度模式 - 保留底层的色相和亮度，使用顶层的饱和度 */
  saturation = "saturation",
  /** 颜色模式 - 保留底层的亮度，使用顶层的色相和饱和度 */
  color = "color",
  /** 亮度模式 - 保留底层的色相和饱和度，使用顶层的亮度 */
  luminosity = "luminosity",
}

// ==================== 路径操作枚举 ====================

/**
 * PathOperation - 路径操作类型枚举
 *
 * 定义两个路径之间的布尔运算类型。
 * 用于创建复杂的路径形状。
 *
 * @enum PathOperation
 *
 * @example
 * ```typescript
 * import { PathOperation } from './types';
 *
 * // 创建两个路径
 * const circle1 = new Path();
 * circle1.addCircle({dx: 50, dy: 50}, 30);
 *
 * const circle2 = new Path();
 * circle2.addCircle({dx: 70, dy: 50}, 30);
 *
 * // 计算两个圆的并集
 * const union = Path.combine(PathOperation.union, circle1, circle2);
 *
 * // 计算两个圆的交集
 * const intersection = Path.combine(PathOperation.intersect, circle1, circle2);
 * ```
 */
export enum PathOperation {
  /** 差集 - 从第一个路径中减去第二个路径 */
  difference = "difference",
  /** 交集 - 两个路径的重叠部分 */
  intersect = "intersect",
  /** 并集 - 两个路径的合并 */
  union = "union",
  /** 异或 - 两个路径的非重叠部分 */
  xor = "xor",
}

/**
 * PathFillType - 路径填充规则枚举
 *
 * 定义复杂路径的填充规则，特别是对于自相交路径。
 *
 * @enum PathFillType
 *
 * @example
 * ```typescript
 * import { PathFillType } from './types';
 *
 * const path = new Path();
 * // 创建一个五角星路径（自相交）
 * path.moveTo(50, 0);
 * path.lineTo(61, 35);
 * path.lineTo(98, 35);
 * path.lineTo(68, 57);
 * path.lineTo(79, 91);
 * path.lineTo(50, 70);
 * path.lineTo(21, 91);
 * path.lineTo(32, 57);
 * path.lineTo(2, 35);
 * path.lineTo(39, 35);
 * path.close();
 *
 * // 使用非零规则填充（默认）
 * path.fillType = PathFillType.nonZero;
 *
 * // 使用奇偶规则填充
 * path.fillType = PathFillType.evenOdd;
 * ```
 */
export enum PathFillType {
  /** 非零规则 - 基于路径方向的缠绕数判断填充 */
  nonZero = "nonzero",
  /** 奇偶规则 - 基于射线与路径交点数的奇偶性判断填充 */
  evenOdd = "evenodd",
}

// ==================== 文本相关枚举 ====================

/**
 * TextAlign - 文本对齐方式枚举
 *
 * 定义文本在指定区域内的对齐方式。
 *
 * @enum TextAlign
 *
 * @example
 * ```typescript
 * import { TextAlign } from './types';
 *
 * // 左对齐文本
 * const leftAlignedStyle = {
 *   textAlign: TextAlign.left,
 *   fontSize: 16
 * };
 *
 * // 居中对齐文本
 * const centeredStyle = {
 *   textAlign: TextAlign.center,
 *   fontSize: 20
 * };
 * ```
 */
export enum TextAlign {
  /** 左对齐 */
  left = "left",
  /** 右对齐 */
  right = "right",
  /** 居中对齐 */
  center = "center",
  /** 两端对齐 */
  justify = "justify",
  /** 起始对齐（根据文本方向决定左或右） */
  start = "start",
  /** 结束对齐（根据文本方向决定右或左） */
  end = "end",
}

/**
 * FontWeight - 字体粗细枚举
 *
 * 定义字体的粗细程度，从最细到最粗。
 *
 * @enum FontWeight
 *
 * @example
 * ```typescript
 * import { FontWeight } from './types';
 *
 * // 使用数字权重
 * const lightText = { fontWeight: FontWeight.w300 };
 * const normalText = { fontWeight: FontWeight.w400 };
 * const boldText = { fontWeight: FontWeight.w700 };
 *
 * // 使用语义化权重
 * const normalText2 = { fontWeight: FontWeight.normal };
 * const boldText2 = { fontWeight: FontWeight.bold };
 * ```
 */
export enum FontWeight {
  /** 最细 (100) */
  w100 = "100",
  /** 极细 (200) */
  w200 = "200",
  /** 细 (300) */
  w300 = "300",
  /** 正常 (400) */
  w400 = "400",
  /** 中等 (500) */
  w500 = "500",
  /** 半粗 (600) */
  w600 = "600",
  /** 粗 (700) */
  w700 = "700",
  /** 极粗 (800) */
  w800 = "800",
  /** 最粗 (900) */
  w900 = "900",
  /** 正常粗细，等同于 w400 */
  normal = "400",
  /** 粗体，等同于 w700 */
  bold = "700",
}

/**
 * FontStyle - 字体样式枚举
 *
 * 定义字体的样式，主要是正常和斜体。
 *
 * @enum FontStyle
 *
 * @example
 * ```typescript
 * import { FontStyle } from './types';
 *
 * // 正常字体
 * const normalStyle = {
 *   fontStyle: FontStyle.normal,
 *   fontSize: 16
 * };
 *
 * // 斜体字体
 * const italicStyle = {
 *   fontStyle: FontStyle.italic,
 *   fontSize: 16
 * };
 * ```
 */
export enum FontStyle {
  /** 正常字体 */
  normal = "normal",
  /** 斜体字体 */
  italic = "italic",
}

// ==================== 渐变相关类型 ====================

/**
 * GradientStop - 渐变停止点接口
 *
 * 定义渐变中的一个颜色停止点，包含位置和颜色信息。
 * 用于创建线性渐变和径向渐变效果。
 *
 * @interface GradientStop
 *
 * @example
 * ```typescript
 * import { GradientStop } from './types';
 *
 * // 创建一个从红色到蓝色的渐变
 * const gradientStops: GradientStop[] = [
 *   { offset: 0.0, color: Color.red },      // 起始点为红色
 *   { offset: 0.5, color: Color.yellow },  // 中间点为黄色
 *   { offset: 1.0, color: Color.blue }     // 结束点为蓝色
 * ];
 *
 * // 创建一个彩虹渐变
 * const rainbowStops: GradientStop[] = [
 *   { offset: 0.0, color: Color.red },
 *   { offset: 0.17, color: Color.orange },
 *   { offset: 0.33, color: Color.yellow },
 *   { offset: 0.5, color: Color.green },
 *   { offset: 0.67, color: Color.blue },
 *   { offset: 0.83, color: Color.purple },
 *   { offset: 1.0, color: Color.magenta }
 * ];
 * ```
 */
export interface GradientStop {
  /** 停止点位置 (0.0 到 1.0)，0.0 表示渐变起始，1.0 表示渐变结束 */
  offset: number;
  /** 该停止点的颜色 */
  color: Color;
}

/**
 * TileMode - 平铺模式枚举
 *
 * 定义渐变或图案超出定义边界时的处理方式。
 *
 * @enum TileMode
 *
 * @example
 * ```typescript
 * import { TileMode } from './types';
 *
 * // 创建不同平铺模式的渐变
 *
 * // 夹紧模式 - 边缘颜色延伸
 * const clampGradient = {
 *   stops: gradientStops,
 *   tileMode: TileMode.clamp
 * };
 *
 * // 重复模式 - 渐变重复
 * const repeatGradient = {
 *   stops: gradientStops,
 *   tileMode: TileMode.repeat
 * };
 *
 * // 镜像模式 - 渐变镜像重复
 * const mirrorGradient = {
 *   stops: gradientStops,
 *   tileMode: TileMode.mirror
 * };
 * ```
 */
export enum TileMode {
  /** 夹紧模式 - 边缘颜色延伸到边界外 */
  clamp = "clamp",
  /** 重复模式 - 渐变模式重复 */
  repeat = "repeat",
  /** 镜像模式 - 渐变模式镜像重复 */
  mirror = "mirror",
}
