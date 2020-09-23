<template>
  <view class="container">
    <!-- 搜索框 -->
    <search></search>
    <!-- 轮播图 -->
    <view class="banner">
      <swiper
        indicator-dots
        indicator-color="#ccccc"
        indicator-active-color="#EA4350"
        autoplay
        current="0"
        interval="3000"
        circular
      >
        <swiper-item class="banner-img banner-items" v-for="item in carousel" :key="item.goods_id">
          <navigator
            :open-type="item.open_type"
            :url="item.navigator_url"
            @tap="handleTapOnBanner(item.navigator_url)"
            animationType="pop-in"
          >
            <image class="banner-img" mode="widthFix" :src="item.image_src" />
          </navigator>
        </swiper-item>
      </swiper>
    </view>
    <!-- 图标导航 -->
    <view class="pagination">
      <navigator
        v-for="item in categoryList"
        :key="item.name"
        :open-type="item.open_type"
        :url="item.navigator_url"
        @tap="handleTapOnCategory(item.navigator_url)"
      >
        <image class="icons" :src="item.image_src" />
      </navigator>
    </view>
    <!-- 时尚女装 -->
    <view class="adv" v-for="(item,index) in floorList" :key="index">
      <!-- 标题图片 -->
      <view class="adv-title">
        <image mode="widthFix" :src="item.floor_title.image_src" />
      </view>
      <view class="adv-content">
        <view class="adv-left">
          <navigator
            class="left-nav"
            :open-type="item.product_list[0].open_type"
            :url="item.product_list[0].navigator_url"
            @tap="handleTapOnFloor(item.product_list[0].navigator_url)"
          >
            <image
              @tap="handler(item.product_list[0].navigator_url)"
              mode="heightFix"
              class="left-img"
              :src="item.product_list[0].image_src"
              :style="{width:item.product_list[0].image_width}"
            />
          </navigator>
        </view>
        <view class="adv-right">
          <navigator
            class="adv-nav"
            :open-type="item.product_list[1].open_type"
            :url="item.product_list[1].navigator_url"
            @tap="handleTapOnFloor(item.product_list[0].navigator_url)"
          >
            <image class="right-img" :src="item.product_list[1].image_src" />
          </navigator>
          <navigator
            class="adv-nav"
            :open-type="item.product_list[2].open_type"
            :url="item.product_list[2].navigator_url"
            @tap="handleTapOnFloor(item.product_list[0].navigator_url)"
          >
            <image class="right-img" :src="item.product_list[2].image_src" />
          </navigator>
          <navigator
            class="adv-nav"
            :open-type="item.product_list[3].open_type"
            :url="item.product_list[3].navigator_url"
            @tap="handleTapOnFloor(item.product_list[0].navigator_url)"
          >
            <image class="right-img" :src="item.product_list[3].image_src" />
          </navigator>
          <navigator
            class="adv-nav"
            :open-type="item.product_list[4].open_type"
            :url="item.product_list[4].navigator_url"
            @tap="handleTapOnFloor(item.product_list[0].navigator_url)"
          >
            <image class="right-img" :src="item.product_list[4].image_src" />
          </navigator>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import search from "@/components/search/index.vue";
export default {
  data() {
    return {
      //轮播图数据
      carousel: [],
      //分类
      categoryList: [],
      //楼层
      floorList: [],
      floorContent: [],
    };
  },
  components: {
    search,
  },
  onLoad() {
    //轮播图
    this.renderCarousel();
    //分类
    this.renderCategory();
    //楼层
    this.renderFloor();
  },
  methods: {
    handler(val) {
      console.log(val);
    },
    //轮播图
    renderCarousel() {
      uni.request({
        url: "https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata",
        success: (res) => {
          //   this.setData({carousel:res.data.message})
          this.carousel = res.data.message;
        },
      });
    },
    //分类
    renderCategory() {
      uni.request({
        url: "https://api-hmugo-web.itheima.net/api/public/v1/home/catitems",
        success: (res) => {
          this.categoryList = res.data.message;
        },
      });
    },
    //楼层
    renderFloor() {
      uni.request({
        url: "https://api-hmugo-web.itheima.net/api/public/v1/home/floordata",
        success: (res) => {
          this.floorList = res.data.message;
        },
      });
    },
    //点击轮播图
    handleTapOnBanner(url) {
      uni.navigateTo({
        url: url,
      });
    },
    //点击分类
    handleTapOnCategory(url) {
      console.log(url);
      uni.navigateTo({
        url: url,
      });
    },
    handleTapOnFloor(url) {
      console.log(url);
      url = url.replace("/pages/goods_list", "/pages/goods_list/index");
      console.log(url);
      uni.navigateTo({
        url: url,
      });
    },
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
/*导航区*/
.pagination {
  height: 140rpx;
  display: flex;
  justify-content: space-around;
  padding: 10rpx;
  margin-bottom: 43rpx;
}
.pagination .icons {
  width: 128rpx;
  height: 140rpx;
}

/*广告区*/
.adv {
  width: 100%;
  height: 485rpx;
}
.adv .adv-title {
  height: 59rpx;
  margin-bottom: 10rpx;
}
.adv .adv-title image {
  height: 100%;
}
.adv .adv-content {
  height: 386rpx;
  margin: 0 10rpx;
  display: flex;
  justify-content: left;
}
.adv .adv-left {
  width: 232rpx;
  height: 100%;
}
.adv .left-nav {
  width: 100%;
  height: 100%;
}
.adv .adv-left image {
  width: 100%;
  height: 100%;
}

.adv .adv-right {
  margin-left: 15rpx;
  height: 100%;
  display: flex;
  justify-content: left;
  flex-wrap: wrap;
}
.adv .adv-right image {
  width: 232rpx;
  height: 188rpx;
  margin-right: 10rpx;
  margin-bottom: 10rpx;
}
</style>
