<template>
  <ul
    :class="classes"
    :style="styles"
  >
    <li class="vui-menu-header"><slot name="header"></slot></li>
    <slot></slot>
    <li class="vui-menu-footer"><slot name="footer"></slot></li>
    <li
      class="vui-collapse-footer"
      v-show="collapse&&mode=='vertical'"
      @click="toggleCollapse"
    >
      <div class="vui-collapse-fl"></div>
      <div class="vui-collapse-fr">
        <Icon :type="collapseIconType"></Icon>
      </div>
    </li>
  </ul>
</template>
<script>
import {
  oneOf,
  findComponentsDownward,
  findComponentsUpward
} from "../../utils/assist";
import Emitter from "../../mixins/emitter";

const preVuiCls = "vui-menu";
const prefixCls = "ivu-menu";

export default {
  name: "Menu",
  mixins: [Emitter],
  props: {
    mode: {
      validator(value) {
        return oneOf(value, ["horizontal", "vertical"]);
      },
      default: "vertical"
    },
    theme: {
      validator(value) {
        return oneOf(value, ["light","dark","#356BBC","#0079FE","#00a0e9","#c62f2f","#e72d7e","#ff6000","#f78803","#00bc71","#01bca2","#3f51b5","#5b3fb5"]);
      },
      default: "light"
    },
    activeName: {
      type: [String, Number]
    },
    openNames: {
      type: Array,
      default() {
        return [];
      }
    },
    accordion: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: "240px"
    },
    fullscreen: {
      type: Boolean,
      default: false
    },
    collapse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentActiveName: this.activeName,
      openedNames: [],
      isCollapse: true
    };
  },
  computed: {
    classes() {
      let theme = this.theme;
      if (this.mode === "vertical" && this.theme === "primary") theme = "light";

      let mainColor = ["#356BBC","#0079FE","#00a0e9","#c62f2f","#e72d7e","#ff6000","#f78803","#00bc71","#01bca2","#3f51b5","#5b3fb5"]
      let isMainColor = mainColor.indexOf(this.theme)>=0;
      let themeClass = isMainColor?theme.slice(1):theme;

      return [
        `${preVuiCls}`,
        `${prefixCls}`,
        `${preVuiCls}-${themeClass}`,
        `${preVuiCls}-skin`,
        `${preVuiCls}-skinextra1`,//纯粹就是为了提高皮肤样式的优先级多加的一个类名
        {
          [`${prefixCls}-${this.mode}`]: this.mode,
          [`${preVuiCls}-fullscreen`]: this.fullscreen,
          [`${preVuiCls}-fullscreen-not`]: !this.fullscreen,
          [`${preVuiCls}-collapse`]: this.collapse && this.isCollapse,
          [`${preVuiCls}-maincolor`]: isMainColor
        }
      ];
    },
    styles() {
      let style = {};

      if (this.mode === "vertical") style.width = this.width;

      return style;
    },
    collapseIconType() {
      return this.isCollapse ? "arrow-right-a" : "arrow-left-a";
    }
  },
  methods: {
    updateActiveName() {
      if (this.currentActiveName === undefined) {
        this.currentActiveName = -1;
      }
      this.broadcast("Submenu", "on-update-active-name", false);
      this.broadcast(
        "MenuItem",
        "on-update-active-name",
        this.currentActiveName
      );
    },
    updateOpenKeys(name) {
      let names = [...this.openedNames];
      const index = names.indexOf(name);
      if (this.accordion)
        findComponentsDownward(this, "Submenu").forEach(item => {
          item.opened = false;
        });
      if (index >= 0) {
        let currentSubmenu = null;
        findComponentsDownward(this, "Submenu").forEach(item => {
          if (item.name === name) {
            currentSubmenu = item;
            item.opened = false;
          }
        });
        findComponentsUpward(currentSubmenu, "Submenu").forEach(item => {
          item.opened = true;
        });
        findComponentsDownward(currentSubmenu, "Submenu").forEach(item => {
          item.opened = false;
        });
      } else {
        if (this.accordion) {
          let currentSubmenu = null;
          findComponentsDownward(this, "Submenu").forEach(item => {
            if (item.name === name) {
              currentSubmenu = item;
              item.opened = true;
            }
          });
          findComponentsUpward(currentSubmenu, "Submenu").forEach(item => {
            item.opened = true;
          });
        } else {
          findComponentsDownward(this, "Submenu").forEach(item => {
            if (item.name === name) item.opened = true;
          });
        }
      }
      let openedNames = findComponentsDownward(this, "Submenu")
        .filter(item => item.opened)
        .map(item => item.name);
      this.openedNames = [...openedNames];
      this.$emit("on-open-change", openedNames);
    },
    updateOpened() {
      const items = findComponentsDownward(this, "Submenu");

      if (items.length) {
        items.forEach(item => {
          if (this.openedNames.indexOf(item.name) > -1) item.opened = true;
          else item.opened = false;
        });
      }
    },
    handleEmitSelectEvent(name) {
      this.$emit("on-select", name);
    },
    //改变缩略状态（只显示图标和显示全部）
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    }
  },
  mounted() {
    this.updateActiveName();
    this.openedNames = [...this.openNames];
    this.updateOpened();
    this.$on("on-menu-item-select", name => {
      this.currentActiveName = name;
      this.$emit("on-select", name);
    });
  },
  watch: {
    openNames(names) {
      this.openedNames = names;
    },
    activeName(val) {
      this.currentActiveName = val;
    },
    currentActiveName() {
      this.updateActiveName();
    }
  }
};
</script>
