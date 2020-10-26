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
  removeValue: function (index) {
    for (let i = 0; i < this.time.length; i++) {
      if (this.data[i].index === index) {
        this.data.splice(i, 1);
        return;
      }
    }
  },
  updateValue: function (el) {
    let temp = JSON.parse(localStorage.getItem('todoList'));
    for (let i = 0; i < temp.length; i++) {
      if (temp[i].index === parseInt(el.getAttribute('data-index'))) {
        temp[i].flag = !temp[i].flag
        let new_li = createLI(temp[i].value, temp[i].index, temp[i].flag)
        this.removeshow(el, temp[i].flag === false ? 'complete' : 'unaccomplished', new_li);
        continue;
      }
    }
    localStorage.setItem('todoList', JSON.stringify(temp));
  },
  addshow: function (li, type) {
    this[type].appendChild(li);
      setTimeout(() => {
        li.style.marginTop = '0';
      }, 10)
  },
  removeshow: function(li, type, new_li) {
    li.classList.add('update');
    setTimeout(() => {
      this[type].removeChild(li);
      // new_li.classList.remove('update');
      // new_li.style.marginTop = '-40px'
      type === 'complete' ? this.addshow(new_li,'unaccomplished') : this.addshow(new_li, 'complete')
    }, 500)
    
  },
  init: function () {
    if (localStorage.getItem('todoList') === null) {
      localStorage.setItem('todoList', JSON.stringify([]));
    };
    let arr = this.data;
    for (let i = 0; i < arr.length; i++) {
      this.time.push(arr[i].index);
      this.degree[arr[i].degree].push(arr[i].index);
      this.addshow(createLI(arr[i].value, arr[i].index, arr[i].flag), arr[i].flag === true ? 'complete' : 'unaccomplished')
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
  //监听输入框事件
  readinput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      let o = {};
      o.value = this.value;
      o.degree = typei;
      data.addValue(o);
      console.log(data);
    }
  })

  data.init();
  console.log(data)
}
//更新函数
function update(o) {
  let li = document.createElement('li');
  li.setAttribute('data-index', o.index);

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
  let x = 20; //画线的x轴初始位置
  function tick_animation() {
    if (x < 50) {
      tick_context.beginPath();
      tick_context.lineWidth = 5
      tick_context.save();
      tick_context.moveTo(x - 10, x + 20);
      x = x + 5
      tick_context.lineTo(x - 10, x + 20);
      tick_context.stroke();
      tick_context.restore();
      requestAnimationFrame(tick_animation);
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
      requestAnimationFrame(tick_animation)
    }
  }
  function tick_clear() {
    console.log('清空')
    tick_context.fillRect(0, 0, 100, 100);
    tick_context.clearRect(5, 5, 90, 90);
  }
  tick.addEventListener('click', function (e) {
    if(e.target.parentElement.parentElement = 'un') {
      tick_animation();
    } else {
      tick_clear()
    }
    
    data.updateValue(e.target.parentElement);
  })
  let span = document.createElement('span');
  span.innerHTML = text;
  let button = document.createElement('div');
  button.className = 'btn-delete';
  button.innerText = 'X';
  li.appendChild(tick);
  li.appendChild(span);
  li.appendChild(button);
  if(flag) {
    tick_animation()
  }
  return li
}


init();