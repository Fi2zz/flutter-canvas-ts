import { Paint } from './paint';
import { Color } from './color';
import { Path } from './path';
import type { Offset, Size, Rect, RRect } from './types';

/**
 * Canvas - Flutter 风格的画布绘制类
 * 
 * 这个类提供了一个高级的绘制接口，封装了 HTML5 Canvas 2D API，
 * 使其更接近 Flutter 的 Canvas API。它支持各种绘制操作，包括：
 * 
 * 1. 基本图形绘制 - 点、线、矩形、圆形、椭圆、弧形
 * 2. 复杂路径绘制 - 支持自定义路径和复杂形状
 * 3. 坐标变换 - 平移、缩放、旋转、矩阵变换
 * 4. 裁剪操作 - 矩形、圆角矩形、路径裁剪
 * 5. 状态管理 - 保存和恢复绘制状态
 * 
 * @class Canvas
 * 
 * @example
 * ```typescript
 * // 创建画布
 * const canvasElement = document.getElementById('myCanvas') as HTMLCanvasElement;
 * const ctx = canvasElement.getContext('2d')!;
 * const canvas = new Canvas(ctx, { width: 800, height: 600 });
 * 
 * // 创建画笔
 * const paint = new Paint();
 * paint.color = Color.blue;
 * paint.strokeWidth = 2;
 * 
 * // 绘制矩形
 * canvas.drawRect({ left: 10, top: 10, right: 110, bottom: 60 }, paint);
 * 
 * // 绘制圆形
 * canvas.drawCircle({ dx: 200, dy: 100 }, 50, paint);
 * ```
 */
export class Canvas {
  /** 底层的 Canvas 2D 渲染上下文 */
  private ctx: CanvasRenderingContext2D;
  /** 画布的尺寸信息 */
  private _size: Size;

  /**
   * 构造函数 - 创建一个新的 Canvas 实例
   * 
   * @param context - HTML5 Canvas 2D 渲染上下文
   * @param size - 画布的尺寸信息
   * 
   * @example
   * ```typescript
   * const canvasElement = document.getElementById('canvas') as HTMLCanvasElement;
   * const ctx = canvasElement.getContext('2d')!;
   * const canvas = new Canvas(ctx, { width: 800, height: 600 });
   * ```
   */
  constructor(context: CanvasRenderingContext2D, size: Size) {
    this.ctx = context;
    this._size = size;
  }

  /**
   * 获取画布尺寸
   * 
   * 返回画布的尺寸信息的副本，防止外部修改。
   * 
   * @returns 画布尺寸的副本
   * 
   * @example
   * ```typescript
   * const size = canvas.size;
   * console.log(`画布尺寸: ${size.width} x ${size.height}`);
   * ```
   */
  get size(): Size {
    return { ...this._size };
  }

  // ==================== 状态管理方法 ====================

  /**
   * 保存当前绘制状态
   * 
   * 保存当前的绘制状态到状态栈中，包括变换矩阵、裁剪区域、
   * 绘制样式等。可以通过 restore() 方法恢复。
   * 
   * @example
   * ```typescript
   * canvas.save();
   * canvas.translate(100, 100);
   * canvas.rotate(Math.PI / 4);
   * // 进行一些绘制操作...
   * canvas.restore(); // 恢复到 save() 时的状态
   * ```
   */
  save(): void {
    this.ctx.save();
  }

  /**
   * 恢复之前保存的绘制状态
   * 
   * 从状态栈中恢复最近一次 save() 保存的状态。
   * 如果没有保存的状态，此方法不会产生任何效果。
   * 
   * @example
   * ```typescript
   * canvas.save();
   * canvas.scale(2, 2);
   * // 绘制一些放大的内容...
   * canvas.restore(); // 恢复到原始缩放比例
   * ```
   */
  restore(): void {
    this.ctx.restore();
  }

  /**
   * 清空画布
   * 
   * 清除画布上的所有内容。如果提供了颜色参数，
   * 则用指定颜色填充整个画布；否则完全清空画布。
   * 
   * @param color - 可选的填充颜色，如果不提供则完全清空
   * 
   * @example
   * ```typescript
   * // 完全清空画布
   * canvas.clear();
   * 
   * // 用白色填充画布
   * canvas.clear(Color.white);
   * 
   * // 用半透明背景填充
   * canvas.clear(Color.fromARGB(128, 240, 240, 240));
   * ```
   */
  clear(color?: Color): void {
    if (color) {
      this.ctx.fillStyle = color.toCssString();
      this.ctx.fillRect(0, 0, this._size.width, this._size.height);
    } else {
      this.ctx.clearRect(0, 0, this._size.width, this._size.height);
    }
  }

  // ==================== 坐标变换方法 ====================

  /**
   * 平移坐标系
   * 
   * 将坐标系的原点移动指定的距离。后续的绘制操作
   * 都会基于新的原点位置进行。
   * 
   * @param dx - X 轴方向的平移距离
   * @param dy - Y 轴方向的平移距离
   * 
   * @example
   * ```typescript
   * // 将原点移动到 (100, 100)
   * canvas.translate(100, 100);
   * 
   * // 现在在 (0, 0) 绘制实际上会在 (100, 100) 位置
   * canvas.drawCircle({ dx: 0, dy: 0 }, 20, paint);
   * ```
   */
  translate(dx: number, dy: number): void {
    this.ctx.translate(dx, dy);
  }

  /**
   * 缩放坐标系
   * 
   * 按指定比例缩放坐标系。如果只提供一个参数，
   * 则 X 和 Y 轴使用相同的缩放比例。
   * 
   * @param sx - X 轴缩放比例
   * @param sy - Y 轴缩放比例，如果不提供则使用 sx 的值
   * 
   * @example
   * ```typescript
   * // 等比例放大 2 倍
   * canvas.scale(2);
   * 
   * // X 轴放大 2 倍，Y 轴放大 1.5 倍
   * canvas.scale(2, 1.5);
   * 
   * // 水平翻转
   * canvas.scale(-1, 1);
   * ```
   */
  scale(sx: number, sy?: number): void {
    this.ctx.scale(sx, sy ?? sx);
  }

  /**
   * 旋转坐标系
   * 
   * 围绕当前原点旋转坐标系指定的弧度。
   * 正值表示顺时针旋转，负值表示逆时针旋转。
   * 
   * @param radians - 旋转角度（弧度）
   * 
   * @example
   * ```typescript
   * // 顺时针旋转 45 度
   * canvas.rotate(Math.PI / 4);
   * 
   * // 逆时针旋转 90 度
   * canvas.rotate(-Math.PI / 2);
   * 
   * // 旋转 180 度
   * canvas.rotate(Math.PI);
   * ```
   */
  rotate(radians: number): void {
    this.ctx.rotate(radians);
  }

  /**
   * 应用变换矩阵
   * 
   * 将指定的变换矩阵与当前变换矩阵相乘。
   * 变换矩阵格式为 [a, b, c, d, e, f]，对应：
   * [a c e]   [x]
   * [b d f] × [y]
   * [0 0 1]   [1]
   * 
   * @param a - 水平缩放
   * @param b - 垂直倾斜
   * @param c - 水平倾斜  
   * @param d - 垂直缩放
   * @param e - 水平平移
   * @param f - 垂直平移
   * 
   * @example
   * ```typescript
   * // 应用自定义变换矩阵
   * canvas.transform(1, 0, 0, 1, 100, 50); // 平移 (100, 50)
   * 
   * // 组合变换：缩放 + 旋转
   * const cos = Math.cos(Math.PI / 4);
   * const sin = Math.sin(Math.PI / 4);
   * canvas.transform(cos, sin, -sin, cos, 0, 0);
   * ```
   */
  transform(a: number, b: number, c: number, d: number, e: number, f: number): void {
    this.ctx.transform(a, b, c, d, e, f);
  }

  /**
   * 设置变换矩阵
   * 
   * 直接设置当前的变换矩阵，替换之前的所有变换。
   * 
   * @param a - 水平缩放
   * @param b - 垂直倾斜
   * @param c - 水平倾斜
   * @param d - 垂直缩放
   * @param e - 水平平移
   * @param f - 垂直平移
   * 
   * @example
   * ```typescript
   * // 设置为单位矩阵（重置所有变换）
   * canvas.setTransform(1, 0, 0, 1, 0, 0);
   * 
   * // 设置为特定的变换状态
   * canvas.setTransform(2, 0, 0, 2, 100, 100); // 放大2倍并平移
   * ```
   */
  setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void {
    this.ctx.setTransform(a, b, c, d, e, f);
  }

  /**
   * 重置变换矩阵
   * 
   * 将变换矩阵重置为单位矩阵，清除所有变换效果。
   * 等同于 setTransform(1, 0, 0, 1, 0, 0)。
   * 
   * @example
   * ```typescript
   * canvas.scale(2, 2);
   * canvas.rotate(Math.PI / 4);
   * canvas.translate(100, 100);
   * // 应用了多个变换...
   * 
   * canvas.resetTransform(); // 清除所有变换，回到初始状态
   * ```
   */
  resetTransform(): void {
    this.ctx.resetTransform();
  }

  // ==================== 基本图形绘制方法 ====================

  /**
   * 绘制点
   * 
   * 在指定位置绘制一个点。点的大小由画笔的 strokeWidth 决定。
   * 
   * @param offset - 点的位置坐标
   * @param paint - 绘制样式
   * 
   * @example
   * ```typescript
   * const paint = new Paint();
   * paint.color = Color.red;
   * paint.strokeWidth = 4;
   * 
   * // 绘制一个红色的点
   * canvas.drawPoint({ dx: 100, dy: 100 }, paint);
   * ```
   */
  drawPoint(offset: Offset, paint: Paint): void {
    paint.applyToContext(this.ctx);
    this.ctx.beginPath();
    this.ctx.arc(offset.dx, offset.dy, paint.strokeWidth / 2, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  /**
   * 绘制多个点
   * 
   * 批量绘制多个点，每个点使用相同的绘制样式。
   * 
   * @param points - 点的位置坐标数组
   * @param paint - 绘制样式
   * 
   * @example
   * ```typescript
   * const points: Offset[] = [
   *   { dx: 10, dy: 10 },
   *   { dx: 20, dy: 20 },
   *   { dx: 30, dy: 15 },
   *   { dx: 40, dy: 25 }
   * ];
   * 
   * const paint = new Paint();
   * paint.color = Color.blue;
   * paint.strokeWidth = 3;
   * 
   * canvas.drawPoints(points, paint);
   * ```
   */
  drawPoints(points: Offset[], paint: Paint): void {
    points.forEach(point => this.drawPoint(point, paint));
  }

  /**
   * 绘制线段
   * 
   * 在两个点之间绘制一条直线。
   * 
   * @param p1 - 起始点坐标
   * @param p2 - 结束点坐标
   * @param paint - 绘制样式（通常使用描边模式）
   * 
   * @example
   * ```typescript
   * const paint = new Paint();
   * paint.color = Color.black;
   * paint.style = PaintingStyle.stroke;
   * paint.strokeWidth = 2;
   * 
   * // 绘制一条从 (10, 10) 到 (100, 100) 的线段
   * canvas.drawLine({ dx: 10, dy: 10 }, { dx: 100, dy: 100 }, paint);
   * ```
   */
  drawLine(p1: Offset, p2: Offset, paint: Paint): void {
    paint.applyToContext(this.ctx);
    this.ctx.beginPath();
    this.ctx.moveTo(p1.dx, p1.dy);
    this.ctx.lineTo(p2.dx, p2.dy);
    this.ctx.stroke();
  }

  /**
   * 绘制矩形
   * 
   * 绘制一个矩形，可以是填充或描边样式。
   * 
   * @param rect - 矩形的边界定义
   * @param paint - 绘制样式
   * 
   * @example
   * ```typescript
   * // 绘制填充矩形
   * const fillPaint = new Paint();
   * fillPaint.color = Color.blue;
   * fillPaint.style = PaintingStyle.fill;
   * canvas.drawRect({ left: 10, top: 10, right: 110, bottom: 60 }, fillPaint);
   * 
   * // 绘制描边矩形
   * const strokePaint = new Paint();
   * strokePaint.color = Color.red;
   * strokePaint.style = PaintingStyle.stroke;
   * strokePaint.strokeWidth = 2;
   * canvas.drawRect({ left: 20, top: 20, right: 120, bottom: 70 }, strokePaint);
   * ```
   */
  drawRect(rect: Rect, paint: Paint): void {
    paint.applyToContext(this.ctx);
    const width = rect.right - rect.left;
    const height = rect.bottom - rect.top;
    
    if (paint.style === 'fill') {
      this.ctx.fillRect(rect.left, rect.top, width, height);
    } else {
      this.ctx.strokeRect(rect.left, rect.top, width, height);
    }
  }

  /**
   * 绘制圆角矩形
   * 
   * 绘制一个带有圆角的矩形。当前实现使用统一的圆角半径，
   * 取左上角的水平和垂直半径中的较小值。
   * 
   * @param rrect - 圆角矩形的定义
   * @param paint - 绘制样式
   * 
   * @example
   * ```typescript
   * const paint = new Paint();
   * paint.color = Color.green;
   * paint.style = PaintingStyle.fill;
   * 
   * const rrect: RRect = {
   *   rect: { left: 50, top: 50, right: 150, bottom: 100 },
   *   tlRadiusX: 10, tlRadiusY: 10,
   *   trRadiusX: 10, trRadiusY: 10,
   *   brRadiusX: 10, brRadiusY: 10,
   *   blRadiusX: 10, blRadiusY: 10
   * };
   * 
   * canvas.drawRRect(rrect, paint);
   * ```
   */
  drawRRect(rrect: RRect, paint: Paint): void {
    paint.applyToContext(this.ctx);
    this.ctx.beginPath();
    
    const { rect } = rrect;
    const width = rect.right - rect.left;
    const height = rect.bottom - rect.top;
    
    // 简化处理，使用统一的圆角半径
    const radius = Math.min(rrect.tlRadiusX, rrect.tlRadiusY);
    
    this.ctx.roundRect(rect.left, rect.top, width, height, radius);
    
    if (paint.style === 'fill') {
      this.ctx.fill();
    } else {
      this.ctx.stroke();
    }
  }

  /**
   * 绘制圆形
   * 
   * 在指定中心点绘制一个圆形。
   * 
   * @param center - 圆心坐标
   * @param radius - 圆的半径
   * @param paint - 绘制样式
   * 
   * @example
   * ```typescript
   * const paint = new Paint();
   * paint.color = Color.orange;
   * paint.style = PaintingStyle.fill;
   * 
   * // 绘制一个橙色的实心圆
   * canvas.drawCircle({ dx: 200, dy: 150 }, 50, paint);
   * 
   * // 绘制一个蓝色的圆环
   * const strokePaint = new Paint();
   * strokePaint.color = Color.blue;
   * strokePaint.style = PaintingStyle.stroke;
   * strokePaint.strokeWidth = 3;
   * canvas.drawCircle({ dx: 300, dy: 150 }, 40, strokePaint);
   * ```
   */
  drawCircle(center: Offset, radius: number, paint: Paint): void {
    paint.applyToContext(this.ctx);
    this.ctx.beginPath();
    this.ctx.arc(center.dx, center.dy, radius, 0, 2 * Math.PI);
    
    if (paint.style === 'fill') {
      this.ctx.fill();
    } else {
      this.ctx.stroke();
    }
  }

  /**
   * 绘制椭圆
   * 
   * 在指定矩形区域内绘制一个椭圆。椭圆会完全填充矩形区域。
   * 
   * @param rect - 椭圆的外接矩形
   * @param paint - 绘制样式
   * 
   * @example
   * ```typescript
   * const paint = new Paint();
   * paint.color = Color.purple;
   * paint.style = PaintingStyle.fill;
   * 
   * // 绘制一个紫色的椭圆
   * const ovalRect: Rect = { left: 100, top: 50, right: 200, bottom: 120 };
   * canvas.drawOval(ovalRect, paint);
   * ```
   */
  drawOval(rect: Rect, paint: Paint): void {
    paint.applyToContext(this.ctx);
    this.ctx.beginPath();
    
    const centerX = (rect.left + rect.right) / 2;
    const centerY = (rect.top + rect.bottom) / 2;
    const radiusX = (rect.right - rect.left) / 2;
    const radiusY = (rect.bottom - rect.top) / 2;
    
    this.ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
    
    if (paint.style === 'fill') {
      this.ctx.fill();
    } else {
      this.ctx.stroke();
    }
  }

  /**
   * 绘制弧形
   * 
   * 在指定矩形区域内绘制一个弧形。当前实现简化为圆弧。
   * 
   * @param rect - 弧形的外接矩形
   * @param startAngle - 起始角度（弧度）
   * @param sweepAngle - 扫描角度（弧度）
   * @param useCenter - 是否连接到中心点（扇形 vs 弧形）
   * @param paint - 绘制样式
   * 
   * @example
   * ```typescript
   * const paint = new Paint();
   * paint.color = Color.red;
   * paint.style = PaintingStyle.fill;
   * 
   * // 绘制一个 90 度的扇形
   * const arcRect: Rect = { left: 150, top: 150, right: 250, bottom: 250 };
   * canvas.drawArc(arcRect, 0, Math.PI / 2, true, paint);
   * 
   * // 绘制一个弧线（不连接中心）
   * const strokePaint = new Paint();
   * strokePaint.color = Color.blue;
   * strokePaint.style = PaintingStyle.stroke;
   * strokePaint.strokeWidth = 3;
   * canvas.drawArc(arcRect, Math.PI, Math.PI / 2, false, strokePaint);
   * ```
   */
  drawArc(rect: Rect, startAngle: number, sweepAngle: number, useCenter: boolean, paint: Paint): void {
    paint.applyToContext(this.ctx);
    this.ctx.beginPath();
    
    const centerX = (rect.left + rect.right) / 2;
    const centerY = (rect.top + rect.bottom) / 2;
    const radiusX = (rect.right - rect.left) / 2;
    const radiusY = (rect.bottom - rect.top) / 2;
    
    if (useCenter) {
      this.ctx.moveTo(centerX, centerY);
    }
    
    // 简化处理，假设是圆弧
    const radius = Math.min(radiusX, radiusY);
    this.ctx.arc(centerX, centerY, radius, startAngle, startAngle + sweepAngle);
    
    if (useCenter) {
      this.ctx.closePath();
    }
    
    if (paint.style === 'fill') {
      this.ctx.fill();
    } else {
      this.ctx.stroke();
    }
  }

  // ==================== 裁剪方法 ====================

  /**
   * 裁剪矩形区域
   * 
   * 设置一个矩形裁剪区域，后续的绘制操作只会在此区域内可见。
   * 裁剪区域会与之前的裁剪区域求交集。
   * 
   * @param rect - 裁剪矩形的边界
   * 
   * @example
   * ```typescript
   * // 设置裁剪区域
   * canvas.save();
   * canvas.clipRect({ left: 50, top: 50, right: 150, bottom: 150 });
   * 
   * // 在裁剪区域内绘制
   * const paint = new Paint();
   * paint.color = Color.red;
   * canvas.drawCircle({ dx: 100, dy: 100 }, 80, paint); // 只有部分可见
   * 
   * canvas.restore(); // 恢复裁剪区域
   * ```
   */
  clipRect(rect: Rect): void {
    this.ctx.beginPath();
    this.ctx.rect(rect.left, rect.top, rect.right - rect.left, rect.bottom - rect.top);
    this.ctx.clip();
  }

  /**
   * 裁剪圆角矩形区域
   * 
   * 设置一个圆角矩形裁剪区域。当前实现使用统一的圆角半径。
   * 
   * @param rrect - 圆角矩形的定义
   * 
   * @example
   * ```typescript
   * const rrect: RRect = {
   *   rect: { left: 50, top: 50, right: 200, bottom: 150 },
   *   tlRadiusX: 20, tlRadiusY: 20,
   *   trRadiusX: 20, trRadiusY: 20,
   *   brRadiusX: 20, brRadiusY: 20,
   *   blRadiusX: 20, blRadiusY: 20
   * };
   * 
   * canvas.save();
   * canvas.clipRRect(rrect);
   * // 绘制内容，只有圆角矩形内的部分可见
   * canvas.restore();
   * ```
   */
  clipRRect(rrect: RRect): void {
    this.ctx.beginPath();
    const { rect } = rrect;
    const width = rect.right - rect.left;
    const height = rect.bottom - rect.top;
    const radius = Math.min(rrect.tlRadiusX, rrect.tlRadiusY);
    
    this.ctx.roundRect(rect.left, rect.top, width, height, radius);
    this.ctx.clip();
  }

  // ==================== 路径绘制方法 ====================

  /**
   * 绘制路径
   * 
   * 绘制一个自定义路径。路径可以包含直线、曲线、弧形等复杂形状。
   * 
   * @param path - 要绘制的路径对象
   * @param paint - 绘制样式
   * 
   * @example
   * ```typescript
   * // 创建一个心形路径
   * const heartPath = new Path();
   * heartPath.moveTo(100, 150);
   * heartPath.cubicTo(100, 120, 70, 120, 70, 150);
   * heartPath.cubicTo(70, 180, 100, 200, 100, 230);
   * heartPath.cubicTo(100, 200, 130, 180, 130, 150);
   * heartPath.cubicTo(130, 120, 100, 120, 100, 150);
   * heartPath.close();
   * 
   * const paint = new Paint();
   * paint.color = Color.red;
   * paint.style = PaintingStyle.fill;
   * 
   * canvas.drawPath(heartPath, paint);
   * ```
   */
  drawPath(path: Path, paint: Paint): void {
    paint.applyToContext(this.ctx);
    path.applyToContext(this.ctx);
    
    if (paint.style === 'fill') {
      this.ctx.fill(path.fillType);
    } else {
      this.ctx.stroke();
    }
  }

  /**
   * 裁剪路径
   * 
   * 使用指定路径设置裁剪区域。只有路径内部的绘制内容会可见。
   * 
   * @param path - 用于裁剪的路径对象
   * 
   * @example
   * ```typescript
   * // 创建一个星形裁剪路径
   * const starPath = new Path();
   * // ... 构建星形路径 ...
   * 
   * canvas.save();
   * canvas.clipPath(starPath);
   * 
   * // 绘制内容，只有星形内的部分可见
   * const paint = new Paint();
   * paint.color = Color.blue;
   * canvas.drawRect({ left: 0, top: 0, right: 200, bottom: 200 }, paint);
   * 
   * canvas.restore();
   * ```
   */
  clipPath(path: Path): void {
    path.applyToContext(this.ctx);
    this.ctx.clip(path.fillType);
  }

  // ==================== 工具方法 ====================

  /**
   * 获取底层的 Canvas 2D 上下文
   * 
   * 返回底层的 HTML5 Canvas 2D 渲染上下文，用于直接访问
   * Canvas API 或执行高级操作。
   * 
   * @returns Canvas 2D 渲染上下文
   * 
   * @example
   * ```typescript
   * // 获取底层上下文进行高级操作
   * const ctx = canvas.getContext();
   * 
   * // 直接使用 Canvas API
   * ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
   * ctx.shadowBlur = 10;
   * ctx.shadowOffsetX = 5;
   * ctx.shadowOffsetY = 5;
   * 
   * // 然后继续使用 Canvas 类的方法
   * canvas.drawCircle({ dx: 100, dy: 100 }, 50, paint);
   * ```
   */
  getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }
}