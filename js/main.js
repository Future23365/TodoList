// 动态添加待办
let inputText = document.querySelector(".heard .heard-main .inputText input")
let ul_ongoing = document.querySelector(".main .ongoing ul");
let ul_done = document.querySelector(".main .done ul");
let ongoingText = document.querySelector(".main .ongoing-text .count");
let doneText = document.querySelector(".main .done-text .count");
updateLi(ul_ongoing, ul_done);

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
  console.log(valuei);
  let count_ongoing = 0;
  let count_done = 0;
  if(valuei !== null){
  for(let i = valuei.length - 1; i >= 0; i--) {
    if(valuei[i].flag === false) {
      element.innerHTML += "<li><input type='checkbox' class='checkbox' ></input> <span>" + valuei[i].title + "</span> <button class='delete' data-index="+ i + ">删除</button></li>";
      count_ongoing++;
    }else {
      ul_done.innerHTML += "<li><input type='checkbox' class='checkbox' checked></input> <span>" + valuei[i].title + "</span> <button class='delete' data-index="+ i + ">删除</button></li>";
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
      // console.log(event);
      localStorage.clear();
      localStorage.setItem("todo", JSON.stringify(dataJson));
      updateLi(element, ul_done);
    })
    checkBox[i].addEventListener("mouseenter", function() {
      this.style.cursor = "pointer";
    })
  }
  let li = document.querySelectorAll(".main ul li");
  for(let i = 0; i < li.length; i++) {
    li[i].addEventListener("mouseenter", function(event) {
      this.style.cursor = "move";
  })
  }
  
}
}