// vite.config.js
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///D:/dupengcheng/rui-ying/ce/cesium-func/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/dupengcheng/rui-ying/ce/cesium-func/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueDevTools from "file:///D:/dupengcheng/rui-ying/ce/cesium-func/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
import cesium from "file:///D:/dupengcheng/rui-ying/ce/cesium-func/node_modules/vite-plugin-cesium/dist/index.mjs";
var __vite_injected_original_import_meta_url = "file:///D:/dupengcheng/rui-ying/ce/cesium-func/vite.config.js";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    cesium(),
    vueDevTools()
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
      // cesium: 'cesium'
    }
  }
  // build: {
  //   rollupOptions: {
  //     external: ['cesium']
  //   }
  // }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxkdXBlbmdjaGVuZ1xcXFxydWkteWluZ1xcXFxjZVxcXFxjZXNpdW0tZnVuY1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcZHVwZW5nY2hlbmdcXFxccnVpLXlpbmdcXFxcY2VcXFxcY2VzaXVtLWZ1bmNcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2R1cGVuZ2NoZW5nL3J1aS15aW5nL2NlL2Nlc2l1bS1mdW5jL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXG5cbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCB2dWVEZXZUb29scyBmcm9tICd2aXRlLXBsdWdpbi12dWUtZGV2dG9vbHMnXG5pbXBvcnQgY2VzaXVtIGZyb20gJ3ZpdGUtcGx1Z2luLWNlc2l1bSc7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgdnVlKCksXG4gICAgY2VzaXVtKCksXG4gICAgdnVlRGV2VG9vbHMoKVxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpLFxuICAgICAgLy8gY2VzaXVtOiAnY2VzaXVtJ1xuICAgIH1cbiAgfSxcbiAgLy8gYnVpbGQ6IHtcbiAgLy8gICByb2xsdXBPcHRpb25zOiB7XG4gIC8vICAgICBleHRlcm5hbDogWydjZXNpdW0nXVxuICAvLyAgIH1cbiAgLy8gfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBOFMsU0FBUyxlQUFlLFdBQVc7QUFFalYsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxTQUFTO0FBQ2hCLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sWUFBWTtBQUwwSyxJQUFNLDJDQUEyQztBQVE5TyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsSUFDSixPQUFPO0FBQUEsSUFDUCxZQUFZO0FBQUEsRUFDZDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUM7QUFBQTtBQUFBLElBRXREO0FBQUEsRUFDRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFNRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
