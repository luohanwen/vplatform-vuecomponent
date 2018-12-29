<template>
  <div>
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
        data-setup="{&quot;language&quot;:&quot;zh-CN&quot;}"
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
      required:true
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
    }
  },
  data: function() {
    return {
      videojsEl: null,
      isShowMiniPlayer: false,
      hideMini: false,
      firstInitDrag: true,
      dragIns: null
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
    src(val, oldValue) {
      console.log("src", val);
      this.changeSrc(val);
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
  mounted() {
    this.init();
    this.bindScroll();
    this.dragIns = drag($(`#${this.containerId}`));
  },
  methods: {
    init() {
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
    },
    // 添加上一集下一集
    handlePreAndNext() {
      $(
        '<div class="vjs-control vui-video-skip"><i class="vui-pre ivu-icon ivu-icon-ios-skipbackward"></i><i class="vui-next ivu-icon ivu-icon-ios-skipbackward"></i></span>'
      ).insertAfter(".vjs-play-control");
      $(`#${this.containerId}`).on("click",".vui-pre", () => {
        this.$emit("on-pre");
      });

      $(`#${this.containerId}`).on("click",".vui-next", () => {
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
    bindScroll() {
      let self = this;
      if (this.isPc && this.miniPlayer) {
        let $win = $(window);
        let $target = $(`#${this.containerId}`);
        let offsetTop = $target.offset().top;
        let height = $target.outerHeight();
        let scrollTop;
        let playStatus;
        $win.scroll(function() {
          scrollTop = $(this).scrollTop();
          playStatus = !self.videojsEl.paused();
          //视频不在可见区域
          if (scrollTop > offsetTop + height - 10) {
            if (playStatus) {
              $target.addClass("vui-mini-player");
              self.isShowMiniPlayer = true;
              self.dragIns.initDrag();
              self.$nextTick(() => {
                if (self.firstInitDrag) {
                  self.firstInitDrag = false;
                }
              });
              //mini模式
              $target.css({ position: "fixed" });
            }
          } else {
            $target.removeClass("vui-mini-player");
            self.isShowMiniPlayer = false;
            self.hideMini = false;
            //清除mini模式拖拽后的影响
            $target.css({ position: "static" });
            self.dragIns.destroyDrag();
          }
        });
      }
    },
    play() {
      this.videojsEl.play();
    },
    pause() {
      this.videojsEl.pause();
    },
    requestFullscreen() {
      this.videojsEl.requestFullscreen();
    },
    closeMini() {
      this.hideMini = true;
    },
    changeSrc(src) {
      this.videojsEl.src(src);
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
