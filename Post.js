import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, addDoc , getDocs, deleteDoc, doc, setDoc} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";

// const firebaseConfig = {
//     apiKey: "AIzaSyBBXJtPii5Ol6urOCKw_hYauPFssNIrhhE",
//     authDomain: "coolstylish-9bf43.firebaseapp.com",
//     projectId: "coolstylish-9bf43",
//     storageBucket: "coolstylish-9bf43.appspot.com",
//     messagingSenderId: "469231142298",
//     appId: "1:469231142298:web:9e3a04c5a8fb747a3c6623",
//     measurementId: "G-4SDT95RN2B"
//   };
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
const container = document.getElementById('contai'); // Target the containerpost div by ID

data.forEach(doc => {
    const typeData = doc.data(); // Get the actual data from the document

    // Create a new div for each type
    const detailDiv = document.createElement('div');
    detailDiv.classList.add('detail');

    // Create a new label for each type
    const label = document.createElement('label');
    label.textContent = typeData.type_name; // Adjust this to your actual field name in Firestore

    // Append the label to the detail div
    detailDiv.appendChild(label);

    // Append the detail div to the container
    container.appendChild(detailDiv);
});

document.getElementById('postForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const p_username = e.target.username.value;
    const p_name_style = e.target.postname.value;
    const p_subtitle = e.target.content.value;
    const imageFiles = e.target.image.files; // ใช้หลายไฟล์
    const type_name = e.target.type.value;
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

        console.log(p_image);

        // Step 2: เพิ่มข้อมูลโพสต์ใน Firestore
        await addDoc(collection(db, 'post'), {
            p_username,
            p_name_style,
            p_subtitle,
            p_image, // เก็บ URL ของรูปภาพทั้งหมด
            type_name,
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

