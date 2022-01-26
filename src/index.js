import './styles.css'
// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCoG4QjrtTFvvU2XdrSoOkh-wOGwbBDv_c",
  authDomain: "electronic-library-7ebc1.firebaseapp.com",
  projectId: "electronic-library-7ebc1",
  storageBucket: "electronic-library-7ebc1.appspot.com",
  messagingSenderId: "970960296192",
  appId: "1:970960296192:web:860113a4c16d225645bbe5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ------------

const myLibrary = [];

// general functions
//------------------

function addBookToLibrary(title, author, pageCount, read) {
    if (title === '') {
        alert('you must enter a title.');
        return;
    }
    if (author === '') {
        alert('you must enter an author.');
        return;
    }
    if (pageCount === 0) {
        alert('you must enter a non-zero value for page count.');
        return;
    }
    if (isNaN(pageCount)) {
        alert('Enter a page count using numerical digits.');
        return;
    }
    let book = new Book(title, author, pageCount, read.toLowerCase());
    myLibrary.push(book);
    return true;
}

//see index.html for a commented out template for the card
function createCard(obj, idNum) {
    let cardID = `cid${idNum}`;
    let btnReadID = `brid${idNum}`;
    let btnDelID = `bdid${idNum}`;
    let pID = `pid${idNum}`;

    const cardDiv = document.createElement('div');
    const cardBtns = document.createElement('div');
    const cardP = document.createElement('p');
    const cardBtnRead = document.createElement('button');
    const cardBtnDel = document.createElement('button');

    cardDiv.id = cardID;
    cardBtnRead.id = btnReadID;
    cardBtnDel.id = btnDelID;
    cardP.id = pID;

    cardDiv.classList.add('book-card-read');
    cardDiv.classList.add('book-card-notread');
    if (obj.read === 'read') {
        cardDiv.classList.toggle('book-card-notread')
    } else {
        cardDiv.classList.toggle('book-card-read')
    }
    cardBtns.classList.add('card-buttons');
    cardP.classList.add('card-p');
    cardBtnRead.classList.add('card-read-button');
    cardBtnDel.classList.add('card-delete-button');

    cardP.textContent = obj.info();
    if (obj.read === 'read') {
        cardBtnRead.textContent = 'Mark as Unread';
    } else {
        cardBtnRead.textContent = 'Mark as Read';
    }
    cardBtnDel.textContent = 'Delete Book';

    libraryDiv.appendChild(cardDiv);
    cardDiv.appendChild(cardP);
    cardDiv.appendChild(cardBtns);
    cardBtns.appendChild(cardBtnRead);
    cardBtns.appendChild(cardBtnDel);

    cardBtnRead.addEventListener('click', function(){clickReadButton(cardID, btnReadID, pID);});

    cardBtnDel.addEventListener('click', function(){deleteBookCard(idNum)});
};

function deleteBookCard(index) {
    if (!window.confirm(`Are you sure you want to delete ${myLibrary[index].title}?`)) return;
    deleteAllCards();
    myLibrary.splice(index, 1);
    refreshLocalStorage();
    generateLibrary();    
}

function deleteAllCards() {
    for (let i = myLibrary.length - 1; i >= 0; i--) {
        cardToDel = document.querySelector(`#cid${i}`);
        libraryDiv.removeChild(cardToDel);
    }
}

function generateLibrary () {
    for (let i = 0; i < myLibrary.length; i++) {
        createCard(myLibrary[i], i);
    }
}

function saveToLocalStorage() {
    for (let i = 0; i < myLibrary.length; i++) {
        let arrayToStore = [
            myLibrary[i].title, '$',
            myLibrary[i].author, '$',
            myLibrary[i].pageCount, '$',
            myLibrary[i].read, '$',
        ]
        localStorage.setItem(`cid${i}`, arrayToStore);
    }
}

function refreshLocalStorage() {
    localStorage.clear();
    localStorage.setItem('firstVis', null);
    saveToLocalStorage();
}

function checkLocalStorage() {
    //runs when site first loaded, see bottom of this file
    len = localStorage.length;
    if (len === 0) {
        localStorage.setItem('firstVis', null);
        addBookToLibrary('The Aleph and Other Stories', 'Jorge Louis Borges and Norman Thomas Di Giovanni', 286, 'read');
        addBookToLibrary('Tragedy and Hope', 'Carroll Quigley', 1348, 'not read');
        addBookToLibrary('The Second World War', 'Antony Beevor', 881, 'read');
        generateLibrary();
        saveToLocalStorage();
        return;
    }
    if (len === 1) return;
    deleteAllCards();
    emptyLibrary();
    for (i = 0; i < len-1; i++) {
        bookStr = localStorage.getItem(`cid${i}`)
        bookArray = bookStr.split(',$,');
        bookArray[2] = Number(bookArray[2]);
        bookArray[3] = bookArray[3].slice(0,-2);
        let bookObj = new Book(
            bookArray[0],
            bookArray[1],
            bookArray[2],
            bookArray[3]
        )
        myLibrary.push(bookObj);
    }
    generateLibrary();
}

function emptyLibrary() {
    while (myLibrary.length > 0) myLibrary.pop();
}


// book constructor
//-----------------

class Book {
    constructor(title, author, pageCount, read) {
            this.title = title;
            this.author = author;
            this.pageCount = pageCount;
            this.read = read;
    }
    info() {
        return (`${this.title} by ${this.author}, ${this.pageCount} pages, ${this.read}.`);
    }
    changeReadStatus() {
        if (this.read === 'read') this.read = 'not read';
        else this.read = 'read';
    }
}


// DOM selectors
//-----------------

//buttons
btnAddNewBook = document.querySelector('#add-new-book');
btnCancelAddNew = document.querySelector('#cancel-button');
btnSubmit = document.querySelector('#submit-button');
btnReset = document.querySelector('#reset-data');

//input fields
fieldTitle = document.querySelector('#title-field');
fieldAuthor = document.querySelector('#author-field');
fieldPageCount = document.querySelector('#pagecount-field');
fieldRadioRead = document.querySelector('#rad-read');
fieldRadioNotRead = document.querySelector('#rad-nread');

//containers
addNewForm = document.querySelector('#new-book-form');
libraryDiv = document.querySelector('#library')


//button-listener functions
//-------------------------

function getInput() {
    let newTitle = fieldTitle.value;
    let newAuthor = fieldAuthor.value;
    let newPageCount = fieldPageCount.value;
    let readStatus = getReadStatus();
    const fieldValArray = [newTitle, newAuthor, newPageCount, readStatus]
    return fieldValArray;
}

function getReadStatus() {
    if (fieldRadioRead.checked === true) return 'read';
    else return 'not read';
}


function clearInputFields() {
    fieldTitle.value = '';
    fieldAuthor.value = '';
    fieldPageCount.value = '';
    fieldRadioRead.checked = false;
    fieldRadioNotRead.checked = true;
}

function clickReadButton(cardID, btnReadID, pID) {
    const cardDiv = document.querySelector(`#${cardID}`);
    const cardBtnRead = document.querySelector(`#${btnReadID}`);
    const cardP = document.querySelector(`#${pID}`);
    let index = Number(cardID.slice(-1));
    
    if (cardBtnRead.textContent === 'Mark as Read') {
        cardBtnRead.textContent = 'Mark as Unread';
    } else {
        cardBtnRead.textContent = 'Mark as Read';
    }
    cardDiv.classList.toggle('book-card-notread')
    cardDiv.classList.toggle('book-card-read')    

    if (myLibrary[index].read === 'read') {
        myLibrary[index].read = 'unread';
    } else {
        myLibrary[index].read = 'read';
    }
    refreshLocalStorage();
    cardP.textContent = myLibrary[index].info();
}


// button-listeners
// button listeners for book cards are added in the 
// createCard() function
//-----------------
btnAddNewBook.addEventListener('click', () => {
    if (addNewForm.style['display'] === 'none' || addNewForm.style['display'] === '') {
        addNewForm.style['display'] = 'flex';
    }
});

btnCancelAddNew.addEventListener('click', () => {
        addNewForm.style['display'] = 'none';
        clearInputFields();
});

btnSubmit.addEventListener('click', () => {
    inputValues = getInput();
    let submitSuccess = addBookToLibrary(inputValues[0], inputValues[1], Number(inputValues[2]), inputValues[3],);
    if (submitSuccess === true) {
        clearInputFields();
        addNewForm.style['display'] = 'none';
        createCard(myLibrary[myLibrary.length-1], myLibrary.length-1);
        saveToLocalStorage();
    }
});

btnReset.addEventListener('click', () => {
    localStorage.clear();
    deleteAllCards();
    emptyLibrary();
    checkLocalStorage();
})



// test books
//-----------
/*
addBookToLibrary('The Aleph and Other Stories', 'Jorge Louis Borges and Norman Thomas Di Giovanni', 286, 'read');
addBookToLibrary('Tragedy and Hope', 'Carroll Quigley', 1348, 'not read');
addBookToLibrary('The Second World War', 'Antony Beevor', 881, 'read');

generateLibrary();
*/
checkLocalStorage();