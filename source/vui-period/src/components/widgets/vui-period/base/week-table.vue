<template>
    <div :class="classes">
        <span
            :class="getCellCls(cell)"
            v-for="cell in cells"
            @click="handleClick(cell)"
            @mouseenter="handleMouseMove(cell)"

        >
            <em>{{ cell.text }}</em>
        </span>
    </div>
</template>
<script>
    import { clearHours,getDateByWeekNum,getWeekIndex} from '../util';
    import { deepCopy } from '../utils/assist';
    import Locale from '../mixins/locale';
    import mixin from './mixin';
    import prefixCls from './prefixCls';

    export default {
        mixins: [ Locale, mixin ],
        props: {/* in mixin */},
        computed: {
            classes() {
                return [
                    `${prefixCls}`,
                    `${prefixCls}-week`
                ];
            },
            cells () {
                let cells = [];
                const cell_tmpl = {
                    text: '',
                    selected: false,
                    disabled: false
                };

                const tableYear = this.tableDate.getFullYear();
                const nowDate = new Date();
                for (let i = 0; i < 53; i++) {
                    const cell = deepCopy(cell_tmpl);
                    // cell.date = new Date(tableYear, i, 1);
                    cell.date =getDateByWeekNum(tableYear,i+1);
                    cell.text = i + 1;
                    const weekIndex = getWeekIndex(cell.date);
                    this.dates.forEach(date => {
                        if(date&&cell.date.getFullYear() === date.getFullYear() && weekIndex === getWeekIndex(date)){
                            cell.selected = true;
                        }
                    });
                    cell.focused = cell.date.getFullYear()===this.focusedDate.getFullYear()&&weekIndex === getWeekIndex(this.focusedDate);
                    cell.type = cell.date.getFullYear()===nowDate.getFullYear()&&weekIndex===getWeekIndex(nowDate)?"today":"";
                    cells.push(cell);
                }

                return cells;
            }
        },
        methods: {
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
