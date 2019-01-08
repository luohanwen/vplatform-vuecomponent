<template>
  <TimelineItem :color="color">
      <slot name="dot" slot="dot"></slot>
      <slot></slot>
  </TimelineItem>
</template>
<script>
export default {
  name: "vui-timeline-item",
  props: {
      widgetCode:String,
      color:{
          type:String,
          default:"blue"
      }
  },
  data: function() {
    return {};
  },
  methods: {}
};
</script>
<style scoped lang="less" src="./theme.less"></style>