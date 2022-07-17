import Sheet from "./sheet/index.vue";

Sheet.install = function (Vue) {
  Vue.component(Sheet.name, Sheet);
};

export default Sheet;
