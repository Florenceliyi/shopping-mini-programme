<template>
  <view class="category">
    <!-- 搜索框 -->
    <search></search>
  </view>
</template>

<script>
import search from "@/components/search/index.vue";
export default {
  components: {
    search,
  },
};
</script>

<style lang='scss'>
/*轮播图*/
.banner {
  width: 100%;
  height: 340rpx;
  margin-bottom: 15rpx;
}
.banner swiper {
  width: 100%;
  height: 340rpx;
}
.banner-items {
  height: 340rpx;
}
.banner-img {
  width: 100%;
  height: 100%;
}
</style>