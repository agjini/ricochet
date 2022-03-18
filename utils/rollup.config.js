import peerDepsExternal from "rollup-plugin-peer-deps-external";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";

export default [
    {
        input: "src/api/index.ts",
        output: [
            {
                file: "dist/api.js",
                format: "cjs",
                exports: "named",
                sourcemap: true
            },
            {
                file: "dist/api.esm.js",
                format: "esm",
                sourcemap: true
            }
        ],
        plugins: [
            peerDepsExternal(),
            terser(),
            typescript()
        ],
        external: []
    },
    {
        input: "src/client/index.ts",
        output: [
            {
                file: "dist/client.js",
                format: "cjs",
                exports: "named",
                sourcemap: true
            },
            {
                file: "dist/client.esm.js",
                format: "esm",
                sourcemap: true
            }
        ],
        plugins: [
            peerDepsExternal(),
            terser(),
            typescript()
        ],
        external: []
    },
    {
        input: "src/service/index.ts",
        output: [
            {
                file: "dist/service.js",
                format: "cjs",
                exports: "named",
                sourcemap: true
            },
            {
                file: "dist/service.esm.js",
                format: "esm",
                sourcemap: true
            }
        ],
        plugins: [
            peerDepsExternal(),
            terser(),
            typescript()
        ],
        external: ["multer", "mongodb", "nodemailer", "bson", "bcrypt", "jsonwebtoken", "crypto", "next"]
    }
];