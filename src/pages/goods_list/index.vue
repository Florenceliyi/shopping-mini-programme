<template>
  <view class="goods_list">
    <!-- 搜索框-->
    <search></search>
    <view class="gl-container">
      <!-- tab栏 -->
      <view class="tab">
        <view
          class="tab-item"
          v-for="(item,index) in tabList"
          :key="index"
          :class="currentIndex == index? 'active': '' "
          @tap="handleTabClick(index)"
        >{{item}}</view>
      </view>
      <!-- 列表 -->
      <scroll-view scroll-y class="list" @scrolltolower="pullDownToBottom" scroll-with-animation>
        <view
          class="gl-content"
          v-for="item in productList"
          :key="item.goods_id"
          @tap="jumpToGoodsDetail(item.goods_id)"
        >
          <image :src="item.goods_small_logo || '/static/product_low.png'" />
          <view class="gl-right">
            <view class="gl-title">{{item.goods_name}}</view>
            <view class="gl-price">{{item.goods_price}}</view>
          </view>
        </view>
        <uni-load-more v-if="isShow" :status="isBottom ? 'loading' : 'noMore'"></uni-load-more>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import search from "@/components/search/index.vue";
import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue";
export default {
  components: {
    search,
    uniLoadMore,
  },
  data() {
    return {
      currentIndex: 0,
      tabList: ["综合", "销量", "价格"],
      productList: [],
      //页面数据
      pageData: {
        pagenum: 1,
        pagesize: 6,
        cid: 0,
      },
      //需要下拉刷新的标识;
      isBottom: false,
      //下拉框是否显示
      isShow: false,
    };
  },
  onLoad(options) {
    this.renderPage(options);
  },
  methods: {
    renderPage(options) {
      this.pageData.cid = options.cid;
      const data = { ...options };
      uni.request({
        url: "https://api-hmugo-web.itheima.net/api/public/v1/goods/search",
        data,
        success: (res) => {
          //合并之前请求好的页面和新的页面
          this.productList = [...this.productList, ...res.data.message.goods];
          //顶部加载框显示；
          this.isShow = true;
          //加载完数据显示没有数据可加载
          if (res.data.message.goods.length === 0) {
            this.isBottom = false;
          }
          //头部下拉刷新框停止刷新;
          uni.stopPullDownRefresh();
        },
      });
    },
    //tab栏切换
    handleTabClick(index) {
      //当前点击的tab栏索引
      this.currentIndex = index;
    },
    //下拉到底部
    pullDownToBottom(e) {
      if (e) {
        this.isBottom = true;
        this.pageData.pagenum++;
        this.renderPage({ ...this.pageData });
      }
    },
    //头部下拉刷新
    onPullDownRefresh() {
      console.log("头部下拉刷新");
      //清空列表数组
      this.productList = [];
      this.pageData.pagenum = 1;
      console.log(this.pageData);

      this.renderPage({ ...this.pageData });
    },
    //跳转商品详情页
    jumpToGoodsDetail(url) {
      uni.navigateTo({
        url: "/pages/goods_detail/index?goods_id=" + url,
      });
    },
  },
};
</script>

<style lang='scss'>
.gl-container {
  padding-left: 26rpx;
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
  /*列表栏*/
  .list {
    height: calc(100vh - 188rpx);
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
  }
}
</style>
