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
                const selectedDaysWeekIndex = this.dates.filter(Boolean).map(date => getWeekIndex(date));
                for (let i = 0; i < 53; i++) {
                    const cell = deepCopy(cell_tmpl);
                    // cell.date = new Date(tableYear, i, 1);
                    cell.date =getDateByWeekNum(tableYear,i+1);
                    cell.text = i + 1;
                    const weekIndex = getWeekIndex(cell.date);
                    cell.selected = selectedDaysWeekIndex.includes(weekIndex);
                    cell.focused = weekIndex === getWeekIndex(this.focusedDate);
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
