import {defineConfig} from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  target: 'node18',
  dts: true,
  sourcemap: false,
  clean: true,
  external: [
    'path',
    'url',
    'crypto',
    'fs',
    'node:fs',
    'node:url',
    'node:crypto',
    'node:path',
  ],
});
