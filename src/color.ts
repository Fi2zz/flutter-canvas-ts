/**
 * Color - Flutter 风格的颜色类
 *
 * 这个类实现了 Flutter 的 Color 类功能，提供了完整的颜色操作接口。
 * 颜色使用 32 位 ARGB 格式存储，其中：
 * - A (Alpha): 透明度通道，位于最高 8 位 (24-31)
 * - R (Red): 红色通道，位于次高 8 位 (16-23)
 * - G (Green): 绿色通道，位于中间 8 位 (8-15)
 * - B (Blue): 蓝色通道，位于最低 8 位 (0-7)
 *
 * 支持的功能包括：
 * 1. 多种颜色创建方式 - ARGB、RGBO
 * 2. 颜色通道访问 - 获取各个颜色分量
 * 3. 透明度操作 - 调整 alpha 值和 opacity
 * 4. 格式转换 - CSS 字符串、十六进制字符串
 *
 * @class Color
 * @implements {IColor}
 *
 * @example
 * ```typescript
 * // 创建纯红色
 * const red = Color.fromARGB(255, 255, 0, 0);
 *
 * // 创建半透明蓝色
 * const semiBlue = Color.fromRGBO(0, 0, 255, 0.5);
 *
 * // 调整透明度
 * const transparentRed = red.withOpacity(0.3);
 *
 * // 转换为 CSS 字符串
 * const cssColor = red.toCssString(); // "rgba(255, 0, 0, 1)"
 * ```
 */
export class Color {
  /**
   * 颜色的 32 位 ARGB 值
   *
   * 这是颜色的内部表示，包含了所有颜色信息。
   * 格式为：0xAARRGGBB，其中 AA=alpha, RR=red, GG=green, BB=blue
   */
  public readonly value: number;

  /**
   * 构造函数 - 从 32 位 ARGB 值创建颜色
   *
   * @param value - 32 位 ARGB 颜色值
   *
   * @example
   * ```typescript
   * // 创建纯红色 (不透明)
   * const red = new Color(0xFFFF0000);
   *
   * // 创建半透明绿色
   * const semiGreen = new Color(0x8000FF00);
   *
   * // 创建完全透明的颜色
   * const transparent = new Color(0x00000000);
   * ```
   */
  constructor(value: number) {
    this.value = value;
  }

  /**
   * 获取 Alpha 通道值 (0-255)
   *
   * Alpha 通道控制颜色的透明度，255 表示完全不透明，0 表示完全透明。
   *
   * @returns Alpha 值 (0-255)
   *
   * @example
   * ```typescript
   * const color = Color.fromARGB(128, 255, 0, 0);
   * console.log(color.alpha); // 输出: 128 (半透明)
   *
   * const opaqueColor = Color.fromARGB(255, 0, 255, 0);
   * console.log(opaqueColor.alpha); // 输出: 255 (不透明)
   * ```
   */
  get alpha(): number {
    return (this.value >> 24) & 0xff;
  }

  /**
   * 获取红色通道值 (0-255)
   *
   * @returns 红色分量值 (0-255)
   *
   * @example
   * ```typescript
   * const purple = Color.fromARGB(255, 128, 0, 128);
   * console.log(purple.red); // 输出: 128
   *
   * const pureRed = Color.fromARGB(255, 255, 0, 0);
   * console.log(pureRed.red); // 输出: 255
   * ```
   */
  get red(): number {
    return (this.value >> 16) & 0xff;
  }

  /**
   * 获取绿色通道值 (0-255)
   *
   * @returns 绿色分量值 (0-255)
   *
   * @example
   * ```typescript
   * const yellow = Color.fromARGB(255, 255, 255, 0);
   * console.log(yellow.green); // 输出: 255
   *
   * const cyan = Color.fromARGB(255, 0, 255, 255);
   * console.log(cyan.green); // 输出: 255
   * ```
   */
  get green(): number {
    return (this.value >> 8) & 0xff;
  }

  /**
   * 获取蓝色通道值 (0-255)
   *
   * @returns 蓝色分量值 (0-255)
   *
   * @example
   * ```typescript
   * const blue = Color.fromARGB(255, 0, 0, 255);
   * console.log(blue.blue); // 输出: 255
   *
   * const magenta = Color.fromARGB(255, 255, 0, 255);
   * console.log(magenta.blue); // 输出: 255
   * ```
   */
  get blue(): number {
    return this.value & 0xff;
  }

  /**
   * 获取不透明度 (0.0-1.0)
   *
   * 不透明度是 alpha 值的归一化表示，1.0 表示完全不透明，0.0 表示完全透明。
   *
   * @returns 不透明度值 (0.0-1.0)
   *
   * @example
   * ```typescript
   * const fullOpaque = Color.fromARGB(255, 255, 0, 0);
   * console.log(fullOpaque.opacity); // 输出: 1.0
   *
   * const halfTransparent = Color.fromARGB(128, 0, 255, 0);
   * console.log(halfTransparent.opacity); // 输出: 0.5019607843137255
   *
   * const transparent = Color.fromARGB(0, 0, 0, 255);
   * console.log(transparent.opacity); // 输出: 0.0
   * ```
   */
  get opacity(): number {
    return this.alpha / 255.0;
  }

  // ==================== 静态工厂方法 ====================

  /**
   * 从 ARGB 值创建颜色
   *
   * 这是创建颜色的主要方法，允许精确控制所有颜色通道。
   *
   * @param a - Alpha 值 (0-255)，控制透明度
   * @param r - Red 值 (0-255)，红色分量
   * @param g - Green 值 (0-255)，绿色分量
   * @param b - Blue 值 (0-255)，蓝色分量
   * @returns 新的 Color 实例
   *
   * @example
   * ```typescript
   * // 创建基本颜色
   * const red = Color.fromARGB(255, 255, 0, 0);
   * const green = Color.fromARGB(255, 0, 255, 0);
   * const blue = Color.fromARGB(255, 0, 0, 255);
   *
   * // 创建半透明颜色
   * const semiRed = Color.fromARGB(128, 255, 0, 0);
   *
   * // 创建自定义颜色
   * const purple = Color.fromARGB(255, 128, 0, 128);
   * const orange = Color.fromARGB(255, 255, 165, 0);
   * ```
   */
  static fromARGB(a: number, r: number, g: number, b: number): Color {
    return new Color(
      ((a & 0xff) << 24) | ((r & 0xff) << 16) | ((g & 0xff) << 8) | (b & 0xff)
    );
  }

  /**
   * 从 RGB 值和不透明度创建颜色
   *
   * 这个方法使用 0.0-1.0 的不透明度值，更符合 CSS 和设计工具的习惯。
   *
   * @param r - Red 值 (0-255)，红色分量
   * @param g - Green 值 (0-255)，绿色分量
   * @param b - Blue 值 (0-255)，蓝色分量
   * @param opacity - 不透明度 (0.0-1.0)，1.0 为完全不透明
   * @returns 新的 Color 实例
   *
   * @example
   * ```typescript
   * // 创建完全不透明的颜色
   * const red = Color.fromRGBO(255, 0, 0, 1.0);
   *
   * // 创建半透明颜色
   * const semiBlue = Color.fromRGBO(0, 0, 255, 0.5);
   *
   * // 创建几乎透明的颜色
   * const ghostWhite = Color.fromRGBO(255, 255, 255, 0.1);
   *
   * // 创建完全透明的颜色
   * const invisible = Color.fromRGBO(0, 0, 0, 0.0);
   * ```
   */
  static fromRGBO(r: number, g: number, b: number, opacity: number): Color {
    return Color.fromARGB(Math.round(opacity * 255), r, g, b);
  }

  // ==================== 颜色变换方法 ====================

  /**
   * 调整颜色的不透明度
   *
   * 创建一个新的颜色实例，具有相同的 RGB 值但不同的不透明度。
   *
   * @param opacity - 新的不透明度值 (0.0-1.0)
   * @returns 具有新不透明度的 Color 实例
   *
   * @example
   * ```typescript
   * const red = Color.fromARGB(255, 255, 0, 0);
   *
   * // 创建不同透明度的红色变体
   * const semiRed = red.withOpacity(0.5);     // 半透明红色
   * const faintRed = red.withOpacity(0.2);    // 淡红色
   * const ghostRed = red.withOpacity(0.05);   // 几乎透明的红色
   *
   * // 原始颜色不变
   * console.log(red.opacity);     // 1.0
   * console.log(semiRed.opacity); // 0.5
   * ```
   */
  withOpacity(opacity: number): Color {
    return Color.fromARGB(
      Math.round(opacity * 255),
      this.red,
      this.green,
      this.blue
    );
  }

  /**
   * 调整颜色的 Alpha 值
   *
   * 创建一个新的颜色实例，具有相同的 RGB 值但不同的 Alpha 值。
   *
   * @param alpha - 新的 Alpha 值 (0-255)
   * @returns 具有新 Alpha 值的 Color 实例
   *
   * @example
   * ```typescript
   * const blue = Color.fromARGB(255, 0, 0, 255);
   *
   * // 创建不同 Alpha 值的蓝色变体
   * const semiBlue = blue.withAlpha(128);     // Alpha = 128 (半透明)
   * const faintBlue = blue.withAlpha(64);     // Alpha = 64 (更透明)
   * const invisibleBlue = blue.withAlpha(0);  // Alpha = 0 (完全透明)
   *
   * // 原始颜色不变
   * console.log(blue.alpha);     // 255
   * console.log(semiBlue.alpha); // 128
   * ```
   */
  withAlpha(alpha: number): Color {
    return Color.fromARGB(alpha, this.red, this.green, this.blue);
  }

  // ==================== 格式转换方法 ====================

  /**
   * 转换为 CSS 颜色字符串
   *
   * 将颜色转换为 CSS rgba() 格式的字符串，可直接用于 CSS 样式。
   *
   * @returns CSS rgba 格式的颜色字符串
   *
   * @example
   * ```typescript
   * const red = Color.fromARGB(255, 255, 0, 0);
   * console.log(red.toCssString()); // "rgba(255, 0, 0, 1)"
   *
   * const semiBlue = Color.fromRGBO(0, 0, 255, 0.5);
   * console.log(semiBlue.toCssString()); // "rgba(0, 0, 255, 0.5)"
   *
   * const transparent = Color.fromARGB(0, 128, 128, 128);
   * console.log(transparent.toCssString()); // "rgba(128, 128, 128, 0)"
   *
   * // 在 CSS 中使用
   * element.style.backgroundColor = red.toCssString();
   * element.style.borderColor = semiBlue.toCssString();
   * ```
   */
  toCssString(): string {
    return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.opacity})`;
  }

  /**
   * 转换为十六进制字符串
   *
   * 将颜色转换为 8 位十六进制字符串格式 (#AARRGGBB)，
   * 包含 Alpha 通道信息。
   *
   * @returns 十六进制格式的颜色字符串
   *
   * @example
   * ```typescript
   * const red = Color.fromARGB(255, 255, 0, 0);
   * console.log(red.toHex()); // "#ffff0000"
   *
   * const semiBlue = Color.fromARGB(128, 0, 0, 255);
   * console.log(semiBlue.toHex()); // "#800000ff"
   *
   * const white = Color.fromARGB(255, 255, 255, 255);
   * console.log(white.toHex()); // "#ffffffff"
   *
   * const black = Color.fromARGB(255, 0, 0, 0);
   * console.log(black.toHex()); // "#ff000000"
   *
   * // 注意：格式为 #AARRGGBB，其中 AA 是 Alpha 通道
   * ```
   */
  toHex(): string {
    return `#${this.value.toString(16).padStart(8, "0")}`;
  }

  // ==================== 常用颜色常量 ====================

  /** 透明色 */
  static readonly transparent = Color.fromARGB(0, 0, 0, 0);

  /** 黑色 */
  static readonly black = Color.fromARGB(255, 0, 0, 0);

  /** 白色 */
  static readonly white = Color.fromARGB(255, 255, 255, 255);

  /** 红色 */
  static readonly red = Color.fromARGB(255, 255, 0, 0);

  /** 绿色 */
  static readonly green = Color.fromARGB(255, 0, 255, 0);

  /** 蓝色 */
  static readonly blue = Color.fromARGB(255, 0, 0, 255);

  /** 黄色 */
  static readonly yellow = Color.fromARGB(255, 255, 255, 0);

  /** 青色 */
  static readonly cyan = Color.fromARGB(255, 0, 255, 255);

  /** 洋红色 */
  static readonly magenta = Color.fromARGB(255, 255, 0, 255);

  /** 橙色 */
  static readonly orange = Color.fromARGB(255, 255, 165, 0);

  /** 紫色 */
  static readonly purple = Color.fromARGB(255, 128, 0, 128);

  /** 粉色 */
  static readonly pink = Color.fromARGB(255, 255, 192, 203);

  /** 灰色 */
  static readonly grey = Color.fromARGB(255, 128, 128, 128);

  /** 深灰色 */
  static readonly darkGrey = Color.fromARGB(255, 64, 64, 64);

  /** 浅灰色 */
  static readonly lightGrey = Color.fromARGB(255, 192, 192, 192);
}
