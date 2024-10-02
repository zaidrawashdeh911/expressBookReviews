const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // Register the new user
  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
 return res.send(JSON.stringify(books, null, 1));
});

//Get the book list using async-await
public_users.get('/', async function (req, res) {
    try {
      const booksList = await new Promise((resolve) => {
        setTimeout(() => {
          resolve(books);
        }, 1000);
      });
      return res.status(200).send(JSON.stringify(booksList, null, 2));
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching book list' });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        res.send(JSON.stringify(book, null, 1));
    } else {
        res.status(404).json({ message: "Book not found for the provided ISBN" });
    } });
  
// Get books details based on ISBN using async-await
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    
    try {
      const bookDetails = await new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
          resolve(book);
        } else {
          reject(new Error("Book not found"));
        }
      });
      return res.status(200).send(JSON.stringify(bookDetails, null, 2));
    } catch (error) {
      return res.status(404).json({ message: "Book not found for the provided ISBN" });
    }
  });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const authorName = req.params.author;
    const matchingBooks = [];
    for (let key in books) {
        if (books[key].author.toLowerCase() === authorName.toLowerCase()) {
            matchingBooks.push(books[key]);
        }
    }

    if (matchingBooks.length > 0) {
        res.send(JSON.stringify(matchingBooks, null, 1));
    } else {
        res.status(404).json({ message: `No books found by author: ${authorName}` });
    }
});

// Get book details based on author using async-await
public_users.get('/author/:author', async function (req, res) {
    const authorName = req.params.author;
    
    try {
      const matchingBooks = await new Promise((resolve, reject) => {
        const results = [];
        for (let key in books) {
          if (books[key].author.toLowerCase() === authorName.toLowerCase()) {
            results.push(books[key]);
          }
        }
        if (results.length > 0) {
          resolve(results);
        } else {
          reject(new Error(`No books found by author: ${authorName}`));
        }
      });
      
      return res.status(200).send(JSON.stringify(matchingBooks, null, 2));
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  });

// Get book details based on title
public_users.get('/title/:title', function (req, res) {
    const bookTitle = req.params.title;
    let matchingBooks = null;

    for (let key in books) {
        if (books[key].title.toLowerCase() === bookTitle.toLowerCase()) {
            matchingBooks = books[key];
            break;
        }
    }

    if (matchingBooks) {
        res.send(JSON.stringify(matchingBooks, null, 1));
    } else {
        res.status(404).json({ message: `No book found with the title: ${bookTitle}` });
    }
});

// Get book details based on title
public_users.get('/title/:title', async function (req, res) {
    const bookTitle = req.params.title;
  
    try {
      const matchingBook = await new Promise((resolve, reject) => {
        let foundBook = null;
        for (let key in books) {
          if (books[key].title.toLowerCase() === bookTitle.toLowerCase()) {
            foundBook = books[key];
            break;
          }
        }
        if (foundBook) {
          resolve(foundBook);
        } else {
          reject(new Error(`No book found with the title: ${bookTitle}`));
        }
      });
      
      return res.status(200).send(JSON.stringify(matchingBook, null, 2));
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  });
  
//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        const bookReviews = books[isbn].reviews;
        res.send(JSON.stringify(bookReviews, null, 2));
    } else {
        res.status(404).json({ message: `No book found with the ISBN: ${isbn}` });
    }
});


module.exports.general = public_users;
