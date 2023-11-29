/* eslint-disable import/no-unresolved */

import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        // 自動引入API的設定
        AutoImport({
            imports: ["vue", "vue-router", "pinia"],
            resolvers: [
                ElementPlusResolver(),
                IconsResolver({
                    prefix: "Icon",
                }),
            ],
            eslintrc: {
                enabled: true,
            },
        }),
        // 自動引入元件的設定
        Components({
            resolvers: [
                ElementPlusResolver({
                    importStyle: "sass",
                }),
                IconsResolver({
                    enabledCollections: ["ep"],
                }),
            ],
            // 根據資料夾設立命名空間
            directoryAsNamespace: true,
        }),
        Icons({
            autoInstall: true,
        }),
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@use "@/assets/elementPlus/theme.scss" as *;`,
            },
        },
    },
});
