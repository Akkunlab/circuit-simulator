/* 基本設定 */
let user = {
  current: 0
};
let cookieArray = [];

/* 初期化 */
const init = () => {
  initUser(); // ユーザ初期化
  initToastr(); // トースト初期化

  // ボタンイベント
  document.getElementById('button_reset').addEventListener('click', () => { // リセット
    initEditorList(problems[user.current].item);
    initEditor(problems[user.current].area);
    toastr['success'](`問題をリセットしました！`)
  });
  document.getElementById('button_next').addEventListener('click', onClickNext); // 次へ
  document.getElementById('button_replay').addEventListener('click', onClickReplay); // もう一度
  document.getElementById('button_help').addEventListener('click', onClickHelp); // ヘルプ
  document.getElementById('button_submit').addEventListener('click', checkAnswer); // 解答を確認
  document.getElementById('blocker').addEventListener('click', events.clickBlocker); // ブロッカークリックイベント
  document.getElementById('blocker2').addEventListener('click', events.clickBlocker2); // ブロッカークリックイベント
  document.getElementById('modal_close').addEventListener('click', events.clickBlocker); // モーダル閉クリックイベント
  document.getElementById('tutorial_modal_close').addEventListener('click', events.clickBlocker2); // モーダル閉クリックイベント
}

/* ユーザ初期化 */
const initUser = async() => {
  cookieArray = getCookieArray();

  if (cookieArray.id) { // ある場合
    const { data } = await post('/api/getuser', { id: cookieArray.id });
    user = data;
    toastr['success'](`おかえりなさい ${user.name}！`, 'ログイン完了')
    document.getElementById('editor').style.display = 'grid';
    document.getElementById('start_wrap').style.display = 'none';
  } else {
    initForm(); // フォーム生成
  }

  createProblem(problems[user.current]);
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
  label.innerText = 'ニックネーム';
  div.appendChild(label);

  input.setAttribute('type', 'text');
  input.setAttribute('id', 'start_number');
  input.setAttribute('class', 'number_input');
  input.setAttribute('name', 'start_number');
  input.setAttribute('maxlength', 15);
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
    document.getElementById('tutorial_modal').classList.toggle('is-show');
    document.getElementById('blocker2').classList.toggle('is-show');
    
    const name = document.getElementById('start_number').value;
    const data = await post('/api/adduser', { name });
    user.name = name;
    toastr['success'](`ようこそ ${user.name}！`, 'ログイン完了')
    createCookie('id', data.id, 7); // Cookie作成
  })
}

/* トースト初期化 */
const initToastr = () => {
  toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  }
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
    stop: (event) => {
      $(event.target).remove();
    }
  });

  $(".answer_contents_grid").droppable({
    drop: (event, ui) => {
      const cloned = ui.draggable.clone();

      cloned.attr('class', 'editor_item');

      // ドラッグ設定
      cloned.draggable({
        snap: '.answer_contents_grid',
        snapMode: 'inner',
        stop: (event, ui) => {
          $(event.target).remove();
        }
      });

      cloned.css({
        "left": 0,
        "top": 0
      });

      $(event.target).html(cloned);
    }
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
    div.style.border = `solid 3px ${getItemColor(item[i])}`;
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
const getItemURL = (name, grow) => {
  let url;

  if (grow) {
    switch (name) {
      case 'R': url = 'editor_resistance_red.png'; break;
      case 'Rr': url = 'editor_resistance_r_red.png'; break;
      case 'V': url = 'editor_voltage_red.png'; break;
      case 'Vr': url = 'editor_voltage_r_red.png'; break;
      case 'L': url = 'editor_led_red.png'; break;
      case 'Lr': url = 'editor_led_r_red.png'; break;
      case 'light': url = 'editor_light_red.png'; break;
      case 'lightr': url = 'editor_light_r_red.png'; break;
      case 'S': url = 'editor_switch_red.png'; break;
      case 'Sr': url = 'editor_switch_r_red.png'; break;
      case 'l': url = 'editor_line_red.png'; break;
      case 'lr': url = 'editor_line_r_red.png'; break;
      case 'l1': url = 'editor_line_corner_1_red.png'; break;
      case 'l2': url = 'editor_line_corner_2_red.png'; break;
      case 'l3': url = 'editor_line_corner_3_red.png'; break;
      case 'l4': url = 'editor_line_corner_4_red.png'; break;
      case 'l5': url = 'editor_line_corner_5_red.png'; break;
      case 'l6': url = 'editor_line_corner_6_red.png'; break;
      case 'l7': url = 'editor_line_corner_7_red.png'; break;
      case 'l8': url = 'editor_line_corner_8_red.png'; break;
      default: break;
    }
  } else {
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
  }



  return `../img/${url}`;
}

/* アイテムの色を取得 */
const getItemColor = name => {
  let color;

  switch (name) {
    case 'R':
    case 'Rr': color = '#f38e71'; break;
    case 'V':
    case 'Vr': color = '#6e97ff'; break;
    case 'L':
    case 'Lr':
    case 'light':
    case 'lightr': color = '#ffd455'; break;
    case 'S':
    case 'Sr': color = '#77b7b9'; break;
    case 'l':
    case 'lr':
    case 'l1':
    case 'l2':
    case 'l3':
    case 'l4':
    case 'l5':
    case 'l6':
    case 'l7':
    case 'l8': color = '#aa7355'; break;
    default: break;
  }

  return color;
}

/* 解答を確認 */
const checkAnswer = () => {
  let name, top, left;
  const grid = document.getElementsByClassName('answer_contents_grid');
  let answer = false;
  let result = '';

  for (let i = 0; i < grid.length; i++) {
    top = Math.floor(i / 6) + 1;
    left = (i % 6) + 1;

    if (grid[i].firstChild) {
      name = grid[i].firstChild.getAttribute("name");
      result += `${name}${top}${left}`;
    }
  }

  // console.log(result);

  for (let j = 0; j < problems[user.current].answer.length; j++) {
    // console.log(result == problems[user.current].answer[j]);
    if (result == problems[user.current].answer[j]) answer = true;
  }

  answer ?  isAnswerTrue() : isAnswerFalse();
};

const isAnswerTrue = async () => {
  // growCircuit([12, 6, 0, 1, 2, 3, 4, 5, 11, 17, 23, 29, 28, 27, 26, 25, 24, 18], problems[user.current].item);
  document.getElementById('modal_text_AC').style.display = 'block';
  document.getElementById('modal_text_WA').style.display = 'none';
  document.getElementById('blocker').classList.toggle('is-show');
  document.getElementById('modal').classList.toggle('is-show');
  document.getElementById('modal_button').style.display = 'flex';
};

const isAnswerFalse = () => {
  document.getElementById('modal_text_AC').style.display = 'none';
  document.getElementById('modal_text_WA').style.display = 'block';
  document.getElementById('blocker').classList.toggle('is-show');
  document.getElementById('modal').classList.toggle('is-show');
  document.getElementById('modal_button').style.display = 'none';
};

/* ヘルプ */
const onClickHelp = () => {
  document.getElementById('help').classList.toggle('is-show');
}

/* 次へ */
const onClickNext = async() => {
  document.getElementById('blocker').classList.toggle('is-show');
  document.getElementById('modal').classList.toggle('is-show');
  user.current++;
  createProblem(problems[user.current]);
  await post('/api/adddata', { id: cookieArray.id, data: { current: user.current } });
}

/* もう一度 */
const onClickReplay = async() => {
  document.getElementById('blocker').classList.toggle('is-show');
  document.getElementById('modal').classList.toggle('is-show');
  createProblem(problems[user.current]);
}

const events = {
  clickBlocker(e) { // ブロッカークリック時
    if (e.target.tagName === 'DIV' || e.target.tagName === 'SPAN') {
      document.getElementById('blocker').classList.toggle('is-show');
      document.getElementById('modal').classList.toggle('is-show');
    }
  },
  clickBlocker2(e) { // ブロッカークリック時
    if (e.target.tagName === 'DIV' || e.target.tagName === 'SPAN') {
      document.getElementById('blocker2').classList.toggle('is-show');
      document.getElementById('tutorial_modal').classList.toggle('is-show');
    }
  }
}

/* データをPOST */
const post = async(url, data) => {
  const param  = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify(data)
  };
  const response = await fetch(url, param);

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

/* 回路光らせる */
const growCircuit = (array, item) => {
  const answer = document.getElementsByClassName('answer_contents_grid');
  const div2 = document.getElementById('answer_contents2');
  let element;
  for (let i = 0; i < array.length; i++) {
    element = document.createElement('div');
    element.setAttribute('class', 'answer_contents_grid2');
    console.log(array.length, array);
    if (item[i]) {
      answer[i].classList.toggle('is-hidden');
      console.log(getItemURL(item[i], 'grow'));
      element.style.backgroundImage = `url(${getItemURL(item[i], 'grow')})`;
    }

    div2.appendChild(element);
  }
}

init();
