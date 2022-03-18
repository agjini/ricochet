import typescript from "rollup-plugin-typescript2";

export default [
    {
        input: "src/api/index.ts",
        output: {
            file: 'dist/api.js',
            format: 'umd',
            name: 'api'
        },
        plugins: [typescript()],
        external: []
    },
    {
        input: "src/client/index.ts",
        output: {
            file: 'dist/client.js',
            format: 'umd',
            name: 'client'
        },
        plugins: [typescript()],
        external: []
    },
    {
        input: "src/service/index.ts",
        output: {
            file: 'dist/service.js',
            format: 'cjs'
        },
        plugins: [typescript()],
        external: ["multer", "mongodb", "nodemailer", "bson", "bcrypt", "jsonwebtoken"]
    }
];