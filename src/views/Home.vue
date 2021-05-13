<template>
  <div>
    <div>
      <div
        class="header mb10 text-ac"
        style="padding-top: 30px; font-size: 25px"
      >
        <b>Tensorflow</b> 图片识别模型训练平台
      </div>
      <!-- 显示识别按钮 -->
      <div class="flex-j-c">
        <div style="width: 500px">
          <div class="flex-j-between flex-a-c" style="height: 50px">
            <div class="bold flex-a-c">
              请选择需要识别的图像文件(仅支持'jpg'):
            </div>
            <div>
              <a-button
                @click.stop="toRecoginsePage"
                v-if="fileList.length >= 1"
              >
                <a-icon type="folder-open" />
                点击进行物体检测
              </a-button>
            </div>
          </div>

          <a-upload
            :action="$api.apis.imgLoad"
            list-type="picture-card"
            :file-list="fileList"
            @preview="handlePreview"
            @change="handleChange"
            :before-upload="beforeUpload"
          >
            <div v-if="fileList.length < limitedPicAmounts">
              <a-icon type="plus" />
              <div class="ant-upload-text">上传图片</div>
            </div>
          </a-upload>
          <a-modal
            :visible="previewVisible"
            :footer="null"
            @cancel="handleCancel"
          >
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
const limitedPicAmounts = 5; // 允许上传的图片识别数量
export default {
  name: "index",
  data() {
    return {
      fileList: [], // 图片上传数组
      previewVisible: false, // 显示预览图
      previewImage: "", // 预览图url地址或者编码
      limitedPicAmounts,
    };
  },
  methods: {
    // 隐藏预览图
    handleCancel() {
      this.previewVisible = false;
    },

    // 预览图图片数据转码防止失真
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
      // console.log(file)
    },
    // 重新赋值
    handleChange({ fileList }) {
      console.log(fileList);
      this.fileList = fileList;
      // console.log(fileList)
    },

    // 进入图片识别页面 转码可以取消掉 因为上传后服务器返回图片网址可以直接显示
    async toRecoginsePage() {
      const { fileList } = this;
      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append("picture", file.originFileObj);
      });
      await this.$Net
        .post(this.$api.apis.imgLoad, {}, formData, {
          "content-type": "multipart/form-data",
        })
        .then((res) => {
          if (res.code == 200) {
            let data = res.data;
            // console.log(data)
            // 获取网络url
            sessionStorage.setItem("saved_img_urls",JSON.stringify(data)); // 存储键值对
            this.fileList = [];
            this.$router.push({ path: "/index" });
          } else {
            this.$message.warning({
              content: "图片上传失败,请重试",
              duration: 2,
            });
          }
        })
        .catch(() => {
          this.$message.error({
            content: "网络链接错误,请刷新后重试",

            duration: 2,
          });
        });
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file];
      return false;
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
