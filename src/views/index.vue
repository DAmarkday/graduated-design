<template>
  <div class="flex" style="height: 100%">
    <div style="width: 270px; border-right: 1px solid #666666" class="mr10">
      <div style="overflow-y: auto; height: 100vh">
        <p class="bold" style="margin-left: 20px; margin-top: 10px">
          引入的图片集:
        </p>
        <div v-for="(item, index) in imgShowList" :key="index" class="flex-c">
          <img
            :src="$host + item.url"
            style="width: 90%; height: 90%; object-fit: fill; cursor: pointer"
            class="pd5"
            @click="chooseRecognisedImg(item.url, item.name)"
          />
        </div>
      </div>
    </div>

    <div>
      <!-- 显示图片 -->
      <div class="flex">
        <div>
          <div
            class="header mb10 text-ac"
            style="padding-top: 30px; font-size: 25px"
          >
            <b>Tensorflow</b> 图片识别模型训练平台
          </div>
          <a-button type="primary" class="mb5" @click="returnToHome()">
            返回首页
          </a-button>
          <div class="flex">
            <div>
              <div>
                <div class="recognise-bg">
                  <img
                    :src="$host + choosedImgUrl"
                    alt="example"
                    style="width: 100%; height: 100%; object-fit: fill"
                  />
                </div>
              </div>
            </div>
            <!-- 右边的图片显示 -->
            <div class="flex-d-c ml5">
              <a-button type="danger" class="mb5" @click="clickRecognise">
                点击识别
              </a-button>
               <a-button type="danger" class="mb5">
                <a :href="$api.apis.imgZip" download="imgs.zip">下载检测集</a>
              </a-button>
               <a-button type="danger" class="mb5">
                <a :href="$api.apis.imgReZip" download="re.zip">下载识别集</a>
              </a-button>
              <a-button type="danger" class="mb5">
                <a :href="$api.apis.download" download="modal.pb">导出模型</a>
              </a-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <a-modal
      :visible="recognisedShowStatus"
      :footer="null"
      :width="800"
      @cancel="closeRecognisedModal(false)"
    >
      <RecognisedPage
        @closeRecognised="closeRecognisedModal"
        :toRecognisedUrlKey="recognisedD"
        :toChoosedUrlKey="choosedImgName"
      ></RecognisedPage>
      <!-- <img alt="example" style="width: 100%" :src="previewImage" /> -->
    </a-modal>
  </div>
</template>

<script>
const key = "updatable";
import RecognisedPage from "./recognised";
export default {
  name: "index",
  components: { RecognisedPage },
  data() {
    return {
      // imgShowList: [
      //   "https://img-blog.csdnimg.cn/20200522160037154.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MjY4NDQxOA==,size_16,color_FFFFFF,t_70",
      // ], // 图片上传数组
      recognisedShowStatus: false, // 识别成功界面模态框显示或隐藏
      imgShowList: [], // 图片上传数组
      choosedImgUrl: "", // 点击的图片
      choosedImgName: "", // 点击选择的图片的name
      recognisedD: undefined,
    };
  },
  mounted() {
    // 初始化图片显示
    let array = JSON.parse(sessionStorage.getItem("saved_img_urls"));
    if (array) {
      this.imgShowList = array;
      this.chooseRecognisedImg(array[0].url, array[0].name);
    }
  },
  methods: {
    /**
     * 点击识别
     */
    async clickRecognise() {
      this.$message.loading({
        content: "识别提交中...请稍后",
        key,
        duration: 0,
      });
      await this.$Net
        .get(this.$api.apis.detection, { name: this.choosedImgName }, {})
        .then((res) => {
          if (res.code == 200) {
            let data = res.data;
            this.$message.success({
              content: "识别结果返回成功!",
              key,
              duration: 2,
            });
            this.recognisedD = data.re_url;
            this.closeRecognisedModal(true); // 显示识别成功模态框
          } else {
            this.$message.warning({
              content: "识别图片失败,请重试",
              key,
              duration: 2,
            });
          }
        })
        .catch((e) => {
          console.log(e);
          this.$message.error({
            content: "网络链接错误,请刷新后重试",
            key,
            duration: 2,
          });
        });
    },
    

    /**
     * 关闭识别模态框
     */
    closeRecognisedModal(val) {
      this.recognisedShowStatus = val;
    },
    /**
     * 返回上层
     */
    returnToHome() {
      this.$router.push({ path: "/home" });
    },
    /**
     * 点击选择图片显示在界面
     */
    chooseRecognisedImg(url, name) {
      this.choosedImgUrl = url;
      this.choosedImgName = name;
    },
  },
};
</script>
<style lang="scss" scoped>
.header {
}
.recognise-bg {
  width: 700px;
  height: 400px;
  border: 1px solid black;
  border-radius: 2px;
  // background-color: #a7a7a7;
  color: white;
}
</style>
