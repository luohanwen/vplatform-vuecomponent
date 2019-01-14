<template>
    <Timeline :pending="pending">
        <TimelineItem :color="item[colorField] || 'blue'" v-for="item in dataSource">
            <Icon :type="item[iconField]" slot="dot" v-if="item[iconField]"></Icon>
            <span v-if="item[textField]">{{item[textField]}}</span>
        </TimelineItem>
        <slot></slot>
    </Timeline>
</template>
<script>
export default {
  name: "vui-timeline",
  props: {
    widgetCode: String,
    dataSource: Array,
    textField: String,
    valueField: String,
    iconField: String,
    colorField: String,
    pending:Boolean
  },
  data: function() {
    return {};
  },
  methods: {}
};
</script>
<style scoped lang="less" src="./theme.less"></style>