<template>
  <Slider
    v-model="realValue"
    :min="min"
    :max="max"
    :step="step"
    :disabled="disabled"
    :range="range"
    :show-input="showInput"
    :show-stops="showStops"
    :show-tip="showTip"
    :tip-format="tipFormat"
    :input-size="inputSize"
  ></Slider>
</template>
<script>
export default {
  name: "vui-slider",
  props: {
    widgetCode: String,
    value: [Number, Array, String],
    min: Number,
    max: Number,
    step: Number,
    disabled: Boolean,
    range: Boolean,
    showInput: Boolean,
    showStops: Boolean,
    showTip: String,
    tipFormat: Function,
    inputSize: String
  },
  data: function() {
    return {
      realValue: (() => {
        return this.getRealValue(this.value);
      })()
    };
  },
  watch: {
    value(val) {
      this.realValue = this.getRealValue(val);
    },
    realValue(val) {
      this.$emit("input", typeof this.value === "string" ? val + "" : val);
    }
  },
  methods: {
    getRealValue(value) {
      return typeof value === "string" ? +value : value;
    }
  }
};
</script>
<style scoped lang="less" src="./theme.less"></style>