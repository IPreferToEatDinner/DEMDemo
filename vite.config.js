import { defineConfig } from 'vite';
import cesium from 'vite-plugin-cesium'; // 引入插件
export default defineConfig({
	plugins: [cesium()],
});
