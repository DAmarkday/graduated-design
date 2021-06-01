<template>
  <div>
    <div class="WebTitle">
      <h1>图像标注平台(待标注图像)</h1>
    </div>
    <div></div>
    <div class="LabelBox">
      <div class="ImBox">
        <div style="display: flex; justify-content: center">
          <div>
            <div
              style="
                display: flex;
                justify-content: left;
                padding-top: 30px;
                padding-bottom: 5px;
              "
            >
              <a-button type="primary" @click="returnBack()">
                返回上一级
              </a-button>
            </div>
            <canvas class="Imcanvas">
              <p>你的浏览器竟然不支持canvas!</p>
            </canvas>
          </div>
        </div>
      </div>
      <div style="display: flex; justify-content: center">
        <h3>注意:</h3>

        <span> 一次只能更新一个类别 </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "change",
  data() {
    return {};
  },
  mounted() {
    if (this.$route.params.img_url) {
      var canvas = document.querySelector(".Imcanvas");
      var canW = canvas.width;
      var canH = canvas.height;
      var ctx = canvas.getContext("2d");
      ctx.lineWidth = 3;
    }
  },
  methods: {
    returnBack() {
      this.$router.go(-1);
    },

    /*在canvas的图像上画直线*/
    drwa_line(img, x1, y1, x2, y2, color) {
      if (x1 == x2 && x1 > img.canx && x1 < img.canx + img.canw) {
        if (y1 < img.cany) {
          y1 = img.cany;
        }
        if (y1 > img.cany + img.canh) {
          y1 = img.cany + img.canh;
        }
        if (y2 < img.cany) {
          y2 = img.cany;
        }
        if (y2 > img.cany + img.canh) {
          y2 = img.cany + img.canh;
        }
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.closePath();
      } else {
        if (y1 == y2 && y1 > img.cany && y1 < img.cany + img.canh) {
          if (x1 < img.canx) {
            x1 = img.canx;
          }
          if (x1 > img.canx + img.canw) {
            x1 = img.canx + img.canw;
          }
          if (x2 < img.canx) {
            x2 = img.canx;
          }
          if (x2 > img.canx + img.canw) {
            x2 = img.canx + img.canw;
          }
          ctx.strokeStyle = color;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
          ctx.closePath();
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.WebTitle {
  background-color: #e9ebfe;
  color: #8470ff;
  padding: 15px;
}

.WebTitle h1 {
  text-align: center;
  letter-spacing: 5px;
}

.WebTitle h6 {
  text-align: right;
  color: black;
  white-space: pre;
  margin: 0 auto;
  padding: 0px 3px 5px 0px;
}

body {
  margin: 0 auto;
  background-color: #cce8cf;
  padding: 0px 15px 0px 15px;
  width: 1280px;
}

.LabelBox {
  display: block;
}

.ImBox {
  flex: 1;
  color: red;
  text-align: center;
  background-color: #faf9de;
  padding: 0px 30px 10px 30px;
}

.Imcanvas {
  display: block;
  background: url(https://img2.baidu.com/it/u=590671829,2119277121&fm=224&fmt=auto&gp=0.jpg)
    no-repeat center center;
  background-size: 100% 100%;
}

label {
  display: inline-block;
  width: 100px;
  color: blue;
}

.Label {
  padding: 0px 0px 20px 0px;
}

button {
  padding: 5px;
  width: 100px;
}
</style>