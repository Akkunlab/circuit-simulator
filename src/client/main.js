import { firebaseConfig } from './config.js';

/* 基本設定 */
let db;
let problemNumber = 0;

/* 初期化 */
const init = () => {
  initFirebase(); // firebase初期化
  initUser();
  createProblem(problems[problemNumber]); // 問題1

  // ボタンイベント
  document.getElementById('button_reset').addEventListener('click', () => { // リセット
    initEditorList(problems[problemNumber].item);
    initEditor(problems[problemNumber].area);
  });
  document.getElementById('button_help').addEventListener('click', onClickHelp); // ヘルプ
  document.getElementById('button_submit').addEventListener('click', checkAnswer); // 解答を確認
  document.getElementById('blocker2').addEventListener('click', events.clickBlocker); // ブロッカークリックイベント
  document.getElementById('modal_close').addEventListener('click', events.clickBlocker); // モーダル閉クリックイベント
}

/* firebase初期化 */
const initFirebase = () => {
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
  db = firebase.firestore();
}

/* ユーザ初期化 */
const initUser = () => {
  const cookieArray = getCookieArray();

  if (cookieArray.id) { // ある場合
    document.getElementById('editor').style.display = 'grid';
    document.getElementById('start_wrap').style.display = 'none';
  } else {
    initForm(); // フォーム生成
  }
}

/* フォーム生成 */
const initForm = () => {
  const form = document.createElement('form');
  const div = document.createElement('div');
  const label = document.createElement('label');
  const input = document.createElement('input');
  const button = document.createElement('button');
  const parentDiv = document.getElementById('start_wrap');

  form.setAttribute('class', 'start_form');
  form.setAttribute('name', 'start');
  form.setAttribute('onsubmit', 'return false;');
  
  div.setAttribute('class', 'number_wrap');
  form.appendChild(div);

  label.setAttribute('for', 'number');
  label.innerText = 'ニックネーム:';
  div.appendChild(label);

  input.setAttribute('type', 'text');
  input.setAttribute('id', 'start_number');
  input.setAttribute('class', 'number_input');
  input.setAttribute('name', 'start_number');
  input.focus();
  div.appendChild(input);

  button.setAttribute('class', 'start_button');
  button.setAttribute('id', 'start_button');
  button.innerText = '開始';
  form.appendChild(button);
  
  parentDiv.innerHTML = '';
  parentDiv.appendChild(form);

  // 開始
  document.getElementById('start_button').addEventListener('click', async() => {
    document.getElementById('editor').style.display = 'grid';
    document.getElementById('start_wrap').style.display = 'none';
    
    const name = document.getElementById('start_number').value;
    const data = await post('/api/adduser', { name });
    createCookie('id', data.id, 7); // Cookie作成
  })
}

/* エディタ初期化 */
const initEditor = item => {
  const parentDiv = document.getElementById('answer_contents');
  let div;

  parentDiv.innerHTML = '';

  for (let i = 0; i < 30; i++) {
    div = document.createElement('div');
    div.setAttribute('class', 'answer_contents_grid');

    if (item[i]) div.style.backgroundImage = `url(${getItemURL(item[i])})`;
  
    parentDiv.appendChild(div);
  }

  // ドラッグ設定
  $('.editor_item').draggable({
    snap: '.answer_contents_grid',
    snapMode: 'inner'
    /*stop: (event, ui) => {
      console.log(ui);
    }*/
  });
}

/* エディタリスト初期化 */
const initEditorList = item => {
  const parentDiv = document.getElementById('editor_item_list');
  let div;

  parentDiv.innerHTML = '';

  for (let i = 0; i < item.length; i++) {
    div = document.createElement('div');
    div.setAttribute('class', 'editor_item');
    div.setAttribute('name', item[i]);
    div.style.backgroundImage = `url(${getItemURL(item[i])})`;
    parentDiv.appendChild(div);
  }
}

/* 問題作成 */
const createProblem = data => {
  document.getElementById('problem_title').innerText = data.title;
  document.getElementById('problem_text').innerText = data.des;
  initEditorList(data.item); // エディタリスト初期化
  initEditor(data.area); // エディタ初期化
}

/* アイテムのURL取得 */
const getItemURL = name => {
  let url;

  switch (name) {
    case 'R': url = 'editor_resistance.png'; break;
    case 'Rr': url = 'editor_resistance_r.png'; break;
    case 'V': url = 'editor_voltage.png'; break;
    case 'Vr': url = 'editor_voltage_r.png'; break;
    case 'L': url = 'editor_led.png'; break;
    case 'Lr': url = 'editor_led_r.png'; break;
    case 'light': url = 'editor_light.png'; break;
    case 'lightr': url = 'editor_light_r.png'; break;
    case 'S': url = 'editor_switch.png'; break;
    case 'Sr': url = 'editor_switch_r.png'; break;
    case 'l': url = 'editor_line.png'; break;
    case 'lr': url = 'editor_line_r.png'; break;
    case 'l1': url = 'editor_line_corner_1.png'; break;
    case 'l2': url = 'editor_line_corner_2.png'; break;
    case 'l3': url = 'editor_line_corner_3.png'; break;
    case 'l4': url = 'editor_line_corner_4.png'; break;
    case 'l5': url = 'editor_line_corner_5.png'; break;
    case 'l6': url = 'editor_line_corner_6.png'; break;
    case 'l7': url = 'editor_line_corner_7.png'; break;
    case 'l8': url = 'editor_line_corner_8.png'; break;
    default: break;
  }

  return `../img/${url}`;
}

/* 解答を確認 */
const checkAnswer = () => {
  let rect, top, left, itemName;
  const children = document.getElementById('editor_item_list').children;
  const unit0 = { x: 503, y: 80 }; // 基準点
  const unitSize = 150; // 1マスのサイズ
  let answer = false;
  let result = '';

  for (let i = 0; i < children.length; i++) {
    itemName = children[i].getAttribute('name');
    rect = children[i].getBoundingClientRect();
    top = Math.round((rect.top + window.pageYOffset - unit0.y) / unitSize);
    left = Math.round((rect.left + window.pageXOffset - unit0.x) / unitSize);

    if (top <= 0 || left <= 0) continue;

    //console.log((rect.left + window.pageXOffset - unit0.x) / unitSize);
    //console.log(top, left);

    //console.log(problem[problemNumber].answer, `${itemName}${top}${left}`);
    result += `${itemName}${top}${left}`;
  }

  console.log(result);

  for (let j = 0; j < problems[problemNumber].answer.length; j++) {
    console.log(result == problems[problemNumber].answer[j]);
    if (result == problems[problemNumber].answer[j]) answer = true;
  }

  answer ?  isAnswerTrue() : isAnswerFalse();
};

const isAnswerTrue = () => {
  document.getElementById('modal_alert').classList.toggle('is-false');
  document.getElementById('modal_text').innerText = '正解！！！';
  document.getElementById('blocker2').classList.toggle('is-show');
  document.getElementById('modal').classList.toggle('is-show');
  problemNumber++; // 次の番号
  createProblem(problems[problemNumber]);
};

const isAnswerFalse = () => {
  document.getElementById('modal_alert').classList.add('is-false');
  document.getElementById('modal_text').innerText = '不正解！';
  document.getElementById('blocker2').classList.toggle('is-show');
  document.getElementById('modal').classList.toggle('is-show');
};

/* ヘルプ */
const onClickHelp = () => {
}

const onError = error => {
  console.log(`更新に失敗しました (${error})`);
};

const events = {
  clickBlocker(e) { // ブロッカークリック時
    if (e.target.tagName === 'DIV' || e.target.tagName === 'SPAN') {
      document.getElementById('blocker2').classList.toggle('is-show');
      document.getElementById('modal').classList.toggle('is-show');
    }
  }
}

/* データをPOST */
const post = async(url, data) => {
  const param  = {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(data)
  };
  const response = await fetch("/api/adduser", param);

  return response.json();
}

/* Cookie配列生成 */
const getCookieArray = () => {
  let data;
  const array = [];

  if (document.cookie) {
      const tmp = document.cookie.split('; ');

      for(let i = 0; i < tmp.length; i++) {
          data = tmp[i].split('=');
          array[data[0]] = decodeURIComponent(data[1]);
      }
  }

  return array;
}

/* Cookie作成 */
const createCookie = (name, value, days) => {
  const expire = new Date(); // 有効期限
  expire.setTime( expire.getTime() + 1000 * 3600 * 24 * days);
  document.cookie = `${name}=${value}; expires=${expire.toUTCString()}`;
}

init(); 