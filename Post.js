import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyDnonwFrsPeBaNlutgXSvXPvUUJ5Jnn25U",
    authDomain: "database-app-12de5.firebaseapp.com",
    projectId: "database-app-12de5",
    storageBucket: "database-app-12de5.appspot.com",
    messagingSenderId: "943332737684",
    appId: "1:943332737684:web:b8da3c5bcc24a23b99ea81"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

async function getTypes(db) {
    const tpCol = collection(db, 'type');
    const tpSnapshot = await getDocs(tpCol);
    return tpSnapshot;
}

const data = await getTypes(db);
const typeSelect = document.querySelector('select[name="type"]');

data.forEach(doc => {
    const typeData = doc.data();
    const option = document.createElement('option');
    option.value = doc.id; // ใช้ document ID เป็น value
    option.textContent = typeData.type_name; // แสดงชื่อประเภท
    typeSelect.appendChild(option);
});

document.getElementById('postForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const p_name_style = e.target.postname.value;
    const p_subtitle = e.target.content.value;
    const imageFiles = e.target.image.files; // ใช้หลายไฟล์
    const p_hastag = e.target.hastag.value;
    // const type_id = e.target.type.value; // ใช้ type_id แทน type_name
    const p_image = []; // สร้างอาเรย์เก็บ URL ของรูปภาพ

    try {
        // Step 1: อัปโหลดภาพทั้งหมดไปยัง Firebase Storage
        const uploadPromises = Array.from(imageFiles).map(async (imageFile) => {
            const storageRef = ref(storage, `images/${imageFile.name}`);
            await uploadBytes(storageRef, imageFile);
            const imageUrl = await getDownloadURL(storageRef);
            return imageUrl; // คืนค่า URL ของภาพ
        });

        // รอให้การอัปโหลดทั้งหมดเสร็จสิ้น
        p_image.push(...await Promise.all(uploadPromises));

        const userId = localStorage.getItem("userId");

        // Step 2: เพิ่มข้อมูลโพสต์ใน Firestore
        await addDoc(collection(db, 'post'), {
            p_hastag,
            p_id: userId,
            p_name_style,
            p_subtitle,
            p_image, 
            // type_id, // เก็บ type_id แทน type_name
            type_name: typeSelect.options[typeSelect.selectedIndex].text,
            p_time: new Date()
        });

        swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Insert Success',
            timer: 2000
        });

        setTimeout(() => {
            location.reload();
        }, 3000);

        e.target.reset(); // เคลียร์ฟอร์ม

    } catch (error) {
        console.error("Error adding post: ", error);
        alert('Failed to add post. Please try again.');
    }
});