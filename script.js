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

let myLibrary = [new Book("Jane Austen", "Pride and Prejudice", 432, true), new Book("George R. R. Martin", "A Song of Ice and Fire", 1032, false)];

function Book(author, title, pages, read){

    this.author = author;
    this.title = title;
    this.pages = pages;
    this.read = read;
}

let bookIndex = 0;

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

                readButton.addEventListener('click', function() {


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
        //bookIndex is behind the numbers of rows on the page by one because of the headers


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

