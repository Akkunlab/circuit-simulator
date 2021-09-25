// firebase 設定
var firebaseConfig = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: process.env.FIREBASE_AUTHDOMAIN,
  projectId: process.env.FIREBASE_PROJECTID,
  storageBucket: process.env.FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
  appId: process.env.FIREBASE_APPID,
  measurementId: process.env.FIREBASE_MEASUREMENTID
};

const problem = [
  {
    title: '問題1',
    des: '抵抗を接続して回路を完成させてください',
    item: ['Rr'],
    area: [
      'l1', 'l', 'l', 'l', 'l', 'l2',
      'lr', '', '', '', '', 'lr',
      'Vr', '', '', '', '', '',
      'lr', '', '', '', '', 'lr',
      'l4', 'l', 'l', 'l', 'l', 'l3',
    ],
    answer: ['Rr36']
  },
  {
    title: '問題2',
    des: '電源と抵抗を接続して回路を完成させてください',
    item: ['Vr','Rr'],
    area: [
      'l1', 'l', 'l', 'l', 'l', 'l2',
      'lr', '', '', '', '', 'lr',
      '', '', '', '', '', '',
      'lr', '', '', '', '', 'lr',
      'l4', 'l', 'l', 'l', 'l', 'l3',
    ],
    answer: ['Vr31Rr36','Vr36Rr31']
  },
  {
    title: '問題3',
    des: 'スイッチを使用した回路を完成させてください',
    item: ['Vr','Rr', 'S'],
    area: [
      'l1', 'l', '', 'l', 'l', 'l2',
      'lr', '', '', '', '', 'lr',
      '', '', '', '', '', '',
      'lr', '', '', '', '', 'lr',
      'l4', 'l', 'l', 'l', 'l', 'l3',
    ],
    answer: ['Vr31Rr36S13','Vr36Rr31S13']
  },
  {
    title: '問題4',
    des: '電球を複数光らせる回路を完成させてください',
    item: ['Vr', 'light', 'light'],
    area: [
      'l1', 'l', '', 'l', 'l', 'l2',
      'lr', '', '', '', '', 'lr',
      '', '', '', '', '', 'lr',
      'lr', '', '', '', '', 'lr',
      'l4', 'l', 'l', '', 'l', 'l3',
    ],
    answer: ['Vr31light13light54', 'Vr31light54light13']
  },
  {
    title: '問題5',
    des: 'スイッチを押した時，LEDを光らせる回路を完成させてください',
    item: ['Vr','Rr', 'S', 'L'],
    area: [
      'l1', 'l', '', 'l', 'l', 'l2',
      'lr', '', '', '', '', 'lr',
      '', '', '', '', '', '',
      'lr', '', '', '', '', 'lr',
      'l4', 'l', 'l', '', 'l', 'l3',
    ],
    answer: ['Vr31Rr36S54L13','Vr36Rr31S13L54']
  },
  {
    title: '問題6',
    des: '全てのスイッチを押した時，LEDを光らせる回路を完成させてください',
    item: ['Vr','Rr', 'S', 'S', 'L'],
    area: [
      'l1', 'l', '', 'l', 'l', 'l2',
      'lr', '', '', '', '', 'lr',
      '', '', '', '', '', '',
      'lr', '', '', '', '', 'lr',
      'l4', '', 'l', '', 'l', 'l3',
    ],
    answer: ['Vr31Rr36S52S54L13','Vr31Rr36S54S52L13', 'Vr36Rr31S13S52L54','Vr36Rr31S13S54L52', 'Vr36Rr31S52S13L54','Vr36Rr31S54S13L52']
  },
  {
    title: '問題7',
    des: 'スイッチを押した時，LEDを消灯させる回路を完成させてください（通常時は点灯）',
    item: ['Vr','R', 'R', 'Sr', 'Lr', 'lr', 'lr', 'l'],
    area: [
      'l1', 'l', 'L', 'R', 'S', 'l2',
      'l5', 'l', 'L', 'R', 'S', 'l6',
      'lr', '', '', '', '', 'lr',
      'Vr', '', '', '', '', 'lr',
      'l4', 'l', 'l', 'S', 'l', 'l3',
    ],
    answer: []
  },
];

export { firebaseConfig, problem };