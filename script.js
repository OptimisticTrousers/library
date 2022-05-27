const addBookButton = document.querySelector('button.add-new-book');

const form = document.querySelector('form');

const tbody = document.querySelector('tbody');

const table = document.querySelector('table');

const submitButton = document.querySelector('button.submit');

let myLibrary = [new Book("Jane Austen", "Pride and Prejudice", 432, true), new Book("George R. R. Martin", "A Game of Thrones", 694, false), new Book("F. Scott Fitzgerald", "The Great Gatsby", 208, true)];

let bookIndex = 0;

form.addEventListener('submit', (event) => {

    event.preventDefault();

    const title = form.elements['title'].value;
    const pages = form.elements['pages'].value;
    const userHasRead = form.elements['has_read'].value;
    const author = form.elements['author'].value;

    addBookToLibrary(author, title, pages, userHasRead)

    form.reset();
})

addBookButton.addEventListener('click', () => {

    form.classList.toggle('active');
})


function Book(author, title, pages, read){

    this.author = author;

    this.title = title;

    this.pages = pages;

    this.read = read;
}

function addBookToLibrary(author, title, pages, userHasRead){

    const newBook = new Book(author, title, pages, userHasRead);

    myLibrary.push(newBook);

    bookIndex = myLibrary.length - 1

    display();

}

function checkIfDuplicate(book){

       for(let i = 0; i <= myLibrary.length; i++){

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
            if(key == "read"){

                const readButton = document.createElement('button');

                readButton.textContent = myLibrary[i][key];

                tableCell.appendChild(readButton);

                readButton.addEventListener('click', function(){


                    if(this.textContent == "true"){

                        this.textContent= "false";
                    }
                    else if(this.textContent == "false"){

                        this.textContent = "true";
                    }
                })
            }
            else{

                tableCell.textContent = myLibrary[i][key];
            }
            tableRow.appendChild(tableCell);
       }

       const deleteButton = document.createElement('button');
       
       const tableCell = document.createElement('td');

       deleteButton.addEventListener('click', () => {

            bookIndex--;

            tableRow.remove();

            myLibrary.splice(i, 1);
       })
        deleteButton.textContent = '✖'

        deleteButton.style = "color: red;"

        tableCell.appendChild(deleteButton);

        tableRow.appendChild(tableCell);

        tbody.appendChild(tableRow);
    }
}

display();

