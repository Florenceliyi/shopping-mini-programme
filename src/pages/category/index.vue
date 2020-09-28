<template>
  <view class="category">
    <!-- 搜索框 -->
    <search></search>
    <view class="container">
      <!-- left -->
      <scroll-view scroll-y class="category-aside">
        <view class="cate-list">
          <view
            v-for="(item, index) in cateLeft"
            :key="item.cat_id"
            @tap="handleTapCate(index)"
            :class="currentIndex == index ? 'active' : ''"
            >{{ item.cat_name }}</view
          >
          <view
            class="redBar"
            :style="{ top: currentIndex * 100 + 30 + 'rpx' }"
          ></view>
        </view>
      </scroll-view>
      <!-- right -->
      <scroll-view scroll-y class="cate-right">
        <view
          class="category-content"
          v-for="item in cateRight"
          :key="item.cat_id"
        >
          <view class="content-title">/ {{ item.cat_name }} /</view>
          <view class="goods">
            <navigator
              :url="
                '/pages/goods_list/index?cid=' +
                arr.cat_id +
                '&pagenum=1&pagesize=6'
              "
              class="navigator"
              v-for="arr in item.children"
              :key="arr.cat_id"
            >
              <image class="img" mode="heightFix" :src="arr.cat_icon"></image>
              <view class="des">{{ arr.cat_name }}</view>
            </navigator>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
// import animate from "@/static/animate.js";
import search from "@/components/search/index.vue";
export default {
  components: {
    search,
  },
  data() {
    return {
      cateLeft: [],
      cateAll: [],
      cateRight: [],
      currentIndex: 0,
      //滚动条回到顶部
      rightTop: 0,
    };
  },
  onLoad() {
    this.renderPage(0);
  },
  methods: {
    renderPage(index) {
      const cates = uni.getStorageSync("cates");
      //有本地缓存
      if (cates) {
        //有本地缓存，判断时间戳时间有否过期；
        if (Date.now() - cates.time > 100) {
          this.renderContentPage(index);
        }
        const cateAllList = cates.data;

        this.cateLeft = cateAllList.map((item) => ({
          cat_id: item.cat_id,
          cat_name: item.cat_name,
        }));
        this.cateRight = [];
        setTimeout(() => {
          this.cateRight = cateAllList[index].children;
        }, 0);
      } else {
        this.renderContentPage(index);
      }
    },
    async renderContentPage(index) {
      const res = await this.$request({
        url: "/categories",
      });

      const cateAll = res;
      //把数据保存到本地，减少请求时间
      //保存时间戳
      uni.setStorageSync("cates", { data: cateAll, time: Date.now() });
      this.cateLeft = cateAll.map((item) => ({
        cat_id: item.cat_id,
        cat_name: item.cat_name,
      }));
      //保存当前索引对应的数据；
      /*设置scrollTop不生效的解决方案：
                   先强制设置数组为空，自动保持在页面最上方位置，再进行数据的加载；
                 */
      this.cateRight = [];
      setTimeout(() => {
        this.cateRight = cateAll[index].children;
      }, 0);
    },
    handleTapCate(index) {
      //更新当前的变量
      this.currentIndex = index;
      this.renderPage(index);
    },
  },
};
</script>

<style lang='scss'>
/*轮播图*/
.banner {
  width: 100%;
  height: 340rpx;
  margin-bottom: 15rpx;
}
.banner swiper {
  width: 100%;
  height: 340rpx;
}
.banner-items {
  height: 340rpx;
}
.banner-img {
  width: 100%;
  height: 100%;
}
/*category-list*/
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
}
.category-aside {
  width: 180rpx;
  height: 1000rpx;
  background: #f3f3f3;
  .cate-list {
    width: 100%;
    line-height: 100rpx;
    text-align: center;
    position: relative;
  }
  .active {
    color: #ea4350;
  }
  .redBar {
    width: 8rpx;
    height: 43rpx;
    background: #ea4350;
    position: absolute;
    left: 0;
    top: 30rpx;
  }
}
.cate-right {
  width: 568rpx;
  height: 1000rpx;
  overflow: auto;
  .category-content {
    width: 100%;
    background: #fff;
    padding: 18rpx 48rpx 0 48rpx;
    box-sizing: border-box;
    margin-bottom: 50rpx;
    .content-title {
      width: 100%;
      height: 60rpx;
      font-weight: 600;
      font-family: PingFangSC-Medium;
      font-size: 26rpx;
      letter-spacing: 0;
      text-align: center;
      position: relative;
      left: -6%;
    }
    .goods {
      width: 100%;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      navigator {
        width: 155rpx;
        height: 185rpx;
        display: inline-block;
        text-align: center;
        image {
          width: 120rpx;
          height: 120rpx;
        }
        .des {
          font-family: PingFangSC-Medium;
          font-size: 21rpx;
          letter-spacing: 0;
          text-align: center;
        }
      }
    }
  }
}
</style>