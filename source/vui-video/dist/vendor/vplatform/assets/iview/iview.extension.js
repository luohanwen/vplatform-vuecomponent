var _$iview_componentStr = "Affix,Alert,Avatar,BackTop,Badge,Breadcrumb,BreadcrumbItem,iButton,Button,ButtonGroup,Card,Carousel,CarouselItem,Cascader,Checkbox,CheckboxGroup,iCircle,Dropdown,DropdownItem,DropdownMenu,Form,iForm,FormItem,Col,iCol,Collapse,Icon,LoadingBar,Menu,iMenu,MenuGroup,MenuItem,Submenu,Message,Modal,Notice,Option,iOption,OptionGroup,Page,Panel,Poptip,Progress,iProgress,Radio,RadioGroup,Rate,Row,Select,iSelect,Slider,Spin,Step,Steps,iSwitch,iTable,Table,Tabs,TabPane,Tag,Timeline,TimelineItem,Tooltip,Transfer,Tree,Upload";
var _$iview_prefix = "vui";
var _$iview_components = _$iview_componentStr.split(",");
var _$iview_components_mapping = {};
var _$iview_dealComponentName = function(name){
	return name.charAt(0).toUpperCase()+name.substring(1);
}
for(var i=0,l=_$iview_components.length;i<l;i++){
	var component = _$iview_components[i];
	var name = _$iview_components_mapping[component] ? _$iview_components_mapping[component]:component;
	Vue.component(_$iview_prefix+_$iview_dealComponentName(name),Vue.component(component));
}
