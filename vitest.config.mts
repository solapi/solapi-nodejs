import * as path from 'node:path';
import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vitest/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    globals: true,
    setupFiles: 'dotenv/config',
    silent: false,
    // Node.js 18 호환성을 위한 환경 설정
    environment: 'node',
    pool: 'forks',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@test': path.resolve(__dirname, './test'),
      '@models': path.resolve(__dirname, './src/models'),
      '@models/requests/messages': path.resolve(
        __dirname,
        './src/models/requests/messages',
      ),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@internal-types': path.resolve(__dirname, './src/types'),
      '@services': path.resolve(__dirname, './src/services'),
    },
  },
});
