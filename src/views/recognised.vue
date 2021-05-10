<template>
  <div>
    <div class="bold">识别结果如下:</div>
    <div>
      <img
        src="https://img-blog.csdnimg.cn/20200522160037154.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MjY4NDQxOA==,size_16,color_FFFFFF,t_70"
        alt=""
        style="width: 100%; height: 100%; object-fit: fill"
      />
    </div>
    <p class="fz12">
      <span class="bold">提示: </span
      ><span
        >物体检测成功率在不考虑过拟合的情况下取决于训练样本的数量,如果本次物体检测误差较大,你可以
        <span class="bold add">添加标签</span>
        或 <span class="bold change">修改标签</span>
      </span>
    </p>
    <div class="flex-j-c">
      <a-button type="primary" @click="clickRecognisedSuccess"> 检测成功 </a-button>
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
    recognisedDataKey: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  methods: {
      clickRecognisedSuccess(){
          this.$emit('closeRecognised',false)
      }
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
