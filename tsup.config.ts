// tsup.config.ts or tsup.config.mts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['index.js'],
  format: ['esm', 'cjs'],
  dts: false, // no typescript declarations since you don’t use TS
  sourcemap: true,
  clean: true,
  splitting: false,
  minify: false,
  target: 'esnext',
});
