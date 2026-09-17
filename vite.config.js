// vite.config.ts
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";

export default defineConfig({
  base: "./",

  plugins: [
    babel({
      filter: /\.ts$/,
      babelConfig: {
        babelrc: false,
        configFile: false,

        plugins: [
          [
            "@babel/plugin-proposal-decorators",
            {
              version: "2023-11",
            },
          ],
          [
            "@babel/plugin-transform-typescript",
            {
              onlyRemoveTypeImports: true,
            },
          ],
        ],
      },
    }),
  ],
});
