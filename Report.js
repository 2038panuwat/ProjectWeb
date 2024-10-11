import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, getDocs, deleteDoc, doc, addDoc, setDoc , query, where} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";  // ใช้สำหรับ Storage
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

async function getReports() {
    const reportCol = collection(db, 'report'); 
    const reportSnapshot = await getDocs(reportCol);
    return reportSnapshot.docs.map(doc => doc.data()); 
}

async function displayReports() {
    const reports = await getReports();  
    console.log(reports)
    const reportContainer = document.querySelector('#report-container'); 

    reports.forEach((report, index) => {
        if (report.re_image && report.re_image.length > 0) {
            const swiperContainer = document.createElement('div');
            swiperContainer.classList.add('containerswiper');

            const title = document.createElement('h3');
            title.textContent = "User Report : "+report.re_username;
            swiperContainer.appendChild(title);

            const swiperWrapper = document.createElement('div');
            swiperWrapper.classList.add('swiper', `listSlider-${index}`);
            const swiperInnerWrapper = document.createElement('div');
            swiperInnerWrapper.classList.add('swiper-wrapper');

            report.re_image.forEach(imageUrl => {
                const slide = document.createElement('div');
                slide.classList.add('swiper-slide');
                
                const img = document.createElement('img');
                img.src = imageUrl; 
                img.alt = "Report Image";
                
                slide.appendChild(img);
                swiperInnerWrapper.appendChild(slide);
            });

            swiperWrapper.appendChild(swiperInnerWrapper);

            const pagination = document.createElement('div');
            pagination.classList.add('swiper-pagination');

            const nextButton = document.createElement('div');
            nextButton.classList.add('swiper-button-next');

            const prevButton = document.createElement('div');
            prevButton.classList.add('swiper-button-prev');

            swiperWrapper.appendChild(pagination);
            swiperWrapper.appendChild(nextButton);
            swiperWrapper.appendChild(prevButton);

            swiperContainer.appendChild(swiperWrapper);

            const user_re = document.createElement('h5');
            user_re.textContent = report.re_userwasreported || "No description" ;
            swiperContainer.appendChild(user_re);

            const subtitle = document.createElement('h6');
            subtitle.textContent = report.re_subtitle || "No description";
            swiperContainer.appendChild(subtitle);

            const contaibut = document.createElement('div');
            contaibut.className = 'contaibut';

            const butdelete = document.createElement('button');
            butdelete.innerHTML = 'DELETE';
            butdelete.setAttribute('data-id',report.re_id);
            console.log(butdelete)

            contaibut.appendChild(butdelete);

            butdelete.addEventListener('click', async (e) => {
                const reportId = butdelete.getAttribute('data-id');
                console.log("Deleting report with ID:", reportId);

                await deleteReportByReId(reportId);
    
                await deleteUserAndPosts(report.re_userwasreported); 
            });

            swiperContainer.appendChild(contaibut);
            reportContainer.appendChild(swiperContainer);

            new Swiper(`.listSlider-${index}`, {
                slidesPerView: 1,
                loop: true,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
            });
        } else {
            console.log("No images found for this report:", report);
        }
    });
}

// ฟังก์ชันเพื่อใช้ในการลบเอกสาร User และ Post
async function deleteUserAndPosts(user_name) {
    try {
        // ลบเอกสารในคอลเล็กชัน User
        const userDoc = doc(db, 'users', user_name); // แก้ไขให้ตรงกับ ID ของ User ที่คุณต้องการลบ
        console.log(userDoc)
        await deleteDoc(userDoc);
        
        const usercol = collection(db, 'users');
        const userSnapshot = await getDocs(usercol);
        userSnapshot.docs.forEach(async (user) => {
            if (user.data().username === user_name) { // ถ้า username ของผู้ใช้ตรงกับ username ที่ต้องการลบ
                await deleteDoc(doc(usercol, user.id));
                }
        })
    
        // ลบเอกสารในคอลเล็กชัน Post
        const postCol = collection(db, 'post');
        const postSnapshot = await getDocs(postCol);
        postSnapshot.docs.forEach(async (post) => {
            if (post.data().p_username === user_name) { // ถ้า userId ของโพสต์ตรงกับ username ที่ต้องการลบ
                await deleteDoc(doc(postCol, post.id));
            }
        });

    } catch (error) {
        console.error("Error deleting user and posts:", error);
    }
}

async function deleteReportByReId(re_id) {
    try {
        console.log("Deleting report with re_id:", re_id);
        // ค้นหาเอกสารในคอลเล็กชัน 'report' ที่มีฟิลด์ re_id ตรงกับค่า re_id ที่ต้องการ
        const reportCollection = collection(db, 'report');
        const q = query(reportCollection, where("re_id", "==", re_id));
        const querySnapshot = await getDocs(q);
        
        // ลบเอกสารที่พบ
        querySnapshot.forEach(async (documentSnapshot) => {
            const documentRef = doc(db, 'report', documentSnapshot.id);
            await deleteDoc(documentRef);
            swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'delete Success',
                timer: 2000
            })
            setTimeout(() => {
                location.reload();
            }, 3000);
        });

        if (querySnapshot.empty) {
            console.log(`No document found with re_id: ${re_id}`);
        }

    } catch (error) {
        console.error("Error deleting document by re_id:", error);
    }
}

displayReports();