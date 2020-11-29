import "../css/main.min.css";

//用于存储数据及按分类保存数据标号
let data = {
  time: [], //按时间顺序存入每个数据的唯一标号
  degree: { //重要程度分三类，分别存入唯一标号
    important: [],
    normal: [],
    unimportant: []
  },
  unaccomplished: null,
  complete: null,
  number: {
    unaccomplished: 0,
    complete: 0
  },
  get data() {
    return JSON.parse(localStorage.getItem('todoList'));
  },
  set data(data) {
    let temp = JSON.parse(localStorage.getItem('todoList'));
    data.index = temp.length; //把数据的长度当做每个数据的唯一标号，只要增加数据长度一定会变
    data.time = Date.now();
    let flagAdd = true; //用于判断是否有重复的数据，有重复数据则不存储
    for (let i = 0; i < temp.length; i++) {
      if (temp[i].value === data.value) {
        flagAdd = false
      }
      
    }
    if (flagAdd === true) {
      this.time.push(data.index);
      this.degree[data.degree].push(data.index);
      temp.push(data);
      localStorage.setItem('todoList', JSON.stringify(temp));
      this.addshow(createLI(data.value, data.index), data.flag === true ? 'complete' : 'unaccomplished')
    }
    // console.log(localStorage.getItem('todoList'));
    // return flagAdd
  },
  addValue: function (temp) {
    if (!('degree' in temp)) {
      temp.degree = 'normal';
    }
    if (!('flag' in temp)) {
      temp.flag = false;
    }
    this.data = temp;
  },
  removeValue: function (e) {
    let value = e.target.parentElement.parentElement.className === 'un' ? 'unaccomplished' : 'complete';
    let temp = this.data;
    console.log(temp)
    for (let i = 0; i < temp.length; i++) {
      // console.log(i)
      // console.log(temp[i].index, e.target.parentElement.getAttribute('data-index'))
      if (temp[i].index === parseInt(e.target.parentElement.getAttribute('data-index'))) {
        temp.splice(i, 1);
        this.removeshow(e.target.parentElement,value);
        localStorage.setItem('todoList', JSON.stringify(temp));
        return
      }
    }
    
  },
  updateValue: function (el) {
    let temp = JSON.parse(localStorage.getItem('todoList'));
    for (let i = 0; i < temp.length; i++) {
      if (temp[i].index === parseInt(el.getAttribute('data-index'))) {
        temp[i].flag = !temp[i].flag;
        let new_li = createLI(temp[i].value, temp[i].index, temp[i].flag);
        this.removeshow(el, temp[i].flag === false ? 'complete' : 'unaccomplished', new_li);
        localStorage.setItem('todoList', JSON.stringify(temp));
        return
      }
    }
    
  },
  addshow: function (li, type) {
    // console.log(li)
    this.number[type]++;
    // console.log(`${this[type].offsetHeight + 40}px`);
    this[type].style.height = `${this.number[type] * 40}px`;
    this[type].appendChild(li);
      setTimeout(() => {
        li.style.marginTop = '0';
      }, 10)
  },
  removeshow: function(li, type, new_li) {
    // console.log(this[type])
    // console.log(this[type],li)
    li.classList.add('update');
    this.number[type]--;
    this[type].removeChild(li);
    this[type].style.height = `${this.number[type] * 40}px`;
    if(new_li) {

      setTimeout(() => {
        // new_li.classList.remove('update');
        // new_li.style.marginTop = '-40px'
        type === 'complete' ? this.addshow(new_li,'unaccomplished') : this.addshow(new_li, 'complete')
      }, 100)
    }
  },
  init: function () {
    if (localStorage.getItem('todoList') === null) {
      localStorage.setItem('todoList', JSON.stringify([]));
    };
    let arr = this.data;
    for (let i = 0; i < arr.length; i++) {
      this.time.push(arr[i].index);
      this.degree[arr[i].degree].push(arr[i].index);
      // setTimeout(() => {
        this.addshow(createLI(arr[i].value, arr[i].index, arr[i].flag), arr[i].flag === true ? 'complete' : 'unaccomplished');
        // console.log('创建li')
      // }, i * 500)
    }
    
  },
  changeSort: function(type) {
    this.number.unaccomplished = 0;
    this.number.complete = 0;
    if(type === '时间') {
      let arr = this.data;
      for (let i = 0; i < arr.length; i++) {
        // setTimeout(() => {
          this.addshow(createLI(arr[i].value, arr[i].index, arr[i].flag), arr[i].flag === true ? 'complete' : 'unaccomplished');
          // console.log('创建li')
        // }, i * 500)
      }
    }else if(type === '重要程度') {
      let temp = ['important', 'normal', 'unimportant'];

      for(let i = 0; i < temp.length; i++) {
        for(let j = 0; j < this.degree[temp[i]].length; j++) {
          // console.log(this.degree[temp[i]]);
          console.log(this.degree[temp[i]][j]);
          this.addshow(createLI(this.data[this.degree[temp[i]][j]].value, this.data[this.degree[temp[i]][j]].index, this.data[this.degree[temp[i]][j]].flag), this.data[this.degree[temp[i]][j]].flag === true ? 'complete' : 'unaccomplished')
        } 
      }
    }
  }
}


//初始化函数
function init() {
  let ul_un = document.querySelector('#unaccomplished ul');
  let ul_co = document.querySelector('#complete ul');
  data.unaccomplished = ul_un;
  data.complete = ul_co;

  //下拉框事件
  let select = document.querySelector('.select ul');
  let options = document.querySelectorAll('.select .option');
  let typei = 'normal'

  select.addEventListener('click', (event) => {
    for(let i = 0; i < options.length; i++) {
      options[i].style.zIndex = 0;
    }
    typei = event.target.getAttribute('data-typei')
    event.target.style.zIndex = 1;
    select.classList.toggle('hover');
    // select.classList.remove('hover');
  })

  let readinput = document.querySelector('#readinput');
  let buttoninput = document.querySelector('#buttoninput');
  //监听输入框事件
  readinput.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      event_input();
    }
  })
  buttoninput.addEventListener('click', () => {
    event_input()
  })
  function event_input() {
    let o = {};
      o.value = readinput.value;
      console.log(readinput.value.trim())
      if(readinput.value.trim() !== '') {
        o.degree = typei;
        data.addValue(o);
        console.log(data);
        readinput.value = ''
      }
  }

  data.init();

  let sort_span = document.querySelector('#unaccomplished .sort');
  sort_span.addEventListener('click', (e) => {
    sort(e, ul_un, ul_co)
  })
}
function sort(e, ul_un, ul_co) {
  ul_un.innerHTML = '';
  ul_co.innerHTML = '';
  console.log(e.target.innerText);
  if(e.target.innerText === '时间') {
    data.changeSort('重要程度');
    e.target.innerText = '重要程度'
  } else if(e.target.innerText === '重要程度') {
    data.changeSort('时间');
    e.target.innerText = '时间'
  }
  
}
// 删除按钮事件
function delete_button(e) {
  console.log(e);
  data.removeValue(e);
}
//对勾切换
function tick_update(e, tick_context, x) {
  if(e.target.parentElement.parentElement.className = 'un') {
    tick_animation(tick_context, x);
  } else {
    tick_clear(tick_context)
  }
  data.updateValue(e.target.parentElement);
}
// 对勾绘制动画
function tick_animation(tick_context, x) {
  if (x < 50) {
    tick_context.beginPath();
    tick_context.lineWidth = 5
    tick_context.save();
    tick_context.moveTo(x - 10, x + 20);
    x = x + 5
    tick_context.lineTo(x - 10, x + 20);
    tick_context.stroke();
    tick_context.restore();
    // requestAnimationFrame(tick_animation.bind(null, tick_context, x));
    requestAnimationFrame(() => {
      tick_animation(tick_context, x)
    })
  } else if (x >= 50 && x < 100) {
    let y = -x + 100;
    tick_context.beginPath();
    tick_context.lineWidth = 5
    tick_context.save();
    tick_context.moveTo(x - 10, y + 20);
    x = x + 5;
    y = -x + 100
    tick_context.lineTo(x - 10, y + 20);
    tick_context.stroke();
    tick_context.restore();
    // requestAnimationFrame(tick_animation.bind(null, tick_context, x));
    requestAnimationFrame(() => {
      tick_animation(tick_context, x)
    })
  }
}
// 清除canvas
function tick_clear(tick_context) {
  tick_context.fillRect(0, 0, 100, 100);
  tick_context.clearRect(5, 5, 90, 90);
}

//定义创建li的函数
function createLI(text, index, flag = false) {
  let li = document.createElement('li');
  li.setAttribute('data-index', index);
  li.style.marginTop = '-40px';
  let tick = document.createElement('canvas');
  tick.id = 'tick';
  tick.width = '100';
  tick.height = '100';
  let tick_context = tick.getContext('2d');

  tick_context.fillStyle = 'white';
  tick_context.fillRect(0, 0, 100, 100);
  tick_context.clearRect(5, 5, 90, 90);
  // let x = 20; //画线的x轴初始位置
  
  tick.addEventListener('click', (e) => {
      tick_update(e, tick_context, 20);
  })
  let span = document.createElement('span');
  span.innerHTML = text;
  let button = document.createElement('div');
  button.className = 'btn-delete';
  button.innerText = 'X';
  button.addEventListener('click', (e) => {
    delete_button(e)
  })
  li.appendChild(tick);
  li.appendChild(span);
  li.appendChild(button);
  if(flag) {
    tick_animation(tick_context, 20)
  }
  return li
}


init();