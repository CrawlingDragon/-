import EXIF from "exif-js";
export function inWeixin() {
  var ua = navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == "micromessenger") {
    return true;
  } else {
    return false;
  }
}

export function getIsApp() {
  var ua = navigator.userAgent.toLowerCase();
  if (ua.match(/isapp/i) == "isapp") {
    return true;
  }
  return false;
}

export function exifImg(file) {
  return new Promise(resolve => {
    EXIF.getData(file, function() {
      let Orientation;
      Orientation = EXIF.getTag(this, "Orientation");
      imgPress({ file: file, Orientation: Orientation }).then(res => {
        resolve(res.filePress);
      });
    });
  });
}
function imgPress({
  file,
  Orientation,
  rate = 1,
  maxSize = 20800,
  fileType = "file"
}) {
  let that = this;
  return new Promise(resolve => {
    // new一个文件读取方法，监听文件读取
    let reader = new FileReader();
    reader.readAsDataURL(file);
    let img = new Image();
    reader.onload = function(e) {
      img.src = e.target.result;
    };
    img.onload = function() {
      let canvas = document.createElement("canvas");
      // let context = canvas.getContext('2d')
      // 文件大小KB
      const fileSizeKB = file.size / 1024;
      // 配置rate和maxSize的关系
      if (fileSizeKB * rate > maxSize) {
        rate = Math.floor((maxSize / fileSizeKB) * 10) / 10;
      }
      // 缩放比例，默认0.5
      // let targetW = canvas.width = this.width * rate
      // let targetH = canvas.height = this.height * rate
      // context.clearRect(0, 0, targetW, targetH)
      // context.drawImage(img, 0, 0, targetW, targetH)
      let width = this.width;
      let height = this.height;
      canvas.width = width;
      canvas.height = height;
      if (Orientation && Orientation != 1) {
        switch (Orientation) {
          case 6: // 旋转90度
            canvas.width = this.height;
            canvas.height = this.width;
            that.rotateImg(img, "left", canvas, width, height);
            break;
          case 3: // 旋转180度
            rotateImg(img, "right2", canvas, width, height);
            break;
          case 8: // 旋转-90度
            rotateImg(img, "right2", canvas, width, height);
            break;
          default:
            canvas.getContext("2d").drawImage(img, 0, 0, width, height);
            break;
        }
      } else {
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      }

      if (fileType === "file" || fileType === "blob") {
        canvas.toBlob(
          function(blob) {
            resolve({
              filePress:
                fileType === "blob"
                  ? blob
                  : new File([blob], file.name, { type: file.type }),
              base64: img.src
            });
          },
          "image/jpeg",
          0.4
        );
      } else {
        resolve({
          filePress: fileType === "base64" ? canvas.toDataURL(file.type) : null,
          base64: img.src
        });
      }
    };
  });
}
function rotateImg(img, direction, canvas, width, height) {
  var min_step = 0;
  var max_step = 3;
  if (img == null) {
    return;
  }
  var step = 2;
  if (step == null) {
    step = min_step;
  }
  if (direction == "right") {
    step++;
    step > max_step && (step = min_step);
  } else if (direction == "right2") {
    step = 2;
  } else {
    step--;
    step < min_step && (step = max_step);
  }
  var degree = (step * 90 * Math.PI) / 180;
  var ctx = canvas.getContext("2d");
  switch (step) {
    case 0:
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      break;
    case 1:
      canvas.width = height;
      canvas.height = width;
      ctx.rotate(degree);
      ctx.drawImage(img, 0, -height, width, height);
      break;
    case 2:
      canvas.width = width;
      canvas.height = height;
      ctx.rotate(degree);
      ctx.drawImage(img, -width, -height, width, height);
      break;
    case 3:
      canvas.width = height;
      canvas.height = width;
      ctx.rotate(degree);
      ctx.drawImage(img, -width, 0, width, height);
      break;
  }
}
