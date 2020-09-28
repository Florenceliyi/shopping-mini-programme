<template>
  <view class="pay-container">
    <!-- 地址栏 -->
    <view class="userInfo">
      <block v-if="userInfo.name">
        <view class="address">{{ userInfo.address }}</view>
        <text space="emsp" class="user"
          >{{ userInfo.name }} {{ userInfo.phone }}</text
        >
      </block>
      <button
        class="selectAddress"
        v-if="userInfo.name == undefined || userInfo.name == ''"
        @tap="tapOnEditAddress"
      >
        选择地址
      </button>
    </view>
    <!-- 商品栏 -->
    <scroll-view class="goodsList">
      <view class="payList" v-for="item in payList" :key="item.goods_id">
        <goods :item="item"></goods>
        <view class="numbers">x {{ item.goods_count }}</view>
      </view>
    </scroll-view>
    <!-- 结算 -->
    <view class="charge">
      <view class="selectAll">全选</view>
      <view class="totalPrice">合计：</view>
      <view class="number">{{ calAllGoods }}</view>
      <button
        :class="userInfo.name == undefined ? 'no-address payment' : 'payment'"
        @tap="payAllGoods"
        open-type="getUserInfo"
        @getuserinfo="getUserInfo"
      >
        去支付({{ payList.length }})
      </button>
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
      payList: [],
      userInfo: {
        address: "",
        name: "",
        phone: "",
      },
    };
  },
  computed: {
    calAllGoods() {
      let totalPrice = 0;
      this.payList.map((item) => {
        totalPrice += item.goods_count * item.goods_price;
      });
      return totalPrice;
    },
  },
  onLoad() {
    //渲染本地中的用户数据;
    const userInfo = uni.getStorageSync("userInfo");
    if (userInfo.name) {
      this.userInfo = userInfo;
    }
  },
  onShow() {
    const payList = uni.getStorageSync("cartList");
    if (payList != "") {
      this.payList = payList.filter((v) => v.isSelected);
    }
  },
  methods: {
    //支付按钮
    async payAllGoods() {
      //进来前的一些操作，判断用户有否授权，选择地址
      //1.获取发请求前的所有参数;
      const token = uni.getStorageSync("tokenKey");
      const userInfo = uni.getStorageSync("userInfo");
      const arrParms = this.payList.map((v) => {
        return {
          goods_id: v.goods_id,
          goods_number: v.goods_count,
          goods_price: v.goods_price,
        };
      });
      //2.开始创建订单，获取订单编号
      let backData = await this.$request({
        url: "/my/orders/create",
        method: "POST",
        data: {
          order_price: this.calAllGoods,
          consignee_addr: userInfo.address,
          goods: arrParms,
        },
      });
      //订单编号参数
      const orderBackData = backData.order_number;

      //3.预支付订单的请求
      const payment = await this.$request({
        url: "/my/orders/req_unifiedorder",
        method: "POST",
        data: { order_number: orderBackData },
      });
      // console.log(payment);
      const { pay } = payment;

      //4.获取支付二维码
      //4.1获取nuiapp的服务商返回的参数；
      const [err3, obj] = await uni.getProvider({
        service: "payment",
      });
      //4.2获取uniapp的二维码支付接口

      const unicode = await uni
        .requestPayment({
          provider: obj.provider[0],
          orderInfo: orderBackData,
          ...pay,
        })
        .catch((err) => {
          console.log(err);
        });
      /********支付成功，unicode第一项参数返回有值********/
      console.log(unicode);
      // if (unicode[0]) {
      //   console.log("抛出异常");
      //   throw new Error(unicode[0].errMsg);
      // }
      if (unicode[0]) {
        uni.showToast({
          title: "支付失败",
          duration: 2000,
        });
      } else if (unicode[1].errMsg) {
        //6.修改本地缓存中的购物车数据，把已经支付的商品删除；
        let cartList = uni.getStorageSync("cartList");
        cartList = cartList.filter((v) => v.isSelected == false);

        uni.setStorageSync("cartList", cartList);
        //7.跳转到订单页面；
        uni.redirectTo({
          url: "/pages/order/index",
        });
      }
    },
    //编辑个人地址按钮
    tapOnEditAddress() {
      // //若本地有用户信息数据
      // const userInfo = uni.getStorageSync("userInfo");
      uni.chooseAddress({
        success: (res) => {
          console.log(res);
          this.userInfo.address =
            res.provinceName + res.cityName + res.countyName + res.detailInfo;
          this.userInfo.name = res.userName;
          this.userInfo.phone = res.telNumber;
          //缓存到本地
          uni.setStorageSync("userInfo", this.userInfo);
        },
      });
    },
    //获取用户授权
    async getUserInfo(e) {
      //先判断有否选择地址
      const userInfo = uni.getStorageSync("userInfo");
      if (!userInfo.address) {
        uni.showToast({
          title: "先选择地址哦~",
          duration: 2000,
        });
        return;
      }
      console.log(userInfo);
      console.log("用户授权");
      console.log(e);

      //先判断是否有授权,有过授权可以从本地拿到token值；
      const hasToken = uni.getStorageSync("tokenKey");
      if (hasToken) {
      } else {
        //判断用户是否愿意授权
        const res = await uni.showModal({
          title: "提示",
          content: "是否愿意授权用户信息？",
        });

        //用户点击确定
        if (res[1].confirm) {
          // //从参数中获取需要发送给接口的参数
          const res = await this.getUserCode();
          const code = res[1].code;
          const { rawData, signature, encryptedData, iv } = e.detail;

          //存储当前用户的微信信息;
          const {
            nickName,
            gender,
            province,
            city,
            country,
            avatarUrl,
          } = e.detail.userInfo;

          const backData = await this.getUserToken({
            rawData,
            signature,
            encryptedData,
            iv,
            code,
          });

          console.log(backData);

          //返回的数据
          if (backData.data.meta.status == 400) {
            uni.showToast({
              title: "网络飞走了~",
              duration: 1000,
            });
          } else {
            uni.showToast({
              title: "授权登录成功，加载中",
              icon: "loading",
              duration: 2000,
            });

            //将用户个人信息存入本地
            uni.setStorageSync("currentUser", {
              nickName,
              gender,
              province,
              city,
              country,
              avatarUrl,
            });
            //将用户token存入本地
            uni.setStorageSync("tokenKey", backData.data.message.token);
            //实现支付请求；
            this.payAllGoods();
          }
        } else {
          uni.showToast({
            title: "取消授权",
            duration: 2000,
          });
        }
      }
    },
    //获取token的方法
    async getUserToken(data) {
      return await this.$request({
        url: "/users/wxlogin",
        method: "POST",
        data,
      });
    },
    //获取code值的方法
    async getUserCode() {
      const res = await uni.login();
      return res;
    },
    //用户授权请求
    getUserAuth() {
      wx.getSetting({
        withSubscriptions: true,
        success(res) {
          console.log(res);
          // res.authSetting = {
          //   "scope.userInfo": true,
          //   "scope.userLocation": true
          // }

          // res.subscriptionsSetting = {
          //   mainSwitch: true, // 订阅消息总开关
          //   itemSettings: {   // 每一项开关
          //     SYS_MSG_TYPE_INTERACTIVE: 'accept', // 小游戏系统订阅消息
          //     SYS_MSG_TYPE_RANK: 'accept'
          //     zun-LzcQyW-edafCVvzPkK4de2Rllr1fFpw2A_x0oXE: 'reject', // 普通一次性订阅消息
          //     ke_OZC_66gZxALLcsuI7ilCJSP2OJ2vWo2ooUPpkWrw: 'ban',
          //   }
          // }
        },
      });
    },
  },
};
</script>

<style lang='less'>
.pay-container {
  padding: 20rpx 20rpx 83rpx 20rpx;
  button {
    padding: 0;
    margin: 0;
  }
  .userInfo {
    width: 100%;
    height: 187rpx;
    background: #fff;
    position: relative;
    border: 1px solid #ccc;
    border-radius: 20rpx;
    padding: 25rpx 0 0 25rpx;
    box-sizing: border-box;
    .address {
      font-family: PingFangSC-Medium;
      font-size: 30rpx;
      margin-bottom: 25rpx;
    }
    .user {
      font-size: 26rpx;
      color: #666;
    }
    .selectAddress {
      width: 200rpx;
      border: 2px solid #ea4350;
      border-radius: 44.5px;
      font-size: 30rpx;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .goodsList {
    background: #fff;
    .payList {
      position: relative;
      .numbers {
        position: absolute;
        right: 20rpx;
        bottom: 20rpx;
        font-size: 30rpx;
      }
    }
  }
  /*支付*/
  .charge {
    width: 100%;
    height: 83rpx;
    display: flex;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 0 5%;
    background: #fff;
    radio {
      width: 5%;
      transform: scale(0.7);
      margin-right: 5%;
    }
    .selectAll {
      width: 7%;
      font-size: 21rpx;
      margin-right: 5%;
      margin-top: 5rpx;
    }
    .totalPrice {
      width: 12.5%;
      font-size: 26rpx;
    }
    .number {
      width: 12%;
      font-size: 28rpx;
      color: #ea4350;
      &::before {
        content: "￥";
        color: #ea4350;
        font-size: 20rpx;
      }
    }
    .payment {
      width: 20%;
      font-size: 21rpx;
      font-family: PingFangSC-Regular;
      font-size: 21rpx;
      border-radius: 26rpx;
      background: #ea4350;
      padding: 0;
      color: #fff;
      margin-left: 34%;
      &.no-address {
        background: #b6b6b6;
        color: #fefefe;
      }
    }
  }
}
</style>