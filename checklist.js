'use strict';

// constants
const list_box = document.querySelector('#LIST_WRAP');
const input_list = document.querySelector('#INPUT_LIST');
const add_btn = document.querySelector('#ADD_BTN');
const delete_btn = document.querySelectorAll('.delete_btn');

// list array
const list_arr = new Array();

let num = 0;

// 입력된 아이템을 array에 저장
function saveItems(text) {
  let list_obj = { no: num, name: text };
  list_arr.push(list_obj);
  localStorage[num] = text;
  num++;
  return list_arr;
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

function paintHTML(arr_num) {
  const text = input_list.value;
  if (text === '') {
    alert('추가하고자 하는 아이템을 입력해주세요!');
    input_list.focus();
    return;
  } else {
    saveItems(text);
    createList(list_arr[arr_num].name, `ITEM_${list_arr[arr_num].no}`);
  }

  input_list.value = '';
  input_list.focus();
}

add_btn.addEventListener('click', () => {
  let index = list_arr.length;
  paintHTML(index);
  // console.log('add',list_arr);
});

input_list.addEventListener('keyup', (event) => {
  if (event.keyCode === 13) {
    let index = list_arr.length;
    paintHTML(index);
    // console.log('add',list_arr);
  }
});

// delete item from the list_box & list_arr
list_box.addEventListener('click', (event) => {
  let target_li = event.target.parentNode;

  if (event.target.tagName === 'BUTTON') {
    event.currentTarget.removeChild(target_li);
    console.log(target_li);

    const data_item = target_li.getAttribute('data-item');
    const list_num = data_item.split('_');
    const itemToFind = list_arr.find(function (item) {
      return item.no == list_num[1];
    });
    const index = list_arr.indexOf(itemToFind);
    if (index > -1) list_arr.splice(index, 1);
  }
  // console.log('delete',list_arr);
  return list_arr;
});
