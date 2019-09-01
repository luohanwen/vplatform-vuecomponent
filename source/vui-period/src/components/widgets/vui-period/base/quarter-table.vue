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

    const prefixQuarterCls = `${prefixCls}-quarter`;

    export default {
        mixins: [ Locale, mixin ],
        props: {/* in mixin */},
        data(){
            return {
                prefixCls,
                prefixQuarterCls,
                //1,2,3,4季度
                types:[1,2,3,4]
            };
        },
        computed: {
            classes() {
                return [
                    `${prefixCls}`,
                    prefixQuarterCls
                ];
            },
            // 个位数为0,1,2,3,4从0开始，其它从5开始
            startYear() {
                const tableDateYear = this.tableDate.getFullYear();
                // 个位数
                const singleNum = tableDateYear % 10;
                const diff = singleNum >= 5 ? 5 : 0;
                return Math.floor(this.tableDate.getFullYear() / 10) * 10 + diff;
            },
        },
        methods: {
            //type 1,2,3,4季度
            getCells (type) {
                let cells = [];
                const cell_tmpl = {
                    text: '',
                    selected: false,
                    disabled: false
                };

                const nowDate = new Date();
                const getType = (date) => Math.ceil((date.getMonth()+1)/3);
                for (let i = 0; i < 5; i++) {
                    const cell = deepCopy(cell_tmpl);
                    cell.date = new Date(this.startYear+i,type*3-3,1);
                    cell.text = this.startYear+i;
                    this.dates.forEach(date => {
                        if(date&&cell.date.getFullYear() === date.getFullYear() && type === getType(date)){
                            cell.selected = true;
                        }
                    });
                    cell.focused = cell.date.getFullYear()===this.focusedDate.getFullYear()&&type === getType(this.focusedDate);
                    cell.type = cell.date.getFullYear() === nowDate.getFullYear() && type === getType(nowDate)?'today':'';
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
                    1:"一季",
                    2:"二季",
                    3:"三季",
                    4:"四季"
                };
                return map[type] || map[1];
            }
        }
    };
</script>
