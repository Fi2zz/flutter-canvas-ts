import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // 测试环境设置
    environment: 'jsdom',
    
    // 全局设置
    globals: true,
    
    // 测试文件匹配模式
    include: [
      'tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
    ],
    
    // 排除文件
    exclude: [
      'node_modules',
      'dist',
      '.idea',
      '.git',
      '.cache'
    ],
    
    // 覆盖率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/index.ts'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    },
    
    // 测试超时设置
    testTimeout: 10000,
    hookTimeout: 10000,
    
    // 并发设置
    pool: 'threads',
    
    // 报告器设置
    reporters: ['verbose', 'json', 'html'],
    
    // 设置文件
    setupFiles: ['./tests/setup.ts']
  },
  
  // 解析配置
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});