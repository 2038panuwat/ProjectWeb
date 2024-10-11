import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, getDocs, deleteDoc, doc, addDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
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
const db = getFirestore(app);
const form = document.getElementById("addType")

async function getTypes(db) {
    const tpCol = collection(db, 'type')
    const tpSnapshot = await getDocs(tpCol)
    return tpSnapshot
}


const data = await getTypes(db);
data.forEach(type => {
    showData(type)
})

function showData(type) {
    const containerReport = document.getElementById('contai');
  
    const reportItem = document.createElement('div');
    reportItem.className = 'report-item';
  
    const reportDetail = document.createElement('div');
    reportDetail.className = 'report-detail';
  
    const reportName = document.createElement('h2');
    reportName.innerText = type.data().type_name;
    reportDetail.appendChild(reportName);

    const edittp = document.createElement('div');
    edittp.className = 'edit-type';

    const typeedit = document.createElement('input')
    typeedit.type = 'type';
    typeedit.placeholder = 'Edit type';
    edittp.appendChild(typeedit)

    const reportButton = document.createElement('div');
    reportButton.className = 'report-button';
  
    const reportButtonLeft = document.createElement('div');
    reportButtonLeft.className = 'report-button-left';
  
    let editButton = document.createElement('button');
    editButton.innerHTML = "EDIT";
    editButton.setAttribute('data-id',type.id);
    reportButtonLeft.appendChild(editButton);

    let Type_id = type.data().type_id;
    console.log(Type_id)

    editButton.addEventListener('click', async (e)=>{
        const typeId = editButton.getAttribute('data-id'); 
        const updatedTypeValue = typeedit.value;
        const updatedTypeId = Type_id;

        if (typeId && updatedTypeValue && updatedTypeId) {
            try {
                await setDoc(doc(db, "type", typeId), {
                    type_id : updatedTypeId,
                    type_name: updatedTypeValue
                });
                swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Edit Success',
                    timer: 2000
                })
                setTimeout(() => {
                    location.reload();
                }, 2500);
            } catch (error) {
                console.error('Error updating document: ', error);
            }
        } else {
            console.error('No document ID or type value provided.');
        }
    });
  
    const reportButtonRight = document.createElement('div');
    reportButtonRight.className = 'report-button-right';
  
    let deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.setAttribute('data-id', type.id);
    reportButtonRight.appendChild(deleteButton);
  
    deleteButton.addEventListener('click', (e) => {
      let id = e.target.getAttribute('data-id');
      deleteDoc(doc(db, 'type', id))
        .then(() => swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Delete Success',
            timer: 2000
        }),setTimeout(() => {
            location.reload();
        }, 3000)

        ).catch((error) => swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Delete Error',
            timer:2000
        })); 
    });
  
    // Append buttons to report-button
    reportButton.appendChild(reportButtonLeft);
    reportButton.appendChild(reportButtonRight);
  
    // Append elements to report-item
    reportItem.appendChild(reportDetail);
    reportItem.appendChild(edittp);
    reportItem.appendChild(reportButton);
  
    // Append report-item to containerReport
    containerReport.appendChild(reportItem);
}

function generateRandomId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 20; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const randomId = generateRandomId(); 

    await addDoc(collection(db, 'type'), {
        type_id: randomId,
        type_name: form.name.value
    });

    form.name.value = ""; 
    swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Insert Success',
        timer: 2000
    })
    setTimeout(() => {
        location.reload();
    }, 2500);
    
});
