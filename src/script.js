import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getPerformance } from "firebase/performance";

const firebaseConfig = {
  apiKey: "AIzaSyAY8oO7K5Uc92z24oIup2nP66QjeEx-k8c",
  authDomain: "library-42f25.firebaseapp.com",
  projectId: "library-42f25",
  storageBucket: "library-42f25.appspot.com",
  messagingSenderId: "525662056485",
  appId: "1:525662056485:web:1b1304e368ed411ee54fcc",
};

let id;

let prevCount = 0;

class Library {
  constructor() {
    this.myLibrary = [];

    this.bookIndex = 0;

  }

  display = () => {
    for (let i = this.bookIndex; i < this.myLibrary.length; i++) {
      const tableRow = document.createElement("tr");

      //tableRow.setAttribute("data-key", i);

      for (const key in this.myLibrary[i]) {
        if (key === "id") break;
        const tableCell = document.createElement("td");
        if (key == "read") {
          const readButton = document.createElement("button");
          readButton.textContent = this.myLibrary[i][key];

          tableCell.appendChild(readButton);

          readButton.addEventListener("click", () => {
            const currentBook = this.myLibrary.find((book) => book.id === id);
            if (readButton.textContent == "true") {
              readButton.textContent = "false";
              currentBook.read = true;
            } else if (readButton.textContent == "false") {
              readButton.textContent = "true";
              currentBook.read = false;
            }
            if (isUserSignedIn()) {
              updateBook(currentBook);
                      setTimeout(() => {

            const tBody = document.querySelector('tbody')
            const lastChild = tBody?.lastChild
            const secondToLastChild = tBody?.lastChild.previousSibling
            const clonedNode = document.createElement('button')
            console.log(lastChild?.isEqualNode(secondToLastChild))

              if(tBody !== lastChild){

                console.log(tBody)
                console.log(lastChild)

                tBody?.removeChild(lastChild)
              }
            //else {
              //const table = document.querySelector('table')
              //const newTBody = document.createElement('tbody')
              //newTBody.appendChild(clonedNode)
              //table.appendChild(newTBody)

            //}
  }, 100)
              
            }
          });
        } else {
          tableCell.textContent = this.myLibrary[i][key];
        }
        tableRow.appendChild(tableCell);
      }

      const deleteButton = document.createElement("button");

      const tableCell = document.createElement("td");

      deleteButton.addEventListener("click", () => {
        this.bookIndex--;

        tableRow.remove();

        deleteBook(this.myLibrary.find((book) => book.id === id).id);
        this.myLibrary.splice(i, 1);
      });
      deleteButton.textContent = "✖";

      deleteButton.style = "color: red;";

      tableCell.appendChild(deleteButton);

      tableRow.appendChild(tableCell);

      tbody.appendChild(tableRow);


    }
  };

  loadBooks = () => {
    const recentBooksQuery = query(
      collection(db, "books"),
      orderBy("timestamp", "desc"),
      limit(15)
    );

    // Start listening to the query.
    onSnapshot(recentBooksQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "removed") {
          deleteMessage(change.doc.id);
        } else {
          var data = change.doc.data();
          const { book: { author, pages, read, title } } = data;
          this.myLibrary.push(new Book(author, title, pages, read, change.doc.id));
          id = change.doc.id
          this.bookIndex = this.myLibrary.length - 1;
          this.display();
          //const newCount = snapshot.size;
          //this.count = newCount
          //collection(db, 'collectionName').then(snapshot => console.log(snapshot.size));
        }
      });

    });
  };

  addBookToLibrary = (author, title, pages, userHasRead) => {
    const book = { author, title, pages, userHasRead };
    if (isUserSignedIn()) {
      saveBook(book).then((bookId) => {
        id = bookId
      });
    }
    else {

      this.myLibrary.push(new Book(author, title, pages, userHasRead, id));

      this.bookIndex = this.myLibrary.length - 1;
      this.display();
    }

  };
}


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const library = new Library();

function uniqid(prefix = "", random = false) {
  const sec = Date.now() * 1000 + Math.random() * 1000;
  const id = sec.toString(16).replace(/\./g, "").padEnd(14, "0");
  return `${prefix}${id}${random ? `.${Math.trunc(Math.random() * 100000000)}` : ""
    }`;
}

async function signIn() {
  // Sign in Firebase using popup auth and Google as the identity provider
  var provider = new GoogleAuthProvider();
  await signInWithPopup(getAuth(), provider);
}

function signOutUser() {
  // Sign out of Firebase.
  signOut(getAuth());
}

function initFirebaseAuth() {
  // Listen to auth state changes.
  onAuthStateChanged(getAuth(), authStateObserver);
}
function deleteMessage(id) {
  var div = document.getElementById("data-key" + id);

  if (div) {
    div.parentNode.removeChild(div);
  }
}

async function updateBook(book) {

  //console.log(book);
  await setDoc(
    doc(db, "books", `${book.id}`),
    {
      book: {
        author: book.author,
        title: book.title,
        pages: book.pages,
        read: book.read,
      },
    },
    { merge: true }
  );
}

async function deleteBook(id) {
  await deleteDoc(doc(db, "books", `${id}`));
}

async function saveBook(book) {
  let docRef;
  const newBook = {
    author: book.author,
    title: book.title,
    pages: book.pages,
    read: book.userHasRead,
  };
  try {
    docRef = await addDoc(collection(db, "books"), {
      name: getUserName(),
      book: newBook,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    alert("Error writing new message to Firebase Database", error);
  }

  //console.log("Document Written with ID:", docRef.id);

  return docRef.id;
}

function deleteTableElements() {
  const tBody = document.querySelector('tbody')
  while (tBody.firstChild) {
    tBody.removeChild(tBody.lastChild);
  }
}
function authStateObserver(user) {
  if (user) {
    var userName = getUserName();
    userAccountButton.style.display = "block";
    logInButton.textContent = "Sign Out";
    userAccountButton.textContent = userName;
    logInButton.removeEventListener("click", signIn);
    logInButton.addEventListener("click", signOutUser);
    //deleteTableElements();
    //library.loadBooks();
  } else {
    //deleteTableElements();
    userAccountButton.style.display = "none";
    logInButton.textContent = "Log In";
    logInButton.addEventListener("click", signIn);
  }
}

function getUserName() {
  return getAuth().currentUser.displayName;
}
function isUserSignedIn() {
  return !!getAuth().currentUser;
}

const userAccountButton = document.querySelector(".user-account");
const logInButton = document.querySelector(".log-in");
const addBookButton = document.querySelector("button.add-new-book");
const form = document.querySelector("form");
const tbody = document.querySelector("tbody");
const table = document.querySelector("table");
const submitButton = document.querySelector("button.submit");

class Book {
  constructor(author, title, pages, read, id) {
    this.author = author;

    this.title = title;

    this.pages = pages;

    this.read = read;

    this.id = id;
  }
}


form.addEventListener("submit", (event) => {
  console.log('click')
  event.preventDefault();

  const title = form.elements["title"].value;
  const pages = form.elements["pages"].value;
  const userHasRead = form.elements["has_read"].value;
  const author = form.elements["author"].value;

  library.addBookToLibrary(author, title, pages, userHasRead);

        //console.log("MyLibrary: " + this.myLibrary.length, "Children: "+ tBody.children.length, "Count: " + count, "BookIndex: " + this.bookIndex)

  setTimeout(() => {

            const tBody = document.querySelector('tbody')
            const lastChild = tBody?.lastChild
            const secondToLastChild = tBody?.lastChild.previousSibling
            const clonedNode = document.createElement('button')
            console.log(lastChild?.isEqualNode(secondToLastChild))
            if(lastChild?.isEqualNode(secondToLastChild)){

              if(tBody !== lastChild){

                console.log(tBody)
                console.log(lastChild)

                tBody?.removeChild(lastChild)
              }
            }
            //else {
              //const table = document.querySelector('table')
              //const newTBody = document.createElement('tbody')
              //newTBody.appendChild(clonedNode)
              //table.appendChild(newTBody)

            //}
  }, 500)

          

              //console.log("Prevcount: " + prevCount)

  form.reset();
});

addBookButton.addEventListener("click", () => {
  form.classList.toggle("active");
});

logInButton.addEventListener("click", signIn);

//library.addBookToLibrary("Jane Austen", "Pride and Prejudice", 432, true);
//library.addBookToLibrary(
//"George R. R. Martin",
//"A Game of Thrones",
//694,
//false
//);
//library.addBookToLibrary("F. Scott Fitzgerald", "The Great Gatsby", 208, true);
library.loadBooks();
initFirebaseAuth();
