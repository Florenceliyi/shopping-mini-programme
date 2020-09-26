<template>
  <block>
    <view class="gl-content" @tap="jumpToGoodsDetail(item.goods_id)">
      <image :src="item.goods_small_logo || '/static/product_low.png'" />
      <view class="gl-right">
        <view class="gl-title">{{item.goods_name}}</view>
        <view class="gl-price">{{item.goods_price}}</view>
      </view>
    </view>
  </block>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    //跳转商品详情页
    jumpToGoodsDetail(url) {
      uni.navigateTo({
        url: "/pages/goods_detail/index?goods_id=" + url,
      });
    },
  },
};
</script>

<style lang="less">
.gl-content {
  width: 698rpx;
  height: 209rpx;
  display: flex;
  padding: 26rpx 0 9rpx 15rpx;
  image {
    width: 191rpx;
    height: 191rpx;
  }
  .gl-right {
    width: 463rpx;
    height: 100%;
    margin-left: 30rpx;
    font-size: 24rpx;
    .gl-title {
      width: 100%;
      font-family: PingFangSC-Regular;
      letter-spacing: 0;
    }
    .gl-price {
      color: #ea4350;
      margin-top: 60rpx;
      &::before {
        content: "￥";
        font-size: 20rpx;
      }
    }
  }
}
</style>