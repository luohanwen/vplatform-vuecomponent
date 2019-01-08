import vuiTimeline from './src/components/widgets/vui-timeline';
import vuiTimelineItem from './src/components/widgets/vui-timeline-item';
import vue from 'vue';
vue.component(vuiTimeline.name,vuiTimeline);
vue.component(vuiTimelineItem.name,vuiTimelineItem);
export default {vuiTimeline,vuiTimelineItem};

