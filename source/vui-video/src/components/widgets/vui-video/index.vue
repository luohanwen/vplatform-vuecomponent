<template>
  <div>
    <div
      class="vui-video-container"
      :style="styles"
      :id="containerId"
      v-show="!hideVideo"
    >
      <p
        class="vui-title"
        v-if="showLabel&&label"
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
      default: "vui-video"
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
                name: "playbackRateMenuButton"
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
          player.updateSrc([
            {
              src: "https://vjs.zencdn.net/v/oceans.mp4?SD",
              type: "video/mp4",
              label: "标清",
              res: 360
            },
            {
              src: "https://vjs.zencdn.net/v/oceans.mp4?HD",
              type: "video/mp4",
              label: "高清",
              res: 720
            }
          ]);
          player.on("resolutionchange", function() {
            console.info("Source changed to %s", player.src());
          });
        }
      ));
      player.volume(this.volume);
    },
    bindScroll() {
      let self = this;
      let isPc = !navigator.userAgent.match(/mobile/i);
      if (isPc && this.miniPlayer) {
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
