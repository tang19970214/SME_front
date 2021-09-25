<template>
  <el-dialog title="圖片裁剪" :visible.sync="cropperDialog" :close-on-click-modal="false" :close-on-press-escape="false" :width="autoCropWidth + 20 + 'px'" :show-close="false">
    <div class="vue-cropper-box">
      <div class="vue-cropper-content">
        <vueCropper ref="cropper" :img="option.img" :outputSize="option.size" :outputType="option.outputType" :info="option.info" :full="option.full" :canMove="option.canMove" :canMoveBox="option.canMoveBox" :original="option.original" :autoCrop="option.autoCrop" :autoCropWidth="autoCropWidth" :autoCropHeight="autoCropHeight" :fixedBox="option.fixedBox" @realTime="realTime" :style="`min-height: ${autoCropHeight}px`"></vueCropper>
      </div>
      <div class="operate-wrap">
        <div class="rt">
          <el-button type="primary" @click="onCubeImg()">確認</el-button>
          <el-button type="primary" @click="cancleCropper()" plain>取消</el-button>
        </div>
      </div>

    </div>
  </el-dialog>
</template>

<script>
import moment from "moment";
import * as upload from "@/api/upload";

export default {
  props: {
    fileType: {
      type: String,
      defualt: "",
    },
    cropperDialog: {
      type: Boolean,
      default: false,
      required: true,
    },
    cropperImg: {
      type: String,
      required: true,
    },
    autoCropWidth: {
      type: Number,
      required: true,
    },
    autoCropHeight: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      option: {
        img: "", // 裁剪圖片的地址
        size: 0.5,
        info: true, // 裁剪框的大小信息
        outputSize: 1, // 剪切後的圖片質量（0.1-1）
        full: true, // 輸出原圖比例截圖 props名full
        outputType: "png", // 裁剪生成額圖片的格式
        canMove: true, // 能否拖動圖片
        original: true, // 上傳圖片是否顯示原始寬高
        canMoveBox: false, // 能否拖動截圖框
        autoCrop: true, // 是否默認生成截圖框
        // autoCropWidth: this.autoCropWidth, // 默認生成截圖框寬度
        // autoCropHeight: this.autoCropHeight, // 默認生成截圖框高度
        fixedBox: true, // 截圖框固定大小
      },
    };
  },
  watch: {
    cropperDialog(n) {
      if (n) {
        this.option.img = this.cropperImg;
      }
    },
  },
  methods: {
    cancleCropper() {
      this.$emit("cancleCropper");
    },
    // 實時預覽函數
    realTime(data) {
      this.previews = data;
    },
    onCubeImg() {
      //剪切上傳
      // 獲取cropper的截圖的base64 數據
      this.$refs.cropper.getCropData((data) => {
        //將剪裁後base64的圖片轉化為file格式
        let file = this.convertBase64UrlToBlob(data);

        let formData = new FormData();
        formData.append("files", file, file.name);

        upload.upload(formData).then((res) => {
          /* 1080*540 */
          // res.result[0].filePath

          /* 900*600 */
          // res.result[[0].thumbnail
          // const getNewImgs = {
          //   name: res.result[0].fileName,
          //   filePath: process.env.VUE_APP_BASE_IMG_URL + res.result[0].filePath,
          //   thumbnail:
          //     process.env.VUE_APP_BASE_IMG_URL + res.result[0].thumbnail,
          // };
          const imgUrl = process.env.VUE_APP_BASE_IMG_URL;
          const imgName = res.result[0].fileName;

          if (this.fileType !== "thumbnail") {
            this.$emit("setImgs", {
              name: imgName,
              filePath: imgUrl + res.result[0].filePath,
            });
          } else {
            this.$emit("setImgs_thumbnail", {
              nameme: imgName,
              filePath: imgUrl + res.result[0].filePath,
            });
          }
          this.cancleCropper();
        });
      });
    },
    // 將base64的圖片轉換為file文件
    convertBase64UrlToBlob(urlData) {
      let datetime = moment().format("YYYYMMDD");
      let arr = urlData.split(",");
      let mime = arr[0].match(/:(.*?);/)[1];
      let suffix = mime.split("/")[1];
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], `${datetime}.${suffix}`, { type: mime });
    },
  },
};
</script>

<style lang="scss" scoped>
// .vue-cropper-content {
//   min-height: 540px;

//   .vue-cropper {
//     min-height: 540px;
//   }
// }
</style>