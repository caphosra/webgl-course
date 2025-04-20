import * as path from "path";
import * as webpack from "webpack";

const config: webpack.Configuration = {
    mode: "production",
    entry: "./src/index.ts",
    output: {
        path: path.resolve("dist"),
        filename: "bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
};

export default config;
