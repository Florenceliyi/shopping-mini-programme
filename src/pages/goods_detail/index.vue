<template>
  <view class="container">
    <!-- 广告轮播图 -->
    <view class="banner">
      <!-- 轮播图 -->
      <swiper
        class="swiper"
        indicator-dots
        indicator-color="#ccccc"
        indicator-active-color="#EA4350"
        duration="300"
      >
        <swiper-item v-for="item in bannerList" :key="item.goods_id">
          <image :src="item.pics_sma" />
        </swiper-item>
      </swiper>
      <!-- 价格信息 -->
      <view class="des">
        <view class="price">{{goodsDes.goods_price}}</view>
        <view class="icons">
          <button plain>
            <i class="iconfont icon-zhuanfa:before"></i>
          </button>
          <button plain>
            <i class="iconfont icon-shoucang:before"></i>
          </button>
        </view>
      </view>
      <view class="title">{{goodsDes.goods_name}}</view>
    </view>
    <!-- 图文详情 -->
    <view class="goods-detail">
      <view class="line lf-line"></view>
      <view class="line rg-line"></view>
      <view class="pics">图文详情</view>
      <rich-text class="goods-des" :nodes="goodsDes.goods_introduce"></rich-text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      bannerList: [],
      goodsDes: {},
    };
  },
  onLoad(options) {
    this.renderPage(options);
  },
  methods: {
    renderPage(options) {
      uni.request({
        url: "https://api-hmugo-web.itheima.net/api/public/v1/goods/detail",
        data: { ...options },
        success: (res) => {
          console.log(res);
          this.bannerList = res.data.message.pics;
          console.log(res.data.message.pics);
          this.goodsDes = res.data.message;
        },
      });
    },
  },
};
</script>

<style lang='scss'>
.container {
  padding: 0 37.9rpx 0 33rpx;
  /*轮播图*/
  .banner {
    width: 100%;
    height: 717rpx;
    swiper {
      width: 100%;
      height: 497rpx;
      swiper-item {
        width: 100%;
        height: 100%;
        text-align: center;
        image {
          width: 497rpx;
          height: 497rpx;
        }
      }
    }
  }
  /*商品详细*/
  .des {
    width: 100%;
    margin-bottom: 20rpx;
    display: flex;
    justify-content: space-between;
    margin-top: 20rpx;
    .price {
      font-family: PingFangSC-Medium;
      font-size: 36rpx;
      color: #ea4350;
      &::before {
        content: "￥";
        font-size: 25rpx;
      }
    }
    .icons {
      display: flex;
      button {
        border: none;
      }
    }
  }
  .title {
    width: 100%;
    height: 84rpx;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .goods-detail {
    width: 100%;
    padding-top: 33rpx;
    position: relative;
    .line {
      position: absolute;
      top: 53rpx;
      width: 220rpx;
      height: 2rpx;
      background: #ccc;
    }
    .lf-line {
      left: 15rpx;
    }
    .rg-line {
      right: 10rpx;
    }
    .pics {
      width: 100%;
      text-align: center;
      font-family: PingFangSC-Medium;
      font-size: 28rpx;
    }
  }
}
</style>