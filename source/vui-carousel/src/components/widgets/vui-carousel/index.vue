<template>
	<Carousel
		v-model="currentIndex"
		:height="height"
		:loop="loop"
		:autoplay="autoplay"
		:autoplay-speed="autoplaySpeed"
		:dots="dots"
		:radius-dot="radiusDot"
		:trigger="trigger"
		:arrow="arrow"
		:easing="easing"
		@on-change="changeHandle"
	>
        <slot></slot>
	</Carousel>
</template>
<script>
export default {
	name: "vui-carousel",
	props: {
		widgetCode: {
			type: String,
			default: "vui-carousel"
		},
		height: {
			type: [String, Number],
			default: "auto"
		},
		loop: {
			type: Boolean,
			default: false
		},
		autoplay: {
			type: Boolean,
			default: false
		},
		autoplaySpeed: {
			type: Number,
			default: 2000
		},
		dots: {
			type: String,
			default: "inside"
		},
		radiusDot: {
			type: Boolean,
			default: false
		},
		trigger: {
			type: String,
			default: "click"
		},
		arrow: {
			type: String,
			default: "hover"
		},
		easing: {
			type: String,
			default: "ease"
		},
		value: {
			type: Number,
			default: 0
		}
	},
	data: function() {
		return { currentIndex: this.value };
	},
	methods: {
		changeHandle(oldValue, value) {
			this.$emit("on-change", oldValue, value);
			this.$emit("input", value);
		}
	}
};
</script>
<style scoped lang="less" src="./theme.less"></style>
