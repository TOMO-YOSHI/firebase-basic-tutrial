import db from './firebase.js';

const cafeList = document.querySelector('#cafe-list');
const form = document.querySelector('#add-cafe-form');


// create element and render cafe
function renderCafe(doc){
    const markup = `
    <li data-id="${doc.id}">
        <span>${doc.data().name}</span>
        <span>${doc.data().city}</span>
        <div class="deleteDiv">x</div>
    </li>
    `;

    cafeList.insertAdjacentHTML('beforeend', markup);
}

// getting data
// function getData() {
//     db.collection('cafes').orderBy('name').get().then((snapshot) => {
//         // console.log(snapshot.docs);
//         snapshot.docs.forEach(doc => {
//             // console.log(doc.data());
//             renderCafe(doc);
//             deletItems();
//         });
//     })
//     .catch(function (error) {
//         console.log("Error getting documents: ", error);
//     });
// }
// getData();

// saving data
form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('cafes').add({
        name: form.name.value,
        city: form.city.value
    });
    form.name.value = "";
    form.city.value = "";

    // $('#cafe-list').empty();
    // getData();
})

// deleting data
function deletItems() {
    $(".deleteDiv").on('click', (e) => {
        const id = e.target.parentElement.getAttribute('data-id');
        db.collection('cafes').doc(id).delete();
        // e.target.parentElement.remove()
    })
}

// real-time listener
db.collection('cafes').orderBy('city').onSnapshot(snapshop => {
    let changes = snapshop.docChanges();
    // console.log(changes[0].doc.data());
    changes.forEach(change => {
        if(change.type == 'added') {
            renderCafe(change.doc);
            deletItems();
        } else if (change.type == 'removed') {
            // let li = cafeList.querySelector('[data-id=' + change.doc.id + ']');
            // cafeList.removeChild(li);
            $('[data-id=' + change.doc.id + ']').remove();
        }
    })
})
