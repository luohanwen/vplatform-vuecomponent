<template>
    <div :class="classes">
        <div :class="[prefixQuarterCls+'-item']" v-for="type in types">
            <span :class="[prefixQuarterCls+'-header']">{{type|toTypeName}}</span>
            <span
                :class="getCellCls(cell)"
                v-for="cell in getCells(type)"
                @click="handleClick(cell,type)"
                @mouseenter="handleMouseMove(cell,type)"

            >
                <em>{{ cell.text }}</em>
            </span>
        </div>
    </div>
</template>
<script>
    import { clearHours,getDateByWeekNum,getWeekIndex} from '../util';
    import { deepCopy } from '../utils/assist';
    import Locale from '../mixins/locale';
    import mixin from './mixin';
    import prefixCls from './prefixCls';

    const prefixQuarterCls = `${prefixCls}-tendays`;

    export default {
        mixins: [ Locale, mixin ],
        props: {/* in mixin */},
        data(){
            return {
                prefixCls,
                prefixQuarterCls,
                //上中下旬
                types:[1,2,3]
            };
        },
        computed: {
            classes() {
                return [
                    `${prefixCls}`,
                    prefixQuarterCls
                ];
            }
        },
        methods: {
            //type 1,2,3 上中下旬
            getCells (type) {
                let cells = [];
                const cell_tmpl = {
                    text: '',
                    selected: false,
                    disabled: false
                };

                const nowDate = new Date();
                const getType = (date) => {
                    const result = Math.ceil(date.getDate()/10);
                    return result ===4?3:result;
                };
                const tableMonth = this.tableDate.getMonth()+1;
                const start = tableMonth<=6?0:6;
                const end = start+6;
                for (let i = start; i < end; i++) {
                    const cell = deepCopy(cell_tmpl);
                    cell.date = new Date(this.tableDate.getFullYear(),i,type*10-9);
                    cell.text = `${i+1}月`
                    this.dates.forEach(date => {
                        if(cell.date.getFullYear() === date.getFullYear() && cell.date.getMonth() === date.getMonth() && type === getType(date)){
                            cell.selected = true;
                        }
                    });
                    cell.focused = cell.date.getFullYear()===this.focusedDate.getFullYear()&&cell.date.getMonth()===this.focusedDate.getMonth()&&type === getType(this.focusedDate);
                    cell.type = cell.date.getFullYear() === nowDate.getFullYear() && cell.date.getMonth() === nowDate.getMonth() && type === getType(nowDate)?'today':'';
                    cells.push(cell);
                }

                return cells;
            },
            getCellCls (cell) {
                return [
                    `${prefixCls}-cell`,
                    {
                        [`${prefixCls}-cell-selected`]: cell.selected,
                        [`${prefixCls}-cell-disabled`]: cell.disabled,
                        [`${prefixCls}-cell-focused`]: cell.focused,
                        [`${prefixCls}-cell-today`]: cell.type === 'today',
                        [`${prefixCls}-cell-range`]: cell.range && !cell.start && !cell.end
                    }
                ];
            },
            tCell (nr) {
                return this.t(`i.datepicker.months.m${nr}`);
            }
        },
        filters:{
            toTypeName(type){
                const map = {
                    1:"上旬",
                    2:"中旬",
                    3:"下旬"
                };
                return map[type] || map[1];
            }
        }
    };
</script>
