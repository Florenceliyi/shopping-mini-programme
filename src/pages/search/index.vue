<template>
  <view class="container">
    <!-- 搜索框 -->
    <view class="search">
      <icon type="search" size="25rpx"></icon>
      <input
        adjust-position
        confirm-type="search"
        type="text"
        placeholder="输入商品名"
        @input="handlekeyOnInput"
        @focus="handleFocus"
        v-model="inputVal"
      />
      <button @tap="tapOnSearch">搜索</button>
    </view>
    <!-- 商品关键字展示框 -->
    <view scroll-y class="keywords" v-show="keywordShow">
      <view class="key-item">
        <view
          class="goods"
          v-for="(item, index) in keywordList"
          :key="item.goods_id"
        >
          <view
            class="item"
            :class="currentIndex == index ? 'active' : ''"
            @tap="tapInKeywordsArea(index)"
            >{{ item.goods_name }}</view
          >
        </view>
      </view>
    </view>
    <!-- 商品列表展示 -->
    <view class="list">
      <goods
        class="goods-item"
        v-for="item in showList"
        :key="item.goods_id"
        :item="item"
      ></goods>
    </view>
  </view>
</template>

<script>
import goods from "@/components/goods/goods.vue";
export default {
  components: {
    goods,
  },
  data() {
    return {
      inputVal: "",
      list: [],
      timerId: null,
      keywordList: [],
      currentIndex: null,
      keywordShow: false,
      showList: [],
    };
  },
  onLoad() {},
  methods: {
    //点击搜索
    async tapOnSearch() {
      const res = await this.$request({
        url: "/goods/search",
        data: { query: this.inputVal },
      });
      this.showList = res.goods;
      console.log(res);
    },

    //输入框触发
    async handlekeyOnInput() {
      this.keywordShow = true;
      //进来清除上一次开启的定时器；
      clearTimeout(this.timerId);
      this.timerId = setTimeout(async () => {
        this.showList = [];
        const res = await this.$request({
          url: "/goods/qsearch",
          data: { query: this.inputVal },
        });
        this.keywordList = res;
      }, 1000);
    },
    //鼠标点击关键字区域
    tapInKeywordsArea(index) {
      this.showList = [];
      this.currentIndex = index;
      //不显示当前关键字列表
      this.keywordShow = false;

      this.inputVal = this.keywordList[index].goods_name.substr(0, 10);
    },
    renderSearchList() {},
  },
};
</script>

<style lang="less">
.container {
  padding: 10rpx 12rpx 0 15rpx;
  box-sizing: border-box;
  .search {
    width: 100%;

    box-sizing: border-box;
    display: flex;
    position: fixed;
    height: 61rpx;
    icon {
      position: absolute;
      left: 20rpx;
      font-size: 20rpx;
      top: 50%;
      transform: translateY(-50%);
    }
    input {
      width: 70%;
      height: 61rpx;
      background: #e7e7e7;
      border-radius: 27rpx;
      padding-left: 57rpx;
      font-size: 25rpx;
      overflow: hidden;
      padding-right: 40rpx;
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
  .keywords {
    width: 100%;
    overflow: auto;
    height: 94vh;
    .key-item {
      line-height: 60rpx;
      color: #666;
      height: cal(100vh - 61rpx);
      overflow: hidden;
      .goods {
        .item {
          font-size: 27rpx;
          line-height: 60rpx;
          padding-left: 30rpx;
          box-sizing: border-box;
          width: 615rpx;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          &.active {
            background: #ea4350;
            color: #ffffff;
          }
        }
      }
    }
  }
  .list {
    margin-top: 61rpx;
  }
}
</style>
