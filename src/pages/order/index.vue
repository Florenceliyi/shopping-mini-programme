<template>
  <view class="order">
    <!-- tab栏 -->
    <view class="tab">
      <view
        class="tab-item"
        v-for="(item, index) in tabList"
        :key="index"
        :class="currentIndex == index ? 'active' : ''"
        @tap="handleTabClick(index)"
        >{{ item }}</view
      >
    </view>

    <!-- 订单列表 -->
    <view class="orderList">
      <view class="order-item" v-for="item in orderList" :key="item.order_id">
        <view class="same order-number">
          <view class="order-detail">订单编号</view>
          <view class="order-info">{{ item.order_number }}</view>
        </view>
        <view class="same order-price">
          <view class="order-detail">订单金额</view>
          <view class="order-info">{{ item.order_price }}</view>
        </view>
        <view class="same order-date">
          <view class="order-detail">订单日期</view>
          <view class="order-info">{{ item.create_time | timeFormart }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentIndex: 0,
      tabList: ["全部", "待付款", "待发货"],
      orderList: [],
    };
  },
  filters: {
    timeFormart(val) {
      let date = new Date(val * 1000);

      //根据本地时间把 Date 对象的日期部分转换为字符串:
      const date1 = date.toLocaleDateString();
      //根据本地时间把 Date 对象的时间部分转换为字符串：
      const date2 = date.toLocaleTimeString().replace(/[\u4e00-\u9fa5]/g, "");
      return date1 + " " + date2;
    },
  },
  computed: {
    timeFormart() {
      this.orderList.map((v) => {
        let sec = parseInt(v.create_time / 1000);
        let min = parseInt(sec / 60);
        let hour = parseInt(min / 24);
      });
    },
  },
  onLoad(options) {
    if (options.currentIndex == 0) {
      this.currentIndex = 1;
    } else if (options.currentIndex == 1) {
      this.currentIndex = 2;
    } else if (options.currentIndex == 3) {
      this.currentIndex = 0;
    }
    this.getHistoryOrder();
  },
  onShow() {
    this.getHistoryOrder();
    this.timeFormart;
  },
  methods: {
    //tab栏切换
    handleTabClick(index) {
      //当前点击的tab栏索引
      this.currentIndex = index;
      this.getHistoryOrder();
    },
    //获取历史订单查询；
    async getHistoryOrder() {
      //获取请求前需要的参数
      const user = uni.getStorageSync("token");

      const backData = await this.$request({
        url: "/my/orders/all",

        data: { type: this.currentIndex + 1 },
      });
      console.log(backData);
      this.orderList = backData.orders;
    },
  },
};
</script>

<style lang='less'>
.order {
  height: 100vh;

  /*tab栏*/
  .tab {
    width: 100%;
    line-height: 88rpx;
    display: flex;
    justify-content: space-evenly;
    position: relative;
    .tab-item {
      width: 184rpx;
      height: 100%;
      color: #666;
      text-align: center;
      &.active {
        color: #000;
        border-bottom: 2px solid #ea4350;
        font-weight: 600;
      }
    }
  }
  /*订单列表*/
  .orderList {
    width: 100%;
    background: #e7e7e7;
    .order-item {
      padding: 30rpx 30rpx 0 32rpx;
      box-sizing: border-box;
      width: 100%;
      height: 250rpx;
      background: #fff;
      margin-bottom: 10rpx;
      color: #666;
      .same {
        display: flex;
        justify-content: space-between;
        line-height: 63rpx;
      }
    }
  }
}
</style>