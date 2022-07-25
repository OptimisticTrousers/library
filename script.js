import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
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

async function saveBook(book) {
  try {
    await addDoc(collection(getFirestore(), "books"), {
      name: getUserName(),
      book,
      timestamp: serverTimestamp(),
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
    form.classList.add("active");
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
  constructor(author, title, pages, read) {
    this.author = author;

    this.title = title;

    this.pages = pages;

    this.read = read;
  }
}

const defaultBooks = [
  {
    author: "Jane Austen",
    title: "Pride and Prejudice",
    numOfPages: 432,
    hasRead: true,
  },
  {
    author: "George R. R. Martin",
    title: "A Game of Thrones",
    numOfPages: 694,
    hasRead: false,
  },
  {
    author: "F. Scott Fitzgerald",
    title: "The Great Gatsby",
    numOfPages: 208,
    hasRead: true,
  },
];

class Library {
  constructor() {
    this.myLibrary = [
      new Book("Jane Austen", "Pride and Prejudice", 432, true),
      new Book("George R. R. Martin", "A Game of Thrones", 694, false),
      new Book("F. Scott Fitzgerald", "The Great Gatsby", 208, true),
    ];

    this.bookIndex = 0;
  }
  loadBooks() {
    const recentBooksQuery = query(
      collection(getFirestore(), "books"),
      orderBy("timestamp", "desc"),
      limit(15)
    );

    // Start listening to the query.
    onSnapshot(recentBooksQuery, function (snapshot) {
      snapshot.docChanges().forEach(function (change) {
        if (change.type === "removed") {
          deleteMessage(change.doc.id);
        } else {
          var message = change.doc.data();
          this.myLibrary.push(message);
          this.bookIndex = this.myLibrary.length - 1;
          this.display();
        }
      });
    });
  }

  display() {
    for (let i = this.bookIndex; i < this.myLibrary.length; i++) {
      const tableRow = document.createElement("tr");

      tableRow.setAttribute("data-key", i);

      for (const key in this.myLibrary[i]) {
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

        this.myLibrary.splice(i, 1);
      });
      deleteButton.textContent = "✖";

      deleteButton.style = "color: red;";

      tableCell.appendChild(deleteButton);

      tableRow.appendChild(tableCell);

      tbody.appendChild(tableRow);
    }
  }

  addBookToLibrary(author, title, pages, userHasRead) {
    const book = { title, pages, userHasRead, author };
    if (isUserSignedIn()) {
      this.myLibrary.push(book);

      this.bookIndex = this.myLibrary.length - 1;

      saveBook(book);

      library.display();
    } else {
      alert("Please sign in!");
    }
  }
}

const library = new Library();

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (isUserSignedIn()) {
    const title = form.elements["title"].value;
    const pages = form.elements["pages"].value;
    const userHasRead = form.elements["has_read"].value;
    const author = form.elements["author"].value;

    library.addBookToLibrary(author, title, pages, userHasRead);

    form.reset();
  } else {
    alert("Please sign in!");
  }
});

addBookButton.addEventListener("click", () => {
  if (isUserSignedIn()) {
    form.classList.toggle("active");
  } else {
    alert("Please sign in!");
  }
});

logInButton.addEventListener("click", signIn);

library.display();
initFirebaseAuth();
