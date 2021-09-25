import { firebaseConfig } from './config.js';

/* 基本設定 */
let db;
let users = [];

/* 初期化 */
const init = () => {
  initFirebase(); // firebase初期化
  onSetListener(); // 値の変更を検知
  initManagementPanel(); // 管理パネル初期化

  document.getElementById('course_start_label').addEventListener('click', () => { onChangeCourse('start') }); // 管理パネル 「開始」変更処理
  document.getElementById('course_pause_label').addEventListener('click', () => { onChangeCourse('pause') }); // 管理パネル 「一時停止」変更処理
  
  for (let i = 2; i <= 10; i++) {
    document.getElementById(`course_problem${i}_label`).addEventListener('click', () => { onChangeCourse(`problem${i}`) });
  }
}

/* 管理パネル初期化 */
const initManagementPanel = () => {
  document.getElementById('course_start').checked = firebaseData.start; // 開始ボタン
  document.getElementById('course_pause').checked = firebaseData.pause; // 一時停止ボタン
}

/* 管理パネル変更処理 */
const onChangeCourse = name => {
  const object = {};
  const value = !document.getElementById(`course_${name}`).checked;

  object[name] = value;
  db.collection('controls').doc('main').update(object).then(() => {
    console.log(`【${name}】${value}に更新しました`);
  }).catch(onError);
}

/* firebase初期化 */
const initFirebase = () => {
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
  db = firebase.firestore();
}

/* 値の変更を検知 */
const onSetListener = () => {
  db.collection('users').orderBy('id').onSnapshot((querySnapshot) => {

    // 初期化
    document.getElementById('user_list').innerHTML = '';
    users = [];

    // 生成処理
    querySnapshot.forEach((doc) => {
      createUserList(doc.data());
      users.push(doc.data());
    });
    console.log(users);
  });
}

/* ユーザリストを作成 */
const createUserList = userData => {
  const div = document.createElement('div');
  const imgDiv = document.createElement('div');
  const idLabelSpan = document.createElement('span');
  const idSpan = document.createElement('span');
  const idP = document.createElement('p');
  const pageLabelSpan = document.createElement('span');
  const pageSpan = document.createElement('span');
  const pageP = document.createElement('p');

  // ID
  div.setAttribute('class', 'user_item');

  idLabelSpan.innerText = 'ID: ';
  idP.appendChild(idLabelSpan);

  idSpan.innerText = userData.id;
  idP.appendChild(idSpan);

  div.appendChild(idP);

  // Page
  pageLabelSpan.innerText = 'Page: ';
  pageP.appendChild(pageLabelSpan);

  pageSpan.innerText = userData.page;
  pageP.appendChild(pageSpan);

  div.appendChild(pageP);

  // Img
  imgDiv.setAttribute('class', 'user_item_img');
  imgDiv.style.backgroundImage = `url(../img/1/page_${userData.page}.png)`;
  div.appendChild(imgDiv);

  userData.help ? div.classList.add('is-help') : div.classList.remove('is-help');
  document.getElementById('user_list').appendChild(div);
}

/* エラー時の処理 */
const onError = error => {
  console.log(`更新に失敗しました (${error})`);
}

init();