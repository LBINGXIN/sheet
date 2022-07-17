const path = require("path");
// 清楚 dist 目录
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// 它的职责是将你定义过的其它规则复制并应用到 .vue 文件里相应语言的块
const VueLoaderPlugin = require("vue-loader/lib/plugin");
// 抽离css文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  // 入口
  entry: {
    sheet: "./src/index.js",
  },
  // 文件输出，打包成 umd 格式
  output: {
    // 文件名，eg: sheet.js
    filename: "[name].js",
    // 输出目录，需要配置，不然 CleanWebpackPlugin 插件无效
    path: path.resolve(__dirname, "./dist"),
    // 输出库的名称
    library: "sheet",
    // export default
    libraryExport: "default",
    // umd 格式
    libraryTarget: "umd",
  },
  mode: "none",
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
      },
      {
        test: /\.vue$/,
        use: "vue-loader",
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
  ],
};
