<template>
    <li :class="[prefixCls + '-item-group']">
        <div :class="[prefixCls + '-item-group-title']" :style="groupStyle">{{ title }}</div>
        <ul :style="groupUlStyle"><slot></slot></ul>
    </li>
</template>
<script>
    import mixin from './mixin';
    const prefixCls = 'ivu-menu';

    export default {
        name: 'MenuGroup',
        mixins: [ mixin ],
        props: {
            title: {
                type: String,
                default: ''
            }
        },
        data () {
            return {
                prefixCls: prefixCls
            };
        },
        computed: {
            groupStyle () {
                return this.hasParentSubmenu && this.mode !== 'horizontal' ? {
                    paddingLeft: '16px'
                } : {};
            },
            groupUlStyle(){
                return this.hasParentSubmenu && this.mode !== 'horizontal' ? {
                    paddingLeft: '12px!important'
                } : {};
            }
        }
    };
</script>
