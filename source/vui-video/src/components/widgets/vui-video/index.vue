<template>
	<div>
		<video
			id="example_video_1"
			class="video-js vui-video"
			:controls="controls"
			:width="width"
			:height="height"
			:poster="poster"
			:autoplay="autoplay"
			:loop="loop"
            preload="auto"
			data-setup="{&quot;language&quot;:&quot;zh-CN&quot;}"
		>
			<source src="http://vjs.zencdn.net/v/oceans.mp4?a=1" type="video/mp4" />
			<p class="vjs-no-js">
				To view this video please enable JavaScript, and consider
				upgrading to a web browser that
				<a
					href="http://videojs.com/html5-video-support/"
					target="_blank"
					>supports HTML5 video</a
				>
			</p>
		</video>
		<vui-button @click="play">play</vui-button>
		<vui-button @click="pause">pause</vui-button>
		<vui-button @click="requestFullscreen">requestFullscreen</vui-button>
	</div>
</template>
<script>
import videojs from "videojs-ui-lib/dist/resource/video.min.js";
import lang_zh_CN from "./lang/zh-CN.json";
export default {
	name: "vui-video",
	props: {
		widgetCode: {
			type: String,
			default: "vui-video"
		},
		autoplay: {
			type: Boolean,
			default: false
		},
		controls: {
			type: Boolean,
			default: true
		},
		loop: {
			type: Boolean,
			default: false
		},
		volume: {
			type: Number,
			default: 0.5
		},
		height: {
			type: String,
			default: "360px"
		},
		width: {
			type: String,
			default: "640px"
		},
		fullscreen: {
			type: Boolean,
			default: false
		},
		label: {
			type: String,
			default: ""
		},
		notSupportedMsg: {
			type: String,
			default: "目前无法播放视频源"
		},
		showLabel: {
			type: Boolean,
			default: true
		},
		transfer: {
			type: Boolean,
			default: false
		},
		miniPlayer: {
			type: Boolean,
			default: false
		},
		poster: {
			type: String
		}
	},
	data: function() {
		return {
			videojsEl: null
		};
    },
    created() {
        let notSupportedMsg = this.notSupportedMsg;
        if(notSupportedMsg){
            lang_zh_CN["The media could not be loaded, either because the server or network failed or because the format is not supported."] = notSupportedMsg;
        }
        videojs.addLanguage("zh-CN", lang_zh_CN);

    },
	mounted() {
		let self = this;
		let player = (this.videojsEl = videojs(
			"example_video_1",
			{
				controlBar: {}
			},
			function() {
				console.log("onPlayerReady");
				this.on("play", function() {
					self.$emit("on-play");
				});
				this.on("pause", function() {
					self.$emit("on-pause");
				});
				this.on("ended", function() {
					self.$emit("on-ended");
				});
			}
		));
		player.volume(this.volume);
	},
	methods: {
		play() {
			this.videojsEl.play();
		},
		pause() {
			this.videojsEl.pause();
		},
		requestFullscreen() {
			this.videojsEl.requestFullscreen();
		}
	},
	render(h) {
		return h();
	}
};
</script>
<style lang="less" src="./theme.less">
@import "videojs-ui-lib/dist/resource/video-js.min.css";
</style>
