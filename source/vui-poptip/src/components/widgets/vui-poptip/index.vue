<template>
  <Poptip
    v-model="realValue"
    v-bind="props"
    v-on="$listeners"
  >
    <slot></slot>
    <slot
      name="title"
      slot="title"
    ></slot>
    <slot
      name="content"
      slot="content"
    ></slot>
  </Poptip>
</template>
<script>
import { deepCopy } from "./util";

export default {
  name: "vui-poptip",
  props: {
    widgetCode: String,
    value: Boolean,
    trigger: String,
    title: [String, Number],
    content: [String, Number],
    placement: String,
    width: [String, Number],
    confirm: Boolean,
    okText: String,
    cancelText: String,
    transfer: Boolean,
    popperClass: String
  },
  data: function() {
    return {
      realValue: false,
      props: (() => {
        let props = deepCopy(this.$props);
        delete props.value;
        return props;
      })()
    };
  },
  created() {
    //保存初始的value值，这里异步的原因是等Poptip逻辑运行完后再显示组件
    const value = this.value;
    setTimeout(() => {
      this.realValue = value;
    }, 0);
  }
};
</script>
<style scoped lang="less" src="./theme.less"></style>