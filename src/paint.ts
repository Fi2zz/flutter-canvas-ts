import { Color } from './color';
import type { PaintingStyle, StrokeCap, StrokeJoin, BlendMode } from './types';

/**
 * Paint - Flutter 风格的绘制样式类
 * 
 * 这个类封装了绘制图形时所需的所有样式信息，类似于 Flutter 中的 Paint 类。
 * 它定义了如何绘制图形的外观，包括颜色、填充/描边样式、线条属性、混合模式等。
 * 
 * 主要功能包括：
 * 1. 颜色管理 - 设置绘制颜色
 * 2. 绘制样式 - 填充或描边模式
 * 3. 线条属性 - 宽度、端点样式、连接样式、斜接限制
 * 4. 渲染选项 - 混合模式、抗锯齿
 * 5. 上下文应用 - 将样式应用到 Canvas 2D 上下文
 * 6. 实例管理 - 克隆和重置功能
 * 
 * @class Paint
 * 
 * @example
 * ```typescript
 * // 创建基本的填充画笔
 * const fillPaint = new Paint();
 * fillPaint.color = Color.red;
 * fillPaint.style = 'fill';
 * 
 * // 创建描边画笔
 * const strokePaint = new Paint();
 * strokePaint.color = Color.blue;
 * strokePaint.style = 'stroke';
 * strokePaint.strokeWidth = 2;
 * strokePaint.strokeCap = 'round';
 * 
 * // 应用到画布上下文
 * strokePaint.applyToContext(ctx);
 * ctx.strokeRect(10, 10, 100, 100);
 * ```
 */
export class Paint {
  /** 绘制颜色 - 私有属性，通过 getter/setter 访问 */
  private _color: Color = Color.black;
  
  /** 绘制样式 - 填充或描边 */
  private _style: PaintingStyle = 'fill' as PaintingStyle;
  
  /** 描边宽度 - 仅在描边模式下有效 */
  private _strokeWidth: number = 0.0;
  
  /** 描边端点样式 - 控制线条两端的形状 */
  private _strokeCap: StrokeCap = 'butt' as StrokeCap;
  
  /** 描边连接样式 - 控制线条连接处的形状 */
  private _strokeJoin: StrokeJoin = 'miter' as StrokeJoin;
  
  /** 斜接限制 - 控制尖角连接的最大长度 */
  private _strokeMiterLimit: number = 4.0;
  
  /** 混合模式 - 控制新绘制内容与现有内容的混合方式 */
  private _blendMode: BlendMode = 'srcOver' as BlendMode;
  
  /** 抗锯齿开关 - 控制是否启用平滑渲染 */
  private _isAntiAlias: boolean = true;

  /**
   * 构造函数 - 创建具有默认样式的 Paint 实例
   * 
   * 默认样式：
   * - 颜色：黑色
   * - 样式：填充
   * - 描边宽度：0
   * - 描边端点：平头 (butt)
   * - 描边连接：斜接 (miter)
   * - 斜接限制：4.0
   * - 混合模式：源覆盖 (srcOver)
   * - 抗锯齿：启用
   * 
   * @example
   * ```typescript
   * const paint = new Paint();
   * console.log(paint.color);  // Color.black
   * console.log(paint.style);  // 'fill'
   * console.log(paint.isAntiAlias);  // true
   * ```
   */
  constructor() {}

  // ==================== 颜色属性 ====================

  /**
   * 获取绘制颜色
   * 
   * @returns 当前设置的颜色
   * 
   * @example
   * ```typescript
   * const paint = new Paint();
   * paint.color = Color.red;
   * console.log(paint.color.red);  // 255
   * ```
   */
  get color(): Color {
    return this._color;
  }

  /**
   * 设置绘制颜色
   * 
   * @param value - 新的颜色值
   * 
   * @example
   * ```typescript
   * const paint = new Paint();
   * 
   * // 设置为预定义颜色
   * paint.color = Color.blue;
   * 
   * // 设置为自定义颜色
   * paint.color = Color.fromARGB(255, 128, 64, 192);
   * 
   * // 设置为半透明颜色
   * paint.color = Color.red.withOpacity(0.5);
   * ```
   */
  set color(value: Color) {
    this._color = value;
  }

  // ==================== 绘制样式属性 ====================

  /**
   * 获取绘制样式
   * 
   * @returns 当前的绘制样式 ('fill' 或 'stroke')
   * 
   * @example
   * ```typescript
   * const paint = new Paint();
   * console.log(paint.style);  // 'fill' (默认)
   * 
   * paint.style = 'stroke';
   * console.log(paint.style);  // 'stroke'
   * ```
   */
  get style(): PaintingStyle {
    return this._style;
  }

  /**
   * 设置绘制样式
   * 
   * @param value - 绘制样式
   *   - 'fill': 填充模式，绘制实心图形
   *   - 'stroke': 描边模式，只绘制轮廓线
   * 
   * @example
   * ```typescript
   * const paint = new Paint();
   * 
   * // 填充模式 - 绘制实心矩形
   * paint.style = 'fill';
   * paint.color = Color.red;
   * 
   * // 描边模式 - 绘制矩形边框
   * paint.style = 'stroke';
   * paint.strokeWidth = 2;
   * paint.color = Color.blue;
   * ```
   */
  set style(value: PaintingStyle) {
    this._style = value;
  }

  // ==================== 描边属性 ====================

  /**
   * 获取描边宽度
   * 
   * @returns 当前的描边宽度（像素）
   * 
   * @example
   * ```typescript
   * const paint = new Paint();
   * paint.strokeWidth = 5;
   * console.log(paint.strokeWidth);  // 5
   * ```
   */
  get strokeWidth(): number {
    return this._strokeWidth;
  }

  /**
   * 设置描边宽度
   * 
   * 描边宽度决定了线条的粗细，仅在 style 为 'stroke' 时有效。
   * 负值会被自动调整为 0。
   * 
   * @param value - 描边宽度（像素），必须 >= 0
   * 
   * @example
   * ```typescript
   * const paint = new Paint();
   * paint.style = 'stroke';
   * 
   * // 细线
   * paint.strokeWidth = 1;
   * 
   * // 粗线
   * paint.strokeWidth = 5;
   * 
   * // 非常粗的线
   * paint.strokeWidth = 10;
   * 
   * // 负值会被调整为 0
   * paint.strokeWidth = -5;
   * console.log(paint.strokeWidth);  // 0
   * ```
   */
  set strokeWidth(value: number) {
    this._strokeWidth = Math.max(0, value);
  }

  /**
   * 获取描边端点样式
   * 
   * @returns 当前的端点样式
   * 
   * @example
   * ```typescript
   * const paint = new Paint();
   * console.log(paint.strokeCap);  // 'butt' (默认)
   * ```
   */
  get strokeCap(): StrokeCap {
    return this._strokeCap;
  }

  /**
   * 设置描边端点样式
   * 
   * 端点样式控制线条两端的形状。
   * 
   * @param value - 端点样式
   *   - 'butt': 平头，线条在端点处直接截断
   *   - 'round': 圆头，在端点处添加半圆形
   *   - 'square': 方头，在端点处添加方形延伸
   * 
   * @example
   * ```typescript
   * const paint = new Paint();
   * paint.style = 'stroke';
   * paint.strokeWidth = 10;
   * 
   * // 平头端点（默认）
   * paint.strokeCap = 'butt';
   * 
   * // 圆形端点
   * paint.strokeCap = 'round';
   * 
   * // 方形端点
   * paint.strokeCap = 'square';
   * ```
   */
  set strokeCap(value: StrokeCap) {
    this._strokeCap = value;
  }

  /**
   * 获取描边连接样式
   * 
   * @returns 当前的连接样式
   * 
   * @example
   * ```typescript
   * const paint = new Paint();
   * console.log(paint.strokeJoin);  // 'miter' (默认)
   * ```
   */
  get strokeJoin(): StrokeJoin {
    return this._strokeJoin;
  }

  /**
   * 设置描边连接样式
   * 
   * 连接样式控制两条线段连接处的形状。
   * 
   * @param value - 连接样式
   *   - 'miter': 斜接，延伸线段直到相交形成尖角
   *   - 'round': 圆角，在连接处添加圆弧
   *   - 'bevel': 斜角，在连接处添加平面切角
   * 
   * @example
   * ```typescript
   * const paint = new Paint();
   * paint.style = 'stroke';
   * paint.strokeWidth = 8;
   * 
   * // 尖角连接（默认）
   * paint.strokeJoin = 'miter';
   * 
   * // 圆角连接
   * paint.strokeJoin = 'round';
   * 
   * // 斜角连接
   * paint.strokeJoin = 'bevel';
   * ```
   */
  set strokeJoin(value: StrokeJoin) {
    this._strokeJoin = value;
  }

  /**
   * 获取斜接限制
   * 
   * @returns 当前的斜接限制值
   * 
   * @example
   * ```typescript
   * const paint = new Paint();
   * console.log(paint.strokeMiterLimit);  // 4.0 (默认)
   * ```
   */
  get strokeMiterLimit(): number {
    return this._strokeMiterLimit;
  }

  /**
   * 设置斜接限制
   * 
   * 斜接限制控制斜接连接的最大长度。当两条线段的夹角很小时，
   * 斜接连接可能会变得很长，此时会自动切换为斜角连接。
   * 
   * @param value - 斜接限制值，必须 >= 0
   * 
   * @example
   * ```typescript
   * const paint = new Paint();
   * paint.style = 'stroke';
   * paint.strokeJoin = 'miter';
   * 
   * // 默认限制
   * paint.strokeMiterLimit = 4.0;
   * 
   * // 更严格的限制（更容易切换为斜角）
   * paint.strokeMiterLimit = 2.0;
   * 
   * // 更宽松的限制（允许更长的尖角）
   * paint.strokeMiterLimit = 10.0;
   * 
   * // 负值会被调整为 0
   * paint.strokeMiterLimit = -1;
   * console.log(paint.strokeMiterLimit);  // 0
   * ```
   */
  set strokeMiterLimit(value: number) {
    this._strokeMiterLimit = Math.max(0, value);
  }

  // ==================== 渲染选项 ====================

  /**
   * 获取混合模式
   * 
   * @returns 当前的混合模式
   * 
   * @example
   * ```typescript
   * const paint = new Paint();
   * console.log(paint.blendMode);  // 'srcOver' (默认)
   * ```
   */
  get blendMode(): BlendMode {
    return this._blendMode;
  }

  /**
   * 设置混合模式
   * 
   * 混合模式控制新绘制的内容如何与画布上现有内容混合。
   * 
   * @param value - 混合模式，支持多种 CSS 混合模式
   * 
   * @example
   * ```typescript
   * const paint = new Paint();
   * 
   * // 默认模式：新内容覆盖旧内容
   * paint.blendMode = 'srcOver';
   * 
   * // 相乘模式：颜色相乘，产生更暗的效果
   * paint.blendMode = 'multiply';
   * 
   * // 屏幕模式：颜色反相乘，产生更亮的效果
   * paint.blendMode = 'screen';
   * 
   * // 叠加模式：结合相乘和屏幕模式
   * paint.blendMode = 'overlay';
   * 
   * // 差值模式：计算颜色差值
   * paint.blendMode = 'difference';
   * ```
   */
  set blendMode(value: BlendMode) {
    this._blendMode = value;
  }

  /**
   * 获取抗锯齿状态
   * 
   * @returns 是否启用抗锯齿
   * 
   * @example
   * ```typescript
   * const paint = new Paint();
   * console.log(paint.isAntiAlias);  // true (默认启用)
   * ```
   */
  get isAntiAlias(): boolean {
    return this._isAntiAlias;
  }

  /**
   * 设置抗锯齿状态
   * 
   * 抗锯齿可以让图形边缘更平滑，但会稍微影响性能。
   * 
   * @param value - 是否启用抗锯齿
   * 
   * @example
   * ```typescript
   * const paint = new Paint();
   * 
   * // 启用抗锯齿（默认，推荐）
   * paint.isAntiAlias = true;
   * 
   * // 禁用抗锯齿（性能优先，边缘可能有锯齿）
   * paint.isAntiAlias = false;
   * ```
   */
  set isAntiAlias(value: boolean) {
    this._isAntiAlias = value;
  }

  // ==================== 上下文应用方法 ====================

  /**
   * 将 Paint 样式应用到 Canvas 2D 上下文
   * 
   * 这个方法将当前 Paint 实例的所有样式设置应用到指定的
   * Canvas 2D 渲染上下文，使后续的绘制操作使用这些样式。
   * 
   * @param ctx - Canvas 2D 渲染上下文
   * 
   * @example
   * ```typescript
   * const canvas = document.createElement('canvas');
   * const ctx = canvas.getContext('2d')!;
   * 
   * // 创建填充画笔
   * const fillPaint = new Paint();
   * fillPaint.color = Color.red;
   * fillPaint.style = 'fill';
   * 
   * // 应用样式并绘制
   * fillPaint.applyToContext(ctx);
   * ctx.fillRect(10, 10, 100, 100);  // 绘制红色矩形
   * 
   * // 创建描边画笔
   * const strokePaint = new Paint();
   * strokePaint.color = Color.blue;
   * strokePaint.style = 'stroke';
   * strokePaint.strokeWidth = 3;
   * strokePaint.strokeCap = 'round';
   * 
   * // 应用样式并绘制
   * strokePaint.applyToContext(ctx);
   * ctx.strokeRect(120, 10, 100, 100);  // 绘制蓝色边框
   * ```
   */
  applyToContext(ctx: CanvasRenderingContext2D): void {
    // 设置颜色
    const colorString = this._color.toCssString();
    if (this._style === 'fill') {
      ctx.fillStyle = colorString;
    } else {
      ctx.strokeStyle = colorString;
    }

    // 设置线条样式
    ctx.lineWidth = this._strokeWidth;
    ctx.lineCap = this._strokeCap;
    ctx.lineJoin = this._strokeJoin;
    ctx.miterLimit = this._strokeMiterLimit;

    // 设置混合模式
    ctx.globalCompositeOperation = this._blendMode as GlobalCompositeOperation;

    // 设置抗锯齿
    ctx.imageSmoothingEnabled = this._isAntiAlias;
  }

  // ==================== 实例管理方法 ====================

  /**
   * 创建当前 Paint 实例的副本
   * 
   * 返回一个新的 Paint 实例，具有与当前实例相同的所有属性值。
   * 这对于需要基于现有样式创建变体时很有用。
   * 
   * @returns 新的 Paint 实例副本
   * 
   * @example
   * ```typescript
   * // 创建原始画笔
   * const originalPaint = new Paint();
   * originalPaint.color = Color.red;
   * originalPaint.style = 'stroke';
   * originalPaint.strokeWidth = 5;
   * 
   * // 创建副本
   * const clonedPaint = originalPaint.clone();
   * 
   * // 修改副本不会影响原始画笔
   * clonedPaint.color = Color.blue;
   * clonedPaint.strokeWidth = 3;
   * 
   * console.log(originalPaint.color);  // 仍然是红色
   * console.log(originalPaint.strokeWidth);  // 仍然是 5
   * console.log(clonedPaint.color);  // 蓝色
   * console.log(clonedPaint.strokeWidth);  // 3
   * ```
   */
  clone(): Paint {
    const paint = new Paint();
    paint._color = this._color;
    paint._style = this._style;
    paint._strokeWidth = this._strokeWidth;
    paint._strokeCap = this._strokeCap;
    paint._strokeJoin = this._strokeJoin;
    paint._strokeMiterLimit = this._strokeMiterLimit;
    paint._blendMode = this._blendMode;
    paint._isAntiAlias = this._isAntiAlias;
    return paint;
  }

  /**
   * 重置 Paint 实例为默认值
   * 
   * 将当前实例的所有属性重置为构造函数中的默认值。
   * 这对于重用 Paint 实例时很有用。
   * 
   * @example
   * ```typescript
   * const paint = new Paint();
   * 
   * // 修改一些属性
   * paint.color = Color.red;
   * paint.style = 'stroke';
   * paint.strokeWidth = 10;
   * paint.isAntiAlias = false;
   * 
   * console.log(paint.color);  // 红色
   * console.log(paint.strokeWidth);  // 10
   * 
   * // 重置为默认值
   * paint.reset();
   * 
   * console.log(paint.color);  // Color.black
   * console.log(paint.style);  // 'fill'
   * console.log(paint.strokeWidth);  // 0
   * console.log(paint.isAntiAlias);  // true
   * ```
   */
  reset(): void {
    this._color = Color.black;
    this._style = 'fill' as PaintingStyle;
    this._strokeWidth = 0.0;
    this._strokeCap = 'butt' as StrokeCap;
    this._strokeJoin = 'miter' as StrokeJoin;
    this._strokeMiterLimit = 4.0;
    this._blendMode = 'srcOver' as BlendMode;
    this._isAntiAlias = true;
  }
}