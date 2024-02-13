let step = 0;//步数
let gameTime = 0;//游戏时间
let interval;//定时器
let moveEnabled = true//人物是否能移动
let w = 38, h = 38;//每个图片的宽高
let p1, p2;//第一格，第二格
let isOnBall = false;//人物是否在陷阱上
let oPassActive;//通关后的div窗口对象
let debug_model_1 = false
let debug_model_2 = false
let block, wall, box, role, ball, down, left, right, up;//图片
let rolePosition //人物坐标
let level = 1;//当前关卡
let musicToggle = false //音乐按钮开关
let gameAreaArr //游戏模板数组
let gameChangeArr //游戏实时数组
let currentBoxCount = 0//当前关卡的箱子数
let switch_ = true//切换按钮
let copyArr = gameChangeArr => (JSON.parse(JSON.stringify(gameChangeArr)))//深拷贝函数
let maps = mapArrs()//拿到游戏区域数组
let history = {//历史
  maps: [],//地图历史
  role: [],//人物方向历史
  isOnBall: [],//是否在陷阱上
  rolePosition: [],//人物坐标
}

