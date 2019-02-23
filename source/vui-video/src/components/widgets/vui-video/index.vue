<template>
    <div v-if="videojsInited" :style="wrapperStyle">
        <div
            :class="['vui-video-container',{'vui-video-mobile':!isPc}]"
            :style="styles"
            :id="containerId"
            v-show="!hideVideo"
        >
            <p
                class="vui-title"
                v-if="showTitle"
            >{{label}}</p>
            <div
                class="vui-video-operate"
                v-show="isShowMiniPlayer"
            >
                <Icon type="drag"></Icon>
                <Icon
                    type="close"
                    @click.native="closeMini"
                ></Icon>
            </div>
            <video
                :id="widgetCode"
                class="video-js vui-video"
                :controls="controls"
                :poster="poster"
                :autoplay="autoplay"
                :loop="loop"
                preload="auto"
                muted="muted"
                data-setup='{"language":"zh-CN"}'
            >
                <source
                    :src="src"
                    :type="videoType"
                />
                <p class="vjs-no-js">
                    To view this video please enable JavaScript, and consider
                    upgrading to a web browser that
                    <a
                        href="http://videojs.com/html5-video-support/"
                        target="_blank"
                    >supports HTML5 video</a>
                </p>
            </video>
        </div>
        <!-- 用来占位 -->
        <div
            :style="styles"
            v-show="hideVideo"
        ></div>
    </div>
</template>
<script>
import videojs from "videojs-ui-lib/dist/resource/video.min.js";
import lang_zh_CN from "./lang/zh-CN.json";
import drag from "./utils/drag";
window.videojs = videojs;
require("./plugins/videojs-resolution-switcher/videojs-resolution-switcher");
require("./plugins/videojs-resolution-switcher/videojs-resolution-switcher.css");

export default {
    name: "vui-video",
    props: {
        widgetCode: {
            type: String,
            default: "vui-video",
            required: true
        },
        src: {
            type: String,
            default: ""
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
        },
        scrollEl: {
            type: [Window, String],
            default: () => window
        }
    },
    data: function() {
        return {
            videojsEl: null,
            isShowMiniPlayer: false,
            hideMini: false,
            firstInitDrag: true,
            dragIns: null,
            playOver: true, //播放操作完毕
            videojsInited: false //初始化完毕
        };
    },
    computed: {
        videoType() {
            let src = this.src;
            if (!src) return "";
            let match = src.split("?")[0].split(".");
            return `video/${match[match.length - 1]}`;
        },
        styles() {
            return {
                width: this.width,
                height: this.height
            };
        },
        wrapperStyle(){
            return {
                height:this.height
            };
        },
        containerId() {
            return `${this.widgetCode}-container`;
        },
        hideVideo() {
            //迷你模式并且点击了关闭才隐藏vidoe
            return this.miniPlayer && this.hideMini;
        },
        showTitle() {
            return this.showLabel && this.label && !this.isShowMiniPlayer;
        },
        isPc() {
            return !navigator.userAgent.match(/mobile/i);
        }
    },
    watch: {
        src: {
            handler(val) {
                if (val) {
                    if (!this.videojsInited) {
                        this.videojsInited = true;
                        this.$nextTick(function() {
                            this.init();
                        });
                    } else {
                        this.changeSrc(val);
                    }
                }
            },
            immediate: true
        },
        miniPlayer(val){
            this.initMiniplay();
        }
    },
    created() {
        let notSupportedMsg = this.notSupportedMsg;
        if (notSupportedMsg) {
            lang_zh_CN[
                "The media could not be loaded, either because the server or network failed or because the format is not supported."
            ] = notSupportedMsg;
        }
        videojs.addLanguage("zh-CN", lang_zh_CN);
    },
    mounted() {},
    methods: {
        init() {
            console.log("init");
            let self = this;
            let player = (this.videojsEl = videojs(
                this.widgetCode,
                {
                    plugins: {
                        videoJsResolutionSwitcher: {
                            default: "low", // Default resolution [{Number}, 'low', 'high'],
                            dynamicLabel: true
                        }
                    },
                    controlBar: {
                        children: [
                            {
                                name: "playToggle"
                            },
                            {
                                name: "currentTimeDisplay"
                            },
                            {
                                name: "timeDivider"
                            },
                            {
                                name: "durationDisplay"
                            },
                            {
                                name: "progressControl"
                            },
                            {
                                name: "playbackRateMenuButton",
                                playbackRates: [0.5, 1, 1.25, 1.5, 2]
                            },
                            {
                                name: "volumePanel",
                                inline: false
                            },
                            {
                                name: "fullscreenToggle"
                            }
                        ]
                    }
                },
                function() {
                    this.on("play", function() {
                        self.$emit("on-play");
                    });
                    this.on("pause", function() {
                        self.$emit("on-pause");
                    });
                    this.on("ended", function() {
                        self.$emit("on-ended");
                    });

                    var player = this;
                    window.player = player;

                    self.handelResolution();
                    self.handlePreAndNext();
                }
            ));
            player.volume(this.volume);

            this.dragIns = drag($(`#${this.containerId}`));
            
            this.initMiniplay();
        },
        // 添加上一集下一集
        handlePreAndNext() {
            $(
                '<div class="vjs-control vui-video-skip"><i class="vui-pre ivu-icon ivu-icon-ios-skipbackward"></i><i class="vui-next ivu-icon ivu-icon-ios-skipbackward"></i></span>'
            ).insertAfter(".vjs-play-control");
            $(`#${this.containerId}`).on("click", ".vui-pre", () => {
                this.$emit("on-pre");
            });

            $(`#${this.containerId}`).on("click", ".vui-next", () => {
                this.$emit("on-next");
            });
        },
        // 添加清晰度
        handelResolution() {
            let self = this;
            player.updateSrc([
                {
                    src: self.src,
                    type: self.videoType,
                    label: "标清",
                    res: 360
                },
                {
                    src: self.src,
                    type: self.videoType,
                    label: "高清",
                    res: 720
                }
            ]);

            //已经把清晰度切换组件里的点击事件去掉了，这里自己实现点击效果，切换清晰度时通知外面让调用方处理清晰度
            $(".vjs-resolution-button")
                .find(".vjs-menu-item")
                .unbind("click")
                .bind("click", function(event) {
                    let $target = $(event.currentTarget || event.target);
                    let $show = $(`#${self.containerId}`).find(
                        ".vjs-resolution-button-label"
                    );
                    let resolution = $target.find(".vjs-menu-item-text").text();
                    let nowResolution = $show.text();
                    if (resolution != nowResolution) {
                        $show.html(resolution);
                        $target.siblings().removeClass("vjs-selected");
                        $target.addClass("vjs-selected");
                        self.$emit("on-resolution-change", resolution);
                    }
                });
        },
        initMiniplay() {
            let $target = $(`#${this.containerId}`);
            let $controls = $target.find(".vjs-control-bar");
            let $vjsTech = $(".vjs-tech");
            if (this.isPc) {
                if (this.miniPlayer) {
                    $target.addClass("vui-mini-player");
                    this.isShowMiniPlayer = true;
                    this.dragIns.initDrag();
                    this.$nextTick(() => {
                        if (this.firstInitDrag) {
                            this.firstInitDrag = false;
                        }
                    });
                    //mini模式
                    $target.css({ position: "fixed" });

                    //隐藏控制条
                    $controls.addClass("hide");

                    //点击屏幕不播放/暂停
                    $vjsTech.addClass("noneEvents");
                } else {
                    $target.removeClass("vui-mini-player");
                    this.isShowMiniPlayer = false;
                    this.hideMini = false;
                    //清除mini模式拖拽后的影响
                    $target.css({ position: "static" });
                    this.dragIns.destroyDrag();

                    //显示控制条
                    $controls.removeClass("hide");

                    //去除点击屏幕不播放/暂停限制
                    $vjsTech.removeClass("noneEvents");
                }
            }
        },
        play() {
            if (this.videojsEl) {
                this.playOver = false;
                let playPromise = this.videojsEl.play();
                playPromise
                    .then(() => {
                        this.playOver = true;
                    })
                    .catch(() => {
                        this.playOver = true;
                    });
            }
        },
        pause() {
            if (this.playOver) {
                this.videojsEl && this.videojsEl.pause();
            }
        },
        requestFullscreen() {
            this.videojsEl && this.videojsEl.requestFullscreen();
        },
        closeMini() {
            this.hideMini = true;
        },
        changeSrc(src) {
            let vEl = this.videojsEl;
            if (vEl) {
                vEl.src(src);
                vEl.play();
            }
        }
    }
};
</script>
<style lang="less" src="./theme.less">
@import "videojs-ui-lib/dist/resource/video-js.min.css";
</style>
