import { firebaseConfig, problem } from './config.js';

/* 基本設定 */
let db;
let user = {};
let problemNumber = 0;

/* 初期化 */
const init = () => {
  initFirebase(); // firebase初期化
  onSetFirebaseListener(); // Firebaseの値の変更を検知
  createProblem(problem[problemNumber]); // 問題1
  
  // ボタンイベント

  // リセット
  document.getElementById('button_reset').addEventListener('click', () => {
    initEditorList(problem[problemNumber].item);
    initEditor(problem[problemNumber].area);
  });
  document.getElementById('button_help').addEventListener('click', onClickHelp); // ヘルプ
  document.getElementById('button_submit').addEventListener('click', checkAnswer); // 解答を確認
  document.getElementById('blocker2').addEventListener('click', events.clickBlocker);                        // ブロッカークリックイベント
  document.getElementById('modal_close').addEventListener('click', events.clickBlocker);                    // モーダル閉クリックイベント
}

/* firebase初期化 */
const initFirebase = () => {
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
  db = firebase.firestore();
}

/* Firebaseの値の変更を検知 */
const onSetFirebaseListener = () => {
  db.collection('controls').doc('main').onSnapshot(doc => {
    const data = doc.data();

    // 更新判定
    if (data.start) {
      initForm();
      initEvents();
    } else {
      createMessage('start_wrap', '現在この講義は開催されていません');
    }

    // Blocker表示判定
    if (data.pause) {
      document.getElementById('blocker').classList.add('is-show');
    } else {
      document.getElementById('blocker').classList.remove('is-show');
    }

    if (data.problem10) {
      problemNumber = 10 - 1;
      createProblem(problem[problemNumber]); // 問題1
    } else if (data.problem9) {
      problemNumber = 9 - 1;
      createProblem(problem[problemNumber]); // 問題1
    } else if (data.problem8) {
      problemNumber = 8 - 1;
      createProblem(problem[problemNumber]); // 問題1
    } else if (data.problem7) {
      problemNumber = 7 - 1;
      createProblem(problem[problemNumber]); // 問題1
    } else if (data.problem6) {
      problemNumber = 6 - 1;
      createProblem(problem[problemNumber]); // 問題1
    } else if (data.problem5) {
      problemNumber = 5 - 1;
      createProblem(problem[problemNumber]); // 問題1
    } else if (data.problem4) {
      problemNumber = 4 - 1;
      createProblem(problem[problemNumber]); // 問題1
    } else if (data.problem3) {
      problemNumber = 3 - 1;
      createProblem(problem[problemNumber]); // 問題1
    } else if (data.problem2) {
      problemNumber = 2 - 1;
      createProblem(problem[problemNumber]); // 問題1
    }
    
  });
}

/* 受付フォーム生成 */
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
  label.innerText = '番号:';
  div.appendChild(label);

  input.setAttribute('type', 'number');
  input.setAttribute('id', 'start_number');
  input.setAttribute('class', 'number_input');
  input.setAttribute('name', 'start_number');
  input.setAttribute('min', '1');
  input.setAttribute('max', '200');
  input.setAttribute('min', '1');
  input.focus();
  div.appendChild(input);

  button.setAttribute('class', 'start_button');
  button.setAttribute('id', 'start_button');
  button.innerText = '開始';
  form.appendChild(button);
  
  parentDiv.innerHTML = '';
  parentDiv.appendChild(form);
}

/* イベント */
const initEvents = () => {

  // 開始
  document.getElementById('start_button').addEventListener('click', () => {
    const value = Number(document.start.start_number.value);

    // 値チェック
    if (!value || value <= 0 || value > 200) {
      alert('正しい番号を入力してください');
      document.start.number.focus();
      return;
    }

    // 表示切り替え
    document.getElementById('editor').style.display = 'grid';
    document.getElementById('start_wrap').style.display = 'none';
    
    // firebaseに追加
    db.collection('users').add({
      id: value,
      page: 0,
      help: false
    }).then(docRef => {
      user.docId = docRef.id;
    }).catch(onError);
  })
}

/* p要素作成 */
const createMessage = (div, message) => {
  const element = document.getElementById(div);
  const p = document.createElement('p');

  p.innerText = message;
  p.setAttribute('class', 'start_message');
  element.innerText = '';
  element.appendChild(p);
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
    snapMode: 'inner',
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

  for (let j = 0; j < problem[problemNumber].answer.length; j++) {
    console.log(result == problem[problemNumber].answer[j]);
    if (result == problem[problemNumber].answer[j]) answer = true;
  }

  answer ?  isAnswerTrue() : isAnswerFalse();
};

const isAnswerTrue = () => {
  document.getElementById('modal_alert').classList.toggle('is-false');
  document.getElementById('modal_text').innerText = '正解！！！';
  document.getElementById('blocker2').classList.toggle('is-show');
  document.getElementById('modal').classList.toggle('is-show');
  db.collection('users').doc(user.docId).update({ page: problemNumber + 1 }).catch(onError); // Firebase更新
};

const isAnswerFalse = () => {
  document.getElementById('modal_alert').classList.add('is-false');
  document.getElementById('modal_text').innerText = '不正解！';
  document.getElementById('blocker2').classList.toggle('is-show');
  document.getElementById('modal').classList.toggle('is-show');
};

/* ヘルプ */
const onClickHelp = () => {
  const time = 10000;

  console.log('help');
  db.collection('users').doc(user.docId).update({ help: true }).catch(onError); // Firebase更新

  setTimeout(() => {
    db.collection('users').doc(user.docId).update({ help: false }).catch(onError); // Firebase更新
  }, time);
}

const onError = error => {
  console.log(`更新に失敗しました (${error})`);
};

function problemBlocker(number) {
  console.log(number);

  // 次の問題がある時
  if (problem[problemNumber + 1]) {
    problemNumber++;
    createProblem(problem[problemNumber]); // 次の問題
    db.collection('users').doc(user.docId).update({ page: problemNumber }).catch(onError); // Firebase更新
  }
}

const events = {
  clickBlocker(e) { // ブロッカークリック時
    if (e.target.tagName === 'DIV' || e.target.tagName === 'SPAN') {
      document.getElementById('blocker2').classList.toggle('is-show');
      document.getElementById('modal').classList.toggle('is-show');
    }
  }
}

init(); 