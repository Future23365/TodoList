//用于存储数据及按分类保存数据标号
let data = {
  time: [], //按时间顺序存入每个数据的唯一标号
  degree: { //重要程度分三类，分别存入唯一标号
    important: [],
    normal: [],
    unimportant: []
  },
  get data() {
    return JSON.parse(localStorage.getItem('todoList'));
  },
  set data(data) {
    if(localStorage.getItem('todoList') === null) {
      localStorage.setItem('todoList', JSON.stringify([]));
    }
    let temp = JSON.parse(localStorage.getItem('todoList'));
    data.index = temp.length; //把数据的长度当做每个数据的唯一标号，只要增加数据长度一定会变
    data.time = Date.now();
    let flagAdd = true; //用于判断是否有重复的数据，有重复数据则不存储
    for(let i = 0; i < temp.length; i++) {
      if(temp[i].value === data.value) {
        flagAdd = false
      }
      if(this.time.indexOf(temp[i].index) === -1) {
        this.time.push(temp[i].index);
        this.degree[temp[i].degree].push(temp[i].index);
      }
    }
    flagAdd === true ? temp.push(data) : '';
    localStorage.setItem('todoList', JSON.stringify(temp));
    console.log(localStorage.getItem('todoList'));
  },
  addValue: function(temp) {
    if(!('degree' in temp)) {
      temp.degree = 'normal';
    }
    if(!('flag' in temp)) {
      temp.flag = false;
    }
    this.data = temp;
  },
  removeValue: function(index) {
    for(let i = 0; i < this.time.length; i++) {
      if(this.data[i].index === index) {
        this.data.splice(i, 1);
        return;
      }
    }
  },
  updateValue: function(index) {
    for(let i = 0; i < this.data.length; i++) {
      if(this.data[i].index === index) {
        this.data.flag = ! this.data.flag
        return;
      }
    }
  }
}
//监听输入框事件
// inputText.addEventListener("keydown", function (event) {
//   if(event.key === 'Enter') {
//     let o = {};
//     o.value = this.value;
//     data.addValue(o);
//     console.log(data)
//   }
  
// })

//初始化函数
function init() {

}
//更新函数
function update(o) {
  let li = document.createElement('li');
  li.setAttribute('data-index', o.index);
  
}

//对勾动画
let tick = document.querySelector('#tick');
let tick_context = tick.getContext('2d');

tick_context.fillStyle = 'white';
tick_context.fillRect(0, 0, 100, 100);
tick_context.clearRect(5, 5, 90, 90);
let x = 20; //画线的x轴初始位置
function tick_animation() {
  if(x < 50) {
    console.log(x)
    tick_context.beginPath();
    tick_context.lineWidth = 5
    tick_context.save();
    tick_context.moveTo(x - 10, x + 20);
    x = x + 5
    tick_context.lineTo(x - 10, x + 20);
    tick_context.stroke();
    tick_context.restore();
    requestAnimationFrame(tick_animation);
  } else if(x >= 50 &&x < 100) {
    console.log(x)
    let y = -x + 100;
    tick_context.beginPath();
    tick_context.lineWidth = 5
    tick_context.save();
    tick_context.moveTo(x - 10, y +20);
    x = x + 5;
    y = -x + 100
    tick_context.lineTo(x - 10, y + 20);
    tick_context.stroke();
    tick_context.restore();
    requestAnimationFrame(tick_animation)
  }
}
tick.addEventListener('click', function() {
  tick_animation();
})




