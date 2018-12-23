<script>
export default {
	name: "vui-breadcrumb",
	props: {
		widgetCode: {
			type: String,
			default: "vui-breadcrumb"
		},
		separator: {
			type: String,
			default: "/"
		},
		dataSource: {
			type: Array,
			default: () => []
		},
		textField: {
			type: String,
			default: "text"
		},
		valueField: {
			type: String,
			default: "value"
		},
		iconField: {
			type: String,
			default: "icon"
		}
	},
	data: function() {
		return {};
	},
	render(h) {
		//获取getBreadcrumbItem里的内容
		let getInsideContent = item => {
			let val = [];
			let iconType = item[this.iconField];
			if (iconType) {
				val.push(
					h("Icon", {
						attrs: {
							type: iconType
						}
					})
				);
			}
			let text = iconType ? " " + this.textField : this.textField;
			val.push(text);
			return val;
		};
		let getBreadcrumbItem = data => {
			return data.map(item => {
				return h(
					"BreadcrumbItem",
					{
						nativeOn: {
							click: () => {
								this.onSelect(item[this.valueField]);
							}
						}
					},
					getInsideContent(item)
				);
			});
		};
		return h(
			"Breadcrumb",
			{
				attrs: {
					separator: this.separator
				}
			},
			getBreadcrumbItem(this.dataSource)
		);
	},
	methods: {
		onSelect(value) {
			this.$emit("on-click", value);
		}
	}
};
</script>
<style scoped lang="less" src="./theme.less"></style>
