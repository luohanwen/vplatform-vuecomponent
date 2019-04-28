<template>
    <li
        :class="classes"
        @mouseenter="handleMouseenter"
        @mouseleave="handleMouseleave"
        :data-depth="treeDepth"
    >
        <div
            :class="[prefixCls + '-submenu-title']"
            ref="reference"
            :style="titleStyle"
            @click.stop="handleClick"
            :data-depth="treeDepth"
        >
            <slot name="title"></slot>
            <Icon
                :type="arrowIconType"
                :class="[prefixCls + '-submenu-title-icon']"
            ></Icon>
        </div>
        <!-- <transition name="collapse" :duration="{ enter: 500}"> -->
        <ul
            :class="[prefixCls,vuiPrefixCls+'-depth-'+(treeDepth+1)]"
            v-show="opened"
            :style="menuStyle"
        >
            <slot></slot>
        </ul>
        <!-- </transition> -->
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
const vuiPrefixCls = "vui-menu";

export default {
    name: "Submenu",
    mixins: [Emitter, mixin],
    components: { Icon, Drop, CollapseTransition },
    props: {
        name: {
            type: [String, Number],
            required: true
        },
        treeDepth: {
            type: Number
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            prefixCls: prefixCls,
            vuiPrefixCls:vuiPrefixCls,
            active: false,
            opened: false,
            dropWidth: parseFloat(getStyle(this.$el, "width")),
            menuStyle: {}
        };
    },
    computed: {
        // 箭头类型
        arrowIconType(){
            return this.mode === 'vertical' ? 'ios-arrow-right':'ios-arrow-down';
        },
        classes() {
            return [
                `${prefixCls}-submenu`,
                {
                    [`${prefixCls}-item-active`]:
                        this.active && !this.hasParentSubmenu,
                    [`${prefixCls}-opened`]: this.opened,
                    [`${prefixCls}-submenu-disabled`]: this.disabled,
                    [`${prefixCls}-submenu-has-parent-submenu`]: this
                        .hasParentSubmenu,
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
        },
        // 是否处于collapse状态
        isCollapseing(){
            return this.collapse && this.isCollapse;
        }
    },
    methods: {
        handleMouseenter(event) {
            console.log("handleMouseenter");
            if (this.disabled) return;
            if (this.isFirstMenuOnModel1(event)) return;
            if (this.mode === "vertical") {
                this.$parent.$children.forEach(item => {
                    if (item.$options.name === "Submenu") item.opened = false;
                });
            }
            console.log("handleMouseenter1111");
            // clearTimeout(this.timeout);
            // this.timeout = setTimeout(() => {
                this.menu.updateOpenKeys(this.name);
                this.opened = true;
                console.log("handleMouseenter show");
            // }, 250);
        },
        handleMouseleave(event) {
            console.log("handleMouseleave");
            if (this.disabled) return;
            if (this.isFirstMenuOnModel1(event)) return;
            console.log("handleMouseenter2222");
            // clearTimeout(this.timeout);
            // this.timeout = setTimeout(() => {
                this.menu.updateOpenKeys(this.name);
                this.opened = false;
                console.log("handleMouseenter hide");
            // }, 150);
        },
        handleClick(event) {
            if (this.disabled) return;
            if (this.mode === "horizontal") return;
            if (!this.isFirstMenuOnModel1(event)) return;
            const opened = this.opened;
            if (this.accordion || this.isCollapseing) {
                this.$parent.$children.forEach(item => {
                    if (item.$options.name === "Submenu") item.opened = false;
                });
            }
            this.menu.updateOpenKeys(this.name);
            this.opened = !opened;
            console.log("handleclick");
        },
        //垂直非全屏下的第一级菜单,model 1-垂直非全屏 2-垂直全屏 3-水平非全屏 4水平全屏
        isFirstMenuOnModel1(event){
            if(this.mode === "vertical" && !this.fullscreen && !this.isCollapseing){
                let $target = $(event.currentTarget);
                let isFirstMenu = $target.data("depth") == 1;
                if(isFirstMenu) return true;
            }
            return false;
        },
    },
    watch: {
        mode(val) {
            if (val === "horizontal") {
                this.$refs.drop.update();
            }
        },
        opened(val) {
            //   if (this.mode === "vertical") return;
            //   if (val) {
            //     // set drop a width to fixed when menu has fixed position
            //     this.dropWidth = parseFloat(getStyle(this.$el, "width"));
            //     this.$refs.drop.update();
            //   } else {
            //     this.$refs.drop.destroy();
            //   }
        }
    },
    mounted() {
        this.$on("on-menu-item-select", name => {
            if (this.mode === "horizontal") {
                this.opened = false;
            } else {
                let parentSubmenu = findComponentsUpward(this, "Submenu");
                //垂直非全屏非折叠模式下并且为1级菜单不收起来
                if(this.mode === "vertical"&&!this.fullscreen&&!this.isCollapseing&&!parentSubmenu.length){
                }else{
                    this.opened = false;
                    parentSubmenu.forEach(item => {
                        // 垂直非全屏模式下第一级菜单不关闭
                        if(this.mode === "vertical"&&!this.fullscreen&&item.treeDepth==1){
                        }else{
                            item.opened = false;
                        }
                    });
                }
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
