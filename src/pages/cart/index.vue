<template>
  <view class="cart-container">
    <scroll-view class="cartList" v-if="cartList.length >= 0">
      <view
        class="cartItem"
        v-for="(item, index) in cartList"
        :key="item.goods_id"
      >
        <radio
          color="var(--color)"
          @tap="tapOnRadio(item.goods_id)"
          :data-index="index"
          :checked="item.isSelected"
        ></radio>
        <!-- 引入子组件  -->
        <goods class="cart-content" :item="item"></goods>
        <!-- 加减购物车 -->
        <view class="icons">
          <i
            class="iconfont icon-tianjia:before"
            :class="isClick == index ? 'active' : ''"
            @tap="addNum(item.goods_id, index)"
          ></i>
          <input
            type="text"
            v-model="item.goods_count"
            @focus="changeInputStyle(index)"
            @blur="inputOnBlur(index, $event)"
            :class="currentInput == index ? 'active' : ''"
          />
          <i
            class="iconfont .icon-jianshao:before"
            :class="isClick == index ? 'active' : ''"
            @tap="subNum(item.goods_id, index)"
          ></i>
        </view>
      </view>
      <!-- 购物车没有商品 -->
      <view class="no-goods" v-if="cartList.length == 0"
        >购物车没有商品，快去选购吧~ヽ(✿ﾟ▽ﾟ)ノ</view
      >
    </scroll-view>
    <!-- 结算 -->
    <view class="charge" v-if="cartList.length > 0">
      <radio
        color="var(--color)"
        :checked="isAllSelected"
        @tap="tapOnAllSelected"
        :disable="cartList.length == 0 ? false : true"
      ></radio>
      <view class="selectAll">全选</view>
      <view class="totalPrice">合计：</view>
      <view class="number">{{ calAllGoods }}</view>
      <button
        :class="cartList.length == 0 ? 'no-cart payment' : 'payment'"
        @tap="payAllGoods"
      >
        去结算({{ cartList.length }})
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
      cartList: [1],
      //单选框
      checked: false,
      //是否全选
      isAllSelected: false,
      //input是否聚焦
      currentInput: null,
      //加，减号是否被点击
      isClick: null,
    };
  },
  watch: {
    cartList: {
      handler(val) {
        console.log(val);
        uni.setStorageSync("cartList", val);
      },
      deep: true,
    },
  },
  computed: {
    calAllGoods() {
      let totalPrice = 0;
      if (this.cartList.length > 0) {
        this.cartList.map((item) => {
          if (item.isSelected) {
            totalPrice += item.goods_count * item.goods_price;
          }
        });
        return totalPrice;
      }
    },
  },
  onShow() {
    //从本地加载购物车数据
    this.cartList = uni.getStorageSync("cartList");
    //判断是否为全选方法
    this.calIsAllSelected();
  },
  methods: {
    //点击单选框
    tapOnRadio(id) {
      this.cartList = this.cartList.map((item) => {
        if (item.goods_id == id) {
          item.isSelected = !item.isSelected;
        }
        return item;
      });
      //   uni.setStorageSync("cartList", this.cartList);
      //是否全选
      this.calIsAllSelected();
    },
    //点击加号
    addNum(id, index) {
      this.isClick = index;
      this.cartList = this.cartList.map((item) => {
        if (item.goods_id == id && item.goods_count < 200) {
          item.goods_count++;
          uni.showLoading({
            title: "加载中...",
            mask: true,
            duration: 300,
          });
        }
        return item;
      });
      //   uni.setStorageSync("cartList", this.cartList);
    },
    //点击减号
    subNum(id, index) {
      //当前点击项变红
      this.isClick = index;

      uni.showLoading({
        title: "加载中...",
        mask: true,
        duration: 300,
      });
      this.cartList = this.cartList.map((item, index) => {
        if (item.goods_id == id) {
          if (item.goods_count <= 1) {
            uni.showModal({
              title: "提示",
              content: "确定删除吗？",
              success: (res) => {
                if (res.confirm) {
                  console.log(index);
                  this.cartList.splice(index, 1);
                  /*******异步回调，这里需要先缓存到本地，不然下面已经存到本地了，再执行这一步；********/
                  //   uni.setStorageSync("cartList", this.cartList);
                }
              },
            });
          } else {
            item.goods_count--;
          }
        }
        return item;
      });
      //   uni.setStorageSync("cartList", this.cartList);
    },
    //计算是否全选
    calIsAllSelected() {
      if (this.cartList.length > 0) {
        /******every的特性是如果是空数组执行会直接返回true，会导致购物车商品全删除的时候全选的值还是为true*******/
        this.isAllSelected = this.cartList.every((v) => v.isSelected);
      }
    },
    //获取焦点修改input样式
    changeInputStyle(index) {
      this.currentInput = index;
    },
    //失去焦点
    inputOnBlur(index, e) {
      //修改样式标识为空；
      this.currentInput = null;
      if (e.target.value >= 200 || e.target.value < 1) {
        uni.showToast({
          title: "不可超过200件~",
          duration: 2000,
        });
        e.target.value = 200;
        console.log(e.target.value);
      }
      console.log(e.target.value);
      this.cartList[index].goods_count = parseInt(e.target.value);
    },
    //点击全选
    tapOnAllSelected() {
      //点击全选取反
      this.isAllSelected = !this.isAllSelected;
      //取反状态反映到各个按钮；
      if (this.cartList.length > 0) {
        this.cartList.forEach((v) => (v.isSelected = this.isAllSelected));
      }
    },
    //点击结算按钮
    payAllGoods() {
      //先判断购物车是否为空
      if (this.cartList.length == 0) {
        uni.showToast({
          title: "先去选购商品哦~",
          duration: 500,
        });
        return;
      } else if (!this.cartList.every((v) => v.isSelected == true)) {
        uni.showToast({
          title: "点击选择商品哦~",
          duration: 1000,
        });
        return;
      }
      uni.navigateTo({
        url: "/pages/pay/index",
      });
    },
  },
};
</script>

<style lang='less'>
.cart-container {
  padding: 15rpx 15rpx 83rpx 20rpx;
  .cartItem {
    width: 100%;
    height: 210rpx;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    position: relative;
    .gl-content {
      padding: 0;
      .gl-right {
        width: 400rpx !important;
      }
    }
    radio {
      width: 8%;
      transform: scale(0.7);
    }
    .cart-content {
      width: 90%;
    }
  }
  .no-goods {
    margin-top: 50rpx;
    font-weight: 800;
    text-align: center;
  }
  /*加、减号tubiao*/
  .icons {
    position: absolute;
    display: flex;
    right: 20rpx;
    bottom: 10rpx;
    input {
      width: 70rpx;
      text-align: center;
      margin: 0 15rpx;
      font-family: PingFangSC-Regular;
      color: #333;
      font-size: 30rpx;
      &.active {
        border: 1px solid var(--color);
      }
    }
    i {
      margin-top: 5rpx;
      &:first-child {
        transform: scale(1.2);
        vertical-align: bottom;
        &.active {
          color: var(--color);
        }
      }
      &:last-child {
        &.active {
          color: var(--color);
        }
      }
    }
  }
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
      margin-left: 23%;
      &.no-cart {
        background: #b6b6b6;
        color: #fefefe;
      }
    }
  }
}
</style>