const addBookButton = document.querySelector('button.add-new-book');

const form = document.querySelector('form');

const tbody = document.querySelector('tbody');

const table = document.querySelector('table');

//const author = form.elements['author'];

const submitButton = document.querySelector('button.submit');


form.addEventListener('submit', (event) => {

    event.preventDefault();

    const title = form.elements['title'].value;
    const pages = form.elements['pages'].value;
    const userHasRead = form.elements['has_read'].value;
    const author = form.elements['author'].value;

    addBookToLibrary(author, title, pages, userHasRead)

    form.reset();
})

/*submitButton.addEventListener('submit', () => {


})*/

addBookButton.addEventListener('click', () => {

    //form.style.display = "none";
    form.classList.toggle('active');
})

let myLibrary = [];

function Book(author, title, pages, read){

    this.author = author;
    this.title = title;
    this.pages = pages;
    this.read = read;
}

let bookIndex = 0;

function addBookToLibrary(author, title, pages, userHasRead){

    let newBook = new Book(author, title, pages, userHasRead);

    myLibrary.push(newBook);

    display();
    bookIndex++;

}
function checkIfDuplicate(book){

       for(let i = 0; i < myLibrary.length; i++){

        authorCell = myLibrary[i].author;
        titleCell = myLibrary[i].title;

            if(authorCell == book.author && titleCell == book.title){

                return true;
            }
        }

        return false;

}
function display(){

    for(let i = bookIndex; i < myLibrary.length; i++){

       const tableRow = document.createElement('tr');

       tableRow.setAttribute('data-key', i);

        for(const key in myLibrary[i]){

            const tableCell = document.createElement('td');
            tableCell.textContent = myLibrary[i][key];
            tableRow.appendChild(tableCell);
       }


       const deleteButton = document.createElement('button');

       deleteButton.addEventListener('click', () => {

        //bookIndex is behind the numbers of rows on the page by one because of the headers
        table.deleteRow(bookIndex);
        bookIndex--;
        myLibrary.pop();
       })
        tableRow.appendChild(deleteButton);
        tbody.appendChild(tableRow);

    }
}

display();