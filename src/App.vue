<script>
export default {
  onLaunch: function () {
    console.log("App Launch");
  },
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
};
</script>

<style lang='less'>
/*每个页面公共css */
@import "@/static/styles/iconfont.wxss";
button {
  padding: 0;
  margin: 0;
}

/*css3新增特性，可以自定义变量在全局中使用*/
page {
  --color: #ea4350;
  box-sizing: border-box;
}
</style>
