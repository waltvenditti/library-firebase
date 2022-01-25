function Book(title, author, pageNum, read) {
    this.title = title;
    this.author = author;
    this.pagNum = pageNum;
    this.read = read;

    let readString = '';
    if (read === true) readString = 'read.';
    else readString = 'not read yet';

    this.info = function() {
        return (`${title} by ${author}, ${pageNum} pages, ${readString}`);
    }
}