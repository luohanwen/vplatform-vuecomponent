<template>
    <span
        v-if="dot"
        :class="classes"
        ref="badge"
    >
        <slot></slot>
        <sup
            :class="dotClasses"
            :style="styles"
            v-show="badge"
        ></sup>
    </span>
    <span
        v-else-if="status"
        :class="classes"
        class="ivu-badge-status"
        ref="badge"
    >
        <span :class="statusClasses"></span>
        <span class="ivu-badge-status-text">{{ text }}</span>
    </span>
    <span
        v-else
        :class="classes"
        ref="badge"
    >
        <slot></slot>
        <sup
            v-if="hasCount"
            :style="styles"
            :class="countClasses"
            v-show="badge"
        >{{ finalCount }}</sup>
    </span>
</template>
<script>
import { oneOf } from './assist';
const prefixCls = 'ivu-badge';

export default {
  name: 'vui-badge',
  props: {
    widgetCode: String,
    value: [Number, String],
    dot: {
      type: Boolean,
      default: false
    },
    overflowCount: {
      type: [Number, String],
      default: 99
    },
    className: String,
    showZero: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: ''
    },
    status: {
      validator(value) {
        return oneOf(value, ['success', 'processing', 'default', 'error', 'warning']);
      }
    },
    type: {
      validator(value) {
        return oneOf(value, ['success', 'primary', 'normal', 'error', 'warning', 'info']);
      }
    },
    offset: {
      type: Array
    }
  },
  computed: {
    classes() {
      return `${prefixCls}`;
    },
    dotClasses() {
      return `${prefixCls}-dot`;
    },
    countClasses() {
      return [
        `${prefixCls}-count`,
        {
          [`${this.className}`]: !!this.className,
          [`${prefixCls}-count-alone`]: this.alone,
          [`${prefixCls}-count-${this.type}`]: !!this.type
        }
      ];
    },
    statusClasses() {
      return [
        `${prefixCls}-status-dot`,
        {
          [`${prefixCls}-status-${this.status}`]: !!this.status
        }
      ];
    },
    styles() {
      const style = {};
      if (this.offset && this.offset.length === 2) {
        style['margin-top'] = `${this.offset[0]}px`;
        style['margin-right'] = `${this.offset[1]}px`;
      }
      return style;
    },
    finalCount() {
      if (this.text !== '') return this.text;
      return parseInt(this.value) >= parseInt(this.overflowCount) ? `${this.overflowCount}+` : this.value;
    },
    badge() {
      let status = false;

      if (this.value) {
        status = !(parseInt(this.value) === 0);
      }

      if (this.dot) {
        status = true;
        if (this.value !== null) {
          if (parseInt(this.value) === 0) {
            status = false;
          }
        }
      }

      if (this.text !== '') status = true;

      return status || this.showZero;
    },
    hasCount() {
      if (this.value || this.text !== '') return true;
      if (this.showZero && parseInt(this.value) === 0) return true;
      else return false;
    },
    alone() {
      return this.$slots.default === undefined;
    }
  },
  mounted() {
    this.$el.setAttribute('widget-code', this.widgetCode);
  },
  watch: {
    value(val) {
      this.$emit('input', val);
    }
  }
};
</script>
