<template>
	<i-progress
		:percent="newPercent"
		:status="status"
		:stroke-width="strokeWidth"
		:hide-info="hideInfo"
		:vertical="vertical"
	>
		<slot></slot>
	</i-progress>
</template>
<script>
export default {
	name: "vui-progress",
	props: {
		widgetCode: {
			type: String,
			default: "vui-progress"
		},
		percent: {
			default: 0,
			validator(value) {
				return typeof value === "number" || typeof value === "string";
			}
		},
		status: {
			type: String,
			default: "normal"
		},
		strokeWidth: {
			type: Number,
			default: 10
		},
		hideInfo: {
			type: Boolean,
			default: false
		},
		vertical: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		newPercent() {
			return +this.percent;
		}
	},
	data: function() {
		return {};
	},
	methods: {}
};
</script>
<style scoped lang="less" src="./theme.less"></style>
