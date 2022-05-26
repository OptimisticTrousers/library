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

function addBookToLibrary(author, title, pages, userHasRead){

    let newBook = new Book(author, title, pages, userHasRead);

    myLibrary.push(newBook);

    display();

}

function display(){
    
    myLibrary.forEach((book, index) => {
       const tableRow = document.createElement('tr');

       tableRow.setAttribute('data-key', index);

        if(table.innerHTML.match() != -1 || table.innerHTML.indexOf(book.title) != -1){

            alert("You have duplicate books!");
            return;
        }

        for(const key in book){

                const tableCell = document.createElement('td');
                tableCell.textContent = book[key];
                tableRow.appendChild(tableCell);

            /*if(index != 3){

                const tableCell = document.createElement('td');
                tableCell.textContent = book[key];
                tableRow.appendChild(tableCell);
            }
            if(index == 3){

                tbody.appendChild(tableCell)
            }*/
       }

       tbody.appendChild(tableRow);




    })
}

display();