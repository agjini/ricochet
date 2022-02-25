import typescript from "rollup-plugin-typescript2";

export default {
    input: "src/index.ts",
    output: [
        {
            dir: "dist",
            format: "cjs",
            exports: "named",
            sourcemap: true,
            strict: false
        }
    ],
    plugins: [typescript()],
    external: ["multer", "mongodb", "nodemailer", "bson", "bcrypt", "jsonwebtoken"]
}