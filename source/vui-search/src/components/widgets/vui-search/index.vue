<template>
    <div :class="searchClass">
        <div class="ivu-input-group-prepend" v-if="prepend">
            <slot name="prepend"></slot>
        </div>
        <i-select
            ref="select"
            class="ivu-auto-complete"
            :label="label"
            :disabled="disabled"
            :clearable="clearable"
            :placeholder="placeholder"
            :size="size"
            :placement="placement"
            :value="currentValue"
            filterable
            remote
            auto-complete
            :remote-method="remoteMethod"
            @on-change="handleChange"
            :transfer="transfer">
            <slot name="input">
                <i-input
                    :element-id="elementId"
                    ref="input"
                    slot="input"
                    v-model="currentValue"
                    :name="name"
                    :placeholder="placeholder"
                    :disabled="disabled"
                    :size="size"
                    :icon="inputIcon"
                    search
                    @on-click="handleClearOrSearch"
                    @on-focus="handleFocus"
                    @on-search="handleSearch"
                    @on-blur="handleBlur">
                    </i-input>
            </slot>
            <slot>
                <template v-if="autoComplete"><i-option v-for="item in filteredData" :value="item[textField]" :key="item[textField]">{{ item[textField] }}</i-option></template>
            </slot>

            <slot name="droplist" v-if="autoComplete"></slot>
        </i-select>
        <div class="ivu-input-group-append" v-if="append" @click="currentValue&&$emit('on-search',currentValue)">
            <slot name="append"></slot>
        </div>
    </div>
</template>
<script>
    import iSelect from './base/select/select.vue';
    import iOption from './base/select/option.vue';
    import iInput from './base/input/input.vue';
    import { oneOf } from './utils/assist';
    import Emitter from './mixins/emitter';

    export default {
        name: 'vui-search',
        mixins: [ Emitter ],
        components: { iSelect, iOption, iInput },
        props: {
            widgetCode:String,
            dataSource:{
                type:Array,
                default:()=>[]
            },
            valueField:{
                type:String
            },
            textField:{
                type:String
            },
            autoComplete:{
                type:Boolean,
                default:true
            },
            value: {
                type: [String, Number],
                default: ''
            },
            label: {
                type: [String, Number],
                default: ''
            },
            data: {
                type: Array,
                default: () => []
            },
            disabled: {
                type: Boolean,
                default: false
            },
            clearable: {
                type: Boolean,
                default: false
            },
            placeholder: {
                type: String
            },
            size: {
                validator (value) {
                    return oneOf(value, ['small', 'large', 'default']);
                },
                default:"default"
            },
            icon: {
                type: String
            },
            filterMethod: {
                type: [Function, Boolean],
                default: false
            },
            placement: {
                validator (value) {
                    return oneOf(value, ['top', 'bottom']);
                },
                default: 'bottom'
            },
            transfer: {
                type: Boolean,
                default:false
            },
            name: {
                type: String
            },
            elementId: {
                type: String
            }
        },
        data () {
            return {
                currentValue: this.value,
                disableEmitChange: false ,   // for Form reset
                prepend:true,
                append:true
            };
        },
        mounted() {
                this.prepend = this.$slots.prepend !== undefined;
                this.append = this.$slots.append !== undefined;
        },
        computed: {
            inputIcon () {
                let icon = '';
                if (this.clearable && this.currentValue) {
                    icon = 'ios-close';
                } else if (this.icon) {
                    icon = this.icon;
                }
                return icon;
            },
            filteredData () {
                if (this.filterMethod) {
                    return this.dataSource.filter(item => this.filterMethod(this.currentValue, item));
                } else {
                    return this.dataSource;
                }
            },
            searchClass(){
                return ['vui-search',{[`vui-search-${this.size}`]:!!this.size}];
            }
        },
        watch: {
            value (val) {
                if(this.currentValue !== val){
                    this.disableEmitChange = true;
                }
                this.currentValue = val;
            },
            currentValue (val) {
                this.$refs.select.query = val;
                this.$emit('input', val);
                if (this.disableEmitChange) {
                    this.disableEmitChange = false;
                    return;
                }
                this.$emit('on-change', val);
                this.dispatch('FormItem', 'on-form-change', val);
            }
        },
        methods: {
            remoteMethod (query) {
                // this.$emit('on-search', query);
            },
            handleChange (val) {
                if (val === undefined || val === null) return;
                this.currentValue = val;
                this.$refs.input.blur();
                this.$emit('on-select', val);
            },
            handleSearch(val){
                this.$emit("on-search",val);
            },
            handleFocus (event) {
                this.$emit('on-focus', event);
            },
            handleBlur (event) {
                this.$emit('on-blur', event);
            },
            handleClearOrSearch () {
                if (!this.clearable){
                    this.$emit("on-search",this.currentValue);
                }else{
                    this.currentValue = '';
                    this.$refs.select.reset();
                }
            }
        }
    };
</script>
<style lang="less" src="./theme.less">
    
</style>