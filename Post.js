import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, query, where} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
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

async function getpost(db) {
    const tpCol = collection(db, 'post')
    const tpSnapshot = await getDocs(tpCol)
    return tpSnapshot
}


const datapost = await getpost(db);
datapost.forEach(post => {
    showData(post)
})
async function showData(post){
    const userId = localStorage.getItem("userId");

    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
        const username = userDocSnap.data().username;
        console.log(username);
    }

    const containerReport = document.getElementById('contai');
  
    const reportItem = document.createElement('div');
    reportItem.className = 'report-item';
  
    const reportDetail = document.createElement('div');
    reportDetail.className = 'report-detail';
  
    const reportName = document.createElement('h2');
    reportName.innerText = post.data().p_username;
    reportDetail.appendChild(reportName);
    reportItem.appendChild(reportDetail);
  
    containerReport.appendChild(reportItem);
}

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
    const p_ref = "";
    console.log(p_hastag);
    const p_image = [];

    try {
        const uploadPromises = Array.from(imageFiles).map(async (imageFile) => {
            const storageRef = ref(storage, `images/${imageFile.name}`);
            await uploadBytes(storageRef, imageFile);
            const imageUrl = await getDownloadURL(storageRef);
            return imageUrl; 
        });

        p_image.push(...await Promise.all(uploadPromises));

        const userId = localStorage.getItem("userId");

        // ดึง username จาก Firestore โดยใช้ userId
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const username = userDocSnap.data().user_name;
            console.log(username);

            // ดึง typeId จาก typeSelect
            const typeId = typeSelect.value;
            const typeDocRef = doc(db, 'type', typeId); // สร้าง reference ไปยัง document ใน collection 'type'

            await addDoc(collection(db, 'post'), {
                p_hastag,
                p_id: userId,
                p_name_style,
                p_subtitle,
                p_image, 
                type_name: typeSelect.options[typeSelect.selectedIndex].text,
                type_id: typeDocRef, // เพิ่ม reference ลงใน document
                p_time: new Date(),
                p_ref,
                p_username: username, 
                p_edite_post: false
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

            e.target.reset(); 
        } else {
            console.error("No such user document!");
            alert('Failed to add post. User not found.');
        }

    } catch (error) {
        console.error("Error adding post: ", error);
        alert('Failed to add post. Please try again.');
    }
});
