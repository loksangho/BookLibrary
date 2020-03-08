var firestore = firebase.firestore();

//let myLibrary = [];


function Book(title, author, num_of_pages, have_read) {
    this.title = title;
    this.author = author;
    this.num_of_pages = num_of_pages;
    this.have_read = have_read;
    this.info = function () {
        return this.title + " by " + this.author + ", " + this.num_of_pages + ", " + this.have_read;
    }
}

Book.prototype.toggleHaveRead = function () {
    this.have_read = !this.have_read;
}

function addBookToLibrary(book) {
    //myLibrary.push(book);
    //const docRef = firestore.doc("library/");

    firestore.collection("library").add({
            title: book.title,
            author: book.author,
            num_of_pages: book.num_of_pages,
            have_read: book.have_read
        })
        .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        });

}

function render() {

    firestore.collection("library").onSnapshot(
        function (querySnapshot) {
            let container = document.querySelector("#books_container");
            let child = container.lastElementChild;
            while (child) {
                container.removeChild(child);
                child = container.lastElementChild;
            }
            querySnapshot.forEach(function (doc) {
                    // doc.data() is never undefined for query doc snapshots


                    console.log(doc.id, " => ", doc.data());

                    const myData = doc.data();
                    //let currentBook = myLibrary[i];
                    let newBookDiv = document.createElement("div");
                    newBookDiv.classList.add("book_card")
                    newBookDiv.innerHTML = `<p><strong>${myData.title + "</strong> by <em>" + myData.author + "</em>, " + myData.num_of_pages + "pages, " + (myData.have_read ? "Have read" : "Have not read")}</p><button class="remove_book_button atest" data-book-number="${doc.id}">Remove Book from Library</button><button class="toggle_have_read" data-book-number-read="${doc.id}">${(myData.have_read ? "Read" : "Not Read")}</button>`
                    if (!myData.have_read) {
                        newBookDiv.querySelector(`[data-book-number-read=${doc.id}]`).classList.add("red");
                    } else {
                        newBookDiv.querySelector(`[data-book-number-read=${doc.id}]`).classList.remove("red");
                    }
                    container.appendChild(newBookDiv);


                }


            )
        });


    //    for (let i = 0; i < myLibrary.length; i++) {
    //        let currentBook = myLibrary[i];
    //        let newBookDiv = document.createElement("div");
    //        newBookDiv.classList.add("book_card")
    //        newBookDiv.innerHTML = `<p>${currentBook.info()}</p><button class="remove_book_button atest" data-book-number="${i}">Remove Book from Library</button><button class="toggle_have_read" data-book-number="${i}">Toggle Read Status</button>`
    //        container.appendChild(newBookDiv);
    //    }

}


let book1 = new Book("War and Peace", "Leo Tolstoy", 500, false);
let book2 = new Book("Game of Thrones", "George Martin", 600, false);
let book3 = new Book("Great Expectations", "Charles Dickens", 300, false);
let book4 = new Book("David Copperfield", "Charles Dickens", 350, false);

//addBookToLibrary(book1);
//addBookToLibrary(book2);
//addBookToLibrary(book3);
//addBookToLibrary(book4);

render();

window.addEventListener("click", e => {
    if (e.target.id == "new_book_button") {
        document.getElementById("new_book_form").style.display = "inherit";
    } else if (e.target.classList[0] == "remove_book_button") {
        //myLibrary.splice(e.target.getAttribute("data-book-number"), 1);
        firestore.collection("library").doc(e.target.getAttribute("data-book-number")).delete().then(function () {
            console.log("Document successfully deleted!");
        }).catch(function (error) {
            console.error("Error removing document: ", error);
        });

        //render();
    } else if (e.target.classList[0] == "toggle_have_read") {
        //myLibrary[e.target.getAttribute("data-book-number")].toggleHaveRead();


        firestore.collection("library").doc(e.target.getAttribute("data-book-number-read")).get().then(function (doc) {
            if (doc && doc.exists) {

                const myData = doc.data();
                firestore.collection("library").doc(e.target.getAttribute("data-book-number-read")).update({
                        have_read: !myData.have_read
                    })
                    .then(function () {
                        console.log("Document successfully updated!");
                    })
                    .catch(function (error) {
                        // The document probably doesn't exist.
                        console.error("Error updating document: ", error);
                    });

            }
        })


        //render();
    }
})

function processForm(e) {
    if (e.preventDefault) e.preventDefault();

    /* do what you want with the form */
    //0: Author
    //1: Title
    //2: Number of Pages
    //3: Have Read
    //4: Have Not Read

    if (!e.target[3].checked && !e.target[4].checked) {
        // have read and have not read both unchecked
        //display error
        return;
    }

    if (e.target[0] == "") {
        return;
    }

    if (e.target[1] == "") {
        return;
    }
    if (e.target[2] == "") {
        return;
    }


    console.log(e);
    let newBook = new Book(e.target[1].value, e.target[0].value, e.target[2].value, e.target[3].checked);
    addBookToLibrary(newBook);

    document.getElementById("title_input").value = "";
    document.getElementById("author_input").value = "";
    document.getElementById("num_of_pages_input").value = "";
    document.getElementById("read_true").checked = false;
    document.getElementById("read_false").checked = false;


    document.getElementById("new_book_form").style.display = "none";

    //render();


    // You must return false to prevent the default form behavior
    return false;
}

var form = document.getElementById('new_book_form');
if (form.attachEvent) {
    form.attachEvent("submit", processForm);
} else {
    form.addEventListener("submit", processForm);
}
