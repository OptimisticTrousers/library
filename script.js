const addBookButton = document.querySelector('button.add-new-book');

const form = document.querySelector('form');

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