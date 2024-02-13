import { go } from "./movement.js"
import { oPassActive } from "./initDOM.js"
import { oPassBtns } from "./initDOM.js"
import { oPassStepText } from "./initDOM.js"
import { oPassTimeText } from "./initDOM.js"
import { updateMap } from "./movement.js"
import { oGameBtns } from "./initDOM.js"
import { oStepInfoText } from "./initDOM.js"
import { oTimeInfoText } from "./initDOM.js"
import { oLevelInfoText } from "./initDOM.js"
import { oSwitchBtn } from "./initDOM.js"
import { oSwitchActive } from "./initDOM.js"
import { oMusicBtn } from "./initDOM.js"
import { oMusic } from "./initDOM.js"
import { oBGPass } from "./initDOM.js"
import { oRevokeBtn } from "./initDOM.js"
import { oGameActiveLevelText } from "./initDOM.js"

// 给游戏添加 ↑ ↓ ← → 的监听事件
document.addEventListener('keydown', (e) => {
  if (step == 0) {//从第一步开始计时
    interval = setInterval(() => {
      gameTime += 0.1; // 每次增加0.1秒
      oTimeInfoText.innerText = `${gameTime.toFixed(1)}\t秒`; // 显示到小数点后一位
    }, 100)
  }
  if (moveEnabled) {//判断是否能移动 moveEnabled在显示通关盒子时是false
    switch (e.keyCode) {
      case 37:
        go(left)
        break
      case 38:
        go(up)
        break
      case 39:
        go(right)
        break
      case 40:
        go(down)
        break
    }
    // 如果通关，设置通关Div为可见
    if (isPass()) {
      clearInterval(interval);//停止计时
      oBGPass.play() //播放成功后的音乐
      oPassStepText.innerHTML = `${step}步`
      oPassTimeText.innerHTML = `${gameTime.toFixed(1)}秒`
      oPassActive.style.display = 'inline-block'//显示通关盒子
      moveEnabled = false//不让玩家继续移动
      clearHistory()//清空历史
    }

  }
})

// 重玩两个按钮的监听事件
oPassBtns[0].onclick = () => { goLevel(level) }
oGameBtns[0].onclick = () => { goLevel(level) }

// 上一关两个按钮的监听事件
oPassBtns[1].onclick = () => { level - 1 >= 1 ? goLevel(--level) : null }
oGameBtns[1].onclick = () => { level - 1 >= 1 ? goLevel(--level) : null }

// 下一关两个按钮的监听事件
oPassBtns[2].onclick = () => { level + 1 <= 100 ? goLevel(++level) : null }
oGameBtns[2].onclick = () => { level + 1 <= 100 ? goLevel(++level) : null }

oSwitchBtn.onclick = () => {
  switch_ ? oSwitchActive.style.height = '0px' : oSwitchActive.style.height = '120px'
  switch_ ? oSwitchBtn.style.rotate = '180deg' : oSwitchBtn.style.rotate = '0deg'
  switch_ = !switch_
}

// 音乐按钮
let musicOnSrc = './images/gameButton/音乐.png'
let musicOffSrc = './images/gameButton/音乐关.png'
oMusicBtn.addEventListener('click', () => {
  musicToggle = !musicToggle
  musicToggle ? oMusic.play() : oMusic.pause()
  musicToggle ? oMusicBtn.src = musicOnSrc : oMusicBtn.src = musicOffSrc
})

// 撤回按钮
oRevokeBtn.addEventListener('click', () => {
  if (history.maps.length > 1) {
    // 回到历史中
    gameChangeArr = copyArr(history.maps[history.maps.length - 2])
    role = history.role[history.role.length - 2]
    isOnBall = history.isOnBall[history.isOnBall.length - 2]
    rolePosition = history.rolePosition[history.rolePosition.length - 2]
    // 删除最新的一次历史
    history.maps.pop()
    history.role.pop()
    history.isOnBall.pop()
    history.rolePosition.pop()
    oStepInfoText.innerText = `${--step}\t步`// 人物步数减1
    updateMap('scale') //更新地图
  } else {
    goLevel(level) //回到刚开始
  }
})

export let goLevel = (level) => {
  oPassActive.style.display = 'none'//隐藏通关盒子
  gameAreaArr = copyArr(maps[level - 1])//更新地图
  gameChangeArr = copyArr(gameAreaArr);//更新地图模板
  role = down//人物朝下
  updateMap('falldown')//更新地图 带动画
  isOnBall = false//人物不在陷阱上了
  moveEnabled = true //允许玩家移动
  clearInterval(interval);//清零时间
  oStepInfoText.innerText = `${step = 0}步`// 清零人物步数
  oTimeInfoText.innerText = `${gameTime = 0}秒` //清零游戏时间
  oLevelInfoText.innerText = `第 ${level} 关` //更新关卡数文本
  oGameActiveLevelText.innerText = `第 ${level} 关` //更新游戏区域内的关卡数文本
  clearHistory()//清空历史
}

/*
  遍历二维数组gameAreaArr(地图模板)，和gameChangeArr(地图实时模板)进行比较
  如果地图模板中有一个陷阱，在对应的实时模板中不是箱子(5)，直接返回false
*/
function isPass() {
  for (let i = 0; i < gameAreaArr.length; i++) {
    for (let j = 0; j < gameAreaArr[i].length; j++) {
      if ((gameAreaArr[i][j] == 2 || gameAreaArr[i][j] == 5) && gameChangeArr[i][j] != 5) {
        // debug_model_1 || debug_model_2 ? console.log(`因为${i},${j}不是箱子，没通关！`) : null;
        return false
      }
    }
  }
  return true
}

function clearHistory() {
  for (const key in history) {
    if (Array.isArray(history[key])) {
      history[key].length = 0;
    }
  }
}
