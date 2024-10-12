import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth , signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDnonwFrsPeBaNlutgXSvXPvUUJ5Jnn25U",
    authDomain: "database-app-12de5.firebaseapp.com",
    projectId: "database-app-12de5",
    storageBucket: "database-app-12de5.appspot.com",
    messagingSenderId: "943332737684",
    appId: "1:943332737684:web:b8da3c5bcc24a23b99ea81"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

const loginform = document.getElementById("loginForm")

loginform.addEventListener("submit" , (e)=>{
    e.preventDefault()
    const email = loginform.email.value
    const password = loginform.password.value
    signInWithEmailAndPassword(auth, email, password)
    .then((result) => {
        const userId = result.user.uid;  // ดึงค่า UID ของผู้ใช้
        localStorage.setItem("userId", userId);  // เก็บค่า UID ไว้ใน localStorage

        // เมื่อเข้าสู่ระบบสำเร็จ ให้ไปยังหน้า Homepage.html
        window.location.href = "Homepage.html";
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(`เกิดข้อผิดพลาด: ${errorMessage}. กรุณาตรวจสอบรหัสผ่านของคุณ`);
    });
})