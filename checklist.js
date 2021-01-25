'use strict';

// constants
const list_box = document.querySelector('#LIST_WRAP');
const input_list = document.querySelector('#INPUT_LIST');
const add_btn = document.querySelector('#ADD_BTN');
const delete_btn = document.querySelectorAll('.delete_btn');

let num = localStorage.length;

function firstGetItems() {
  let storage_arr = new Array();

  for (let i = 0; i < num; i++) {
    let storage_key = localStorage.key(i);
    let item = localStorage.getItem(storage_key);
    let item_obj = JSON.parse(item);
    storage_arr[i] = Number(item_obj.date);
  }

  storage_arr.sort();

  for (let j = 0; j < storage_arr.length; j++) {
    let item = localStorage.getItem(`${storage_arr[j]}`);
    let item_obj = JSON.parse(item);
    createList(item_obj.text, item_obj.date, item_obj.check);
  }
}

firstGetItems();

// 입력된 아이템을 localStorage 저장
function saveItems(index, text) {
  localStorage.setItem(
    `${index}`,
    `{"date": "${index}", "text": "${text}", "check": "false"}`
  );
  return localStorage.getItem(`${index}`);
}

// 입력된 아이템 html 태그로 만들기
function createList(text, id, state) {
  const li = document.createElement('li');
  li.setAttribute('data-item', `LIST_${id}`);

  li.innerHTML = `
    <input type="checkbox" id="INPUT_${id}"/><label for="INPUT_${id}">${text}</label>
    <button class="delete_btn"></button>
  `;

  list_box.appendChild(li);

  let chk = li.children[0];

  if (!state) {
    chk.checked = false;
  } else {
    switch (state) {
      case 'true':
        chk.checked = true;
        break;
      case 'false':
      default:
        chk.checked = false;
        break;
    }
  }

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
    createList(items_obj.text, items_obj.date);
    num++;
  }

  input_list.value = '';
  input_list.focus();
}

add_btn.addEventListener('click', () => {
  paintHTML(Number(new Date()));
  // console.log('add',list_arr);
});

input_list.addEventListener('keyup', (event) => {
  if (event.keyCode === 13) {
    paintHTML(Number(new Date()));
    // console.log('add',list_arr);
  }
});

list_box.addEventListener('click', (event) => {
  let target_li = event.target.parentNode;

  // delete item from the list_box & localStorage
  if (event.target.tagName === 'BUTTON') {
    let data_item = target_li.getAttribute('data-item').split('_');
    let list_num = data_item[1];

    event.currentTarget.removeChild(target_li);
    localStorage.removeItem(list_num);
  }

  // update check status
  if (event.target.tagName === 'INPUT') {
    let data_item = target_li.getAttribute('data-item').split('_');
    let list_num = data_item[1];
    let text = target_li.children[1].innerText;

    if (event.target.checked) {
      localStorage.setItem(
        list_num,
        `{"date": "${list_num}", "text": "${text}", "check": "true"}`
      );
    } else {
      localStorage.setItem(
        list_num,
        `{"date": "${list_num}", "text": "${text}", "check": "false"}`
      );
    }
  }
});
