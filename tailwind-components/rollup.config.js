import peerDepsExternal from "rollup-plugin-peer-deps-external";
import typescript from "rollup-plugin-typescript2";

export default {
    input: "src/index.ts",
    output: [
        {
            file: "dist/index.js",
            format: "cjs",
            exports: "named",
            sourcemap: true
        },
        {
            file: "dist/index.esm.js",
            format: "esm",
            sourcemap: true
        }
    ],
    plugins: [
        peerDepsExternal(),
        typescript()
    ],
    external: ["react", "react-dom", "react-leaflet", "leaflet", "react-quill", "@headlessui/react", "luxon", "next", "next/link", "next/dynamic"]
}