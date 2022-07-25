import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  orderBy,
  limit,
  updateDoc,
  doc,
  query,
  onSnapshot,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signOut,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAY8oO7K5Uc92z24oIup2nP66QjeEx-k8c",
  authDomain: "library-42f25.firebaseapp.com",
  projectId: "library-42f25",
  storageBucket: "library-42f25.appspot.com",
  messagingSenderId: "525662056485",
  appId: "1:525662056485:web:1b1304e368ed411ee54fcc",
};

function uniqid(prefix = "", random = false) {
    const sec = Date.now() * 1000 + Math.random() * 1000;
    const id = sec.toString(16).replace(/\./g, "").padEnd(14, "0");
    return `${prefix}${id}${random ? `.${Math.trunc(Math.random() * 100000000)}`:""}`;
};

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
  const bookDocRef = doc(db, "books", book.id);

  await updateDoc(bookDocRef, {
    "book.read": !book.hasRead,
  });
}

async function deleteBook(id) {
  await deleteDoc(doc(db, "books", id));
}

async function saveBook(book) {
  const newBook = {
    author: book.author,
    title: book.title,
    pages: book.pages,
    read: book.userHasRead,
  };
  try {
    await addDoc(collection(getFirestore(), "books"), {
      name: getUserName(),
      book: newBook,
      timestamp: serverTimestamp(),
      id: book.id,
    });
  } catch (error) {
    alert("Error writing new message to Firebase Database", error);
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
  } else {
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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

class Library {
  constructor() {
    this.myLibrary = [];

    this.bookIndex = 0;
  }
  loadBooks = () => {
    const recentBooksQuery = query(
      collection(getFirestore(), "books"),
      orderBy("timestamp", "desc"),
      limit(15)
    );

    // Start listening to the query.
    onSnapshot(recentBooksQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "removed") {
          deleteMessage(change.doc.id);
        } else {
          var book = change.doc.data();
          const {author, title, pages, read} = book;
          this.myLibrary.push({author, title, pages, read});
          this.bookIndex = this.myLibrary.length - 1;
        }
      });
    });
  };

  display = () => {
    for (let i = this.bookIndex; i < this.myLibrary.length; i++) {
      const tableRow = document.createElement("tr");

      tableRow.setAttribute("data-key", i);

      for (const key in this.myLibrary[i]) {
        if(key === "id") break;
        const tableCell = document.createElement("td");
        if (key == "read") {
          const readButton = document.createElement("button");
          readButton.textContent = this.myLibrary[i][key];

          tableCell.appendChild(readButton);

          readButton.addEventListener("click", function () {
            if (this.textContent == "true") {
              this.textContent = "false";
            } else if (this.textContent == "false") {
              this.textContent = "true";
            }
            if (isUserSignedIn()) {
              updateBook(this.myLibrary[i].id);
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

        deleteBook(this.myLibrary[i].id);
        this.myLibrary.splice(i, 1);
      });
      deleteButton.textContent = "✖";

      deleteButton.style = "color: red;";

      tableCell.appendChild(deleteButton);

      tableRow.appendChild(tableCell);

      tbody.appendChild(tableRow);
    }
  };

  addBookToLibrary = (author, title, pages, userHasRead) => {
    const book = { author, title, pages, userHasRead };
    const bookId = uniqid();
    if (isUserSignedIn()) {
      saveBook({...book, id: bookId});
    }
    this.myLibrary.push(new Book(author, title, pages, userHasRead, bookId));

    this.bookIndex = this.myLibrary.length - 1;

    library.display();
  };
}

const library = new Library();

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = form.elements["title"].value;
  const pages = form.elements["pages"].value;
  const userHasRead = form.elements["has_read"].value;
  const author = form.elements["author"].value;

  library.addBookToLibrary(author, title, pages, userHasRead);

  form.reset();
});

addBookButton.addEventListener("click", () => {
  form.classList.toggle("active");
});

logInButton.addEventListener("click", signIn);

library.addBookToLibrary("Jane Austen", "Pride and Prejudice", 432, true);
library.addBookToLibrary(
  "George R. R. Martin",
  "A Game of Thrones",
  694,
  false
);
library.addBookToLibrary("F. Scott Fitzgerald", "The Great Gatsby", 208, true);
library.loadBooks();
library.display();
initFirebaseAuth();
