<template>
  <view class="container">
    <!-- 搜索框 -->
    <view class="search">
      <icon type="search" size="25rpx"></icon>
      <input
        focus
        adjust-position
        confirm-type="search"
        type="text"
        placeholder="输入商品名"
        v-model="inputVal"
        v-fous
      />
      <button @tap="tapOnSearch">搜索</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      inputVal: "",
      list: [],
    };
  },
  onLoad() {
    this.renderSearchList();
  },
  methods: {
    tapOnSearch() {},
    async renderSearchList() {
      const res = await this.$request({
        url: "/goods/detail",
      });
      console.log("搜索返回的数据");
      console.log(res);
    },
  },
};
</script>

<style lang="less">
.container {
  padding: 10rpx 12rpx 0 15rpx;
  .search {
    display: flex;
    position: relative;
    icon {
      position: absolute;
      left: 20rpx;
      font-size: 20rpx;
      top: 50%;
      transform: translateY(-50%);
    }
    input {
      width: 75%;
      height: 61rpx;
      background: #e7e7e7;
      border-radius: 27rpx;
      padding-left: 57rpx;
      font-size: 25rpx;
    }
    button {
      display: inline-block;
      width: 13%;
      height: 61rpx;
      font-family: PingFangSC-Medium;
      font-size: 25rpx;
      color: #ffffff;
      background: var(--color, blue);
      border-radius: 8rpx;
      padding: 0;
    }
  }
}
</style>
