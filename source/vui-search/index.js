import vuiSearch from './src/components/widgets/vui-search';
import vuiSearchOption from './src/components/widgets/vui-search-option';
import vue from 'vue';
vue.component(vuiSearch.name,vuiSearch);
vue.component(vuiSearchOption.name,vuiSearchOption);
export default {vuiSearch,vuiSearchOption};