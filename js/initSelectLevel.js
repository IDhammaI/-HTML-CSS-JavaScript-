import { oSelectLevel } from "./initDOM.js";
import { goLevel } from "./initListener.js";

function createLevelActive() {
  // 循环创建 100 个 .selectLevelIndex
  for (let i = 1; i <= 100; i++) {
    // 创建 .selectLevelIndex 元素
    const selectLevelIndex = document.createElement('div');
    selectLevelIndex.className = 'selectLevelIndex';

    // 创建 .selectLevelIndexTop 元素
    const selectLevelIndexTop = document.createElement('div');
    selectLevelIndexTop.className = 'selectLevelIndexTop';
    selectLevelIndexTop.textContent = i;

    // 创建 .selectLevelIndexBottom 元素
    const selectLevelIndexBottom = document.createElement('div');
    selectLevelIndexBottom.className = 'selectLevelIndexBottom';
    if (i <= 20) {
      selectLevelIndexBottom.textContent = '简单';
      selectLevelIndexBottom.style.backgroundColor = '#669966';
    } else if (i <= 40) {
      selectLevelIndexBottom.textContent = '中等';
      selectLevelIndexBottom.style.backgroundColor = '#666699';
    } else if (i <= 60) {
      selectLevelIndexBottom.textContent = '困难';
      selectLevelIndexBottom.style.backgroundColor = '#996666';
    } else if (i <= 80) {
      selectLevelIndexBottom.textContent = '极难';
      selectLevelIndexBottom.style.backgroundColor = '#996633';
    } else {
      selectLevelIndexBottom.textContent = '超级难';
      selectLevelIndexBottom.style.backgroundColor = '#996666';
    }
    selectLevelIndexBottom.style.color = 'white'
    // 将 .selectLevelIndexTop 和 .selectLevelIndexBottom 添加到 .selectLevelIndex 中
    selectLevelIndex.appendChild(selectLevelIndexTop);
    selectLevelIndex.appendChild(selectLevelIndexBottom);

    // 将 .selectLevelIndex 添加到 .selectLevel 中
    oSelectLevel.appendChild(selectLevelIndex);

    selectLevelIndex.style.cursor = 'pointer'
    selectLevelIndex.addEventListener('click', () => {
      goLevel(i)
    })
  }
}

createLevelActive()