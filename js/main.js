// 动态添加待办
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
  console.log(dataJson);
  dataJson[data].flag = false;
  localStorage.setItem("todo", JSON.stringify(dataJson));
  updateLi(ul_ongoing, ul_done);
})

text_done.addEventListener("drop", function(event) {
  let data = dropData;
  dropData = null;
  let dataJson = JSON.parse(localStorage.getItem("todo"));
  console.log(dataJson);
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
function setLi() {
  let text = inputText.value;
  let dataJson = JSON.parse(localStorage.getItem("todo"));
  dataJson.push({title:text,flag:false});
  localStorage.setItem("todo", JSON.stringify(dataJson));
  updateLi(ul_ongoing, ul_done)
}
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
      console.log(index);
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
      console.log(index);
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
function allowDrop(element) {
  element.addEventListener("dragenter", function(event) {
    event.preventDefault();
  })
  element.addEventListener("dragover", function(event) {
    event.preventDefault();
  })
}
let span = document.querySelectorAll(".heard .heard-main .logo div span");
let div = document.querySelector(".heard .heard-main .logo div");
let leftButton = document.querySelector(".heard .heard-main .logo .left");
let rightButton = document.querySelector(".heard .heard-main .logo .right");
let spanClone = span[0].cloneNode(true);
div.appendChild(spanClone);



let x = 0;
let throllte = true;
rightButton.addEventListener("click", function() {
  if(throllte === true) {
    throllte = false;
  x++;
  if(x === div.childNodes.length) {
    div.style.left = "0px";
    x = 0;
    x++;
  }
  animate(div, -320 * x, function() {
    throllte = true;
  });
  }
})
leftButton.addEventListener("click", function() {
  if(throllte === true) {
    throllte = false;
  x--;
  if(x < 0) {
    div.style.left = (div.childNodes.length -1) * -320 + "px";
    x = div.childNodes.length - 1;
    x--;
  }
  animate(div, -320 * x,function() {
    throllte = true;
  });
  }
})

setInterval(function() {
  rightButton.click();
}, 3000);
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
