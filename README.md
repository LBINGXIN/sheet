# sheet 在线 Excel 编辑组件—支持导入导出

@lbingxin/sheet 组件是对开源组件 [x-data-spreadsheet](https://hondrytravis.com/x-spreadsheet-doc/) 进行二次封装，更易于使用。同时添加了补丁修复，集成 Excel 导入、导出功能。

### 安装

#### npm

```
npm i @lbingxin/sheet
```

#### yarn

```
yarn add @lbingxin/sheet
```

#### 引入

```js
import Vue from "vue";
import Sheet from "@lbingxin/sheet";
import "@lbingxin/sheet/dist/sheet.css";
Vue.use(Sheet);
```

### 使用方式

基础使用方式

```vue
<template>
  <sheet v-model="sheetData"></sheet>
</template>
<script>
export default {
  data() {
    return {
      sheetData: [
        {
          name: "sheet1",
          rows: {
            0: {
              cells: {
                0: {
                  text: "name",
                },
                1: {
                  text: "小明",
                },
              },
            },
            1: {
              cells: {
                0: {
                  text: "age",
                },
                1: {
                  text: "20",
                },
              },
            },
            len: 100,
          },
        },
      ],
    };
  },
};
</script>
```

### 属性

| 参数            | 类型    | 默认值                                               | 说明                                                                                                            |
| --------------- | ------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| mode            | String  | edit                                                 | 只读或可编辑模式，可选值 edit \| read                                                                           |
| showToolbar     | Boolean | true                                                 | 显示工具栏                                                                                                      |
| showBottomBar   | Boolean | true                                                 | 显示底部工具栏                                                                                                  |
| showGrid        | Boolean | true                                                 | 显示网格                                                                                                        |
| showContextmenu | Boolean | true                                                 | 鼠标右键显示菜单                                                                                                |
| width           | Number  | -                                                    | 设置宽度，只能是数值                                                                                            |
| height          | Number  | -                                                    | 设置高度，只能是数值                                                                                            |
| row             | Object  | { len: 100, height: 25}                              | 设置行信息，len 为显示的行数，height 为行的高度                                                                 |
| col             | Object  | { len: 26, width: 100, indexWidth: 60,minWidth: 60 } | 设置列信息，len 为显示的列数，width 为列的宽度, 左边序列栏默认宽度 indexWidth ，以及每个列默认最小宽度 minWidth |
| styles          | Object  | 如下                                                 | 设置 excel 样式                                                                                                 |

styles 默认配置

```js
styles: {
    // 背景颜色
    bgcolor: '#ffffff',
    // 水平对齐方式
    align: 'left',
    // 垂直对齐方式
    valign: 'middle',
    // 是否需要换行
    textwrap: false,
    // 虚线边框
    strike: false,
    // 下画线
  underline: false,
    // 文字颜色
    color: '#0a0a0a',
    // 字体设置
    font: {
      // 字体
      name: 'Helvetica',
      // 字号大小
      size: 10,
      // 是否加粗
      bold: false,
      // 斜体
      italic: false,
    },
  }
```

### 导入导出

```js
<template>
  <div>
    <button @click="handleExport">导出</button>

    // input file 导入
    <label for="file" style="margin: 0 8px; line-height: 28px">导入</label>
    <input
      id="file"
      type="file"
      style="display: none"
      @change="handleImport1"
    />

    // element-ui 导入
    <el-upload
      action=""
      :auto-upload="false"
      :show-file-list="false"
      :before-upload="() => false"
      :on-change="handleImport2"
    >
      <el-button type="primary" size="mini">上传 </el-button>
    </el-upload>
    <sheet v-model="sheetData" ref="sheet"></sheet>
  </div>
</template>
<script>
export default {
  methods: {
    /**
     * @params{string} name 导出文件名称
     * @params{string} ext 后缀名称 xls/xlsx 默认 xlsx
     */
    handleExport() {
      this.$refs.sheet.export("2022-07-16表单");
    },
    handleImport1(files) {
      this.$refs.sheet.import(files);
    },
    handleImport2(file) {
      this.$refs.sheet.import(file.raw);
    },
  },
};
</script>
```
