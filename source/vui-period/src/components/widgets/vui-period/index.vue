<script>
import Picker from './picker.vue';
import DatePickerPanel from './panel/Date/date.vue';
import RangeDatePickerPanel from './panel/Date/date-range.vue';

import { oneOf } from './utils/assist';

export default {
    name: 'vui-period',
    mixins: [Picker],
    props: {
        type: {
            validator (value) {
                return oneOf(value, ['year', 'month', 'date', 'daterange', 'datetime', 'datetimerange','week','halfyear','quarter','tendays']);
            },
            default: 'year'
        },
    },
    components: { DatePickerPanel, RangeDatePickerPanel },
    computed: {
        panel(){
            const isRange =  this.type === 'daterange' || this.type === 'datetimerange';
            return isRange ? 'RangeDatePickerPanel' : 'DatePickerPanel';
        },
        ownPickerProps(){
            return this.options;
        }
    },
};
</script>
<style lang="less" src="./theme.less">
</style>

