<template>
    <div :class="classes">
        <div :class="[prefixHalfyearCls+(type===1?'-left':'-right')]" v-for="type in types">
            <span :class="[prefixHalfyearCls+'-header']">{{type===1?'上半年':'下半年'}}</span>
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

    const prefixHalfyearCls = `${prefixCls}-halfyear`;

    export default {
        mixins: [ Locale, mixin ],
        props: {/* in mixin */},
        data(){
            return {
                prefixCls,
                prefixHalfyearCls,
                types:[1,2]
            };
        },
        computed: {
            classes() {
                return [
                    `${prefixCls}`,
                    prefixHalfyearCls
                ];
            },
            startYear() {
                return Math.floor(this.tableDate.getFullYear() / 10) * 10;
            },
        },
        methods: {
            //type 1上半年 2下半年
            getCells (type) {
                let cells = [];
                const cell_tmpl = {
                    text: '',
                    selected: false,
                    disabled: false
                };

                const nowDate = new Date();
                for (let i = 0; i < 10; i++) {
                    const cell = deepCopy(cell_tmpl);
                    cell.date = new Date(this.startYear+i,type===1?0:6,1);
                    cell.text = this.startYear+i;
                    //是否是上半年
                    const isPreYear = cell.date.getMonth()<6;
                    this.dates.forEach(date => {
                        if(cell.date.getFullYear() === date.getFullYear() && isPreYear === date.getMonth()<6){
                            cell.selected = true;
                        }
                    });
                    cell.focused = cell.date.getFullYear()===this.focusedDate.getFullYear()&&isPreYear === this.focusedDate.getMonth()<6;
                    cell.type = cell.date.getFullYear() === nowDate.getFullYear() && isPreYear === nowDate.getMonth()<6?'today':'';
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
        }
    };
</script>
