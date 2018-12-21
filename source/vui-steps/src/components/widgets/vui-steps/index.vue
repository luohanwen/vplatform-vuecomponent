<template>
	<Steps
		:current="newCurrent"
		:status="status"
		:size="size"
		:direction="direction"
		v-if="dataSource.length && size"
	>
		<Step
			:title="step[titleField]"
			:content="step[contentField]"
			:icon="step[iconField]"
			v-for="step in dataSource"
			@click.native="handleClick(step[valueField]);"
		></Step>
	</Steps>
	<Steps
		:current="newCurrent"
		:status="status"
		:direction="direction"
		v-else-if="dataSource.length && !size"
	>
		<Step
			:title="step[titleField]"
			:content="step[contentField]"
			:icon="step[iconField]"
			v-for="step in dataSource"
			@click.native="handleClick(step[valueField]);"
		></Step>
	</Steps>
</template>
<script>
export default {
	name: "vui-steps",
	props: {
		widgetCode: {
			type: String,
			default: "vui-steps"
		},
		current: {
			default: 0,
			validator(value) {
				return typeof value === "number" || typeof value === "string";
			}
		},
		status: {
			type: String,
			default: "process"
		},
		size: {
			type: String
		},
		direction: {
			type: String,
			default: "horizontal"
		},
		dataSource: {
			type: Array,
			default: () => []
		},
		titleField: {
            type: String
		},
		valueField: {
            type: String
		},
		iconField: {
            type: String
		},
		contentField: {
            type: String
		}
	},
	data: function() {
		return {};
    },
    computed:{
        newCurrent(){
            return +this.current;
        }
    },
	methods: {
		handleClick(value) {
			this.$emit("on-click", value);
		}
	}
};
</script>
<style scoped lang="less" src="./theme.less"></style>
