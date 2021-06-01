<template>
  <div>
    <div class="bold">识别结果如下:</div>
    <div>
      <img
        :src="$host + url"
        alt=""
        style="width: 100%; height: 100%; object-fit: fill"
      />
    </div>
    <p class="fz12">
      <span class="bold">提示: </span
      ><span
        >物体检测成功率在不考虑过拟合的情况下取决于训练样本的数量,如果本次物体检测误差较大,你可以
       
         <span class="bold change" @click="delieverToParam">操作检测结果</span>
      </span>
    </p>
    <div class="flex-j-c">
      <a-button type="primary" @click="clickRecognisedSuccess">
        检测成功
      </a-button>
      <a :href="splitUrlToName($api.apis.imgDownload,url)" download="recognised.jpg" style="position:absolute;right:20px;margin-top:5px">保存识别的图片</a>
      <!-- <div>{{splitUrlToName($api.apis.imgDownload,url)}}</div> -->
    </div>
    <!-- <a-button type="primary" ghost> 添加标签 </a-button>
    <a-button type="danger" ghost> 修改标签 </a-button> -->
  </div>
</template>

<script>
const key = "updatable";
export default {
  name: "index",
  props: {
    toRecognisedUrlKey: {
      type: String,
      default: () => {
        return undefined;
      },
    },
    toChoosedUrlKey: {
      type: String,
      default: () => {
        return undefined;
      },
    },
  },
  data() {
    return {
      url: this.toRecognisedUrlKey,
      choose: this.toChoosedUrlKey,
    };
  },
  methods: {
splitUrlToName(a,url){
      let name =url.split("img/")[1] 
      let u = `${a}?name=${name}`
      return u;
    },


    /**
     * 关闭模块框
     */
    clickRecognisedSuccess() {
      this.$emit("closeRecognised", false);
    },
    delieverToParam() {
      console.log('11111'+this.choose)
      this.$router.push({ name: "change", params: { img_name:this.choose } });
    },
  },
  watch: {
    toRecognisedUrlKey(val) {
      this.url = val;
    },
    toChoosedUrlKey(val) {
      this.choose = val;
    },
  },
};
</script>
<style lang="scss" scoped>
.change {
  color: #ff7875;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
.add {
  color: #40a9ff;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
</style>
