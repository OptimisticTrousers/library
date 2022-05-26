const addBookButton = document.querySelector('button.add-new-book');

const form = document.querySelector('form');

const tbody = document.querySelector('tbody');

const table = document.querySelector('table');

//const author = form.elements['author'];

const submitButton = document.querySelector('button.submit');


form.addEventListener('submit', (event) => {

    event.preventDefault();
})

submitButton.addEventListener('click', () => {

    const title = form.elements['title'].value;
    const pages = form.elements['pages'].value;
    const userHasRead = form.elements['has_read'].value;
    const author = form.elements['author'].value;

    addBookToLibrary(author, title, pages, userHasRead)

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

function addBookToLibrary(author, title, pages, userHasRead){

    let newBook = new Book(author, title, pages, userHasRead);

    myLibrary.push(newBook);

    display();

}

function display(){
    
    myLibrary.forEach(book => {
       const tableRow = document.createElement('tr');

       tbody.appendChild(tableRow);


        for(const key in book){

        if(table.innerHTML.indexOf(book[key]) == -1){

            const tableCell = document.createElement('td');
            tableCell.textContent = book[key];
            tbody.appendChild(tableCell);
        }
       }


    })
}

display();