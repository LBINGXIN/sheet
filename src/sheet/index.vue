<template>
  <div ref="element" class="euler-sheet"></div>
</template>
<script>
import Spreadsheet from "x-data-spreadsheet";
import "x-data-spreadsheet/dist/xspreadsheet.css";
import "x-data-spreadsheet/dist/locale/zh-cn";
import * as XLSX from "xlsx";
import _ from "lodash";
Spreadsheet.locale("zh-cn");
const defaultStyle = {
  bgcolor: "#ffffff",
  align: "left",
  valign: "middle",
  textwrap: false,
  strike: false,
  underline: false,
  color: "#0a0a0a",
  font: {
    name: "Helvetica",
    size: 10,
    bold: false,
    italic: false,
  },
};

export default {
  name: "Sheet",
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: [Array, Object, null, undefined],
    mode: {
      type: String,
      default: "edit",
    },
    showToolbar: {
      type: Boolean,
      default: true,
    },
    showBottomBar: {
      type: Boolean,
      default: true,
    },
    showGrid: {
      type: Boolean,
      default: true,
    },
    showContextmenu: {
      type: Boolean,
      default: true,
    },
    width: {
      type: [Number, String],
      default: 0,
    },
    height: {
      type: [Number, String],
      String,
      default: 0,
    },
    row: {
      type: Object,
      default: () => ({}),
    },
    col: {
      type: Object,
      default: () => ({}),
    },
    styles: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {};
  },
  mounted() {
    const {
      mode,
      showToolbar,
      showBottomBar,
      showGrid,
      showContextmenu,
      width,
      height,
      row,
      col,
      styles,
    } = this;
    const value = _.isEmpty(this.value) ? {} : this.value;
    const style = _.merge({}, defaultStyle, styles);
    const hasParent = !!this.$parent;
    const sheet = new Spreadsheet(this.$refs.element, {
      mode,
      showToolbar,
      showBottomBar,
      showGrid,
      showContextmenu,
      row,
      col,
      style,
      view: {
        height: () => {
          if (height) return height;
          if (hasParent) {
            return this.$parent.$el.clientHeight;
          }
          return document.documentElement.clientHeight;
        },
        width: () => {
          if (width) return width;
          if (hasParent) {
            return this.$parent.$el.clientWidth;
          }
          return document.documentElement.clientWidth;
        },
      },
    })
      .loadData(value)
      .change(() => {
        const data = this.handleResult();
        this.$emit("change", data);
      })
      .on("cell-selected", (cell, ri, ci) => {
        this.$emit("cell", cell, ri, ci);
      })
      .on("cells-selected", (cell, { sri, sci, eri, eci }) => {
        this.$emit("cells", cell, { sri, sci, eri, eci });
      })
      .on("cell-edited", (text, ri, ci) => {
        this.$emit("edited", text, ri, ci);
      });

    // data validation
    sheet.validate();
    this.sheet = sheet;
  },
  methods: {
    handleResult() {
      const result = this.sheet.getData();
      return result.map((item) => {
        const { name, rows } = item;
        return { name, rows };
      });
    },
    // 导出
    export(name = "sheet", ext = "xlsx") {
      const { sheet } = this;
      const list = sheet.getData();
      const wb = this.handleData(list);
      XLSX.writeFile(wb, `${name}.${ext}`);
    },
    handleData(list) {
      const wb = XLSX.utils.book_new();
      list.forEach(function (xws) {
        const aoa = [[]];
        const rows = xws.rows;
        for (let i = 0; i < rows.len; i++) {
          const row = rows[i];
          if (!row) continue;
          aoa[i] = [];
          Object.keys(row.cells).forEach(function (k) {
            const idx = +k;
            if (isNaN(idx)) return;
            aoa[i][idx] = row.cells[k].text;
          });
        }
        const ws = XLSX.utils.aoa_to_sheet(aoa);
        XLSX.utils.book_append_sheet(wb, ws, xws.name);
      });
      return wb;
    },
    import(files) {
      const file = files instanceof File ? files : files.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const fixedData = this.fixData(data);
        const workbook = XLSX.read(btoa(fixedData), { type: "base64" });
        this.sheet.loadData(this.handleExcel(workbook));
      };
      reader.readAsArrayBuffer(file);
    },
    fixData(data) {
      let o = "";
      let l = 0;
      const w = 10240;
      for (; l < data.byteLength / w; ++l) {
        o += String.fromCharCode.apply(
          null,
          new Uint8Array(data.slice(l * w, l * w + w))
        );
      }
      o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
      return o;
    },
    handleExcel(wb) {
      const out = [];
      wb.SheetNames.forEach(function (name) {
        const o = { name: name, rows: {} };
        const ws = wb.Sheets[name];
        const aoa = XLSX.utils.sheet_to_json(ws, { raw: false, header: 1 });
        aoa.forEach(function (r, i) {
          const cells = {};
          r.forEach(function (c, j) {
            cells[j] = { text: c };
          });
          o.rows[i] = { cells: cells };
        });
        out.push(o);
      });
      return out;
    },
  },
};
</script>
