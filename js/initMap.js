import { oGameActive } from "./initDOM.js";
import { updateRestBox } from "./movement.js";

let allImages = {//图片的资源路径对象
  "block": "images/gameElements/block2.png",
  "wall": "images/gameElements/wall3.png",
  "box": "images/gameElements/box2.png",
  "ball": "images/gameElements/ball1.png",
  "up": "images/gameElements/up.png",
  "down": "images/gameElements/down.png",
  "left": "images/gameElements/left.png",
  "right": "images/gameElements/right.png",
}
loadImages(allImages, function (acceptImg) {
  block = acceptImg.block;
  wall = acceptImg.wall;
  box = acceptImg.box;
  ball = acceptImg.ball;
  down = acceptImg.down;
  up = acceptImg.up;
  left = acceptImg.left;
  right = acceptImg.right;
  role = down;//初始化，人物向下
  gameAreaArr = copyArr(maps[level - 1])//地图数组深拷贝给gameAreaArr --> 地图的模板
  gameChangeArr = copyArr(gameAreaArr);//地图数组深拷贝给gameChangeArr --> 地图的实时数组
  rolePosition = new point();//初始化人物位置
  initGameArea(gameAreaArr);//加载地板
  initGameEle(gameChangeArr);//加载游戏元素
  updateRestBox()
});
//allImages图片，callback表示加载成功之后要做的事情
function loadImages(allImages, callback) {//callback是一个回调函数：函数做参数
  let imgsObj = {};//接受所有的游戏图片元素
  let count = 0;
  let imgNum = 0;
  for (let attr in allImages) {
    imgNum++;//图片数
  }
  for (let attr in allImages) {
    imgsObj[attr] = new Image();//图片对象
    imgsObj[attr].onload = function () {
      count++;
      if (count >= imgNum) {//图片加载完毕后隐藏于callback中
        callback(imgsObj);
      }
    };
    imgsObj[attr].src = allImages[attr];
  }
}

// 初始化游戏地板
export function initGameArea(gameAreaArr) {
  for (let i = 0; i < gameAreaArr.length; i++) {
    for (let j = 0; j < gameAreaArr[i].length; j++) {
      createCell(i, j, w, h, block, w * j + (w - block.width) / 2, h * i + (h - block.height) / 2, 0);
    }
  }
}

// 初始化游戏元素
export function initGameEle(gameChangeArr, animatedType) {
  let pic
  for (let i = 0; i < gameChangeArr.length; i++) {
    for (let j = 0; j < gameChangeArr[i].length; j++) {
      switch (gameChangeArr[i][j]) {
        case 1:
          pic = wall;
          createCell(i, j, w, h + 8, pic, w * j + (w - block.width) / 2, h * i + (h - block.height) / 2 - 5, 1, '', animatedType,);
          break;
        case 2:
          pic = ball;
          createCell(i, j, w - 12, h - 18, pic, w * j + (w - block.width) / 2 + 8, h * i + (h - block.height) / 2 + 8, 2, '', animatedType);
          break;
        case 3:
          pic = box;
          createCell(i, j, w, h + 8, pic, w * j + (w - block.width) / 2, h * i + (h - block.height) / 2 - 5, 3, '', animatedType);
          break
        case 5:
          pic = ball;
          createCell(i, j, w - 12, h - 18, pic, w * j + (w - block.width) / 2 + 8, h * i + (h - block.height) / 2 + 8, 2, '', animatedType);
          pic = box;
          createCell(i, j, w, h + 8, pic, w * j + (w - block.width) / 2, h * i + (h - block.height) / 2 - 5, 5, 'OK!', animatedType);
          break;
        case 4:
          pic = role;
          rolePosition.row = i;
          rolePosition.col = j;
          createCell(i, j, w, h + 16, pic, w * j + (w - block.width) / 2, h * i + (h - block.height) / 2 - 10, 4, '', animatedType);
          break;
        case 6:
          pic = ball;
          createCell(i, j, w - 12, h - 18, pic, w * j + (w - block.width) / 2 + 8, h * i + (h - block.height) / 2 + 8, 2);
          pic = role
          createCell(i, j, w, h + 16, pic, w * j + (w - block.width) / 2, h * i + (h - block.height) / 2 - 10, 6, '', animatedType);
          break
      }
    }
  }
}

/**
   * 
   * @param {*} width 图片宽
   * @param {*} height 图片高
   * @param {*} bgImg 图片资源路径
   * @param {*} left 图片定位left像素值
   * @param {*} top 图片定位top像素值
   * @param {*} debugNum debug模式显示的数
   * @param {*} exactText 图片显示的文本
   * @param {*} animatedType 动画类型
   */
function createCell(i, j, width, height, bgImg, left, top, debugNum, exactText, animatedType) {
  let _div = document.createElement("div");
  _div.style.width = width + "px";
  _div.style.height = height + "px";
  _div.style.position = "absolute";
  _div.style.left = left + "px";
  _div.style.top = top + "px";
  _div.style.background = "url(" + bgImg.src + ")";
  _div.style.backgroundSize = "100% 100%";
  _div.style.cursor = 'auto';
  _div.style.transition = "top 0.3s, left 0.3s";

  // 游戏元素层级
  if (debugNum == 1 || debugNum == 3 || debugNum == 5 || debugNum == 4 || debugNum == 6) {
    _div.style.zIndex = i * 16 + j + 1
  }

  // 游戏人物元素标识
  if (debugNum == 4 || debugNum == 6) {
    _div.eleName = 'role'
  }

  // 游戏id -- 用于图片的移动
  if (debugNum != 2 && debugNum != 0) {
    _div.id = `${i},${j}`
  }

  // 游戏元素加载动画
  if (animatedType != undefined) {
    if (debugNum == 1) {
      _div.style.animation = `${animatedType} .8s ease-in-out`
    }
    if (debugNum == 3 || debugNum == 5) {
      _div.style.animation = `${animatedType} 1s ease-in-out`
    }
    if (debugNum == 4) {
      _div.style.animation = `${animatedType} 1.4s ease-in-out`
    }

  }

  //OKs
  if (exactText != undefined) {
    _div.style.lineHeight = '38px'
    _div.style.color = '#0f0'
    _div.style.fontWeight = 'bold'
    _div.style.fontSize = '16px'
    _div.style.textAlign = 'center'
    _div.style.webkitTextStroke = '#333333'
    _div.style.webkitTextStrokeWidth = '1px'
    _div.innerText = exactText
  }

  // debug
  if (debug_model_1 || debug_model_2) {
    _div.style.border = "1px solid #00000044"
    if (debug_model_1) {
      _div.innerHTML = i + "/" + j
    } else {
      if (debugNum != undefined) {
        _div.innerHTML = debugNum
      }
    }
    _div.style.lineHeight = '38px'
    _div.style.color = 'red'
    _div.style.fontSize = '16px'
    _div.style.textAlign = 'center'
  }
  oGameActive.appendChild(_div);
}

function point(row, col) {//该函数记录游戏元素的在二维数组中的位置（row，col）
  this.row = row;
  this.col = col;
}

