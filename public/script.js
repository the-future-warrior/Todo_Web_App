// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-app.js";
import { getFirestore, collection, addDoc, doc, onSnapshot, query, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDbnj6YXvP72D9pjGeK1qSRRFC-M_zYSxw",
  authDomain: "to-do-web-32380.firebaseapp.com",
  projectId: "to-do-web-32380",
  storageBucket: "to-do-web-32380.appspot.com",
  messagingSenderId: "616297484888",
  appId: "1:616297484888:web:b084ba4267fc1b9a2e702d",
  measurementId: "G-NK30FL60XJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


async function addItem(event)
{
    event.preventDefault();
    let text = document.getElementById("todo-input");
    //console.log(text.value);
    
    try
    {
        const docRef = await addDoc(collection(db, "todo-items"), {
          text: text.value,
          status: "active"
        });
        text.value = "";
        console.log("Document written with ID: ", docRef.id);
      } 
    catch (e) 
    {
        console.error("Error adding document: ", e);
    }   
}

function getItems()
{
  const q = query(collection(db, "todo-items"));
  const snapshot = onSnapshot(q, (querySnapshot) => {
    const items = [];
    querySnapshot.forEach((doc) => {
        items.push({
          id: doc.id,
          ...doc.data()
        });
    });
    //console.log(items);
    generateItems(items);
  });
}

function generateItems(items)
{
  let itemsHTML = "";
  items.forEach((item)=>{
    console.log(item);
    itemsHTML += `
    <div class="todo-item">
      <div class="check">
          <div data-id="${item.id}" class="check-mark ${item.status == "completed" ? "checked":""}">
              <img src="./assets/icon-check.svg">
          </div>
      </div>
      <div class="todo-text ${item.status == "completed" ? "checked":""}">
          ${item.text}
      </div>
    </div>
      `
  })
  document.querySelector(".todo-items").innerHTML = itemsHTML;
  createEventListeners();
}

function createEventListeners()
{
  let todoCheckMarks = document.querySelectorAll(".todo-item .check-mark");
  todoCheckMarks.forEach((checkMark)=>{
    checkMark.addEventListener("click", function(){
      markCompleted(checkMark.dataset.id);
    })
  })
}

async function markCompleted(id)
{
  //console.log(id);

  const docRef = doc(db, "todo-items", id);
  const docSnap = await getDoc(docRef);
  if(docSnap.exists())
  {
    let status = docSnap.data().status;
    if(status == "active")
    {
      await updateDoc(docRef, {status: "completed"})
    }
    else if (status == "completed")
    {
      await updateDoc(docRef, {status: "active"})
    }
  }
}

window.addItem = addItem;
getItems();