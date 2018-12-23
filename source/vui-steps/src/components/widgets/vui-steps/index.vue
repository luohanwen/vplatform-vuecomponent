<template>
  <Steps
    :current="current"
    :status="status"
    :size="size"
    :direction="direction"
    v-if="dataSource.length&&size"
  >
    <Step
      :title="step[titleField]"
      :content="step[contentField]"
      :icon="step[iconField]"
      :status="step[valueField]"
      v-for="step in dataSource"
      @click.native="handleClick(step)"
    ></Step>
  </Steps>
  <Steps
    :current="current"
    :status="status"
    :direction="direction"
    v-else-if="dataSource.length&&!size"
  >
    <Step
      :title="step[titleField]"
      :content="step[contentField]"
      :icon="step[iconField]"
      :status="step[valueField]"
      v-for="step in dataSource"
      @click.native="handleClick(step)"
    ></Step>
  </Steps>
</template>
<script>
export default {
  name: "vui-steps",
  props: {
    widgetCode: {
      type: String,
      default: "vui-steps"
    },
    current: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      default: "process"
    },
    size: {
      type: String,
      default: ""
    },
    direction: {
      type: String,
      default: "horizontal"
    },
    dataSource: {
      type: Array,
      default: () => []
    },
    titleField: {
      type: String,
      default: "title"
    },
    valueField: {
      type: String,
      default: "value"
    },
    iconField: {
      type: String,
      default: "icon"
    },
    contentField: {
      type: String,
      default: "content"
    }
  },
  data: function() {
    return {};
  },
  methods: {
    handleClick(item) {
      this.$emit("on-click", item);
    }
  }
};
</script>
<style scoped lang="less" src="./theme.less"></style>