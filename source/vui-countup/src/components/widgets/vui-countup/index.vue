<template>
  <div class="vui-countup">
    <div
      class="vui-countup-hd"
      :style="slotStyles"
    >
      <slot name="header"></slot>
    </div>
    <div class="vui-countup-mid">
      <div class="append">
        <slot name="append"></slot>
      </div>
      <div
        class="num"
        :style="numStyles"
      >
        <ICountUp
          :startVal="value"
          :endVal="max"
          :decimals="decimals"
          :duration="duration"
          :options="options"
          @ready="onReady"
          ref="ICountUp"
        />
      </div>
      <div class="prepend">
        <slot name="prepend"></slot>
      </div>
    </div>
    <div
      class="vui-countup-footer"
      :style="slotStyles"
    >
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script>
import ICountUp from "./utils/vue-countup";
export default {
  name: "vui-countup",
  props: {
    widgetCode: {
      type: String,
      default: "vui-countup"
    },
    decimals: {
      type: Number,
      default: 0
    },
    duration: {
      type: Number,
      default: 2
    },
    max: {
      type: Number,
      default: 0
    },
    thousandMark: {
      type: Boolean,
      default: true
    },
    value: {
      type: Number,
      default: 0
    },
    color: {
      type: String,
      default: "rgb(86,88,87)"
    },
    fontSize: {
      type: String,
      default: "24px"
    },
    bold: {
      type: Boolean,
      default: false
    },
    textAlign: {
      type: String,
      default: "left"
    }
  },
  components: {
    ICountUp
  },
  data: function() {
    return {
      countUpInstance: null
    };
  },
  computed: {
    numStyles() {
      let stylesObj = { fontSize: this.fontSize, color: this.color };
      this.bold && (stylesObj.fontWeight = "bold");
      return stylesObj;
    },
    slotStyles() {
      let stylesObj = { textAlign: this.textAlign };
      return stylesObj;
    },
    options() {
      let options = {
        useGrouping: this.thousandMark,
        separator: ",",
        decimal: "."
      };
      return options;
    }
  },
  mounted() {},
  methods: {
    onReady: function(instance, CountUp) {
      this.countUpInstance = instance;
    },
    start() {
      let instance = this.countUpInstance;
      if (instance) {
        let finishCallback = () => {};
        let progressCallback = value => {
          this.$emit("on-change",value);
        };
        instance.start(finishCallback, progressCallback);
      }
    },
    reset() {
      let instance = this.countUpInstance;
      if (instance) {
        instance.reset();
      }
    }
  }
};
</script>
<style scoped lang="less" src="./theme.less"></style>