<template>
    <transition name="fade">
        <div
            class="esc"
            v-show="showEscTag"
        >按Esc返回页面</div>
    </transition>
</template>
<script>
import './utils/jquery.fancybox';
import vdk from 'v3-vdk';
export default {
  name: 'vui-photobrowser',
  props: {
    widgetCode: {
      type: String,
      default: 'vui-photobrowser'
    },
    dataSource: {
      type: Array,
      default: () => []
    },
    imgField: {
      type: String
    },
    imgTitleField: {
      type: String
    },
    imgDescField: {
      type: String
    },
    slideShow: {
      type: Boolean,
      default: false
    },
    thumbnails: {
      type: Boolean,
      default: false
    },
    download: {
      type: Boolean,
      default: true
    },
    counter: {
      type: Boolean,
      default: true
    }
  },
  data: function() {
    return {
      firstOpenAfterShow: true,
      showEscTag: false
    };
  },
  computed: {
    //将传进来的数据源转成控件需要的参数格式
    realDataSource() {
      let data = this.dataSource;
      let val = [];
      data.forEach((item) => {
        let newItem = {};
        newItem.src = this.handleImg(item[this.imgField]);
        //缩列图选项，如外面没传，默认取原图
        newItem.thumb = item[this.thumbField] || item[this.imgField];
        newItem.caption = (instance) => {
          let str = '',
            title = item[this.imgTitleField],
            desc = this.handleDesc(item[this.imgDescField]);
          title && (str += `<h3>${title}</h3>`);
          desc && (str += `<p>${desc}</p>`);
          return str;
        };
        val.push(newItem);
      });
      return val;
    }
  },
  beforeDestroy() {
    $.fancybox.destroy();
  },
  methods: {
    open(index = 0) {
      console.log('open');
      let items = this.realDataSource,
        options = this.handleOptions();
      this.firstOpenAfterShow = true;
      $.fancybox.open(items, options, index);
    },
    handleOptions() {
      let options = {
        buttons: ['zoom'],
        //处理左上方技术信息
        infobar: this.counter,
        afterShow: (instance, current) => {
          console.log('afterShow');
          if (this.firstOpenAfterShow) {
            this.firstOpenAfterShow = false;
            this.bindImageClick();
            this.showEsc();
            document.querySelector('.fancybox-container').setAttribute('widget-code', this.widgetCode);
          } else {
            this.onImageChange(current.index);
          }
        },
        clickContent() {}
      };
      //处理右上方工具栏
      this.slideShow && options.buttons.push('slideShow');
      this.download && options.buttons.push('download');
      this.thumbnails && options.buttons.push('thumbs');
      options.buttons.push('close');
      return options;
    },
    // 自己实现绑定图片事件
    bindImageClick() {
      let $imgEl = $('.fancybox-image');
      $imgEl.on('click', (event) => {
        let $target = $(event.currentTarget || event.target),
          $currentFancyboxSlide = $target.parents('.fancybox-slide'),
          index = $currentFancyboxSlide.index('.fancybox-slide'),
          item = this.dataSource[index];
        this.$emit('on-click', item);
      });
    },
    close() {
      $.fancybox.close();
    },
    onImageChange(index) {
      console.log('onImageChange', index);
      let item = this.dataSource[index];
      this.$emit('on-image-change', item);
    },
    handleDesc(desc) {
      if (!desc) return '';
      const clientWidth = document.documentElement.clientWidth;
      const maxLen = Math.floor(clientWidth / 14) * 2 - 12;
      return desc.length > maxLen ? desc.slice(0, maxLen - 3) + '...' : desc;
    },
    handleImg(src) {
      if (/https?/.test(src)) {
        return src;
      } else if (/.(webp|bmp|jpg|png|tif|gif)$/.test(src)) {
        return vdk.v3platform.getSrcPathFromRes(this, src);
      } else {
        return vdk.v3platform.getSrcPathFromId2url(this, src);
      }
    },
    // 显示esc
    showEsc() {
      this.showEscTag = true;
      setTimeout(() => {
        this.showEscTag = false;
      }, 2e3);
    }
  }
};
</script>
<style lang="less" src="./theme.less"></style>
    
