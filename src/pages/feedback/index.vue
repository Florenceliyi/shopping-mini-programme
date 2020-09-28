<template>
  <view class="feedback-container">
    <!-- 问题类型 -->
    <view class="problem">
      <view class="title">选择问题类型</view>
      <view class="prom-cate">
        <view
          class="item"
          v-for="(item,index) in problemList"
          :key="item.id"
          :class="currentIndex == index ? 'active':''"
          @tap="tapOnProbTab(index)"
        >{{item.des}}</view>
      </view>
    </view>
    <!-- 问题内容 -->
    <view class="content">
      <textarea placeholder="请描述一下您的问题..."></textarea>
    </view>
    <!-- 上传图片 -->
    <view class="upload">
      <view class="upload-title">上传图片(0/4)</view>
      <view class="pics-item" @tap="tapOnUpLoadFile">
        <view class="upload-image">
          <i class="heng"></i>
          <i class="shu"></i>
        </view>
      </view>
    </view>
    <!-- 提交按钮 -->
    <button>提交</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      problemList: [
        {
          id: 1,
          des: "功能问题",
        },
        {
          id: 2,
          des: "性能问题",
        },
        {
          id: 3,
          des: "体验问题",
        },
        {
          id: 4,
          des: "其他",
        },
      ],
      currentIndex: null,
    };
  },
  methods: {
    //上传图片文件
    tapOnUpLoadFile() {
      // 从相册选择6张图
      uni.chooseImage({
        count: 6,
        sizeType: ["original", "compressed"],
        sourceType: ["album"],
        success: function (res) {
          // 预览图片
          uni.previewImage({
            urls: res.tempFilePaths,
            longPressActions: {
              itemList: ["发送给朋友", "保存图片", "收藏"],
              success: function (data) {
                console.log(
                  "选中了第" +
                    (data.tapIndex + 1) +
                    "个按钮,第" +
                    (data.index + 1) +
                    "张图片"
                );
              },
              fail: function (err) {
                console.log(err.errMsg);
              },
            },
          });
        },
      });
    },
    //点击问题选项
    tapOnProbTab(index) {
      this.currentIndex = index;
    },
  },
};
</script>

<style lang='less'>
.feedback-container {
  padding: 20rpx 20rpx 0 20rpx;
  box-sizing: border-box;
  background: #f9f9f9;
  height: 100vh;
  /*问题类型*/
  .problem {
    width: 100%;
    height: 232rpx;
    padding: 20rpx 20rpx 0 30rpx;
    box-sizing: border-box;
    margin-bottom: 20rpx;
    background: #fff;
    .title {
      font-family: PingFangSC-Regular;
      font-size: 26rpx;
      margin-bottom: 25rpx;
    }
    .prom-cate {
      display: flex;
      flex-wrap: wrap;
      .item {
        width: 180rpx;
        line-height: 46rpx;
        text-align: center;
        background: #ededed;
        border-radius: 23px;
        font-size: 20rpx;
        margin-right: 35rpx;
        margin-bottom: 40rpx;
        &.active {
          background: #ffe6e6;
          border: 1px solid #ea4350;
        }
      }
    }
  }
  /*问题描述*/
  .content {
    width: 100%;
    height: 390rpx;
    margin-bottom: 20rpx;
    background: #fff;
    textarea {
      width: 100%;
      height: 100%;
      padding: 25rpx 0 0 25rpx;
      box-sizing: border-box;
      font-size: 26rpx;
      color: #ccc;
    }
  }
  /*上传图片*/
  .upload {
    width: 100%;
    height: 216rpx;
    margin-bottom: 25rpx;
    padding: 20rpx 0 0 25rpx;
    box-sizing: border-box;
    background: #fff;
    .upload-title {
      font-family: PingFangSC-Regular;
      font-size: 26rpx;
      margin-bottom: 20rpx;
    }
    .pics-item {
      display: flex;
      .upload-image {
        position: relative;
        width: 128rpx;
        height: 128rpx;
        background: #d8d8d8;
        i {
          display: inline-block;
          background: #a6a6a6;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
        .heng {
          width: 74rpx;
          height: 6rpx;
        }
        .shu {
          width: 6rpx;
          height: 74rpx;
        }
      }
    }
  }
  button {
    background: #ea4350;
    border-radius: 34px;
    color: #fff;
  }
}
</style>