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
        @on-change="onChange"
        @on-input="onInput"
    ></Slider>
</template>
<script>
export default {
  name: 'vui-slider',
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
      let isRange = this.range;
      let initValue = this.value;
      let result;
      if (isRange) {
        result = typeof initValue === 'string' ? val.join(',') : val;
      } else {
        result = typeof initValue === 'string' ? val + '' : val;
      }
      this.$emit('input', result);
    }
  },
  mounted() {
    this.$el.setAttribute('widget-code', this.widgetCode);
  },
  methods: {
    getRealValue(value) {
      let isRange = this.range;
      let result;
      if (isRange) {
        result = typeof value === 'string' ? (value ? value.split(',') : [0, 0]) : value;
        if (result.length < 2) {
          result = [0, 0];
        }
      } else {
        result = typeof value === 'string' ? +value : value;
      }
      return result;
    },
    onChange(val) {
      this.$emit('on-change', val);
    },
    onInput(val) {
      this.$emit('on-input', val);
    }
  }
};
</script>
<style scoped lang="less" src="./theme.less"></style>