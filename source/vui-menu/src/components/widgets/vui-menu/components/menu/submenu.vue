<template>
  <li
    :class="classes"
    @mouseenter="handleMouseenter"
    @mouseleave="handleMouseleave"
    @click.stop="handleClick"
  >
    <div
      :class="[prefixCls + '-submenu-title']"
      ref="reference"
      :style="titleStyle"
    >
      <slot name="title"></slot>
      <Icon
        type="ios-arrow-down"
        :class="[prefixCls + '-submenu-title-icon']"
      ></Icon>
    </div>
    <collapse-transition>
      <ul
        :class="[prefixCls]"
        v-show="opened"
        :style="menuStyle"
      >
        <slot></slot>
      </ul>
    </collapse-transition>
    <!-- <transition
      name="slide-up"
      v-else
    >
      <Drop
        v-show="opened"
        placement="bottom"
        ref="drop"
        :style="dropStyle"
      >
        <ul :class="[prefixCls + '-drop-list']">
          <slot></slot>
        </ul>
      </Drop>
    </transition> -->
  </li>
</template>
<script>
import Drop from "../select/dropdown.vue";
import Icon from "../icon/icon.vue";
import CollapseTransition from "../base/collapse-transition";
import {
  getStyle,
  findComponentUpward,
  findComponentsUpward,
  findComponentsDownward
} from "../../utils/assist";
import Emitter from "../../mixins/emitter";
import mixin from "./mixin";

const prefixCls = "ivu-menu";

export default {
  name: "Submenu",
  mixins: [Emitter, mixin],
  components: { Icon, Drop, CollapseTransition },
  props: {
    name: {
      type: [String, Number],
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      prefixCls: prefixCls,
      active: false,
      opened: false,
      dropWidth: parseFloat(getStyle(this.$el, "width")),
      menuStyle: {}
    };
  },
  computed: {
    classes() {
      return [
        `${prefixCls}-submenu`,
        {
          [`${prefixCls}-item-active`]: this.active && !this.hasParentSubmenu,
          [`${prefixCls}-opened`]: this.opened,
          [`${prefixCls}-submenu-disabled`]: this.disabled,
          [`${prefixCls}-submenu-has-parent-submenu`]: this.hasParentSubmenu,
          [`${prefixCls}-child-item-active`]: this.active
        }
      ];
    },
    accordion() {
      return this.menu.accordion;
    },
    dropStyle() {
      let style = {};

      if (this.dropWidth) style.minWidth = `${this.dropWidth}px`;
      return style;
    },
    titleStyle() {
      return this.hasParentSubmenu && this.mode !== "horizontal"
        ? {
            paddingLeft: "16px"
          }
        : {};
    }
  },
  methods: {
    handleMouseenter(event) {
      if (this.disabled) return;
      if (this.mode === "vertical") {
        return;
        // this.handleClick(event);
      } else {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.menu.updateOpenKeys(this.name);
          this.opened = true;
        }, 250);
        this.vuiHandle(3, { event: event });
        this.vuiHandle(4, { event: event });
      }
    },
    handleMouseleave(event) {
      return false;
      if (this.disabled) return;
      if (this.mode === "vertical") {
        return;
        // this.handleClick(event);
      } else {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.menu.updateOpenKeys(this.name);
          this.opened = false;
        }, 150);
      }
    },
    handleClick(event) {
      if (this.disabled) return;
      if (this.mode === "horizontal") return;
      const opened = this.opened;
      if (this.accordion) {
        this.$parent.$children.forEach(item => {
          if (item.$options.name === "Submenu") item.opened = false;
        });
      }
      this.menu.updateOpenKeys(this.name);
      this.opened = !opened;
      this.vuiHandle(1, { event: event });
      //全屏处理
      this.vuiHandle(2, { event: event });
    },
    //适配vuimenu做的一些处理
    //option 对应的参数
    vuiHandle(type, opt) {
      switch (type) {
        //垂直非全屏  点击菜单时处理子菜单位置
        case 1:
          if (!this.fullscreen && this.mode === "vertical") {
            //点击的是否是第一级菜单
            let event = opt.event;
            let $target = $(event.currentTarget || event.target);
            let isFirstMenu = !$target.parents(".ivu-menu-submenu").length;
            if (!isFirstMenu) {
              //点击的是否是菜单的第一项
              let isFirstItem = $target.index() === 0;
              let targetTop = $target.offset().top;
              let menuItemHeight = $target.innerHeight();
              let menuTop = $target.parents(`.${prefixCls}`).offset().top;
              let subMenuWidth = $target.innerWidth();
              let top, left;
              if (isFirstMenu || isFirstItem) {
                top = 0;
              } else {
                top = -menuItemHeight;
              }
              left = subMenuWidth + 2;
              this.menuStyle.left = `${left}px`;
              this.menuStyle.top = `${top}px`;
            } else {
              //第二级菜单增加指定类名
              $target.find(">.ivu-menu").addClass("vui-menu-level2");
            }
          }
          break;
        //垂直全屏  处理子菜单的位置
        case 2:
          if (this.fullscreen && this.mode === "vertical") {
            let event = opt.event;
            let $target = $(event.currentTarget || event.target);
            let subMenuWidth = $target.innerWidth();
            let left = subMenuWidth + 2;
            this.menuStyle.left = `${left}px`;
          }
          break;
        //水平非全屏  处理子菜单的位置
        case 3:
          if (!this.fullscreen && this.mode === "horizontal") {
            let event = opt.event;
            let $target = $(event.currentTarget || event.target);
            let isFirstMenu = !$target.parents(".ivu-menu-submenu").length;
            let targetTop = $target.offset().top;
            let menuItemHeight = $target.outerHeight();
            let menuTop = $target.parent(`.${prefixCls}`).offset().top;
            let subMenuWidth = $target.outerWidth();
            let top, left;
            if (isFirstMenu) {
              top = menuItemHeight;
              left = 0;
            } else {
              top = 0;
              left = subMenuWidth;
            }
            this.menuStyle.left = `${left}px`;
            this.menuStyle.top = `${top}px`;
          }
          break;
        //水平全屏  处理子菜单的位置
        case 4:
          if (this.fullscreen && this.mode === "horizontal") {
            let event = opt.event;
            let $target = $(event.currentTarget || event.target);
            let top = $target.parent(`.${prefixCls}`).outerHeight();
            this.menuStyle.top = `${top}px`;
          }
          break;
      }
    }
  },
  watch: {
    mode(val) {
      if (val === "horizontal") {
        this.$refs.drop.update();
      }
    },
    opened(val) {
      if (this.mode === "vertical") return;
      if (val) {
        // set drop a width to fixed when menu has fixed position
        this.dropWidth = parseFloat(getStyle(this.$el, "width"));
        this.$refs.drop.update();
      } else {
        this.$refs.drop.destroy();
      }
    }
  },
  mounted() {
    this.$on("on-menu-item-select", name => {
      if (this.mode === "horizontal") {
        this.opened = false;
      } else {
        this.opened = false;
        findComponentsUpward(this, "Submenu").forEach(item => {
          item.opened = false;
        });
      }
      this.dispatch("Menu", "on-menu-item-select", name);
      return true;
    });
    this.$on("on-update-active-name", status => {
      if (findComponentUpward(this, "Submenu"))
        this.dispatch("Submenu", "on-update-active-name", status);
      if (findComponentsDownward(this, "Submenu"))
        findComponentsDownward(this, "Submenu").forEach(item => {
          item.active = false;
        });
      this.active = status;
    });
  }
};
</script>
