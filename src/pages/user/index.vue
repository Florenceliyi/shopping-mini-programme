<template>
  <view class="user-container">
    <!-- 头像 -->
    <view class="user-profile">
      <image mode="center" class="outside" :src="userInfo.avatarUrl" />
      <view class="img">
        <image class="inside" :src="userInfo.avatarUrl" />
        <view class="name">{{ userInfo.nickName }}</view>
      </view>
    </view>
    <view class="bottom">
      <!-- 图标按钮 -->
      <view class="content">
        <view
          class="goods-con"
          v-for="(item, index) in iconList"
          :key="item.id"
          @tap="tapOnIcons(index)"
          :class="currentIndex == index ? 'active' : ''"
        >
          <i :class="item.class"></i>
          <view class="letter">{{ item.des }}</view>
        </view>
      </view>
      <!-- 选项栏 -->
      <view class="select">
        <view class="item" @tap="getContact">
          <i class="iconfont icon-kefu:before"></i>
          <view class="cat">联系客服</view>
          <block class="aside">
            <view class="tel">400-100-100</view>
          </block>
        </view>
        <view class="item" @tap="jumpToFeedbackPage">
          <i class="iconfont .icon-fankui:before"></i>
          <view class="cat">意见反馈</view>
          <block class="aside">
            <view class="tel"></view>
          </block>
        </view>
        <view class="item">
          <i class="iconfont icon-banben:before"></i>
          <view class="cat">当前版本</view>
          <block class="aside">
            <view class="tel">v3.1.4</view>
          </block>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      //渲染图标的数组
      iconList: [
        {
          id: 1,
          class: "iconfont .icon-icon-test:before",
          des: "待付款",
        },
        {
          id: 2,
          class: "iconfont icon-daishouhuo:before",
          des: "待发货",
        },
        {
          id: 3,
          class: "iconfont icon-tuihuo:before",
          des: "退货/退款",
        },
        {
          id: 4,
          class: "iconfont icon-quanbudingdan01:before",
          des: "全部订单",
        },
      ],
      currentIndex: null,
      userInfo: {},
    };
  },
  onLoad() {
    //加载本地的用户数据
    console.log("加载本地的用户数据");
    const userInfo = uni.getStorageSync("currentUser");
    this.userInfo = userInfo;
  },
  methods: {
    //点击icons
    tapOnIcons(index) {
      this.currentIndex = index;
      uni.navigateTo({
        url: "/pages/order/index?currentIndex=" + index,
      });
    },
    //联系客服电话
    getContact() {
      wx.makePhoneCall({
        phoneNumber: "400-100-100",
      });
    },
    //跳转反馈页
    jumpToFeedbackPage() {
      uni.navigateTo({
        url: "/pages/feedback/index",
      });
    },
  },
};
</script>

<style lang='less'>
.user-container {
  background: #f9f9f9;
  height: 100vh;
  .user-profile {
    width: 100%;
    height: 329rpx;
    position: relative;
    overflow: hidden;
    .outside {
      width: 750rpx;
      height: 100%;
      position: absolute;
      transform: scale(2);
      //   filter: blur(10px);
      filter: blur(14px);
    }
    .img {
      width: 172rpx;
      position: absolute;
      left: 50%;
      top: 15%;
      transform: translateX(-50%);
      .inside {
        width: 172rpx;
        height: 172rpx;
        border-radius: 50%;
      }
      .name {
        font-size: 25rpx;
        text-align: center;
        color: #fff;
      }
    }
  }
  .bottom {
    padding: 20rpx 15rpx 0 15rpx;
    .content {
      width: 100%;
      height: 145rpx;
      display: flex;
      justify-content: space-evenly;
      text-align: center;
      .goods-con {
        width: 140rpx;
        height: 120rpx;
        margin-top: 30rpx;
        &.active {
          color: #ea4350;
        }
        i {
          font-size: 60rpx;
          margin-bottom: 20rpx;
        }
        .letter {
          font-family: PingFangSC-Regular;
          font-size: 26rpx;
        }
      }
    }
    /*选项*/
    .select {
      padding: 40rpx;
      .item {
        width: 100%;
        height: 100rpx;
        font-family: PingFangSC-Regular;
        font-size: 26rpx;
        display: flex;
        align-items: center;
        position: relative;
        border-bottom: 1px solid #c8c8c8;
        i {
          width: 10%;
          font-size: 40rpx;
        }
        .tel {
          position: absolute;
          right: 20rpx;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
}
</style>