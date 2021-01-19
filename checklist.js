'use strict';

// constants
const list_box = document.querySelector('#LIST_WRAP');
const input_list = document.querySelector('#INPUT_LIST');
const add_btn = document.querySelector('#ADD_BTN');
const delete_btn = document.querySelectorAll('.delete_btn');

let num = localStorage.length;

function firstGetItems() {
  for (let i = 0; i < num; i++) {
    let item = localStorage.getItem(`${i}`);
    let item_obj = JSON.parse(item);
    createList(item_obj.text, item_obj.no);
  }
}

firstGetItems();

// 입력된 아이템을 localStorage 저장
function saveItems(index, text) {
  localStorage.setItem(
    `${text}`,
    `{"no": "${index}", "text": "${text}", "date": "${new Date()}", "check": "false"}`
  );
  return localStorage.getItem(`${index}`);
}

// 입력된 아이템 html 태그로 만들기
function createList(text, id) {
  const li = document.createElement('li');
  li.setAttribute('data-item', `LIST_${id}`);

  li.innerHTML = `
    <input type="checkbox" id="INPUT_${id}"/><label for="INPUT_${id}">${text}</label>
    <button class="delete_btn"></button>
  `;

  list_box.appendChild(li);

  li.scrollIntoView({ block: 'center' });

  // return li;
}

function paintHTML(index) {
  const text = input_list.value;
  if (text === '') {
    alert('추가하고자 하는 아이템을 입력해주세요!');
    input_list.focus();
    return;
  } else {
    let items = saveItems(index, text);
    let items_obj = JSON.parse(items);
    createList(items_obj.text, items_obj.no);
    num++;
  }

  input_list.value = '';
  input_list.focus();
}

add_btn.addEventListener('click', () => {
  paintHTML(num);
  // console.log('add',list_arr);
});

input_list.addEventListener('keyup', (event) => {
  if (event.keyCode === 13) {
    paintHTML(num);
    // console.log('add',list_arr);
  }
});

// delete item from the list_box & list_arr
list_box.addEventListener('click', (event) => {
  let target_li = event.target.parentNode;

  if (event.target.tagName === 'BUTTON') {
    let data_item = target_li.getAttribute('data-item').split('_');
    let list_num = data_item[1];

    event.currentTarget.removeChild(target_li);
    localStorage.removeItem(list_num);
  }
});
