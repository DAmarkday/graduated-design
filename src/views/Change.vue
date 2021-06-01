<template>
  <div>
    <div style="display: flex; justify-content: center">
      <h1>图像标注工具(待标注图像)</h1>
    </div>

    <div class="divbody">
      <div>
        <div>
          <a-button type="primary" @click="returnBack()"> 返回上一级 </a-button>
        </div>
        <div class="imgContainer" ref="imgContainer">
          <canvas
            :ref="'refmyCanvas'"
            class="canvasClass"
            :width="divWidth"
            :height="divHeight"
            @mousedown="canvasMouseDown"
            @mouseup="canvasMouseUp"
            @mousemove="canvasMouseMove"
          ></canvas>
          <img
            :id="'image'"
            :src="imageSrc"
            :ref="'refimage'"
            class="imgClass"
            @load="uploadImgLoad"
            v-show="false"
          />
        </div>

        <div
          style="display: flex; justify-content: center; align-items: center"
        >
          <a-button type="danger" @click="refresh()" style="margin-right: 5px">
            清空
          </a-button>

          <a-input-search
            placeholder="输入对应的类别"
            v-model="input"
            size="large"
            style="width: 300px"
            @search="handle"
          >
            <a-button slot="enterButton" type="primary"> 确认 </a-button>
          </a-input-search>
        </div>
        <div
          style="display: flex; justify-content: center; align-items: center"
        >
          <a-radio-group
            default-value="a"
            button-style="solid"
            style="margin-top: 10px"
            v-model="radio"
          >
            <a-radio-button value="a" style="font-size: 16px; width: 100px">
              修改类别
            </a-radio-button>
            <a-radio-button value="b" style="font-size: 16px; width: 100px">
              添加类别
            </a-radio-button>
          </a-radio-group>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * 修改标签
 */
const key = "updatable";
export default {
  inject: ["reload"], //注入reload方法
  data() {
    return {
      divWidth: 0,
      divHeight: 0,
      imageSrc:
        "https://img0.baidu.com/it/u=1945972273,3826871958&fm=224&fmt=auto&gp=0.jpg",
      // canvas的配置部分
      c: "",
      cxt: "",
      canvasImg: "",
      imgWidth: 0, // img框的宽度
      imgHeight: 0, // img框的高度
      targetMarkIndex: -1, // 目标标注index
      params: {
        currentX: 0,
        currentY: 0,
        flag: false, // 用来判断在canvas上是否有鼠标down的事件，
        editFlag: false,
        editIndex: -1,
      },
      // 目标类别list
      imageCategoryList: [],
      targetMarkArray: [],
      input: "",
      radio: "a",
      c_name: "", // 识别前的图片名字
    };
  },
  mounted() {
    // 这里是进行初始化canvas的操作 myCanvas
    if (this.$route.params.img_name) {
      console.log(this.$host + this.$route.params.img_name);
      this.imageSrc = `${this.$host}/img/${this.$route.params.img_name}`;
      this.c_name = this.$route.params.img_name;
    }
    const self = this;
    try {
      self.c = self.$refs.refmyCanvas;
      self.canvasImg = self.$refs.refimage;
      self.cxt = self.c.getContext("2d");
      self.divWidth = self.$refs.imgContainer.offsetWidth;
      self.divHeight = self.$refs.imgContainer.offsetHeight;
    } catch (err) {
      console.log(err);
    }
    try {
      self.canvasOnDraw(self.imgWidth, self.imgHeight);
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    handle() {
      let c = this.radio;
      let _name = this.input;
      console.log(this.targetMarkArray);
      if (this.targetMarkArray.length != 0) {
        if (_name !== "") {
          if (c === "a") {
            /**
             * 创建对应的标注数据
             * _name 修改的类别名
             * array 在图片中对应的所有位置
             */
            this.changeHttp(this.c_name, {
              name: _name,
              array: this.targetMarkArray,
            });
          } else {
            /**
             * 创建对应的标注数据
             * _name 新增的类别名
             * array 在图片中对应的所有位置
             */
            this.addHttp(this.c_name, {
              name: _name,
              array: this.targetMarkArray,
            });
          }
        } else {
          this.$message.warning({
            content: "请输入类别名",
          });
        }
      } else {
        this.$message.warning({
          content: "请先标注图片",
        });
      }
    },

    /**
     * name: 图片识别前的图片名
     * result: 图片修改后的结果数组对象
     */
    async changeHttp(name, result) {
      this.$message.loading({
        content: "修改提交中...请稍后",
        key,
        duration: 0,
      });
      await this.$Net
        .post(
          this.$api.apis.change,
          {},
          {
            name: name,
            result: result,
          },
          {
            "Content-Type": "application/json",
          }
        )
        .then((res) => {
          let data = res.data;
          if (res.code == 200) {
            this.$message.success({
              content: data,
              key,
              duration: 2,
            });
          } else {
            this.$message.warning({
              content: data,
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
     * name: 图片识别前的图片名
     * result: 图片新增类别的数组对象
     */
    async addHttp(name, result) {
      this.$message.loading({
        content: "新增类别提交中...请稍后",
        key,
        duration: 0,
      });
      await this.$Net
        .post(
          this.$api.apis.add,
          {},
          {
            name: name,
            result: result,
          }
        )
        .then((res) => {
          let data = res.data;
          if (res.code == 200) {
            this.$message.success({
              content: data,
              key,
              duration: 2,
            });
          } else {
            this.$message.warning({
              content: data,
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
    refresh() {
      //   this.targetMarkArray=[];
      this.reload();
      // this.cxt.clearRect(0, 0, this.divWidth, this.divHeight);
    },
    returnBack() {
      this.$router.go(-1);
    },
    // 鼠标down事件
    canvasMouseDown(e) {
      this.params.flag = true;
      if (!e) {
        e = window.event;
        // 防止IE文字选中
        this.$refs.refmyCanvas.onselectstart = function () {
          return false;
        };
      }
      // 这里先判断一下，看是否是在有效数据，并且初始化参数
      if (this.params.flag === true && this.params.editFlag === false) {
        this.params.currentX = 0;
        this.params.currentY = 0;
        this.params.currentX = e.layerX;
        this.params.currentY = e.layerY;
        const dict1 = {
          x1: this.params.currentX, // 开始的x坐标
          y1: this.params.currentY, // 开始的y坐标
          x2: this.params.currentX, // 结束的x坐标
          y2: this.params.currentY, // 结束的y坐标
          flag: false, // 图片区域是否高亮,
          targetMarkValue: "", // 目标类别值
          wid: 0, // 矩形宽度
          hei: 0, // 矩形高度
          // final 是最终的框选的坐标值
          left: this.params.currentX,
          top: this.params.currentY,
          width: 0, // 矩形宽度
          height: 0, // 矩形高度
          finalX1: this.params.currentX,
          finalY1: this.params.currentY,
          finalX2: this.params.currentX,
          finalY2: this.params.currentY,
        };
        this.targetMarkIndex = this.targetMarkIndex + 1;
        this.targetMarkArray.push(dict1);
      }
      // 执行渲染操作
      try {
        this.canvasOnDraw(this.imgWidth, this.imgHeight);
      } catch (err) {
        console.log(err);
      }
    },
    canvasMouseUp(e) {
      this.params.flag = false;
      try {
        this.canvasOnDraw(this.imgWidth, this.imgHeight);
      } catch (err) {
        console.log(err);
      }
    },
    canvasMouseMove(e) {
      if (e === null) {
        e = window.event;
      }
      if (this.params.flag === true && this.params.editFlag === false) {
        this.params.currentX = e.layerX;
        this.params.currentY = e.layerY;
        this.targetMarkArray[this.targetMarkIndex].x2 = this.params.currentX; // x1 值
        this.targetMarkArray[this.targetMarkIndex].y2 = this.params.currentY; // y1 值
        this.targetMarkArray[this.targetMarkIndex].wid =
          this.params.currentX - this.targetMarkArray[this.targetMarkIndex].x1; // 宽度值
        this.targetMarkArray[this.targetMarkIndex].hei =
          this.params.currentY - this.targetMarkArray[this.targetMarkIndex].y1; // 高度
      }
      // 执行渲染操作
      try {
        this.canvasOnDraw(this.imgWidth, this.imgHeight);
      } catch (err) {
        console.log(err);
      }
    },
    uploadImgLoad(e) {
      try {
        this.imgWidth = e.path[0].naturalWidth;
        this.imgHeight = e.path[0].naturalHeight;
        this.canvasOnDraw(this.imgWidth, this.imgHeight);
      } catch (err) {
        console.log(err);
      }
    },
    // 输入两个坐标值，判断哪个坐标值离左上角最近，其中特殊情况需要进行坐标查找工作
    findWhichIsFirstPoint(x1, y1, x2, y2) {
      // 首先判断x轴的距离谁更近
      if (x1 <= x2) {
        // 说明x1 比较小,接下来判断y谁更近
        if (y1 <= y2) {
          // 说明第一个坐标离得更近，直接顺序return就好
          return [x1, y1, x2, y2];
        } else {
          // 这里遇见一个奇葩问题，需要进行顶角变换
          return [x1, y2, x2, y1];
        }
      } else {
        // 这里是x1 大于 x2 的情况
        if (y2 <= y1) {
          return [x2, y2, x1, y1];
        } else {
          // y2 大于 y1 的情况, 这里需要做顶角变换工作
          return [x2, y1, x1, y2];
        }
      }
    },
    // canvas绘图部分
    canvasOnDraw(imgW = this.imgWidth, imgH = this.imgHeight) {
      const imgWidth = imgW;
      const imgHeight = imgH;
      this.divWidth = this.$refs.imgContainer.offsetWidth;
      this.divHeight = this.$refs.imgContainer.offsetHeight;
      this.cxt.clearRect(0, 0, this.c.width, this.c.height);
      // 当前的图片和现有的canvas容器之前的一个关系，是否有必要，我们后续做讨论
      var resPointList = this.changeOldPointToNewPoint(
        imgWidth,
        imgHeight,
        this.divWidth,
        this.divHeight
      );
      this.cxt.drawImage(
        this.canvasImg,
        0,
        0,
        imgWidth,
        imgHeight,
        0,
        0,
        resPointList[0],
        resPointList[1]
      );
      for (const index in this.targetMarkArray) {
        const x1 = this.targetMarkArray[index].x1;
        const y1 = this.targetMarkArray[index].y1;
        const x2 = this.targetMarkArray[index].x2;
        const y2 = this.targetMarkArray[index].y2;
        const wid = this.targetMarkArray[index].wid;
        const hei = this.targetMarkArray[index].hei;
        const FinalPointList = this.findWhichIsFirstPoint(
          (x1 * this.imgWidth) / resPointList[0],
          (y1 * this.imgHeight) / resPointList[1],
          (x2 * this.imgWidth) / resPointList[0],
          (y2 * this.imgHeight) / resPointList[1]
        );
        this.targetMarkArray[index].finalX1 = FinalPointList[0];
        this.targetMarkArray[index].finalY1 = FinalPointList[1];
        this.targetMarkArray[index].finalX2 = FinalPointList[2];
        this.targetMarkArray[index].finalY2 = FinalPointList[3];
        // 必须要有的字段
        this.targetMarkArray[index].left = this.targetMarkArray[index].finalX1;
        this.targetMarkArray[index].top = this.targetMarkArray[index].finalY1;
        this.targetMarkArray[index].width =
          this.targetMarkArray[index].finalX2 -
          this.targetMarkArray[index].finalX1;
        this.targetMarkArray[index].height =
          this.targetMarkArray[index].finalY2 -
          this.targetMarkArray[index].finalY1;
        // 调整四个顶角的函数，为了能让整体框选区域更好看
        const FinalPointListNow = this.findWhichIsFirstPoint(x1, y1, x2, y2);
        const tmpX1 = FinalPointListNow[0];
        const tmpY1 = FinalPointListNow[1];
        const tmpX2 = FinalPointListNow[2];
        const tmpY2 = FinalPointListNow[3];
        this.cxt.strokeStyle = "#FF6600";
        this.cxt.strokeRect(tmpX1, tmpY1, tmpX2 - tmpX1, tmpY2 - tmpY1);
        this.cxt.fillStyle = "#FF6600";
        this.cxt.font = "16px Arial";
        // canvas的标题部分
        this.cxt.fillText(parseInt(index) + 1, tmpX1, parseInt(tmpY1) - 6);
        // 这里是在处理高亮的地方
        this.cxt.fillStyle = "rgba(255, 0, 0, 0.1)";
        this.cxt.fillRect(tmpX1, tmpY1, wid, hei);
        // 说明被点击了
        this.canvasDrowBorder(
          "#FF6600",
          tmpX1,
          tmpY1,
          tmpX2 - tmpX1,
          tmpY2 - tmpY1
        );
        this.canvasDrowInnerColor(
          "rgba(255, 0, 0, 0.3)",
          tmpX1,
          tmpY1,
          tmpX2 - tmpX1,
          tmpY2 - tmpY1
        );
      }
    },
    // canvas框选区域的内容颜色
    canvasDrowInnerColor(color, x, y, w, h) {
      this.cxt.fillStyle = color;
      this.cxt.fillRect(x, y, w, h);
    },
    // canvas框选区域的边框颜色
    canvasDrowBorder(color, x, y, w, h) {
      this.cxt.strokeStyle = color;
      this.cxt.strokeRect(x, y, w, h);
    },
    // 尺寸变换函数
    changeOldPointToNewPoint(imgw, imgH, canvasW, canvasH) {
      // 这里有个要求,先以宽度为准,然后再一步步调整高度
      var tmpW = canvasW;
      var tmpH = (tmpW * imgH) / imgw;
      // 如果转换之后的高度正好小于框的高度,则直接进行显示
      if (tmpH <= canvasH) {
        // 尺寸完美匹配
        return [tmpW, tmpH];
      } else {
        // 高度超出框了,需要重新调整高度部分
        tmpW = canvasW;
        tmpH = (tmpW * imgH) / imgw;
        var count = 1;
        var raise = 0.05;
        while (tmpH > canvasH || tmpW > canvasW) {
          tmpW = tmpW * (1 - raise * count);
          tmpH = (tmpW * imgH) / imgw;
        }
        return [tmpW, tmpH];
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.divbody {
  display: flex;
  justify-content: center;
}
.imgContainer {
  position: relative;
  width: 640px;
  height: 480px;
}
.canvasClass {
  position: absolute;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
}
.imgClass {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
}
</style>
