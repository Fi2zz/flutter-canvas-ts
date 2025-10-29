/**
 * Color 类测试用例
 * 测试颜色创建、转换、操作等功能
 */

import { describe, it, expect } from 'vitest';
import { Color } from '../src/color';

describe('Color', () => {
  describe('构造函数', () => {
    it('应该使用指定值创建黑色', () => {
      const color = new Color(0xFF000000);
      expect(color.value).toBe(0xFF000000);
      expect(color.alpha).toBe(255);
      expect(color.red).toBe(0);
      expect(color.green).toBe(0);
      expect(color.blue).toBe(0);
    });

    it('应该使用指定的ARGB值创建颜色', () => {
      const color = new Color(0xFF123456);
      expect(color.value).toBe(0xFF123456);
      expect(color.alpha).toBe(255);
      expect(color.red).toBe(0x12);
      expect(color.green).toBe(0x34);
      expect(color.blue).toBe(0x56);
    });

    it('应该正确处理透明度', () => {
      const color = new Color(0x80FF0000); // 50% 透明的红色
      expect(color.alpha).toBe(0x80);
      expect(color.red).toBe(255);
      expect(color.green).toBe(0);
      expect(color.blue).toBe(0);
      expect(color.opacity).toBeCloseTo(0.5, 2);
    });
  });

  describe('静态工厂方法', () => {
    describe('fromARGB', () => {
      it('应该从ARGB值创建颜色', () => {
        const color = Color.fromARGB(255, 255, 0, 0);
        expect(color.alpha).toBe(255);
        expect(color.red).toBe(255);
        expect(color.green).toBe(0);
        expect(color.blue).toBe(0);
        expect(color.value).toBe(0xFFFF0000);
      });

      it('应该处理边界值', () => {
        const color1 = Color.fromARGB(0, 0, 0, 0);
        expect(color1.value).toBe(0x00000000);

        const color2 = Color.fromARGB(255, 255, 255, 255);
        expect(color2.value).toBe(0xFFFFFFFF);
      });

      it('应该限制超出范围的值', () => {
        const color = Color.fromARGB(300, 300, -10, 256);
        expect(color.alpha).toBe(255);
        expect(color.red).toBe(255);
        expect(color.green).toBe(0);
        expect(color.blue).toBe(255);
      });
    });

    describe('fromRGBO', () => {
      it('应该从RGBO值创建颜色', () => {
        const color = Color.fromRGBO(255, 128, 64, 0.5);
        expect(color.red).toBe(255);
        expect(color.green).toBe(128);
        expect(color.blue).toBe(64);
        expect(color.opacity).toBeCloseTo(0.5, 2);
      });

      it('应该处理不透明度边界值', () => {
        const color1 = Color.fromRGBO(255, 0, 0, 0);
        expect(color1.alpha).toBe(0);

        const color2 = Color.fromRGBO(255, 0, 0, 1);
        expect(color2.alpha).toBe(255);
      });

      it('应该限制不透明度范围', () => {
        const color1 = Color.fromRGBO(255, 0, 0, -0.5);
        expect(color1.opacity).toBe(0);

        const color2 = Color.fromRGBO(255, 0, 0, 1.5);
        expect(color2.opacity).toBe(1);
      });
    });
  });

  describe('颜色变换方法', () => {
    describe('withOpacity', () => {
      it('应该返回具有新不透明度的颜色', () => {
        const original = Color.fromARGB(255, 255, 0, 0);
        const modified = original.withOpacity(0.5);
        
        expect(modified.red).toBe(255);
        expect(modified.green).toBe(0);
        expect(modified.blue).toBe(0);
        expect(modified.opacity).toBeCloseTo(0.5, 2);
        expect(modified.alpha).toBe(128);
      });

      it('应该不修改原始颜色对象', () => {
        const original = Color.fromARGB(255, 255, 0, 0);
        const modified = original.withOpacity(0.5);
        
        expect(original.opacity).toBe(1);
        expect(modified.opacity).toBeCloseTo(0.5, 2);
        expect(original).not.toBe(modified);
      });

      it('应该限制不透明度范围', () => {
        const color = Color.red;
        
        const transparent = color.withOpacity(-0.5);
        expect(transparent.opacity).toBe(0);
        
        const opaque = color.withOpacity(1.5);
        expect(opaque.opacity).toBe(1);
      });
    });

    describe('withAlpha', () => {
      it('应该返回具有新Alpha值的颜色', () => {
        const original = Color.fromARGB(255, 255, 0, 0);
        const modified = original.withAlpha(128);
        
        expect(modified.red).toBe(255);
        expect(modified.green).toBe(0);
        expect(modified.blue).toBe(0);
        expect(modified.alpha).toBe(128);
      });

      it('应该限制Alpha值范围', () => {
        const color = Color.red;
        
        const underflow = color.withAlpha(-10);
        expect(underflow.alpha).toBe(0);
        
        const overflow = color.withAlpha(300);
        expect(overflow.alpha).toBe(255);
      });
    });
  });

  describe('格式转换方法', () => {
    describe('toCssString', () => {
      it('应该转换为CSS rgba格式', () => {
        const color = Color.fromRGBO(255, 128, 64, 0.5);
        const cssString = color.toCssString();
        expect(cssString).toBe('rgba(255, 128, 64, 0.5)');
      });

      it('应该处理完全不透明的颜色', () => {
        const color = Color.fromARGB(255, 255, 0, 0);
        const cssString = color.toCssString();
        expect(cssString).toBe('rgba(255, 0, 0, 1)');
      });

      it('应该处理完全透明的颜色', () => {
        const color = Color.fromARGB(0, 255, 0, 0);
        const cssString = color.toCssString();
        expect(cssString).toBe('rgba(255, 0, 0, 0)');
      });
    });

    describe('toHex', () => {
      it('应该转换为十六进制格式', () => {
        const color = Color.fromARGB(255, 255, 128, 64);
        const hexString = color.toHex();
        expect(hexString).toBe('#ff8040');
      });

      it('应该包含Alpha通道（如果不是完全不透明）', () => {
        const color = Color.fromARGB(128, 255, 0, 0);
        const hexString = color.toHex();
        expect(hexString).toBe('#80ff0000');
      });

      it('应该正确处理小写十六进制', () => {
        const color = Color.fromARGB(255, 171, 205, 239); // #abcdef
        const hexString = color.toHex();
        expect(hexString).toBe('#abcdef');
      });
    });
  });

  describe('预定义颜色常量', () => {
    it('应该提供正确的基础颜色', () => {
      expect(Color.transparent.value).toBe(0x00000000);
      expect(Color.black.value).toBe(0xFF000000);
      expect(Color.white.value).toBe(0xFFFFFFFF);
      expect(Color.red.value).toBe(0xFFFF0000);
      expect(Color.green.value).toBe(0xFF00FF00);
      expect(Color.blue.value).toBe(0xFF0000FF);
    });

    it('应该提供正确的扩展颜色', () => {
      expect(Color.yellow.value).toBe(0xFFFFFF00);
      expect(Color.cyan.value).toBe(0xFF00FFFF);
      expect(Color.magenta.value).toBe(0xFFFF00FF);
      expect(Color.orange.value).toBe(0xFFFF8000);
      expect(Color.purple.value).toBe(0xFF800080);
      expect(Color.pink.value).toBe(0xFFFF69B4);
    });

    it('应该提供正确的灰色系列', () => {
      expect(Color.grey.value).toBe(0xFF808080);
      expect(Color.darkGrey.value).toBe(0xFF404040);
      expect(Color.lightGrey.value).toBe(0xFFC0C0C0);
    });
  });

  describe('属性访问器', () => {
    it('应该正确获取颜色通道值', () => {
      const color = new Color(0x12345678);
      expect(color.alpha).toBe(0x12);
      expect(color.red).toBe(0x34);
      expect(color.green).toBe(0x56);
      expect(color.blue).toBe(0x78);
    });

    it('应该正确计算不透明度', () => {
      const color1 = new Color(0x00000000);
      expect(color1.opacity).toBe(0);

      const color2 = new Color(0x80000000);
      expect(color2.opacity).toBeCloseTo(0.5, 2);

      const color3 = new Color(0xFF000000);
      expect(color3.opacity).toBe(1);
    });
  });

  describe('边界条件和错误处理', () => {
    it('应该处理极值输入', () => {
      const color1 = new Color(0);
      expect(color1.value).toBe(0);

      const color2 = new Color(0xFFFFFFFF);
      expect(color2.value).toBe(0xFFFFFFFF);

      const color3 = new Color(-1);
      expect(color3.value).toBe(0xFFFFFFFF); // -1 的无符号表示
    });

    it('应该处理NaN和无穷大值', () => {
      const color1 = Color.fromRGBO(255, 0, 0, NaN);
      expect(color1.opacity).toBe(0);

      const color2 = Color.fromRGBO(255, 0, 0, Infinity);
      expect(color2.opacity).toBe(1);

      const color3 = Color.fromRGBO(255, 0, 0, -Infinity);
      expect(color3.opacity).toBe(0);
    });
  });

  describe('性能和内存', () => {
    it('应该创建独立的颜色实例', () => {
      const color1 = Color.red;
      const color2 = Color.red;
      const color3 = color1.withOpacity(0.5);
      
      expect(color1).not.toBe(color3);
      expect(color1.value).not.toBe(color3.value);
    });

    it('应该高效处理大量颜色操作', () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        const color = Color.fromRGBO(i % 256, (i * 2) % 256, (i * 3) % 256, i / 1000);
        color.withOpacity(0.5);
        color.toCssString();
        color.toHex();
      }
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(100); // 应该在100ms内完成
    });
  });
});