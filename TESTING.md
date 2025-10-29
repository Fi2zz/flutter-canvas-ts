# 测试文档

## 概述

本项目包含全面的测试套件，使用 Vitest 测试框架，确保所有核心功能的正确性和稳定性。

## 测试覆盖范围

### 1. Canvas 类测试 (`tests/canvas.test.ts`)
- ✅ 构造函数和基本属性
- ✅ 状态管理 (save/restore/clear)
- ✅ 坐标变换 (translate/scale/rotate/transform)
- ✅ 基本图形绘制 (点、线、矩形、圆形、椭圆、弧形)
- ✅ 裁剪操作 (clipRect/clipRRect)
- ✅ 路径绘制 (drawPath/clipPath)
- ✅ Paint 应用
- ✅ 复杂绘制场景
- ✅ 边界条件和错误处理
- ✅ 性能测试
- ✅ 集成测试

### 2. Paint 类测试 (`tests/paint.test.ts`)
- ✅ 构造函数和默认值
- ✅ 颜色属性设置
- ✅ 绘制样式 (fill/stroke)
- ✅ 描边属性 (width/cap/join)
- ✅ 混合模式
- ✅ 渐变设置 (线性/径向渐变)
- ✅ 阴影效果
- ✅ 复杂样式组合
- ✅ 边界条件处理
- ✅ 性能测试

### 3. Path 类测试 (`tests/path.test.ts`)
- ✅ 构造函数和基本属性
- ✅ 基本路径操作 (moveTo/lineTo/close)
- ✅ 曲线操作 (quadratic/cubic bezier)
- ✅ 弧形操作 (arcTo)
- ✅ 几何形状添加 (rect/circle/oval/polygon)
- ✅ 路径变换和组合
- ✅ 填充规则设置
- ✅ 边界计算
- ✅ 点包含检测
- ✅ 路径应用到Canvas上下文
- ✅ 边界条件和错误处理
- ✅ 性能测试

### 4. Color 类测试 (`tests/color.test.ts`)
- ✅ 构造函数
- ✅ 静态工厂方法 (fromARGB/fromRGBO)
- ✅ 颜色分量获取 (alpha/red/green/blue)
- ✅ 透明度操作
- ✅ 颜色转换 (CSS/hex)
- ✅ 预定义颜色常量
- ✅ 边界条件处理

### 5. CustomPainter 相关类测试 (`tests/custom-painter.test.ts`)
- ✅ CustomPainter 抽象基类
- ✅ CustomPaint 组件
- ✅ PainterFactory 工厂类
- ✅ AnimatedCustomPainter 动画绘制器
- ✅ 集成测试

### 6. 类型定义测试 (`tests/types.test.ts`)
- ✅ 基本几何类型 (Offset/Size/Rect/RRect)
- ✅ 绘制样式枚举
- ✅ 路径操作枚举
- ✅ 文本相关枚举
- ✅ 渐变相关类型

## 测试命令

```bash
# 运行所有测试
npm test

# 运行测试（单次）
npm run test:run

# 监听模式运行测试
npm run test:watch

# 生成覆盖率报告
npm run test:coverage

# 使用UI界面运行测试
npm run test:ui

# 使用UI界面查看覆盖率
npm run test:coverage:ui
```

## 测试配置

### Vitest 配置 (`vitest.config.ts`)
- 测试环境: jsdom
- 覆盖率提供者: v8
- 覆盖率阈值: 80% (branches/functions/lines/statements)
- 测试超时: 10秒
- 支持 TypeScript

### 测试设置 (`tests/setup.ts`)
- Canvas API 模拟
- 测试环境初始化
- 全局测试钩子

## CI/CD 集成

### GitHub Actions (`.github/workflows/ci.yml`)
- 多 Node.js 版本测试 (18.x, 20.x, 22.x)
- 自动运行 lint、类型检查、测试
- 生成覆盖率报告
- 构建验证

## 测试最佳实践

1. **全面覆盖**: 每个公共方法都有对应的测试用例
2. **边界测试**: 包含边界条件和错误情况的测试
3. **性能测试**: 确保关键操作的性能表现
4. **集成测试**: 验证组件间的协作
5. **模拟环境**: 使用 jsdom 模拟浏览器环境
6. **类型安全**: 利用 TypeScript 确保类型正确性

## 故障排除

如果测试失败，请检查：

1. 依赖是否正确安装 (`npm install`)
2. TypeScript 编译是否通过 (`npm run lint`)
3. 测试环境是否正确设置
4. 是否有语法错误或类型错误

## 贡献指南

添加新功能时，请确保：

1. 为新功能编写相应的测试用例
2. 保持测试覆盖率在 80% 以上
3. 遵循现有的测试模式和命名约定
4. 运行所有测试确保没有回归问题