import { oGameActive } from "./initDOM.js"
import { initGameArea } from "./initMap.js"
import { initGameEle } from "./initMap.js"
import { oStepInfoText } from "./initDOM.js"
import { oGameRestBoxText } from "./initDOM.js"
import { oBGPullBox } from "./initDOM.js"
import { oBGPull } from "./initDOM.js"

export function go(direction) {
  switch (direction) {
    case left:
      role = left
      p1 = new point(rolePosition.row, rolePosition.col - 1)
      p2 = new point(rolePosition.row, rolePosition.col - 2)
      break
    case up:
      role = up
      p1 = new point(rolePosition.row - 1, rolePosition.col)
      p2 = new point(rolePosition.row - 2, rolePosition.col)
      break
    case right:
      role = right
      p1 = new point(rolePosition.row, rolePosition.col + 1)
      p2 = new point(rolePosition.row, rolePosition.col + 2)
      break
    case down:
      role = down
      p1 = new point(rolePosition.row + 1, rolePosition.col)
      p2 = new point(rolePosition.row + 2, rolePosition.col)
      break
  }

  // 拿到结果，是推还是走
  var result = getGoType(p1, p2)
  var oRole = document.getElementById(`${rolePosition.row},${rolePosition.col}`)
  var oP1 = document.getElementById(`${p1.row},${p1.col}`)

  // 判断是 不能走 && 单纯走路 && 推箱子走
  switch (result) {
    case -1:
      //不能移动，人物推一下墙
      pullTransition(oRole, direction, false)
      break
    case 1:
      Walk()//前走一步
      moveTransition(oRole, direction)//人物前走一步动画
      enterHistory()//载入历史

      break
    case 2:
      // 在此之前已经通过了getGotType()方法知道p1是箱子了,不用重复判断
      if (gameChangeArr[p2.row][p2.col] == 2) {
        Walk()//前走一步
        moveTransition(oRole, direction)//人物前走一步动画
        gameChangeArr[p2.row][p2.col] = 5//推箱子进陷阱里
        pullTransition(oRole, direction, true)//人物推箱子动画
        moveTransition(oP1, direction)//箱子移动动画
        oP1.classList.add('fontAppear')//渐显OK字样
        oP1.innerText = ''//渐显OK字样
        oP1.setAttribute('text', 'OK!')//渐显OK字样
        oBGPullBox.play()//推进陷阱音效
        enterHistory()//载入历史
      } else if (gameChangeArr[p2.row][p2.col] == 0) {
        Walk()//前走一步
        moveTransition(oRole, direction)//人物前走一步动画
        gameChangeArr[p2.row][p2.col] = 3// 推箱子在空地上
        pullTransition(oRole, direction, true)//人物推箱子动画
        moveTransition(oP1, direction)//箱子移动动画
        oP1.classList.remove('fontAppear')//渐显OK字样
        oP1.innerText = ''//渐显OK字样
        oBGPull.play()//推箱子的音效
        enterHistory()//载入历史
      }
      break
  }
  updateRestBox()

  // 走的函数
  function Walk() {
    if (isOnBall) {//如果玩家在陷阱上
      gameChangeArr[rolePosition.row][rolePosition.col] = 2//玩家当前位置还原成陷阱
      isOnBall = false//不在陷阱上了
    } else {
      gameChangeArr[rolePosition.row][rolePosition.col] = 0//玩家当前位置为路
    }
    if (gameChangeArr[p1.row][p1.col] == 2 || gameChangeArr[p1.row][p1.col] == 5) {//如果第一格是陷阱或者是最终箱子
      gameChangeArr[p1.row][p1.col] = 6//第一格变成人+陷阱
      isOnBall = true//踩在陷阱上了
    } else {
      gameChangeArr[p1.row][p1.col] = 4//第一格变成人
    }
    // 更新人物步数
    oStepInfoText.innerText = `${++step}\t步`
    // 更新人物row,col
    rolePosition = p1
  }


  /**
   * 人物推箱子动画
   * @param {*} pullObj 要移动的对象
   * @param {*} direction 移动的方向
   * @param {*} canPull 是否会移动成功
   */
  function pullTransition(pullObj, direction, canPull) {
    switch (direction) {
      case left:
        pullObj.style.background = `url(${direction.src}pull.png)`;
        pullObj.style.backgroundSize = "100% 100%";
        break
      case up:
        pullObj.style.background = `url(${direction.src}pull.png)`;
        pullObj.style.backgroundSize = "100% 100%";
        break
      case right:
        pullObj.style.background = `url(${direction.src}pull.png)`;
        pullObj.style.backgroundSize = "100% 100%";
        break
      case down:
        pullObj.style.background = `url(${direction.src}pull.png)`;
        pullObj.style.backgroundSize = "100% 100%";
        break
    }
    if (!canPull) { //如果不能移动成功，推一下墙给玩家提示
      setTimeout(() => {
        pullObj.style.background = `url(${direction.src})`;
        pullObj.style.backgroundSize = "100% 100%";
      }, 200)
    }
  }


  /**
   * DOM元素移动
   * @param {*} moveObj 要移动的对象
   * @param {*} direction 要移动的方向
   */
  function moveTransition(moveObj, direction) {
    let idArr = moveObj.id.split(',') //根据逗号分割字符串到数组
    idArr[0] = parseInt(idArr[0]) //数组元素变为整数
    idArr[1] = parseInt(idArr[1]) //数组元素变为整数
    switch (direction) {
      //对应方向移动 并且 更新id
      case left:
        moveObj.style.left = `${parseInt(moveObj.style.left) - 38}px`
        moveObj.id = `${idArr[0]},${idArr[1] -= 1}`
        break
      case up:
        moveObj.style.top = `${parseInt(moveObj.style.top) - 38}px`
        moveObj.id = `${idArr[0] -= 1},${idArr[1]}`
        break
      case right:
        moveObj.style.left = `${parseInt(moveObj.style.left) + 38}px`
        moveObj.id = `${idArr[0]},${idArr[1] += 1}`
        break
      case down:
        moveObj.style.top = `${parseInt(moveObj.style.top) + 38}px`
        moveObj.id = `${idArr[0] += 1},${idArr[1]}`
        break
    }
    isRoleDoSomething()//如果移动的是人
    updateZIndex()//更新图片显示层级
    function isRoleDoSomething() {
      if (moveObj.eleName === 'role') { //判断是不是人 
        moveObj.style.background = `url(${direction.src})`;//改变人物方向图片
        moveObj.style.backgroundSize = "100% 100%"; //图片铺满
      }
    }
    function updateZIndex() {
      // 层级关系规则： 左小右大，上小下大
      moveObj.style.zIndex = idArr[0] * 16 + idArr[1] + 1
    }

  }

}

/**
 * 
 * @param {*} p1 玩家要移动的前第一格
 * @param {*} p2 玩家要移动的前第二格
 * 
 * 能走的情况:
 *  p1==地板/球  
 *  p1==箱子/最终状态 && p2==地板/球
 *   
 * 不能走的情况:
 *  p1==墙
 *  p1==箱子/最终状态 && p2==箱子
 *  p1==箱子/最终状态 && p2==墙
 */
function getGoType(p1, p2) {
  // 超出边界
  if (p1.row < 0 || p1.row >= gameChangeArr.length || p1.col < 0 || p1.col >= gameChangeArr[0].length ||
    p2.row < 0 || p2.row >= gameChangeArr.length || p2.col < 0 || p2.col >= gameChangeArr[0].length) {
    return -1;
  }
  // 可以走
  if (gameChangeArr[p1.row][p1.col].canThrough()) {
    return 1;
  }
  // 可以推  
  if (gameChangeArr[p1.row][p1.col].isBox() && gameChangeArr[p2.row][p2.col].canThrough()) {
    return 2;
  }
  // 其它情况一律不走
  return -1;
}

function point(row, col) {//该函数记录游戏元素的在二维数组中的位置（row，col）
  this.row = row;
  this.col = col;
}

Number.prototype.isBox = function () {
  return (this == 3) || (this == 5);
};

Number.prototype.canThrough = function () {
  return (this == 0) || (this == 2);
};

export function updateMap(animatedType) {
  oGameActive.innerHTML = ''//清空游戏所有元素
  initGameArea(gameAreaArr);//初始化地板
  initGameEle(gameChangeArr, animatedType);//初始化游戏元素
  updateRestBox()//更新剩余箱子数量
}

export function updateRestBox() {//更新游戏信息--剩余箱子数量
  for (let i = 0; i < gameChangeArr.length; i++) {
    for (let j = 0; j < gameChangeArr[i].length; j++) {
      if (gameChangeArr[i][j] == 2 || gameChangeArr[i][j] == 6) {
        currentBoxCount++
      }
    }
  }
  oGameRestBoxText.innerHTML = `${currentBoxCount}\t个`
  currentBoxCount = 0
}

function enterHistory() {//载入历史方法
  history.maps.push(copyArr(gameChangeArr))//载入地图
  history.role.push(role)//载入人物方向
  history.isOnBall.push(isOnBall)//载入是否是踩在陷阱
  history.rolePosition.push(rolePosition)//载入人物坐标
}