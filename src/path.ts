import type { Offset, Rect, RRect, PathFillType, PathOperation } from "./types";
import { PathFillType as PathFillTypeEnum } from "./types";

/**
 * Path - Flutter 风格的路径构建类
 * 
 * 这个类提供了一个强大的路径构建系统，类似于 Flutter 中的 Path 类。
 * 它允许创建复杂的 2D 图形路径，包括直线、曲线、弧形和各种几何形状。
 * 
 * 主要功能包括：
 * 1. 基本路径操作 - 移动、直线、曲线绘制
 * 2. 几何形状 - 矩形、圆形、椭圆、多边形
 * 3. 高级曲线 - 二次和三次贝塞尔曲线、弧形
 * 4. 路径变换 - 矩阵变换、缩放、旋转
 * 5. 路径运算 - 合并、相交、差集、异或
 * 6. 几何计算 - 边界检测、点包含测试、周长计算
 * 7. 填充规则 - 支持 nonZero 和 evenOdd 填充模式
 * 
 * @class Path
 * 
 * @example
 * ```typescript
 * // 创建一个简单的矩形路径
 * const rectPath = new Path();
 * rectPath.addRect({ left: 10, top: 10, right: 110, bottom: 60 });
 * 
 * // 创建一个复杂的心形路径
 * const heartPath = new Path();
 * heartPath.moveTo(100, 150);
 * heartPath.cubicTo(100, 120, 70, 120, 70, 150);
 * heartPath.cubicTo(70, 180, 100, 200, 100, 230);
 * heartPath.cubicTo(100, 200, 130, 180, 130, 150);
 * heartPath.cubicTo(130, 120, 100, 120, 100, 150);
 * heartPath.close();
 * 
 * // 创建一个星形路径
 * const starPath = new Path();
 * const center = { dx: 100, dy: 100 };
 * const outerRadius = 50;
 * const innerRadius = 25;
 * const points = 5;
 * 
 * for (let i = 0; i < points * 2; i++) {
 *   const angle = (i * Math.PI) / points;
 *   const radius = i % 2 === 0 ? outerRadius : innerRadius;
 *   const x = center.dx + radius * Math.cos(angle - Math.PI / 2);
 *   const y = center.dy + radius * Math.sin(angle - Math.PI / 2);
 *   
 *   if (i === 0) {
 *     starPath.moveTo(x, y);
 *   } else {
 *     starPath.lineTo(x, y);
 *   }
 * }
 * starPath.close();
 * 
 * // 路径变换
 * const scaledPath = heartPath.transform([2, 0, 0, 2, 0, 0]); // 放大2倍
 * 
 * // 路径运算
 * const combinedPath = Path.combine('union', rectPath, starPath);
 * 
 * // 几何计算
 * const bounds = heartPath.getBounds();
 * const isInside = heartPath.contains({ dx: 100, dy: 150 });
 * const perimeter = heartPath.getPerimeter();
 * ```
 */

/**
 * 路径命令接口
 * 
 * 定义了路径中单个绘制命令的结构。每个命令包含一个类型标识符
 * 和相应的参数数组。这种设计允许灵活地存储和重放各种绘制操作。
 * 
 * @interface PathCommand
 * 
 * @example
 * ```typescript
 * // 移动命令
 * const moveCommand: PathCommand = { type: "moveTo", args: [100, 100] };
 * 
 * // 直线命令
 * const lineCommand: PathCommand = { type: "lineTo", args: [200, 150] };
 * 
 * // 贝塞尔曲线命令
 * const curveCommand: PathCommand = { 
 *   type: "bezierCurveTo", 
 *   args: [150, 100, 250, 100, 200, 150] 
 * };
 * ```
 */
interface PathCommand {
  /** 命令类型，如 "moveTo", "lineTo", "bezierCurveTo" 等 */
  type: string;
  /** 命令参数数组，包含坐标和其他数值参数 */
  args: number[];
}

export class Path {
  /** 
   * 路径命令列表
   * 
   * 存储构成路径的所有绘制命令，按添加顺序排列。
   * 每个命令包含类型和参数，用于在渲染时重放路径构建过程。
   */
  private commands: PathCommand[] = [];
  
  /** 
   * 路径填充类型
   * 
   * 控制复杂路径的填充规则：
   * - nonZero: 非零环绕规则，计算路径环绕点的次数
   * - evenOdd: 奇偶规则，计算从点发出的射线与路径的交点数
   */
  private _fillType: PathFillType = PathFillTypeEnum.nonZero;
  
  /** 
   * 当前绘制点
   * 
   * 跟踪路径构建过程中的当前位置，用于相对坐标操作
   * 和路径连续性检查。
   */
  private _currentPoint: Offset = { dx: 0, dy: 0 };

  /**
   * 构造函数 - 创建一个空的路径实例
   * 
   * 初始化一个新的路径对象，具有默认的填充类型（nonZero）
   * 和起始点（0, 0）。路径开始时不包含任何绘制命令。
   * 
   * @example
   * ```typescript
   * const path = new Path();
   * console.log(path.fillType); // 'nonZero'
   * 
   * // 开始构建路径
   * path.moveTo(50, 50);
   * path.lineTo(100, 100);
   * path.close();
   * ```
   */
  constructor() {}

  /**
   * 获取路径填充类型
   * 
   * @returns 当前的填充类型
   * 
   * @example
   * ```typescript
   * const path = new Path();
   * console.log(path.fillType); // 'nonZero' (默认)
   * 
   * path.fillType = 'evenOdd';
   * console.log(path.fillType); // 'evenOdd'
   * ```
   */
  get fillType(): PathFillType {
    return this._fillType;
  }

  /**
   * 设置路径填充类型
   * 
   * 填充类型决定了复杂路径（如自相交路径）的填充方式：
   * 
   * @param value - 填充类型
   *   - 'nonZero': 非零环绕规则，适用于大多数常规形状
   *   - 'evenOdd': 奇偶规则，适用于创建镂空效果
   * 
   * @example
   * ```typescript
   * const path = new Path();
   * 
   * // 使用非零环绕规则（默认）
   * path.fillType = 'nonZero';
   * path.addRect({ left: 0, top: 0, right: 100, bottom: 100 });
   * path.addRect({ left: 25, top: 25, right: 75, bottom: 75 });
   * // 结果：两个矩形都被填充
   * 
   * // 使用奇偶规则
   * path.fillType = 'evenOdd';
   * // 结果：外矩形被填充，内矩形形成镂空
   * ```
   */
  set fillType(value: PathFillType) {
    this._fillType = value;
  }

  /**
   * 移动到指定点（不绘制线条）
   * 
   * 将当前绘制位置移动到指定的绝对坐标，不绘制任何线条。
   * 这通常用于开始一个新的子路径或在路径中创建间断。
   * 
   * @param x - 目标点的X坐标
   * @param y - 目标点的Y坐标
   * 
   * @example
   * ```typescript
   * const path = new Path();
   * 
   * // 移动到起始点
   * path.moveTo(50, 50);
   * 
   * // 绘制一条线到另一个点
   * path.lineTo(100, 100);
   * 
   * // 移动到新位置开始另一个子路径
   * path.moveTo(200, 50);
   * path.lineTo(250, 100);
   * 
   * // 结果：两条独立的线段
   * ```
   */
  moveTo(x: number, y: number): void {
    this.commands.push({ type: "moveTo", args: [x, y] });
    this._currentPoint = { dx: x, dy: y };
  }

  /**
   * 相对移动到指定偏移位置
   * 
   * 从当前位置移动指定的偏移量，不绘制线条。
   * 新位置 = 当前位置 + 偏移量
   * 
   * @param dx - X轴偏移量
   * @param dy - Y轴偏移量
   * 
   * @example
   * ```typescript
   * const path = new Path();
   * 
   * // 移动到起始点
   * path.moveTo(50, 50);
   * 
   * // 绘制一条线
   * path.lineTo(100, 100);
   * 
   * // 从当前位置(100, 100)相对移动
   * path.relativeMoveTo(20, -30); // 移动到(120, 70)
   * 
   * // 继续绘制
   * path.lineTo(150, 70);
   * ```
   */
  relativeMoveTo(dx: number, dy: number): void {
    const newX = this._currentPoint.dx + dx;
    const newY = this._currentPoint.dy + dy;
    this.moveTo(newX, newY);
  }

  /**
   * 绘制直线到指定点
   * 
   * 从当前位置绘制一条直线到指定的绝对坐标。
   * 如果这是路径中的第一个命令，会自动执行moveTo到起始点。
   * 
   * @param x - 终点的X坐标
   * @param y - 终点的Y坐标
   * 
   * @example
   * ```typescript
   * const path = new Path();
   * 
   * // 移动到起始点
   * path.moveTo(10, 10);
   * 
   * // 绘制直线
   * path.lineTo(50, 10);  // 水平线
   * path.lineTo(50, 50);  // 垂直线
   * path.lineTo(10, 50);  // 水平线
   * path.lineTo(10, 10);  // 回到起点，形成矩形
   * 
   * // 或者使用close()方法自动闭合
   * path.close();
   * ```
   */
  lineTo(x: number, y: number): void {
    this.commands.push({ type: "lineTo", args: [x, y] });
    this._currentPoint = { dx: x, dy: y };
  }

  /**
   * 相对绘制直线
   * 
   * 从当前位置绘制一条直线到相对偏移的位置。
   * 终点 = 当前位置 + 偏移量
   * 
   * @param dx - X轴偏移量
   * @param dy - Y轴偏移量
   * 
   * @example
   * ```typescript
   * const path = new Path();
   * 
   * // 移动到起始点
   * path.moveTo(50, 50);
   * 
   * // 使用相对坐标绘制正方形
   * path.relativeLineTo(40, 0);   // 向右40像素
   * path.relativeLineTo(0, 40);   // 向下40像素
   * path.relativeLineTo(-40, 0);  // 向左40像素
   * path.relativeLineTo(0, -40);  // 向上40像素，回到起点
   * 
   * // 闭合路径
   * path.close();
   * ```
   */
  relativeLineTo(dx: number, dy: number): void {
    const newX = this._currentPoint.dx + dx;
    const newY = this._currentPoint.dy + dy;
    this.lineTo(newX, newY);
  }

  /**
   * 绘制二次贝塞尔曲线
   * 
   * 从当前位置绘制一条二次贝塞尔曲线到指定终点，使用一个控制点。
   * 二次贝塞尔曲线由起点、一个控制点和终点定义，形成平滑的曲线。
   * 
   * @param cpx - 控制点的X坐标
   * @param cpy - 控制点的Y坐标  
   * @param x - 终点的X坐标
   * @param y - 终点的Y坐标
   * 
   * @example
   * ```typescript
   * const path = new Path();
   * 
   * // 移动到起始点
   * path.moveTo(50, 100);
   * 
   * // 绘制向上弯曲的二次贝塞尔曲线
   * path.quadraticBezierTo(100, 50, 150, 100);
   * 
   * // 继续绘制另一条曲线
   * path.quadraticBezierTo(200, 150, 250, 100);
   * 
   * // 结果：波浪形曲线
   * ```
   */
  quadraticBezierTo(x1: number, y1: number, x2: number, y2: number): void {
    this.commands.push({ type: "quadraticCurveTo", args: [x1, y1, x2, y2] });
    this._currentPoint = { dx: x2, dy: y2 };
  }

  /**
   * 相对绘制二次贝塞尔曲线
   * 
   * 使用相对坐标绘制二次贝塞尔曲线。所有坐标都相对于当前位置。
   * 
   * @param cpx - 控制点的X轴偏移量
   * @param cpy - 控制点的Y轴偏移量
   * @param dx - 终点的X轴偏移量
   * @param dy - 终点的Y轴偏移量
   * 
   * @example
   * ```typescript
   * const path = new Path();
   * 
   * // 移动到起始点
   * path.moveTo(50, 100);
   * 
   * // 使用相对坐标绘制曲线
   * path.relativeQuadraticBezierTo(50, -50, 100, 0);
   * // 等价于: path.quadraticBezierTo(100, 50, 150, 100);
   * 
   * // 继续绘制对称曲线
   * path.relativeQuadraticBezierTo(50, 50, 100, 0);
   * ```
   */
  relativeQuadraticBezierTo(
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): void {
    const newX1 = this._currentPoint.dx + x1;
    const newY1 = this._currentPoint.dy + y1;
    const newX2 = this._currentPoint.dx + x2;
    const newY2 = this._currentPoint.dy + y2;
    this.quadraticBezierTo(newX1, newY1, newX2, newY2);
  }

  /**
   * 绘制三次贝塞尔曲线
   * 
   * 从当前位置绘制一条三次贝塞尔曲线到指定终点，使用两个控制点。
   * 三次贝塞尔曲线提供更精确的曲线控制，常用于复杂的平滑路径。
   * 
   * @param cp1x - 第一个控制点的X坐标
   * @param cp1y - 第一个控制点的Y坐标
   * @param cp2x - 第二个控制点的X坐标
   * @param cp2y - 第二个控制点的Y坐标
   * @param x - 终点的X坐标
   * @param y - 终点的Y坐标
   * 
   * @example
   * ```typescript
   * const path = new Path();
   * 
   * // 移动到起始点
   * path.moveTo(50, 100);
   * 
   * // 绘制S形三次贝塞尔曲线
   * path.cubicTo(
   *   100, 50,   // 第一个控制点：向上拉
   *   150, 150,  // 第二个控制点：向下拉
   *   200, 100   // 终点：回到中间高度
   * );
   * 
   * // 结果：平滑的S形曲线
   * ```
   */
  cubicTo(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number
  ): void {
    this.commands.push({
      type: "bezierCurveTo",
      args: [x1, y1, x2, y2, x3, y3],
    });
    this._currentPoint = { dx: x3, dy: y3 };
  }

  /**
   * 相对绘制三次贝塞尔曲线
   * 
   * 使用相对坐标绘制三次贝塞尔曲线。所有坐标都相对于当前位置。
   * 
   * @param cp1x - 第一个控制点的X轴偏移量
   * @param cp1y - 第一个控制点的Y轴偏移量
   * @param cp2x - 第二个控制点的X轴偏移量
   * @param cp2y - 第二个控制点的Y轴偏移量
   * @param dx - 终点的X轴偏移量
   * @param dy - 终点的Y轴偏移量
   * 
   * @example
   * ```typescript
   * const path = new Path();
   * 
   * // 移动到起始点
   * path.moveTo(50, 100);
   * 
   * // 使用相对坐标绘制心形曲线的一半
   * path.relativeCubicTo(
   *   0, -30,    // 第一个控制点：向上
   *   30, -30,   // 第二个控制点：向右上
   *   30, 0      // 终点：向右
   * );
   * 
   * // 继续绘制另一半
   * path.relativeCubicTo(
   *   0, 30,     // 第一个控制点：向下
   *   -30, 30,   // 第二个控制点：向左下
   *   -30, 0     // 终点：回到中心
   * );
   * ```
   */
  relativeCubicTo(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number
  ): void {
    const newX1 = this._currentPoint.dx + x1;
    const newY1 = this._currentPoint.dy + y1;
    const newX2 = this._currentPoint.dx + x2;
    const newY2 = this._currentPoint.dy + y2;
    const newX3 = this._currentPoint.dx + x3;
    const newY3 = this._currentPoint.dy + y3;
    this.cubicTo(newX1, newY1, newX2, newY2, newX3, newY3);
  }

  /**
   * 绘制弧线
   * 
   * 在指定的矩形区域内绘制一段弧线。弧线从起始角度开始，
   * 按指定的扫描角度绘制。可以选择是否强制移动到弧线起点。
   * 
   * @param rect - 定义弧线边界的矩形区域
   * @param startAngle - 起始角度（弧度），0为右侧，π/2为下方
   * @param sweepAngle - 扫描角度（弧度），正值为顺时针，负值为逆时针
   * @param forceMoveTo - 是否强制移动到弧线起点（不绘制连接线）
   * 
   * @example
   * ```typescript
   * const path = new Path();
   * const rect = { left: 50, top: 50, right: 150, bottom: 150 };
   * 
   * // 绘制四分之一圆弧（90度）
   * path.arcTo(rect, 0, Math.PI / 2, true);
   * 
   * // 继续绘制另一个四分之一圆弧，连接到前一个弧线
   * path.arcTo(rect, Math.PI / 2, Math.PI / 2, false);
   * 
   * // 绘制完整的圆
   * const circleRect = { left: 200, top: 50, right: 300, bottom: 150 };
   * path.arcTo(circleRect, 0, 2 * Math.PI, true);
   * ```
   */
  arcTo(
    rect: Rect,
    startAngle: number,
    sweepAngle: number,
    forceMoveTo: boolean
  ): void {
    const centerX = (rect.left + rect.right) / 2;
    const centerY = (rect.top + rect.bottom) / 2;
    const radiusX = (rect.right - rect.left) / 2;
    const radiusY = (rect.bottom - rect.top) / 2;

    // 简化处理，假设是圆弧
    const radius = Math.min(radiusX, radiusY);

    if (forceMoveTo) {
      const startX = centerX + radius * Math.cos(startAngle);
      const startY = centerY + radius * Math.sin(startAngle);
      this.moveTo(startX, startY);
    }

    this.commands.push({
      type: "arc",
      args: [centerX, centerY, radius, startAngle, startAngle + sweepAngle],
    });

    const endX = centerX + radius * Math.cos(startAngle + sweepAngle);
    const endY = centerY + radius * Math.sin(startAngle + sweepAngle);
    this._currentPoint = { dx: endX, dy: endY };
  }

  /**
   * 添加矩形路径
   * 
   * 向路径中添加一个矩形。矩形会自动闭合，形成完整的矩形路径。
   * 绘制顺序：左上角 → 右上角 → 右下角 → 左下角 → 闭合
   * 
   * @param rect - 矩形的边界定义
   * 
   * @example
   * ```typescript
   * const path = new Path();
   * 
   * // 添加一个简单矩形
   * const rect1 = { left: 50, top: 50, right: 150, bottom: 100 };
   * path.addRect(rect1);
   * 
   * // 添加另一个矩形到同一路径
   * const rect2 = { left: 200, top: 50, right: 300, bottom: 150 };
   * path.addRect(rect2);
   * 
   * // 结果：路径包含两个独立的矩形
   * ```
   */
  addRect(rect: Rect): void {
    this.moveTo(rect.left, rect.top);
    this.lineTo(rect.right, rect.top);
    this.lineTo(rect.right, rect.bottom);
    this.lineTo(rect.left, rect.bottom);
    this.close();
  }

  /**
   * 添加圆角矩形路径
   * 
   * 向路径中添加一个圆角矩形。圆角矩形的四个角都具有指定的圆角半径，
   * 创建平滑的圆角过渡效果。
   * 
   * @param rrect - 圆角矩形的定义，包含矩形边界和各角的圆角半径
   * 
   * @example
   * ```typescript
   * const path = new Path();
   * 
   * // 创建圆角矩形
   * const rrect = {
   *   rect: { left: 50, top: 50, right: 200, bottom: 150 },
   *   tlRadiusX: 20, tlRadiusY: 20,  // 左上角圆角
   *   trRadiusX: 20, trRadiusY: 20,  // 右上角圆角
   *   blRadiusX: 20, blRadiusY: 20,  // 左下角圆角
   *   brRadiusX: 20, brRadiusY: 20   // 右下角圆角
   * };
   * 
   * path.addRRect(rrect);
   * 
   * // 添加不同圆角半径的矩形
   * const rrect2 = {
   *   rect: { left: 250, top: 50, right: 400, bottom: 150 },
   *   tlRadiusX: 30, tlRadiusY: 15,  // 椭圆形圆角
   *   trRadiusX: 10, trRadiusY: 10,
   *   blRadiusX: 0,  blRadiusY: 0,   // 直角
   *   brRadiusX: 25, brRadiusY: 25
   * };
   * 
   * path.addRRect(rrect2);
   * ```
   */
  addRRect(rrect: RRect): void {
    const { rect } = rrect;
    const radius = Math.min(rrect.tlRadiusX, rrect.tlRadiusY);

    this.commands.push({
      type: "roundRect",
      args: [
        rect.left,
        rect.top,
        rect.right - rect.left,
        rect.bottom - rect.top,
        radius,
      ],
    });
  }

  /**
   * 添加椭圆路径
   * 
   * 向路径中添加一个椭圆，椭圆完全填充指定的矩形区域。
   * 椭圆的中心位于矩形的中心，长轴和短轴分别对应矩形的宽度和高度。
   * 
   * @param rect - 定义椭圆边界的矩形区域
   * 
   * @example
   * ```typescript
   * const path = new Path();
   * 
   * // 添加一个椭圆
   * const rect1 = { left: 50, top: 50, right: 200, bottom: 150 };
   * path.addOval(rect1);  // 宽椭圆
   * 
   * // 添加一个圆形（正方形区域内的椭圆）
   * const rect2 = { left: 250, top: 50, right: 350, bottom: 150 };
   * path.addOval(rect2);  // 圆形
   * 
   * // 添加一个高椭圆
   * const rect3 = { left: 400, top: 50, right: 450, bottom: 200 };
   * path.addOval(rect3);  // 高椭圆
   * ```
   */
  addOval(rect: Rect): void {
    const centerX = (rect.left + rect.right) / 2;
    const centerY = (rect.top + rect.bottom) / 2;
    const radiusX = (rect.right - rect.left) / 2;
    const radiusY = (rect.bottom - rect.top) / 2;

    this.commands.push({
      type: "ellipse",
      args: [centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI],
    });
  }

  /**
   * 添加圆形路径
   * 
   * 向路径中添加一个完整的圆形，以指定的中心点和半径绘制。
   * 圆形是一个特殊的椭圆，其长轴和短轴相等。
   * 
   * @param center - 圆心的坐标位置
   * @param radius - 圆的半径（像素）
   * 
   * @example
   * ```typescript
   * const path = new Path();
   * 
   * // 添加一个小圆
   * path.addCircle({ dx: 100, dy: 100 }, 30);
   * 
   * // 添加一个大圆
   * path.addCircle({ dx: 250, dy: 100 }, 50);
   * 
   * // 添加重叠的圆形，可以创建有趣的形状
   * path.addCircle({ dx: 200, dy: 150 }, 25);
   * path.addCircle({ dx: 220, dy: 150 }, 25);
   * path.addCircle({ dx: 210, dy: 170 }, 25);
   * 
   * // 使用不同的填充规则可以创建不同的效果
   * path.fillType = 'evenOdd';  // 重叠部分会形成镂空
   * ```
   */
  addCircle(center: Offset, radius: number): void {
    this.commands.push({
      type: "arc",
      args: [center.dx, center.dy, radius, 0, 2 * Math.PI],
    });
  }

  /**
   * 添加多边形路径
   * 
   * 向路径中添加一个由多个点连接而成的多边形。可以选择是否自动闭合多边形。
   * 多边形按照点的顺序依次连接，形成连续的线段。
   * 
   * @param points - 多边形顶点的坐标数组，按连接顺序排列
   * @param close - 是否自动闭合多边形（连接最后一点到第一点）
   * 
   * @example
   * ```typescript
   * const path = new Path();
   * 
   * // 创建一个三角形
   * const triangle = [
   *   { dx: 100, dy: 50 },   // 顶点
   *   { dx: 50, dy: 150 },   // 左下角
   *   { dx: 150, dy: 150 }   // 右下角
   * ];
   * path.addPolygon(triangle, true);  // 自动闭合
   * 
   * // 创建一个开放的折线
   * const zigzag = [
   *   { dx: 200, dy: 100 },
   *   { dx: 250, dy: 50 },
   *   { dx: 300, dy: 100 },
   *   { dx: 350, dy: 50 },
   *   { dx: 400, dy: 100 }
   * ];
   * path.addPolygon(zigzag, false);  // 不闭合
   * 
   * // 创建一个正六边形
   * const hexagon = [];
   * const centerX = 300, centerY = 200, radius = 50;
   * for (let i = 0; i < 6; i++) {
   *   const angle = (i * Math.PI * 2) / 6;
   *   hexagon.push({
   *     dx: centerX + radius * Math.cos(angle),
   *     dy: centerY + radius * Math.sin(angle)
   *   });
   * }
   * path.addPolygon(hexagon, true);
   * ```
   */
  addPolygon(points: Offset[], close: boolean): void {
    if (points.length === 0) return;

    this.moveTo(points[0]!.dx, points[0]!.dy);
    for (let i = 1; i < points.length; i++) {
      this.lineTo(points[i]!.dx, points[i]!.dy);
    }

    if (close) {
      this.close();
    }
  }

  /**
   * 闭合当前路径
   * 
   * 添加一条从当前位置到当前子路径起始点的直线，形成闭合的路径。
   * 这对于创建完整的形状（如多边形）非常有用。
   * 
   * @example
   * ```typescript
   * const path = new Path();
   * 
   * // 创建一个开放的三角形路径
   * path.moveTo(100, 50);
   * path.lineTo(50, 150);
   * path.lineTo(150, 150);
   * // 此时路径是开放的，缺少从(150,150)到(100,50)的连线
   * 
   * // 闭合路径，自动添加闭合线
   * path.close();
   * // 现在路径形成完整的三角形
   * 
   * // 可以继续添加新的子路径
   * path.moveTo(200, 50);
   * path.lineTo(250, 100);
   * path.lineTo(200, 150);
   * path.close();  // 闭合第二个子路径
   * ```
   */
  close(): void {
    this.commands.push({ type: "closePath", args: [] });
  }

  /**
   * 重置路径
   * 
   * 清除路径中的所有命令和状态，将路径恢复到初始状态。
   * 重置后的路径为空，当前点回到原点(0, 0)，可以重新开始构建路径。
   * 
   * @example
   * ```typescript
   * const path = new Path();
   * 
   * // 构建一个复杂的路径
   * path.moveTo(50, 50);
   * path.lineTo(100, 100);
   * path.quadraticBezierTo(150, 50, 200, 100);
   * path.addCircle({ dx: 250, dy: 75 }, 25);
   * 
   * console.log(path.getBounds()); // 显示路径边界
   * 
   * // 重置路径
   * path.reset();
   * 
   * // 现在路径为空，可以重新构建
   * path.addRect({ left: 0, top: 0, right: 100, bottom: 100 });
   * 
   * // 重置在需要复用Path对象时很有用
   * function drawShape(path: Path, shapeType: string) {
   *   path.reset();  // 清除之前的内容
   *   
   *   if (shapeType === 'circle') {
   *     path.addCircle({ dx: 50, dy: 50 }, 30);
   *   } else if (shapeType === 'square') {
   *     path.addRect({ left: 20, top: 20, right: 80, bottom: 80 });
   *   }
   * }
   * ```
   */
  reset(): void {
    this.commands = [];
    this._currentPoint = { dx: 0, dy: 0 };
  }

  /**
   * 判断点是否在路径内
   * 使用射线投射算法（Ray Casting Algorithm）
   */
  contains(point: Offset): boolean {
    if (this.commands.length === 0) return false;

    // 首先检查点是否在边界矩形内
    const bounds = this.getBounds();
    if (
      point.dx < bounds.left ||
      point.dx > bounds.right ||
      point.dy < bounds.top ||
      point.dy > bounds.bottom
    ) {
      return false;
    }

    let intersectionCount = 0;
    let currentX = 0;
    let currentY = 0;
    let startX = 0;
    let startY = 0;

    // 射线投射算法：从点向右发射射线，计算与路径边的交点数
    const rayY = point.dy;
    const rayX = point.dx;

    for (const cmd of this.commands) {
      const args = cmd.args;

      switch (cmd.type) {
        case "moveTo":
          if (args.length >= 2) {
            currentX = args[0]!;
            currentY = args[1]!;
            startX = currentX;
            startY = currentY;
          }
          break;

        case "lineTo":
          if (args.length >= 2) {
            const x2 = args[0]!;
            const y2 = args[1]!;

            // 检查线段与射线的交点
            if (
              this.lineIntersectsRay(currentX, currentY, x2, y2, rayX, rayY)
            ) {
              intersectionCount++;
            }

            currentX = x2;
            currentY = y2;
          }
          break;

        case "closePath":
          // 闭合路径：从当前点到起始点的线段
          if (
            this.lineIntersectsRay(
              currentX,
              currentY,
              startX,
              startY,
              rayX,
              rayY
            )
          ) {
            intersectionCount++;
          }
          currentX = startX;
          currentY = startY;
          break;

        case "arc":
          if (args.length >= 5) {
            const centerX = args[0]!;
            const centerY = args[1]!;
            const radius = args[2]!;
            const startAngle = args[3]!;
            const endAngle = args[4]!;

            // 简化处理：将圆弧近似为多条线段
            const segments = Math.max(
              8,
              Math.floor(Math.abs(endAngle - startAngle) * 8)
            );
            const angleStep = (endAngle - startAngle) / segments;

            let prevX = centerX + radius * Math.cos(startAngle);
            let prevY = centerY + radius * Math.sin(startAngle);

            for (let i = 1; i <= segments; i++) {
              const angle = startAngle + i * angleStep;
              const x = centerX + radius * Math.cos(angle);
              const y = centerY + radius * Math.sin(angle);

              if (this.lineIntersectsRay(prevX, prevY, x, y, rayX, rayY)) {
                intersectionCount++;
              }

              prevX = x;
              prevY = y;
            }

            currentX = prevX;
            currentY = prevY;
          }
          break;

        // 对于贝塞尔曲线，简化为直线处理
        case "quadraticCurveTo":
          if (args.length >= 4) {
            const x2 = args[2]!;
            const y2 = args[3]!;

            if (
              this.lineIntersectsRay(currentX, currentY, x2, y2, rayX, rayY)
            ) {
              intersectionCount++;
            }

            currentX = x2;
            currentY = y2;
          }
          break;

        case "bezierCurveTo":
          if (args.length >= 6) {
            const x2 = args[4]!;
            const y2 = args[5]!;

            if (
              this.lineIntersectsRay(currentX, currentY, x2, y2, rayX, rayY)
            ) {
              intersectionCount++;
            }

            currentX = x2;
            currentY = y2;
          }
          break;
      }
    }

    // 根据填充规则判断
    if (this._fillType === PathFillTypeEnum.evenOdd) {
      return intersectionCount % 2 === 1;
    } else {
      // nonZero 规则（简化实现）
      return intersectionCount > 0;
    }
  }

  /**
   * 检查线段是否与从点发出的水平射线相交
   * @param x1 线段起点 x
   * @param y1 线段起点 y
   * @param x2 线段终点 x
   * @param y2 线段终点 y
   * @param rayX 射线起点 x
   * @param rayY 射线起点 y
   */
  private lineIntersectsRay(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    rayX: number,
    rayY: number
  ): boolean {
    // 如果线段完全在射线上方或下方，不相交
    if ((y1 <= rayY && y2 <= rayY) || (y1 > rayY && y2 > rayY)) {
      return false;
    }

    // 如果线段完全在射线左侧，不相交
    if (Math.max(x1, x2) <= rayX) {
      return false;
    }

    // 如果线段是水平的且与射线重合，不计算交点
    if (y1 === y2) {
      return false;
    }

    // 计算交点的 x 坐标
    const intersectionX = x1 + ((rayY - y1) * (x2 - x1)) / (y2 - y1);

    // 交点必须在射线右侧
    return intersectionX > rayX;
  }

  /**
   * 获取路径的边界矩形
   */
  getBounds(): Rect {
    if (this.commands.length === 0) {
      return { left: 0, top: 0, right: 0, bottom: 0 };
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    // 更新边界的辅助函数
    const updateBounds = (x: number, y: number) => {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    };

    for (const cmd of this.commands) {
      const args = cmd.args;

      switch (cmd.type) {
        case "moveTo":
        case "lineTo":
          if (args.length >= 2) {
            updateBounds(args[0]!, args[1]!);
          }
          break;

        case "quadraticCurveTo":
          if (args.length >= 4) {
            // 控制点和终点都可能影响边界
            updateBounds(args[0]!, args[1]!); // 控制点
            updateBounds(args[2]!, args[3]!); // 终点
          }
          break;

        case "bezierCurveTo":
          if (args.length >= 6) {
            // 所有控制点和终点都可能影响边界
            updateBounds(args[0]!, args[1]!); // 控制点1
            updateBounds(args[2]!, args[3]!); // 控制点2
            updateBounds(args[4]!, args[5]!); // 终点
          }
          break;

        case "arc":
          if (args.length >= 5) {
            const centerX = args[0]!;
            const centerY = args[1]!;
            const radius = args[2]!;
            const startAngle = args[3]!;
            const endAngle = args[4]!;

            // 计算圆弧的边界
            // 检查圆弧是否跨越坐标轴
            const angles = [startAngle, endAngle];

            // 检查是否跨越 0°, 90°, 180°, 270°
            const criticalAngles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
            for (const angle of criticalAngles) {
              if (this.angleInRange(angle, startAngle, endAngle)) {
                angles.push(angle);
              }
            }

            // 计算所有关键角度的点
            for (const angle of angles) {
              const x = centerX + radius * Math.cos(angle);
              const y = centerY + radius * Math.sin(angle);
              updateBounds(x, y);
            }
          }
          break;

        case "ellipse":
          if (args.length >= 7) {
            const centerX = args[0]!;
            const centerY = args[1]!;
            const radiusX = args[2]!;
            const radiusY = args[3]!;
            const rotation = args[4]!;
            //@ts-ignore make tsc happy
            const startAngle = args[5]!;
            //@ts-ignore make tsc happy
            const endAngle = args[6]!;

            // 简化处理：使用包围椭圆的矩形
            if (rotation === 0) {
              // 无旋转的椭圆
              updateBounds(centerX - radiusX, centerY - radiusY);
              updateBounds(centerX + radiusX, centerY + radiusY);
            } else {
              // 有旋转的椭圆，计算旋转后的边界
              const cos = Math.cos(rotation);
              const sin = Math.sin(rotation);
              const a = radiusX * cos;
              const b = radiusX * sin;
              const c = radiusY * -sin;
              const d = radiusY * cos;

              const width = Math.sqrt(a * a + c * c);
              const height = Math.sqrt(b * b + d * d);

              updateBounds(centerX - width, centerY - height);
              updateBounds(centerX + width, centerY + height);
            }
          }
          break;

        case "roundRect":
          if (args.length >= 5) {
            const x = args[0]!;
            const y = args[1]!;
            const width = args[2]!;
            const height = args[3]!;

            updateBounds(x, y);
            updateBounds(x + width, y + height);
          }
          break;

        // 对于其他命令类型，暂时跳过
        default:
          break;
      }
    }

    return {
      left: minX === Infinity ? 0 : minX,
      top: minY === Infinity ? 0 : minY,
      right: maxX === -Infinity ? 0 : maxX,
      bottom: maxY === -Infinity ? 0 : maxY,
    };
  }

  /**
   * 检查角度是否在指定范围内
   * @param angle 要检查的角度
   * @param start 起始角度
   * @param end 结束角度
   */
  private angleInRange(angle: number, start: number, end: number): boolean {
    // 标准化角度到 [0, 2π] 范围
    const normalizeAngle = (a: number) => {
      while (a < 0) a += 2 * Math.PI;
      while (a >= 2 * Math.PI) a -= 2 * Math.PI;
      return a;
    };

    const normalizedAngle = normalizeAngle(angle);
    const normalizedStart = normalizeAngle(start);
    const normalizedEnd = normalizeAngle(end);

    if (normalizedStart <= normalizedEnd) {
      return (
        normalizedAngle >= normalizedStart && normalizedAngle <= normalizedEnd
      );
    } else {
      // 跨越 0° 的情况
      return (
        normalizedAngle >= normalizedStart || normalizedAngle <= normalizedEnd
      );
    }
  }

  /**
   * 应用路径到 Canvas 2D 上下文
   */
  applyToContext(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();

    for (const cmd of this.commands) {
      const args = cmd.args;

      switch (cmd.type) {
        case "moveTo":
          if (
            args.length >= 2 &&
            args[0] !== undefined &&
            args[1] !== undefined
          ) {
            ctx.moveTo(args[0], args[1]);
          }
          break;
        case "lineTo":
          if (
            args.length >= 2 &&
            args[0] !== undefined &&
            args[1] !== undefined
          ) {
            ctx.lineTo(args[0], args[1]);
          }
          break;
        case "quadraticCurveTo":
          if (
            args.length >= 4 &&
            args[0] !== undefined &&
            args[1] !== undefined &&
            args[2] !== undefined &&
            args[3] !== undefined
          ) {
            ctx.quadraticCurveTo(args[0], args[1], args[2], args[3]);
          }
          break;
        case "bezierCurveTo":
          if (
            args.length >= 6 &&
            args[0] !== undefined &&
            args[1] !== undefined &&
            args[2] !== undefined &&
            args[3] !== undefined &&
            args[4] !== undefined &&
            args[5] !== undefined
          ) {
            ctx.bezierCurveTo(
              args[0],
              args[1],
              args[2],
              args[3],
              args[4],
              args[5]
            );
          }
          break;
        case "arc":
          if (
            args.length >= 5 &&
            args[0] !== undefined &&
            args[1] !== undefined &&
            args[2] !== undefined &&
            args[3] !== undefined &&
            args[4] !== undefined
          ) {
            ctx.arc(args[0], args[1], args[2], args[3], args[4]);
          }
          break;
        case "ellipse":
          if (args.length >= 7 && args.every((arg) => arg !== undefined)) {
            ctx.ellipse(
              args[0]!,
              args[1]!,
              args[2]!,
              args[3]!,
              args[4]!,
              args[5]!,
              args[6]!
            );
          }
          break;
        case "roundRect":
          if (
            args.length >= 5 &&
            args[0] !== undefined &&
            args[1] !== undefined &&
            args[2] !== undefined &&
            args[3] !== undefined &&
            args[4] !== undefined
          ) {
            ctx.roundRect(args[0], args[1], args[2], args[3], args[4]);
          }
          break;
        case "closePath":
          ctx.closePath();
          break;
      }
    }
  }

  /**
   * 创建路径的副本
   */
  clone(): Path {
    const newPath = new Path();
    newPath.commands = [...this.commands];
    newPath._fillType = this._fillType;
    newPath._currentPoint = { ...this._currentPoint };
    return newPath;
  }

  /**
   * 变换路径
   * @param matrix 2D变换矩阵 [a, b, c, d, e, f] 对应 CSS transform matrix(a,b,c,d,e,f)
   */
  transform(matrix: number[]): Path {
    if (matrix.length !== 6) {
      throw new Error("Matrix must have 6 elements [a, b, c, d, e, f]");
    }

    const a = matrix[0]!;
    const b = matrix[1]!;
    const c = matrix[2]!;
    const d = matrix[3]!;
    const e = matrix[4]!;
    const f = matrix[5]!;
    const newPath = new Path();
    newPath._fillType = this._fillType;

    // 矩阵变换函数
    const transformPoint = (x: number, y: number): [number, number] => {
      const newX = a * x + c * y + e;
      const newY = b * x + d * y + f;
      return [newX, newY];
    };

    // 遍历所有命令并应用变换
    for (const cmd of this.commands) {
      const args = [...cmd.args];

      switch (cmd.type) {
        case "moveTo":
        case "lineTo":
          if (args.length >= 2) {
            const [newX, newY] = transformPoint(args[0]!, args[1]!);
            newPath.commands.push({
              type: cmd.type,
              args: [newX, newY],
            });
          }
          break;

        case "quadraticCurveTo":
          if (args.length >= 4) {
            const [cp1x, cp1y] = transformPoint(args[0]!, args[1]!);
            const [cp2x, cp2y] = transformPoint(args[2]!, args[3]!);
            newPath.commands.push({
              type: cmd.type,
              args: [cp1x, cp1y, cp2x, cp2y],
            });
          }
          break;

        case "bezierCurveTo":
          if (args.length >= 6) {
            const [cp1x, cp1y] = transformPoint(args[0]!, args[1]!);
            const [cp2x, cp2y] = transformPoint(args[2]!, args[3]!);
            const [cp3x, cp3y] = transformPoint(args[4]!, args[5]!);
            newPath.commands.push({
              type: cmd.type,
              args: [cp1x, cp1y, cp2x, cp2y, cp3x, cp3y],
            });
          }
          break;

        case "arc":
          if (args.length >= 5) {
            const [centerX, centerY] = transformPoint(args[0]!, args[1]!);
            // 对于圆弧，需要考虑缩放对半径的影响
            const scaleX = Math.sqrt(a * a + b * b);
            const scaleY = Math.sqrt(c * c + d * d);
            const avgScale = (scaleX + scaleY) / 2;
            const newRadius = args[2]! * avgScale;

            newPath.commands.push({
              type: cmd.type,
              args: [centerX, centerY, newRadius, args[3]!, args[4]!],
            });
          }
          break;

        case "ellipse":
          if (args.length >= 7) {
            const [centerX, centerY] = transformPoint(args[0]!, args[1]!);
            // 椭圆的半径需要根据变换矩阵调整
            const scaleX = Math.sqrt(a * a + b * b);
            const scaleY = Math.sqrt(c * c + d * d);
            const newRadiusX = args[2]! * scaleX;
            const newRadiusY = args[3]! * scaleY;

            newPath.commands.push({
              type: cmd.type,
              args: [
                centerX,
                centerY,
                newRadiusX,
                newRadiusY,
                args[4]!,
                args[5]!,
                args[6]!,
              ],
            });
          }
          break;

        case "roundRect":
          if (args.length >= 5) {
            const [x1, y1] = transformPoint(args[0]!, args[1]!);
            const [x2, y2] = transformPoint(
              args[0]! + args[2]!,
              args[1]! + args[3]!
            );
            const scaleX = Math.sqrt(a * a + b * b);
            const scaleY = Math.sqrt(c * c + d * d);
            const avgScale = (scaleX + scaleY) / 2;
            const newRadius = args[4]! * avgScale;

            newPath.commands.push({
              type: cmd.type,
              args: [
                Math.min(x1, x2),
                Math.min(y1, y2),
                Math.abs(x2 - x1),
                Math.abs(y2 - y1),
                newRadius,
              ],
            });
          }
          break;

        case "closePath":
          newPath.commands.push({ type: cmd.type, args: [] });
          break;

        default:
          // 对于未知命令类型，直接复制
          newPath.commands.push({ ...cmd });
          break;
      }
    }

    // 更新当前点
    if (this._currentPoint) {
      const [newX, newY] = transformPoint(
        this._currentPoint.dx,
        this._currentPoint.dy
      );
      newPath._currentPoint = { dx: newX, dy: newY };
    }

    return newPath;
  }

  /**
   * 路径运算（合并、相交等）
   * @param operation 路径运算类型
   * @param path1 第一个路径
   * @param path2 第二个路径
   */
  static combine(operation: PathOperation, path1: Path, path2: Path): Path {
    const result = new Path();

    switch (operation) {
      case "union":
        // 合并操作：将两个路径的所有命令合并
        result.commands = [...path1.commands, ...path2.commands];
        result._fillType = path1._fillType;
        break;

      case "difference":
        // 差集操作：简化实现，保留第一个路径，设置不同的填充规则
        result.commands = [...path1.commands];
        result._fillType = PathFillTypeEnum.evenOdd;
        // 添加第二个路径的反向路径（简化处理）
        for (const cmd of path2.commands) {
          result.commands.push({ ...cmd });
        }
        break;

      case "intersect":
        // 相交操作：简化实现，使用 evenOdd 填充规则
        result.commands = [...path1.commands, ...path2.commands];
        result._fillType = PathFillTypeEnum.evenOdd;
        break;

      case "xor":
        // 异或操作：合并两个路径并使用 evenOdd 填充
        result.commands = [...path1.commands, ...path2.commands];
        result._fillType = PathFillTypeEnum.evenOdd;
        break;

      default:
        throw new Error(`Unsupported path operation: ${operation}`);
    }

    // 更新当前点为第二个路径的当前点
    result._currentPoint = { ...path2._currentPoint };

    return result;
  }

  /**
   * 简化的路径相交检测
   * @param other 另一个路径
   */
  intersects(other: Path): boolean {
    // 简化实现：检查边界矩形是否相交
    const bounds1 = this.getBounds();
    const bounds2 = other.getBounds();

    return !(
      bounds1.right < bounds2.left ||
      bounds1.left > bounds2.right ||
      bounds1.bottom < bounds2.top ||
      bounds1.top > bounds2.bottom
    );
  }

  /**
   * 获取路径的周长（近似值）
   */
  getPerimeter(): number {
    let perimeter = 0;
    let currentX = 0;
    let currentY = 0;
    let startX = 0;
    let startY = 0;

    for (const cmd of this.commands) {
      const args = cmd.args;

      switch (cmd.type) {
        case "moveTo":
          if (args.length >= 2) {
            currentX = args[0]!;
            currentY = args[1]!;
            startX = currentX;
            startY = currentY;
          }
          break;

        case "lineTo":
          if (args.length >= 2) {
            const dx = args[0]! - currentX;
            const dy = args[1]! - currentY;
            perimeter += Math.sqrt(dx * dx + dy * dy);
            currentX = args[0]!;
            currentY = args[1]!;
          }
          break;

        case "arc":
          if (args.length >= 5) {
            const radius = args[2]!;
            const startAngle = args[3]!;
            const endAngle = args[4]!;
            const sweepAngle = Math.abs(endAngle - startAngle);
            perimeter += radius * sweepAngle;
            currentX = args[0]! + radius * Math.cos(endAngle);
            currentY = args[1]! + radius * Math.sin(endAngle);
          }
          break;

        case "closePath":
          const dx = startX - currentX;
          const dy = startY - currentY;
          perimeter += Math.sqrt(dx * dx + dy * dy);
          currentX = startX;
          currentY = startY;
          break;

        // 对于贝塞尔曲线，使用简化的长度估算
        case "quadraticCurveTo":
        case "bezierCurveTo":
          if (args.length >= 4) {
            const endX = args[args.length - 2]!;
            const endY = args[args.length - 1]!;
            const dx = endX - currentX;
            const dy = endY - currentY;
            // 简化估算：直线距离 * 1.2
            perimeter += Math.sqrt(dx * dx + dy * dy) * 1.2;
            currentX = endX;
            currentY = endY;
          }
          break;
      }
    }

    return perimeter;
  }
}
