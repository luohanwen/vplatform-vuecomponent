import vuiCarousel from "./src/components/widgets/vui-carousel";
import vuiCarouselItem from "./src/components/widgets/vui-carousel-item";
import vue from "vue";
vue.component(vuiCarousel.name, vuiCarousel);
vue.component(vuiCarouselItem.name, vuiCarouselItem);
export default { vuiCarousel, vuiCarouselItem };
