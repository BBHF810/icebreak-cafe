import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Firebaseコンソールの「プロジェクト設定」にある自分の設定に書き換えてください
const firebaseConfig = {
  apiKey: "AIzaSyAJK62tAPSaTToSv4QOdwoy9uNnnwt2SCU",
  authDomain: "icebreak-cafe.firebaseapp.com",
  databaseURL: "https://icebreak-cafe-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "icebreak-cafe",
  storageBucket: "icebreak-cafe.firebasestorage.app",
  messagingSenderId: "1082404264094",
  appId: "1:1082404264094:web:9edb8bae963e9b17e9c38f",
  measurementId: "G-N24TKHYSK7"
};

// Firebaseの初期化
const app = initializeApp(firebaseConfig);
// Realtime Databaseのインスタンスを取得してエクスポート
export const db = getDatabase(app);