<template>
  <view class="header-input">
    <input
      class="weui-input"
      maxlength="15"
      bindinput="bindKeyInput"
      placeholder="搜索"
      @tap="tapOnSearch"
    />
  </view>
</template>

<script>
export default {
  methods: {
    tapOnSearch() {
      uni.navigateTo({
        url: "/pages/search/index",
      });
    },
  },
};
</script>

<style lang='scss'>
/*搜索框*/
.header-input {
  height: 100rpx;
  background: #ea4350;
}
.weui-input {
  margin: 0 auto 10rpx auto;
  padding-top: 10rpx;
  width: 95%;
  height: 90%;
  background: #ffffff;
  border-radius: 5px;
  box-sizing: border-box;
  padding-left: 316rpx;
}
</style>