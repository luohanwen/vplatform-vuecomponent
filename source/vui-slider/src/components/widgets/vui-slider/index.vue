<template>
    <div>
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
    </div>
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
      realValue: (()=>{return typeof this.value === "string"?+this.value:this.value;})()
    };
  },
  watch: {
    value(val) {
      this.realValue = typeof val === "string" ? +val : val;
    },
    realValue(val) {
      this.$emit("input", val);
    }
  },
  methods: {}
};
</script>
<style scoped lang="less" src="./theme.less"></style>