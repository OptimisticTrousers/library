const addBookButton = document.querySelector('button.add-new-book');

const form = document.querySelector('form');

//const author = form.elements['author'];
const title = form.elements['title'];
const pages = form.elements['pages'];
const userHasRead = form.elements['has_read'];

const author = document.querySelector('#author');

const submitButton = document.querySelector('button.submit');



form.addEventListener('submit', (event) => {

    event.preventDefault();
})

submitButton.addEventListener('click', () => {

    console.log(author.value)
})

addBookButton.addEventListener('click', () => {

    //form.style.display = "none";
    form.classList.toggle('active');
})

let myLibrary = [new Book("Jane Austen", "Pride and Prejudice", 432, true)];

function Book(author, title, pages, read){

    this.author = author;
    this.title = title;
    this.pages = pages;
    this.read = read;
}

function addBookToLibrary(author, title, pages, read){

    new Book(author, title, pages, read).push(myLibrary);

}

function display(){
    
    myLibrary.map(book => {
        
    })
}