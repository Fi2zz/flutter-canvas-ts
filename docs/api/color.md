# Color 类 API 文档

## 概述

`Color` 类是 flutter-canvas-ts 库中的核心颜色处理类，实现了 Flutter 风格的颜色操作接口。该类使用 32 位 ARGB 格式存储颜色信息，提供了完整的颜色创建、操作和转换功能。

## 颜色格式

颜色使用 32 位 ARGB 格式存储：
- **A (Alpha)**: 透明度通道，位于最高 8 位 (24-31)
- **R (Red)**: 红色通道，位于次高 8 位 (16-23)  
- **G (Green)**: 绿色通道，位于中间 8 位 (8-15)
- **B (Blue)**: 蓝色通道，位于最低 8 位 (0-7)

## 构造函数

### `constructor(value: number)`

从 32 位 ARGB 值创建颜色实例。

**参数:**
- `value: number` - 32 位 ARGB 颜色值

**示例:**
```typescript
// 创建纯红色 (不透明)
const red = new Color(0xFFFF0000);

// 创建半透明绿色
const semiGreen = new Color(0x8000FF00);

// 创建完全透明的颜色
const transparent = new Color(0x00000000);
```

## 属性

### `value: number` (只读)

颜色的 32 位 ARGB 值，这是颜色的内部表示。

### `alpha: number` (只读)

获取 Alpha 通道值 (0-255)。255 表示完全不透明，0 表示完全透明。

**示例:**
```typescript
const color = Color.fromARGB(128, 255, 0, 0);
console.log(color.alpha); // 输出: 128 (半透明)
```

### `red: number` (只读)

获取红色通道值 (0-255)。

**示例:**
```typescript
const purple = Color.fromARGB(255, 128, 0, 128);
console.log(purple.red); // 输出: 128
```

### `green: number` (只读)

获取绿色通道值 (0-255)。

**示例:**
```typescript
const yellow = Color.fromARGB(255, 255, 255, 0);
console.log(yellow.green); // 输出: 255
```

### `blue: number` (只读)

获取蓝色通道值 (0-255)。

**示例:**
```typescript
const blue = Color.fromARGB(255, 0, 0, 255);
console.log(blue.blue); // 输出: 255
```

### `opacity: number` (只读)

获取不透明度 (0.0-1.0)。这是 alpha 值的归一化表示，1.0 表示完全不透明，0.0 表示完全透明。

**示例:**
```typescript
const fullOpaque = Color.fromARGB(255, 255, 0, 0);
console.log(fullOpaque.opacity); // 输出: 1.0

const halfTransparent = Color.fromARGB(128, 0, 255, 0);
console.log(halfTransparent.opacity); // 输出: 约 0.502
```

## 静态工厂方法

### `Color.fromARGB(a: number, r: number, g: number, b: number): Color`

从 ARGB 值创建颜色，这是创建颜色的主要方法。

**参数:**
- `a: number` - Alpha 值 (0-255)，控制透明度
- `r: number` - Red 值 (0-255)，红色分量
- `g: number` - Green 值 (0-255)，绿色分量
- `b: number` - Blue 值 (0-255)，蓝色分量

**返回值:** 新的 Color 实例

**示例:**
```typescript
// 创建基本颜色
const red = Color.fromARGB(255, 255, 0, 0);
const green = Color.fromARGB(255, 0, 255, 0);
const blue = Color.fromARGB(255, 0, 0, 255);

// 创建半透明颜色
const semiRed = Color.fromARGB(128, 255, 0, 0);

// 创建自定义颜色
const purple = Color.fromARGB(255, 128, 0, 128);
const orange = Color.fromARGB(255, 255, 165, 0);
```

### `Color.fromRGBO(r: number, g: number, b: number, opacity: number): Color`

从 RGB 值和不透明度创建颜色，使用 0.0-1.0 的不透明度值。

**参数:**
- `r: number` - Red 值 (0-255)，红色分量
- `g: number` - Green 值 (0-255)，绿色分量
- `b: number` - Blue 值 (0-255)，蓝色分量
- `opacity: number` - 不透明度 (0.0-1.0)，1.0 为完全不透明

**返回值:** 新的 Color 实例

**示例:**
```typescript
// 创建完全不透明的颜色
const red = Color.fromRGBO(255, 0, 0, 1.0);

// 创建半透明颜色
const semiBlue = Color.fromRGBO(0, 0, 255, 0.5);

// 创建几乎透明的颜色
const ghostWhite = Color.fromRGBO(255, 255, 255, 0.1);

// 创建完全透明的颜色
const invisible = Color.fromRGBO(0, 0, 0, 0.0);
```

## 颜色变换方法

### `withOpacity(opacity: number): Color`

调整颜色的不透明度，创建一个新的颜色实例。

**参数:**
- `opacity: number` - 新的不透明度值 (0.0-1.0)

**返回值:** 具有新不透明度的 Color 实例

**示例:**
```typescript
const red = Color.fromARGB(255, 255, 0, 0);

// 创建不同透明度的红色变体
const semiRed = red.withOpacity(0.5);     // 半透明红色
const faintRed = red.withOpacity(0.2);    // 淡红色
const ghostRed = red.withOpacity(0.05);   // 几乎透明的红色

// 原始颜色不变
console.log(red.opacity);     // 1.0
console.log(semiRed.opacity); // 0.5
```

### `withAlpha(alpha: number): Color`

调整颜色的 Alpha 值，创建一个新的颜色实例。

**参数:**
- `alpha: number` - 新的 Alpha 值 (0-255)

**返回值:** 具有新 Alpha 值的 Color 实例

**示例:**
```typescript
const blue = Color.fromARGB(255, 0, 0, 255);

// 创建不同 Alpha 值的蓝色变体
const semiBlue = blue.withAlpha(128);     // Alpha = 128 (半透明)
const faintBlue = blue.withAlpha(64);     // Alpha = 64 (更透明)
const invisibleBlue = blue.withAlpha(0);  // Alpha = 0 (完全透明)

// 原始颜色不变
console.log(blue.alpha);     // 255
console.log(semiBlue.alpha); // 128
```

## 格式转换方法

### `toCssString(): string`

转换为 CSS 颜色字符串，返回 CSS rgba() 格式。

**返回值:** CSS rgba 格式的颜色字符串

**示例:**
```typescript
const red = Color.fromARGB(255, 255, 0, 0);
console.log(red.toCssString()); // "rgba(255, 0, 0, 1)"

const semiBlue = Color.fromRGBO(0, 0, 255, 0.5);
console.log(semiBlue.toCssString()); // "rgba(0, 0, 255, 0.5)"

const transparent = Color.fromARGB(0, 128, 128, 128);
console.log(transparent.toCssString()); // "rgba(128, 128, 128, 0)"

// 在 CSS 中使用
element.style.backgroundColor = red.toCssString();
element.style.borderColor = semiBlue.toCssString();
```

### `toHex(): string`

转换为十六进制字符串，格式为 #AARRGGBB，包含 Alpha 通道信息。

**返回值:** 十六进制格式的颜色字符串

**示例:**
```typescript
const red = Color.fromARGB(255, 255, 0, 0);
console.log(red.toHex()); // "#ffff0000"

const semiBlue = Color.fromARGB(128, 0, 0, 255);
console.log(semiBlue.toHex()); // "#800000ff"

const white = Color.fromARGB(255, 255, 255, 255);
console.log(white.toHex()); // "#ffffffff"

const black = Color.fromARGB(255, 0, 0, 0);
console.log(black.toHex()); // "#ff000000"

// 注意：格式为 #AARRGGBB，其中 AA 是 Alpha 通道
```

## 常用颜色常量

Color 类提供了一系列预定义的颜色常量：

### 基础颜色
- `Color.transparent` - 透明色
- `Color.black` - 黑色
- `Color.white` - 白色

### 主要颜色
- `Color.red` - 红色
- `Color.green` - 绿色
- `Color.blue` - 蓝色

### 混合颜色
- `Color.yellow` - 黄色
- `Color.cyan` - 青色
- `Color.magenta` - 洋红色

### 扩展颜色
- `Color.orange` - 橙色
- `Color.purple` - 紫色
- `Color.pink` - 粉色

### 灰度颜色
- `Color.grey` - 灰色
- `Color.darkGrey` - 深灰色
- `Color.lightGrey` - 浅灰色

**示例:**
```typescript
// 使用预定义颜色
const redPaint = new Paint()..color = Color.red;
const transparentPaint = new Paint()..color = Color.transparent;

// 基于预定义颜色创建变体
const semiRed = Color.red.withOpacity(0.5);
const lightBlue = Color.blue.withAlpha(128);
```

## 完整示例

```typescript
import { Color } from 'flutter-canvas-ts';

// 创建各种颜色
const solidRed = Color.fromARGB(255, 255, 0, 0);
const semiBlue = Color.fromRGBO(0, 0, 255, 0.5);
const customColor = new Color(0xFF8A2BE2); // BlueViolet

// 颜色操作
const fadedRed = solidRed.withOpacity(0.3);
const opaqueBlue = semiBlue.withAlpha(255);

// 格式转换
console.log(solidRed.toCssString()); // "rgba(255, 0, 0, 1)"
console.log(customColor.toHex());    // "#ff8a2be2"

// 颜色信息获取
console.log(`Red: ${solidRed.red}, Green: ${solidRed.green}, Blue: ${solidRed.blue}`);
console.log(`Opacity: ${semiBlue.opacity}, Alpha: ${semiBlue.alpha}`);

// 使用预定义颜色
const blackPaint = new Paint()..color = Color.black;
const whiteBg = Color.white.toCssString();

// 创建渐变色系列
const redShades = [
  Color.red,
  Color.red.withOpacity(0.8),
  Color.red.withOpacity(0.6),
  Color.red.withOpacity(0.4),
  Color.red.withOpacity(0.2)
];
```

## 注意事项

1. **不可变性**: Color 实例是不可变的，所有变换方法都返回新的实例
2. **值范围**: RGB 和 Alpha 值必须在 0-255 范围内，opacity 值在 0.0-1.0 范围内
3. **精度**: 由于浮点数精度问题，opacity 值可能不完全精确
4. **性能**: 颜色常量是静态的，重复使用时性能更好
5. **兼容性**: 生成的 CSS 字符串与所有现代浏览器兼容