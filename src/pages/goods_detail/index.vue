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
        <swiper-item v-for="(item,index) in bannerList" :key="item.goods_id">
          <image :src="item.pics_sma" @tap="tapOnImage(index)" />
        </swiper-item>
      </swiper>
      <!-- 价格信息 -->
      <view class="des">
        <view class="price">{{goodsDes.goods_price}}</view>
        <view class="icons">
          <button plain>
            <i class="iconfont icon-zhuanfa:before"></i>
          </button>
          <button plain @tap="handleCollection">
            <i
              :class="hasCollection ? 'iconfont icon-shoucang:before active' : 'iconfont icon-shoucang1:before'"
            ></i>
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
    <!-- 购物车 -->
    <uni-goods-nav
      class="shoppingBar"
      :fill="true"
      :options="options"
      :buttonGroup="buttonGroup"
      @click="tapOnShoppingCart"
      @buttonClick="addShoppingCart"
    />
  </view>
</template>

<script>
import uniGoodsNav from "@/components/uni-goods-nav/uni-goods-nav.vue";
export default {
  components: { uniGoodsNav },
  data() {
    return {
      bannerList: [],
      goodsDes: {},
      //点击放大图片数组
      urlArr: [],
      //当前系统是安卓还是苹果
      currentSyetem: "",
      //是否有收藏商品
      hasCollection: false,
      options: [
        {
          icon: "headphones",
          text: "客服",
        },
        {
          icon: "shop",
          text: "店铺",
          info: 0,
          infoBackgroundColor: "#007aff",
          infoColor: "red",
        },
        {
          icon: "cart",
          text: "购物车",
          info: 0,
        },
      ],
      buttonGroup: [
        {
          text: "加入购物车",
          backgroundColor: "#ff0000",
          color: "#fff",
        },
        {
          text: "立即购买",
          backgroundColor: "#ffa200",
          color: "#fff",
        },
      ],
    };
  },
  onLoad(options) {
    //判断当前系统是安卓还是苹果，若是苹果需要修改webp图片格式为jpg；
    const res = uni.getSystemInfoSync();
    this.currentSyetem = res.system;
    this.renderPage(options);
  },
  methods: {
    renderPage(options) {
      uni
        .request({
          url: "https://api-hmugo-web.itheima.net/api/public/v1/goods/detail",
          data: { ...options },
        })
        .then((res) => {
          console.log(res);
          //判断当前的系统，若是苹果需要改为jpg
          if (this.currentSyetem.indexOf("iOS") != -1) {
            console.log("当前是苹果");
            res[1].data.message.goods_introduce = res[1].data.message.goods_introduce.replace(
              /webp/g,
              "jpg"
            );
            res[1].data.message.goods_introduce = res[1].data.message.goods_introduce.replace(
              /\<img/g,
              "<img style='vertical-align:text-bottom'"
            );
          }
          this.bannerList = res[1].data.message.pics;
          //用于点击渲染大图的数据；
          this.urlArr = res[1].data.message.pics.map((item) => item.pics_big);
          this.goodsDes = res[1].data.message;

          //加载本地数据
          const cartList = uni.getStorageSync("cartList");
          console.log(cartList);
          if (cartList.length > 0) {
            let sum = 0;
            let res = cartList.map((v) => {
              sum += v.goods_count;
              return sum;
            });
            //总数设置给购物车数量标识
            this.options[2].info = sum;
          }
        });
    },
    //点击图片
    tapOnImage(index) {
      uni.previewImage({
        // 图片数组，类型要求 Array.<string>
        urls: this.urlArr,
        // 当前显示图片的链接
        current: this.urlArr[index],
      });
    },
    //点击收藏
    handleCollection() {
      //先判断有没有收藏商品
      const isCollection = uni.getStorageSync("collectionId") || [];
      if (isCollection.length > 0) {
        //找到当前需要删除的元素索引；
        let index = isCollection.findIndex(
          (v, i) => v.goods_id == this.goodsDes.goods_id
        );
        if (index == -1) {
          const obj = { goods_id: this.goodsDes.goods_id };
          isCollection.push(obj);
          //修改收藏标识;
          this.hasCollection = true;
        } else {
          isCollection.splice(index, 1);

          this.hasCollection = false;
        }
      } else {
        //创建收藏的数组;
        const obj = { goods_id: this.goodsDes.goods_id };
        //添加进数组
        isCollection.push(obj);
        //修改收藏数据为true；
        this.hasCollection = true;
      }

      uni.setStorage({
        key: "collectionId",
        data: isCollection,
      });
    },
    tapOnShoppingCart(e) {
      //tabbar栏跳转需要用switchTab
      uni.switchTab({
        url: "/pages/cart/index",
      });
      console.log(e);
    },
    //点击加入购物车
    addShoppingCart(e) {
      console.log(e);
      uni.showToast({
        title: `加入购物车成功`,
        icon: "success",
        mask: true,
        duration: 300,
      });
      //判断是否在本地有数据；
      const cartList = uni.getStorageSync("cartList") || [];
      if (cartList.length > 0) {
        const index = cartList.findIndex(
          (v) => v.goods_id == this.goodsDes.goods_id
        );
        //在本地找到数据；
        if (index >= 0) {
          cartList[index].goods_count++;
          //购物车小数字同时递增；
          this.options[2].info++;
        } else {
          //在本地没找到
          this.options[2].info++;
          let goods_num = 0;
          //当前商品数量+1
          goods_num++;
          //点击购物车按钮，数量加1；
          const {
            goods_id,
            cat_id,
            goods_price,
            goods_number,
            goods_small_logo,
            goods_name,
          } = this.goodsDes;
          cartList.push({
            goods_id,
            cat_id,
            goods_price,
            goods_number,
            goods_small_logo,
            goods_name,
            goods_count: goods_num,
            isSelected: true,
          });
        }
      } else {
        this.options[2].info++;
        let goods_num = 0;
        //点击购物车按钮，数量加1；
        goods_num++;
        const {
          goods_id,
          cat_id,
          goods_price,
          goods_number,
          goods_small_logo,
          goods_name,
        } = this.goodsDes;

        cartList.push({
          goods_id,
          cat_id,
          goods_price,
          goods_number,
          goods_small_logo,
          goods_name,
          goods_count: goods_num,
          isSelected: true,
        });
      }
      //无论是修改值还是存储值，都需要重新存入本地缓存中；
      uni.setStorageSync("cartList", cartList);
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
        i {
          &.active {
            color: #ea4350;
          }
        }
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
      margin-bottom: 15rpx;
    }
  }
  /*购物车*/
  .shoppingBar {
    width: 100vw;
    position: fixed;
    bottom: 0;
    left: 0;
  }
}
</style>