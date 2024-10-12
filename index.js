import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, getDocs ,deleteDoc, doc} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";  // ใช้สำหรับ Storage

// const firebaseConfig = {
//     apiKey: "AIzaSyBBXJtPii5Ol6urOCKw_hYauPFssNIrhhE",
//     authDomain: "coolstylish-9bf43.firebaseapp.com",
//     projectId: "coolstylish-9bf43",
//     storageBucket: "coolstylish-9bf43.appspot.com",
//     messagingSenderId: "469231142298",
//     appId: "1:469231142298:web:9e3a04c5a8fb747a3c6623",
//     measurementId: "G-4SDT95RN2B"
// };
const firebaseConfig = {
    apiKey: "AIzaSyDnonwFrsPeBaNlutgXSvXPvUUJ5Jnn25U",
    authDomain: "database-app-12de5.firebaseapp.com",
    projectId: "database-app-12de5",
    storageBucket: "database-app-12de5.appspot.com",
    messagingSenderId: "943332737684",
    appId: "1:943332737684:web:b8da3c5bcc24a23b99ea81"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const storage = getStorage(app);


async function getUsers(db) {
    const userCol = collection(db, 'users')
    const userSnapshot = await getDocs(userCol)
    return userSnapshot
}

function showData(user) {
    const containeruser = document.getElementById('contai');

    const wrapper = document.createElement('div');
    wrapper.className = 'wrapper';

    const imageuser = document.createElement('img');
    imageuser.className = 'wrapper img';
    imageuser.src = user.data().photo_url; 

    const userdetail = document.createElement('h3');
    userdetail.innerText = user.data().user_name;

    const useremail = document.createElement('h3')
    useremail.innerText = user.data().email;

    const userdisplay = document.createElement('h3')
    userdisplay.innerText = user.data().display_name;

    const userphone = document.createElement('h3')
    userphone.innerText = user.data().phone_number;

    const buttondelete = document.createElement('button')
    buttondelete.className = 'btn';
    buttondelete.innerText = 'Delete';
    buttondelete.setAttribute('data-id',user.id);

    wrapper.appendChild(imageuser);
    wrapper.appendChild(userdetail);
    wrapper.appendChild(useremail);
    wrapper.appendChild(userdisplay);
    wrapper.appendChild(userphone);
    wrapper.appendChild(buttondelete);

    buttondelete.addEventListener('click', (e)=>{
        let id = e.target.getAttribute('data-id');
        deleteDoc(doc(db, 'users', id))
            .then(() => alert("Delete success"))
            .catch((error) => console.error("Error deleting document: ", error));
    })

    containeruser.appendChild(wrapper);
}

const data = await getUsers(db)
data.forEach(user => {
    showData(user)
})