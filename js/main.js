//基本element获取
let inputText = document.querySelector(".heard .heard-main .inputText input")
let ul_ongoing = document.querySelector(".main .ongoing ul");
let ul_done = document.querySelector(".main .done ul");
let ongoingText = document.querySelector(".main .ongoing-text .count");
let doneText = document.querySelector(".main .done-text .count");
let text_going = document.querySelector(".main .ongoing-text");
let text_done = document.querySelector(".main .done-text");
let dropData = null;

updateLi(ul_ongoing, ul_done);
allowDrop(text_going);
allowDrop(text_done);

text_going.addEventListener("drop", function(event) {
  let data = dropData;
  dropData = null;
  let dataJson = JSON.parse(localStorage.getItem("todo"));
  // console.log(dataJson);
  dataJson[data].flag = false;
  localStorage.setItem("todo", JSON.stringify(dataJson));
  updateLi(ul_ongoing, ul_done);
})

text_done.addEventListener("drop", function(event) {
  let data = dropData;
  dropData = null;
  let dataJson = JSON.parse(localStorage.getItem("todo"));
  // console.log(dataJson);
  dataJson[data].flag = true;
  localStorage.setItem("todo", JSON.stringify(dataJson));
  updateLi(ul_ongoing, ul_done);
})

let placeholderIndex = 0;
let text = "";
let showText = setInterval(function() {
  let attriBute = ["请", "输", "入", "计", "划", "进", "行", "的", "事", "项"];
  text += attriBute[placeholderIndex];
  inputText.setAttribute("placeholder", text);
  placeholderIndex === attriBute.length-1 ? clearInterval(showText) : placeholderIndex++;
}, 200)

if(localStorage.getItem("todo") === null) {
  localStorage.setItem("todo", JSON.stringify([]))
}
inputText.addEventListener("keydown", function(event) {
  if(event.keyCode === 13 && inputText.value.trim() !== "") {
    setLi();
  }
})
//添加函数
function setLi() {
  let text = inputText.value;
  let dataJson = JSON.parse(localStorage.getItem("todo"));
  dataJson.push({title:text,flag:false});
  localStorage.setItem("todo", JSON.stringify(dataJson));
  updateLi(ul_ongoing, ul_done)
}
//页面组件更新函数
function updateLi(element, ul_done) {
  element.innerHTML = "";
  ul_done.innerHTML = "";
  let valuei = JSON.parse(localStorage.getItem("todo"));
  let count_ongoing = 0;
  let count_done = 0;
  if(valuei !== null){
  for(let i = valuei.length - 1; i >= 0; i--) {
    if(valuei[i].flag === false) {
      element.innerHTML += "<li draggable='true'><input type='checkbox' class='checkbox' ></input> <span>" + valuei[i].title + "</span> <button class='delete' data-index="+ i + ">删除</button></li>";
      count_ongoing++;
    }else {
      ul_done.innerHTML += "<li draggable='true'><input type='checkbox' class='checkbox' checked></input> <span>" + valuei[i].title + "</span> <button class='delete' data-index="+ i + ">删除</button></li>";
      count_done++;
    }
  }
  ongoingText.innerHTML = count_ongoing;
  doneText.innerHTML = count_done;
  let btn = document.querySelectorAll(".delete");
  let checkBox = document.querySelectorAll(".checkbox");
  for(let i = 0; i < btn.length; i++) {
    btn[i].addEventListener("click", function(valuei) {
      let index = this.getAttribute("data-index");
      // console.log(index);
      let dataJson = JSON.parse(localStorage.getItem("todo"));
      dataJson.splice(index, 1) ;
      localStorage.clear();
      localStorage.setItem("todo", JSON.stringify(dataJson));
      updateLi(element, ul_done);
    })
    btn[i].addEventListener("mouseenter", function() {
      this.style.cursor = "pointer";
    })
    checkBox[i].addEventListener("click", function(valuei, event) {
      let index = this.nextSibling.nextSibling.nextSibling.nextSibling.getAttribute("data-index");
      // console.log(index);
      let dataJson = JSON.parse(localStorage.getItem("todo"));
      dataJson[index].flag = !dataJson[index].flag;
      localStorage.clear();
      localStorage.setItem("todo", JSON.stringify(dataJson));
      updateLi(element, ul_done);
    })
    checkBox[i].addEventListener("mouseenter", function() {
      this.style.cursor = "pointer";
    })
  }
  let li = document.querySelectorAll(".main ul li");
  let timeEnter = 0;
  let timeLeave = 0;
  for(let i = 0; i < li.length; i++) {
    li[i].addEventListener("mouseenter", function(event) {
      timeEnter = new Date();
      timeEnter = timeEnter.getTime();
      this.style.cursor = "move";
      this.style.color = "#ffffff";
  })
  li[i].addEventListener("mouseleave", function() {
    timeLeave = new Date();
    timeLeave = timeLeave.getTime();
    let time = 0;
    timeLeave - timeEnter > 1000 ? time = 1000 : time = timeLeave - timeEnter;
    setTimeout(function() {
      li[i].style.color = "#000000";
    }, time)
  })
  li[i].addEventListener("dragstart", function() {
    dropData = this.lastChild.getAttribute("data-index");
  }) 
  }
}
}
//取消默认拖动事件
function allowDrop(element) {
  element.addEventListener("dragenter", function(event) {
    event.preventDefault();
  })
  element.addEventListener("dragover", function(event) {
    event.preventDefault();
  })
}
//轮播图
let span = document.querySelectorAll(".heard .heard-main .logo div span");
let div = document.querySelector(".heard .heard-main .logo div");
let leftButton = document.querySelector(".heard .heard-main .logo .left");
let rightButton = document.querySelector(".heard .heard-main .logo .right");
let spanClone = span[0].cloneNode(true);
div.appendChild(spanClone);
let x = 0;
let throllte = true;
let logo = document.querySelector(".logo");
let logo_width = logo.offsetWidth;
//轮播图模拟右按钮点击
rightButton.addEventListener("click", function() {
  if(throllte === true) {
    throllte = false;
  x++;
  if(x === div.childNodes.length) {
    div.style.left = "0px";
    x = 0;
    x++;
  }
  animate(div, -logo_width * x, function() {
    throllte = true;
  });
  }
})
leftButton.addEventListener("click", function() {
  if(throllte === true) {
    throllte = false;
  x--;
  if(x < 0) {
    div.style.left = (div.childNodes.length -1) * -logo_width + "px";
    x = div.childNodes.length - 1;
    x--;
  }
  animate(div, -logo_width * x,function() {
    throllte = true;
  });
  }
})
//录播图计时器
setInterval(function() {
  rightButton.click();
}, 3000);
//缓动动画函数
function animate(object, target, callback) {
  object.timer = setInterval(function() {
    let step =(target - object.offsetLeft) / 10;
    step = step > 0 ? Math.ceil(step) : Math.floor(step);
    object.style.left = object.offsetLeft + step + "px";
    if(object.offsetLeft == target) {
      clearInterval(object.timer);
      callback();
    }
  }, 50)
 
}

//显示天气功能
let weater = document.querySelector(".main .ongoing-text .weater");
let svg = document.querySelector(".main .ongoing-text .weater svg");
let p = document.querySelector(".main .ongoing-text .weater p");
let temperature = document.querySelector(".main .ongoing-text .weater .temperature");
let weater_icon = {
  xue : "#icon-xue",
  lei : "#icon-ziyuan3",
  shachen: "#icon-tianqi-shachen",
  wu : "#icon-tianqi-wumai",
  bingbao : "#icon-tianqi-bingbao",
  yun : "#icon-ziyuan1",
  yu : "#icon-ziyuan2",
  yin : "#icon-yin",
  qing : "#icon-qing",
  yun_night : "#icon-ziyuan"
}
//天气获取
let requestWeater = function() {
  let xhr = new XMLHttpRequest();
  xhr.open("get", "https://tianqiapi.com/free/day?appid=92968218&appsecret=DdBt3gIQ&cityid=101010100", true);
  xhr.send(null);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if(xhr.status >= 200 &&xhr.status < 300 || xhr.status === 304) {
        // weater.style.display = "block";
        let data = JSON.parse(xhr.responseText);
        let wea_img = data.wea_img;
        if(data.wea_img === "yun")
        {
          let date = data.update_time.slice(22, 24);
          if(date >= 18 || date < 4) {
            data.wea_img = "yun_night";
          }
        }  
        svg.innerHTML = "<use xlink:href='" + weater_icon[wea_img] + "'></use>"
        p.innerHTML = data.wea;
        temperature.innerHTML = data.tem + "°C";
      }
    }
  }
}

requestWeater();
//天气获取计时器
setInterval(function() {
  requestWeater();
}, 600000)
//每日一句功能
let quotation = document.querySelector(".main .ongoing-text .quotation ");
window.addEventListener("load", function() {
  quotation.style.left = "-2rem";
})
//每日一句获取函数
let requsetQuoation = function() {
let xhr = new XMLHttpRequest();
xhr.open("post", "https://api.66mz8.com/api/quotation.php?format=json", true);
xhr.send(null);
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4) {
    if(xhr.status >= 200 &&xhr.status < 300 || xhr.status === 304) {
      let data = JSON.parse(xhr.responseText);
      quotation.style.left = "-6rem";
      setTimeout(function() {
        if(data.quotation.length > 25) {
          data.quotation = "不要等每一盏灯都熄灭才期盼光明"
        }
        quotation.innerHTML = data.quotation;
        // console.log(data.quotation);
        quotation.style.left = "-2rem";
      }, 1000)
    }
  }
}
}
//更新每日一句计时器
setInterval(function() {
  requsetQuoation();
}, 30000)